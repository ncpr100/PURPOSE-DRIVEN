// app/api/cron/sermon-antiphony/route.ts
// Agent 1: Sermon Antiphony Engine — Weekly cron
// Analyzes newly submitted sermons for cultural blind spots, skeptic challenges,
// and unresolved tensions. Runs every Wednesday at 8:00 AM UTC.
// vercel.json: "0 8 * * 3"
//
// GET /api/cron/sermon-antiphony
// Authorization: Bearer <CRON_SECRET>

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analyzeSermon } from "@/lib/sermon-antiphony-engine";
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

    // 2. Check if Agent 1 is enabled in database
    const agent = await db.agent_settings.findUnique({
      where: { agentId: 1 },
      select: { isEnabled: true, agentName: true },
    });
    if (!agent?.isEnabled) {
      console.log("[CRON/Sermon Antiphony] Agent 1 is DISABLED - skipping execution");
      return NextResponse.json({
        skipped: true,
        reason: "Agent 1 (Sermon Antiphony Engine) is disabled in platform settings",
      });
    }

    // 3. Guard: env-var safety gate
    if (process.env.ENABLE_SERMON_ANTIPHONY !== "true") {
      return NextResponse.json({
        skipped: true,
        reason: "ENABLE_SERMON_ANTIPHONY env var not set to true",
      });
    }

    // 4. Fetch active churches with their country
    const churches = await db.churches.findMany({
      where: { isActive: true },
      select: { id: true, country: true },
    });

    let analyzed = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const church of churches) {
      // 5. Find sermons that have content but NO existing analysis record
      const sermons = await db.sermons.findMany({
        where: {
          churchId: church.id,
          content: { not: null },
          sermon_ai_analysis: null,
        },
        select: { id: true, title: true, content: true },
        take: 5, // Cap per church per run to control token spend
      });

      for (const sermon of sermons) {
        if (!sermon.content) continue;

        try {
          const analysis = await analyzeSermon(
            sermon.content,
            church.country || "Colombia",
          );

          // 6. Persist analysis to sermon_ai_analysis table
          await db.sermon_ai_analysis.create({
            data: {
              churchId: church.id,
              sermonId: sermon.id,
              culturalMirror: analysis.culturalMirror,
              skepticFilter: analysis.skepticFilter,
              unresolvedTension: analysis.unresolvedTension,
              comfortSentence: analysis.comfortSentence,
              discomfortSentence: analysis.discomfortSentence,
              modelVersion: "claude-sonnet-4-5",
            },
          });

          analyzed++;
          console.log(
            `[SERMON_ANTIPHONY] Analyzed sermon "${sermon.title}" for church ${church.id}`,
          );
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          errors.push(`sermon:${sermon.id}: ${msg}`);
          console.error(
            `[SERMON_ANTIPHONY] Analysis failed for sermon ${sermon.id}:`,
            err,
          );
        }
      }

      skipped += Math.max(0, sermons.length - 5);
    }

    // 7. Log successful execution
    duration = Date.now() - startTime;
    await logAgentExecution({
      agentId: 1,
      status: errors.length > 0 && analyzed === 0 ? "FAILED" : errors.length > 0 ? "PARTIAL" : "SUCCESS",
      durationMs: duration,
      outputData: { analyzed, skipped, errors: errors.length },
      ...(errors.length > 0 && { errorMessage: errors[0].substring(0, 500) }),
    });

    return NextResponse.json({
      success: true,
      analyzed,
      skipped,
      total_churches: churches.length,
      ...(errors.length > 0 && { errors }),
    });
  } catch (err) {
    errDuration = Date.now() - startTime;
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("[SERMON_ANTIPHONY] Cron error:", err);

    await logAgentExecution({
      agentId: 1,
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
