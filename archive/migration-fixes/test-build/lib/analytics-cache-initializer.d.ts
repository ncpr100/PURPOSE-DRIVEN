/**
 * Analytics Cache Optimization Initializer
 *
 * Initializes and starts the cache optimization controller to achieve
 * 100% cache hit rates for critical analytics operations.
 */
declare class AnalyticsCacheInitializer {
    private static isInitialized;
    private static initializationPromise;
    /**
     * Initialize cache optimization for analytics system
     */
    static initialize(): Promise<void>;
    private static _doInitialize;
    /**
     * Get initialization status
     */
    static isReady(): boolean;
    /**
     * Force re-initialization (for development/testing)
     */
    static reinitialize(): Promise<void>;
}
export { AnalyticsCacheInitializer };
//# sourceMappingURL=analytics-cache-initializer.d.ts.map