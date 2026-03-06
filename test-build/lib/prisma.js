"use strict";
// Compatibility shim: re-export the single Prisma client instance as `prisma`.
// The canonical client is created in `lib/db.ts` with connection pooling configured.
// Keeping this file prevents widespread import changes while we consolidate the codebase.
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
var db_1 = require("./db");
Object.defineProperty(exports, "prisma", { enumerable: true, get: function () { return db_1.db; } });
// Connection pool configuration is handled in lib/db.ts
//# sourceMappingURL=prisma.js.map