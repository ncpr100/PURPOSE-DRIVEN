
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
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

    const user = await prisma.user.findUnique({
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
        prisma.notification.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
          include: {
            church: {
              select: { name: true }
            },
            creator: {
              select: { name: true }
            },
            deliveries: {
              select: {
                id: true,
                userId: true,
                isRead: true,
                isDelivered: true,
                deliveredAt: true,
                readAt: true,
              }
            }
          }
        }),
        prisma.notification.count({
          where: whereClause
        })
      ])

      return NextResponse.json({
        notifications,
        totalCount,
        hasMore: offset + notifications.length < totalCount
      })
    } else {
      // For received notifications - use NotificationDelivery to get user-specific notifications
      const deliveryWhereClause: any = {
        userId: user.id,
        notification: {
          churchId: user.churchId,
        },
        ...(unreadOnly && { isRead: false }),
      }

      // Add search filters to notification
      if (search || type || category || priority) {
        deliveryWhereClause.notification = {
          ...deliveryWhereClause.notification,
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
      }

      const [deliveries, totalCount, unreadCount] = await Promise.all([
        prisma.notificationDelivery.findMany({
          where: deliveryWhereClause,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
          include: {
            notification: {
              include: {
                church: {
                  select: { name: true }
                },
                creator: {
                  select: { name: true }
                }
              }
            }
          }
        }),
        prisma.notificationDelivery.count({
          where: deliveryWhereClause
        }),
        prisma.notificationDelivery.count({
          where: {
            userId: user.id,
            isRead: false,
            notification: {
              churchId: user.churchId,
            }
          }
        })
      ])

      // Transform deliveries to match the expected notification format
      const notifications = deliveries.map(delivery => ({
        ...delivery.notification,
        isRead: delivery.isRead,
        deliveryId: delivery.id,
        deliveredAt: delivery.deliveredAt,
        readAt: delivery.readAt,
      }))

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

    const user = await prisma.user.findUnique({
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
      const targetUser = await prisma.user.findUnique({
        where: { id: validatedData.targetUser },
        select: { churchId: true }
      })

      if (!targetUser || targetUser.churchId !== user.churchId) {
        return NextResponse.json({ error: 'Usuario objetivo no encontrado en esta iglesia' }, { status: 400 })
      }
    }

    // Create notification and determine target users
    const notification = await prisma.notification.create({
      data: {
        ...validatedData,
        churchId: user.churchId,
        createdBy: user.id,
      },
      include: {
        church: {
          select: { name: true }
        }
      }
    })

    // Determine which users should receive this notification
    let targetUsers: Array<{ id: string }> = []

    if (validatedData.targetUser) {
      // Specific user targeted
      targetUsers = [{ id: validatedData.targetUser }]
    } else if (validatedData.targetRole) {
      // Role-based notification - get all users with this role in the church
      targetUsers = await prisma.user.findMany({
        where: {
          churchId: user.churchId,
          role: validatedData.targetRole as any,
          isActive: true,
        },
        select: { id: true }
      })
    } else if (validatedData.isGlobal) {
      // Global notification - all active users in the church
      targetUsers = await prisma.user.findMany({
        where: {
          churchId: user.churchId,
          isActive: true,
        },
        select: { id: true }
      })
    }

    // Create NotificationDelivery records for all target users
    if (targetUsers.length > 0) {
      await prisma.notificationDelivery.createMany({
        data: targetUsers.map(targetUser => ({
          notificationId: notification.id,
          userId: targetUser.id,
          isDelivered: true,
          deliveredAt: new Date(),
        })),
        skipDuplicates: true,
      })
    }

    return NextResponse.json({
      ...notification,
      deliveryCount: targetUsers.length,
    }, { status: 201 })
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

// PUT - Mark notifications as read
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, churchId: true, role: true }
    })

    if (!user || !user.churchId) {
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 400 })
    }

    const body = await request.json()
    const { notificationIds, deliveryIds, markAllAsRead } = body

    const now = new Date()

    if (markAllAsRead) {
      // Mark all user's notification deliveries as read
      await prisma.notificationDelivery.updateMany({
        where: {
          userId: user.id,
          isRead: false,
          notification: {
            churchId: user.churchId,
          }
        },
        data: {
          isRead: true,
          readAt: now,
          updatedAt: now
        }
      })
    } else if (deliveryIds && Array.isArray(deliveryIds)) {
      // Mark specific delivery records as read (preferred method)
      await prisma.notificationDelivery.updateMany({
        where: {
          id: { in: deliveryIds },
          userId: user.id,
        },
        data: {
          isRead: true,
          readAt: now,
          updatedAt: now
        }
      })
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Legacy support: mark by notification IDs
      await prisma.notificationDelivery.updateMany({
        where: {
          notificationId: { in: notificationIds },
          userId: user.id,
        },
        data: {
          isRead: true,
          readAt: now,
          updatedAt: now
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking notifications as read:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
