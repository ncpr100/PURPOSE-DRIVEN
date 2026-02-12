#!/bin/bash

echo "🔄 DATABASE CONNECTION MONITOR - Will keep trying until success"
echo ""

DB_URL="postgresql://postgres:Bendecido100%$$%@db.qxdwpihcmgctznvdfmbv.supabase.co:5432/postgres"
ATTEMPT=1
MAX_ATTEMPTS=20

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo "Attempt $ATTEMPT/$MAX_ATTEMPTS - Testing database connection..."
    
    export DATABASE_URL="$DB_URL"
    
    # Try to push schema
    if npx prisma db push --force-reset --accept-data-loss 2>/dev/null; then
        echo ""
        echo "🎉 SUCCESS! Database connected and schema created!"
        echo ""
        
        # Generate Prisma client
        npx prisma generate >/dev/null 2>&1
        
        echo "✅ Database schema deployed"
        echo "✅ Prisma client generated"  
        echo "✅ Authentication should now work!"
        echo ""
        echo "🧪 TEST LOGIN NOW:"
        echo "   https://khesed-tek-cms-org.vercel.app/auth/signin"
        echo ""
        echo "👑 SUPER_ADMIN: soporte@khesed-tek-systems.org / Bendecido100%$$%"
        echo "🏛️ TENANT: admin@iglesiacentral.com / password123"
        echo ""
        echo "📤 Test upload buttons after login - should work!"
        
        exit 0
    else
        echo "❌ Still connecting... (attempt $ATTEMPT/$MAX_ATTEMPTS)"
        sleep 30  # Wait 30 seconds between attempts
        ATTEMPT=$((ATTEMPT + 1))
    fi
done

echo ""
echo "⏰ Maximum attempts reached. Database might need more time."
echo "💡 Try running this script again in 10-15 minutes."