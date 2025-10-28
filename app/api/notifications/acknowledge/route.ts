
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const acknowledgeSchema = z.object({
  notificationId: z.string().uuid(),
  deliveryMethod: z.string().optional().default('in-app')
})

// POST - Acknowledge notification as read
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

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 400 })
    }

    const body = await request.json()
    const { notificationId, deliveryMethod } = acknowledgeSchema.parse(body)

    // Verify user has access to this notification
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        OR: [
          { targetUser: user.id },
          ...(user.churchId ? [{ 
            isGlobal: true,
            churchId: user.churchId 
          }] : []),
          ...(user.churchId ? [{ 
            targetRole: user.role,
            churchId: user.churchId 
          }] : []),
          // System-wide global notifications (no churchId)
          {
            isGlobal: true,
            churchId: null
          }
        ]
      }
    })

    if (!notification) {
      return NextResponse.json({ error: 'Notificación no encontrada o sin permisos' }, { status: 404 })
    }

    // Create or update delivery record
    const deliveryRecord = await prisma.notificationDelivery.upsert({
      where: {
        notificationId_userId_deliveryMethod: {
          notificationId,
          userId: user.id,
          deliveryMethod
        }
      },
      update: {
        isRead: true,
        readAt: new Date(),
        deliveryStatus: 'DELIVERED'
      },
      create: {
        notificationId,
        userId: user.id,
        deliveryMethod,
        isRead: true,
        readAt: new Date(),
        deliveredAt: new Date(),
        deliveryStatus: 'DELIVERED'
      }
    })

    return NextResponse.json({
      success: true,
      acknowledged: true,
      deliveryId: deliveryRecord.id
    })

  } catch (error) {
    console.error('Error acknowledging notification:', error, {
      userId: session?.user?.email,
      notificationId: request.body
    })
    
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
