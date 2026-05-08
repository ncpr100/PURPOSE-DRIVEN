// app/api/platform/agents/sre/run-check/route.ts
// Agent 14 — POST manually trigger a health check cycle
// SUPER_ADMIN only

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (process.env.ENABLE_SRE_ENGINEER !== "true") {
    return NextResponse.json(
      { error: "SRE Engineer not enabled" },
      { status: 503 },
    );
  }

  const { runSRECycle } = await import("@/lib/agents/sre-engineer");
  const result = await runSRECycle();
  return NextResponse.json({ ok: true, ...result });
}
