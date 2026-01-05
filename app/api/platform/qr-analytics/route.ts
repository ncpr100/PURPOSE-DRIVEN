import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

// Schema for QR analytics validation
const qrAnalyticsSchema = z.object({
  formId: z.string(),
  qrConfig: z.object({
    size: z.number(),
    margin: z.number(),
    foregroundColor: z.string(),
    backgroundColor: z.string(),
    logo: z.string().optional(),
    logoSize: z.number(),
    borderStyle: z.string(),
    errorCorrectionLevel: z.string()
  }),
  trackingConfig: z.object({
    utmSource: z.string(),
    utmMedium: z.string(),
    utmCampaign: z.string(),
    utmTerm: z.string().optional(),
    utmContent: z.string().optional(),
    customParams: z.record(z.string()).optional()
  }),
  placementContext: z.string().optional(),
  qrUrl: z.string(),
  generatedAt: z.string()
})

// POST /api/platform/qr-analytics - Save QR generation analytics
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // SUPER_ADMIN only
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - SUPER_ADMIN access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = qrAnalyticsSchema.parse(body)

    // Save QR generation record
    const qrRecord = await db.platformQRCode.create({
      data: {
        formId: validatedData.formId,
        config: validatedData.qrConfig,
        trackingParams: validatedData.trackingConfig,
        placementContext: validatedData.placementContext,
        qrUrl: validatedData.qrUrl,
        isActive: true,
        scanCount: 0,
        lastScannedAt: null,
        generatedById: session.user.id
      }
    })

    return NextResponse.json({
      data: qrRecord,
      success: true,
      message: 'QR analytics saved successfully'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid input data',
          details: error.errors,
          code: 'VALIDATION_ERROR' 
        },
        { status: 400 }
      )
    }

    console.error('QR analytics save error:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: 'SAVE_ERROR' },
      { status: 500 }
    )
  }
}

// GET /api/platform/qr-analytics - Get QR analytics and performance
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - SUPER_ADMIN access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const formId = searchParams.get('formId') || undefined
    const placementContext = searchParams.get('placementContext') || undefined
    const dateFrom = searchParams.get('dateFrom') ? 
                    new Date(searchParams.get('dateFrom')!) : undefined
    const dateTo = searchParams.get('dateTo') ? 
                  new Date(searchParams.get('dateTo')!) : undefined

    // Build where clause
    const where: any = {}
    if (formId) where.formId = formId
    if (placementContext) where.placementContext = placementContext
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) where.createdAt.gte = dateFrom
      if (dateTo) where.createdAt.lte = dateTo
    }

    const [qrCodes, totalCount] = await Promise.all([
      db.platformQRCode.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          form: {
            select: {
              id: true,
              name: true,
              slug: true,
              campaignTag: true
            }
          },
          scans: {
            orderBy: { scannedAt: 'desc' },
            take: 5,
            select: {
              id: true,
              scannedAt: true,
              userAgent: true,
              location: true,
              conversionData: true
            }
          }
        }
      }),
      db.platformQRCode.count({ where })
    ])

    // Calculate overall analytics
    const analytics = await calculateQRAnalytics(where)

    return NextResponse.json({
      data: qrCodes,
      analytics,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      },
      success: true
    })

  } catch (error) {
    console.error('QR analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: 'FETCH_ERROR' },
      { status: 500 }
    )
  }
}

// Helper function to calculate QR analytics
async function calculateQRAnalytics(where: any) {
  const [
    totalQRCodes,
    activeQRCodes,
    totalScans,
    uniqueScans,
    todayScans,
    weekScans,
    placementPerformance,
    campaignPerformance,
    topPerformingQRs,
    conversionData
  ] = await Promise.all([
    // Total QR codes generated
    db.platformQRCode.count({ where }),
    
    // Active QR codes
    db.platformQRCode.count({
      where: { ...where, isActive: true }
    }),
    
    // Total scans
    db.platformQRScan.count({
      where: {
        qrCode: { ...where }
      }
    }),
    
    // Unique scans (approximation based on IP + UserAgent)
    db.platformQRScan.groupBy({
      by: ['ipAddress', 'userAgent'],
      where: {
        qrCode: { ...where }
      },
      _count: { id: true }
    }).then(results => results.length),
    
    // Today's scans
    db.platformQRScan.count({
      where: {
        scannedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        },
        qrCode: { ...where }
      }
    }),
    
    // This week's scans
    db.platformQRScan.count({
      where: {
        scannedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        qrCode: { ...where }
      }
    }),
    
    // Performance by placement context
    db.platformQRCode.groupBy({
      by: ['placementContext'],
      where,
      _count: { id: true },
      _sum: { scanCount: true }
    }),
    
    // Performance by campaign
    db.platformQRCode.findMany({
      where,
      include: {
        form: { select: { campaignTag: true } },
        _count: { select: { scans: true } }
      }
    }).then(qrs => {
      const campaignStats = qrs.reduce((acc, qr) => {
        const campaign = qr.form.campaignTag || 'unknown'
        if (!acc[campaign]) {
          acc[campaign] = { qrCodes: 0, scans: 0 }
        }
        acc[campaign].qrCodes += 1
        acc[campaign].scans += qr.scanCount
        return acc
      }, {} as Record<string, { qrCodes: number, scans: number }>)
      
      return Object.entries(campaignStats).map(([campaign, stats]) => ({
        campaignTag: campaign,
        qrCodes: stats.qrCodes,
        scans: stats.scans
      }))
    }),
    
    // Top performing QR codes
    db.platformQRCode.findMany({
      where,
      orderBy: { scanCount: 'desc' },
      take: 10,
      include: {
        form: {
          select: {
            name: true,
            campaignTag: true
          }
        }
      }
    }),
    
    // Conversion tracking
    db.platformQRScan.findMany({
      where: {
        qrCode: { ...where },
        conversionData: { not: null }
      },
      select: {
        conversionData: true,
        scannedAt: true
      }
    }).then(scans => {
      const conversions = scans.filter(scan => 
        scan.conversionData && 
        typeof scan.conversionData === 'object' && 
        (scan.conversionData as any).converted === true
      ).length
      
      return {
        totalScansWithTracking: scans.length,
        conversions,
        conversionRate: scans.length > 0 ? (conversions / scans.length) * 100 : 0
      }
    })
  ])

  return {
    overview: {
      totalQRCodes,
      activeQRCodes,
      totalScans,
      uniqueScans,
      todayScans,
      weekScans,
      averageScansPerQR: totalQRCodes > 0 ? Math.round(totalScans / totalQRCodes) : 0
    },
    placementPerformance: placementPerformance.map(stat => ({
      placement: stat.placementContext || 'unknown',
      qrCodes: stat._count.id,
      totalScans: stat._sum.scanCount || 0,
      averageScansPerQR: stat._count.id > 0 ? 
                        Math.round((stat._sum.scanCount || 0) / stat._count.id) : 0
    })),
    campaignPerformance,
    topPerformingQRs: topPerformingQRs.map(qr => ({
      id: qr.id,
      formName: qr.form.name,
      campaignTag: qr.form.campaignTag,
      scans: qr.scanCount,
      placementContext: qr.placementContext,
      createdAt: qr.createdAt
    })),
    conversionData
  }
}