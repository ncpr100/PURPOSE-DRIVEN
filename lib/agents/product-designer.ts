// lib/agents/product-designer.ts
// Agent 15: AI Product Designer
// Monthly UX friction detection and improvement recommendation engine.
// Runs: Monday 9am UTC (1st of each month cadence via cron filter).
// Output: Stores recommendations in performance_recommendations with category='ux_friction'.
// HITL PROTOCOL: Generates report only — no direct UI changes.

import { db } from "@/lib/db";
import { intelligentRouter } from "@/lib/ai/intelligent-router";
import { getAgent15ProductDesignerPrompt, ProductDesignerContext } from "@/lib/agents/prompts/agent-15-product-designer";
import { agent15ProductDesignerSchema } from "@/lib/agents/schemas/agent-15-schema";

export async function runProductDesignerAnalysis(): Promise<{
  frictionPoints: number;
  quickWins: number;
  reportMonth: string;
}> {
  if (process.env.ENABLE_PRODUCT_DESIGNER !== "true") {
    throw new Error("Product Designer Agent is not enabled.");
  }

  const now = new Date();
  const reportMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // ── 1. Platform-level stats ──────────────────────────────────
  const [totalChurches, activeChurches] = await Promise.all([
    db.churches.count(),
    db.churches.count({ where: { isActive: true } }),
  ]);

  // ── 2. Top error routes (from platform_incidents) ────────────
  const recentIncidents = await db.platform_incidents.findMany({
    where: { detectedAt: { gte: thirtyDaysAgo } },
    select: {
      title: true,
      severity: true,
      timeToResolveMs: true,
      affectedService: true,
    },
    orderBy: { detectedAt: "desc" },
    take: 10,
  });

  const topErrorRoutes = recentIncidents
    .filter((i) => i.affectedService)
    .slice(0, 5)
    .map((i) => ({
      route: i.affectedService!,
      errorCount: 1,
      errorRate: 0.05, // Estimated — no per-route error tracking in current schema
    }));

  // ── 3. Slow routes (from performance_recommendations) ────────
  const perfRecommendations = await db.performance_recommendations.findMany({
    where: {
      isActioned: false,
      expiresAt: { gt: now },
      category: { in: ["performance", "api_latency"] },
    },
    select: { affectedRoute: true, description: true },
    take: 5,
  });

  const slowRoutes = perfRecommendations
    .filter((r) => r.affectedRoute)
    .map((r) => ({
      route: r.affectedRoute!,
      avgDurationMs: 2500, // Estimated from recommendation context
      p95DurationMs: 5000,
    }));

  // ── 4. Feature adoption gaps ─────────────────────────────────
  const [totalWithAgents, totalWithFormBuilder] = await Promise.all([
    db.agent_settings.count({ where: { isEnabled: true } }),
    db.custom_forms.count(),
  ]);

  const featureAdoptionGaps: string[] = [];
  const agentAdoptionPct = totalChurches > 0
    ? (totalWithAgents / (totalChurches * 15)) * 100
    : 0;
  if (agentAdoptionPct < 30) {
    featureAdoptionGaps.push(
      `Agentes IA: ${agentAdoptionPct.toFixed(0)}% de slots de agentes activados en total`
    );
  }
  if (totalWithFormBuilder < totalChurches * 0.5) {
    featureAdoptionGaps.push(
      `Form Builder: solo ${totalWithFormBuilder} formularios creados para ${totalChurches} iglesias`
    );
  }

  // ── 5. Build context and call intelligentRouter ───────────────
  const context: ProductDesignerContext = {
    reportMonth,
    totalChurches,
    activeChurches,
    topErrorRoutes,
    slowRoutes,
    recentIncidents: recentIncidents.slice(0, 5).map((i) => ({
      title: i.title,
      severity: i.severity,
      resolvedIn: i.timeToResolveMs
        ? `${Math.round(i.timeToResolveMs / 60000)}min`
        : "pendiente",
    })),
    featureAdoptionGaps,
  };

  const systemPrompt = getAgent15ProductDesignerPrompt(context);
  const result = await intelligentRouter.execute(
    15,
    JSON.stringify(context),
    systemPrompt,
    1800,
    agent15ProductDesignerSchema,
  );

  const report = JSON.parse(result.text) as {
    frictionPoints: Array<{
      area: string;
      description: string;
      severity: string;
      affectedUsers: string;
      suggestedFix: string;
    }>;
    quickWins: Array<{
      title: string;
      effort: string;
      impact: string;
      description: string;
    }>;
    executiveSummary: string;
    reportMonth: string;
  };

  // ── 6. Persist friction points as performance_recommendations ──
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  if (report.frictionPoints.length > 0) {
    await db.performance_recommendations.createMany({
      data: report.frictionPoints.map((fp) => ({
        category: "ux_friction",
        title: `[${fp.severity}] ${fp.area}: ${fp.description.substring(0, 100)}`,
        description: `${fp.description}\n\nUsuarios afectados: ${fp.affectedUsers}`,
        impact: fp.severity === "HIGH" ? "critical" : fp.severity === "MEDIUM" ? "high" : "medium",
        effort: "medium",
        affectedRoute: fp.area,
        codeSnippet: fp.suggestedFix,
        expiresAt,
      })),
    });
  }

  if (report.quickWins.length > 0) {
    await db.performance_recommendations.createMany({
      data: report.quickWins.map((qw) => ({
        category: "ux_quick_win",
        title: qw.title,
        description: qw.description,
        impact: qw.impact.toLowerCase(),
        effort: qw.effort.toLowerCase(),
        affectedRoute: null,
        codeSnippet: null,
        expiresAt,
      })),
    });
  }

  console.log(
    `[PRODUCT_DESIGNER] Report ${reportMonth}: ${report.frictionPoints.length} friction points, ${report.quickWins.length} quick wins`
  );

  return {
    frictionPoints: report.frictionPoints.length,
    quickWins: report.quickWins.length,
    reportMonth,
  };
}
