# Khesed-Tek CMS â€” Official Implementation Roadmap

**Document Version:** 2.3  
**Original Created:** January 5, 2026  
**Last Updated: June 25, 2026
**Updated By:** Nelson Castro (Founder) + Lead AI Architect Khesed-Tek  
**Status: Phase 4 In Progress â€” Infrastructure & Monitoring Complete

---

## ðŸš¨ NON-NEGOTIABLE MAINTENANCE RULE
> **Al finalizar la implementaciÃ³n de cada secciÃ³n del roadmap, este documento DEBE ser actualizado con el estado real verificado (no asumido). Toda actualizaciÃ³n debe incluir fecha, evidencia de auditorÃ­a (PowerShell/Git), y el nuevo estado (âœ…/ðŸŸ¡/ðŸ”´).**

---

## Project Defaults (NON-NEGOTIABLE)
Estas son las decisiones tÃ©cnicas definitivas del proyecto. Cualquier implementaciÃ³n debe respetarlas:

| Layer | Default Technology | Notes |
|---|---|---|
| **AI Routing** | **OpenRouter** (primary) + Anthropic Claude Sonnet 4 (fallback) | Intelligent Router con fallback automÃ¡tico |
| **Merchant of Record (MOR)** | **Paddle** (primary) | Maneja impuestos globales, compliance LATAM, y sandbox/production dinÃ¡mico |
| **LATAM Gateways** | MercadoPago (7 paÃ­ses), PSE, Nequi, PIX, SPEI, OXXO | Ya desplegados (Enero 2026) |
| **Frontend** | Next.js 16 (App Router + TypeScript + Edge Functions) | â€” |
| **Database** | Supabase PostgreSQL (Transaction Pooler) | 21+ tablas |
| **Deploy** | Vercel (Edge Network + Cron Jobs) | â€” |
| **Cache** | Upstash Redis | Rate limiting, session store, agent cache |
| **ORM** | Prisma 6 | Migrations + type safety |
| **Email** | Mailgun | Emails transaccionales |
| **Messaging** | WhatsApp Business API (Meta) | Webhook + approved templates |
| **SMS** | Twilio | P1 SRE alerts + 2FA backup |
| **Charts** | Recharts | Cosmos theme, touch-optimized |
| **Design System** | Cosmos Design System | Tailwind + CSS tokens + Dark/Light |
| **Auth** | NextAuth + TOTP (otpauth library) + AES-256-GCM encryption | 2FA mandatory for ADMIN/SUPER_ADMIN |

## Quality Assurance & CI/CD Automation (June 2026)

### Pre-commit Hooks (Husky + lint-staged)
Implemented lightweight validation on staged files only to prevent production regressions:
- **Trigger**: Runs automatically before every `git commit`
- **Scope**: Only files matching `*.{ts,tsx}` pattern
- **Checks**:
  - UTF-8 encoding validation (detects Mojibake characters: Ãƒ, Ã¢â‚¬, Ã‚Â¡, Ã‚Â¿)
  - Lucide-react import validation (ensures all icons used are imported)
- **Configuration**: `lint-staged` in `package.json` â†’ `scripts/validate-staged.js`
- **Husky setup**: `.husky/pre-commit` â†’ `npx lint-staged`
- **CI tolerance**: `prepare` script uses `husky || exit 0` to skip in production builds

### GitHub Actions CI/CD Gates
Automated validation on every Pull Request targeting `main`:
- **Workflow**: `.github/workflows/quality-gates.yml`
- **Trigger**: `pull_request` events to `main` branch
- **Steps**:
  1. Checkout code
  2. Setup Node.js 20
  3. Install dependencies (`npm ci`)
  4. Run CI quality gate (`node scripts/quality-gate-ci.js`) â€” scans entire codebase
  5. Run type check with 4GB heap limit (`NODE_OPTIONS="--max-old-space-size=4096"`)
  6. Run production build (`npm run build`)
- **Blocking**: PR cannot merge if any step fails

### Manual Validation Script
For on-demand full codebase validation:
- **Command**: `npm run validate`
- **Script**: `scripts/validate-all.js`
- **Scope**: Scans `app/`, `components/`, `lib/` directories
- **Checks**: Same as CI gate (encoding + imports)
- **Use case**: Pre-merge verification before creating PR

### Zero-Tolerance Policy
All three validation layers must pass before code reaches production:
1. âœ… Pre-commit hook (local)
2. âœ… CI gate (GitHub Actions)
3. âœ… Manual validation (optional, for confidence)

### Files Created
scripts/
â”œâ”€â”€ validate-staged.js # Pre-commit hook validation
â”œâ”€â”€ validate-all.js # Manual full codebase scan
â””â”€â”€ quality-gate-ci.js # CI/CD pipeline validation
.husky/
â””â”€â”€ pre-commit # Husky hook â†’ runs lint-staged
.github/workflows/
â””â”€â”€ quality-gates.yml # GitHub Actions workflow


### Prevention Results
This system prevents the following production issues:
- Missing icon imports (e.g., `Cpu is not defined` error)
- UTF-8 encoding corruption (Mojibake in Spanish text)
- Type errors that crash the application
- Build failures that block deployment

---

## Executive Summary
The Khesed-tek Church Management System has completed Phases 1â€“3 at 97% overall completion with 348 total routes (116 pages + 232 API routes). A high-value unplanned sprint (May 2026) delivered 15 AI agents, the Cosmos Design System, Token Governance Layer, full pricing infrastructure, and SRE monitoring â€” all passing a 19/19 audit. **As of June 25, 2026, G02 (2FA/MFA) is 100% complete, G03 (Multi-language emails) is 100% complete with professional templates in ES/EN/PT, Ag.5 and Ag.7 cron jobs enabled, G04 (Church onboarding) is 100% complete, and G01 (Agent Activation) is progressing with 3 agents active in production (Ag.5, Ag.7, Ag.14) and platform status HEALTHY.**

---


## June 23, 2026 Achievements â€” Infrastructure & Monitoring Sprint
### Email Service Migration
- **Migrated from Mailgun to Resend**: Complete replacement of email service provider
- Created lib/integrations/resend.ts with full email service implementation
- Updated all dashboard references and integration status endpoints
- Resend now HEALTHY and operational (191ms response time)
### WhatsApp Business API
- **Permanent Token Configured**: Generated 60-day token from Meta Business Suite
- Resolved HTTP 401 authentication errors
- WhatsApp Business API now HEALTHY (469ms response time)
- Ready for Phase 1 agent activation (Ag.2, Ag.4, Ag.12)
### SRE Health Check Expansion
- **Expanded from 8 to 11 monitored services**:
  - Added checkVercel() function for Vercel API monitoring
  - Added checkSupabase() function for Supabase API monitoring
  - Removed MercadoPago from platform health checks (correctly identified as tenant-level gateway)
- All 11 services now monitored in real-time via /api/cron/sre-health-check
### Dashboard Updates
- Updated SRE Dashboard (sre-dashboard.tsx) to display all 11 services
- Added Vercel API and Supabase API to service configuration
- Removed MercadoPago from monitoring (tenant-level, not platform-level)
### Current System Status
- HEALTHY: 8 services (database, redis, production_url, paddle, resend, twilio, whatsapp, openrouter)
- DEGRADED: 1 service (supabase_api - 1772ms latency, expected on free plan)
- UNKNOWN: 2 services (stripe, vercel_api - not configured)
- DOWN: 0 services
### Technical Debt Resolved
- Fixed Prisma client corruption issues (EPERM errors)
- Cleaned up all Mailgun references across codebase
- Updated tech stack documentation to reflect Resend as primary email service
- Verified all builds pass without errors
### Next Steps
- Merge changes to main branch
- Activate Phase 1 agents (Ag.2, Ag.4, Ag.5, Ag.12) with pilot church
- Configure VERCEL_API_TOKEN for complete infrastructure monitoring
- Consider Supabase plan upgrade if latency impacts user experience
## Current Production Status
### Phase 1: Core Foundation âœ… 100% Complete
- Member Management with Spiritual Assessments
- Event Management with QR Check-in System
- Multi-Platform Donation Processing (Stripe, Bank, Nequi)
- Multi-Channel Communication Hub (Email, SMS, WhatsApp)

### Phase 2: Business Intelligence âœ… 100% Complete
- Dual Analytics Dashboard (General + AI-Powered)
- Advanced Reporting with PDF/Excel/CSV Export
- Real-time SSE Updates and Caching Layer
- Executive Decision Support System

### Phase 3: Advanced Analytics âœ… 100% Complete
- Member Journey Deep Analytics
- Predictive Retention Models (85%+ accuracy)
- Ministry Recommendation Engine
- Performance Optimization (90%+ Redis cache hit rate)
- Prayer Wall PWA (5-phase Progressive Web App)
- Advanced Role System (RBAC with `roles-advanced` API)
- PWA Infrastructure (service worker, push notifications, app installation)
- Mobile-First Charts (touch-optimized Recharts integration)

---

## Phase 4 Progress â€” Updated June 14, 2026

### The Strategic Pivot: TensorFlow.js â†’ Claude Agents
The original roadmap (4B) called for local TensorFlow.js ML models for attendance forecasting, retention scoring, and giving pattern analysis. Instead, 15 Claude Sonnet 4 agents were architected and delivered.

| Dimension | Original Plan (TF.js) | Delivered (Claude Agents) |
| --- | --- | --- |
| **Capability** | Predicts patterns | **Acts on patterns** |
| **Latency** | <200ms inference | ~300ms per call |
| **Accuracy** | 95%+ target | Context-aware reasoning |
| **Development** | 4â€“6 weeks per model | Shipped all 15 in 1 sprint |
| **Ministry Value** | Reports what happened | **Intervenes when it matters** |

**Verdict:** Maintain the Claude agent architecture. Do not revert to TF.js.

---

### Phase 4A: Delivered (May 2026 Sprint)
All items below were delivered outside the original roadmap scope, fully audited (19/19 PASS).

#### AI Agent System â€” 15 Agents
**Pastoral Care â€” Plan Semilla+**
| # | Agent | Schedule | WhatsApp | Claude | Status |
|---|---|---|---|---|---|
| 2 | Spiritual Triage (Triaje Espiritual) | Real-time event-driven | âœ… Required | âŒ | â³ Pending WA approval |
| 4 | Prayer Watchman (Vigilante de OraciÃ³n) | Every 30 min | âœ… Required | âŒ | â³ Pending WA approval |
| 5 | Shepherd's Log (Registro del Pastor) | Monday 6am UTC | âŒ | âŒ | âœ… **ACTIVE** (June 20, 2026) |

**Content & Intelligence â€” Plan Cosecha+**
| # | Agent | Schedule | WhatsApp | Claude |
|---|---|---|---|---|
| 1 | Sermon Antiphony Engine (Motor Antifonal) | Wednesday 8am | âŒ | âœ… Required |
| 3 | Content Filter (Filtro de Contenido) | Daily 7am | âŒ | âœ… Required |
| 6 | Leadership Pipeline | 1st of month | âŒ | âœ… Required |
| 7 | Burnout Sentinel (Centinela de Agotamiento) | Monday 9am UTC | âŒ | âŒ | âœ… **ACTIVE** (June 20, 2026) |
| 8 | Visitor Conversion Intelligence | 1st of month | âŒ | âœ… Required |
| 9 | Generosity Coach (Coach de MayordomÃ­a) | Monday 8am | âŒ | âœ… Required |
| 10 | Small Group Monitor (Monitor de Grupos) | Monday 10am | âŒ | âŒ |
| 11 | Board Synthesizer (Sintetizador de Junta) | 1st of month | âŒ | âœ… Required |
| 12 â˜… | Coverage Engine (Motor de Cobertura) | Friday 8am + webhook | âœ… Required | âŒ |

**Platform â€” Super_Admin Only**
| # | Agent | Schedule | Technical Scope & Protocol | Status |
|---|---|---|---|---|
| **13** | **Web Performance Engineer (WPE)** | Every 5 min | Monitors P50/P95/P99, Core Web Vitals. **Protocol:** HITL PR generation, no direct patching. | â³ Not activated |
| **14** | **SRE Engineer** | Every 5 min | Health checks 8 services. Cascade P1â†’SMS/WA. SLA 99.9%. | âœ… **ACTIVE** (June 20, 2026) |
| **15** | **AI Product Designer** | Monday 9am | UX friction detection + monthly Claude reports. | â³ Not activated |

âš ï¸ **Critical:** All 15 agents are built, seeded, and audited. Zero are enabled in production. Activation is the highest-priority action.

#### Agent Control Precedence
1. **Manual Override** (`church_agent_overrides`) â† *Always wins*
2. **Platform Toggle** (`agent_settings.isEnabled`) â† *If no override*
3. **Plan Default** (`pricing_config.agents`) â† *Fallback base*

---

### Infrastructure Delivered & Audited
| Package | Contents | Status |
| --- | --- | --- |
| `AI_Ministry_Agents_Build_Guide.md` | Agents 1â€“5 with code + install guide | âœ… Delivered |
| `AI_Ministry_Agents_6_to_11.md` | Agents 6â€“11 â€” intelligence layer | âœ… Delivered |
| `AI_Ministry_Agent_12_Volunteer_Coverage.md` | Agent 12 â€” WhatsApp cascade | âœ… Delivered |
| `khesed-agents-13-14-sre-performance.zip` | Agents 13â€“14 + 8 DB tables + 8 crons | âœ… Delivered |
| `khesed-agent-15-product-designer.zip` | Agent 15 + Cosmos Dashboard | âœ… Delivered |
| `khesed-cosmos-full-redesign.zip` | Design tokens, Tailwind, Badge, Button, Card, Sidebar, Header | âœ… Delivered |
| `khesed-token-governance-audit-fixes.zip` | Token Governance + 12 audit fixes + `requireSuperAdmin()` | âœ… Delivered |
| `khesed-pricing-admin.zip` | Pricing admin panel + `/api/public/pricing-config` | âœ… Delivered |
| `khesed-agent-settings.zip` | Toggle UI for 15 agents â€” no Vercel redeploy needed | âœ… Delivered |
| `khesed-platform-tools-v2.zip` | Calculadora Super_Admin + church overrides + Redis cache | âœ… Delivered |
| `calc-v1-internal-dual.html` | Internal calculator with margins â€” dark/light | âœ… Delivered |
| `calc-v2-public-dual.html` | Public calculator â€” live API, dark/light | âœ… Delivered |
| `pricing-section-dual.html` | Full pricing section: 5 cards, WA disclaimer, comparison table | âœ… Delivered |
| `khesed-clarifications.zip` | WA template guide + pricing breakdown | âœ… Delivered |

---

### Audit Results â€” 19/19 PASS
*(All checks passed: C1, C2, C3, C1b, H4, H4b, H5, H6, M7, M8, M9, SCHEMA, CACHE, TIERSÃ—5, FOUC, CANVAS, ARIA, FONTS, WA RATE)*

---

### Critical Bugs Fixed
| Severity | Bug | Fix |
| --- | --- | --- |
| ðŸ”´ Critical | `isSuperAdmin` field doesn't exist in schema â€” all platform routes returned 403 | Replaced with `role !== 'SUPER_ADMIN'` in `requireSuperAdmin()` |
| ðŸ”´ Critical | WhatsApp 24h session window â€” free-text messages silently blocked by Meta | Replaced with approved templates for cascade and SRE alerts |
| ðŸ”´ Critical | Middleware `fetch()` fire-and-forget added 20â€“50ms per request | Replaced with `waitUntil()` from `@vercel/functions` |
| ðŸ”´ Critical | Undefined CSS classes: `cosmos-range`, `cosmos-input`, etc. | Fixed with `platform-tools.css` and inline styles |
| ðŸŸ¡ High | WhatsApp cost underestimated 6Ã— (200 vs 810 conv/month) | Cosecha price corrected $89 â†’ $149, Reino $199 â†’ $299 |
| ðŸŸ¡ High | Coverage cascade delay up to 17 min (cron polling) | Fixed with WhatsApp webhook for real-time advance (~30s) |
| ðŸŸ¡ High | Redis circular dependency in SRE agent | Fixed with try/catch + PostgreSQL fallback |
| ðŸŸ¡ High | N+1 query â€” 6 sequential queries per church per agent | Fixed with `getAgentMapForChurch()` â€” 2 queries + Redis cache 60s |
| ðŸŸ¢ Fixed | Mailgun â†’ Resend migration | Replaced Mailgun with Resend across entire codebase. Created new integration service, updated health checks, dashboard, and all references. |


---

### Pricing Model (Corrected)
| Plan | Price | Members | WA Included | Gross Margin | Real Cost |
| --- | --- | --- | --- | --- | --- |
| **Semilla** | $49/mo | â‰¤150 | Basic | 88.2% | $4.02/church |
| **Cosecha â­** | $149/mo | â‰¤500 | 800 conv | 81.5% | $18.31/church |
| **Reino** | $299/mo | â‰¤1,500 | 2,500 conv | 78.1% | $47.87/church |
| **Gloria** | Quote **(Lead Flow)** | 1,500+ | Custom | 60â€“75% | $400â€“$900 ref |
| **Red** | $94.90/church | Denominaciones | 1,200 conv | ~74% | $21.78/church |

*WhatsApp overages: Cosecha $2.50/100 conv Â· Reino $2.00/100 conv Â· Red $1.75/100 conv*

---

## Roadmap Gaps â€” What Was Planned But Not Executed

### ðŸ”´ Critical Gaps â€” Must complete in next 8 weeks
| ID | Item | Original Ref | Current Status (Verified June 14, 2026) |
| --- | --- | --- | --- |
| **G01** | Agent activation in production | New | ðŸŸ¡ **IN PROGRESS (75%)**. DB seeded âœ…. APIs GET/PATCH creadas âœ…. UI `/platform/agents/settings` con switches funcional âœ…. **3 agentes activos en producciÃ³n**: Ag.5 (Shepherd's Log, lunes 6AM UTC), Ag.7 (Burnout Sentinel, lunes 9AM UTC), Ag.14 (SRE Engineer, cada 5 min). Ag.2, 4, 12 pendientes de aprobaciÃ³n de plantillas WhatsApp por Meta. |
| **G02** | 2FA / TOTP + SMS | 4E (Weeks 8â€“14) | âœ… **100% COMPLETE**. `user_mfa_settings` table âœ…. `otpauth` lib âœ…. AES-256-GCM encryption âœ…. UI funcional para Super_Admin & Tenant âœ…. |
| **G03** | Multi-language emails (EN/ES/PT) | Added May 4, 2026 | âœ… **100% COMPLETE** (verified June 20, 2026). 15 plantillas sembradas (5 tipos Ã— 3 idiomas) âœ…. Resolver `lib/email-template-resolver.ts` funcional âœ…. Integrado en G04 (onboarding automÃ¡tico). |
| **G04** | Church onboarding self-service | 4G Integration Tools | âœ… **100% COMPLETE** (June 15, 2026). Arquitectura Dual: (1) Manual Super_Admin en /platform/churches/onboard, (2) AutomÃ¡tico en /auth/fresh-signup con 5 planes ROADMAP (SEMILLA/COSECHA/REINO/GLORIA/RED), DB-driven pricing via /api/public/subscription-plans, outline icons de lucide-react, sortOrder corregido (GLORIA antes que RED), legacy plans eliminados de BD. IntegraciÃ³n G03 para emails multi-idioma. |
| **G05** | Audit logging (admin actions) | 4E | ðŸ”´ **NOT STARTED**. `admin_audit_log` model no existe en `schema.prisma`. |

### ðŸŸ¡ Deferred â€” Weeks 9â€“20 (Post-traction)
| ID | Item | Original Ref | Status |
| --- | --- | --- | --- |
| G06 | LATAM Gateways Phase 2 (Chile, Peru, Argentinaâ€¦) | 4F (Weeks 8â€“12) | 43% complete (6/14 countries) |
| G07 | Mobile API Optimization Layer (`app/api/mobile/*`) | 4A (Weeks 1â€“3) | Not started |
| G08 | React Native iOS + Android Apps | 4C (Weeks 4â€“10) | Not started |
| G09 | Spanish Bible API Optimization | 4G Backlog | Backlog (Agent 1 + api.bible integrated June 2026) |
| G10 | Migration Suite (Planning Center, ChurchTools, Breeze) | 4G (Weeks 14â€“16) | Not started |

---

## Vulnerabilidades Conocidas (Monitoreadas)
- `postcss < 8.5.10`: XSS en CSS stringify (riesgo bajo, no procesamos CSS externo)
- `uuid < 11.1.1`: Buffer bounds check (riesgo bajo, uso normal no expuesto)
- **AcciÃ³n:** Monitorear actualizaciones de next-auth y exceljs
- **NON-NEGOTIABLE:** NO ejecutar `npm audit fix --force` (romperÃ­a dependencias crÃ­ticas de Next.js 16)

---

## Phase A: Agent Activation & Initial Traction
**Timeline:** June â€“ July 2026 (Weeks 1â€“6)  
**Goal:** First real church with active agents + first paid subscription (vÃ­a Paddle)

### Week 1â€“2: Activate Phase 1 Agents (Pilot Church) â€” âœ… READY

**Completado (Junio 14, 2026):**
- âœ… MigraciÃ³n ejecutada: `agent_settings` table creada
- âœ… Seed ejecutado: 15 agentes registrados en DB
- âœ… API `GET /api/platform/agents` creada (lista 15 agentes)
- âœ… API `PATCH /api/platform/agents/[id]` creada (toggle on/off)
- âœ… UI `/platform/agents/settings` creada con switches funcionales

**AcciÃ³n pendiente (manual):**
1. Ir a `http://localhost:3000/platform/agents/settings`
2. Activar Ag.2, Ag.4, Ag.5, Ag.12 (toggle ON)
3. Crear override para iglesia piloto en `/platform/churches/[id]` â†’ Agentes IA
4. Monitorear 72h con checklist

**Phase 1 agents to activate first:**
| Agent | Why First | Prerequisite |
| --- | --- | --- |
| Ag.2 â€” Spiritual Triage | Highest pastoral value, real-time crisis detection | WhatsApp Business API connected, templates approved |
| Ag.4 â€” Prayer Watchman | Immediate visible value to pastor | WhatsApp Business API connected |
| Ag.5 â€” Shepherd's Log | Zero external dependencies, safest to test | None |
| Ag.12 â€” Coverage Engine â˜… | Mission-critical Sunday coverage | WhatsApp Business API + approved cascade templates |

**72h monitoring checklist:**
- [x] âœ… Ag.5 `lastRunStatus` = SUCCESS (verificado June 20, 2026)
- [x] âœ… Ag.7 `lastRunStatus` = SUCCESS (verificado June 20, 2026)
- [x] âœ… Ag.14 `lastRunStatus` = SUCCESS (verificado June 20, 2026)
- [x] âœ… Token spend within plan limits (check `/platform/governance/tokens`)
- [x] âœ… No P1 alerts from Ag.14 SRE (overallStatus: Phase 4 In Progress â€” Infrastructure & Monitoring Complete
- [ ] WhatsApp templates not rejected by Meta (pendiente de aprobaciÃ³n)
- [ ] Pastor confirms receiving alerts from Ag.2 and Ag.4 (pendiente de activaciÃ³n WA)

### Week 2â€“3: Multi-Language Email System (G03)
Spec 100% ready. Schema exists. Resolver exists. **Next:** Execute seed of 15 templates (5 types Ã— 3 languages).

### Week 3â€“5: 2FA / MFA System (G02) â€” âœ… COMPLETED
- TOTP via `otpauth` library
- AES-256-GCM encrypted secrets
- 10 single-use backup codes (bcrypt hashed)
- Rate limit: 5 attempts per 15 min
- Grace period: 24h configurable
- UI functional for Super_Admin AND Tenant (Church Admin)
- Decrypt fix applied to both `/api/auth/mfa/verify` and `/api/platform/settings/mfa/verify`
- Post-2FA redirect fixed (reads `callbackUrl` from NextAuth)

### Week 4â€“6: Church Onboarding Self-Service Wizard (G04)
**Status: Phase 4 In Progress â€” Infrastructure & Monitoring Complete
**MOR:** Paddle (NOT Stripe â€” Stripe is legacy/fallback only).
**5-step flow:**
1. Church data (name, country, denomination, language)
2. Primary admin (name, email, temp password)
3. Plan selection (embed `calc-v2-public-dual.html`)
4. Payment (Paddle Checkout â€” plan auto-activates on success)
5. Initial agent configuration (auto-applied from plan defaults)

---

### Architecture Decision: Prisma 6.x to 7.x Migration (Deferred)
| Decision | Original Plan | Current | Verdict |
| --- | --- | --- | --- |
| ORM Version | Upgrade to Prisma 7.x in Phase 4 | Maintain Prisma 6.7.0 through Phase A & B | âœ… **Deferred to Phase C / Tech Debt Sprint** |

**Rationale:**  
Prisma 7 introduces critical breaking changes (removal of `url` in `schema.prisma`, mandatory `prisma.config.ts`, and `PrismaClient` constructor changes). Implementing this now would require 18â€“28 hours of refactoring and testing, diverting focus from the critical Phase A goal: Agent Activation and first paid subscriptions. Prisma 6.7.0 is stable, fully functional, and successfully builds all 149/149 pages.

**Future Implementation Plan (When triggered in Phase C):**
1. **Configuration:** Create `prisma.config.ts` to handle `DATABASE_URL` and Accelerate connections.
2. **Schema Cleanup:** Remove the `url` property from all `datasource` blocks in `schema.prisma`.
3. **Client Update:** Refactor all `new PrismaClient()` instantiations across ~232 API routes to use the new adapter/config pattern.
4. **Testing:** Execute comprehensive migration tests in a staging environment with production data snapshots.
5. **CI/CD:** Update GitHub Actions and Vercel build scripts to use `prisma@latest` without version pinning.

## ðŸš€ PROPOSED NEW STRATEGY: Phase 5 (Q3-Q4 2026)

### 1. Agent 16: AI Sermon-to-Discussion Generator
- **Weakness:** Small groups struggle to create discussion questions post-sermon.
- **Strategy:** Whisper API transcription â†’ Agent 16 generates 3-5 culturally relevant questions in ES/EN/PT for Group Leaders by Monday morning.
- **Value:** Boosts Ag.10 (Small Group Monitor) health metrics.

### 2. Automated Tithing & Donation Reconciliation Engine
- **Weakness:** Manual matching of PSE/SPEI/Webpay transfers to member records.
- **Strategy:** AI matching agent cross-references bank references, amounts, dates with giving patterns (95%+ confidence).
- **Value:** Reduces admin time by 90%.

### 3. "Red" Denomination Hub Enhancement
- **Weakness:** Red plan ($84.90/church) needs stronger centralized value.
- **Strategy:** Unified Denomination Dashboard with aggregated, anonymized health metrics across subordinate churches.
- **Value:** Enterprise-grade tenant isolation + network-level insights.

### 4. Offline-First PWA Aggressive Caching (Rural LATAM)
- **Weakness:** Native apps (Phase C) are months away; rural pastors need mobile access now.
- **Strategy:** Service Worker strategies (Stale-While-Revalidate) + IndexedDB for 3G connectivity.
- **Value:** Immediate mobile reliability without native apps.

---

## Architecture Decision Log (Updated June 14, 2026)
| Decision | Original Plan | Current | Verdict |
| --- | --- | --- | --- |
| **AI Engine** | TensorFlow.js local | Claude Sonnet 4 via OpenRouter | âœ… Keep â€” agents act, not just predict |
| **AI Routing** | Direct Anthropic calls | **OpenRouter primary + Anthropic fallback** | âœ… Cost optimization + multi-model flexibility |
| **MOR / Payments** | Stripe only | **Paddle primary + LATAM gateways** | âœ… Paddle handles global tax/compliance | 
| **Mobile** | React Native Week 4â€“10 | PWA now, native in Phase C | âš ï¸ Correctly deferred â€” no users yet |
| **Design System** | Not specified | Cosmos Design System | âœ… Advantage over original plan |
| **WhatsApp pricing** | 200 conv/month | 800 conv included, $149/mo | âœ… Corrected â€” underestimated 6Ã— |
| **Auth guard** | `isSuperAdmin` field | `role === 'SUPER_ADMIN'` | âœ… Fixed â€” old approach returned 403 |
| **Monitoring** | External tools (Datadog/Sentry) | Ag.13 (WPE) + Ag.14 (SRE) self-monitoring | âœ… Zero additional SaaS cost |
| **WA cascade speed** | Cron polling (17 min delay) | Webhook real-time (~30s) | âœ… Critical fix for Sunday ops |
| **Code Patching** | Direct file modification | HITL Pull Request generation | âœ… Security fix for Agent 13 |
| **2FA Encryption** | Plain text secrets | AES-256-GCM with ENCRYPTION_KEY env | âœ… Enterprise-grade security |
| **TOTP Library** | Manual crypto implementation | `otpauth` library | âœ… RFC 4226/6238 compliant, no TS conflicts |

---

# Leer el contenido actual
$content = Get-Content ROADMAP.md -Raw

# Definir la nueva secciÃ³n
$newSection = @"

### Architecture Decision: Prisma 6.x to 7.x Migration (Deferred)
| Decision | Original Plan | Current | Verdict |
| --- | --- | --- | --- |
| ORM Version | Upgrade to Prisma 7.x in Phase 4 | Maintain Prisma 6.7.0 through Phase A & B | âœ… **Deferred to Phase C / Tech Debt Sprint** |

**Rationale:**  
Prisma 7 introduces critical breaking changes (removal of ``url`` in ``schema.prisma``, mandatory ``prisma.config.ts``, and ``PrismaClient`` constructor changes). Implementing this now would require 18â€“28 hours of refactoring and testing, diverting focus from the critical Phase A goal: Agent Activation and first paid subscriptions. Prisma 6.7.0 is stable, fully functional, and successfully builds all 149/149 pages.

**Future Implementation Plan (When triggered in Phase C):**
1. **Configuration:** Create ``prisma.config.ts`` to handle ``DATABASE_URL`` and Accelerate connections.
2. **Schema Cleanup:** Remove the ``url`` property from all ``datasource`` blocks in ``schema.prisma``.
3. **Client Update:** Refactor all ``new PrismaClient()`` instantiations across ~232 API routes to use the new adapter/config pattern.
4. **Testing:** Execute comprehensive migration tests in a staging environment with production data snapshots.
5. **CI/CD:** Update GitHub Actions and Vercel build scripts to use ``prisma@latest`` without version pinning.

**Trigger Conditions:**
- Phase A completed (first church with active agents)
- 10+ churches active in production
- Dedicated 2-3 week tech debt sprint scheduled
- Staging environment with production data snapshot available

"@

# Insertar antes de la secciÃ³n "Contact"
$contactPattern = "## Contact"
if ($content -match $contactPattern) {
    $newContent = $content -replace $contactPattern, ($newSection + "`n" + $contactPattern)
    Set-Content ROADMAP.md -Value $newContent -NoNewline
    Write-Host "âœ… SecciÃ³n de decisiÃ³n de Prisma 7 agregada al ROADMAP.md"
} else {
    Write-Host "âš ï¸ No se encontrÃ³ la secciÃ³n 'Contact'. Agregando al final del archivo..."
    Add-Content ROADMAP.md -Value $newSection
    Write-Host "âœ… SecciÃ³n agregada al final del archivo"
}

## Contact
**Nelson Castro** â€” Founder  
Khesed-Tek Systems Â· AI Platform for the Latin American Church  
Email: nelson@khesed-tek-systems.org  
Phone: +57 302 123 4410  
Web: khesed-tek-systems.org  

> *"SÃ© diligente en conocer el estado de tus ovejas."* â€” Proverbios 27:23  

**Document Owner:** Nelson Castro + Lead AI Architect Khesed-Tek  
**Next Review:** June 27, 2026 (or after WhatsApp template approval)  
**Previous Version:** v2.2 (June 14, 2026)  
**Change Log v2.3 (June 20, 2026):**
- Updated G01 status: 75% complete (3 agents active in production)
- Updated G03 status: 100% complete (verified June 20, 2026)
- Added Ag.5 Shepherd's Log activation (cron lunes 6:00 AM UTC)
- Added Ag.7 Burnout Sentinel activation (cron lunes 9:00 AM UTC)
- Added Ag.14 SRE Engineer activation (cron cada 5 min)
- Added infrastructure optimizations: health check thresholds adjusted for free tier
- Added incident resolution: Incident #2 and #3 closed manually
- Added code cleanup: AbacusAI rule removed from INCIDENT_RULES
- Added Paddle API configuration fix (v2 API key in Vercel Production)
- Updated platform status: âœ… HEALTHY (all services operational)
**Change Log v2.2:**
- Added "NON-NEGOTIABLE MAINTENANCE RULE" section
- Added "Project Defaults" table (OpenRouter, Paddle, LATAM gateways)
- Updated G01 status: 90% complete (DB + API + UI created)
- Updated G02 status: 100% complete (verified June 14, 2026)
- Updated G03 status: 50% complete (schema + resolver exist)
- Updated Architecture Decision Log with OpenRouter, Paddle, 2FA encryption, TOTP library decisions


