// app/api/small-groups/health-scores/route.ts
// Agent 10: Small Group Health Monitor — HTTP endpoints

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { scoreAllSmallGroups } from "@/lib/small-group-health-monitor";

export const dynamic = "force-dynamic";

// GET — return current health scores for all small groups
export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (
    !session?.user?.churchId ||
    !["PASTOR", "ADMIN_IGLESIA"].includes(session.user.role)
  ) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const scores = await scoreAllSmallGroups(session.user.churchId);
  return NextResponse.json({ scores, count: scores.length });
}

// POST — manually trigger a re-score
export async function POST(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.churchId || session.user.role !== "PASTOR") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const scores = await scoreAllSmallGroups(session.user.churchId);
  return NextResponse.json({ scores, count: scores.length });
}
