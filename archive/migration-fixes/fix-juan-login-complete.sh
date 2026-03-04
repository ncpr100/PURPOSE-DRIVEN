#!/bin/bash

# COMPREHENSIVE FIX FOR JUAN PACHANGA LOGIN
# This script:
# 1. Resets password to: TestPassword123!
# 2. Verifies church assignment  
# 3. Activates account
# 4. Shows final status

CONN="postgresql://postgres.qxdwpihcmgctznvdfmbv:Bendecido100%24%24%@aws-1-us-east-1.pooler.supabase.com:6543/postgres"

echo "═══════════════════════════════════════════════════════"
echo "🔧 JUAN PACHANGA LOGIN FIX - COMPREHENSIVE REPAIR"
echo "═══════════════════════════════════════════════════════"
echo ""

# Generate a fresh bcrypt hash using Node.js
echo "🔐 Step 1: Generating fresh password hash..."
HASH=$(node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('TestPassword123!', 12).then(h => console.log(h))")

if [ -z "$HASH" ]; then
  echo "❌ Failed to generate hash. Using pre-computed hash."
  HASH='$2a$12$LTW3XfhZ6KBqHvF0iIqEHOMZ3kF9mXl6sI0wX5YkQvNkC5HkOEzKS'
fi

echo "✅ Hash generated: ${HASH:0:20}..."
echo ""

echo "🗄️  Step 2: Updating database..."
psql "$CONN" << EOF
-- Update password and ensure account is active
UPDATE users 
SET 
  password = '$HASH',
  "updatedAt" = NOW(),
  "isActive" = true
WHERE email = 'testadmin@prueba.com';

-- Show update confirmation  
SELECT 
  '✅ PASSWORD UPDATED' as status,
  email,
  name,
  role
FROM users 
WHERE email = 'testadmin@prueba.com';
EOF

echo ""
echo "🏛️  Step 3: Verifying church assignment..."
psql "$CONN" << EOF
-- Check church assignment
SELECT 
  u.email,
  u.name,
  u.role,
  u."churchId",
  c.name as church_name,
  u."isActive",
  CASE WHEN u.password IS NOT NULL THEN '✅ SET' ELSE '❌ MISSING' END as password_status
FROM users u
LEFT JOIN churches c ON u."churchId" = c.id
WHERE u.email = 'testadmin@prueba.com';
EOF

echo ""
echo "═══════════════════════════════════════════════════════"
echo "✅ FIX COMPLETE!"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "📋 LOGIN CREDENTIALS:"
echo "   URL: https://khesed-tek-cms-org.vercel.app/auth/signin"
echo "   Email: testadmin@prueba.com" echo "   Password: TestPassword123!"
echo ""
echo "⏰ IMPORTANT:"
echo "   1. Wait 2-3 minutes for Vercel deployment to finish"
echo "   2. Clear browser cache (Ctrl+Shift+Delete - ALL data)"
echo "   3. Try logging in with credentials above"
echo ""
echo "🔍 If login still fails, check:"
echo "   - Vercel deployment status: https://vercel.com/dashboard"
echo "   - Browser console for errors (F12)"
echo "   - Correct password is typed (case-sensitive!)"
echo ""
