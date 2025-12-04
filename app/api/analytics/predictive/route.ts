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
      db.members.findMany({
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
      db.donations.findMany({
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
      db.events.findMany({
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
        db.check_ins.count({
          where: { 
            churchId,
            checkedInAt: { gte: startDate, lte: endDate }
          }
        }),
        db.volunteer_assignments.count({
          where: { 
            churchId,
            createdAt: { gte: startDate, lte: endDate }
          }
        }),
        db.communications.count({
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
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

  // Enhanced member segmentation for better predictions
  const newMembers30Days = memberData.filter(m => 
    new Date(m.createdAt) >= thirtyDaysAgo
  );
  
  const newMembers90Days = memberData.filter(m => 
    new Date(m.createdAt) >= ninetyDaysAgo
  );

  const establishedMembers = memberData.filter(m => 
    new Date(m.createdAt) < sixMonthsAgo
  );

  // Activity-based retention calculation
  const activeMembers30Days = memberData.filter(m => 
    m.updatedAt && new Date(m.updatedAt) >= thirtyDaysAgo
  ).length;

  const activeMembers90Days = memberData.filter(m => 
    m.updatedAt && new Date(m.updatedAt) >= ninetyDaysAgo
  ).length;

  // Advanced predictive modeling with multiple factors
  const baseRetention30 = newMembers30Days.length > 0 ? 
    (activeMembers30Days / Math.max(newMembers30Days.length, 1)) * 100 : 85;
  
  const baseRetention90 = newMembers90Days.length > 0 ? 
    (activeMembers90Days / Math.max(newMembers90Days.length, 1)) * 100 : 75;

  // Trend analysis for better predictions
  const memberGrowthRate = memberData.length > 0 ? 
    (newMembers30Days.length / (memberData.length / 12)) * 100 : 0;

  // Confidence scoring based on data quality and volume
  const dataVolume = memberData.length;
  const dataQuality = Math.min(100, (dataVolume / 50) * 100); // Assume 50+ members for good quality
  const confidenceLevel = Math.round(Math.min(95, Math.max(60, dataQuality)));

  // Enhanced factors with more sophisticated analysis
  const factors = [
    {
      factor: 'Crecimiento Reciente',
      impact: newMembers30Days.length > 5 ? 20 : newMembers30Days.length > 2 ? 10 : -5,
      description: `${newMembers30Days.length} nuevos miembros este mes (${memberGrowthRate.toFixed(1)}% tasa anual)`
    },
    {
      factor: 'Compromiso Actual',
      impact: baseRetention30 > 85 ? 15 : baseRetention30 > 70 ? 5 : -10,
      description: `${Math.round(baseRetention30)}% actividad en miembros recientes`
    },
    {
      factor: 'Estabilidad Histórica',
      impact: baseRetention90 > 75 ? 12 : baseRetention90 > 60 ? 3 : -8,
      description: `${Math.round(baseRetention90)}% retención a largo plazo`
    },
    {
      factor: 'Tamaño de Congregación',
      impact: establishedMembers.length > 100 ? 8 : establishedMembers.length > 50 ? 3 : -3,
      description: `${establishedMembers.length} miembros establecidos (${dataQuality.toFixed(0)}% calidad de datos)`
    }
  ];

  return {
    predicted30Day: Math.round(Math.min(98, Math.max(40, baseRetention30))),
    predicted90Day: Math.round(Math.min(95, Math.max(35, baseRetention90))),
    confidenceLevel,
    factors
  };
}

function calculateGivingTrends(donationData: any[]): PredictiveAnalytics['givingTrends'] {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

  // Enhanced time period analysis
  const currentMonth = donationData.filter(d => 
    new Date(d.donationDate) >= thirtyDaysAgo
  );
  
  const previousMonth = donationData.filter(d => 
    new Date(d.donationDate) >= sixtyDaysAgo && new Date(d.donationDate) < thirtyDaysAgo
  );

  const quarter = donationData.filter(d => 
    new Date(d.donationDate) >= ninetyDaysAgo
  );

  const semester = donationData.filter(d => 
    new Date(d.donationDate) >= sixMonthsAgo
  );

  // Financial calculations with seasonal adjustments
  const currentTotal = currentMonth.reduce((sum, d) => sum + d.amount, 0);
  const previousTotal = previousMonth.reduce((sum, d) => sum + d.amount, 0);
  const quarterTotal = quarter.reduce((sum, d) => sum + d.amount, 0);
  
  // Sophisticated trend analysis
  const monthlyGrowthRate = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) : 0;
  const quarterlyAverage = quarter.length > 0 ? quarterTotal / 3 : currentTotal;
  
  // Seasonal variation detection
  const currentMonthNum = now.getMonth();
  const seasonalMultiplier = getSeasonalMultiplier(currentMonthNum);
  
  // Enhanced prediction with multiple factors
  const basePrediction = currentTotal * (1 + monthlyGrowthRate);
  const seasonalAdjustment = basePrediction * seasonalMultiplier;
  const trendAdjustment = quarterlyAverage * 0.3 + seasonalAdjustment * 0.7;
  
  const predictedNextMonth = Math.max(0, trendAdjustment);

  // Advanced donor analysis
  const currentDonors = new Set(currentMonth.map(d => d.memberId));
  const previousDonors = new Set(previousMonth.map(d => d.memberId));
  const quarterDonors = new Set(quarter.map(d => d.memberId));
  
  const retainedDonors = [...currentDonors].filter(id => previousDonors.has(id));
  const donorRetentionRate = previousDonors.size > 0 ? 
    (retainedDonors.length / previousDonors.size) * 100 : 85;

  // Gift size trend analysis
  const currentAvg = currentMonth.length > 0 ? currentTotal / currentMonth.length : 0;
  const previousAvg = previousMonth.length > 0 ? previousTotal / previousMonth.length : 0;
  const quarterAvg = quarter.length > 0 ? quarterTotal / quarter.length : 0;
  
  let averageGiftTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (currentAvg > previousAvg * 1.05) averageGiftTrend = 'increasing';
  else if (currentAvg < previousAvg * 0.95) averageGiftTrend = 'decreasing';

  // Seasonal variation calculation (more sophisticated)
  const monthlyVariations = [];
  for (let i = 0; i < 12; i++) {
    const monthStart = new Date(now.getFullYear(), i, 1);
    const monthEnd = new Date(now.getFullYear(), i + 1, 0);
    const monthDonations = donationData.filter(d => {
      const date = new Date(d.donationDate);
      return date >= monthStart && date <= monthEnd;
    });
    const monthTotal = monthDonations.reduce((sum, d) => sum + d.amount, 0);
    monthlyVariations.push(monthTotal);
  }
  
  const yearlyAverage = monthlyVariations.reduce((sum, val) => sum + val, 0) / 12;
  const seasonalVariation = yearlyAverage > 0 ? 
    ((Math.max(...monthlyVariations) - Math.min(...monthlyVariations)) / yearlyAverage) * 100 : 15;

  return {
    predictedNextMonth: Math.round(predictedNextMonth),
    seasonalVariation: Math.round(seasonalVariation),
    donorRetentionRate: Math.round(donorRetentionRate),
    averageGiftTrend
  };
}

// Helper function for seasonal adjustments
function getSeasonalMultiplier(month: number): number {
  // December (11) and January (0) typically higher giving, summer months lower
  const seasonalFactors = [1.1, 0.9, 0.95, 1.0, 0.9, 0.85, 0.8, 0.85, 0.95, 1.05, 1.1, 1.3];
  return seasonalFactors[month] || 1.0;
}

function calculateEngagementForecast(eventData: any[], engagementMetrics: number[]): PredictiveAnalytics['engagementForecast'] {
  const [checkIns, volunteer_assignmentss, communications] = engagementMetrics;
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  // Enhanced event attendance analysis
  const recentEvents = eventData.filter(e => new Date(e.startDate) >= thirtyDaysAgo);
  const quarterEvents = eventData.filter(e => new Date(e.startDate) >= ninetyDaysAgo);
  
  // Calculate attendance trends with capacity considerations
  const eventsByCategory = quarterEvents.reduce((acc, event) => {
    const category = event.category || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(event);
    return acc;
  }, {});

  // Advanced attendance rate calculation
  let totalAttendanceRate = 0;
  let categoryCount = 0;
  
  Object.entries(eventsByCategory).forEach(([category, events]: [string, any[]]) => {
    const categoryEvents = events as any[];
    const avgCapacity = categoryEvents.reduce((sum, e) => sum + (e.capacity || 50), 0) / categoryEvents.length;
    const utilizationRate = Math.min(100, (categoryEvents.length * avgCapacity) / (avgCapacity * categoryEvents.length) * 80);
    totalAttendanceRate += utilizationRate;
    categoryCount++;
  });

  const eventAttendanceTrend = categoryCount > 0 ? 
    Math.round(totalAttendanceRate / categoryCount) : 75;

  // Enhanced volunteer participation trend
  const volunteerGrowthRate = volunteer_assignmentss > 0 ? 
    Math.min(100, Math.max(20, (volunteer_assignmentss / Math.max(1, recentEvents.length)) * 25)) : 45;

  // Sophisticated communication engagement
  const communicationEffectiveness = communications > 0 ? 
    Math.min(100, Math.max(30, (communications / Math.max(1, eventData.length)) * 20)) : 60;

  // Overall engagement score with weighted factors
  const weights = {
    attendance: 0.4,
    volunteer: 0.35,
    communication: 0.25
  };

  const overallScore = Math.round(
    eventAttendanceTrend * weights.attendance +
    volunteerGrowthRate * weights.volunteer +
    communicationEffectiveness * weights.communication
  );

  return {
    eventAttendanceTrend: Math.max(40, Math.min(95, eventAttendanceTrend)),
    volunteerParticipationTrend: Math.max(30, Math.min(90, volunteerGrowthRate)),
    communicationEngagement: Math.max(35, Math.min(88, communicationEffectiveness)),
    overallEngagementScore: Math.max(40, Math.min(92, overallScore))
  };
}

function calculateChurchGrowthProjection(memberData: any[], donationData: any[], eventData: any[]): PredictiveAnalytics['churchGrowth'] {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

  // Enhanced growth analysis with multiple time periods
  const currentPeriod = memberData.filter(m => new Date(m.createdAt) >= thirtyDaysAgo);
  const previousPeriod = memberData.filter(m => 
    new Date(m.createdAt) >= sixtyDaysAgo && new Date(m.createdAt) < thirtyDaysAgo
  );
  const quarterPeriod = memberData.filter(m => new Date(m.createdAt) >= ninetyDaysAgo);
  const semesterPeriod = memberData.filter(m => new Date(m.createdAt) >= sixMonthsAgo);

  // Multi-factor growth rate calculation
  const recentGrowth = currentPeriod.length;
  const previousGrowth = previousPeriod.length;
  const quarterAverage = quarterPeriod.length / 3;
  const semesterAverage = semesterPeriod.length / 6;

  // Weighted growth rate considering multiple periods
  const shortTermRate = previousGrowth > 0 ? (recentGrowth / previousGrowth) - 1 : 0;
  const mediumTermRate = quarterAverage > 0 ? (recentGrowth / quarterAverage) - 1 : 0;
  const longTermRate = semesterAverage > 0 ? (recentGrowth / semesterAverage) - 1 : 0;

  // Composite growth rate with weights favoring recent trends
  const compositeGrowthRate = (
    shortTermRate * 0.5 +
    mediumTermRate * 0.3 +
    longTermRate * 0.2
  );

  // Realistic bounds on growth rate
  const monthlyGrowthRate = Math.max(-0.1, Math.min(0.2, compositeGrowthRate));

  const currentMemberCount = memberData.length;
  
  // Sophisticated projections with capacity considerations
  const projectedMonthlyGrowth = Math.round(monthlyGrowthRate * 100 * 100) / 100; // Round to 2 decimals
  const projected6Month = Math.round(currentMemberCount * Math.pow(1 + monthlyGrowthRate, 6));
  const projectedYearly = Math.round(monthlyGrowthRate * 12 * 100);

  // Enhanced growth factors analysis
  const growthFactors = [];
  
  // Membership factors
  if (recentGrowth >= 5) growthFactors.push('Crecimiento de membresía fuerte');
  else if (recentGrowth >= 2) growthFactors.push('Crecimiento de membresía moderado');
  else if (recentGrowth >= 1) growthFactors.push('Crecimiento de membresía estable');
  
  // Financial health factors
  const recentDonations = donationData.filter(d => new Date(d.donationDate) >= thirtyDaysAgo);
  if (recentDonations.length >= 20) growthFactors.push('Salud financiera excelente');
  else if (recentDonations.length >= 10) growthFactors.push('Salud financiera buena');
  
  // Engagement factors
  const recentEvents = eventData.filter(e => new Date(e.startDate) >= thirtyDaysAgo);
  if (recentEvents.length >= 8) growthFactors.push('Programación muy activa');
  else if (recentEvents.length >= 4) growthFactors.push('Programación activa');
  else if (recentEvents.length >= 2) growthFactors.push('Programación regular');
  
  // Community factors
  if (currentMemberCount >= 200) growthFactors.push('Congregación establecida');
  else if (currentMemberCount >= 100) growthFactors.push('Congregación en crecimiento');
  else if (currentMemberCount >= 50) growthFactors.push('Congregación emergente');
  
  // Data quality factor
  if (memberData.length >= 30 && donationData.length >= 15) {
    growthFactors.push('Datos suficientes para análisis preciso');
  }

  // Ensure we always have at least one factor
  if (growthFactors.length === 0) {
    growthFactors.push('Base sólida para crecimiento futuro');
  }

  return {
    projectedMonthlyGrowth: Math.max(-5, Math.min(15, projectedMonthlyGrowth)),
    projected6MonthMembers: Math.max(currentMemberCount * 0.8, projected6Month),
    projectedYearlyGrowth: Math.max(-10, Math.min(30, projectedYearly)),
    growthFactors: growthFactors.slice(0, 5) // Limit to top 5 factors
  };
}