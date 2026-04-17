// lib/volunteer-burnout-sentinel.ts
// Agent 7: Volunteer Burnout Sentinel
// Scans active volunteers for burnout risk signals.
// Creates burnout_alerts records — never contacts volunteers directly.

import { db } from "@/lib/db";

const OVER_ASSIGNMENT_THRESHOLD = 5; // assignments in last 30 days
const CONSECUTIVE_WEEKS_THRESHOLD = 6; // weeks serving without a break

export async function runBurnoutSentinel(churchId: string) {
  if (process.env.ENABLE_BURNOUT_SENTINEL !== "true") {
    return [];
  }

  // Get active volunteers for this church
  const volunteers = await db.volunteers.findMany({
    where: { churchId, isActive: true },
    select: {
      id: true,
      memberId: true,
      firstName: true,
      lastName: true,
      volunteer_assignments: {
        where: {
          createdAt: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
        },
        select: { date: true, status: true, createdAt: true },
        orderBy: { date: "desc" },
      },
      volunteer_engagement_scores: {
        select: {
          burnoutRisk: true,
          participationRate: true,
          consistencyScore: true,
          growthTrend: true,
          lastActivityDate: true,
        },
      },
    },
  });

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const createdAlerts: Array<{ volunteerId: string; alertType: string; severity: string }> = [];

  for (const volunteer of volunteers) {
    const assignments = volunteer.volunteer_assignments;
    const engagement = volunteer.volunteer_engagement_scores;

    // ── 1. OVER_ASSIGNMENT ─────────────────────────────────────────────────
    const recentCount = assignments.filter(
      (a) => new Date(a.date) >= thirtyDaysAgo
    ).length;

    if (recentCount >= OVER_ASSIGNMENT_THRESHOLD) {
      const existing = await db.burnout_alerts.findFirst({
        where: {
          volunteerId: volunteer.id,
          alertType: "OVER_ASSIGNMENT",
          isResolved: false,
        },
      });
      if (!existing) {
        await db.burnout_alerts.create({
          data: {
            churchId,
            volunteerId: volunteer.id,
            alertType: "OVER_ASSIGNMENT",
            severity: recentCount >= 8 ? "CRITICAL" : "WARNING",
            details: `${volunteer.firstName} ${volunteer.lastName} tiene ${recentCount} asignaciones en los últimos 30 días (umbral: ${OVER_ASSIGNMENT_THRESHOLD}).`,
          },
        });
        createdAlerts.push({ volunteerId: volunteer.id, alertType: "OVER_ASSIGNMENT", severity: recentCount >= 8 ? "CRITICAL" : "WARNING" });
      }
    }

    // ── 2. DECLINING_ENGAGEMENT ────────────────────────────────────────────
    if (
      engagement?.growthTrend === "DECLINING" &&
      (engagement.participationRate ?? 1) < 0.4
    ) {
      const existing = await db.burnout_alerts.findFirst({
        where: {
          volunteerId: volunteer.id,
          alertType: "DECLINING_ENGAGEMENT",
          isResolved: false,
        },
      });
      if (!existing) {
        await db.burnout_alerts.create({
          data: {
            churchId,
            volunteerId: volunteer.id,
            alertType: "DECLINING_ENGAGEMENT",
            severity: "WARNING",
            details: `El compromiso de ${volunteer.firstName} ${volunteer.lastName} está en tendencia DECLINING con tasa de participación ${Math.round((engagement.participationRate ?? 0) * 100)}%.`,
          },
        });
        createdAlerts.push({ volunteerId: volunteer.id, alertType: "DECLINING_ENGAGEMENT", severity: "WARNING" });
      }
    }

    // ── 3. CONSECUTIVE_SERVICE ─────────────────────────────────────────────
    // Check last N weeks — a "serving week" = at least one assignment that week
    const weekBuckets = new Set<string>();
    for (const a of assignments) {
      const d = new Date(a.date);
      // ISO week key: year-week
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      weekBuckets.add(weekStart.toISOString().slice(0, 10));
    }

    // Count streak of consecutive weeks (most recent first)
    let streak = 0;
    const checkDate = new Date(now);
    checkDate.setDate(now.getDate() - now.getDay()); // start of current week
    while (weekBuckets.has(checkDate.toISOString().slice(0, 10))) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 7);
      if (streak > 20) break; // safety cap
    }

    if (streak >= CONSECUTIVE_WEEKS_THRESHOLD) {
      const existing = await db.burnout_alerts.findFirst({
        where: {
          volunteerId: volunteer.id,
          alertType: "CONSECUTIVE_SERVICE",
          isResolved: false,
        },
      });
      if (!existing) {
        await db.burnout_alerts.create({
          data: {
            churchId,
            volunteerId: volunteer.id,
            alertType: "CONSECUTIVE_SERVICE",
            severity: streak >= 10 ? "CRITICAL" : "WARNING",
            details: `${volunteer.firstName} ${volunteer.lastName} lleva ${streak} semanas consecutivas sirviendo sin descanso (umbral: ${CONSECUTIVE_WEEKS_THRESHOLD}).`,
          },
        });
        createdAlerts.push({ volunteerId: volunteer.id, alertType: "CONSECUTIVE_SERVICE", severity: streak >= 10 ? "CRITICAL" : "WARNING" });
      }
    }

    // ── 4. NO_REST_ROTATION ────────────────────────────────────────────────
    // Flag if volunteer has assignments spanning > 6 months but no gap > 3 weeks
    if (assignments.length >= 2) {
      const oldest = assignments[assignments.length - 1];
      const newest = assignments[0];
      const spanDays =
        (new Date(newest.date).getTime() - new Date(oldest.date).getTime()) /
        (1000 * 60 * 60 * 24);

      if (spanDays >= 180) {
        // Check for any rest gap > 3 weeks in last 6 months
        const sorted = [...assignments]
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        let hadBreak = false;
        for (let i = 1; i < sorted.length; i++) {
          const gap =
            (new Date(sorted[i].date).getTime() - new Date(sorted[i - 1].date).getTime()) /
            (1000 * 60 * 60 * 24);
          if (gap >= 21) {
            hadBreak = true;
            break;
          }
        }

        if (!hadBreak) {
          const existing = await db.burnout_alerts.findFirst({
            where: {
              volunteerId: volunteer.id,
              alertType: "NO_REST_ROTATION",
              isResolved: false,
            },
          });
          if (!existing) {
            await db.burnout_alerts.create({
              data: {
                churchId,
                volunteerId: volunteer.id,
                alertType: "NO_REST_ROTATION",
                severity: "WARNING",
                details: `${volunteer.firstName} ${volunteer.lastName} lleva más de ${Math.round(spanDays / 30)} meses sirviendo sin un descanso de 3 semanas o más.`,
              },
            });
            createdAlerts.push({ volunteerId: volunteer.id, alertType: "NO_REST_ROTATION", severity: "WARNING" });
          }
        }
      }
    }
  }

  return createdAlerts;
}
