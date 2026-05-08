// app/api/platform/agents/performance/recommendations/[id]/route.ts
// Agent 13 — PATCH mark a recommendation as actioned
// SUPER_ADMIN only

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.performance_recommendations.update({
    where: { id: params.id },
    data: {
      isActioned: true,
      actionedBy: session.user.id,
      actionedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
