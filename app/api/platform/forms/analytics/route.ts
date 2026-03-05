import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET /api/platform/forms/analytics — Real analytics for SUPER_ADMIN platform forms
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - 7)

    // Fetch all platform forms with QR codes and scoped submissions
    const forms = await db.platformForm.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { submissions: true } },
        submissions: {
          where: { createdAt: { gte: startDate } },
          select: { id: true, createdAt: true, leadScore: true },
        },
        qrCodes: {
          select: { scanCount: true, isActive: true },
        },
      },
    })

    // Total QR codes across all forms
    const totalQRCodes = forms.reduce((acc, f) => acc + f.qrCodes.length, 0)

    // Aggregate submission stats
    const allSubsInPeriod = forms.flatMap(f => f.submissions)
    const todaySubmissions = allSubsInPeriod.filter(s => s.createdAt >= todayStart).length
    const weekSubmissions = allSubsInPeriod.filter(s => s.createdAt >= weekStart).length
    const totalAllTimeSubmissions = forms.reduce((acc, f) => acc + f._count.submissions, 0)

    // Average lead score from all submissions in period
    const leadScores = allSubsInPeriod.map(s => s.leadScore).filter(s => s > 0)
    const averageLeadScore = leadScores.length > 0
      ? Math.round(leadScores.reduce((a, b) => a + b, 0) / leadScores.length)
      : 0

    // Total QR scans (used as performance proxy)
    const totalQRScans = forms.reduce(
      (acc, f) => acc + f.qrCodes.reduce((qa, qr) => qa + qr.scanCount, 0), 0
    )

    const conversionRate = totalQRScans > 0
      ? Math.round((totalAllTimeSubmissions / totalQRScans) * 100 * 10) / 10
      : 0

    // Per-form performance
    const formPerformance = forms.map(f => {
      const qrScans = f.qrCodes.reduce((acc, qr) => acc + qr.scanCount, 0)
      const totalSubs = f._count.submissions
      const subsInPeriod = f.submissions.length
      const avgScore = f.submissions.length > 0
        ? Math.round(
            f.submissions.map(s => s.leadScore).reduce((a, b) => a + b, 0) /
            f.submissions.length
          )
        : f.leadScore
      const cr = qrScans > 0 ? Math.round((totalSubs / qrScans) * 100 * 10) / 10 : 0

      return {
        id: f.id,
        formName: f.name,
        slug: f.slug,
        isActive: f.isActive,
        campaignTag: f.campaignTag || '',
        qrScans,
        submissions: totalSubs,
        submissionsInPeriod: subsInPeriod,
        conversionRate: cr,
        averageLeadScore: avgScore,
        createdAt: f.createdAt,
      }
    })

    // Campaign performance — group forms by campaignTag
    const campaignMap = new Map<string, { forms: number; submissions: number; leadScores: number[]; qrScans: number }>()
    forms.forEach(f => {
      const tag = f.campaignTag || 'sin-campana'
      const existing = campaignMap.get(tag) || { forms: 0, submissions: 0, leadScores: [], qrScans: 0 }
      existing.forms += 1
      existing.submissions += f._count.submissions
      existing.leadScores.push(...f.submissions.map(s => s.leadScore))
      existing.qrScans += f.qrCodes.reduce((acc, qr) => acc + qr.scanCount, 0)
      campaignMap.set(tag, existing)
    })
    const campaignPerformance = Array.from(campaignMap.entries()).map(([campaignTag, data]) => ({
      campaignTag,
      forms: data.forms,
      submissions: data.submissions,
      averageLeadScore: data.leadScores.length > 0
        ? Math.round(data.leadScores.reduce((a, b) => a + b, 0) / data.leadScores.length)
        : 0,
      conversionRate: data.qrScans > 0
        ? Math.round((data.submissions / data.qrScans) * 100 * 10) / 10
        : 0,
    }))

    // Timeline: daily submissions in period
    const dailyMap: Record<string, number> = {}
    allSubsInPeriod.forEach(s => {
      const day = s.createdAt.toISOString().split('T')[0]
      dailyMap[day] = (dailyMap[day] || 0) + 1
    })
    const timelineData = Object.entries(dailyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, submissions]) => ({ date, submissions }))

    return NextResponse.json({
      overview: {
        totalForms: forms.length,
        activeForms: forms.filter(f => f.isActive).length,
        totalSubmissions: totalAllTimeSubmissions,
        totalQRCodes,
        conversionRate,
        averageLeadScore,
        todaySubmissions,
        weekSubmissions,
      },
      formPerformance,
      campaignPerformance,
      timelineData,
    })
  } catch (error) {
    console.error('Form analytics error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
