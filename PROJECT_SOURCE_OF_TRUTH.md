# PROJECT SOURCE OF TRUTH
## Khesed-Tek Church Management System

**Document Version**: 1.0  
**Established**: March 2026  
**Authority**: Lead System Architect  
**Status**: CANONICAL — All AI agents and developers MUST follow this document

---

## ⚠️ CRITICAL NOTICE
This document was created after a formal codebase audit that identified 6 critical bugs causing form saves to fail. App health had dropped to ~60%. This document is the authoritative reference to prevent recurrence.

---

## 1. PROJECT OVERVIEW

**Framework**: Next.js 14.2.28 — App Router (`app/` directory)  
**Database**: PostgreSQL via Prisma ORM 6.7.0 (`prisma/schema.prisma`)  
**Auth**: NextAuth.js 4.24.11 with JWT strategy  
**UI**: Radix UI primitives + Tailwind CSS + shadcn/ui  
**Deployment**: Vercel (auto-deploy from `git push origin main`)  
**Database Host**: Supabase PostgreSQL  

---

## 2. CANONICAL FILE STRUCTURE

```
/workspaces/PURPOSE-DRIVEN/
│
├── app/                          ← ALL Next.js routes (App Router)
│   ├── (dashboard)/              ← Church-scoped pages (auth required)
│   │   ├── members/
│   │   │   ├── page.tsx          ← Server component (fetches session, wraps client)
│   │   │   └── _components/
│   │   │       ├── members-client.tsx   ← CANONICAL member list + form orchestrator
│   │   │       └── member-info-badges.tsx
│   │   ├── volunteers/
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   │       └── volunteers-client.tsx  ← CANONICAL volunteer list + form
│   │   └── [other-modules]/
│   └── api/                      ← All API routes
│       ├── members/
│       │   ├── route.ts          ← GET (list) + POST (create) members
│       │   ├── [id]/route.ts     ← PUT (update) + DELETE members by ID
│       │   └── counts/route.ts
│       ├── volunteers/
│       │   ├── route.ts          ← GET (list) + POST (create) volunteers
│       │   └── [id]/route.ts     ← PUT (update) + DELETE volunteers by ID
│       └── [other endpoints]/
│
├── components/                   ← Reusable shared components
│   ├── ui/                       ← shadcn/ui primitives (Button, Dialog, etc.)
│   ├── members/
│   │   ├── enhanced-member-form.tsx  ← CANONICAL member form (1105 lines)
│   │   ├── member-spiritual-assessment.tsx  ← Spiritual tab within form
│   │   ├── availability-matrix.tsx
│   │   ├── skills-selector.tsx
│   │   └── member-import-dialog.tsx
│   └── volunteers/               ← Volunteer sub-dashboards (advanced analytics)
│
├── lib/                          ← Business logic, services, utilities
│   ├── db.ts                     ← CANONICAL Prisma singleton (ALWAYS import from here)
│   ├── auth.ts                   ← CANONICAL NextAuth config
│   ├── validation-schemas.ts     ← CANONICAL Zod schemas for member/donation/etc.
│   ├── validations/
│   │   ├── member.ts             ← Member-specific validation (legacy, prefer validation-schemas.ts)
│   │   └── volunteer.ts          ← Volunteer-specific Zod schemas
│   ├── csrf.ts                   ← CSRF utilities (NOT USED for API protection — see Security section)
│   ├── rate-limit.ts             ← Rate limiter (in-memory, non-persistent in serverless)
│   └── [other services]/
│
├── prisma/
│   └── schema.prisma             ← CANONICAL database schema
│
├── types/                        ← TypeScript type definitions
├── hooks/                        ← React hooks
└── scripts/                      ← One-time admin scripts (not app code)
```

### ❌ ORPHANED/STALE FILES (DO NOT IMPORT OR RECREATE)
| File | Status | Reason |
|------|--------|--------|
| `components/members/member-form.tsx` | ORPHANED | Replaced by `enhanced-member-form.tsx`. Zero imports. Do not use. |
| `components/members/spiritual-assessment.tsx` | SECONDARY | `member-spiritual-assessment.tsx` is used by the enhanced form |
| `app/test-member-integration/page.tsx` | STALE | Debug page. Not in nav. Should be removed. |
| `app/test-members-api/page.tsx` | STALE | Debug page. Not in nav. Should be removed. |
| `app/(dashboard)/gender-diagnostic/page.tsx` | STALE | Debug page. Should be removed. |
| `*.js` files at project root (15 files) | STALE | One-time diagnostic scripts. Not app code. |
| `test-build/` directory | STALE | Compiled artifacts from old build. Not source. |
| `archive/` directory | STALE | Old migration files. Not active code. |

---

## 3. NAMING CONVENTIONS

| Type | Convention | Example |
|------|-----------|---------|
| Page components (server) | `page.tsx` in route folder | `app/(dashboard)/members/page.tsx` |
| Client components | `[feature]-client.tsx` | `members-client.tsx` |
| Server components (reusable) | `PascalCase.tsx` | `EnhancedMemberForm.tsx` |
| API routes | `route.ts` in folder | `app/api/members/route.ts` |
| Hooks | `use-[name].ts` | `use-paddle.ts` |
| Validation schemas | `camelCase.ts` in `lib/` | `validation-schemas.ts` |
| Prisma relations | As defined in schema | `volunteer.members` NOT `volunteer.member` |

---

## 4. CORE LOGIC LOCATIONS — SOURCE OF TRUTH

### 4.1 Authentication
- **Config**: `lib/auth.ts` — NextAuth config with JWT strategy
- **Middleware**: `middleware.ts` (229 lines) — Controls ALL routing, role checks
- **Session access (server)**: `getServerSession(authOptions)` from `next-auth/next`
- **Session access (client)**: `useSession()` from `next-auth/react`
- **NEVER** bypass middleware or trust user-supplied churchId

### 4.2 Database Access
- **ONLY** import from `lib/db.ts` → `import { db } from '@/lib/db'`
- **ALWAYS** scope queries to `churchId: session.user.churchId`
- Prisma relation names come from `prisma/schema.prisma` — verify before use
- **NEVER** use raw SQL unless absolutely required

### 4.3 Validation Schemas
- **Member creates/updates (POST)**: `lib/validation-schemas.ts` → `memberSchema`
- **Volunteer creates**: `lib/validations/volunteer.ts` → `volunteerCreateSchema`
- **CRITICAL**: The `memberSchema` accepts both Spanish and English values for `gender` and `maritalStatus` (as of v1.0 fix) — see Bug Fix Log

### 4.4 CSRF Protection
- **IMPORTANT**: `lib/csrf.ts` uses an **in-memory Map** that is **empty on every serverless function invocation** in Vercel. It CANNOT be used in production API routes for write protection.
- Production write protection is provided by: (1) `getServerSession()` authentication, (2) same-origin `fetch()` from the frontend, (3) Vercel's HTTPS enforcement.
- **DO NOT add `validateCSRFToken()` to any API route** — it will always fail in production.

### 4.5 Prisma Relation Names (CRITICAL)
These are the actual field names returned from `db.volunteers.findMany({ include: {...} })`:

| API includes | Returns field name | Client must access |
|-------------|-------------------|-------------------|
| `include: { members: true }` | `volunteer.members` | `volunteer.members` |
| `include: { ministries: true }` | `volunteer.ministries` | `volunteer.ministries` |
| `include: { volunteer_assignments: true }` | `volunteer.volunteer_assignments` | `volunteer.volunteer_assignments` |
| `include: { churches: true }` | `volunteer.churches` | `volunteer.churches` |

**NEVER use singular aliases** (`volunteer.member`, `volunteer.ministry`) unless the client code explicitly remaps them.

---

## 5. DATA FLOW DIAGRAMS

### 5.1 Member Creation Flow
```
User fills EnhancedMemberForm
  → handleSavePersonalInfo() in enhanced-member-form.tsx
    → calls props.onSave(cleanData) 
      → handleSaveMember(memberData) in members-client.tsx
        → POST /api/members
          → getServerSession() [authenticate]
          → checkRateLimit() [non-blocking in serverless]
          → memberSchema.parse(body) [validate]
          → db.members.create({ data: { ...validatedData, churchId } })
          → return 201 + created member
        → setEditingMember(savedMember) [update parent state with new ID]
        → fetchMembers() [refresh list]
```

### 5.2 Member Update Flow
```
User edits section in EnhancedMemberForm (existing member)
  → handleSaveAddress() / handleSavePersonalDetails() / etc.
    → PUT /api/members/[id]
      → getServerSession() [authenticate]
      → verify member.churchId === session.user.churchId
      → db.members.update({ where: { id }, data })
      → return 200 + updated member
```

### 5.3 Volunteer Creation Flow
```
User fills volunteer create dialog in volunteers-client.tsx
  → handleCreateVolunteer(e)
    → POST /api/volunteers
      → getServerSession() [authenticate]
      → volunteerCreateSchema.parse(body) [validate]
      → db.volunteers.create({ data: { ...validated, churchId } })
      → return 201 + created volunteer (with members, ministries, volunteer_assignments included)
  → fetchVolunteers() [refresh list]
    → data.map(v => ({ ...v, member: v.members || null, ministry: v.ministries || null, assignments: v.volunteer_assignments || [] }))
```

---

## 6. ENUM VALUES / DATA FORMATS

### 6.1 Member Gender (stored in DB)
Both Spanish and English accepted. Form currently sends **Spanish values**:
| UI Label | form value sent | DB stored value |
|----------|----------------|-----------------|
| Masculino | `masculino` | `masculino` |
| Femenino | `femenino` | `femenino` |
| Otro | `otro` | `otro` |
| Prefiero no especificar | `no-especificar` | `no-especificar` |

### 6.2 Member Marital Status (stored in DB)
Both Spanish and English accepted. Form currently sends **Spanish values**:
| UI Label | form value sent | DB stored value |
|----------|----------------|-----------------|
| Soltero(a) | `soltero` | `soltero` |
| Casado(a) | `casado` | `casado` |
| Divorciado(a) | `divorciado` | `divorciado` |
| Viudo(a) | `viudo` | `viudo` |
| Unión Libre | `union-libre` | `union-libre` |

### 6.3 Date Format
- **In the database**: ISO 8601 DateTime stored by Prisma
- **From date inputs**: `YYYY-MM-DD` string (from `<input type="date">`)
- **When sending to POST /api/members**: Send as-is **string** (`formData.birthDate`). **DO NOT** wrap in `new Date()` before sending.
- **When sending to PUT /api/members/[id]**: Can send either string or Date object — no Zod validation in the PUT route.

---

## 7. ROLE PERMISSIONS MATRIX

| Action | SUPER_ADMIN | PASTOR | ADMIN_IGLESIA | LIDER | MIEMBRO |
|--------|-------------|--------|---------------|-------|---------|
| GET members | ✅ | ✅ | ✅ | ✅ | ❌ |
| POST members | ✅ | ✅ | ✅ | ✅ | ❌ |
| PUT members | ✅ | ✅ | ✅ | ❌* | ❌ |
| DELETE members | ✅ | ❌ | ✅ | ❌ | ❌ |
| GET volunteers | ✅ | ✅ | ✅ | ✅ | ❌ |
| POST volunteers | ✅ | ✅ | ✅ | ✅ | ❌ |

*Note: LIDER cannot PUT/update existing members (intentional design — if needs change, update `/api/members/[id]/route.ts`)

---

## 8. APPROVED LIBRARIES

| Purpose | Library | Import path |
|---------|---------|-------------|
| Database | Prisma Client | `@/lib/db` |
| Authentication | NextAuth.js | `next-auth/next` |
| Validation | Zod | `zod` |
| UI Components | shadcn/ui + Radix | `@/components/ui/*` |
| Icons | lucide-react only | `lucide-react` |
| Toast notifications | sonner | `sonner` |
| ID generation | nanoid | `nanoid` |
| Payments (platform) | Paddle | `@paddle/paddle-js` |
| Payments (church) | Stripe | `@/lib/stripe` |

---

## 9. BUG FIX LOG

### Fix #001 — CSRF Validation Breaks All Member Creation (CRITICAL)
- **Date**: March 2026
- **File**: `app/api/members/route.ts`
- **Bug**: POST handler called `validateCSRFToken()` which uses an in-memory Map. In Vercel serverless, this Map is always empty. The frontend never sends a CSRF token header. Result: every new member creation returned 403.
- **Fix**: Removed the CSRF validation from the POST handler. Authentication via `getServerSession()` already protects the route.
- **Lesson**: Never use `validateCSRFToken()` from `lib/csrf.ts` in API routes.

### Fix #002 — memberSchema Rejects Spanish Enum Values (CRITICAL)
- **Date**: March 2026
- **File**: `lib/validation-schemas.ts`
- **Bug**: `memberSchema.gender` used `z.enum(['male', 'female', 'other'])` but the form sent Spanish values (`masculino`, `femenino`). Same for `maritalStatus`.
- **Fix**: Changed `gender` and `maritalStatus` to `z.string().optional()` to accept any string value, preserving backward compatibility with existing DB data.
- **Lesson**: Validation schemas and form select option values must be in sync. Always verify.

### Fix #003 — Date Serialization Breaks Member Validation (CRITICAL)
- **Date**: March 2026
- **File**: `components/members/enhanced-member-form.tsx`
- **Bug**: `handleSavePersonalInfo()` wrapped date strings with `new Date()` before calling `onSave()`. JSON.stringify converts Date objects to ISO strings ("1990-01-01T00:00:00.000Z") which fail the schema regex `^\d{4}-\d{2}-\d{2}$`.
- **Fix**: Removed `new Date()` wrapper. Send the raw date string directly.
- **Lesson**: Do not transform data types before passing to fetch. The API handles transformation.

### Fix #004 — Volunteer `availability: null` Fails Zod Object Schema (CRITICAL)
- **Date**: March 2026
- **File**: `lib/validations/volunteer.ts`
- **Bug**: Schema defined `availability` as `z.object({...}).optional()`. The form sends `availability: null` (empty string → `|| null`). Zod rejects null for an object type.
- **Fix**: Changed `availability` to `z.string().optional().nullable()` to match actual usage (stored as string in DB).

### Fix #005 — Volunteer Relations Mapped to Wrong Property Names (HIGH)
- **Date**: March 2026
- **File**: `app/(dashboard)/volunteers/_components/volunteers-client.tsx`
- **Bug**: Prisma returns `volunteer.members` and `volunteer.ministries` (plural, matching schema). Client code accessed `volunteer.member` and `volunteer.ministry` (singular). safeVolunteers mapping read from the wrong key, setting both to `null` always.
- **Fix**: Updated `fetchVolunteers()` mapping to read from `volunteer.members` → `member` and `volunteer.ministries` → `ministry`, and `volunteer.volunteer_assignments` → `assignments`.

---

## 10. WHAT NOT TO DO (ANTI-PATTERNS)

1. ❌ Never call `validateCSRFToken()` from `lib/csrf.ts` in API routes
2. ❌ Never trust `request.body.churchId` — always use `session.user.churchId`
3. ❌ Never access Prisma relation results using singular names if schema defines them as plural
4. ❌ Never wrap date strings in `new Date()` before sending to an API that expects YYYY-MM-DD
5. ❌ Never create new component files without checking if an equivalent exists
6. ❌ Never add `validateCSRFToken` to an API route without also updating the frontend to fetch and send the token
7. ❌ Never use `member-form.tsx` — it is orphaned. Use `enhanced-member-form.tsx`
8. ❌ Never add diagnostic/test pages to proper route directories — use `scripts/` directory
