// lib/volunteer-coverage/coverage-engine.ts
// Volunteer Coverage Engine — Master Orchestrator
// Coordinates all 5 mechanisms into a single cohesive system.

import { db } from "@/lib/db";
import { nanoid } from "nanoid";

export { buildBackupRosterForVolunteer, buildAllBackupRosters } from "./backup-roster-builder";
export { runCoverageSentinel } from "./coverage-sentinel";
export { runPreEventCheck, checkConfirmationResponses } from "./pre-event-check";
export { triggerCoverageCascade, advanceCascade, contactNextBackup } from "./cascade-contact-system";
export { runEmergencySubstitution } from "./emergency-skills-substitution";

// Handle incoming WhatsApp YES/NO responses from volunteers
export async function handleVolunteerResponse(
  volunteerId: string,
  response: "YES" | "NO",
  coverageStatusId: string,
  churchId: string
): Promise<void> {
  // Mark all pending contact log entries for this volunteer/slot as responded
  await db.coverage_contact_log.updateMany({
    where: {
      coverageStatusId,
      contactedVolunteerId: volunteerId,
      responseReceived: false,
    },
    data: {
      responseReceived: true,
      responseAt: new Date(),
      responseType: response === "YES" ? "CONFIRMED" : "DECLINED",
    },
  });

  if (response === "YES") {
    // Mark slot as covered
    await db.event_coverage_status.update({
      where: { id: coverageStatusId },
      data: {
        status: "COVERED",
        coveredById: volunteerId,
        coverageMethod: "BACKUP_ROSTER",
        confirmedAt: new Date(),
      },
    });

    // Single fetch — used for both confirmation message and pastor notification
    const vol = await db.volunteers.findFirst({
      where: { id: volunteerId, churchId },
      select: { phone: true, firstName: true },
    });

    if (vol?.phone) {
      await sendConfirmationToVolunteer(vol.phone, vol.firstName);
    }

    // Notify pastors that coverage is resolved
    const pastors = await db.users.findMany({
      where: { churchId, role: "PASTOR", isActive: true },
      select: { id: true },
    });

    if (pastors.length > 0) {
      await db.notifications.createMany({
        data: pastors.map((p) => ({
          id: nanoid(),
          churchId,
          targetUser: p.id,
          type: "COVERAGE_RESOLVED",
          title: "Cobertura Confirmada",
          message: `${vol?.firstName ?? "Un voluntario"} confirmó la cobertura del servicio.`,
          priority: "NORMAL",
        })),
        skipDuplicates: true,
      });
    }
  } else {
    // Volunteer declined — let the cascade engine pick up the next backup
    const { advanceCascade } = await import("./cascade-contact-system");
    await advanceCascade(churchId);
  }
}

async function sendConfirmationToVolunteer(
  phone: string,
  firstName: string
): Promise<void> {
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!phoneId || !token) return;

  const message =
    `¡Gracias ${firstName}!\n\n` +
    `Tu confirmación fue registrada. ` +
    `El equipo ministerial ya fue notificado.\n\n` +
    `¡Dios bendiga tu servicio!`;

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
