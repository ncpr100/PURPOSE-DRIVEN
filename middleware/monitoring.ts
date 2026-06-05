import { NextRequest, NextResponse } from "next/server";

// Helper functions - ensure these are imported or defined
// If they are in another file, add: import { extractChurchId, extractUserId } from '@/lib/utils/extractors';

export async function monitoringMiddleware(
  request: NextRequest,
  response: NextResponse,
) {
  const startTime = Date.now();

  // 1. Extract metrics (your original logic)
  const durationMs = Date.now() - startTime;
  const statusCode = response.status;
  const isError = statusCode >= 400;

  // Safely call extraction functions if they exist
  const churchId =
    typeof extractChurchId === "function"
      ? extractChurchId(request)
      : "unknown";
  const userId =
    typeof extractUserId === "function" ? extractUserId(request) : "anonymous";

  // 2. Build payload
  const payload = {
    churchId,
    userId,
    path: request.nextUrl.pathname,
    method: request.method,
    status: statusCode,
    durationMs,
    isError,
    timestamp: new Date().toISOString(),
    deployment: process.env.VERCEL_ENV || "development",
  };

  // 3. Determine target URL (use env var to avoid origin resolution issues)
  const targetUrl =
    process.env.MONITORING_WEBHOOK_URL ||
    `${request.nextUrl.origin}/api/monitoring/collect`;

  // 4. Fire-and-forget send (DO NOT AWAIT - prevents blocking response)
  // This pattern works reliably on Vercel Edge
  const sendMetric = async () => {
    try {
      await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Khesed-Tek-Monitor/1.0",
        },
        body: JSON.stringify(payload),
        keepalive: true, // Critical: keeps connection alive after response
        duplex: "half", // Critical: required for Edge runtime fetch with body
        cache: "no-store",
        signal: AbortSignal.timeout(2000), // 2 second timeout max
      });
    } catch (error: any) {
      // Silently ignore network errors - they are non-critical for monitoring
      // Logging here would create infinite error loops
      if (
        process.env.NODE_ENV === "development" &&
        error.name !== "AbortError"
      ) {
        console.debug("[MONITORING] Skipped (non-critical):", error.message);
      }
    }
  };

  // Execute without awaiting - middleware must return quickly
  sendMetric();

  // Return the original response unchanged
  return response;
}
