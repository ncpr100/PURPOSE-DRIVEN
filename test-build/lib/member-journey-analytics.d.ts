/**
 * Enhanced Member Journey Analytics Engine
 * Implements sophisticated member lifecycle tracking with behavioral pattern analysis
 * and predictive retention modeling.
 */
import { MemberLifecycleStage, EngagementLevel, RetentionRisk } from '@prisma/client';
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
export declare class MemberJourneyAnalytics {
    private churchId;
    constructor(churchId: string);
    /**
     * Calculate comprehensive engagement score based on multiple factors
     */
    calculateEngagementScore(memberId: string): Promise<number>;
    /**
     * Determine member lifecycle stage based on engagement patterns
     */
    determineMemberLifecycleStage(memberId: string): Promise<MemberLifecycleStage>;
    /**
     * Calculate retention risk using predictive modeling
     */
    calculateRetentionRisk(memberId: string): Promise<{
        risk: RetentionRisk;
        score: number;
        factors: string[];
    }>;
    /**
     * Generate ministry pathway recommendations
     */
    generatePathwayRecommendations(memberId: string): Promise<PathwayRecommendation[]>;
    private calculateEngagementMetrics;
    private getCheckInCount;
    private getRecentCheckInCount;
    private hasMinistryInvolvement;
    private hasRecentDonations;
    private getCommunicationEngagement;
    private calculateGiftMatch;
    /**
     * Update or create member journey record
     */
    updateMemberJourney(memberId: string): Promise<void>;
    /**
     * Get comprehensive member journey analytics for the church
     */
    getComprehensiveAnalytics(period?: number): Promise<{
        conversionFunnel: ConversionFunnelAnalytics;
        retentionAnalytics: RetentionAnalytics;
        engagementDistribution: {
            [key in EngagementLevel]: number;
        };
        stageProgression: any[];
        predictiveInsights: any;
    }>;
    private calculateConversionFunnel;
    private calculateRetentionAnalytics;
    private calculateEngagementDistribution;
    private calculateStageProgression;
    private generatePredictiveInsights;
    private generateMLGrowthPredictions;
    private generateMLRetentionAlerts;
    private generateMLRecommendedActions;
    private getHistoricalConversionRates;
    private calculateSeasonalAdjustment;
    private calculateTrendAdjustment;
    private calculateGrowthPredictionConfidence;
    private calculateLeaderPredictionConfidence;
    private calculatePredictiveAccuracy;
    private calculateConfidenceMetrics;
    private analyzeDetailedRiskFactors;
    private calculateInterventionUrgency;
    private selectOptimalIntervention;
    private predictDepartureTimeframe;
    private calculateInterventionSuccessProbability;
    private calculateRetentionHealthScore;
    private analyzeRetentionTrends;
    private calculateActionSuccessProbability;
    private analyzeStageTransitions;
    private calculateDataRecency;
    private calculateDataCompleteness;
    private calculateAverageDataRecency;
    private calculatePredictionReliability;
    private calculateOverallConfidence;
    private generateConfidenceRecommendations;
    private generateQuarterlyProjections;
    private calculateAverageDuration;
}
//# sourceMappingURL=member-journey-analytics.d.ts.map