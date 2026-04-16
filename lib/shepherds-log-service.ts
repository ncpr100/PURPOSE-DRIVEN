// Agent 5: The Shepherd's Log
// Surfaces members who need pastoral attention this week.
// Uses data that already exists in the database — no AI generation of pastoral content.

import { db } from "@/lib/db";

export interface ShepherdsMemberEntry {
  id: string;
  name: string;
  phone: string | null;
  reason: string;
  urgency: "HIGH" | "CRITICAL";
  lastAttendance: string | null;
  daysAbsent: number | null;
  retentionRisk: string;
  lastContactedAt: string | null;
}

export async function generateShepherdsLog(
  churchId: string,
): Promise<ShepherdsMemberEntry[]> {
  if (process.env.ENABLE_SHEPHERDS_LOG !== "true") {
    return [];
  }

  const now = new Date();
  const threeWeeksAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000);

  // Query 1: Members with HIGH or VERY_HIGH retention risk
  // RetentionRisk enum: VERY_LOW | LOW | MEDIUM | HIGH | VERY_HIGH (no 'CRITICAL')
  // members.isActive is the active flag (no 'status' column)
  // member_journeys column is totalDaysInCurrentStage (not daysInStage)
  const atRiskMembers = await db.$queryRaw<
    Array<{
      id: string;
      firstName: string;
      lastName: string;
      phone: string | null;
      retentionRisk: string;
      engagementScore: number;
      totalDaysInCurrentStage: number;
    }>
  >`
    SELECT m.id, m."firstName", m."lastName", m.phone,
           mj."retentionRisk", mj."engagementScore", mj."totalDaysInCurrentStage"
    FROM members m
    JOIN member_journeys mj ON mj."memberId" = m.id
    WHERE m."churchId" = ${churchId}
      AND m."isActive" = true
      AND mj."retentionRisk" IN ('HIGH', 'VERY_HIGH')
    ORDER BY mj."retentionRisk" DESC, mj."engagementScore" ASC
    LIMIT 10
  `;

  // Query 2: Active members absent for 3+ weeks (joined via email)
  const absentMembers = await db.$queryRaw<
    Array<{
      id: string;
      firstName: string;
      lastName: string;
      phone: string | null;
      lastCheckin: Date | null;
    }>
  >`
    SELECT m.id, m."firstName", m."lastName", m.phone,
           MAX(c."checkedInAt") as "lastCheckin"
    FROM members m
    LEFT JOIN check_ins c ON c.email = m.email AND c."churchId" = m."churchId"
    WHERE m."churchId" = ${churchId}
      AND m."isActive" = true
    GROUP BY m.id, m."firstName", m."lastName", m.phone
    HAVING MAX(c."checkedInAt") < ${threeWeeksAgo} OR MAX(c."checkedInAt") IS NULL
    LIMIT 10
  `;

  // Merge and deduplicate
  const seen = new Set<string>();
  const entries: ShepherdsMemberEntry[] = [];

  for (const m of atRiskMembers) {
    if (seen.has(m.id)) continue;
    seen.add(m.id);

    const reasons: string[] = [];
    if (m.retentionRisk === "VERY_HIGH") {
      reasons.push("Riesgo de desconexión crítico");
    } else {
      reasons.push("Riesgo de desconexión alto");
    }
    if (m.engagementScore < 30) reasons.push("Participación muy baja");

    // Resolve last pastoral contact
    const lastContact = await db.pastoral_contacts.findFirst({
      where: { churchId, memberId: m.id },
      orderBy: { contactedAt: "desc" },
      select: { contactedAt: true },
    });

    entries.push({
      id: m.id,
      name: `${m.firstName} ${m.lastName}`,
      phone: m.phone,
      reason: reasons.join(" · "),
      urgency: m.retentionRisk === "VERY_HIGH" ? "CRITICAL" : "HIGH",
      lastAttendance: null,
      daysAbsent: null,
      retentionRisk: m.retentionRisk,
      lastContactedAt: lastContact
        ? lastContact.contactedAt.toLocaleDateString("es-CO")
        : null,
    });
  }

  for (const m of absentMembers) {
    if (seen.has(m.id)) continue;
    seen.add(m.id);

    const daysAbsent = m.lastCheckin
      ? Math.floor(
          (now.getTime() - new Date(m.lastCheckin).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : null;

    const lastContact = await db.pastoral_contacts.findFirst({
      where: { churchId, memberId: m.id },
      orderBy: { contactedAt: "desc" },
      select: { contactedAt: true },
    });

    entries.push({
      id: m.id,
      name: `${m.firstName} ${m.lastName}`,
      phone: m.phone,
      reason: daysAbsent
        ? `No ha asistido en ${daysAbsent} días`
        : "Sin registro de asistencia",
      urgency: "HIGH",
      lastAttendance: m.lastCheckin
        ? new Date(m.lastCheckin).toLocaleDateString("es-CO")
        : null,
      daysAbsent,
      retentionRisk: "UNKNOWN",
      lastContactedAt: lastContact
        ? lastContact.contactedAt.toLocaleDateString("es-CO")
        : null,
    });
  }

  // Sort CRITICAL first, then by daysAbsent descending, limit to 7
  return entries
    .sort((a, b) => {
      if (a.urgency === "CRITICAL" && b.urgency !== "CRITICAL") return -1;
      if (b.urgency === "CRITICAL" && a.urgency !== "CRITICAL") return 1;
      return (b.daysAbsent ?? 0) - (a.daysAbsent ?? 0);
    })
    .slice(0, 7);
}

export async function refreshShepherdsLog(churchId: string) {
  const members = await generateShepherdsLog(churchId);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week

  await db.shepherds_log_cache.upsert({
    where: { churchId },
    update: {
      members: JSON.stringify(members),
      generatedAt: new Date(),
      expiresAt,
    },
    create: {
      churchId,
      members: JSON.stringify(members),
      generatedAt: new Date(),
      expiresAt,
    },
  });

  return members;
}
