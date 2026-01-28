import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET /api/platform/qr-analytics - QR Code Analytics for platform admin
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = await db.users.findUnique({
      where: { id: session.user.id }
    })

    // Only SUPER_ADMIN can access platform analytics
    if (user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    // QR Code scan analytics across all churches
    const qrScans = await db.check_ins.findMany({
      where: {
        createdAt: { gte: startDate }
      },
      include: {
        events: {
          include: {
            churches: {
              select: {
                name: true,
                id: true
              }
            }
          }
        }
      }
    })

    // QR Code generation analytics
    const qrEvents = await db.events.findMany({
      where: {
        createdAt: { gte: startDate },
        qrCode: { not: null }
      },
      include: {
        churches: {
          select: {
            name: true,
            id: true
          }
        },
        _count: {
          select: {
            checkIns: true
          }
        }
      }
    })

    // Analytics summary
    const analytics = {
      totalQRScans: qrScans.length,
      totalQREvents: qrEvents.length,
      averageScansPerEvent: qrEvents.length > 0 ? qrScans.length / qrEvents.length : 0,
      
      // By church breakdown
      churchBreakdown: qrEvents.reduce((acc: any, event: any) => {
        const churchId = event.churches.id
        const churchName = event.churches.name
        
        if (!acc[churchId]) {
          acc[churchId] = {
            churchName,
            events: 0,
            totalScans: 0
          }
        }
        
        acc[churchId].events += 1
        acc[churchId].totalScans += event._count.checkIns
        
        return acc
      }, {}),

      // Daily scan trends
      dailyScans: qrScans.reduce((acc: any, scan: any) => {
        const date = scan.createdAt.toISOString().split('T')[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
      }, {}),

      // Recent activity
      recentScans: qrScans.slice(-10).map((scan: any) => ({
        scanTime: scan.createdAt,
        memberName: scan.member?.name || 'Visitante',
        eventName: scan.event?.name,
        churchName: scan.event?.church?.name
      }))
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching QR analytics:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
