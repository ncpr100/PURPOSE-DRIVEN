import { NextRequest, NextResponse } from "next/server";

// ============================================================================
// SAFE EXTRACTION HELPERS (Inline - no external dependencies required)
// ============================================================================

function extractChurchId(request: NextRequest): string {
  try {
    // Try to get from subdomain: church.khesed-tek.com -> church
    const hostname = request.headers.get("host") || "";
    const parts = hostname.split(".");
    if (
      parts.length >= 3 &&
      parts[0] !== "www" &&
      parts[0] !== "khesed-tek-cms-org"
    ) {
      return parts[0];
    }
    // Try to get from URL pathname: /church/[id]/...
    const pathname = request.nextUrl.pathname;
    const match = pathname.match(/\/church\/([^/]+)/);
    if (match?.[1]) return match[1];
    // Try to get from query param: ?churchId=xyz
    const queryId = request.nextUrl.searchParams.get("churchId");
    if (queryId) return queryId;
  } catch {
    // Silent fail - return default
  }
  return "default";
}

function extractUserId(request: NextRequest): string {
  try {
    // Try to get from auth header (if using NextAuth)
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      // Token extraction would require JWT decode - skip for middleware
      // and rely on API route to extract from session
    }
    // Try to get from cookie (NextAuth session)
    const cookies = request.cookies;
    const sessionCookie =
      cookies.get("next-auth.session-token") ||
      cookies.get("__Secure-next-auth.session-token");
    if (sessionCookie?.value) {
      // Return hash of cookie as anonymous ID (don't expose raw token)
      return "user_" + btoa(sessionCookie.value).slice(0, 12);
    }
  } catch {
    // Silent fail
  }
  return "anonymous";
}

// ============================================================================
// MAIN MONITORING MIDDLEWARE
// ============================================================================

export async function monitoringMiddleware(
  request: NextRequest,
  response: NextResponse,
) {
  const startTime = Date.now();

  // 1. Extract metrics (using safe inline helpers above)
  const churchId = extractChurchId(request);
  const userId = extractUserId(request);
  const pathname = request.nextUrl.pathname;
  const method = request.method;
  const statusCode = response.status;
  const isError = statusCode >= 400;
  const durationMs = Date.now() - startTime;

  // 2. Build payload
  const payload = {
    churchId,
    userId,
    path: pathname,
    method,
    status: statusCode,
    durationMs,
    isError,
    timestamp: new Date().toISOString(),
    deployment: process.env.VERCEL_ENV || "development",
    region: process.env.VERCEL_REGION || "unknown",
  };

  // 3. Determine target URL (use env var to avoid dynamic origin issues)
  const targetUrl =
    process.env.MONITORING_WEBHOOK_URL ||
    `${request.nextUrl.origin}/api/monitoring/collect`;

  // 🔥 CRITICAL FIX: Fire-and-forget the fetch, DON'T await it
  // This prevents blocking the callback execution
  const sendMetric = async () => {
    try {
      await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
        cache: "no-store",
        signal: AbortSignal.timeout(2000),
        duplex: "half",
      } as RequestInit & { duplex: "half" });
    } catch (error: any) {
      // Silent fail: network errors should never block the app
      if (
        process.env.NODE_ENV === "development" &&
        error.name !== "AbortError"
      ) {
        console.debug("[MONITORING] Skipped:", error.message);
      }
    }
  };

  // Start the send but DON'T await it - let it run in background
  sendMetric();

  // Return the response immediately (don't wait for monitoring)
  return response;
}
