# PROJECT SOURCE OF TRUTH
## Khesed-Tek Church Management System

**Document Version**: 1.1  
**Established**: March 2026  
**Last Updated**: April 2026  
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
9. ❌ **Never rely on `lib/rate-limit.ts` as a hard security control in production.** The in-memory `Map` is reset on every Vercel serverless cold start. It provides zero cross-invocation protection. Current usage in `app/api/members/route.ts` returns 429 only within a single warm invocation window — not across requets from different Lambda instances. Until replaced with a persistent store (e.g., `@upstash/ratelimit` backed by Redis), consider it best-effort only. See §13.4 for the approved migration path.

---

## 11. HEALTH METRICS — DEFINITION OF "100% HEALTH"

This section defines quantitative targets. All checks must pass before a release is considered production-ready.

### 11.1 API Correctness
| Check | Target |
|-------|--------|
| All API routes return 2xx for valid authenticated requests | ✅ 100% |
| All API routes return 4xx for invalid/unauthenticated requests | ✅ 100% |
| No API route returns 5xx for expected error conditions | ✅ 0 occurrences |
| `GET /api/health` returns `{ "status": "healthy" }` with HTTP 200 | ✅ Required |

### 11.2 Frontend Quality
| Check | Target |
|-------|--------|
| No JavaScript errors in browser console on any dashboard page | ✅ 0 errors |
| All forms save successfully (members, volunteers, donations) | ✅ 100% |
| Toast notifications displayed on API errors | ✅ Required |

### 11.3 Database & Migrations
| Check | Target |
|-------|--------|
| `db.$queryRaw SELECT 1` completes within 2 seconds | ✅ Required |
| Prisma migrations run without conflicts | ✅ Required |
| `GET /api/health` returns a non-null `lastMigration` | ✅ Required |

### 11.4 Authentication & Authorization
| Check | Target |
|-------|--------|
| Middleware blocks unauthenticated access to all protected routes | ✅ 100% |
| LIDER cannot PUT members (returns 403) | ✅ Required |
| MIEMBRO cannot GET members (returns 403) | ✅ Required |
| No API route calls `validateCSRFToken()` | ✅ 0 occurrences |

### 11.5 Build Quality
| Check | Target |
|-------|--------|
| `npm run type-check` exits 0 | ✅ Required |
| `npm run lint` exits 0 | ✅ Required |
| `npm run build` completes without errors | ✅ Required |
| No orphaned/stale imports in the codebase | ✅ Required |

### 11.6 Stale Files (Pending Cleanup — Requires Approval)
The following files exist but are not part of the active application. They must be removed before the app can reach 100% health. **Deletion requires explicit [PROCEED] from lead engineer.**

| File | Type | Safe to Delete? |
|------|------|-----------------|
| `components/members/member-form.tsx` | Orphaned component (replaced by `enhanced-member-form.tsx`) | ✅ No imports |
| `app/test-member-integration/page.tsx` | Stale debug route | ✅ Not in nav |
| `app/test-assessment/page.tsx` | Stale debug route | ✅ Not in nav |
| `app/test-members-api/page.tsx` | Stale debug route | ✅ Not in nav |
| `app/(dashboard)/gender-diagnostic/page.tsx` | Stale debug route | ✅ Not in nav |
| `archive/` directory | Old migration artifacts | ✅ Not imported |
| `test-build/` directory | Compiled build artifacts | ✅ Not source code |
| `*.js` files at project root (~15 files) | One-time diagnostic scripts | ✅ Not imported |

---

## 12. ENVIRONMENT VARIABLES — REQUIRED FOR PRODUCTION

Missing any of the variables marked **CRITICAL** will cause `GET /api/health` to return 503.

### 12.1 Critical (App will not start without these)
| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string (Prisma) |
| `NEXTAUTH_SECRET` | JWT signing key — must be ≥32 random characters |
| `NEXTAUTH_URL` | Full public URL of the app (e.g., `https://app.khesed-tek.com`) |

### 12.2 Communication (Optional but recommended)
| Variable | Purpose |
|----------|---------|
| `MAILGUN_API_KEY` | Email delivery |
| `MAILGUN_DOMAIN` | Mailgun sender domain |
| `TWILIO_ACCOUNT_SID` | SMS messaging |
| `TWILIO_AUTH_TOKEN` | SMS authentication |
| `WHATSAPP_ACCESS_TOKEN` | WhatsApp Business API |

### 12.3 Payments (Required if payment features enabled)
| Variable | Purpose |
|----------|---------|
| `STRIPE_SECRET_KEY` | Stripe server-side key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe client-side key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook validation |
| `PADDLE_API_KEY` | Paddle subscription billing |
| `PADDLE_WEBHOOK_SECRET` | Paddle webhook validation |

### 12.4 Social Media OAuth (Required if social media module enabled)
| Variable | Purpose |
|----------|---------|
| `FACEBOOK_CLIENT_ID` | Meta OAuth app ID |
| `FACEBOOK_CLIENT_SECRET` | Meta OAuth app secret |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID (YouTube) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `SOCIAL_MEDIA_ENCRYPTION_KEY` | AES-256 key for token storage |

### 12.5 Performance (Optional)
| Variable | Purpose |
|----------|---------|
| `REDIS_URL` | Redis connection for caching (falls back to in-memory) |

### 12.6 Verification
```bash
# Verify all critical vars are set before deploying
node -e "
const required = ['DATABASE_URL','NEXTAUTH_SECRET','NEXTAUTH_URL'];
const missing = required.filter(k => !process.env[k]);
if (missing.length) { console.error('MISSING:', missing); process.exit(1); }
console.log('All critical env vars present');
"
```

---

## 13. DEPLOYMENT VERIFICATION CHECKLIST

Run this sequence after every `git push origin main` or PR merge.

### 13.1 Pre-Deploy (CI Gate — must all pass)
```bash
npm run type-check   # TypeScript — zero errors required
npm run lint         # ESLint — zero errors required
npm run build        # Next.js build — must complete without errors
```

### 13.2 Post-Deploy (Production Verification)
```bash
# Health probe — must return { "status": "healthy" }
curl -s https://YOUR_DOMAIN/api/health | python3 -m json.tool

# Auth is protecting routes (unauthenticated must get 401/403)
curl -s https://YOUR_DOMAIN/api/members | python3 -m json.tool
# Expected: { "error": "Unauthorized" } with HTTP 401

# Member creation (replace TOKEN with a valid session token)
# Expected: 201 Created
```

### 13.3 Full Quality Gate
```bash
# Runs lint + type-check + test:compile in one command
npm run health:full
```

### 13.4 Rate-Limit Migration Path (Future)
The current `lib/rate-limit.ts` uses an in-memory `Map` that resets on every serverless cold start. When this becomes critical:

**Option A — Remove** (acceptable for auth-protected routes with low abuse risk):
- Delete `lib/rate-limit.ts`
- Remove `checkRateLimit()` calls from `app/api/members/route.ts` and `app/api/auth/request-church-account/route.ts`

**Option B — Replace** (recommended for public endpoints):
- Install `@upstash/ratelimit` and `@upstash/redis` (both MIT licensed, approved for addition)
- Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` environment variables
- Replace `checkRateLimit()` calls with `@upstash/ratelimit` sliding window limiter
- **Requires [PROCEED] before implementation**

### 13.5 TypeScript Strictness Roadmap
`tsconfig.json` currently has `"strict": false` for legacy compatibility. To reach full strict mode:
- Enable `"strict": true` in `tsconfig.json`
- Run `npm run type-check` and fix all new errors (estimated: 50-100 implicit `any` warnings)
- **Requires [PROCEED] before implementation** — do NOT enable without a dedicated fix pass

