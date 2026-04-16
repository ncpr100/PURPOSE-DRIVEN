import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const ALLOWED_STATUSES = [
  "PENDING",
  "ASSIGNED",
  "HUMAN_RESPONDED",
  "RESOLVED",
  "ESCALATED",
] as const;

type TriageStatus = (typeof ALLOWED_STATUSES)[number];

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session?.user?.churchId ||
      !["PASTOR", "ADMIN_IGLESIA"].includes(session.user.role)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await props.params;
    const body = await request.json();
    const { status } = body as { status?: string };

    if (!status || !ALLOWED_STATUSES.includes(status as TriageStatus)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await db.triage_events.findFirst({
      where: { id, churchId: session.user.churchId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Triage event not found" },
        { status: 404 }
      );
    }

    const updated = await db.triage_events.update({
      where: { id },
      data: {
        status: status as TriageStatus,
        ...(status === "HUMAN_RESPONDED" && {
          humanRespondedAt: new Date(),
        }),
        ...(status === "RESOLVED" && {
          resolvedAt: new Date(),
        }),
      },
    });

    return NextResponse.json({ data: updated, success: true });
  } catch (error) {
    console.error("PATCH /api/triage/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
