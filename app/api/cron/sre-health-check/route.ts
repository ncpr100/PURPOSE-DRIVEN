// app/api/cron/sre-health-check/route.ts
// Agent 14 — SRE health check heartbeat, runs every minute
// Schedule: * * * * *

import { NextRequest, NextResponse } from "next/server";
import { runSRECycle } from "@/lib/agents/sre-engineer";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (process.env.ENABLE_SRE_ENGINEER !== "true") {
    return NextResponse.json({ skipped: true, reason: "SRE Engineer not enabled" });
  }

  try {
    const result = await runSRECycle();
    console.log("[CRON/SRE-HEALTH]", result);
    return NextResponse.json({ ok: true, ...result, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error("[CRON/SRE-HEALTH] Failed:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
