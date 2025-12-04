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

    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || 'all';
    const churchId = session.user.churchId;

    // Try to get from cache first
    const cached = await memberAnalyticsCache.getLifecycleFunnel(churchId, dateRange);
    if (cached) {
      return NextResponse.json({
        ...cached,
        cached: true,
        timestamp: new Date().toISOString()
      });
    }

    // Calculate date filter based on range
    let dateFilter = {};
    const now = new Date();
    
    switch (dateRange) {
      case '30d':
        dateFilter = { gte: new Date(now.setDate(now.getDate() - 30)) };
        break;
      case '90d':
        dateFilter = { gte: new Date(now.setDate(now.getDate() - 90)) };
        break;
      case '1y':
        dateFilter = { gte: new Date(now.setFullYear(now.getFullYear() - 1)) };
        break;
      default:
        dateFilter = {}; // All time
    }

    // Get member journey data with optimized query
    const member_journeyss = await db.member_journeys.findMany({
      where: {
        churchId,
        ...(dateRange !== 'all' && { createdAt: dateFilter })
      },
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            membershipDate: true,
            createdAt: true,
            isActive: true
          }
        }
      }
    });

    // Calculate lifecycle funnel stages
    const stages = {
      VISITOR: { count: 0, percentage: 0, conversionRate: 0 },
      FIRST_TIME_GUEST: { count: 0, percentage: 0, conversionRate: 0 },
      RETURNING_GUEST: { count: 0, percentage: 0, conversionRate: 0 },
      REGULAR_ATTENDEE: { count: 0, percentage: 0, conversionRate: 0 },
      NEW_MEMBER: { count: 0, percentage: 0, conversionRate: 0 },
      ESTABLISHED_MEMBER: { count: 0, percentage: 0, conversionRate: 0 },
      LEADER: { count: 0, percentage: 0, conversionRate: 0 }
    };

    // Count members in each stage
    member_journeyss.forEach(journey => {
      if (stages[journey.currentStage as keyof typeof stages]) {
        stages[journey.currentStage as keyof typeof stages].count++;
      }
    });

    const totalMembers = member_journeyss.length;

    // Calculate percentages and conversion rates
    let previousStageCount = totalMembers;
    const stageOrder = ['VISITOR', 'FIRST_TIME_GUEST', 'RETURNING_GUEST', 'REGULAR_ATTENDEE', 'NEW_MEMBER', 'ESTABLISHED_MEMBER', 'LEADER'];

    stageOrder.forEach((stage, index) => {
      const stageData = stages[stage as keyof typeof stages];
      stageData.percentage = totalMembers > 0 ? (stageData.count / totalMembers) * 100 : 0;
      
      if (index > 0) {
        stageData.conversionRate = previousStageCount > 0 ? (stageData.count / previousStageCount) * 100 : 0;
      } else {
        stageData.conversionRate = 100; // First stage has 100% conversion from itself
      }
      
      previousStageCount = stageData.count;
    });

    // Calculate stage transitions and average time
    const stageTransitions = await db.member_journeys.groupBy({
      by: ['currentStage', 'previousStage'],
      where: {
        churchId,
        previousStage: { not: null },
        ...(dateRange !== 'all' && { updatedAt: dateFilter })
      },
      _count: true
    });

    // Calculate average time in each stage
    const averageTimeInStage = await db.member_journeys.groupBy({
      by: ['currentStage'],
      where: {
        churchId,
        ...(dateRange !== 'all' && { updatedAt: dateFilter })
      },
      _avg: {
        totalDaysInCurrentStage: true
      }
    });

    // Get engagement metrics by stage
    const engagementByStage = await db.member_journeys.groupBy({
      by: ['currentStage'],
      where: {
        churchId,
        ...(dateRange !== 'all' && { lastAnalysisDate: dateFilter })
      },
      _avg: {
        engagementScore: true,
        retentionScore: true
      }
    });

    // Compile funnel analytics
    const funnelAnalytics = {
      conversionFunnel: stages,
      stageTransitions: stageTransitions.reduce((acc, transition) => {
        const key = `${transition.previousStage}->${transition.currentStage}`;
        acc[key] = transition._count;
        return acc;
      }, {} as Record<string, number>),
      averageTimeInStage: averageTimeInStage.reduce((acc, stage) => {
        acc[stage.currentStage] = Math.round(stage._avg.totalDaysInCurrentStage || 0);
        return acc;
      }, {} as Record<string, number>),
      engagementByStage: engagementByStage.reduce((acc, stage) => {
        acc[stage.currentStage] = {
          engagement: Math.round(stage._avg.engagementScore || 0),
          retention: Math.round(stage._avg.retentionScore || 0)
        };
        return acc;
      }, {} as Record<string, any>),
      totalMembers,
      dateRange,
      lastUpdated: new Date().toISOString()
    };

    // Cache the results
    await memberAnalyticsCache.cacheLifecycleFunnel(churchId, funnelAnalytics, dateRange);

    return NextResponse.json(funnelAnalytics);

  } catch (error) {
    console.error('Error fetching member lifecycle funnel:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al obtener datos del embudo de ciclo de vida' },
      { status: 500 }
    );
  }
}