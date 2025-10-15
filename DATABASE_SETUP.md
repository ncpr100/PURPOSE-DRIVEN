# Database Setup Guide

## Quick Start (Local Development)

This guide explains how to set up the database for local development.

### Prerequisites

- Docker (for PostgreSQL)
- Node.js 20.x or higher
- npm or yarn

### Step 1: Start PostgreSQL Database

```bash
docker run -d \
  --name postgres-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=purpose_driven \
  -p 5432:5432 \
  postgres:15-alpine
```

### Step 2: Install Dependencies

```bash
npm install --legacy-peer-deps
```

### Step 3: Generate Prisma Client

```bash
npx prisma generate
```

### Step 4: Push Schema to Database

```bash
npx prisma db push --skip-generate
```

### Step 5: Mark Existing Migrations as Applied

```bash
npx prisma migrate resolve --applied 20240824_add_automation_rules
```

### Step 6: Seed the Database

```bash
npm install -g tsx
tsx scripts/seed.ts
```

### Step 7: Build and Start the Application

```bash
npm run build
npm run dev
```

The application will be available at http://localhost:3000

## Test Credentials

After seeding, you can login with these credentials:

- **Admin**: admin@iglesiacentral.com / password123
- **Pastor**: pastor@iglesiacentral.com / password123
- **Test User**: john@doe.com / johndoe123
- **SUPER_ADMIN**: nelson.castro@khesedtek.com / SuperAdmin2024!

## Troubleshooting

### Database Connection Error

If you see "Can't reach database server", ensure PostgreSQL is running:

```bash
docker ps | grep postgres-db
```

If not running, start it:

```bash
docker start postgres-db
```

### Build Errors

If you encounter TypeScript errors during build, ensure all dependencies are installed:

```bash
npm install --legacy-peer-deps
```

### Migration Errors

If migrations fail, you can reset the database:

```bash
docker rm -f postgres-db
# Then start from Step 1
```

## Database Statistics (After Seeding)

- 1 Church: Iglesia Central Ejemplo
- 4 Users (Admin, Pastor, Test User, SUPER_ADMIN)
- 5 Ministries
- 10 Members
- 3 Sermons
- 3 Events
- 3 Volunteers
- 3 Check-ins with visitors
- 4 Follow-ups
- 3 Child check-ins
- 4 Donation categories
- 4 Payment methods
- 6 Sample donations ($1,375,000 COP total)

## Environment Variables

The `.env` file should contain:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/purpose_driven?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-change-me"
```

## Production Deployment

For production, use a managed PostgreSQL service and update the `DATABASE_URL` accordingly. Then run:

```bash
npx prisma migrate deploy
npm run build
npm start
```

## Notes

- The database uses PostgreSQL 15
- Prisma ORM manages all database operations
- NextAuth.js handles authentication
- All 50+ tables are defined in `prisma/schema.prisma`
