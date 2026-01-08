import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// PUT - Update event by ID (dynamic route)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Sin permisos para editar eventos' }, { status: 403 })
    }

    const eventId = params.id
    const body = await request.json()
    
    // Sanitize input data
    const sanitizedData = {
      ...body,
      title: body.title?.trim(),
      description: body.description?.trim(),
      location: body.location?.trim()
    }

    // Verify event ownership (church isolation)
    const existingEvent = await db.events.findFirst({
      where: {
        id: eventId,
        churchId: session.user.churchId
      }
    })

    if (!existingEvent) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 })
    }

    // Date validation
    if (sanitizedData.startDate && sanitizedData.endDate) {
      const startDate = new Date(sanitizedData.startDate)
      const endDate = new Date(sanitizedData.endDate)

      if (endDate <= startDate) {
        return NextResponse.json({ 
          error: 'La fecha de fin debe ser posterior a la fecha de inicio' 
        }, { status: 400 })
      }
    }

    const updatedEvent = await db.events.update({
      where: { id: eventId },
      data: {
        title: sanitizedData.title,
        description: sanitizedData.description,
        category: sanitizedData.category,
        startDate: sanitizedData.startDate ? new Date(sanitizedData.startDate) : undefined,
        endDate: sanitizedData.endDate ? new Date(sanitizedData.endDate) : undefined,
        location: sanitizedData.location,
        budget: sanitizedData.budget,
        isPublic: sanitizedData.isPublic,
        updatedAt: new Date()
      },
      include: {
        churches: { select: { name: true } },
        users: { select: { name: true, email: true } }
      }
    })

    console.log(`✅ Event updated: ${updatedEvent.id} - ${updatedEvent.title} by user ${session.user.id}`)

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// DELETE - Soft delete event (set status to CANCELADO)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Sin permisos para eliminar eventos' }, { status: 403 })
    }

    const eventId = params.id

    // Verify event ownership
    const existingEvent = await db.events.findFirst({
      where: {
        id: eventId,
        churchId: session.user.churchId
      }
    })

    if (!existingEvent) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 })
    }

    // Soft delete by marking as cancelled
    const deletedEvent = await db.events.update({
      where: { id: eventId },
      data: {
        status: 'CANCELADO',
        updatedAt: new Date()
      }
    })

    console.log(`🗑️ Event cancelled: ${deletedEvent.id} - ${deletedEvent.title} by user ${session.user.id}`)

    return NextResponse.json({ success: true, message: 'Evento cancelado exitosamente' })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// GET - Get single event details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const eventId = params.id

    const event = await db.events.findFirst({
      where: {
        id: eventId,
        churchId: session.user.churchId
      },
      include: {
        churches: { select: { name: true } },
        users: { select: { name: true, email: true } },
        check_ins: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            isFirstTime: true,
            checkedInAt: true
          }
        },
        children_check_ins: {
          select: {
            id: true,
            childName: true,
            childAge: true,
            parentName: true,
            parentPhone: true,
            checkedInAt: true
          }
        },
        volunteer_assignments: {
          include: {
            volunteers: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    })

    if (!event) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
