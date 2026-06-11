# Khesed-Tek CMS — Official Implementation Roadmap
**Document Version:** 2.1  
**Original Created:** January 5, 2026  
**Last Updated:** June 5, 2026  
**Updated By:** Technical Architecture Team + Claude Sonnet 4.6 (Anthropic)  
**Status:** Phase 4 In Progress — Agent Activation Sprint  

---

## Executive Summary
The Khesed-tek Church Management System has completed Phases 1–3 at 97% overall completion with 348 total routes (116 pages + 232 API routes). A high-value unplanned sprint (May 2026) delivered 15 AI agents, the Cosmos Design System, Token Governance Layer, full pricing infrastructure, and SRE monitoring — all passing a 19/19 audit. The critical next step is activating agents in production with a pilot church.

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

## Phase 4 Progress — Updated June 2026
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
| **13** | **Web Performance Engineer (WPE)** | Every 5 min | Monitors P50/P95/P99, Core Web Vitals (LCP, TTFB), Supabase N+1 queries. **Protocol:** Generates PRs with HITL validation. No direct patching. Halts if mobile perf degrades >5%. |
| **14** | **SRE Engineer** | Every 2 min | Health checks on 8 services. Cascade alerts P1→SMS/WA. Auto post-mortems with Claude. SLA 99.9% guarantee. |
| **15** | **AI Product Designer** | Monday 9am | Analyzes usage patterns, detects UX friction, generates monthly product improvement reports via Claude. |

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
| **Gloria** | Quote | 1,500+ | Custom | 60–75% | $400–$900 ref |
| **Red** | $84.90/church | Denominaciones | 1,200 conv | ~74% | $21.78/church |

*WhatsApp overages: Cosecha $2.50/100 conv · Reino $2.00/100 conv · Red $1.75/100 conv*

---

## Roadmap Gaps — What Was Planned But Not Executed
### 🔴 Critical Gaps — Must complete in next 8 weeks
| ID | Item | Original Ref | Notes |
| --- | --- | --- | --- |
| G01 | Agent activation in production | New | All code exists. Zero agents enabled. Week 1 action. |
| G02 | 2FA / TOTP + SMS | 4E (Weeks 8–14) | Enterprise blocker. TOTP + Twilio SMS. |
| G03 | Multi-language emails (EN/ES/PT) | Added May 4, 2026 | Spec 100% ready. Low effort to implement. |
| G04 | Church onboarding self-service | 4G Integration Tools | Without this, every church requires manual setup. |
| G05 | Audit logging (admin actions) | 4E | Compliance requirement for enterprise clients. |

### 🟡 Deferred — Weeks 9–20 (Post-traction)
| ID | Item | Original Ref | Status |
| --- | --- | --- | --- |
| G06 | LATAM Gateways Phase 2 (Chile, Peru, Argentina…) | 4F (Weeks 8–12) | 43% complete (6/14 countries) |
| G07 | Mobile API Optimization Layer (`app/api/mobile/*`) | 4A (Weeks 1–3) | Not started |
| G08 | React Native iOS + Android Apps | 4C (Weeks 4–10) | Not started |
| G09 | Spanish Bible API Optimization | 4G Backlog | Backlog |
| G10 | Migration Suite (Planning Center, ChurchTools, Breeze) | 4G (Weeks 14–16) | Not started |

## Vulnerabilidades Conocidas (Monitoreadas)
- postcss < 8.5.10: XSS en CSS stringify (riesgo bajo, no procesamos CSS externo)
- uuid < 11.1.1: Buffer bounds check (riesgo bajo, uso normal no expuesto)
- Acción: Monitorear actualizaciones de next-auth y exceljs
- NO ejecutar `npm audit fix --force` (rompería dependencias críticas)

---

## Phase A: Agent Activation & Initial Traction
**Timeline:** June – July 2026 (Weeks 1–6)  
**Goal:** First real church with active agents + first paid subscription  

### Week 1–2: Activate Phase 1 Agents (Pilot Church)
1. Run migration: `npx prisma migrate dev --name add_agent_settings`
2. Seed all 15 agents (all disabled by default): `npx ts-node prisma/seeds/agent-settings.ts`
3. Enable Phase 1 agents via UI: `/platform/agents/settings` → Enable Ag.2, Ag.4, Ag.5, Ag.12
4. Create church override for pilot church: `/platform/churches/[id]` → Agentes IA → Override

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

*(Weeks 2-6 details for Multi-Language Email, 2FA/MFA, and Onboarding Wizard remain as defined in v2.0)*

---

## 🚀 PROPOSED NEW STRATEGY: Phase 5 (Q3-Q4 2026)
*Based on the mandatory [PLAN, ANALYZE, LOOK FOR WEAKNESSES, RE-ANALYZE] loop, the following strategic additions are proposed to maximize the value of the 15-agent architecture and address latent market needs in LATAM:*

### 1. Agent 16: AI Sermon-to-Discussion Generator (Post-Service Engagement)
- **Weakness Identified:** Small groups often struggle to create relevant discussion questions after Sunday services.
- **New Strategy:** Integrate Whisper API to transcribe the Sunday sermon. Agent 16 auto-generates 3-5 culturally relevant, theologically sound small group discussion questions in Spanish/English/Portuguese, delivered to Group Leaders by Monday morning.
- **Value:** Directly boosts "Small Group Monitor" (Ag.10) health metrics.

### 2. Automated Tithing & Donation Reconciliation Engine
- **Weakness Identified:** Manual matching of bank transfers (PSE, SPEI, Webpay) to member records is a top administrative pain point in LATAM churches.
- **New Strategy:** Develop an AI matching agent that cross-references bank deposit references, amounts, and dates with member giving patterns, auto-suggesting matches with 95%+ confidence, reducing admin time by 90%.

### 3. "Red" (Network) Denomination Hub Enhancement
- **Weakness Identified:** The current "Red" plan ($84.90/church) needs a stronger centralized value proposition to compete with enterprise tools.
- **New Strategy:** Build a unified "Denomination Dashboard" allowing network leaders to view aggregated, anonymized health metrics (attendance trends, giving health, volunteer burnout rates) across all subordinate churches, while maintaining strict tenant data isolation.

### 4. Offline-First PWA Aggressive Caching (Rural LATAM Focus)
- **Weakness Identified:** Native apps (Phase C) are months away, but rural pastors need reliable mobile access now.
- **New Strategy:** Upgrade the existing Prayer Wall and Dashboard PWA with advanced Service Worker strategies (Stale-While-Revalidate) and local IndexedDB caching for member directories and event schedules, ensuring functionality even with intermittent 3G connectivity.

---

## Architecture Decision Log (Updated)
| Decision | Original Plan | Current | Verdict |
| --- | --- | --- | --- |
| **AI Engine** | TensorFlow.js local models | Claude Sonnet 4 agents | ✅ Keep — agents act, not just predict |
| **Mobile** | React Native Week 4–10 | PWA now, native in Phase C | ⚠️ Correctly deferred — no users yet |
| **Design System** | Not specified | Cosmos Design System | ✅ Advantage over original plan |
| **WhatsApp pricing** | 200 conv/month | 800 conv included, $149/mo | ✅ Corrected — was underestimated 6× |
| **Auth guard** | `isSuperAdmin` field | `role === 'SUPER_ADMIN'` | ✅ Fixed — old approach returned 403 to everyone |
| **Monitoring** | External tools (Datadog/Sentry) | Ag.13 (WPE) + Ag.14 (SRE) self-monitoring | ✅ Advantage — zero additional SaaS cost |
| **WA cascade speed** | Cron polling (up to 17 min delay) | Webhook real-time (~30s) | ✅ Critical fix for Sunday operations |
| **Code Patching** | Direct file modification | HITL Pull Request generation | ✅ Critical security fix for Agent 13 |

---

## Contact
**Nelson Castro** — Founder  
Khesed-Tek Systems · AI Platform for the Latin American Church  
Email: nelson@khesed-tek-systems.org  
Phone: +57 302 123 4410  
Web: khesed-tek-systems.org  

> *"Sé diligente en conocer el estado de tus ovejas."* — Proverbios 27:23  

**Document Owner:** Technical Architecture Team  
**Next Review:** August 1, 2026  
**Previous Version:** v2.0 (June 5, 2026) — Phase 4 initial architecture plan  