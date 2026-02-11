#!/bin/bash

echo "🚀 NEON POSTGRESQL SETUP FOR VERCEL DEPLOYMENT"
echo "================================================"

echo ""
echo "📋 STEP 1: Create Neon Account & Database"
echo "1. Go to: https://neon.tech/"
echo "2. Click 'Sign Up' (use GitHub for easy access)"
echo "3. Create new project: 'khesed-tek-church-cms'"
echo "4. Region: Select closest to your users"
echo "5. PostgreSQL version: 15 (latest stable)"

echo ""
echo "📋 STEP 2: Get Database Connection String"
echo "1. In Neon dashboard, click 'Connection Details'"
echo "2. Copy the 'Prisma' connection string (includes connection pooling)"
echo "3. It should look like:"
echo "   postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/khesed-tek-church-cms?sslmode=require&pgbouncer=true"

echo ""
echo "📋 STEP 3: Update Vercel Environment Variables"
echo "Run this command with your new DATABASE_URL:"
echo "   vercel env add DATABASE_URL production"

echo ""
echo "📋 STEP 4: Update Environment Variables for All Environments"
echo "   vercel env add DATABASE_URL preview"  
echo "   vercel env add DATABASE_URL development"

echo ""
echo "📋 STEP 5: Deploy with New Database"
echo "   vercel --prod"

echo ""
echo "🎯 EXPECTED RESULT:"
echo "✅ Both tenant (admin@iglesiacentral.com) and SUPER_ADMIN login will work"
echo "✅ All 4 upload buttons will function properly"
echo "✅ Database operations will be fast and reliable"

echo ""
echo "🔗 HELPFUL LINKS:"
echo "• Neon Dashboard: https://console.neon.tech/"
echo "• Neon + Vercel Guide: https://neon.tech/docs/guides/vercel"

echo ""
echo "⚠️  IMPORTANT: Keep your old Railway backup until Neon is fully tested!"