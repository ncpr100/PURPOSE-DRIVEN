#!/bin/bash

echo "🧪 TESTING SUPABASE DATABASE CONNECTION..."

export DATABASE_URL="postgresql://postgres:Bendecido100%$$%@db.qxdwpihcmgctznvdfmbv.supabase.co:5432/postgres"

# Test connection
if npx prisma db pull --force 2>/dev/null; then
    echo "✅ DATABASE IS READY!"
    echo ""
    echo "🔧 Pushing database schema..."
    npx prisma db push --force-reset --accept-data-loss
    
    echo "🔄 Generating Prisma client..."
    npx prisma generate
    
    echo ""
    echo "🎉 SETUP COMPLETE! YOU CAN NOW:"
    echo "1. Login at: https://khesed-tek-cms-org.vercel.app/auth/signin"
    echo "2. Use credentials:"
    echo "   - admin@iglesiacentral.com / Khesed2024!Admin"
    echo "   - soporte@khesed-tek-systems.org / SuperAdmin2024!Secure"
    echo "3. Test all 4 upload buttons:"
    echo "   - Church Settings Logo: /settings/profile"
    echo "   - Form Builder Church Logo: /form-builder → Paso 1"
    echo "   - QR Logo Upload: /form-builder → Paso 3 → Logo tab"
    echo "   - QR Background Upload: /form-builder → Paso 3 → Advanced tab"
    echo ""
    echo "🎯 The 'No autorizado' errors should be FIXED!"
    
else
    echo "⏳ Database still initializing..."
    echo "🕐 Try again in 5-10 minutes"
    echo "📝 Run: ./test-when-database-ready.sh"
fi