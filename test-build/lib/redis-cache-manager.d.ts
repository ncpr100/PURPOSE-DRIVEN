/**
 * Redis Cache Manager for Analytics Performance Optimization
 * Implements intelligent caching with auto-invalidation and cache warming strategies
 * Target: 90% cache hit rate with sub-1s response times
 */
declare const CACHE_TTL: {
    readonly MEMBER_ANALYTICS: 300;
    readonly EXECUTIVE_REPORT: 900;
    readonly RETENTION_ANALYTICS: 600;
    readonly ENGAGEMENT_METRICS: 180;
    readonly CONVERSION_FUNNEL: 1200;
    readonly PREDICTIVE_INSIGHTS: 1800;
    readonly CHURCH_STATISTICS: 600;
    readonly QUICK_STATS: 60;
    readonly CRITICAL_DATA: 30;
    readonly LIVE_DASHBOARD: 15;
    readonly MEMBER_JOURNEY_ACTIVE: 120;
    readonly PREDICTIVE_CACHE: 3600;
    readonly BACKGROUND_REFRESH: 7200;
};
declare const CACHE_KEYS: {
    readonly MEMBER_JOURNEY: (churchId: string, memberId: string) => string;
    readonly EXECUTIVE_REPORT: (churchId: string, period: string) => string;
    readonly CHURCH_ANALYTICS: (churchId: string, type: string) => string;
    readonly RETENTION_ANALYTICS: (churchId: string, period: number) => string;
    readonly CONVERSION_FUNNEL: (churchId: string, period: number) => string;
    readonly ENGAGEMENT_DISTRIBUTION: (churchId: string) => string;
    readonly QUICK_STATS: (churchId: string) => string;
    readonly PREDICTIVE_INSIGHTS: (churchId: string) => string;
    readonly MEMBER_LIST: (churchId: string, filters: string) => string;
    readonly EVENTS_LIST: (churchId: string, period: string) => string;
    readonly LIVE_DASHBOARD: (churchId: string) => string;
    readonly CRITICAL_ANALYTICS: (churchId: string, type: string) => string;
    readonly PREDICTIVE_PRELOAD: (churchId: string, key: string) => string;
    readonly BACKGROUND_REFRESH: (churchId: string, type: string) => string;
    readonly USER_SESSION_CACHE: (churchId: string, userId: string) => string;
    readonly MEMBER_JOURNEY_ACTIVE: (churchId: string, memberId: string) => string;
};
declare const INVALIDATION_PATTERNS: {
    readonly MEMBER_UPDATE: (churchId: string, memberId: string) => string[];
    readonly NEW_CHECKIN: (churchId: string) => string[];
    readonly NEW_DONATION: (churchId: string) => string[];
    readonly NEW_EVENT: (churchId: string) => string[];
    readonly MEMBER_JOURNEY_UPDATE: (churchId: string) => string[];
};
export interface CacheOptions {
    ttl?: number;
    compress?: boolean;
    forceRefresh?: boolean;
    warmCache?: boolean;
}
export interface CacheMetrics {
    hitRate: number;
    missRate: number;
    totalRequests: number;
    averageResponseTime: number;
    cacheSize: number;
    evictionRate: number;
}
export declare class RedisCacheManager {
    private redis;
    private metricsRedis;
    private isConnected;
    private connectionRetries;
    private maxRetries;
    constructor();
    private setupEventHandlers;
    /**
     * Get cached data with fallback to database query
     */
    get<T>(key: string, fallbackFn: () => Promise<T>, options?: CacheOptions): Promise<T>;
    /**
     * Set data in cache with optional compression
     */
    set<T>(key: string, data: T, ttl?: number): Promise<void>;
    /**
     * Delete cache entries matching pattern
     */
    invalidate(pattern: string): Promise<number>;
    /**
     * Auto-invalidate cache based on data changes
     */
    autoInvalidate(event: keyof typeof INVALIDATION_PATTERNS, churchId: string, memberId?: string): Promise<void>;
    /**
     * Warm cache with frequently accessed data
     */
    warmCache(churchId: string): Promise<void>;
    /**
     * Get comprehensive cache metrics for 100% hit rate analysis
     */
    getComprehensiveMetrics(): Promise<CacheMetrics & {
        keyDistribution: {
            [pattern: string]: number;
        };
        hitRateByPattern: {
            [pattern: string]: number;
        };
        missedKeys: string[];
        expiringKeys: Array<{
            key: string;
            ttl: number;
        }>;
        memoryPressure: number;
        optimizationScore: number;
    }>;
    /**
     * Implement intelligent cache warming for specific patterns
     */
    warmCachePattern(pattern: string, warmingFunction: () => Promise<any>): Promise<boolean>;
    /**
     * Preload cache with expiration prediction
     */
    preloadWithPrediction<T>(key: string, dataFunction: () => Promise<T>, predictedTTL: number, priority?: 'critical' | 'high' | 'medium' | 'low'): Promise<T>;
    /**
     * Background refresh for high-value cache entries
     */
    backgroundRefresh<T>(key: string, refreshFunction: () => Promise<T>, minTTLRemaining?: number): Promise<void>;
    /**
     * Smart cache invalidation with re-warming
     */
    smartInvalidateAndRewarm(pattern: string, rewarmFunction?: () => Promise<void>): Promise<number>;
    /**
     * Optimize TTL for maximum hit rate
     */
    private optimizeTTLForHitRate;
    /**
     * Analyze key distribution patterns
     */
    private analyzeKeyDistribution;
    /**
     * Calculate cache optimization score (0-100)
     */
    private calculateOptimizationScore;
    /**
     * Calculate memory pressure (0-100)
     */
    private calculateMemoryPressure;
    /**
     * Record cache warming activity
     */
    private recordWarmingActivity;
    /**
     * Get comprehensive cache metrics for 100% hit rate monitoring
     */
    getMetrics(): Promise<CacheMetrics>;
    /**
     * Clear all cache data
     */
    clearAll(): Promise<void>;
    /**
     * Health check for cache system
     */
    healthCheck(): Promise<{
        status: 'healthy' | 'unhealthy';
        details: any;
    }>;
    private warmQuickStats;
    private warmExecutiveReport;
    private warmEngagementDistribution;
    private warmRecentMembers;
    private warmRelatedCache;
    private recordMetric;
    private recordResponseTime;
    private recordCacheSize;
}
export declare const cacheManager: RedisCacheManager;
export { CACHE_KEYS, CACHE_TTL, INVALIDATION_PATTERNS };
//# sourceMappingURL=redis-cache-manager.d.ts.map