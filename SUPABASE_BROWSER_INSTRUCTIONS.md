🚀 SUPABASE SETUP - USE YOUR OWN BROWSER
========================================

📍 STEP 1: Go to Supabase in Your Browser
==========================================
1. Open your browser
2. Go to: https://supabase.com/
3. Click "Start your project"
4. Click "Continue with GitHub" (fastest option)

📍 STEP 2: Create Organization (First Time Only)
==============================================
1. Organization Name: "Khesed-Tek" 
2. Plan: "Free" (perfect for testing)
3. Click "Create Organization"

📍 STEP 3: Create Your Database Project  
========================================
1. Click "New Project"
2. Fill out the form:
   • Project Name: "khesed-tek-church-cms"
   • Database Password: "ChurchCMS2026!" (SAVE THIS!)
   • Region: Choose closest to you (e.g., "US East", "US West", "Europe")
   • Pricing Plan: "Free" (includes 500MB database)
3. Click "Create new project"
4. Wait 2-3 minutes for setup (you'll see a progress screen)

📍 STEP 4: Get Your Connection String
===================================
After project is created:
1. In your project dashboard, click "Settings" (gear icon in left sidebar)
2. Click "Database" in the settings menu
3. Scroll down to "Connection string" section
4. Click "URI" tab (NOT "Prisma" tab)
5. Copy the connection string that looks like:
   
   postgresql://postgres.xxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres

6. IMPORTANT: Replace [YOUR-PASSWORD] with: ChurchCMS2026!

📍 STEP 5: Final Connection String
=================================
Your final URL should look like:
postgresql://postgres.abcdefghijklmnop:ChurchCMS2026!@aws-0-us-west-1.pooler.supabase.com:6543/postgres

COPY THIS EXACT STRING - we'll use it next!

📍 STEP 6: Paste It Here
=======================
Once you have your connection string, come back here and I'll run the automated setup script that will:
✅ Update all Vercel environment variables
✅ Create database schema 
✅ Create tenant and SUPER_ADMIN users
✅ Deploy to production
✅ Test both login types

🎯 ESTIMATED TIME: 10 minutes total (3 min setup + 2 min automation)

Just paste your connection string when you're ready! 🚀