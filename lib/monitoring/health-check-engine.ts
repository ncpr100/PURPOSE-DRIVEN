// lib/monitoring/health-check-engine.ts
// MONITORING FOUNDATION — Layer 1
// Checks all system components and external integrations.
// Called by the SRE agent cron every 60 seconds.

import { db } from "@/lib/db";

export type ServiceName =
  | "database"
  | "redis"
  | "production_url"
  | "stripe"
  | "paddle"
  | "mailgun"
  | "twilio"
  | "whatsapp"
  | "mercadopago"
  | "abacusai"
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
  database:        { healthy: 100,  degraded: 500  }, // ms
  redis:           { healthy: 20,   degraded: 100  },
  production_url:  { healthy: 2000, degraded: 5000 },
  stripe:          { healthy: 500,  degraded: 2000 },
  mailgun:         { healthy: 500,  degraded: 2000 },
  twilio:          { healthy: 500,  degraded: 2000 },
  whatsapp:        { healthy: 800,  degraded: 3000 },
  mercadopago:     { healthy: 500,  degraded: 2000 },
  abacusai:        { healthy: 1000, degraded: 4000 },
  paddle:          { healthy: 500,  degraded: 2000 },
  vercel_api:      { healthy: 500,  degraded: 2000 },
  supabase_api:    { healthy: 300,  degraded: 1000 },
};

function classify(
  service: ServiceName,
  responseTimeMs: number
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

    // Get memory info
    let usedMemoryMb = null;
    try {
      const info = await redis.info("memory");
      const match = info.match(/used_memory_human:(\S+)/);
      usedMemoryMb = match?.[1] || null;
    } catch { /* non-critical */ }

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
      errorMessage: err instanceof Error ? err.message : "Timeout or unreachable",
      metadata: { url },
    };
  }
}

// ── CHECK: Stripe ─────────────────────────────────────────────
async function checkStripe(): Promise<HealthCheckResult> {
  const start = Date.now();
  if (!process.env.STRIPE_SECRET_KEY) {
    return { service: "stripe", status: "UNKNOWN", responseTimeMs: null, errorMessage: "Not configured", metadata: null };
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
    return { service: "stripe", status: "DOWN", responseTimeMs: Date.now() - start, errorMessage: String(err), metadata: null };
  }
}

// ── CHECK: WhatsApp Business API ──────────────────────────────
async function checkWhatsApp(): Promise<HealthCheckResult> {
  const start = Date.now();
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneId) {
    return { service: "whatsapp", status: "UNKNOWN", responseTimeMs: null, errorMessage: "Not configured", metadata: null };
  }
  try {
    const res = await fetch(
      `https://graph.facebook.com/v18.0/${phoneId}?fields=display_phone_number,status`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(5000),
      }
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
    return { service: "whatsapp", status: "DOWN", responseTimeMs: Date.now() - start, errorMessage: String(err), metadata: null };
  }
}

// ── CHECK: Mailgun ────────────────────────────────────────────
async function checkMailgun(): Promise<HealthCheckResult> {
  const start = Date.now();
  const key = process.env.MAILGUN_API_KEY;
  if (!key) return { service: "mailgun", status: "UNKNOWN", responseTimeMs: null, errorMessage: "Not configured", metadata: null };
  try {
    const res = await fetch("https://api.mailgun.net/v3/domains", {
      headers: { Authorization: `Basic ${Buffer.from(`api:${key}`).toString("base64")}` },
      signal: AbortSignal.timeout(5000),
    });
    const ms = Date.now() - start;
    return {
      service: "mailgun",
      status: res.ok ? classify("mailgun", ms) : "DEGRADED",
      responseTimeMs: ms,
      errorMessage: res.ok ? null : `HTTP ${res.status}`,
      metadata: { statusCode: res.status },
    };
  } catch (err) {
    return { service: "mailgun", status: "DOWN", responseTimeMs: Date.now() - start, errorMessage: String(err), metadata: null };
  }
}

// ── CHECK: Twilio ─────────────────────────────────────────────
async function checkTwilio(): Promise<HealthCheckResult> {
  const start = Date.now();
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return { service: "twilio", status: "UNKNOWN", responseTimeMs: null, errorMessage: "Not configured", metadata: null };
  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}.json`, {
      headers: { Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}` },
      signal: AbortSignal.timeout(5000),
    });
    const ms = Date.now() - start;
    return {
      service: "twilio",
      status: res.ok ? classify("twilio", ms) : "DEGRADED",
      responseTimeMs: ms,
      errorMessage: res.ok ? null : `HTTP ${res.status}`,
      metadata: { statusCode: res.status },
    };
  } catch (err) {
    return { service: "twilio", status: "DOWN", responseTimeMs: Date.now() - start, errorMessage: String(err), metadata: null };
  }
}

// ── CHECK: AbacusAI ───────────────────────────────────────────
async function checkAbacusAI(): Promise<HealthCheckResult> {
  const start = Date.now();
  const key = process.env.ABACUSAI_API_KEY;
  if (!key) return { service: "abacusai", status: "UNKNOWN", responseTimeMs: null, errorMessage: "Not configured", metadata: null };
  try {
    const res = await fetch("https://api.abacus.ai/api/v0/listProjects", {
      headers: { "apiKey": key },
      signal: AbortSignal.timeout(6000),
    });
    const ms = Date.now() - start;
    return {
      service: "abacusai",
      status: res.ok ? classify("abacusai", ms) : "DEGRADED",
      responseTimeMs: ms,
      errorMessage: res.ok ? null : `HTTP ${res.status}`,
      metadata: { statusCode: res.status },
    };
  } catch (err) {
    return { service: "abacusai", status: "DOWN", responseTimeMs: Date.now() - start, errorMessage: String(err), metadata: null };
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
    checkMailgun(),
    checkTwilio(),
    checkAbacusAI(),
  ]);

  const checks: HealthCheckResult[] = results.map((r, i) => {
    if (r.status === "fulfilled") return r.value;
    const services: ServiceName[] = [
      "database", "redis", "production_url", "stripe",
      "whatsapp", "mailgun", "twilio", "abacusai",
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
        metadata: c.metadata ?? undefined,
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

  return { overall, downCount: down, degradedCount: degraded, healthyCount: healthy };
}
