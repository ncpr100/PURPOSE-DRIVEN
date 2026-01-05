# Khesed-tek Church Management System - AI Assistant Instructions

**Document Version**: 3.2  
**Last Updated**: January 5, 2026  
**Project Status**: Production Active - Phase 3 Complete, Phase 4 Architecture Ready (97% Complete)  

---

## Quick Navigation
- [Project State & Current Focus](#project-state--current-focus)
- [Core Architecture & Context](#core-architecture--context)
- [Critical Architectural Patterns](#critical-architectural-patterns)
- [Development Guidelines](#development-guidelines)
- [Key Workflows & Commands](#key-workflows--commands)
- [Essential Project Patterns](#essential-project-patterns)
- [Critical Integration Points](#critical-integration-points)
- [Success Metrics & Targets](#success-metrics--targets)

---

## 🚨 AI Agent Quick Start (READ FIRST)

**Essential Facts for Immediate Productivity:**
- **Production System**: 348 total routes (116 pages + 232 API routes) deployed on Railway with automatic CD pipeline
- **Complete Prayer Wall**: 5-phase PWA implementation finished (analytics, mobile, offline-ready)
- **Multi-Tenant**: Every DB query MUST include `churchId` filtering (except SUPER_ADMIN operations)
- **Authentication Gate**: `middleware.ts` (229 lines) controls ALL routing - never bypass
- **Database**: Prisma singleton via `import { db } from '@/lib/db'` - ~50 tables, 2,475 schema lines
- **Caching**: Redis via `lib/redis-cache-manager.ts` (800+ lines) - 90%+ hit rate target
- **Real-time**: SSE via `lib/sse-broadcast.ts` for live dashboard updates
- **TypeScript**: `strict: false` but `ignoreBuildErrors: false` - compilation must pass
- **Deployment**: `git push origin main` → Railway auto-deploy (NO staging environment)

---

## Project State & Current Focus

This is an **enterprise-grade church management platform** actively deployed in production with **97% overall completion** and **100% Phase 3 completion**. All **Member Journey Deep Analytics** and **Performance Optimization** systems have been successfully implemented, with focus now on Phase 4 preparation and advanced system optimization for enterprise scalability.

### Current Phase Status
- **Phase 1**: Core Foundation ✅ COMPLETE (Members, Events, Finance, Communication)
- **Phase 2**: Business Intelligence ✅ COMPLETE (Analytics, Reporting)  
- **Phase 3**: Advanced Analytics ✅ **100% COMPLETE** - Member Journey Deep Analytics & Performance Optimization Deployed
- **Phase 4**: AI & Mobile Apps 🔄 **PLANNING** - Target Q1 2026

### Recent Completions (Phase 3 Finalization)
- **Prayer Wall**: 5-phase Progressive Web App implementation COMPLETE (analytics, mobile, offline support)
- **Advanced Role System**: Enhanced RBAC with `roles-advanced` API endpoint
- **PWA Infrastructure**: Service worker, push notifications, offline capabilities deployed
- **Mobile-First Analytics**: Touch-optimized charts with Recharts integration

### Quick Context (READ THIS FIRST)
- **348 total routes** (116 pages + 232 API routes) in production with strict TypeScript enforcement (`ignoreBuildErrors: false`)
- **Historical Achievement**: 212/212 pages successfully compiled (system has grown beyond this)
- **~2,475 lines** Prisma schema (~50 tables) with multi-tenant church scoping
- **Railway deployment** with automatic builds on `git push` to main branch
- **Production database**: PostgreSQL with connection pooling (`lib/db.ts` singleton pattern)

## Core Architecture & Context

### Tech Stack
- **Framework**: Next.js 14.2.28 with App Router (`app/` directory structure)
- **Database**: PostgreSQL with Prisma ORM 6.7.0 (`prisma/schema.prisma` - 2,476 lines, ~50 tables)
- **Authentication**: NextAuth.js 4.24.11 with JWT strategy (`lib/auth.ts`)
- **UI**: Radix UI primitives + Tailwind CSS 3.3.3 with shadcn/ui components
- **Analytics**: Dual analytics system with AI-powered insights + Redis caching
- **Real-time**: Server-Sent Events (SSE via `lib/sse-broadcast.ts`) + WebSocket integrations
- **Caching**: Redis via ioredis (`lib/redis-cache-manager.ts` - 795 lines, 90% hit rate target)
- **External APIs**: 20+ integrations (Stripe, Twilio, Mailgun, Bible APIs, social media)
- **Payments**: Stripe integration (`lib/stripe.ts`, `lib/payments/`)
- **TypeScript**: Strict mode disabled but `ignoreBuildErrors: false` enforced in production builds

### Critical Production Systems (OPERATIONAL)

**1. Completed Analytics Infrastructure** ✅
- **Dual Analytics Dashboard**: `Analíticas Generales` (`/analytics`) + `Analíticas Inteligentes` (`/intelligent-analytics`)
- **AI-Powered Modules**: Predictive analytics, member journey, executive reporting, recommendations
- **Real-Time Updates**: SSE integration with live dashboard updates via `broadcastToChurch()`
- **Advanced Export System**: PDF Ejecutivo (jspdf), Excel Avanzado (exceljs), CSV Estructurado with church branding
- **Caching Layer**: Redis with intelligent cache warming, 5-30 min TTLs based on data criticality

**2. Social Media Automation** ✅ (P1 Priority Complete)
- **8 Automation Triggers**: Post creation, publishing, campaigns, engagement monitoring
- **Platform Updates**: LinkedIn→YouTube migration, TikTok integration
- **Production Deploy**: All automation triggers deployed (feature-flag controlled via `lib/feature-flags.ts`)
- **Feature Flag**: `ENABLE_SOCIAL_MEDIA_AUTOMATION=true` in environment

**3. Memory Management System** ✅
- **Assessment Tools**: `lib/memory-assessment.ts` (exports `MemoryAssessment` class), `scripts/memory-assessment.ts`
- **Optimization**: 3.4MB storage freed, 679Mi memory optimized
- **Cleanup Scripts**: `npm run cleanup` (bash), `npm run build:memory-optimized` (custom build)

### Critical Architectural Patterns

**1. Centralized Access Control**
- `middleware.ts` is the **most important file** - controls all routing and permissions (229 lines)
- Protected routes arrays: `PROTECTED_ROUTES` (25+ routes) and `PROTECTED_API_ROUTES` (20+ API routes)
- Role hierarchy: `SUPER_ADMIN` → `ADMIN_IGLESIA` → `PASTOR` → `LIDER` → `MIEMBRO`
- **Never bypass middleware** - all auth/permissions must flow through it
- Authentication flow:
  1. Uses `getToken()` from `next-auth/jwt` to validate JWT tokens
  2. Platform routes (`/platform/*`) are SUPER_ADMIN-only - enforced in middleware
  3. Church routes (`/(dashboard)/*`) checked against `ROUTE_PERMISSIONS` mapping
  4. `checkBasicRoleAccess()` validates role-based resource access
- **Security headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, CSP

**2. Multi-Tenant Architecture**
- Church-scoped data isolation via `churchId` foreign keys in **all data models**
- Platform-level routes: `/platform/*` (super admin only, no churchId scoping)
- Church-level routes: `/(dashboard)/*` (church members, requires valid churchId)
- Tenant credentials managed in `/platform/tenant-credentials`
- **CRITICAL**: All database queries MUST filter by `churchId` except SUPER_ADMIN operations
```typescript
// ALWAYS scope queries to church
const members = await db.member.findMany({
  where: { churchId: session.user.churchId }
})
```

**3. App Router Structure**
```
app/
├── (dashboard)/          # Church-scoped routes (auth required, route group)
│   ├── analytics/        # Analíticas Generales (server component wrapper)
│   ├── intelligent-analytics/  # AI-powered analytics
│   ├── members/         # Member management with spiritual assessments
│   ├── _components/     # Feature-specific client components (*-client.tsx)
│   └── layout.tsx       # Dashboard layout wrapper (shared sidebar)
├── (platform)/          # Multi-tenant admin (SUPER_ADMIN only, route group)
├── api/                 # API routes following REST patterns
│   ├── analytics/       # Analytics API endpoints
│   ├── members/         # Member CRUD operations
│   └── auth/[...nextauth]/route.ts  # NextAuth.js handler
└── auth/                # Authentication routes (signin, signout)
```

**4. Database Patterns**
```typescript
// Always use the shared Prisma client singleton
import { db } from '@/lib/db'

// Church-scoped queries (CRITICAL for multi-tenancy)
const churchData = await db.member.findMany({
  where: { churchId: user.churchId }
})

// Connection pooling configured for production
// Graceful shutdown on beforeExit event
// Logging: query/error/warn in dev, error only in prod
```

**5. Path Aliases & Imports**
Always use `@/*` for imports (configured in `tsconfig.json`):
```typescript
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { authOptions } from '@/lib/auth'
```

**6. Server/Client Component Pattern**
- **Server components**: Pages in `app/(dashboard)/{feature}/page.tsx` - fetch data directly with `await db`
- **Client components**: Must end with `-client.tsx` suffix (e.g., `analytics-page-client.tsx`)
- **'use client' directive**: Required at top of all client components for hooks/interactivity
- **Component organization**: Feature components in `app/(dashboard)/{feature}/_components/`
- Server components pass data as props to client components:
```typescript
// page.tsx (server)
export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)
  return <AnalyticsPageClient userRole={session.user.role} churchId={session.user.churchId} />
}

// _components/analytics-page-client.tsx (client)
'use client'
export default function AnalyticsPageClient({ userRole, churchId }: Props) {
  // Can use hooks, state, event handlers
}
```

**7. Path Aliases & Import Pattern (CRITICAL)**
- **ALWAYS use `@/*` imports** - configured in `tsconfig.json`
- **Common imports**:
```typescript
import { db } from '@/lib/db'                    // Database singleton
import { authOptions } from '@/lib/auth'         // Auth configuration
import { Button } from '@/components/ui/button'  // shadcn/ui components
import type { NextRequest } from 'next/server'   // Type-only imports
```

**8. Real-Time Updates with SSE**
```typescript
// Server: Broadcast to all church members
import { broadcastToChurch } from '@/lib/sse-broadcast'
broadcastToChurch(churchId, { type: 'analytics_update', data })

// Client: Connect to SSE stream
const eventSource = new EventSource('/api/analytics/realtime-updates')
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data)
  // Update UI
}
```

**9. Redis Caching Strategy**
```typescript
import { cacheManager, CACHE_KEYS, CACHE_TTL } from '@/lib/redis-cache-manager'

// Cache with auto-invalidation
const analytics = await cacheManager.get(
  CACHE_KEYS.EXECUTIVE_REPORT(churchId, period),
  async () => {
    // Expensive query - only runs on cache miss
    return await computeAnalytics()
  },
  { ttl: CACHE_TTL.EXECUTIVE_REPORT } // 15 minutes
)

// Invalidate on data changes
await cacheManager.invalidatePattern(
  INVALIDATION_PATTERNS.MEMBER_UPDATE(churchId, memberId)
)
```

**10. Progressive Web App (PWA) Pattern**
```typescript
// PWA service worker implementation (Prayer Wall example)
// Client-side PWA state management
const [isOnline, setIsOnline] = useState(true)
const [isInstallable, setIsInstallable] = useState(false)
const [installPrompt, setInstallPrompt] = useState<any>(null)
const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')

// PWA installation handler
const handleInstallApp = async () => {
  if (installPrompt) {
    const result = await installPrompt.prompt()
    if (result.outcome === 'accepted') {
      setIsInstallable(false)
      setIsInstalled(true)
    }
  }
}

// Service worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}

// Push notification setup
const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission()
    setNotificationPermission(permission)
  }
}
```

**11. TypeScript Configuration & Build Pattern**
```typescript
// tsconfig.json key settings:
{
  "compilerOptions": {
    "strict": false,          // Disabled for legacy compatibility
    "skipLibCheck": true,    // Performance optimization
    "paths": { "@/*": ["./*"] }  // Path aliases
  }
}

// next.config.js - CRITICAL production settings:
{
  typescript: {
    ignoreBuildErrors: false,  // ENFORCED - builds must pass TypeScript
  },
  eslint: {
    ignoreDuringBuilds: true,  // ESLint warnings allowed
  }
}

// Build validation commands:
npm run test:compile      // TypeScript compilation check
npm run build             // Full production build (348 routes)
```

### Current Development Priorities (Next 2-4 Weeks)

### **PRIORITY 1: Phase 4 Architecture & Planning** (ACTIVE - Q1 2026)
Preparing for AI & Mobile Apps development phase:

**🤖 AI Integration Architecture**
- **GraphQL Migration**: Transition from REST to GraphQL for efficient data fetching
  ```typescript
  // Recommended GraphQL schema for church analytics
  type AnalyticsQuery {
    memberJourney(churchId: ID!, filters: MemberFilters): [MemberJourneyStep!]!
    predictiveInsights(churchId: ID!, models: [AIModel!]): PredictiveReport!
    executiveReport(churchId: ID!, dateRange: DateRange): ExecutiveReport!
  }
  ```
- **Real-time WebSocket Updates**: Replace SSE with WebSocket for bi-directional communication
  ```typescript
  // WebSocket integration pattern
  const wsConnection = new WebSocket(`wss://${process.env.WS_ENDPOINT}/church/${churchId}`)
  wsConnection.on('analytics_update', (data) => {
    // Instant dashboard refresh without polling
  })
  ```
- **AI Model A/B Testing**: Implement model comparison framework (already started in `ai_model_ab_tests` table)
- **Enhanced Predictive Analytics**: Expand beyond basic retention to lifecycle predictions, engagement forecasting

**📱 Mobile API Optimization**
- **Optimized REST Endpoints**: Reduce payload sizes for mobile consumption
  ```typescript
  // Mobile-optimized analytics endpoint
  GET /api/mobile/v1/analytics/summary?compact=true&churchId=${id}
  // Returns compressed data structure: <2KB vs current 15KB+
  ```
- **Offline-First Architecture**: Build on existing PWA foundation for full offline capability
- **Push Notification Infrastructure**: Enhance current push system for member engagement
- **Mobile Authentication Flow**: JWT refresh token strategy for mobile apps

**🔍 Enterprise Scalability Testing**
- **Load Testing**: 1K+ concurrent churches with realistic data volumes
  ```bash
  # Recommended load testing approach
  npm run test:load:1k-churches  # Target: <2s response time
  npm run test:stress:memory     # Memory usage under load
  npm run test:database:scale    # PostgreSQL connection pooling limits
  ```
- **Performance Monitoring**: Real-time dashboard performance tracking
- **Horizontal Scaling**: Redis cluster + database read replicas architecture

### **PRIORITY 2: System Optimization & Enterprise Readiness**
Current production optimization for maximum enterprise scalability:

**⚡ Redis Cluster Architecture**
```typescript
// Multi-node Redis configuration for enterprise scale
const redisCluster = new Redis.Cluster([
  { host: 'redis-node-1', port: 7000 },
  { host: 'redis-node-2', port: 7001 },
  { host: 'redis-node-3', port: 7002 }
], {
  redisOptions: {
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: 3
  }
})
```

**🗄️ Database Scaling Strategy**
- **Read Replicas**: Route analytics queries to read-only instances
- **Connection Pooling**: Optimize Prisma connection management for high concurrency
- **Query Optimization**: Implement database query performance monitoring
  ```sql
  -- Example: Optimized member analytics query
  SELECT m.*, COUNT(ca.id) as check_ins
  FROM members m 
  LEFT JOIN check_ins ca ON m.id = ca.member_id
  WHERE m.church_id = $1 AND m.created_at >= $2
  GROUP BY m.id
  HAVING COUNT(ca.id) > 0;
  ```

**📊 Production Monitoring Stack**
```typescript
// Comprehensive monitoring architecture
interface ProductionMetrics {
  responseTime: number        // Target: <2s average
  errorRate: number          // Target: <0.1%
  cacheHitRate: number       // Target: >90%
  activeConnections: number  // Monitor SSE/WebSocket
  databaseConnections: number // Prisma pool utilization
  memoryUsage: number        // RAM optimization tracking
}
```

## Development Guidelines

### **CRITICAL PROTOCOL CHECK** (NON-NEGOTIABLE)
Before implementing or deleting ANY code, **ALWAYS** execute these 8 steps in order. **NO EXCEPTIONS**:

**STEP 1: IS THIS STEP THAT I AM ABOUT TO TAKE THE RIGHT APPROACH?**
- ✅ **Verify existing patterns**: Does this follow established architectural patterns?
- ✅ **Check for duplicates**: Search codebase for similar implementations
- ✅ **Validate approach**: Is this the most maintainable solution?
- **Example**: Recent platform fix - Before fixing property name typo, verified the correct pattern was `websiteRequests` not `website_requestss`

**STEP 2: WHAT ARE THE REPERCUSSIONS OF THIS STEP THAT I AM ABOUT TO TAKE?**
- ✅ **Impact analysis**: Which components/pages will be affected?
- ✅ **Dependency check**: What other systems rely on this code?
- ✅ **Breaking changes**: Will this break existing functionality?
- **Example**: Platform stats API change required updating both the API response AND the client component consuming it

**STEP 3: DO WE HAVE WHAT I AM ABOUT TO IMPLEMENT ALREADY IN THE SYSTEM?**
- ✅ **Search patterns**: Use `grep_search` to find existing implementations
- ✅ **Check utilities**: Look in `/lib`, `/components/ui`, `/hooks` for existing solutions
- ✅ **Avoid duplication**: Reuse existing patterns, don't reinvent
- **Example**: Null safety patterns already exist in other components - should follow same defensive programming approach

**STEP 4: DOUBLE CHECKING MY WORK BEFORE ASSUMING IS CORRECT**
- ✅ **TypeScript validation**: Run `npm run test:compile` before assuming correctness
- ✅ **Property names**: Verify exact spelling of all object properties
- ✅ **Import paths**: Confirm all `@/*` imports are correct
- **Example**: Platform fix required checking both API property names AND client-side property access

**STEP 5: DID I CREATE NEW ERRORS? I NEED TO AVOID THEM NOT CREATE THEM. I NEED TO BE FORWARD THINKING**
- ✅ **Runtime safety**: Add null checks, try/catch blocks, fallback values
- ✅ **Error boundaries**: Consider what happens when external data is malformed
- ✅ **Graceful degradation**: Ensure UI doesn't break with missing data
- **Example**: Platform dashboard now has comprehensive fallback values for every property

**STEP 6: MAY WE NEED THIS FILE LATER IN THE APP WORKFLOW APPLICATION?**
- ✅ **Future compatibility**: Consider upcoming Phase 4 requirements
- ✅ **Scalability**: Will this work with 1K+ churches?
- ✅ **Maintainability**: Can other developers understand and extend this?
- **Example**: Platform monitoring system designed to support future GraphQL migration

**STEP 7: WHAT ARE NEXT STEPS AND ENHANCEMENTS OPPORTUNITIES?**
- ✅ **Performance optimization**: Can this be cached, optimized, or made more efficient?
- ✅ **User experience**: Are there UX improvements possible?
- ✅ **Monitoring**: Should this be logged, tracked, or alerted on?
- **Example**: Platform dashboard enhanced with auto-refresh, loading states, and error boundaries

**STEP 8: LEARN FROM YOUR MISTAKE TO AVOID REPEATING THEM**
- ✅ **Document patterns**: Update copilot instructions with new learnings
- ✅ **Create safeguards**: Implement checks to prevent similar issues
- ✅ **Knowledge sharing**: Ensure team understands the fix and prevention
- **Example**: Platform fix led to enhanced null safety patterns now documented for all future development

### **DEPLOYMENT PROTOCOL** (MANDATORY)
**AFTER EVERY COMPLETED TASK**: Execute `git push` to production deployment immediately upon task completion. This ensures all updates are automatically deployed to the live production environment without delay.

**Railway Deployment Flow**:
```bash
git add .
git commit -m "descriptive message"
git push origin main  # → Triggers Railway build → Nixpacks detects Next.js → npm ci → prisma generate → next build (348 routes) → next start
```

**CRITICAL: Never use `npx prisma db push` in production**. Use `npx prisma migrate dev` to create migrations, then migrations run automatically on Railway deployment.
**MANDATORY GIT PUSH**: Always execute `git push origin main` after completing any update, change, or task to ensure immediate deployment to Railway production environment.
## Key Workflows & Commands

### Development
```bash
npm run dev                    # Start dev server (0.0.0.0:3000)
npm run build                  # Production build (348 total routes: 116 pages + 232 API routes)
npm run build:memory-optimized # Memory-optimized build (CRITICAL for production)
npm run build:incremental      # Experimental incremental build mode
npx prisma db seed            # Populate database (scripts/seed.ts - 1596 lines)
npm run cleanup               # Memory cleanup scripts (3.4MB freed)
npm run cleanup:memory        # Run memory monitor test (uses tsx)
npm run memory:assess         # Memory assessment and optimization (uses tsx)
npm run optimize              # Combined cleanup + memory-optimized build
npm run validate:system       # Validate CUID system integrity
npm run validate:auth         # Validate authentication configuration
npm run backup                # Backup system state
```

**Note**: Scripts using `tsx` (TypeScript Execute) run TypeScript files directly without compilation step.

### Database Operations
```bash
npx prisma generate          # Regenerate Prisma client after schema changes
npx prisma db push          # Push schema changes (dev only - no migrations)
npx prisma studio           # Database GUI (localhost:5555)
npx prisma migrate dev      # Create and apply migration (production workflow)
npx prisma migrate deploy   # Apply migrations in production (runs automatically on Railway)
```

**CRITICAL**: Never use `npx prisma db push` in production. Always create migrations with `npx prisma migrate dev` for version-controlled schema changes.

### Production Deployment
```bash
git push origin main        # Triggers automatic Railway deployment
npm run pre-deploy          # Verify patterns and build before deploy
npm run verify:patterns     # Check critical patterns compliance
npm run fix:patterns        # Apply critical fixes automatically
```

## Advanced Debugging & Error Prevention

### **Critical Debugging Patterns** (Based on Recent Platform Access Fix)
```typescript
// STEP-BY-STEP DEBUGGING PROTOCOL for Property/API Issues

// 1. VERIFY API RESPONSE STRUCTURE
console.log('Raw API Response:', JSON.stringify(response, null, 2))

// 2. CHECK EXACT PROPERTY NAMES (Common source of errors)
console.log('Available properties:', Object.keys(response))

// 3. VALIDATE EXPECTED vs ACTUAL
const expectedProps = ['totalChurches', 'activeChurches', 'websiteRequests']
const actualProps = Object.keys(response)
const missingProps = expectedProps.filter(prop => !actualProps.includes(prop))
console.log('Missing properties:', missingProps)

// 4. IMPLEMENT DEFENSIVE ACCESS PATTERNS
const safeValue = response?.websiteRequests?.totalRevenue ?? 0
const safeObject = response?.websiteRequests ?? DEFAULT_WEBSITE_REQUESTS

// 5. ADD RUNTIME TYPE VALIDATION
function validatePlatformStats(data: any): data is PlatformStats {
  return data && 
    typeof data.totalChurches === 'number' &&
    typeof data.activeChurches === 'number' &&
    data.websiteRequests &&
    typeof data.websiteRequests.totalRevenue === 'number'
}
```

### **Production Error Prevention Checklist**
**Before ANY API or Component Change:**

✅ **Property Name Verification**
```bash
# Search for all usages of property in codebase
grep -r "websiteRequests" --include="*.ts" --include="*.tsx" .
# Check for typos or inconsistencies
```

✅ **Runtime vs Compile-Time Safety**
```typescript
// TypeScript provides compile-time safety, but NOT runtime safety
// ALWAYS add runtime checks for external data

// ❌ DANGEROUS - TypeScript can't prevent runtime errors
const revenue = stats.websiteRequests.totalRevenue

// ✅ SAFE - Defensive programming with nullish coalescing
const revenue = stats?.websiteRequests?.totalRevenue ?? 0
const safeStats = stats ?? DEFAULT_PLATFORM_STATS
```

✅ **API Response Validation Pattern**
```typescript
// Standard API response validation pattern
async function fetchPlatformStats(): Promise<PlatformStats> {
  const response = await fetch('/api/platform/stats')
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }
  
  const data = await response.json()
  
  // CRITICAL: Validate structure before using
  if (!data || typeof data !== 'object') {
    console.error('Invalid API response structure:', data)
    return DEFAULT_PLATFORM_STATS
  }
  
  // Check for required properties
  const requiredProps = ['totalChurches', 'activeChurches', 'websiteRequests']
  const missingProps = requiredProps.filter(prop => !(prop in data))
  
  if (missingProps.length > 0) {
    console.error('Missing required properties:', missingProps)
    // Return safe defaults rather than crashing
    return { ...DEFAULT_PLATFORM_STATS, ...data }
  }
  
  return data as PlatformStats
}
```

### **Production Incident Response Protocol**
**When Production Issues Occur:**

1. **IMMEDIATE TRIAGE** (First 5 minutes)
   ```bash
   # Check recent deployments
   git log --oneline -5
   
   # Verify build status
   npm run test:compile
   
   # Check for obvious errors in browser console
   # Look for: "Cannot read properties of undefined"
   ```

2. **ROOT CAUSE ANALYSIS** (Next 15 minutes)
   ```bash
   # Search for similar patterns in codebase
   grep -r "propertyName" --include="*.ts" --include="*.tsx" .
   
   # Check API endpoints for data structure changes
   curl -s "https://your-app.com/api/endpoint" | jq '.'
   
   # Verify environment variables and config
   echo $DATABASE_URL | head -c 20  # Check without exposing full URL
   ```

3. **IMMEDIATE FIX DEPLOYMENT**
   ```typescript
   // Implement immediate safe fix with fallbacks
   const safeData = apiResponse ?? SAFE_DEFAULTS
   
   // Add comprehensive logging for production debugging
   console.error('Production API Error:', {
     endpoint: '/api/platform/stats',
     response: apiResponse,
     timestamp: new Date().toISOString(),
     userRole: session?.user?.role
   })
   ```

4. **PREVENTION MEASURES**
   ```bash
   # Add validation checks to prevent recurrence
   npm run verify:patterns
   
   # Update copilot instructions with new learnings
   # Document the fix pattern for future reference
   ```

### Debugging & Diagnostics
```bash
npm run test:compile        # Compile TypeScript for validation
npm run test:cuid          # Test CUID validation system
npm run test:validate      # Combined TypeScript + CUID validation
node scripts/check-*.ts    # Various diagnostic scripts in /scripts
node scripts/test-analytics-apis.js     # Test analytics endpoints
```

**Available diagnostic scripts** (in `/scripts` directory):
- `check-existing-data.ts` - Verify data consistency across tables
- `check-member-filters.ts` - Test member query filters
- `verify-migration.ts` - Post-migration database validation
- `check-automation-rules.ts` - Validate automation rule integrity

## Essential Project Patterns

### Analytics Architecture (NEWLY DEPLOYED)
```typescript
// Dual analytics system pattern
/app/(dashboard)/analytics/page.tsx        # Analíticas Generales (server wrapper)
/app/(dashboard)/intelligent-analytics/    # Analíticas Inteligentes (AI-powered)

// AI-powered insights API pattern
/api/analytics/executive-report           # Church health scoring with 15min cache
/api/analytics/predictive                # Member retention forecasting (30min cache)
/api/analytics/member-journey            # Conversion funnel tracking (20min cache)
/api/analytics/recommendations          # Strategic recommendations (15min cache)

// API authentication pattern (CRITICAL)
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.churchId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const churchId = session.user.churchId  // ALWAYS use session churchId
  // Never trust request params for churchId in multi-tenant system
}
```

### Component Architecture
- **UI components**: `/components/ui/*` (shadcn/ui based - Button, Dialog, Select, etc.)
- **Feature components**: `/components/{feature}/*` (analytics, members, volunteers)
- **Page client components**: `app/(dashboard)/{feature}/_components/*-client.tsx`
- **Naming convention**: Client components MUST end with `-client.tsx` for clarity
- **Component organization**: Group by feature, not by type

### Data Fetching Pattern
```typescript
// Server components fetch data directly (preferred for performance)
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth/next'

const session = await getServerSession(authOptions)
const members = await db.member.findMany({
  where: { churchId: session.user.churchId }
})

// Client components use API routes (for interactivity/real-time)
const response = await fetch('/api/analytics/executive-report')
const data = await response.json()
```

### Authentication Flow
1. User signs in via NextAuth.js (`app/api/auth/[...nextauth]/route.ts`)
2. JWT token created with minimal payload: `id`, `role`, `churchId` (NO church object)
3. Session callback fetches fresh user data to minimize JWT size
4. Middleware validates every request using `getToken()` from `next-auth/jwt`
5. Components access session via `useSession()` hook (client) or `getServerSession()` (server)
6. Token stored in httpOnly cookie with 7-day expiration

**CRITICAL: Session Management**
- Never store large objects in JWT (causes header overflow errors)
- Always fetch fresh data in session callbacks - DO NOT embed church objects
- Use `session.user.churchId` to query church data when needed

**JWT Configuration Pattern:**
```typescript
// lib/auth.ts - NextAuth configuration
session: {
  strategy: "jwt",
  maxAge: 7 * 24 * 60 * 60, // 7 days
},

// Session callback MUST be minimal
callbacks: {
  session: ({ session, token }) => ({
    ...session,
    user: {
      id: token.id,
      role: token.role,
      churchId: token.churchId,
      // NO large objects - fetch separately when needed
    },
  }),
}
```

### Feature Flag Pattern
```typescript
// lib/feature-flags.ts - Safe feature rollout
import { isFeatureEnabled } from '@/lib/feature-flags'

// Environment variable controlled
if (isFeatureEnabled('SOCIAL_MEDIA_AUTOMATION')) {
  // Execute new feature
}

// Conditional execution utility
withFeatureFlag(
  'ADVANCED_ANALYTICS',
  () => executeNewFeature(),
  () => executeLegacyFeature()  // Fallback
)
```

## Module Organization

### Core Production Modules ✅
- **Analytics**: Dual dashboard with AI insights (`/analytics`, `/intelligent-analytics`)
- **Members**: Lifecycle management with spiritual assessments (`/members`)
- **Volunteers**: Coordination with skill matching (`/volunteers`)
- **Donations**: Multi-platform payment processing (`/donations`)
- **Events**: QR code check-in systems (`/events`)
- **Communications**: Multi-channel messaging (`/communications`)
- **Social Media**: Automation with 8 triggers (`/social-media`)

### Platform Modules ✅
- **Website Builder**: Dynamic church websites (`/website-builder`)
- **Prayer Wall**: Prayer request management (`/prayer-wall`)
- **Platform Admin**: Multi-tenant management (`/platform`)

## Development Guidelines

### **CRITICAL PROTOCOL CHECK** (NON-NEGOTIABLE)
Before implementing or deleting ANY code, **ALWAYS** ask yourself:

1. **IS THIS STEP THAT I AM ABOUT TO TAKE THE RIGHT APPROACH?** - Verify the implementation strategy aligns with existing patterns
2. **WHAT ARE THE REPERCUSSIONS OF THIS STEP THAT I AM ABOUT TO TAKE?** - Consider impact on existing functionality and dependencies  
3. **DO WE HAVE WHAT I AM ABOUT TO IMPLEMENT ALREADY IN THE SYSTEM?** - Check for existing implementations to avoid duplication
4. **DOUBLE CHECKING MY WORK BEFORE ASSUMING IS CORRECT** - Validate logic and syntax before assuming correctness
5. **DID I CREATE NEW ERRORS? I NEED TO AVOID THEM NOT CREATE THEM. I NEED TO BE FORWARD THINKING** - Forward-thinking approach to prevent regressions
6. **MAY WE NEED THIS FILE LATER IN THE APP WORKFLOW APPLICATION?** - Consider future application workflow dependencies
7. **WHAT ARE NEXT STEPS AND ENHANCEMENTS OPPORTUNITIES?** - Consider future improvements and optimization potential
8. **LEARN FROM YOUR MISTAKE TO AVOID REPEATING THEM** - Apply lessons learned from previous development cycles

### **DEPLOYMENT PROTOCOL** (MANDATORY)
**AFTER EVERY COMPLETED TASK**: Execute `git push` to production deployment immediately upon task completion. This ensures all updates are automatically deployed to the live production environment without delay.

**Railway Deployment Flow**:
```bash
git add .
git commit -m "descriptive message"
git push origin main  # → Triggers Railway build → Nixpacks detects Next.js → npm ci → prisma generate → next build (348 routes) → next start
```

### Production Deployment Standards
- **TypeScript Coverage**: 100% with zero compilation errors (ENFORCED via `ignoreBuildErrors: false`)
- **Memory Optimization**: Use `npm run build:memory-optimized` for production
- **Railway Deployment**: All builds must compile 348 total routes successfully (116 pages + 232 API routes)
- **Feature Flags**: Use for safe deployment of new features (`lib/feature-flags.ts`)
- **Route Group Pattern**: Use parentheses for layout organization `(dashboard)`, `(platform)`

### Component Development Standards
```typescript
// Feature page pattern (server component)
// app/(dashboard)/members/page.tsx
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import MembersPageClient from './_components/members-page-client'

export default async function MembersPage() {
  const session = await getServerSession(authOptions)
  
  // Server-side data fetching with church scoping
  const members = await db.member.findMany({
    where: { churchId: session.user.churchId },
    include: { spiritualAssessments: true }
  })
  
  return <MembersPageClient members={members} userRole={session.user.role} />
}

// Client component pattern
// app/(dashboard)/members/_components/members-page-client.tsx
'use client'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

interface Props {
  members: Member[]
  userRole: string
}

export default function MembersPageClient({ members, userRole }: Props) {
  // Client-side interactivity
}
```

### Analytics Development
- All new analytics features must integrate with SSE for real-time updates
- Follow dual analytics pattern: General + Intelligent modules
- Implement proper loading states and fallback content
- Include church branding in exported reports

### Security & Performance
- **99.9% Uptime Target**: Production system requirement
- **Sub-2s Page Load**: Performance standard for all components
- **Memory Management**: Regular cleanup and optimization required
- **Multi-tenant Security**: All data must be church-scoped

## Critical Integration Points

### Database Access Pattern
```typescript
// Always use the shared Prisma client
import { db } from '@/lib/db'

// Church-scoped queries (CRITICAL for multi-tenancy)
const churchData = await db.member.findMany({
  where: { churchId: user.churchId }
})

// Include relations with proper selection
const memberWithAssessments = await db.member.findUnique({
  where: { id: memberId, churchId: user.churchId },  // DOUBLE CHECK churchId
  include: {
    spiritualAssessments: { orderBy: { createdAt: 'desc' } },
    checkIns: { take: 10 }
  }
})
```

### External API Integration Pattern
```typescript
// lib/integrations/{service}.ts structure
export class ServiceIntegration {
  private apiKey: string
  
  constructor() {
    this.apiKey = process.env.SERVICE_API_KEY || ''
  }
  
  async sendRequest(params: ServiceParams) {
    // Rate limiting check
    // Validation
    // API call with error handling
    // Response transformation
  }
}

// Singleton export for reuse
export const serviceIntegration = new ServiceIntegration()
```

### Railway Deployment Workflow
```bash
# Automated deployment pipeline (triggered on git push to main)
git push origin main  # Triggers Railway build & deploy

# Pre-deployment validation (scripts/safe-deployment.sh)
1. TypeScript compilation check (npm run test:compile)
2. Feature flag verification (ENABLE_SOCIAL_MEDIA_AUTOMATION)
3. Production build test (npm run build)
4. Critical pattern verification (npm run verify:patterns)
5. Memory optimization (npm run build:memory-optimized)

# Railway build process:
- Nixpacks detects Next.js application
- Installs dependencies with npm ci
- Runs Prisma generate
- Executes next build (compiles 348 total routes)
- Starts production server with next start
```

### REST API Conventions
```typescript
// Standard API route structure
export async function GET|POST|PUT|DELETE(request: NextRequest) {
  // 1. Authentication check (ALWAYS first)
  const session = await getServerSession(authOptions)
  if (!session?.user?.churchId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // 2. Extract churchId from session (NEVER from request params)
  const churchId = session.user.churchId
  
  // 3. Input validation with Zod schemas
  const body = await request.json()
  const validatedData = apiSchema.parse(body)
  
  // 4. Database operations with church scoping
  const result = await db.model.findMany({
    where: { churchId, ...filters }
  })
  
  // 5. Return standardized response
  return NextResponse.json({ data: result, success: true })
}

// Error response format
{ "error": "Description", "code": "ERROR_CODE", "details": {} }

// Success response format
{ "data": {}, "success": true, "meta": { "total": 0, "page": 1 } }
```

### Error Handling Patterns
```typescript
// API route error handling template
try {
  // Database operations
  const result = await db.operation()
  return NextResponse.json({ data: result, success: true })
} catch (error) {
  console.error('Operation failed:', error)
  
  // Prisma error handling
  if (error.code === 'P2002') {
    return NextResponse.json(
      { error: 'Duplicate entry', code: 'DUPLICATE_ERROR' },
      { status: 409 }
    )
  }
  
  // Generic server error
  return NextResponse.json(
    { error: 'Internal server error', code: 'INTERNAL_ERROR' },
    { status: 500 }
  )
}

// Client-side error handling with toast notifications
import { toast } from 'react-hot-toast'

try {
  const response = await fetch('/api/endpoint')
  if (!response.ok) {
    const error = await response.json()
    toast.error(error.error || 'Operation failed')
    return
  }
  const data = await response.json()
  toast.success('Operation completed successfully')
} catch (error) {
  toast.error('Network error occurred')
  console.error('API call failed:', error)
}
```

### Performance Monitoring
```typescript
// Built-in performance tracking
// 1. Redis Cache Metrics (lib/redis-cache-manager.ts)
export interface CacheMetrics {
  hitRate: number        // Target: 90%+
  missRate: number
  totalRequests: number
  averageResponseTime: number  // Target: <1s
  cacheSize: number
  evictionRate: number
}

// 2. Database Performance Monitoring
// Prisma logging in production (lib/db.ts)
log: process.env.NODE_ENV === 'development' 
  ? ['query', 'error', 'warn'] 
  : ['error']  // Production: errors only

// 3. SSE Connection Monitoring (lib/sse-broadcast.ts)
export function getConnectionStats() {
  return {
    totalConnections: connections.size,
    uniqueUsers: uniqueUsers.size,
    averageConnectionsPerUser: ratio
  }
}

// 4. Memory Usage Tracking (lib/memory-assessment.ts)
export class MemoryAssessment {
  async generateReport(): Promise<MemoryReport> {
    // Tracks component bundle sizes
    // Identifies memory leaks
    // Optimization recommendations
  }
}

// 5. Custom Performance Metrics
// Add to API routes for response time tracking
const startTime = Date.now()
// ... operation
const duration = Date.now() - startTime
console.log(`API ${pathname} completed in ${duration}ms`)
```

## Success Metrics & Targets

### Technical KPIs (Production Standards)
- **Uptime**: 99.9% availability (ENFORCED)
- **Response Time**: <2s average page load (TARGET)
- **Data Accuracy**: 99%+ data integrity (MAINTAINED)
- **User Adoption**: 90%+ active usage across ministry areas

### Business Impact KPIs
- **Administrative Efficiency**: 50% reduction in manual processes
- **Member Engagement**: 40% increase in participation rates
- **Analytics Accuracy**: 95%+ lifecycle classification, 80%+ retention prediction
- **Ministry Effectiveness**: Data-driven improvement across all areas

### Testing Strategy

**1. Deployment Pros & Cons**

✅ **Pros:**
- Automatic Railway deployment on `git push` ensures consistency
- Feature flags enable safe rollouts (ENABLE_SOCIAL_MEDIA_AUTOMATION)
- Pre-deployment validation scripts catch issues before production
- Memory optimization scripts prevent resource exhaustion
- 348 total routes (116 pages + 232 API routes) build successfully validates entire application

⚠️ **Cons:**
- No formal test suite - relies on TypeScript compilation and manual testing
- Direct production deployment without staging environment
- Feature flag management is environment variable based (not dynamic)
- No automated rollback mechanism for failed deployments

**2. Current Testing Approach**
```bash
# TypeScript validation
npm run test:compile         # Ensures type safety
npm run test:cuid           # Validates ID system integrity
npm run validate:system     # Checks core system components
npm run validate:auth       # Verifies authentication flow

# Manual testing scripts (scripts/ directory)
node scripts/test-analytics-apis.js     # Analytics API testing
node scripts/comprehensive-*.js         # Feature integration tests
node scripts/check-*.ts                 # Data integrity checks
```

**3. Integration Testing Pattern**
```typescript
// Example: scripts/test-analytics-apis.js
async function testAnalyticsEndpoints() {
  const endpoints = [
    '/api/analytics/executive-report',
    '/api/analytics/predictive',
    '/api/analytics/member-journey'
  ]
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`)
      console.log(`✅ ${endpoint}: ${response.status}`)
    } catch (error) {
      console.error(`❌ ${endpoint}:`, error.message)
    }
  }
}
```

**4. Data Integrity Validation**
```bash
# Database validation scripts
node scripts/check-existing-data.ts     # Verify data consistency
node scripts/check-member-filters.ts    # Test query filters
node scripts/verify-migration.ts        # Post-migration validation
```

**5. Recommended Phase 4 Testing Enhancements**
```bash
# Future testing infrastructure (Phase 4 preparation)
npm run test:e2e              # End-to-end testing with Playwright
npm run test:unit             # Jest unit tests for business logic
npm run test:api              # Automated API endpoint testing
npm run test:load             # Load testing for 1K+ churches
npm run test:security         # Security vulnerability scanning
```

## Enhanced Error Prevention & Production Safety

### **TypeScript Runtime vs Compile-Time Safety**
**CRITICAL Understanding**: TypeScript provides compile-time safety but NOT runtime safety. Always implement defensive programming patterns:

```typescript
// ❌ COMPILE-TIME SAFE but RUNTIME DANGEROUS
interface PlatformStats {
  websiteRequests: {
    totalRevenue: number
  }
}

// This compiles fine but can crash at runtime if API changes
const revenue = stats.websiteRequests.totalRevenue

// ✅ RUNTIME SAFE - Defensive programming pattern
const revenue = stats?.websiteRequests?.totalRevenue ?? 0
const safeStats = stats ?? DEFAULT_PLATFORM_STATS

// ✅ RUNTIME VALIDATION - Type guard pattern
function isPlatformStats(data: any): data is PlatformStats {
  return data && 
    typeof data.totalChurches === 'number' &&
    data.websiteRequests &&
    typeof data.websiteRequests.totalRevenue === 'number'
}

if (isPlatformStats(apiResponse)) {
  // Now safe to use without nullish coalescing
  const revenue = apiResponse.websiteRequests.totalRevenue
}
```

### **Property Name Validation Protocol**
**Based on Recent Platform Access Fix:**

```typescript
// 1. API ENDPOINT VALIDATION - Server Side
export async function GET(request: NextRequest) {
  const rawData = await fetchFromDatabase()
  
  // VALIDATE before returning
  const requiredProperties = ['totalChurches', 'activeChurches', 'websiteRequests']
  const missingProperties = requiredProperties.filter(prop => !(prop in rawData))
  
  if (missingProperties.length > 0) {
    console.error('Missing API properties:', missingProperties)
    // Return safe defaults instead of crashing
    return NextResponse.json({
      ...DEFAULT_STATS,
      ...rawData // Merge existing data
    })
  }
  
  return NextResponse.json(rawData)
}

// 2. CLIENT COMPONENT VALIDATION - Client Side
'use client'
export default function PlatformDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/platform/stats')
      const data = await response.json()
      
      // VALIDATE client-side before using
      if (validatePlatformStats(data)) {
        setStats(data)
      } else {
        console.error('Invalid stats data structure:', data)
        setStats(DEFAULT_PLATFORM_STATS) // Safe fallback
      }
    } catch (error) {
      console.error('Stats fetch error:', error)
      setStats(DEFAULT_PLATFORM_STATS) // Network error fallback
    }
  }
}

// 3. SEARCH PATTERN VALIDATION - Development Tool
// Before making property changes, always search codebase:
grep -r "websiteRequests" --include="*.ts" --include="*.tsx" .
grep -r "totalRevenue" --include="*.ts" --include="*.tsx" .
```

### **Production Deployment Safety Checklist**
**MANDATORY before every deployment:**

✅ **Pre-Deployment Validation**
```bash
# 1. TypeScript compilation MUST pass
npm run test:compile  # ZERO errors required

# 2. Critical patterns verification
npm run verify:patterns  # Ensures architectural compliance

# 3. Build test with memory optimization
npm run build:memory-optimized  # Production-ready build

# 4. Property name consistency check
grep -r "website.*request" --include="*.ts" --include="*.tsx" . | grep -v node_modules
```

✅ **API Response Structure Validation**
```bash
# Test all critical API endpoints after changes
curl -s localhost:3000/api/platform/stats | jq '.' > platform-stats-response.json
# Verify all expected properties are present
```

✅ **Component Error Boundary Testing**
```typescript
// Add error boundaries around critical components
import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({error}: {error: Error}) {
  return (
    <div role="alert">
      <h2>Platform Dashboard Error</h2>
      <pre>{error.message}</pre>
      <button onClick={() => window.location.reload()}>Reload</button>
    </div>
  )
}

// Wrap components with error boundaries
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <EnhancedPlatformDashboard />
</ErrorBoundary>
```

When working on this codebase, prioritize the **Phase 4 preparation and system optimization** improvements, maintain the production deployment standards, and always consider the multi-tenant architecture and performance optimization requirements for Phase 4 preparation.
