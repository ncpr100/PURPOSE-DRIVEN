#!/bin/bash

echo "🚀 CREATING USERS DIRECTLY IN SUPABASE AUTH..."

SUPABASE_URL="https://qxdwpihcmgctznvdfmbv.supabase.co"
SUPABASE_ANON_KEY="sb_publishable_AMgUhwrctl6nCMzDKCW8hw_NQFPPXkx"

echo "📧 Creating SUPER_ADMIN user: soporte@khesed-tek-systems.org"
curl -X POST "${SUPABASE_URL}/auth/v1/signup" \
  -H "Content-Type: application/json" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -d '{
    "email": "soporte@khesed-tek-systems.org",
    "password": "Bendecido100%$$%",
    "data": {
      "name": "Super Admin",
      "role": "SUPER_ADMIN"
    }
  }'

echo ""
echo "👤 Creating TENANT user: admin@iglesiacentral.com"
curl -X POST "${SUPABASE_URL}/auth/v1/signup" \
  -H "Content-Type: application/json" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -d '{
    "email": "admin@iglesiacentral.com", 
    "password": "password123",
    "data": {
      "name": "Church Admin",
      "role": "ADMIN_IGLESIA"
    }
  }'

echo ""
echo ""
echo "✅ USERS CREATED! Now test login:"
echo "🌐 Go to: https://khesed-tek-cms-org.vercel.app/auth/signin"
echo ""
echo "👑 SUPER_ADMIN:"
echo "   Email: soporte@khesed-tek-systems.org"
echo "   Password: Bendecido100%$$%"
echo ""
echo "🏛️ TENANT:"
echo "   Email: admin@iglesiacentral.com"
echo "   Password: password123"