// app/api/cron/visitor-conversion/route.ts
// Monthly cron: Generate visitor conversion reports for all active churches.
// Runs on the 1st of each month at 9:00 AM (vercel.json: "0 9 1 * *")
//
// GET /api/cron/visitor-conversion
// Authorization: Bearer <CRON_SECRET>

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateVisitorConversionReport } from "@/lib/visitor-conversion-service";

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

    if (process.env.ENABLE_VISITOR_CONVERSION !== "true") {
      return NextResponse.json({ skipped: true, reason: "visitor conversion disabled" });
    }

    const churches = await db.churches.findMany({
      where: { isActive: true },
      select: { id: true },
    });

    let generated = 0;
    const errors: string[] = [];

    for (const church of churches) {
      try {
        await generateVisitorConversionReport(church.id);
        generated++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`church:${church.id}: ${msg}`);
        console.error(`[VISITOR_CONVERSION] Report failed for ${church.id}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      generated,
      total: churches.length,
      ...(errors.length > 0 && { errors }),
    });
  } catch (err) {
    console.error("[VISITOR_CONVERSION] Cron error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
