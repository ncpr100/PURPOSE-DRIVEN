"use strict";
/**
 * Cached Analytics Service
 * High-performance analytics service with Redis caching integration
 * Implements intelligent caching strategies for optimal performance
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCachedAnalyticsService = exports.CachedAnalyticsService = exports.RetentionRisk = exports.EngagementLevel = exports.MemberLifecycleStage = void 0;
const member_journey_analytics_1 = require("./member-journey-analytics");
const redis_cache_manager_1 = require("./redis-cache-manager");
const db_1 = require("./db");
const gender_utils_1 = require("./gender-utils");
// Create proper enterprise enums that can be used as values (following automation-engine pattern)
var MemberLifecycleStage;
(function (MemberLifecycleStage) {
    MemberLifecycleStage["VISITOR"] = "VISITOR";
    MemberLifecycleStage["FIRST_TIME_GUEST"] = "FIRST_TIME_GUEST";
    MemberLifecycleStage["RETURNING_VISITOR"] = "RETURNING_VISITOR";
    MemberLifecycleStage["REGULAR_ATTENDEE"] = "REGULAR_ATTENDEE";
    MemberLifecycleStage["MEMBERSHIP_CANDIDATE"] = "MEMBERSHIP_CANDIDATE";
    MemberLifecycleStage["NEW_MEMBER"] = "NEW_MEMBER";
    MemberLifecycleStage["ESTABLISHED_MEMBER"] = "ESTABLISHED_MEMBER";
    MemberLifecycleStage["GROWING_MEMBER"] = "GROWING_MEMBER";
    MemberLifecycleStage["SERVING_MEMBER"] = "SERVING_MEMBER";
    MemberLifecycleStage["LEADING_MEMBER"] = "LEADING_MEMBER";
    MemberLifecycleStage["MATURE_LEADER"] = "MATURE_LEADER";
    MemberLifecycleStage["INACTIVE_MEMBER"] = "INACTIVE_MEMBER";
    MemberLifecycleStage["DISCONNECTED_MEMBER"] = "DISCONNECTED_MEMBER";
})(MemberLifecycleStage || (exports.MemberLifecycleStage = MemberLifecycleStage = {}));
var EngagementLevel;
(function (EngagementLevel) {
    EngagementLevel["HIGH"] = "HIGH";
    EngagementLevel["MEDIUM_HIGH"] = "MEDIUM_HIGH";
    EngagementLevel["MEDIUM"] = "MEDIUM";
    EngagementLevel["MEDIUM_LOW"] = "MEDIUM_LOW";
    EngagementLevel["LOW"] = "LOW";
})(EngagementLevel || (exports.EngagementLevel = EngagementLevel = {}));
var RetentionRisk;
(function (RetentionRisk) {
    RetentionRisk["VERY_LOW"] = "VERY_LOW";
    RetentionRisk["LOW"] = "LOW";
    RetentionRisk["MEDIUM"] = "MEDIUM";
    RetentionRisk["HIGH"] = "HIGH";
    RetentionRisk["VERY_HIGH"] = "VERY_HIGH";
})(RetentionRisk || (exports.RetentionRisk = RetentionRisk = {}));
class CachedAnalyticsService {
    constructor(churchId) {
        this.churchId = churchId;
        this.member_journeysAnalytics = new member_journey_analytics_1.MemberJourneyAnalytics(churchId);
    }
    /**
     * Get executive report with intelligent caching
     */
    async getExecutiveReport(options = {}) {
        const cacheKey = redis_cache_manager_1.CACHE_KEYS.EXECUTIVE_REPORT(this.churchId, `${options.period || 30}d`);
        return await redis_cache_manager_1.cacheManager.get(cacheKey, async () => this.generateExecutiveReport(options.period || 30), {
            ttl: redis_cache_manager_1.CACHE_TTL.EXECUTIVE_REPORT,
            forceRefresh: options.forceRefresh,
            warmCache: options.cacheWarm
        });
    }
    /**
     * Get member journey analytics with caching
     */
    async getMemberJourneyAnalytics(memberId, options = {}) {
        const cacheKey = redis_cache_manager_1.CACHE_KEYS.MEMBER_JOURNEY(this.churchId, memberId);
        return await redis_cache_manager_1.cacheManager.get(cacheKey, async () => {
            const currentStage = await this.member_journeysAnalytics.determineMemberLifecycleStage(memberId);
            const engagementScore = await this.member_journeysAnalytics.calculateEngagementScore(memberId);
            const retentionAnalysis = await this.member_journeysAnalytics.calculateRetentionRisk(memberId);
            const recommendations = await this.member_journeysAnalytics.generatePathwayRecommendations(memberId);
            return {
                memberId,
                currentStage,
                engagementScore,
                retentionRisk: retentionAnalysis.risk,
                retentionScore: retentionAnalysis.score,
                retentionFactors: retentionAnalysis.factors,
                pathwayRecommendations: recommendations,
                lastUpdated: new Date().toISOString()
            };
        }, {
            ttl: redis_cache_manager_1.CACHE_TTL.MEMBER_ANALYTICS,
            forceRefresh: options.forceRefresh
        });
    }
    /**
     * Get comprehensive church analytics with caching
     */
    async getComprehensiveAnalytics(options = {}) {
        const period = options.period || 365;
        const cacheKey = redis_cache_manager_1.CACHE_KEYS.CHURCH_ANALYTICS(this.churchId, `comprehensive_${period}`);
        return await redis_cache_manager_1.cacheManager.get(cacheKey, async () => this.member_journeysAnalytics.getComprehensiveAnalytics(period), {
            ttl: redis_cache_manager_1.CACHE_TTL.RETENTION_ANALYTICS,
            forceRefresh: options.forceRefresh,
            warmCache: options.cacheWarm
        });
    }
    /**
     * Get retention analytics with caching
     */
    async getRetentionAnalytics(options = {}) {
        const period = options.period || 365;
        const cacheKey = redis_cache_manager_1.CACHE_KEYS.RETENTION_ANALYTICS(this.churchId, period);
        return await redis_cache_manager_1.cacheManager.get(cacheKey, async () => {
            const analytics = await this.member_journeysAnalytics.getComprehensiveAnalytics(period);
            return {
                retentionAnalytics: analytics.retentionAnalytics,
                riskMembers: await this.getHighRiskMembers(),
                retentionStrategies: await this.generateRetentionStrategies(),
                lastUpdated: new Date().toISOString()
            };
        }, {
            ttl: redis_cache_manager_1.CACHE_TTL.RETENTION_ANALYTICS,
            forceRefresh: options.forceRefresh
        });
    }
    /**
     * Get conversion funnel analytics with caching
     */
    async getConversionFunnelAnalytics(options = {}) {
        const period = options.period || 365;
        const cacheKey = redis_cache_manager_1.CACHE_KEYS.CONVERSION_FUNNEL(this.churchId, period);
        return await redis_cache_manager_1.cacheManager.get(cacheKey, async () => {
            const analytics = await this.member_journeysAnalytics.getComprehensiveAnalytics(period);
            return {
                conversionFunnel: analytics.conversionFunnel,
                stageProgression: analytics.stageProgression,
                optimizationOpportunities: await this.identifyConversionOpportunities(),
                lastUpdated: new Date().toISOString()
            };
        }, {
            ttl: redis_cache_manager_1.CACHE_TTL.CONVERSION_FUNNEL,
            forceRefresh: options.forceRefresh
        });
    }
    /**
     * Get engagement distribution with caching
     */
    async getEngagementDistribution(options = {}) {
        const cacheKey = redis_cache_manager_1.CACHE_KEYS.ENGAGEMENT_DISTRIBUTION(this.churchId);
        return await redis_cache_manager_1.cacheManager.get(cacheKey, async () => {
            const analytics = await this.member_journeysAnalytics.getComprehensiveAnalytics();
            return {
                engagementDistribution: analytics.engagementDistribution,
                engagementTrends: await this.calculateEngagementTrends(),
                improvementActions: await this.generateEngagementActions(),
                lastUpdated: new Date().toISOString()
            };
        }, {
            ttl: redis_cache_manager_1.CACHE_TTL.ENGAGEMENT_METRICS,
            forceRefresh: options.forceRefresh
        });
    }
    /**
     * Get quick stats with high-frequency caching
     */
    async getQuickStats() {
        const cacheKey = redis_cache_manager_1.CACHE_KEYS.QUICK_STATS(this.churchId);
        return await redis_cache_manager_1.cacheManager.get(cacheKey, async () => {
            const [totalMembers, activeMembers, recentEvents, monthlyDonations] = await Promise.all([
                db_1.db.members.count({ where: { churchId: this.churchId } }),
                db_1.db.members.count({
                    where: {
                        churchId: this.churchId,
                        member_journeys: {
                            engagementScore: { gte: 50 }
                        }
                    }
                }),
                db_1.db.events.count({
                    where: {
                        churchId: this.churchId,
                        startDate: {
                            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                        }
                    }
                }),
                db_1.db.donations.aggregate({
                    where: {
                        churchId: this.churchId,
                        createdAt: {
                            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                        }
                    },
                    _sum: { amount: true }
                })
            ]);
            return {
                totalMembers,
                activeMembers,
                recentEvents,
                monthlyDonations: monthlyDonations._sum.amount || 0,
                lastUpdated: new Date().toISOString()
            };
        }, {
            ttl: redis_cache_manager_1.CACHE_TTL.QUICK_STATS
        });
    }
    /**
     * Get predictive insights with caching
     */
    async getPredictiveInsights(options = {}) {
        const cacheKey = redis_cache_manager_1.CACHE_KEYS.PREDICTIVE_INSIGHTS(this.churchId);
        return await redis_cache_manager_1.cacheManager.get(cacheKey, async () => {
            const analytics = await this.member_journeysAnalytics.getComprehensiveAnalytics();
            const retentionRisks = await this.getHighRiskMembers();
            return {
                predictiveInsights: analytics.predictiveInsights,
                retentionRisks,
                growthOpportunities: await this.identifyGrowthOpportunities(),
                strategicRecommendations: await this.generateStrategicRecommendations(),
                lastUpdated: new Date().toISOString()
            };
        }, {
            ttl: redis_cache_manager_1.CACHE_TTL.PREDICTIVE_INSIGHTS,
            forceRefresh: options.forceRefresh
        });
    }
    /**
     * Invalidate cache after data updates
     */
    async invalidateMemberCache(memberId) {
        await redis_cache_manager_1.cacheManager.autoInvalidate('MEMBER_UPDATE', this.churchId, memberId);
    }
    async invalidateEventCache() {
        await redis_cache_manager_1.cacheManager.autoInvalidate('NEW_EVENT', this.churchId);
    }
    async invalidateDonationCache() {
        await redis_cache_manager_1.cacheManager.autoInvalidate('NEW_DONATION', this.churchId);
    }
    async invalidateCheckInCache() {
        await redis_cache_manager_1.cacheManager.autoInvalidate('NEW_CHECKIN', this.churchId);
    }
    /**
     * Warm cache for church analytics
     */
    async warmCache() {
        await redis_cache_manager_1.cacheManager.warmCache(this.churchId);
        // Pre-load critical analytics
        await Promise.allSettled([
            this.getQuickStats(),
            this.getExecutiveReport({ cacheWarm: true }),
            this.getEngagementDistribution({ cacheWarm: true })
        ]);
    }
    // Private helper methods for data generation
    async generateExecutiveReport(periodDays) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - periodDays);
        const previousPeriodStart = new Date(startDate);
        previousPeriodStart.setDate(previousPeriodStart.getDate() - periodDays);
        // Get base metrics
        const [totalMembers, newMembersThisMonth, newMembersPreviousMonth, checkInsThisMonth, checkInsPreviousMonth, donationsThisMonth, donationsPreviousMonth, activeVolunteers, totalEvents, totalCommunications, member_journeyss] = await Promise.all([
            db_1.db.members.count({ where: { churchId: this.churchId } }),
            db_1.db.members.count({
                where: {
                    churchId: this.churchId,
                    createdAt: { gte: startDate, lte: endDate }
                }
            }),
            db_1.db.members.count({
                where: {
                    churchId: this.churchId,
                    createdAt: { gte: previousPeriodStart, lte: startDate }
                }
            }),
            db_1.db.check_ins.count({
                where: {
                    churchId: this.churchId,
                    checkedInAt: { gte: startDate, lte: endDate }
                }
            }),
            db_1.db.check_ins.count({
                where: {
                    churchId: this.churchId,
                    checkedInAt: { gte: previousPeriodStart, lte: startDate }
                }
            }),
            db_1.db.donations.aggregate({
                where: {
                    churchId: this.churchId,
                    createdAt: { gte: startDate, lte: endDate }
                },
                _sum: { amount: true }
            }),
            db_1.db.donations.aggregate({
                where: {
                    churchId: this.churchId,
                    createdAt: { gte: previousPeriodStart, lte: startDate }
                },
                _sum: { amount: true }
            }),
            db_1.db.volunteers.count({
                where: {
                    members: { churchId: this.churchId },
                    isActive: true
                }
            }),
            db_1.db.events.count({
                where: {
                    churchId: this.churchId,
                    startDate: { gte: startDate, lte: endDate }
                }
            }),
            db_1.db.communications.count({
                where: {
                    churchId: this.churchId,
                    sentAt: { gte: startDate, lte: endDate }
                }
            }),
            db_1.db.member_journeys.findMany({
                where: { churchId: this.churchId },
                select: {
                    engagementScore: true,
                    retentionScore: true,
                    currentStage: true,
                    members: {
                        select: {
                            birthDate: true,
                            gender: true
                        }
                    }
                }
            })
        ]);
        // Calculate growth percentages
        const memberGrowthPercentage = this.calculateGrowthPercentage(newMembersThisMonth, newMembersPreviousMonth);
        const attendanceGrowthPercentage = this.calculateGrowthPercentage(checkInsThisMonth, checkInsPreviousMonth);
        const donationGrowthPercentage = this.calculateGrowthPercentage(donationsThisMonth._sum.amount || 0, donationsPreviousMonth._sum.amount || 0);
        // Calculate engagement and health scores
        const engagementScores = member_journeyss.map(j => j.engagementScore || 0);
        const avgEngagementScore = engagementScores.length > 0
            ? Math.round(engagementScores.reduce((sum, score) => sum + score, 0) / engagementScores.length)
            : 0;
        const churchHealthScore = this.calculateChurchHealthScore({
            memberGrowth: newMembersThisMonth,
            attendanceGrowth: checkInsThisMonth,
            engagementScore: avgEngagementScore,
            volunteerParticipation: activeVolunteers / Math.max(totalMembers, 1) * 100,
            financialHealth: (donationsThisMonth._sum.amount || 0) > 0 ? 85 : 50
        });
        // Generate detailed metrics
        const membershipMetrics = await this.generateMembershipMetrics(totalMembers, member_journeyss);
        const attendanceMetrics = await this.generateAttendanceMetrics(periodDays);
        const financialMetrics = await this.generateFinancialMetrics(periodDays);
        const engagementMetrics = await this.generateEngagementMetrics(member_journeyss);
        const predictiveInsights = await this.generatePredictiveInsightsData();
        return {
            summary: {
                totalMembers,
                totalActiveMembersDisplay: member_journeyss.filter(j => (j.engagementScore || 0) >= 50).length.toString(),
                totalEngagedMembers: member_journeyss.filter(j => (j.engagementScore || 0) >= 70).length,
                memberGrowthThisMonth: newMembersThisMonth,
                memberGrowthLastMonth: newMembersPreviousMonth,
                memberGrowthPercentage,
                newMembersThisMonth,
                avgAttendanceThisMonth: checkInsThisMonth,
                avgAttendanceLastMonth: checkInsPreviousMonth,
                attendanceGrowthPercentage,
                totalDonationsThisMonth: donationsThisMonth._sum.amount || 0,
                totalDonationsLastMonth: donationsPreviousMonth._sum.amount || 0,
                donationGrowthPercentage,
                activeVolunteersThisMonth: activeVolunteers,
                totalEvents,
                totalCommunications,
                engagementScore: avgEngagementScore,
                churchHealthScore
            },
            membershipMetrics,
            attendanceMetrics,
            financialMetrics,
            engagementMetrics,
            predictiveInsights
        };
    }
    calculateGrowthPercentage(current, previous) {
        if (previous === 0)
            return current > 0 ? '+100%' : '0%';
        const growth = ((current - previous) / previous) * 100;
        return `${growth >= 0 ? '+' : ''}${Math.round(growth)}%`;
    }
    calculateChurchHealthScore(metrics) {
        const weights = {
            memberGrowth: 0.2,
            attendanceGrowth: 0.2,
            engagementScore: 0.3,
            volunteerParticipation: 0.15,
            financialHealth: 0.15
        };
        const normalizedMetrics = {
            memberGrowth: Math.min(100, Math.max(0, metrics.memberGrowth * 10)),
            attendanceGrowth: Math.min(100, Math.max(0, metrics.attendanceGrowth * 5)),
            engagementScore: metrics.engagementScore,
            volunteerParticipation: Math.min(100, metrics.volunteerParticipation),
            financialHealth: metrics.financialHealth
        };
        const score = (normalizedMetrics.memberGrowth * weights.memberGrowth) +
            (normalizedMetrics.attendanceGrowth * weights.attendanceGrowth) +
            (normalizedMetrics.engagementScore * weights.engagementScore) +
            (normalizedMetrics.volunteerParticipation * weights.volunteerParticipation) +
            (normalizedMetrics.financialHealth * weights.financialHealth);
        return Math.round(score);
    }
    async generateMembershipMetrics(totalMembers, member_journeyss) {
        // Generate age and gender distributions
        const ageDistribution = this.calculateAgeDistribution(member_journeyss);
        const genderDistribution = this.calculateGenderDistribution(member_journeyss);
        const stageDistribution = this.calculateStageDistribution(member_journeyss);
        return {
            totalMembers,
            activeMembersDisplay: member_journeyss.filter(j => (j.engagementScore || 0) >= 50).length.toString(),
            newMembersThisMonth: 0,
            memberRetentionRate: "85%",
            membershipGrowthTrend: [],
            ageDistribution,
            genderDistribution,
            membersByLifecycleStage: stageDistribution
        };
    }
    async generateAttendanceMetrics(periodDays) {
        // Simplified implementation - would expand with real data
        return {
            avgAttendanceThisMonth: 0,
            attendanceGrowthPercentage: "0%",
            attendanceTrend: [],
            eventTypeAttendance: [],
            peakAttendanceDays: []
        };
    }
    async generateFinancialMetrics(periodDays) {
        // Simplified implementation
        return {
            totalDonationsThisMonth: 0,
            donationGrowthPercentage: "0%",
            donationsTrend: [],
            donationSources: [],
            avgDonationAmount: 0,
            recurringDonorsCount: 0
        };
    }
    async generateEngagementMetrics(member_journeyss) {
        const avgEngagement = member_journeyss.length > 0
            ? Math.round(member_journeyss.reduce((sum, j) => sum + (j.engagementScore || 0), 0) / member_journeyss.length)
            : 0;
        return {
            overallEngagementScore: avgEngagement,
            engagementByStage: [],
            communicationEngagement: {
                emailOpenRate: 75,
                emailClickRate: 25,
                totalCommunications: 0
            },
            eventParticipation: {
                avgParticipationRate: 60,
                mostPopularEvents: []
            },
            volunteerEngagement: {
                activeVolunteers: 0,
                totalVolunteerHours: 0,
                volunteerRetentionRate: 85
            }
        };
    }
    async generatePredictiveInsightsData() {
        return {
            churchHealthScore: 75,
            retentionRiskMembers: 0,
            growthPredictions: {
                nextMonthMembers: 0,
                nextMonthDonations: 0
            },
            recommendations: []
        };
    }
    calculateAgeDistribution(journeys) {
        const ageGroups = { '18-25': 0, '26-35': 0, '36-50': 0, '51-65': 0, '65+': 0 };
        journeys.forEach(j => {
            const birthDate = j.member?.birthDate;
            if (birthDate) {
                const age = Math.floor((Date.now() - new Date(birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
                if (age <= 25)
                    ageGroups['18-25']++;
                else if (age <= 35)
                    ageGroups['26-35']++;
                else if (age <= 50)
                    ageGroups['36-50']++;
                else if (age <= 65)
                    ageGroups['51-65']++;
                else
                    ageGroups['65+']++;
            }
        });
        const total = journeys.length;
        return Object.entries(ageGroups).map(([ageGroup, count]) => ({
            ageGroup,
            count,
            percentage: total > 0 ? Math.round((count / total) * 100) : 0
        }));
    }
    calculateGenderDistribution(journeys) {
        const genderCounts = { 'Masculino': 0, 'Femenino': 0, 'Otro': 0 };
        journeys.forEach(j => {
            const effectiveGender = (0, gender_utils_1.getEffectiveGender)(j.member || {});
            let displayGender = 'Otro';
            if (effectiveGender === 'masculino') {
                displayGender = 'Masculino';
            }
            else if (effectiveGender === 'femenino') {
                displayGender = 'Femenino';
            }
            genderCounts[displayGender]++;
        });
        const total = journeys.length;
        return Object.entries(genderCounts).map(([gender, count]) => ({
            gender,
            count,
            percentage: total > 0 ? Math.round((count / total) * 100) : 0
        }));
    }
    calculateStageDistribution(journeys) {
        const stageCounts = {};
        journeys.forEach(j => {
            const stage = j.currentStage || MemberLifecycleStage.VISITOR;
            stageCounts[stage] = (stageCounts[stage] || 0) + 1;
        });
        const total = journeys.length;
        return Object.entries(stageCounts).map(([stage, count]) => ({
            stage,
            count,
            percentage: total > 0 ? Math.round((count / total) * 100) : 0
        }));
    }
    async getHighRiskMembers() {
        const riskMembers = await db_1.db.member_journeys.findMany({
            where: {
                churchId: this.churchId,
                retentionRisk: { in: [RetentionRisk.HIGH, RetentionRisk.VERY_HIGH] }
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
            }
        });
        return riskMembers.map(r => ({
            memberId: r.members?.id || '',
            name: `${r.members?.firstName || ''} ${r.members?.lastName || ''}`,
            email: r.members?.email || '',
            riskLevel: r.retentionRisk,
            retentionScore: r.retentionScore,
            recommendedActions: typeof r.recommendedActions === 'string'
                ? JSON.parse(r.recommendedActions || '[]')
                : []
        }));
    }
    async generateRetentionStrategies() {
        return [
            {
                strategy: "Personal Outreach",
                description: "Individual contact with high-risk members",
                priority: "high",
                estimatedImpact: "High"
            },
            {
                strategy: "Ministry Engagement",
                description: "Involve members in ministry opportunities",
                priority: "medium",
                estimatedImpact: "Medium"
            }
        ];
    }
    async identifyConversionOpportunities() {
        return [
            {
                opportunity: "First-time visitor follow-up",
                description: "Improve conversion from first-time to returning",
                potentialImpact: "25% improvement in visitor retention"
            }
        ];
    }
    async calculateEngagementTrends() {
        return []; // Would implement with historical data
    }
    async generateEngagementActions() {
        return [
            {
                action: "Increase communication frequency",
                target: "Low engagement members",
                expectedOutcome: "10% engagement increase"
            }
        ];
    }
    async identifyGrowthOpportunities() {
        return [
            {
                opportunity: "Digital outreach expansion",
                description: "Leverage social media for growth",
                estimatedImpact: "15% new visitor increase"
            }
        ];
    }
    async generateStrategicRecommendations() {
        return [
            {
                category: "Growth",
                priority: "high",
                action: "Implement visitor follow-up system",
                expectedImpact: "Improved retention rates"
            }
        ];
    }
}
exports.CachedAnalyticsService = CachedAnalyticsService;
// Export factory function for service instances
function createCachedAnalyticsService(churchId) {
    return new CachedAnalyticsService(churchId);
}
exports.createCachedAnalyticsService = createCachedAnalyticsService;
//# sourceMappingURL=cached-analytics-service.js.map