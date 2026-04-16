// POST /api/shepherds-log/contact
// Logs a pastoral contact for a member and removes them from the active log.

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";

export const dynamic = "force-dynamic";

const ALLOWED_METHODS = ["call", "whatsapp", "visit", "email"] as const;
type ContactMethod = (typeof ALLOWED_METHODS)[number];

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!["PASTOR", "ADMIN_IGLESIA"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Acceso restringido" }, { status: 403 });
  }

  if (!session.user.churchId || !session.user.id) {
    return NextResponse.json(
      { error: "Usuario sin iglesia asignada." },
      { status: 403 },
    );
  }

  const body = await request.json();
  const { memberId, method } = body as {
    memberId?: string;
    method?: string;
  };

  if (!memberId || !method) {
    return NextResponse.json(
      { error: "memberId y method son requeridos." },
      { status: 400 },
    );
  }

  if (!ALLOWED_METHODS.includes(method as ContactMethod)) {
    return NextResponse.json(
      { error: `method debe ser uno de: ${ALLOWED_METHODS.join(", ")}` },
      { status: 400 },
    );
  }

  const churchId = session.user.churchId;

  try {
    // Verify the member belongs to this church
    const member = await db.members.findFirst({
      where: { id: memberId, churchId },
      select: { id: true },
    });

    if (!member) {
      return NextResponse.json(
        { error: "Miembro no encontrado." },
        { status: 404 },
      );
    }

    await db.pastoral_contacts.create({
      data: {
        id: nanoid(),
        churchId,
        memberId,
        contactedBy: session.user.id,
        method,
        contactedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/shepherds-log/contact error:", err);
    return NextResponse.json(
      { error: "Error al registrar el contacto." },
      { status: 500 },
    );
  }
}
