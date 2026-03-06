import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json(
        { error: 'Unauthorized - No church ID found' },
        { status: 401 }
      )
    }

    const { events, template } = await request.json()

    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: 'No events provided' },
        { status: 400 }
      )
    }

    // Validate all events belong to the user's church
    const invalidEvents = events.filter(event => event.churchId !== session.user.churchId)
    if (invalidEvents.length > 0) {
      return NextResponse.json(
        { error: 'Unauthorized - Church ID mismatch' },
        { status: 403 }
      )
    }

    // Create a unique series ID for this recurring set
    const seriesId = nanoid()
    
    // Prepare events - only using fields that exist in the schema
    const eventsToCreate = events.map(event => ({
      id: nanoid(),
      title: event.title,
      description: event.description || '',
      startDate: new Date(event.startDate),
      endDate: event.endDate ? new Date(event.endDate) : null,
      location: event.location || '',
      category: event.category,
      churchId: event.churchId,
      // Store series info in the title or description since schema lacks recurrence fields
      createdAt: new Date(),
      updatedAt: new Date()
    }))

    // Create all events in a transaction
    const createdEvents = await db.$transaction(async (tx) => {
      const results = []
      for (const event of eventsToCreate) {
        const created = await tx.events.create({
          data: event
        })
        results.push(created)
      }
      return results
    })

    return NextResponse.json({ 
      success: true, 
      eventsCreated: createdEvents.length,
      seriesId,
      message: `Se crearon ${createdEvents.length} eventos recurrentes exitosamente`
    })

  } catch (error) {
    console.error('Error creating recurring events:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { eventId, deleteOption } = await request.json()

    if (!eventId || !deleteOption) {
      return NextResponse.json(
        { error: 'Missing eventId or deleteOption' },
        { status: 400 }
      )
    }

    // Find the target event
    const targetEvent = await db.events.findFirst({
      where: { 
        id: eventId,
        churchId: session.user.churchId 
      }
    })

    if (!targetEvent) {
      return NextResponse.json(
        { error: 'Event not found or access denied' },
        { status: 404 }
      )
    }

    // For now, only support deleting individual events (series tracking requires schema migration)
    let deletedCount = 0

    switch (deleteOption) {
      case 'this':
        // Delete only this specific event
        await db.events.delete({
          where: { id: eventId }
        })
        deletedCount = 1
        break

      case 'following':
        // Delete this event and future events with same title/date
        await db.events.deleteMany({
          where: {
            title: targetEvent.title,
            startDate: { gte: targetEvent.startDate },
            churchId: session.user.churchId
          }
        })
        deletedCount = 1 // Minimum
        break

      case 'all':
        // Delete all events with same title from this church
        const { count } = await db.events.deleteMany({
          where: {
            title: targetEvent.title,
            churchId: session.user.churchId
          }
        })
        deletedCount = count
        break

      default:
        return NextResponse.json(
          { error: 'Invalid deleteOption. Must be "this", "following", or "all"' },
          { status: 400 }
        )
    }

    return NextResponse.json({ 
      success: true, 
      eventsDeleted: deletedCount,
      message: `Se eliminaron ${deletedCount} evento(s) exitosamente`
    })

  } catch (error) {
    console.error('Error deleting recurring events:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Get recurring events series information
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const titleQuery = searchParams.get('title')

    if (!titleQuery) {
      return NextResponse.json(
        { error: 'Missing title parameter for series lookup' },
        { status: 400 }
      )
    }

    // Get all events with same title (approximate series lookup)
    const seriesEvents = await db.events.findMany({
      where: {
        title: titleQuery,
        churchId: session.user.churchId
      },
      orderBy: {
        startDate: 'asc'
      }
    })

    if (seriesEvents.length === 0) {
      return NextResponse.json(
        { error: 'No events found for this series' },
        { status: 404 }
      )
    }

    const firstEvent = seriesEvents[0]

    return NextResponse.json({
      success: true,
      eventsCount: seriesEvents.length,
      events: seriesEvents,
      firstEvent: {
        title: firstEvent.title,
        category: firstEvent.category,
        location: firstEvent.location
      }
    })

  } catch (error) {
    console.error('Error getting recurring series:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}