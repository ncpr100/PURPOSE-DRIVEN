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

  if (process.env.ENABLE_PERFORMANCE_ENGINEER !== "true") {
    return NextResponse.json({ skipped: true, reason: "Performance Engineer not enabled" });
  }

  try {
    const snapshot = await collectPerformanceSnapshot(5);
    const anomalies = detectPerformanceAnomalies(snapshot);

    // Auto-create incidents for P1/P2 anomalies not already open
    const criticalAnomalies = anomalies.filter(
      (a) => a.severity === "P1_CRITICAL" || a.severity === "P2_HIGH"
    );

    for (const anomaly of criticalAnomalies) {
      const existing = await db.platform_incidents.findFirst({
        where: {
          title: { contains: anomaly.type },
          status: { in: ["DETECTED", "ACKNOWLEDGED", "INVESTIGATING"] },
        },
      });

      if (!existing) {
        const incident = await db.platform_incidents.create({
          data: {
            title: `Anomalía de Rendimiento: ${anomaly.type}`,
            description: anomaly.description,
            severity: anomaly.severity,
            status: "DETECTED",
            affectedServices: anomaly.route ? [anomaly.route] : ["api"],
            affectedTenants: 0,
            isAutoDetected: true,
          },
        });

        await sendAlertCascade({
          incidentId: incident.id,
          title: incident.title,
          severity: anomaly.severity,
          description: anomaly.description,
          affectedServices: incident.affectedServices as string[],
          detectedAt: incident.detectedAt,
        });
      }
    }

    // Generate AI recommendations at the top of each hour
    const now = new Date();
    if (now.getMinutes() < 5) {
      await generatePerformanceRecommendations(snapshot, anomalies);
    }

    return NextResponse.json({
      ok: true,
      p50Ms: snapshot.p50Ms,
      p95Ms: snapshot.p95Ms,
      errorRate: snapshot.errorRate,
      anomalyCount: anomalies.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[CRON/PERF-COLLECT] Failed:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
