# Quick Reference Card

## 🚀 Deploy to Railway (5 Minutes)

```bash
# 1. Ensure environment variables in Railway:
DATABASE_URL=<provided by Railway PostgreSQL>
NEXTAUTH_URL=https://your-app.up.railway.app
NEXTAUTH_SECRET=OuDcyw8Ve9mPci5Bmlr3vBxFQYw/wbBgCS2ptt0jXRg=

# 2. Deploy (automatic build)
git push railway main

# 3. Run migrations (via Railway CLI)
railway run npx prisma migrate deploy

# 4. Done! ✅
```

## 🧪 Test Check-ins API

```bash
# Login to get session token
curl -X POST https://your-app.up.railway.app/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"soporte@khesedtek.com","password":"SuperAdmin2024!"}'

# Get check-ins (authenticated)
curl https://your-app.up.railway.app/api/check-ins \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"

# Create check-in (authenticated)
curl -X POST https://your-app.up.railway.app/api/check-ins \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "isFirstTime": true
  }'
```

## 🔧 Local Development

```bash
# Setup
npm install --legacy-peer-deps
npx prisma generate
npx prisma migrate dev

# Run
npm run dev
# Open http://localhost:3000
```

## 📋 What Was Fixed

| Issue | Fix |
|-------|-----|
| DATABASE_URL syntax error | Added missing closing quote |
| NEXTAUTH_URL invalid | Changed hash to production URL |
| NEXTAUTH_SECRET empty | Generated secure secret |
| Prisma hardcoded path | Removed, uses defaults |
| Missing mime-types | Added to dependencies |

## 📚 Documentation Files

- **DATABASE_SETUP_GUIDE.md** - Database configuration details
- **BUILD_INSTRUCTIONS.md** - Complete deployment guide
- **COMPLETION_SUMMARY.md** - Full task completion report
- **QUICK_REFERENCE.md** - This file (quick commands)

## ✅ Status: READY FOR PRODUCTION

All critical issues resolved. Deploy and test!
