// app/api/cron/metrics-rollup/route.ts
// Roll up hourly raw metrics into platform_metric_summaries
// Schedule: 0 * * * *

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    const hourlyMetrics = await db.api_request_metrics.findMany({
      where: { requestedAt: { gte: twoHoursAgo, lt: oneHourAgo } },
      select: { route: true, durationMs: true, isError: true },
    });

    if (hourlyMetrics.length === 0) {
      return NextResponse.json({ ok: true, message: "No metrics to roll up" });
    }

    const durations = hourlyMetrics
      .map((m) => m.durationMs)
      .sort((a, b) => a - b);
    const errorCount = hourlyMetrics.filter((m) => m.isError).length;

    const percentile = (arr: number[], pct: number) => {
      const idx = Math.ceil((pct / 100) * arr.length) - 1;
      return arr[Math.max(0, idx)];
    };

    await db.platform_metric_summaries.createMany({
      skipDuplicates: true,
      data: [
        {
          period: "hourly",
          periodStart: twoHoursAgo,
          periodEnd: oneHourAgo,
          metricType: "RESPONSE_TIME_P50",
          value: percentile(durations, 50),
          sampleCount: durations.length,
        },
        {
          period: "hourly",
          periodStart: twoHoursAgo,
          periodEnd: oneHourAgo,
          metricType: "RESPONSE_TIME_P95",
          value: percentile(durations, 95),
          sampleCount: durations.length,
        },
        {
          period: "hourly",
          periodStart: twoHoursAgo,
          periodEnd: oneHourAgo,
          metricType: "RESPONSE_TIME_P99",
          value: percentile(durations, 99),
          sampleCount: durations.length,
        },
        {
          period: "hourly",
          periodStart: twoHoursAgo,
          periodEnd: oneHourAgo,
          metricType: "ERROR_RATE",
          value: (errorCount / hourlyMetrics.length) * 100,
          sampleCount: hourlyMetrics.length,
        },
        {
          period: "hourly",
          periodStart: twoHoursAgo,
          periodEnd: oneHourAgo,
          metricType: "THROUGHPUT_RPS",
          value: hourlyMetrics.length / 3600,
          sampleCount: hourlyMetrics.length,
        },
      ],
    });

    return NextResponse.json({
      ok: true,
      samplesProcessed: hourlyMetrics.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[CRON/METRICS-ROLLUP] Failed:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
