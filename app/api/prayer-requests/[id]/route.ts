
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/prayer-requests/[id] - Get single prayer request
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

    const prayer_requests = await prisma.prayer_requests.findFirst({
      where: {
        id: params.id,
        churchId: user.churchId
      },
      include: {
        contact: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
            preferredContact: true,
            source: true,
            createdAt: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            description: true,
            icon: true,
            color: true
          }
        },
        approval: {
          include: {
            approver: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    if (!prayer_requests) {
      return NextResponse.json({ error: 'Petición no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ request: prayer_requests })
  } catch (error) {
    console.error('Error fetching prayer request:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// PUT /api/prayer-requests/[id] - Update prayer request status
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

    // Check user permissions (PASTOR or above)
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(user.role)) {
      return NextResponse.json({ error: 'Sin permisos suficientes' }, { status: 403 })
    }

    const body = await request.json()
    const { status, priority, scheduledAt, notes } = body

    const prayer_requests = await prisma.prayer_requests.findFirst({
      where: {
        id: params.id,
        churchId: user.churchId
      }
    })

    if (!prayer_requests) {
      return NextResponse.json({ error: 'Petición no encontrada' }, { status: 404 })
    }

    const updatedRequest = await prisma.prayer_requests.update({
      where: { id: params.id },
      data: {
        status: status || prayer_requests.status,
        priority: priority || prayer_requests.priority
      }
    })

    // Update approval if notes provided
    if (notes) {
      await prisma.prayer_approvals.updateMany({
        where: {
          requestId: params.id,
          churchId: user.churchId
        },
        data: {
          notes: notes.trim(),
          approvedBy: user.id
        }
      })
    }

    return NextResponse.json({ request: updatedRequest })
  } catch (error) {
    console.error('Error updating prayer request:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// DELETE /api/prayer-requests/[id] - Delete prayer request
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

    const prayer_requests = await prisma.prayer_requests.findFirst({
      where: {
        id: params.id,
        churchId: user.churchId
      }
    })

    if (!prayer_requests) {
      return NextResponse.json({ error: 'Petición no encontrada' }, { status: 404 })
    }

    await prisma.prayer_requests.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Petición eliminada' })
  } catch (error) {
    console.error('Error deleting prayer request:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
