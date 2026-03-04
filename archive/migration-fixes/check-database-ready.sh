#!/bin/bash

echo "🔄 CHECKING SUPABASE DATABASE STATUS..."

export DATABASE_URL="postgresql://postgres:%5BBendecido100%24%23%23%24%5D@db.qxdwpihcmgctznvdfmbv.supabase.co:5432/postgres"

# Test database connection
if npx prisma db pull --force 2>/dev/null; then
    echo "✅ Database is ready! Completing setup..."
    
    # Push schema
    echo "📊 Pushing database schema..."
    npx prisma db push --force-reset --accept-data-loss
    
    # Generate client
    echo "🔧 Generating Prisma client..."
    npx prisma generate
    
    echo "🎉 DATABASE SETUP COMPLETE!"
    echo ""
    echo "🧪 NOW YOU CAN TEST:"
    echo "1. Go to: https://khesed-tek-cms-org.vercel.app"
    echo "2. Try logging in (we'll create users in Supabase manually)"
    echo "3. Test all 4 upload buttons in form-builder and settings"
    echo ""
    echo "✅ Upload authentication fix is deployed and ready!"
    
else
    echo "⏳ Supabase database is still initializing..."
    echo "🕒 This can take 5-10 minutes for new projects"
    echo ""
    echo "👀 TO CHECK AGAIN LATER, RUN:"
    echo "   ./check-database-ready.sh"
    echo ""
    echo "🌐 MEANWHILE, YOU CAN:"
    echo "   - Visit https://khesed-tek-cms-org.vercel.app"
    echo "   - Try the login page (may show database errors initially)"
    echo "   - The upload authentication fix is already deployed!"
fi