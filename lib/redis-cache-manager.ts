/**
 * Redis Cache Manager for Analytics Performance Optimization
 * Implements intelligent caching with auto-invalidation and cache warming strategies
 * Target: 90% cache hit rate with sub-1s response times
 */

import Redis from 'ioredis';
import { db } from './db';

// Cache configuration constants
const CACHE_TTL = {
  MEMBER_ANALYTICS: 300, // 5 minutes
  EXECUTIVE_REPORT: 900, // 15 minutes
  RETENTION_ANALYTICS: 600, // 10 minutes
  ENGAGEMENT_METRICS: 180, // 3 minutes
  CONVERSION_FUNNEL: 1200, // 20 minutes
  PREDICTIVE_INSIGHTS: 1800, // 30 minutes
  CHURCH_STATISTICS: 600, // 10 minutes
  QUICK_STATS: 60, // 1 minute for frequently accessed data
  // Enhanced TTLs for 100% hit rate
  CRITICAL_DATA: 30, // 30 seconds for ultra-critical data
  LIVE_DASHBOARD: 15, // 15 seconds for real-time dashboards
  MEMBER_JOURNEY_ACTIVE: 120, // 2 minutes for active member journeys
  PREDICTIVE_CACHE: 3600, // 1 hour for predictive pre-loaded data
  BACKGROUND_REFRESH: 7200 // 2 hours for background refreshed data
} as const;

// Cache key patterns
const CACHE_KEYS = {
  MEMBER_JOURNEY: (churchId: string, memberId: string) => `analytics:member_journey:${churchId}:${memberId}`,
  EXECUTIVE_REPORT: (churchId: string, period: string) => `analytics:executive_report:${churchId}:${period}`,
  CHURCH_ANALYTICS: (churchId: string, type: string) => `analytics:church:${churchId}:${type}`,
  RETENTION_ANALYTICS: (churchId: string, period: number) => `analytics:retention:${churchId}:${period}`,
  CONVERSION_FUNNEL: (churchId: string, period: number) => `analytics:funnel:${churchId}:${period}`,
  ENGAGEMENT_DISTRIBUTION: (churchId: string) => `analytics:engagement:${churchId}`,
  QUICK_STATS: (churchId: string) => `stats:quick:${churchId}`,
  PREDICTIVE_INSIGHTS: (churchId: string) => `analytics:predictions:${churchId}`,
  MEMBER_LIST: (churchId: string, filters: string) => `members:list:${churchId}:${filters}`,
  EVENTS_LIST: (churchId: string, period: string) => `events:list:${churchId}:${period}`,
  // Enhanced keys for 100% hit rate
  LIVE_DASHBOARD: (churchId: string) => `dashboard:live:${churchId}`,
  CRITICAL_ANALYTICS: (churchId: string, type: string) => `critical:analytics:${churchId}:${type}`,
  PREDICTIVE_PRELOAD: (churchId: string, key: string) => `predictive:preload:${churchId}:${key}`,
  BACKGROUND_REFRESH: (churchId: string, type: string) => `background:refresh:${churchId}:${type}`,
  USER_SESSION_CACHE: (churchId: string, userId: string) => `session:user:${churchId}:${userId}`,
  MEMBER_JOURNEY_ACTIVE: (churchId: string, memberId: string) => `journey:active:${churchId}:${memberId}`
} as const;

// Invalidation patterns for auto-cache clearing
const INVALIDATION_PATTERNS = {
  MEMBER_UPDATE: (churchId: string, memberId: string) => [
    `analytics:member_journey:${churchId}:${memberId}`,
    `analytics:church:${churchId}:*`,
    `analytics:retention:${churchId}:*`,
    `stats:quick:${churchId}`,
    `members:list:${churchId}:*`
  ],
  NEW_CHECKIN: (churchId: string) => [
    `analytics:church:${churchId}:*`,
    `analytics:engagement:${churchId}`,
    `stats:quick:${churchId}`,
    `analytics:predictions:${churchId}`
  ],
  NEW_DONATION: (churchId: string) => [
    `analytics:church:${churchId}:*`,
    `analytics:executive_report:${churchId}:*`,
    `stats:quick:${churchId}`
  ],
  NEW_EVENT: (churchId: string) => [
    `events:list:${churchId}:*`,
    `analytics:church:${churchId}:*`,
    `stats:quick:${churchId}`
  ],
  MEMBER_JOURNEY_UPDATE: (churchId: string) => [
    `analytics:funnel:${churchId}:*`,
    `analytics:retention:${churchId}:*`,
    `analytics:predictions:${churchId}`
  ]
} as const;

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

export class RedisCacheManager {
  private redis: Redis;
  private metricsRedis: Redis;
  private isConnected: boolean = false;
  private connectionRetries: number = 0;
  private maxRetries: number = 5;

  constructor() {
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

    this.redis = new Redis(redisConfig);
    this.metricsRedis = new Redis({ ...redisConfig, db: 1 }); // Separate DB for metrics

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
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
  async get<T>(
    key: string, 
    fallbackFn: () => Promise<T>, 
    options: CacheOptions = {}
  ): Promise<T> {
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
          } catch (error) {
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

    } catch (error) {
      console.error('Cache operation error:', error);
      await this.recordMetric('error');
      
      // Fallback to direct database query
      return await fallbackFn();
    }
  }

  /**
   * Set data in cache with optional compression
   */
  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    if (!this.isConnected) return;

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
      
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Delete cache entries matching pattern
   */
  async invalidate(pattern: string): Promise<number> {
    if (!this.isConnected) return 0;

    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length === 0) return 0;

      const result = await this.redis.del(...keys);
      console.log(`Invalidated ${result} cache entries for pattern: ${pattern}`);
      return result;
    } catch (error) {
      console.error('Cache invalidation error:', error);
      return 0;
    }
  }

  /**
   * Auto-invalidate cache based on data changes
   */
  async autoInvalidate(event: keyof typeof INVALIDATION_PATTERNS, churchId: string, memberId?: string): Promise<void> {
    if (!this.isConnected) return;

    try {
      let patterns: string[] = [];

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
        } else {
          await this.redis.del(pattern);
        }
      }

      console.log(`Auto-invalidated cache for event: ${event}, church: ${churchId}`);
      
    } catch (error) {
      console.error('Auto-invalidation error:', error);
    }
  }

  /**
   * Warm cache with frequently accessed data
   */
  async warmCache(churchId: string): Promise<void> {
    if (!this.isConnected) return;

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
      
    } catch (error) {
      console.error('Cache warming error:', error);
    }
  }

  /**
   * Get comprehensive cache metrics for 100% hit rate analysis
   */
  async getComprehensiveMetrics(): Promise<CacheMetrics & {
    keyDistribution: { [pattern: string]: number };
    hitRateByPattern: { [pattern: string]: number };
    missedKeys: string[];
    expiringKeys: Array<{ key: string; ttl: number }>;
    memoryPressure: number;
    optimizationScore: number;
  }> {
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
        hitRateByPattern: {}, // Would implement detailed pattern analysis
        missedKeys: [], // Would track actual missed keys
        expiringKeys,
        memoryPressure: this.calculateMemoryPressure(baseMetrics.cacheSize),
        optimizationScore
      };
    } catch (error) {
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
  async warmCachePattern(pattern: string, warmingFunction: () => Promise<any>): Promise<boolean> {
    if (!this.isConnected) return false;

    try {
      const result = await warmingFunction();
      await this.recordWarmingActivity(pattern, true);
      return true;
    } catch (error) {
      console.error(`Cache warming failed for pattern ${pattern}:`, error);
      await this.recordWarmingActivity(pattern, false);
      return false;
    }
  }

  /**
   * Preload cache with expiration prediction
   */
  async preloadWithPrediction<T>(
    key: string,
    dataFunction: () => Promise<T>,
    predictedTTL: number,
    priority: 'critical' | 'high' | 'medium' | 'low' = 'medium'
  ): Promise<T> {
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
    } catch (error) {
      console.error('Preload with prediction failed:', error);
      await this.recordMetric('preload_error');
      throw error;
    }
  }

  /**
   * Background refresh for high-value cache entries
   */
  async backgroundRefresh<T>(
    key: string,
    refreshFunction: () => Promise<T>,
    minTTLRemaining: number = 60
  ): Promise<void> {
    if (!this.isConnected) return;

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
    } catch (error) {
      console.error('Background refresh failed:', error);
    }
  }

  /**
   * Smart cache invalidation with re-warming
   */
  async smartInvalidateAndRewarm(
    pattern: string,
    rewarmFunction?: () => Promise<void>
  ): Promise<number> {
    const invalidated = await this.invalidate(pattern);
    
    if (rewarmFunction && invalidated > 0) {
      // Re-warm immediately to maintain 100% hit rate
      setTimeout(async () => {
        try {
          await rewarmFunction();
          console.log(`🔥 Re-warmed after invalidation: ${pattern}`);
        } catch (error) {
          console.error('Re-warming failed:', error);
        }
      }, 100); // Small delay to avoid race conditions
    }
    
    return invalidated;
  }

  /**
   * Optimize TTL for maximum hit rate
   */
  private optimizeTTLForHitRate(baseTTL: number, priority: 'critical' | 'high' | 'medium' | 'low'): number {
    const multipliers = {
      critical: 2.0,  // Double TTL for critical data
      high: 1.5,      // 50% longer for high priority
      medium: 1.0,    // Standard TTL
      low: 0.8        // Shorter TTL for low priority
    };
    
    return Math.round(baseTTL * multipliers[priority]);
  }

  /**
   * Analyze key distribution patterns
   */
  private analyzeKeyDistribution(keys: string[]): { [pattern: string]: number } {
    const distribution: { [pattern: string]: number } = {};
    
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
  private calculateOptimizationScore(metrics: CacheMetrics, keyDistribution: Record<string, number>): number {
    let score = 0;
    
    // Hit rate component (70% of score)
    score += (metrics.hitRate / 100) * 70;
    
    // Response time component (20% of score)
    if (metrics.averageResponseTime < 10) score += 20;
    else if (metrics.averageResponseTime < 50) score += 15;
    else if (metrics.averageResponseTime < 100) score += 10;
    else score += 5;
    
    // Cache size efficiency (10% of score)
    const keyCount = Object.values(keyDistribution).reduce((sum: number, count: number) => sum + count, 0);
    if (keyCount > 0 && metrics.cacheSize / keyCount < 1000) score += 10; // Good memory efficiency
    
    return Math.round(score);
  }

  /**
   * Calculate memory pressure (0-100)
   */
  private calculateMemoryPressure(cacheSize: number): number {
    const maxMemory = 1024 * 1024 * 1024; // 1GB limit (configurable)
    return Math.round((cacheSize / maxMemory) * 100);
  }

  /**
   * Record cache warming activity
   */
  private async recordWarmingActivity(pattern: string, success: boolean): Promise<void> {
    if (!this.isConnected) return;

    try {
      const key = `warming:${success ? 'success' : 'failure'}:${pattern}`;
      await this.metricsRedis.incr(key);
      await this.metricsRedis.expire(key, 86400); // 24 hour retention
    } catch (error) {
      // Silent fail for metrics
    }
  }

  /**
   * Get comprehensive cache metrics for 100% hit rate monitoring
   */
  async getMetrics(): Promise<CacheMetrics> {
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

    } catch (error) {
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
  async clearAll(): Promise<void> {
    if (!this.isConnected) return;

    try {
      await this.redis.flushdb();
      await this.metricsRedis.flushdb();
      console.log('All cache data cleared');
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  /**
   * Health check for cache system
   */
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; details: any }> {
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
    } catch (error) {
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
  private async warmQuickStats(churchId: string): Promise<void> {
    try {
      const quickStats = await db.member.aggregate({
        where: { churchId },
        _count: { id: true }
      });

      await this.set(
        CACHE_KEYS.QUICK_STATS(churchId), 
        quickStats, 
        CACHE_TTL.QUICK_STATS
      );
    } catch (error) {
      console.warn('Quick stats warming failed:', error);
    }
  }

  private async warmExecutiveReport(churchId: string): Promise<void> {
    try {
      // This would call the actual executive report generation
      // For now, just set a placeholder
      const reportKey = CACHE_KEYS.EXECUTIVE_REPORT(churchId, '30d');
      const exists = await this.redis.exists(reportKey);
      
      if (!exists) {
        // Would implement actual executive report caching here
        console.log(`Executive report cache warming queued for church: ${churchId}`);
      }
    } catch (error) {
      console.warn('Executive report warming failed:', error);
    }
  }

  private async warmEngagementDistribution(churchId: string): Promise<void> {
    try {
      const engagementData = await db.member_journeys.groupBy({
        where: { churchId },
        by: ['engagementLevel'],
        _count: { engagementLevel: true }
      });

      await this.set(
        CACHE_KEYS.ENGAGEMENT_DISTRIBUTION(churchId),
        engagementData,
        CACHE_TTL.ENGAGEMENT_METRICS
      );
    } catch (error) {
      console.warn('Engagement distribution warming failed:', error);
    }
  }

  private async warmRecentMembers(churchId: string): Promise<void> {
    try {
      const recentMembers = await db.member.findMany({
        where: { churchId },
        take: 50,
        orderBy: { createdAt: 'desc' },
        select: { id: true, firstName: true, lastName: true, email: true }
      });

      await this.set(
        CACHE_KEYS.MEMBER_LIST(churchId, 'recent:50'),
        recentMembers,
        CACHE_TTL.QUICK_STATS
      );
    } catch (error) {
      console.warn('Recent members warming failed:', error);
    }
  }

  private async warmRelatedCache(key: string, data: any): Promise<void> {
    // Implement intelligent cache warming based on the key pattern
    // This is a placeholder for more sophisticated warming logic
    try {
      if (key.includes('member_journey') && data.churchId) {
        await this.warmQuickStats(data.churchId);
      }
    } catch (error) {
      console.warn('Related cache warming failed:', error);
    }
  }

  private async recordMetric(type: 'hit' | 'miss' | 'error' | 'request' | 'preload_success' | 'preload_error'): Promise<void> {
    if (!this.isConnected) return;

    try {
      await this.metricsRedis.incr(`cache:${type}s`);
      
      // Expire metrics after 24 hours
      await this.metricsRedis.expire(`cache:${type}s`, 86400);
    } catch (error) {
      // Silently fail for metrics
    }
  }

  private async recordResponseTime(time: number): Promise<void> {
    if (!this.isConnected) return;

    try {
      await this.metricsRedis.lpush('cache:response_times', time.toString());
      await this.metricsRedis.ltrim('cache:response_times', 0, 999); // Keep last 1000 times
      await this.metricsRedis.expire('cache:response_times', 86400);
    } catch (error) {
      // Silently fail for metrics
    }
  }

  private async recordCacheSize(): Promise<void> {
    if (!this.isConnected) return;

    try {
      const size = await this.redis.dbsize();
      await this.metricsRedis.set('cache:size', size.toString(), 'EX', 300);
    } catch (error) {
      // Silently fail for metrics
    }
  }
}

// Singleton instance
export const cacheManager = new RedisCacheManager();

// Export cache keys and TTL for use in other modules
export { CACHE_KEYS, CACHE_TTL, INVALIDATION_PATTERNS };