import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const ALLOWED_ROLES = ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'CHURCH_ADMIN', 'PASTOR', 'LIDER']

const manualVisitorSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  isFirstTime: z.boolean().default(true),
  visitReason: z.string().optional(),
  prayerRequest: z.string().optional(),
  ageGroup: z.string().optional(),
  familyStatus: z.string().optional(),
  referredBy: z.string().optional(),
  ministryInterest: z.array(z.string()).optional(),
  visitorType: z.string().optional(),
  eventId: z.string().optional(),
})

// GET — fetch all visitors (CRM view) with visit count and follow-up status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    if (!ALLOWED_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    const churchId = session.user.churchId
    const { searchParams } = new URL(request.url)
    const category   = searchParams.get('category')   // FIRST_TIME | RETURNING | REGULAR etc.
    const search     = searchParams.get('search')
    const page       = parseInt(searchParams.get('page') || '1', 10)
    const limit      = parseInt(searchParams.get('limit') || '20', 10)
    const dateFrom   = searchParams.get('dateFrom')
    const dateTo     = searchParams.get('dateTo')
    const hasFollowUp = searchParams.get('hasFollowUp') // open | done | any

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = { churchId }

    if (category) {
      // Map display category to DB values
      switch (category) {
        case 'FIRST_TIME':  where.isFirstTime = true; break
        case 'RETURNING':   where.isFirstTime = false; break
        case 'REGULAR':     where.visitorType = 'REGULAR'; break
        case 'MEMBER_CANDIDATE': where.visitorType = 'MEMBER_CANDIDATE'; break
        case 'NON_MEMBER':  where.visitorType = 'NON_MEMBER'; break
      }
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName:  { contains: search, mode: 'insensitive' } },
        { email:     { contains: search, mode: 'insensitive' } },
        { phone:     { contains: search, mode: 'insensitive' } },
      ]
    }

    if (dateFrom || dateTo) {
      where.checkedInAt = {}
      if (dateFrom) where.checkedInAt.gte = new Date(dateFrom)
      if (dateTo)   where.checkedInAt.lte = new Date(dateTo + 'T23:59:59')
    }

    // Fetch visitors grouped by email (unique visitors) — latest record per person
    const [rawVisitors, total] = await db.$transaction([
      db.check_ins.findMany({
        where,
        include: {
          events: { select: { id: true, title: true } },
          visitor_follow_ups: {
            select: {
              id: true,
              followUpType: true,
              status: true,
              scheduledAt: true,
              priority: true,
              users: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
        orderBy: { checkedInAt: 'desc' },
        skip,
        take: limit,
      }),
      db.check_ins.count({ where }),
    ])

    // Enrich each visitor: compute visit count from same email
    const visitors = await Promise.all(
      rawVisitors.map(async (v) => {
        const visitCount = v.email
          ? await db.check_ins.count({
              where: { email: v.email, churchId },
            })
          : 1

        // Derive display category
        let displayCategory = 'SIN CATEGORÍA'
        if (v.visitorType === 'MEMBER_CANDIDATE') displayCategory = 'CANDIDATO A MIEMBRO'
        else if (v.visitorType === 'REGULAR')     displayCategory = 'REGULAR'
        else if (v.isFirstTime)                   displayCategory = 'PRIMERA VEZ'
        else if (visitCount >= 3)                 displayCategory = 'REGULAR'
        else                                      displayCategory = 'REGRESÓ'

        const openFollowUps   = v.visitor_follow_ups.filter(f => f.status === 'PENDIENTE' || f.status === 'pending').length
        const closedFollowUps = v.visitor_follow_ups.filter(f => f.status === 'COMPLETADO' || f.status === 'completed').length

        return {
          ...v,
          visitCount,
          displayCategory,
          openFollowUps,
          closedFollowUps,
        }
      })
    )

    // Filter by hasFollowUp if requested
    const filteredVisitors = hasFollowUp
      ? visitors.filter(v =>
          hasFollowUp === 'open'  ? v.openFollowUps > 0  :
          hasFollowUp === 'done'  ? v.openFollowUps === 0 && v.closedFollowUps > 0 :
          true
        )
      : visitors

    return NextResponse.json({
      data: filteredVisitors,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('[GET /api/visitors] error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// POST — manual visitor entry (backup to QR form)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    if (!ALLOWED_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    const churchId = session.user.churchId
    const body = await request.json()
    const parsed = manualVisitorSchema.parse(body)

    // Determine visit count for auto-categorization
    const previousVisits = parsed.email
      ? await db.check_ins.count({
          where: { email: parsed.email, churchId },
        })
      : 0

    let autoVisitorType = parsed.visitorType || 'FIRST_TIME'
    if (!parsed.visitorType) {
      if (previousVisits === 0) autoVisitorType = 'FIRST_TIME'
      else if (previousVisits < 3) autoVisitorType = 'RETURNING'
      else autoVisitorType = 'REGULAR'
    }

    const visitor = await db.check_ins.create({
      data: {
        id: nanoid(),
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        email: parsed.email || null,
        phone: parsed.phone || null,
        isFirstTime: previousVisits === 0,
        visitReason: parsed.visitReason || null,
        prayerRequest: parsed.prayerRequest || null,
        ageGroup: parsed.ageGroup || null,
        familyStatus: parsed.familyStatus || null,
        referredBy: parsed.referredBy || null,
        ministryInterest: parsed.ministryInterest || [],
        visitorType: autoVisitorType,
        eventId: parsed.eventId || null,
        churchId,
        checkedInAt: new Date(),
        engagementScore: 80,
        automationTriggered: false,
      },
    })

    // Auto-create follow-up task for first-time visitors
    if (previousVisits === 0) {
      await db.visitor_follow_ups.create({
        data: {
          id: nanoid(),
          checkInId: visitor.id,
          followUpType: 'first_time_visitor',
          priority: 'high',
          status: 'PENDIENTE',
          scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          notes: `Primer visita registrada manualmente. Nombre: ${parsed.firstName} ${parsed.lastName}${parsed.email ? '. Email: ' + parsed.email : ''}${parsed.phone ? '. Tel: ' + parsed.phone : ''}`,
          churchId,
        },
      })
    }

    // Trigger automation
    try {
      const { VisitorAutomationService } = await import('@/lib/services/visitor-automation')
      await VisitorAutomationService.processVisitor(visitor.id)
      await db.check_ins.update({
        where: { id: visitor.id },
        data: { automationTriggered: true },
      })
    } catch (automationErr) {
      console.error('[POST /api/visitors] automation failed (non-blocking):', automationErr)
    }

    return NextResponse.json({ success: true, visitor }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos', details: error.errors }, { status: 400 })
    }
    console.error('[POST /api/visitors] error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// PATCH — update visitor category / notes (manual override by staff)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    if (!ALLOWED_ROLES.includes(session.user.role)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    const churchId = session.user.churchId
    const body = await request.json()
    const { id, visitorType, ministryInterest, engagementScore, notes } = body

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    }

    // Verify ownership
    const existing = await db.check_ins.findFirst({ where: { id, churchId } })
    if (!existing) {
      return NextResponse.json({ error: 'Visitante no encontrado' }, { status: 404 })
    }

    const updated = await db.check_ins.update({
      where: { id },
      data: {
        ...(visitorType      !== undefined && { visitorType }),
        ...(ministryInterest !== undefined && { ministryInterest }),
        ...(engagementScore  !== undefined && { engagementScore }),
        ...(notes            !== undefined && { visitReason: notes }),
      },
    })

    return NextResponse.json({ success: true, visitor: updated })
  } catch (error) {
    console.error('[PATCH /api/visitors] error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
