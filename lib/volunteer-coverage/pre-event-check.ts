// lib/volunteer-coverage/pre-event-check.ts
// Mechanism 3: Pre-Event Coverage Check
// 48h before event: contact all unconfirmed volunteers.
// No response in 6h → triggers cascade.

import { db } from "@/lib/db";

const CONFIRMATION_WINDOW_HOURS = 6;

/** Run the 48-hour pre-event confirmation sweep (cron: every hour). */
export async function runPreEventCheck(churchId: string): Promise<void> {
  if (process.env.ENABLE_VOLUNTEER_COVERAGE !== "true") return;

  const now = new Date();
  // Target events that start in the 42–54 hour window around the 48h mark
  const windowStart = new Date(now.getTime() + 42 * 60 * 60 * 1000);
  const windowEnd = new Date(now.getTime() + 54 * 60 * 60 * 1000);

  const upcomingEvents = await db.events.findMany({
    where: {
      churchId,
      startDate: { gte: windowStart, lte: windowEnd },
    },
    select: { id: true, title: true, startDate: true },
  });

  for (const event of upcomingEvents) {
    const coverageSlots = await db.event_coverage_status.findMany({
      where: {
        eventId: event.id,
        status: { in: ["UNCONFIRMED", "UNPROTECTED"] },
        contactAttempts: 0, // Not yet contacted for this event
      },
      select: {
        id: true,
        volunteerId: true,
        role: true,
        contactAttempts: true,
      },
    });

    for (const slot of coverageSlots) {
      const volunteer = await db.volunteers.findUnique({
        where: { id: slot.volunteerId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
        },
      });

      if (!volunteer?.phone) continue;

      const eventDateLabel = new Date(event.startDate).toLocaleDateString(
        "es-CO",
        { weekday: "long", day: "numeric", month: "long" }
      );

      const message =
        `Hola ${volunteer.firstName}\n\n` +
        `Queremos confirmar tu participación como *${slot.role}* ` +
        `el *${eventDateLabel}*.\n\n` +
        `Por favor responde:\n` +
        `SI — Confirmo que estaré\n` +
        `NO — No podré asistir\n\n` +
        `Tu respuesta nos ayuda a asegurarnos de que todo esté cubierto. Gracias.`;

      // Send WhatsApp notification
      await sendWhatsApp(volunteer.phone, message);

      // Log the contact attempt (id auto-generated via @default(cuid()))
      await db.coverage_contact_log.create({
        data: {
          churchId,
          coverageStatusId: slot.id,
          contactedVolunteerId: slot.volunteerId,
          channel: "WHATSAPP",
          messageBody: message,
          sentAt: now,
        },
      });

      // Increment contact counter on the coverage slot
      await db.event_coverage_status.update({
        where: { id: slot.id },
        data: {
          lastContactedAt: now,
          contactAttempts: { increment: 1 },
        },
      });
    }
  }
}

/**
 * Check for non-responses after the confirmation window.
 * Called by the same cron that runs runPreEventCheck — runs every hour.
 */
export async function checkConfirmationResponses(
  churchId: string
): Promise<void> {
  if (process.env.ENABLE_VOLUNTEER_COVERAGE !== "true") return;

  const now = new Date();
  const windowCutoff = new Date(
    now.getTime() - CONFIRMATION_WINDOW_HOURS * 60 * 60 * 1000
  );

  // 1. Find all contact logs sent before the cutoff with no response
  const timedOutLogs = await db.coverage_contact_log.findMany({
    where: {
      churchId,
      sentAt: { lte: windowCutoff },
      responseReceived: false,
    },
    select: { id: true, coverageStatusId: true },
    distinct: ["coverageStatusId"],
  });

  if (timedOutLogs.length === 0) return;

  // 2. Fetch coverage status records and filter to still-unconfirmed ones
  const coverageStatusIds = timedOutLogs.map((l) => l.coverageStatusId);

  const pendingSlots = await db.event_coverage_status.findMany({
    where: {
      id: { in: coverageStatusIds },
      status: { in: ["UNCONFIRMED", "UNPROTECTED"] },
    },
    select: { id: true },
  });

  if (pendingSlots.length === 0) return;

  // 3. Trigger cascade for each non-responder (lazy import avoids circular dependency)
  const { triggerCoverageCascade } = await import(
    "./cascade-contact-system"
  );

  for (const slot of pendingSlots) {
    await triggerCoverageCascade(
      churchId,
      slot.id,
      "NO_RESPONSE_TO_CONFIRMATION"
    );
  }
}

async function sendWhatsApp(phone: string, message: string): Promise<void> {
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneId || !token) {
    console.warn("[PRE_EVENT_CHECK] WhatsApp not configured — skipping send");
    return;
  }

  await fetch(
    `https://graph.facebook.com/v18.0/${phoneId}/messages`,
    {
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
    }
  );
}
