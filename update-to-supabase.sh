#!/bin/bash

echo "🔧 SUPABASE DATABASE UPDATE SCRIPT"
echo "================================="

echo ""
echo "📋 STEP 1: Update Vercel Environment Variables"
echo "Replace YOUR_SUPABASE_URL with your actual connection string:"
echo ""
echo "vercel env rm DATABASE_URL production"
echo "vercel env add DATABASE_URL production"
echo "# Paste your Supabase URL when prompted"
echo ""
echo "vercel env rm DATABASE_URL preview" 
echo "vercel env add DATABASE_URL preview"
echo "# Paste same URL"
echo ""
echo "vercel env rm DATABASE_URL development"
echo "vercel env add DATABASE_URL development" 
echo "# Paste same URL"
echo ""

echo "📋 STEP 2: Update Local Environment"
echo "Update .env file:"
read -p "Paste your Supabase DATABASE_URL here: " DATABASE_URL

if [ ! -z "$DATABASE_URL" ]; then
    echo ""
    echo "📝 Updating .env file..."
    
    # Backup current .env
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    
    # Update DATABASE_URL in .env
    if grep -q "^DATABASE_URL=" .env; then
        sed -i.bak "s|^DATABASE_URL=.*|DATABASE_URL=\"$DATABASE_URL\"|" .env
    else
        echo "DATABASE_URL=\"$DATABASE_URL\"" >> .env
    fi
    
    echo "✅ .env updated with new DATABASE_URL"
    echo "✅ Backup saved as .env.backup.*"
    
    echo ""
    echo "📋 STEP 3: Push Database Schema"
    echo "Running: npx prisma db push"
    npx prisma db push
    
    echo ""
    echo "📋 STEP 4: Create Users"
    echo "Running user creation script..."
    node migrate-to-neon.js
    
    echo ""
    echo "📋 STEP 5: Deploy to Vercel"
    echo "Running: vercel --prod"
    vercel --prod
    
    echo ""
    echo "🎉 SETUP COMPLETE!"
    echo "=================="
    echo "✅ Database: Supabase PostgreSQL"
    echo "✅ Users: Created (tenant + SUPER_ADMIN)"
    echo "✅ Deployed: Vercel production"
    echo ""
    echo "🧪 TEST NOW:"
    echo "1. Tenant: admin@iglesiacentral.com / password123"
    echo "2. SUPER_ADMIN: soporte@khesed-tek-systems.org / Bendecido100%$$%"
    echo "3. Test all 4 upload buttons"
    
else
    echo "❌ No DATABASE_URL provided. Please run this script again with your Supabase URL."
fi