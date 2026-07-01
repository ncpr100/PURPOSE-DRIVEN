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
    console.log(
      "[API Agents List] Returning agents:",
      agents.map((a) => ({
        id: a.agentId,
        name: a.agentName,
        enabled: a.isEnabled,
      })),
    );
    return NextResponse.json(
      { agents, success: true },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error: any) {
    console.error("[API Agents List] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
