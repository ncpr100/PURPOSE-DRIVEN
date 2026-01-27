import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { subDays } from 'date-fns'

export const dynamic = 'force-dynamic'

// GET /api/prayer-messaging-stats - Get prayer messaging statistics
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

    // Get messaging statistics for prayers
    const messagingStats = await db.prayer_messages.findMany({
      where: {
        churchId: user.churchId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        prayer_requests: true,
        message_templates: true
      }
    })

    // Calculate stats
    const totalMessages = messagingStats.length
    const uniqueRequests = new Set(messagingStats.map(msg => msg.prayerRequestId)).size
    const templateUsage = messagingStats.reduce((acc: any, msg) => {
      const templateName = msg.message_templates?.name || 'Sin template'
      acc[templateName] = (acc[templateName] || 0) + 1
      return acc
    }, {})

    // Top templates
    const topTemplates = Object.entries(templateUsage)
      .sort(([,a]: any, [,b]: any) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))

    const stats = {
      summary: {
        totalMessages,
        uniqueRequests,
        avgMessagesPerRequest: uniqueRequests > 0 ? (totalMessages / uniqueRequests).toFixed(1) : '0.0'
      },
      templateUsage,
      topTemplates,
      recentMessages: messagingStats.slice(0, 20)
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching prayer messaging stats:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
