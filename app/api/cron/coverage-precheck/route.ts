// app/api/cron/coverage-precheck/route.ts
// Hourly cron: Run the 48-hour pre-event coverage check for all active churches.
// Runs every hour (vercel.json: "0 */1 * * *")
//
// GET /api/cron/coverage-precheck
// Authorization: Bearer <CRON_SECRET>

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { runPreEventCheck } from "@/lib/volunteer-coverage/coverage-engine";
import { logAgentExecution } from "@/lib/agent-logger";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  let duration = 0;
  let errDuration = 0;
  let duration = 0;
  try {
    const authHeader = req.headers.get("Authorization");
    if (
      !process.env.CRON_SECRET ||
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (process.env.ENABLE_VOLUNTEER_COVERAGE !== "true") {
      return NextResponse.json({
        skipped: true,
        reason: "volunteer coverage disabled",
      });
    }

    const churches = await db.churches.findMany({
      where: { isActive: true },
      select: { id: true },
    });

    let processed = 0;
    const errors: string[] = [];

    for (const church of churches) {
      try {
        await runPreEventCheck(church.id);
        processed++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`church:${church.id}: ${msg}`);
        console.error(`[COVERAGE_PRECHECK] Run failed for ${church.id}:`, err);
      }
    }

    
        // --- EXECUTION TRACKING (SUCCESS) ---
    duration = Date.now() - startTime;
    const overdueEvents = [];
    const sent = 0;
    await logAgentExecution({
      agentId: 12,
      status: "SUCCESS",
      durationMs: duration,
      tokensUsed: 0,
      outputData: { processed: overdueEvents?.length || 0, sent: sent || 0 }
    });
    

    return NextResponse.json({ success: true,
      processed,
      total: churches.length,
      ...(errors.length > 0 && { errors }),
    });
  } catch (err) {
    console.error("[COVERAGE_PRECHECK] Cron error:", err);

        // --- EXECUTION TRACKING (ERROR) ---
    duration = Date.now() - startTime;
    const errMsg = err instanceof Error ? err.message : String(err);
    await logAgentExecution({
      agentId: 12,
      status: "FAILED",
      durationMs: errDuration,
      tokensUsed: 0,
      errorMessage: errMsg.substring(0, 500)
    });
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
