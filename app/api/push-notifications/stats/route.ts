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

    const user = await db.users.findUnique({
      where: { id: session.user.id },
      include: { churches: true }
    })

    if (!user?.churchId) {
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 403 })
    }

    const url = new URL(request.url)
    const days = parseInt(url.searchParams.get('days') || '30')
    
    const startDate = subDays(new Date(), days)
    const endDate = new Date()

    // Get push notification statistics
    const notifications = await db.push_notification_logs.findMany({
      where: {
        churchId: user.churchId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        users: true
      }
    })

    // Calculate stats
    const totalNotifications = notifications.length
    const sentNotifications = notifications.filter(notif => notif.status?.toUpperCase() === 'SENT').length
    const failedNotifications = notifications.filter(notif => notif.status?.toUpperCase() === 'FAILED').length
    const pendingNotifications = notifications.filter(notif => notif.status?.toUpperCase() === 'PENDING').length

    // Click and dismissal analytics
    const clickedNotifications = notifications.filter(notif => notif.clickedAt !== null).length
    const dismissedNotifications = notifications.filter(notif => notif.dismissedAt !== null).length

    const stats = {
      summary: {
        totalNotifications,
        sentNotifications,
        failedNotifications,
        pendingNotifications,
        clickedNotifications,
        dismissedNotifications,
        successRate: totalNotifications > 0 ? ((sentNotifications / totalNotifications) * 100).toFixed(1) : '0.0',
        clickRate: sentNotifications > 0 ? ((clickedNotifications / sentNotifications) * 100).toFixed(1) : '0.0'
      },
      recentNotifications: notifications.slice(0, 20)
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching push notification stats:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
