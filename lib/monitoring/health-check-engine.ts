// lib/monitoring/health-check-engine.ts
// MONITORING FOUNDATION — Layer 1
// Checks all system components and external integrations.
// Called by the SRE agent cron every 60 seconds.

import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

export type ServiceName =
  | "database"
  | "redis"
  | "production_url"
  | "stripe"
  | "paddle"
  | "resend"
  | "twilio"
  | "whatsapp"
  | "openrouter"
  | "vercel_api"
  | "supabase_api";

export interface HealthCheckResult {
  service: ServiceName;
  status: "HEALTHY" | "DEGRADED" | "DOWN" | "UNKNOWN";
  responseTimeMs: number | null;
  errorMessage: string | null;
  metadata: Record<string, unknown> | null;
}

// ── SLA THRESHOLDS ────────────────────────────────────────────
const RESPONSE_THRESHOLDS = {
  // ⚠️ Umbrales ajustados para plan gratuito de Supabase/Upstash (Jun 2026)
  // Database latencia real: ~620ms (plan gratuito compartido)
  // Redis latencia real: ~290ms (plan gratuito REST API)
  // TODO: Cuando haya suscriptores pagos, reducir a valores óptimos
  database: { healthy: 800, degraded: 2000 }, // ms
  redis: { healthy: 400, degraded: 1000 },
  production_url: { healthy: 2000, degraded: 5000 },
  stripe: { healthy: 500, degraded: 2000 },
  resend: { healthy: 500, degraded: 2000 },
  twilio: { healthy: 500, degraded: 2000 },
  whatsapp: { healthy: 800, degraded: 3000 },
  openrouter: { healthy: 500, degraded: 2000 },
  paddle: { healthy: 500, degraded: 2000 },
  vercel_api: { healthy: 500, degraded: 2000 },
  supabase_api: { healthy: 300, degraded: 1000 },
};

function classify(
  service: ServiceName,
  responseTimeMs: number,
): "HEALTHY" | "DEGRADED" {
  const t = RESPONSE_THRESHOLDS[service] || { healthy: 1000, degraded: 3000 };
  return responseTimeMs <= t.healthy ? "HEALTHY" : "DEGRADED";
}

// ── CHECK: Database (Prisma + Supabase) ───────────────────────
async function checkDatabase(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    // Simple query that exercises the connection pool
    const result = await db.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count FROM churches WHERE "isActive" = true
    `;
    const ms = Date.now() - start;
    const churchCount = Number(result[0]?.count || 0);

    return {
      service: "database",
      status: classify("database", ms),
      responseTimeMs: ms,
      errorMessage: null,
      metadata: {
        activeTenants: churchCount,
        queryTimeMs: ms,
      },
    };
  } catch (err) {
    return {
      service: "database",
      status: "DOWN",
      responseTimeMs: Date.now() - start,
      errorMessage: err instanceof Error ? err.message : String(err),
      metadata: null,
    };
  }
}

// ── CHECK: Redis ──────────────────────────────────────────────
async function checkRedis(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    // Dynamic import to avoid issues if Redis is not configured
    const { Redis } = await import("@upstash/redis");
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    const pingResult = await redis.ping();
    const ms = Date.now() - start;

    // Upstash Redis SDK does not expose info() in current typings.
    const usedMemoryMb = null;

    return {
      service: "redis",
      status: pingResult === "PONG" ? classify("redis", ms) : "DEGRADED",
      responseTimeMs: ms,
      errorMessage: null,
      metadata: { ping: pingResult, usedMemory: usedMemoryMb },
    };
  } catch (err) {
    return {
      service: "redis",
      status: "DOWN",
      responseTimeMs: Date.now() - start,
      errorMessage: err instanceof Error ? err.message : String(err),
      metadata: null,
    };
  }
}

// ── CHECK: Production URL ─────────────────────────────────────
async function checkProductionUrl(): Promise<HealthCheckResult> {
  const start = Date.now();
  const url =
    process.env.NEXTAUTH_URL || "https://khesed-tek-cms-org.vercel.app";

  try {
    const res = await fetch(`${url}/api/health`, {
      method: "GET",
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "KhesedTek-SRE-Agent/1.0" },
    });
    const ms = Date.now() - start;

    return {
      service: "production_url",
      status: res.ok ? classify("production_url", ms) : "DEGRADED",
      responseTimeMs: ms,
      errorMessage: res.ok ? null : `HTTP ${res.status}`,
      metadata: { statusCode: res.status, url },
    };
  } catch (err) {
    return {
      service: "production_url",
      status: "DOWN",
      responseTimeMs: Date.now() - start,
      errorMessage:
        err instanceof Error ? err.message : "Timeout or unreachable",
      metadata: { url },
    };
  }
}

// ── CHECK: Stripe ─────────────────────────────────────────────
async function checkStripe(): Promise<HealthCheckResult> {
  const start = Date.now();
  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      service: "stripe",
      status: "UNKNOWN",
      responseTimeMs: null,
      errorMessage: "Not configured",
      metadata: null,
    };
  }
  try {
    const res = await fetch("https://api.stripe.com/v1/balance", {
      headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
      signal: AbortSignal.timeout(5000),
    });
    const ms = Date.now() - start;
    return {
      service: "stripe",
      status: res.ok ? classify("stripe", ms) : "DEGRADED",
      responseTimeMs: ms,
      errorMessage: res.ok ? null : `HTTP ${res.status}`,
      metadata: { statusCode: res.status },
    };
  } catch (err) {
    return {
      service: "stripe",
      status: "DOWN",
      responseTimeMs: Date.now() - start,
      errorMessage: String(err),
      metadata: null,
    };
  }
}

// ── CHECK: WhatsApp Business API ──────────────────────────────
async function checkWhatsApp(): Promise<HealthCheckResult> {
  const start = Date.now();
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneId) {
    return {
      service: "whatsapp",
      status: "UNKNOWN",
      responseTimeMs: null,
      errorMessage: "Not configured",
      metadata: null,
    };
  }
  try {
    const res = await fetch(
      `https://graph.facebook.com/v18.0/${phoneId}?fields=display_phone_number,status`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(5000),
      },
    );
    const ms = Date.now() - start;
    const data = res.ok ? await res.json() : null;
    return {
      service: "whatsapp",
      status: res.ok ? classify("whatsapp", ms) : "DEGRADED",
      responseTimeMs: ms,
      errorMessage: res.ok ? null : `HTTP ${res.status}`,
      metadata: { phone: data?.display_phone_number, apiStatus: data?.status },
    };
  } catch (err) {
    return {
      service: "whatsapp",
      status: "DOWN",
      responseTimeMs: Date.now() - start,
      errorMessage: String(err),
      metadata: null,
    };
  }
}

// ── CHECK: Resend ────────────────────────────────────────────
async function checkResend(): Promise<HealthCheckResult> {
  const start = Date.now();
  const key = process.env.RESEND_API_KEY;
  if (!key)
    return {
      service: "resend",
      status: "UNKNOWN",
      responseTimeMs: null,
      errorMessage: "Not configured",
      metadata: null,
    };
  try {
    const res = await fetch("https://api.resend.com/domains", {
      headers: {
        Authorization: `Bearer ${key}`,
      },
      signal: AbortSignal.timeout(5000),
    });
    const ms = Date.now() - start;
    return {
      service: "resend",
      status: res.ok ? classify("resend", ms) : "DEGRADED",
      responseTimeMs: ms,
      errorMessage: res.ok ? null : `HTTP ${res.status}`,
      metadata: { statusCode: res.status },
    };
  } catch (err) {
    return {
      service: "resend",
      status: "DOWN",
      responseTimeMs: Date.now() - start,
      errorMessage: String(err),
      metadata: null,
    };
  }
}

// ── CHECK: Twilio ─────────────────────────────────────────────
async function checkTwilio(): Promise<HealthCheckResult> {
  const start = Date.now();
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token)
    return {
      service: "twilio",
      status: "UNKNOWN",
      responseTimeMs: null,
      errorMessage: "Not configured",
      metadata: null,
    };
  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}.json`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        },
        signal: AbortSignal.timeout(5000),
      },
    );
    const ms = Date.now() - start;
    return {
      service: "twilio",
      status: res.ok ? classify("twilio", ms) : "DEGRADED",
      responseTimeMs: ms,
      errorMessage: res.ok ? null : `HTTP ${res.status}`,
      metadata: { statusCode: res.status },
    };
  } catch (err) {
    return {
      service: "twilio",
      status: "DOWN",
      responseTimeMs: Date.now() - start,
      errorMessage: String(err),
      metadata: null,
    };
  }
}

// ── CHECK: OpenRouter (Primary AI Provider for all 15 agents) ───
async function checkOpenRouter(): Promise<HealthCheckResult> {
  const start = Date.now();
  // Lectura robusta de variable de entorno con fallback y logging
  const apiKey = process.env.OPENROUTER_API_KEY;
  console.log("[OpenRouter Health] API Key present:", !!apiKey);
  console.log(
    "[OpenRouter Health] API Key prefix:",
    apiKey ? apiKey.substring(0, 15) + "..." : "N/A",
  );
  if (!apiKey) {
    return {
      service: "openrouter",
      status: "UNKNOWN",
      responseTimeMs: null,
      errorMessage: "OPENROUTER_API_KEY not configured in server env",
      metadata: { envCheck: !!process.env.OPENROUTER_API_KEY },
    };
  }
  try {
    // Ping a la API de OpenRouter para verificar disponibilidad y autenticación
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
        "X-Title": "Khesed-Tek CMS SRE Monitor",
      },
      signal: AbortSignal.timeout(5000),
    });
    const ms = Date.now() - start;
    console.log(`[OpenRouter Health] Response: ${res.status} in ${ms}ms`);
    // 200 OK significa que la API responde y la key es válida
    const apiAlive = res.ok;
    return {
      service: "openrouter",
      status: apiAlive ? classify("openrouter", ms) : "DOWN",
      responseTimeMs: ms,
      errorMessage: apiAlive
        ? null
        : `HTTP ${res.status}: ${await res.text().catch(() => "No body")}`,
      metadata: {
        statusCode: res.status,
        provider: "OpenRouter",
        endpoint: "/api/v1/models",
        envCheck: !!process.env.OPENROUTER_API_KEY,
      },
    };
  } catch (err) {
    console.error("[OpenRouter Health] Error:", err);
    return {
      service: "openrouter",
      status: "DOWN",
      responseTimeMs: Date.now() - start,
      errorMessage: String(err),
      metadata: null,
    };
  }
}

// ── CHECK: Paddle (Primary Payment Processor - Merchant of Record) ───
async function checkPaddle(): Promise<HealthCheckResult> {
  const start = Date.now();
  const apiKey = process.env.PADDLE_API_KEY;

  if (!apiKey) {
    return {
      service: "paddle",
      status: "UNKNOWN",
      responseTimeMs: null,
      errorMessage: "PADDLE_API_KEY not configured in server env",
      metadata: { envCheck: false },
    };
  }

  try {
    // Detectar automáticamente si es Sandbox o Producción
    const isSandbox = apiKey.startsWith("test_");
    const baseUrl = isSandbox
      ? "https://sandbox-api.paddle.com"
      : "https://api.paddle.com";

    const res = await fetch(`${baseUrl}/products?per_page=1`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(5000),
    });

    const ms = Date.now() - start;
    const isUp = res.ok;

    return {
      service: "paddle",
      status: isUp ? classify("paddle", ms) : "DOWN",
      responseTimeMs: ms,
      errorMessage: isUp
        ? null
        : `HTTP ${res.status}: ${await res.text().catch(() => "No body")}`,
      metadata: {
        statusCode: res.status,
        environment: isSandbox ? "sandbox" : "production",
        endpoint: `${baseUrl}/products`,
      },
    };
  } catch (err) {
    return {
      service: "paddle",
      status: "DOWN",
      responseTimeMs: Date.now() - start,
      errorMessage: err instanceof Error ? err.message : String(err),
      metadata: null,
    };
  }
}

// ── RUN ALL CHECKS ────────────────────────────────────────────
export async function runAllHealthChecks(): Promise<HealthCheckResult[]> {
  // Run all checks in parallel — never wait for one to block others
  const results = await Promise.allSettled([
    checkDatabase(),
    checkRedis(),
    checkProductionUrl(),
    checkStripe(),
    checkWhatsApp(),
    checkResend(),
    checkTwilio(),
    checkOpenRouter(),
    checkPaddle(),
  ]);

  const checks: HealthCheckResult[] = results.map((r, i) => {
    if (r.status === "fulfilled") return r.value;
    const services: ServiceName[] = [
      "database",
      "redis",
      "production_url",
      "stripe",
      "whatsapp",
      "resend",
      "twilio",
      "openrouter",
      "paddle",
    ];
    return {
      service: services[i],
      status: "UNKNOWN" as const,
      responseTimeMs: null,
      errorMessage: "Check threw an exception",
      metadata: null,
    };
  });

  // Persist all results to DB
  await persistHealthChecks(checks);

  return checks;
}

async function persistHealthChecks(checks: HealthCheckResult[]): Promise<void> {
  try {
    await db.platform_health_checks.createMany({
      data: checks.map((c) => ({
        service: c.service,
        status: c.status,
        responseTimeMs: c.responseTimeMs,
        errorMessage: c.errorMessage,
        metadata: c.metadata
          ? (c.metadata as Prisma.InputJsonValue)
          : undefined,
      })),
    });
  } catch (err) {
    console.error("[HEALTH_CHECK] Failed to persist results:", err);
  }
}

// ── QUICK STATUS SUMMARY ──────────────────────────────────────
export function summarizeHealth(checks: HealthCheckResult[]): {
  overall: "HEALTHY" | "DEGRADED" | "DOWN";
  downCount: number;
  degradedCount: number;
  healthyCount: number;
} {
  const down = checks.filter((c) => c.status === "DOWN").length;
  const degraded = checks.filter((c) => c.status === "DEGRADED").length;
  const healthy = checks.filter((c) => c.status === "HEALTHY").length;

  let overall: "HEALTHY" | "DEGRADED" | "DOWN" = "HEALTHY";
  if (down > 0 || (down === 0 && degraded >= 3)) overall = "DOWN";
  else if (degraded > 0) overall = "DEGRADED";

  return {
    overall,
    downCount: down,
    degradedCount: degraded,
    healthyCount: healthy,
  };
}
