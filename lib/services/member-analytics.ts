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
  }
};
