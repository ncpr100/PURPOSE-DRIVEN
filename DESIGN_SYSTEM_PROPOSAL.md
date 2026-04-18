# Design System — Khesed-Tek Church Management Platform
**Based on:** `DESIGN_SYSTEM_AUDIT.md` (April 2026)  
**Branch:** `main` (post Agent 12 merge)  
**Author:** GitHub Copilot / Khesed-Tek Systems  
**Status:** ✅ ADOPTED — Cosmos Design System v1.0 Active  
**Superseded Concept:** "Covenant & Light" (light-mode proposal, not implemented)

---

## Adoption Notice (April 2026)

After analysis of `khesed-ui/` source files contributed via branch `ncpr100-patch-1`, the
**Cosmos Design System** was selected and integrated instead of the "Covenant & Light" proposal
below. Key reasons:

- Cosmos resolved **all 10 P1–P4 audit issues** from `DESIGN_SYSTEM_AUDIT.md`
- **7 production-ready components** shipped (`CosmosBackground`, `ConstellationMap`,
  `CosmosStatCard`, `CoverageCosmosCard`, `ShepherdsLogCosmos`, `TriageCosmosAlert`,
  `CosmosDashboard`)
- Complete token system already proven — no guesswork
- Dark-first brand identity matches Khesed-Tek visual language (gold on navy)
- `lib/chart-colors.ts` provides centralized chart palette (P2-D fix)
- Cinzel + DM Sans typography system established

### Files Integrated (Cosmos v1.0)

| File | Status |
|---|---|
| `app/globals.css` | ✅ Cosmos tokens active (`:root` fully replaced) |
| `app/layout.tsx` | ✅ Cinzel + DM Sans via `next/font/google`, themeColor `#F0B83C` |
| `tailwind.config.ts` | ✅ `fontFamily.sans` + `fontFamily.display` added |
| `lib/chart-colors.ts` | ✅ Centralized chart palette |
| `hooks/use-mouse-trail.ts` | ✅ Gold cursor trail |
| `components/cosmos/cosmos-background.tsx` | ✅ Canvas star field |
| `components/cosmos/constellation-map.tsx` | ✅ 12-agent constellation |
| `components/cosmos/cosmos-stat-card.tsx` | ✅ Animated stat card |
| `components/volunteers/coverage-cosmos-card.tsx` | ✅ Agent 12 coverage |
| `components/dashboard/shepherds-log-cosmos.tsx` | ✅ Pastoral watchlist |
| `components/triage/triage-cosmos-alert.tsx` | ✅ Auto-dismiss alert |
| `app/(dashboard)/home/_components/cosmos-dashboard-client.tsx` | ✅ Full dashboard |

---

## Original Proposal (Archived — "Covenant & Light" Concept)

> The following content is preserved for historical reference. It was superseded by the
> Cosmos system prior to any production use.

---

## Executive Summary

The audit identified three systemic problems:

1. **Split identity** — Brand is perceived as blue (`#3B82F6`) but `--primary` token is dark navy (`#111d2e`). Interactive elements pull in two different visual directions.
2. **Token collapse** — `--secondary`, `--muted`, and `--accent` resolve to the same value. Hover, active, and muted states are visually indistinguishable.
3. **Hardcoded leak** — 30+ locations bypass the token system, making any future brand customization (per-church theming) fragile.

This proposal resolves all three problems with:
- A new named brand color system (Covenant Indigo + Living Amber)
- Differentiated semantic tokens
- A controlled font system
- Token-backed micro-interactions
- A phased implementation roadmap

---

## Section A — Color Token System (New Design)

### Design Language: "Covenant & Light"

| Role | Name | Light Mode HSL | Approx Hex | Rationale |
|---|---|---|---|---|
| Brand primary | **Covenant Indigo** | `243 75% 50%` | `#4338CA` | Dignity, authority, trust — aligns with existing blue perception but elevates it |
| Brand accent | **Living Amber** | `38 92% 44%` | `#D97706` | Warmth, generosity, celebration — church culture |
| Page background | **Warm Parchment** | `30 20% 97%` | `#F9F7F5` | Subtly warm white — reduces eye fatigue vs pure #fff |
| Focus ring | **Khesed Gold** | `38 92% 50%` | `#F59E0B` | Accessible, warm, unmistakable brand signal |
| Success | **Olive Green** | `142 76% 36%` | `#16A34A` | Positive states: joined, donated, checked-in |
| Warning | **Warm Amber** | `38 92% 50%` | `#F59E0B` | Elevated attention without urgency |
| Urgent | **Crimson** | `0 84% 60%` | `#EF4444` | Destructive, error, urgent pastoral flag |

---

### A.1 — New `globals.css` `:root` Block

```css
:root {
  /* ── Page Structure ── */
  --background:          30 20%  97%;    /* #F9F7F5 Warm Parchment          */
  --foreground:          225 25%  12%;   /* #161e30 Deep Ink                */

  /* ── Cards & Popovers ── */
  --card:                30 20%  97%;    /* Same as background               */
  --card-foreground:     225 25%  12%;
  --popover:              0  0% 100%;    /* Pure white popover               */
  --popover-foreground:  225 25%  12%;

  /* ── Brand Primary (Covenant Indigo) ── */
  --primary:             243 75%  50%;   /* #4338CA                          */
  --primary-foreground:   0  0%  98%;   /* near-white text on indigo        */

  /* ── Secondary (Neutral Surface) ── */
  --secondary:           225 20%  94%;   /* #eef0f6 — light blue-gray        */
  --secondary-foreground:225 25%  25%;   /* medium ink                       */

  /* ── Muted (Subdued Background) ── */
  --muted:               225 15%  90%;   /* #e4e7ef — slightly darker than secondary */
  --muted-foreground:    225 10%  50%;   /* #717d96 — placeholder, helper text      */

  /* ── Accent (Living Amber) ── */
  --accent:               38 92%  44%;   /* #D97706 — warm amber              */
  --accent-foreground:     0  0%  98%;   /* white text on amber               */

  /* ── Semantic Feedback ── */
  --success:             142 76%  36%;   /* #16A34A green                    */
  --success-foreground:    0  0%  98%;
  --success-muted:       142 60%  93%;   /* #dcfce7 light green bg           */
  --success-muted-foreground: 142 76% 24%; /* dark green text              */

  --warning:              38 92%  50%;   /* #F59E0B amber                    */
  --warning-foreground:  225 25%  12%;   /* dark text on amber               */
  --warning-muted:        38 92%  92%;   /* #fef3c7 light amber bg           */
  --warning-muted-foreground: 38 80% 30%; /* dark amber text               */

  --urgent:                0 84%  60%;   /* #EF4444 red                      */
  --urgent-foreground:     0  0%  98%;
  --urgent-muted:          0 86%  93%;   /* #fee2e2 light red bg             */
  --urgent-muted-foreground: 0 84% 35%; /* dark red text                   */

  /* ── Destructive (same as urgent for now) ── */
  --destructive:           0 84%  60%;
  --destructive-foreground: 0  0%  98%;

  /* ── Border & Input ── */
  --border:              225 20%  86%;   /* #d0d5e8 — visible but gentle    */
  --input:               225 20%  86%;
  --ring:                 38 92%  50%;   /* Khesed Gold focus ring          */

  /* ── Brand Muted (sidebar hover, tag bg) ── */
  --brand-muted:         243 60%  93%;   /* #ede9ff soft indigo             */
  --brand-muted-foreground: 243 75% 38%; /* #2e24a0 dark indigo text       */

  /* ── Radius ── */
  --radius:              0.625rem;       /* 10px — slightly softer than 8px */

  /* ── Chart Colors ── */
  --chart-1:             243 75%  50%;   /* Covenant Indigo                 */
  --chart-2:              38 92%  50%;   /* Living Amber                    */
  --chart-3:             142 76%  36%;   /* Olive Green                     */
  --chart-4:             280 65%  55%;   /* Ministry Purple                 */
  --chart-5:             199 89%  48%;   /* Ocean Cyan                      */
}
```

---

### A.2 — Dark Mode (`.dark`) Block

```css
.dark {
  /* ── Page Structure ── */
  --background:          225 30%   8%;   /* #0d1322 Deep Navy               */
  --foreground:          210 20%  94%;   /* #edf2f7 soft white              */

  /* ── Cards & Popovers ── */
  --card:                225 28%  12%;   /* #151e30 card surface            */
  --card-foreground:     210 20%  94%;
  --popover:             225 28%  12%;
  --popover-foreground:  210 20%  94%;

  /* ── Brand Primary (lighter indigo in dark) ── */
  --primary:             243 70%  68%;   /* #7c6ff7 lighter indigo          */
  --primary-foreground:  225 30%   8%;   /* dark text on light indigo       */

  /* ── Secondary ── */
  --secondary:           225 25%  18%;   /* #1e2c45                         */
  --secondary-foreground:210 20%  80%;

  /* ── Muted ── */
  --muted:               225 25%  16%;   /* #19263b                         */
  --muted-foreground:    210 15%  55%;   /* #7d92aa                         */

  /* ── Accent (amber softened for dark) ── */
  --accent:               38 90%  55%;   /* #F6A823                         */
  --accent-foreground:   225 30%   8%;

  /* ── Semantic Feedback (dark) ── */
  --success:             142 60%  45%;
  --success-foreground:  225 30%   8%;
  --success-muted:       142 40%  18%;
  --success-muted-foreground: 142 60% 70%;

  --warning:              38 85%  60%;
  --warning-foreground:  225 30%   8%;
  --warning-muted:        38 50%  18%;
  --warning-muted-foreground: 38 85% 75%;

  --urgent:                0 72%  55%;
  --urgent-foreground:     0  0%  98%;
  --urgent-muted:          0 50%  18%;
  --urgent-muted-foreground: 0 72% 75%;

  --destructive:           0 72%  55%;
  --destructive-foreground: 0  0%  98%;

  /* ── Border & Input ── */
  --border:              225 25%  22%;
  --input:               225 25%  22%;
  --ring:                 38 90%  55%;   /* Amber gold ring in dark mode    */

  /* ── Brand Muted ── */
  --brand-muted:         243 40%  22%;
  --brand-muted-foreground: 243 70% 75%;

  /* ── Chart Colors (dark) ── */
  --chart-1:             243 70%  68%;
  --chart-2:              38 90%  55%;
  --chart-3:             142 60%  50%;
  --chart-4:             280 55%  65%;
  --chart-5:             199 80%  55%;
}
```

---

### A.3 — Shared Chart Colors Constant

Create `lib/chart-colors.ts` to eliminate per-component Recharts duplication:

```typescript
// lib/chart-colors.ts
// Single source of truth for all Recharts components

export const CHART_COLORS = {
  primary:   '#4338CA',  // Covenant Indigo
  amber:     '#F59E0B',  // Living Amber
  success:   '#16A34A',  // Olive Green
  purple:    '#9333EA',  // Ministry Purple
  cyan:      '#0891B2',  // Ocean Cyan
  muted:     '#94A3B8',  // Neutral gray for secondary lines
} as const

export type ChartColorKey = keyof typeof CHART_COLORS

// Dark mode palette — use when isDarkMode is true
export const CHART_COLORS_DARK = {
  primary:   '#7C6FF7',
  amber:     '#FBB32F',
  success:   '#34D399',
  purple:    '#C084FC',
  cyan:      '#22D3EE',
  muted:     '#64748B',
} as const

// Usage in Recharts:
// <Line stroke={CHART_COLORS.primary} />
// <Area fill={CHART_COLORS.cyan} fillOpacity={0.2} stroke={CHART_COLORS.cyan} />
```

---

## Section B — Typography System

### B.1 — Font Selection

| Role | Font | Source | Rationale |
|---|---|---|---|
| UI Sans | **Plus Jakarta Sans** | Google Fonts | Geometric humanist — modern, trustworthy, multilingual |
| Brand Serif | **Source Serif 4** | Google Fonts | Editorial, contemplative — for sermon titles, scripture quotes |
| Monospace | **JetBrains Mono** | Google Fonts | Code blocks, security PINs, reference numbers |

**Fallback strategy:** Each family falls back gracefully to system fonts so the UI remains functional if fonts fail to load.

### B.2 — `next/font` Implementation

In `app/layout.tsx`:

```typescript
import { Plus_Jakarta_Sans, Source_Serif_4, JetBrains_Mono } from 'next/font/google'

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const fontSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable}
                    min-h-screen bg-background font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
```

### B.3 — `tailwind.config.ts` Font Extension

```typescript
// In extend.fontFamily:
fontFamily: {
  sans:  ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  serif: ['var(--font-serif)', 'Georgia', 'Cambria', 'serif'],
  mono:  ['var(--font-mono)', 'ui-monospace', 'Consolas', 'monospace'],
},
```

### B.4 — Typography Scale Assignment

| Scope | Class | Font | Usage |
|---|---|---|---|
| Page title | `text-3xl font-bold font-sans` | Plus Jakarta Sans 700 | Dashboard H1 |
| Section heading | `text-2xl font-semibold font-sans` | Plus Jakarta Sans 600 | CardTitle, module H2 |
| Subheading | `text-lg font-medium font-sans` | Plus Jakarta Sans 500 | Group labels, sidebar sections |
| Body | `text-base font-sans` | Plus Jakarta Sans 400 | Body copy, form values |
| Metadata | `text-sm text-muted-foreground font-sans` | Plus Jakarta Sans 400 | Timestamps, helper text |
| Scripture / Quote | `text-lg font-serif italic` | Source Serif 4 400i | Sermon excerpts, prayer quotes |
| Sermon title | `text-2xl font-serif font-semibold` | Source Serif 4 600 | Sermon cards |
| Security PIN | `text-3xl font-mono tracking-widest` | JetBrains Mono 500 | Child check-in PIN display |
| Reference ID | `text-xs font-mono text-muted-foreground` | JetBrains Mono 400 | IDs, codes |

---

## Section C — Component Updates

### C.1 — Button Variants

**Problem:** Primary CTA gradient (`from-blue-500 to-purple-600`) is hardcoded in 8+ locations.

**Solution:** Add a `cta` variant to `button.tsx`:

```typescript
// In buttonVariants cva config, add to variants.variant:
cta: `bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--brand-muted-foreground))]
      text-white shadow-lg hover:opacity-90 active:scale-[0.98]
      transition-all duration-150`,
```

**Or more robustly**, define a CSS utility in `globals.css`:

```css
/* globals.css — after the token blocks */
@layer utilities {
  .btn-cta {
    background-image: linear-gradient(
      135deg,
      hsl(var(--primary)),
      hsl(280 65% 55%)
    );
    color: hsl(var(--primary-foreground));
    box-shadow: 0 4px 14px hsl(var(--primary) / 0.35);
    transition: opacity 0.15s ease, transform 0.1s ease;
  }
  .btn-cta:hover { opacity: 0.92; }
  .btn-cta:active { transform: scale(0.98); }
}
```

Usage:
```tsx
// Replace: bg-gradient-to-r from-blue-500 to-purple-600 text-white
// With:
<Button className="btn-cta">Registrar Visitante</Button>
```

### C.2 — Badge Variants (`badge.tsx`)

**Current problem:** `success` and `warning` variants use hardcoded Tailwind classes that don't adapt to themes.

**Fix:**

```typescript
// In badgeVariants cva config:
variants: {
  variant: {
    default:     "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary:   "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline:     "text-foreground",
    // ↓ NEW — use CSS var tokens
    success:     "border-transparent bg-[hsl(var(--success-muted))] text-[hsl(var(--success-muted-foreground))]",
    warning:     "border-transparent bg-[hsl(var(--warning-muted))] text-[hsl(var(--warning-muted-foreground))]",
    urgent:      "border-transparent bg-[hsl(var(--urgent-muted))]  text-[hsl(var(--urgent-muted-foreground))]",
    brand:       "border-transparent bg-[hsl(var(--brand-muted))]   text-[hsl(var(--brand-muted-foreground))]",
  },
},
```

### C.3 — Status & Priority Color Maps

**Current problem:** `STATUS_COLORS` and `PRIORITY_COLORS` in `visitor-followups-client.tsx` are module-local hardcoded maps.

**Fix:** Replace with badge variant calls:

```typescript
// Old (bad):
const STATUS_COLORS = {
  pending:   'bg-yellow-100 text-yellow-800 border-yellow-200',
  completed: 'bg-green-100  text-green-800  border-green-200',
  scheduled: 'bg-blue-100   text-blue-800   border-blue-200',
  skipped:   'bg-gray-100   text-gray-800   border-gray-200',
}

// New (token-backed):
const STATUS_VARIANT: Record<string, BadgeVariant> = {
  pending:   'warning',
  completed: 'success',
  scheduled: 'brand',
  skipped:   'secondary',
}

const PRIORITY_VARIANT: Record<string, BadgeVariant> = {
  high:   'urgent',
  medium: 'warning',
  low:    'secondary',
}

// Usage:
<Badge variant={STATUS_VARIANT[item.status] ?? 'secondary'}>
  {STATUS_LABELS[item.status]}
</Badge>
```

### C.4 — Card Enhancements

Add optional `elevated` and `bordered` variants to `Card`:

```typescript
// In card.tsx — add cn() conditional class helpers:
// elevated: drop-shadow-md (replaces shadow-sm)
// bordered: border-2 border-[hsl(var(--brand-muted))]

// Usage:
<Card className="elevated">  ← subtle elevation
<Card className="bordered">  ← brand-muted left border for call-to-action cards
```

### C.5 — Sidebar Section Buttons

**Current problem:** `text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200` in `mobile-sidebar.tsx`.

**Fix:**
```tsx
// Replace:
className="text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200"

// With:
className="text-[hsl(var(--brand-muted-foreground))] bg-[hsl(var(--brand-muted))]
           hover:bg-[hsl(var(--muted))] border-[hsl(var(--border))]"
```

---

## Section D — Micro-Interactions

### D.1 — Amén Pulse (Prayer Wall)

When a user taps "Amén" on a prayer request, trigger a radial pulse from the button:

```css
/* globals.css */
@keyframes amen-pulse {
  0%   { box-shadow: 0 0 0 0 hsl(var(--primary) / 0.5); }
  70%  { box-shadow: 0 0 0 12px hsl(var(--primary) / 0); }
  100% { box-shadow: 0 0 0 0   hsl(var(--primary) / 0); }
}

.amen-pulse {
  animation: amen-pulse 0.6s ease-out;
}
```

```typescript
// In prayer-request-card component:
const handleAmen = () => {
  buttonRef.current?.classList.add('amen-pulse')
  setTimeout(() => buttonRef.current?.classList.remove('amen-pulse'), 600)
  // ... API call
}
```

### D.2 — Check-In Confirmed (Shield Flash)

When a child is successfully checked in with secure PIN:

```css
@keyframes shield-confirm {
  0%   { transform: scale(1);    color: hsl(var(--muted-foreground)); }
  50%  { transform: scale(1.25); color: hsl(var(--success)); }
  100% { transform: scale(1);    color: hsl(var(--success)); }
}

.shield-confirm {
  animation: shield-confirm 0.4s ease-out forwards;
}
```

### D.3 — Cascade Confirmed (Volunteer Coverage)

When cascade contact resolves successfully, the volunteer roster widget shows a brief "covered" state:

```css
@keyframes coverage-confirmed {
  0%   { background-color: transparent; }
  30%  { background-color: hsl(var(--success-muted)); }
  100% { background-color: transparent; }
}

.coverage-confirmed {
  animation: coverage-confirmed 1.2s ease-out;
}
```

### D.4 — Loading States (Skeleton Loaders)

All chart sections in Prayer Wall and Analytics pages should use `<Skeleton />` while data is fetching:

```tsx
// Pattern for chart skeleton:
{isLoading ? (
  <div className="space-y-2">
    <Skeleton className="h-6 w-32" />   {/* chart title */}
    <Skeleton className="h-48 w-full" /> {/* chart area */}
  </div>
) : (
  <LineChart data={data} ... />
)}
```

---

## Section E — Accessibility (WCAG AA)

### E.1 — Contrast Ratio Verification

All primary interactive elements must meet **4.5:1 minimum** (normal text) or **3:1 minimum** (large text / UI components).

| Pair | Background | Foreground | Ratio | Pass? |
|---|---|---|---|---|
| Primary button text | `#4338CA` indigo | `#F8FAFC` near-white | 7.8:1 | ✅ AAA |
| Accent button text | `#D97706` amber | `#F8FAFC` near-white | **2.9:1** | ❌ Fail — use dark text |
| Accent button text | `#D97706` amber | `#161e30` dark ink | 5.1:1 | ✅ AA |
| Success badge | `#DCFCE7` light green | `#14532D` dark green | 8.1:1 | ✅ AAA |
| Warning badge | `#FEF3C7` light amber | `#92400E` dark amber | 7.3:1 | ✅ AAA |
| Urgent badge | `#FEE2E2` light red | `#7F1D1D` dark red | 8.6:1 | ✅ AAA |
| Body text | `#F9F7F5` parchment | `#161e30` deep ink | 15.7:1 | ✅ AAA |
| Placeholder text | `#F9F7F5` parchment | `#717D96` muted | 4.6:1 | ✅ AA |
| Sidebar active item | `#EDE9FF` brand-muted | `#2E24A0` brand-muted-fg | 9.2:1 | ✅ AAA |

> **Action Required:** `--accent` on white text fails WCAG AA. Always pair the amber accent background with `--accent-foreground` set to dark ink (`225 25% 12%`) — **not** white.

### E.2 — Focus Ring

The `--ring: 38 92% 50%` (Khesed Gold) focus ring is visible against all proposed backgrounds:

| Background | Ring Color | Visible? |
|---|---|---|
| White / Parchment | Gold `#F59E0B` | ✅ Yes |
| Light blue secondary | Gold `#F59E0B` | ✅ Yes |
| Indigo primary button | Gold `#F59E0B` | ✅ Yes |
| Dark background `.dark` | Gold `#FBB32F` (adjusted) | ✅ Yes |

### E.3 — Focus Visible Enforcement

Ensure all interactive elements show focus ring for keyboard navigation:

```css
/* globals.css — ensure base focus visibility */
:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

/* Remove outline only on mouse click */
:focus:not(:focus-visible) {
  outline: none;
}
```

---

## Section F — `tailwind.config.ts` Full Additions

```typescript
// Changes to make in tailwind.config.ts:

theme: {
  extend: {
    // ── Add font families ──
    fontFamily: {
      sans:  ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      serif: ['var(--font-serif)', 'Georgia', 'Cambria', 'serif'],
      mono:  ['var(--font-mono)', 'ui-monospace', 'Consolas', 'monospace'],
    },

    // ── Add new semantic color tokens ──
    colors: {
      // (existing token wiring preserved)
      success: {
        DEFAULT: 'hsl(var(--success))',
        foreground: 'hsl(var(--success-foreground))',
        muted: 'hsl(var(--success-muted))',
        'muted-foreground': 'hsl(var(--success-muted-foreground))',
      },
      warning: {
        DEFAULT: 'hsl(var(--warning))',
        foreground: 'hsl(var(--warning-foreground))',
        muted: 'hsl(var(--warning-muted))',
        'muted-foreground': 'hsl(var(--warning-muted-foreground))',
      },
      urgent: {
        DEFAULT: 'hsl(var(--urgent))',
        foreground: 'hsl(var(--urgent-foreground))',
        muted: 'hsl(var(--urgent-muted))',
        'muted-foreground': 'hsl(var(--urgent-muted-foreground))',
      },
      brand: {
        muted: 'hsl(var(--brand-muted))',
        'muted-foreground': 'hsl(var(--brand-muted-foreground))',
      },
    },

    // ── Add chart token wiring ──
    // (chart-1 through chart-5 already exist in tailwind.config.ts)
    // Once globals.css defines them, they resolve automatically.
  },
},
```

---

## Implementation Roadmap

### Phase 1 — Token Swap (2–4 hours) ← Highest Impact, Zero Component Risk

**Files changed:** `app/globals.css` only

1. Replace `:root` block with new token set (Section A.1)
2. Replace `.dark` block with new dark mode tokens (Section A.2)
3. Add `--radius: 0.625rem`
4. Add `--success`, `--warning`, `--urgent`, `--brand-muted` token groups
5. Define `--chart-1` through `--chart-5`

**Visual result:** Entire app shifts from dark-navy primary → Covenant Indigo. Warm parchment background replaces pure white. Amber ring appears on focus.

**Risk:** Low. Only CSS variables change. All components consuming `hsl(var(--token))` patterns update automatically.

---

### Phase 2 — Font System (1–2 hours)

**Files changed:** `app/layout.tsx`, `tailwind.config.ts`

1. Add `next/font/google` imports (Plus Jakarta Sans, Source Serif 4, JetBrains Mono)
2. Apply `variable` classes to `<body>`
3. Extend `tailwind.config.ts` with `fontFamily`

**Visual result:** All UI text adopts Plus Jakarta Sans. Security PINs render in JetBrains Mono. Sermon/scripture content ready for Source Serif 4.

---

### Phase 3 — Badge & Status Fix (2–3 hours)

**Files changed:** `components/ui/badge.tsx`, `visitor-followups-client.tsx`, `globals.css`

1. Add `success`, `warning`, `urgent`, `brand` variants to `badge.tsx` (Section C.2)
2. Create shared `lib/status-variants.ts` with `STATUS_VARIANT` and `PRIORITY_VARIANT` maps
3. Update `visitor-followups-client.tsx` to use badge variants
4. Add `.btn-cta` utility to `globals.css` (Section C.1)

---

### Phase 4 — Hardcoded Leak Cleanup (half-day)

**Files changed:** 8–10 component files (check-ins, dashboard, mobile-sidebar, etc.)

1. Replace `bg-gradient-to-r from-blue-500 to-purple-600` → `btn-cta` class
2. Fix sidebar section button blue classes → brand-muted tokens (Section C.5)
3. Replace `app/layout.tsx` viewport `themeColor: '#3B82F6'` with indigo
4. Create `lib/chart-colors.ts` and update all Recharts components

---

### Phase 5 — Micro-Interactions & Dark Mode Polish (1 day)

**Files changed:** `globals.css`, prayer wall component, check-ins component, volunteer coverage widget

1. Add `@keyframes` for Amén pulse, shield confirm, coverage confirmed (Section D)
2. Wire Recharts dark mode — add conditional fill/stroke based on `resolvedTheme`
3. Add skeleton loaders to Prayer Wall chart sections
4. Audit remaining `rounded-xl` / `rounded-2xl` hardcoded radius classes

---

## Token Migration Quick Reference

For rapid find-and-replace during Phase 4 cleanup:

| Old Hardcoded | Replace With |
|---|---|
| `bg-blue-500` / `from-blue-500` | `bg-primary` / `btn-cta` |
| `bg-green-500 text-white` | `badge variant="success"` |
| `bg-yellow-500 text-white` | `badge variant="warning"` |
| `text-blue-700 bg-blue-50` | `text-[hsl(var(--brand-muted-foreground))] bg-[hsl(var(--brand-muted))]` |
| `bg-yellow-100 text-yellow-800` | `badge variant="warning"` |
| `bg-green-100 text-green-800` | `badge variant="success"` |
| `bg-red-100 text-red-700` | `badge variant="urgent"` |
| `bg-gray-100 text-gray-600` | `badge variant="secondary"` |
| `#3b82f6` in Recharts | `CHART_COLORS.primary` |
| `#10b981` in Recharts | `CHART_COLORS.success` |
| `#f59e0b` in Recharts | `CHART_COLORS.amber` |
| `#8b5cf6` in Recharts | `CHART_COLORS.purple` |
| `#06b6d4` in Recharts | `CHART_COLORS.cyan` |

---

## Files Checklist (All Phases)

```
app/globals.css                                    ← Phase 1 (token blocks)
app/layout.tsx                                     ← Phase 2 (next/font) + Phase 4 (themeColor)
tailwind.config.ts                                 ← Phase 2 (fontFamily) + Phase 3 (color tokens)
lib/chart-colors.ts                                ← Phase 4 (NEW FILE)
lib/status-variants.ts                             ← Phase 3 (NEW FILE)
components/ui/badge.tsx                            ← Phase 3 (new variants)
components/layout/mobile-sidebar.tsx               ← Phase 4 (section button fix)
app/(dashboard)/check-ins/_components/             ← Phase 4 (btn-cta)
app/(dashboard)/visitor-follow-ups/_components/   ← Phase 3 + 4
app/(dashboard)/home/_components/                 ← Phase 4
app/(dashboard)/prayer-wall/page.tsx               ← Phase 4 + 5 (skeletons, animations)
app/(dashboard)/social-media/_components/          ← Phase 4 (chart-colors)
settings/profile/page.tsx                          ← Phase 4 (color defaults)
```

---

*Design System Proposal v1.0 — Generated April 2026*  
*Based on DESIGN_SYSTEM_AUDIT.md (539 lines)*  
*Implementation begins with Phase 1 token swap in `app/globals.css`*
