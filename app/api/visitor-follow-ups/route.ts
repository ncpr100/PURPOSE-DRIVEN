

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'

export const dynamic = 'force-dynamic'

// GET all visitor follow-ups for a church
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
    const status = searchParams.get('status')
    const followUpType = searchParams.get('followUpType')
    const assignedTo = searchParams.get('assignedTo')

    const whereClause: any = {
      churchId: session.user.churchId
    }

    if (status) whereClause.status = status
    if (followUpType) whereClause.followUpType = followUpType
    if (assignedTo) whereClause.assignedTo = assignedTo

    const followUps = await db.visitor_follow_ups.findMany({
      where: whereClause,
      include: {
        check_ins: true,
        users: true
      },
      orderBy: {
        scheduledAt: 'asc'
      }
    })

    // Transform the data to match client expectations
    const transformedFollowUps = followUps.map(followUp => ({
      id: followUp.id,
      followUpType: followUp.followUpType,
      status: followUp.status,
      scheduledAt: followUp.scheduledAt,
      completedAt: followUp.completedAt,
      notes: followUp.notes,
      checkIn: followUp.check_ins ? {
        firstName: followUp.check_ins.firstName || '',
        lastName: followUp.check_ins.lastName || '',
        email: followUp.check_ins.email,
        phone: followUp.check_ins.phone,
        isFirstTime: followUp.check_ins.isFirstTime || false
      } : {
        firstName: '',
        lastName: '',
        email: null,
        phone: null,
        isFirstTime: false
      },
      assignedUser: followUp.users ? {
        name: followUp.users.name || ''
      } : null
    }))

    return NextResponse.json(transformedFollowUps)

  } catch (error) {
    console.error('Error fetching visitor follow-ups:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// CREATE a new visitor follow-up
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.churchId) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Sin permisos' }, { status: 403 })
    }

    const {
      checkInId,
      followUpType,
      scheduledAt,
      notes,
      assignedTo
    } = await request.json()

    if (!checkInId || !followUpType) {
      return NextResponse.json(
        { message: 'CheckIn ID y tipo de seguimiento son requeridos' },
        { status: 400 }
      )
    }

    // Verify checkIn belongs to the church
    const checkIn = await db.check_ins.findFirst({
      where: {
        id: checkInId,
        churchId: session.user.churchId
      }
    })

    if (!checkIn) {
      return NextResponse.json(
        { message: 'Check-in no encontrado' },
        { status: 404 }
      )
    }

    const followUp = await db.visitor_follow_ups.create({
      data: {
        id: nanoid(),
        checkInId,
        followUpType,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        notes,
        assignedTo,
        churchId: session.user.churchId,
        status: 'PENDIENTE'
      },
      include: {
        check_ins: true,
        users: true
      }
    })

    // Transform the data to match client expectations
    const transformedFollowUp = {
      id: followUp.id,
      followUpType: followUp.followUpType,
      status: followUp.status,
      scheduledAt: followUp.scheduledAt,
      completedAt: followUp.completedAt,
      notes: followUp.notes,
      checkIn: followUp.check_ins ? {
        firstName: followUp.check_ins.firstName || '',
        lastName: followUp.check_ins.lastName || '',
        email: followUp.check_ins.email,
        phone: followUp.check_ins.phone,
        isFirstTime: followUp.check_ins.isFirstTime || false
      } : {
        firstName: '',
        lastName: '',
        email: null,
        phone: null,
        isFirstTime: false
      },
      assignedUser: followUp.users ? {
        name: followUp.users.name || ''
      } : null
    }

    return NextResponse.json(transformedFollowUp, { status: 201 })

  } catch (error) {
    console.error('Error creating visitor follow-up:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

