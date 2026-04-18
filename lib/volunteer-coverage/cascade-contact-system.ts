// lib/volunteer-coverage/cascade-contact-system.ts
// Mechanism 4: Cascade Contact System
// Contacts backup roster in priority order until someone confirms.

import { db } from "@/lib/db";

const CASCADE_WAIT_MINUTES = 30;

export async function triggerCoverageCascade(
  churchId: string,
  coverageStatusId: string,
  reason: string,
): Promise<void> {
  if (process.env.ENABLE_VOLUNTEER_COVERAGE !== "true") return;

  const coverageStatus = await db.event_coverage_status.findUnique({
    where: { id: coverageStatusId },
  });

  if (!coverageStatus) return;
  if (["COVERED", "CONFIRMED"].includes(coverageStatus.status)) return;

  await db.event_coverage_status.update({
    where: { id: coverageStatusId },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
      cancelReason: reason,
    },
  });

  const backupRoster = await db.volunteer_backup_rosters.findMany({
    where: {
      churchId,
      primaryVolunteerId: coverageStatus.volunteerId,
      isActive: true,
    },
    orderBy: { priorityOrder: "asc" },
    select: { backupVolunteerId: true, priorityOrder: true },
  });

  if (backupRoster.length === 0) {
    await triggerEmergencySubstitution(churchId, coverageStatusId);
    return;
  }

  const event = coverageStatus.eventId
    ? await db.events.findUnique({
        where: { id: coverageStatus.eventId },
        select: { title: true, startDate: true },
      })
    : null;

  const eventDateLabel = event
    ? new Date(event.startDate).toLocaleDateString("es-CO", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "próximo evento";

  await contactNextBackup(
    churchId,
    coverageStatusId,
    backupRoster,
    0,
    coverageStatus.role,
    eventDateLabel,
    event?.title ?? "Servicio",
  );
}

export async function contactNextBackup(
  churchId: string,
  coverageStatusId: string,
  backupRoster: Array<{ backupVolunteerId: string; priorityOrder: number }>,
  currentIndex: number,
  role: string,
  eventDate: string,
  eventTitle: string,
): Promise<void> {
  if (currentIndex >= backupRoster.length) {
    await triggerEmergencySubstitution(churchId, coverageStatusId);
    return;
  }

  const backup = backupRoster[currentIndex];
  const volunteer = await db.volunteers.findUnique({
    where: { id: backup.backupVolunteerId },
    select: { id: true, firstName: true, lastName: true, phone: true },
  });

  if (!volunteer?.phone) {
    // No phone — skip to next backup immediately
    await contactNextBackup(
      churchId,
      coverageStatusId,
      backupRoster,
      currentIndex + 1,
      role,
      eventDate,
      eventTitle,
    );
    return;
  }

  const message =
    `Hola ${volunteer.firstName}\n\n` +
    `Necesitamos tu ayuda. Uno de nuestros voluntarios para *${role}* ` +
    `en *${eventTitle}* (${eventDate}) no podrá asistir.\n\n` +
    `¿Podrías cubrirlo?\n\n` +
    `SI — Para confirmar\n` +
    `NO — Si no puedes\n\n` +
    `Tienes 30 minutos para responder. ¡Gracias por tu servicio!`;

  await sendWhatsAppMessage(volunteer.phone, message);

  await db.coverage_contact_log.create({
    data: {
      churchId,
      coverageStatusId,
      contactedVolunteerId: backup.backupVolunteerId,
      channel: "WHATSAPP",
      messageBody: message,
      sentAt: new Date(),
    },
  });

  await db.event_coverage_status.update({
    where: { id: coverageStatusId },
    data: {
      lastContactedAt: new Date(),
      contactAttempts: { increment: 1 },
    },
  });

  console.log(
    `[CASCADE] Contacted backup #${currentIndex + 1} for slot ${coverageStatusId}`,
  );
}

// Called by cron every 5 min — advances the cascade if no response after 30 min.
export async function advanceCascade(churchId: string): Promise<void> {
  const cutoff = new Date(Date.now() - CASCADE_WAIT_MINUTES * 60 * 1000);

  const waitingSlots = await db.event_coverage_status.findMany({
    where: {
      churchId,
      status: "CANCELLED",
      lastContactedAt: { lte: cutoff },
      coveredById: null,
    },
    select: {
      id: true,
      volunteerId: true,
      role: true,
      eventId: true,
      contactAttempts: true,
    },
  });

  for (const slot of waitingSlots) {
    const lastContact = await db.coverage_contact_log.findFirst({
      where: { coverageStatusId: slot.id },
      orderBy: { sentAt: "desc" },
    });

    if (!lastContact || lastContact.responseReceived) continue;

    await db.coverage_contact_log.update({
      where: { id: lastContact.id },
      data: { responseType: "NO_RESPONSE" },
    });

    const backupRoster = await db.volunteer_backup_rosters.findMany({
      where: {
        churchId,
        primaryVolunteerId: slot.volunteerId,
        isActive: true,
      },
      orderBy: { priorityOrder: "asc" },
      select: { backupVolunteerId: true, priorityOrder: true },
    });

    const event = slot.eventId
      ? await db.events.findUnique({
          where: { id: slot.eventId },
          select: { title: true, startDate: true },
        })
      : null;

    const eventDateLabel = event
      ? new Date(event.startDate).toLocaleDateString("es-CO")
      : "";

    // contactAttempts tracks how many backups we've already tried
    await contactNextBackup(
      churchId,
      slot.id,
      backupRoster,
      slot.contactAttempts,
      slot.role,
      eventDateLabel,
      event?.title ?? "Servicio",
    );
  }
}

async function triggerEmergencySubstitution(
  churchId: string,
  coverageStatusId: string,
): Promise<void> {
  const { runEmergencySubstitution } =
    await import("./emergency-skills-substitution");
  await runEmergencySubstitution(churchId, coverageStatusId);
}

async function sendWhatsAppMessage(
  phone: string,
  message: string,
): Promise<void> {
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!phoneId || !token) {
    console.warn("[CASCADE] WhatsApp not configured — skipping send");
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
