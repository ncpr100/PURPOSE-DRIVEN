// lib/chart-colors.ts
// Fixes Design Audit P2-D: centralized chart color system
// Use these constants in ALL Recharts components — never hardcode hex values

export const CHART_COLORS = {
  gold:     '#C9922A',
  emerald:  '#1DC98C',
  cyan:     '#26D9D9',
  lavender: '#9B8FFF',
  rose:     '#E84855',
  amber:    '#F0B83C',
} as const;

export type ChartColorKey = keyof typeof CHART_COLORS;

// Ordered palette for sequential chart series
export const CHART_PALETTE: string[] = [
  CHART_COLORS.gold,
  CHART_COLORS.emerald,
  CHART_COLORS.cyan,
  CHART_COLORS.lavender,
  CHART_COLORS.rose,
  CHART_COLORS.amber,
];

// Semantic colors for status-based charts
export const CHART_STATUS_COLORS = {
  confirmed:  CHART_COLORS.emerald,
  pending:    CHART_COLORS.amber,
  cancelled:  CHART_COLORS.rose,
  covered:    CHART_COLORS.cyan,
  unprotected: CHART_COLORS.rose,
  growing:    CHART_COLORS.emerald,
  stable:     CHART_COLORS.cyan,
  declining:  CHART_COLORS.rose,
} as const;

// Agent layer colors
export const AGENT_LAYER_COLORS = {
  pastoral:      CHART_COLORS.cyan,
  content:       CHART_COLORS.lavender,
  intelligence:  CHART_COLORS.emerald,
  operations:    CHART_COLORS.gold,
} as const;

// Dark mode safe — these work on dark navy backgrounds
export const DARK_CHART_GRID = 'rgba(255,255,255,0.06)';
export const DARK_CHART_AXIS = 'rgba(255,255,255,0.25)';
export const DARK_CHART_TOOLTIP_BG = '#0d1628';
export const DARK_CHART_TOOLTIP_BORDER = 'rgba(201,146,42,0.2)';
