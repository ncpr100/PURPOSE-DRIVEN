// tailwind.config.ts ΓÇö Khesed-Tek Cosmos Design System
// Extends shadcn/ui base with full Cosmos token system

import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      // ΓöÇΓöÇΓöÇ FONTS ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
      fontFamily: {
        display: ["Cinzel", "Georgia", ...fontFamily.serif],
        body:    ["DM Sans", ...fontFamily.sans],
        sans:    ["DM Sans", ...fontFamily.sans],
      },

      // ΓöÇΓöÇΓöÇ COLORS (CSS var ΓåÆ tailwind class) ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
      colors: {
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",

        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // ΓöÇ New semantic tokens ΓöÇ
        success: {
          DEFAULT:    "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT:    "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT:    "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },

        // ΓöÇ Brand palette ΓöÇ
        gold: {
          DEFAULT: "hsl(var(--brand-gold))",
          bright:  "hsl(var(--brand-gold-bright))",
          dim:     "hsl(var(--brand-gold-dim))",
        },
        navy: {
          DEFAULT: "hsl(var(--brand-navy))",
          deep:    "hsl(var(--brand-navy-deep))",
          mid:     "hsl(var(--brand-navy-mid))",
          light:   "hsl(var(--brand-navy-light))",
        },
        cosmos: {
          emerald:  "#1DC98C",
          cyan:     "#26D9D9",
          rose:     "#E84855",
          lavender: "#9B8FFF",
          amber:    "#F0B83C",
        },

        // ΓöÇ Chart palette ΓöÇ
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
          "6": "hsl(var(--chart-6))",
        },
      },

      // ΓöÇΓöÇΓöÇ BORDER RADIUS ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
      borderRadius: {
        lg:  "var(--radius)",
        md:  "calc(var(--radius) - 2px)",
        sm:  "calc(var(--radius) - 4px)",
        xl:  "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },

      // ΓöÇΓöÇΓöÇ TYPOGRAPHY SCALE ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],   // 10px
        xs:    ["0.6875rem", { lineHeight: "1rem" }],       // 11px
        sm:    ["0.8125rem", { lineHeight: "1.25rem" }],    // 13px
        base:  ["0.9375rem", { lineHeight: "1.5rem" }],     // 15px
        lg:    ["1.0625rem", { lineHeight: "1.625rem" }],   // 17px
        xl:    ["1.1875rem", { lineHeight: "1.75rem" }],    // 19px
        "2xl": ["1.375rem",  { lineHeight: "1.875rem" }],   // 22px
        "3xl": ["1.625rem",  { lineHeight: "2.125rem" }],   // 26px
        "4xl": ["2rem",      { lineHeight: "2.5rem" }],     // 32px
      },

      // ΓöÇΓöÇΓöÇ SHADOWS ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
      boxShadow: {
        cosmos:   "var(--shadow-md)",
        "cosmos-lg": "var(--shadow-lg)",
        gold:     "var(--shadow-gold)",
        emerald:  "var(--shadow-emerald)",
        rose:     "var(--shadow-rose)",
      },

      // ΓöÇΓöÇΓöÇ ANIMATIONS ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to:   { transform: "translateX(0)",    opacity: "1" },
        },
        "live-pulse": {
          "0%":   { boxShadow: "0 0 0 0 hsl(158 76% 36% / 0.6)" },
          "70%":  { boxShadow: "0 0 0 8px hsl(158 76% 36% / 0)" },
          "100%": { boxShadow: "0 0 0 0 hsl(158 76% 36% / 0)" },
        },
        "gold-pulse": {
          "0%":   { boxShadow: "0 0 0 0 hsl(38 92% 50% / 0.6)" },
          "70%":  { boxShadow: "0 0 0 8px hsl(38 92% 50% / 0)" },
          "100%": { boxShadow: "0 0 0 0 hsl(38 92% 50% / 0)" },
        },
        shimmer: {
          "0%":   { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "float-y": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-5px)" },
        },
        "rotate-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "fade-up":        "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in":        "fade-in 0.4s ease-out both",
        "slide-in-right": "slide-in-right 0.4s cubic-bezier(0.16,1,0.3,1)",
        "live-pulse":     "live-pulse 1.4s ease-in-out infinite",
        "gold-pulse":     "gold-pulse 1.2s ease-in-out infinite",
        shimmer:          "shimmer 2s ease-in-out infinite",
        "float-y":        "float-y 3s ease-in-out infinite",
        "rotate-slow":    "rotate-slow 20s linear infinite",
      },

      // ΓöÇΓöÇΓöÇ BACKDROP BLUR ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
      backdropBlur: {
        cosmos: "16px",
        "cosmos-sm": "8px",
        "cosmos-lg": "24px",
      },

      // ΓöÇΓöÇΓöÇ SPACING ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
      spacing: {
        "4.5": "1.125rem",
        "13": "3.25rem",
        "15": "3.75rem",
        "18": "4.5rem",
      },

      // ΓöÇΓöÇΓöÇ Z-INDEX ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
      zIndex: {
        cosmos:  "0",   // star field
        content: "1",   // main content
        nav:     "50",  // sidebar/header
        overlay: "60",  // modals
        toast:   "70",  // notifications
        triage:  "80",  // triage alerts
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Custom plugin for cosmos utilities
    function({ addUtilities }: { addUtilities: Function }) {
      addUtilities({
        ".cosmos-scrollbar": {
          "scrollbar-width": "thin",
          "scrollbar-color": "rgba(201,146,42,0.2) transparent",
          "&::-webkit-scrollbar": { width: "4px", height: "4px" },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(201,146,42,0.2)",
            borderRadius: "4px",
          },
        },
        ".no-scrollbar": {
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": { display: "none" },
        },
        ".text-balance": { "text-wrap": "balance" },
      });
    },
  ],
};

export default config;
