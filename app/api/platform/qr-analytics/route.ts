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
    const qrCodes = await db.qr_codes.findMany({
      where: {
        createdAt: { gte: startDate }
      },
      include: {
        church: {
          select: {
            name: true,
            id: true
          }
        },
        _count: {
          select: {
            scans: true
          }
        }
      }
    })

    // Analytics summary
    const analytics = {
      totalQRScans: qrScans.length,
      totalQRCodes: qrCodes.length,
      averageScansPerQR: qrCodes.length > 0 ? qrScans.length / qrCodes.length : 0,
      
      // By church breakdown
      churchBreakdown: qrCodes.reduce((acc: any, qr: any) => {
        const churchId = qr.church.id
        const churchName = qr.church.name
        
        if (!acc[churchId]) {
          acc[churchId] = {
            churchName,
            qrCodes: 0,
            totalScans: 0
          }
        }
        
        acc[churchId].qrCodes += 1
        acc[churchId].totalScans += qr._count.scans
        
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
