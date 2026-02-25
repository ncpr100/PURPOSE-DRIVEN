"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const client_1 = require("@prisma/client");
const globalForPrisma = globalThis;
// 🚨 TEMPORARY HARDCODED OVERRIDE - Transaction Pooler (VERIFIED WORKING VIA CLI!)
// URL-encoded password: Bendecido100%25%24%24%25
// Using postgres.PROJECT_REF username format for pooler (not just postgres)
// ?pgbouncer=true disables prepared statements (required for transaction pooler)
const HARDCODED_SUPABASE_URL = 'postgresql://postgres.qxdwpihcmgctznvdfmbv:Bendecido100%25%24%24%25@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true';
// Use hardcoded pooler URL for ALL environments (pooler works, direct doesn't)
const databaseUrl = HARDCODED_SUPABASE_URL;
console.log('[DB] Mode:', process.env.NODE_ENV);
console.log('[DB] Using: HARDCODED Pooler URL (forced)');
console.log('[DB] URL preview:', databaseUrl.substring(0, 50) + '...');
console.log('[DB] Has pgbouncer param:', databaseUrl.includes('?pgbouncer=true'));
// Enhanced connection pooling configuration for production
exports.db = globalForPrisma.prisma ?? new client_1.PrismaClient({
    datasources: {
        db: {
            url: databaseUrl,
        },
    },
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error', 'warn'] // Production: errors AND warnings
});
// Connection pooling and transaction configuration
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = exports.db;
// Test connection on startup
exports.db.$connect()
    .then(() => console.log('[DB] ✅ Connected successfully'))
    .catch(err => console.error('[DB] ❌ Connection failed:', err.message));
// Graceful shutdown
process.on('beforeExit', async () => {
    await exports.db.$disconnect();
});
//# sourceMappingURL=db.js.map