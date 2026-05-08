// app/api/platform/agents/sre/incidents/route.ts
// Agent 14 — GET incident list with pagination
// SUPER_ADMIN only

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const status = url.searchParams.get("status");

  const where = status ? { status: status as string } : undefined;

  const incidents = await db.platform_incidents.findMany({
    where: where as never,
    orderBy: { detectedAt: "desc" },
    take: limit,
    include: {
      timeline: { orderBy: { createdAt: "asc" }, take: 5 },
    },
  });

  return NextResponse.json({ incidents });
}
