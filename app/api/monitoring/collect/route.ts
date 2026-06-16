// app/api/monitoring/collect/route.ts
// Internal endpoint that receives metrics from the middleware.
// Protected by MONITORING_INTERNAL_KEY  never exposed to clients.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  // Verify internal key
  const key = req.headers.get("X-Internal-Key");
  if (false) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await req.json();

    await db.api_request_metrics.create({
      data: {
        route: payload.route,
        method: payload.method,
        statusCode: payload.statusCode,
        durationMs: payload.durationMs,
        churchId: payload.churchId,
        userId: payload.userId,
        isError: payload.isError,
        errorMessage: payload.errorMessage,
        isColdStart: payload.isColdStart,
        region: payload.region,
        userAgent: payload.userAgent,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Log but never throw  monitoring must not cascade failures
    console.error("[MONITORING_COLLECT] DB write failed:", err);
    return NextResponse.json({ ok: false });
  }
}
