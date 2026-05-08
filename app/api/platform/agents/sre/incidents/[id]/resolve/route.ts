// app/api/platform/agents/sre/incidents/[id]/resolve/route.ts
// Agent 14 — POST manually resolve an incident
// SUPER_ADMIN only

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { resolution, rootCause } = body;

  const incident = await db.platform_incidents.findUnique({
    where: { id: params.id },
    select: { detectedAt: true },
  });

  if (!incident) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const now = new Date();

  await db.platform_incidents.update({
    where: { id: params.id },
    data: {
      status: "POST_MORTEM_PENDING",
      resolvedAt: now,
      resolvedBy: session.user.id,
      resolution,
      rootCause,
      timeToResolveMs: now.getTime() - new Date(incident.detectedAt).getTime(),
    },
  });

  await db.incident_timeline_events.create({
    data: {
      incidentId: params.id,
      event: "RESOLVED",
      description: `Incidente resuelto manualmente. Resolución: ${resolution}`,
      author: session.user.name || "SUPER_ADMIN",
    },
  });

  // Trigger post-mortem generation async (fire-and-forget)
  if (process.env.ENABLE_SRE_ENGINEER === "true") {
    const { generatePostMortem } = await import("@/lib/agents/sre-engineer");
    generatePostMortem(
      params.id,
      resolution ?? "",
      now.getTime() - new Date(incident.detectedAt).getTime(),
    ).catch(console.error);
  }

  return NextResponse.json({ ok: true });
}
