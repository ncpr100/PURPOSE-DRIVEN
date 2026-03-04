#!/bin/bash

echo "🚀 DEPLOYING CRITICAL FIXES TO PRODUCTION..."
echo ""

# Add all new files
echo "📦 Adding files..."
git add app/api/platform/users/route.ts
git add FIX_JUAN_PASSWORD.sql
git add FIX_CHURCH_ASSIGNMENT.sql
git add DIAGNOSTIC_QUERY.sql
git add CRITICAL_FIX_PLAN.md
git add fix-church-assignment-and-login.js
git add generate-password-hash.js
git add reset-juan-password.sh

# Commit
echo "💾 Committing..."
git commit -m "CRITICAL FIX: Church assignment display + password reset scripts

- Fix API to return 'church' instead of 'churches' for frontend compatibility
- Add SQL scripts to reset Juan Pachanga password
- Add diagnostic queries for troubleshooting
- Complete action plan for tenant access issues"

# Push to production
echo "🌐 Pushing to GitHub (triggers Vercel deployment)..."
git push origin main

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "⏰ Wait 2-3 minutes for Vercel to build and deploy"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Run: psql \"CONNECTION_STRING\" < FIX_JUAN_PASSWORD.sql"
echo "2. Run: psql \"CONNECTION_STRING\" < FIX_CHURCH_ASSIGNMENT.sql"
echo "3. Clear browser cache (Ctrl+Shift+Delete)"  
echo "4. Login at: https://khesed-tek-cms-org.vercel.app/auth/signin"
echo "   Email: testadmin@prueba.com"
echo "   Password: TestPassword123!"
echo ""
echo "🔍 To verify deployment: https://vercel.com/dashboard"
