# Build and Deployment Instructions

## ✅ Completed Configuration

### 1. Environment Variables Fixed
All critical environment variables have been properly configured:
- `DATABASE_URL`: Railway PostgreSQL connection string (fixed missing quote)
- `NEXTAUTH_URL`: Production URL (https://purpose-driven-production.up.railway.app)
- `NEXTAUTH_SECRET`: Secure secret generated with OpenSSL

### 2. Prisma Configuration Fixed
- Removed hardcoded output path
- Using default Prisma client location in node_modules
- Compatible with Railway deployment

### 3. Dependencies Installed
- All npm packages installed with `--legacy-peer-deps` flag
- Prisma Client generated (v6.7.0)
- Added missing `mime-types` package

### 4. Database Migrations Ready
Existing migrations identified:
- `20240824_add_automation_rules`
- `20250826_add_support_contact_info`

## 🚀 Deployment to Railway

Railway will automatically:
1. Install dependencies
2. Generate Prisma client
3. Run database migrations
4. Build the Next.js application
5. Start the production server

### Build Commands (package.json)
```json
{
  "scripts": {
    "build": "next build",
    "postinstall": "prisma generate"
  }
}
```

### Environment Variables Required in Railway
Ensure these are set in Railway dashboard:
- `DATABASE_URL` (automatically provided by Railway PostgreSQL)
- `NEXTAUTH_URL` (your production URL)
- `NEXTAUTH_SECRET` (copy from .env)
- Any other API keys needed for integrations

## 🔧 Local Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or remote public URL)

### Setup Steps

1. **Clone Repository**
```bash
git clone <repository-url>
cd PURPOSE-DRIVEN
```

2. **Install Dependencies**
```bash
npm install --legacy-peer-deps
```

3. **Configure Environment**
```bash
cp .env.example .env.local
# Edit .env.local with your local database URL
```

4. **Generate Prisma Client**
```bash
npx prisma generate
```

5. **Run Database Migrations**
```bash
npx prisma migrate dev
```

6. **Start Development Server**
```bash
npm run dev
```

## 🧪 Testing Check-ins API

### Local Testing (with development server running)
```bash
# Login first to get session token
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"soporte@khesedtek.com","password":"SuperAdmin2024!"}'

# Then use the session to access check-ins
curl http://localhost:3000/api/check-ins \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

### Production Testing (Railway)
```bash
curl https://purpose-driven-production.up.railway.app/api/check-ins \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

## 🐛 Known Issues and Workarounds

### Google Fonts in Restricted Environments
**Issue**: Build fails in environments without internet access to fonts.googleapis.com

**Workaround for CI/CD**: The font will be fetched during production build on Railway where internet access is available.

**Alternative**: Use system fonts by modifying `app/layout.tsx`:
```tsx
// Instead of:
import { Inter } from "next/font/google"
const inter = Inter({ subsets: ["latin"] })

// Use:
// Remove the className from body tag
<body className="font-sans">
```

### Database Connection in CI/CD
**Issue**: Railway internal database URL (`postgres.railway.internal`) is not accessible outside Railway

**Solution**: This is expected. Database operations only work in the Railway deployment environment.

## 📋 Pre-Deployment Checklist

- [x] Environment variables configured
- [x] Prisma schema fixed
- [x] Dependencies installed
- [x] Prisma client generated
- [x] Missing dependencies added (mime-types)
- [ ] Deploy to Railway
- [ ] Verify database migrations run successfully
- [ ] Test authentication endpoints
- [ ] Test check-ins API endpoints
- [ ] Monitor logs for any runtime errors

## 🎯 Next Steps After Deployment

1. **Verify Deployment**
   - Check Railway logs for successful build
   - Verify database migrations applied
   - Test authentication flow

2. **Seed Database** (if needed)
   ```bash
   # Via Railway CLI
   railway run npx prisma db seed
   ```

3. **Test Critical Endpoints**
   - Authentication: `/api/auth/signin`
   - Check-ins: `/api/check-ins`
   - Other API routes as needed

4. **Monitor Application**
   - Check Railway metrics
   - Monitor error logs
   - Verify database performance

## 📚 Additional Documentation

- `DATABASE_SETUP_GUIDE.md` - Comprehensive database setup and troubleshooting
- `prisma/schema.prisma` - Database schema and models
- `middleware.ts` - Authentication and authorization configuration
- `app/api/check-ins/route.ts` - Check-ins API implementation

## 🆘 Troubleshooting

### Build Fails with Font Error
- Expected in restricted environments
- Will work on Railway deployment
- See "Known Issues" section above

### Database Connection Failed
- Verify DATABASE_URL is correct
- Check Railway PostgreSQL service is running
- Ensure migrations have been applied

### Authentication Not Working
- Verify NEXTAUTH_URL matches your deployment URL
- Check NEXTAUTH_SECRET is set
- Clear browser cookies and try again

### API Returns 401/403
- Verify user is logged in
- Check user role has required permissions
- See middleware.ts for permission mappings

---

**Last Updated**: October 15, 2025  
**Status**: Ready for Railway deployment  
**Next Action**: Deploy to Railway and run post-deployment verification  
