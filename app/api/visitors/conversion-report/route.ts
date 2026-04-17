// app/api/visitors/conversion-report/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateVisitorConversionReport } from "@/lib/visitor-conversion-service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (
    !session?.user?.churchId ||
    !["PASTOR", "ADMIN_IGLESIA"].includes(session.user.role)
  ) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Return the most recent report
  const report = await db.visitor_conversion_reports.findFirst({
    where: { churchId: session.user.churchId },
    orderBy: { generatedAt: "desc" },
  });

  return NextResponse.json({ report });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (
    !session?.user?.churchId ||
    !["PASTOR", "ADMIN_IGLESIA"].includes(session.user.role)
  ) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const result = await generateVisitorConversionReport(session.user.churchId);
    return NextResponse.json({ result });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
