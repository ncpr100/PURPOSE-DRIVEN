import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { buildBackupRosterForVolunteer } from "@/lib/volunteer-coverage/coverage-engine";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.churchId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const roster = await db.volunteer_backup_rosters.findMany({
    where: {
      churchId: session.user.churchId,
      primaryVolunteerId: id,
      isActive: true,
    },
    orderBy: { priorityOrder: "asc" },
  });
  return NextResponse.json({ roster });
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (
    !session?.user?.churchId ||
    !["PASTOR", "ADMIN_IGLESIA"].includes(session.user.role)
  ) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const suggestions = await buildBackupRosterForVolunteer(
    session.user.churchId,
    id,
  );
  return NextResponse.json({ suggestions });
}
