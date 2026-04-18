// lib/volunteer-coverage/backup-roster-builder.ts
// Mechanism 1: Backup Roster Builder
// Automatically suggests and builds backup rosters for every volunteer.

import { db } from "@/lib/db";

export interface BackupSuggestion {
  backupVolunteerId: string;
  backupName: string;
  backupPhone: string | null;
  skillOverlap: string[];
  engagementScore: number;
  priorityOrder: number;
  reason: string;
}

/** Parse a skills string (comma-separated) into a trimmed array. */
function parseSkills(raw: string | null | undefined): string[] {
  if (!raw) return [];
  // Handle JSON array format: '["Música","Coro","Piano"]'
  const trimmed = raw.trim();
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((s) => String(s).trim()).filter(Boolean);
      }
    } catch {
      // Fall through to comma-split
    }
  }
  // Handle comma-separated format: "Música,Coro,Piano"
  return trimmed.split(",").map((s) => s.trim()).filter(Boolean);
}

/** Build or refresh the backup roster for a single volunteer. */
export async function buildBackupRosterForVolunteer(
  churchId: string,
  primaryVolunteerId: string,
  ministryId?: string
): Promise<BackupSuggestion[]> {
  // 1. Get primary volunteer's skills and ministry
  const primary = await db.volunteers.findFirst({
    where: { id: primaryVolunteerId, churchId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      skills: true,
      ministryId: true,
    },
  });

  if (!primary) throw new Error("Volunteer not found");

  const requiredSkills = parseSkills(primary.skills);

  // 2. Get all OTHER active volunteers in the same church
  const candidates = await db.volunteers.findMany({
    where: {
      churchId,
      id: { not: primaryVolunteerId },
      isActive: true,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phone: true,
      skills: true,
      ministryId: true,
    },
  });

  // 3. Get engagement scores for all candidates
  const engagementRows = await db.volunteer_engagement_scores.findMany({
    where: {
      volunteerId: { in: candidates.map((c) => c.id) },
    },
    select: { volunteerId: true, currentScore: true },
  });

  const scoreMap = new Map(
    engagementRows.map((e) => [e.volunteerId, e.currentScore])
  );

  // 4. Score each candidate using Jaccard similarity + engagement + ministry bonus
  const scored = candidates
    .map((candidate) => {
      const candidateSkills = parseSkills(candidate.skills);
      const intersection = requiredSkills.filter((s) =>
        candidateSkills.includes(s)
      );
      const union = new Set([...requiredSkills, ...candidateSkills]);
      const jaccardScore =
        union.size > 0 ? intersection.length / union.size : 0;

      const engagementScore = scoreMap.get(candidate.id) ?? 50;
      const sameMinistry = candidate.ministryId === primary.ministryId ? 0.2 : 0;

      // Composite: 50% skill match + 30% engagement + 20% same ministry
      const compositeScore =
        jaccardScore * 0.5 + (engagementScore / 100) * 0.3 + sameMinistry;

      return {
        backupVolunteerId: candidate.id,
        backupName: `${candidate.firstName} ${candidate.lastName}`,
        backupPhone: candidate.phone ?? null,
        skillOverlap: intersection,
        engagementScore,
        compositeScore,
        reason: buildReason(
          intersection,
          engagementScore,
          candidate.ministryId === primary.ministryId
        ),
      };
    })
    .filter((c) => c.compositeScore > 0.1) // minimum relevance threshold
    .sort((a, b) => b.compositeScore - a.compositeScore)
    .slice(0, 3); // top 3 backups only

  // 5. Upsert into backup roster
  const suggestions: BackupSuggestion[] = [];
  for (let i = 0; i < scored.length; i++) {
    const candidate = scored[i];
    const priorityOrder = i + 1;
    const resolvedMinistryId = ministryId ?? primary.ministryId ?? "";

    await db.volunteer_backup_rosters.upsert({
      where: {
        churchId_primaryVolunteerId_backupVolunteerId_ministryId: {
          churchId,
          primaryVolunteerId,
          backupVolunteerId: candidate.backupVolunteerId,
          ministryId: resolvedMinistryId,
        },
      },
      update: {
        priorityOrder,
        skills: candidate.skillOverlap,
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        churchId,
        primaryVolunteerId,
        backupVolunteerId: candidate.backupVolunteerId,
        ministryId: resolvedMinistryId || undefined,
        priorityOrder,
        skills: candidate.skillOverlap,
        isActive: true,
      },
    });

    suggestions.push({ ...candidate, priorityOrder });
  }

  return suggestions;
}

/** Build backup rosters for ALL active volunteers in a church (run weekly). */
export async function buildAllBackupRosters(churchId: string): Promise<number> {
  const volunteers = await db.volunteers.findMany({
    where: { churchId, isActive: true },
    select: { id: true },
  });

  let built = 0;
  for (const volunteer of volunteers) {
    try {
      await buildBackupRosterForVolunteer(churchId, volunteer.id);
      built++;
    } catch (err) {
      console.error(
        `[BACKUP_ROSTER] Failed for volunteer ${volunteer.id}:`,
        err
      );
    }
  }

  return built;
}

function buildReason(
  skillOverlap: string[],
  engagementScore: number,
  sameMinistry: boolean
): string {
  const parts: string[] = [];
  if (skillOverlap.length > 0)
    parts.push(`habilidades compartidas: ${skillOverlap.join(", ")}`);
  if (engagementScore >= 70) parts.push("alta consistencia de servicio");
  if (sameMinistry) parts.push("mismo ministerio");
  return parts.join(" · ") || "perfil compatible";
}
