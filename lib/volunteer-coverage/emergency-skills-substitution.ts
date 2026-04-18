// lib/volunteer-coverage/emergency-skills-substitution.ts
// Mechanism 5: Emergency Skills Substitution
// Last resort: finds skill-matched available volunteers and alerts pastor.

import { db } from "@/lib/db";
import { nanoid } from "nanoid";

/** Handles both JSON array format '["Música","Coro"]' and comma-separated 'Música,Coro' */
function parseSkillsField(raw: string): string[] {
  if (!raw) return [];
  const trimmed = raw.trim();
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed))
        return parsed.map((s) => String(s).trim()).filter(Boolean);
    } catch {
      // fall through
    }
  }
  return trimmed
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function runEmergencySubstitution(
  churchId: string,
  coverageStatusId: string,
): Promise<void> {
  if (process.env.ENABLE_VOLUNTEER_COVERAGE !== "true") return;

  const slot = await db.event_coverage_status.findUnique({
    where: { id: coverageStatusId },
    select: {
      id: true,
      volunteerId: true,
      role: true,
      eventId: true,
      status: true,
    },
  });

  if (!slot) return;
  if (slot.status === "COVERED") return;

  // Get the skills needed from the original volunteer
  const primaryVolunteer = await db.volunteers.findUnique({
    where: { id: slot.volunteerId },
    select: { skills: true, firstName: true, lastName: true },
  });

  const requiredSkillsRaw = primaryVolunteer?.skills ?? "";
  const requiredSkills = parseSkillsField(requiredSkillsRaw);

  // Find all active volunteers in the church excluding the primary
  const candidates = await db.volunteers.findMany({
    where: {
      churchId,
      id: { not: slot.volunteerId },
      isActive: true,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phone: true,
      skills: true,
    },
  });

  // Get engagement scores for ranking
  const engagementRows = await db.volunteer_engagement_scores.findMany({
    where: { volunteerId: { in: candidates.map((c) => c.id) } },
    select: { volunteerId: true, currentScore: true },
  });
  const scoreMap = new Map(
    engagementRows.map((e) => [e.volunteerId, e.currentScore]),
  );

  // Score by skill match + engagement, pick top 3
  const scored = candidates
    .map((c) => {
      const cSkills = parseSkillsField(c.skills ?? "");
      const overlap = requiredSkills.filter((s) => cSkills.includes(s));
      const skillScore =
        requiredSkills.length > 0 ? overlap.length / requiredSkills.length : 0;
      const engagement = (scoreMap.get(c.id) ?? 50) / 100;
      const composite = skillScore * 0.6 + engagement * 0.4;
      return { ...c, overlap, composite };
    })
    .filter((c) => c.composite > 0)
    .sort((a, b) => b.composite - a.composite)
    .slice(0, 3);

  const event = slot.eventId
    ? await db.events.findUnique({
        where: { id: slot.eventId },
        select: { title: true, startDate: true },
      })
    : null;

  const eventLabel = event
    ? `${event.title} — ${new Date(event.startDate).toLocaleDateString(
        "es-CO",
        {
          weekday: "long",
          day: "numeric",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
        },
      )}`
    : "próximo evento";

  // Contact the top 3 via WhatsApp simultaneously
  for (const candidate of scored) {
    if (!candidate.phone) continue;

    const message =
      `URGENTE — Necesitamos un voluntario para *${slot.role}* ` +
      `en *${eventLabel}*.\n\n` +
      `Tu perfil de habilidades encaja perfectamente.\n` +
      `¿Puedes ayudarnos?\n\n` +
      `SI — Para confirmar\n` +
      `NO — Si no puedes\n\n` +
      `¡Gracias por considerar servir en este momento!`;

    await sendWhatsAppMessage(candidate.phone, message);

    await db.coverage_contact_log.create({
      data: {
        churchId,
        coverageStatusId,
        contactedVolunteerId: candidate.id,
        channel: "WHATSAPP",
        messageBody: message,
        sentAt: new Date(),
      },
    });
  }

  // Mark slot as UNPROTECTED (emergency contacts sent, awaiting response)
  await db.event_coverage_status.update({
    where: { id: coverageStatusId },
    data: {
      status: "UNPROTECTED",
      contactAttempts: { increment: scored.length },
      lastContactedAt: new Date(),
    },
  });

  // Notify all pastors with full coverage status
  const pastors = await db.users.findMany({
    where: { churchId, role: "PASTOR", isActive: true },
    select: { id: true },
  });

  const substituteSummary =
    scored.length > 0
      ? scored
          .map(
            (c, i) =>
              `#${i + 1} ${c.firstName} ${c.lastName} (habilidades: ${c.overlap.join(", ") || "compatibles"})`,
          )
          .join("\n")
      : "No se encontraron voluntarios disponibles con habilidades compatibles.";

  const primaryName = primaryVolunteer
    ? `${primaryVolunteer.firstName} ${primaryVolunteer.lastName}`
    : "voluntario";

  const pastoralMessage =
    `EMERGENCIA DE COBERTURA\n\n` +
    `Rol: ${slot.role}\n` +
    `Evento: ${eventLabel}\n` +
    `Voluntario original: ${primaryName}\n\n` +
    `Se agotaron todos los suplentes. Se contactaron los siguientes voluntarios por habilidades:\n${substituteSummary}\n\n` +
    `Por favor confirme manualmente si se resuelve.`;

  if (pastors.length > 0) {
    await db.notifications.createMany({
      data: pastors.map((p) => ({
        id: nanoid(),
        churchId,
        targetUser: p.id,
        type: "EMERGENCY_COVERAGE",
        title: "EMERGENCIA: Cobertura de Voluntario Sin Resolver",
        message: pastoralMessage,
        priority: "HIGH",
      })),
      skipDuplicates: true,
    });
  }

  console.log(
    `[EMERGENCY] Contacted ${scored.length} skill-matched volunteers for slot ${coverageStatusId}`,
  );
}

async function sendWhatsAppMessage(
  phone: string,
  message: string,
): Promise<void> {
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!phoneId || !token) {
    console.warn("[EMERGENCY] WhatsApp not configured — skipping send");
    return;
  }

  await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phone.replace(/\D/g, ""),
      type: "text",
      text: { body: message },
    }),
  });
}
