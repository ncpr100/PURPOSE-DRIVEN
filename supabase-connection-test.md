# Supabase Connection Issue - Action Required

## The Problem
Vercel can connect from browser (SQL Editor works), but serverless functions can't reach `db.qxdwpihcmgctznvdfmbv.supabase.co:5432`

## Solution: Use Supabase Connection Pooler

### Step 1: Get Pooler Connection String
1. Go to: https://supabase.com/dashboard/project/qxdwpihcmgctznvdfmbv/settings/database
2. Scroll to "Connection string" section
3. Click **"Transaction"** or **"Session"** tab
4. Copy the connection string that looks like:
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
   
### Step 2: Key Differences
- Direct: `db.qxdwpihcmgctznvdfmbv.supabase.co:5432`
- Pooler: `aws-0-us-east-1.pooler.supabase.com:6543` ← **Use this for serverless**

### Step 3: Update Vercel Environment Variable
Replace DATABASE_URL in Vercel with the pooler URL (keep the URL-encoded password)

### Alternative: Enable IPv4
If using direct connection, check Supabase Settings → Database → "Enable IPv4" (Supabase uses IPv6 by default, Vercel needs IPv4)
