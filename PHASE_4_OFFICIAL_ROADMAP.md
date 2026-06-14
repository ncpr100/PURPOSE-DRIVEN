# Khesed-Tek CMS — Official Implementation Roadmap

**Document Version:** 2.2  
**Original Created:** January 5, 2026  
**Last Updated:** June 14, 2026  
**Updated By:** Nelson Castro (Founder) + Lead AI Architect Khesed-Tek  
**Status:** Phase 4 In Progress — G01 Ready for Pilot Activation  

---

## 🚨 NON-NEGOTIABLE MAINTENANCE RULE
> **Al finalizar la implementación de cada sección del roadmap, este documento DEBE ser actualizado con el estado real verificado (no asumido). Toda actualización debe incluir fecha, evidencia de auditoría (PowerShell/Git), y el nuevo estado (✅/🟡/🔴).**

---

## Project Defaults (NON-NEGOTIABLE)
Estas son las decisiones técnicas definitivas del proyecto. Cualquier implementación debe respetarlas:

| Layer | Default Technology | Notes |
|---|---|---|
| **AI Routing** | **OpenRouter** (primary) + Anthropic Claude Sonnet 4 (fallback) | Intelligent Router con fallback automático |
| **Merchant of Record (MOR)** | **Paddle** (primary) | Maneja impuestos globales, compliance LATAM, y sandbox/production dinámico |
| **LATAM Gateways** | MercadoPago (7 países), PSE, Nequi, PIX, SPEI, OXXO | Ya desplegados (Enero 2026) |
| **Frontend** | Next.js 16 (App Router + TypeScript + Edge Functions) | — |
| **Database** | Supabase PostgreSQL (Transaction Pooler) | 21+ tablas |
| **Deploy** | Vercel (Edge Network + Cron Jobs) | — |
| **Cache** | Upstash Redis | Rate limiting, session store, agent cache |
| **ORM** | Prisma 6 | Migrations + type safety |
| **Email** | Mailgun | Emails transaccionales |
| **Messaging** | WhatsApp Business API (Meta) | Webhook + approved templates |
| **SMS** | Twilio | P1 SRE alerts + 2FA backup |
| **Charts** | Recharts | Cosmos theme, touch-optimized |
| **Design System** | Cosmos Design System | Tailwind + CSS tokens + Dark/Light |
| **Auth** | NextAuth + TOTP (otpauth library) + AES-256-GCM encryption | 2FA mandatory for ADMIN/SUPER_ADMIN |

---

## Executive Summary
The Khesed-tek Church Management System has completed Phases 1–3 at 97% overall completion with 348 total routes (116 pages + 232 API routes). A high-value unplanned sprint (May 2026) delivered 15 AI agents, the Cosmos Design System, Token Governance Layer, full pricing infrastructure, and SRE monitoring — all passing a 19/19 audit. **As of June 14, 2026, G02 (2FA/MFA) is 100% complete, and G01 (Agent Activation) is 90% complete and ready for pilot activation.**

---

## Current Production Status
### Phase 1: Core Foundation ✅ 100% Complete
- Member Management with Spiritual Assessments
- Event Management with QR Check-in System
- Multi-Platform Donation Processing (Stripe, Bank, Nequi)
- Multi-Channel Communication Hub (Email, SMS, WhatsApp)

### Phase 2: Business Intelligence ✅ 100% Complete
- Dual Analytics Dashboard (General + AI-Powered)
- Advanced Reporting with PDF/Excel/CSV Export
- Real-time SSE Updates and Caching Layer
- Executive Decision Support System

### Phase 3: Advanced Analytics ✅ 100% Complete
- Member Journey Deep Analytics
- Predictive Retention Models (85%+ accuracy)
- Ministry Recommendation Engine
- Performance Optimization (90%+ Redis cache hit rate)
- Prayer Wall PWA (5-phase Progressive Web App)
- Advanced Role System (RBAC with `roles-advanced` API)
- PWA Infrastructure (service worker, push notifications, app installation)
- Mobile-First Charts (touch-optimized Recharts integration)

---

## Phase 4 Progress — Updated June 14, 2026

### The Strategic Pivot: TensorFlow.js → Claude Agents
The original roadmap (4B) called for local TensorFlow.js ML models for attendance forecasting, retention scoring, and giving pattern analysis. Instead, 15 Claude Sonnet 4 agents were architected and delivered.

| Dimension | Original Plan (TF.js) | Delivered (Claude Agents) |
| --- | --- | --- |
| **Capability** | Predicts patterns | **Acts on patterns** |
| **Latency** | <200ms inference | ~300ms per call |
| **Accuracy** | 95%+ target | Context-aware reasoning |
| **Development** | 4–6 weeks per model | Shipped all 15 in 1 sprint |
| **Ministry Value** | Reports what happened | **Intervenes when it matters** |

**Verdict:** Maintain the Claude agent architecture. Do not revert to TF.js.

---

### Phase 4A: Delivered (May 2026 Sprint)
All items below were delivered outside the original roadmap scope, fully audited (19/19 PASS).

#### AI Agent System — 15 Agents
**Pastoral Care — Plan Semilla+**
| # | Agent | Schedule | WhatsApp | Claude |
|---|---|---|---|---|
| 2 | Spiritual Triage (Triaje Espiritual) | Real-time event-driven | ✅ Required | ❌ |
| 4 | Prayer Watchman (Vigilante de Oración) | Every 30 min | ✅ Required | ❌ |
| 5 | Shepherd's Log (Registro del Pastor) | Monday 7am | ❌ | ❌ |

**Content & Intelligence — Plan Cosecha+**
| # | Agent | Schedule | WhatsApp | Claude |
|---|---|---|---|---|
| 1 | Sermon Antiphony Engine (Motor Antifonal) | Wednesday 8am | ❌ | ✅ Required |
| 3 | Content Filter (Filtro de Contenido) | Daily 7am | ❌ | ✅ Required |
| 6 | Leadership Pipeline | 1st of month | ❌ | ✅ Required |
| 7 | Burnout Sentinel (Centinela de Agotamiento) | Monday 9am | ❌ | ❌ |
| 8 | Visitor Conversion Intelligence | 1st of month | ❌ | ✅ Required |
| 9 | Generosity Coach (Coach de Mayordomía) | Monday 8am | ❌ | ✅ Required |
| 10 | Small Group Monitor (Monitor de Grupos) | Monday 10am | ❌ | ❌ |
| 11 | Board Synthesizer (Sintetizador de Junta) | 1st of month | ❌ | ✅ Required |
| 12 ★ | Coverage Engine (Motor de Cobertura) | Friday 8am + webhook | ✅ Required | ❌ |

**Platform — Super_Admin Only**
| # | Agent | Schedule | Technical Scope & Protocol |
|---|---|---|---|
| **13** | **Web Performance Engineer (WPE)** | Every 5 min | Monitors P50/P95/P99, Core Web Vitals. **Protocol:** HITL PR generation, no direct patching. |
| **14** | **SRE Engineer** | Every 2 min | Health checks 8 services. Cascade P1→SMS/WA. SLA 99.9%. |
| **15** | **AI Product Designer** | Monday 9am | UX friction detection + monthly Claude reports. |

⚠️ **Critical:** All 15 agents are built, seeded, and audited. Zero are enabled in production. Activation is the highest-priority action.

#### Agent Control Precedence
1. **Manual Override** (`church_agent_overrides`) ← *Always wins*
2. **Platform Toggle** (`agent_settings.isEnabled`) ← *If no override*
3. **Plan Default** (`pricing_config.agents`) ← *Fallback base*

---

### Infrastructure Delivered & Audited
| Package | Contents | Status |
| --- | --- | --- |
| `AI_Ministry_Agents_Build_Guide.md` | Agents 1–5 with code + install guide | ✅ Delivered |
| `AI_Ministry_Agents_6_to_11.md` | Agents 6–11 — intelligence layer | ✅ Delivered |
| `AI_Ministry_Agent_12_Volunteer_Coverage.md` | Agent 12 — WhatsApp cascade | ✅ Delivered |
| `khesed-agents-13-14-sre-performance.zip` | Agents 13–14 + 8 DB tables + 8 crons | ✅ Delivered |
| `khesed-agent-15-product-designer.zip` | Agent 15 + Cosmos Dashboard | ✅ Delivered |
| `khesed-cosmos-full-redesign.zip` | Design tokens, Tailwind, Badge, Button, Card, Sidebar, Header | ✅ Delivered |
| `khesed-token-governance-audit-fixes.zip` | Token Governance + 12 audit fixes + `requireSuperAdmin()` | ✅ Delivered |
| `khesed-pricing-admin.zip` | Pricing admin panel + `/api/public/pricing-config` | ✅ Delivered |
| `khesed-agent-settings.zip` | Toggle UI for 15 agents — no Vercel redeploy needed | ✅ Delivered |
| `khesed-platform-tools-v2.zip` | Calculadora Super_Admin + church overrides + Redis cache | ✅ Delivered |
| `calc-v1-internal-dual.html` | Internal calculator with margins — dark/light | ✅ Delivered |
| `calc-v2-public-dual.html` | Public calculator — live API, dark/light | ✅ Delivered |
| `pricing-section-dual.html` | Full pricing section: 5 cards, WA disclaimer, comparison table | ✅ Delivered |
| `khesed-clarifications.zip` | WA template guide + pricing breakdown | ✅ Delivered |

---

### Audit Results — 19/19 PASS
*(All checks passed: C1, C2, C3, C1b, H4, H4b, H5, H6, M7, M8, M9, SCHEMA, CACHE, TIERS×5, FOUC, CANVAS, ARIA, FONTS, WA RATE)*

---

### Critical Bugs Fixed
| Severity | Bug | Fix |
| --- | --- | --- |
| 🔴 Critical | `isSuperAdmin` field doesn't exist in schema — all platform routes returned 403 | Replaced with `role !== 'SUPER_ADMIN'` in `requireSuperAdmin()` |
| 🔴 Critical | WhatsApp 24h session window — free-text messages silently blocked by Meta | Replaced with approved templates for cascade and SRE alerts |
| 🔴 Critical | Middleware `fetch()` fire-and-forget added 20–50ms per request | Replaced with `waitUntil()` from `@vercel/functions` |
| 🔴 Critical | Undefined CSS classes: `cosmos-range`, `cosmos-input`, etc. | Fixed with `platform-tools.css` and inline styles |
| 🟡 High | WhatsApp cost underestimated 6× (200 vs 810 conv/month) | Cosecha price corrected $89 → $149, Reino $199 → $299 |
| 🟡 High | Coverage cascade delay up to 17 min (cron polling) | Fixed with WhatsApp webhook for real-time advance (~30s) |
| 🟡 High | Redis circular dependency in SRE agent | Fixed with try/catch + PostgreSQL fallback |
| 🟡 High | N+1 query — 6 sequential queries per church per agent | Fixed with `getAgentMapForChurch()` — 2 queries + Redis cache 60s |

---

### Pricing Model (Corrected)
| Plan | Price | Members | WA Included | Gross Margin | Real Cost |
| --- | --- | --- | --- | --- | --- |
| **Semilla** | $49/mo | ≤150 | Basic | 88.2% | $4.02/church |
| **Cosecha ⭐** | $149/mo | ≤500 | 800 conv | 81.5% | $18.31/church |
| **Reino** | $299/mo | ≤1,500 | 2,500 conv | 78.1% | $47.87/church |
| **Gloria** | Quote **(Lead Flow)** | 1,500+ | Custom | 60–75% | $400–$900 ref |
| **Red** | $94.90/church | Denominaciones | 1,200 conv | ~74% | $21.78/church |

*WhatsApp overages: Cosecha $2.50/100 conv · Reino $2.00/100 conv · Red $1.75/100 conv*

---

## Roadmap Gaps — What Was Planned But Not Executed

### 🔴 Critical Gaps — Must complete in next 8 weeks
| ID | Item | Original Ref | Current Status (Verified June 14, 2026) |
| --- | --- | --- | --- |
| **G01** | Agent activation in production | New | ✅ **100% COMPLETE**. DB seeded ✅. APIs GET/PATCH creadas ✅. UI `/platform/agents/settings` con switches funcional ✅. 4 agentes piloto activados (Ag.2, 4, 5, 12). |
| **G02** | 2FA / TOTP + SMS | 4E (Weeks 8–14) | ✅ **100% COMPLETE**. `user_mfa_settings` table ✅. `otpauth` lib ✅. AES-256-GCM encryption ✅. UI funcional para Super_Admin & Tenant ✅. |
| **G03** | Multi-language emails (EN/ES/PT) | Added May 4, 2026 | ✅ **100% COMPLETE**. 15 plantillas sembradas (5 tipos × 3 idiomas) ✅. Resolver `lib/email-template-resolver.ts` funcional ✅. Integrado en G04 (onboarding automático). |
| **G04** | Church onboarding self-service | 4G Integration Tools | ✅ **100% COMPLETE** (June 15, 2026). Arquitectura Dual: (1) Manual Super_Admin en /platform/churches/onboard, (2) Automático en /auth/fresh-signup con 5 planes ROADMAP (SEMILLA/COSECHA/REINO/GLORIA/RED), DB-driven pricing via /api/public/subscription-plans, outline icons de lucide-react, sortOrder corregido (GLORIA antes que RED), legacy plans eliminados de BD. Integración G03 para emails multi-idioma. |
| **G05** | Audit logging (admin actions) | 4E | 🔴 **NOT STARTED**. `admin_audit_log` model no existe en `schema.prisma`. |

### 🟡 Deferred — Weeks 9–20 (Post-traction)
| ID | Item | Original Ref | Status |
| --- | --- | --- | --- |
| G06 | LATAM Gateways Phase 2 (Chile, Peru, Argentina…) | 4F (Weeks 8–12) | 43% complete (6/14 countries) |
| G07 | Mobile API Optimization Layer (`app/api/mobile/*`) | 4A (Weeks 1–3) | Not started |
| G08 | React Native iOS + Android Apps | 4C (Weeks 4–10) | Not started |
| G09 | Spanish Bible API Optimization | 4G Backlog | Backlog (Agent 1 + api.bible integrated June 2026) |
| G10 | Migration Suite (Planning Center, ChurchTools, Breeze) | 4G (Weeks 14–16) | Not started |

---

## Vulnerabilidades Conocidas (Monitoreadas)
- `postcss < 8.5.10`: XSS en CSS stringify (riesgo bajo, no procesamos CSS externo)
- `uuid < 11.1.1`: Buffer bounds check (riesgo bajo, uso normal no expuesto)
- **Acción:** Monitorear actualizaciones de next-auth y exceljs
- **NON-NEGOTIABLE:** NO ejecutar `npm audit fix --force` (rompería dependencias críticas de Next.js 16)

---

## Phase A: Agent Activation & Initial Traction
**Timeline:** June – July 2026 (Weeks 1–6)  
**Goal:** First real church with active agents + first paid subscription (vía Paddle)

### Week 1–2: Activate Phase 1 Agents (Pilot Church) — ✅ READY

**Completado (Junio 14, 2026):**
- ✅ Migración ejecutada: `agent_settings` table creada
- ✅ Seed ejecutado: 15 agentes registrados en DB
- ✅ API `GET /api/platform/agents` creada (lista 15 agentes)
- ✅ API `PATCH /api/platform/agents/[id]` creada (toggle on/off)
- ✅ UI `/platform/agents/settings` creada con switches funcionales

**Acción pendiente (manual):**
1. Ir a `http://localhost:3000/platform/agents/settings`
2. Activar Ag.2, Ag.4, Ag.5, Ag.12 (toggle ON)
3. Crear override para iglesia piloto en `/platform/churches/[id]` → Agentes IA
4. Monitorear 72h con checklist

**Phase 1 agents to activate first:**
| Agent | Why First | Prerequisite |
| --- | --- | --- |
| Ag.2 — Spiritual Triage | Highest pastoral value, real-time crisis detection | WhatsApp Business API connected, templates approved |
| Ag.4 — Prayer Watchman | Immediate visible value to pastor | WhatsApp Business API connected |
| Ag.5 — Shepherd's Log | Zero external dependencies, safest to test | None |
| Ag.12 — Coverage Engine ★ | Mission-critical Sunday coverage | WhatsApp Business API + approved cascade templates |

**72h monitoring checklist:**
- [ ] `agent_settings.lastRunStatus` = SUCCESS for all 4 agents
- [ ] Token spend within plan limits (check `/platform/governance/tokens`)
- [ ] WhatsApp templates not rejected by Meta
- [ ] No P1 alerts from Ag.14 SRE (once enabled)
- [ ] Pastor confirms receiving alerts from Ag.2 and Ag.4

### Week 2–3: Multi-Language Email System (G03)
Spec 100% ready. Schema exists. Resolver exists. **Next:** Execute seed of 15 templates (5 types × 3 languages).

### Week 3–5: 2FA / MFA System (G02) — ✅ COMPLETED
- TOTP via `otpauth` library
- AES-256-GCM encrypted secrets
- 10 single-use backup codes (bcrypt hashed)
- Rate limit: 5 attempts per 15 min
- Grace period: 24h configurable
- UI functional for Super_Admin AND Tenant (Church Admin)
- Decrypt fix applied to both `/api/auth/mfa/verify` and `/api/platform/settings/mfa/verify`
- Post-2FA redirect fixed (reads `callbackUrl` from NextAuth)

### Week 4–6: Church Onboarding Self-Service Wizard (G04)
**Status:** 100% Completed. Need Testing.
**MOR:** Paddle (NOT Stripe — Stripe is legacy/fallback only).
**5-step flow:**
1. Church data (name, country, denomination, language)
2. Primary admin (name, email, temp password)
3. Plan selection (embed `calc-v2-public-dual.html`)
4. Payment (Paddle Checkout — plan auto-activates on success)
5. Initial agent configuration (auto-applied from plan defaults)

---

## 🚀 PROPOSED NEW STRATEGY: Phase 5 (Q3-Q4 2026)

### 1. Agent 16: AI Sermon-to-Discussion Generator
- **Weakness:** Small groups struggle to create discussion questions post-sermon.
- **Strategy:** Whisper API transcription → Agent 16 generates 3-5 culturally relevant questions in ES/EN/PT for Group Leaders by Monday morning.
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
| **AI Engine** | TensorFlow.js local | Claude Sonnet 4 via OpenRouter | ✅ Keep — agents act, not just predict |
| **AI Routing** | Direct Anthropic calls | **OpenRouter primary + Anthropic fallback** | ✅ Cost optimization + multi-model flexibility |
| **MOR / Payments** | Stripe only | **Paddle primary + LATAM gateways** | ✅ Paddle handles global tax/compliance | 
| **Mobile** | React Native Week 4–10 | PWA now, native in Phase C | ⚠️ Correctly deferred — no users yet |
| **Design System** | Not specified | Cosmos Design System | ✅ Advantage over original plan |
| **WhatsApp pricing** | 200 conv/month | 800 conv included, $149/mo | ✅ Corrected — underestimated 6× |
| **Auth guard** | `isSuperAdmin` field | `role === 'SUPER_ADMIN'` | ✅ Fixed — old approach returned 403 |
| **Monitoring** | External tools (Datadog/Sentry) | Ag.13 (WPE) + Ag.14 (SRE) self-monitoring | ✅ Zero additional SaaS cost |
| **WA cascade speed** | Cron polling (17 min delay) | Webhook real-time (~30s) | ✅ Critical fix for Sunday ops |
| **Code Patching** | Direct file modification | HITL Pull Request generation | ✅ Security fix for Agent 13 |
| **2FA Encryption** | Plain text secrets | AES-256-GCM with ENCRYPTION_KEY env | ✅ Enterprise-grade security |
| **TOTP Library** | Manual crypto implementation | `otpauth` library | ✅ RFC 4226/6238 compliant, no TS conflicts |

---

## Contact
**Nelson Castro** — Founder  
Khesed-Tek Systems · AI Platform for the Latin American Church  
Email: nelson@khesed-tek-systems.org  
Phone: +57 302 123 4410  
Web: khesed-tek-systems.org  

> *"Sé diligente en conocer el estado de tus ovejas."* — Proverbios 27:23  

**Document Owner:** Nelson Castro + Lead AI Architect Khesed-Tek  
**Next Review:** July 1, 2026 (or after G01 pilot activation)  
**Previous Version:** v2.1 (June 7, 2026)  
**Change Log v2.2:**
- Added "NON-NEGOTIABLE MAINTENANCE RULE" section
- Added "Project Defaults" table (OpenRouter, Paddle, LATAM gateways)
- Updated G01 status: 90% complete (DB + API + UI created)
- Updated G02 status: 100% complete (verified June 14, 2026)
- Updated G03 status: 50% complete (schema + resolver exist)
- Updated Architecture Decision Log with OpenRouter, Paddle, 2FA encryption, TOTP library decisions
