import { Redis } from "@upstash/redis";

// ✅ STRICT INTERFACES (No optional fields that cause TS errors)
export interface CacheMetrics {
  hitRate: number;
  missRate: number;
  avgLatency: number;
  totalRequests: number;
  errors: number;
  averageResponseTime: number; // ✅ Strict number (never undefined)
  cacheSize: number; // ✅ Strict number (never undefined)
}

export type HealthStatus = "healthy" | "unhealthy"; // ✅ Narrowed type for consumers

export interface HealthCheckResult {
  status: HealthStatus | "ok" | "error";
  latency?: number;
  timestamp: string;
  details?: string;
}

export interface RetentionAlertData {
  memberId: string;
  riskScore: number;
  factors: string[];
  recommendedAction: string;
}

export const CACHE_KEYS = {
  RETENTION_RISK: (churchId: string) => `retention_risk:${churchId}`,
  MEMBER_JOURNEY: (churchId: string, memberId: string) =>
    `member_journey:${churchId}:${memberId}`,
  EXECUTIVE_REPORT: (churchId: string, period: string) =>
    `executive_report:${churchId}:${period}`,
  QUICK_STATS: (churchId: string) => `quick_stats:${churchId}`,
  MINISTRY_RECOMMENDATIONS: (churchId: string) =>
    `ministry_recommendations:${churchId}`,
  ATTENDANCE_FORECAST: (churchId: string) => `attendance_forecast:${churchId}`,
  GIVING_PATTERNS: (churchId: string) => `giving_patterns:${churchId}`,
  ENGAGEMENT_SCORE: (churchId: string, memberId: string) =>
    `engagement_score:${churchId}:${memberId}`,
  SRE_HEALTH_CHECK: () => `sre_health_check`,
  PERFORMANCE_METRICS: (route: string) => `performance_metrics:${route}`,
  AGENT_SETTINGS: (churchId: string) => `agent_settings:${churchId}`,
  PRICING_CONFIG: () => `pricing_config`,
  MEMBER_ANALYTICS: (churchId: string) => `member_analytics:${churchId}`,
};

export const CACHE_TTL = {
  SHORT: 300,
  MEDIUM: 1800,
  LONG: 3600,
  VERY_LONG: 86400,
  RETENTION_RISK: 3600,
  MEMBER_ANALYTICS: 1800,
  EXECUTIVE_REPORT: 3600,
  QUICK_STATS: 300,
  MEMBER_JOURNEY: 1800,
  MINISTRY_RECOMMENDATIONS: 7200,
  ATTENDANCE_FORECAST: 86400,
  GIVING_PATTERNS: 3600,
  ENGAGEMENT_SCORE: 1800,
  SRE_HEALTH_CHECK: 120,
  PERFORMANCE_METRICS: 300,
  AGENT_SETTINGS: 60,
  PRICING_CONFIG: 3600,
};

let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  if (!redisClient) redisClient = new Redis({ url, token });
  return redisClient;
}

export class CacheManager {
  private hits = 0;
  private misses = 0;
  private latencies: number[] = [];
  private errors = 0;

  async get(key: string): Promise<string | null> {
    const redis = getRedisClient();
    if (!redis) return null;
    const start = Date.now();
    try {
      const value = await redis.get(key);
      this.latencies.push(Date.now() - start);
      if (value) this.hits++;
      else this.misses++;
      return (value as string | null) ?? null;
    } catch {
      this.misses++;
      this.errors++;
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    const redis = getRedisClient();
    if (!redis) return;
    try {
      await (ttl ? redis.set(key, value, { ex: ttl }) : redis.set(key, value));
    } catch {
      this.errors++;
    }
  }

  async del(key: string): Promise<void> {
    const redis = getRedisClient();
    if (!redis) return;
    try {
      await redis.del(key);
    } catch {
      this.errors++;
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

  // ✅ Returns HealthStatus ("healthy" | "unhealthy") for strict consumers
  async healthCheck(): Promise<HealthCheckResult> {
    const redis = getRedisClient();
    if (!redis)
      return {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        details: "Redis not connected",
      };
    try {
      const start = Date.now();
      await redis.ping();
      return {
        status: "healthy",
        latency: Date.now() - start,
        timestamp: new Date().toISOString(),
      };
    } catch (e: any) {
      return {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        details: e.message,
      };
    }
  }

  // ✅ Returns strict numbers (never undefined)
  getMetrics(): CacheMetrics {
    const total = this.hits + this.misses;
    const avg =
      this.latencies.length > 0
        ? this.latencies.reduce((a, b) => a + b, 0) / this.latencies.length
        : 0;

    return {
      hitRate: total > 0 ? this.hits / total : 0,
      missRate: total > 0 ? this.misses / total : 0,
      avgLatency: avg,
      totalRequests: total,
      errors: this.errors,
      averageResponseTime: avg,
      cacheSize: 0, // Redis doesn't expose exact byte size via REST; safe default
    };
  }

  async clearAll(): Promise<void> {
    const redis = getRedisClient();
    if (!redis) return;
    try {
      const keys = await redis.keys("*");
      if (keys.length > 0) await redis.del(...keys);
    } catch {
      this.errors++;
    }
  }

  async getRetentionAlerts(churchId: string): Promise<string | null> {
    return this.get(CACHE_KEYS.RETENTION_RISK(churchId));
  }

  async cacheRetentionAlerts(churchId: string, data: any): Promise<void> {
    await this.setJson(
      CACHE_KEYS.RETENTION_RISK(churchId),
      data,
      CACHE_TTL.RETENTION_RISK,
    );
  }
}

export const cacheManager = new CacheManager();
