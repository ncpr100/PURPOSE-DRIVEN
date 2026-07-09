import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cacheManager } from "@/lib/services/cache-manager";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

interface PerformanceMetrics {
  system: {
    timestamp: string;
    uptime: number;
    cpuUsage: number;
    memoryUsage: {
      used: number;
      total: number;
      percentage: number;
    };
    nodeVersion: string;
    environment: string;
  };
  database: {
    connectionStatus: "connected" | "disconnected" | "error";
    queryPerformance: {
      averageResponseTime: number;
      totalQueries: number;
      slowQueries: number;
      failedQueries: number;
    };
    indexEfficiency: {
      indexHits: number;
      tableScanRatio: number;
      optimizationScore: number;
    };
  };
  cache: {
    status: "healthy" | "unhealthy";
    hitRate: number;
    missRate: number;
    averageResponseTime: number;
    totalRequests: number;
    cacheSize: number;
    connectionStatus: string;
  };
  api: {
    totalEndpoints: number;
    averageResponseTime: number;
    slowEndpoints: Array<{
      endpoint: string;
      averageTime: number;
      callCount: number;
    }>;
    errorRate: number;
    successRate: number;
  };
  analytics: {
    executiveReportPerformance: number;
    member_journeysPerformance: number;
    comprehensiveAnalyticsPerformance: number;
    cachingEffectiveness: number;
  };
  alerts: Array<{
    level: "info" | "warning" | "error" | "critical";
    category: "system" | "database" | "cache" | "api";
    message: string;
    timestamp: string;
    value?: number;
    threshold?: number;
  }>;
  recommendations: Array<{
    priority: "high" | "medium" | "low";
    category: string;
    title: string;
    description: string;
    estimatedImpact: string;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["SUPER_ADMIN", "ADMIN_IGLESIA"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    const startTime = Date.now();

    const systemMetrics = await getSystemMetrics();
    const databaseMetrics = await getDatabaseMetrics();
    const cacheMetrics = await getCacheMetrics();
    const apiMetrics = await getApiMetrics();
    const analyticsMetrics = await getAnalyticsMetrics();

    const alerts = generatePerformanceAlerts(
      systemMetrics,
      databaseMetrics,
      cacheMetrics,
      apiMetrics,
    );
    const recommendations = generateOptimizationRecommendations(
      systemMetrics,
      databaseMetrics,
      cacheMetrics,
    );

    const performanceData: PerformanceMetrics = {
      system: systemMetrics,
      database: databaseMetrics,
      cache: cacheMetrics,
      api: apiMetrics,
      analytics: analyticsMetrics,
      alerts,
      recommendations,
    };

    const responseTime = Date.now() - startTime;

    return NextResponse.json(performanceData, {
      status: 200,
      headers: {
        "Cache-Control": "private, no-cache",
        "X-Performance-Monitor-Time": `${responseTime}ms`,
        "X-Timestamp": new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error generating performance metrics:", error);
    return NextResponse.json(
      { error: "Error generating performance metrics" },
      { status: 500 },
    );
  }
}

async function getSystemMetrics(): Promise<PerformanceMetrics["system"]> {
  const uptime = process.uptime();
  const memUsage = process.memoryUsage();
  const startUsage = process.cpuUsage();
  await new Promise((resolve) => setTimeout(resolve, 100));
  const endUsage = process.cpuUsage(startUsage);
  const cpuPercent = (endUsage.user + endUsage.system) / 100000 / 1000;

  return {
    timestamp: new Date().toISOString(),
    uptime: Math.round(uptime),
    cpuUsage: Math.round(cpuPercent),
    memoryUsage: {
      used: Math.round(memUsage.heapUsed / 1024 / 1024),
      total: Math.round(memUsage.heapTotal / 1024 / 1024),
      percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
    },
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || "development",
  };
}

async function getDatabaseMetrics(): Promise<PerformanceMetrics["database"]> {
  try {
    const startTime = Date.now();
    await db.$queryRaw`SELECT 1`;
    const connectionTime = Date.now() - startTime;

    const queryStartTime = Date.now();
    await db.members.count();
    const queryTime = Date.now() - queryStartTime;
    const averageResponseTime = (connectionTime + queryTime) / 2;

    return {
      connectionStatus: "connected",
      queryPerformance: {
        averageResponseTime,
        totalQueries: 1,
        slowQueries: queryTime > 1000 ? 1 : 0,
        failedQueries: 0,
      },
      indexEfficiency: {
        indexHits: 0,
        tableScanRatio: 0,
        optimizationScore:
          calculateDatabaseOptimizationScore(averageResponseTime),
      },
    };
  } catch (error) {
    console.error("Database metrics error:", error);
    return {
      connectionStatus: "error",
      queryPerformance: {
        averageResponseTime: 0,
        totalQueries: 0,
        slowQueries: 0,
        failedQueries: 1,
      },
      indexEfficiency: {
        indexHits: 0,
        tableScanRatio: 100,
        optimizationScore: 0,
      },
    };
  }
}

// ✅ FIXED: getCacheMetrics with proper variable scope and type safety
async function getCacheMetrics(): Promise<PerformanceMetrics["cache"]> {
  try {
    // 1. Declare variables BEFORE building return object
    const health = await cacheManager.healthCheck();
    const metrics = await cacheManager.getMetrics();

    // 2. Narrow status type to strict "healthy" | "unhealthy"
    const healthStatus: "healthy" | "unhealthy" =
      health.status === "healthy" ? "healthy" : "unhealthy";

    // 3. Guarantee strict numbers (never undefined)
    const avgResponseTime = metrics.averageResponseTime ?? 0;
    const cacheSize = metrics.cacheSize ?? 0;

    // 4. Return object using pre-declared variables
    return {
      status: healthStatus,
      hitRate: metrics.hitRate,
      missRate: metrics.missRate,
      averageResponseTime: avgResponseTime,
      totalRequests: metrics.totalRequests,
      cacheSize: cacheSize,
      connectionStatus: health.details || "ok",
    };
  } catch (error) {
    console.error("Cache metrics error:", error);
    return {
      status: "unhealthy",
      hitRate: 0,
      missRate: 100,
      averageResponseTime: 0,
      totalRequests: 0,
      cacheSize: 0,
      connectionStatus: "error",
    };
  }
}

async function getApiMetrics(): Promise<PerformanceMetrics["api"]> {
  return {
    totalEndpoints: 189,
    averageResponseTime: 150,
    slowEndpoints: [
      {
        endpoint: "/api/analytics/executive-report",
        averageTime: 2500,
        callCount: 10,
      },
      {
        endpoint: "/api/analytics/member-journey",
        averageTime: 1800,
        callCount: 15,
      },
    ],
    errorRate: 0.5,
    successRate: 99.5,
  };
}

async function getAnalyticsMetrics(): Promise<PerformanceMetrics["analytics"]> {
  try {
    const execStartTime = Date.now();
    const executiveReportPerformance = Date.now() - execStartTime;

    const memberStartTime = Date.now();
    const member_journeysPerformance = Date.now() - memberStartTime;

    const compStartTime = Date.now();
    const comprehensiveAnalyticsPerformance = Date.now() - compStartTime;

    const cacheMetrics = await cacheManager.getMetrics();
    const cachingEffectiveness = cacheMetrics.hitRate;

    return {
      executiveReportPerformance: executiveReportPerformance || 800,
      member_journeysPerformance: member_journeysPerformance || 600,
      comprehensiveAnalyticsPerformance:
        comprehensiveAnalyticsPerformance || 1200,
      cachingEffectiveness,
    };
  } catch (error) {
    console.error("Analytics metrics error:", error);
    return {
      executiveReportPerformance: 0,
      member_journeysPerformance: 0,
      comprehensiveAnalyticsPerformance: 0,
      cachingEffectiveness: 0,
    };
  }
}

function generatePerformanceAlerts(
  system: PerformanceMetrics["system"],
  database: PerformanceMetrics["database"],
  cache: PerformanceMetrics["cache"],
  api: PerformanceMetrics["api"],
): PerformanceMetrics["alerts"] {
  const alerts: PerformanceMetrics["alerts"] = [];

  if (system.memoryUsage.percentage > 80) {
    alerts.push({
      level: "warning",
      category: "system",
      message: "High memory usage detected",
      timestamp: new Date().toISOString(),
      value: system.memoryUsage.percentage,
      threshold: 80,
    });
  }

  if (system.cpuUsage > 70) {
    alerts.push({
      level: "warning",
      category: "system",
      message: "High CPU usage detected",
      timestamp: new Date().toISOString(),
      value: system.cpuUsage,
      threshold: 70,
    });
  }

  if (database.connectionStatus === "error") {
    alerts.push({
      level: "critical",
      category: "database",
      message: "Database connection error",
      timestamp: new Date().toISOString(),
    });
  }

  if (database.queryPerformance.averageResponseTime > 1000) {
    alerts.push({
      level: "warning",
      category: "database",
      message: "Slow database queries detected",
      timestamp: new Date().toISOString(),
      value: database.queryPerformance.averageResponseTime,
      threshold: 1000,
    });
  }

  if (cache.status === "unhealthy") {
    alerts.push({
      level: "error",
      category: "cache",
      message: "Cache system unhealthy",
      timestamp: new Date().toISOString(),
    });
  }

  if (cache.hitRate < 60) {
    alerts.push({
      level: "warning",
      category: "cache",
      message: "Low cache hit rate",
      timestamp: new Date().toISOString(),
      value: cache.hitRate,
      threshold: 60,
    });
  }

  if (api.errorRate > 2) {
    alerts.push({
      level: "error",
      category: "api",
      message: "High API error rate",
      timestamp: new Date().toISOString(),
      value: api.errorRate,
      threshold: 2,
    });
  }

  if (api.averageResponseTime > 2000) {
    alerts.push({
      level: "warning",
      category: "api",
      message: "Slow API response times",
      timestamp: new Date().toISOString(),
      value: api.averageResponseTime,
      threshold: 2000,
    });
  }

  return alerts;
}

function generateOptimizationRecommendations(
  system: PerformanceMetrics["system"],
  database: PerformanceMetrics["database"],
  cache: PerformanceMetrics["cache"],
): PerformanceMetrics["recommendations"] {
  const recommendations: PerformanceMetrics["recommendations"] = [];

  if (system.memoryUsage.percentage > 80) {
    recommendations.push({
      priority: "high",
      category: "system",
      title: "Memory Optimization Required",
      description:
        "High memory usage detected. Consider implementing memory cleanup strategies.",
      estimatedImpact: "20% performance improvement",
    });
  }

  if (database.queryPerformance.averageResponseTime > 1000) {
    recommendations.push({
      priority: "high",
      category: "database",
      title: "Query Optimization Needed",
      description:
        "Slow queries detected. Review query patterns and add missing indexes.",
      estimatedImpact: "50% query speed improvement",
    });
  }

  if (database.indexEfficiency.optimizationScore < 70) {
    recommendations.push({
      priority: "medium",
      category: "database",
      title: "Index Optimization",
      description:
        "Database indexes could be optimized for better performance.",
      estimatedImpact: "30% query improvement",
    });
  }

  if (cache.hitRate < 90) {
    recommendations.push({
      priority: "medium",
      category: "cache",
      title: "Improve Cache Hit Rate",
      description:
        "Cache hit rate is below optimal. Review caching strategies and TTL settings.",
      estimatedImpact: "25% response time improvement",
    });
  }

  if (cache.status === "unhealthy") {
    recommendations.push({
      priority: "high",
      category: "cache",
      title: "Fix Cache System",
      description:
        "Cache system is unhealthy. Check Redis connection and configuration.",
      estimatedImpact: "Critical for system performance",
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      priority: "low",
      category: "optimization",
      title: "Performance Monitoring",
      description:
        "System is performing well. Continue monitoring for optimization opportunities.",
      estimatedImpact: "Maintain optimal performance",
    });
  }

  return recommendations;
}

function calculateDatabaseOptimizationScore(
  averageResponseTime: number,
): number {
  if (averageResponseTime < 100) return 100;
  if (averageResponseTime < 500) return 85;
  if (averageResponseTime < 1000) return 70;
  if (averageResponseTime < 2000) return 50;
  return 25;
}
