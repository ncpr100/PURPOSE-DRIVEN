# Khesed-Tek CMS — Full Technical Specification

**Document Version**: 1.0  
**Generated**: April 14, 2026  
**Source**: Auto-generated from live codebase at `/workspaces/PURPOSE-DRIVEN`  
**Authority**: `PROJECT_SOURCE_OF_TRUTH.md` v1.1  

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture & Technology Stack](#2-architecture--technology-stack)
3. [Core Features Inventory](#3-core-features-inventory)
4. [Canonical Workflows](#4-canonical-workflows)
5. [Business Logic & Algorithms](#5-business-logic--algorithms)
6. [API Surface](#6-api-surface)
7. [Data Models](#7-data-models)

---

## 1. Project Overview

**Khesed-Tek** is a multi-tenant Software-as-a-Service (SaaS) **Church Management System (CMS)** designed for Spanish-speaking congregations in Latin America. It provides a centralized platform for church administrators and pastors to manage members, volunteers, donations, events, communications, and ministry workflows — all scoped per church (tenant).

The system operates on two planes:

- **Platform plane** (`/platform/*`): Managed by a single `SUPER_ADMIN` (Khesed-Tek operator). Handles tenant provisioning, billing, website service requests, and platform-wide analytics.
- **Tenant plane** (`/(dashboard)/*`): Each church (tenant) accesses its own isolated data and management tools. Roles within a church: `PASTOR`, `ADMIN_IGLESIA`, `LIDER`, `MIEMBRO`.

**Production URL**: `https://khesed-tek-cms-org.vercel.app`  
**Database Host**: Supabase (PostgreSQL)  
**Deployment**: Vercel (auto-deploy on `git push origin main`)  
**Current Version**: `1.1.0` (package.json)  
**Phase Status**: Phase 3 complete (Advanced Analytics). Phase 4 (AI & Mobile) in planning.

---

## 2. Architecture & Technology Stack

### 2.1 Frontend

| Concern | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | `^16.1.7` |
| Language | TypeScript | `5.2.2` |
| Rendering | Server Components + Client Components hybrid | — |
| UI Primitives | Radix UI (full suite — 25+ packages) | various |
| Component Library | shadcn/ui (built on Radix + Tailwind) | — |
| Styling | Tailwind CSS | `3.3.3` |
| Animations | Framer Motion | `10.18.0` |
| Charts | Recharts | `^2.15.3` |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable | `^6.3.1` / `^10.0.0` |
| Forms | React Hook Form | `7.53.0` |
| Validation | Zod | `^3.23.8` |
| Toasts | react-hot-toast + sonner | `2.4.1` / `^1.5.0` |
| Date Handling | date-fns | `^3.6.0` |
| QR Codes | qr-code-styling + react-qr-code + qrcode | `^1.9.2` / `^2.0.18` / `^1.5.4` |
| Email Preview | @react-email/components | `^0.5.1` |
| PDF Export | jsPDF | `4.2.1` |
| Excel Export | ExcelJS | `^4.4.0` |
| Carousel | embla-carousel-react | `8.3.0` |

### 2.2 Backend / Runtime

| Concern | Technology | Notes |
|---|---|---|
| Runtime | Node.js (via Vercel serverless) | Next.js API routes |
| API Style | REST (Next.js App Router Route Handlers) | 274 `route.ts` files |
| Authentication | NextAuth.js | `4.24.13` — JWT strategy, 7-day session |
| Password Hashing | bcryptjs | `2.4.3` |
| JWT (supplemental) | jsonwebtoken | `^9.0.2` — mobile/OAuth tokens |
| File Upload | Next.js native + sharp (image optimization) | `^0.34.5` |
| Real-time | Server-Sent Events (SSE) via `lib/sse-broadcast.ts` | `broadcastToChurch()` pattern |

### 2.3 Database

| Concern | Technology | Notes |
|---|---|---|
| Database | PostgreSQL | Hosted on Supabase |
| ORM | Prisma | `6.7.0` — schema at `prisma/schema.prisma` |
| Connection | `lib/db.ts` singleton | Global instance to prevent duplicate connections in dev |
| Schema Size | ~100 models | See §7 for full list |

### 2.4 Caching

| Layer | Technology | Notes |
|---|---|---|
| Primary Cache | Redis via ioredis + @upstash/redis | `lib/redis-cache-manager.ts` — 800+ lines |
| Cache Strategy | `lib/intelligent-cache-warmer.ts` | Proactive warming on login |
| Fallback | `analytics_cache` Postgres table | Write-through when Redis unavailable |
| Hit Rate Target | 90%+ | Configurable TTLs per data type |

### 2.5 External Integrations

| Service | Purpose | Key |
|---|---|---|
| Stripe | Subscription billing + one-time payments | `STRIPE_SECRET_KEY` |
| Paddle | Platform tenant billing | `PADDLE_API_KEY` |
| Mailgun | Transactional email delivery | `MAILGUN_API_KEY` |
| Nodemailer / Resend | Fallback email | `RESEND_API_KEY` |
| Twilio | SMS messaging | `TWILIO_ACCOUNT_SID` |
| WhatsApp Business API | WhatsApp messaging | `WHATSAPP_ACCESS_TOKEN` |
| Facebook / Instagram OAuth | Social media posting | `FACEBOOK_CLIENT_ID` |
| Google OAuth (YouTube) | YouTube posting | `GOOGLE_CLIENT_ID` |
| AbacusAI | AI-powered predictive analytics | `ABACUSAI_API_KEY` |
| Conekta | Mexican payment gateway | webhook at `/api/webhooks/conekta` |
| MercadoPago | LATAM payment gateway | webhook at `/api/webhooks/mercadopago` |
| Pix | Brazilian payment | webhook at `/api/webhooks/pix` |
| PSE / Nequi / Daviplata | Colombian payment gateways | `PSE_MERCHANT_ID` etc. |

### 2.6 Build & Quality

| Concern | Technology | Notes |
|---|---|---|
| Test Runner | Vitest | `^4.1.3` — 38 unit tests (`npm test`) |
| TypeScript Config | `strict: true` | `tsconfig.json` — 0 errors |
| Type Checking | `tsc --noEmit --skipLibCheck` | `npm run type-check` |
| Linting | ESLint + eslint-config-next | `^8.57.0` |
| Build | `next build` | `NODE_OPTIONS=--max-old-space-size=2048` |
| Deployment | Vercel auto-deploy | `git push origin main` |
| Feature Flags | `lib/feature-flags.ts` | ENV-var driven (`ENABLE_SOCIAL_MEDIA_AUTOMATION` etc.) |

---

## 3. Core Features Inventory

### 3.1 Platform Administration (SUPER_ADMIN only — `/platform/*`)

- **Church/Tenant Management** — create, configure, suspend, delete church tenants
- **Tenant Credentials** — manage login credentials for church admins
- **Subscription Plans & Addons** — define plans, assign features, manage addons
- **Billing / Invoicing** — generate invoices, track payments, send reminders, Paddle/Stripe integration
- **Platform Analytics** — aggregate stats across all tenants
- **Website Services** — accept, process, and track church website build requests
- **Platform Forms** — lead capture forms with QR codes and submission tracking
- **Security Monitoring** — platform-level audit and threat detection
- **System Management** — cache flush, system backup, API key management
- **Support Settings** — configure support contact info
- **Email Broadcasting** — send platform-wide emails to church admins

### 3.2 Member Management (`/members`)

- **Member Directory** — CRUD with search, filter by lifecycle stage, role, status
- **Enhanced Member Form** — 1,105-line form with tabs: Basic Info, Spiritual, Family, Notes
- **Spiritual Assessment** — spiritual gifts inventory, lifecycle stage classification
- **Member Import** — CSV bulk import with de-duplication
- **Bulk Gender Update** — correct historical data
- **Spiritual Profiles** — detailed `member_spiritual_profiles` with gifts, availability, calling
- **Lifecycle Stages** — `VISITANTE → NUEVO_CREYENTE → CRECIMIENTO → MADURO → LIDER`

### 3.3 Volunteer Management (`/volunteers`)

- **Volunteer Directory** — list, filter, create, update, delete
- **Volunteer Form** — skills, availability (text field), ministry assignment
- **Volunteer Matching** — AI-assisted skill-to-event matching (`/api/volunteer-matching`)
- **Volunteer Assignments** — link volunteers to events
- **Recruitment Pipeline** — leadership development, onboarding workflows
- **Engagement Scores** — `volunteer_engagement_scores` table tracks activity

### 3.4 Events Management (`/events`, `/advanced-events`)

- **Event CRUD** — full lifecycle with categories, dates, location
- **Recurring Events** — template-based repeating event scheduling
- **Event Resources** — room/equipment reservations with conflict detection
- **QR Code Check-in** — attendees scan on arrival
- **Children Check-in** — dedicated module with security QR codes for child pickup verification
- **AI Event Suggestions** — intelligent scheduling recommendations
- **Volunteer Auto-assignment** — assign volunteers to events via AI matching
- **Event Analytics** — attendance trends, capacity utilization

### 3.5 Donations & Finance (`/donations`)

- **Donation Recording** — manual and automatic (gateway webhook) entry
- **Donation Campaigns** — goal tracking with progress indicators
- **Donation Categories** — custom fund categorization
- **Multi-Gateway Support** — Stripe, MercadoPago, Conekta, Pix, PSE, Nequi, Daviplata, Paddle
- **Online Donation Page** — public `/donate/[churchId]` page (no auth required)
- **Donation Settings** — configure which gateways are active per church
- **Stats & Reporting** — totals by period, category, and campaign

### 3.6 Check-ins (`/check-ins`)

- **Visitor Check-in** — record first-time and returning visitors
- **QR-Code Check-in** — scan-based attendance with `check_ins` table
- **Visitor Follow-ups** — auto-generate high-priority follow-up tasks
- **Visitor Profiles** — CRM-style visitor records with engagement scores

### 3.7 Communications (`/communications`)

- **Mass Communication** — send email/SMS/WhatsApp to filtered member groups
- **Communication Templates** — reusable message templates with variables
- **Multi-channel Delivery** — email (Mailgun/Resend), SMS (Twilio), WhatsApp
- **Integration Status** — dashboard showing which channels are configured
- **Bulk Send** — `/api/integrations/bulk-send` endpoint

### 3.8 Analytics (`/analytics`, `/intelligent-analytics`, `/business-intelligence`)

- **General Analytics** — member counts, attendance trends, donation summaries
- **AI-Powered Analytics** (`/intelligent-analytics`) — predictive retention, member journey funnel, executive report
- **Member Journey Analytics** — `lib/member-journey-analytics.ts` — lifecycle stage transitions, behavioral patterns
- **Retention Risk Scoring** — `RetentionRisk` enum: `LOW / MEDIUM / HIGH / CRITICAL`
- **Engagement Scoring** — composite score from attendance, giving, ministry participation
- **AI A/B Testing** — `ai_model_ab_tests` + `ai_prediction_records` tables for model comparison
- **KPI Metrics** — configurable church health indicators
- **Custom Dashboards** — drag-and-drop widget-based dashboards
- **Export** — PDF (jsPDF), Excel (ExcelJS), CSV
- **Real-time Updates** — SSE endpoint at `/api/analytics/realtime-trigger`

### 3.9 Automation Rules (`/automation-rules`)

- **Rule Builder** — visual trigger → condition → action pipeline
- **Triggers** (24 types) — `MEMBER_REGISTRATION`, `DONATION_RECEIVED`, `BIRTHDAY_REMINDER`, `SOCIAL_MEDIA_*`, `PRAYER_FORM_SUBMITTED`, `VOLUNTEER_APPLICATION_SUBMITTED`, etc.
- **Conditions** — lifecycle stage, check-in frequency, donation amount, days since event, custom fields
- **Actions** — send email, send SMS, create follow-up task, update member field, publish social post
- **Templates** — pre-built automation templates installable per church
- **Automation Dashboard** — execution history, success/fail rates

### 3.10 Form Builder (`/form-builder`)

- **WYSIWYG Builder** — 3-panel drag-and-drop form editor (Tally.so style)
- **Smart Templates** — 9 pre-configured templates (visitor tracking, spiritual assessment, volunteer signup, etc.)
- **QR Code Generation** — full customization (dots, corners, gradients, logos, backgrounds)
- **Public Form Viewer** — `/form-viewer?slug=...` — no auth required
- **Visitor CRM Integration** — form submissions auto-create visitor profiles + follow-up tasks
- **Submit Button Customization** — text, background color, text color
- **Form Analytics** — submission counts, conversion tracking

### 3.11 Prayer Wall & Prayer Requests (`/prayer-wall`, `/prayer-requests`)

- **Prayer Request Submission** — members submit requests
- **Prayer Wall** — congregation-visible prayer board
- **Prayer Categories & Approvals** — moderation workflow
- **Prayer QR Codes** — physical QR → prayer form
- **Prayer Responses** — track who prayed and when
- **Prayer Analytics** — real-time updates via SSE
- **Prayer Messaging** — queue-based notifications to prayer team
- **Public Prayer Form** — `/prayer-form/[slug]` — no auth required
- **Testimonies** — separate testimony submission and display

### 3.12 Social Media (`/social-media`)

- **OAuth Connection** — one-click connect for Facebook, Instagram, YouTube
- **Post Composer** — write once, publish to multiple platforms
- **Post Scheduler** — schedule future posts with cron-style queuing
- **AI Content Assistant** — AI-generated post copy (`/api/social-media/ai-addon`)
- **Media Optimizer** — image resizing per platform spec
- **Platform Analytics** — reach, engagement by platform
- **Marketing Campaigns** — multi-post campaign management
- **8 Automation Triggers** — social media events fire automation rules

### 3.13 Sermons (`/sermons`)

- **Sermon Library** — CRUD with category, speaker, date, media URL
- **AI Sermon Outline Generator** — `/api/sermons/generate`
- **Sermon Download Service** — `lib/sermon-download-service.ts`

### 3.14 Website Builder (`/p/[slug]`, managed via platform)

- **Church Websites** — public church web pages at `/p/[slug]`
- **Web Pages & Sections** — `web_pages` + `web_page_sections` models
- **Website Analytics** — view counts and engagement
- **Website Service Requests** — churches request custom website builds from platform

### 3.15 Reports (`/reports`)

- **Custom Reports** — SQL-like report builder with saved reports
- **Report Schedules** — run reports on a schedule, email results
- **Business Intelligence** — funnels, funnel conversions, ministry gap analysis

### 3.16 Settings & Configuration

- **Church Profile** — name, logo, contact info
- **Branding** — primary/secondary colors, pastel palette per feature
- **Donation Settings** — gateway config per church
- **Integration Configs** — stored credentials for external services
- **Notification Preferences** — per-user notification opt-in/out
- **Qualification Settings** — define what constitutes an "active" member
- **Theme Preferences** — light/dark mode per user

### 3.17 User & Role Management (`/users`, `/permissions`)

- **User CRUD** — invite, update, deactivate users
- **Role Assignment** — `PASTOR / ADMIN_IGLESIA / LIDER / MIEMBRO`
- **Advanced Roles** — `roles_advanced` + `user_roles_advanced` for granular RBAC
- **Permissions** — resource × action matrix (`lib/permissions.ts`)
- **Password Change** — self-service and admin-initiated

### 3.18 Notifications (`/notifications`)

- **In-app Notifications** — `notifications` table, per-user delivery log
- **Push Notifications** — Web Push (VAPID) via `lib/push-notifications.ts`
- **Notification Templates** — reusable templates with variable substitution
- **Bulk Notifications** — `/api/notifications/bulk`

### 3.19 Billing & Subscriptions (tenant-facing)

- **Subscription Plans** — public pricing at `/pricing`
- **Church Subscriptions** — `church_subscriptions` table
- **Subscription Addons** — à la carte feature addons (SMS, live streaming, etc.)
- **Paddle Billing** — tenant billing via Paddle SDK (`lib/paddle.ts`)
- **Online Payments** — Stripe embedded checkout for one-time donations

### 3.20 Public / Unauthenticated Pages

- `/auth/signin` — sign in
- `/auth/signup` / `/auth/fresh-signup` — register new church
- `/donate/[churchId]` — public donation page
- `/form-viewer` — form viewer (requires `?slug=`)
- `/visitor-form/[slug]` — legacy visitor form
- `/prayer-form/[slug]` — public prayer request
- `/prayer/[code]` — prayer wall view
- `/public/children-checkin/[qrcode]` — child pickup verification
- `/p/[slug]` — church public website
- `/pricing`, `/privacy`, `/terms`, `/refund` — marketing/legal pages

---

## 4. Canonical Workflows

### 4.1 Registering a New Church Member

**Actor**: `PASTOR` or `ADMIN_IGLESIA`  
**Entry point**: `/members` dashboard page

1. User navigates to **Members** in the sidebar.
2. Clicks **"Agregar Miembro"** — opens `EnhancedMemberForm` dialog (1,105-line component in `components/members/enhanced-member-form.tsx`).
3. Form has 4 tabs: **Información Básica** (name, email, phone, birthdate, address), **Espiritual** (gifts, lifecycle stage, ministry), **Familia** (family links), **Notas** (freeform notes).
4. On submit, client POSTs to `POST /api/members`:
   - Zod validates against `memberSchema` in `lib/validation-schemas.ts` (Spanish enum values: `masculino/femenino/otro`, date strings in `YYYY-MM-DD`).
   - `churchId` is injected from the session — **never trusted from the request body**.
   - Prisma creates a `members` record.
5. If spiritual data is present, a `member_spiritual_profiles` record is upserted.
6. Automation engine checks for matching rules with `MEMBER_REGISTRATION` trigger — fires actions (e.g., welcome email via Mailgun, follow-up task creation).
7. Redis cache for the church's member analytics is invalidated.
8. Form closes; member list re-fetches and shows the new member.

**Verification**: Member appears in list; `GET /api/members` returns the new record; Redis cache miss count increments for that church.

---

### 4.2 Submitting and Processing a Donation

**Actor**: Donor (unauthenticated) via `/donate/[churchId]`, or church admin via `/donations`

**Path A — Online (public)**:
1. Donor visits `/donate/[churchId]` (no login required).
2. Selects amount, category, enters card details (Stripe Elements or MercadoPago).
3. Payment gateway processes payment; webhook fires to `/api/webhooks/stripe` (or `/mercadopago`, `/conekta`, `/pix`).
4. Webhook handler creates a `donations` record and optionally a `visitors` or `members` record if email matches.
5. Automation rule with `DONATION_RECEIVED` trigger fires — e.g., sends thank-you email.

**Path B — Admin manual**:
1. Admin navigates to `/donations`, clicks **"Registrar Donación"**.
2. Form: member name/ID, amount, category, date, payment method.
3. POSTs to `POST /api/donations`.
4. Record created, donation stats cache invalidated.

**Verification**: Donation in `/donations` list; `/api/donations/stats` reflects new totals; thank-you email delivered (if automation configured).

---

### 4.3 Running an Automation Rule

**Actor**: `ADMIN_IGLESIA` or `PASTOR`  
**Entry point**: `/automation-rules`

1. Admin navigates to **Reglas de Automatización** → clicks **"Nueva Regla"** or installs from a template.
2. Selects a **Trigger** (e.g., `BIRTHDAY_REMINDER`), adds **Conditions** (e.g., `lifecycle = MADURO`), defines **Actions** (e.g., send SMS via Twilio).
3. Rule saved to `automation_rules` + child records in `automation_triggers`, `automation_conditions`, `automation_actions`.
4. Enabled rules are evaluated by `lib/automation-engine.ts` whenever their trigger event fires (via `lib/automation-trigger-service.ts`).
5. On trigger match: engine evaluates all conditions (AND/OR groups), then executes actions in `orderIndex` order with optional `delay`.
6. Each execution is logged in `automation_rule_executions` with status `PENDING → COMPLETED / FAILED`.
7. Admin can test a rule via `POST /api/automation-rules/[id]/test`.

**Verification**: Check `automation_rule_executions` table for a `COMPLETED` record; confirm downstream action (email received, task created, etc.).

---

## 5. Business Logic & Algorithms

### 5.1 Member Lifecycle Classification (`lib/member-journey-analytics.ts`)

**Purpose**: Automatically classify each member into a lifecycle stage based on behavioral signals.

**Stages** (`MemberLifecycleStage` enum): `VISITANTE → NUEVO_CREYENTE → CRECIMIENTO → MADURO → LIDER`

**Algorithm**:
1. Fetch member's check-in history, donation records, ministry participation, and communication engagement.
2. Compute `BehavioralPattern`:
   - `attendanceConsistency` — standard deviation of weekly check-in gaps
   - `communicationEngagement` — open/click rates on sent communications
   - `ministryParticipation` — volunteer assignments in last 90 days
   - `givingPattern` — donation frequency and consistency
   - `socialInteraction` — prayer responses, forum activity
3. Compute `engagementScore` (0–100) as weighted sum of behavioral components.
4. Compute `retentionScore` from engagement trajectory (linear regression over 12 weeks).
5. Assign stage deterministically from thresholds; flag `nextStageRecommendation` if `retentionScore > 0.75` and `engagementScore > 60`.
6. Store in `member_journeys` table; surface in analytics dashboards.

### 5.2 AI Prediction Engine (`lib/enhanced-ai-insights-engine.ts`)

**Purpose**: Generate predictive retention scores and church health forecasts.

**Process**:
1. Pulls behavioral patterns for all active members from cache or DB.
2. Calls AbacusAI API (`ABACUSAI_API_KEY`) with structured feature vectors.
3. Stores predictions in `ai_prediction_records` with `confidence`, `predictedValue`, `modelVersion`.
4. A/B tests two model versions via `ai_model_ab_tests` — winner determined by `accuracy` after validation period.
5. Results surfaced in `/intelligent-analytics` as "Retención en Riesgo", "Crecimiento Proyectado", etc.

**Fallback**: When AbacusAI is unavailable, falls back to rule-based heuristics from `lib/cached-analytics-service.ts`.

### 5.3 Redis Cache Strategy (`lib/redis-cache-manager.ts`)

**Key patterns**:
- `church:{churchId}:members:*` — member lists, counts
- `church:{churchId}:analytics:executive:{period}` — executive report (15 min TTL)
- `church:{churchId}:analytics:predictive` — retention forecast (30 min TTL)
- `church:{churchId}:analytics:member-journey` — funnel (20 min TTL)

**Cache invalidation**: On any write to `members`, `donations`, `check_ins` — invalidate the relevant `church:{churchId}:*` pattern.

**Fallback**: `analytics_cache` Postgres table used when Redis is unreachable (write-through pattern).

### 5.4 Volunteer–Event Matching (`lib/` + `/api/volunteer-matching`)

**Purpose**: Recommend volunteers for event needs based on skills, availability, and past assignments.

**Algorithm**:
1. Load event's required skills and date/time.
2. Load all active volunteers for the church with their `skills` array and availability text.
3. Score each volunteer: skill overlap (Jaccard similarity) × availability match × engagement score.
4. Return ranked list; admin can auto-assign top match via `POST /api/events/[id]/auto-assign-volunteers`.

### 5.5 Automation Rule Evaluation (`lib/automation-engine.ts`)

**Condition evaluation**:
- Conditions within a group use `logicalOperator` (`AND` / `OR`).
- Multiple groups are combined with `AND` between groups.
- Operators: `EQUALS`, `NOT_EQUALS`, `GREATER_THAN`, `LESS_THAN`, `CONTAINS`, `IN`, `NOT_IN`.

**Action execution**:
- Actions execute in `orderIndex` ascending order.
- Each action with `delay > 0` is deferred by that many minutes.
- Supported action types: `SEND_EMAIL`, `SEND_SMS`, `SEND_WHATSAPP`, `CREATE_TASK`, `UPDATE_MEMBER_FIELD`, `PUBLISH_SOCIAL_POST`, `SEND_PUSH_NOTIFICATION`.

### 5.6 Multi-Tenant Isolation

**Rule**: Every database query in every API route MUST include `WHERE churchId = session.user.churchId`.

**Implementation**:
- `churchId` is always read from the server-side session (`getServerSession(authOptions)`), never from request params.
- Prisma's `findFirst` with `{ where: { id, churchId } }` used before any `update` or `delete` to prevent cross-tenant data access.
- Platform routes (`/platform/*`) bypass `churchId` scoping — available to `SUPER_ADMIN` only, enforced in route-level session checks.

### 5.7 Visitor CRM Auto-creation (Form Submissions)

**Triggered by**: `POST /api/custom-form/[slug]`

**Logic**:
1. Parse form response fields using smart key mapping (searches for `email`, `correo`, `correoelectronico`; `phone`, `telefono`, `celular`; `nombre`, `name`, `firstName`).
2. Create `check_ins` record (visitor profile) with `visitorType: 'custom_form'`, `engagementScore: 85`.
3. Create `custom_form_submissions` record with full JSON payload + `visitorId` reference.
4. Create `visitor_follow_ups` record with `priority: 'HIGH'`, scheduled 24 hours later.
5. If form type is detected as `spiritual_assessment` or `volunteer_application`, create the corresponding domain record and notify the church's Pastors and Admins via email.

### 5.8 OAuth Token Security (`lib/oauth-crypto.ts`)

OAuth tokens from Facebook, Instagram, and YouTube are encrypted with AES-256 before storage in `social_media_accounts`. Key sourced from `SOCIAL_MEDIA_ENCRYPTION_KEY` env var. Tokens are decrypted on-read at the API layer; never logged.

---

## 6. API Surface

### 6.1 Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/[...nextauth]` | NextAuth.js sign-in / sign-out / session |
| POST | `/api/auth/change-password` | Change own password |
| POST | `/api/auth/request-church-account` | New church account request |
| POST | `/api/signup` | Full church + admin user registration |

### 6.2 Members

| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/members` | List / create members |
| GET/PUT/DELETE | `/api/members/[id]` | Read / update / delete member |
| GET | `/api/members/counts` | Aggregated member counts |
| POST | `/api/members/import` | CSV bulk import |
| GET/PUT | `/api/members/[id]/spiritual-profile` | Spiritual profile |
| POST | `/api/members/bulk-gender-update` | Bulk gender correction |
| GET/POST | `/api/member-spiritual-profile` | Church-wide spiritual profiles |

### 6.3 Volunteers

| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/volunteers` | List / create volunteers |
| GET/PUT/DELETE | `/api/volunteers/[id]` | Read / update / delete |
| GET | `/api/volunteer-assignments` | Volunteer-to-event assignments |
| GET | `/api/volunteer-matching` | AI matching recommendations |
| GET/POST | `/api/recruitment-pipeline` | Recruitment pipeline |

### 6.4 Events

| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/events` | List / create events |
| GET/PUT/DELETE | `/api/events/[id]` | Read / update / delete |
| POST | `/api/events/[id]/auto-assign-volunteers` | AI volunteer assignment |
| POST | `/api/events/[id]/communications` | Send event communication |
| GET | `/api/events/ai-suggestions` | AI scheduling suggestions |
| GET/POST | `/api/events/recurring` | Recurring event templates |
| POST | `/api/events/move` | Reschedule event |
| GET/POST | `/api/event-resources` | Resource (room/equipment) management |

### 6.5 Check-ins & Visitors

| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/check-ins` | List / create check-ins |
| GET | `/api/check-ins/qr/[code]` | QR-based check-in lookup |
| GET/POST | `/api/children-check-ins` | Children check-in CRUD |
| POST | `/api/children-check-ins/generate-qr` | Generate child security QR |
| GET/POST | `/api/visitors` | Visitor profiles |
| GET/POST | `/api/visitor-follow-ups` | Follow-up tasks |
| GET/PUT/DELETE | `/api/visitor-follow-ups/[id]` | Follow-up CRUD |

### 6.6 Donations

| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/donations` | List / create donations |
| GET | `/api/donations/stats` | Donation summary statistics |
| GET/POST | `/api/donation-campaigns` | Campaign management |
| GET/POST | `/api/donation-categories` | Category management |
| GET/POST | `/api/online-payments` | Online payment records |
| POST | `/api/payment-gateways/stripe` | Stripe payment intent creation |
| POST | `/api/webhooks/stripe` | Stripe webhook handler |
| POST | `/api/webhooks/mercadopago` | MercadoPago webhook |
| POST | `/api/webhooks/conekta` | Conekta webhook |
| POST | `/api/webhooks/pix` | Pix webhook |
| POST | `/api/webhooks/paddle` | Paddle subscription webhook |

### 6.7 Analytics

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analytics/overview` | Summary metrics |
| GET | `/api/analytics/executive-report` | AI executive report (15 min cache) |
| GET | `/api/analytics/predictive` | Retention forecast (30 min cache) |
| GET | `/api/analytics/member-journey` | Lifecycle funnel (20 min cache) |
| GET | `/api/analytics/retention-risk` | At-risk member list |
| GET | `/api/analytics/enhanced-ai-insights` | Full AI insight payload |
| GET | `/api/analytics/trends` | Historical trend data |
| GET | `/api/analytics/engagement-scoring` | Per-member engagement scores |
| POST | `/api/analytics/export` | Export PDF / Excel / CSV |
| GET | `/api/analytics/realtime-trigger` | SSE real-time updates stream |
| GET | `/api/analytics/performance-monitor` | System performance metrics |

### 6.8 Automation

| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/automation-rules` | List / create rules |
| GET/PUT/DELETE | `/api/automation-rules/[id]` | Rule CRUD |
| POST | `/api/automation-rules/[id]/test` | Test-fire a rule |
| GET/POST | `/api/automation-templates` | Pre-built rule templates |
| GET | `/api/automation-dashboard` | Execution history dashboard |
| GET/POST | `/api/automations` | Legacy automation records |

### 6.9 Communications

| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/communications` | List / send messages |
| POST | `/api/communications/mass-send` | Bulk send to filtered group |
| GET/POST | `/api/communication-templates` | Template CRUD |
| POST | `/api/integrations/bulk-send` | Multi-channel bulk dispatch |
| GET | `/api/integrations/status` | Integration health check |

### 6.10 Social Media

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/social-media/connect?platform=X` | Initiate OAuth for Facebook/Instagram/YouTube |
| GET | `/api/oauth/facebook/callback` | OAuth callback |
| GET | `/api/oauth/instagram/callback` | OAuth callback |
| GET | `/api/oauth/youtube/callback` | OAuth callback |
| GET/POST | `/api/social-media-posts` | Post CRUD |
| POST | `/api/social-media-posts/[id]/publish` | Publish a post |
| POST | `/api/social-media/scheduler` | Schedule future posts |
| POST | `/api/social-media/ai-addon` | AI copy generation |
| GET | `/api/social-media/analytics` | Engagement metrics |
| POST | `/api/social-media/media-optimizer` | Resize images |

### 6.11 Form Builder & Visitor Forms

| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/form-builder` | List / create custom forms |
| POST | `/api/custom-form/[slug]` | Public form submission (no auth) |
| GET | `/api/custom-form/[slug]/view` | Form schema for viewer |
| GET | `/api/custom-form-submissions` | Submission list |
| GET/POST | `/api/visitor-forms` | Legacy visitor form CRUD |

### 6.12 Prayer

| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/prayer-requests` | Prayer request CRUD |
| GET/POST | `/api/prayer-forms` | Prayer form CRUD |
| GET | `/api/prayer-forms/public/[slug]` | Public prayer form schema |
| GET/POST | `/api/prayer-qr-codes` | QR codes for prayer forms |
| GET | `/api/prayer-qr-codes/public/[code]` | Resolve QR to form |
| GET/POST | `/api/prayer-analytics` | Prayer analytics |
| GET | `/api/prayer-analytics/realtime-updates` | SSE prayer stream |
| POST | `/api/prayer-analytics/export` | Export prayer data |

### 6.13 Platform Admin

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/platform/stats` | Platform-wide KPIs |
| GET/POST | `/api/platform/churches` | Tenant management |
| GET/POST | `/api/platform/subscription-plans` | Plan management |
| GET/POST | `/api/platform/invoices` | Invoice management |
| GET/POST | `/api/platform/users` | Platform user management |
| GET/POST | `/api/platform/website-services` | Website build requests |
| GET/POST | `/api/platform/forms` | Platform lead forms |
| GET | `/api/platform/monitoring` | System health |
| POST | `/api/platform/send-email` | Platform blast email |
| GET/POST | `/api/platform/billing/subscriptions` | Billing records |

### 6.14 System

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health probe — returns 200/503 |
| GET | `/api/version-debug` | Runtime version info |
| POST | `/api/realtime/broadcast` | SSE broadcast to church |
| GET | `/api/realtime/events` | SSE event stream |
| POST | `/api/upload` | File upload (images) |

---

## 7. Data Models

The Prisma schema defines **~100 models** across these domains:

### 7.1 Core Identity

| Model | Key Fields | Notes |
|---|---|---|
| `users` | `id, email, password (bcrypt), role (UserRole), churchId, isActive` | Top-level user entity |
| `churches` | `id, name, slug, logo, primaryColor, subscriptionPlan` | Tenant root |
| `accounts` | NextAuth OAuth account links | Provider account linking |
| `sessions` | NextAuth JWT sessions | |
| `tenant_credentials` | `churchId, adminEmail, tempPassword` | Platform-provisioned credentials |

**`UserRole` enum**: `SUPER_ADMIN | ADMIN_IGLESIA | PASTOR | LIDER | MIEMBRO`

### 7.2 Members & Volunteers

| Model | Key Fields | Notes |
|---|---|---|
| `members` | `id, churchId, firstName, lastName, email, phone, birthDate, gender, maritalStatus, role, status, lifecycle (MemberLifecycleStage)` | Core member record |
| `member_spiritual_profiles` | `memberId, spiritualGifts[], ministryPassions[], experienceLevel, calling` | Spiritual inventory |
| `member_journeys` | `memberId, currentStage, engagementScore, retentionScore, daysInStage` | Lifecycle tracking |
| `member_behavioral_patterns` | `memberId, attendanceConsistency, givingPattern, ministryParticipation` | ML feature vectors |
| `volunteers` | `id, churchId, memberId?, firstName, lastName, skills[], availability, ministryId` | Volunteer record |
| `volunteer_assignments` | `volunteerId, eventId, role, status` | Event assignment link |
| `volunteer_engagement_scores` | `volunteerId, score, lastUpdated` | Engagement tracking |

**`MemberLifecycleStage` enum**: `VISITANTE | NUEVO_CREYENTE | CRECIMIENTO | MADURO | LIDER`

### 7.3 Events & Check-ins

| Model | Key Fields | Notes |
|---|---|---|
| `events` | `id, churchId, title, description, date, location, capacity, isRecurring` | Event record |
| `event_resources` | `id, churchId, name, type, capacity` | Rooms / equipment |
| `event_resource_reservations` | `resourceId, eventId, startTime, endTime, status` | Conflict-checked reservations |
| `check_ins` | `id, churchId, firstName, lastName, email, phone, checkedInAt, visitorType, engagementScore, visitReason` | Attendance + visitor CRM |
| `children_check_ins` | `id, churchId, childName, guardianName, qrCode, checkedInAt, checkedOutAt` | Child security |

### 7.4 Donations & Billing

| Model | Key Fields | Notes |
|---|---|---|
| `donations` | `id, churchId, memberId?, amount, currency, category, gateway, transactionId, date` | Donation record |
| `donation_campaigns` | `id, churchId, title, goalAmount, currentAmount, startDate, endDate` | Campaign tracking |
| `donation_categories` | `id, churchId, name, description` | Fund categories |
| `online_payments` | `id, churchId, amount, gateway, status, gatewayTransactionId` | Gateway payment records |
| `payment_gateway_configs` | `id, churchId, gateway, isActive, credentials (encrypted)` | Per-church gateway config |
| `church_subscriptions` | `id, churchId, planId, status, currentPeriodEnd` | Tenant SaaS subscription |
| `subscription_plans` | `id, name, price, billingCycle, features[]` | Plan catalog |
| `invoices` | `id, churchId, amount, status, dueDate, paidAt` | Billing invoices |

### 7.5 Communications

| Model | Key Fields | Notes |
|---|---|---|
| `communications` | `id, churchId, subject, body, channel (EMAIL/SMS/WHATSAPP), status, sentAt` | Sent message records |
| `communication_templates` | `id, churchId, name, subject, body, variables[]` | Message templates |
| `notifications` | `id, userId, type, title, body, isRead, createdAt` | In-app notifications |
| `notification_templates` | `id, churchId, type, subject, body` | Notification templates |
| `push_subscriptions` | `userId, endpoint, keys (VAPID)` | Web Push subscriptions |

### 7.6 Automation

| Model | Key Fields | Notes |
|---|---|---|
| `automation_rules` | `id, churchId, name, description, isActive, priority` | Rule header |
| `automation_triggers` | `ruleId, type (AutomationTriggerType), configuration` | What fires the rule |
| `automation_conditions` | `ruleId, type, field, operator, value, logicalOperator, groupId, orderIndex` | Filter conditions |
| `automation_actions` | `ruleId, type (AutomationActionType), configuration, orderIndex, delay` | What executes |
| `automation_rule_executions` | `ruleId, triggerData, status, result, duration` | Execution log |
| `automation_rule_templates` | `id, name, category, description, defaultConfig` | Pre-built templates |

**`AutomationTriggerType`** (24 values): `MEMBER_REGISTRATION`, `DONATION_RECEIVED`, `BIRTHDAY_REMINDER`, `SOCIAL_MEDIA_*` (8), `PRAYER_FORM_SUBMITTED`, `VOLUNTEER_APPLICATION_SUBMITTED`, etc.

### 7.7 Prayer & Spiritual

| Model | Key Fields | Notes |
|---|---|---|
| `prayer_requests` | `id, churchId, memberId?, title, body, category, isAnonymous, status` | Prayer request |
| `prayer_forms` | `id, churchId, slug, title, fields (JSON config)` | Configurable prayer form |
| `prayer_qr_codes` | `id, churchId, formId, code, url` | Physical QR for forms |
| `prayer_categories` | `id, churchId, name, color` | Prayer grouping |
| `prayer_responses` | `requestId, userId, prayedAt` | Prayer tracking |
| `prayer_testimonies` | `requestId, text, isPublic` | Testimony linked to request |
| `spiritual_gifts` | `id, churchId, memberId, gifts[], assessmentDate` | Gifts inventory |

### 7.8 Analytics & AI

| Model | Key Fields | Notes |
|---|---|---|
| `analytics_cache` | `cacheKey, data, expiresAt, churchId` | Postgres-level analytics cache fallback |
| `analytics_dashboards` | `id, churchId, name, layout, isDefault` | Custom dashboard config |
| `dashboard_widgets` | `dashboardId, type, config, position` | Widget placement |
| `kpi_metrics` | `id, churchId, name, formula, currentValue, targetValue` | Church KPIs |
| `ai_prediction_records` | `id, churchId, memberId, predictionType, predictedValue, confidence, accuracy, modelVersion` | ML prediction log |
| `ai_model_ab_tests` | `id, churchId, controlModel, testModel, trafficSplit, isActive` | A/B test config |
| `ai_model_performance` | `id, churchId, modelVersion, metricType, value` | Model performance tracking |
| `funnels` | `id, churchId, name, type (FunnelType)` | Conversion funnel config |
| `funnel_steps` | `funnelId, name, stepType, targetCount` | Funnel stage definition |
| `funnel_conversions` | `funnelId, stepId, memberId, convertedAt` | Conversion event |

### 7.9 Social Media

| Model | Key Fields | Notes |
|---|---|---|
| `social_media_accounts` | `id, churchId, platform, accountName, accessToken (encrypted), expiresAt, isActive` | Connected accounts |
| `social_media_posts` | `id, churchId, content, platforms[], mediaUrls[], status, scheduledAt, publishedAt` | Post records |
| `social_media_metrics` | `postId, platform, likes, comments, shares, impressions, updatedAt` | Engagement metrics |
| `marketing_campaigns` | `id, churchId, name, platforms[], startDate, endDate, status` | Multi-post campaigns |
| `marketing_campaign_posts` | `campaignId, postId, orderIndex` | Campaign composition |

### 7.10 Form Builder & Visitors

| Model | Key Fields | Notes |
|---|---|---|
| `custom_forms` | `id, churchId, title, slug, config (JSON with fields, QR settings, button styles), isActive` | Form definition |
| `custom_form_submissions` | `formId, data (JSON), ipAddress, userAgent, createdAt` | Raw submission |
| `visitor_profiles` | `id, churchId, name, email, phone, source, category (VisitorCategory)` | Visitor CRM |
| `visitor_follow_ups` | `id, churchId, checkInId, priority, status, scheduledAt, notes` | Follow-up tasks |
| `visitor_qr_codes` | `id, churchId, formId, code` | QR for visitor forms |

### 7.11 Website Builder

| Model | Key Fields | Notes |
|---|---|---|
| `websites` | `id, churchId, domain, status, theme` | Church website |
| `web_pages` | `id, websiteId, slug, title, isPublished` | Individual pages |
| `web_page_sections` | `pageId, type, content (JSON), orderIndex` | Page sections |
| `website_analytics` | `websiteId, path, views, uniqueVisitors, date` | Traffic data |
| `website_requests` | `id, churchId, status, requestType, processedById` | Platform build requests |

### 7.12 Platform (SUPER_ADMIN)

| Model | Key Fields | Notes |
|---|---|---|
| `platform_settings` | `key, value` | Global platform configuration |
| `PlatformForm` | `id, slug, title, fields, createdById` | Lead capture forms |
| `PlatformFormSubmission` | `formId, data, processedById` | Lead submissions |
| `PlatformQRCode` | `id, formId, code, generatedById` | Platform QR codes |
| `DynamicQRCode` | `id, targetUrl, isActive, scanCount` | Updateable QR codes |

---

## Next Steps — Create Public Download Link

Save this specification to a file and publish as a shareable link:

**Step 1 — The file is already saved at:**
```
/workspaces/PURPOSE-DRIVEN/Khesed-Tek_Technical_Spec.md
```

**Step 2 — Publish as a GitHub Gist (public link):**
```bash
gh gist create Khesed-Tek_Technical_Spec.md --public --desc "Khesed-Tek CMS Full Technical Architecture Spec"
```

**Alternative — Upload to file.io (no GitHub account needed):**
```bash
curl -F "file=@Khesed-Tek_Technical_Spec.md" https://file.io
```

**Alternative — Host locally:**
```bash
python3 -m http.server 8000
# Then open: http://localhost:8000/Khesed-Tek_Technical_Spec.md
```
