
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Build the database URL with required pgBouncer parameters.
 *
 * Supabase's Supavisor transaction pooler (port 6543) does NOT support
 * PostgreSQL prepared statements. Without `pgbouncer=true`, Prisma's Rust
 * query engine will crash (PrismaClientRustPanicError) causing ALL in-flight
 * queries to throw PrismaClientUnknownRequestError in a cascade.
 *
 * `connection_limit=1` prevents connection pool exhaustion in serverless
 * environments where many Lambda instances share the same DB connection pool.
 */
function buildDatabaseUrl(): string {
  const url = process.env.DATABASE_URL || ''
  const directUrl = process.env.DIRECT_URL || ''

  // Log a clear diagnostic for any missing env vars so Vercel logs show the root cause
  const missing: string[] = []
  if (!url) missing.push('DATABASE_URL')
  if (!directUrl) missing.push('DIRECT_URL')

  if (missing.length > 0) {
    console.error(
      `🚨 CRITICAL: The following required environment variables are NOT set: ${missing.join(', ')}\n` +
      '   Both DATABASE_URL and DIRECT_URL are required by prisma/schema.prisma.\n' +
      '   All database operations will fail until these are configured.\n\n' +
      '   → In Vercel: Project → Settings → Environment Variables\n\n' +
      '   DATABASE_URL  (Supabase transaction pooler – port 6543):\n' +
      '     postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1\n\n' +
      '   DIRECT_URL  (Supabase direct connection – port 5432):\n' +
      '     postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres\n\n' +
      '   Get both strings from: Supabase Dashboard → Project → Settings → Database → Connection String\n' +
      '   Also verify NEXTAUTH_SECRET and NEXTAUTH_URL are set.'
    )
  }

  if (!url) return ''

  if (url.includes(':6543') && !url.includes('pgbouncer=true')) {
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}pgbouncer=true&connection_limit=1`
  }
  return url
}

// Enhanced connection pooling configuration for production
export const db = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: buildDatabaseUrl(),
    },
  },
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error', 'warn']  // Production: errors AND warnings
})

// Always preserve the global singleton to prevent connection proliferation
// across hot-reloads in development AND across module imports in production.
globalForPrisma.prisma = globalForPrisma.prisma ?? db

// NOTE: Do NOT call db.$connect() here.
// This file is imported at *build time* by Next.js when it statically analyses
// pages and API routes.  A module-level connect() attempt will hang the Vercel
// build worker waiting for a TCP response from Supabase → SIGTERM → site down.
// Prisma connects lazily on first query, which is the correct pattern.

// Graceful shutdown (only in long-running server processes, not serverless)
if (process.env.NODE_ENV !== 'production') {
  process.on('beforeExit', async () => {
    await db.$disconnect()
  })
}
