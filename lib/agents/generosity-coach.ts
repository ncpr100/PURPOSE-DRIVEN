// lib/generosity-journey-service.ts
// Agent 9: Generosity Journey Coach
// Identifies giving journey patterns for pastoral formation.
// NEVER sends giving reminders to members.
// NEVER frames output as revenue optimization.
// Goal: discipleship formation, not donation extraction.

import { db } from "@/lib/db";

export type GenerosityPattern =
  | "FIRST_GIFT"
  | "LAPSED_GIVER"
  | "CAMPAIGN_ONLY_DONOR"
  | "INCONSISTENT_GIVER"
  | "RECURRING_MILESTONE";

export interface GenerosityAlert {
  memberId: string;
  memberName: string;
  phone: string | null;
  pattern: GenerosityPattern;
  message: string;
  pastoralAction: string;
}

export async function runGenerosityJourneyAnalysis(
  churchId: string,
): Promise<GenerosityAlert[]> {
  if (process.env.ENABLE_GENEROSITY_COACH !== "true") {
    return [];
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  const alerts: GenerosityAlert[] = [];

  // -----------------------------------------------
  // PATTERN 1: First gift in last 30 days
  // (Spiritually significant — deserves personal acknowledgment)
  // -----------------------------------------------
  const firstGifts = await db.$queryRaw<
    Array<{
      memberId: string;
      firstName: string;
      lastName: string;
      phone: string | null;
      giftDate: Date;
    }>
  >`
    SELECT DISTINCT ON (d."memberId")
      d."memberId",
      m."firstName",
      m."lastName",
      m.phone,
      d."donationDate" as "giftDate"
    FROM donations d
    JOIN members m ON m.id = d."memberId"
    WHERE d."churchId" = ${churchId}
      AND d."memberId" IS NOT NULL
      AND d."donationDate" >= ${thirtyDaysAgo}
      AND NOT EXISTS (
        SELECT 1 FROM donations d2
        WHERE d2."memberId" = d."memberId"
          AND d2."churchId" = ${churchId}
          AND d2."donationDate" < ${thirtyDaysAgo}
      )
    ORDER BY d."memberId", d."donationDate" ASC
  `;

  for (const g of firstGifts) {
    alerts.push({
      memberId: g.memberId,
      memberName: `${g.firstName} ${g.lastName}`,
      phone: g.phone,
      pattern: "FIRST_GIFT",
      message: `Realizó su primera ofrenda. Este es un momento espiritualmente significativo en su camino de discipulado.`,
      pastoralAction: `Contacto personal del pastor en las próximas 48 horas para agradecerle — no por la cantidad, sino por el paso de fe que representa.`,
    });
  }

  // -----------------------------------------------
  // PATTERN 2: Lapsed giver (gave consistently, stopped 60+ days ago)
  // (Possible life disruption — needs pastoral care, NOT a giving reminder)
  // -----------------------------------------------
  const lapsedGivers = await db.$queryRaw<
    Array<{
      memberId: string;
      firstName: string;
      lastName: string;
      phone: string | null;
      lastGift: Date;
      previousStreak: bigint;
    }>
  >`
    SELECT
      m.id as "memberId",
      m."firstName",
      m."lastName",
      m.phone,
      MAX(d."donationDate") as "lastGift",
      COUNT(DISTINCT DATE_TRUNC('month', d."donationDate")) as "previousStreak"
    FROM members m
    JOIN donations d ON d."memberId" = m.id AND d."churchId" = ${churchId}
    WHERE m."churchId" = ${churchId}
    GROUP BY m.id, m."firstName", m."lastName", m.phone
    HAVING MAX(d."donationDate") < ${sixtyDaysAgo}
      AND MAX(d."donationDate") >= ${ninetyDaysAgo}
      AND COUNT(DISTINCT DATE_TRUNC('month', d."donationDate")) >= 3
  `;

  for (const g of lapsedGivers) {
    alerts.push({
      memberId: g.memberId,
      memberName: `${g.firstName} ${g.lastName}`,
      phone: g.phone,
      pattern: "LAPSED_GIVER",
      message: `Daba consistentemente por ${Number(g.previousStreak)} meses pero no ha dado en más de 60 días. Puede indicar una situación de vida difícil.`,
      pastoralAction: `Visita pastoral o llamada de cuidado — NO para preguntar sobre la ofrenda, sino para preguntar cómo está la familia.`,
    });
  }

  // -----------------------------------------------
  // PATTERN 3: Campaign-only donor
  // -----------------------------------------------
  const campaigns = await db.donation_campaigns.findMany({
    where: { churchId },
    select: { id: true },
  });

  if (campaigns.length > 0) {
    const campaignOnlyDonors = await db.$queryRaw<
      Array<{
        memberId: string;
        firstName: string;
        lastName: string;
        phone: string | null;
      }>
    >`
      SELECT DISTINCT
        m.id as "memberId",
        m."firstName",
        m."lastName",
        m.phone
      FROM members m
      JOIN donations d ON d."memberId" = m.id AND d."churchId" = ${churchId}
      WHERE m."churchId" = ${churchId}
        AND d."campaignId" IS NOT NULL
        AND NOT EXISTS (
          SELECT 1 FROM donations d2
          WHERE d2."memberId" = m.id
            AND d2."churchId" = ${churchId}
            AND d2."campaignId" IS NULL
        )
      LIMIT 10
    `;

    for (const g of campaignOnlyDonors) {
      alerts.push({
        memberId: g.memberId,
        memberName: `${g.firstName} ${g.lastName}`,
        phone: g.phone,
        pattern: "CAMPAIGN_ONLY_DONOR",
        message: `Da únicamente durante campañas específicas. Está motivado por causas pero aún no ha adoptado la mayordomía como hábito de vida.`,
        pastoralAction: `Invitar a la próxima serie de discipulado sobre mayordomía — no como corrección, sino como siguiente paso en su crecimiento espiritual.`,
      });
    }
  }

  // Save alerts to DB — skip if unresolved alert of same type already exists in last 30 days
  for (const alert of alerts) {
    const existing = await db.generosity_journey_alerts.findFirst({
      where: {
        churchId,
        memberId: alert.memberId,
        alertType: alert.pattern as any,
        isActioned: false,
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    if (!existing) {
      await db.generosity_journey_alerts.create({
        data: {
          churchId,
          memberId: alert.memberId,
          alertType: alert.pattern as any,
          message: `${alert.message}\n\nAcción pastoral: ${alert.pastoralAction}`,
        },
      });
    }
  }

  return alerts;
}
