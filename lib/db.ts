
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 🚨 TEMPORARY HARDCODED OVERRIDE - Transaction Pooler (VERIFIED WORKING VIA CLI!)
// URL-encoded password: Bendecido100%25%24%24%25
// Using postgres.PROJECT_REF username format for pooler (not just postgres)
// ?pgbouncer=true disables prepared statements (required for transaction pooler)
const HARDCODED_SUPABASE_URL = 'postgresql://postgres.qxdwpihcmgctznvdfmbv:Bendecido100%25%24%24%25@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true'

// Use hardcoded pooler URL for ALL environments (pooler works, direct doesn't)
const databaseUrl = HARDCODED_SUPABASE_URL

console.log('[DB] Mode:', process.env.NODE_ENV)
console.log('[DB] Using: HARDCODED Pooler URL (forced)')
console.log('[DB] URL preview:', databaseUrl.substring(0, 50) + '...')
console.log('[DB] Has pgbouncer param:', databaseUrl.includes('?pgbouncer=true'))

// Enhanced connection pooling configuration for production
export const db = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error', 'warn']  // Production: errors AND warnings
})

// Keep singleton in dev to prevent connection exhaustion from hot-reload
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

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
