import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { createCheckInSchema } from '@/lib/validations/check-in'
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
      db.checkIn.findMany({
        where: whereClause,
        include: {
          event: true,
          followUps: {
            include: {
              assignedUser: true
            }
          }
        },
        orderBy: {
          checkedInAt: 'desc'
        },
        skip,
        take: limit,
      }),
      db.checkIn.count({ where: whereClause })
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
      prayerRequest,
      eventId,
    } = validatedData.data

    // Generate QR code data
    const qrData = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const checkIn = await db.checkIn.create({
      data: {
        firstName,
        lastName,
        email: email || null,
        phone,
        isFirstTime: isFirstTime || false,
        visitReason,
        prayerRequest,
        qrCode: qrData,
        eventId,
        churchId: session.user.churchId,
      },
      include: {
        event: true,
        followUps: true
      }
    })

    // If it's a first-time visitor, create automatic follow-up tasks
    if (isFirstTime) {
      await db.visitorFollowUp.create({
        data: {
          checkInId: checkIn.id,
          followUpType: 'EMAIL',
          status: 'PENDIENTE',
          scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours later
          notes: 'Email de bienvenida automático',
          churchId: session.user.churchId
        }
      })

      await db.visitorFollowUp.create({
        data: {
          checkInId: checkIn.id,
          followUpType: 'LLAMADA',
          status: 'PENDIENTE',
          scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days later
          notes: 'Llamada de seguimiento para visitante por primera vez',
          churchId: session.user.churchId
        }
      })
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

