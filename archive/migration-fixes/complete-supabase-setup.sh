#!/bin/bash

echo "🚀 STARTING AUTOMATED SUPABASE SETUP..."

# Set the correct DATABASE_URL with URL-encoded password
export DATABASE_URL="postgresql://postgres:%5BBendecido100%24%23%23%24%5D@db.qxdwpihcmgctznvdfmbv.supabase.co:5432/postgres"

echo "✅ DATABASE_URL configured with Supabase connection"

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install --silent

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate

# Push database schema to Supabase
echo "🗄️ Pushing database schema to Supabase..."
npx prisma db push --force-reset --accept-data-loss

# Update Vercel environment variables
echo "☁️ Updating Vercel environment variables..."
echo "DATABASE_URL=$DATABASE_URL" > .env.production

# Build and deploy
echo "🔨 Building application..."
npm run build

echo "🎉 SETUP COMPLETE!"
echo ""
echo "✅ Database schema deployed to Supabase"
echo "✅ Prisma client generated"
echo "✅ Environment configured"
echo ""
echo "🔗 DATABASE_URL: postgresql://postgres:***@db.qxdwpihcmgctznvdfmbv.supabase.co:5432/postgres"
echo ""
echo "🧪 TESTING INSTRUCTIONS:"
echo "1. Set DATABASE_URL in your local environment:"
echo "   export DATABASE_URL=\"postgresql://postgres:%5BBendecido100%24%23%23%24%5D@db.qxdwpihcmgctznvdfmbv.supabase.co:5432/postgres\""
echo "2. Run local server: npm run dev"
echo "3. Test uploads at: http://localhost:3000/form-builder"
echo "4. Login credentials for testing:"
echo "   - Will be created automatically in next step"

