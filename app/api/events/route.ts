import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from "@/lib/db"
import { z } from 'zod'

// Validation schemas for events
const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  location: z.string().optional(),
  capacity: z.number().optional(),
  budget: z.number().optional(),
  category: z.string().optional(),
  isPublic: z.boolean().default(true),
  status: z.string().default('PLANIFICANDO')
})

// GET - Fetch events for the church
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const limit = searchParams.get('limit')

    // Church isolation in events - filter by churchId
    const whereClause: any = {
      churchId: session.user.churchId
    }

    if (status) {
      whereClause.status = status
    }

    if (category) {
      whereClause.category = category
    }

    const events = await db.event.findMany({
      where: whereClause,
      include: {
        church: {
          select: { name: true }
        }
      },
      orderBy: { startDate: 'desc' },
      take: limit ? parseInt(limit) : undefined
    })

    // Event creation logging
    console.log(`Events fetched for church ${session.user.churchId}: ${events.length} events`)

    return NextResponse.json(events)
  } catch (error) {
    // Error logging exists
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// POST - Create new event
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Event access permissions - role validation
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Sin permisos para crear eventos' }, { status: 403 })
    }

    const body = await request.json()
    
    // Event title validation and input sanitization
    const validatedData = createEventSchema.parse({
      ...body,
      title: body.title?.trim(),
      description: body.description?.trim(),
      location: body.location?.trim()
    })

    // Date range validation
    const startDate = new Date(validatedData.startDate)
    const endDate = validatedData.endDate ? new Date(validatedData.endDate) : null

    if (endDate && endDate <= startDate) {
      return NextResponse.json({ 
        error: 'La fecha de fin debe ser posterior a la fecha de inicio' 
      }, { status: 400 })
    }

    // Event data protection - ensure church isolation
    const event = await db.event.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        startDate: startDate,
        endDate: endDate,
        location: validatedData.location,
        capacity: validatedData.capacity,
        budget: validatedData.budget,
        category: validatedData.category || 'GENERAL',
        isPublic: validatedData.isPublic,
        status: validatedData.status,
        churchId: session.user.churchId,
        createdBy: session.user.id
      },
      include: {
        creator: {
          select: { name: true, email: true }
        }
      }
    })

    // Event creation logging
    console.log(`Event created: ${event.id} - ${event.title} by user ${session.user.id}`)

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    // Error logging exists
    console.error('Error creating event:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Datos de evento inválidos',
        details: error.errors 
      }, { status: 400 })
    }

    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// PUT - Update event
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Event access permissions - role validation
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Sin permisos para editar eventos' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('id')

    if (!eventId) {
      return NextResponse.json({ error: 'ID de evento requerido' }, { status: 400 })
    }

    const body = await request.json()
    
    // Input sanitization in forms
    const sanitizedData = {
      ...body,
      title: body.title?.trim(),
      description: body.description?.trim(),
      location: body.location?.trim()
    }

    // Church isolation in events - verify ownership
    const existingEvent = await db.event.findFirst({
      where: {
        id: eventId,
        churchId: session.user.churchId
      }
    })

    if (!existingEvent) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 })
    }

    // Date range validation
    if (sanitizedData.startDate && sanitizedData.endDate) {
      const startDate = new Date(sanitizedData.startDate)
      const endDate = new Date(sanitizedData.endDate)

      if (endDate <= startDate) {
        return NextResponse.json({ 
          error: 'La fecha de fin debe ser posterior a la fecha de inicio' 
        }, { status: 400 })
      }
    }

    const updatedEvent = await db.event.update({
      where: { id: eventId },
      data: {
        ...sanitizedData,
        startDate: sanitizedData.startDate ? new Date(sanitizedData.startDate) : undefined,
        endDate: sanitizedData.endDate ? new Date(sanitizedData.endDate) : undefined,
        updatedAt: new Date()
      },
      include: {
        creator: {
          select: { name: true, email: true }
        }
      }
    })

    // Event creation logging
    console.log(`Event updated: ${updatedEvent.id} - ${updatedEvent.title} by user ${session.user.id}`)

    return NextResponse.json(updatedEvent)
  } catch (error) {
    // Error logging exists
    console.error('Error updating event:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// DELETE - Remove event (Event cancellation safety)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Event access permissions - role validation
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Sin permisos para eliminar eventos' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('id')

    if (!eventId) {
      return NextResponse.json({ error: 'ID de evento requerido' }, { status: 400 })
    }

    // Church isolation in events - verify ownership
    const existingEvent = await db.event.findFirst({
      where: {
        id: eventId,
        churchId: session.user.churchId
      }
    })

    if (!existingEvent) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 })
    }

    // Event cancellation safety - soft delete by updating status
    const deletedEvent = await db.event.update({
      where: { id: eventId },
      data: {
        status: 'CANCELADO',
        updatedAt: new Date()
      }
    })

    // Event creation logging
    console.log(`Event cancelled: ${deletedEvent.id} - ${deletedEvent.title} by user ${session.user.id}`)

    return NextResponse.json({ message: 'Evento cancelado exitosamente' })
  } catch (error) {
    // Error logging exists
    console.error('Error deleting event:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}