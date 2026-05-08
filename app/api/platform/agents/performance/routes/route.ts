// app/api/platform/agents/performance/routes/route.ts
// Agent 13 — GET slowest and most errored routes
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
    return NextResponse.json({ slowest: [], mostErrored: [], disabled: true });
  }

  const { collectPerformanceSnapshot } = await import("@/lib/agents/performance-engineer");
  const snapshot = await collectPerformanceSnapshot(60);

  return NextResponse.json({
    slowest: snapshot.slowestRoutes,
    mostErrored: snapshot.mostErroredRoutes,
  });
}
