"use client";
// components/cosmos/cosmos-stat-card.tsx
// Animated stat card with live counter, glow, and progress bar.

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type DeltaDir = "up" | "down" | "neutral";

interface CosmosStatCardProps {
  label: string;
  value: number;
  suffix?: string;
  delta?: string;
  deltaDir?: DeltaDir;
  accentColor?: string;       // CSS color value
  glowColor?: string;
  progressWidth?: number;     // 0-100
  animationDelay?: number;    // ms
  className?: string;
}

function useCountUp(target: number, duration = 1800, delay = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      let start: number | null = null;
      function step(ts: number) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        setCount(Math.round(ease * target));
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, duration, delay]);
  return count;
}

const DELTA_STYLES: Record<DeltaDir, string> = {
  up: "text-emerald-400",
  down: "text-rose-400",
  neutral: "text-slate-400",
};

export function CosmosStatCard({
  label,
  value,
  suffix = "",
  delta,
  deltaDir = "neutral",
  accentColor = "#F0B83C",
  glowColor,
  progressWidth = 70,
  animationDelay = 0,
  className,
}: CosmosStatCardProps) {
  const count = useCountUp(value, 1800, animationDelay);
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), animationDelay);
    return () => clearTimeout(t);
  }, [animationDelay]);

  const glow = glowColor ?? accentColor;

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-xl cursor-pointer group",
        "border transition-all duration-300",
        "hover:-translate-y-1",
        className
      )}
      style={{
        padding: "14px 16px",
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(13,22,40,0.75)",
        backdropFilter: "blur(12px)",
        transition: "transform 0.2s var(--ease-spring), border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = accentColor + "50";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)";
      }}
    >
      {/* Radial gradient overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `radial-gradient(ellipse at 0% 0%, ${accentColor}09 0%, transparent 70%)`,
          transition: "opacity 0.3s",
        }}
      />

      {/* Glow orb top-right */}
      <div
        aria-hidden
        style={{
          position: "absolute", top: -24, right: -24,
          width: 64, height: 64, borderRadius: "50%",
          background: glow,
          opacity: 0.1,
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          fontSize: "10px",
          color: "hsl(var(--muted-foreground))",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}>
          {label}
        </div>

        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: "24px",
          fontWeight: 700,
          color: "hsl(var(--foreground))",
          lineHeight: 1,
          marginBottom: "5px",
        }}>
          {count.toLocaleString("es-CO")}{suffix}
        </div>

        {delta && (
          <div style={{ fontSize: "10px", display: "flex", alignItems: "center", gap: "3px" }}
            className={DELTA_STYLES[deltaDir]}>
            {deltaDir === "up" ? "↑" : deltaDir === "down" ? "↓" : "·"} {delta}
          </div>
        )}
      </div>

      {/* Animated progress bar */}
      <div
        aria-hidden
        style={{
          position: "absolute", bottom: 0, left: 0,
          height: "2px",
          background: "rgba(255,255,255,0.05)",
          width: "100%",
        }}
      >
        <div
          style={{
            height: "100%",
            background: `linear-gradient(90deg, ${accentColor}, ${accentColor}44)`,
            borderRadius: "0 2px 2px 0",
            width: mounted ? `${progressWidth}%` : "0%",
            transition: `width 1.4s ${animationDelay + 200}ms cubic-bezier(0.16,1,0.3,1)`,
          }}
        />
      </div>
    </div>
  );
}
