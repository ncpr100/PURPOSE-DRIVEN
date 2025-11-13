# Khesed-tek Church Management System - AI Assistant Instructions

**Document Version**: 2.2  
**Last Updated**: November 13, 2025  
**Project Status**: Production Active - Phase 3 Complete, Phase 4 Planning (90% Complete)  

## Project State & Current Focus

This is an **enterprise-grade church management platform** actively deployed in production with **90% overall completion** and **100% Phase 3 completion**. **Member Journey Deep Analytics** has been successfully implemented, transitioning focus to Phase 4 preparation and system optimization.

### Current Phase Status
- **Phase 1**: Core Foundation ✅ COMPLETE (Members, Events, Finance, Communication)
- **Phase 2**: Business Intelligence ✅ COMPLETE (Analytics, Reporting)  
- **Phase 3**: Advanced Analytics ✅ **100% COMPLETE** - Member Journey Deep Analytics Deployed
- **Phase 4**: AI & Mobile Apps 🔄 **PLANNING** - Target Q1 2026

## Core Architecture & Context

### Tech Stack
- **Framework**: Next.js 14 with App Router (`app/` directory structure)
- **Database**: PostgreSQL with Prisma ORM (`prisma/schema.prisma` - 2,397 lines, ~50 tables)
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
- Protected routes arrays: `PROTECTED_ROUTES` and `PROTECTED_API_ROUTES`
- Role hierarchy: `SUPER_ADMIN` → `ADMIN_IGLESIA` → `PASTOR` → `LIDER` → `MIEMBRO`
- **Never bypass middleware** - all auth/permissions must flow through it

**2. Multi-Tenant Pattern**
- Church-scoped data isolation via `churchId` foreign keys
- Platform-level routes: `/platform/*` (super admin only)
- Church-level routes: `/(dashboard)/*` (church members)
- Tenant credentials managed in `/platform/tenant-credentials`

**3. Path Aliases & Imports**
Always use `@/*` for imports:
```typescript
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { authOptions } from '@/lib/auth'
```

## Current Development Priorities (Next 2-4 Weeks)

### **PRIORITY 1: System Optimization & Scalability** (ACTIVE)
Optimizing production system for enterprise scalability:
- Performance monitoring and database optimization
- Memory management and resource optimization
- Advanced caching strategies for 1K+ church scalability
- Production monitoring and alerting systems

### **PRIORITY 2: Phase 4 Planning & Architecture**
Preparing for AI & Mobile Apps development:
- AI integration architecture design
- Mobile app technical specifications
- API optimization for mobile consumption
- Advanced analytics AI enhancement planning

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

### Data Fetching Pattern
```typescript
// Server components fetch data directly
const members = await db.member.findMany({
  where: { churchId: session.user.churchId }
})

// Client components use API routes
const response = await fetch('/api/analytics/executive-report')
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

1. **IS THIS THE RIGHT APPROACH?** - Verify the implementation strategy aligns with existing patterns
2. **WHAT ARE THE REPERCUSSIONS?** - Consider impact on existing functionality and dependencies  
3. **DO WE ALREADY HAVE THIS?** - Check for existing implementations to avoid duplication
4. **DOUBLE-CHECK THE WORK** - Validate logic and syntax before assuming correctness
5. **AM I CREATING NEW ERRORS?** - Forward-thinking approach to prevent regressions
6. **WILL WE NEED THIS LATER?** - Consider future application workflow dependencies

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

### Authentication Flow
1. User signs in via NextAuth.js (`app/api/auth/[...nextauth]/route.ts`)
2. Session includes: `id`, `role`, `churchId`, `church` object
3. Middleware validates route access on every request
4. Components access session via `useSession()` hook

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

When working on this codebase, prioritize the **system optimization and scalability** improvements, maintain the production deployment standards, and always consider the multi-tenant architecture and performance optimization requirements for Phase 4 preparation.
