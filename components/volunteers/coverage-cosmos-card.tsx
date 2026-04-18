"use client";
// components/volunteers/coverage-cosmos-card.tsx
// Agent 12 — real-time volunteer coverage display with animated cascade timeline.

import { useState, useEffect } from "react";
import { Shield, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";

type CoverageStatus = "CONFIRMED" | "COVERED" | "CANCELLED" | "UNPROTECTED" | "UNCONFIRMED";
type CascadeStep = "done" | "active" | "wait";

interface CoverageSlot {
  id: string;
  name: string;
  role: string;
  status: CoverageStatus;
}

interface CascadeStepData {
  label: string;
  sublabel: string;
  state: CascadeStep;
}

interface Props {
  slots?: CoverageSlot[];
  activeCascade?: {
    volunteerName: string;
    role: string;
    steps: CascadeStepData[];
  } | null;
  className?: string;
}

const STATUS_CONFIG: Record<CoverageStatus, {
  color: string;
  bg: string;
  border: string;
  icon: typeof ShieldCheck;
  label: string;
}> = {
  CONFIRMED:   { color: "#1DC98C", bg: "rgba(29,201,140,0.08)",  border: "rgba(29,201,140,0.0)",  icon: ShieldCheck, label: "✓" },
  COVERED:     { color: "#26D9D9", bg: "rgba(38,217,217,0.08)",  border: "rgba(38,217,217,0.15)", icon: ShieldCheck, label: "✓" },
  CANCELLED:   { color: "#F0B83C", bg: "rgba(240,184,60,0.06)",  border: "rgba(240,184,60,0.25)", icon: ShieldAlert, label: "Cascada" },
  UNPROTECTED: { color: "#E84855", bg: "rgba(232,72,85,0.08)",   border: "rgba(232,72,85,0.25)",  icon: ShieldX,     label: "Sin cobertura" },
  UNCONFIRMED: { color: "#94A3B8", bg: "rgba(148,163,184,0.05)", border: "rgba(148,163,184,0.1)", icon: Shield,      label: "Sin confirmar" },
};

function CoverageRow({ slot }: { slot: CoverageSlot }) {
  const cfg = STATUS_CONFIG[slot.status];
  const isCascade = slot.status === "CANCELLED";

  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: "8px",
        padding: "7px 9px",
        borderRadius: "8px",
        marginBottom: "4px",
        background: cfg.bg,
        border: `1px solid ${cfg.border || "rgba(255,255,255,0.04)"}`,
        cursor: "pointer",
        transition: "all 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = cfg.color + "44";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = cfg.border || "rgba(255,255,255,0.04)";
      }}
    >
      {/* Status dot */}
      <div style={{
        width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0,
        background: cfg.color,
        boxShadow: `0 0 6px ${cfg.color}`,
        animation: isCascade ? "livePulse 1.2s ease-in-out infinite" : "none",
      }} />

      <div style={{ fontSize: "11px", color: "hsl(var(--foreground))", flex: 1 }}>{slot.name}</div>
      <div style={{ fontSize: "10px", color: "hsl(var(--muted-foreground))" }}>{slot.role}</div>

      {/* Progress bar */}
      <div style={{ width: "48px", height: "3px", borderRadius: "3px", background: "rgba(255,255,255,0.06)", overflow: "hidden", flexShrink: 0 }}>
        <div style={{
          height: "100%",
          borderRadius: "3px",
          background: cfg.color,
          width: slot.status === "CONFIRMED" || slot.status === "COVERED" ? "100%" :
                 slot.status === "CANCELLED" ? "55%" : "25%",
          transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)",
        }} />
      </div>

      <div style={{
        fontSize: "10px", fontWeight: 500, padding: "2px 6px",
        borderRadius: "5px", background: cfg.color + "18", color: cfg.color, flexShrink: 0,
      }}>
        {cfg.label}
      </div>
    </div>
  );
}

function CascadeTimeline({ steps, volunteerName, role }: NonNullable<Props["activeCascade"]>) {
  const [localSteps, setLocalSteps] = useState(steps);

  // Simulate cascade progression
  useEffect(() => {
    const interval = setInterval(() => {
      setLocalSteps(prev => {
        const activeIdx = prev.findIndex(s => s.state === "active");
        const waitIdx = prev.findIndex(s => s.state === "wait");
        if (activeIdx === -1 || waitIdx === -1 || Math.random() > 0.35) return prev;
        return prev.map((s, i) => ({
          ...s,
          state: i === activeIdx ? "done" : i === waitIdx ? "active" : s.state,
        }));
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      marginTop: "12px", padding: "10px 12px",
      borderRadius: "8px",
      background: "rgba(8,14,28,0.6)",
      border: "1px solid rgba(201,146,42,0.12)",
    }}>
      <div style={{
        fontSize: "10px", color: "#C9922A",
        letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px",
      }}>
        Cascada activa — {volunteerName} · {role}
      </div>

      <div style={{ display: "flex", position: "relative" }}>
        {localSteps.map((step, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
            {/* Connector line */}
            {i < localSteps.length - 1 && (
              <div style={{
                position: "absolute", top: "9px", left: "50%", right: "-50%",
                height: "1px",
                background: step.state === "done"
                  ? "linear-gradient(90deg,#1DC98C44,#1DC98C22)"
                  : "rgba(201,146,42,0.15)",
                transition: "background 0.5s",
                zIndex: 0,
              }} />
            )}

            {/* Node */}
            <div style={{
              width: "20px", height: "20px", borderRadius: "50%",
              zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "9px", fontWeight: 700, marginBottom: "5px",
              border: "1.5px solid",
              transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
              ...(step.state === "done"    ? { background: "rgba(29,201,140,0.2)",  borderColor: "#1DC98C", color: "#1DC98C" } :
                  step.state === "active"  ? { background: "rgba(240,184,60,0.2)",  borderColor: "#F0B83C", color: "#F0B83C", animation: "cascadeActive 1.2s ease-in-out infinite" } :
                                             { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.15)", color: "rgba(138,147,168,0.6)" }),
            }}>
              {step.state === "done" ? "✓" : step.state === "active" ? "→" : i + 1}
            </div>

            <div style={{ fontSize: "8px", color: "rgba(138,147,168,0.7)", textAlign: "center", lineHeight: 1.35 }}>
              {step.label}<br /><span style={{ opacity: 0.7 }}>{step.sublabel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const DEFAULT_SLOTS: CoverageSlot[] = [
  { id: "1", name: "Marco A.",  role: "Alabanza",   status: "CONFIRMED" },
  { id: "2", name: "Ana R.",    role: "Tech/Audio",  status: "CONFIRMED" },
  { id: "3", name: "Luis V.",   role: "Ujieres",     status: "CANCELLED" },
  { id: "4", name: "Sofía M.",  role: "Niños",       status: "CONFIRMED" },
];

const DEFAULT_CASCADE_STEPS: CascadeStepData[] = [
  { label: "Pre-evento", sublabel: "48h",           state: "done"   },
  { label: "Suplente",   sublabel: "#1 rechazó",    state: "done"   },
  { label: "Suplente",   sublabel: "#2 esperando",  state: "active" },
  { label: "Suplente",   sublabel: "#3",            state: "wait"   },
  { label: "Emergency",  sublabel: "Skills IA",     state: "wait"   },
];

export function CoverageCosmosCard({
  slots = DEFAULT_SLOTS,
  activeCascade = {
    volunteerName: "Luis V.",
    role: "Ujieres",
    steps: DEFAULT_CASCADE_STEPS,
  },
  className,
}: Props) {
  const confirmed = slots.filter(s => ["CONFIRMED", "COVERED"].includes(s.status)).length;
  const rate = Math.round((confirmed / slots.length) * 100);

  return (
    <div
      className={className}
      style={{
        borderRadius: "12px",
        border: "1px solid rgba(201,146,42,0.15)",
        background: "rgba(13,22,40,0.72)",
        backdropFilter: "blur(12px)",
        padding: "15px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent line */}
      <div aria-hidden style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg, transparent, #C9922A66, transparent)",
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <div style={{ fontSize: "12px", fontWeight: 500, color: "hsl(var(--foreground))", letterSpacing: "0.03em", display: "flex", alignItems: "center", gap: "6px" }}>
          <Shield size={14} style={{ color: "#F0B83C" }} /> Agente 12 — Cobertura Dominical
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: "6px",
        }}>
          <span style={{
            fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 700,
            color: rate >= 90 ? "#1DC98C" : rate >= 70 ? "#F0B83C" : "#E84855",
          }}>{rate}%</span>
          <div style={{
            fontSize: "9px", padding: "3px 8px", borderRadius: "10px",
            background: "rgba(29,201,140,0.1)", color: "#1DC98C",
            border: "1px solid rgba(29,201,140,0.25)",
            letterSpacing: "0.06em",
          }}>
            ACTIVO
          </div>
        </div>
      </div>

      {/* Coverage slots */}
      {slots.map(slot => <CoverageRow key={slot.id} slot={slot} />)}

      {/* Cascade timeline */}
      {activeCascade && <CascadeTimeline {...activeCascade} />}
    </div>
  );
}
