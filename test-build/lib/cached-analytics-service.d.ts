/**
 * Cached Analytics Service
 * High-performance analytics service with Redis caching integration
 * Implements intelligent caching strategies for optimal performance
 */
export type MemberLifecycleStage = string;
export type EngagementLevel = string;
export type RetentionRisk = string;
export declare const MemberLifecycleStage: {
    readonly VISITOR: "VISITOR";
    readonly FIRST_TIME_GUEST: "FIRST_TIME_GUEST";
    readonly RETURNING_VISITOR: "RETURNING_VISITOR";
    readonly REGULAR_ATTENDEE: "REGULAR_ATTENDEE";
    readonly MEMBERSHIP_CANDIDATE: "MEMBERSHIP_CANDIDATE";
    readonly NEW_MEMBER: "NEW_MEMBER";
    readonly ESTABLISHED_MEMBER: "ESTABLISHED_MEMBER";
    readonly GROWING_MEMBER: "GROWING_MEMBER";
    readonly SERVING_MEMBER: "SERVING_MEMBER";
    readonly LEADING_MEMBER: "LEADING_MEMBER";
    readonly MATURE_LEADER: "MATURE_LEADER";
    readonly INACTIVE_MEMBER: "INACTIVE_MEMBER";
    readonly DISCONNECTED_MEMBER: "DISCONNECTED_MEMBER";
};
export declare const RetentionRisk: {
    readonly VERY_LOW: "VERY_LOW";
    readonly LOW: "LOW";
    readonly MEDIUM: "MEDIUM";
    readonly HIGH: "HIGH";
    readonly VERY_HIGH: "VERY_HIGH";
};
export interface CachedAnalyticsOptions {
    forceRefresh?: boolean;
    cacheWarm?: boolean;
    period?: number;
}
export interface ExecutiveReportData {
    summary: {
        totalMembers: number;
        totalActiveMembersDisplay: string;
        totalEngagedMembers: number;
        memberGrowthThisMonth: number;
        memberGrowthLastMonth: number;
        memberGrowthPercentage: string;
        newMembersThisMonth: number;
        avgAttendanceThisMonth: number;
        avgAttendanceLastMonth: number;
        attendanceGrowthPercentage: string;
        totalDonationsThisMonth: number;
        totalDonationsLastMonth: number;
        donationGrowthPercentage: string;
        activeVolunteersThisMonth: number;
        totalEvents: number;
        totalCommunications: number;
        engagementScore: number;
        churchHealthScore: number;
    };
    membershipMetrics: {
        totalMembers: number;
        activeMembersDisplay: string;
        newMembersThisMonth: number;
        memberRetentionRate: string;
        membershipGrowthTrend: Array<{
            month: string;
            count: number;
        }>;
        ageDistribution: Array<{
            ageGroup: string;
            count: number;
            percentage: number;
        }>;
        genderDistribution: Array<{
            gender: string;
            count: number;
            percentage: number;
        }>;
        membersByLifecycleStage: Array<{
            stage: string;
            count: number;
            percentage: number;
        }>;
    };
    attendanceMetrics: {
        avgAttendanceThisMonth: number;
        attendanceGrowthPercentage: string;
        attendanceTrend: Array<{
            date: string;
            count: number;
        }>;
        eventTypeAttendance: Array<{
            type: string;
            count: number;
            avgAttendance: number;
        }>;
        peakAttendanceDays: Array<{
            day: string;
            count: number;
        }>;
    };
    financialMetrics: {
        totalDonationsThisMonth: number;
        donationGrowthPercentage: string;
        donationsTrend: Array<{
            month: string;
            amount: number;
        }>;
        donationSources: Array<{
            source: string;
            amount: number;
            percentage: number;
        }>;
        avgDonationAmount: number;
        recurringDonorsCount: number;
    };
    engagementMetrics: {
        overallEngagementScore: number;
        engagementByStage: Array<{
            stage: string;
            score: number;
        }>;
        communicationEngagement: {
            emailOpenRate: number;
            emailClickRate: number;
            totalCommunications: number;
        };
        eventParticipation: {
            avgParticipationRate: number;
            mostPopularEvents: Array<{
                name: string;
                attendees: number;
            }>;
        };
        volunteerEngagement: {
            activeVolunteers: number;
            totalVolunteerHours: number;
            volunteerRetentionRate: number;
        };
    };
    predictiveInsights: {
        churchHealthScore: number;
        retentionRiskMembers: number;
        growthPredictions: {
            nextMonthMembers: number;
            nextMonthDonations: number;
        };
        recommendations: Array<{
            category: string;
            priority: 'high' | 'medium' | 'low';
            action: string;
            expectedImpact: string;
        }>;
    };
}
export declare class CachedAnalyticsService {
    private churchId;
    private member_journeysAnalytics;
    constructor(churchId: string);
    /**
     * Get executive report with intelligent caching
     */
    getExecutiveReport(options?: CachedAnalyticsOptions): Promise<ExecutiveReportData>;
    /**
     * Get member journey analytics with caching
     */
    getMemberJourneyAnalytics(memberId: string, options?: CachedAnalyticsOptions): Promise<any>;
    /**
     * Get comprehensive church analytics with caching
     */
    getComprehensiveAnalytics(options?: CachedAnalyticsOptions): Promise<any>;
    /**
     * Get retention analytics with caching
     */
    getRetentionAnalytics(options?: CachedAnalyticsOptions): Promise<any>;
    /**
     * Get conversion funnel analytics with caching
     */
    getConversionFunnelAnalytics(options?: CachedAnalyticsOptions): Promise<any>;
    /**
     * Get engagement distribution with caching
     */
    getEngagementDistribution(options?: CachedAnalyticsOptions): Promise<any>;
    /**
     * Get quick stats with high-frequency caching
     */
    getQuickStats(): Promise<any>;
    /**
     * Get predictive insights with caching
     */
    getPredictiveInsights(options?: CachedAnalyticsOptions): Promise<any>;
    /**
     * Invalidate cache after data updates
     */
    invalidateMemberCache(memberId: string): Promise<void>;
    invalidateEventCache(): Promise<void>;
    invalidateDonationCache(): Promise<void>;
    invalidateCheckInCache(): Promise<void>;
    /**
     * Warm cache for church analytics
     */
    warmCache(): Promise<void>;
    private generateExecutiveReport;
    private calculateGrowthPercentage;
    private calculateChurchHealthScore;
    private generateMembershipMetrics;
    private generateAttendanceMetrics;
    private generateFinancialMetrics;
    private generateEngagementMetrics;
    private generatePredictiveInsightsData;
    private calculateAgeDistribution;
    private calculateGenderDistribution;
    private calculateStageDistribution;
    private getHighRiskMembers;
    private generateRetentionStrategies;
    private identifyConversionOpportunities;
    private calculateEngagementTrends;
    private generateEngagementActions;
    private identifyGrowthOpportunities;
    private generateStrategicRecommendations;
}
export declare function createCachedAnalyticsService(churchId: string): CachedAnalyticsService;
//# sourceMappingURL=cached-analytics-service.d.ts.map