interface CacheConfig {
    defaultTTL: number;
    member_journeysTTL: number;
    engagementTTL: number;
    retentionTTL: number;
    recommendationsTTL: number;
}
interface AnalyticsCacheKey {
    church_id: string;
    type: 'lifecycle' | 'engagement' | 'retention' | 'recommendations' | 'timeline' | 'behavioral';
    subtype?: string;
    member_id?: string;
    date_range?: string;
}
declare class MemberAnalyticsCache {
    private redis;
    private config;
    constructor();
    /**
     * Generate a standardized cache key for member analytics
     */
    private generateCacheKey;
    /**
     * Get TTL based on analytics type
     */
    private getTTL;
    /**
     * Cache member lifecycle funnel data
     */
    cacheLifecycleFunnel(churchId: string, data: any, dateRange?: string): Promise<void>;
    /**
     * Get cached lifecycle funnel data
     */
    getLifecycleFunnel(churchId: string, dateRange?: string): Promise<any | null>;
    /**
     * Cache engagement score dashboard data
     */
    cacheEngagementDashboard(churchId: string, data: any): Promise<void>;
    /**
     * Get cached engagement dashboard data
     */
    getEngagementDashboard(churchId: string): Promise<any | null>;
    /**
     * Cache retention risk alerts
     */
    cacheRetentionAlerts(churchId: string, data: any): Promise<void>;
    /**
     * Get cached retention alerts
     */
    getRetentionAlerts(churchId: string): Promise<any | null>;
    /**
     * Cache ministry recommendations
     */
    cacheMinistryRecommendations(churchId: string, data: any): Promise<void>;
    /**
     * Get cached ministry recommendations
     */
    getMinistryRecommendations(churchId: string): Promise<any | null>;
    /**
     * Cache individual member timeline
     */
    cacheMemberTimeline(churchId: string, memberId: string, data: any): Promise<void>;
    /**
     * Get cached member timeline
     */
    getMemberTimeline(churchId: string, memberId: string): Promise<any | null>;
    /**
     * Cache member behavioral patterns
     */
    cacheBehavioralPatterns(churchId: string, memberId: string, data: any): Promise<void>;
    /**
     * Get cached behavioral patterns
     */
    getBehavioralPatterns(churchId: string, memberId: string): Promise<any | null>;
    /**
     * Invalidate cache for a specific church and type
     */
    invalidateChurchCache(churchId: string, type?: AnalyticsCacheKey['type']): Promise<void>;
    /**
     * Invalidate cache for a specific member
     */
    invalidateMemberCache(churchId: string, memberId: string): Promise<void>;
    /**
     * Warm up cache with precomputed analytics
     */
    warmupCache(churchId: string, analyticsData: {
        lifecycleFunnel?: any;
        engagementDashboard?: any;
        retentionAlerts?: any;
        ministryRecommendations?: any;
    }): Promise<void>;
    /**
     * Get cache statistics for monitoring
     */
    getCacheStats(churchId: string): Promise<{
        totalKeys: number;
        keysByType: Record<string, number>;
        memoryUsage: string;
    }>;
    /**
     * Batch cache operations for efficiency
     */
    batchCacheOperations(operations: Array<{
        operation: 'set' | 'get' | 'delete';
        key: AnalyticsCacheKey;
        data?: any;
    }>): Promise<any[]>;
}
export declare const memberAnalyticsCache: MemberAnalyticsCache;
export type { AnalyticsCacheKey, CacheConfig };
//# sourceMappingURL=member-analytics-cache.d.ts.map