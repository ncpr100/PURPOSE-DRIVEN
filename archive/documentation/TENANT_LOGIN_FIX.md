# 🔧 TENANT LOGIN FIX - María González Authentication

**Status:** SUPER_ADMIN login ✅ WORKING | Tenant login ❌ FAILING

**Issue:** "Email o contraseña incorrectos" when logging in as admin@iglesiacentral.com

---

## 📊 DIAGNOSIS

**What's Working:**
- ✅ Database connection (SUPER_ADMIN login successful)
- ✅ Authentication system (platform access working)
- ✅ Vercel deployment (latest build active)

**What's Failing:**
- ❌ Tenant user authentication (María González)
- ❌ Possible causes:
  1. User doesn't exist in database
  2. Password hash is incorrect/mismatched
  3. User is inactive (isActive = false)
  4. ChurchId relationship is broken

---

## 🎯 SOLUTION - TWO OPTIONS

### **OPTION 1: Check Via SUPER_ADMIN Platform (EASIEST)**

Since you're already logged in as SUPER_ADMIN:

1. **Navigate to Users section:**
   - In left sidebar, click **"Usuarios"** (Users)
   - Search for email: `admin@iglesiacentral.com`

2. **Check user status:**
   - Does María González appear in the list?
   - Is "isActive" set to TRUE?
   - Does she have role "ADMIN_IGLESIA"?
   - Is churchId "iglesia-central" assigned?

3. **If user doesn't exist or is inactive:**
   - Proceed to OPTION 2 below

### **OPTION 2: Fix Via SQL Script (GUARANTEED FIX)**

Run the prepared SQL script to create/fix María González user:

```bash
# Navigate to project directory
cd /workspaces/PURPOSE-DRIVEN

# Run the fix script
PGPASSWORD='Bendecido100%$$%' psql \
  -h aws-0-us-east-1.pooler.supabase.com \
  -p 6543 \
  -U postgres.qxdwpihcmgctznvdfmbv \
  -d postgres \
  -f fix-maria-user.sql
```

**What this script does:**
1. ✅ Ensures "Iglesia Central" church exists
2. ✅ Creates or updates María González user
3. ✅ Sets correct password hash for "password123"
4. ✅ Activates the user (isActive = true)
5. ✅ Links user to church (churchId = iglesia-central)
6. ✅ Verifies the fix

**Expected output:**
```
NOTICE:  ✅ User exists - will update password
INSERT 0 1
INSERT 0 1

         email          |      name       |     role      |   churchId      | isActive | password_preview
------------------------+-----------------+---------------+-----------------+----------+------------------
admin@iglesiacentral.com| María González  | ADMIN_IGLESIA | iglesia-central | t        | $2a$12$LQv3c1yqBWVHxkd0LHAkCO...
```

---

## 🧪 TEST AFTER FIX

1. **Clear browser cache:**
   ```
   Ctrl + Shift + Delete
   Select: Cookies + Cached files
   Click "Clear data"
   ```

2. **Test tenant login:**
   - Go to: https://khesed-tek-cms-org.vercel.app/auth/signin
   - Email: `admin@iglesiacentral.com`
   - Password: `password123`
   - Click "Iniciar Sesión"

3. **Expected result:**
   - ✅ Login succeeds
   - ✅ Redirect to `/home` (church dashboard)
   - ✅ Shows "Iglesia Central" dashboard
   - ✅ Navigation menu visible
   - ✅ NO "Sin Conexión" error

---

## 📋 VERIFICATION CHECKLIST

After running the fix script:

- [ ] SQL script executed without errors?
- [ ] Verification query shows user exists?
- [ ] User has role "ADMIN_IGLESIA"?
- [ ] User is active (isActive = t)?
- [ ] ChurchId is "iglesia-central"?
- [ ] Password hash starts with "$2a$12$"?
- [ ] Login attempt succeeds?
- [ ] Church dashboard loads?

---

## 🚨 IF ISSUE PERSISTS

**Additional diagnostic endpoint available:**

After next deployment (in progress), access:
```
https://khesed-tek-cms-org.vercel.app/api/diagnostic/check-maria
```

This will return JSON with:
- User existence status
- Church relationship
- Password hash validation
- SQL fix commands if needed

---

## 📝 CREDENTIALS SUMMARY

**SUPER_ADMIN (Platform):**
- Email: `soporte@khesed-tek-systems.org`
- Password: `Bendecido100%$$%`
- Role: `SUPER_ADMIN`
- ChurchId: `NULL` (platform-wide access)
- Status: ✅ WORKING

**TENANT ADMIN (Iglesia Central):**
- Email: `admin@iglesiacentral.com`
- Password: `password123`
- Role: `ADMIN_IGLESIA`
- ChurchId: `iglesia-central`
- Status: ⏳ FIXING

---

**Next Step:** Run the fix-maria-user.sql script using the command above, then test login.

