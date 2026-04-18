// app/api/cron/pre-event-check/route.ts
// Hourly cron: Contact unconfirmed volunteers 48h before event; trigger cascade if no response after 6h.
// Runs every hour (vercel.json: "0 */1 * * *")
//
// GET /api/cron/pre-event-check
// Authorization: Bearer <CRON_SECRET>

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { runPreEventCheck } from "@/lib/volunteer-coverage/coverage-engine";

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

    if (process.env.ENABLE_VOLUNTEER_COVERAGE !== "true") {
      return NextResponse.json({
        skipped: true,
        reason: "volunteer coverage disabled",
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
        await runPreEventCheck(church.id);
        processed++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`church:${church.id}: ${msg}`);
        console.error(`[PRE_EVENT_CHECK] Run failed for ${church.id}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      processed,
      total: churches.length,
      ...(errors.length > 0 && { errors }),
    });
  } catch (err) {
    console.error("[PRE_EVENT_CHECK] Cron error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
