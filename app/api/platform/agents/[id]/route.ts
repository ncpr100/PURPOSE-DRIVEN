import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }
    // Next.js 16: params es una Promise, debe ser esperada
    const { id } = await params;
    const agentId = parseInt(id);
    const body = await request.json();
    const { isEnabled } = body;
    if (typeof isEnabled !== "boolean") {
      return NextResponse.json({ error: "isEnabled debe ser boolean" }, { status: 400 });
    }
    const updated = await db.agent_settings.update({
      where: { agentId },
      data: { isEnabled },
    });
    console.log(`[API Agents Toggle] Agente ${agentId} ${isEnabled ? "activado" : "desactivado"}`);
    return NextResponse.json({ agent: updated, success: true });
  } catch (error: any) {
    console.error("[API Agents Toggle] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}