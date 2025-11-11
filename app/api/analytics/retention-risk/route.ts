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
    const cached = await memberAnalyticsCache.getRetentionAlerts(churchId);
    if (cached) {
      return NextResponse.json({
        ...cached,
        cached: true,
        timestamp: new Date().toISOString()
      });
    }

    // Get high-risk members
    const highRiskMembers = await db.memberJourney.findMany({
      where: {
        churchId,
        retentionRisk: { in: ['HIGH', 'CRITICAL'] },
        member: { 
          isActive: true 
        }
      },
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            membershipDate: true
          }
        },
        behavioralPatterns: {
          orderBy: {
            analyzedAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: [
        { retentionScore: 'asc' },
        { lastAnalysisDate: 'desc' }
      ]
    });

    // Get medium risk members for monitoring
    const mediumRiskMembers = await db.memberJourney.findMany({
      where: {
        churchId,
        retentionRisk: 'MEDIUM',
        retentionScore: { lt: 60 },
        member: { 
          isActive: true 
        }
      },
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            membershipDate: true
          }
        }
      },
      orderBy: {
        retentionScore: 'asc'
      },
      take: 15
    });

    // Calculate risk distribution
    const riskDistribution = await db.memberJourney.groupBy({
      by: ['retentionRisk'],
      where: {
        churchId,
        member: { isActive: true }
      },
      _count: true
    });

    const totalActiveMembers = riskDistribution.reduce((sum, risk) => sum + risk._count, 0);

    // Get trend data for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const retentionTrends = await db.memberJourney.findMany({
      where: {
        churchId,
        lastAnalysisDate: {
          gte: sixMonthsAgo
        }
      },
      select: {
        retentionScore: true,
        retentionRisk: true,
        lastAnalysisDate: true
      },
      orderBy: {
        lastAnalysisDate: 'asc'
      }
    });

    // Group trends by month
    const trendsByMonth = retentionTrends.reduce((acc, record) => {
      const monthKey = record.lastAnalysisDate.toISOString().substring(0, 7); // YYYY-MM
      if (!acc[monthKey]) {
        acc[monthKey] = { scores: [], risks: { HIGH: 0, MEDIUM: 0, LOW: 0, CRITICAL: 0 } };
      }
      acc[monthKey].scores.push(record.retentionScore);
      acc[monthKey].risks[record.retentionRisk]++;
      return acc;
    }, {} as Record<string, { scores: number[]; risks: Record<string, number> }>);

    const monthlyTrends = Object.entries(trendsByMonth).map(([month, data]) => ({
      month,
      averageRetention: Math.round(data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length),
      highRiskCount: data.risks.HIGH + data.risks.CRITICAL,
      totalMembers: data.scores.length
    }));

    // Get members who recently moved to higher risk
    const recentRiskIncrease = await db.memberJourney.findMany({
      where: {
        churchId,
        retentionRisk: { in: ['HIGH', 'CRITICAL'] },
        lastAnalysisDate: {
          gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // Last 2 weeks
        },
        member: { isActive: true }
      },
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Calculate intervention recommendations
    const getInterventionStrategy = (journey: any) => {
      const behavioral = journey.behavioralPatterns[0];
      
      if (!behavioral) {
        return {
          type: 'general',
          description: 'Contacto personal para evaluar situación',
          priority: 'medium'
        };
      }

      if (behavioral.dropoutRisk > 0.7) {
        return {
          type: 'urgent',
          description: 'Intervención inmediata - riesgo crítico de abandono',
          priority: 'critical'
        };
      }

      if (behavioral.averageWeeklyAttendance < 0.3) {
        return {
          type: 'attendance',
          description: 'Mejorar asistencia con invitaciones personalizadas',
          priority: 'high'
        };
      }

      if (behavioral.communicationEngagement < 0.2) {
        return {
          type: 'communication',
          description: 'Aumentar engagement en comunicaciones',
          priority: 'medium'
        };
      }

      if (behavioral.ministryParticipation < 0.1) {
        return {
          type: 'ministry',
          description: 'Invitar a participar en ministerios apropiados',
          priority: 'medium'
        };
      }

      return {
        type: 'general',
        description: 'Seguimiento general y apoyo pastoral',
        priority: 'low'
      };
    };

    // Format high-risk alerts with intervention strategies
    const alertsWithStrategies = highRiskMembers.map(journey => {
      const strategy = getInterventionStrategy(journey);
      
      return {
        id: journey.id,
        member: {
          id: journey.member?.id,
          name: `${journey.member?.firstName} ${journey.member?.lastName}`,
          email: journey.member?.email,
          phone: journey.member?.phone,
          membershipDate: journey.member?.membershipDate
        },
        riskLevel: journey.retentionRisk,
        retentionScore: journey.retentionScore,
        currentStage: journey.currentStage,
        daysInCurrentStage: journey.totalDaysInCurrentStage,
        lastAnalysis: journey.lastAnalysisDate,
        intervention: strategy,
        contactInfo: {
          hasPhone: Boolean(journey.member?.phone),
          hasEmail: Boolean(journey.member?.email),
          preferredContact: journey.member?.phone ? 'phone' : 'email'
        }
      };
    });

    // Calculate summary statistics
    const riskStats = {
      critical: riskDistribution.find(r => r.retentionRisk === 'CRITICAL')?._count || 0,
      high: riskDistribution.find(r => r.retentionRisk === 'HIGH')?._count || 0,
      medium: riskDistribution.find(r => r.retentionRisk === 'MEDIUM')?._count || 0,
      low: riskDistribution.find(r => r.retentionRisk === 'LOW')?._count || 0
    };

    const retentionAlertData = {
      summary: {
        totalActiveMembers,
        highRiskCount: riskStats.critical + riskStats.high,
        mediumRiskCount: riskStats.medium,
        lowRiskCount: riskStats.low,
        recentRiskIncrease: recentRiskIncrease.length,
        interventionRequired: alertsWithStrategies.filter(alert => 
          ['critical', 'high'].includes(alert.intervention.priority)
        ).length
      },
      riskDistribution: [
        { level: 'CRITICAL', count: riskStats.critical, percentage: Math.round((riskStats.critical / totalActiveMembers) * 100) },
        { level: 'HIGH', count: riskStats.high, percentage: Math.round((riskStats.high / totalActiveMembers) * 100) },
        { level: 'MEDIUM', count: riskStats.medium, percentage: Math.round((riskStats.medium / totalActiveMembers) * 100) },
        { level: 'LOW', count: riskStats.low, percentage: Math.round((riskStats.low / totalActiveMembers) * 100) }
      ],
      highRiskAlerts: alertsWithStrategies,
      mediumRiskWatch: mediumRiskMembers.map(journey => ({
        id: journey.id,
        member: {
          id: journey.member?.id,
          name: `${journey.member?.firstName} ${journey.member?.lastName}`,
          email: journey.member?.email
        },
        retentionScore: journey.retentionScore,
        currentStage: journey.currentStage,
        riskLevel: journey.retentionRisk
      })),
      trends: {
        monthly: monthlyTrends.slice(-6),
        recentChanges: recentRiskIncrease.map(journey => ({
          memberId: journey.member?.id,
          memberName: `${journey.member?.firstName} ${journey.member?.lastName}`,
          newRiskLevel: journey.retentionRisk,
          analysisDate: journey.lastAnalysisDate
        }))
      },
      interventionStrategies: {
        urgent: alertsWithStrategies.filter(alert => alert.intervention.priority === 'critical').length,
        high: alertsWithStrategies.filter(alert => alert.intervention.priority === 'high').length,
        medium: alertsWithStrategies.filter(alert => alert.intervention.priority === 'medium').length,
        low: alertsWithStrategies.filter(alert => alert.intervention.priority === 'low').length
      },
      recommendations: [
        {
          title: 'Contacto Inmediato',
          description: `${riskStats.critical} miembros necesitan intervención inmediata`,
          action: 'Programar llamadas pastorales en las próximas 48 horas',
          priority: 'critical'
        },
        {
          title: 'Seguimiento Semanal',
          description: `${riskStats.high} miembros en riesgo alto`,
          action: 'Implementar seguimiento semanal personalizado',
          priority: 'high'
        },
        {
          title: 'Programa de Retención',
          description: 'Desarrollar programa preventivo para miembros en riesgo medio',
          action: 'Crear grupos de apoyo y actividades de engagement',
          priority: 'medium'
        }
      ],
      lastUpdated: new Date().toISOString()
    };

    // Cache the results
    await memberAnalyticsCache.cacheRetentionAlerts(churchId, retentionAlertData);

    return NextResponse.json(retentionAlertData);

  } catch (error) {
    console.error('Error fetching retention risk alerts:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al obtener alertas de retención' },
      { status: 500 }
    );
  }
}