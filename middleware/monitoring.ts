import { NextRequest, NextResponse } from "next/server";

// Helper functions for extracting church and user IDs from request
function extractChurchId(request: NextRequest): string {
  const churchId =
    request.headers.get("x-church-id") ||
    request.nextUrl.searchParams.get("churchId");
  return churchId || "unknown";
}

function extractUserId(request: NextRequest): string {
  const userId =
    request.headers.get("x-user-id") ||
    request.nextUrl.searchParams.get("userId");
  return userId || "unknown";
}

export async function monitoringMiddleware(
  request: NextRequest,
  response: NextResponse,
) {
  const startTime = Date.now();

  // 1. Extract Metrics
  const durationMs = Date.now() - startTime;
  const statusCode = response.status;
  const isError = statusCode >= 400;

  // Call your extraction functions here
  const churchId =
    typeof extractChurchId === "function"
      ? extractChurchId(request)
      : "unknown";
  const userId =
    typeof extractUserId === "function" ? extractUserId(request) : "unknown";

  // 2. Prepare Payload
  const payload = {
    churchId,
    userId,
    path: request.nextUrl.pathname,
    method: request.method,
    status: statusCode,
    durationMs,
    isError,
    timestamp: new Date().toISOString(),
  };

  // 3. Send Metrics (The Fix)
  // We construct the URL dynamically to ensure we hit the correct deployment.
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
  const targetUrl = `${appUrl}/api/monitoring/collect`;

  try {
    // Fire and forget with a timeout to prevent blocking the response
    // 'keepalive: true' helps ensure the request isn't dropped immediately
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: "no-store",
      keepalive: true,
    });

    clearTimeout(timeoutId);
  } catch (error: any) {
    // The Fix: Silently handle network errors so they don't crash the app or spam logs
    // This happens often on Vercel during cold starts or routing shifts.
    if (error.name !== "AbortError") {
      console.warn(
        "[MONITORING] Network call skipped (non-critical):",
        error.message,
      );
    }
  }
}
