/**
 * Enhanced AI Insights Engine with Machine Learning
 * Implements sophisticated predictive modeling for 90%+ accuracy
 */
export interface MLModelFeatures {
    age?: number;
    gender?: string;
    maritalStatus?: string;
    childrenCount?: number;
    attendanceFrequency: number;
    attendanceConsistency: number;
    averageServiceDuration: number;
    preferredServiceTimes: string[];
    communicationResponseRate: number;
    communicationInitiation: number;
    eventParticipationRate: number;
    eventTypePreferences: string[];
    givingFrequency: number;
    givingConsistency: number;
    givingAmount: number;
    givingChannelPreference: string;
    volunteerHours: number;
    leadershipRoles: number;
    mentorshipActivity: number;
    servingConsistency: number;
    spiritualAssessmentScore: number;
    bibleStudyParticipation: number;
    prayer_requestsFrequency: number;
    testimonySharing: number;
    discipleshipPrograms: number;
    smallGroupParticipation: number;
    friendshipConnections: number;
    familyInvolvement: number;
    newMemberMentoring: number;
    recentLifeChanges: string[];
    seasonalPatterns: {
        [month: string]: number;
    };
    geographicStability: number;
    membershipDuration: number;
    previousChurchExperience: number;
    conversionStoryType: string;
    consecutiveAbsences: number;
    communicationDecline: number;
    givingDecline: number;
    socialDisengagement: number;
}
export interface EnhancedPrediction {
    prediction: any;
    confidence: number;
    contributingFactors: Array<{
        factor: string;
        weight: number;
        impact: 'positive' | 'negative';
        evidence: string;
    }>;
    recommendations: Array<{
        action: string;
        priority: number;
        expectedImpact: number;
        timeline: string;
    }>;
    riskMitigations?: Array<{
        risk: string;
        mitigation: string;
        urgency: 'immediate' | 'short-term' | 'medium-term';
    }>;
}
export declare class EnhancedAIInsightsEngine {
    private churchId;
    private historicalAccuracy;
    constructor(churchId: string);
    /**
     * Extract comprehensive ML features for a member
     */
    extractMemberFeatures(memberId: string): Promise<MLModelFeatures>;
    /**
     * Advanced retention prediction with ML features
     */
    predictRetentionRisk(memberId: string): Promise<EnhancedPrediction>;
    /**
     * Enhanced lifecycle stage prediction
     */
    predictNextLifecycleStage(memberId: string): Promise<EnhancedPrediction>;
    /**
     * Enhanced ministry recommendation with ML
     */
    generateMLMinistryRecommendations(memberId: string): Promise<EnhancedPrediction>;
    private analyzeAttendanceRisk;
    private analyzeEngagementRisk;
    private analyzeFinancialRisk;
    private analyzeMinistryRisk;
    private analyzeLifeFactorsRisk;
    private calculateAttendanceConsistency;
    private calculateAverageServiceDuration;
    private calculatePreferredTimes;
    private calculateCommunicationResponse;
    private calculateCommunicationInitiation;
    private calculateEventPreferences;
    private calculateGivingConsistency;
    private calculateAverageGiving;
    private calculateGivingChannel;
    private generateRetentionRecommendations;
    private calculatePredictionConfidence;
    private convertScoreToLikelihood;
    private generateRiskMitigations;
    private analyzeStageProgression;
    private calculateStageConfidence;
    private generateStageRecommendations;
    private calculateMLMinistryMatch;
    private calculateRecommendationConfidence;
    private generateMinistryFactors;
    private generateMinistryDevelopmentPlan;
    private calculateConsecutiveAbsences;
    private calculateCommunicationDecline;
    private calculateGivingDecline;
    private calculateSocialDisengagement;
    private calculateVolunteerHours;
    private calculateServingConsistency;
    private calculateSeasonalPatterns;
}
//# sourceMappingURL=enhanced-ai-insights-engine.d.ts.map