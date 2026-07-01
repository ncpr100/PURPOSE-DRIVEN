import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { invalidateAgentCache } from "@/lib/agents/agent-precedence";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; overrideId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }
    const { id: churchId, overrideId } = await params;
    const body = await request.json();
    const { isEnabled, reason } = body;
    if (typeof isEnabled !== "boolean") {
      return NextResponse.json({ error: "isEnabled debe ser boolean" }, { status: 400 });
    }
    const currentOverride = await db.church_agent_overrides.findUnique({ where: { id: overrideId } });
    if (!currentOverride) return NextResponse.json({ error: "Override no encontrado" }, { status: 404 });
    if (currentOverride.churchId !== churchId) return NextResponse.json({ error: "Override no pertenece a esta iglesia" }, { status: 403 });
    const updated = await db.church_agent_overrides.update({
      where: { id: overrideId },
      data: { isEnabled, reason: reason !== undefined ? reason : currentOverride.reason }
    });
    await invalidateAgentCache(churchId);
    console.log(`[API Church Overrides PUT] Override actualizado: ${overrideId} -> ${isEnabled ? "ENABLED" : "DISABLED"}`);
    return NextResponse.json({ override: updated, success: true });
  } catch (error: any) {
    console.error("[API Church Overrides PUT] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; overrideId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }
    const { id: churchId, overrideId } = await params;
    const currentOverride = await db.church_agent_overrides.findUnique({ where: { id: overrideId } });
    if (!currentOverride) return NextResponse.json({ error: "Override no encontrado" }, { status: 404 });
    if (currentOverride.churchId !== churchId) return NextResponse.json({ error: "Override no pertenece a esta iglesia" }, { status: 403 });
    await db.church_agent_overrides.delete({ where: { id: overrideId } });
    await invalidateAgentCache(churchId);
    console.log(`[API Church Overrides DELETE] Override eliminado: ${overrideId}`);
    return NextResponse.json({ success: true, message: "Override eliminado correctamente" });
  } catch (error: any) {
    console.error("[API Church Overrides DELETE] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
