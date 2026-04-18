// app/api/cron/backup-roster-build/route.ts
// Weekly cron: Rebuild backup rosters for all volunteers in all active churches.
// Runs every Monday at 6:00 AM (vercel.json: "0 6 * * 1")
//
// GET /api/cron/backup-roster-build
// Authorization: Bearer <CRON_SECRET>

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { buildAllBackupRosters } from "@/lib/volunteer-coverage/coverage-engine";

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
        await buildAllBackupRosters(church.id);
        processed++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`church:${church.id}: ${msg}`);
        console.error(
          `[BACKUP_ROSTER_BUILD] Run failed for ${church.id}:`,
          err
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
    console.error("[BACKUP_ROSTER_BUILD] Cron error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
