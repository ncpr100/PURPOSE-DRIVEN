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

    // TODO: prayer_messages model doesn't exist in schema yet
    // Returning stub data until messaging feature is fully implemented
    const totalMessages = 0
    const uniqueRequests = 0
    const topTemplates: any[] = []

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
