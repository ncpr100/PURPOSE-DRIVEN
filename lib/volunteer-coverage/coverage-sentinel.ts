// lib/volunteer-coverage/coverage-sentinel.ts
// Mechanism 2: Coverage Sentinel
// Daily scan of upcoming events — finds unprotected slots before they become emergencies.

import { db } from "@/lib/db";
import { nanoid } from "nanoid";

export interface SentinelReport {
  totalSlots: number;
  confirmedSlots: number;
  unconfirmedSlots: number;
  noBackupSlots: number;
  unprotectedSlots: number;
  flaggedSlots: Array<{
    eventId: string;
    eventTitle: string;
    eventDate: string;
    volunteerName: string;
    role: string;
    issue: string;
  }>;
}

export async function runCoverageSentinel(
  churchId: string
): Promise<SentinelReport> {
  if (process.env.ENABLE_VOLUNTEER_COVERAGE !== "true") {
    return {
      totalSlots: 0,
      confirmedSlots: 0,
      unconfirmedSlots: 0,
      noBackupSlots: 0,
      unprotectedSlots: 0,
      flaggedSlots: [],
    };
  }

  const now = new Date();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const fortyEightHoursLater = new Date(
    now.getTime() + 48 * 60 * 60 * 1000
  );

  // Get all volunteer assignments for events in the next 7 days.
  // volunteer_assignments.date is the assignment date (matches startDate range).
  const assignments = await db.volunteer_assignments.findMany({
    where: {
      churchId,
      date: { gte: now, lte: sevenDaysLater },
      status: { in: ["ASIGNADO", "CONFIRMADO"] },
    },
    include: {
      volunteers: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
        },
      },
      // events relation is optional (eventId nullable)
      events: {
        select: {
          id: true,
          title: true,
          startDate: true,
        },
      },
    },
  });

  const report: SentinelReport = {
    totalSlots: assignments.length,
    confirmedSlots: 0,
    unconfirmedSlots: 0,
    noBackupSlots: 0,
    unprotectedSlots: 0,
    flaggedSlots: [],
  };

  for (const assignment of assignments) {
    const volunteerId = assignment.volunteers.id;
    // Use the linked event id if present, otherwise fall back to assignment id
    const eventId = assignment.events?.id ?? assignment.id;
    const eventTitle =
      assignment.events?.title ?? assignment.title;
    const eventDate = assignment.events?.startDate ?? assignment.date;
    const isWithin48h = eventDate <= fortyEightHoursLater;
    const volunteerName = `${assignment.volunteers.firstName} ${assignment.volunteers.lastName}`;
    // volunteer_assignments has no dedicated 'role' field — title carries that meaning
    const role = assignment.title;

    // Upsert coverage status record
    let coverageStatus = await db.event_coverage_status.findFirst({
      where: { eventId, volunteerId, role },
    });

    if (!coverageStatus) {
      coverageStatus = await db.event_coverage_status.create({
        data: {
          id: nanoid(),
          churchId,
          eventId,
          volunteerId,
          role,
          status: "UNCONFIRMED",
        },
      });
    }

    // Skip slots already covered or confirmed
    if (
      coverageStatus.status === "CONFIRMED" ||
      coverageStatus.status === "COVERED"
    ) {
      report.confirmedSlots++;
      continue;
    }

    // Check backup roster existence
    const backupRoster = await db.volunteer_backup_rosters.findMany({
      where: {
        churchId,
        primaryVolunteerId: volunteerId,
        isActive: true,
      },
      orderBy: { priorityOrder: "asc" },
    });

    if (backupRoster.length === 0) {
      // No backup assigned — slot is fully vulnerable
      report.noBackupSlots++;
      report.flaggedSlots.push({
        eventId,
        eventTitle,
        eventDate: eventDate.toLocaleDateString("es-CO"),
        volunteerName,
        role,
        issue: "Sin suplente asignado — vulnerable si cancela",
      });

      await db.event_coverage_status.update({
        where: { id: coverageStatus.id },
        data: { status: "NO_BACKUP_ASSIGNED" },
      });

      await alertPastor(
        churchId,
        `COBERTURA: ${volunteerName} (${role}) el ${eventDate.toLocaleDateString("es-CO")} no tiene suplente asignado.`
      );
    } else if (isWithin48h && coverageStatus.status === "UNCONFIRMED") {
      // Within 48 h and still unconfirmed — flag as unprotected
      report.unprotectedSlots++;
      report.flaggedSlots.push({
        eventId,
        eventTitle,
        eventDate: eventDate.toLocaleDateString("es-CO"),
        volunteerName,
        role,
        issue: "Menos de 48h — sin confirmación de asistencia",
      });

      await db.event_coverage_status.update({
        where: { id: coverageStatus.id },
        data: { status: "UNPROTECTED" },
      });
    } else {
      report.unconfirmedSlots++;
    }
  }

  return report;
}

async function alertPastor(churchId: string, message: string): Promise<void> {
  const pastors = await db.users.findMany({
    where: { churchId, role: "PASTOR", isActive: true },
    select: { id: true },
  });

  if (pastors.length === 0) return;

  await db.notifications.createMany({
    data: pastors.map((p) => ({
      id: nanoid(),
      churchId,
      targetUser: p.id,
      type: "COVERAGE_ALERT",
      title: "Alerta de Cobertura de Voluntarios",
      message,
      priority: "HIGH",
    })),
    skipDuplicates: true,
  });
}
