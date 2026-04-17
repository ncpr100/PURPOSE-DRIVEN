// app/api/volunteers/burnout-alerts/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { runBurnoutSentinel } from "@/lib/volunteer-burnout-sentinel";

export const dynamic = "force-dynamic";

// GET — return unresolved burnout alerts for the church
export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (
    !session?.user?.churchId ||
    !["PASTOR", "ADMIN_IGLESIA"].includes(session.user.role)
  ) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const alerts = await db.burnout_alerts.findMany({
    where: { churchId: session.user.churchId, isResolved: false },
    orderBy: [{ severity: "desc" }, { createdAt: "desc" }],
    take: 20,
  });

  return NextResponse.json({ alerts });
}

// POST — manually trigger the sentinel scan
export async function POST(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.churchId || session.user.role !== "PASTOR") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const alerts = await runBurnoutSentinel(session.user.churchId);
  return NextResponse.json({ alerts, count: alerts.length });
}
