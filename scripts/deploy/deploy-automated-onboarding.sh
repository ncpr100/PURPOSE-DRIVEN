#!/bin/bash

echo "🚀 DEPLOYING AUTOMATED TENANT ONBOARDING..."

# Add the required environment variable info
echo "📝 IMPORTANT: Add this environment variable to Vercel:"
echo "   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here"
echo ""
echo "   Get it from: https://supabase.com/dashboard/project/qxdwpihcmgctznvdfmbv/settings/api"
echo "   Look for 'service_role' key (secret)"
echo ""

# Deploy the changes
echo "🚀 Deploying automated tenant creation..."
git add .
git commit -m "FEATURE: Automated Supabase Auth user creation for new tenants"
git push origin main

echo ""
echo "✅ AUTOMATED TENANT ONBOARDING DEPLOYED!"
echo ""
echo "🎯 WHAT'S NEW:"
echo "   ✅ Super admin creates tenants via platform console"
echo "   ✅ Database users created automatically" 
echo "   ✅ Supabase Auth users created automatically (when configured)"
echo "   ✅ Welcome emails sent with credentials"
echo "   ✅ No more manual Supabase Auth user creation!"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Add SUPABASE_SERVICE_ROLE_KEY to Vercel environment"
echo "2. Test tenant creation in platform console"
echo "3. New tenants will be able to login immediately!"
echo ""
echo "🧪 TEST AT:"
echo "   Login as SUPER_ADMIN: soporte@khesed-tek-systems.org"
echo "   Go to: /platform/churches/onboard"
echo "   Create a test church - user will be auto-created!"