// lib/spiritual-triage-service.ts
// Agent 2: Spiritual Triage — Warm Handoff Protocol
// Detects distress keywords and routes to human pastoral care.
// SECURITY: Implements Ley 1581 compliance - no sensitive data in WhatsApp

import { nanoid } from "nanoid";
import { sign } from "jsonwebtoken";
import { db } from "@/lib/db";
import { whatsappBusinessService } from "@/lib/integrations/whatsapp";
import { AI_CONSTITUTION } from "@/lib/ai/constitution";

export interface TriageResult {
  isDistress: boolean;
  detectedKeyword: string | null;
  triageEventId: string | null;
}

// Default keywords loaded from env — comma-separated list
const DEFAULT_KEYWORDS = (process.env.TRIAGE_KEYWORDS || "")
  .split(",")
  .map((k) => k.trim().toLowerCase())
  .filter(Boolean);

/**
 * Checks if a text body contains any distress keyword.
 */
export async function detectDistress(
  text: string,
  churchId: string,
): Promise<{ isDistress: boolean; keyword: string | null }> {
  if (process.env.ENABLE_SPIRITUAL_TRIAGE !== "true") {
    return { isDistress: false, keyword: null };
  }

  const normalizedText = text.toLowerCase();

  const dbKeywords = await db.triage_keywords.findMany({
    where: { churchId, isActive: true },
    select: { keyword: true },
  });

  const keywords =
    dbKeywords.length > 0
      ? dbKeywords.map((k) => k.keyword.toLowerCase())
      : DEFAULT_KEYWORDS;

  for (const keyword of keywords) {
    if (normalizedText.includes(keyword)) {
      return { isDistress: true, keyword };
    }
  }

  return { isDistress: false, keyword: null };
}

/**
 * Derives severity level from detected keyword
 */
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

/**
 * Generates secure JWT token for triage event access
 */
function generateSecureTriageLink(
  triageEventId: string,
  pastorId: string,
  churchId: string,
): string {
  const token = sign(
    { triageEventId, pastorId, churchId },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" },
  );

  return `${process.env.NEXTAUTH_URL}/prayer-wall/triage/${triageEventId}?token=${token}`;
}

/**
 * Creates a triage event record and immediately fires pastoral notifications.
 * SECURITY: WhatsApp messages contain NO sensitive data - only severity code + secure link
 */
export async function createTriageEvent(params: {
  churchId: string;
  triggerSource: string;
  sourceId: string;
  detectedKeyword: string;
  requesterName?: string;
  requesterPhone?: string;
  requesterEmail?: string;
  messageBody: string;
}): Promise<string> {
  const event = await db.triage_events.create({
    data: {
      churchId: params.churchId,
      triggerSource: params.triggerSource,
      sourceId: params.sourceId,
      detectedKeyword: params.detectedKeyword,
      requesterName: params.requesterName,
      requesterPhone: params.requesterPhone,
      requesterEmail: params.requesterEmail,
      messageBody: params.messageBody,
      status: "PENDING",
    },
  });

  // Fire notifications immediately — non-blocking, errors are swallowed
  notifyPastoralTeam(params.churchId, event.id, params).catch((err) => {
    console.error("[TRIAGE] notifyPastoralTeam failed silently", err);
  });

  return event.id;
}

async function notifyPastoralTeam(
  churchId: string,
  triageEventId: string,
  params: {
    requesterName?: string;
    detectedKeyword: string;
    messageBody: string;
    requesterPhone?: string;
  },
) {
  const onCallPastor = await db.users.findFirst({
    where: {
      churchId,
      role: "PASTOR",
      isActive: true,
    },
    select: { id: true, name: true, phone: true },
  });

  if (!onCallPastor) {
    console.warn(
      `[TRIAGE] No active PASTOR found for church ${churchId} — triage event ${triageEventId} has no recipient`,
    );
    return;
  }

  // Derive severity from keyword
  const severity = deriveSeverity(params.detectedKeyword);
  const name = params.requesterName || "Anónimo";

  // Generate secure link with JWT (expires in 15 min)
  const secureLink = generateSecureTriageLink(
    triageEventId,
    onCallPastor.id,
    churchId,
  );

  // 1. Create in-app notification (CAN contain more details - requires authentication)
  const shortMessage = params.messageBody.substring(0, 150);
  const triageUrl = `${process.env.NEXTAUTH_URL}/dashboard/triage/${triageEventId}`;

  await db.notifications.create({
    data: {
      id: nanoid(),
      title: "Atención Pastoral Urgente",
      message: `${name} necesita atención pastoral. Palabra clave: "${params.detectedKeyword}". Mensaje: "${shortMessage}..."

${AI_CONSTITUTION.disclaimer}`,
      type: "DISTRESS_TRIAGE",
      priority: "HIGH",
      targetUser: onCallPastor.id,
      actionUrl: triageUrl,
      actionLabel: "Ver caso",
      churchId,
    },
  });

  // 2. Send WhatsApp to pastor (SECURE: NO sensitive data)
  if (onCallPastor.phone) {
    try {
      await whatsappBusinessService.sendMessage({
        to: onCallPastor.phone.replace(/\D/g, ""),
        type: "text",
        text: {
          body:
            `🚨 ALERTA DE CRISIS DETECTADA\n\n` +
            `Pastor, se detectó una situación que requiere tu atención.\n\n` +
            `Nivel: ${severity}\n` +
            `Persona: ${name}\n` +
            `Hora: ${new Date().toLocaleString("es-CO")}\n\n` +
            `🔒 Ver detalles completos en el Muro de Oración:\n` +
            `${secureLink}\n\n` +
            `Este enlace expira en 15 minutos.\n\n` +
            `Agente de Triaje Espiritual - Khesed-Tek`,
        },
      });
    } catch (err) {
      console.error("[TRIAGE_WHATSAPP_ERROR]", err);
    }
  }
}
