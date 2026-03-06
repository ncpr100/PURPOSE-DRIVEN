declare class Cache {
    private store;
    private defaultTTL;
    constructor(defaultTTL?: number);
    set(key: string, data: any, ttl?: number): void;
    get(key: string): any | null;
    delete(key: string): boolean;
    clear(): void;
    cleanup(): void;
    getStats(): {
        size: number;
        keys: string[];
    };
}
export declare const cache: Cache;
export declare const cacheKeys: {
    socialMediaAccounts: (churchId: string) => string;
    socialMediaPosts: (churchId: string, filters?: string) => string;
    marketingCampaigns: (churchId: string) => string;
    socialMediaMetrics: (churchId: string, params: string) => string;
};
export declare function getCachedOrFetch<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T>;
export declare const invalidateCache: {
    socialMediaAccounts: (churchId: string) => void;
    socialMediaPosts: (churchId: string) => void;
    marketingCampaigns: (churchId: string) => void;
    socialMediaMetrics: (churchId: string) => void;
};
export {};
//# sourceMappingURL=cache.d.ts.map