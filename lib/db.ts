
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Enhanced connection pooling configuration for production
export const db = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
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
