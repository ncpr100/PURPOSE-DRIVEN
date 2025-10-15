# Database Setup and Migration Guide

## Current Status: ✅ CONFIGURED

### Environment Configuration
The following critical environment variables have been configured:

1. **DATABASE_URL**: PostgreSQL connection string for Railway database
2. **NEXTAUTH_URL**: Production URL for NextAuth authentication
3. **NEXTAUTH_SECRET**: Generated secure secret for session encryption

### Prisma Configuration
- **Client Generator**: Configured for multi-platform support (native + linux-musl-arm64)
- **Output Path**: Fixed - now uses default node_modules location
- **Database Provider**: PostgreSQL

### Completed Steps

#### 1. Environment Variables Fixed ✅
- Fixed malformed DATABASE_URL (missing closing quote)
- Updated NEXTAUTH_URL from hash to production URL
- Generated and set NEXTAUTH_SECRET using OpenSSL

#### 2. Prisma Schema Fixed ✅
- Removed hardcoded output path that was referencing old directory structure
- Schema now uses Prisma defaults for client generation

#### 3. Dependencies Installed ✅
- All npm packages installed with `--legacy-peer-deps` flag
- Prisma Client generated successfully (v6.7.0)

#### 4. Existing Migrations Identified ✅
- `20240824_add_automation_rules` - Automation system tables
- `20250826_add_support_contact_info` - Support contact information

### Database Connection

**Note**: The current DATABASE_URL uses Railway's internal network address (`postgres.railway.internal`), which is only accessible from within the Railway deployment environment.

For local development, you'll need:
1. Railway's public database URL, OR
2. A local PostgreSQL instance

### Running Migrations

When deploying to Railway or when the database is accessible:

```bash
# Apply all pending migrations
npx prisma migrate deploy

# Or run migrations in development mode (creates new migrations if schema changed)
npx prisma migrate dev
```

### Check-ins API Route

The `/api/check-ins/route.ts` file is properly configured and includes:

**Features**:
- ✅ GET endpoint - Retrieve check-ins with filtering (first-time, event, date)
- ✅ POST endpoint - Create new check-ins with QR code generation
- ✅ Automatic follow-up creation for first-time visitors
- ✅ Authentication and authorization checks
- ✅ Church-based data isolation

**Security**:
- Role-based access control (SUPER_ADMIN, ADMIN_IGLESIA, PASTOR, LIDER)
- Session validation via NextAuth
- Church ID verification

**Related Database Models**:
- `CheckIn` - Main check-in records
- `VisitorFollowUp` - Automated follow-up tasks
- `Event` - Associated events (optional)

### Testing the Setup

Once deployed to Railway:

1. **Verify Database Connection**:
```bash
npx prisma db pull
```

2. **Check Migration Status**:
```bash
npx prisma migrate status
```

3. **Test Check-ins API**:
```bash
# GET check-ins (requires authentication)
curl https://purpose-driven-production.up.railway.app/api/check-ins \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"

# POST new check-in (requires authentication)
curl -X POST https://purpose-driven-production.up.railway.app/api/check-ins \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "isFirstTime": true,
    "visitReason": "Sunday Service",
    "prayerRequest": "Prayer for family"
  }'
```

### Troubleshooting

#### Database Connection Issues
- **Error**: `Can't reach database server`
- **Cause**: DATABASE_URL uses internal Railway address
- **Solution**: This is expected in local environment; connection works in Railway deployment

#### Migration Issues
- **Error**: Migration not applied
- **Solution**: Run `npx prisma migrate deploy` in Railway deployment or via Railway CLI

#### Authentication Issues
- **Error**: 401 Unauthorized
- **Solution**: Ensure valid session token; login via `/auth/signin`

### Next Steps for Development

1. **Local Development Setup** (Optional):
   ```bash
   # Create local .env with local database
   cp .env .env.local
   # Update DATABASE_URL in .env.local to local PostgreSQL
   # Example: postgresql://user:pass@localhost:5432/khesed_dev
   ```

2. **Seed Database** (if seed script exists):
   ```bash
   npx prisma db seed
   ```

3. **Generate Prisma Client** (after schema changes):
   ```bash
   npx prisma generate
   ```

### Deployment Checklist

For Railway deployment:
- [x] Environment variables configured
- [x] Prisma schema fixed
- [x] Dependencies installed
- [x] Prisma client generated
- [ ] Deploy to Railway (will auto-run migrations via build command)
- [ ] Verify database connection in production
- [ ] Test check-ins API endpoints

---

**Last Updated**: October 15, 2025  
**Status**: Ready for deployment  
**Database**: Railway PostgreSQL  
