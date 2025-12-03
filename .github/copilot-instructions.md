# Khesed-tek Church Management System - AI Assistant Instructions

**Document Version**: 2.4  
**Last Updated**: December 3, 2025  
**Project Status**: Production Active - Phase 3 Complete, Phase 4 Planning (95% Complete)  

## Project State & Current Focus

This is an **enterprise-grade church management platform** actively deployed in production with **95% overall completion** and **100% Phase 3 completion**. All **Member Journey Deep Analytics** and **Performance Optimization** systems have been successfully implemented, with focus now on Phase 4 preparation and advanced system optimization for enterprise scalability.

### Current Phase Status
- **Phase 1**: Core Foundation ✅ COMPLETE (Members, Events, Finance, Communication)
- **Phase 2**: Business Intelligence ✅ COMPLETE (Analytics, Reporting)  
- **Phase 3**: Advanced Analytics ✅ **100% COMPLETE** - Member Journey Deep Analytics & Performance Optimization Deployed
- **Phase 4**: AI & Mobile Apps 🔄 **PLANNING** - Target Q1 2026

## Core Architecture & Context

### Tech Stack
- **Framework**: Next.js 14 with App Router (`app/` directory structure)
- **Database**: PostgreSQL with Prisma ORM (`prisma/schema.prisma` - 2,794 lines, ~50 tables)
- **Authentication**: NextAuth.js with custom providers (`lib/auth.ts`)
- **UI**: Radix UI primitives + Tailwind CSS with shadcn/ui components
- **Analytics**: Dual analytics system with AI-powered insights
- **Real-time**: Server-Sent Events (SSE) + WebSocket integrations
- **External APIs**: 20+ integrations (Stripe, Twilio, Bible APIs, social media)

### Critical Production Systems (OPERATIONAL)

**1. Completed Analytics Infrastructure** ✅
- **Dual Analytics Dashboard**: `Analíticas Generales` + `Analíticas Inteligentes`
- **AI-Powered Modules**: Predictive analytics, member journey, executive reporting, recommendations
- **Real-Time Updates**: SSE integration with live dashboard updates
- **Advanced Export System**: PDF Ejecutivo, Excel Avanzado, CSV Estructurado with church branding

**2. Social Media Automation** ✅ (P1 Priority Complete)
- **8 Automation Triggers**: Post creation, publishing, campaigns, engagement monitoring
- **Platform Updates**: LinkedIn→YouTube migration, TikTok integration
- **Production Deploy**: All automation triggers deployed (feature-flag controlled)

**3. Memory Management System** ✅
- **Assessment Tools**: `lib/memory-assessment.ts`, `scripts/memory-assessment.ts`
- **Optimization**: 3.4MB storage freed, 679Mi memory optimized
- **Cleanup Scripts**: `npm run cleanup`, `npm run build:memory-optimized`

### Critical Architectural Patterns

**1. Centralized Access Control**
- `middleware.ts` is the **most important file** - controls all routing and permissions
- Protected routes arrays: `PROTECTED_ROUTES` (25+ routes) and `PROTECTED_API_ROUTES` 
- Role hierarchy: `SUPER_ADMIN` → `ADMIN_IGLESIA` → `PASTOR` → `LIDER` → `MIEMBRO`
- **Never bypass middleware** - all auth/permissions must flow through it

**2. Multi-Tenant Architecture**
- Church-scoped data isolation via `churchId` foreign keys in all models
- Platform-level routes: `/platform/*` (super admin only)
- Church-level routes: `/(dashboard)/*` (church members)
- Tenant credentials managed in `/platform/tenant-credentials`

**3. App Router Structure**
```
app/
├── (dashboard)/          # Church-scoped routes (auth required)
│   ├── analytics/        # Analíticas Generales
│   ├── intelligent-analytics/  # AI-powered analytics
│   ├── members/         # Member management
│   └── layout.tsx       # Dashboard layout wrapper
├── (platform)/         # Multi-tenant admin (super admin only)
├── api/                # API routes following REST patterns
└── auth/               # Authentication routes
```

**4. Database Patterns**
```typescript
// Always use the shared Prisma client
import { db } from '@/lib/db'

// Church-scoped queries (CRITICAL for multi-tenancy)
const churchData = await db.member.findMany({
  where: { churchId: user.churchId }
})

// Connection pooling configured for production
// Graceful shutdown on beforeExit event
```

**5. Path Aliases & Imports**
Always use `@/*` for imports:
```typescript
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { authOptions } from '@/lib/auth'
```

### Current Development Priorities (Next 2-4 Weeks)

### **PRIORITY 1: Phase 4 Architecture & Planning** (ACTIVE)
Preparing for AI & Mobile Apps development phase:
- AI integration architecture design and machine learning model planning
- Mobile app technical specifications and API optimization for mobile consumption
- Advanced analytics AI enhancement planning for predictive capabilities
- Enterprise scalability testing and stress testing for 1K+ churches
- Performance monitoring and alerting systems for production environments

### **PRIORITY 2: System Optimization & Enterprise Readiness**
Finalizing production system for maximum enterprise scalability:
- Advanced caching strategies optimization and Redis performance tuning
- Database performance monitoring and automated scaling preparations
- Memory management and resource optimization for high-traffic scenarios
- Production monitoring dashboards and comprehensive alerting systems

## Key Workflows & Commands

### Development
```bash
npm run dev                    # Start dev server (0.0.0.0:3000)
npm run build                  # Production build
npm run build:memory-optimized # Memory-optimized build (CRITICAL for production)
npx prisma db seed            # Populate database (scripts/seed.ts)
npm run cleanup               # Memory cleanup scripts (3.4MB freed)
npm run memory:assess         # Memory assessment and optimization
```

### Database Operations
```bash
npx prisma generate          # Regenerate Prisma client
npx prisma db push          # Push schema changes
npx prisma studio           # Database GUI
```

## Essential Project Patterns

### Analytics Architecture (NEWLY DEPLOYED)
```typescript
// Dual analytics system pattern
/app/(dashboard)/analytics/page.tsx        # Analíticas Generales
/app/(dashboard)/intelligent-analytics/    # Analíticas Inteligentes

// AI-powered insights API pattern
/api/analytics/executive-report           # Church health scoring
/api/analytics/predictive                # Member retention forecasting
/api/analytics/member-journey            # Conversion funnel tracking
/api/analytics/recommendations          # Strategic recommendations
```

### Component Architecture
- UI components: `/components/ui/*` (shadcn/ui based)
- Feature components: `/components/{feature}/*` (analytics, members, volunteers)
- Page components: `app/(dashboard)/{feature}/_components/*-client.tsx`
- Client components always end with `-client.tsx` for distinction

### Data Fetching Pattern
```typescript
// Server components fetch data directly
const members = await db.member.findMany({
  where: { churchId: session.user.churchId }
})

// Client components use API routes
const response = await fetch('/api/analytics/executive-report')
```

### Authentication Flow
1. User signs in via NextAuth.js (`app/api/auth/[...nextauth]/route.ts`)
2. Session includes: `id`, `role`, `churchId`, `church` object
3. Middleware validates route access on every request
4. Components access session via `useSession()` hook

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

### **DEPLOYMENT PROTOCOL** (MANDATORY)
**AFTER EVERY COMPLETED TASK**: Execute `git push` to production deployment immediately upon task completion. This ensures all updates are automatically deployed to the live production environment without delay.

### Production Deployment Standards
- **TypeScript Coverage**: 100% with zero compilation errors (ENFORCED)
- **Memory Optimization**: Use `npm run build:memory-optimized` for production
- **Railway Deployment**: All builds must pass 189/189 pages successfully
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

When working on this codebase, prioritize the **Phase 4 preparation and system optimization** improvements, maintain the production deployment standards, and always consider the multi-tenant architecture and performance optimization requirements for Phase 4 preparation.
