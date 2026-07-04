// app/api/cron/board-report/route.ts
// Monthly cron: Generate the Church Health Synthesizer board report for all active churches.
// Runs on the first Monday of each month at 6:00 AM.
// Schedule: "0 6 1-7 * 1"  (days 1–7 AND Monday — standard cron equivalent of "1#1")
//
// GET /api/cron/board-report
// Authorization: Bearer <CRON_SECRET>

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateBoardReport } from "@/lib/church-health-synthesizer";
import { logAgentExecution } from "@/lib/agent-logger";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  let errDuration = 0;
  try {
    const authHeader = req.headers.get("Authorization");
    if (
      !process.env.CRON_SECRET ||
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // CRITICAL: Check if Agent 11 is enabled in database
    const agent = await db.agent_settings.findUnique({
      where: { agentId: 11 },
      select: { isEnabled: true, agentName: true },
    });
    if (!agent?.isEnabled) {
      console.log("[CRON/Board Report] Agent 11 is DISABLED - skipping execution");
      return NextResponse.json({
        skipped: true,
        reason: "Agent 11 (Board Synthesizer) is disabled in platform settings",
      });
    }

    if (process.env.ENABLE_BOARD_REPORT !== "true") {
      return NextResponse.json({
        skipped: true,
        reason: "ENABLE_BOARD_REPORT env var not set to true",
      });
    }

    const churches = await db.churches.findMany({
      where: { isActive: true },
      select: { id: true },
    });

    let generated = 0;
    const errors: string[] = [];

    for (const church of churches) {
      try {
        await generateBoardReport(church.id);
        generated++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`church:${church.id}: ${msg}`);
        console.error(
          `[BOARD_REPORT] Generation failed for ${church.id}:`,
          err,
        );
      }
    }

    const duration = Date.now() - startTime;
    await logAgentExecution({
      agentId: 11,
      status: errors.length > 0 && generated === 0 ? "FAILED" : errors.length > 0 ? "PARTIAL" : "SUCCESS",
      durationMs: duration,
      outputData: { generated, total: churches.length, errors: errors.length },
      ...(errors.length > 0 && { errorMessage: errors[0].substring(0, 500) }),
    });

    return NextResponse.json({
      success: true,
      generated,
      total: churches.length,
      ...(errors.length > 0 && { errors }),
    });
  } catch (err) {
    errDuration = Date.now() - startTime;
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("[BOARD_REPORT] Cron error:", err);
    await logAgentExecution({
      agentId: 11,
      status: "FAILED",
      durationMs: errDuration,
      errorMessage: errMsg.substring(0, 500),
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
