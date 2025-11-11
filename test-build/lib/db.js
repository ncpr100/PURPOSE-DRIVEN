"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const client_1 = require("@prisma/client");
const globalForPrisma = globalThis;
// Enhanced connection pooling configuration for production
exports.db = globalForPrisma.prisma ?? new client_1.PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});
// Connection pooling and transaction configuration
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = exports.db;
// Graceful shutdown
process.on('beforeExit', async () => {
    await exports.db.$disconnect();
});
//# sourceMappingURL=db.js.map