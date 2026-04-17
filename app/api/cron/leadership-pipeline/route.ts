// app/api/cron/leadership-pipeline/route.ts
// Weekly cron: Refresh the Leadership Pipeline for all active churches.
// Runs every Monday at 7:00 AM (vercel.json: "0 7 * * 1")
//
// POST /api/cron/leadership-pipeline
// Authorization: Bearer <CRON_SECRET>

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { refreshLeadershipPipeline } from "@/lib/leadership-pipeline-service";

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

    if (process.env.ENABLE_LEADERSHIP_PIPELINE !== "true") {
      return NextResponse.json({ skipped: true, reason: "leadership pipeline disabled" });
    }

    const churches = await db.churches.findMany({
      where: { isActive: true },
      select: { id: true },
    });

    let refreshed = 0;
    const errors: string[] = [];

    for (const church of churches) {
      try {
        await refreshLeadershipPipeline(church.id);
        refreshed++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`church:${church.id}: ${msg}`);
        console.error(`[LEADERSHIP_PIPELINE] Refresh failed for ${church.id}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      refreshed,
      total: churches.length,
      ...(errors.length > 0 && { errors }),
    });
  } catch (err) {
    console.error("[LEADERSHIP_PIPELINE] Cron error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
