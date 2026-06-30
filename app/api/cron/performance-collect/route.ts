// app/api/cron/performance-collect/route.ts
// Agent 13 — Collect performance metrics every 5 minutes
// Schedule: */5 * * * *
import { NextRequest, NextResponse } from "next/server";
import {
  collectPerformanceSnapshot,
  detectPerformanceAnomalies,
  generatePerformanceRecommendations,
} from "@/lib/agents/performance-engineer";
import { sendAlertCascade } from "@/lib/alerts/alert-cascade";
import { db } from "@/lib/db";
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ✅ CRITICAL: Check if Agent 13 is enabled in database
  const agent = await db.agent_settings.findUnique({
    where: { agentId: 13 },
    select: { isEnabled: true, agentName: true }
  });
  if (!agent?.isEnabled) {
    console.log('[CRON/PERFORMANCE] Agent 13 is DISABLED — skipping execution');
    return NextResponse.json({
      skipped: true,
      reason: "Agent 13 (Performance Engineer) is disabled in platform settings",
    });
  }
  if (process.env.ENABLE_PERFORMANCE_ENGINEER !== "true") {
    return NextResponse.json({
      skipped: true,
      reason: "Performance Engineer not enabled",
    });
  }
  try {
    const snapshot = await collectPerformanceSnapshot(5);
    const anomalies = detectPerformanceAnomalies(snapshot);
    // Auto-create incidents for P1/P2 anomalies not already open
    const criticalAnomalies = anomalies.filter(
      (a) => a.severity === "P1_CRITICAL" || a.severity === "P2_HIGH",
    );
    for (const anomaly of criticalAnomalies) {
      const existing = await db.platform_incidents.findFirst({
        where: {
          title: { contains: anomaly.type },
          status: { in: ["DETECTED", "ACKNOWLEDGED", "INVESTIGATING"] },
        },
      });
      if (!existing) {
        await db.platform_incidents.create({
          data: {
            severity: anomaly.severity,
            title: `Performance: ${anomaly.type}`,
            description: anomaly.description,
            affectedService: anomaly.service,
            detectedAt: new Date(),
            status: "DETECTED",
          },
        });
      }
    }
    // Generate recommendations for anomalies
    if (anomalies.length > 0) {
      const recommendations = await generatePerformanceRecommendations(
        anomalies,
        snapshot,
      );
      console.log("[CRON/PERFORMANCE] Recommendations:", recommendations);
    }
    return NextResponse.json({
      ok: true,
      metrics: snapshot,
      anomalies: anomalies.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[CRON/PERFORMANCE] Failed:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
