import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface PredictiveAnalytics {
  memberRetention: {
    predicted30Day: number;
    predicted90Day: number;
    confidenceLevel: number;
    factors: Array<{
      factor: string;
      impact: number;
      description: string;
    }>;
  };
  givingTrends: {
    predictedNextMonth: number;
    seasonalVariation: number;
    donorRetentionRate: number;
    averageGiftTrend: 'increasing' | 'decreasing' | 'stable';
  };
  engagementForecast: {
    eventAttendanceTrend: number;
    volunteerParticipationTrend: number;
    communicationEngagement: number;
    overallEngagementScore: number;
  };
  churchGrowth: {
    projectedMonthlyGrowth: number;
    projected6MonthMembers: number;
    projectedYearlyGrowth: number;
    growthFactors: string[];
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

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 365); // 1 year of data for predictions

    // Gather historical data for predictive modeling
    const [
      memberHistoryData,
      donationHistoryData,
      eventHistoryData,
      engagementData
    ] = await Promise.all([
      // Member growth history
      db.member.findMany({
        where: { 
          churchId,
          createdAt: { gte: startDate, lte: endDate }
        },
        select: { 
          createdAt: true,
          isActive: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'asc' }
      }),

      // Donation history
      db.donation.findMany({
        where: { 
          churchId,
          donationDate: { gte: startDate, lte: endDate },
          status: 'COMPLETADA'
        },
        select: { 
          amount: true,
          donationDate: true,
          memberId: true
        },
        orderBy: { donationDate: 'asc' }
      }),

      // Event attendance history
      db.event.findMany({
        where: { 
          churchId,
          startDate: { gte: startDate, lte: endDate }
        },
        select: { 
          startDate: true,
          capacity: true,
          category: true
        },
        orderBy: { startDate: 'asc' }
      }),

      // Engagement metrics
      Promise.all([
        db.checkIn.count({
          where: { 
            churchId,
            checkedInAt: { gte: startDate, lte: endDate }
          }
        }),
        db.volunteerAssignment.count({
          where: { 
            churchId,
            createdAt: { gte: startDate, lte: endDate }
          }
        }),
        db.communication.count({
          where: { 
            churchId,
            sentAt: { gte: startDate, lte: endDate }
          }
        })
      ])
    ]);

    // Calculate predictive analytics
    const analytics: PredictiveAnalytics = {
      memberRetention: calculateMemberRetention(memberHistoryData),
      givingTrends: calculateGivingTrends(donationHistoryData),
      engagementForecast: calculateEngagementForecast(eventHistoryData, engagementData),
      churchGrowth: calculateChurchGrowthProjection(memberHistoryData, donationHistoryData, eventHistoryData)
    };

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Error in predictive analytics:', error);
    return NextResponse.json(
      { error: 'Error calculating predictive analytics' },
      { status: 500 }
    );
  }
}

function calculateMemberRetention(memberData: any[]): PredictiveAnalytics['memberRetention'] {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  // Calculate retention rates
  const newMembers30Days = memberData.filter(m => 
    new Date(m.createdAt) >= thirtyDaysAgo
  ).length;

  const newMembers90Days = memberData.filter(m => 
    new Date(m.createdAt) >= ninetyDaysAgo
  ).length;

  const activeMembers30Days = memberData.filter(m => 
    m.lastActivityDate && new Date(m.lastActivityDate) >= thirtyDaysAgo
  ).length;

  const activeMembers90Days = memberData.filter(m => 
    m.lastActivityDate && new Date(m.lastActivityDate) >= ninetyDaysAgo
  ).length;

  // Predictive modeling (simplified linear regression approach)
  const retention30Day = newMembers30Days > 0 ? (activeMembers30Days / newMembers30Days) * 100 : 85;
  const retention90Day = newMembers90Days > 0 ? (activeMembers90Days / newMembers90Days) * 100 : 75;

  return {
    predicted30Day: Math.round(retention30Day),
    predicted90Day: Math.round(retention90Day),
    confidenceLevel: Math.min(95, Math.max(60, memberData.length / 10)), // Confidence based on data volume
    factors: [
      {
        factor: 'Recent Growth',
        impact: newMembers30Days > 5 ? 15 : -5,
        description: `${newMembers30Days} nuevos miembros en 30 días`
      },
      {
        factor: 'Engagement Level',
        impact: retention30Day > 80 ? 10 : -10,
        description: `${Math.round(retention30Day)}% tasa de actividad reciente`
      },
      {
        factor: 'Historical Stability',
        impact: retention90Day > 70 ? 8 : -8,
        description: `${Math.round(retention90Day)}% retención a 90 días`
      }
    ]
  };
}

function calculateGivingTrends(donationData: any[]): PredictiveAnalytics['givingTrends'] {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const recentDonations = donationData.filter(d => 
    new Date(d.donationDate) >= thirtyDaysAgo
  );

  const previousDonations = donationData.filter(d => 
    new Date(d.donationDate) >= sixtyDaysAgo && new Date(d.donationDate) < thirtyDaysAgo
  );

  const recentTotal = recentDonations.reduce((sum, d) => sum + d.amount, 0);
  const previousTotal = previousDonations.reduce((sum, d) => sum + d.amount, 0);

  const monthlyTrend = previousTotal > 0 ? ((recentTotal - previousTotal) / previousTotal) : 0;
  const predictedNextMonth = recentTotal * (1 + monthlyTrend);

  // Calculate donor retention
  const recentDonors = new Set(recentDonations.map(d => d.memberId));
  const previousDonors = new Set(previousDonations.map(d => d.memberId));
  const retainedDonors = [...recentDonors].filter(id => previousDonors.has(id));
  const donorRetentionRate = previousDonors.size > 0 ? (retainedDonors.length / previousDonors.size) * 100 : 80;

  // Average gift analysis
  const recentAvg = recentDonations.length > 0 ? recentTotal / recentDonations.length : 0;
  const previousAvg = previousDonations.length > 0 ? previousTotal / previousDonations.length : 0;
  
  let averageGiftTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (recentAvg > previousAvg * 1.05) averageGiftTrend = 'increasing';
  else if (recentAvg < previousAvg * 0.95) averageGiftTrend = 'decreasing';

  return {
    predictedNextMonth: Math.round(predictedNextMonth),
    seasonalVariation: Math.round(monthlyTrend * 100),
    donorRetentionRate: Math.round(donorRetentionRate),
    averageGiftTrend
  };
}

function calculateEngagementForecast(eventData: any[], engagementMetrics: number[]): PredictiveAnalytics['engagementForecast'] {
  const [checkIns, volunteerAssignments, communications] = engagementMetrics;

  // Event attendance trend
  const recentEvents = eventData.slice(-10); // Last 10 events
  const attendanceRates = recentEvents
    .filter(e => e.expectedAttendance && e.actualAttendance)
    .map(e => (e.actualAttendance / e.expectedAttendance) * 100);
  
  const avgAttendanceRate = attendanceRates.length > 0 
    ? attendanceRates.reduce((sum, rate) => sum + rate, 0) / attendanceRates.length 
    : 75;

  // Calculate trends (simplified)
  const eventTrend = Math.round(avgAttendanceRate);
  const volunteerTrend = Math.min(100, Math.max(0, (volunteerAssignments / 30) * 10)); // Normalize to percentage
  const communicationEngagement = Math.min(100, Math.max(0, (communications / 100) * 10)); // Normalize to percentage

  const overallScore = Math.round((eventTrend + volunteerTrend + communicationEngagement) / 3);

  return {
    eventAttendanceTrend: eventTrend,
    volunteerParticipationTrend: volunteerTrend,
    communicationEngagement: communicationEngagement,
    overallEngagementScore: overallScore
  };
}

function calculateChurchGrowthProjection(memberData: any[], donationData: any[], eventData: any[]): PredictiveAnalytics['churchGrowth'] {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  // Calculate monthly growth rate
  const recentMembers = memberData.filter(m => new Date(m.createdAt) >= thirtyDaysAgo).length;
  const previousMembers = memberData.filter(m => 
    new Date(m.createdAt) >= ninetyDaysAgo && new Date(m.createdAt) < thirtyDaysAgo
  ).length / 2; // Average monthly for previous 2 months

  const monthlyGrowthRate = previousMembers > 0 ? (recentMembers / previousMembers) - 1 : 0.05; // Default 5% if no data

  const currentMemberCount = memberData.length;
  const projected6Month = Math.round(currentMemberCount * Math.pow(1 + monthlyGrowthRate, 6));
  const projectedYearly = Math.round(monthlyGrowthRate * 12 * 100);

  // Identify growth factors
  const growthFactors = [];
  if (recentMembers > 3) growthFactors.push('Crecimiento de membresía activo');
  if (donationData.length > 50) growthFactors.push('Base de donantes sólida');
  if (eventData.length > 10) growthFactors.push('Programación de eventos activa');
  if (growthFactors.length === 0) growthFactors.push('Oportunidades de crecimiento identificadas');

  return {
    projectedMonthlyGrowth: Math.round(monthlyGrowthRate * 100),
    projected6MonthMembers: projected6Month,
    projectedYearlyGrowth: projectedYearly,
    growthFactors
  };
}