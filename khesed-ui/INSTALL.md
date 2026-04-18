# Khesed-Tek Cosmos Design System
## Installation Guide

---

## What's in this package

```
styles/
  cosmos-tokens.css           → Drop into app/globals.css (replaces existing tokens)

lib/
  chart-colors.ts             → Import in ALL Recharts components

hooks/
  use-mouse-trail.ts          → Call once in root layout

components/
  cosmos/
    cosmos-background.tsx     → Living star field (put in root layout)
    constellation-map.tsx     → 12-agent living map
    cosmos-stat-card.tsx      → Animated stat cards with counters

  volunteers/
    coverage-cosmos-card.tsx  → Agent 12 coverage with cascade timeline

  dashboard/
    shepherds-log-cosmos.tsx  → Pastoral watchlist with WhatsApp actions

  triage/
    triage-cosmos-alert.tsx   → Real-time distress alert toast

app/
  cosmos-dashboard.tsx        → Full dashboard page (replaces dashboard-client.tsx)
```

---

## Step 1 — Import the token system

In `app/globals.css`, add at the top:

```css
@import './styles/cosmos-tokens.css';
```

Then remove or comment out the existing `:root` and `.dark` blocks — they are
replaced by the new token file which fixes all P1/P2 audit issues.

---

## Step 2 — Add the font

In `app/layout.tsx`, import the font:

```tsx
import { Cinzel, DM_Sans } from 'next/font/google';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-display',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
});
```

Add to the `<body>` className:
```tsx
<body className={`${cinzel.variable} ${dmSans.variable}`}>
```

---

## Step 3 — Add the cosmic background to root layout

In `app/(dashboard)/layout.tsx`:

```tsx
import { CosmosBackground } from '@/components/cosmos/cosmos-background';
import { useMouseTrail } from '@/hooks/use-mouse-trail';

// In the layout component:
export default function DashboardLayout({ children }) {
  return (
    <>
      <CosmosBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </>
  );
}
```

---

## Step 4 — Replace the dashboard

Replace `app/(dashboard)/home/_components/dashboard-client.tsx` with the
contents of `app/cosmos-dashboard.tsx`.

Or import and use the component:

```tsx
// app/(dashboard)/home/page.tsx
import { CosmosDashboard } from './cosmos-dashboard';
export default function HomePage() {
  return <CosmosDashboard />;
}
```

---

## Step 5 — Fix all Recharts components (P2-D audit fix)

In every file that uses Recharts, replace hardcoded colors:

```tsx
// BEFORE (bad — hardcoded):
<Line stroke="#3b82f6" />
<Bar fill="#10b981" />

// AFTER (correct — from shared config):
import { CHART_COLORS, DARK_CHART_GRID, DARK_CHART_AXIS } from '@/lib/chart-colors';
<Line stroke={CHART_COLORS.gold} />
<Bar fill={CHART_COLORS.emerald} />
<CartesianGrid stroke={DARK_CHART_GRID} />
<XAxis tick={{ fill: DARK_CHART_AXIS }} />
```

---

## Step 6 — Fix badge variants (P1-A audit fix)

In `components/ui/badge.tsx`, replace hardcoded success/warning:

```tsx
// BEFORE:
success: 'bg-green-500 text-white',
warning: 'bg-yellow-500 text-white',

// AFTER:
success: 'bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))] border border-[hsl(var(--success)/0.25)]',
warning: 'bg-[hsl(var(--warning)/0.12)] text-[hsl(var(--warning))] border border-[hsl(var(--warning)/0.25)]',
```

---

## Step 7 — Fix CTA gradient buttons (P1-B audit fix)

Replace all `bg-gradient-to-r from-blue-500 to-purple-600` with:

```tsx
className="btn-cta-gradient rounded-md px-4 py-2 text-sm"
```

The `btn-cta-gradient` class is defined in `cosmos-tokens.css`.

---

## Step 8 — Fix sidebar section buttons (P1-D audit fix)

In `components/layout/mobile-sidebar.tsx`, replace:

```tsx
// BEFORE:
'text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200'

// AFTER:
'text-[hsl(var(--accent-foreground))] bg-[hsl(var(--accent)/0.5)] hover:bg-[hsl(var(--accent))] border-[hsl(var(--accent))]'
```

---

## Audit Issues Resolved

| Audit ID | Issue | Status |
|---|---|---|
| P1-A | Badge success/warning hardcoded | ✅ Fixed — CSS tokens added |
| P1-B | CTA gradient buttons hardcoded | ✅ Fixed — btn-cta-gradient utility |
| P1-C | STATUS_COLORS / PRIORITY_COLORS | ✅ Fixed — badge variants |
| P1-D | Sidebar blue hardcoded | ✅ Fixed — accent tokens |
| P2-A | --accent = --muted = --secondary | ✅ Fixed — visually differentiated |
| P2-B | No success/warning tokens | ✅ Fixed — added to globals |
| P2-C | --primary vs brand blue conflict | ✅ Fixed — gold is now --primary |
| P2-D | No chart color system | ✅ Fixed — lib/chart-colors.ts |
| P3-A | No custom typeface | ✅ Fixed — Cinzel + DM Sans |
| P4-A | Gradients don't adapt to dark | ✅ Fixed — CSS var based |

---

## No new npm packages required

Everything uses your existing stack:
- `next/font/google` (already in Next.js 16)
- `react` + `typescript` (existing)
- Canvas API (native browser)
- CSS custom properties (native browser)

---

*Khesed-Tek Cosmos Design System v1.0*
*Built for the Latin American Church · khesed-tek-systems.org*
