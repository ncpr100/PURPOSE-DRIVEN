
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/prayer-contacts/[id] - Get single prayer contact
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await prisma.users.findUnique({
      where: { id: session.user.id }
    })

    if (!user?.churchId) {
      return NextResponse.json({ error: 'Iglesia no encontrada' }, { status: 404 })
    }

    const contact = await prisma.prayer_contacts.findFirst({
      where: {
        id: params.id,
        churchId: user.churchId
      },
      include: {
        prayer_requests: {
          include: {
            prayer_categories: {
              select: {
                id: true,
                name: true,
                icon: true,
                color: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            prayer_requests: true
          }
        }
      }
    })

    if (!contact) {
      return NextResponse.json({ error: 'Contacto no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ contact })
  } catch (error) {
    console.error('Error fetching prayer contact:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// PUT /api/prayer-contacts/[id] - Update prayer contact
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await prisma.users.findUnique({
      where: { id: session.user.id }
    })

    if (!user?.churchId) {
      return NextResponse.json({ error: 'Iglesia no encontrada' }, { status: 404 })
    }

    // Check user permissions (LIDER or above)
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'].includes(user.role)) {
      return NextResponse.json({ error: 'Sin permisos suficientes' }, { status: 403 })
    }

    const body = await request.json()
    const { fullName, phone, email, preferredContact } = body

    const contact = await prisma.prayer_contacts.findFirst({
      where: {
        id: params.id,
        churchId: user.churchId
      }
    })

    if (!contact) {
      return NextResponse.json({ error: 'Contacto no encontrado' }, { status: 404 })
    }

    // Check for duplicates if phone/email changed
    if (phone || email) {
      const existing = await prisma.prayer_contacts.findFirst({
        where: {
          churchId: user.churchId,
          id: { not: params.id },
          OR: [
            ...(phone && phone !== contact.phone ? [{ phone: phone.trim() }] : []),
            ...(email && email !== contact.email ? [{ email: email.trim().toLowerCase() }] : [])
          ]
        }
      })

      if (existing) {
        return NextResponse.json({ 
          error: 'Ya existe un contacto con ese teléfono o email' 
        }, { status: 409 })
      }
    }

    const updatedContact = await prisma.prayer_contacts.update({
      where: { id: params.id },
      data: {
        fullName: fullName?.trim() || contact.fullName,
        phone: phone?.trim(),
        email: email?.trim().toLowerCase(),
        preferredContact: preferredContact || contact.preferredContact
      }
    })

    return NextResponse.json({ contact: updatedContact })
  } catch (error) {
    console.error('Error updating prayer contact:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// DELETE /api/prayer-contacts/[id] - Delete prayer contact
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await prisma.users.findUnique({
      where: { id: session.user.id }
    })

    if (!user?.churchId) {
      return NextResponse.json({ error: 'Iglesia no encontrada' }, { status: 404 })
    }

    // Check user permissions (PASTOR or above)
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(user.role)) {
      return NextResponse.json({ error: 'Sin permisos suficientes' }, { status: 403 })
    }

    const contact = await prisma.prayer_contacts.findFirst({
      where: {
        id: params.id,
        churchId: user.churchId
      }
    })

    if (!contact) {
      return NextResponse.json({ error: 'Contacto no encontrado' }, { status: 404 })
    }

    // Check if contact has prayer requests
    const requestCount = await prisma.prayer_requests.count({
      where: { contactId: params.id }
    })

    if (requestCount > 0) {
      return NextResponse.json({ 
        error: 'No se puede eliminar. El contacto tiene peticiones asociadas' 
      }, { status: 409 })
    }

    await prisma.prayer_contacts.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Contacto eliminado' })
  } catch (error) {
    console.error('Error deleting prayer contact:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
