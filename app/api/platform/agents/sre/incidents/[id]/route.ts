// app/api/platform/agents/sre/incidents/[id]/route.ts
// Agent 14 — GET single incident with full timeline
// SUPER_ADMIN only

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const incident = await db.platform_incidents.findUnique({
    where: { id: params.id },
    include: {
      timeline: { orderBy: { createdAt: "asc" } },
      alerts: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!incident) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ incident });
}
