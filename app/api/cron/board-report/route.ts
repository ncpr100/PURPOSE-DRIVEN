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

    if (process.env.ENABLE_BOARD_REPORT !== "true") {
      return NextResponse.json({
        skipped: true,
        reason: "board report disabled",
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

    return NextResponse.json({
      success: true,
      generated,
      total: churches.length,
      ...(errors.length > 0 && { errors }),
    });
  } catch (err) {
    console.error("[BOARD_REPORT] Cron error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
