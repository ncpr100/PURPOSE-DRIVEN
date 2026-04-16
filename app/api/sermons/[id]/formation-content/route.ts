import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { generateFormationContent } from "@/lib/content-filter-service";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!session.user.churchId) {
    return NextResponse.json(
      { error: "Usuario sin iglesia asignada." },
      { status: 403 },
    );
  }

  const sermonId = params.id;
  const churchId = session.user.churchId;

  try {
    const content = await generateFormationContent(sermonId, churchId);
    return NextResponse.json({ content });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";

    // Feature flag disabled
    if (message === "Content Filter is not enabled.") {
      return NextResponse.json({ error: message }, { status: 503 });
    }

    // Missing antiphony analysis — actionable user error
    if (message.includes("Análisis Antifonal")) {
      return NextResponse.json({ error: message }, { status: 422 });
    }

    console.error("GET /api/sermons/[id]/formation-content error:", err);
    return NextResponse.json(
      { error: "Error al generar el contenido de formación." },
      { status: 500 },
    );
  }
}
