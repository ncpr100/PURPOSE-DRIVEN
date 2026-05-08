// app/api/platform/agents/sre/incidents/[id]/acknowledge/route.ts
// Agent 14 — POST acknowledge an incident
// SUPER_ADMIN only

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const now = new Date();
  const incident = await db.platform_incidents.findUnique({
    where: { id: params.id },
    select: { detectedAt: true },
  });

  if (!incident) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.platform_incidents.update({
    where: { id: params.id },
    data: {
      status: "ACKNOWLEDGED",
      acknowledgedAt: now,
      acknowledgedBy: session.user.id,
      timeToAcknowledgeMs:
        now.getTime() - new Date(incident.detectedAt).getTime(),
    },
  });

  await db.incident_timeline_events.create({
    data: {
      incidentId: params.id,
      event: "ACKNOWLEDGED",
      description: "Incidente reconocido por el administrador de plataforma.",
      author: session.user.name || "SUPER_ADMIN",
    },
  });

  return NextResponse.json({ ok: true });
}
