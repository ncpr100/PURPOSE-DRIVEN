import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { analyzeSermon } from "@/lib/sermon-antiphony-engine";

export const dynamic = "force-dynamic";

export async function POST(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (session.user.role !== "PASTOR") {
    return NextResponse.json(
      { error: "Solo pastores pueden usar esta función." },
      { status: 403 },
    );
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
    const sermon = await db.sermons.findFirst({
      where: {
        id: sermonId,
        churchId,
      },
      select: {
        id: true,
        churchId: true,
        title: true,
        content: true,
        outline: true,
      },
    });

    if (!sermon) {
      return NextResponse.json(
        { error: "Sermón no encontrado" },
        { status: 404 },
      );
    }

    const existing = await db.sermon_ai_analysis.findUnique({
      where: { sermonId },
    });

    if (existing) {
      return NextResponse.json({ analysis: existing, cached: true });
    }

    const sermonText = sermon.content || sermon.outline || sermon.title;
    if (!sermonText || sermonText.trim().length < 100) {
      return NextResponse.json(
        {
          error:
            "El sermón necesita más texto para el análisis. Agregue la transcripción o el contenido completo.",
        },
        { status: 400 },
      );
    }

    const church = await db.churches.findUnique({
      where: { id: churchId },
      select: { country: true },
    });

    const analysis = await analyzeSermon(
      sermonText,
      church?.country || "Colombia",
    );

    const saved = await db.sermon_ai_analysis.create({
      data: {
        churchId,
        sermonId,
        culturalMirror: analysis.culturalMirror,
        skepticFilter: analysis.skepticFilter,
        unresolvedTension: analysis.unresolvedTension,
        comfortSentence: analysis.comfortSentence,
        discomfortSentence: analysis.discomfortSentence,
      },
    });

    return NextResponse.json({ analysis: saved, cached: false });
  } catch (error) {
    console.error("[ANTIPHONY_ANALYSIS_ERROR]", error);
    return NextResponse.json(
      { error: "Error al analizar el sermón. Intente de nuevo." },
      { status: 500 },
    );
  }
}

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.churchId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const sermon = await db.sermons.findFirst({
    where: {
      id: params.id,
      churchId: session.user.churchId,
    },
    select: { id: true },
  });

  if (!sermon) {
    return NextResponse.json(
      { error: "Sermón no encontrado" },
      { status: 404 },
    );
  }

  const analysis = await db.sermon_ai_analysis.findUnique({
    where: { sermonId: params.id },
  });

  return NextResponse.json({ analysis: analysis || null });
}
