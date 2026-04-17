// app/api/cron/burnout-sentinel/route.ts
// Weekly cron: Run the Burnout Sentinel for all active churches.
// Runs every Monday at 8:00 AM (vercel.json: "0 8 * * 1")
//
// GET /api/cron/burnout-sentinel
// Authorization: Bearer <CRON_SECRET>

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { runBurnoutSentinel } from "@/lib/volunteer-burnout-sentinel";

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

    if (process.env.ENABLE_BURNOUT_SENTINEL !== "true") {
      return NextResponse.json({
        skipped: true,
        reason: "burnout sentinel disabled",
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
        await runBurnoutSentinel(church.id);
        processed++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`church:${church.id}: ${msg}`);
        console.error(`[BURNOUT_SENTINEL] Run failed for ${church.id}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      processed,
      total: churches.length,
      ...(errors.length > 0 && { errors }),
    });
  } catch (err) {
    console.error("[BURNOUT_SENTINEL] Cron error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
