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

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (
      !process.env.CRON_SECRET ||
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (process.env.ENABLE_SHEPHERDS_LOG !== "true") {
      return NextResponse.json({ skipped: true, reason: "shepherds log disabled" });
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

    return NextResponse.json({
      success: true,
      refreshed,
      total: churches.length,
      ...(errors.length > 0 && { errors }),
    });
  } catch (err) {
    console.error("[SHEPHERDS_LOG] Cron error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
