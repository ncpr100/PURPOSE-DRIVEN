// Compatibility shim: re-export the single Prisma client instance as `prisma`.
// The canonical client is created in `lib/db.ts`. Keeping this file prevents
// widespread import changes while we consolidate the codebase.

export { db as prisma } from './db'
