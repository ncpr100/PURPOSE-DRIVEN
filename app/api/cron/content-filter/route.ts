// app/api/cron/content-filter/route.ts
// Agent 3: Wheat & Chaff Content Filter — Daily cron
// Transforms existing sermon antiphony analysis into formation-minded social
// media content and small group discussion guides. Depends on Agent 1 output.
// Runs every day at 7:00 AM UTC.
// vercel.json: "0 7 * * *"
//
// GET /api/cron/content-filter
// Authorization: Bearer <CRON_SECRET>

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateFormationContent } from "@/lib/content-filter-service";
import { logAgentExecution } from "@/lib/agent-logger";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  let duration = 0;
  let errDuration = 0;

  try {
    // 1. Authorization
    const authHeader = req.headers.get("Authorization");
    if (
      !process.env.CRON_SECRET ||
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check if Agent 3 is enabled in database
    const agent = await db.agent_settings.findUnique({
      where: { agentId: 3 },
      select: { isEnabled: true, agentName: true },
    });
    if (!agent?.isEnabled) {
      console.log(
        "[CRON/Content Filter] Agent 3 is DISABLED - skipping execution",
      );
      return NextResponse.json({
        skipped: true,
        reason: "Agent 3 (Content Filter) is disabled in platform settings",
      });
    }

    // 3. Guard: env-var safety gate
    if (process.env.ENABLE_CONTENT_FILTER !== "true") {
      return NextResponse.json({
        skipped: true,
        reason: "ENABLE_CONTENT_FILTER env var not set to true",
      });
    }

    // 4. Find sermon_ai_analysis records whose sermons don't yet have
    //    formation content cached in sermons.aiAnalysis
    const analyses = await db.sermon_ai_analysis.findMany({
      select: { sermonId: true, churchId: true },
      where: {
        // Only process sermons that have not had formation content generated yet
        church: { isActive: true },
        sermons: {
          // aiAnalysis null means no formation content stored yet
          OR: [{ aiAnalysis: { equals: null } }],
        },
      },
      take: 20, // Cap daily run to control costs
    });

    let generated = 0;
    const errors: string[] = [];

    for (const record of analyses) {
      try {
        const content = await generateFormationContent(
          record.sermonId,
          record.churchId,
        );

        // 5. Cache formation content in sermons.aiAnalysis Json field
        await db.sermons.update({
          where: { id: record.sermonId },
          data: {
            aiAnalysis: {
              formationContent: content,
              generatedAt: new Date().toISOString(),
              agentVersion: "agent3-v1",
            },
          },
        });

        generated++;
        console.log(
          `[CONTENT_FILTER] Formation content generated for sermon ${record.sermonId}`,
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`sermon:${record.sermonId}: ${msg}`);
        console.error(
          `[CONTENT_FILTER] Generation failed for sermon ${record.sermonId}:`,
          err,
        );
      }
    }

    // 6. Log execution
    duration = Date.now() - startTime;
    await logAgentExecution({
      agentId: 3,
      status:
        errors.length > 0 && generated === 0
          ? "FAILED"
          : errors.length > 0
            ? "PARTIAL"
            : "SUCCESS",
      durationMs: duration,
      outputData: {
        generated,
        total_queued: analyses.length,
        errors: errors.length,
      },
      ...(errors.length > 0 && { errorMessage: errors[0].substring(0, 500) }),
    });

    return NextResponse.json({
      success: true,
      generated,
      total_queued: analyses.length,
      ...(errors.length > 0 && { errors }),
    });
  } catch (err) {
    errDuration = Date.now() - startTime;
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("[CONTENT_FILTER] Cron error:", err);

    await logAgentExecution({
      agentId: 3,
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
