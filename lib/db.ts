
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Use SUPABASE_DATABASE_URL first (new), fallback to DATABASE_URL (old)
const databaseUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5432/fallback'

console.log('[DB] Using database URL:', databaseUrl.substring(0, 30) + '...')

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
