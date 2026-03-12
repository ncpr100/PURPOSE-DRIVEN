import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json(
        { error: 'Unauthorized - No church ID found' },
        { status: 401 }
      )
    }

    const { eventId, newDate, newTime } = await request.json()

    if (!eventId || !newDate) {
      return NextResponse.json(
        { error: 'Missing required fields: eventId, newDate' },
        { status: 400 }
      )
    }

    // Verify event belongs to church
    const existingEvent = await db.events.findFirst({
      where: { 
        id: eventId,
        churchId: session.user.churchId 
      }
    })

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found or access denied' },
        { status: 404 }
      )
    }

    // Parse new date and preserve original time if not specified
    const targetDate = new Date(newDate)
    const originalStart = new Date(existingEvent.startDate)
    const originalEnd = existingEvent.endDate ? new Date(existingEvent.endDate) : null

    let newStartDate: Date
    let newEndDate: Date | null = null

    if (newTime) {
      // Use provided time
      const [hours, minutes] = newTime.split(':').map(Number)
      newStartDate = new Date(targetDate)
      newStartDate.setHours(hours, minutes, 0, 0)
    } else {
      // Preserve original time
      newStartDate = new Date(targetDate)
      newStartDate.setHours(
        originalStart.getHours(),
        originalStart.getMinutes(),
        originalStart.getSeconds(),
        originalStart.getMilliseconds()
      )
    }

    // Calculate new end date if original had one
    if (originalEnd) {
      const duration = originalEnd.getTime() - originalStart.getTime()
      newEndDate = new Date(newStartDate.getTime() + duration)
    }

    // Update the event
    const updatedEvent = await db.events.update({
      where: { id: eventId },
      data: {
        startDate: newStartDate,
        endDate: newEndDate,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ 
      success: true, 
      event: updatedEvent,
      message: 'Evento movido exitosamente'
    })

  } catch (error) {
    console.error('Error moving event:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Get event conflicts
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { date, excludeEventId, startTime, endTime } = await request.json()

    if (!date) {
      return NextResponse.json(
        { error: 'Missing date parameter' },
        { status: 400 }
      )
    }

    // Check for conflicts on the target date
    const targetDate = new Date(date)
    const startOfDay = new Date(targetDate)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(targetDate)
    endOfDay.setHours(23, 59, 59, 999)

    let conflictConditions: any = {
      churchId: session.user.churchId,
      OR: [
        {
          // Events that start on this day
          startDate: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        {
          // Events that end on this day
          endDate: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        {
          // Events that span this day
          AND: [
            { startDate: { lte: startOfDay } },
            { endDate: { gte: endOfDay } }
          ]
        }
      ]
    }

    // Exclude the event being moved
    if (excludeEventId) {
      conflictConditions.NOT = {
        id: excludeEventId
      }
    }

    // If specific time range provided, check time conflicts
    if (startTime && endTime) {
      const [startHours, startMinutes] = startTime.split(':').map(Number)
      const [endHours, endMinutes] = endTime.split(':').map(Number)
      
      const proposedStart = new Date(targetDate)
      proposedStart.setHours(startHours, startMinutes, 0, 0)
      
      const proposedEnd = new Date(targetDate)
      proposedEnd.setHours(endHours, endMinutes, 0, 0)

      // Add time overlap conditions
      conflictConditions.OR.push({
        AND: [
          { startDate: { lt: proposedEnd } },
          { 
            OR: [
              { endDate: { gt: proposedStart } },
              { endDate: null } // All-day events
            ]
          }
        ]
      })
    }

    const conflicts = await db.events.findMany({
      where: conflictConditions,
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        location: true,
        category: true
      },
      orderBy: {
        startDate: 'asc'
      }
    })

    return NextResponse.json({ 
      conflicts,
      hasConflicts: conflicts.length > 0,
      message: conflicts.length > 0 
        ? `Se encontraron ${conflicts.length} conflicto(s) potencial(es)`
        : 'No hay conflictos en esta fecha'
    })

  } catch (error) {
    console.error('Error checking conflicts:', error)
    return NextResponse.json(
      { error: 'Error checking conflicts' },
      { status: 500 }
    )
  }
}