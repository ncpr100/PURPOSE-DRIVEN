// app/api/volunteers/coverage/route.ts
// GET — returns coverage status for upcoming events (dashboard data)
// POST — manually trigger the coverage sentinel scan

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { runCoverageSentinel } from "@/lib/volunteer-coverage/coverage-engine";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (
    !session?.user?.churchId ||
    !["PASTOR", "ADMIN_IGLESIA"].includes(session.user.role)
  ) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const churchId = session.user.churchId;
  const now = new Date();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Unprotected / no-backup slots in the next 7 days
  const flaggedSlots = await db.event_coverage_status.findMany({
    where: {
      churchId,
      status: { in: ["UNPROTECTED", "NO_BACKUP_ASSIGNED", "CANCELLED"] },
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });

  // Latest weekly report
  const latestReport = await db.ministry_coverage_reports.findFirst({
    where: { churchId },
    orderBy: { generatedAt: "desc" },
  });

  // Confirmed slots this week
  const confirmedCount = await db.event_coverage_status.count({
    where: {
      churchId,
      status: "CONFIRMED",
      updatedAt: { gte: now, lte: sevenDaysLater },
    },
  });

  return NextResponse.json({
    flaggedSlots,
    latestReport,
    confirmedCount,
  });
}

export async function POST(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.churchId || session.user.role !== "PASTOR") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const report = await runCoverageSentinel(session.user.churchId);
  return NextResponse.json({ report });
}
