// app/api/platform/agents/sre/sla/route.ts
// Agent 14 — GET SLA records
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

  const records = await db.platform_sla_records.findMany({
    orderBy: [{ month: "desc" }, { tier: "asc" }],
    take: 24,
  });

  return NextResponse.json({ records });
}
