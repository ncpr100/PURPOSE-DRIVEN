/// <reference types="react" />
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
export declare function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void;
export declare function useIntersectionObserver(options?: IntersectionObserverInit): readonly [import("react").RefObject<HTMLElement>, boolean];
export declare class PerformanceMonitor {
    private metrics;
    startTimer(label: string): () => void;
    getStats(label: string): {
        count: number;
        avg: number;
        median: number;
        p95: number;
        min: number;
        max: number;
    } | null;
    getAllStats(): Record<string, any>;
    clear(label?: string): void;
}
export declare const performanceMonitor: PerformanceMonitor;
export declare function usePerformanceMonitor(label: string): void;
export declare function getOptimizedImageUrl(url: string, width?: number, height?: number, quality?: number): string;
export declare function logBundleInfo(): void;
export declare function logMemoryUsage(): void;
export declare function addResourceHints(): void;
//# sourceMappingURL=performance.d.ts.map