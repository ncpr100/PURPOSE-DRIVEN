import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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
      return NextResponse.json(
        { error: "isEnabled debe ser boolean" },
        { status: 400 },
      );
    }
    // Capture current state before update for audit delta
    const previous = await db.agent_settings.findUnique({
      where: { agentId },
      select: { isEnabled: true },
    });
    const updated = await db.agent_settings.update({
      where: { agentId },
      data: { isEnabled },
    });
    // G05: Admin audit log — record every agent toggle by SUPER_ADMIN
    await db.admin_audit_log.create({
      data: {
        userId: session.user.id,
        action: "agent.toggle",
        target: `agent:${agentId}`,
        oldValue: { isEnabled: previous?.isEnabled ?? null },
        newValue: { isEnabled },
        ipAddress:
          request.headers.get("x-forwarded-for") ??
          request.headers.get("x-real-ip") ??
          "unknown",
        userAgent: request.headers.get("user-agent") ?? undefined,
      },
    });
    revalidatePath("/platform/agents/settings");
    console.log(
      `[API Agents Toggle] Agente ${agentId} ${isEnabled ? "activado" : "desactivado"}`,
    );
    return NextResponse.json({ agent: updated, success: true });
  } catch (error: any) {
    console.error("[API Agents Toggle] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
