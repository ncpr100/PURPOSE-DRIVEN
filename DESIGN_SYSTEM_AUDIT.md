# Design System Audit — Khesed-Tek Church Management Platform
**Date:** April 2026  
**Branch:** `main` (merged from `feature/agent-12-volunteer-coverage`)  
**Scope:** Frontend application — all dashboard routes, UI components, layout, critical flows  
**Language:** Spanish (`lang="es"`)

---

## Section 1 — Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.1.7 |
| Runtime | React | 19.2.4 |
| Language | TypeScript | 5.9.3 |
| Dev Server | Turbopack | (bundled with Next.js 16) |
| UI Library | shadcn/ui | latest (component-copied) |
| Primitives | Radix UI | various (dialog, tooltip, dropdown…) |
| Styling | Tailwind CSS | 3.3.3 |
| Variant System | class-variance-authority (CVA) | 0.7.0 |
| Class Merge | tailwind-merge | 2.5.2 |
| Class Utils | clsx | 2.1.1 |
| Animations | tailwindcss-animate | 1.0.7 |
| Motion | framer-motion | 10.18.0 |
| Icons | lucide-react | ^0.460.0 |
| Charts | recharts | (used in analytics, prayer wall) |
| Dark Mode | `.dark` class strategy | via `darkMode: ['class']` |
| Font | Tailwind `font-sans` system stack | No Google/Next font optimization |

**Architecture Notes:**
- shadcn/ui components are copied into `components/ui/` — they are owned by the project
- No design token library (Style Dictionary, Theo, Figma tokens) — tokens live exclusively in `app/globals.css` as CSS custom properties
- No component documentation site (Storybook / Ladle)
- No Jest/Testing Library test suite for UI components

---

## Section 2 — Color Palette

### 2.1 Design Token System (CSS Custom Properties)

All tokens are defined in `app/globals.css` using HSL values, consumed by Tailwind via `hsl(var(--token))` syntax.

#### Light Mode (`:root`)

| Token | HSL Value | Approx Hex | Usage |
|---|---|---|---|
| `--background` | `0 0% 100%` | `#ffffff` | Page background |
| `--foreground` | `224 71.4% 4.1%` | `#080c14` | Default text |
| `--card` | `0 0% 100%` | `#ffffff` | Card backgrounds |
| `--card-foreground` | `224 71.4% 4.1%` | `#080c14` | Card text |
| `--popover` | `0 0% 100%` | `#ffffff` | Popovers, dropdowns |
| `--popover-foreground` | `224 71.4% 4.1%` | `#080c14` | Popover text |
| `--primary` | `220.9 39.3% 11%` | `~#111d2e` | Primary buttons, key elements |
| `--primary-foreground` | `210 20% 98%` | `~#f8fafc` | Text on primary |
| `--secondary` | `220 14.3% 95.9%` | `~#f1f3f8` | Secondary buttons, subtle BG |
| `--secondary-foreground` | `220.9 39.3% 11%` | `~#111d2e` | Text on secondary |
| `--muted` | `220 14.3% 95.9%` | `~#f1f3f8` | Muted backgrounds (= secondary) |
| `--muted-foreground` | `220 8.9% 46.1%` | `~#6b7280` | Placeholder, helper text |
| `--accent` | `220 14.3% 95.9%` | `~#f1f3f8` | Hover states, sidebar active |
| `--accent-foreground` | `220.9 39.3% 11%` | `~#111d2e` | Text on accent |
| `--destructive` | `0 84.2% 60.2%` | `~#ef4444` | Delete, error states |
| `--destructive-foreground` | `210 20% 98%` | `~#f8fafc` | Text on destructive |
| `--border` | `220 13% 91%` | `~#e5e7eb` | Input borders, dividers |
| `--input` | `220 13% 91%` | `~#e5e7eb` | Input border (= border) |
| `--ring` | `224 71.4% 4.1%` | `#080c14` | Focus rings |
| `--radius` | `0.5rem` | `8px` | Border radius base |

> **Note:** `--secondary`, `--muted`, and `--accent` all map to the same HSL value (`220 14.3% 95.9%`). They are semantically distinct but visually identical in the design token system.

#### Dark Mode (`.dark`)

| Token | HSL Value | Approx Hex | Key Change |
|---|---|---|---|
| `--background` | `224 71.4% 4.1%` | `#080c14` | Very dark navy (inverted from light) |
| `--foreground` | `210 20% 98%` | `#f8fafc` | Near-white |
| `--card` | `224 71.4% 4.1%` | `#080c14` | Same as background |
| `--primary` | `210 20% 98%` | `#f8fafc` | Inverted — near-white |
| `--primary-foreground` | `220.9 39.3% 11%` | `#111d2e` | Dark text on white primary |
| `--secondary` | `215 27.9% 16.9%` | `~#1e2a3b` | Dark blue-gray |
| `--muted` | `215 27.9% 16.9%` | `~#1e2a3b` | Same as secondary |
| `--muted-foreground` | `217.9 10.6% 64.9%` | `~#94a3b8` | Lighter gray |
| `--accent` | `215 27.9% 16.9%` | `~#1e2a3b` | Same as secondary/muted |
| `--destructive` | `0 62.8% 30.6%` | `~#7f1d1d` | Darker red |
| `--border` | `215 27.9% 16.9%` | `~#1e2a3b` | Dark mode dividers |
| `--ring` | `216 12.2% 83.9%` | `~#cbd5e1` | Light ring for dark BG |

### 2.2 Hardcoded Colors (Technical Debt — 30+ Locations)

These bypass the token system and will not respond to theming or brand customization changes:

#### Product / UI Colors (should use tokens)

| File | Hardcoded Value | Context | Recommended Fix |
|---|---|---|---|
| `app/layout.tsx` | `#3B82F6` | `viewport.themeColor` (browser tab bar) | Replace with `var(--primary)` via a theme-aware approach |
| `settings/profile/page.tsx` | `#3B82F6` | `primaryColor` state default | Move to church branding config or `--primary` |
| `settings/profile/page.tsx` | `#64748B` | `secondaryColor` default | Move to `--secondary-foreground` token |
| `settings/profile/page.tsx` | `#10B981` | `accentColor` default | Move to a custom `--accent-brand` token |
| `events/_components/smart-events-client.tsx` | `backgroundColor: '#3b82f6'` (×2) | Inline styles on calendar events | Extract to CSS class or token |
| `check-ins/_components/check-ins-client.tsx` | `bg-gradient-to-r from-blue-500 to-purple-600 text-white` | Primary CTA button | Create `btn-primary-gradient` utility |
| `visitor-followups-client.tsx` | `STATUS_COLORS` map (yellow/green/blue/gray) | Status badge BG/text/border | Move to `badge` variant extensions |
| `visitor-followups-client.tsx` | `PRIORITY_COLORS` map (red/yellow/gray) | Priority badge colors | Move to token-based variants |
| `home/_components/dashboard-client.tsx` | `border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50` | Visitor analysis card | Token-based or CSS custom property |
| `home/_components/dashboard-client.tsx` | `text-blue-800`, `bg-green-100`, `text-green-600` | Metric cards, trend indicators | Use semantic tokens |
| `mobile-sidebar.tsx` | `text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200` | Section expand/collapse button | Replace with `accent`/`muted` tokens |
| `components/ui/badge.tsx` | `bg-green-500 text-white` | `success` variant | Add CSS var `--success` + `--success-foreground` |
| `components/ui/badge.tsx` | `bg-yellow-500 text-white` | `warning` variant | Add CSS var `--warning` + `--warning-foreground` |

#### Social Network Brand Colors (acceptable — external brands)

| File | Color | Brand |
|---|---|---|
| `social-media/_components/analytics-dashboard.tsx` | `#1877f2` | Facebook |
| `social-media/_components/analytics-dashboard.tsx` | `#1da1f2` | Twitter/X |
| `social-media/_components/analytics-dashboard.tsx` | `#e1306c` | Instagram |
| `social-media/_components/analytics-dashboard.tsx` | `#ff0000` | YouTube |
| `social-media/_components/analytics-dashboard.tsx` | `#000000` | TikTok |

> Social network brand colors are acceptable — they represent third-party brand identities and should not be tokenized.

#### Recharts / Chart Colors (medium priority)

| File | Colors Used | Recommendation |
|---|---|---|
| `social-media/_components/analytics-dashboard.tsx` | `#3b82f6`, `#10b981`, `#f59e0b`, `#8b5cf6`, `#06b6d4` | Define `CHART_COLORS` constant in a shared config |
| Various analytics components | Similar set | Create `lib/chart-colors.ts` with a named palette |

### 2.3 Color System Gap Analysis

- **No semantic success/warning tokens** in `globals.css` — `badge.tsx` uses hardcoded Tailwind colors
- **No chart color tokens** — Recharts components each define their own color set
- **No brand blue reference** — `#3B82F6` (blue-500) appears frequently but is not a design system token
- **--accent = --muted = --secondary** — Three semantically different tokens are visually identical; hover/active states are indistinguishable from muted text backgrounds
- **Dark mode primary is inverted** (`near-white`) — Standard button (`bg-primary`) becomes a white button in dark mode; feature-level gradients (hardcoded `from-blue-500`) remain unchanged

---

## Section 3 — Typography

### 3.1 Font Configuration

```
Font Family: font-sans (Tailwind system stack)
  → ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 
     "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif

No Google Fonts. No Next.js font optimization (next/font).
Body class in app/layout.tsx: min-h-screen bg-background font-sans antialiased
```

**Note:** There is no custom typeface. All text renders in the OS default sans-serif font. This means macOS users see San Francisco, Windows users see Segoe UI, Android users see Roboto — potentially inconsistent across user segments.

### 3.2 Type Scale Usage (observed across components)

| Scale | Tailwind Class | Used In |
|---|---|---|
| 3XL | `text-3xl font-bold` | Dashboard h1 headings |
| 2XL | `text-2xl font-semibold` | `CardTitle`, module page headings |
| XL | `text-xl font-semibold` | Secondary section headings |
| LG | `text-lg font-medium` | Subheadings, navigation group labels |
| Base | `text-base` (implicit) | Body text, form labels |
| SM | `text-sm` | Buttons (`default` size), metadata, table cells, `CardDescription` skeleton |
| XS | `text-xs` | Timestamps, status chips, helper text |

### 3.3 Font Weight Usage

| Weight | Class | Usage Pattern |
|---|---|---|
| 700 | `font-bold` | Hero headings, key metrics |
| 600 | `font-semibold` | Card titles, section headers |
| 500 | `font-medium` | Navigation items, button labels, active states |
| 400 | (default) | Body, descriptions |

### 3.4 Typography Gaps

- **No design token for font size** — sizes are hardcoded Tailwind utilities throughout, not hoisted to CSS variables
- **No defined heading hierarchy document** — h1/h2/h3 semantics are inconsistent (many headings use `<p>` or `<div>` with text utilities)
- **No line-height or letter-spacing tokens** — `tracking-tight` and `leading-none` appear in `CardTitle`; general body uses Tailwind defaults
- **No custom typeface** — system font stack produces brand inconsistency across operating systems

---

## Section 4 — Spacing & Radius

### 4.1 Border Radius

| Token | Computed Value | Used In |
|---|---|---|
| `rounded-lg` → `var(--radius)` | `0.5rem` / `8px` | Cards, dialogs, most containers |
| `rounded-md` → `calc(var(--radius) - 2px)` | `6px` | Buttons, inputs, badges |
| `rounded-sm` → `calc(var(--radius) - 4px)` | `4px` | Small elements |
| `rounded-full` | `9999px` | Avatars, pill badges, circular icons |
| `rounded-xl` | `0.75rem` / `12px` (hardcoded) | Feature banners, hero cards |
| `rounded-2xl` | `1rem` / `16px` (hardcoded) | Large modal wrappers |

> `rounded-xl` / `rounded-2xl` bypass the CSS variable system — changing `--radius` does not affect them.

### 4.2 Spacing Scale (Observed Patterns)

| Pattern | Usage |
|---|---|
| `p-4` (16px) | Standard content padding (mobile-first) |
| `p-6` (24px) | `CardHeader`, `CardContent`, dialog bodies |
| `p-3` (12px) | Compact action areas, narrow cards |
| `gap-4` (16px) | Grid and flex gaps between cards |
| `gap-6` (24px) | Section-level grid gaps |
| `space-y-4` | Vertical stacking in form sections |
| `space-y-1.5` (6px) | Within `CardHeader` (title → description) |
| `mb-6` | Page section separation |
| `px-3 py-2` | Input fields |
| `px-4 py-2` | Default button padding |
| `h-10` (40px) | Input height, default button height |
| `h-9` (36px) | `sm` button |
| `h-11` (44px) | `lg` button |

### 4.3 Layout Grid

| Context | Pattern |
|---|---|
| Dashboard main | `flex-1 min-w-0 p-4 lg:p-6`, max-w-7xl mx-auto |
| Stat cards | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4` |
| Two-column sections | `grid grid-cols-1 lg:grid-cols-2 gap-6` |
| Full-width tables | Full container width, scrollable `overflow-x-auto` |
| Header | `sticky top-0 z-50 h-16 backdrop-blur bg-background/95` |

---

## Section 5 — Component Inventory

### 5.1 `components/ui/` (50 Components — shadcn/ui Based)

| Category | Components |
|---|---|
| **Layout** | accordion, card, collapsible, resizable, scroll-area, separator, tabs |
| **Overlay** | alert-dialog, dialog, drawer, hover-card, popover, sheet, tooltip |
| **Navigation** | breadcrumb, context-menu, dropdown-menu, menubar, navigation-menu, pagination |
| **Forms** | checkbox, date-range-picker, form, input, input-otp, label, radio-group, select, slider, switch, textarea, toggle, toggle-group |
| **Feedback** | alert, badge, loading-spinner, progress, skeleton, sonner, toast, toaster |
| **Display** | aspect-ratio, avatar, calendar, carousel, table, virtual-list |
| **Custom** | church-logo, lazy-image, logo, task-card, use-toast |
| **Utility** | button, command |

### 5.2 Key Component Variants

#### Button (`components/ui/button.tsx`)
```
Variants: default | destructive | outline | secondary | ghost | link
Sizes:    default (h-10 px-4) | sm (h-9 px-3) | lg (h-11 px-8) | icon (h-10 w-10 p-2)
```
All variants use CSS variable tokens. **Exception:** Feature-level buttons override with hardcoded gradient classes (e.g., `bg-gradient-to-r from-blue-500 to-purple-600`).

#### Badge (`components/ui/badge.tsx`)
```
Variants: default | secondary | destructive | outline     ← use CSS var tokens ✅
          success (bg-green-500)                           ← hardcoded Tailwind ❌
          warning (bg-yellow-500)                          ← hardcoded Tailwind ❌
```

#### Card (`components/ui/card.tsx`)
```
Root:        rounded-lg border bg-card text-card-foreground shadow-sm
CardHeader:  flex flex-col space-y-1.5 p-6
CardTitle:   text-2xl font-semibold leading-none tracking-tight
CardDescription: text-sm text-muted-foreground
CardContent: p-6 pt-0
CardFooter:  flex items-center p-6 pt-0
```

#### Input (`components/ui/input.tsx`)
```
Base: flex h-10 w-full rounded-md border border-input bg-background 
      px-3 py-2 text-sm ring-offset-background
      placeholder:text-muted-foreground
      focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
      disabled:cursor-not-allowed disabled:opacity-50
```
All tokens — compliant with design system. ✅

### 5.3 Feature Component Directories

| Directory | Contents |
|---|---|
| `components/analytics/` | Analytics widgets, chart wrappers |
| `components/auth/` | Sign-in form, auth guards |
| `components/automation-rules/` | Rule builder components |
| `components/child-security/` | Secure check-in form, pickup auth |
| `components/dashboard/` | Dashboard stat cards, summaries |
| `components/donations/` | Donation forms, transaction history |
| `components/email-templates/` | Email template editors |
| `components/help/` | Help modals, tooltips |
| `components/layout/` | Header, sidebar (mobile + desktop) |
| `components/members/` | Member cards, profiles, lifecycle badges |
| `components/permissions/` | Role-based visibility wrappers |
| `components/platform/` | Platform admin components |
| `components/prayer-wall/` | Prayer request cards, status toggles |
| `components/realtime/` | SSE connection indicators, live feeds |
| `components/sermons/` | Sermon cards, media players |
| `components/shepherds-log/` | Pastor notes, follow-up log |
| `components/triage/` | Priority classification UI |
| `components/visitor-automation/` | Visitor profile forms, CRM cards |
| `components/volunteers/` | Volunteer roster, availability tables |
| `components/website-builder/` | Website page editor components |
| `components/website-requests/` | Service request forms |

### 5.4 Navigation — Active State

Sidebar nav items (mobile-sidebar.tsx):
```
Active item:   bg-accent text-accent-foreground font-medium   ← CSS tokens ✅
Active parent: bg-accent/50 text-accent-foreground            ← CSS tokens ✅
Section btn:   text-blue-700 bg-blue-50 hover:bg-blue-100    ← Hardcoded ❌
```

---

## Section 6 — UI Pain Points

### Priority 1 — Breaking Design Token Consistency

**P1-A: Badge `success`/`warning` variants use hardcoded Tailwind colors**
- `bg-green-500` and `bg-yellow-500` don't respond to theme changes
- No dark mode adjustment
- **Fix:** Add `--success: 142 76% 36%` and `--warning: 38 92% 50%` to `globals.css`, update badge.tsx

**P1-B: Feature-level CTA buttons hardcode gradient colors**
- `bg-gradient-to-r from-blue-500 to-purple-600` in check-ins, social-media (~8 instances)
- These gradients are invisible to any future brand customization
- **Fix:** Create a `btn-cta` CSS class in `globals.css` using CSS custom properties

**P1-C: `STATUS_COLORS` and `PRIORITY_COLORS` maps in visitor-followups bypass token system**
```tsx
// Current (bad):
const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  ...
}
// Fix: Extend badge variants to cover status + priority
```

**P1-D: Section expand buttons in sidebar use hardcoded blue**
- `text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200`
- Out of sync with sidebar's own active item pattern which correctly uses `bg-accent`

### Priority 2 — Semantic Token Gaps

**P2-A: `--secondary`, `--muted`, and `--accent` are identical**
- All three resolve to `hsl(220 14.3% 95.9%)` — the same light gray
- Hover states (`hover:bg-accent`) look identical to muted backgrounds
- Active sidebar items (`bg-accent`) are visually indistinguishable from secondary backgrounds
- **Fix:** Differentiate `--accent` to be a slightly more visible shade (e.g., `220 14.3% 90%`)

**P2-B: No success/warning semantic tokens**
- Status-positive elements (member joined, donation received) use hardcoded Tailwind
- No system-level green or amber tokens exist in `globals.css`

**P2-C: `--primary` in light mode is near-black (`~#111d2e`)**
- The visual language has blue as a primary interactive color (`#3B82F6` appears in viewport meta, inline event styles, profile defaults)
- But the design token `--primary` is dark navy
- This creates a split identity: the brand is perceived as blue but the token system is dark-navy
- **Recommendation:** Either align `--primary` with the brand blue, or formally define a separate `--brand` token

**P2-D: No chart color token system**
- Recharts colors are duplicated across analytics, prayer wall, social media dashboards
- **Fix:** Create `lib/chart-colors.ts` exporting named constants:
  ```ts
  export const CHART_COLORS = {
    primary: '#3b82f6',
    secondary: '#10b981',
    warning: '#f59e0b',
    purple: '#8b5cf6',
    cyan: '#06b6d4',
  }
  ```

### Priority 3 — Font & Typography

**P3-A: No custom typeface**
- System font stack means brand appearance varies per OS/device
- Consider adopting Inter or Geist (Next.js 16 default) via `next/font/google` for consistency

**P3-B: No typography scale documentation**
- Heading levels (h1–h4) are inconsistently applied — some semantic headings use `<div>` + `text-2xl`
- No standard component for page H1 or section H2

### Priority 4 — Dark Mode Incompleteness

**P4-A: Feature-level gradient classes don't adapt to dark mode**
- `bg-gradient-to-r from-blue-50 to-indigo-50` cards (visible in dashboard, social media) are light-mode only
- In dark mode these produce pale pastel backgrounds against dark navy text — poor contrast

**P4-B: Recharts charts lose legibility in dark mode**
- Chart containers don't adapt fill/stroke colors to dark backgrounds
- No `className="dark:..."` modifiers on Recharts fill/stroke attributes

---

## Section 7 — Critical UI Flows

### 7.1 Check-In Flow (`/check-ins`)

**Purpose:** Register visitors and check-in children with security safeguards.

**Layout:** Two-tab interface (`Visitantes` | `Niños y Jóvenes`) with a floating QR generator dialog

**Visitor Tab:**
```
Form fields:  First name, Last name, Email, Phone
              isFirstTime toggle, Visit reason (text), Prayer request (textarea)
Components:   VisitorProfileForm (from components/visitor-automation/)
              Dialog + Form + Button
CTA Button:   bg-gradient-to-r from-blue-500 to-purple-600 text-white  ← hardcoded
```

**Children Tab:**
```
Form fields:  Child name, Child age
              Parent: name, phone, email
              Emergency contact: name, phone
              Allergies (textarea), Special needs (textarea)
              Security pin (auto-generated), Backup auth codes
Components:   SecureCheckInForm (from components/child-security/)
Data model:   backupAuthCodes, pickupAttempts, requiresBothAuth, 
              securityPin, biometricHash
Prominent icons: QrCode, Camera, Shield, Zap (lucide-react)
```

**QR Generator Dialog:**
- Opens on demand to display member/visitor QR for express check-in
- Exit route: dialog close button

**Pain Points:**
- CTA gradient bypasses design tokens
- Child security form has many sensitive fields — no visible loading/submitting state documented
- No visible error state for duplicate check-in detection in the UI layer

---

### 7.2 Prayer Wall (`/prayer-wall`)

**Purpose:** Submit, manage, and track prayer requests. Includes a full analytics dashboard.

**Layout:** Multi-tab page with analytics overview + request management

**Analytics Dashboard:**
```
Charts (Recharts):
  - LineChart  — requests over time (peticiones / aprobaciones / rechazos)
  - AreaChart  — contact growth trends
  - BarChart   — category distribution
  - PieChart   — engagement breakdown
  
Key metrics displayed:
  totalRequestsCount, totalContactos, averageResponseTime, 
  approvalRate, userEngagementScore
  
Data: categories[] with color field (hardcoded per category)
      trends.requestsOverTime, trends.contactGrowth
```

**Pain Points:**
- Heavy Recharts usage with no shared CHART_COLORS constant (colors defined inline or per-component)
- `userEngagementScore` label in English within Spanish UI ← localization violation
- Analytics tabs require multiple API calls — no visible skeleton loading per chart
- Category colors stored as raw hex in DB — unable to theme via CSS tokens

---

### 7.3 Visitor Follow-Up (`/visitor-follow-ups`)

**Purpose:** Track and act on follow-up tasks for visitors and new members.

**Layout:** Filtered card list with action buttons

**Card Structure:**
```
Header:  Visitor name + isFirstTime badge + TYPE_LABELS chip
Body:    Email, phone, visitorType
         scheduledAt timestamp
         notes text
Footer:  "Completar" button (marks done)
```

**Filter:** Status select (pending → all). Prioritization: first-timers first, then chronological.

**Status Color Map (hardcoded):**
```ts
pending:   bg-yellow-100 text-yellow-800 border-yellow-200
completed: bg-green-100  text-green-800  border-green-200
scheduled: bg-blue-100   text-blue-800   border-blue-200
skipped:   bg-gray-100   text-gray-800   border-gray-200
```

**Priority Color Map (hardcoded):**
```ts
high:   bg-red-100    text-red-700
medium: bg-yellow-100 text-yellow-700
low:    bg-gray-100   text-gray-600
```

**Type Labels (Spanish — compliant):**
```ts
call | email | visit | automatic | custom_form_submission | 
visitor_form_submission | prayer_request | first_time
```

**Pain Points:**
- Status and priority color maps are module-local constants — any reuse in another component would cause duplication
- No skeleton loading state during initial fetch
- "Completar" button has no disabled/loading state visible in component code
- No pagination — full list loaded at once (potential performance issue with large churches)

---

## Summary & Prioritized Recommendations

### Quick Wins (1–3 hours each)
1. Create `lib/chart-colors.ts` with a shared `CHART_COLORS` palette — eliminates Recharts duplication
2. Add `--success` and `--warning` tokens to `globals.css`, update `badge.tsx` success/warning variants
3. Replace `STATUS_COLORS` and `PRIORITY_COLORS` local maps in visitor-followups with extended badge variants
4. Fix sidebar section expand button (`text-blue-700 bg-blue-50`) → use `text-accent-foreground bg-accent/50`

### Medium Priority (half-day each)
5. Differentiate `--accent` from `--muted`/`--secondary` so hover states are visible
6. Extract gradient CTA pattern into a reusable CSS utility (`btn-cta-gradient`)
7. Add Next.js font optimization (`next/font`) for Inter or Geist — brand consistency across devices
8. Add skeleton loaders to Prayer Wall chart sections

### Strategic (requires design alignment)
9. Resolve the `--primary` / brand blue conflict — align token with actual interactive color or add `--brand-primary`
10. Add dark mode support to Recharts components (dynamic fill/stroke based on `prefers-color-scheme`)
11. Build a `DESIGN_TOKENS.ts` export that mirrors `globals.css` values — enables consistent JS-side theming (Recharts, inline styles)
12. Consider creating a minimal Storybook instance for the 50 `components/ui/` components

---

*Audit generated from: `app/globals.css`, `tailwind.config.ts`, `components/ui/*`, `components/layout/mobile-sidebar.tsx`, `components/layout/header.tsx`, `app/layout.tsx`, `app/(dashboard)/layout.tsx`, `app/(dashboard)/check-ins/_components/check-ins-client.tsx`, `app/(dashboard)/prayer-wall/page.tsx`, `app/(dashboard)/visitor-follow-ups/_components/visitor-followups-client.tsx`, `app/(dashboard)/home/_components/dashboard-client.tsx`, `app/(dashboard)/social-media/_components/analytics-dashboard.tsx`*
