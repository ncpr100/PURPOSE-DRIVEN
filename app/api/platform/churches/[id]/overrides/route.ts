import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { invalidateAgentCache } from "@/lib/agents/agent-precedence";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }
    const { id: churchId } = await params;
    const overrides = await db.church_agent_overrides.findMany({
      where: { churchId },
      include: { church: { select: { name: true } } },
      orderBy: { createdAt: "desc" }
    });
    const enrichedOverrides = await Promise.all(
      overrides.map(async (override) => {
        const agent = await db.agent_settings.findUnique({
          where: { agentId: override.agentId },
          select: { agentName: true }
        });
        return { ...override, agentName: agent?.agentName || `Agent ${override.agentId}` };
      })
    );
    return NextResponse.json({ overrides: enrichedOverrides, success: true });
  } catch (error: any) {
    console.error("[API Church Overrides GET] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }
    const { id: churchId } = await params;
    const body = await request.json();
    const { agentId, isEnabled, reason } = body;
    if (typeof agentId !== "number" || typeof isEnabled !== "boolean") {
      return NextResponse.json({ error: "agentId debe ser numero, isEnabled debe ser boolean" }, { status: 400 });
    }
    const agent = await db.agent_settings.findUnique({ where: { agentId }, select: { agentName: true } });
    if (!agent) return NextResponse.json({ error: `Agente ${agentId} no existe` }, { status: 404 });
    const church = await db.churches.findUnique({ where: { id: churchId }, select: { name: true } });
    if (!church) return NextResponse.json({ error: "Iglesia no encontrada" }, { status: 404 });
    const existing = await db.church_agent_overrides.findFirst({ where: { churchId, agentId } });
    if (existing) {
      return NextResponse.json({ error: "Ya existe override para este agente", existingOverride: existing }, { status: 409 });
    }
    const override = await db.church_agent_overrides.create({
      data: { churchId, agentId, isEnabled, reason: reason || null, createdBy: session.user.id }
    });
    await invalidateAgentCache(churchId);
    console.log(`[API Church Overrides POST] Override creado: Iglesia ${churchId}, Agente ${agentId} = ${isEnabled ? "ENABLED" : "DISABLED"}`);
    return NextResponse.json({ override, agentName: agent.agentName, churchName: church.name, success: true });
  } catch (error: any) {
    console.error("[API Church Overrides POST] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
