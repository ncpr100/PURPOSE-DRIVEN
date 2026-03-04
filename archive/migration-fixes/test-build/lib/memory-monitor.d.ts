/**
 * KHESED-TEK CMS Memory Monitoring System
 * Tracks memory usage and provides alerts
 */
export declare class MemoryMonitor {
    private static instance;
    private memoryThreshold;
    private checkInterval;
    private intervalId?;
    private constructor();
    static getInstance(): MemoryMonitor;
    /**
     * Start memory monitoring
     */
    startMonitoring(): void;
    /**
     * Stop memory monitoring
     */
    stopMonitoring(): void;
    /**
     * Check current memory usage
     */
    private checkMemoryUsage;
    /**
     * Format bytes to human readable format
     */
    private formatBytes;
    /**
     * Trigger garbage collection and cleanup
     */
    private triggerCleanup;
    /**
     * Clear application caches
     */
    private clearCaches;
    /**
     * Get current memory statistics
     */
    getMemoryStats(): object;
}
export declare const memoryMonitor: MemoryMonitor;
//# sourceMappingURL=memory-monitor.d.ts.map