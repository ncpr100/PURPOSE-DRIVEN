// app/api/cron/generosity-coach/route.ts
// Monthly cron: Run generosity journey analysis for all active churches.
// Runs on the 1st of each month at 10:00 AM (vercel.json: "0 10 1 * *")
//
// GET /api/cron/generosity-coach
// Authorization: Bearer <CRON_SECRET>

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { runGenerosityJourneyAnalysis } from "@/lib/generosity-journey-service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (
      !process.env.CRON_SECRET ||
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (process.env.ENABLE_GENEROSITY_COACH !== "true") {
      return NextResponse.json({
        skipped: true,
        reason: "generosity coach disabled",
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
        await runGenerosityJourneyAnalysis(church.id);
        processed++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`church:${church.id}: ${msg}`);
        console.error(
          `[GENEROSITY_COACH] Analysis failed for ${church.id}:`,
          err,
        );
      }
    }

    return NextResponse.json({
      success: true,
      processed,
      total: churches.length,
      ...(errors.length > 0 && { errors }),
    });
  } catch (err) {
    console.error("[GENEROSITY_COACH] Cron error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
