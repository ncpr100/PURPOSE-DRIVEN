import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { subDays } from 'date-fns'

export const dynamic = 'force-dynamic'

// GET /api/push-notifications/stats - Get push notification statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Only SUPER_ADMIN, ADMIN_IGLESIA, and PASTOR can view push notification stats
    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    const user = await db.users.findUnique({
      where: { id: session.user.id },
      select: { id: true, churchId: true, role: true }
    })

    if (!user?.churchId) {
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 403 })
    }

    const churchId = user.churchId
    const url = new URL(request.url)
    const days = parseInt(url.searchParams.get('days') || '30')
    const startDate = subDays(new Date(), days)
    const endDate = new Date()

    // 1. Subscription stats — what the usePushNotificationStats hook expects
    const [
      totalSubscriptions,
      activeSubscriptions,
      platformStats,
      recentActivity
    ] = await Promise.all([
      db.push_subscriptions.count({ where: { churchId } }),
      db.push_subscriptions.count({ where: { churchId, isActive: true } }),
      db.push_subscriptions.groupBy({
        by: ['platform'],
        where: { churchId, isActive: true },
        _count: true
      }),
      db.push_subscriptions.count({
        where: {
          churchId,
          isActive: true,
          updatedAt: { gte: subDays(new Date(), 7) }
        }
      })
    ])

    const subscriptionsByPlatform = platformStats.reduce(
      (acc: Record<string, number>, stat: any) => {
        acc[stat.platform || 'unknown'] = stat._count
        return acc
      },
      {} as Record<string, number>
    )

    // 2. Notification log stats (supplementary)
    const notifications = await db.push_notification_logs.findMany({
      where: {
        churchId,
        createdAt: { gte: startDate, lte: endDate }
      },
      select: {
        status: true,
        clickedAt: true,
        dismissedAt: true,
        createdAt: true
      }
    })

    const totalNotifications = notifications.length
    const sentNotifications = notifications.filter(n => n.status?.toUpperCase() === 'SENT').length
    const failedNotifications = notifications.filter(n => n.status?.toUpperCase() === 'FAILED').length
    const clickedNotifications = notifications.filter(n => n.clickedAt !== null).length

    return NextResponse.json({
      // Fields expected by usePushNotificationStats hook
      totalSubscriptions,
      activeSubscriptions,
      subscriptionsByPlatform,
      recentActivity,
      // Supplementary notification log stats
      summary: {
        totalNotifications,
        sentNotifications,
        failedNotifications,
        clickedNotifications,
        successRate: totalNotifications > 0 ? ((sentNotifications / totalNotifications) * 100).toFixed(1) : '0.0',
        clickRate: sentNotifications > 0 ? ((clickedNotifications / sentNotifications) * 100).toFixed(1) : '0.0'
      }
    })
  } catch (error) {
    console.error('Error fetching push notification stats:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
