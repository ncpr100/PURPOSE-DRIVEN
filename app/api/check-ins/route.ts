import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { nanoid } from 'nanoid'
import { db } from '@/lib/db'
import { createCheckInSchema } from '@/lib/validations/check-in'
import { randomUUID } from 'crypto'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// GET all check-ins for a church
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.churchId) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Sin permisos' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const isFirstTime = searchParams.get('isFirstTime')
    const eventId = searchParams.get('eventId')
    const date = searchParams.get('date')

    const skip = (page - 1) * limit

    const whereClause: any = {
      churchId: session.user.churchId
    }

    if (isFirstTime === 'true') whereClause.isFirstTime = true
    if (eventId) whereClause.eventId = eventId
    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      whereClause.checkedInAt = {
        gte: startDate,
        lt: endDate
      }
    }

    const [checkIns, total] = await db.$transaction([
      db.check_ins.findMany({
        where: whereClause,
        include: {
          events: true,
          visitor_follow_ups: {
            include: {
              users: true
            }
          }
        },
        orderBy: {
          checkedInAt: 'desc'
        },
        skip,
        take: limit,
      }),
      db.check_ins.count({ where: whereClause })
    ])

    return NextResponse.json({
      data: checkIns,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    })

  } catch (error) {
    console.error('Error fetching check-ins:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// CREATE a new check-in
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.churchId) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createCheckInSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        {
          message: 'Datos inválidos.',
          errors: validatedData.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      isFirstTime,
      visitReason,
      prayer_requests,
      eventId,
    } = validatedData.data

    // Generate QR code data
    const qrData = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const checkIn = await db.check_ins.create({
      data: {
        id: nanoid(),
        firstName,
        lastName,
        email: email || null,
        phone,
        isFirstTime: isFirstTime || false,
        visitReason,
        prayerRequest: prayer_requests,
        qrCode: qrData,
        eventId: eventId || null,
        churchId: session.user.churchId,
      },
      include: {
        events: true,
        visitor_follow_ups: true
      }
    })

    // 🔥 TRIGGER AUTOMATION for visitor check-in
    try {
      const { triggerAutomations, markAutomationTriggered } = await import('@/lib/automation-trigger-service')
      
      const triggerType = isFirstTime ? 'VISITOR_FIRST_TIME' : 'VISITOR_CHECKED_IN'
      
      const result = await triggerAutomations({
        type: triggerType,
        churchId: session.user.churchId,
        data: {
          checkInId: checkIn.id,
          qrCode: qrData,
          visitorName: `${firstName} ${lastName}`,
          visitorEmail: email,
          visitorPhone: phone,
          isFirstTime: isFirstTime || false,
          visitReason,
          prayerRequest: prayer_requests,
          eventId: eventId || undefined,
          source: 'check_in',
          timestamp: new Date()
        }
      })
      
      if (result.success && result.rulesTriggered > 0) {
        await markAutomationTriggered('check_in', checkIn.id, result.executionIds)
        console.log(`✅ Triggered ${result.rulesTriggered} automation rule(s) for ${triggerType}`)
      }
    } catch (automationError) {
      console.error('❌ Automation trigger failed for check-in:', automationError)
    }

    return NextResponse.json(checkIn, { status: 201 })

  } catch (error) {
    console.error('Error creating check-in:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

