
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { volunteer_assignmentsSchema } from '@/lib/validations/volunteer'
import { ZodError } from 'zod'

export const dynamic = 'force-dynamic'

// GET all volunteer assignments for a church
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.churchId) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const volunteerId = searchParams.get('volunteerId')
    const eventId = searchParams.get('eventId')
    const status = searchParams.get('status')

    const whereClause: any = {
      churchId: session.user.churchId
    }

    if (volunteerId) whereClause.volunteerId = volunteerId
    if (eventId) whereClause.eventId = eventId
    if (status) whereClause.status = status

    const assignments = await db.volunteer_assignments.findMany({
      where: whereClause,
      include: {
        volunteers: true,
        events: true
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json(assignments)

  } catch (error) {
    console.error('Error fetching volunteer assignments:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// CREATE a new volunteer assignment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.churchId) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Sin permisos' }, { status: 403 })
    }

    // Parse and validate request body
    const body = await request.json()
    
    // ✅ SECURITY FIX: Validate all assignment data with Zod
    // Prevents: Invalid dates, malformed times, XSS attacks
    const validated = volunteer_assignmentsSchema.parse(body)

    // Verify volunteer belongs to the church
    const volunteer = await db.volunteers.findFirst({
      where: {
        id: validated.volunteerId,
        churchId: session.user.churchId
      }
    })

    if (!volunteer) {
      return NextResponse.json(
        { message: 'Voluntario no encontrado' },
        { status: 404 }
      )
    }

    // ✅ BUSINESS LOGIC FIX: Check for scheduling conflicts
    // Prevents: Double-booking volunteers at the same time
    const assignmentDate = new Date(validated.date)
    const conflicts = await db.volunteer_assignments.findMany({
      where: {
        volunteerId: validated.volunteerId,
        date: assignmentDate,
        status: { in: ['ASIGNADO', 'CONFIRMADO'] },
        OR: [
          // New assignment starts during existing
          {
            AND: [
              { startTime: { lte: validated.startTime } },
              { endTime: { gt: validated.startTime } }
            ]
          },
          // New assignment ends during existing
          {
            AND: [
              { startTime: { lt: validated.endTime } },
              { endTime: { gte: validated.endTime } }
            ]
          },
          // New assignment encompasses existing
          {
            AND: [
              { startTime: { gte: validated.startTime } },
              { endTime: { lte: validated.endTime } }
            ]
          }
        ]
      }
    })

    if (conflicts.length > 0) {
      return NextResponse.json(
        { 
          message: 'Conflicto de horario detectado',
          conflicts: conflicts.map(c => ({
            id: c.id,
            title: c.title,
            date: c.date,
            time: `${c.startTime} - ${c.endTime}`
          }))
        },
        { status: 409 }
      )
    }

    // ✅ No conflicts - proceed with creation
    const assignment = await db.volunteer_assignments.create({
      data: {
        volunteerId: validated.volunteerId,
        eventId: validated.eventId || null,
        title: validated.title,
        description: validated.description,
        date: assignmentDate,
        startTime: validated.startTime,
        endTime: validated.endTime,
        notes: validated.notes,
        churchId: session.user.churchId,
        status: 'ASIGNADO'
      },
      include: {
        volunteers: true,
        events: true
      }
    })

    return NextResponse.json(assignment, { status: 201 })

  } catch (error) {
    // ✅ SECURITY FIX: Handle validation errors with user-friendly messages
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          message: 'Datos inválidos',
          errors: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      )
    }
    
    console.error('Error creating volunteer assignment:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

