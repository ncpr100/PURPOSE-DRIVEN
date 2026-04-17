// app/api/reports/board-report/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateBoardReport } from "@/lib/church-health-synthesizer";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.churchId || session.user.role !== "PASTOR") {
    return NextResponse.json(
      { error: "Solo pastores pueden ver el informe de consejo" },
      { status: 403 },
    );
  }

  const now = new Date();
  const reportMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const report = await db.church_board_reports.findUnique({
    where: {
      churchId_reportMonth: {
        churchId: session.user.churchId,
        reportMonth,
      },
    },
  });

  return NextResponse.json({ report });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.churchId || session.user.role !== "PASTOR") {
    return NextResponse.json(
      { error: "Solo pastores pueden generar el informe de consejo" },
      { status: 403 },
    );
  }

  try {
    const result = await generateBoardReport(session.user.churchId);
    return NextResponse.json({ result });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
