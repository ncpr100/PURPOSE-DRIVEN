# 🚀 Railway Environment Variables Setup - PRODUCTION READY

**Date**: January 7, 2026  
**Status**: ✅ Domain verified in Resend (`khesed-tek-systems.org`)

---

## Required Environment Variables for Railway

### **Step 1: Access Railway Dashboard**
1. Go to: https://railway.app/project/[your-project-id]
2. Click on your **khesed-tek-cms** service
3. Navigate to **Variables** tab

### **Step 2: Add These Variables**

Copy and paste each variable exactly:

```bash
RESEND_API_KEY=re_SJntBLZa_L8XYtMQarjrfh3Z3SF3T5KK3
FROM_EMAIL=onboarding@khesed-tek-systems.org
FROM_NAME=Khesed-tek Church Management Systems
```

**Important**: Use `onboarding@khesed-tek-systems.org` (NOT `@resend.dev`)

### **Step 3: Verify Current Variables**

Make sure these are already set (they should be):
- ✅ `DATABASE_URL` - PostgreSQL connection string
- ✅ `NEXTAUTH_URL` - Should be `https://khesed-tek-cms.up.railway.app`
- ✅ `NEXTAUTH_SECRET` - JWT encryption key

### **Step 4: Redeploy**

After adding variables:
1. Click **Deploy** button in Railway
2. Wait for deployment to complete (~2-3 minutes)
3. Check deployment logs for errors

---

## Testing Email Delivery

### **Test 1: Create Church in Platform**
1. Login as SUPER_ADMIN: https://khesed-tek-cms.up.railway.app/platform
2. Click **Onboard New Church**
3. Fill church details + admin email
4. Submit form

### **Test 2: Check Resend Dashboard**
1. Go to: https://resend.com/emails
2. Look for recent email
3. Status should show **"Delivered"** ✅ (not "Test")

### **Test 3: Check Admin Inbox**
1. Open admin email inbox
2. Search for: "Bienvenido a Khesed-tek"
3. Email should contain:
   - Temporary password
   - Login URL
   - Instructions

---

## Email Addresses Available

With verified domain `khesed-tek-systems.org`, you can use:

- ✅ `onboarding@khesed-tek-systems.org` - Church onboarding
- ✅ `noreply@khesed-tek-systems.org` - System notifications
- ✅ `support@khesed-tek-systems.org` - Support emails
- ✅ `admin@khesed-tek-systems.org` - Admin communications
- ✅ ANY email @khesed-tek-systems.org

No additional configuration needed - domain is already verified!

---

## Current Configuration Status

### ✅ **READY FOR PRODUCTION**
- Domain: `khesed-tek-systems.org` - **VERIFIED**
- API Key: `re_SJntBLZa_L8XYtMQarjrfh3Z3SF3T5KK3` - **VALID**
- Local .env: **UPDATED** to use verified domain
- Code: **READY** - email sending already implemented

### ⚠️ **ACTION REQUIRED**
- Railway environment variables: **NEEDS UPDATE**
- Add 3 variables listed above
- Redeploy application

---

## Troubleshooting

### If emails still don't send:

**Check Railway Logs**:
```bash
# In Railway dashboard, click "View Logs"
# Look for:
"✅ Resend email sent: [email-id]"  ← SUCCESS
"Resend API error: ..."             ← FAILURE
```

**Check Resend Dashboard**:
- Status: "Delivered" ✅
- Status: "Bounced" ❌ (invalid recipient email)
- Status: "Failed" ❌ (API error)

**Common Issues**:
1. **Missing Railway variables**: Add all 3 variables above
2. **Typo in FROM_EMAIL**: Must be exact `onboarding@khesed-tek-systems.org`
3. **Recipient spam folder**: Check junk/spam folder
4. **Invalid recipient email**: Use valid email address for testing

---

## Success Checklist

- [ ] Added `RESEND_API_KEY` to Railway
- [ ] Added `FROM_EMAIL=onboarding@khesed-tek-systems.org` to Railway
- [ ] Added `FROM_NAME` to Railway
- [ ] Redeployed Railway application
- [ ] Tested church creation in platform
- [ ] Verified email delivery in Resend dashboard
- [ ] Confirmed email arrived in inbox

---

**Next Step**: Copy the 3 environment variables to Railway and redeploy! 🚀
