# 🔑 GET SUPABASE SERVICE ROLE KEY FOR AUTOMATED ONBOARDING

## 📍 STEPS TO GET THE KEY:

### 1. Go to Supabase API Settings:
https://supabase.com/dashboard/project/qxdwpihcmgctznvdfmbv/settings/api

### 2. Find "service_role" Key:
- Look for the section "Project API keys"
- Find the key labeled **"service_role"** 
- This is the **secret key** (not the public anon key)
- Click the **copy button** or **eye icon** to reveal it

### 3. Add to Vercel Environment:
1. Go to: https://vercel.com (your project dashboard)
2. Find your **khesed-tek-cms-org** project  
3. Go to **Settings → Environment Variables**
4. Click **Add New**
5. **Name**: `SUPABASE_SERVICE_ROLE_KEY`
6. **Value**: Paste the service_role key from Supabase
7. **Environments**: Check all (Production, Preview, Development)
8. Click **Save**

### 4. Redeploy (Optional):
The environment variable will be available on next deployment, or you can trigger a manual redeploy.

## 🎯 WHAT THIS ENABLES:
- ✅ **Automated tenant creation** from platform console
- ✅ **Auto-creates Supabase Auth users** (no more manual creation!)
- ✅ **Instant login capability** for new tenants
- ✅ **Welcome emails** with credentials sent automatically

## ⚠️ SECURITY NOTE:
The service_role key has admin privileges - **keep it secret** and only use it server-side.

## 🧪 TESTING:
Once configured, create a test church from the platform console and the tenant should be able to login immediately!