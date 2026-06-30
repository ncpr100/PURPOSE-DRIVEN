// app/api/cron/sre-health-check/route.ts
// Agent 14 — SRE health check heartbeat, runs every minute
// Schedule: * * * * *
import { NextRequest, NextResponse } from "next/server";
import { runSRECycle } from "@/lib/system/sre-engineer";
import { db } from "@/lib/db";
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ✅ CRITICAL: Check if Agent 14 is enabled in database
  const agent = await db.agent_settings.findUnique({
    where: { agentId: 14 },
    select: { isEnabled: true, agentName: true }
  });
  if (!agent?.isEnabled) {
    console.log('[CRON/SRE-HEALTH] Agent 14 is DISABLED — skipping execution');
    return NextResponse.json({
      skipped: true,
      reason: "Agent 14 (SRE Engineer) is disabled in platform settings",
    });
  }
  if (process.env.ENABLE_SRE_ENGINEER !== "true") {
    return NextResponse.json({
      skipped: true,
      reason: "SRE Engineer not enabled",
    });
  }
  try {
    const result = await runSRECycle();
    console.log("[CRON/SRE-HEALTH]", result);
    return NextResponse.json({
      ok: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[CRON/SRE-HEALTH] Failed:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
