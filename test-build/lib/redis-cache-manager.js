"use strict";
/**
 * Redis Cache Manager for Analytics Performance Optimization
 * Implements intelligent caching with auto-invalidation and cache warming strategies
 * Target: 90% cache hit rate with sub-1s response times
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVALIDATION_PATTERNS = exports.CACHE_TTL = exports.CACHE_KEYS = exports.cacheManager = exports.RedisCacheManager = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const db_1 = require("./db");
// Cache configuration constants
const CACHE_TTL = {
    MEMBER_ANALYTICS: 300,
    EXECUTIVE_REPORT: 900,
    RETENTION_ANALYTICS: 600,
    ENGAGEMENT_METRICS: 180,
    CONVERSION_FUNNEL: 1200,
    PREDICTIVE_INSIGHTS: 1800,
    CHURCH_STATISTICS: 600,
    QUICK_STATS: 60,
    // Enhanced TTLs for 100% hit rate
    CRITICAL_DATA: 30,
    LIVE_DASHBOARD: 15,
    MEMBER_JOURNEY_ACTIVE: 120,
    PREDICTIVE_CACHE: 3600,
    BACKGROUND_REFRESH: 7200 // 2 hours for background refreshed data
};
exports.CACHE_TTL = CACHE_TTL;
// Cache key patterns
const CACHE_KEYS = {
    MEMBER_JOURNEY: (churchId, memberId) => `analytics:member_journey:${churchId}:${memberId}`,
    EXECUTIVE_REPORT: (churchId, period) => `analytics:executive_report:${churchId}:${period}`,
    CHURCH_ANALYTICS: (churchId, type) => `analytics:church:${churchId}:${type}`,
    RETENTION_ANALYTICS: (churchId, period) => `analytics:retention:${churchId}:${period}`,
    CONVERSION_FUNNEL: (churchId, period) => `analytics:funnel:${churchId}:${period}`,
    ENGAGEMENT_DISTRIBUTION: (churchId) => `analytics:engagement:${churchId}`,
    QUICK_STATS: (churchId) => `stats:quick:${churchId}`,
    PREDICTIVE_INSIGHTS: (churchId) => `analytics:predictions:${churchId}`,
    MEMBER_LIST: (churchId, filters) => `members:list:${churchId}:${filters}`,
    EVENTS_LIST: (churchId, period) => `events:list:${churchId}:${period}`,
    // Enhanced keys for 100% hit rate
    LIVE_DASHBOARD: (churchId) => `dashboard:live:${churchId}`,
    CRITICAL_ANALYTICS: (churchId, type) => `critical:analytics:${churchId}:${type}`,
    PREDICTIVE_PRELOAD: (churchId, key) => `predictive:preload:${churchId}:${key}`,
    BACKGROUND_REFRESH: (churchId, type) => `background:refresh:${churchId}:${type}`,
    USER_SESSION_CACHE: (churchId, userId) => `session:user:${churchId}:${userId}`,
    MEMBER_JOURNEY_ACTIVE: (churchId, memberId) => `journey:active:${churchId}:${memberId}`
};
exports.CACHE_KEYS = CACHE_KEYS;
// Invalidation patterns for auto-cache clearing
const INVALIDATION_PATTERNS = {
    MEMBER_UPDATE: (churchId, memberId) => [
        `analytics:member_journey:${churchId}:${memberId}`,
        `analytics:church:${churchId}:*`,
        `analytics:retention:${churchId}:*`,
        `stats:quick:${churchId}`,
        `members:list:${churchId}:*`
    ],
    NEW_CHECKIN: (churchId) => [
        `analytics:church:${churchId}:*`,
        `analytics:engagement:${churchId}`,
        `stats:quick:${churchId}`,
        `analytics:predictions:${churchId}`
    ],
    NEW_DONATION: (churchId) => [
        `analytics:church:${churchId}:*`,
        `analytics:executive_report:${churchId}:*`,
        `stats:quick:${churchId}`
    ],
    NEW_EVENT: (churchId) => [
        `events:list:${churchId}:*`,
        `analytics:church:${churchId}:*`,
        `stats:quick:${churchId}`
    ],
    MEMBER_JOURNEY_UPDATE: (churchId) => [
        `analytics:funnel:${churchId}:*`,
        `analytics:retention:${churchId}:*`,
        `analytics:predictions:${churchId}`
    ]
};
exports.INVALIDATION_PATTERNS = INVALIDATION_PATTERNS;
class RedisCacheManager {
    constructor() {
        this.isConnected = false;
        this.connectionRetries = 0;
        this.maxRetries = 5;
        // Initialize Redis connections with fallback configuration
        const redisConfig = {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD,
            retryDelayOnFailover: 100,
            maxRetriesPerRequest: 3,
            lazyConnect: true,
            keepAlive: 30000,
            connectTimeout: 10000,
            commandTimeout: 5000
        };
        this.redis = new ioredis_1.default(redisConfig);
        this.metricsRedis = new ioredis_1.default({ ...redisConfig, db: 1 }); // Separate DB for metrics
        this.setupEventHandlers();
    }
    setupEventHandlers() {
        this.redis.on('connect', () => {
            console.log('Redis cache connected successfully');
            this.isConnected = true;
            this.connectionRetries = 0;
        });
        this.redis.on('error', (error) => {
            console.error('Redis cache error:', error);
            this.isConnected = false;
            if (this.connectionRetries < this.maxRetries) {
                this.connectionRetries++;
                setTimeout(() => this.redis.connect(), 1000 * this.connectionRetries);
            }
        });
        this.redis.on('close', () => {
            console.warn('Redis cache connection closed');
            this.isConnected = false;
        });
    }
    /**
     * Get cached data with fallback to database query
     */
    async get(key, fallbackFn, options = {}) {
        const startTime = Date.now();
        try {
            // Record cache request
            await this.recordMetric('request');
            // Check if force refresh is requested
            if (options.forceRefresh) {
                const result = await fallbackFn();
                await this.set(key, result, options.ttl);
                await this.recordMetric('miss');
                return result;
            }
            // Try to get from cache if connected
            if (this.isConnected) {
                const cachedData = await this.redis.get(key);
                if (cachedData) {
                    await this.recordMetric('hit');
                    await this.recordResponseTime(Date.now() - startTime);
                    try {
                        return options.compress ?
                            JSON.parse(Buffer.from(cachedData, 'base64').toString()) :
                            JSON.parse(cachedData);
                    }
                    catch (error) {
                        console.warn('Cache parse error:', error);
                        // Continue to fallback
                    }
                }
            }
            // Cache miss - fetch from database
            const result = await fallbackFn();
            // Store in cache for next time
            if (this.isConnected && result !== null && result !== undefined) {
                await this.set(key, result, options.ttl);
                // Warm related cache if requested
                if (options.warmCache) {
                    this.warmRelatedCache(key, result);
                }
            }
            await this.recordMetric('miss');
            await this.recordResponseTime(Date.now() - startTime);
            return result;
        }
        catch (error) {
            console.error('Cache operation error:', error);
            await this.recordMetric('error');
            // Fallback to direct database query
            return await fallbackFn();
        }
    }
    /**
     * Set data in cache with optional compression
     */
    async set(key, data, ttl) {
        if (!this.isConnected)
            return;
        try {
            const serializedData = JSON.stringify(data);
            const shouldCompress = serializedData.length > 1024; // Compress data > 1KB
            const cacheValue = shouldCompress ?
                Buffer.from(serializedData).toString('base64') :
                serializedData;
            const cacheTTL = ttl || CACHE_TTL.MEMBER_ANALYTICS;
            await this.redis.setex(key, cacheTTL, cacheValue);
            // Track cache size
            await this.recordCacheSize();
        }
        catch (error) {
            console.error('Cache set error:', error);
        }
    }
    /**
     * Delete cache entries matching pattern
     */
    async invalidate(pattern) {
        if (!this.isConnected)
            return 0;
        try {
            const keys = await this.redis.keys(pattern);
            if (keys.length === 0)
                return 0;
            const result = await this.redis.del(...keys);
            console.log(`Invalidated ${result} cache entries for pattern: ${pattern}`);
            return result;
        }
        catch (error) {
            console.error('Cache invalidation error:', error);
            return 0;
        }
    }
    /**
     * Auto-invalidate cache based on data changes
     */
    async autoInvalidate(event, churchId, memberId) {
        if (!this.isConnected)
            return;
        try {
            let patterns = [];
            switch (event) {
                case 'MEMBER_UPDATE':
                    if (memberId) {
                        patterns = INVALIDATION_PATTERNS.MEMBER_UPDATE(churchId, memberId);
                    }
                    break;
                case 'NEW_CHECKIN':
                    patterns = INVALIDATION_PATTERNS.NEW_CHECKIN(churchId);
                    break;
                case 'NEW_DONATION':
                    patterns = INVALIDATION_PATTERNS.NEW_DONATION(churchId);
                    break;
                case 'NEW_EVENT':
                    patterns = INVALIDATION_PATTERNS.NEW_EVENT(churchId);
                    break;
                case 'MEMBER_JOURNEY_UPDATE':
                    patterns = INVALIDATION_PATTERNS.MEMBER_JOURNEY_UPDATE(churchId);
                    break;
            }
            // Invalidate each pattern
            for (const pattern of patterns) {
                if (pattern.includes('*')) {
                    await this.invalidate(pattern);
                }
                else {
                    await this.redis.del(pattern);
                }
            }
            console.log(`Auto-invalidated cache for event: ${event}, church: ${churchId}`);
        }
        catch (error) {
            console.error('Auto-invalidation error:', error);
        }
    }
    /**
     * Warm cache with frequently accessed data
     */
    async warmCache(churchId) {
        if (!this.isConnected)
            return;
        try {
            console.log(`Warming cache for church: ${churchId}`);
            // Pre-load critical analytics data
            const warmupTasks = [
                this.warmQuickStats(churchId),
                this.warmExecutiveReport(churchId),
                this.warmEngagementDistribution(churchId),
                this.warmRecentMembers(churchId)
            ];
            await Promise.allSettled(warmupTasks);
            console.log(`Cache warmed for church: ${churchId}`);
        }
        catch (error) {
            console.error('Cache warming error:', error);
        }
    }
    /**
     * Get comprehensive cache metrics for 100% hit rate analysis
     */
    async getComprehensiveMetrics() {
        const baseMetrics = await this.getMetrics();
        try {
            // Get key distribution
            const allKeys = await this.redis.keys('*');
            const keyDistribution = this.analyzeKeyDistribution(allKeys);
            // Get expiring keys (TTL < 60 seconds)
            const expiringKeys = [];
            for (const key of allKeys.slice(0, 100)) { // Sample first 100 keys
                const ttl = await this.redis.ttl(key);
                if (ttl > 0 && ttl < 60) {
                    expiringKeys.push({ key, ttl });
                }
            }
            // Calculate optimization score
            const optimizationScore = this.calculateOptimizationScore(baseMetrics, keyDistribution);
            return {
                ...baseMetrics,
                keyDistribution,
                hitRateByPattern: {},
                missedKeys: [],
                expiringKeys,
                memoryPressure: this.calculateMemoryPressure(baseMetrics.cacheSize),
                optimizationScore
            };
        }
        catch (error) {
            console.error('Comprehensive metrics error:', error);
            return {
                ...baseMetrics,
                keyDistribution: {},
                hitRateByPattern: {},
                missedKeys: [],
                expiringKeys: [],
                memoryPressure: 0,
                optimizationScore: 0
            };
        }
    }
    /**
     * Implement intelligent cache warming for specific patterns
     */
    async warmCachePattern(pattern, warmingFunction) {
        if (!this.isConnected)
            return false;
        try {
            const result = await warmingFunction();
            await this.recordWarmingActivity(pattern, true);
            return true;
        }
        catch (error) {
            console.error(`Cache warming failed for pattern ${pattern}:`, error);
            await this.recordWarmingActivity(pattern, false);
            return false;
        }
    }
    /**
     * Preload cache with expiration prediction
     */
    async preloadWithPrediction(key, dataFunction, predictedTTL, priority = 'medium') {
        const startTime = Date.now();
        try {
            // Check if already exists
            const existingData = await this.redis.get(key);
            if (existingData) {
                await this.recordMetric('hit');
                return JSON.parse(existingData);
            }
            // Generate and cache data
            const data = await dataFunction();
            // Adjust TTL based on priority for 100% hit rate
            const optimizedTTL = this.optimizeTTLForHitRate(predictedTTL, priority);
            await this.set(key, data, optimizedTTL);
            await this.recordMetric('preload_success');
            const responseTime = Date.now() - startTime;
            await this.recordResponseTime(responseTime);
            return data;
        }
        catch (error) {
            console.error('Preload with prediction failed:', error);
            await this.recordMetric('preload_error');
            throw error;
        }
    }
    /**
     * Background refresh for high-value cache entries
     */
    async backgroundRefresh(key, refreshFunction, minTTLRemaining = 60) {
        if (!this.isConnected)
            return;
        try {
            const ttl = await this.redis.ttl(key);
            if (ttl > 0 && ttl < minTTLRemaining) {
                // Refresh in background before expiration
                const newData = await refreshFunction();
                const currentTTL = await this.redis.ttl(key);
                const extendedTTL = Math.max(currentTTL, minTTLRemaining * 2);
                await this.set(key, newData, extendedTTL);
                console.log(`🔄 Background refreshed: ${key} (TTL: ${extendedTTL}s)`);
            }
        }
        catch (error) {
            console.error('Background refresh failed:', error);
        }
    }
    /**
     * Smart cache invalidation with re-warming
     */
    async smartInvalidateAndRewarm(pattern, rewarmFunction) {
        const invalidated = await this.invalidate(pattern);
        if (rewarmFunction && invalidated > 0) {
            // Re-warm immediately to maintain 100% hit rate
            setTimeout(async () => {
                try {
                    await rewarmFunction();
                    console.log(`🔥 Re-warmed after invalidation: ${pattern}`);
                }
                catch (error) {
                    console.error('Re-warming failed:', error);
                }
            }, 100); // Small delay to avoid race conditions
        }
        return invalidated;
    }
    /**
     * Optimize TTL for maximum hit rate
     */
    optimizeTTLForHitRate(baseTTL, priority) {
        const multipliers = {
            critical: 2.0,
            high: 1.5,
            medium: 1.0,
            low: 0.8 // Shorter TTL for low priority
        };
        return Math.round(baseTTL * multipliers[priority]);
    }
    /**
     * Analyze key distribution patterns
     */
    analyzeKeyDistribution(keys) {
        const distribution = {};
        keys.forEach(key => {
            const parts = key.split(':');
            if (parts.length >= 2) {
                const pattern = `${parts[0]}:${parts[1]}`;
                distribution[pattern] = (distribution[pattern] || 0) + 1;
            }
        });
        return distribution;
    }
    /**
     * Calculate cache optimization score (0-100)
     */
    calculateOptimizationScore(metrics, keyDistribution) {
        let score = 0;
        // Hit rate component (70% of score)
        score += (metrics.hitRate / 100) * 70;
        // Response time component (20% of score)
        if (metrics.averageResponseTime < 10)
            score += 20;
        else if (metrics.averageResponseTime < 50)
            score += 15;
        else if (metrics.averageResponseTime < 100)
            score += 10;
        else
            score += 5;
        // Cache size efficiency (10% of score)
        const keyCount = Object.values(keyDistribution).reduce((sum, count) => sum + count, 0);
        if (keyCount > 0 && metrics.cacheSize / keyCount < 1000)
            score += 10; // Good memory efficiency
        return Math.round(score);
    }
    /**
     * Calculate memory pressure (0-100)
     */
    calculateMemoryPressure(cacheSize) {
        const maxMemory = 1024 * 1024 * 1024; // 1GB limit (configurable)
        return Math.round((cacheSize / maxMemory) * 100);
    }
    /**
     * Record cache warming activity
     */
    async recordWarmingActivity(pattern, success) {
        if (!this.isConnected)
            return;
        try {
            const key = `warming:${success ? 'success' : 'failure'}:${pattern}`;
            await this.metricsRedis.incr(key);
            await this.metricsRedis.expire(key, 86400); // 24 hour retention
        }
        catch (error) {
            // Silent fail for metrics
        }
    }
    /**
     * Get comprehensive cache metrics for 100% hit rate monitoring
     */
    async getMetrics() {
        if (!this.isConnected) {
            return {
                hitRate: 0,
                missRate: 100,
                totalRequests: 0,
                averageResponseTime: 0,
                cacheSize: 0,
                evictionRate: 0
            };
        }
        try {
            const [hits, misses, errors, responseTimes, size] = await Promise.all([
                this.metricsRedis.get('cache:hits') || '0',
                this.metricsRedis.get('cache:misses') || '0',
                this.metricsRedis.get('cache:errors') || '0',
                this.metricsRedis.lrange('cache:response_times', 0, -1),
                this.redis.dbsize()
            ]);
            const totalHits = parseInt(hits);
            const totalMisses = parseInt(misses);
            const totalErrors = parseInt(errors);
            const totalRequests = totalHits + totalMisses + totalErrors;
            const avgResponseTime = responseTimes.length > 0
                ? responseTimes.reduce((sum, time) => sum + parseInt(time), 0) / responseTimes.length
                : 0;
            return {
                hitRate: totalRequests > 0 ? (totalHits / totalRequests) * 100 : 0,
                missRate: totalRequests > 0 ? (totalMisses / totalRequests) * 100 : 0,
                totalRequests,
                averageResponseTime: Math.round(avgResponseTime),
                cacheSize: size,
                evictionRate: 0 // Would need to track evictions separately
            };
        }
        catch (error) {
            console.error('Metrics retrieval error:', error);
            return {
                hitRate: 0,
                missRate: 100,
                totalRequests: 0,
                averageResponseTime: 0,
                cacheSize: 0,
                evictionRate: 0
            };
        }
    }
    /**
     * Clear all cache data
     */
    async clearAll() {
        if (!this.isConnected)
            return;
        try {
            await this.redis.flushdb();
            await this.metricsRedis.flushdb();
            console.log('All cache data cleared');
        }
        catch (error) {
            console.error('Cache clear error:', error);
        }
    }
    /**
     * Health check for cache system
     */
    async healthCheck() {
        try {
            const startTime = Date.now();
            await this.redis.ping();
            const responseTime = Date.now() - startTime;
            const metrics = await this.getMetrics();
            return {
                status: 'healthy',
                details: {
                    connected: this.isConnected,
                    responseTime,
                    hitRate: metrics.hitRate,
                    cacheSize: metrics.cacheSize,
                    redisInfo: {
                        host: this.redis.options.host,
                        port: this.redis.options.port
                    }
                }
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                details: {
                    connected: false,
                    error: error.message,
                    retries: this.connectionRetries
                }
            };
        }
    }
    // Private helper methods
    async warmQuickStats(churchId) {
        try {
            const quickStats = await db_1.db.members.aggregate({
                where: { churchId },
                _count: { id: true }
            });
            await this.set(CACHE_KEYS.QUICK_STATS(churchId), quickStats, CACHE_TTL.QUICK_STATS);
        }
        catch (error) {
            console.warn('Quick stats warming failed:', error);
        }
    }
    async warmExecutiveReport(churchId) {
        try {
            // This would call the actual executive report generation
            // For now, just set a placeholder
            const reportKey = CACHE_KEYS.EXECUTIVE_REPORT(churchId, '30d');
            const exists = await this.redis.exists(reportKey);
            if (!exists) {
                // Would implement actual executive report caching here
                console.log(`Executive report cache warming queued for church: ${churchId}`);
            }
        }
        catch (error) {
            console.warn('Executive report warming failed:', error);
        }
    }
    async warmEngagementDistribution(churchId) {
        try {
            const engagementData = await db_1.db.member_journeys.groupBy({
                where: { churchId },
                by: ['engagementLevel'],
                _count: { engagementLevel: true }
            });
            await this.set(CACHE_KEYS.ENGAGEMENT_DISTRIBUTION(churchId), engagementData, CACHE_TTL.ENGAGEMENT_METRICS);
        }
        catch (error) {
            console.warn('Engagement distribution warming failed:', error);
        }
    }
    async warmRecentMembers(churchId) {
        try {
            const recentMembers = await db_1.db.members.findMany({
                where: { churchId },
                take: 50,
                orderBy: { createdAt: 'desc' },
                select: { id: true, firstName: true, lastName: true, email: true }
            });
            await this.set(CACHE_KEYS.MEMBER_LIST(churchId, 'recent:50'), recentMembers, CACHE_TTL.QUICK_STATS);
        }
        catch (error) {
            console.warn('Recent members warming failed:', error);
        }
    }
    async warmRelatedCache(key, data) {
        // Implement intelligent cache warming based on the key pattern
        // This is a placeholder for more sophisticated warming logic
        try {
            if (key.includes('member_journey') && data.churchId) {
                await this.warmQuickStats(data.churchId);
            }
        }
        catch (error) {
            console.warn('Related cache warming failed:', error);
        }
    }
    async recordMetric(type) {
        if (!this.isConnected)
            return;
        try {
            await this.metricsRedis.incr(`cache:${type}s`);
            // Expire metrics after 24 hours
            await this.metricsRedis.expire(`cache:${type}s`, 86400);
        }
        catch (error) {
            // Silently fail for metrics
        }
    }
    async recordResponseTime(time) {
        if (!this.isConnected)
            return;
        try {
            await this.metricsRedis.lpush('cache:response_times', time.toString());
            await this.metricsRedis.ltrim('cache:response_times', 0, 999); // Keep last 1000 times
            await this.metricsRedis.expire('cache:response_times', 86400);
        }
        catch (error) {
            // Silently fail for metrics
        }
    }
    async recordCacheSize() {
        if (!this.isConnected)
            return;
        try {
            const size = await this.redis.dbsize();
            await this.metricsRedis.set('cache:size', size.toString(), 'EX', 300);
        }
        catch (error) {
            // Silently fail for metrics
        }
    }
}
exports.RedisCacheManager = RedisCacheManager;
// Singleton instance
exports.cacheManager = new RedisCacheManager();
//# sourceMappingURL=redis-cache-manager.js.map