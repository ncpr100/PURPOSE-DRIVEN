import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface ExecutiveReport {
  reportPeriod: {
    startDate: string;
    endDate: string;
    type: 'monthly' | 'quarterly' | 'yearly';
  };
  churchHealthScore: {
    overall: number;
    breakdown: {
      growth: number;
      engagement: number;
      financial: number;
      ministry: number;
      community: number;
    };
  };
  keyMetrics: {
    membership: {
      total: number;
      growth: number;
      retention: number;
      newMembers: number;
    };
    attendance: {
      average: number;
      trend: number;
      eventsHeld: number;
      attendanceRate: number;
    };
    financial: {
      totalDonations: number;
      averageDonation: number;
      donorCount: number;
      financialGrowth: number;
    };
    ministry: {
      activeVolunteers: number;
      ministries: number;
      outreachEvents: number;
      communityImpact: number;
    };
  };
  achievements: Array<{
    category: string;
    title: string;
    metric: string;
    improvement: number;
  }>;
  challenges: Array<{
    area: string;
    issue: string;
    impact: 'low' | 'medium' | 'high';
    recommendation: string;
  }>;
  trends: {
    membershipTrend: Array<{ period: string; value: number }>;
    givingTrend: Array<{ period: string; value: number }>;
    engagementTrend: Array<{ period: string; value: number }>;
  };
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    area: string;
    action: string;
    expectedImpact: string;
    timeline: string;
  }>;
  nextSteps: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const churchId = session.user.churchId;
    if (!churchId) {
      return NextResponse.json({ error: 'Church not found' }, { status: 404 });
    }

    const searchParams = request.nextUrl.searchParams;
    const reportType = searchParams.get('type') as 'monthly' | 'quarterly' | 'yearly' || 'monthly';
    
    const endDate = new Date();
    const startDate = new Date();
    
    switch (reportType) {
      case 'monthly':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'quarterly':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case 'yearly':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    // Gather comprehensive church data
    const [
      membershipData,
      attendanceData,
      financialData,
      ministryData,
      eventData,
      communicationData,
      automationData
    ] = await Promise.all([
      // Membership analytics
      Promise.all([
        db.member.count({ where: { churchId, isActive: true } }),
        db.member.count({ 
          where: { 
            churchId, 
            createdAt: { gte: startDate, lte: endDate },
            isActive: true 
          } 
        }),
        db.member.findMany({
          where: { churchId },
          select: { createdAt: true, updatedAt: true, isActive: true }
        })
      ]),

      // Attendance data
      Promise.all([
        db.checkIn.findMany({
          where: { 
            churchId,
            checkedInAt: { gte: startDate, lte: endDate }
          }
        }),
        db.event.findMany({
          where: { 
            churchId,
            startDate: { gte: startDate, lte: endDate }
          },
          select: { 
            startDate: true, 
            capacity: true, 
            category: true,
            status: true
          }
        })
      ]),

      // Financial data
      Promise.all([
        db.donation.aggregate({
          where: { 
            churchId,
            donationDate: { gte: startDate, lte: endDate },
            status: 'COMPLETADA'
          },
          _sum: { amount: true },
          _count: { id: true },
          _avg: { amount: true }
        }),
        db.donation.findMany({
          where: { 
            churchId,
            donationDate: { gte: startDate, lte: endDate },
            status: 'COMPLETADA'
          },
          select: { donationDate: true, amount: true, memberId: true }
        })
      ]),

      // Ministry data
      Promise.all([
        db.volunteerAssignment.count({
          where: { 
            churchId,
            createdAt: { gte: startDate, lte: endDate }
          }
        }),
        db.volunteer.count({
          where: { churchId, isActive: true }
        }),
        db.volunteerAssignment.findMany({
          where: { churchId },
          include: { volunteer: true }
        })
      ]),

      // Event data
      db.event.findMany({
        where: { 
          churchId,
          startDate: { gte: startDate, lte: endDate }
        }
      }),

      // Communication data
      db.communication.findMany({
        where: { 
          churchId,
          sentAt: { gte: startDate, lte: endDate }
        }
      }),

      // Automation data
      db.automationRule.findMany({
        where: { churchId, isActive: true }
      })
    ]);

    // Generate executive report
    const report = generateExecutiveReport(
      reportType,
      startDate,
      endDate,
      membershipData,
      attendanceData,
      financialData,
      ministryData,
      eventData,
      communicationData,
      automationData
    );

    return NextResponse.json(report);

  } catch (error) {
    console.error('Error generating executive report:', error);
    return NextResponse.json(
      { error: 'Error generating executive report' },
      { status: 500 }
    );
  }
}

function generateExecutiveReport(
  reportType: 'monthly' | 'quarterly' | 'yearly',
  startDate: Date,
  endDate: Date,
  membershipData: any[],
  attendanceData: any[],
  financialData: any[],
  ministryData: any[],
  eventData: any[],
  communicationData: any[],
  automationData: any[]
): ExecutiveReport {

  const [totalMembers, newMembers, allMembers] = membershipData;
  const [checkIns, events] = attendanceData;
  const [donationStats, donations] = financialData;
  const [newVolunteerAssignments, totalVolunteers, allVolunteerAssignments] = ministryData;

  // Calculate church health score
  const healthScore = calculateChurchHealthScore({
    memberGrowth: newMembers,
    totalMembers,
    checkIns,
    events,
    donations: donationStats,
    volunteers: totalVolunteers,
    automations: automationData.length
  });

  // Calculate key metrics
  const keyMetrics = {
    membership: {
      total: totalMembers,
      growth: calculateGrowthRate(allMembers, startDate),
      retention: calculateRetentionRate(allMembers),
      newMembers
    },
    attendance: {
      average: calculateAverageAttendance(events),
      trend: calculateAttendanceTrend(events),
      eventsHeld: events.length,
      attendanceRate: calculateAttendanceRate(events)
    },
    financial: {
      totalDonations: donationStats._sum?.amount || 0,
      averageDonation: donationStats._avg?.amount || 0,
      donorCount: new Set(donations.map(d => d.memberId)).size,
      financialGrowth: calculateFinancialGrowth(donations)
    },
    ministry: {
      activeVolunteers: totalVolunteers,
      ministries: new Set(allVolunteerAssignments.map(va => va.volunteer?.category)).size,
      outreachEvents: events.filter(e => e.eventType === 'OUTREACH').length,
      communityImpact: calculateCommunityImpact(events, allVolunteerAssignments)
    }
  };

  // Generate achievements
  const achievements = generateAchievements(keyMetrics, healthScore);

  // Identify challenges
  const challenges = identifyChallenges(keyMetrics, healthScore);

  // Calculate trends
  const trends = calculateTrends(allMembers, donations, events, startDate, endDate);

  // Generate recommendations
  const recommendations = generateRecommendations(keyMetrics, challenges, healthScore);

  // Define next steps
  const nextSteps = generateNextSteps(recommendations, healthScore);

  return {
    reportPeriod: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      type: reportType
    },
    churchHealthScore: healthScore,
    keyMetrics,
    achievements,
    challenges,
    trends,
    recommendations,
    nextSteps
  };
}

function calculateChurchHealthScore(data: any) {
  const growth = Math.min(100, Math.max(0, (data.memberGrowth / Math.max(1, data.totalMembers * 0.02)) * 100));
  const engagement = Math.min(100, Math.max(0, (data.checkIns.length / Math.max(1, data.totalMembers * 4)) * 100));
  const financial = Math.min(100, Math.max(0, data.donations._count ? 75 : 25));
  const ministry = Math.min(100, Math.max(0, (data.volunteers / Math.max(1, data.totalMembers * 0.1)) * 100));
  const community = Math.min(100, Math.max(0, data.automations > 0 ? 80 : 40));

  const overall = Math.round((growth + engagement + financial + ministry + community) / 5);

  return {
    overall,
    breakdown: {
      growth: Math.round(growth),
      engagement: Math.round(engagement),
      financial: Math.round(financial),
      ministry: Math.round(ministry),
      community: Math.round(community)
    }
  };
}

function calculateGrowthRate(members: any[], startDate: Date): number {
  const previousPeriodStart = new Date(startDate);
  previousPeriodStart.setDate(previousPeriodStart.getDate() - (new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const currentPeriodMembers = members.filter(m => 
    new Date(m.createdAt) >= startDate
  ).length;

  const previousPeriodMembers = members.filter(m => 
    new Date(m.createdAt) >= previousPeriodStart && new Date(m.createdAt) < startDate
  ).length;

  return previousPeriodMembers > 0 
    ? Math.round(((currentPeriodMembers - previousPeriodMembers) / previousPeriodMembers) * 100)
    : currentPeriodMembers > 0 ? 100 : 0;
}

function calculateRetentionRate(members: any[]): number {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const activeMembers = members.filter(m => 
    m.isActive && (!m.lastActivityDate || new Date(m.lastActivityDate) >= thirtyDaysAgo)
  ).length;

  return members.length > 0 ? Math.round((activeMembers / members.length) * 100) : 0;
}

function calculateAverageAttendance(events: any[]): number {
  const eventsWithAttendance = events.filter(e => e.actualAttendance);
  return eventsWithAttendance.length > 0 
    ? Math.round(eventsWithAttendance.reduce((sum, e) => sum + e.actualAttendance, 0) / eventsWithAttendance.length)
    : 0;
}

function calculateAttendanceTrend(events: any[]): number {
  if (events.length < 2) return 0;

  const recentEvents = events.slice(-5);
  const olderEvents = events.slice(-10, -5);

  const recentAvg = calculateAverageAttendance(recentEvents);
  const olderAvg = calculateAverageAttendance(olderEvents);

  return olderAvg > 0 ? Math.round(((recentAvg - olderAvg) / olderAvg) * 100) : 0;
}

function calculateAttendanceRate(events: any[]): number {
  const eventsWithBothMetrics = events.filter(e => e.expectedAttendance && e.actualAttendance);
  if (eventsWithBothMetrics.length === 0) return 0;

  const totalExpected = eventsWithBothMetrics.reduce((sum, e) => sum + e.expectedAttendance, 0);
  const totalActual = eventsWithBothMetrics.reduce((sum, e) => sum + e.actualAttendance, 0);

  return totalExpected > 0 ? Math.round((totalActual / totalExpected) * 100) : 0;
}

function calculateFinancialGrowth(donations: any[]): number {
  const midpoint = Math.floor(donations.length / 2);
  const firstHalf = donations.slice(0, midpoint);
  const secondHalf = donations.slice(midpoint);

  const firstHalfTotal = firstHalf.reduce((sum, d) => sum + d.amount, 0);
  const secondHalfTotal = secondHalf.reduce((sum, d) => sum + d.amount, 0);

  return firstHalfTotal > 0 ? Math.round(((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100) : 0;
}

function calculateCommunityImpact(events: any[], volunteerAssignments: any[]): number {
  const outreachEvents = events.filter(e => e.eventType === 'OUTREACH').length;
  const activeVolunteers = new Set(volunteerAssignments.map(va => va.volunteer?.id)).size;
  
  return Math.min(100, outreachEvents * 10 + activeVolunteers * 2);
}

function generateAchievements(keyMetrics: any, healthScore: any): ExecutiveReport['achievements'] {
  const achievements = [];

  if (keyMetrics.membership.growth > 10) {
    achievements.push({
      category: 'Crecimiento',
      title: 'Excelente Crecimiento de Membresía',
      metric: `${keyMetrics.membership.growth}% de crecimiento`,
      improvement: keyMetrics.membership.growth
    });
  }

  if (keyMetrics.attendance.attendanceRate > 80) {
    achievements.push({
      category: 'Participación',
      title: 'Alta Tasa de Asistencia',
      metric: `${keyMetrics.attendance.attendanceRate}% de asistencia`,
      improvement: keyMetrics.attendance.attendanceRate
    });
  }

  if (keyMetrics.financial.financialGrowth > 15) {
    achievements.push({
      category: 'Finanzas',
      title: 'Crecimiento Financiero Sólido',
      metric: `${keyMetrics.financial.financialGrowth}% de crecimiento`,
      improvement: keyMetrics.financial.financialGrowth
    });
  }

  if (healthScore.overall > 80) {
    achievements.push({
      category: 'Salud General',
      title: 'Excelente Salud de la Iglesia',
      metric: `${healthScore.overall}/100 puntuación`,
      improvement: healthScore.overall
    });
  }

  return achievements;
}

function identifyChallenges(keyMetrics: any, healthScore: any): ExecutiveReport['challenges'] {
  const challenges = [];

  if (keyMetrics.membership.retention < 70) {
    challenges.push({
      area: 'Retención de Miembros',
      issue: 'Baja tasa de retención de miembros',
      impact: 'high' as const,
      recommendation: 'Implementar programa de seguimiento y mentoreo'
    });
  }

  if (keyMetrics.attendance.attendanceRate < 60) {
    challenges.push({
      area: 'Asistencia',
      issue: 'Baja asistencia a eventos',
      impact: 'medium' as const,
      recommendation: 'Revisar programación y formato de eventos'
    });
  }

  if (keyMetrics.financial.donorCount < keyMetrics.membership.total * 0.3) {
    challenges.push({
      area: 'Donaciones',
      issue: 'Baja participación en donaciones',
      impact: 'medium' as const,
      recommendation: 'Educación sobre mayordomía y facilitación de donaciones'
    });
  }

  if (keyMetrics.ministry.activeVolunteers < keyMetrics.membership.total * 0.1) {
    challenges.push({
      area: 'Voluntariado',
      issue: 'Pocos miembros involucrados en ministerios',
      impact: 'medium' as const,
      recommendation: 'Campaña de reclutamiento y entrenamiento de voluntarios'
    });
  }

  return challenges;
}

function calculateTrends(members: any[], donations: any[], events: any[], startDate: Date, endDate: Date): ExecutiveReport['trends'] {
  // Generate trend data for the last 6 periods
  const periods = 6;
  const periodLength = (endDate.getTime() - startDate.getTime()) / periods;

  const membershipTrend = [];
  const givingTrend = [];
  const engagementTrend = [];

  for (let i = 0; i < periods; i++) {
    const periodStart = new Date(startDate.getTime() + i * periodLength);
    const periodEnd = new Date(startDate.getTime() + (i + 1) * periodLength);
    
    const periodMembers = members.filter(m => 
      new Date(m.createdAt) >= periodStart && new Date(m.createdAt) < periodEnd
    ).length;

    const periodDonations = donations
      .filter(d => new Date(d.donationDate) >= periodStart && new Date(d.donationDate) < periodEnd)
      .reduce((sum, d) => sum + d.amount, 0);

    const periodEvents = events.filter(e => 
      new Date(e.startDate) >= periodStart && new Date(e.startDate) < periodEnd
    ).length;

    membershipTrend.push({
      period: `Período ${i + 1}`,
      value: periodMembers
    });

    givingTrend.push({
      period: `Período ${i + 1}`,
      value: periodDonations
    });

    engagementTrend.push({
      period: `Período ${i + 1}`,
      value: periodEvents
    });
  }

  return {
    membershipTrend,
    givingTrend,
    engagementTrend
  };
}

function generateRecommendations(keyMetrics: any, challenges: any[], healthScore: any): ExecutiveReport['recommendations'] {
  const recommendations = [];

  // High priority recommendations
  if (healthScore.overall < 60) {
    recommendations.push({
      priority: 'high' as const,
      area: 'Salud General',
      action: 'Implementar plan integral de revitalización',
      expectedImpact: 'Mejora significativa en todos los indicadores',
      timeline: '3-6 meses'
    });
  }

  // Medium priority recommendations
  if (keyMetrics.membership.growth < 5) {
    recommendations.push({
      priority: 'medium' as const,
      area: 'Crecimiento',
      action: 'Desarrollar estrategia de evangelismo y alcance',
      expectedImpact: 'Aumento en nuevos miembros del 15-20%',
      timeline: '2-4 meses'
    });
  }

  if (keyMetrics.ministry.activeVolunteers < keyMetrics.membership.total * 0.15) {
    recommendations.push({
      priority: 'medium' as const,
      area: 'Ministerio',
      action: 'Crear programa de identificación y desarrollo de talentos',
      expectedImpact: 'Duplicar participación en ministerios',
      timeline: '1-3 meses'
    });
  }

  // Low priority recommendations
  recommendations.push({
    priority: 'low' as const,
    area: 'Tecnología',
    action: 'Optimizar uso de herramientas de automatización',
    expectedImpact: 'Eficiencia operativa mejorada',
    timeline: '1-2 meses'
  });

  return recommendations;
}

function generateNextSteps(recommendations: any[], healthScore: any): ExecutiveReport['nextSteps'] {
  const immediate = [
    'Revisar métricas clave semanalmente',
    'Identificar líderes para áreas de mejora',
    'Planificar reunión de estrategia pastoral'
  ];

  const shortTerm = [
    'Implementar recomendaciones de alta prioridad',
    'Desarrollar programas de retención de miembros',
    'Optimizar procesos de seguimiento'
  ];

  const longTerm = [
    'Establecer plan estratégico anual',
    'Desarrollar liderazgo para crecimiento sostenible',
    'Implementar sistema de medición continua'
  ];

  return {
    immediate,
    shortTerm,
    longTerm
  };
}