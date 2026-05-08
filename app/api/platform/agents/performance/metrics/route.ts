// app/api/platform/agents/performance/metrics/route.ts
// Agent 13 — GET metric summaries (hourly/daily aggregates)
// SUPER_ADMIN only

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const period = url.searchParams.get("period") || "hourly";
  const limit = parseInt(url.searchParams.get("limit") || "24");
  const route = url.searchParams.get("route");

  const summaries = await db.platform_metric_summaries.findMany({
    where: {
      period,
      route: route ?? undefined,
    },
    orderBy: { periodStart: "desc" },
    take: limit * 5,
  });

  // Pivot: group by periodStart
  const pivoted = new Map<string, Record<string, number>>();
  for (const s of summaries) {
    const key = s.periodStart.toISOString();
    if (!pivoted.has(key)) {
      pivoted.set(key, { periodStart: s.periodStart.getTime() });
    }
    const metricKey =
      s.metricType === "RESPONSE_TIME_P50"
        ? "p50Ms"
        : s.metricType === "RESPONSE_TIME_P95"
          ? "p95Ms"
          : s.metricType === "RESPONSE_TIME_P99"
            ? "p99Ms"
            : s.metricType === "ERROR_RATE"
              ? "errorRate"
              : s.metricType === "THROUGHPUT_RPS"
                ? "throughput"
                : s.metricType.toLowerCase();
    pivoted.get(key)![metricKey] = s.value;
  }

  const metrics = Array.from(pivoted.values())
    .sort((a, b) => a.periodStart - b.periodStart)
    .slice(-limit);

  return NextResponse.json({ metrics });
}
