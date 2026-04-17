// app/api/generosity/journey-alerts/route.ts
// Agent 9: Generosity Journey Coach — HTTP endpoints

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { runGenerosityJourneyAnalysis } from "@/lib/generosity-journey-service";

export const dynamic = "force-dynamic";

// GET — return current generosity alerts for the church
export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (
    !session?.user?.churchId ||
    !["PASTOR", "ADMIN_IGLESIA"].includes(session.user.role)
  ) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const alerts = await runGenerosityJourneyAnalysis(session.user.churchId);
  return NextResponse.json({ alerts, count: alerts.length });
}

// POST — manually trigger the analysis
export async function POST(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.churchId || session.user.role !== "PASTOR") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const alerts = await runGenerosityJourneyAnalysis(session.user.churchId);
  return NextResponse.json({ alerts, count: alerts.length });
}
