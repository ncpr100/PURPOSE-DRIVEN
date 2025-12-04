# 🔐 AUTHENTICATION ARCHITECTURE - CRITICAL DOCUMENTATION

**Last Updated**: December 4, 2025  
**Incident**: Navigation tabs redirecting to /home due to missing JWT fields  
**Root Cause**: JWT callback missing `role` field required by middleware  

---

## ⚠️ CRITICAL: JWT and Middleware Dependency

### THE PROBLEM THAT OCCURRED

**What Broke:**
- All 15 protected routes (Members, Volunteers, Donations, Events, etc.) redirected to /home
- Spiritual Gifts worked because it wasn't in middleware's PROTECTED_ROUTES array

**Root Cause:**
```typescript
// lib/auth.ts - JWT callback was missing role
async jwt({ token, user }) {
  if (user) {
    token.sub = user.id  // ❌ ONLY user ID - NO ROLE!
  }
  return token
}

// Meanwhile, middleware.ts was checking:
if (token.role === 'ADMIN_IGLESIA') {  // ❌ undefined === 'ADMIN_IGLESIA' = false
  return response
}
```

**Why It Failed:**
- `getToken()` in middleware accesses JWT directly (only has `sub`)
- `getSession()` in pages accesses session callback (has full user data)
- Middleware and pages use DIFFERENT data sources
- JWT was optimized for size but broke middleware authorization

---

## ✅ THE FIX

### Required JWT Fields

```typescript
// lib/auth.ts
async jwt({ token, user }) {
  if (user) {
    token.sub = user.id           // ✅ REQUIRED: NextAuth needs this
    token.role = user.role         // ✅ REQUIRED: Middleware authorization
    token.churchId = user.churchId // ✅ REQUIRED: Multi-tenant scoping
  }
  return token
}
```

### Type Safety Added

```typescript
declare module "next-auth/jwt" {
  interface JWT {
    role: string      // Required by middleware.ts
    churchId?: string // Required for data scoping
  }
}
```

---

## 🛡️ PREVENTION STRATEGY

### 1. Run Validation Script

```bash
npm run validate:auth
```

Run this BEFORE and AFTER any changes to `lib/auth.ts`

### 2. Testing Checklist

When modifying `lib/auth.ts` JWT callback:

- [ ] Verify `token.role = user.role` is present
- [ ] Verify `token.churchId = user.churchId` is present  
- [ ] Check middleware.ts for all fields it accesses
- [ ] Deploy to staging/Railway
- [ ] **Sign OUT completely** (critical - old JWT cached)
- [ ] **Sign back IN** (generates fresh JWT)
- [ ] Test ALL 15+ protected routes manually

### 3. Protected Routes Affected

These routes depend on `token.role` in middleware:

```
/members              /volunteers          /donations
/events               /sermons             /communications
/automation-rules     /social-media        /marketing-campaigns
/analytics            /intelligent-analytics /pastoral-insights
/check-ins            /form-builder        /follow-ups
```

### 4. Code Review Requirements

**NEVER approve PRs that:**
- Remove fields from JWT callback without checking middleware
- Optimize JWT size without testing authorization flow
- Modify `lib/auth.ts` without running `npm run validate:auth`

**ALWAYS verify:**
- TypeScript JWT interface includes required fields
- Middleware uses only fields present in JWT
- Fresh login tested after deployment

---

## 📋 ARCHITECTURE OVERVIEW

### Auth Flow (Correct)

```
1. User Login
   ↓
2. authorize() validates credentials
   ↓
3. jwt() callback stores: { sub, role, churchId }
   ↓
4. JWT token saved in cookie
   ↓
5. Middleware reads JWT via getToken()
   ↓
6. Checks token.role for authorization
   ↓
7. Page renders if authorized
```

### Common Pitfalls

| ❌ WRONG | ✅ CORRECT |
|----------|-----------|
| JWT has only `sub` | JWT has `sub`, `role`, `churchId` |
| Assuming session callback adds fields | JWT must have all fields middleware needs |
| Testing without fresh login | Always test with fresh JWT after changes |
| Removing fields to optimize size | Keep fields middleware depends on |

---

## 🔥 EMERGENCY RECOVERY

If navigation breaks again:

1. **Check JWT callback** in `lib/auth.ts` line ~59
   ```typescript
   // These lines MUST exist:
   token.role = user.role
   token.churchId = user.churchId
   ```

2. **Check middleware** in `middleware.ts` line ~171
   ```typescript
   // This check requires token.role to exist:
   if (token.role === 'ADMIN_IGLESIA')
   ```

3. **Force fresh login**:
   - Clear cookies manually
   - Sign out
   - Sign in with fresh credentials

4. **Validate with script**:
   ```bash
   npm run validate:auth
   ```

---

## 📚 REFERENCE

### Key Files
- `lib/auth.ts` - NextAuth configuration (JWT & session callbacks)
- `middleware.ts` - Route protection and authorization
- `lib/auth-validation.ts` - Type guards and validation
- `scripts/validate-auth.js` - Validation script

### Key Concepts
- **JWT Token**: Encrypted data in cookie, accessed by middleware
- **Session**: Server-side data, accessed by pages/API routes
- **getToken()**: Reads JWT directly (middleware uses this)
- **getSession()**: Reads session callback result (pages use this)

### Lesson Learned
> "Optimizing JWT size by removing fields can break middleware authorization. 
> Always verify middleware dependencies before removing JWT fields."

---

**Version**: 1.0  
**Incident Date**: December 3-4, 2025  
**Resolution**: Added role and churchId to JWT callback  
**Validation**: `npm run validate:auth`
