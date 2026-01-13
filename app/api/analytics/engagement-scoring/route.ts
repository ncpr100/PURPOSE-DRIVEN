import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { memberAnalyticsCache } from '@/lib/member-analytics-cache';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.churchId) {
      return NextResponse.json(
        { error: 'No autorizado - Se requiere membresía de iglesia' },
        { status: 401 }
      );
    }

    const churchId = session.user.churchId;

    // Try to get from cache first
    const cached = await memberAnalyticsCache.getEngagementDashboard(churchId);
    if (cached) {
      return NextResponse.json({
        ...cached,
        cached: true,
        timestamp: new Date().toISOString()
      });
    }

    // Get overall engagement metrics
    const engagementStats = await db.member_journeys.aggregate({
      where: {
        churchId,
        members: { isActive: true }
      },
      _avg: {
        engagementScore: true,
        retentionScore: true
      },
      _count: true
    });

    // Get engagement distribution
    const engagementDistribution = await db.member_journeys.groupBy({
      by: ['engagementLevel'],
      where: {
        churchId,
        members: { isActive: true }
      },
      _count: true
    });

    // Get engagement by lifecycle stage
    const engagementByStage = await db.member_journeys.groupBy({
      by: ['currentStage'],
      where: {
        churchId,
        members: { isActive: true }
      },
      _avg: {
        engagementScore: true
      },
      _count: true
    });

    // Get behavioral pattern metrics
    const behavioralMetrics = await db.member_behavioral_patterns.aggregate({
      where: {
        churchId,
        analyzedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      _avg: {
        averageWeeklyAttendance: true,
        attendanceConsistency: true,
        communicationEngagement: true,
        eventParticipation: true,
        ministryParticipation: true,
        socialInteraction: true,
        spiritualGrowthActivity: true,
        leadershipPotential: true
      }
    });

    // Get engagement trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const engagementTrends = await db.member_journeys.findMany({
      where: {
        churchId,
        lastAnalysisDate: {
          gte: sixMonthsAgo
        }
      },
      select: {
        engagementScore: true,
        lastAnalysisDate: true,
        currentStage: true
      },
      orderBy: {
        lastAnalysisDate: 'asc'
      }
    });

    // Group trends by month
    const trendsByMonth = engagementTrends.reduce((acc, record) => {
      const monthKey = record.lastAnalysisDate.toISOString().substring(0, 7); // YYYY-MM
      if (!acc[monthKey]) {
        acc[monthKey] = { total: 0, count: 0, scores: [] };
      }
      acc[monthKey].total += record.engagementScore;
      acc[monthKey].count += 1;
      acc[monthKey].scores.push(record.engagementScore);
      return acc;
    }, {} as Record<string, { total: number; count: number; scores: number[] }>);

    const monthlyAverages = Object.entries(trendsByMonth).map(([month, data]): { month: string; averageEngagement: number; memberCount: number } => {
      const typedData = data as { total: number; count: number; scores: number[] }
      return {
        month,
        averageEngagement: Math.round(typedData.total / typedData.count),
        memberCount: typedData.count
      }
    });

    // Calculate engagement score categories
    const engagementCategories = {
      high: 0, // 80-100
      medium: 0, // 50-79
      low: 0, // 0-49
      atRisk: 0 // Below 30
    };

    await db.member_journeys.findMany({
      where: {
        churchId,
        members: { isActive: true }
      },
      select: { engagementScore: true }
    }).then(journeys => {
      journeys.forEach(journey => {
        const score = journey.engagementScore;
        if (score >= 80) engagementCategories.high++;
        else if (score >= 50) engagementCategories.medium++;
        else if (score >= 30) engagementCategories.low++;
        else engagementCategories.atRisk++;
      });
    });

    // Get top engaged members
    const topEngagedMembers = await db.member_journeys.findMany({
      where: {
        churchId,
        members: { isActive: true }
      },
      include: {
        members: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        engagementScore: 'desc'
      },
      take: 10
    });

    // Calculate engagement improvement recommendations
    const lowEngagementMembers = await db.member_journeys.count({
      where: {
        churchId,
        engagementScore: { lt: 50 },
        members: { isActive: true }
      }
    });

    const inactiveMembers = await db.member_journeys.count({
      where: {
        churchId,
        engagementLevel: 'LOW',
        members: { isActive: true }
      }
    });

    const engagementDashboardData = {
      overview: {
        averageEngagement: Math.round(engagementStats._avg.engagementScore || 0),
        averageRetention: Math.round(engagementStats._avg.retentionScore || 0),
        totalMembers: engagementStats._count,
        activeMembers: engagementStats._count
      },
      distribution: {
        high: engagementCategories.high,
        medium: engagementCategories.medium,
        low: engagementCategories.low,
        atRisk: engagementCategories.atRisk
      },
      engagementByLevel: engagementDistribution.map(level => ({
        level: level.engagementLevel,
        count: level._count,
        percentage: Math.round((level._count / engagementStats._count) * 100)
      })),
      stageEngagement: engagementByStage.map(stage => ({
        stage: stage.currentStage,
        averageEngagement: Math.round(stage._avg.engagementScore || 0),
        memberCount: stage._count
      })),
      behavioralMetrics: {
        attendance: Math.round((behavioralMetrics._avg.averageWeeklyAttendance || 0) * 100),
        consistency: Math.round((behavioralMetrics._avg.attendanceConsistency || 0) * 100),
        communication: Math.round((behavioralMetrics._avg.communicationEngagement || 0) * 100),
        eventParticipation: Math.round((behavioralMetrics._avg.eventParticipation || 0) * 100),
        ministryInvolvement: Math.round((behavioralMetrics._avg.ministryParticipation || 0) * 100),
        socialInteraction: Math.round((behavioralMetrics._avg.socialInteraction || 0) * 100),
        spiritualGrowth: Math.round((behavioralMetrics._avg.spiritualGrowthActivity || 0) * 100),
        leadershipPotential: Math.round((behavioralMetrics._avg.leadershipPotential || 0) * 100)
      },
      trends: {
        monthly: monthlyAverages.slice(-6), // Last 6 months
        improvement: {
          lowEngagementCount: lowEngagementMembers,
          inactiveCount: inactiveMembers,
          improvementPotential: Math.round((lowEngagementMembers / engagementStats._count) * 100)
        }
      },
      topMembers: topEngagedMembers.map(journey => ({
        id: journey.members?.id,
        name: `${journey.members?.firstName} ${journey.members?.lastName}`,
        email: journey.members?.email,
        engagementScore: journey.engagementScore,
        stage: journey.currentStage,
        retentionScore: journey.retentionScore
      })),
      recommendations: [
        {
          title: 'Mejorar Comunicación',
          description: 'Aumentar la frecuencia de comunicación para miembros con baja respuesta',
          priority: lowEngagementMembers > engagementStats._count * 0.2 ? 'high' : 'medium',
          impact: 'Incremento del 15-25% en engagement'
        },
        {
          title: 'Programas de Participación',
          description: 'Crear más oportunidades de participación en eventos y ministerios',
          priority: 'medium',
          impact: 'Mejora en la retención del 20%'
        },
        {
          title: 'Seguimiento Personalizado',
          description: 'Implementar seguimiento individual para miembros en riesgo',
          priority: engagementCategories.atRisk > 5 ? 'high' : 'low',
          impact: 'Reducción del 30% en pérdida de miembros'
        }
      ],
      lastUpdated: new Date().toISOString()
    };

    // Cache the results
    await memberAnalyticsCache.cacheEngagementDashboard(churchId, engagementDashboardData);

    return NextResponse.json(engagementDashboardData);

  } catch (error) {
    console.error('Error fetching engagement dashboard:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al obtener datos de engagement' },
      { status: 500 }
    );
  }
}