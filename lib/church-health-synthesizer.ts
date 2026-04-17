// lib/church-health-synthesizer.ts
// Agent 11: Church Health Synthesizer — The Board Report
// Monthly narrative report for pastoral board / leadership team.
// Interprets data into pastoral language. Never draws theological conclusions.

import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateBoardReport(churchId: string) {
  if (process.env.ENABLE_BOARD_REPORT !== "true") {
    throw new Error("Board Report is not enabled.");
  }

  const now = new Date();
  const reportMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // -- Gather all data points --

  // 1. Attendance delta
  const recentCheckins = await db.check_ins.count({
    where: { churchId, checkedInAt: { gte: thirtyDaysAgo } },
  });
  const previousCheckins = await db.check_ins.count({
    where: {
      churchId,
      checkedInAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
    },
  });
  const attendanceDelta =
    previousCheckins > 0
      ? Math.round(
          ((recentCheckins - previousCheckins) / previousCheckins) * 100
        )
      : 0;

  // 2. Giving data — donations uses donationDate (not date)
  const recentDonors = await db.donations.groupBy({
    by: ["memberId"],
    where: {
      churchId,
      donationDate: { gte: thirtyDaysAgo },
      memberId: { not: null },
    },
  });
  const previousDonors = await db.donations.groupBy({
    by: ["memberId"],
    where: {
      churchId,
      donationDate: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
      memberId: { not: null },
    },
  });
  const giversDelta =
    previousDonors.length > 0
      ? Math.round(
          ((recentDonors.length - previousDonors.length) /
            previousDonors.length) *
            100
        )
      : 0;

  // 3. Visitor retention
  const visitors = await db.check_ins.findMany({
    where: {
      churchId,
      checkedInAt: { gte: thirtyDaysAgo },
      visitorType: "FIRST_TIME",
    },
    select: { email: true },
  });

  const visitorEmails = visitors
    .map((v) => v.email)
    .filter(Boolean) as string[];
  let visitorRetention = 0;

  if (visitorEmails.length > 0) {
    const returned = await db.check_ins.count({
      where: {
        churchId,
        email: { in: visitorEmails },
        visitorType: "RETURNING",
        checkedInAt: { gte: thirtyDaysAgo },
      },
    });
    visitorRetention = Math.round((returned / visitors.length) * 100);
  }

  // 4. Member lifecycle distribution
  // member_journeys has churchId directly; active members via members.isActive (no status field)
  const lifecycleDistribution = await db.member_journeys.groupBy({
    by: ["currentStage"],
    where: {
      churchId,
      members: { isActive: true },
    },
    _count: { currentStage: true },
  });

  // 5. Prayer activity
  const prayerActivity = await db.prayer_requests.count({
    where: { churchId, createdAt: { gte: thirtyDaysAgo } },
  });

  // 6. High retention risk count
  // RetentionRisk enum: VERY_LOW | LOW | MEDIUM | HIGH | VERY_HIGH (no CRITICAL)
  const atRiskCount = await db.member_journeys.count({
    where: {
      churchId,
      members: { isActive: true },
      retentionRisk: { in: ["HIGH", "VERY_HIGH"] },
    },
  });

  // 7. Church info — model name is churches (plural)
  const church = await db.churches.findUnique({
    where: { id: churchId },
    select: { name: true, country: true },
  });

  // -- Build data package for Claude --
  const dataPackage = {
    church,
    reportMonth,
    attendance: {
      recentTotal: recentCheckins,
      previousTotal: previousCheckins,
      deltaPercent: attendanceDelta,
    },
    giving: {
      recentUniqueGivers: recentDonors.length,
      previousUniqueGivers: previousDonors.length,
      deltaPercent: giversDelta,
    },
    visitors: {
      total: visitors.length,
      retentionRate: visitorRetention,
    },
    lifecycle: lifecycleDistribution.map((l) => ({
      stage: l.currentStage,
      count: l._count.currentStage,
    })),
    spiritual: {
      prayerRequestsThisMonth: prayerActivity,
      membersAtHighRetentionRisk: atRiskCount,
    },
  };

  // -- Ask Claude to write the narrative --
  // Language mirrors the church's own LATAM country culture (not hardcoded to Colombia)
  const countryLabel = church?.country ?? "Latinoamérica";

  const prompt = `Eres el asistente de análisis de datos de una iglesia latinoamericana.
Tu tarea es escribir el informe mensual para el consejo pastoral.

REGLAS ABSOLUTAS:
- Escribe en español de ${countryLabel} formal pero accesible
- NO hagas conclusiones teológicas (no digas "Dios está obrando en...")
- Interpreta los datos, no el significado espiritual
- Sé honesto sobre los desafíos — no suavices los números negativos
- Las acciones deben ser ESPECÍFICAS y ejecutables, no genéricas

DATOS DEL MES:
${JSON.stringify(dataPackage, null, 2)}

Devuelve SOLO un JSON válido (sin markdown):
{
  "narrative": "3-4 párrafos en español que narren el estado de salud de la iglesia este mes. Incluye los números específicos. Menciona lo que va bien Y lo que necesita atención. Termina con una perspectiva de esperanza anclada en la misión de la iglesia.",
  "actionItems": [
    "Acción específica y ejecutable #1 — con un responsable y una fecha sugerida",
    "Acción específica y ejecutable #2 — con un responsable y una fecha sugerida",
    "Acción específica y ejecutable #3 — con un responsable y una fecha sugerida"
  ],
  "highlightPositive": "La UNA cosa más alentadora de este mes",
  "highlightConcern": "La UNA cosa que más necesita atención del consejo"
}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });

  const rawText = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  let boardContent: {
    narrative: string;
    actionItems: string[];
    highlightPositive: string;
    highlightConcern: string;
  };

  try {
    boardContent = JSON.parse(rawText);
  } catch {
    throw new Error("Claude returned invalid JSON for board report");
  }

  // -- Save the report --
  // @@unique([churchId, reportMonth]) → upsert key: churchId_reportMonth
  const report = await db.church_board_reports.upsert({
    where: { churchId_reportMonth: { churchId, reportMonth } },
    update: {
      narrative: boardContent.narrative,
      attendanceDelta: attendanceDelta / 100,
      giversDelta: giversDelta / 100,
      visitorRetention: visitorRetention / 100,
      smallGroupScore: 0.75, // placeholder until Agent 10 is running
      actionItems: JSON.stringify(boardContent.actionItems),
      generatedAt: now,
    },
    create: {
      churchId,
      reportMonth,
      narrative: boardContent.narrative,
      attendanceDelta: attendanceDelta / 100,
      giversDelta: giversDelta / 100,
      visitorRetention: visitorRetention / 100,
      smallGroupScore: 0.75,
      actionItems: JSON.stringify(boardContent.actionItems),
    },
  });

  return { report, boardContent, dataPackage };
}
