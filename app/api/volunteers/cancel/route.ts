// app/api/volunteers/cancel/route.ts
// Handles volunteer cancellation — triggers Mechanism 4 cascade immediately.

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { triggerCoverageCascade } from "@/lib/volunteer-coverage/coverage-engine";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { assignmentId, reason } = body as {
    assignmentId?: string;
    reason?: string;
  };

  if (!assignmentId) {
    return NextResponse.json(
      { error: "assignmentId requerido" },
      { status: 400 },
    );
  }

  // volunteer_assignments.churchId is a direct field
  const assignment = await db.volunteer_assignments.findFirst({
    where: { id: assignmentId },
    include: {
      volunteers: { select: { id: true } },
      events: { select: { id: true, title: true, startDate: true } },
    },
  });

  if (!assignment) {
    return NextResponse.json(
      { error: "Asignación no encontrada" },
      { status: 404 },
    );
  }

  // Ensure the requesting user belongs to the same church
  if (assignment.churchId !== session.user.churchId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const churchId = assignment.churchId;
  const volunteerId = assignment.volunteers.id;
  // title carries the role meaning in volunteer_assignments
  const role = assignment.title;

  // Update assignment status to cancelled
  await db.volunteer_assignments.update({
    where: { id: assignmentId },
    data: { status: "CANCELADO" },
  });

  // Use the event id from the linked event if present
  const eventId = assignment.events?.id ?? assignmentId;

  // Find or create coverage status for this slot
  let coverageStatus = await db.event_coverage_status.findFirst({
    where: { eventId, volunteerId, role },
  });

  if (!coverageStatus) {
    coverageStatus = await db.event_coverage_status.create({
      data: {
        churchId,
        eventId,
        volunteerId,
        role,
        status: "CANCELLED",
        cancelledAt: new Date(),
        cancelReason: reason ?? "Cancelación vía app",
      },
    });
  } else {
    await db.event_coverage_status.update({
      where: { id: coverageStatus.id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        cancelReason: reason,
      },
    });
  }

  // Trigger Mechanism 4 cascade immediately
  await triggerCoverageCascade(
    churchId,
    coverageStatus.id,
    reason ?? "Voluntario canceló su participación",
  );

  return NextResponse.json({
    ok: true,
    message:
      "Cancelación registrada. Se está buscando un suplente automáticamente.",
  });
}
