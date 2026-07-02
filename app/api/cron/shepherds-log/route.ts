// app/api/cron/shepherds-log/route.ts
// Weekly cron: Refresh the Shepherd's Log cache for all active churches.
// Runs every Monday at 6:00 AM (vercel.json: "0 6 * * 1")
//
// POST /api/cron/shepherds-log
// Authorization: Bearer <CRON_SECRET>
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { refreshShepherdsLog } from "@/lib/shepherds-log-service";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const startTime = Date.now();
  try {
    const authHeader = req.headers.get("Authorization");
    // CRITICAL: Check if Agent 5 is enabled in database
    const agent = await db.agent_settings.findUnique({
      where: { agentId: 5 },
      select: { isEnabled: true, agentName: true }
    });
    if (!agent?.isEnabled) {
      console.log('[CRON/Shepherds Log] Agent 5 is DISABLED - skipping execution');
      return NextResponse.json({
        skipped: true,
        reason: "Agent 5 (Shepherds Log) is disabled in platform settings",
      });
    }
    if (process.env.ENABLE_SHEPHERDS_LOG !== "true") {
      console.log('[CRON/Shepherds Log] ENABLE_SHEPHERDS_LOG is not true - skipping');
      return NextResponse.json({
        skipped: true,
        reason: "shepherds log disabled via environment variable",
      });
    }
    // Refresh log for every active church
    const churches = await db.churches.findMany({
      where: { isActive: true },
      select: { id: true },
    });
    let refreshed = 0;
    const errors: string[] = [];
    for (const church of churches) {
      try {
        await refreshShepherdsLog(church.id);
        refreshed++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`church:${church.id}: ${msg}`);
        console.error(`[SHEPHERDS_LOG] Refresh failed for ${church.id}:`, err);
      }
    }
    const duration = Date.now() - startTime;
    // CRITICAL: Update agent_settings with execution status
    await db.agent_settings.update({
      where: { agentId: 5 },
      data: {
        lastRunStatus: errors.length === 0 ? 'SUCCESS' : 'PARTIAL',
        lastRunAt: new Date(),
        lastRunDuration: duration,
        lastError: errors.length > 0 ? errors.join('; ') : null,
      },
    });
    console.log(`[SHEPHERDS_LOG] Execution completed: ${refreshed}/${churches.length} churches refreshed in ${duration}ms`);
    return NextResponse.json({
      success: true,
      refreshed,
      total: churches.length,
      duration,
      ...(errors.length > 0 && { errors }),
    });
  } catch (err) {
    const duration = Date.now() - startTime;
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("[SHEPHERDS_LOG] Cron error:", err);
    // CRITICAL: Update agent_settings with failure status
    try {
      await db.agent_settings.update({
        where: { agentId: 5 },
        data: {
          lastRunStatus: 'FAILED',
          lastRunAt: new Date(),
          lastRunDuration: duration,
          lastError: errorMessage,
        },
      });
    } catch (updateErr) {
      console.error('[SHEPHERDS_LOG] Failed to update agent_settings:', updateErr);
    }
    return NextResponse.json(
      { error: "Internal server error", message: errorMessage },
      { status: 500 },
    );
  }
}
