// Member Analytics Cache Service
import { cacheManager, CACHE_KEYS, CACHE_TTL } from './cache-manager';
export const memberAnalyticsCache = {
  async get(churchId: string, memberId: string) {
    const key = CACHE_KEYS.MEMBER_JOURNEY(churchId, memberId);
    return await cacheManager.get(key);
  },
  async set(churchId: string, memberId: string, data: any) {
    const key = CACHE_KEYS.MEMBER_JOURNEY(churchId, memberId);
    await cacheManager.set(key, JSON.stringify(data), CACHE_TTL.MEMBER_ANALYTICS);
  },
  async invalidate(churchId: string, memberId: string) {
    const key = CACHE_KEYS.MEMBER_JOURNEY(churchId, memberId);
    await cacheManager.del(key);
  },
  // Stub methods retained for backward compatibility with analytics routes.
  // These return null (cache miss) so callers fall back to live DB queries.
  async getEngagementDashboard(_churchId: string): Promise<null> { return null; },
  async cacheEngagementDashboard(_churchId: string, _data: any): Promise<void> { /* no-op */ },
  async getLifecycleFunnel(_churchId: string, _dateRange?: any): Promise<null> { return null; },
  async cacheLifecycleFunnel(_churchId: string, _data: any, _dateRange?: any): Promise<void> { /* no-op */ },
  async getMinistryRecommendations(_churchId: string): Promise<null> { return null; },
  async cacheMinistryRecommendations(_churchId: string, _data: any): Promise<void> { /* no-op */ },
};
