"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateCache = exports.getCachedOrFetch = exports.cacheKeys = exports.cache = void 0;
// Simple in-memory cache for API responses
class Cache {
    constructor(defaultTTL = 300000) {
        this.store = new Map();
        this.defaultTTL = defaultTTL;
    }
    set(key, data, ttl) {
        const expiry = Date.now() + (ttl || this.defaultTTL);
        this.store.set(key, { data, expiry });
    }
    get(key) {
        const item = this.store.get(key);
        if (!item) {
            return null;
        }
        if (Date.now() > item.expiry) {
            this.store.delete(key);
            return null;
        }
        return item.data;
    }
    delete(key) {
        return this.store.delete(key);
    }
    clear() {
        this.store.clear();
    }
    // Clean up expired entries
    cleanup() {
        const now = Date.now();
        for (const [key, item] of this.store.entries()) {
            if (now > item.expiry) {
                this.store.delete(key);
            }
        }
    }
    // Get cache stats
    getStats() {
        return {
            size: this.store.size,
            keys: Array.from(this.store.keys())
        };
    }
}
// Create singleton cache instance
exports.cache = new Cache();
// Cleanup expired entries every 10 minutes
if (typeof window === 'undefined') { // Server-side only
    setInterval(() => {
        exports.cache.cleanup();
    }, 600000);
}
// Cache key generators
exports.cacheKeys = {
    socialMediaAccounts: (churchId) => `sma:${churchId}`,
    socialMediaPosts: (churchId, filters) => `smp:${churchId}:${filters || 'all'}`,
    marketingCampaigns: (churchId) => `mc:${churchId}`,
    socialMediaMetrics: (churchId, params) => `smm:${churchId}:${params}`,
};
// Utility function for cached API calls
async function getCachedOrFetch(key, fetcher, ttl) {
    // Try to get from cache first
    const cached = exports.cache.get(key);
    if (cached !== null) {
        return cached;
    }
    // If not in cache, fetch and cache
    const data = await fetcher();
    exports.cache.set(key, data, ttl);
    return data;
}
exports.getCachedOrFetch = getCachedOrFetch;
// Cache invalidation helpers
exports.invalidateCache = {
    socialMediaAccounts: (churchId) => {
        exports.cache.delete(exports.cacheKeys.socialMediaAccounts(churchId));
    },
    socialMediaPosts: (churchId) => {
        // Invalidate all post-related cache entries for this church
        const stats = exports.cache.getStats();
        const keysToDelete = stats.keys.filter(key => key.startsWith(`smp:${churchId}:`));
        keysToDelete.forEach(key => exports.cache.delete(key));
    },
    marketingCampaigns: (churchId) => {
        exports.cache.delete(exports.cacheKeys.marketingCampaigns(churchId));
    },
    socialMediaMetrics: (churchId) => {
        // Invalidate all metrics cache entries for this church
        const stats = exports.cache.getStats();
        const keysToDelete = stats.keys.filter(key => key.startsWith(`smm:${churchId}:`));
        keysToDelete.forEach(key => exports.cache.delete(key));
    },
};
//# sourceMappingURL=cache.js.map