import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!session.user.churchId) {
    return NextResponse.json(
      { error: "Usuario sin iglesia asignada." },
      { status: 403 },
    );
  }

  if (!["PASTOR", "ADMIN_IGLESIA"].includes(session.user.role ?? "")) {
    return NextResponse.json(
      { error: "Solo pastores y administradores pueden ver el Diario del Pastor." },
      { status: 403 },
    );
  }

  const churchId = session.user.churchId;

  try {
    // Return cached log if still valid
    const cached = await db.shepherds_log_cache.findUnique({
      where: { churchId },
    });

    if (cached && cached.expiresAt > new Date()) {
      return NextResponse.json({
        members: JSON.parse(cached.members as string),
        generatedAt: cached.generatedAt,
        cached: true,
      });
    }

    // Cache expired or missing — generate fresh (triggered on-demand)
    const { refreshShepherdsLog } = await import(
      "@/lib/shepherds-log-service"
    );
    const members = await refreshShepherdsLog(churchId);

    return NextResponse.json({
      members,
      generatedAt: new Date(),
      cached: false,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    console.error("GET /api/shepherds-log error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
