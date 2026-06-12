import { Redis } from "@upstash/redis";

// ============================================
// TYPES & INTERFACES
// ============================================
export interface CacheMetrics {
  hitRate: number;
  missRate: number;
  avgLatency: number;
}

// ============================================
// CACHE KEYS
// ============================================
export const CACHE_KEYS = {
  EXECUTIVE_REPORT: (churchId: string, period: string) =>
    `executive_report:${churchId}:${period}`,
  QUICK_STATS: (churchId: string) => `quick_stats:${churchId}`,
  MEMBER_COUNT: (churchId: string) => `member_count:${churchId}`,
  ANALYTICS_OVERVIEW: (churchId: string) => `analytics_overview:${churchId}`,
  MEMBER_JOURNEY: (churchId: string, memberId: string) =>
    `member_journey:${churchId}:${memberId}`,
  MINISTRY_RECOMMENDATIONS: (churchId: string) =>
    `ministry_recommendations:${churchId}`,
  RETENTION_RISK: (churchId: string) => `retention_risk:${churchId}`,
  ATTENDANCE_FORECAST: (churchId: string) => `attendance_forecast:${churchId}`,
  GIVING_PATTERNS: (churchId: string) => `giving_patterns:${churchId}`,
  ENGAGEMENT_SCORE: (churchId: string, memberId: string) =>
    `engagement_score:${churchId}:${memberId}`,
  SRE_HEALTH_CHECK: () => `sre_health_check`,
  PERFORMANCE_METRICS: (route: string) => `performance_metrics:${route}`,
  AGENT_SETTINGS: (churchId: string) => `agent_settings:${churchId}`,
  PRICING_CONFIG: () => `pricing_config`,
};

// ============================================
// CACHE TTL (Time To Live in seconds)
// ============================================
export const CACHE_TTL = {
  SHORT: 300,
  MEDIUM: 1800,
  LONG: 3600,
  VERY_LONG: 86400,
  EXECUTIVE_REPORT: 3600,
  QUICK_STATS: 300,
  MEMBER_JOURNEY: 1800,
  MINISTRY_RECOMMENDATIONS: 7200,
  RETENTION_RISK: 3600,
  ATTENDANCE_FORECAST: 86400,
  GIVING_PATTERNS: 3600,
  ENGAGEMENT_SCORE: 1800,
  SRE_HEALTH_CHECK: 120,
  PERFORMANCE_METRICS: 300,
  AGENT_SETTINGS: 60,
  PRICING_CONFIG: 3600,
};

// ============================================
// REDIS CLIENT (Lazy Initialization)
// ============================================
let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn(
      "⚠️ [Cache Manager] Upstash Redis not configured. Cache disabled.",
    );
    return null;
  }

  if (!redisClient) {
    console.log("🔧 [Cache Manager] Initializing Upstash Redis client...");
    redisClient = new Redis({
      url,
      token,
    });
  }

  return redisClient;
}

// ============================================
// CACHE MANAGER
// ============================================
class CacheManager {
  private hits = 0;
  private misses = 0;
  private latencies: number[] = [];

  async get(key: string): Promise<string | null> {
    const redis = getRedisClient();
    if (!redis) return null;

    const start = Date.now();
    try {
      const value = await redis.get(key);
      const latency = Date.now() - start;
      this.latencies.push(latency);

      if (value) {
        this.hits++;
      } else {
        this.misses++;
      }

      return (value as string | null) ?? null;
    } catch (error) {
      console.error(
        `❌ [Cache Manager] GET error for key "${key}":`,
        (error as Error).message,
      );
      this.misses++;
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    const redis = getRedisClient();
    if (!redis) return;

    try {
      if (ttl) {
        await redis.set(key, value, { ex: ttl });
      } else {
        await redis.set(key, value);
      }
    } catch (error) {
      console.error(
        `❌ [Cache Manager] SET error for key "${key}":`,
        (error as Error).message,
      );
    }
  }

  async del(key: string): Promise<void> {
    const redis = getRedisClient();
    if (!redis) return;

    try {
      await redis.del(key);
    } catch (error) {
      console.error(
        `❌ [Cache Manager] DEL error for key "${key}":`,
        (error as Error).message,
      );
    }
  }

  async getJson<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  async setJson<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttl);
  }

  getMetrics(): CacheMetrics {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? this.hits / total : 0;
    const missRate = total > 0 ? this.misses / total : 0;
    const avgLatency =
      this.latencies.length > 0
        ? this.latencies.reduce((a, b) => a + b, 0) / this.latencies.length
        : 0;

    return { hitRate, missRate, avgLatency };
  }
}

export const cacheManager = new CacheManager();
