// app/api/leadership-pipeline/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { refreshLeadershipPipeline } from "@/lib/leadership-pipeline-service";
import { nanoid } from "nanoid";

export const dynamic = "force-dynamic";

// GET — return cached pipeline (PASTOR or ADMIN_IGLESIA)
export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (
    !session?.user?.churchId ||
    !["PASTOR", "ADMIN_IGLESIA"].includes(session.user.role)
  ) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const churchId = session.user.churchId;

  const cache = await db.leadership_pipeline_cache.findUnique({
    where: { churchId },
  });

  if (!cache || new Date() > cache.expiresAt) {
    const candidates = await refreshLeadershipPipeline(churchId);
    return NextResponse.json({ candidates, fresh: true });
  }

  return NextResponse.json({
    candidates: JSON.parse(cache.candidates as string),
    generatedAt: cache.generatedAt,
    fresh: false,
  });
}

// POST — invite a candidate into leadership (PASTOR only)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.churchId || session.user.role !== "PASTOR") {
    return NextResponse.json(
      { error: "Solo pastores pueden invitar líderes" },
      { status: 403 },
    );
  }

  const body = await req.json();
  const { memberId, role, notes } = body;

  if (!memberId || !role) {
    return NextResponse.json(
      { error: "memberId y role son requeridos" },
      { status: 400 },
    );
  }

  const churchId = session.user.churchId;
  const pastorId = session.user.id;

  const invitation = await db.leadership_invitations.create({
    data: {
      churchId,
      memberId,
      invitedBy: pastorId,
      role,
      notes,
      status: "PENDING",
    },
  });

  // Create a reminder notification for the pastor
  await db.notifications.create({
    data: {
      id: nanoid(),
      churchId,
      createdBy: pastorId,
      targetUser: pastorId,
      type: "LEADERSHIP_INVITATION_CREATED",
      title: "Invitación de liderazgo creada",
      message: `Recuerda hacer el seguimiento personal de la invitación de liderazgo para el rol: ${role}.`,
      priority: "NORMAL",
    },
  });

  return NextResponse.json({ invitation });
}
