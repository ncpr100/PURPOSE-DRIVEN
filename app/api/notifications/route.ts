
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'
import { z } from 'zod'

const notificationSchema = z.object({
  title: z.string().min(1, 'Título es requerido'),
  message: z.string().min(1, 'Mensaje es requerido'),
  type: z.enum(['INFO', 'WARNING', 'SUCCESS', 'ERROR']),
  targetRole: z.string().optional(),
  targetUser: z.string().optional(),
  isGlobal: z.boolean().default(false),
})

// GET - Get notifications for current user
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const sentOnly = searchParams.get('sentOnly') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search')
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const priority = searchParams.get('priority')

    if (sentOnly) {
      // For sent notifications - only show notifications created by this user
      const whereClause = {
        churchId: user.churchId,
        createdBy: user.id,
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' as any } },
            { message: { contains: search, mode: 'insensitive' as any } }
          ]
        }),
        ...(type && type !== 'all' && { type }),
        ...(category && category !== 'all' && { category }),
        ...(priority && priority !== 'all' && { priority })
      }

      const [notifications, totalCount] = await Promise.all([
        prisma.notifications.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
          include: {
            churches: { select: { name: true } },
            users: { select: { name: true } },
            notification_deliveries: {
              select: {
                isRead: true,
                readAt: true,
                deliveryStatus: true,
                users: { select: { name: true, email: true } }
              }
            }
          }
        }),
        prisma.notifications.count({ where: whereClause })
      ])

      return NextResponse.json({
        notifications,
        totalCount,
        hasMore: offset + notifications.length < totalCount
      })
    } else {
      // For received notifications - use NotificationDelivery system
      const deliveryWhereClause = {
        userId: user.id,
        notifications: {
          churchId: user.churchId,
          ...(search && {
            OR: [
              { title: { contains: search, mode: 'insensitive' as any } },
              { message: { contains: search, mode: 'insensitive' as any } }
            ]
          }),
          ...(type && type !== 'all' && { type }),
          ...(category && category !== 'all' && { category }),
          ...(priority && priority !== 'all' && { priority })
        },
        ...(unreadOnly && { isRead: false })
      }

      const [deliveries, totalCount] = await Promise.all([
        prisma.notification_deliveries.findMany({
          where: deliveryWhereClause,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
          include: {
            notifications: {
              include: {
                churches: { select: { name: true } },
                users: { select: { name: true } }
              }
            }
          }
        }),
        prisma.notification_deliveries.count({ where: deliveryWhereClause })
      ])

      // Transform deliveries to include read state
      const notifications = deliveries.map(delivery => ({
        ...delivery.notifications,
        isRead: delivery.isRead,
        readAt: delivery.readAt,
        deliveryId: delivery.id,
        deliveryStatus: delivery.deliveryStatus,
        deliveredAt: delivery.deliveredAt
      }))

      // Get unread count
      const unreadCount = await prisma.notification_deliveries.count({
        where: {
          userId: user.id,
          isRead: false,
          notifications: { churchId: user.churchId }
        }
      })

      return NextResponse.json({
        notifications,
        totalCount,
        unreadCount,
        hasMore: offset + notifications.length < totalCount
      })
    }
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Create new notification (Admin only)
export async function POST(request: NextRequest) {
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

    // Check if user has permission to create notifications
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(user.role)) {
      return NextResponse.json({ error: 'Sin permisos para crear notificaciones' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = notificationSchema.parse(body)

    // Validate targetUser exists in the same church if specified
    if (validatedData.targetUser) {
      const targetUser = await prisma.users.findUnique({
        where: { id: validatedData.targetUser },
        select: { churchId: true }
      })

      if (!targetUser || targetUser.churchId !== user.churchId) {
        return NextResponse.json({ error: 'Usuario objetivo no encontrado en esta iglesia' }, { status: 400 })
      }
    }

    const notification = await prisma.notifications.create({
      data: {
        id: nanoid(),
        title: validatedData.title,
        message: validatedData.message,
        type: validatedData.type,
        targetRole: validatedData.targetRole,
        targetUser: validatedData.targetUser,
        isGlobal: validatedData.isGlobal,
        churchId: user.churchId,
        createdBy: user.id,
        updatedAt: new Date()
      },
      include: {
        churches: { select: { name: true } },
        users: { select: { name: true } }
      }
    })

    // Create NotificationDelivery records based on targeting
    if (validatedData.targetUser) {
      // Single user notification
      await prisma.notification_deliveries.create({
        data: {
          id: nanoid(),
          notificationId: notification.id,
          userId: validatedData.targetUser,
          deliveryMethod: 'in-app',
          deliveryStatus: 'PENDING',
          deliveredAt: new Date(),
          updatedAt: new Date()
        }
      })
    } else if (validatedData.targetRole) {
      // Role-based notification
      const roleUsers = await prisma.users.findMany({
        where: {
          churchId: user.churchId,
          role: validatedData.targetRole as any,
          isActive: true
        },
        select: { id: true }
      })

      await prisma.notification_deliveries.createMany({
        data: roleUsers.map(roleUser => ({
          id: nanoid(),
          notificationId: notification.id,
          userId: roleUser.id,
          deliveryMethod: 'in-app',
          deliveryStatus: 'PENDING',
          deliveredAt: new Date(),
          updatedAt: new Date()
        }))
      })
    } else if (validatedData.isGlobal) {
      // Global notification for entire church
      const churchUsers = await prisma.users.findMany({
        where: {
          churchId: user.churchId,
          isActive: true
        },
        select: { id: true }
      })

      await prisma.notification_deliveries.createMany({
        data: churchUsers.map(churchUser => ({
          id: nanoid(),
          notificationId: notification.id,
          userId: churchUser.id,
          deliveryMethod: 'in-app',
          deliveryStatus: 'PENDING',
          deliveredAt: new Date(),
          updatedAt: new Date()
        }))
      })
    }

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    console.error('Error creating notification:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos de entrada inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Mark notifications as read (Updated for NotificationDelivery system)
export async function PUT(request: NextRequest) {
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

    const body = await request.json()
    const { notificationIds, markAllAsRead } = body

    if (markAllAsRead) {
      // Mark all user's notification deliveries as read
      const updatedDeliveries = await prisma.notification_deliveries.updateMany({
        where: {
          userId: user.id,
          isRead: false,
          notifications: {
            churchId: user.churchId
          }
        },
        data: {
          isRead: true,
          readAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        updatedCount: updatedDeliveries.count
      })
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read via delivery records
      const updatedDeliveries = await prisma.notification_deliveries.updateMany({
        where: {
          userId: user.id,
          notificationId: { in: notificationIds },
          notifications: {
            churchId: user.churchId
          }
        },
        data: {
          isRead: true,
          readAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        updatedCount: updatedDeliveries.count
      })
    }

    return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 })
  } catch (error) {
    console.error('Error marking notifications as read:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
