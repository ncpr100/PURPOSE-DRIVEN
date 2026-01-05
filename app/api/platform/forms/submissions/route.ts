import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/platform/forms/submissions - Get all platform form submissions with analytics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // SUPER_ADMIN only
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
    const campaignTag = searchParams.get('campaignTag') || undefined
    const status = searchParams.get('status') || undefined
    const minLeadScore = searchParams.get('minLeadScore') ? 
                        parseInt(searchParams.get('minLeadScore')!) : undefined
    const dateFrom = searchParams.get('dateFrom') ? 
                    new Date(searchParams.get('dateFrom')!) : undefined
    const dateTo = searchParams.get('dateTo') ? 
                  new Date(searchParams.get('dateTo')!) : undefined

    // Build where clause
    const where: any = {}
    if (formId) where.formId = formId
    if (campaignTag) where.campaignTag = campaignTag
    if (status) where.status = status
    if (minLeadScore) where.leadScore = { gte: minLeadScore }
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) where.createdAt.gte = dateFrom
      if (dateTo) where.createdAt.lte = dateTo
    }

    const [submissions, totalCount] = await Promise.all([
      db.platformFormSubmission.findMany({
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
          }
        }
      }),
      db.platformFormSubmission.count({ where })
    ])

    // Calculate analytics
    const analytics = await calculateSubmissionAnalytics(where)

    return NextResponse.json({
      data: submissions,
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
    console.error('Platform form submissions fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: 'FETCH_ERROR' },
      { status: 500 }
    )
  }
}

// PUT /api/platform/forms/submissions - Update submission status/notes
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - SUPER_ADMIN access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { submissionId, status, notes, leadScore, followUpDate } = body

    if (!submissionId) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      )
    }

    // Verify submission exists
    const existingSubmission = await db.platformFormSubmission.findUnique({
      where: { id: submissionId }
    })

    if (!existingSubmission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Update submission
    const updatedSubmission = await db.platformFormSubmission.update({
      where: { id: submissionId },
      data: {
        status: status || existingSubmission.status,
        notes: notes !== undefined ? notes : existingSubmission.notes,
        leadScore: leadScore !== undefined ? leadScore : existingSubmission.leadScore,
        followUpDate: followUpDate ? new Date(followUpDate) : existingSubmission.followUpDate,
        processedAt: status === 'processed' ? new Date() : existingSubmission.processedAt,
        processedById: session.user.id
      },
      include: {
        form: {
          select: {
            name: true,
            campaignTag: true
          }
        }
      }
    })

    return NextResponse.json({
      data: updatedSubmission,
      success: true,
      message: 'Submission updated successfully'
    })

  } catch (error) {
    console.error('Submission update error:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: 'UPDATE_ERROR' },
      { status: 500 }
    )
  }
}

// Helper function to calculate submission analytics
async function calculateSubmissionAnalytics(where: any) {
  const [
    totalSubmissions,
    todaySubmissions,
    weekSubmissions,
    monthSubmissions,
    leadScoreStats,
    statusStats,
    campaignStats,
    conversionFunnel
  ] = await Promise.all([
    // Total submissions
    db.platformFormSubmission.count({ where }),
    
    // Today's submissions
    db.platformFormSubmission.count({
      where: {
        ...where,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          ...where.createdAt
        }
      }
    }),
    
    // This week's submissions
    db.platformFormSubmission.count({
      where: {
        ...where,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          ...where.createdAt
        }
      }
    }),
    
    // This month's submissions
    db.platformFormSubmission.count({
      where: {
        ...where,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          ...where.createdAt
        }
      }
    }),
    
    // Lead score statistics
    db.platformFormSubmission.aggregate({
      where,
      _avg: { leadScore: true },
      _max: { leadScore: true },
      _min: { leadScore: true }
    }),
    
    // Status distribution
    db.platformFormSubmission.groupBy({
      by: ['status'],
      where,
      _count: { status: true }
    }),
    
    // Campaign performance
    db.platformFormSubmission.groupBy({
      by: ['campaignTag'],
      where,
      _count: { campaignTag: true },
      _avg: { leadScore: true }
    }),
    
    // Conversion funnel (new -> contacted -> converted)
    Promise.all([
      db.platformFormSubmission.count({ 
        where: { ...where, status: 'new' } 
      }),
      db.platformFormSubmission.count({ 
        where: { ...where, status: 'contacted' } 
      }),
      db.platformFormSubmission.count({ 
        where: { ...where, status: 'converted' } 
      }),
      db.platformFormSubmission.count({ 
        where: { ...where, status: 'processed' } 
      })
    ])
  ])

  return {
    overview: {
      totalSubmissions,
      todaySubmissions,
      weekSubmissions,
      monthSubmissions,
      averageLeadScore: Math.round(leadScoreStats._avg.leadScore || 0),
      maxLeadScore: leadScoreStats._max.leadScore || 0,
      minLeadScore: leadScoreStats._min.leadScore || 0
    },
    statusDistribution: statusStats.map(stat => ({
      status: stat.status,
      count: stat._count.status,
      percentage: totalSubmissions > 0 ? 
                 Math.round((stat._count.status / totalSubmissions) * 100) : 0
    })),
    campaignPerformance: campaignStats.map(stat => ({
      campaignTag: stat.campaignTag,
      count: stat._count.campaignTag,
      averageLeadScore: Math.round(stat._avg.leadScore || 0),
      percentage: totalSubmissions > 0 ? 
                 Math.round((stat._count.campaignTag / totalSubmissions) * 100) : 0
    })),
    conversionFunnel: {
      new: conversionFunnel[0],
      contacted: conversionFunnel[1],
      converted: conversionFunnel[2],
      processed: conversionFunnel[3],
      contactRate: conversionFunnel[0] > 0 ? 
                   Math.round((conversionFunnel[1] / conversionFunnel[0]) * 100) : 0,
      conversionRate: conversionFunnel[1] > 0 ? 
                     Math.round((conversionFunnel[2] / conversionFunnel[1]) * 100) : 0
    }
  }
}