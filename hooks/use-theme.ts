"use client";
// hooks/use-theme.ts
// Thin wrapper around next-themes that exposes isDark + toggle.
// All cosmos components import from here — never from next-themes directly.
// next-themes applies data-theme="dark"|"light" to <html> automatically.

import { useTheme as useNextTheme } from "next-themes";

export type Theme = "dark" | "light";

export interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
  isDark: boolean;
}

export function useTheme(): ThemeCtx {
  const { resolvedTheme, setTheme } = useNextTheme();
  const isDark = (resolvedTheme ?? "dark") !== "light";
  const theme: Theme = isDark ? "dark" : "light";
  const toggle = () => setTheme(isDark ? "light" : "dark");
  return { theme, toggle, isDark };
}
