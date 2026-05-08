// app/api/platform/agents/performance/analyze/route.ts
// Agent 13 — POST trigger immediate performance analysis
// SUPER_ADMIN only

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (process.env.ENABLE_PERFORMANCE_ENGINEER !== "true") {
    return NextResponse.json(
      { error: "Performance Engineer not enabled" },
      { status: 503 },
    );
  }

  const {
    collectPerformanceSnapshot,
    detectPerformanceAnomalies,
    generatePerformanceRecommendations,
  } = await import("@/lib/agents/performance-engineer");

  const snapshot = await collectPerformanceSnapshot(60);
  const anomalies = detectPerformanceAnomalies(snapshot);
  await generatePerformanceRecommendations(snapshot, anomalies);

  return NextResponse.json({ ok: true, anomalyCount: anomalies.length });
}
