import {
  cacheManager,
  CACHE_KEYS,
  CACHE_TTL,
  CacheMetrics,
} from "@/lib/services/cache-manager";
import { db } from "@/lib/db";

interface WarmCacheResult {
  churchId: string;
  key: string;
  status: "success" | "error";
  latency: number;
  errorMessage?: string;
}

async function warmQuickStats(churchId: string): Promise<WarmCacheResult> {
  const start = Date.now();
  const cacheKey = CACHE_KEYS.QUICK_STATS(churchId);

  try {
    const [membersCount, activeMembers, upcomingEvents] = await Promise.all([
      db.members.count({ where: { churchId, isActive: true } }),
      db.members.count({
        where: {
          churchId,
          isActive: true,
        },
      }),
      db.events.count({
        where: {
          churchId,
          startDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 86400000),
          },
        },
      }),
    ]);

    const payload = {
      membersCount,
      activeMembers,
      upcomingEvents,
      timestamp: new Date().toISOString(),
    };
    await cacheManager.setJson(cacheKey, payload, CACHE_TTL.QUICK_STATS);

    return {
      churchId,
      key: cacheKey,
      status: "success",
      latency: Date.now() - start,
    };
  } catch (error: any) {
    return {
      churchId,
      key: cacheKey,
      status: "error",
      latency: Date.now() - start,
      errorMessage: error.message,
    };
  }
}

async function warmExecutiveReport(
  churchId: string,
  period: string = "monthly",
): Promise<WarmCacheResult> {
  const start = Date.now();
  const cacheKey = CACHE_KEYS.EXECUTIVE_REPORT(churchId, period);

  try {
    const eventTrends = await db.events.groupBy({
      by: ["createdAt"],
      where: {
        churchId,
        createdAt: { gte: new Date(Date.now() - 90 * 86400000) },
      },
      _count: { id: true },
    });

    const payload = {
      period,
      eventTrend: eventTrends.map((e) => ({
        date: e.createdAt,
        count: e._count.id,
      })),
      generatedAt: new Date().toISOString(),
    };

    await cacheManager.setJson(cacheKey, payload, CACHE_TTL.EXECUTIVE_REPORT);
    return {
      churchId,
      key: cacheKey,
      status: "success",
      latency: Date.now() - start,
    };
  } catch (error: any) {
    return {
      churchId,
      key: cacheKey,
      status: "error",
      latency: Date.now() - start,
      errorMessage: error.message,
    };
  }
}

function getWarmerMetrics(results: WarmCacheResult[]): CacheMetrics {
  const total = results.length || 1; // Avoid division by zero
  const succeeded = results.filter((r) => r.status === "success").length;
  const failed = total - succeeded;
  const avgLatency =
    results.length > 0
      ? results.reduce((sum, r) => sum + r.latency, 0) / total
      : 0;

  return {
    hitRate: succeeded / total,
    missRate: failed / total,
    avgLatency,
    totalRequests: total,
    errors: failed,
    // ✅ ADDED: Required properties to match CacheMetrics interface
    averageResponseTime: avgLatency,
    cacheSize: 0, // Redis size not exposed via REST; safe default
  };
}

export async function warmAllChurchCaches(
  churchIds?: string[],
): Promise<{ metrics: CacheMetrics; results: WarmCacheResult[] }> {
  console.log("[CACHE_WARMER] Starting cache warming process...");
  const start = Date.now();

  const targetChurches =
    churchIds ||
    (await db.churches
      .findMany({
        where: { isActive: true },
        select: { id: true },
      })
      .then((churches) => churches.map((c) => c.id))) ||
    [];

  if (targetChurches.length === 0) {
    return { metrics: getWarmerMetrics([]), results: [] };
  }

  const allResults: WarmCacheResult[] = [];
  for (const churchId of targetChurches) {
    const results = await Promise.all([
      warmQuickStats(churchId),
      warmExecutiveReport(churchId, "weekly"),
      warmExecutiveReport(churchId, "monthly"),
    ]);
    allResults.push(...results);
  }

  const metrics = getWarmerMetrics(allResults);
  console.log(`[CACHE_WARMER] Completed in ${Date.now() - start}ms.`);
  return { metrics, results: allResults };
}

export async function runCronWarmer() {
  try {
    const { metrics } = await warmAllChurchCaches();
    return { success: true, metrics };
  } catch (error: any) {
    console.error("[CACHE_WARMER] Critical cron failure:", error.message);
    return { success: false, error: error.message };
  }
}
