/**
 * KHESED-TEK CMS Memory Monitoring System
 * Tracks memory usage and provides alerts
 */

export class MemoryMonitor {
  private static instance: MemoryMonitor;
  private memoryThreshold = 0.8; // 80% memory usage threshold
  private checkInterval = 30000; // 30 seconds
  private intervalId?: NodeJS.Timeout;

  private constructor() {}

  static getInstance(): MemoryMonitor {
    if (!MemoryMonitor.instance) {
      MemoryMonitor.instance = new MemoryMonitor();
    }
    return MemoryMonitor.instance;
  }

  /**
   * Start memory monitoring
   */
  startMonitoring(): void {
    console.log('🔍 Starting memory monitoring...');
    
    this.intervalId = setInterval(() => {
      this.checkMemoryUsage();
    }, this.checkInterval);

    // Initial check
    this.checkMemoryUsage();
  }

  /**
   * Stop memory monitoring
   */
  stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
      console.log('⏹️ Memory monitoring stopped');
    }
  }

  /**
   * Check current memory usage
   */
  private checkMemoryUsage(): void {
    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal;
    const usedMemory = memoryUsage.heapUsed;
    const memoryPercent = (usedMemory / totalMemory) * 100;

    const stats = {
      heapUsed: this.formatBytes(memoryUsage.heapUsed),
      heapTotal: this.formatBytes(memoryUsage.heapTotal),
      external: this.formatBytes(memoryUsage.external),
      rss: this.formatBytes(memoryUsage.rss),
      percentage: memoryPercent.toFixed(2)
    };

    // Log memory stats
    console.log(`📊 Memory: ${stats.heapUsed}/${stats.heapTotal} (${stats.percentage}%)`);

    // Alert if memory usage is high
    if (memoryPercent > this.memoryThreshold * 100) {
      console.warn(`⚠️ HIGH MEMORY USAGE: ${stats.percentage}%`);
      this.triggerCleanup();
    }
  }

  /**
   * Format bytes to human readable format
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Trigger garbage collection and cleanup
   */
  private triggerCleanup(): void {
    console.log('🧹 Triggering memory cleanup...');
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
      console.log('✅ Garbage collection completed');
    }

    // Clear any caches
    this.clearCaches();
  }

  /**
   * Clear application caches
   */
  private clearCaches(): void {
    // Clear require cache for non-critical modules
    const cacheKeys = Object.keys(require.cache);
    const testModules = cacheKeys.filter(key => 
      key.includes('/test') || 
      key.includes('test-') ||
      key.includes('.test.')
    );

    testModules.forEach(key => {
      delete require.cache[key];
    });

    if (testModules.length > 0) {
      console.log(`🗑️ Cleared ${testModules.length} test modules from cache`);
    }
  }

  /**
   * Get current memory statistics
   */
  getMemoryStats(): object {
    const memoryUsage = process.memoryUsage();
    return {
      heapUsed: this.formatBytes(memoryUsage.heapUsed),
      heapTotal: this.formatBytes(memoryUsage.heapTotal),
      external: this.formatBytes(memoryUsage.external),
      rss: this.formatBytes(memoryUsage.rss),
      percentage: ((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100).toFixed(2)
    };
  }
}

// Export singleton instance
export const memoryMonitor = MemoryMonitor.getInstance();

// Auto-start monitoring in development
if (process.env.NODE_ENV === 'development') {
  memoryMonitor.startMonitoring();
}