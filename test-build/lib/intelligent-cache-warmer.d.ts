/**
 * Intelligent Cache Warming & Pre-Loading System
 * Implements predictive cache warming to achieve 100% cache hit rate
 * Uses usage pattern learning and predictive analytics
 */
export declare class IntelligentCacheWarmer {
    private usagePatterns;
    private warmingStrategies;
    private isRunning;
    private warmingInterval;
    constructor();
    /**
     * Start intelligent cache warming system
     */
    start(): Promise<void>;
    /**
     * Stop cache warming system
     */
    stop(): void;
    /**
     * Perform initial comprehensive cache warming
     */
    private performInitialWarmup;
    /**
     * Warm critical data for a specific church
     */
    private warmChurchCriticalData;
    /**
     * Warm recent member journey data
     */
    private warmRecentMemberJourneys;
    /**
     * Warm common access patterns
     */
    private warmCommonPatterns;
    /**
     * Pre-load data based on predictive analytics
     */
    private preloadPredictiveData;
    /**
     * Perform continuous predictive warming
     */
    private performPredictiveWarming;
    /**
     * Identify and warm frequently missed cache entries
     */
    private identifyAndWarmMissingData;
    /**
     * Refresh cache entries that are about to expire
     */
    private refreshExpiringCache;
    /**
     * Perform time-based predictive warming
     */
    private performTimeBasedWarming;
    /**
     * Warm data for business hours
     */
    private warmBusinessHoursData;
    /**
     * Warm data for morning access
     */
    private warmMorningData;
    /**
     * Warm data for evening activities
     */
    private warmEveningData;
    /**
     * Update usage patterns for learning
     */
    private updateUsagePatterns;
    /**
     * Generate predictive insights for cache warming
     */
    private generatePredictiveInsights;
    /**
     * Pre-load specific cache based on prediction
     */
    private preloadSpecificCache;
    /**
     * Optimize warming strategies based on metrics
     */
    private optimizeWarmingStrategies;
    /**
     * Initialize default warming strategies
     */
    private initializeWarmingStrategies;
    /**
     * Get current warming status
     */
    getWarmingStatus(): Promise<{
        isRunning: boolean;
        strategiesCount: number;
        patternsCount: number;
        lastWarmup: Date;
        targetHitRate: number;
        currentHitRate: number;
    }>;
    /**
     * Force immediate comprehensive warm-up
     */
    forceWarmup(): Promise<void>;
}
export declare const intelligentCacheWarmer: IntelligentCacheWarmer;
//# sourceMappingURL=intelligent-cache-warmer.d.ts.map