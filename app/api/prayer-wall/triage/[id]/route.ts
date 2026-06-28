import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Función para derivar severidad del keyword detectado
function deriveSeverity(keyword: string): "CRÍTICA" | "MODERADA" | "BAJA" {
  const criticalKeywords = [
    "suicidio",
    "suicid",
    "matarme",
    "morir",
    "asesinar",
    "violencia",
    "abuso",
    "arma",
  ];
  const moderateKeywords = [
    "deprimido",
    "depresión",
    "ansiedad",
    "miedo",
    "tristeza",
    "soledad",
    "crisis",
  ];

  const keywordLower = keyword.toLowerCase();

  if (criticalKeywords.some((k) => keywordLower.includes(k))) {
    return "CRÍTICA";
  }
  if (moderateKeywords.some((k) => keywordLower.includes(k))) {
    return "MODERADA";
  }
  return "BAJA";
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token requerido" }, { status: 401 });
  }

  try {
    // 1. Verificar JWT (expira en 15 min)
    const payload = verify(token, process.env.JWT_SECRET!) as {
      triageEventId: string;
      pastorId: string;
      churchId: string;
      exp: number;
    };

    // 2. Verificar que el triage event existe
    const triageEvent = await prisma.triage_events.findUnique({
      where: { id: params.id },
    });

    if (!triageEvent) {
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 },
      );
    }

    // 3. Verificar permisos del pastor
    if (payload.triageEventId !== params.id) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    // 4. Si viene de prayer_form, buscar el prayer_request con la relación correcta
    let prayerRequestData = null;
    if (triageEvent.triggerSource === "prayer_form" && triageEvent.sourceId) {
      prayerRequestData = await prisma.prayer_requests.findUnique({
        where: { id: triageEvent.sourceId },
        include: {
          prayer_contacts: true, // ✅ Relación correcta
        },
      });
    }

    // 5. Registrar auditoría
    await prisma.triage_access_logs.create({
      data: {
        triageEventId: params.id,
        pastorId: payload.pastorId,
        accessedAt: new Date(),
        ipAddress:
          req.headers.get("x-forwarded-for") ||
          req.headers.get("x-real-ip") ||
          "unknown",
      },
    });

    // 6. Derivar severidad del keyword
    const severity = deriveSeverity(triageEvent.detectedKeyword);

    // 7. Retornar detalles completos (solo aquí se exponen)
    return NextResponse.json({
      success: true,
      data: {
        severity,
        detectedKeyword: triageEvent.detectedKeyword,
        messageBody: triageEvent.messageBody,
        prayerRequestMessage: prayerRequestData?.message || "", // ✅ Campo correcto
        triggerSource: triageEvent.triggerSource,
        sourceId: triageEvent.sourceId,
        requesterName:
          triageEvent.requesterName ||
          prayerRequestData?.prayer_contacts?.fullName ||
          "Anónimo", // ✅ Relación correcta
        requesterPhone:
          triageEvent.requesterPhone ||
          prayerRequestData?.prayer_contacts?.phone ||
          "No proporcionado",
        requesterEmail:
          triageEvent.requesterEmail ||
          prayerRequestData?.prayer_contacts?.email ||
          "No proporcionado",
        timestamp: triageEvent.createdAt,
        status: triageEvent.status,
        assignedToId: triageEvent.assignedToId,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      return NextResponse.json(
        { error: "Token expirado. Solicita un nuevo enlace." },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { error: "Token inválido o acceso denegado" },
      { status: 401 },
    );
  }
}
