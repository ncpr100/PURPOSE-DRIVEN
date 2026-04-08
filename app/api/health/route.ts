import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Required environment variables — all must be non-empty for a healthy deployment */
const REQUIRED_ENV_VARS = ["DATABASE_URL", "NEXTAUTH_SECRET", "NEXTAUTH_URL"];

function checkEnvVars(): { ok: boolean; missing: string[] } {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  return { ok: missing.length === 0, missing };
}

/**
 * Health Check Endpoint
 *
 * Vercel / Railway health probe — checks database connectivity, required
 * environment variables, and last applied Prisma migration.
 * Returns 200 when healthy, 503 when any critical check fails.
 */
export async function GET(request: NextRequest) {
  const timestamp = new Date().toISOString();

  // 1. Environment variables
  const envCheck = checkEnvVars();

  // 2. Database connectivity + last migration
  let database: "connected" | "disconnected" = "disconnected";
  let lastMigration: string | null = null;

  try {
    await db.$queryRaw`SELECT 1`;
    database = "connected";

    // Pull the most recently applied Prisma migration name
    const rows = await db.$queryRaw<
      { migration_name: string; finished_at: Date | null }[]
    >`
      SELECT migration_name, finished_at
      FROM _prisma_migrations
      WHERE finished_at IS NOT NULL
      ORDER BY finished_at DESC
      LIMIT 1
    `;
    if (rows.length > 0) {
      lastMigration = rows[0].migration_name;
    }
  } catch {
    // database stays 'disconnected', lastMigration stays null
  }

  const isHealthy = database === "connected" && envCheck.ok;

  const body = {
    status: isHealthy ? "healthy" : "unhealthy",
    timestamp,
    service: "khesed-tek-platform",
    version: process.env.npm_package_version || "1.1.0",
    environment: process.env.NODE_ENV || "production",
    checks: {
      database,
      lastMigration,
      envVars: envCheck.ok ? "ok" : `missing: ${envCheck.missing.join(", ")}`,
      rateLimiting: "removed (was in-memory/non-persistent — @upstash/ratelimit planned for Phase 4, see SOURCE_OF_TRUTH §13.4)",
    },
  };

  return NextResponse.json(body, {
    status: isHealthy ? 200 : 503,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Content-Type": "application/json",
    },
  });
}

/** HEAD — lightweight probe (no DB query) used by load balancers */
export async function HEAD(_request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
  });
}
