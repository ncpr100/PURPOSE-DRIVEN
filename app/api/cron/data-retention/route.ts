// app/api/cron/data-retention/route.ts
// Purge old raw api_request_metrics per 30-day retention policy
// Schedule: 0 3 * * *

import { NextRequest, NextResponse } from "next/server";
import { runDataRetentionCleanup } from "@/lib/agents/sre-engineer";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runDataRetentionCleanup();
    console.log("[CRON/DATA-RETENTION]", result);
    return NextResponse.json({ ok: true, ...result, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error("[CRON/DATA-RETENTION] Failed:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
