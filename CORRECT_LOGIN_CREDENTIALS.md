
# 🔐 KHESED-TEK OFFICIAL LOGIN CREDENTIALS

## 🚨 CRITICAL AUTHENTICATION INFORMATION (SINGLE SOURCE OF TRUTH)

**Last Updated**: February 13, 2026

**✅ OFFICIAL SUPER_ADMIN LOGIN (PLATFORM ADMINISTRATOR):**

### Production SUPER_ADMIN Account:
```
Email: soporte@khesed-tek-systems.org
Password: Bendecido100%$$%
Role: SUPER_ADMIN
ChurchId: NULL (platform-wide access)
Status: Active ✅
Name: Khesed-Tek Support
```

**⚠️ CRITICAL RULES:**
- **THERE IS ONLY 1 SUPER_ADMIN** - NO additional SUPER_ADMIN accounts exist
- **Platform Level**: SUPER_ADMIN manages entire platform (/platform/* routes)
- **Tenant Level**: Churches have PASTOR, ADMIN_IGLESIA, LIDER, MIEMBRO roles
- **NEVER** create additional SUPER_ADMIN accounts
- **NEVER** assign SUPER_ADMIN role to church users

**Access URLs**:
- Login: `/auth/signin`
- Platform Dashboard: `/platform/dashboard`
- Platform Management: `/platform/*` (SUPER_ADMIN only)

## CHURCH-LEVEL ROLES (TENANT USERS)

### Example Church User (Iglesia Central):
```
Email: pastor@iglesiacentral.com
Password: password123
Role: PASTOR
ChurchId: iglesia-central
Access: /(dashboard)/* routes (church-scoped)
```

**Church Role Hierarchy**:
1. **PASTOR**: Highest church-level role
2. **ADMIN_IGLESIA**: Church administrators
3. **LIDER**: Church leaders
4. **MIEMBRO**: Church members

## AUTHENTICATION FLOW

1. **Platform Admin**: Login with SUPER_ADMIN → Access `/platform/*`
2. **Church Users**: Login with church role → Access `/(dashboard)/*` with churchId scope

## FIXES IMPLEMENTED

🔧 **Contact Information Cache Refresh**:
- Added cache-busting query parameters
- Implemented event-driven refresh system
- Added localStorage and custom event listeners
- Force refresh after successful save

🔧 **Authentication Issues Resolved**:
- Correct email addresses identified
- SSE connection errors will resolve with proper auth
- Session management working properly

## SUPPORT

If issues persist after using correct credentials, check:
1. Browser cache (clear if needed)
2. Network tab for 401/403 errors
3. Console for authentication errors

---

**STATUS: ALL SYSTEMS OPERATIONAL** ✅
**DEPLOYMENT: READY FOR PRODUCTION** 🚀
