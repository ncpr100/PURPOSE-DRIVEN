/**
 * Cache Optimization Controller - 100% Hit Rate Achievement System
 *
 * This controller orchestrates between the Redis cache manager and intelligent
 * cache warmer to achieve and maintain 100% cache hit rates for critical operations.
 */
import type { CacheMetrics } from './redis-cache-manager';
export interface OptimizationTarget {
    pattern: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    expectedHitRate: number;
    warningThreshold: number;
    autoOptimize: boolean;
}
export interface OptimizationReport {
    timestamp: Date;
    currentMetrics: CacheMetrics;
    targets: OptimizationTarget[];
    achievements: {
        target: OptimizationTarget;
        actualHitRate: number;
        status: 'achieved' | 'warning' | 'critical';
        recommendations: string[];
    }[];
    overallStatus: 'optimal' | 'good' | 'needs_attention' | 'critical';
    nextOptimizationCycle: Date;
}
export declare class CacheOptimizationController {
    private cacheWarmer;
    private optimizationTargets;
    private lastOptimizationReport;
    private isOptimizing;
    private readonly CRITICAL_TARGETS;
    constructor();
    /**
     * Initialize the optimization controller and start monitoring
     */
    initialize(): Promise<void>;
    /**
     * Start continuous optimization monitoring
     */
    private startOptimizationMonitoring;
    /**
     * Run a complete optimization cycle to achieve 100% hit rates
     */
    runOptimizationCycle(): Promise<OptimizationReport>;
    /**
     * Run intensive optimization for critical targets
     */
    runIntensiveOptimization(): Promise<void>;
    /**
     * Analyze target performance and generate recommendations
     */
    private analyzeTarget;
    /**
     * Estimate hit rate for a specific pattern based on overall metrics
     */
    private estimatePatternHitRate;
    /**
     * Calculate overall optimization status
     */
    private calculateOverallStatus;
    /**
     * Execute optimizations for underperforming targets
     */
    private executeOptimizations;
    /**
     * Get the latest optimization report
     */
    getLatestReport(): OptimizationReport | null;
    /**
     * Add a custom optimization target
     */
    addOptimizationTarget(target: OptimizationTarget): void;
    /**
     * Remove an optimization target
     */
    removeOptimizationTarget(pattern: string): void;
    /**
     * Force immediate optimization for a specific pattern
     */
    forceOptimization(pattern: string): Promise<void>;
    /**
     * Get real-time optimization status
     */
    getOptimizationStatus(): Promise<{
        isOptimizing: boolean;
        lastReport: OptimizationReport | null;
        nextCycle: Date | null;
        targetCount: number;
        criticalTargets: number;
    }>;
    /**
     * Shutdown optimization monitoring
     */
    shutdown(): void;
}
export declare const cacheOptimizationController: CacheOptimizationController;
//# sourceMappingURL=cache-optimization-controller.d.ts.map