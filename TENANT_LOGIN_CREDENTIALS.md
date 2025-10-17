# 🔐 LOGIN CREDENTIALS

## Super Admin (Platform Level)
```
URL: https://khesed-tek-cms.up.railway.app/auth/signin
Email: soporte@khesed-tek.com
Password: Bendecido100%$$%
Role: SUPER_ADMIN
Access: Platform dashboard, all churches management
```

# 🔐 LOGIN CREDENTIALS

## Super Admin (Platform Level)
```
URL: https://khesed-tek-cms.up.railway.app/auth/signin
Email: soporte@khesed-tek.com
Password: Bendecido100%$$%
Role: SUPER_ADMIN
Access: Platform dashboard, all churches management
```

## Tenant Admin (Church Level)

### 1. Test Church - Iglesia de Prueba
```
URL: https://khesed-tek-cms.up.railway.app/auth/signin
Email: admin@iglesiadeprueba.com
Password: Admin123!
Role: ADMIN_IGLESIA
Church: Iglesia de Prueba
Church ID: cmgu17gel000078ibvdye9vxd
Admin ID: cmgu17gka000278ibjf1514dz
Members: 0 (test church)
Access: Church dashboard, automation, members, donations, etc.
```

### 2. Community Church - Iglesia Comunidad de Fe (MIGRATED DATA)
```
URL: https://khesed-tek-cms.up.railway.app/auth/signin
Email: admin@comunidaddefe.org
Password: ChurchAdmin2025!
Role: ADMIN_IGLESIA
Church: Iglesia Comunidad de Fe
Church ID: cmgu3bev8000078ltyfy89pil
Members: 999 (Planning Center migration)
Ministries: 12
Pastors: 5 (PASTOR role)
Leaders: 50 (LIDER role)
Regular Members: 944 (MIEMBRO role)
Access: Full church management with realistic large dataset
```

## How to Test

### 1. Super Admin Login
1. Go to: https://khesed-tek-cms.up.railway.app/auth/signin
2. Login with: soporte@khesed-tek.com / Bendecido100%$$%
3. Should redirect to: `/platform/dashboard`
4. Can manage all churches

### 2. Small Tenant Admin Login (Empty Church)
1. Go to: https://khesed-tek-cms.up.railway.app/auth/signin
2. Login with: admin@iglesiadeprueba.com / Admin123!
3. Should redirect to: `/home` (tenant dashboard)
4. Can test creating members from scratch

### 3. Large Tenant Admin Login (999 Members - RECOMMENDED FOR TESTING)
1. Go to: https://khesed-tek-cms.up.railway.app/auth/signin
2. Login with: admin@comunidaddefe.org / ChurchAdmin2025!
3. Should redirect to: `/home` (tenant dashboard)
4. Can access:
   - Automation Rules: `/automation-rules`
   - Automation Dashboard: `/automation-rules/dashboard`
   - Template Browser: `/automation-rules/templates`
   - Prayer Requests: `/prayer-wall`
   - Check-ins: `/check-ins`
   - Members: `/members` (999 members!)
   - Donations: `/donations`
   - Analytics with real data
   - Ministry management (12 ministries)

## Testing the Migration Data

**Best Test Scenarios with Iglesia Comunidad de Fe:**
1. Create a prayer request → Should trigger prayer automation
2. Add a new visitor → Should trigger visitor follow-up
3. View member analytics → Should show 999 members across 12 ministries
4. Test search and filtering with large dataset
5. Assign members to ministries
6. Run reports with meaningful data
