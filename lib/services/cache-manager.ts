import Redis from 'ioredis';

const redis = process.env.UPSTASH_REDIS_REST_URL ? new Redis(process.env.UPSTASH_REDIS_REST_URL) : null;

export interface CacheOptions {
  ttl?: number;
  forceRefresh?: boolean;
  warmCache?: boolean;
}

export interface CacheMetrics {
  hitRate: number;
  missRate: number;
  avgLatency: number;
}

export const CACHE_KEYS = {
  EXECUTIVE_REPORT: (churchId: string, period: string) => `exec-report:${churchId}:${period}`,
  MEMBER_JOURNEY: (churchId: string, memberId: string) => `member-journey:${churchId}:${memberId}`,
  CHURCH_ANALYTICS: (churchId: string, period: string) => `church-analytics:${churchId}:${period}`,
  RETENTION_ANALYTICS: (churchId: string, period: number) => `retention:${churchId}:${period}`,
  CONVERSION_FUNNEL: (churchId: string, period: number) => `conversion:${churchId}:${period}`,
  ENGAGEMENT_DISTRIBUTION: (churchId: string) => `engagement:${churchId}`,
  QUICK_STATS: (churchId: string) => `quick-stats:${churchId}`,
  PREDICTIVE_INSIGHTS: (churchId: string) => `predictive:${churchId}` 
};

export const CACHE_TTL = {
  EXECUTIVE_REPORT: 3600,
  MEMBER_ANALYTICS: 1800,
  RETENTION_ANALYTICS: 3600,
  CONVERSION_FUNNEL: 3600,
  ENGAGEMENT_METRICS: 1800,
  QUICK_STATS: 300,
  PREDICTIVE_INSIGHTS: 1800
};

export const cacheManager = {
  async get(key: string) {
    if (!redis) return null;
    return redis.get(key);
  },
  async set(key: string, value: string, ttl?: number) {
    if (!redis) return;
    if (ttl) await redis.setex(key, ttl, value);
    else await redis.set(key, value);
  },
  async del(key: string) {
    if (!redis) return;
    await redis.del(key);
  },
  async warmCache(churchId: string) {
    console.log('🔥 Warming cache for church:', churchId);
  },
  async autoInvalidate(type: string, churchId: string, memberId?: string) {
    console.log('🔄 Auto-invalidating cache:', type, churchId, memberId || '');
  }
};
