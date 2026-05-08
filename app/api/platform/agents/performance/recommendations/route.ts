// app/api/platform/agents/performance/recommendations/route.ts
// Agent 13 — GET active performance recommendations
// SUPER_ADMIN only

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const recommendations = await db.performance_recommendations.findMany({
    where: {
      isActioned: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: [{ impact: "asc" }, { generatedAt: "desc" }],
    take: 20,
  });

  return NextResponse.json({ recommendations });
}
