"use strict";
// Performance monitoring and optimization utilities
Object.defineProperty(exports, "__esModule", { value: true });
exports.addResourceHints = exports.logMemoryUsage = exports.logBundleInfo = exports.getOptimizedImageUrl = exports.usePerformanceMonitor = exports.performanceMonitor = exports.PerformanceMonitor = exports.useIntersectionObserver = exports.throttle = exports.debounce = void 0;
// Debounce function for API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
exports.debounce = debounce;
// Throttle function for scroll events, etc.
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
exports.throttle = throttle;
// Lazy loading hook
const react_1 = require("react");
function useIntersectionObserver(options = {}) {
    const [isIntersecting, setIsIntersecting] = (0, react_1.useState)(false);
    const ref = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const element = ref.current;
        if (!element)
            return;
        const observer = new IntersectionObserver(([entry]) => setIsIntersecting(entry.isIntersecting), options);
        observer.observe(element);
        return () => observer.disconnect();
    }, [options]);
    return [ref, isIntersecting];
}
exports.useIntersectionObserver = useIntersectionObserver;
// Performance measurement
class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
    }
    startTimer(label) {
        const start = performance.now();
        return () => {
            const duration = performance.now() - start;
            if (!this.metrics.has(label)) {
                this.metrics.set(label, []);
            }
            this.metrics.get(label).push(duration);
            // Keep only last 100 measurements
            const measurements = this.metrics.get(label);
            if (measurements.length > 100) {
                measurements.shift();
            }
            if (process.env.NODE_ENV === 'development') {
                console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
            }
        };
    }
    getStats(label) {
        const measurements = this.metrics.get(label) || [];
        if (measurements.length === 0) {
            return null;
        }
        const sorted = measurements.slice().sort((a, b) => a - b);
        const avg = measurements.reduce((a, b) => a + b) / measurements.length;
        const median = sorted[Math.floor(sorted.length / 2)];
        const p95 = sorted[Math.floor(sorted.length * 0.95)];
        return {
            count: measurements.length,
            avg: parseFloat(avg.toFixed(2)),
            median: parseFloat(median.toFixed(2)),
            p95: parseFloat(p95.toFixed(2)),
            min: parseFloat(sorted[0].toFixed(2)),
            max: parseFloat(sorted[sorted.length - 1].toFixed(2))
        };
    }
    getAllStats() {
        const stats = {};
        for (const [label] of this.metrics) {
            stats[label] = this.getStats(label);
        }
        return stats;
    }
    clear(label) {
        if (label) {
            this.metrics.delete(label);
        }
        else {
            this.metrics.clear();
        }
    }
}
exports.PerformanceMonitor = PerformanceMonitor;
// Global performance monitor instance
exports.performanceMonitor = new PerformanceMonitor();
// React hook for performance monitoring
function usePerformanceMonitor(label) {
    (0, react_1.useEffect)(() => {
        const endTimer = exports.performanceMonitor.startTimer(label);
        return endTimer;
    }, [label]);
}
exports.usePerformanceMonitor = usePerformanceMonitor;
// Image optimization utilities
function getOptimizedImageUrl(url, width, height, quality = 80) {
    if (!url)
        return '';
    // If it's already optimized or external, return as-is
    if (url.startsWith('http') || url.includes('/_next/image')) {
        return url;
    }
    // Build Next.js image optimization URL
    const params = new URLSearchParams();
    params.set('url', url);
    params.set('q', quality.toString());
    if (width)
        params.set('w', width.toString());
    if (height)
        params.set('h', height.toString());
    return `/_next/image?${params.toString()}`;
}
exports.getOptimizedImageUrl = getOptimizedImageUrl;
// Bundle size analyzer (development only)
function logBundleInfo() {
    if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') {
        return;
    }
    // Log performance timing
    window.addEventListener('load', () => {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
        const firstPaint = performance.getEntriesByType('paint')[0]?.startTime || 0;
        console.group('🚀 Performance Metrics');
        console.log(`Page Load Time: ${loadTime}ms`);
        console.log(`DOM Ready: ${domReady}ms`);
        console.log(`First Paint: ${firstPaint.toFixed(2)}ms`);
        // Check for large resources
        const resources = performance.getEntriesByType('resource');
        const largeResources = resources
            .filter(resource => resource.transferSize > 100000) // > 100KB
            .sort((a, b) => b.transferSize - a.transferSize)
            .slice(0, 5);
        if (largeResources.length > 0) {
            console.warn('Large Resources (>100KB):');
            largeResources.forEach(resource => {
                console.log(`${resource.name}: ${(resource.transferSize / 1024).toFixed(1)}KB`);
            });
        }
        console.groupEnd();
    });
}
exports.logBundleInfo = logBundleInfo;
// Memory usage monitoring
function logMemoryUsage() {
    if (typeof window === 'undefined' || !('memory' in performance)) {
        return;
    }
    const memory = performance.memory;
    console.group('💾 Memory Usage');
    console.log(`Used: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total: ${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Limit: ${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`);
    console.groupEnd();
}
exports.logMemoryUsage = logMemoryUsage;
// Resource hints for critical resources
function addResourceHints() {
    if (typeof document === 'undefined')
        return;
    const hints = [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        { rel: 'dns-prefetch', href: '//api.instagram.com' },
        { rel: 'dns-prefetch', href: '//graph.facebook.com' },
        { rel: 'dns-prefetch', href: '//api.twitter.com' },
    ];
    hints.forEach(hint => {
        const link = document.createElement('link');
        Object.assign(link, hint);
        document.head.appendChild(link);
    });
}
exports.addResourceHints = addResourceHints;
// Initialize performance monitoring in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    logBundleInfo();
    // Log memory usage every 30 seconds
    setInterval(logMemoryUsage, 30000);
    // Add resource hints
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addResourceHints);
    }
    else {
        addResourceHints();
    }
}
//# sourceMappingURL=performance.js.map