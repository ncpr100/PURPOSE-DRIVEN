/**
 * Analytics Cache Optimization Initializer
 * 
 * Initializes and starts the cache optimization controller to achieve
 * 100% cache hit rates for critical analytics operations.
 */

import { cacheOptimizationController } from '@/lib/cache-optimization-controller';

class AnalyticsCacheInitializer {
  private static isInitialized = false;
  private static initializationPromise: Promise<void> | null = null;

  /**
   * Initialize cache optimization for analytics system
   */
  static async initialize(): Promise<void> {
    // Prevent multiple initializations
    if (this.isInitialized) {
      return;
    }

    // Return existing initialization promise if already in progress
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._doInitialize();
    return this.initializationPromise;
  }

  private static async _doInitialize(): Promise<void> {
    try {
      console.log('🚀 Initializing analytics cache optimization for 100% hit rates...');

      // Initialize the cache optimization controller
      await cacheOptimizationController.initialize();

      // Add analytics-specific optimization targets
      cacheOptimizationController.addOptimizationTarget({
        pattern: 'analytics:executive:*',
        priority: 'critical',
        expectedHitRate: 100,
        warningThreshold: 98,
        autoOptimize: true
      });

      cacheOptimizationController.addOptimizationTarget({
        pattern: 'analytics:dashboard:real_time:*',
        priority: 'critical',
        expectedHitRate: 99,
        warningThreshold: 95,
        autoOptimize: true
      });

      cacheOptimizationController.addOptimizationTarget({
        pattern: 'analytics:member_journey:*',
        priority: 'high',
        expectedHitRate: 98,
        warningThreshold: 93,
        autoOptimize: true
      });

      cacheOptimizationController.addOptimizationTarget({
        pattern: 'analytics:predictive:*',
        priority: 'high',
        expectedHitRate: 97,
        warningThreshold: 90,
        autoOptimize: true
      });

      // Force initial optimization of critical patterns
      await cacheOptimizationController.forceOptimization('analytics:executive:*');
      await cacheOptimizationController.forceOptimization('analytics:dashboard:real_time:*');

      this.isInitialized = true;
      
      console.log('✅ Analytics cache optimization initialized successfully');
      console.log('🎯 Target: 100% cache hit rate for critical analytics operations');
      console.log('⚡ Real-time monitoring and auto-optimization enabled');

    } catch (error) {
      console.error('❌ Analytics cache optimization initialization failed:', error);
      this.initializationPromise = null; // Allow retry
      throw error;
    }
  }

  /**
   * Get initialization status
   */
  static isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Force re-initialization (for development/testing)
   */
  static async reinitialize(): Promise<void> {
    this.isInitialized = false;
    this.initializationPromise = null;
    return this.initialize();
  }
}

// Auto-initialize when this module is imported
if (typeof window === 'undefined') {
  // Only initialize on server side
  AnalyticsCacheInitializer.initialize().catch(error => {
    console.error('Failed to auto-initialize analytics cache optimization:', error);
  });
}

export { AnalyticsCacheInitializer };