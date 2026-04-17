// lib/visitor-conversion-service.ts
// Agent 8: Visitor Conversion Intelligence
// Analyzes why visitors return or don't — surfaces patterns, not individual judgments.

import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface ConversionPattern {
  pattern: string;
  impact: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  affectedCount: number;
  recommendation: string;
}

export async function generateVisitorConversionReport(churchId: string) {
  if (process.env.ENABLE_VISITOR_CONVERSION !== "true") {
    throw new Error("Visitor Conversion Intelligence is not enabled.");
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // 1. Get visitors from last 30 days
  const visitors = await db.check_ins.findMany({
    where: {
      churchId,
      checkedInAt: { gte: thirtyDaysAgo },
      visitorType: { in: ["FIRST_TIME", "RETURNING"] },
    },
    select: {
      id: true,
      firstName: true,
      email: true,
      phone: true,
      visitorType: true,
      checkedInAt: true,
      visitReason: true,
      engagementScore: true,
    },
  });

  if (visitors.length === 0) {
    return null;
  }

  // 2. Determine who returned (checked in again after their first visit)
  const emails = visitors.map((v) => v.email).filter(Boolean) as string[];
  const returnVisits = await db.check_ins.findMany({
    where: {
      churchId,
      email: { in: emails },
      checkedInAt: { gte: thirtyDaysAgo },
    },
    select: { email: true, checkedInAt: true },
  });

  const returnedEmails = new Set(
    returnVisits
      .filter((r) => {
        const firstVisit = visitors.find((v) => v.email === r.email);
        return firstVisit && r.checkedInAt > firstVisit.checkedInAt;
      })
      .map((r) => r.email),
  );

  // 3. Get follow-up data
  const followUps = await db.visitor_follow_ups.findMany({
    where: {
      churchId,
      createdAt: { gte: thirtyDaysAgo },
    },
    select: {
      id: true,
      priority: true,
      status: true,
      scheduledAt: true,
      notes: true,
    },
  });

  // 4. Build data summary for Claude analysis
  // Follow-up status in this system uses Spanish: "COMPLETADO" (not "COMPLETED")
  const completedFollowUps = followUps.filter(
    (f) => f.status === "COMPLETADO" || f.status === "completed",
  );

  const dataSummary = {
    totalVisitors: visitors.length,
    firstTimeVisitors: visitors.filter((v) => v.visitorType === "FIRST_TIME")
      .length,
    returned: returnedEmails.size,
    conversionRate: Math.round((returnedEmails.size / visitors.length) * 100),
    followedUpWithin48h: followUps.filter((f) => {
      const scheduledTime = f.scheduledAt
        ? new Date(f.scheduledAt).getTime()
        : 0;
      const windowEnd = thirtyDaysAgo.getTime() + 48 * 60 * 60 * 1000;
      return (
        scheduledTime <= windowEnd &&
        (f.status === "COMPLETADO" || f.status === "completed")
      );
    }).length,
    visitReasons: visitors.reduce(
      (acc, v) => {
        if (v.visitReason) acc[v.visitReason] = (acc[v.visitReason] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
    avgEngagementScore: Math.round(
      visitors.reduce((sum, v) => sum + (v.engagementScore || 0), 0) /
        visitors.length,
    ),
  };

  // 5. Ask Claude to identify patterns
  const prompt = `Eres un analista de crecimiento de iglesias para una congregación latinoamericana.

Analiza estos datos de visitantes del último mes y encuentra patrones que expliquen por qué 
algunos regresan y otros no. NO hagas juicios sobre las personas. Analiza sistemas y patrones.

DATOS:
${JSON.stringify(dataSummary, null, 2)}

Devuelve SOLO un JSON válido (sin markdown) con esta estructura:
{
  "summary": "Una oración que resume el estado de la retención de visitantes este mes",
  "patterns": [
    {
      "pattern": "Descripción del patrón identificado",
      "impact": "POSITIVE" | "NEGATIVE" | "NEUTRAL",
      "affectedCount": número estimado de visitantes afectados,
      "recommendation": "Acción concreta y específica que el equipo pastoral puede tomar"
    }
  ],
  "topPriority": "La UNA cosa más importante que hacer diferente el próximo mes"
}

Máximo 3 patrones. Usa lenguaje pastoral, no de marketing. 
Recuerda: el objetivo es discipulado, no crecimiento numérico.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 800,
    messages: [{ role: "user", content: prompt }],
  });

  const rawText = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  let analysis: {
    summary: string;
    patterns: ConversionPattern[];
    topPriority: string;
  };

  try {
    analysis = JSON.parse(rawText);
  } catch {
    throw new Error("Claude returned invalid JSON for visitor analysis");
  }

  // 6. Save report — visitor_conversion_reports has no compound unique constraint,
  // so we find the existing report for this period and update it, or create a new one.
  const existingReport = await db.visitor_conversion_reports.findFirst({
    where: {
      churchId,
      periodStart: thirtyDaysAgo,
    },
  });

  const reportData = {
    totalVisitors: visitors.length,
    followedUp: completedFollowUps.length,
    returned: returnedEmails.size,
    conversionRate: dataSummary.conversionRate / 100,
    patterns: JSON.stringify(analysis.patterns),
    recommendations: JSON.stringify([analysis.topPriority]),
    generatedAt: now,
  };

  const report = existingReport
    ? await db.visitor_conversion_reports.update({
        where: { id: existingReport.id },
        data: reportData,
      })
    : await db.visitor_conversion_reports.create({
        data: {
          churchId,
          periodStart: thirtyDaysAgo,
          periodEnd: now,
          ...reportData,
        },
      });

  return { report, analysis, dataSummary };
}
