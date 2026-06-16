import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const agents = await db.agent_settings.findMany({
      orderBy: { agentId: "asc" },
    });

    return NextResponse.json({ agents, success: true });
  } catch (error: any) {
    console.error("[API Agents List] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
