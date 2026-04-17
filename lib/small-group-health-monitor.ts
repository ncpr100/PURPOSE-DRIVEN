// lib/small-group-health-monitor.ts
// Agent 10: Small Group Health Monitor
// Monthly health scoring for all active small groups.

import { nanoid } from "nanoid";
import { db } from "@/lib/db";

export interface GroupHealthScore {
  groupId: string;
  groupName: string;
  leaderName: string | null;
  memberCount: number;
  sizeTrend: "GROWING" | "STABLE" | "DECLINING";
  attendanceScore: number;
  leaderScore: number;
  integrationScore: number;
  overallStatus: "GREEN" | "YELLOW" | "RED";
  recommendations: string[];
}

export async function scoreAllSmallGroups(
  churchId: string,
): Promise<GroupHealthScore[]> {
  if (process.env.ENABLE_SMALL_GROUP_MONITOR !== "true") {
    return [];
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  // Get all active small groups
  // NOTE: small_groups table is a future feature table accessed via raw SQL
  const groups = await db.$queryRaw<
    Array<{
      id: string;
      name: string;
      leaderId: string | null;
      leaderName: string | null;
      leaderPhone: string | null;
    }>
  >`
    SELECT
      sg.id,
      sg.name,
      sg."leaderId",
      CONCAT(m."firstName", ' ', m."lastName") as "leaderName",
      m.phone as "leaderPhone"
    FROM small_groups sg
    LEFT JOIN members m ON m.id = sg."leaderId"
    WHERE sg."churchId" = ${churchId}
      AND sg.status = 'ACTIVE'
  `.catch(() => [] as any[]);

  // If small_groups table doesn't exist yet, return empty
  if (!groups || groups.length === 0) return [];

  const scores: GroupHealthScore[] = [];

  for (const group of groups) {
    const recommendations: string[] = [];
    let attendanceScore = 75; // default if no data
    let leaderScore = 75;
    let integrationScore = 75;

    // --- Size trend (compare last 30 days vs 30-90 days ago) ---
    const recentCount = await db.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count FROM small_group_members
      WHERE "groupId" = ${group.id} AND "joinedAt" >= ${thirtyDaysAgo}
    `.catch(() => [{ count: BigInt(0) }]);

    const previousCount = await db.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count FROM small_group_members
      WHERE "groupId" = ${group.id}
        AND "joinedAt" >= ${ninetyDaysAgo}
        AND "joinedAt" < ${thirtyDaysAgo}
    `.catch(() => [{ count: BigInt(0) }]);

    const recent = Number(recentCount[0]?.count ?? 0);
    const previous = Number(previousCount[0]?.count ?? 0);

    let sizeTrend: "GROWING" | "STABLE" | "DECLINING" = "STABLE";
    if (recent > previous * 1.1) sizeTrend = "GROWING";
    else if (recent < previous * 0.8) {
      sizeTrend = "DECLINING";
      recommendations.push(
        "El grupo ha perdido miembros. Considere una reunión de reinicio.",
      );
    }

    // --- Leader engagement ---
    if (group.leaderId) {
      const leaderJourney = await db.member_journeys.findFirst({
        where: { memberId: group.leaderId },
        select: { engagementScore: true, retentionScore: true },
      });

      if (leaderJourney) {
        leaderScore = leaderJourney.engagementScore;
        if (leaderScore < 50) {
          recommendations.push(
            "El líder del grupo muestra señales de desvinculación. Priorizar un encuentro pastoral.",
          );
        }
      }
    }

    // --- New member integration (anyone new join in last 30 days?) ---
    const newMembers = await db.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count FROM small_group_members sgm
      WHERE sgm."groupId" = ${group.id}
        AND sgm."joinedAt" >= ${thirtyDaysAgo}
    `.catch(() => [{ count: BigInt(0) }]);

    const newMemberCount = Number(newMembers[0]?.count ?? 0);
    integrationScore = newMemberCount > 0 ? 85 : 60;
    if (newMemberCount === 0) {
      recommendations.push(
        "No se han integrado miembros nuevos en los últimos 30 días.",
      );
    }

    // --- Overall status ---
    const avgScore = (attendanceScore + leaderScore + integrationScore) / 3;
    let overallStatus: "GREEN" | "YELLOW" | "RED" = "GREEN";
    if (avgScore < 50 || sizeTrend === "DECLINING") overallStatus = "RED";
    else if (avgScore < 70) overallStatus = "YELLOW";

    // --- Save score to DB ---
    await db.small_group_health_scores.upsert({
      where: { churchId_groupId: { churchId, groupId: group.id } },
      update: {
        sizeTrend,
        attendanceScore,
        leaderScore,
        integrationScore,
        overallStatus,
        recommendations: JSON.stringify(recommendations),
        scoredAt: now,
      },
      create: {
        churchId,
        groupId: group.id,
        sizeTrend,
        attendanceScore,
        leaderScore,
        integrationScore,
        overallStatus,
        recommendations: JSON.stringify(recommendations),
      },
    });

    // Notify pastors if RED — notifications.id is non-auto, requires nanoid()
    // notifications model: id, title, message (not body), type, churchId, targetUser (not userId)
    if (overallStatus === "RED") {
      const pastors = await db.users.findMany({
        where: { churchId, role: "PASTOR", isActive: true },
        select: { id: true },
      });

      for (const p of pastors) {
        await db.notifications.create({
          data: {
            id: nanoid(),
            churchId,
            type: "SMALL_GROUP_RED_ALERT",
            title: `Grupo en riesgo: ${group.name}`,
            message:
              recommendations[0] ||
              "El grupo necesita atención pastoral urgente.",
            targetUser: p.id,
            priority: "HIGH",
          },
        });
      }
    }

    const totalMembers = await db.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count FROM small_group_members WHERE "groupId" = ${group.id}
    `.catch(() => [{ count: BigInt(0) }]);

    scores.push({
      groupId: group.id,
      groupName: group.name,
      leaderName: group.leaderName,
      memberCount: Number(totalMembers[0]?.count ?? 0),
      sizeTrend,
      attendanceScore,
      leaderScore,
      integrationScore,
      overallStatus,
      recommendations,
    });
  }

  return scores;
}
