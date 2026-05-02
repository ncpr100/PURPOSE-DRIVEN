
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Strip leading/trailing quote characters that are sometimes accidentally
 * included when pasting connection strings into Vercel's env var editor.
 * e.g.  "postgresql://..."  →  postgresql://...
 */
function stripQuotes(s: string): string {
  return s.replace(/^["'\s]+|["'\s]+$/g, '')
}

/**
 * URL-encode the password portion of a PostgreSQL connection string.
 *
 * Supabase auto-generated passwords often contain characters like %, +, @, #
 * that must be percent-encoded inside a URL.  Prisma's Rust query engine is
 * stricter than the browser's URL parser and will throw
 * PrismaClientInitializationError: "The provided arguments are not supported
 * in database URL" when it encounters unencoded special characters.
 *
 * Strategy: the host part of a pg URL (host:port/db?params) never contains @,
 * so the LAST @ in the string always separates credentials from the host.
 * We split on lastIndexOf('@'), extract the password after the first ':' in
 * the credentials segment, encode it, and reassemble.
 */
function encodePasswordInUrl(url: string): string {
  const schemeMatch = url.match(/^(postgresql|postgres):\/\//)
  if (!schemeMatch) return url

  const scheme = schemeMatch[1]
  const afterScheme = url.slice(schemeMatch[0].length) // user:password@host:port/db?params

  const lastAt = afterScheme.lastIndexOf('@')
  if (lastAt === -1) return url

  const credentials = afterScheme.slice(0, lastAt)     // user:password
  const hostAndRest = afterScheme.slice(lastAt + 1)    // host:port/db?params

  const firstColon = credentials.indexOf(':')
  if (firstColon === -1) return url

  const user = credentials.slice(0, firstColon)
  const password = credentials.slice(firstColon + 1)

  // If the password is already fully percent-encoded, encodeURIComponent is a no-op.
  // If it contains bare special characters, they get encoded correctly.
  const encodedPassword = encodeURIComponent(decodeURIComponent(password))

  return `${scheme}://${user}:${encodedPassword}@${hostAndRest}`
}

/**
 * Build and sanitize the DATABASE_URL used by PrismaClient.
 *
 * Handles the two most common Vercel misconfiguration issues:
 *  1. Literal quote characters in the env var value ("postgresql://..." stored WITH quotes)
 *  2. Unencoded special characters in the DB password (%, @, #, + etc.)
 *
 * Also appends the required Supavisor transaction-mode parameters if missing:
 *  - pgbouncer=true  → disables named prepared statements (required for port 6543)
 *  - connection_limit=1 → tells Prisma's internal pool not to compete with the pooler
 */
function buildDatabaseUrl(): string {
  // Strip accidental surrounding quotes from the raw env var value
  const rawUrl = stripQuotes(process.env.DATABASE_URL || '')
  const rawDirectUrl = stripQuotes(process.env.DIRECT_URL || '')

  const missing: string[] = []
  if (!rawUrl) missing.push('DATABASE_URL')
  if (!rawDirectUrl) missing.push('DIRECT_URL')

  if (missing.length > 0) {
    console.error(
      ` CRITICAL: Missing required env vars: ${missing.join(', ')}\n` +
      '   → Vercel: Project → Settings → Environment Variables\n\n' +
      '   DATABASE_URL  (pooler, port 6543):\n' +
      '     postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1\n\n' +
      '   DIRECT_URL  (direct, port 5432):\n' +
      '     postgresql://postgres.[ref]:[password]@db.[ref].supabase.co:5432/postgres\n\n' +
      '   Passwords with special chars (%, @, #, +) MUST be URL-encoded in the connection string.'
    )
  }

  if (!rawUrl) return ''

  // Encode any bare special characters in the password
  let url = encodePasswordInUrl(rawUrl)

  // Validate — if URL is still un-parseable, log and bail
  try {
    new URL(url)
  } catch {
    console.error(
      ' DATABASE_URL is still invalid after sanitization.\n' +
      `   Raw value starts with: ${rawUrl.slice(0, 30)}...\n` +
      '   Check Vercel env var for stray quotes or illegal characters.\n' +
      '   Password special chars MUST be URL-encoded: % → %25, @ → %40, # → %23'
    )
  }

  // Append Supavisor transaction-mode params if using port 6543 without them
  if (url.includes(':6543') && !url.includes('pgbouncer=true')) {
    const separator = url.includes('?') ? '&' : '?'
    url = `${url}${separator}pgbouncer=true&connection_limit=1`
  }

  // Log the sanitized URL with password redacted for verification in Vercel logs
  try {
    const parsed = new URL(url)
    console.log(
      `[DB] Connecting to: ${parsed.protocol}//${parsed.hostname}:${parsed.port}${parsed.pathname} ` +
      `[params: ${parsed.searchParams.toString() || 'none'}]`
    )
  } catch { /* parsing failed — already logged above */ }

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
