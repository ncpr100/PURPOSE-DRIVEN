// app/api/cron/sla-calculation/route.ts
// Calculate and persist monthly SLA record
// Schedule: 0 0 * * *

import { NextRequest, NextResponse } from "next/server";
import { calculateMonthlySLA } from "@/lib/system/sre-engineer";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  try {
    await calculateMonthlySLA(month);
    return NextResponse.json({
      ok: true,
      month,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[CRON/SLA-CALC] Failed:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
