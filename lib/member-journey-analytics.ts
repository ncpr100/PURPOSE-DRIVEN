/**
 * Enhanced Member Journey Analytics Engine
 * Implements sophisticated member lifecycle tracking with behavioral pattern analysis
 * and predictive retention modeling.
 */

import { db } from './db';
import { 
  MemberLifecycleStage, 
  EngagementLevel, 
  RetentionRisk,
  PrismaClient 
} from '@prisma/client';

// Types for enhanced analytics
export interface MemberJourneyState {
  id: string;
  currentStage: MemberLifecycleStage;
  engagementScore: number;
  retentionScore: number;
  daysInCurrentStage: number;
  nextStageRecommendation?: MemberLifecycleStage;
  nextStageProbability?: number;
}

export interface BehavioralPattern {
  attendanceConsistency: number;
  communicationEngagement: number;
  ministryParticipation: number;
  givingPattern: number;
  socialInteraction: number;
  readinessForNextStage: number;
  dropoutRisk: number;
}

export interface EngagementMetrics {
  averageWeeklyAttendance: number;
  eventParticipationRate: number;
  communicationResponseRate: number;
  ministryInvolvementLevel: number;
  givingConsistency: number;
  socialConnectionScore: number;
}

export interface ConversionFunnelAnalytics {
  totalVisitors: number;
  conversionRates: {
    visitorToFirstTime: number;
    firstTimeToReturning: number;
    returningToRegular: number;
    regularToMember: number;
    memberToActive: number;
    activeToLeader: number;
  };
  stageDistribution: {
    [key in MemberLifecycleStage]: {
      count: number;
      percentage: number;
      averageDuration: number;
    };
  };
}

export interface RetentionAnalytics {
  overallRetentionRate: number;
  retentionByStage: {
    [key in MemberLifecycleStage]: number;
  };
  riskDistribution: {
    [key in RetentionRisk]: number;
  };
  predictiveAccuracy: number;
}

export interface PathwayRecommendation {
  type: 'ministry' | 'growth' | 'leadership' | 'service';
  title: string;
  description: string;
  matchScore: number;
  priority: 'high' | 'medium' | 'low';
  timeCommitment?: string;
  requiredSkills: string[];
}

export class MemberJourneyAnalytics {
  constructor(private churchId: string) {}

  /**
   * Calculate comprehensive engagement score based on multiple factors
   */
  async calculateEngagementScore(memberId: string): Promise<number> {
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Get member data
    const member = await db.member.findUnique({
      where: { id: memberId },
      include: {
        donations: {
          where: { createdAt: { gte: sixtyDaysAgo } }
        },
        volunteers: {
          include: {
            assignments: {
              where: { createdAt: { gte: sixtyDaysAgo } }
            }
          }
        }
      }
    });

    if (!member) return 0;

    // Get check-ins (attendance)
    const checkIns = await db.checkIn.findMany({
      where: {
        churchId: this.churchId,
        checkedInAt: { gte: sixtyDaysAgo },
        OR: [
          { email: member.email },
          { 
            AND: [
              { firstName: member.firstName },
              { lastName: member.lastName }
            ]
          }
        ]
      }
    });

    // Get communication engagement
    const communications = await db.communication.findMany({
      where: {
        churchId: this.churchId,
        sentAt: { gte: sixtyDaysAgo }
      }
    });

    // Calculate metrics
    const metrics = this.calculateEngagementMetrics(
      member,
      checkIns,
      communications,
      member.donations,
      member.volunteers[0]?.assignments || []
    );

    // Weight different factors
    const weights = {
      attendance: 0.25,
      participation: 0.20,
      communication: 0.15,
      ministry: 0.15,
      giving: 0.15,
      social: 0.10
    };

    const score = 
      (metrics.averageWeeklyAttendance * weights.attendance) +
      (metrics.eventParticipationRate * weights.participation) +
      (metrics.communicationResponseRate * weights.communication) +
      (metrics.ministryInvolvementLevel * weights.ministry) +
      (metrics.givingConsistency * weights.giving) +
      (metrics.socialConnectionScore * weights.social);

    return Math.round(score);
  }

  /**
   * Determine member lifecycle stage based on engagement patterns
   */
  async determineMemberLifecycleStage(memberId: string): Promise<MemberLifecycleStage> {
    const member = await db.member.findUnique({
      where: { id: memberId },
      include: {
        user: true,
        volunteers: true,
        memberJourney: true
      }
    });

    if (!member) return MemberLifecycleStage.VISITOR;

    const membershipDuration = member.membershipDate 
      ? Math.floor((Date.now() - member.membershipDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    const engagementScore = await this.calculateEngagementScore(memberId);
    const hasMinistryRole = member.volunteers && member.volunteers.length > 0;
    const isLeader = member.user?.role && ['PASTOR', 'LIDER', 'ADMIN_IGLESIA'].includes(member.user.role);

    // Determine stage based on comprehensive criteria
    if (isLeader) return MemberLifecycleStage.MATURE_LEADER;
    if (hasMinistryRole && membershipDuration > 365 && engagementScore > 80) return MemberLifecycleStage.LEADING_MEMBER;
    if (hasMinistryRole && engagementScore > 70) return MemberLifecycleStage.SERVING_MEMBER;
    if (membershipDuration > 180 && engagementScore > 60) return MemberLifecycleStage.GROWING_MEMBER;
    if (membershipDuration > 30 && engagementScore > 50) return MemberLifecycleStage.ESTABLISHED_MEMBER;
    if (member.membershipDate && membershipDuration <= 180) return MemberLifecycleStage.NEW_MEMBER;
    if (engagementScore < 20 && membershipDuration > 90) return MemberLifecycleStage.INACTIVE_MEMBER;
    if (engagementScore < 10 && membershipDuration > 180) return MemberLifecycleStage.DISCONNECTED_MEMBER;
    
    // For non-members, determine visitor stage
    const checkInCount = await this.getCheckInCount(memberId);
    if (checkInCount === 0) return MemberLifecycleStage.VISITOR;
    if (checkInCount === 1) return MemberLifecycleStage.FIRST_TIME_GUEST;
    if (checkInCount <= 4) return MemberLifecycleStage.RETURNING_VISITOR;
    if (checkInCount >= 5) return MemberLifecycleStage.REGULAR_ATTENDEE;

    return MemberLifecycleStage.VISITOR;
  }

  /**
   * Calculate retention risk using predictive modeling
   */
  async calculateRetentionRisk(memberId: string): Promise<{ risk: RetentionRisk; score: number; factors: string[] }> {
    const engagementScore = await this.calculateEngagementScore(memberId);
    const member = await db.member.findUnique({
      where: { id: memberId },
      include: { memberJourney: true }
    });

    if (!member) return { risk: RetentionRisk.VERY_HIGH, score: 100, factors: ['Member not found'] };

    const riskFactors: string[] = [];
    let riskScore = 50; // Base risk

    // Engagement factor
    if (engagementScore < 30) {
      riskScore += 30;
      riskFactors.push('Low engagement score');
    } else if (engagementScore > 70) {
      riskScore -= 20;
    }

    // Attendance factor
    const recentCheckIns = await this.getRecentCheckInCount(memberId, 30);
    if (recentCheckIns === 0) {
      riskScore += 25;
      riskFactors.push('No recent attendance');
    } else if (recentCheckIns >= 3) {
      riskScore -= 15;
    }

    // Ministry involvement
    const hasMinistryRole = await this.hasMinistryInvolvement(memberId);
    if (!hasMinistryRole) {
      riskScore += 15;
      riskFactors.push('No ministry involvement');
    } else {
      riskScore -= 10;
    }

    // Giving pattern
    const hasRecentDonations = await this.hasRecentDonations(memberId, 60);
    if (!hasRecentDonations) {
      riskScore += 10;
      riskFactors.push('No recent giving');
    } else {
      riskScore -= 5;
    }

    // Communication engagement
    const communicationEngagement = await this.getCommunicationEngagement(memberId);
    if (communicationEngagement < 0.3) {
      riskScore += 15;
      riskFactors.push('Low communication engagement');
    }

    // Cap the risk score
    riskScore = Math.max(0, Math.min(100, riskScore));

    // Determine risk level
    let risk: RetentionRisk;
    if (riskScore >= 76) risk = RetentionRisk.VERY_HIGH;
    else if (riskScore >= 51) risk = RetentionRisk.HIGH;
    else if (riskScore >= 26) risk = RetentionRisk.MEDIUM;
    else if (riskScore >= 11) risk = RetentionRisk.LOW;
    else risk = RetentionRisk.VERY_LOW;

    return { risk, score: riskScore, factors: riskFactors };
  }

  /**
   * Generate ministry pathway recommendations
   */
  async generatePathwayRecommendations(memberId: string): Promise<PathwayRecommendation[]> {
    const member = await db.member.findUnique({
      where: { id: memberId },
      include: {
        spiritualProfile: true,
        volunteers: true
      }
    });

    if (!member) return [];

    const engagementScore = await this.calculateEngagementScore(memberId);
    const currentStage = await this.determineMemberLifecycleStage(memberId);
    const recommendations: PathwayRecommendation[] = [];

    // Based on current stage and spiritual gifts, recommend pathways
    const spiritualGifts = member.spiritualGiftsStructured as any;
    const primaryGifts = spiritualGifts?.primary || [];

    // Ministry recommendations based on gifts
    if (primaryGifts.includes('ENSEÑANZA') || primaryGifts.includes('DISCIPULADO')) {
      recommendations.push({
        type: 'ministry',
        title: 'Ministerio de Enseñanza',
        description: 'Desarrolla tus dones de enseñanza en clases bíblicas o grupos pequeños',
        matchScore: this.calculateGiftMatch(primaryGifts, ['ENSEÑANZA', 'DISCIPULADO']),
        priority: engagementScore > 70 ? 'high' : 'medium',
        timeCommitment: '3-5 horas semanales',
        requiredSkills: ['Conocimiento bíblico', 'Comunicación efectiva']
      });
    }

    if (primaryGifts.includes('LIDERAZGO') && currentStage !== MemberLifecycleStage.LEADING_MEMBER) {
      recommendations.push({
        type: 'leadership',
        title: 'Desarrollo de Liderazgo',
        description: 'Participa en programas de desarrollo de liderazgo para impactar más vidas',
        matchScore: this.calculateGiftMatch(primaryGifts, ['LIDERAZGO']),
        priority: 'high',
        timeCommitment: '5-8 horas semanales',
        requiredSkills: ['Visión estratégica', 'Habilidades interpersonales', 'Toma de decisiones']
      });
    }

    // Growth recommendations based on stage
    if (currentStage === MemberLifecycleStage.NEW_MEMBER) {
      recommendations.push({
        type: 'growth',
        title: 'Programa de Discipulado',
        description: 'Fortalece tu fundamento espiritual a través de nuestro programa de discipulado',
        matchScore: 90,
        priority: 'high',
        timeCommitment: '2-3 horas semanales',
        requiredSkills: ['Deseo de crecimiento', 'Compromiso personal']
      });
    }

    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
  }

  // Helper methods
  private calculateEngagementMetrics(
    member: any,
    checkIns: any[],
    communications: any[],
    donations: any[],
    assignments: any[]
  ): EngagementMetrics {
    const weeksInPeriod = 8; // 60 days / 7.5 days per week

    return {
      averageWeeklyAttendance: Math.min(1, checkIns.length / weeksInPeriod) * 100,
      eventParticipationRate: Math.min(1, assignments.length / 4) * 100,
      communicationResponseRate: communications.length > 0 ? 75 : 0, // Simplified
      ministryInvolvementLevel: assignments.length > 0 ? 80 : 0,
      givingConsistency: donations.length > 0 ? Math.min(100, donations.length * 12.5) : 0,
      socialConnectionScore: checkIns.length > 0 ? 60 : 0 // Simplified
    };
  }

  private async getCheckInCount(memberId: string): Promise<number> {
    const member = await db.member.findUnique({ where: { id: memberId } });
    if (!member) return 0;

    return db.checkIn.count({
      where: {
        churchId: this.churchId,
        OR: [
          { email: member.email },
          { 
            AND: [
              { firstName: member.firstName },
              { lastName: member.lastName }
            ]
          }
        ]
      }
    });
  }

  private async getRecentCheckInCount(memberId: string, days: number): Promise<number> {
    const member = await db.member.findUnique({ where: { id: memberId } });
    if (!member) return 0;

    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    return db.checkIn.count({
      where: {
        churchId: this.churchId,
        checkedInAt: { gte: dateThreshold },
        OR: [
          { email: member.email },
          { 
            AND: [
              { firstName: member.firstName },
              { lastName: member.lastName }
            ]
          }
        ]
      }
    });
  }

  private async hasMinistryInvolvement(memberId: string): Promise<boolean> {
    const volunteerCount = await db.volunteer.count({
      where: { memberId }
    });
    return volunteerCount > 0;
  }

  private async hasRecentDonations(memberId: string, days: number): Promise<boolean> {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    const donationCount = await db.donation.count({
      where: {
        memberId,
        createdAt: { gte: dateThreshold }
      }
    });
    return donationCount > 0;
  }

  private async getCommunicationEngagement(memberId: string): Promise<number> {
    // Simplified - would need actual engagement tracking
    return 0.5;
  }

  private calculateGiftMatch(memberGifts: string[], requiredGifts: string[]): number {
    const matches = memberGifts.filter(gift => requiredGifts.includes(gift));
    return Math.round((matches.length / requiredGifts.length) * 100);
  }

  /**
   * Update or create member journey record
   */
  async updateMemberJourney(memberId: string): Promise<void> {
    const currentStage = await this.determineMemberLifecycleStage(memberId);
    const engagementScore = await this.calculateEngagementScore(memberId);
    const retentionAnalysis = await this.calculateRetentionRisk(memberId);
    const recommendations = await this.generatePathwayRecommendations(memberId);

    // Get or create member journey
    let journey = await db.memberJourney.findFirst({
      where: { memberId }
    });

    const journeyData = {
      currentStage,
      engagementScore,
      retentionScore: 100 - retentionAnalysis.score,
      retentionRisk: retentionAnalysis.risk,
      recommendedActions: JSON.stringify(recommendations.slice(0, 3)),
      pathwayRecommendations: JSON.stringify(recommendations),
      behavioralProfile: JSON.stringify({
        retentionFactors: retentionAnalysis.factors,
        primaryStrengths: recommendations.filter(r => r.matchScore > 80).map(r => r.title),
        engagementPattern: engagementScore > 70 ? 'high' : engagementScore > 40 ? 'medium' : 'low'
      }),
      lastAnalysisDate: new Date(),
      updatedAt: new Date()
    };

    if (journey) {
      // Update existing journey
      const stageChanged = journey.currentStage !== currentStage;
      
      if (stageChanged) {
        const stageHistory = (journey.stageHistory as any[]) || [];
        stageHistory.push({
          stage: journey.currentStage,
          startDate: journey.stageStartDate,
          endDate: new Date(),
          duration: Math.floor((Date.now() - journey.stageStartDate.getTime()) / (1000 * 60 * 60 * 24))
        });

        await db.memberJourney.update({
          where: { id: journey.id },
          data: {
            ...journeyData,
            previousStage: journey.currentStage,
            stageStartDate: new Date(),
            totalDaysInCurrentStage: 0,
            stageHistory: JSON.stringify(stageHistory)
          }
        });
      } else {
        const daysInStage = Math.floor((Date.now() - journey.stageStartDate.getTime()) / (1000 * 60 * 60 * 24));
        
        await db.memberJourney.update({
          where: { id: journey.id },
          data: {
            ...journeyData,
            totalDaysInCurrentStage: daysInStage
          }
        });
      }
    } else {
      // Create new journey
      await db.memberJourney.create({
        data: {
          memberId,
          churchId: this.churchId,
          ...journeyData,
          stageHistory: JSON.stringify([]),
          conversionMilestones: JSON.stringify([]),
          engagementTimeline: JSON.stringify([]),
          // Required behavioral pattern fields
          attendancePattern: JSON.stringify({}),
          ministryInvolvement: JSON.stringify({}),
          givingPattern: JSON.stringify({}),
          communicationResponse: JSON.stringify({}),
          // Required predictive analytics fields
          growthPredictions: JSON.stringify({}),
          riskFactors: JSON.stringify([]),
          strengthFactors: JSON.stringify([])
        }
      });
    }
  }

  /**
   * Get comprehensive member journey analytics for the church
   */
  async getComprehensiveAnalytics(period: number = 365): Promise<{
    conversionFunnel: ConversionFunnelAnalytics;
    retentionAnalytics: RetentionAnalytics;
    engagementDistribution: { [key in EngagementLevel]: number };
    stageProgression: any[];
    predictiveInsights: any;
  }> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - period);

    // Get all member journeys
    const journeys = await db.memberJourney.findMany({
      where: { 
        churchId: this.churchId,
        updatedAt: { gte: startDate }
      },
      include: {
        member: true
      }
    });

    // Calculate conversion funnel
    const conversionFunnel = this.calculateConversionFunnel(journeys);
    
    // Calculate retention analytics
    const retentionAnalytics = this.calculateRetentionAnalytics(journeys);

    // Calculate engagement distribution
    const engagementDistribution = this.calculateEngagementDistribution(journeys);

    // Calculate stage progression patterns
    const stageProgression = this.calculateStageProgression(journeys);

    // Generate predictive insights
    const predictiveInsights = await this.generatePredictiveInsights(journeys);

    return {
      conversionFunnel,
      retentionAnalytics,
      engagementDistribution,
      stageProgression,
      predictiveInsights
    };
  }

  private calculateConversionFunnel(journeys: any[]): ConversionFunnelAnalytics {
    const stageDistribution: any = {};
    const stageCounts: any = {};

    // Initialize all stages
    Object.values(MemberLifecycleStage).forEach(stage => {
      stageDistribution[stage] = { count: 0, percentage: 0, averageDuration: 0 };
      stageCounts[stage] = 0;
    });

    // Count current stages
    journeys.forEach(journey => {
      stageCounts[journey.currentStage]++;
    });

    const totalJourneys = journeys.length;

    // Calculate percentages and averages
    Object.keys(stageCounts).forEach(stage => {
      const count = stageCounts[stage];
      const percentage = totalJourneys > 0 ? (count / totalJourneys) * 100 : 0;
      const avgDuration = this.calculateAverageDuration(journeys, stage as MemberLifecycleStage);

      stageDistribution[stage] = {
        count,
        percentage: Math.round(percentage),
        averageDuration: avgDuration
      };
    });

    // Calculate conversion rates between sequential stages
    const stageOrder = [
      MemberLifecycleStage.VISITOR,
      MemberLifecycleStage.FIRST_TIME_GUEST,
      MemberLifecycleStage.RETURNING_VISITOR,
      MemberLifecycleStage.REGULAR_ATTENDEE,
      MemberLifecycleStage.NEW_MEMBER,
      MemberLifecycleStage.ESTABLISHED_MEMBER,
      MemberLifecycleStage.SERVING_MEMBER,
      MemberLifecycleStage.LEADING_MEMBER
    ];

    const conversionRates: any = {};
    for (let i = 0; i < stageOrder.length - 1; i++) {
      const currentStage = stageOrder[i];
      const nextStage = stageOrder[i + 1];
      const currentCount = stageCounts[currentStage] || 0;
      const nextCount = stageCounts[nextStage] || 0;
      
      conversionRates[`${currentStage}To${nextStage}`] = currentCount > 0 
        ? Math.round((nextCount / currentCount) * 100) 
        : 0;
    }

    return {
      totalVisitors: totalJourneys,
      conversionRates: {
        visitorToFirstTime: conversionRates[`${MemberLifecycleStage.VISITOR}To${MemberLifecycleStage.FIRST_TIME_GUEST}`] || 0,
        firstTimeToReturning: conversionRates[`${MemberLifecycleStage.FIRST_TIME_GUEST}To${MemberLifecycleStage.RETURNING_VISITOR}`] || 0,
        returningToRegular: conversionRates[`${MemberLifecycleStage.RETURNING_VISITOR}To${MemberLifecycleStage.REGULAR_ATTENDEE}`] || 0,
        regularToMember: conversionRates[`${MemberLifecycleStage.REGULAR_ATTENDEE}To${MemberLifecycleStage.NEW_MEMBER}`] || 0,
        memberToActive: conversionRates[`${MemberLifecycleStage.NEW_MEMBER}To${MemberLifecycleStage.ESTABLISHED_MEMBER}`] || 0,
        activeToLeader: conversionRates[`${MemberLifecycleStage.ESTABLISHED_MEMBER}To${MemberLifecycleStage.LEADING_MEMBER}`] || 0,
      },
      stageDistribution
    };
  }

  private calculateRetentionAnalytics(journeys: any[]): RetentionAnalytics {
    const retentionByStage: any = {};
    const riskDistribution: any = {};

    // Initialize
    Object.values(MemberLifecycleStage).forEach(stage => {
      retentionByStage[stage] = 0;
    });
    Object.values(RetentionRisk).forEach(risk => {
      riskDistribution[risk] = 0;
    });

    // Calculate retention by stage (simplified - would need historical data)
    journeys.forEach(journey => {
      const retentionScore = journey.retentionScore || 50;
      retentionByStage[journey.currentStage] += retentionScore;
      
      if (journey.retentionRisk) {
        riskDistribution[journey.retentionRisk]++;
      }
    });

    // Average retention scores
    Object.keys(retentionByStage).forEach(stage => {
      const stageJourneys = journeys.filter(j => j.currentStage === stage);
      if (stageJourneys.length > 0) {
        retentionByStage[stage] = Math.round(retentionByStage[stage] / stageJourneys.length);
      }
    });

    const overallRetentionRate = journeys.length > 0 
      ? Math.round(journeys.reduce((sum, j) => sum + (j.retentionScore || 50), 0) / journeys.length)
      : 50;

    return {
      overallRetentionRate,
      retentionByStage,
      riskDistribution,
      predictiveAccuracy: 82 // Would calculate based on historical accuracy
    };
  }

  private calculateEngagementDistribution(journeys: any[]): { [key in EngagementLevel]: number } {
    const distribution: { [key in EngagementLevel]: number } = {
      [EngagementLevel.HIGH]: 0,
      [EngagementLevel.MEDIUM_HIGH]: 0,
      [EngagementLevel.MEDIUM]: 0,
      [EngagementLevel.MEDIUM_LOW]: 0,
      [EngagementLevel.LOW]: 0,
    };

    journeys.forEach(journey => {
      if (journey.engagementLevel && journey.engagementLevel in distribution) {
        distribution[journey.engagementLevel as EngagementLevel]++;
      }
    });

    return distribution;
  }

  private calculateStageProgression(journeys: any[]): any[] {
    // Analyze common progression patterns
    const progressionPatterns: any = {};

    journeys.forEach(journey => {
      const history = journey.stageHistory ? JSON.parse(journey.stageHistory) : [];
      if (history.length > 1) {
        for (let i = 0; i < history.length - 1; i++) {
          const from = history[i].stage;
          const to = history[i + 1].stage;
          const key = `${from}->${to}`;
          
          if (!progressionPatterns[key]) {
            progressionPatterns[key] = {
              count: 0,
              averageDuration: 0,
              totalDuration: 0
            };
          }
          
          progressionPatterns[key].count++;
          progressionPatterns[key].totalDuration += history[i].duration || 0;
        }
      }
    });

    // Calculate averages
    Object.keys(progressionPatterns).forEach(key => {
      const pattern = progressionPatterns[key];
      pattern.averageDuration = pattern.count > 0 
        ? Math.round(pattern.totalDuration / pattern.count) 
        : 0;
    });

    return Object.keys(progressionPatterns).map(key => ({
      progression: key,
      ...progressionPatterns[key]
    })).sort((a, b) => b.count - a.count);
  }

  private async generatePredictiveInsights(journeys: any[]): Promise<any> {
    const insights = {
      growthPredictions: {
        nextMonthNewMembers: Math.round(journeys.filter(j => j.currentStage === MemberLifecycleStage.MEMBERSHIP_CANDIDATE).length * 0.7),
        nextMonthLeaders: Math.round(journeys.filter(j => j.currentStage === MemberLifecycleStage.SERVING_MEMBER).length * 0.3),
      },
      retentionAlerts: journeys.filter(j => 
        j.retentionRisk && [RetentionRisk.HIGH, RetentionRisk.VERY_HIGH].includes(j.retentionRisk)
      ).length,
      recommendedActions: [
        {
          priority: 'high',
          action: 'Contact high-risk members',
          affected: journeys.filter(j => j.retentionRisk === RetentionRisk.VERY_HIGH).length
        },
        {
          priority: 'medium',
          action: 'Engage low-participation members',
          affected: journeys.filter(j => j.engagementScore < 30).length
        }
      ]
    };

    return insights;
  }

  private calculateAverageDuration(journeys: any[], stage: MemberLifecycleStage): number {
    const stageJourneys = journeys.filter(j => j.currentStage === stage);
    if (stageJourneys.length === 0) return 0;

    const totalDays = stageJourneys.reduce((sum, j) => sum + (j.totalDaysInCurrentStage || 0), 0);
    return Math.round(totalDays / stageJourneys.length);
  }
}