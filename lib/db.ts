
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
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  
  // Connection pool configuration for better performance
  connectionLimit: 20,
  pool: {
    max: 20,
    min: 2,
    idle: 10000,
    acquire: 10000,
    evict: 60000,
    handleDisconnects: true
  }
})

// Connection pooling and transaction configuration
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Graceful shutdown
process.on('beforeExit', async () => {
  await db.$disconnect()
})
