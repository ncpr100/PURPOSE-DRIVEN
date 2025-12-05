
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string
  }
}

// GET - Get specific notification
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await prisma.users.findUnique({
      where: { email: session.user.email },
      select: { id: true, churchId: true, role: true }
    })

    if (!user || !user.churchId) {
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 400 })
    }

    const notification = await prisma.notifications.findFirst({
      where: {
        id: params.id,
        churchId: user.churchId,
        OR: [
          { isGlobal: true },
          { targetUser: user.id },
          { targetRole: user.role },
        ]
      },
      include: {
        churches: {
          select: { name: true }
        }
      }
    })

    if (!notification) {
      return NextResponse.json({ error: 'Notificación no encontrada' }, { status: 404 })
    }

    return NextResponse.json(notification)
  } catch (error) {
    console.error('Error fetching notification:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Mark specific notification as read
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await prisma.users.findUnique({
      where: { email: session.user.email },
      select: { id: true, churchId: true, role: true }
    })

    if (!user || !user.churchId) {
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 400 })
    }

    // Verify user has access to this notification
    const notification = await prisma.notifications.findFirst({
      where: {
        id: params.id,
        churchId: user.churchId,
        OR: [
          { isGlobal: true },
          { targetUser: user.id },
          { targetRole: user.role },
        ]
      }
    })

    if (!notification) {
      return NextResponse.json({ error: 'Notificación no encontrada' }, { status: 404 })
    }

    const updatedDelivery = await prisma.notification_deliveries.updateMany({
      where: {
        notificationId: params.id,
        userId: user.id,
        notification: {
          churchId: user.churchId
        }
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    })

    if (updatedDelivery.count === 0) {
      return NextResponse.json({ error: 'Notificación no encontrada o sin permisos' }, { status: 404 })
    }

    // Return the notification with updated delivery status
    const updatedNotification = await prisma.notifications.findUnique({
      where: { id: params.id },
      include: {
        churches: { select: { name: true } },
        deliveries: {
          where: { userId: user.id },
          select: {
            isRead: true,
            readAt: true,
            deliveryStatus: true
          }
        }
      }
    })

    return NextResponse.json({
      ...updatedNotification,
      isRead: updatedNotification?.deliveries[0]?.isRead || false,
      readAt: updatedNotification?.deliveries[0]?.readAt
    })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Delete notification (Admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await prisma.users.findUnique({
      where: { email: session.user.email },
      select: { id: true, churchId: true, role: true }
    })

    if (!user || !user.churchId) {
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 400 })
    }

    // Check if user has permission to delete notifications
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(user.role)) {
      return NextResponse.json({ error: 'Sin permisos para eliminar notificaciones' }, { status: 403 })
    }

    // Verify notification belongs to user's church
    const notification = await prisma.notifications.findFirst({
      where: {
        id: params.id,
        churchId: user.churchId
      }
    })

    if (!notification) {
      return NextResponse.json({ error: 'Notificación no encontrada' }, { status: 404 })
    }

    await prisma.notifications.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
