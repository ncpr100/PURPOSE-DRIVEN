import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/automation-rules/[id] - Get a specific automation rule
export async function GET(request: NextRequest, props: RouteContext) {
  const params = await props.params
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const user = await db.users.findUnique({ where: { id: session.user.id } });
    if (!user?.churchId) {
      return NextResponse.json(
        { error: "Usuario sin iglesia asignada" },
        { status: 403 },
      );
    }

    const rule = await db.automation_rules.findFirst({
      where: { id: params.id, churchId: user.churchId },
    });

    if (!rule) {
      return NextResponse.json(
        { error: "Regla no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json({ rule });
  } catch (error) {
    console.error("Error fetching automation rule:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

// PUT /api/automation-rules/[id] - Update automation rule
export async function PUT(request: NextRequest, props: RouteContext) {
  const params = await props.params
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const user = await db.users.findUnique({ where: { id: session.user.id } });
    if (!user?.churchId) {
      return NextResponse.json(
        { error: "Usuario sin iglesia asignada" },
        { status: 403 },
      );
    }

    const updateData = await request.json();

    // Verify ownership before updating
    const existing = await db.automation_rules.findFirst({
      where: { id: params.id, churchId: user.churchId },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Regla no encontrada" },
        { status: 404 },
      );
    }

    const rule = await db.automation_rules.update({
      where: { id: params.id },
      data: {
        name: updateData.name ?? existing.name,
        description: updateData.description ?? existing.description,
        isActive:
          updateData.isActive !== undefined
            ? Boolean(updateData.isActive)
            : existing.isActive,
        priorityLevel: updateData.priorityLevel ?? existing.priorityLevel,
        urgentMode24x7:
          updateData.urgentMode24x7 !== undefined
            ? Boolean(updateData.urgentMode24x7)
            : existing.urgentMode24x7,
        businessHoursOnly:
          updateData.businessHoursOnly !== undefined
            ? Boolean(updateData.businessHoursOnly)
            : existing.businessHoursOnly,
        bypassApproval:
          updateData.bypassApproval !== undefined
            ? Boolean(updateData.bypassApproval)
            : existing.bypassApproval,
        createManualTaskOnFail:
          updateData.createManualTaskOnFail !== undefined
            ? Boolean(updateData.createManualTaskOnFail)
            : existing.createManualTaskOnFail,
        escalationConfig:
          updateData.escalationConfig ?? existing.escalationConfig,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ rule, success: true });
  } catch (error) {
    console.error("Error updating automation rule:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

// DELETE /api/automation-rules/[id] - Delete automation rule
export async function DELETE(request: NextRequest, props: RouteContext) {
  const params = await props.params
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const user = await db.users.findUnique({ where: { id: session.user.id } });
    if (!user?.churchId) {
      return NextResponse.json(
        { error: "Usuario sin iglesia asignada" },
        { status: 403 },
      );
    }

    // Verify ownership before deleting
    const existing = await db.automation_rules.findFirst({
      where: { id: params.id, churchId: user.churchId },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Regla no encontrada" },
        { status: 404 },
      );
    }

    await db.automation_rules.delete({ where: { id: params.id } });

    return NextResponse.json({
      success: true,
      message: "Regla eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error deleting automation rule:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
