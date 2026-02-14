#!/bin/bash
set -e

echo "🚀 CRITICAL DEPLOYMENT - ENTERPRISE COMPLIANCE PROTOCOL"
echo "======================================================="
echo ""

cd /workspaces/PURPOSE-DRIVEN

echo "📝 Staging changes..."
git add -A

echo "💾 Committing..."
git commit -m "🚨 CRITICAL: Enhanced database logging & connection testing

- Added detailed error logging in lib/auth.ts database catch block
- Added pgbouncer parameter validation in lib/db.ts
- Added startup connection test with success/failure logging
- Enabled production warning logs for database errors
- Removed misleading fallback auth messages

AUDIT TRAIL:
- Database: Supabase pooler (115 tables verified)
- Users: 2 confirmed (SUPER_ADMIN + María González/ADMIN_IGLESIA)
- Connection: Hardcoded with ?pgbouncer=true parameter
- Fallback auth: REMOVED completely

TEST CREDENTIALS:
- admin@iglesiacentral.com / password123 (ADMIN_IGLESIA)
- soporte@khesed-tek-systems.org / Bendecido100%\$\$% (SUPER_ADMIN)"

echo "🌐 Pushing to GitHub..."
git push origin main

echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "⏳ Vercel will rebuild automatically (ETA: 2-3 minutes)"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Wait 3 minutes for Vercel deployment"
echo "2. Clear browser cache and cookies"
echo "3. Test login at: https://khesed-tek-cms-org.vercel.app/auth/signin"
echo "4. Check browser console for [DB] and [AUTH] logs"
echo "5. Report any errors immediately"
