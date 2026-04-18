export const dynamic = "force-dynamic";

// app/api/coverage/route.ts
// Get coverage status for all upcoming events.

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { runCoverageSentinel } from "@/lib/volunteer-coverage/coverage-engine";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (
    !session?.user ||
    !["PASTOR", "ADMIN_IGLESIA", "LIDER"].includes(session.user.role)
  ) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const now = new Date();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // event_coverage_status has no relation to events — fetch events separately
  const upcomingEvents = await db.events.findMany({
    where: {
      churchId: session.user.churchId,
      startDate: { gte: now, lte: sevenDaysLater },
    },
    select: { id: true, title: true, startDate: true },
  });

  const eventIds = upcomingEvents.map((e) => e.id);
  const eventsById: Record<string, (typeof upcomingEvents)[number]> = {};
  for (const ev of upcomingEvents) eventsById[ev.id] = ev;

  const slots = await db.event_coverage_status.findMany({
    where: {
      churchId: session.user.churchId,
      eventId: { in: eventIds },
    },
    orderBy: { createdAt: "asc" },
  });

  // Group by event, join event data from eventsById map
  const byEvent = slots.reduce(
    (acc, slot) => {
      const key = slot.eventId;
      if (!acc[key]) {
        acc[key] = {
          event: eventsById[key] ?? null,
          slots: [],
          coverageRate: 0,
        };
      }
      acc[key].slots.push(slot);
      return acc;
    },
    {} as Record<string, any>,
  );

  // Calculate coverage rate per event
  Object.values(byEvent).forEach((e: any) => {
    const covered = e.slots.filter((s: any) =>
      ["CONFIRMED", "COVERED"].includes(s.status),
    ).length;
    e.coverageRate = e.slots.length > 0 ? covered / e.slots.length : 1;
  });

  return NextResponse.json({ coverage: Object.values(byEvent) });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (
    !session?.user ||
    !["PASTOR", "ADMIN_IGLESIA"].includes(session.user.role)
  ) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Manually trigger the sentinel
  const report = await runCoverageSentinel(session.user.churchId);
  return NextResponse.json({ report });
}
