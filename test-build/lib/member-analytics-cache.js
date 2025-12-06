"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberAnalyticsCache = void 0;
const redis_1 = require("@upstash/redis");
class MemberAnalyticsCache {
    constructor() {
        this.redis = new redis_1.Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
        this.config = {
            defaultTTL: 300,
            member_journeysTTL: 1800,
            engagementTTL: 600,
            retentionTTL: 3600,
            recommendationsTTL: 1800, // 30 minutes - recommendations change based on patterns
        };
    }
    /**
     * Generate a standardized cache key for member analytics
     */
    generateCacheKey(keyData) {
        const parts = [
            'analytics',
            'member',
            keyData.church_id,
            keyData.type,
            keyData.subtype,
            keyData.member_id,
            keyData.date_range
        ].filter(Boolean);
        return parts.join(':');
    }
    /**
     * Get TTL based on analytics type
     */
    getTTL(type) {
        switch (type) {
            case 'lifecycle':
                return this.config.member_journeysTTL;
            case 'engagement':
                return this.config.engagementTTL;
            case 'retention':
                return this.config.retentionTTL;
            case 'recommendations':
                return this.config.recommendationsTTL;
            case 'timeline':
                return this.config.member_journeysTTL;
            case 'behavioral':
                return this.config.retentionTTL;
            default:
                return this.config.defaultTTL;
        }
    }
    /**
     * Cache member lifecycle funnel data
     */
    async cacheLifecycleFunnel(churchId, data, dateRange) {
        const key = this.generateCacheKey({
            church_id: churchId,
            type: 'lifecycle',
            subtype: 'funnel',
            date_range: dateRange
        });
        await this.redis.setex(key, this.getTTL('lifecycle'), JSON.stringify(data));
    }
    /**
     * Get cached lifecycle funnel data
     */
    async getLifecycleFunnel(churchId, dateRange) {
        const key = this.generateCacheKey({
            church_id: churchId,
            type: 'lifecycle',
            subtype: 'funnel',
            date_range: dateRange
        });
        const cached = await this.redis.get(key);
        return cached ? JSON.parse(cached) : null;
    }
    /**
     * Cache engagement score dashboard data
     */
    async cacheEngagementDashboard(churchId, data) {
        const key = this.generateCacheKey({
            church_id: churchId,
            type: 'engagement',
            subtype: 'dashboard'
        });
        await this.redis.setex(key, this.getTTL('engagement'), JSON.stringify(data));
    }
    /**
     * Get cached engagement dashboard data
     */
    async getEngagementDashboard(churchId) {
        const key = this.generateCacheKey({
            church_id: churchId,
            type: 'engagement',
            subtype: 'dashboard'
        });
        const cached = await this.redis.get(key);
        return cached ? JSON.parse(cached) : null;
    }
    /**
     * Cache retention risk alerts
     */
    async cacheRetentionAlerts(churchId, data) {
        const key = this.generateCacheKey({
            church_id: churchId,
            type: 'retention',
            subtype: 'alerts'
        });
        await this.redis.setex(key, this.getTTL('retention'), JSON.stringify(data));
    }
    /**
     * Get cached retention alerts
     */
    async getRetentionAlerts(churchId) {
        const key = this.generateCacheKey({
            church_id: churchId,
            type: 'retention',
            subtype: 'alerts'
        });
        const cached = await this.redis.get(key);
        return cached ? JSON.parse(cached) : null;
    }
    /**
     * Cache ministry recommendations
     */
    async cacheMinistryRecommendations(churchId, data) {
        const key = this.generateCacheKey({
            church_id: churchId,
            type: 'recommendations',
            subtype: 'ministry'
        });
        await this.redis.setex(key, this.getTTL('recommendations'), JSON.stringify(data));
    }
    /**
     * Get cached ministry recommendations
     */
    async getMinistryRecommendations(churchId) {
        const key = this.generateCacheKey({
            church_id: churchId,
            type: 'recommendations',
            subtype: 'ministry'
        });
        const cached = await this.redis.get(key);
        return cached ? JSON.parse(cached) : null;
    }
    /**
     * Cache individual member timeline
     */
    async cacheMemberTimeline(churchId, memberId, data) {
        const key = this.generateCacheKey({
            church_id: churchId,
            type: 'timeline',
            subtype: 'individual',
            member_id: memberId
        });
        await this.redis.setex(key, this.getTTL('timeline'), JSON.stringify(data));
    }
    /**
     * Get cached member timeline
     */
    async getMemberTimeline(churchId, memberId) {
        const key = this.generateCacheKey({
            church_id: churchId,
            type: 'timeline',
            subtype: 'individual',
            member_id: memberId
        });
        const cached = await this.redis.get(key);
        return cached ? JSON.parse(cached) : null;
    }
    /**
     * Cache member behavioral patterns
     */
    async cacheBehavioralPatterns(churchId, memberId, data) {
        const key = this.generateCacheKey({
            church_id: churchId,
            type: 'behavioral',
            subtype: 'patterns',
            member_id: memberId
        });
        await this.redis.setex(key, this.getTTL('behavioral'), JSON.stringify(data));
    }
    /**
     * Get cached behavioral patterns
     */
    async getBehavioralPatterns(churchId, memberId) {
        const key = this.generateCacheKey({
            church_id: churchId,
            type: 'behavioral',
            subtype: 'patterns',
            member_id: memberId
        });
        const cached = await this.redis.get(key);
        return cached ? JSON.parse(cached) : null;
    }
    /**
     * Invalidate cache for a specific church and type
     */
    async invalidateChurchCache(churchId, type) {
        const pattern = type
            ? `analytics:member:${churchId}:${type}:*`
            : `analytics:member:${churchId}:*`;
        // Note: Redis KEYS command should be used carefully in production
        // Consider using SCAN for large datasets
        const keys = await this.redis.keys(pattern);
        if (keys.length > 0) {
            await this.redis.del(...keys);
        }
    }
    /**
     * Invalidate cache for a specific member
     */
    async invalidateMemberCache(churchId, memberId) {
        const patterns = [
            `analytics:member:${churchId}:timeline:*:${memberId}:*`,
            `analytics:member:${churchId}:behavioral:*:${memberId}:*`,
            `analytics:member:${churchId}:engagement:*`,
            `analytics:member:${churchId}:lifecycle:*`, // Lifecycle changes affect funnel
        ];
        for (const pattern of patterns) {
            const keys = await this.redis.keys(pattern);
            if (keys.length > 0) {
                await this.redis.del(...keys);
            }
        }
    }
    /**
     * Warm up cache with precomputed analytics
     */
    async warmupCache(churchId, analyticsData) {
        const promises = [];
        if (analyticsData.lifecycleFunnel) {
            promises.push(this.cacheLifecycleFunnel(churchId, analyticsData.lifecycleFunnel));
        }
        if (analyticsData.engagementDashboard) {
            promises.push(this.cacheEngagementDashboard(churchId, analyticsData.engagementDashboard));
        }
        if (analyticsData.retentionAlerts) {
            promises.push(this.cacheRetentionAlerts(churchId, analyticsData.retentionAlerts));
        }
        if (analyticsData.ministryRecommendations) {
            promises.push(this.cacheMinistryRecommendations(churchId, analyticsData.ministryRecommendations));
        }
        await Promise.all(promises);
    }
    /**
     * Get cache statistics for monitoring
     */
    async getCacheStats(churchId) {
        const pattern = `analytics:member:${churchId}:*`;
        const keys = await this.redis.keys(pattern);
        const keysByType = {};
        keys.forEach(key => {
            const parts = key.split(':');
            const type = parts[3]; // analytics:member:churchId:TYPE:...
            keysByType[type] = (keysByType[type] || 0) + 1;
        });
        return {
            totalKeys: keys.length,
            keysByType,
            memoryUsage: 'N/A' // Would need additional Redis commands to calculate
        };
    }
    /**
     * Batch cache operations for efficiency
     */
    async batchCacheOperations(operations) {
        const pipeline = this.redis.pipeline();
        operations.forEach(op => {
            const cacheKey = this.generateCacheKey(op.key);
            switch (op.operation) {
                case 'set':
                    pipeline.setex(cacheKey, this.getTTL(op.key.type), JSON.stringify(op.data));
                    break;
                case 'get':
                    pipeline.get(cacheKey);
                    break;
                case 'delete':
                    pipeline.del(cacheKey);
                    break;
            }
        });
        const results = await pipeline.exec();
        // Parse JSON results for get operations
        return results.map((result, index) => {
            if (operations[index].operation === 'get' && result[1]) {
                try {
                    return JSON.parse(result[1]);
                }
                catch {
                    return null;
                }
            }
            return result[1];
        });
    }
}
// Export singleton instance
exports.memberAnalyticsCache = new MemberAnalyticsCache();
//# sourceMappingURL=member-analytics-cache.js.map