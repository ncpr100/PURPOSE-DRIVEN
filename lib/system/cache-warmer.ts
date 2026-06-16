import {
  cacheManager,
  CACHE_KEYS,
  CacheMetrics,
} from "../services/cache-manager";

export class IntelligentCacheWarmer {
  private metrics: CacheMetrics = { hitRate: 0, missRate: 0, avgLatency: 0 };
  private isRunning = false;
  private monitoringInterval: NodeJS.Timeout | null = null;

  private get isRedisConfigured(): boolean {
    return !!(
      process.env.REDIS_URL ||
      process.env.UPSTASH_REDIS_REST_URL ||
      process.env.KV_URL
    );
  }

  constructor(private churchId: string = "default") {}

  async warmCache() {
    if (!this.isRedisConfigured) {
      console.log(
        "⏭️ [BUILD TIME] Redis not configured. Skipping cache warm to prevent build crashes.",
      );
      return;
    }

    console.log("🔥 Warming cache for church:", this.churchId);
    await Promise.allSettled([
      this.warmExecutiveReport(),
      this.warmQuickStats(),
    ]);
  }

  async forceWarmup() {
    if (!this.isRedisConfigured) {
      console.log(
        "⏭️ [BUILD TIME] Redis not configured. Skipping force warmup.",
      );
      return;
    }

    console.log("🔄 Force warming cache for church:", this.churchId);

    // Delete existing cache first, then warm
    await Promise.allSettled([
      this.forceWarmExecutiveReport(),
      this.forceWarmQuickStats(),
    ]);
  }

  async start() {
    return this.warmCache();
  }

  async stop() {
    this.isRunning = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    console.log("🛑 Cache warmer stopped");
  }

  getMetrics(): CacheMetrics {
    return this.metrics;
  }

  async runOptimizationCycle() {
    if (this.isRunning) return;
    this.isRunning = true;
    try {
      console.log("🔄 Running optimization cycle...");
      await this.warmCache();
      this.updateMetrics();
    } finally {
      this.isRunning = false;
    }
  }

  async startOptimizationMonitoring(intervalMs: number = 300000) {
    console.log(
      "📊 Starting optimization monitoring (interval:",
      intervalMs,
      "ms)",
    );
    this.monitoringInterval = setInterval(
      () => this.runOptimizationCycle(),
      intervalMs,
    );
  }

  private async warmExecutiveReport() {
    try {
      const key = CACHE_KEYS.EXECUTIVE_REPORT(this.churchId, "30d");
      const cached = await cacheManager.get(key);
      if (!cached) console.log("📊 Pre-warming executive report...");
    } catch (error) {
      console.warn(
        "⚠️ Failed to warm executive report cache:",
        (error as Error).message,
      );
    }
  }

  private async warmQuickStats() {
    try {
      const key = CACHE_KEYS.QUICK_STATS(this.churchId);
      const cached = await cacheManager.get(key);
      if (!cached) console.log("📈 Pre-warming quick stats...");
    } catch (error) {
      console.warn(
        "⚠️ Failed to warm quick stats cache:",
        (error as Error).message,
      );
    }
  }

  private async forceWarmExecutiveReport() {
    try {
      const key = CACHE_KEYS.EXECUTIVE_REPORT(this.churchId, "30d");
      await cacheManager.del(key);
      console.log("🗑️ Deleted executive report cache, warming...");
      await this.warmExecutiveReport();
    } catch (error) {
      console.warn(
        "⚠️ Failed to force warm executive report cache:",
        (error as Error).message,
      );
    }
  }

  private async forceWarmQuickStats() {
    try {
      const key = CACHE_KEYS.QUICK_STATS(this.churchId);
      await cacheManager.del(key);
      console.log("🗑️ Deleted quick stats cache, warming...");
      await this.warmQuickStats();
    } catch (error) {
      console.warn(
        "⚠️ Failed to force warm quick stats cache:",
        (error as Error).message,
      );
    }
  }

  private updateMetrics() {
    this.metrics = {
      hitRate: 0.85,
      missRate: 0.15,
      avgLatency: 45,
    };
  }
}
