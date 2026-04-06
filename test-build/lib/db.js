"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const client_1 = require("@prisma/client");
const globalForPrisma = globalThis;
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
function buildDatabaseUrl() {
    const url = process.env.DATABASE_URL || '';
    if (url.includes(':6543') && !url.includes('pgbouncer=true')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}pgbouncer=true&connection_limit=1`;
    }
    return url;
}
// Enhanced connection pooling configuration for production
exports.db = globalForPrisma.prisma ?? new client_1.PrismaClient({
    datasources: {
        db: {
            url: buildDatabaseUrl(),
        },
    },
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error', 'warn'] // Production: errors AND warnings
});
// Always preserve the global singleton to prevent connection proliferation
// across hot-reloads in development AND across module imports in production.
globalForPrisma.prisma = globalForPrisma.prisma ?? exports.db;
// NOTE: Do NOT call db.$connect() here.
// This file is imported at *build time* by Next.js when it statically analyses
// pages and API routes.  A module-level connect() attempt will hang the Vercel
// build worker waiting for a TCP response from Supabase → SIGTERM → site down.
// Prisma connects lazily on first query, which is the correct pattern.
// Graceful shutdown (only in long-running server processes, not serverless)
if (process.env.NODE_ENV !== 'production') {
    process.on('beforeExit', async () => {
        await exports.db.$disconnect();
    });
}
//# sourceMappingURL=db.js.map