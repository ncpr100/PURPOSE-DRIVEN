# Khesed-tek Church Management System - AI Assistant Instructions

**Document Version**: 3.6  
**Last Updated**: February 13, 2026  
**Project Status**: Production Active - Vercel Deployment, Supabase PostgreSQL (Phase 3 Complete)  

---

## 🚨 ENTERPRISE COMPLIANCE MANDATE (CRITICAL)

**THIS IS A PRODUCTION ENTERPRISE SYSTEM** - All protocols below are **NON-NEGOTIABLE** and **MANDATORY**

⚠️ **FAILURE TO FOLLOW THESE PROTOCOLS WILL RESULT IN PRODUCTION FAILURES**
⚠️ **EVERY TASK MUST EXECUTE THE 8-STEP CRITICAL PROTOCOL CHECK**
⚠️ **EVERY COMPLETED TASK MUST EXECUTE `git push origin main` FOR VERCEL DEPLOYMENT**
⚠️ **STRICT ICON PROTOCOL: ONLY OUTLINED DESIGN UNIQUE THEMED COLOR ICONS - NO EMOJIS EVER**

**EXTERNAL INTEGRATIONS**: Vercel Production Workflows ONLY (NO other external systems)

---

## 🚨 CRITICAL ICON PROTOCOL (MANDATORY COMPLIANCE)

**ENTERPRISE BRANDING STANDARD**: Use **ONLY** lucide-react stroke-only SVG icons with unique themed colors

### **MANDATORY ICON RULES:**
1. ✅ **ONLY lucide-react icons** - stroke-only SVG outline style
2. ✅ **Unique themed colors** - each feature/template gets distinct color
3. ✅ **Transparent interiors** - colored strokes with no solid fills
4. ❌ **NEVER use emojis** (🎯, 🚀, 💡, 📝, ✏️, 🎨, ⚡, 📊, 🔍, ✨, 📧, 🙏, 🎉, ⛪, 🤝, 📅, 💬, ✋)
5. ❌ **NO generic icons** - avoid FileText for everything, use themed icons

### **THEMED ICON SYSTEM:**
```typescript
// ✅ CORRECT - Unique themed icons with proper colors
<Sparkles className="h-8 w-8 text-purple-600" />  // Visitors
<BarChart3 className="h-8 w-8 text-blue-600" />   // Analytics
<Share2 className="h-8 w-8 text-green-600" />     // Social Media
<Heart className="h-8 w-8 text-pink-600" />       // Prayer/Ministry
<Calendar className="h-8 w-8 text-orange-600" />  // Events
<Users className="h-8 w-8 text-indigo-600" />     // Groups/Teams
<Mail className="h-8 w-8 text-cyan-600" />        // Communication

// ❌ FORBIDDEN - Emojis and generic icons
❌ 🎯 ❌ 🚀 ❌ 💡 ❌ 📝 ❌ ✨ ❌ 📊 ❌ 🔍 ❌ 📧
❌ <FileText /> used for multiple different templates
```

**VIOLATION CONSEQUENCES**: Immediate production failure, user confusion, brand inconsistency

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
- **Production System**: 360+ total routes deployed on Vercel with automatic CD pipeline
- **Production URL**: https://khesed-tek-cms-org.vercel.app
- **Memory Optimized**: 3.4MB storage freed, `npm run build:memory-optimized` for production builds
- **Complete Prayer Wall**: 5-phase PWA implementation finished (analytics, mobile, offline-ready)
- **Form Builder System**: 7 Smart Templates with stroke-only SVG icons, QR generation, visitor CRM integration
- **Multi-Tenant**: Every DB query MUST include `churchId` filtering (except SUPER_ADMIN operations)
- **Authentication Gate**: `middleware.ts` (229 lines) controls ALL routing - never bypass
- **Database**: Prisma singleton via `import { db } from '@/lib/db'` with enhanced connection pooling
- **Caching**: Redis via `lib/redis-cache-manager.ts` (800+ lines) - 90%+ hit rate target
- **Real-time**: SSE via `lib/sse-broadcast.ts` for live dashboard updates
- **TypeScript**: `strict: false` but `ignoreBuildErrors: false` - compilation must pass
- **Deployment**: `git push origin main` → Vercel auto-deploy (NO staging environment)
- **Database**: Supabase PostgreSQL at db.qxdwpihcmgctznvdfmbv.supabase.co:5432
- **Branding System**: Church-specific color customization in `settings/branding` with pastel defaults
- **Icon Protocol**: ONLY lucide-react stroke-only SVG icons - NO emojis in production UI

---

## 🏗️ ARCHITECTURAL DECISION PROTOCOL (MANDATORY)

**CRITICAL**: This protocol MUST be executed BEFORE any stack selection, technology choice, or architectural decision.

### **1. Analyze Past Errors & Lessons Learned**

**Common Errors in Failed Deployments:**
- ❌ **Wrong abstraction level**: Choosing monolithic stack when microservices needed, or vice versa
- ❌ **Over-engineering**: Using multiple overlapping tools (e.g., Prisma + TypeORM + raw SQL in one service)
- ❌ **Under-engineering**: Using lightweight frameworks for complex transactional systems
- ❌ **Library mismatch**: Using Next.js for pure static site with no SSR needs, adding unnecessary complexity
- ❌ **Scalability misjudgment**: Picking stack that doesn't scale in required direction (vertical vs horizontal)
- ❌ **State management complexity**: Using global state management in small apps, or not using it in large multi-role apps
- ❌ **Database-ORM mismatch**: Using ORM that doesn't support required database features

**Before ANY architectural decision, ask:**
1. "Have we made this mistake before?"
2. "What did we learn from past deployment failures?"
3. "Is this the simplest solution that meets requirements?"

### **2. Decision Framework: Singular vs. Plural Stacks**

#### **When to Use SINGULAR (Monolithic) Stack:**
- ✅ Early-stage product, small team
- ✅ Clear, bounded domain (e.g., internal tool, single-service app)
- ✅ Example: Next.js (App Router) + Prisma + PostgreSQL all in one repo
- **Criteria:**
  - All features mostly share same data models
  - Team size < 5 developers
  - Performance scaling can be vertical initially

#### **When to Use PLURAL (Multi-service/Multi-repo) Stack:**
- ✅ Large-scale, multiple independent domains
- ✅ Different services have different scaling or tech needs
- ✅ Example:
  - Service A: FastAPI + SQLAlchemy (Python, heavy data processing)
  - Service B: Next.js + tRPC (frontend + BFF)
  - Service C: NestJS + TypeORM (admin panel, complex transactions)
- **Criteria:**
  - Teams separated by service ownership
  - Different non-functional requirements (real-time vs batch processing)
  - Need for independent deployment cycles

**Current System**: SINGULAR stack (Next.js + Prisma + PostgreSQL) - appropriate for current scale

### **3. Technology-Specific Choice Rules**

#### **Prisma**
- ✅ **Use when:**
  - Rapid prototyping with type-safe database access
  - Team prefers declarative schema format
  - Don't need complex SQL queries that ORMs make cumbersome
- ❌ **Avoid when:**
  - Heavy reporting/analytical queries
  - Need advanced DB features not supported by Prisma
  - Microservices with shared DB (Prisma leads to tight coupling)
- **Current Status**: ✅ Appropriate choice (church management with standard CRUD operations)

#### **Next.js**
- ✅ **Use when:**
  - Need hybrid static + server rendering
  - SEO matters
  - Full-stack React with API routes in same project acceptable
- ❌ **Avoid when:**
  - Building mobile app backend only
  - Need long-running server processes (use Node.js + Express/NestJS separately)
- **Current Status**: ✅ Appropriate choice (church dashboard with SSR needs)

#### **NestJS**
- ✅ **Use when:**
  - Enterprise-grade structure (modules, DI, built-in patterns)
  - Microservices with transporters (RabbitMQ, Kafka)
  - Large teams needing consistency
- ❌ **Avoid when:**
  - Quick prototype or small API (consider Fastify/Express)
- **Current Status**: ❌ Not used (Next.js API routes sufficient for current scale)

#### **State Management (Zustand, Redux, Context)**
- **Zustand**: Most projects needing global state (simpler than Redux)
- **Redux**: Large-scale state with middleware needs (logging, persistence, async flows)
- **Context**: Only for small, static or low-frequency updates (not for frequent state changes)
- **Current Status**: Using React hooks + server state (appropriate for church-scoped data)

### **4. Stack Selection Checklist (MANDATORY)**

Before recommending ANY technology change, answer ALL questions:

1. ✅ **Define scope & scaling needs**
   - Is this a single product or a platform?
   - Expected traffic patterns: read-heavy vs write-heavy?

2. ✅ **Team expertise**
   - Don't pick unfamiliar stacks for critical paths without training/buffer time

3. ✅ **Community & maintenance**
   - Choose stacks with active support and good documentation

4. ✅ **Integration points**
   - Ensure chosen libraries work together (e.g., Prisma works with Next.js)

5. ✅ **Exit strategy**
   - Can we replace one component without rewriting the whole app?

### **5. Guardrails for AI Agent (MANDATORY CHECKS)**

**When recommending a stack, ALWAYS ask:**
1. "Is this for a monolith or distributed system?"
2. "Have we used this stack before? What were the pain points?"
3. "Does this match the team's current skill set?"
4. "What are the risks of this choice?"

**Cross-check against past failures:**
- Example: "Past failure: Used Next.js API routes for CPU-intensive tasks → caused timeouts. Switch to separate worker service."

**Default to boring technology for mission-critical parts:**
- Proven > Cutting-edge
- Simple > Complex
- Maintainable > Trendy

**Proof-of-concept for risky combinations:**
- NEVER recommend unproven tech combinations for production
- Always test new stack combinations in isolated environment first

### **6. Example Decision Flow**

**Prompt**: "We need a dashboard with real-time notifications and reporting."

**Step 1: Identify components**
- Real-time → WebSockets (Socket.io or SSE)
- Dashboard frontend → React/Next.js
- Reporting → Might need separate service if heavy

**Step 2: Check past errors**
- Previously, putting WebSocket server in Next.js API caused scaling issues → Decouple

**Step 3: Recommendation**
- Frontend: Next.js (static dashboard pages)
- Real-time: Separate Node.js/Fastify service with Socket.io
- Backend for data: NestJS or Express + Prisma if DB is simple
- Reporting: Use Go service if performance-critical

**Step 4: Validate against checklist**
- Scope: Platform (distributed)
- Team: Knows Next.js, learning Go acceptable for performance service
- Community: All have strong communities
- Integration: Services communicate via REST/GraphQL
- Exit: Can swap reporting service without affecting dashboard

### **7. Documentation & Review (MANDATORY)**

**For EVERY architectural decision:**

1. ✅ **Create Stack Decision Log**
   - Document: Why this stack? What alternatives considered? What risks identified?
   - Location: Project root or `docs/architecture/`

2. ✅ **Post-deployment review (after 3 months)**
   - What worked? What caused errors? Would we choose differently?
   - Update this protocol with learnings

3. ✅ **Update AI knowledge base**
   - Add successful patterns to copilot instructions
   - Document failed approaches to avoid repetition

**Current System Review:**
- Next.js + Prisma + PostgreSQL: ✅ Working well for church management domain
- Redis caching: ✅ 90% hit rate achieved
- SSE for real-time: ✅ Appropriate for current scale (< 1K concurrent users)
- Future consideration: GraphQL migration for Phase 4 mobile apps

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
- **360 total routes** (118 pages + 242 API routes) in production with strict TypeScript enforcement (`ignoreBuildErrors: false`)
- **Historical Achievement**: 212/212 pages successfully compiled (system has grown to 360 routes)
- **~2,475 lines** Prisma schema (~50 tables) with multi-tenant church scoping
- **Vercel deployment** with automatic builds on `git push` to main branch
- **Production database**: Supabase PostgreSQL (db.qxdwpihcmgctznvdfmbv.supabase.co:5432) with connection pooling (`lib/db.ts` singleton pattern)

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
- **Role hierarchy**:
  - **Platform Level**: `SUPER_ADMIN` (Khesed-Tek platform administrator)
  - **Tenant Level**: `Pastores` → `Administradores` → `Líderes` → `Servidores`
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
  },
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE,
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../'),
  }
}

// Build validation commands:
npm run test:compile      // TypeScript compilation check
npm run build             // Full production build (360 routes)
```

**12. Environment Variables Pattern (CRITICAL)**
```bash
# Required Environment Variables for Production:
DATABASE_URL              # PostgreSQL connection string (Prisma)
NEXTAUTH_SECRET          # NextAuth.js encryption key (minimum 32 chars)
NEXTAUTH_URL             # Full application URL (https://your-domain.com)
REDIS_URL                # Redis connection string for caching

# Feature Flags (Optional - Default: disabled)
ENABLE_SOCIAL_MEDIA_AUTOMATION=true    # Social media auto-posting
ENABLE_ADVANCED_ANALYTICS=true         # AI-powered analytics
ENABLE_PWA_FEATURES=true               # Progressive Web App features

# External Service API Keys (Optional but recommended)
STRIPE_SECRET_KEY        # Payment processing
TWILIO_ACCOUNT_SID       # SMS messaging
MAILGUN_API_KEY          # Email delivery
```

**13. Singleton Pattern for Services**
```typescript
// Standard service singleton pattern (lib/{service}.ts)
import { PrismaClient } from '@prisma/client'

// Global singleton to prevent multiple Prisma instances
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error']
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Other service singletons:
// - lib/redis-cache-manager.ts: export const cacheManager
// - lib/performance.ts: export const performanceMonitor
// - lib/memory-monitor.ts: export const memoryMonitor
// - lib/intelligent-cache-warmer.ts: export const intelligentCacheWarmer
```

**14. Church Branding System Pattern (COMPREHENSIVE)**

**Color System Architecture**
```typescript
// Church-specific branding customization (settings/branding)
interface ChurchBrandColors {
  prayerRequest: string      // Default: #DDD6FE (purple-200 pastel)
  visitorFollowup: string    // Default: #DBEAFE (blue-200 pastel)
  socialMedia: string        // Default: #D1FAE5 (green-200 pastel)
  events: string             // Default: #FED7AA (orange-200 pastel)
  primary: string            // Church primary color
  secondary: string          // Church secondary color
}

// Default Platform Colors (Professional & Subtle)
const DEFAULT_COLORS: ChurchBrandColors = {
  prayerRequest: '#DDD6FE',    // Purple-200 (pastel) - for purple-600 icon
  visitorFollowup: '#DBEAFE',  // Blue-200 (pastel) - for blue-600 icon
  socialMedia: '#D1FAE5',      // Green-200 (pastel) - for green-600 icon
  events: '#FED7AA',           // Orange-200 (pastel) - for orange-600 icon
  primary: '#DBEAFE',          // Blue-200 (pastel)
  secondary: '#D1FAE5'         // Green-200 (pastel)
}
```

**Branding API Integration**
```typescript
// Fetch church branding (server or client component)
const response = await fetch('/api/church-theme')
const { brandColors, isDefault } = await response.json()

// Save/update church branding (PUT request)
const updateBranding = async (colors: ChurchBrandColors) => {
  const response = await fetch('/api/church-theme', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brandColors: colors })
  })
  return response.json()
}
```

**Icon System - STRICT GUIDELINES (NO EMOJIS)**
```typescript
// ALWAYS use lucide-react for icons - stroke-only SVG outline style
import { 
  Palette,      // Branding/theme icons
  Save,         // Action icons
  RotateCcw,    // Reset/refresh
  Sparkles,     // AI/intelligent features
  ArrowLeft,    // Navigation
  Phone,        // Communication
  Mail,         // Email
  MessageSquare,// Messaging/chat
  Calendar,     // Events/scheduling
  Clock,        // Time-related
  User,         // Members/users
  CheckCircle,  // Success states
  AlertCircle,  // Warning/error states
  BarChart3,    // Analytics
  Settings,     // Configuration
  Heart,        // Prayer/ministry
  Share2,       // Social media
  Users         // Groups/teams
} from 'lucide-react'

// Icon usage pattern with branding colors
<Card>
  <CardHeader>
    <Palette className="h-6 w-6 text-purple-600" /> {/* Bright icon */}
    <CardTitle>Personalización de Marca</CardTitle>
  </CardHeader>
</Card>

// FORBIDDEN: NO emojis in production code
// ❌ toast('Success', { icon: '🎨' })  // NEVER USE EMOJIS
// ✅ toast.success('Success')          // Use toast variants
// ✅ <CheckCircle className="text-green-600" /> // Use Lucide icons
```

**Color Application Patterns**
```typescript
// Pattern 1: Template Cards (automation-rules, communications)
<Card className="border-l-4" style={{ borderLeftColor: brandColors.prayerRequest }}>
  <CardHeader style={{ backgroundColor: brandColors.prayerRequest }}>
    <div className="flex items-center gap-3">
      <Sparkles className="h-6 w-6 text-purple-600" /> {/* Bright icon */}
      <CardTitle className="text-gray-800">Prayer Request Template</CardTitle>
    </div>
  </CardHeader>
  <CardContent className="bg-white">
    {/* White background for content */}
  </CardContent>
</Card>

// Pattern 2: Analytics Cards (dashboard widgets)
<Card style={{ backgroundColor: brandColors.primary }}>
  <CardHeader>
    <BarChart3 className="h-8 w-8 text-blue-600" />
    <CardTitle className="text-gray-800">Analytics Overview</CardTitle>
  </CardHeader>
</Card>

// Pattern 3: Action Buttons with Branding
<Button 
  style={{ backgroundColor: brandColors.primary }}
  className="text-gray-800 hover:opacity-90"
>
  <Save className="h-4 w-4 mr-2" />
  Guardar Cambios
</Button>

// Pattern 4: Category Badges
<span 
  className="px-3 py-1 rounded-full text-sm font-medium text-gray-800"
  style={{ backgroundColor: brandColors.socialMedia }}
>
  <MessageSquare className="inline h-4 w-4 mr-1 text-green-600" />
  Social Media
</span>
```

**Design Philosophy - Analytics-Style Pattern**
- **Pastel Backgrounds**: Use #D-E hex range (200-300 opacity) for cards/containers
- **Bright Accent Icons**: Use 600-weight colors for icons (contrast with pastel)
- **Text Hierarchy**: Gray-800 for titles, Gray-600 for descriptions
- **White Content Areas**: Always use white backgrounds for main content
- **Stroke-Only Icons**: Lucide-react outline style ONLY (no filled icons, no emojis)
- **Color Consistency**: Map categories to specific colors across all features
  - Prayer: Purple (#DDD6FE background, #9333EA icon)
  - Visitors: Blue (#DBEAFE background, #2563EB icon)
  - Social: Green (#D1FAE5 background, #059669 icon)
  - Events: Orange (#FED7AA background, #EA580C icon)

**Branding Application Checklist**
```typescript
// Before creating new UI components, verify:
// ✅ Using lucide-react icons (NOT emojis)
// ✅ Pastel backgrounds with bright icons
// ✅ Fetching brandColors from /api/church-theme
// ✅ Applying colors via inline styles for dynamic church customization
// ✅ White backgrounds for content readability
// ✅ Consistent color-to-category mapping
```

### Service Layer Architecture (lib/ Registry)

**Core Service Singletons**
```typescript
// Database & Caching Services (CRITICAL)
import { db } from '@/lib/db'                              // Prisma client singleton
import { cacheManager } from '@/lib/redis-cache-manager'   // Redis cache manager (800+ lines)
import { cache } from '@/lib/cache'                        // Legacy cache utility
import { intelligentCacheWarmer } from '@/lib/intelligent-cache-warmer'  // Auto cache warming

// Authentication & Authorization
import { authOptions } from '@/lib/auth'                   // NextAuth.js configuration
import { checkBasicRoleAccess } from '@/lib/permissions'   // Role-based access control
import { isFeatureEnabled } from '@/lib/feature-flags'     // Feature flag system

// Analytics & AI Services
import { } from '@/lib/enhanced-ai-insights-engine'        // AI-powered insights
import { } from '@/lib/member-journey-analytics'           // Member lifecycle tracking
import { } from '@/lib/ai-prediction-accuracy-tracker'     // ML model performance
import { } from '@/lib/cached-analytics-service'           // Analytics with caching

// Communication Services
import { sendEmail } from '@/lib/email'                    // Email delivery (Mailgun)
import { } from '@/lib/integrations/twilio'                // SMS messaging
import { } from '@/lib/integrations/whatsapp'              // WhatsApp integration

// Payment & Financial Services
import { stripe } from '@/lib/stripe'                      // Stripe integration
import { } from '@/lib/payments/'                          // Payment processing utilities
import { formatCurrency } from '@/lib/currency'            // Currency formatting

// Performance & Monitoring
import { performanceMonitor } from '@/lib/performance'     // Performance tracking
import { memoryMonitor } from '@/lib/memory-monitor'       // Memory usage monitoring
import { MemoryAssessment } from '@/lib/memory-assessment' // Memory optimization tools
import { } from '@/lib/database-performance-analysis'      // DB query optimization

// Automation & Triggers
import { automationEngine } from '@/lib/automation-engine' // Automation rule execution
import { } from '@/lib/automation-trigger-service'         // Trigger event handling

// Bible & Spiritual Content
import { } from '@/lib/bible-api-service'                  // Bible verse lookup
import { } from '@/lib/bible-integrations'                 // Multiple Bible API integrations
import { SPIRITUAL_GIFTS_SUMMARY } from '@/lib/spiritual-gifts-config'  // Spiritual gifts data

// Utilities & Helpers
import { } from '@/lib/utils'                              // General utilities
import { } from '@/lib/url-sanitizer'                      // URL validation/sanitization
import { } from '@/lib/gender-utils'                       // Gender data utilities
import { } from '@/lib/validation-schemas'                 // Zod validation schemas
```

**Service Integration Pattern**
```typescript
// Example: Creating a new feature with service dependencies
import { db } from '@/lib/db'
import { cacheManager, CACHE_KEYS, CACHE_TTL } from '@/lib/redis-cache-manager'
import { sendEmail } from '@/lib/email'
import { performanceMonitor } from '@/lib/performance'

export async function processNewMember(memberId: string, churchId: string) {
  // Start performance tracking
  const startTime = performanceMonitor.start('process-new-member')
  
  try {
    // Fetch from cache or database
    const member = await cacheManager.get(
      CACHE_KEYS.MEMBER(churchId, memberId),
      async () => {
        return await db.member.findUnique({
          where: { id: memberId, churchId },
          include: { spiritualAssessments: true }
        })
      },
      { ttl: CACHE_TTL.MEMBER_PROFILE }  // 10 minutes
    )
    
    // Send welcome email
    await sendEmail({
      to: member.email,
      subject: 'Bienvenido a la Iglesia',
      template: 'welcome-member',
      data: { memberName: member.name }
    })
    
    // Invalidate related caches
    await cacheManager.invalidatePattern(`church:${churchId}:members:*`)
    
    // Track performance
    performanceMonitor.end('process-new-member', startTime)
    
    return { success: true, member }
  } catch (error) {
    performanceMonitor.error('process-new-member', error)
    throw error
  }
}
```

**Service Location Guide**
```
lib/
├── Core Infrastructure
│   ├── db.ts                           # Prisma singleton (PRIMARY data access)
│   ├── redis-cache-manager.ts          # Redis caching (800+ lines, 90% hit rate)
│   ├── cache.ts                        # Legacy cache (backward compatibility)
│   └── performance.ts                  # Performance monitoring
│
├── Authentication & Security
│   ├── auth.ts                         # NextAuth.js config (JWT strategy)
│   ├── auth-validation.ts              # Auth middleware validation
│   ├── permissions.ts                  # RBAC implementation
│   ├── role-access-control.ts          # Role hierarchy enforcement
│   ├── csrf.ts                         # CSRF protection
│   └── server-auth-validator.ts        # Server-side auth checks
│
├── Analytics & Intelligence
│   ├── enhanced-ai-insights-engine.ts  # AI-powered analytics
│   ├── member-journey-analytics.ts     # Lifecycle tracking
│   ├── ai-prediction-accuracy-tracker.ts  # ML performance
│   ├── cached-analytics-service.ts     # Analytics with caching
│   └── member-analytics-cache.ts       # Member-specific analytics cache
│
├── Communication
│   ├── email.ts                        # Email service (Mailgun)
│   ├── integrations/twilio.ts          # SMS messaging
│   ├── integrations/whatsapp.ts        # WhatsApp messaging
│   └── push-notifications.ts           # Push notification service
│
├── Automation & Workflows
│   ├── automation-engine.ts            # Rule execution engine
│   ├── automation-trigger-service.ts   # Event trigger handling
│   └── feature-flags.ts                # Feature flag system
│
├── External Integrations
│   ├── stripe.ts                       # Payment processing
│   ├── bible-api-service.ts            # Bible verse API
│   ├── bible-integrations.ts           # Multiple Bible API providers
│   └── integrations/                   # Social media & external services
│
└── Utilities
    ├── utils.ts                        # General utility functions
    ├── validation-schemas.ts           # Zod validation schemas
    ├── url-sanitizer.ts                # URL validation
    ├── gender-utils.ts                 # Gender data helpers
    └── currency.ts                     # Currency formatting
```

**Service Creation Guidelines**
```typescript
// When creating new services in lib/:

// 1. Use singleton pattern for stateful services
class MyService {
  private static instance: MyService
  
  private constructor() {
    // Initialize service
  }
  
  public static getInstance(): MyService {
    if (!MyService.instance) {
      MyService.instance = new MyService()
    }
    return MyService.instance
  }
}

export const myService = MyService.getInstance()

// 2. Export named functions for stateless utilities
export function processData(input: string): string {
  // Utility function
  return input.trim()
}

// 3. Use environment variables for configuration
const API_KEY = process.env.MY_SERVICE_API_KEY || ''
if (!API_KEY && process.env.NODE_ENV === 'production') {
  console.warn('MY_SERVICE_API_KEY not configured')
}

// 4. Include TypeScript types
export interface MyServiceConfig {
  apiKey: string
  timeout: number
}

// 5. Add error handling and logging
try {
  // Service logic
} catch (error) {
  console.error('[MyService] Error:', error)
  throw error  // Re-throw for caller to handle
}
```

### Current Development Priorities (Next 2-4 Weeks)

### **PRIORITY 1: Phase 4 Architecture & Planning** (ACTIVE - Q1 2026)
Preparing for AI & Mobile Apps development phase:

**🤖 AI Integration Architecture**

**GraphQL Migration Strategy (Replacing REST APIs)**
```typescript
// Recommended GraphQL schema architecture
// File: lib/graphql/schema.ts

import { gql } from 'graphql-tag'

const typeDefs = gql`
  # Core Church Data Types
  type Church {
    id: ID!
    name: String!
    members(filters: MemberFilters): [Member!]!
    analytics(dateRange: DateRange!): ChurchAnalytics!
    brandColors: ChurchBrandColors!
  }

  type Member {
    id: ID!
    name: String!
    email: String!
    phone: String
    lifecycle: MemberLifecycle!
    spiritualAssessments: [SpiritualAssessment!]!
    checkIns(limit: Int): [CheckIn!]!
    retentionScore: Float  # AI-predicted retention probability
  }

  # Analytics Types
  type ChurchAnalytics {
    memberJourney(filters: MemberFilters): [MemberJourneyStep!]!
    predictiveInsights(models: [AIModel!]): PredictiveReport!
    executiveReport: ExecutiveReport!
    realTimeMetrics: RealtimeMetrics!
  }

  type MemberJourneyStep {
    stage: LifecycleStage!
    memberCount: Int!
    avgDuration: Int  # days
    conversionRate: Float
    nextStagePredictor: Float  # AI prediction
  }

  # Query Root
  type Query {
    # Church-scoped queries (churchId from auth context)
    church: Church!
    members(filters: MemberFilters, pagination: Pagination): MemberConnection!
    analytics(dateRange: DateRange!): ChurchAnalytics!
    
    # Single resource queries
    member(id: ID!): Member
    event(id: ID!): Event
    
    # AI-powered queries
    predictMemberRetention(memberId: ID!): RetentionPrediction!
    recommendMinistries(memberId: ID!): [MinistryRecommendation!]!
  }

  # Mutation Root
  type Mutation {
    # Member operations
    createMember(input: CreateMemberInput!): Member!
    updateMember(id: ID!, input: UpdateMemberInput!): Member!
    deleteMember(id: ID!): Boolean!
    
    # Batch operations for offline sync
    syncOfflineChanges(operations: [OfflineOperation!]!): SyncResult!
  }

  # Subscription Root (Real-time updates)
  type Subscription {
    analyticsUpdated(churchId: ID!): ChurchAnalytics!
    newMemberAdded(churchId: ID!): Member!
    checkInReceived(eventId: ID!): CheckIn!
  }

  # Input Types
  input MemberFilters {
    lifecycle: [LifecycleStage!]
    dateRange: DateRange
    searchQuery: String
    hasAssessment: Boolean
  }

  input Pagination {
    offset: Int
    limit: Int
    orderBy: String
    direction: SortDirection
  }

  enum LifecycleStage {
    VISITANTE
    NUEVO_CREYENTE
    CRECIMIENTO
    MADURO
    LIDER
  }

  enum SortDirection {
    ASC
    DESC
  }
`

// GraphQL Resolver with Church Scoping
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

const resolvers = {
  Query: {
    church: async (_parent, _args, context) => {
      // Extract churchId from auth context
      const session = await getServerSession(authOptions)
      if (!session?.user?.churchId) {
        throw new Error('Unauthorized')
      }
      
      return db.church.findUnique({
        where: { id: session.user.churchId }
      })
    },
    
    members: async (_parent, { filters, pagination }, context) => {
      const session = await getServerSession(authOptions)
      if (!session?.user?.churchId) throw new Error('Unauthorized')
      
      const where = {
        churchId: session.user.churchId,
        ...(filters?.lifecycle && { lifecycle: { in: filters.lifecycle } }),
        ...(filters?.searchQuery && {
          OR: [
            { name: { contains: filters.searchQuery, mode: 'insensitive' } },
            { email: { contains: filters.searchQuery, mode: 'insensitive' } }
          ]
        })
      }
      
      const [members, total] = await Promise.all([
        db.member.findMany({
          where,
          skip: pagination?.offset || 0,
          take: pagination?.limit || 50,
          orderBy: { [pagination?.orderBy || 'name']: pagination?.direction || 'asc' }
        }),
        db.member.count({ where })
      ])
      
      return {
        edges: members.map(member => ({ node: member })),
        pageInfo: {
          total,
          hasNextPage: (pagination?.offset || 0) + members.length < total
        }
      }
    }
  },
  
  Member: {
    // Field-level resolver with AI prediction
    retentionScore: async (member) => {
      // Call AI prediction service
      const prediction = await predictMemberRetention(member.id)
      return prediction.score
    }
  },
  
  Subscription: {
    analyticsUpdated: {
      subscribe: async (_parent, { churchId }, context) => {
        // WebSocket subscription for real-time updates
        return pubsub.asyncIterator([`ANALYTICS_UPDATED_${churchId}`])
      }
    }
  }
}
```

**GraphQL Client Integration**
```typescript
// Client-side GraphQL queries (React components)
import { gql, useQuery, useMutation } from '@apollo/client'

const GET_MEMBERS = gql`
  query GetMembers($filters: MemberFilters, $pagination: Pagination) {
    members(filters: $filters, pagination: $pagination) {
      edges {
        node {
          id
          name
          email
          lifecycle
          retentionScore  # AI prediction included
        }
      }
      pageInfo {
        total
        hasNextPage
      }
    }
  }
`

function MembersList() {
  const { data, loading, error } = useQuery(GET_MEMBERS, {
    variables: {
      filters: { lifecycle: ['VISITANTE', 'NUEVO_CREYENTE'] },
      pagination: { limit: 20, orderBy: 'name', direction: 'ASC' }
    }
  })
  
  // Single query fetches all needed data - no multiple REST calls
}
```

**Real-time WebSocket Updates (Replacing SSE)**
```typescript
// WebSocket integration pattern for bi-directional communication
// Server: lib/websocket-server.ts
import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 8080 })
const churchConnections = new Map<string, Set<WebSocket>>()

wss.on('connection', (ws, request) => {
  // Extract churchId from auth token
  const churchId = extractChurchIdFromToken(request.headers.authorization)
  
  if (!churchConnections.has(churchId)) {
    churchConnections.set(churchId, new Set())
  }
  churchConnections.get(churchId)!.add(ws)
  
  ws.on('message', (message) => {
    const data = JSON.parse(message.toString())
    // Handle client messages (subscriptions, updates)
  })
  
  ws.on('close', () => {
    churchConnections.get(churchId)?.delete(ws)
  })
})

// Broadcast to church members
export function broadcastToChurchWS(churchId: string, event: string, data: any) {
  const connections = churchConnections.get(churchId)
  if (!connections) return
  
  connections.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ event, data }))
    }
  })
}

// Client: Connect to WebSocket
const ws = new WebSocket(`wss://${process.env.WS_ENDPOINT}/church/${churchId}`)

ws.onopen = () => {
  // Subscribe to analytics updates
  ws.send(JSON.stringify({ 
    type: 'subscribe', 
    channel: 'analytics' 
  }))
}

ws.onmessage = (event) => {
  const { event: eventType, data } = JSON.parse(event.data)
  
  switch (eventType) {
    case 'analytics_update':
      // Update dashboard in real-time
      updateAnalyticsDashboard(data)
      break
    case 'new_member':
      // Add new member to list
      addMemberToList(data)
      break
  }
}
```

**AI Model A/B Testing Framework**
```typescript
// Leverage existing ai_model_ab_tests table for model comparison
// lib/ai-model-testing.ts

export async function runModelABTest({
  modelA: 'retention_model_v1',
  modelB: 'retention_model_v2',
  churchId,
  sampleSize: 100
}) {
  // Split members randomly
  const members = await getRandomMembers(churchId, sampleSize)
  const split = splitAB(members)
  
  // Run predictions with both models
  const [resultsA, resultsB] = await Promise.all([
    predictWithModel('retention_model_v1', split.groupA),
    predictWithModel('retention_model_v2', split.groupB)
  ])
  
  // Track results in ai_model_ab_tests table
  await db.ai_model_ab_tests.create({
    data: {
      modelA: 'retention_model_v1',
      modelB: 'retention_model_v2',
      accuracyA: calculateAccuracy(resultsA),
      accuracyB: calculateAccuracy(resultsB),
      sampleSize,
      winner: determineWinner(resultsA, resultsB)
    }
  })
}
```

**📱 Mobile API Optimization**

**Mobile-Optimized REST Endpoints (Transition to GraphQL)**
```typescript
// New mobile API namespace: app/api/mobile/v1/
// Mobile-specific endpoints with compressed payloads

// app/api/mobile/v1/dashboard/route.ts
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.churchId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const churchId = session.user.churchId
  
  // Single aggregated query instead of multiple REST calls
  const [memberStats, eventStats, donationStats] = await Promise.all([
    db.member.aggregate({
      where: { churchId },
      _count: true,
      _avg: { retentionScore: true }
    }),
    db.event.count({ where: { churchId, date: { gte: new Date() } } }),
    db.donation.aggregate({
      where: { churchId, createdAt: { gte: startOfMonth(new Date()) } },
      _sum: { amount: true }
    })
  ])
  
  // Compact response <2KB (vs 15KB+ in current REST)
  return NextResponse.json({
    m: memberStats._count,        // Members count
    r: memberStats._avg.retentionScore,  // Avg retention
    e: eventStats,                // Upcoming events
    d: donationStats._sum.amount  // Monthly donations
  })
}

// Client mobile app usage:
const { m: members, r: retention, e: events, d: donations } = await fetch('/api/mobile/v1/dashboard').then(r => r.json())
```

**Offline-First Architecture**
```typescript
// Mobile app offline sync pattern
// Uses existing PWA foundation + IndexedDB

import { openDB } from 'idb'

const db = await openDB('khesed-tek-mobile', 1, {
  upgrade(db) {
    // Offline storage for critical data
    db.createObjectStore('members', { keyPath: 'id' })
    db.createObjectStore('events', { keyPath: 'id' })
    db.createObjectStore('pending-changes', { keyPath: 'id', autoIncrement: true })
  }
})

// Queue changes for offline sync
export async function createMemberOffline(memberData) {
  // Save to local IndexedDB
  await db.add('pending-changes', {
    type: 'CREATE_MEMBER',
    data: memberData,
    timestamp: Date.now()
  })
  
  // Attempt immediate sync if online
  if (navigator.onLine) {
    await syncPendingChanges()
  }
}

// Sync when connection restored
export async function syncPendingChanges() {
  const changes = await db.getAll('pending-changes')
  
  // Batch sync via GraphQL mutation
  const result = await graphqlClient.mutate({
    mutation: SYNC_OFFLINE_CHANGES,
    variables: { operations: changes }
  })
  
  // Clear synced changes
  if (result.data.syncOfflineChanges.success) {
    const tx = db.transaction('pending-changes', 'readwrite')
    await tx.objectStore('pending-changes').clear()
  }
}
```

**Mobile Authentication with Refresh Tokens**
```typescript
// Enhanced JWT strategy for mobile apps
// lib/mobile-auth.ts

export async function generateMobileTokens(userId: string, churchId: string) {
  // Short-lived access token (15 minutes)
  const accessToken = jwt.sign(
    { userId, churchId, type: 'access' },
    process.env.NEXTAUTH_SECRET!,
    { expiresIn: '15m' }
  )
  
  // Long-lived refresh token (7 days)
  const refreshToken = jwt.sign(
    { userId, churchId, type: 'refresh' },
    process.env.NEXTAUTH_SECRET!,
    { expiresIn: '7d' }
  )
  
  // Store refresh token in database
  await db.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  })
  
  return { accessToken, refreshToken }
}

// Mobile app refresh pattern
export async function refreshAccessToken(refreshToken: string) {
  const decoded = jwt.verify(refreshToken, process.env.NEXTAUTH_SECRET!)
  
  // Verify token exists and not revoked
  const storedToken = await db.refreshToken.findFirst({
    where: { 
      token: refreshToken,
      expiresAt: { gte: new Date() },
      revoked: false
    }
  })
  
  if (!storedToken) throw new Error('Invalid refresh token')
  
  // Generate new access token
  return generateMobileTokens(decoded.userId, decoded.churchId)
}
```

**🔍 Enterprise Scalability Testing**

**Load Testing Infrastructure**
```bash
# package.json scripts for Phase 4 testing
"scripts": {
  "test:load:1k-churches": "artillery run tests/load/1k-churches.yml",
  "test:stress:memory": "node tests/stress/memory-stress.js",
  "test:database:scale": "node tests/database/connection-pooling.js",
  "test:graphql:performance": "artillery run tests/load/graphql-queries.yml"
}
```

```yaml
# tests/load/1k-churches.yml - Artillery load test
config:
  target: 'https://api.khesed-tek.com'
  phases:
    - duration: 300  # 5 minutes
      arrivalRate: 100  # 100 requests/second
      name: "Sustained load - 1K churches"
  processor: "./load-test-processor.js"

scenarios:
  - name: "GraphQL Analytics Query"
    weight: 40
    flow:
      - post:
          url: "/graphql"
          json:
            query: "query { analytics(dateRange: { start: \"2026-01-01\", end: \"2026-01-31\" }) { memberJourney { stage memberCount } } }"
          headers:
            Authorization: "Bearer {{ $randomChurchToken }}"
          capture:
            - json: "$.data.analytics.memberJourney"
              as: "journey"
      - think: 2
  
  - name: "Mobile Dashboard API"
    weight: 60
    flow:
      - get:
          url: "/api/mobile/v1/dashboard"
          headers:
            Authorization: "Bearer {{ $randomChurchToken }}"
```

**Performance Monitoring Dashboard**
```typescript
// lib/performance-monitoring.ts - Real-time metrics
import { performanceMonitor } from '@/lib/performance'

export interface PerformanceMetrics {
  // Response time targets
  avgResponseTime: number     // Target: <2s
  p95ResponseTime: number     // Target: <5s
  p99ResponseTime: number     // Target: <10s
  
  // GraphQL specific
  queryComplexity: number     // Monitor query depth
  resolverTime: number        // Individual resolver performance
  
  // Database
  dbConnectionPoolUtilization: number  // Target: <80%
  slowQueryCount: number      // Queries >1s
  
  // Caching
  cacheHitRate: number        // Target: >90%
  cacheEvictionRate: number
  
  // Concurrency
  activeChurches: number      // Concurrent church sessions
  activeConnections: number   // WebSocket connections
}

// Real-time monitoring endpoint
export async function GET() {
  const metrics = await performanceMonitor.getMetrics()
  return NextResponse.json({
    timestamp: new Date(),
    metrics,
    alerts: metrics.avgResponseTime > 2000 ? ['High response time'] : []
  })
}
```

**Horizontal Scaling Architecture**
```typescript
// Redis Cluster Configuration (replacing single Redis instance)
// lib/redis-cluster.ts

import Redis from 'ioredis'

const cluster = new Redis.Cluster([
  { host: 'redis-node-1', port: 7000 },
  { host: 'redis-node-2', port: 7001 },
  { host: 'redis-node-3', port: 7002 }
], {
  redisOptions: {
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: 3
  },
  clusterRetryStrategy: (times) => Math.min(times * 100, 2000)
})

export default cluster

// Database Read Replicas (Prisma configuration)
// datasources {
//   db {
//     provider = "postgresql"
//     url      = env("DATABASE_URL")  // Primary (writes)
//     directUrl = env("DATABASE_DIRECT_URL")  // Read replica
//   }
// }

// Route read queries to replica
export async function getMembers(churchId: string) {
  // Use read replica for heavy analytics queries
  return await db.$queryRaw`
    SELECT * FROM members WHERE church_id = ${churchId}
  `
}
```

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

### **DEPLOYMENT PROTOCOL** (MANDATORY - ENTERPRISE COMPLIANCE)
**⚠️ CRITICAL**: **AFTER EVERY COMPLETED TASK** - Execute `git push origin main` to Vercel production deployment **IMMEDIATELY** upon task completion. **NO EXCEPTIONS**.

**🚨 ENTERPRISE MANDATE**: This ensures all updates are automatically deployed to the live production environment without delay. **FAILURE TO DEPLOY = INCOMPLETE TASK**.

**Vercel Deployment Flow** (ONLY External Integration):
```bash
git add .
git commit -m "descriptive message"
git push origin main  # → Triggers Vercel build → Detects Next.js → npm ci → prisma generate → next build (360+ routes) → Production deployment
```

**⚠️ CRITICAL**: Never use `npx prisma db push` in production. Use `npx prisma migrate dev` to create migrations, then migrations run automatically on Vercel deployment.
**🚨 MANDATORY GIT PUSH**: Always execute `git push origin main` after completing any update, change, or task to ensure immediate deployment to Vercel production environment.
## Key Workflows & Commands

### Development
```bash
npm run dev                    # Start dev server (0.0.0.0:3000)
npm run build                  # Production build (NODE_OPTIONS optimized)
npm run build:memory-optimized # Memory-optimized build (CRITICAL for production)
npm run build:incremental      # Experimental incremental build mode
npx prisma db seed            # Populate database (scripts/seed.ts)
npm run cleanup               # Memory cleanup scripts (3.4MB freed)
npm run cleanup:memory        # Run memory monitor test (uses tsx)
npm run memory:assess         # Memory assessment and optimization (uses tsx)
npm run optimize              # Combined cleanup + memory-optimized build
npm run validate:system       # Validate CUID system integrity
npm run validate:auth         # Validate authentication configuration
npm run verify:patterns       # Check critical patterns compliance
npm run fix:patterns          # Apply critical fixes automatically
npm run pre-deploy            # Pre-deployment verification
npm run backup                # Backup system state
```

**Note**: Scripts using `tsx` (TypeScript Execute) run TypeScript files directly without compilation step.

### Database Operations
```bash
npx prisma generate          # Regenerate Prisma client after schema changes
npx prisma db push          # Push schema changes (dev only - no migrations)
npx prisma studio           # Database GUI (localhost:5555)
npx prisma migrate dev      # Create and apply migration (production workflow)
npx prisma migrate deploy   # Apply migrations in production (runs automatically on Vercel)
```

**CRITICAL**: Never use `npx prisma db push` in production. Always create migrations with `npx prisma migrate dev` for version-controlled schema changes.

### Production Deployment
```bash
git push origin main        # Triggers automatic Vercel deployment
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

### REST API Architecture Patterns

**Standard API Route Structure (CRITICAL)**
```typescript
// app/api/{feature}/route.ts - Standard CRUD endpoint pattern
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET - Fetch resources (church-scoped)
export async function GET(request: NextRequest) {
  try {
    // STEP 1: Authentication (ALWAYS FIRST)
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json(
        { error: 'Unauthorized - No church ID found' },
        { status: 401 }
      )
    }

    // STEP 2: Extract churchId from session (NEVER from request params)
    const churchId = session.user.churchId

    // STEP 3: Parse query parameters (optional)
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter')

    // STEP 4: Database query with church scoping (CRITICAL)
    const data = await db.model.findMany({
      where: { 
        churchId,  // ALWAYS include
        ...(filter && { status: filter })
      },
      orderBy: { createdAt: 'desc' }
    })

    // STEP 5: Return standardized success response
    return NextResponse.json({ 
      data, 
      success: true,
      meta: { total: data.length }
    })
  } catch (error) {
    console.error('GET /api/feature error:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

// POST - Create resource
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const churchId = session.user.churchId
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.description) {
      return NextResponse.json(
        { error: 'Missing required fields', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // Create with automatic churchId injection
    const newResource = await db.model.create({
      data: {
        ...body,
        churchId,  // ALWAYS inject from session
      }
    })

    return NextResponse.json({ data: newResource, success: true }, { status: 201 })
  } catch (error) {
    console.error('POST /api/feature error:', error)
    return NextResponse.json({ error: 'Creation failed' }, { status: 500 })
  }
}

// PUT - Update resource
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const churchId = session.user.churchId
    const body = await request.json()
    const { id, ...updateData } = body

    // Verify ownership before update (SECURITY CRITICAL)
    const existing = await db.model.findFirst({
      where: { id, churchId }  // Double-check ownership
    })

    if (!existing) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    const updated = await db.model.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ data: updated, success: true })
  } catch (error) {
    console.error('PUT /api/feature error:', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

// DELETE - Remove resource
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const churchId = session.user.churchId
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
    }

    // Verify ownership before deletion
    const existing = await db.model.findFirst({
      where: { id, churchId }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    await db.model.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'Resource deleted' })
  } catch (error) {
    console.error('DELETE /api/feature error:', error)
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 })
  }
}
```

**Dynamic Route Parameters Pattern**
```typescript
// app/api/members/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.churchId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const churchId = session.user.churchId
  const memberId = params.id

  // CRITICAL: Verify resource belongs to church
  const member = await db.member.findFirst({
    where: { 
      id: memberId,
      churchId  // Prevent cross-church data access
    },
    include: {
      spiritualAssessments: true,
      checkIns: { take: 10, orderBy: { createdAt: 'desc' } }
    }
  })

  if (!member) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 })
  }

  return NextResponse.json({ data: member, success: true })
}
```

**API Response Standards**
```typescript
// Success Response Format
{
  "data": {},           // or [] for lists
  "success": true,
  "meta": {             // Optional metadata
    "total": 100,
    "page": 1,
    "pageSize": 20
  }
}

// Error Response Format
{
  "error": "Description",
  "code": "ERROR_CODE",     // VALIDATION_ERROR, UNAUTHORIZED, NOT_FOUND, etc.
  "details": {}              // Optional additional context
}

// HTTP Status Codes
// 200: Success (GET, PUT)
// 201: Created (POST)
// 400: Bad Request (validation errors)
// 401: Unauthorized (no session/churchId)
// 403: Forbidden (insufficient permissions)
// 404: Not Found
// 409: Conflict (duplicate entries)
// 500: Internal Server Error
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
- **Form Builder**: Smart templates with QR generation and visitor CRM integration (`/form-builder`)

### Platform Modules ✅
- **Website Builder**: Dynamic church websites (`/website-builder`)
- **Prayer Wall**: Prayer request management (`/prayer-wall`)
- **Platform Admin**: Multi-tenant management (`/platform`)

### Form Builder System Architecture ✅

**Smart Templates System** (7 production templates):
```typescript
// Template categories with themed icons (NO EMOJIS)
const SMART_TEMPLATES = [
  {
    id: 'simple-visitor-tracking',
    name: 'Visitante Básico',
    icon: 'Sparkles', // Purple themed
    fields: [name, phone, email, source] // 4 fields
  },
  {
    id: 'visitor-source-tracking', 
    name: 'Rastreo de Fuentes de Visitantes',
    icon: 'BarChart3', // Blue themed
    fields: [contact_data, traffic_source, visit_reason] // 5 fields
  },
  // ... 5 more templates with unique themed icons
]

// Icon rendering with proper JSX components
const getTemplateIcon = (iconName: string) => {
  switch (iconName) {
    case 'Sparkles':
      return <Sparkles className="h-8 w-8 text-purple-600" />
    case 'BarChart3':
      return <BarChart3 className="h-8 w-8 text-blue-600" />
    case 'Share2':
      return <Share2 className="h-8 w-8 text-green-600" />
    case 'Heart':
      return <Heart className="h-8 w-8 text-pink-600" />
    case 'Calendar':
      return <Calendar className="h-8 w-8 text-orange-600" />
    case 'Users':
      return <Users className="h-8 w-8 text-indigo-600" />
    case 'FileText':
      return <FileText className="h-8 w-8 text-gray-600" />
  }
}
```

**Quick Field Presets** (18 common fields):
- Personal: Nombre, Email, Teléfono, Fecha Nacimiento, Género
- Contact: Dirección, Ciudad, País, WhatsApp, Instagram
- Church-specific: ¿Cómo nos conociste?, ¿Primera vez?, Ministerios
- Special: Comentarios, Oración, Necesidades, Testimonio

**Navigation System** (Multi-path UX):
- Primary: Navigation header with breadcrumbs + "Volver a Plantillas" button
- Secondary: Form configuration card header button
- Template summary: "Ver Otras Plantillas" / "Empezar de Nuevo" options

**QR Code Generation**:
- Slug-based URLs (50 chars vs 5000+ previously)
- Auto-generation on form save: `/form-viewer?slug=EVENT-NAME`
- Fixed URL length issue for scannable QR codes

**Visitor CRM Integration**:
```typescript
// Auto-detect visitor forms and create CRM profiles
const detectVisitorForm = (formData) => {
  if (hasNameField && (hasEmailField || hasPhoneField)) {
    createVisitorProfile({
      category: categorizeVisitor(responses),
      source: extractTrafficSource(responses),
      churchId: session.user.churchId
    })
  }
}
```

**Template Troubleshooting Guide**:
1. **Icons not showing**: Check getTemplateIcon() function, ensure JSX components
2. **Template not applying**: Wait 2-3s, check network, try different template
3. **Navigation stuck**: Look for "Volver a Plantillas" in header or form config card
4. **QR too dense**: Save form first to generate slug, then regenerate QR
5. **CRM not creating**: Verify name + contact field present and marked required

## Development Guidelines

### **CRITICAL PROTOCOL CHECK** (NON-NEGOTIABLE - ENTERPRISE COMPLIANCE)
**Before implementing or deleting ANY code, **ALWAYS** execute these 8 steps in order. **NO EXCEPTIONS**:

**⚠️ ENTERPRISE MANDATE**: These steps are **MANDATORY** for production system integrity

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

**Vercel Deployment Flow**:
```bash
git add .
git commit -m "descriptive message"
git push origin main  # → Triggers Vercel build → Detects Next.js → npm ci → prisma generate → next build (360+ routes) → Production deployment
```

### Production Deployment Standards
- **TypeScript Coverage**: 100% with zero compilation errors (ENFORCED via `ignoreBuildErrors: false`)
- **Memory Optimization**: Use `npm run build:memory-optimized` for production
- **Vercel Deployment**: All builds must compile 360 total routes successfully (118 pages + 242 API routes)
- **Feature Flags**: Use for safe deployment of new features (`lib/feature-flags.ts`)
- **Route Group Pattern**: Use parentheses for layout organization `(dashboard)`, `(platform)`
- **ICON PROTOCOL ENFORCEMENT**: All UI elements MUST use lucide-react stroke-only SVG icons with unique themed colors - NO emojis allowed

### **ICON PROTOCOL VALIDATION CHECKLIST**
Before every deployment, verify:
- ✅ **NO EMOJIS** in any production UI code (🎯, 🚀, 💡, 📝, ✨, 📊, 🔍, 📧, 🙏, 🎉, ⛪, 🤝, 📅, 💬, ✋)
- ✅ **ONLY lucide-react icons** - stroke-only SVG outline style
- ✅ **UNIQUE THEMED COLORS** - each feature gets distinct color (purple-600, blue-600, green-600, pink-600, orange-600, indigo-600)
- ✅ **TRANSPARENT INTERIORS** - colored strokes with no solid fills
- ✅ **NO GENERIC OVERUSE** - avoid FileText for everything, use appropriate themed icons

```bash
# Icon protocol validation commands
grep -r "🎯\|🚀\|💡\|📝\|✨\|📊\|🔍\|📧\|🙏\|🎉\|⛪\|🤝\|📅\|💬\|✋" app/ --include="*.tsx" --include="*.ts"  # Should return empty
grep -r "lucide-react" app/ --include="*.tsx" | wc -l  # Should show proper icon imports
```

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

### **EXTERNAL INTEGRATIONS** (Enterprise Compliance)
**⚠️ VERCEL ONLY**: Vercel Production Workflows is the **ONLY** approved external integration
- **NO other external systems** are currently integrated
- **ALL deployment workflows** go through Vercel exclusively
- **NO staging environment** - direct production deployment only

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

### Vercel Deployment Workflow
```bash
# Automated deployment pipeline (triggered on git push to main)
git push origin main  # Triggers Vercel build & deploy

# Pre-deployment validation (scripts/safe-deployment.sh)
1. TypeScript compilation check (npm run test:compile)
2. Feature flag verification (ENABLE_SOCIAL_MEDIA_AUTOMATION)
3. Production build test (npm run build)
4. Critical pattern verification (npm run verify:patterns)
5. Memory optimization (npm run build:memory-optimized)

# Vercel build process:
- Detects Next.js application automatically
- Installs dependencies with npm ci
- Runs Prisma generate
- Executes next build (compiles 360 total routes)
- Deploys to production serverless infrastructure
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

---

## 📚 HELP MANUALS & TROUBLESHOOTING

**⚠️ CRITICAL PROTOCOL - NON-NEGOTIABLE ENTERPRISE COMPLIANCE:**
- **ALL platform, tenant, and super admin help content MUST be in THIS file ONLY**
- **NO standalone help manual files are permitted** (e.g., TENANT_HELP_MANUAL_*.md)
- **Location**: `.github/copilot-instructions.md` - Section "📚 HELP MANUALS & TROUBLESHOOTING"
- **Sections**: TENANT HELP MANUAL, SUPER ADMIN HELP MANUAL
- **Violation Consequences**: Immediate correction required, standalone files must be archived
- **AI Agent Mandate**: Always update THIS file for ALL help documentation

---

### **TENANT HELP MANUAL - Form Builder & Social Media System**

## 📱 **SOCIAL MEDIA - SUPER SIMPLE GUIDE** 

### **🎯 STEP 1: How to Connect Your Social Media (Like Magic!)**

**What you need to do:** Click 3 buttons. That's it! 🎉

**Go to Social Media page:**
1. Click "Social Media" in your sidebar (left side of screen)
2. You will see 3 big colorful buttons:
   - 🔵 **"Conectar Facebook"** (Blue button)
   - 🟣 **"Conectar Instagram"** (Purple button)  
   - 🔴 **"Conectar YouTube"** (Red button)

**Connect each one:**
1. **Click the blue "Conectar Facebook" button**
2. **Facebook will open** (like a new window)
3. **Click "Continue" or "Permitir"** on Facebook 
4. **You come back to your church page** 
5. **✅ Facebook is connected!** (you'll see a green checkmark)

**Repeat for Instagram and YouTube** - same easy steps!

### **🎪 STEP 2: What Happens After Connecting? (The Fun Part!)**

**Now you can do EVERYTHING from one place:**
- ✍️ **Write posts** that go to Facebook, Instagram, AND YouTube at same time
- 📅 **Schedule posts** for later (like Sunday morning)
- 📊 **See how many people liked** your posts
- 📸 **Share photos and videos** automatically
- 🤖 **AI helps write better posts** (optional)

**It's like having a magic remote control for all your social media!** 🎮

### **🆘 HELP! Something's Not Working**

**"Conectar" button does nothing when I click it:**
- ✅ **Try refreshing the page** (F5 or reload button)
- ✅ **Check your internet connection**
- ✅ **Try a different browser** (Chrome works best)
- ✅ **Make sure popup blockers are off**

**"I clicked but got an error page:"**
- ✅ **Don't worry!** Go back and try again
- ✅ **Sometimes Facebook/Instagram is busy** - try in 5 minutes
- ✅ **Make sure you're logged into Facebook/Instagram already**

**"I connected but don't see my posts:"**
- ✅ **Wait 2-3 minutes** - sometimes it takes a moment
- ✅ **Refresh the page**
- ✅ **Check if you selected the right Facebook page** (not personal profile)

### **🎨 STEP 3: Creating Posts (Super Easy!)**

**Write your message:**
1. Type what you want to say in the big text box
2. Pick which platforms: ☑️ Facebook ☑️ Instagram ☑️ YouTube
3. Add photos if you want (drag and drop!)
4. Click **"Publicar Ahora"** (Post Now) or **"Programar"** (Schedule)
5. **Done!** Your post goes everywhere! 🚀

**Want AI to help write your post?**
- Turn on the "🤖 AI Ayuda" toggle
- AI will make your words sound better and add emojis! 

### **📅 STEP 4: Scheduling Posts (Post While You Sleep!)**

1. Write your post like normal
2. Instead of "Publicar Ahora", click **"Programar"**
3. Pick the date and time (like "Sunday 9:00 AM")
4. Click **"Programar Post"**
5. **Go to sleep!** Your post will publish automatically! 😴→📱

### **🔍 STEP 5: See How Your Posts Are Doing**

**Check your "Social Media Dashboard":**
- 👍 **Likes**: How many people liked your posts
- 💬 **Comments**: People talking about your posts  
- 👁️ **Views**: How many people saw your posts
- 📈 **Growth**: Are you getting more followers?

**Think of it like a report card for your church's social media!** 📊

---

## 📋 **FORM BUILDER SYSTEM - SUPER SIMPLE GUIDE**

**Access Instructions:**
1. Navigate to `/form-builder` from dashboard sidebar
2. Select from **9 Smart Templates** with unique themed icons (including NEW public assessment templates)
3. Customize using Quick Field Presets (18 options) or manual field addition
4. **NEW**: Customize submit button (text, colors) for brand consistency
5. Generate QR codes with slug-based URLs for sharing
6. **COMPREHENSIVE QR Customization**: Background, dots, markers, gradients, logos
7. Automatic visitor CRM integration for lead generation
8. **NEW**: Public spiritual assessment and volunteer forms for members without platform access

## 🎨 **NEW: SUBMIT BUTTON CUSTOMIZATION**

**Location**: Paso 1: Configuración → "Personalización del Botón de Envío" section

**Customization Options**:
1. **Button Text**: Change "Enviar Formulario" to any custom text (e.g., "Registrarme", "Solicitar Información")
2. **Button Background Color**: Color picker + hex input (default: #2563eb blue)
3. **Button Text Color**: Color picker + hex input (default: #ffffff white)

**Usage**:
- Customize button to match your church's branding
- Use action-oriented text for better engagement
- Ensure sufficient contrast between button and text colors
- Changes reflect in real-time preview

**Examples**:
- Visitor forms: "Quiero Conectar" (green background, white text)
- Prayer requests: "Enviar Oración" (purple background, white text)
- Event registration: "Registrarme Ahora" (orange background, white text)

## 📊 **FORM SUBMISSION FLOW - WHERE YOUR DATA GOES**

### **When "Enviar Formulario" is Clicked:**

**Step 1: API Submission** → `/api/custom-form/[slug]`

**Step 2: THREE Automatic Database Records Created:**

#### **1️⃣ VISITOR PROFILE** (check_ins table)
- **Extracts**: Name, email, phone from form fields (smart field detection)
- **Labels**: `visitorType: 'custom_form'`
- **Engagement**: Sets `engagementScore: 85` (high)
- **Visit Reason**: "Form: [Your Form Title]"
- **RESULT**: ✅ Visitor appears in **Visitors Dashboard** immediately

#### **2️⃣ FORM SUBMISSION** (custom_form_submissions table)
- **Stores**: Complete form data as JSON
- **Tracks**: IP address, user agent, timestamp
- **Links**: To visitor ID created above
- **RESULT**: ✅ View all submissions in **Form Builder → Submissions**

#### **3️⃣ AUTOMATIC FOLLOW-UP TASK** (visitor_follow_ups table)
- **Priority**: HIGH
- **Status**: PENDING
- **Scheduled**: 24 hours later (next day)
- **Includes**: Visitor contact info, preferred contact method
- **RESULT**: ✅ Task appears in **Follow-Ups Dashboard**

### **Smart Data Extraction**
The system automatically finds visitor info using intelligent mapping:
- **Email**: Searches for `email`, `correo`, `correoelectronico`, `e-mail`
- **Phone**: Searches for `phone`, `telefono`, `celular`, `mobile`
- **Name**: Searches for `firstName`, `nombre`, `name`, `fullName`
- **Prayer**: Searches for `prayer_requests`, `oracion`, `peticion`
- **Interests**: Searches for `interests`, `intereses`, `ministerios`

### **Success Response to User**
```
¡Gracias por contactar a [Church Name]! Nos pondremos en contacto pronto.
```
User sees success screen with option to submit another form.

### **Where to Find Submitted Data**
1. **Visitors Dashboard** (`/visitors`) - All form submissions as new visitors
2. **Follow-Ups Dashboard** (`/visitor-follow-ups`) - Automatic tasks
3. **Form Builder** (`/form-builder`) - Submission analytics
4. **Database Tables**: `check_ins`, `custom_form_submissions`, `visitor_follow_ups`

## 🎨 **COMPREHENSIVE QR CODE CUSTOMIZATION**

**Location**: Paso 3: Personalizar QR → Full customization panel

### **✅ ALL 4 Core Customizations Available:**

#### **1. Background Color** (backgroundColor)
- **Label**: "Fondo"
- **UI**: Color picker + Hex input
- **Default**: #ffffff (white)
- **Use**: Match church branding or event theme

#### **2. Dots Color** (foregroundColor)
- **Label**: "QR Principal"
- **UI**: Color picker + Hex input
- **Default**: #000000 (black)
- **Use**: Primary QR code pattern color

#### **3. Marker Border** (eyeBorderColor)
- **Label**: "Color Borde" (under Esquinas section)
- **UI**: Color picker + Hex input
- **Default**: #000000 (black)
- **Use**: Corner square border color

#### **4. Marker Center** (eyeColor)
- **Label**: "Color Esquinas" (under Esquinas section)
- **UI**: Color picker + Hex input
- **Default**: #000000 (black)
- **Use**: Corner square fill color

### **🚀 Advanced QR Features:**

**Gradient Support**:
- Linear or Radial gradients
- Up to 4 colors
- Custom angle control (0-360°)
- Replaces solid dots color with gradient

**Eye (Marker) Styles**:
- Square, Rounded, or Circle
- Independent color control
- Visual previews for each style

**Dot Pattern Styles**:
- Clásico (square dots)
- Moderno (rounded dots)
- Puntos (circular dots)
- Elegante (diamond-shaped dots)

**Logo Integration**:
- Upload church logo (PNG, JPG, SVG)
- Logo shape: Circle, Square, Rounded Square
- Size control: 10-25% (max for scanning safety)
- Opacity: 50-100%
- Margin: 5-25px safety zone
- Optional white background behind logo

**Background Options**:
- Solid color
- Gradient (linear/radial)
- Background image upload
- Image opacity control

**Size & Margin**:
- QR size: 200-800px
- Margin: 0-10 units

### **⚠️ Scanning Safety Alerts**
- Logo >25% triggers warning (reduces scannability)
- High contrast recommended for reliability
- Test QR codes before printing

## 🙏 **NEW: PUBLIC ASSESSMENT SYSTEM TEMPLATES**

### **"Evaluación Espiritual Pública" Template**
**Icon**: Heart (pink-600) - No login required for church members

**Purpose**: Allow church members to complete spiritual assessments via QR codes without platform access

**Key Fields**:
- Contact: Nombre, Email, Teléfono
- Spiritual Gifts: 12 options (Liderazgo, Enseñanza, Evangelismo, etc.)
- Ministry Passions: 12 options (Niños, Jóvenes, Familia, etc.)
- Experience Level: Novato/Intermedio/Avanzado
- Spiritual Calling: Text description
- Availability Comments

**Usage Steps**:
1. Select "Evaluación Espiritual Pública" template
2. Customize fields if needed (or use as-is)
3. Save form to generate permanent slug
4. Generate QR code with professional styling
5. Share QR via social media, printed materials, or displays
6. **Leadership automatically receives email notifications** when submitted

### **"Disponibilidad de Voluntarios" Template**
**Icon**: Users (indigo-600) - External volunteer recruitment

**Purpose**: Collect volunteer applications from members without requiring platform login

**Key Fields**:
- Contact: Nombre, Email, Teléfono
- Ministry Interests: 10 options (Niños, Música/Adoración, etc.)
- Skills & Talents: 12 options (Música, Tecnología, Diseño, etc.)
- Availability Days: 8 time slots
- Time Commitment: 4 levels (1-2 hours to 10+ hours weekly)
- Leadership Interest: 3 levels
- Special Requirements: Text field

**Usage Steps**:
1. Select "Disponibilidad de Voluntarios" template
2. Customize ministry options to match your church
3. Save and generate QR code
4. Place QR codes in strategic locations
5. **Automatic volunteer profile creation** in system
6. **Leadership receives detailed email notifications**

## 📧 **Automatic Leadership Notifications**

Both public assessment templates automatically send **professional HTML email notifications** to:
- All users with **Pastor** role
- All users with **Administrador** role

**Email Content Includes**:
- Complete submission details
- Member contact information
- Assessment responses formatted professionally
- Action recommendations for follow-up
- Church branding and professional styling

## 🎯 **Best Practice Usage Guide**

### **For Spiritual Assessments**:
1. **Timing**: Launch during spiritual growth campaigns or new member orientation
2. **Placement**: QR codes on bulletins, social media, church screens
3. **Follow-up**: Leadership should contact members within 48 hours
4. **Integration**: Results automatically populate member spiritual profiles

### **For Volunteer Recruitment**:
1. **Timing**: During volunteer appreciation events or service campaigns
2. **Placement**: Ministry fair booths, volunteer recruitment drives
3. **Follow-up**: Ministry coordinators receive volunteer contact info
4. **Integration**: Volunteer profiles created with availability preferences

## 🚀 **Advanced Features**

### **Smart Member Linking**
The system uses **4-strategy duplicate detection**:
1. **Exact email match** (most reliable)
2. **Phone + name similarity** (when email missing)
3. **Fuzzy name matching** (prevents duplicates)
4. **Create new member** (last resort)

### **QR Code Professional Styling**
- **Gradients**: Professional color schemes
- **Logo Integration**: Church logos embedded
- **Corner Styling**: Rounded or square corners
- **Background Options**: Solid colors or images
- **Size Optimization**: Perfect for mobile scanning

**Common Issues & Solutions:**

**Issue: Template icons showing as text**
- **Cause**: getTemplateIcon() function not rendering JSX properly
- **Fix**: Ensure all template icons use proper JSX components with themed colors
- **Check**: Icons should be Sparkles (purple), BarChart3 (blue), Share2 (green), Heart (pink), Calendar (orange), Users (indigo), FileText (gray)

**Issue: Users stuck in form builder without navigation back**
- **Cause**: Missing "Volver a Plantillas" buttons
- **Fix**: Check navigation header and form configuration card header
- **Locations**: Primary header breadcrumb area + secondary in CardHeader
- **Backup**: "Ver Otras Plantillas" and "Empezar de Nuevo" options

**Issue: QR codes too dense or not scannable**
- **Cause**: URL too long (5000+ characters)
- **Fix**: Save form first to generate slug, then regenerate QR
- **Result**: Short URL format `/form-viewer?slug=EVENT-NAME` (50 chars max)

**Issue: Public assessment not creating member profiles**
- **Cause**: Missing required fields (name + email)
- **Fix**: Ensure name and email fields are marked as required
- **Check**: Verify form includes both contact fields for member linking

**Issue: Leadership not receiving notification emails**
- **Cause**: No users with Pastor/Administrador roles, or email service issues
- **Fix**: Verify church has active leadership accounts and check email configuration
- **Check**: Confirm email addresses in user profiles are correct

**Issue: Duplicate members being created**
- **Cause**: Member linking logic not finding existing profiles
- **Fix**: Ensure members use consistent email addresses
- **Prevention**: The system checks email, phone, and name similarity automatically

**Issue: Form not detecting spiritual assessment type**
- **Cause**: Field names not matching detection patterns
- **Fix**: Use template fields as-is, or ensure custom fields include 'spiritual', 'dones', or 'ministry' keywords
- **Check**: Verify form slug contains 'spiritual-assessment' or similar terms

### **SUPER ADMIN HELP MANUAL - Platform Management**

## 🚀 **SOCIAL MEDIA OAUTH SYSTEM - TECHNICAL GUIDE**

### **🏗️ SaaS Architecture (Buffer/Hootsuite Model)**

**System Overview:**
- **Enterprise Requirement**: Platform manages ALL OAuth credentials - churches only click "Conectar"
- **System Location**: `/api/oauth/` (NEW - 65 lines) vs `/api/social-oauth/` (OLD - 202 lines, deprecated) 
- **Client Flow**: Button → GET `/api/social-media/connect?platform=X` → OAuth URL → Redirect → Callback → Connected
- **Security**: AES-256 encrypted tokens, runtime validation, performance monitoring
- **Church Experience**: Zero technical configuration - true one-click social media connection

### **🔧 REQUIRED ENVIRONMENT VARIABLES (Platform Level Only)**

**Production Railway Environment Setup:**
```bash
# Facebook/Instagram OAuth (Meta Developer Console)
FACEBOOK_CLIENT_ID=your_meta_app_id_here
FACEBOOK_CLIENT_SECRET=your_meta_app_secret_here

# YouTube OAuth (Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_oauth_client_id_here  
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret_here

# Platform Base URL (Railway Production Domain)
NEXTAUTH_URL=https://your-production-domain.railway.app

# Token Encryption (Generate 256-bit key)
SOCIAL_MEDIA_ENCRYPTION_KEY=your_secure_256_bit_encryption_key_here
```

### **📋 OAUTH APP CONFIGURATION CHECKLIST**

**Step 1: Facebook Developer Console Setup**
1. **Create Facebook App**: Go to https://developers.facebook.com/apps/
2. **Add Products**: Facebook Login, Instagram Basic Display
3. **Set Callback URLs**:
   - `https://your-domain.railway.app/api/oauth/facebook/callback`
   - `https://your-domain.railway.app/api/oauth/instagram/callback`
4. **Request Permissions**: 
   - `pages_manage_posts` (Facebook posting)
   - `pages_read_engagement` (Analytics)
   - `instagram_basic` (Instagram access)
   - `instagram_content_publish` (Instagram posting)
5. **Get App ID & Secret**: Copy to Railway environment variables

**Step 2: Google Cloud Console Setup**
1. **Create Project**: Go to https://console.cloud.google.com/
2. **Enable YouTube Data API v3**
3. **Create OAuth 2.0 Client ID**: 
   - Application Type: Web Application
   - Authorized Redirect URIs: `https://your-domain.railway.app/api/oauth/youtube/callback`
4. **Get Client ID & Secret**: Copy to Railway environment variables

**Step 3: Railway Environment Variables**
1. **Go to Railway Dashboard** → Your project → Variables tab
2. **Add all 5 environment variables** listed above
3. **Deploy**: Railway will automatically restart with new config

### **🔍 TROUBLESHOOTING GUIDE (When "Conectar" Buttons Don't Work)**

**Issue 1: Button clicks but nothing happens**
```bash
# Check environment variables in production
railway logs --tail=100 | grep -i oauth

# Expected logs:
# ✅ "OAuth URL generation took XXXms for FACEBOOK"
# ❌ "OAuth no configurado para FACEBOOK" = Missing env vars
```

**Common Fixes:**
- ✅ **Missing Environment Variables**: Check Railway dashboard → Variables
- ✅ **Wrong Callback URLs**: Must match exactly in Facebook/Google console
- ✅ **App Not Approved**: Facebook/Google apps need review for production

**Issue 2: OAuth redirect fails/errors**
```bash
# Check callback handler logs
railway logs --tail=100 | grep -i callback

# Common errors:
# "OAuth error: access_denied" = User clicked cancel
# "Invalid redirect_uri" = Callback URL mismatch
# "Invalid client" = Wrong Client ID/Secret
```

**Common Fixes:**
- ✅ **Callback URL Mismatch**: Must be EXACT match in OAuth console
- ✅ **Wrong Environment**: Check NEXTAUTH_URL matches Railway domain
- ✅ **Client ID/Secret Wrong**: Double-check copy/paste from developer console

**Issue 3: Token encryption/storage fails**
```bash
# Check encryption key
railway logs --tail=100 | grep -i encryption

# Error: "Using default encryption key in production"
# Fix: Set SOCIAL_MEDIA_ENCRYPTION_KEY environment variable
```

**Generate Encryption Key:**
```bash
# Generate 256-bit random key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **📊 MONITORING & HEALTH CHECKS**

**Real-Time OAuth Performance:**
```bash
# Check OAuth URL generation speed (should be <1s)
curl -s "https://your-domain.railway.app/api/social-media/connect?platform=FACEBOOK" \
  -H "Cookie: next-auth.session-token=XXX" | jq '.performance.duration'

# Check database connections
psql $DATABASE_URL -c "SELECT platform, COUNT(*) FROM social_media_accounts GROUP BY platform;"

# Monitor encryption/decryption performance
railway logs --tail=50 | grep -i "OAuth URL generation took"
```

**Database Health:**
```sql
-- Check active social media accounts by church
SELECT 
  c.name as church_name,
  COUNT(sm.id) as connected_accounts,
  STRING_AGG(sm.platform, ', ') as platforms
FROM church c
LEFT JOIN social_media_accounts sm ON c.id = sm.church_id AND sm.is_active = true
GROUP BY c.id, c.name
ORDER BY connected_accounts DESC;

-- Check recent connection activity
SELECT 
  sm.platform,
  sm.account_name,
  c.name as church,
  sm.created_at,
  CASE WHEN sm.expires_at > NOW() THEN 'Valid' ELSE 'Expired' END as token_status
FROM social_media_accounts sm
JOIN church c ON sm.church_id = c.id
WHERE sm.created_at >= NOW() - INTERVAL '24 hours'
ORDER BY sm.created_at DESC;

-- Monitor OAuth callback success rate  
SELECT 
  DATE(created_at) as date,
  platform,
  COUNT(*) as successful_connections
FROM social_media_accounts 
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at), platform
ORDER BY date DESC, platform;
```

### **🚨 EMERGENCY FIXES**

**Quick Fix 1: Reset All OAuth Connections**
```sql
-- Emergency: Disable all social media accounts (if tokens compromised)
UPDATE social_media_accounts SET is_active = false WHERE created_at >= '2026-01-01';
```

**Quick Fix 2: Force Token Refresh**
```bash
# Trigger token refresh for specific church
curl -X POST "https://your-domain.railway.app/api/social-media/refresh-tokens" \
  -H "Content-Type: application/json" \
  -d '{"churchId": "church_id_here"}'
```

**Quick Fix 3: Check System Health**
```bash
# Overall system health check
curl -s "https://your-domain.railway.app/api/health" | jq '.socialMedia'

# Expected response:
{
  "oauth": "operational",
  "encryption": "functional", 
  "platforms": {
    "facebook": "configured",
    "instagram": "configured", 
    "youtube": "configured"
  }
}
```

### **🔐 SECURITY PROTOCOLS**

**Token Security Checklist:**
- ✅ **AES-256 Encryption**: All tokens encrypted before database storage
- ✅ **Environment Variables**: OAuth credentials in Railway env vars only
- ✅ **HTTPS Only**: All OAuth callbacks use HTTPS (enforced)
- ✅ **Expiration Tracking**: Automatic token refresh before expiry
- ✅ **Church Isolation**: Each church's tokens completely isolated

**Security Incident Response:**
1. **Suspected Token Compromise**: Run "Quick Fix 1" to disable accounts
2. **Environment Variable Leak**: Rotate all OAuth app secrets immediately
3. **Callback URL Attack**: Check Railway logs for unauthorized redirect attempts

---

## 📋 **FORM BUILDER SYSTEM MONITORING**

**Form Builder System Monitoring:**
```bash
# Check form builder compilation
npm run test:compile

# Verify template icon system (NOW 9 templates including assessments)
grep -r "getTemplateIcon" app/(dashboard)/form-builder/

# Validate QR generation
curl -s "https://api.khesed-tek.com/api/form-builder" | jq '.templates'

# Monitor visitor CRM creation
SELECT * FROM visitor_profiles WHERE created_at >= NOW() - INTERVAL '1 hour';

# NEW: Monitor public assessment submissions
SELECT * FROM custom_form_submissions WHERE created_at >= NOW() - INTERVAL '1 hour' 
AND data::text LIKE '%spiritual%' OR data::text LIKE '%volunteer%';

# NEW: Check spiritual assessment creation
SELECT sa.*, m.name, m.email FROM spiritual_assessments sa 
JOIN member m ON sa.member_id = m.id 
WHERE sa.created_at >= NOW() - INTERVAL '1 hour';

# NEW: Monitor volunteer profile creation
SELECT v.*, m.name, m.email FROM volunteers v 
JOIN member m ON v.member_id = m.id 
WHERE v.created_at >= NOW() - INTERVAL '1 hour';
```

## 🙏 **NEW: PUBLIC ASSESSMENT SYSTEM MONITORING**

### **Real-Time Assessment Tracking**
```sql
-- Monitor spiritual assessment submissions by church
SELECT 
  c.name as church_name,
  COUNT(sa.*) as assessments_today,
  COUNT(DISTINCT sa.member_id) as unique_members
FROM spiritual_assessments sa
JOIN member m ON sa.member_id = m.id
JOIN church c ON m.church_id = c.id
WHERE sa.created_at >= CURRENT_DATE
GROUP BY c.id, c.name
ORDER BY assessments_today DESC;

-- Monitor volunteer applications by church
SELECT 
  c.name as church_name,
  COUNT(v.*) as volunteer_apps_today,
  COUNT(DISTINCT v.member_id) as unique_volunteers
FROM volunteers v
JOIN member m ON v.member_id = m.id
JOIN church c ON m.church_id = c.id
WHERE v.created_at >= CURRENT_DATE
GROUP BY c.id, c.name
ORDER BY volunteer_apps_today DESC;

-- Check member linking success rate
SELECT 
  DATE(created_at) as submission_date,
  COUNT(*) as total_submissions,
  COUNT(CASE WHEN data::text LIKE '%assessmentId%' THEN 1 END) as successful_assessments,
  COUNT(CASE WHEN data::text LIKE '%volunteerId%' THEN 1 END) as successful_volunteers
FROM custom_form_submissions 
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY submission_date DESC;
```

### **Email Notification System Monitoring**
```bash
# Check email service status
curl -s "https://api.khesed-tek.com/api/health/email" | jq '.status'

# Monitor automation trigger processing
grep "SPIRITUAL_ASSESSMENT_SUBMITTED\|VOLUNTEER_APPLICATION_SUBMITTED" /var/log/automation.log | tail -50

# Check leadership notification delivery
grep "notification sent to" /var/log/email.log | grep -E "spiritual|volunteer" | tail -20

# Validate church leadership configuration
```

```sql
-- Ensure churches have proper leadership for notifications
SELECT 
  c.name as church_name,
  COUNT(CASE WHEN u.role = 'PASTOR' THEN 1 END) as pastors,
  COUNT(CASE WHEN u.role = 'ADMINISTRADOR' THEN 1 END) as administrators,
  COUNT(CASE WHEN u.role IN ('PASTOR', 'ADMINISTRADOR') AND u.is_active = true THEN 1 END) as active_leaders
FROM church c
LEFT JOIN user u ON c.id = u.church_id
GROUP BY c.id, c.name
HAVING COUNT(CASE WHEN u.role IN ('PASTOR', 'ADMINISTRADOR') AND u.is_active = true THEN 1 END) = 0
ORDER BY c.name;
```

### **Form Detection System Validation**
```typescript
// Test form type detection accuracy
const testFormDetection = {
  spiritual: {
    indicators: ['spiritual_gifts', 'ministry_passions', 'spiritual_calling'],
    expectedDetection: true
  },
  volunteer: {
    indicators: ['ministry_interest', 'availability_days', 'time_commitment'],
    expectedDetection: true
  },
  visitor: {
    indicators: ['name', 'phone', 'conociste', 'primera'],
    expectedDetection: true
  }
}

// Validate detection logic performance
SELECT 
  data->>'formTitle' as form_title,
  data->>'automationType' as detected_type,
  CASE 
    WHEN data::text LIKE '%assessmentId%' THEN 'spiritual_created'
    WHEN data::text LIKE '%volunteerId%' THEN 'volunteer_created' 
    WHEN data::text LIKE '%visitorId%' THEN 'visitor_created'
    ELSE 'no_profile_created'
  END as profile_result
FROM custom_form_submissions 
WHERE created_at >= CURRENT_DATE - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

**Critical System Checks:**
1. **Icon Protocol Compliance**: NO emojis in production UI - only lucide-react stroke-only SVG
2. **Spanish Localization**: ALL text must be Spanish (NO English violations like "Engagement")
3. **Template Uniqueness**: Each template must have unique themed icon (NO generic FileText overuse)
4. **Navigation Integrity**: Multiple paths back to templates (header + card + summary options)
5. **CRM Integration**: Visitor forms auto-create profiles when name + contact fields present
6. **NEW: Assessment Detection**: Spiritual and volunteer forms must be properly detected and processed
7. **NEW: Leadership Notifications**: All churches must have active Pastor/Administrador accounts for notifications
8. **NEW: Member Linking**: Duplicate detection must prevent member profile duplication
9. **NEW: Submit Button Customization**: Verify submitButtonText, submitButtonColor, submitButtonTextColor saved in form config
10. **NEW: Form Submission Flow**: Monitor check_ins, custom_form_submissions, visitor_follow_ups tables for data integrity
11. **NEW: QR Customization Completeness**: All 4 core options (background, dots, marker border, marker center) functional

**Form Submission Monitoring:**
```sql
-- Monitor form submissions in real-time
SELECT 
  cf.title as form_title,
  COUNT(cfs.id) as submissions_today,
  COUNT(DISTINCT cfs.data->>'visitorId') as unique_visitors,
  COUNT(vf.id) as follow_ups_created
FROM custom_forms cf
LEFT JOIN custom_form_submissions cfs ON cf.id = cfs.formId 
  AND cfs.createdAt >= CURRENT_DATE
LEFT JOIN visitor_follow_ups vf ON vf.notes LIKE '%' || cf.title || '%' 
  AND vf.createdAt >= CURRENT_DATE
GROUP BY cf.id, cf.title
ORDER BY submissions_today DESC;

-- Verify CRM integration working
SELECT 
  cfs.id as submission_id,
  cfs.data->>'formTitle' as form,
  cfs.data->>'visitorId' as visitor_created,
  ci.firstName || ' ' || ci.lastName as visitor_name,
  ci.email,
  ci.phone,
  vf.id as follow_up_created
FROM custom_form_submissions cfs
LEFT JOIN check_ins ci ON ci.id = cfs.data->>'visitorId'
LEFT JOIN visitor_follow_ups vf ON vf.checkInId = ci.id
WHERE cfs.createdAt >= NOW() - INTERVAL '24 hours'
ORDER BY cfs.createdAt DESC;

-- Monitor submit button customization usage
SELECT 
  title,
  config->>'submitButtonText' as button_text,
  config->>'submitButtonColor' as button_bg,
  config->>'submitButtonTextColor' as button_text_color,
  CASE 
    WHEN config->>'submitButtonText' IS NOT NULL THEN 'customized'
    ELSE 'default'
  END as customization_status
FROM custom_forms
WHERE createdAt >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY createdAt DESC;
```

**QR Customization Validation:**
```bash
# Test QR customization API
curl -s "https://api.khesed-tek.com/api/form-builder" | jq '.forms[] | {title, qrConfig: .qrConfig}'

# Verify all 4 core QR options present
grep -r "backgroundColor\|foregroundColor\|eyeColor\|eyeBorderColor" app/(dashboard)/form-builder/_components/branded-form-builder.tsx | wc -l
# Should return 20+ matches (interface + UI + generation logic)
```

**Submit Button Functionality Tests:**
```bash
# Verify form-viewer uses submit button config
grep -A5 "submitButtonText\|submitButtonColor\|submitButtonTextColor" app/form-viewer/_components/form-viewer.tsx

# Check saveForm includes submit button fields
grep -A10 "const saveForm" app/(dashboard)/form-builder/_components/branded-form-builder.tsx | grep "submitButton"
```

## 🔧 **TECHNICAL IMPLEMENTATION - Form Submission API**

**API Endpoint**: `/app/api/custom-form/[slug]/route.ts` (Lines 60-250)

### **POST Handler - Form Submission Flow**

**Step 1: Form Validation** (Lines 60-78)
```typescript
// Fetch form by slug
const form = await db.custom_forms.findUnique({
  where: { slug },
  include: { churches: { select: { id, name } } }
})

// Verify form exists and is active
if (!form || !form.isActive) {
  return NextResponse.json({ error: 'Formulario no encontrado' }, { status: 404 })
}
```

**Step 2: Client Information Capture** (Lines 86-89)
```typescript
const clientIp = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 'unknown'
const userAgent = request.headers.get('user-agent') || 'unknown'
```

**Step 3: Visitor Information Extraction** (Lines 92-95)
```typescript
const formData = body.data || body
const visitorInfo = extractVisitorInfo(formData)  // Smart field mapping
```

**Step 4: Create Visitor Profile** (Lines 97-111)
```typescript
const visitor = await db.check_ins.create({
  data: {
    id: nanoid(),
    firstName: visitorInfo.firstName,
    lastName: visitorInfo.lastName,
    email: visitorInfo.email,
    phone: visitorInfo.phone,
    isFirstTime: true,
    checkedInAt: new Date(),
    visitorType: 'custom_form',
    engagementScore: 85,  // High engagement for form submissions
    visitReason: `Form: ${form.title}`,
    prayerRequest: visitorInfo.prayer_requests,
    churchId: form.churchId
  }
})
```

**Step 5: Save Form Submission** (Lines 114-127)
```typescript
const submission = await db.custom_form_submissions.create({
  data: {
    id: nanoid(),
    formId: form.id,
    data: {
      ...formData,
      visitorId: visitor.id,
      submittedAt: new Date().toISOString(),
      formTitle: form.title
    },
    ipAddress: clientIp,
    userAgent,
    churchId: form.churchId
  }
})
```

**Step 6: Create Follow-Up Task** (Lines 130-146)
```typescript
await db.visitor_follow_ups.create({
  data: {
    id: nanoid(),
    checkInId: visitor.id,
    followUpType: 'custom_form_submission',
    priority: 'high',
    status: 'pending',
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),  // Next day
    notes: `Nuevo visitante desde formulario "${form.title}". 
            Email: ${visitorInfo.email || 'No proporcionado'}
            Teléfono: ${visitorInfo.phone || 'No proporcionado'}`,
    churchId: form.churchId
  }
})
```

**Step 7: Success Response** (Lines 148-156)
```typescript
return NextResponse.json({
  success: true,
  message: `¡Gracias por contactar a ${form.churches.name}!`,
  submissionId: submission.id,
  visitorId: visitor.id,
  church: form.churches.name
}, { status: 201 })
```

### **Smart Field Extraction - extractVisitorInfo()** (Lines 169-235)

**Field Mapping Logic**:
```typescript
const fieldMappings = {
  firstName: ['firstName', 'first_name', 'nombre', 'name'],
  lastName: ['lastName', 'last_name', 'apellido'],
  email: ['email', 'correo', 'correoelectronico', 'e-mail'],
  phone: ['phone', 'telefono', 'celular', 'mobile'],
  address: ['address', 'direccion'],
  interests: ['interests', 'intereses', 'ministerios'],
  prayer_requests: ['prayer_requests', 'prayer', 'oracion', 'peticion'],
  preferredContact: ['preferredContact', 'contacto_preferido']
}
```

**Case-Insensitive Search**:
- Searches form data for any matching field name
- Returns first non-null value found
- Falls back to default values if no match

**Name Fallback Logic**:
- If no firstName/lastName found, searches for generic 'name' field
- Splits full name into firstName and lastName
- Defaults to 'Visitante' if no name provided

### **Database Schema Integration**

**Tables Affected by Form Submission**:
1. `custom_forms` - Form definition and configuration
2. `custom_form_submissions` - Raw submission data with metadata
3. `check_ins` - Visitor profile (CRM integration)
4. `visitor_follow_ups` - Automated follow-up tasks
5. `churches` - Associated church information

**Data Flow Diagram**:
```
Form Submission → API Endpoint → Validation → Extract Visitor Info →
→ Create Visitor Profile (check_ins) →
→ Create Submission Record (custom_form_submissions) →
→ Create Follow-Up Task (visitor_follow_ups) →
→ Return Success Response
```

**Enterprise Compliance Monitoring:**
```typescript
// Daily compliance check protocol
const complianceChecks = {
  emojiViolations: await searchCodebase(/[\u{1F000}-\u{1F9FF}]/u),
  englishText: await searchCodebase(/engagement|social media|back to/i),
  iconDuplication: await countIconUsage('FileText'),
  navigationPaths: await validateNavigation(['header', 'cardHeader', 'summary']),
  crmIntegration: await testVisitorCreation()
}

// Alert if violations found
if (complianceChecks.emojiViolations.length > 0) {
  alert('CRITICAL: Emoji protocol violations detected')
}
```

**Deployment Verification:**
```bash
# After any form builder updates
git add . && git commit -m "Form builder updates"
git push origin main  # MANDATORY for Railway deployment

# Verify deployment success
curl -s "https://api.khesed-tek.com/health" | jq '.status'

# Test template system
curl -s "https://api.khesed-tek.com/form-builder" | jq '.templates[].icon'
```

**Troubleshooting Escalation:**
1. **Level 1**: Template/navigation issues → Check getTemplateIcon() and navigation components
2. **Level 2**: QR/URL issues → Verify slug generation and form saving process
3. **Level 3**: CRM integration failures → Check visitor detection logic and database connections
4. **Level 4**: Compliance violations → Immediate protocol review and correction required

**Enterprise Compliance Monitoring:**
```typescript
// Daily compliance check protocol
const complianceChecks = {
  emojiViolations: await searchCodebase(/[\u{1F000}-\u{1F9FF}]/u),
  englishText: await searchCodebase(/engagement|social media|back to/i),
  iconDuplication: await countIconUsage('FileText'),
  navigationPaths: await validateNavigation(['header', 'cardHeader', 'summary']),
  crmIntegration: await testVisitorCreation()
}

// Alert if violations found
if (complianceChecks.emojiViolations.length > 0) {
  alert('CRITICAL: Emoji protocol violations detected')
}
```

**Deployment Verification:**
```bash
# After any form builder updates
git add . && git commit -m "Form builder updates"
git push origin main  # MANDATORY for Railway deployment

# Verify deployment success
curl -s "https://api.khesed-tek.com/health" | jq '.status'

# Test template system
curl -s "https://api.khesed-tek.com/form-builder" | jq '.templates[].icon'
```

**Troubleshooting Escalation:**
1. **Level 1**: Template/navigation issues → Check getTemplateIcon() and navigation components
2. **Level 2**: QR/URL issues → Verify slug generation and form saving process
3. **Level 3**: CRM integration failures → Check visitor detection logic and database connections
4. **Level 4**: Compliance violations → Immediate protocol review and correction required

---

**END OF COPILOT INSTRUCTIONS v3.5**
