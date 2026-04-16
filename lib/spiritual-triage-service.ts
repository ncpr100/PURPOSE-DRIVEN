// lib/spiritual-triage-service.ts
// Agent 2: Spiritual Triage — Warm Handoff Protocol
// Detects distress keywords and routes to human pastoral care.

import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import { whatsappBusinessService } from "@/lib/integrations/whatsapp";
import { AI_CONSTITUTION } from "@/lib/ai-constitution";

export interface TriageResult {
  isDistress: boolean;
  detectedKeyword: string | null;
  triageEventId: string | null;
}

// Default keywords loaded from env — comma-separated list
// e.g. TRIAGE_KEYWORDS="suicidio,me quiero morir,no quiero vivir,crisis,abuso"
const DEFAULT_KEYWORDS = (process.env.TRIAGE_KEYWORDS || "")
  .split(",")
  .map((k) => k.trim().toLowerCase())
  .filter(Boolean);

/**
 * Checks if a text body contains any distress keyword.
 * Uses church-specific keywords from DB when available,
 * falling back to the DEFAULT_KEYWORDS env list.
 */
export async function detectDistress(
  text: string,
  churchId: string
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
 * Creates a triage event record and immediately fires pastoral notifications.
 * Returns the new triage event ID.
 *
 * NOTE: The 30-minute fallback message to the requester (if no human responds)
 * is handled by the cron job at /api/cron/triage-followup, which queries
 * triage_events WHERE status = PENDING AND createdAt < (now - 30 min).
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
  }
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
      `[TRIAGE] No active PASTOR found for church ${churchId} — triage event ${triageEventId} has no recipient`
    );
    return;
  }

  const shortMessage = params.messageBody.substring(0, 150);
  const name = params.requesterName || "Anónimo";
  const triageUrl = `${process.env.NEXTAUTH_URL}/dashboard/triage/${triageEventId}`;

  // 1. Create in-app notification (always)
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

  // 2. Send WhatsApp to pastor (if phone is configured and ENABLE_WHATSAPP is true)
  if (onCallPastor.phone) {
    try {
      await whatsappBusinessService.sendMessage({
        to: onCallPastor.phone.replace(/\D/g, ""), // strip non-digits
        type: "text",
        text: {
          body:
            `*ATENCIÓN PASTORAL URGENTE*\n\n` +
            `Persona: ${name}\n` +
            `Palabra clave detectada: "${params.detectedKeyword}"\n` +
            `Mensaje: "${shortMessage}"\n\n` +
            `Por favor responda en los próximos 30 minutos.\n` +
            `Ver en el sistema: ${triageUrl}`,
        },
      });
    } catch (err) {
      console.error("[TRIAGE_WHATSAPP_ERROR]", err);
    }
  }
}
