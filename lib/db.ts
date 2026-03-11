
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Connection URL: prefer DATABASE_URL env var (set in Vercel dashboard).
// The pooler URL (port 6543 + pgbouncer=true) is required for Supabase transaction pooler.
const databaseUrl = process.env.DATABASE_URL

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
