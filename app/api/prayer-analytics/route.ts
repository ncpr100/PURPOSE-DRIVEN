import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { subDays } from 'date-fns'

export const dynamic = 'force-dynamic'

// GET /api/prayer-analytics - Get prayer analytics data
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

    // Get prayer requests with analytics
    const prayerRequests = await db.prayer_requests.findMany({
      where: {
        churchId: user.churchId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        prayer_categories: true,
        prayer_contacts: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate analytics
    const totalRequests = prayerRequests.length
    const approvedRequests = prayerRequests.filter(req => req.status === 'approved').length
    const rejectedRequests = prayerRequests.filter(req => req.status === 'rejected').length
    const pendingRequests = prayerRequests.filter(req => req.status === 'pending').length

    // Category distribution
    const categoryStats = prayerRequests.reduce((acc: any, req) => {
      const categoryName = req.prayer_categories?.name || 'Sin categoría'
      acc[categoryName] = (acc[categoryName] || 0) + 1
      return acc
    }, {})

    // Status distribution over time
    const statusDistribution = {
      approved: approvedRequests,
      rejected: rejectedRequests,
      pending: pendingRequests
    }

    const analytics = {
      summary: {
        totalRequests,
        approvedRequests,
        rejectedRequests,
        pendingRequests,
        approvalRate: totalRequests > 0 ? ((approvedRequests / totalRequests) * 100).toFixed(1) : '0.0'
      },
      categories: categoryStats,
      statusDistribution,
      requests: prayerRequests.slice(0, 50) // Limit for performance
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching prayer analytics:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
