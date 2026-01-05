# Khesed-tek Church Management System - AI Assistant Instructions

**Document Version**: 3.1  
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

**7. Real-Time Updates with SSE**
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

**8. Redis Caching Strategy**
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

**9. Progressive Web App (PWA) Pattern**
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

### Current Development Priorities (Next 2-4 Weeks)

### **PRIORITY 1: Phase 4 Architecture & Planning** (ACTIVE - Q1 2026)
Preparing for AI & Mobile Apps development phase:
- **AI Integration**: Machine learning model architecture for predictive analytics enhancement
- **Mobile API Optimization**: REST endpoints optimization for mobile app consumption patterns
- **Advanced Analytics AI**: Enhanced predictive capabilities for member retention and engagement
- **Enterprise Scalability**: Stress testing for 1K+ churches, performance monitoring systems
- **Production Monitoring**: Comprehensive alerting and dashboard systems for enterprise deployment

### **PRIORITY 2: System Optimization & Enterprise Readiness**
Finalizing production system for maximum enterprise scalability:
- **Redis Performance**: Advanced caching strategies optimization and Redis cluster preparation  
- **Database Scaling**: Performance monitoring, connection pooling optimization, read replicas planning
- **Memory Management**: Resource optimization for high-traffic scenarios, memory leak prevention
- **Monitoring Stack**: Production monitoring dashboards, alerting systems, health checks

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
- **TypeScript Coverage**: 100% with zero compilation errors (ENFORCED)
- **Memory Optimization**: Use `npm run build:memory-optimized` for production
- **Railway Deployment**: All builds must compile 348 total routes successfully (116 pages + 232 API routes)
- **Feature Flags**: Use for safe deployment of new features

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

When working on this codebase, prioritize the **Phase 4 preparation and system optimization** improvements, maintain the production deployment standards, and always consider the multi-tenant architecture and performance optimization requirements for Phase 4 preparation.
