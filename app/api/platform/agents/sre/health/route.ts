// app/api/platform/agents/sre/health/route.ts
// Agent 14 — GET latest health check results for all services
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

  const checks = await db.$queryRaw<Array<{
    id: string;
    service: string;
    status: string;
    responseTimeMs: number | null;
    errorMessage: string | null;
    metadata: unknown;
    checkedAt: Date;
  }>>`
    SELECT DISTINCT ON (service)
      id, service, status, "responseTimeMs", "errorMessage", metadata, "checkedAt"
    FROM platform_health_checks
    ORDER BY service, "checkedAt" DESC
  `;

  return NextResponse.json({ checks });
}
