
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 🚨 TEMPORARY HARDCODED OVERRIDE - Direct connection (IPv4 now enabled!)
// URL-encoded password: Bendecido100%25%24%24%25
const HARDCODED_SUPABASE_URL = 'postgresql://postgres:Bendecido100%25%24%24%25@db.qxdwpihcmgctznvdfmbv.supabase.co:5432/postgres'

// Use hardcoded URL in production to bypass Vercel environment variable caching
const databaseUrl = process.env.NODE_ENV === 'production' 
  ? HARDCODED_SUPABASE_URL 
  : (process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5432/fallback')

console.log('[DB] Mode:', process.env.NODE_ENV)
console.log('[DB] Using:', process.env.NODE_ENV === 'production' ? 'HARDCODED Supabase URL' : 'Environment Variables')
console.log('[DB] URL preview:', databaseUrl.substring(0, 50) + '...')

// Enhanced connection pooling configuration for production
export const db = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
})

// Connection pooling and transaction configuration
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Graceful shutdown
process.on('beforeExit', async () => {
  await db.$disconnect()
})
