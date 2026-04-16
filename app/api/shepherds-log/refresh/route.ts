// POST /api/shepherds-log/refresh
// Forces a regeneration of the Shepherd's Log cache for the current church.

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { refreshShepherdsLog } from "@/lib/shepherds-log-service";

export const dynamic = "force-dynamic";

export async function POST(_request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!["PASTOR", "ADMIN_IGLESIA"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Acceso restringido" }, { status: 403 });
  }

  if (!session.user.churchId) {
    return NextResponse.json(
      { error: "Usuario sin iglesia asignada." },
      { status: 403 },
    );
  }

  try {
    const members = await refreshShepherdsLog(session.user.churchId);
    return NextResponse.json({ members, generatedAt: new Date() });
  } catch (err) {
    console.error("POST /api/shepherds-log/refresh error:", err);
    return NextResponse.json(
      { error: "Error al actualizar el registro del pastor." },
      { status: 500 },
    );
  }
}
