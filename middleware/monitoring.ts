// middleware/monitoring.ts
// MONITORING FOUNDATION — Layer 1
// Intercepts every API request and records response time, status, errors.
// This is the data source for BOTH Agent 13 and Agent 14.

import { NextRequest, NextResponse } from "next/server";

// Routes to exclude from monitoring (too noisy, no value)
const EXCLUDED_ROUTES = [
  "/api/health", // our own health checks
  "/api/monitoring/collect", // our own metrics collector
  "/_next", // Next.js internals
  "/favicon",
  "/static",
];

// Detect Vercel cold starts (first invocation after idle)
let isWarm = false;

export async function monitoringMiddleware(
  request: NextRequest,
  handler: () => Promise<NextResponse>,
): Promise<NextResponse> {
  const url = new URL(request.url);
  const route = url.pathname;

  // Skip excluded routes
  if (EXCLUDED_ROUTES.some((ex) => route.startsWith(ex))) {
    return handler();
  }

  const startTime = Date.now();
  const wasColdStart = !isWarm;
  isWarm = true;

  let response: NextResponse;
  let errorMessage: string | undefined;

  // === MONITORING DISABLED FOR VERCEL ===
  // Self-referential fetch calls cause ECONNRESET on Vercel serverless
  // Re-enable later with Upstash QStash or Vercel Analytics if needed
  const durationMs = Date.now() - startTime;
  const statusCode = response?.status || 200; // Safe fallback
  const isError = statusCode >= 400;
  const churchId = extractChurchId(request);
  const userId = extractUserId(request);
  // === END MONITORING BLOCK ===
  // Fire-and-forget metric write — never blocks the response
  recordMetric({
    route: normalizeRoute(route),
    method: request.method,
    statusCode,
    durationMs,
    churchId,
    userId,
    isError,
    errorMessage,
    isColdStart: wasColdStart,
    region: process.env.VERCEL_REGION,
    userAgent: request.headers.get("user-agent") || undefined,
  }).catch((err) => {
    console.error("[MONITORING_MIDDLEWARE] Failed to record metric:", err);
  });

  return response;
}

// ── Normalize dynamic route segments ─────────────────────────
function normalizeRoute(route: string): string {
  return route
    .replace(/\/[a-z0-9]{20,}/gi, "/[id]")
    .replace(/\/\d+/g, "/[id]")
    .replace(/\/[0-9a-f-]{36}/gi, "/[uuid]");
}

// ── Extract IDs from JWT cookie (best-effort) ─────────────────
function extractChurchId(req: NextRequest): string | undefined {
  try {
    const sessionCookie =
      req.cookies.get("next-auth.session-token")?.value ||
      req.cookies.get("__Secure-next-auth.session-token")?.value;
    if (!sessionCookie) return undefined;
    const payload = JSON.parse(
      Buffer.from(sessionCookie.split(".")[1], "base64url").toString(),
    );
    return payload?.churchId;
  } catch {
    return undefined;
  }
}

function extractUserId(req: NextRequest): string | undefined {
  try {
    const sessionCookie =
      req.cookies.get("next-auth.session-token")?.value ||
      req.cookies.get("__Secure-next-auth.session-token")?.value;
    if (!sessionCookie) return undefined;
    const payload = JSON.parse(
      Buffer.from(sessionCookie.split(".")[1], "base64url").toString(),
    );
    return payload?.sub || payload?.id;
  } catch {
    return undefined;
  }
}

// ── Async metric writer ───────────────────────────────────────
interface MetricPayload {
  route: string;
  method: string;
  statusCode: number;
  durationMs: number;
  churchId?: string;
  userId?: string;
  isError: boolean;
  errorMessage?: string;
  isColdStart: boolean;
  region?: string;
  userAgent?: string;
}

async function recordMetric(payload: MetricPayload): Promise<void> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  await fetch(`${baseUrl}/api/monitoring/collect`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Key": process.env.MONITORING_INTERNAL_KEY || "",
    },
    body: JSON.stringify(payload),
  });
}
