// app/api/cron/small-group-monitor/route.ts
// Monthly cron: Score small group health for all active churches.
// Runs on the 1st of each month at 11:00 AM (vercel.json: "0 11 1 * *")
//
// POST /api/cron/small-group-monitor
// Authorization: Bearer <CRON_SECRET>

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scoreAllSmallGroups } from "@/lib/small-group-health-monitor";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (
      !process.env.CRON_SECRET ||
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (process.env.ENABLE_SMALL_GROUP_MONITOR !== "true") {
      return NextResponse.json({ skipped: true, reason: "small group monitor disabled" });
    }

    const churches = await db.churches.findMany({
      where: { isActive: true },
      select: { id: true },
    });

    let scored = 0;
    const errors: string[] = [];

    for (const church of churches) {
      try {
        await scoreAllSmallGroups(church.id);
        scored++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`church:${church.id}: ${msg}`);
        console.error(`[SMALL_GROUP_MONITOR] Scoring failed for ${church.id}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      scored,
      total: churches.length,
      ...(errors.length > 0 && { errors }),
    });
  } catch (err) {
    console.error("[SMALL_GROUP_MONITOR] Cron error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
