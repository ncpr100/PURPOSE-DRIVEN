# AI Agent Ground Rules — Khesed-Tek CMS

**Version**: 1.0  
**Created**: 2025 — Post Recovery Audit  
**Purpose**: Prevent AI agents from re-introducing the class of bugs that degraded system health from 90% → 60%.

Every AI agent working on this codebase MUST read and follow these rules.

---

## 1. CANONICAL FILE AUTHORITY

### Members Module
| Role | File | Action |
|------|------|--------|
| ✅ CANONICAL form component | `components/members/enhanced-member-form.tsx` | Edit this |
| ❌ ORPHANED — never import | `components/members/member-form.tsx` | Do NOT touch |
| ✅ CANONICAL spiritual assessment | `components/members/member-spiritual-assessment.tsx` | Edit this |
| ❌ Superseded | `components/members/spiritual-assessment.tsx` | Do NOT introduce new imports |

**Rule**: Grep for `import.*member-form` before any refactor. If you find zero imports, the file is orphaned — do not use it as a reference.

### Volunteers Module
| Role | File |
|------|------|
| ✅ CANONICAL page client | `app/(dashboard)/volunteers/_components/volunteers-client.tsx` |
| ✅ CANONICAL validation schema | `lib/validations/volunteer.ts` |
| ✅ CANONICAL API route | `app/api/volunteers/route.ts` |

---

## 2. PRISMA MODEL NAMES (PLURAL SNAKE_CASE — REQUIRED)

The Prisma schema uses **plural snake_case** names for ALL models. These are the ONLY correct names:

```
db.members           ✅    db.member            ❌
db.users             ✅    db.user              ❌
db.churches          ✅    db.church            ❌
db.ministries        ✅    db.ministry          ❌
db.volunteers        ✅    db.volunteer         ❌
db.events            ✅    db.event             ❌
db.donations         ✅    db.donation          ❌
db.donation_categories ✅  db.donationCategory  ❌
db.payment_methods   ✅    db.paymentMethod     ❌
db.check_ins         ✅    db.checkIn           ❌
db.communications    ✅    db.communication     ❌
db.automations       ✅    db.automation        ❌
db.custom_forms      ✅    db.customForm        ❌
db.spiritual_assessments ✅  db.spiritual_assessments (check schema before using)
```

**CRITICAL RELATION NAMES on `volunteers` model:**
```
volunteer.members    ✅   (the linked member record)
volunteer.ministries ✅   (the linked ministry record)
volunteer.volunteer_assignments ✅   (assignments array)
```
Not `volunteer.member`, `volunteer.ministry`, or `volunteer.assignments`.

**Rule**: Before writing `db.X` or accessing `record.Y`, run:
```
grep -n "model X " prisma/schema.prisma
grep -n "Y " prisma/schema.prisma
```
to confirm the exact plural/snake_case name.

---

## 3. VALIDATION SCHEMA LANGUAGE CONTRACT

### ENUM VALUES MUST MATCH WHAT THE FORM SENDS

The frontend form sends **Spanish** values for certain fields. The Zod schemas MUST accept them.

**Current approved values (as stored in DB):**

| Field | Accepted values |
|-------|----------------|
| `gender` | `masculino`, `femenino`, `otro`, `no-especificar` *(or English equivalents)* |
| `maritalStatus` | `soltero`, `casado`, `divorciado`, `viudo`, `union-libre` *(or English equivalents)* |
| `availability` (volunteers) | plain text string OR null — NOT a structured object |

**Rule**: Before adding `z.enum([...])` to any field, open the form component and grep for the actual SelectItem values being sent. If they don't match your enum, the entire POST will 400.

---

## 4. SERVERLESS ARCHITECTURE CONSTRAINTS

This application runs on **Vercel serverless functions**. Each invocation is a fresh process.

### NEVER USE IN-MEMORY STATE FOR SECURITY FEATURES

```typescript
// ❌ CRITICALLY BROKEN IN SERVERLESS — Map is ALWAYS empty on each invocation
const csrfTokens = new Map<string, number>()
export function validateCSRFToken(token: string): boolean {
  return csrfTokens.has(token)  // ALWAYS false
}

// ✅ CORRECT — Use stateless session-based auth instead
const session = await getServerSession(authOptions)
if (!session?.user?.churchId) return 401
```

**Files that use broken in-memory state (do NOT restore these patterns):**
- `lib/csrf.ts` — in-memory `csrfTokens Map` — broken, never validates in production
- `lib/rate-limit.ts` — in-memory `requestCounts Map` — broken, never enforces limits

The `app/api/members/route.ts` POST handler had `validateCSRFToken()` removed because of this — do NOT re-add it.

**Rule**: For any feature requiring state between requests (rate limiting, CSRF, sessions), use Redis, the database, or a stateless JWT approach.

---

## 5. DATE HANDLING CONTRACT

### API expects `YYYY-MM-DD` strings — never JS Date objects in JSON

```typescript
// ❌ BROKEN — new Date() serialises to ISO string "1990-05-15T00:00:00.000Z"
// which fails the API regex /^\d{4}-\d{2}-\d{2}(T.*)?$/
cleanData.birthDate = new Date(formData.birthDate)

// ✅ CORRECT — pass raw date string from <input type="date">
cleanData.birthDate = formData.birthDate   // Already "1990-05-15"
```

**Rule**: Never wrap form date strings in `new Date()` before JSON serialisation. The API regex and Prisma both accept ISO date strings directly.

---

## 6. API AUTHENTICATION PATTERN (ALL ROUTES)

Every API route MUST authenticate via session, never via request parameters:

```typescript
// ✅ REQUIRED pattern at the top of every API handler
const session = await getServerSession(authOptions)
if (!session?.user?.churchId) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
const churchId = session.user.churchId  // Always from session, NEVER from URL params
```

**Rule**: churchId coming from URL/body params to determine data scope is a multi-tenancy security breach. Always use `session.user.churchId`.

---

## 7. DO NOT CREATE / MODIFY THESE PATTERNS

### CSRF validation on POST routes
The `validateCSRFToken` function from `lib/csrf.ts` is non-functional in serverless. Adding it to any API route will cause 100% failure of that endpoint. If cross-site request protection is needed, use `SameSite=Strict` cookies (already enforced by NextAuth) or double-submit patterns with Redis.

### JSON.stringify on availability / skills before DB insert
Both `skills` (array → JSON string) and `availability` (string → use as-is) are stored as strings in the DB. The current `route.ts` for volunteers already handles this correctly. Do NOT add extra `JSON.stringify` calls.

### Duplicate member form components
If you see both `member-form.tsx` AND `enhanced-member-form.tsx` in a PR or diff, `enhanced-member-form.tsx` is always right. Delete or ignore any changes to `member-form.tsx`.

---

## 8. FILE CREATION RULES

### Never create these types of files at the project root
- `*.js` test/diagnostic scripts (e.g., `api-database-tester.js`, `investigate-volunteer-logic.js`)
- `*_IMPLEMENTATION_*.md` status docs (use git commit messages instead)
- Duplicate pages for testing (`app/test-*/page.tsx`)

### Stale file indicators (do NOT use as reference)
Any `.md` file at project root that starts with `PHASE_`, `FINAL_`, `FIX_`, `DIAGNOSTIC_`, `IMPLEMENTATION_`, `MIGRATION_` is likely a stale status log from a previous AI session. Do NOT use it to infer system behavior — use the actual source code.

---

## 9. REQUIRED PRE-EDIT CHECKLIST

Before modifying any file, answer YES to all:

1. **Have I read the current file contents?** (never edit blind using a remembered pattern)
2. **Do I know which pages/components import this file?** (search `grep -r "from.*filename"`)
3. **Is the enum/type I'm adding compatible with what the form actually sends?** (read the form component)
4. **Am I using the plural snake_case Prisma model name?** (verify in `prisma/schema.prisma`)
5. **Am I fetching `churchId` from `session.user.churchId` and not from URL params?**
6. **Does my change work in a stateless serverless environment?** (no in-memory state)

---

## 10. COMMIT MESSAGE FORMAT

All commits fixing bugs MUST reference the bug class:

```
fix(members): remove broken CSRF — in-memory Map always empty in serverless
fix(validation): accept Spanish enum values for gender/maritalStatus
fix(volunteers): use Prisma plural relation names (members, ministries)
feat(form-builder): add QR customization options
```

---

## 11. KNOWN PRE-EXISTING TYPESCRIPT ERRORS (DO NOT ATTEMPT TO FIX UNLESS ASSIGNED)

The following files contain TypeScript errors that pre-date this audit and are NOT blocking (build uses `ignoreBuildErrors: true`). Do NOT refactor these files unless specifically tasked:

- `app/(dashboard)/donations/settings/page.tsx` — `db.donationCategory` → rename needed
- `app/api/custom-form-submission/route.ts` — multiple `db.member`, `spiritual_assessments` issues
- `app/api/platform/churches/[id]/route.ts` — stale Prisma model names
- `app/api/realtime/broadcast/route.ts` — `db.user` → `db.users`
- `app/api/recruitment-pipeline/onboarding-workflows/route.ts` — `db` not in scope

---

*This document was generated after a full codebase audit. Update section 11 as pre-existing errors are resolved.*
