// app/api/platform/agents/performance/snapshot/route.ts
// Agent 13 — GET current 5-minute performance snapshot
// SUPER_ADMIN only

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (process.env.ENABLE_PERFORMANCE_ENGINEER !== "true") {
    return NextResponse.json({ snapshot: null, anomalies: [], disabled: true });
  }

  const { collectPerformanceSnapshot, detectPerformanceAnomalies } =
    await import("@/lib/agents/performance-engineer");
  const snapshot = await collectPerformanceSnapshot(5);
  const anomalies = detectPerformanceAnomalies(snapshot);

  return NextResponse.json({ snapshot, anomalies });
}
