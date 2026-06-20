// lib/agents/sre-engineer.ts
// AGENT 14 — Site Reliability Engineer (SRE)
// 24/7 uptime monitoring, incident detection, escalation, and post-mortem generation.
// SLA target: 99.9% uptime (max 8.7 hours downtime/year)
// Runs: health checks every 60 seconds, SLA calc daily, post-mortems on resolution.

import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import {
  runAllHealthChecks,
  summarizeHealth,
} from "@/lib/monitoring/health-check-engine";
import { sendAlertCascade } from "@/lib/alerts/alert-cascade";
import type { HealthCheckResult } from "@/lib/monitoring/health-check-engine";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── SLA CONFIGURATION ─────────────────────────────────────────
const SLA_TARGET = 0.999; // 99.9%
const MAX_DOWNTIME_MS_PER_YEAR = (1 - SLA_TARGET) * 365 * 24 * 60 * 60 * 1000; // ~31,536,000ms = 8.76h

// ── INCIDENT DETECTION THRESHOLDS ────────────────────────────
const INCIDENT_RULES = [
  {
    // P1: Database is down
    condition: (checks: HealthCheckResult[]) =>
      checks.find((c) => c.service === "database")?.status === "DOWN",
    severity: "P1_CRITICAL" as const,
    title: "Base de Datos Inaccesible — Plataforma No Funcional",
    affectedServices: ["database"],
    description:
      "El servidor de base de datos PostgreSQL (Supabase) no responde. Todas las iglesias están sin servicio.",
  },
  {
    // P1: Production URL unreachable
    condition: (checks: HealthCheckResult[]) =>
      checks.find((c) => c.service === "production_url")?.status === "DOWN",
    severity: "P1_CRITICAL" as const,
    title: "URL de Producción Caída — Plataforma Inaccesible",
    affectedServices: ["production_url"],
    description:
      "khesed-tek-cms-org.vercel.app no responde. Todas las iglesias no pueden acceder al sistema.",
  },
  {
    // P2: Redis down (fallback exists but performance degrades)
    condition: (checks: HealthCheckResult[]) =>
      checks.find((c) => c.service === "redis")?.status === "DOWN",
    severity: "P2_HIGH" as const,
    title: "Redis Caído — Rendimiento Degradado",
    affectedServices: ["redis"],
    description:
      "El servidor Redis (Upstash) no responde. El sistema operará con el fallback de PostgreSQL. Rendimiento reducido en análisis y caché.",
  },
  {
    // P2: Multiple services degraded simultaneously
    condition: (checks: HealthCheckResult[]) =>
      checks.filter((c) => c.status === "DEGRADED").length >= 3,
    severity: "P2_HIGH" as const,
    title: "Degradación Múltiple de Servicios",
    affectedServices: [],
    description:
      "Tres o más servicios reportan degradación simultánea. Posible problema de infraestructura subyacente.",
  },
  {
    // P2: Payment gateway down (donations affected)
    condition: (checks: HealthCheckResult[]) =>
      checks.find((c) => c.service === "stripe")?.status === "DOWN",
    severity: "P2_HIGH" as const,
    title: "Pasarela de Pago (Stripe) Inaccesible",
    affectedServices: ["stripe"],
    description:
      "Stripe no responde. Los pagos de suscripción y donaciones online pueden estar fallando.",
  },
  {
    // P2: WhatsApp down (Agent 12 cannot cascade)
    condition: (checks: HealthCheckResult[]) =>
      checks.find((c) => c.service === "whatsapp")?.status === "DOWN",
    severity: "P2_HIGH" as const,
    title: "WhatsApp Business API Caído — Agente 12 Sin Función",
    affectedServices: ["whatsapp"],
    description:
      "La API de WhatsApp Business no responde. El Agente 12 de Cobertura no puede enviar cascadas. Las iglesias en servicio dominical no tienen respaldo automático.",
  },
  {
    // P3: Email delivery down
    condition: (checks: HealthCheckResult[]) =>
      checks.find((c) => c.service === "mailgun")?.status === "DOWN",
    severity: "P3_MEDIUM" as const,
    title: "Entrega de Email (Mailgun) Degradada",
    affectedServices: ["mailgun"],
    description:
      "Mailgun no responde. El envío de emails de comunicación y notificaciones puede estar fallando.",
  },
];

// ── MAIN SRE CYCLE ────────────────────────────────────────────
export async function runSRECycle(): Promise<{
  checksRun: number;
  incidentsDetected: number;
  incidentsResolved: number;
  overallStatus: string;
}> {
  if (process.env.ENABLE_SRE_ENGINEER !== "true") {
    return {
      checksRun: 0,
      incidentsDetected: 0,
      incidentsResolved: 0,
      overallStatus: "DISABLED",
    };
  }

  // 1. Run all health checks
  const checks = await runAllHealthChecks();
  const summary = summarizeHealth(checks);

  // 2. Detect new incidents
  const newIncidents = await detectAndCreateIncidents(checks);

  // 3. Check if existing active incidents have resolved
  const resolvedCount = await resolveRecoveredIncidents(checks);

  // 4. Update SRE dashboard stats in Redis cache
  await cacheCurrentStatus(checks, summary);

  return {
    checksRun: checks.length,
    incidentsDetected: newIncidents,
    incidentsResolved: resolvedCount,
    overallStatus: summary.overall,
  };
}

// ── INCIDENT DETECTION ────────────────────────────────────────
async function detectAndCreateIncidents(
  checks: HealthCheckResult[],
): Promise<number> {
  let newIncidentCount = 0;

  for (const rule of INCIDENT_RULES) {
    if (!rule.condition(checks)) continue;

    // Check if this incident type is already open
    const existing = await db.platform_incidents.findFirst({
      where: {
        title: rule.title,
        status: {
          in: ["DETECTED", "ACKNOWLEDGED", "INVESTIGATING", "MITIGATING"],
        },
      },
    });

    if (existing) continue; // Already tracking this incident

    // Determine affected tenant count
    const activeTenants = await db.churches.count({
      where: { isActive: true },
    });
    const affectedTenants =
      rule.severity === "P1_CRITICAL"
        ? activeTenants
        : rule.severity === "P2_HIGH"
          ? Math.ceil(activeTenants * 0.5)
          : Math.ceil(activeTenants * 0.1);

    // Calculate affected services from live checks
    const affectedServices =
      rule.affectedServices.length > 0
        ? rule.affectedServices
        : checks.filter((c) => c.status !== "HEALTHY").map((c) => c.service);

    // Create incident record
    const incident = await db.platform_incidents.create({
      data: {
        title: rule.title,
        description: rule.description,
        severity: rule.severity,
        status: "DETECTED",
        affectedServices,
        affectedTenants,
        detectedAt: new Date(),
        isAutoDetected: true,
      },
    });

    // Add timeline event
    await db.incident_timeline_events.create({
      data: {
        incidentId: incident.id,
        event: "DETECTED",
        description: `Incidente detectado automáticamente por el Agente SRE. ${rule.description}`,
        author: "SRE-Agent",
      },
    });

    // Fire alert cascade
    await sendAlertCascade({
      incidentId: incident.id,
      title: rule.title,
      severity: rule.severity,
      description: rule.description,
      affectedServices,
      detectedAt: incident.detectedAt,
    });

    // Add alert sent timeline event
    await db.incident_timeline_events.create({
      data: {
        incidentId: incident.id,
        event: "ALERT_SENT",
        description: `Alertas enviadas vía: WhatsApp, Email${rule.severity === "P1_CRITICAL" ? ", SMS" : ""}`,
        author: "SRE-Agent",
      },
    });

    newIncidentCount++;
    console.log(`[SRE] New incident created: ${rule.severity} — ${rule.title}`);
  }

  return newIncidentCount;
}

// ── INCIDENT RESOLUTION ───────────────────────────────────────
async function resolveRecoveredIncidents(
  checks: HealthCheckResult[],
): Promise<number> {
  const activeIncidents = await db.platform_incidents.findMany({
    where: {
      status: {
        in: ["DETECTED", "ACKNOWLEDGED", "INVESTIGATING", "MITIGATING"],
      },
      isAutoDetected: true,
    },
    select: { id: true, title: true, affectedServices: true, detectedAt: true },
  });

  let resolvedCount = 0;

  for (const incident of activeIncidents) {
    // Check if all affected services are now healthy
    const allHealthy = (incident.affectedServices as string[]).every((svc) => {
      const check = checks.find((c) => c.service === svc);
      return !check || check.status === "HEALTHY";
    });

    if (!allHealthy) continue;

    const resolvedAt = new Date();
    const timeToResolveMs =
      resolvedAt.getTime() - new Date(incident.detectedAt).getTime();

    await db.platform_incidents.update({
      where: { id: incident.id },
      data: {
        status: "POST_MORTEM_PENDING",
        resolvedAt,
        resolvedBy: "SRE-Agent",
        timeToResolveMs,
      },
    });

    await db.incident_timeline_events.create({
      data: {
        incidentId: incident.id,
        event: "RESOLVED",
        description: `Todos los servicios afectados reportan estado HEALTHY. Incidente resuelto automáticamente en ${Math.round(timeToResolveMs / 60000)} minutos.`,
        author: "SRE-Agent",
      },
    });

    // Generate post-mortem for P1/P2 incidents
    if (timeToResolveMs > 5 * 60 * 1000) {
      // only if lasted >5 min
      await generatePostMortem(incident.id, incident.title, timeToResolveMs);
    }

    // Send resolution notification
    await sendResolutionAlert(incident.id, incident.title, timeToResolveMs);

    resolvedCount++;
    console.log(
      `[SRE] Incident resolved: ${incident.title} (${Math.round(timeToResolveMs / 60000)} min)`,
    );
  }

  return resolvedCount;
}

// ── AI POST-MORTEM GENERATION ─────────────────────────────────
export async function generatePostMortem(
  incidentId: string,
  incidentTitle: string,
  durationMs: number,
): Promise<void> {
  try {
    const timeline = await db.incident_timeline_events.findMany({
      where: { incidentId },
      orderBy: { createdAt: "asc" },
    });

    const incident = await db.platform_incidents.findUnique({
      where: { id: incidentId },
      select: {
        severity: true,
        affectedServices: true,
        affectedTenants: true,
        alertsSent: true,
      },
    });

    if (!incident) return;

    const prompt = `Eres el Agente SRE de Khesed-Tek, un sistema de gestión de iglesias latinoamericanas.
Genera un post-mortem profesional en español para el siguiente incidente.

INCIDENTE: ${incidentTitle}
SEVERIDAD: ${incident.severity}
DURACIÓN: ${Math.round(durationMs / 60000)} minutos
SERVICIOS AFECTADOS: ${(incident.affectedServices as string[]).join(", ")}
IGLESIAS IMPACTADAS: ${incident.affectedTenants}
ALERTAS ENVIADAS: ${incident.alertsSent}

LÍNEA DE TIEMPO:
${timeline.map((t) => `[${t.createdAt.toISOString()}] ${t.event}: ${t.description}`).join("\n")}

STACK TÉCNICO: Next.js 16, Supabase (PostgreSQL), Redis (Upstash), Vercel, WhatsApp Business API

Genera el post-mortem en formato JSON (sin markdown):
{
  "rootCause": "Análisis técnico de la causa raíz en 2-3 oraciones",
  "resolution": "Qué acciones resolvieron el incidente",
  "impact": "Impacto real en las iglesias y sus operaciones ministeriales",
  "lessonsLearned": "3 lecciones aprendidas",
  "actionItems": ["Acción correctiva 1", "Acción correctiva 2", "Acción preventiva 3"],
  "postMortemText": "Post-mortem completo en formato narrativo (4-5 párrafos)"
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

    const pm = JSON.parse(rawText);

    await db.platform_incidents.update({
      where: { id: incidentId },
      data: {
        status: "CLOSED",
        rootCause: pm.rootCause,
        resolution: pm.resolution,
        postMortem: pm.postMortemText,
      },
    });

    await db.incident_timeline_events.create({
      data: {
        incidentId,
        event: "UPDATE",
        description: `Post-mortem generado automáticamente por el Agente SRE. Causa raíz: ${pm.rootCause}`,
        author: "SRE-Agent",
      },
    });
  } catch (err) {
    console.error("[SRE] Post-mortem generation failed:", err);
    // Mark as pending but don't crash
    await db.platform_incidents
      .update({
        where: { id: incidentId },
        data: { status: "POST_MORTEM_PENDING" },
      })
      .catch(() => {});
  }
}

// ── SLA CALCULATION ───────────────────────────────────────────
export async function calculateMonthlySLA(month: string): Promise<void> {
  // month format: 'YYYY-MM'
  const [year, monthNum] = month.split("-").map(Number);
  const monthStart = new Date(year, monthNum - 1, 1);
  const monthEnd = new Date(year, monthNum, 0, 23, 59, 59);
  const totalMs = monthEnd.getTime() - monthStart.getTime();

  // Sum up P1 incident durations in this month
  const p1Incidents = await db.platform_incidents.findMany({
    where: {
      severity: "P1_CRITICAL",
      detectedAt: { gte: monthStart, lte: monthEnd },
      resolvedAt: { not: null },
    },
    select: { timeToResolveMs: true },
  });

  const totalDowntimeMs = p1Incidents.reduce(
    (sum, i) => sum + (i.timeToResolveMs || 0),
    0,
  );

  const actualUptime = 1 - totalDowntimeMs / totalMs;
  const slaBreached = actualUptime < SLA_TARGET;

  for (const tier of ["SEMILLA", "COSECHA", "REINO", "RED"]) {
    await db.platform_sla_records.upsert({
      where: { month_tier: { month, tier } },
      update: {
        actualUptime,
        totalDowntimeMs,
        incidentCount: await db.platform_incidents.count({
          where: { detectedAt: { gte: monthStart, lte: monthEnd } },
        }),
        p1IncidentCount: p1Incidents.length,
        slaBreached,
      },
      create: {
        month,
        tier,
        targetUptime: SLA_TARGET,
        actualUptime,
        totalDowntimeMs,
        incidentCount: 0,
        p1IncidentCount: p1Incidents.length,
        slaBreached,
      },
    });
  }
}

// ── DATA RETENTION CLEANUP ────────────────────────────────────
// 30 days raw metrics, 90 days incidents, 1 year summaries
export async function runDataRetentionCleanup(): Promise<{
  metricsDeleted: number;
  checksDeleted: number;
}> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  const [metricsResult, checksResult] = await Promise.all([
    db.api_request_metrics.deleteMany({
      where: { requestedAt: { lt: thirtyDaysAgo } },
    }),
    db.platform_health_checks.deleteMany({
      where: { checkedAt: { lt: thirtyDaysAgo } },
    }),
  ]);

  // Archive closed incidents older than 90 days (just delete raw timeline)
  const oldIncidents = await db.platform_incidents.findMany({
    where: {
      status: "CLOSED",
      resolvedAt: { lt: ninetyDaysAgo },
    },
    select: { id: true },
  });

  if (oldIncidents.length > 0) {
    await db.incident_timeline_events.deleteMany({
      where: { incidentId: { in: oldIncidents.map((i) => i.id) } },
    });
  }

  return {
    metricsDeleted: metricsResult.count,
    checksDeleted: checksResult.count,
  };
}

// ── HELPERS ───────────────────────────────────────────────────
async function cacheCurrentStatus(
  checks: HealthCheckResult[],
  summary: { overall: string; downCount: number; degradedCount: number },
): Promise<void> {
  try {
    const { Redis } = await import("@upstash/redis");
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    await redis.setex(
      "platform:sre:status",
      120, // 2 min TTL
      JSON.stringify({ checks, summary, updatedAt: new Date().toISOString() }),
    );
  } catch {
    /* non-critical */
  }
}

async function sendResolutionAlert(
  incidentId: string,
  title: string,
  durationMs: number,
): Promise<void> {
  const adminPhone = process.env.SRE_ADMIN_WHATSAPP;
  if (!adminPhone) return;

  const minutes = Math.round(durationMs / 60000);
  const message =
    `✅ *INCIDENTE RESUELTO*\n\n` +
    `📋 ${title}\n` +
    `⏱ Duración: ${minutes} minutos\n` +
    `🔗 Ver post-mortem: ${process.env.NEXTAUTH_URL}/platform/agents/sre/incidents/${incidentId}`;

  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!phoneId || !token) return;

  await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: adminPhone.replace(/\D/g, ""),
      type: "text",
      text: { body: message },
    }),
  }).catch(() => {});
}
