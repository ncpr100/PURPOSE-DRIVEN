// Compatibility shim: re-export the single Prisma client instance as `prisma`.
// The canonical client is created in `lib/db.ts` with connection pooling configured.
// Keeping this file prevents widespread import changes while we consolidate the codebase.

export { db as prisma } from './db'

// Connection pool configuration is handled in lib/db.ts
