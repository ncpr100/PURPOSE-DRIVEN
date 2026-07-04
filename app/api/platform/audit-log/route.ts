// app/api/platform/audit-log/route.ts
// GET /api/platform/audit-log — Returns paginated admin audit log entries.
// SUPER_ADMIN only.

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "25"));
    const action = searchParams.get("action") ?? undefined;

    const where = {
      ...(action && { action: { contains: action } }),
    };

    const [entries, total] = await Promise.all([
      db.admin_audit_log.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.admin_audit_log.count({ where }),
    ]);

    // Enrich with user display names
    const userIds = [...new Set(entries.map((e) => e.userId))];
    const users = await db.users.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    });
    const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

    const enriched = entries.map((e) => ({
      ...e,
      actor: userMap[e.userId] ?? { id: e.userId, name: "Unknown", email: "" },
    }));

    return NextResponse.json({
      entries: enriched,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[API/audit-log] Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
