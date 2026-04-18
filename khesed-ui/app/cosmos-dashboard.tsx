"use client";
// app/(dashboard)/home/cosmos-dashboard.tsx
// The living Cosmos Dashboard — drop-in replacement for dashboard-client.tsx
//
// INSTALLATION:
// 1. Copy styles/cosmos-tokens.css → import in app/globals.css
// 2. Copy all component files to their directories
// 3. Copy lib/chart-colors.ts → import in all Recharts components
// 4. Replace the current dashboard-client.tsx with this file
// 5. Run: npm install (no new packages needed — uses existing stack)

import { useState, useEffect } from "react";
import { CosmosBackground } from "@/components/cosmos/cosmos-background";
import { ConstellationMap } from "@/components/cosmos/constellation-map";
import { CosmosStatCard } from "@/components/cosmos/cosmos-stat-card";
import { CoverageCosmosCard } from "@/components/volunteers/coverage-cosmos-card";
import { ShepherdsLogCosmos } from "@/components/dashboard/shepherds-log-cosmos";
import { TriageCosmosAlert } from "@/components/triage/triage-cosmos-alert";
import { useMouseTrail } from "@/hooks/use-mouse-trail";

// ─── SIDEBAR NAV ─────────────────────────────────────────────
const NAV_ITEMS = [
  { section: "Ministerio" },
  { icon: "⬡", label: "Dashboard",        active: true },
  { icon: "🐑", label: "Miembros" },
  { icon: "🙏", label: "Muro de Oración",  badge: "3",  badgeType: "alert" as const },
  { icon: "👥", label: "Visitantes",       badge: "8",  badgeType: "success" as const },
  { icon: "📖", label: "Sermones" },
  { section: "Operaciones" },
  { icon: "🤝", label: "Voluntarios",     badge: "1",  badgeType: "alert" as const },
  { icon: "📅", label: "Eventos" },
  { icon: "💛", label: "Grupos Pequeños" },
  { icon: "💰", label: "Mayordomía" },
  { section: "Inteligencia" },
  { icon: "⚡", label: "12 Agentes IA" },
  { icon: "📊", label: "Analítica" },
  { icon: "🛡", label: "Triaje Espiritual" },
  { icon: "📋", label: "Informe de Junta" },
  { section: "Sistema" },
  { icon: "⚙", label: "Configuración" },
  { icon: "🔐", label: "Seguridad" },
] as const;

type BadgeType = "alert" | "success";

function SidebarBadge({ count, type }: { count: string; type: BadgeType }) {
  const styles: Record<BadgeType, React.CSSProperties> = {
    alert:   { background: "rgba(232,72,85,0.15)", color: "#ff8a93", border: "1px solid rgba(232,72,85,0.25)" },
    success: { background: "rgba(29,201,140,0.15)", color: "#5ff5c8", border: "1px solid rgba(29,201,140,0.25)" },
  };
  return (
    <span style={{
      marginLeft: "auto", padding: "1px 6px", borderRadius: "10px",
      fontSize: "9px", fontWeight: 500, ...styles[type],
    }}>{count}</span>
  );
}

// ─── PRAYER WATCHMAN CARD ────────────────────────────────────
interface PrayerEvent {
  icon: string;
  name: string;
  location: string;
  time: string;
  countdown: string;
  urgent?: boolean;
}

const PRAYER_EVENTS: PrayerEvent[] = [
  { icon: "🏥", name: "Cirugía — María L.",       location: "Hospital Santa Sofía", time: "9:00 AM",  countdown: "EN 12 MIN", urgent: true },
  { icon: "⚖️", name: "Audiencia — Carlos B.",     location: "Juzgado Civil",       time: "10:30 AM", countdown: "en 1h 42m" },
  { icon: "✈️", name: "Viaje misionero — Fam. Torres", location: "Vuelo a Bogotá",  time: "2:15 PM",  countdown: "en 5h 27m" },
];

// ─── AGENT LIST ──────────────────────────────────────────────
const AGENTS_STATUS = [
  { name: "Ag.2 Triaje",          color: "#E84855", runs: "ACTIVO — alerta",    emoji: "🔴" },
  { name: "Ag.4 Vigilante Oración", color: "#26D9D9", runs: "En 12 min",         emoji: "🟡" },
  { name: "Ag.5 Shepherd Log",    color: "#F0B83C", runs: "4 alertas activas",  emoji: "🟢" },
  { name: "Ag.7 Burnout Sentinel", color: "#F0B83C", runs: "1 alerta detectada", emoji: "🟢" },
  { name: "★ Ag.12 Cobertura",   color: "#F0B83C", runs: "Cascada activa",      emoji: "🟡" },
  { name: "Ag.6 Liderazgo",       color: "#1DC98C", runs: "3 candidatos",        emoji: "🟢" },
  { name: "Ag.8 Visitantes",      color: "#26D9D9", runs: "Últ: hace 3 días",    emoji: "🟢" },
  { name: "Ag.11 Junta",          color: "#9B8FFF", runs: "Generado 1-Abr",      emoji: "🟢" },
];

// ─── MAIN COMPONENT ──────────────────────────────────────────
export function CosmosDashboard() {
  useMouseTrail();
  const [showAlert, setShowAlert] = useState(false);

  // Simulate triage alert appearing after 3 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowAlert(true), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* Living star field */}
      <CosmosBackground />

      {/* Main layout grid */}
      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", height: "100vh",
        display: "grid",
        gridTemplateRows: "56px 1fr",
        gridTemplateColumns: "216px 1fr 272px",
        fontFamily: "var(--font-body)",
        overflow: "hidden",
      }}>

        {/* ─ HEADER ─ */}
        <header style={{
          gridColumn: "1/-1",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 20px 0 16px",
          borderBottom: "1px solid rgba(201,146,42,0.15)",
          background: "rgba(5,8,15,0.75)",
          backdropFilter: "blur(20px)",
        }}>
          {/* Logo */}
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            fontFamily: "var(--font-display)",
            fontSize: "15px", fontWeight: 700,
            letterSpacing: "0.06em", color: "#F0B83C",
          }}>
            <div style={{ position: "relative", width: "26px", height: "26px" }}>
              <div style={{
                position: "absolute", left: "50%", top: 0, bottom: 0,
                width: "3px", background: "#F0B83C", borderRadius: "2px",
                transform: "translateX(-50%)",
              }} />
              <div style={{
                position: "absolute", top: "38%", left: 0, right: 0,
                height: "3px", background: "#F0B83C", borderRadius: "2px",
                transform: "translateY(-50%)",
              }} />
              <div style={{
                position: "absolute", top: -2, right: -2,
                width: "9px", height: "9px",
                background: "#F0B83C", borderRadius: "50% 50% 50% 0",
                transform: "rotate(45deg)",
                boxShadow: "0 0 6px #F0B83C",
              }} />
            </div>
            KHESED·TEK
          </div>

          {/* Live status */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "#1DC98C",
              animation: "livePulse 1.4s ease-in-out infinite",
            }} />
            <span style={{ fontSize: "10px", letterSpacing: "0.12em", color: "#1DC98C", textTransform: "uppercase" }}>
              Sistema en vivo · 12 Agentes Activos
            </span>
          </div>

          {/* Right controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {["🗓 Domingo · 9:00 AM", "✅ Cobertura 94%"].map(label => (
              <div key={label} style={{
                padding: "4px 10px", borderRadius: "20px", fontSize: "11px",
                border: "1px solid rgba(201,146,42,0.3)",
                color: "#D4A843", background: "rgba(201,146,42,0.08)",
                cursor: "pointer", transition: "all 0.2s",
              }}>{label}</div>
            ))}
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: "linear-gradient(135deg,#7A5218,#C9922A)",
              border: "1.5px solid #C9922A",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: 600, color: "#05080F", cursor: "pointer",
              fontFamily: "var(--font-display)",
            }}>NC</div>
          </div>
        </header>

        {/* ─ SIDEBAR ─ */}
        <nav style={{
          gridColumn: 1, gridRow: 2,
          borderRight: "1px solid rgba(201,146,42,0.1)",
          background: "rgba(5,8,15,0.6)",
          backdropFilter: "blur(16px)",
          overflowY: "auto", overflowX: "hidden",
          padding: "12px 0",
        }}>
          {NAV_ITEMS.map((item, i) => {
            if ("section" in item) {
              return (
                <div key={i} style={{
                  padding: "8px 16px 4px",
                  fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "#7A5218", marginTop: i > 0 ? "8px" : 0,
                }}>{item.section}</div>
              );
            }
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "9px",
                padding: "7px 16px", margin: "1px 8px", borderRadius: "6px",
                fontSize: "12px",
                color: item.active ? "#F0B83C" : "rgba(138,147,168,0.8)",
                cursor: "pointer",
                background: item.active ? "rgba(201,146,42,0.12)" : "transparent",
                border: item.active ? "1px solid rgba(201,146,42,0.2)" : "1px solid transparent",
                position: "relative",
                transition: "all 0.15s",
              }}>
                {item.active && (
                  <div style={{
                    position: "absolute", left: 0, top: "20%", bottom: "20%",
                    width: "2px", background: "#F0B83C", borderRadius: "0 2px 2px 0",
                  }} />
                )}
                <span style={{ fontSize: "14px", width: "16px", textAlign: "center" }}>{item.icon}</span>
                {item.label}
                {"badge" in item && item.badge && (
                  <SidebarBadge count={item.badge} type={item.badgeType as BadgeType} />
                )}
              </div>
            );
          })}
        </nav>

        {/* ─ MAIN CONTENT ─ */}
        <main style={{
          gridColumn: 2, gridRow: 2,
          overflowY: "auto", overflowX: "hidden",
          padding: "18px 16px",
        }}>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px", fontWeight: 600,
            color: "hsl(var(--foreground))", letterSpacing: "0.03em", marginBottom: "2px",
          }}>
            Control Pastoral
          </div>
          <div style={{ fontSize: "11px", color: "hsl(var(--muted-foreground))", marginBottom: "16px", letterSpacing: "0.04em" }}>
            Iglesia Vida Nueva · Barranquilla, Colombia · Domingo 9:00 AM
          </div>

          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "8px", marginBottom: "14px" }}>
            <CosmosStatCard label="Asistencia Hoy"      value={347} delta="12% vs sem. anterior" deltaDir="up"   accentColor="#1DC98C" progressWidth={78} animationDelay={0}   />
            <CosmosStatCard label="Voluntarios Activos" value={89}  delta="Cobertura 94% ✓"      deltaDir="up"   accentColor="#C9922A" progressWidth={68} animationDelay={120} />
            <CosmosStatCard label="Nuevos Visitantes"   value={23}  delta="8% este mes"          deltaDir="up"   accentColor="#26D9D9" progressWidth={55} animationDelay={240} />
            <CosmosStatCard label="Peticiones Oración"  value={47}  delta="3 sin respuesta →"    deltaDir="down" accentColor="#E84855" progressWidth={42} animationDelay={360} />
          </div>

          {/* Constellation map */}
          <ConstellationMap className="mb-3" style={{ marginBottom: "14px" }} />

          {/* Bottom grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>

            {/* Coverage card */}
            <CoverageCosmosCard />

            {/* Prayer Watchman */}
            <div style={{
              borderRadius: "12px",
              border: "1px solid rgba(201,146,42,0.15)",
              background: "rgba(13,22,40,0.72)",
              backdropFilter: "blur(12px)",
              padding: "15px", position: "relative", overflow: "hidden",
            }}>
              <div aria-hidden style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "1px",
                background: "linear-gradient(90deg, transparent, rgba(38,217,217,0.5), transparent)",
              }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <div style={{ fontSize: "12px", fontWeight: 500, color: "hsl(var(--foreground))" }}>
                  ⏰ Vigilante de Oración — Próximas Alarmas
                </div>
                <div style={{
                  fontSize: "9px", padding: "3px 8px", borderRadius: "10px",
                  background: "rgba(240,184,60,0.12)", color: "#F0B83C",
                  border: "1px solid rgba(240,184,60,0.25)",
                }}>3 eventos hoy</div>
              </div>

              {PRAYER_EVENTS.map((ev, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "7px 8px", borderRadius: "8px", marginBottom: "5px",
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  cursor: "pointer", transition: "all 0.15s",
                }}>
                  <div style={{ fontSize: "14px", flexShrink: 0 }}>{ev.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "11px", color: "hsl(var(--foreground))" }}>{ev.name}</div>
                    <div style={{ fontSize: "9px", color: "hsl(var(--muted-foreground))" }}>{ev.location}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "11px", color: "#26D9D9", fontWeight: 500 }}>{ev.time}</div>
                    <div style={{
                      fontSize: "9px",
                      color: ev.urgent ? "#E84855" : "hsl(var(--muted-foreground))",
                      animation: ev.urgent ? "countdown 1s step-start infinite" : "none",
                    }}>
                      {ev.urgent ? "⚡ " : ""}{ev.countdown}
                    </div>
                  </div>
                </div>
              ))}

              <div style={{
                marginTop: "10px", padding: "9px 10px",
                borderRadius: "8px",
                background: "rgba(38,217,217,0.06)",
                border: "1px solid rgba(38,217,217,0.15)",
              }}>
                <div style={{ fontSize: "10px", color: "#26D9D9", fontWeight: 500, marginBottom: "4px" }}>
                  📲 Seguimiento 24h enviado ayer:
                </div>
                <div style={{ fontSize: "10px", color: "hsl(var(--muted-foreground))" }}>
                  "Oramos por ti. ¿Cómo estás hoy?" → Ana García, Pedro Ruiz (+2)
                </div>
                <div style={{ fontSize: "9px", color: "#1DC98C", marginTop: "3px" }}>
                  ✓ 2 de 3 respondieron con gratitud
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* ─ RIGHT PANEL ─ */}
        <aside style={{
          gridColumn: 3, gridRow: 2,
          borderLeft: "1px solid rgba(201,146,42,0.1)",
          background: "rgba(5,8,15,0.55)",
          backdropFilter: "blur(16px)",
          overflowY: "auto", overflowX: "hidden",
          padding: "14px 12px",
        }}>

          {/* Metric rings */}
          <div style={{ marginBottom: "18px" }}>
            <div style={{
              fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase",
              color: "#7A5218", marginBottom: "10px",
              display: "flex", alignItems: "center", gap: "6px",
            }}>
              Salud de la Iglesia
              <div style={{ flex: 1, height: "1px", background: "rgba(201,146,42,0.12)" }} />
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              {[
                { val: "89%", lbl: "Retención",  color: "#1DC98C" },
                { val: "94%", lbl: "Cobertura",  color: "#F0B83C" },
                { val: "73",  lbl: "Engagement", color: "#26D9D9" },
              ].map(({ val, lbl, color }) => (
                <div key={lbl} style={{
                  flex: 1, padding: "10px 6px",
                  borderRadius: "9px", textAlign: "center",
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(13,22,40,0.5)",
                  position: "relative", overflow: "hidden",
                }}>
                  <div aria-hidden style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)",
                    animation: "shimmerSlide 3s ease-in-out infinite",
                  }} />
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color }}>{val}</div>
                  <div style={{ fontSize: "9px", color: "hsl(var(--muted-foreground))", marginTop: "2px" }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Agent status list */}
          <div style={{ marginBottom: "18px" }}>
            <div style={{
              fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase",
              color: "#7A5218", marginBottom: "10px",
              display: "flex", alignItems: "center", gap: "6px",
            }}>
              Estado de los 12 Agentes
              <div style={{ flex: 1, height: "1px", background: "rgba(201,146,42,0.12)" }} />
            </div>
            {AGENTS_STATUS.map((ag) => (
              <div key={ag.name} style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "5px 8px", borderRadius: "7px", marginBottom: "2px",
                cursor: "pointer", transition: "background 0.15s",
              }}
                onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)"}
                onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
              >
                <div style={{
                  width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0,
                  background: ag.color, color: ag.color,
                  animation: "orbLive 2s ease-in-out infinite",
                  boxShadow: `0 0 4px ${ag.color}`,
                }} />
                <div style={{ fontSize: "11px", color: "hsl(var(--muted-foreground))", flex: 1 }}>{ag.name}</div>
                <div style={{ fontSize: "9px", color: "rgba(138,147,168,0.5)" }}>{ag.runs}</div>
                <div style={{ fontSize: "11px" }}>{ag.emoji}</div>
              </div>
            ))}
          </div>

          {/* Shepherd's Log */}
          <ShepherdsLogCosmos />
        </aside>
      </div>

      {/* Triage alert */}
      {showAlert && (
        <TriageCosmosAlert onDismiss={() => setShowAlert(false)} />
      )}

      {/* Global animation keyframes */}
      <style>{`
        @keyframes livePulse {
          0%   { box-shadow: 0 0 0 0 rgba(29,201,140,0.6) }
          70%  { box-shadow: 0 0 0 8px rgba(29,201,140,0) }
          100% { box-shadow: 0 0 0 0 rgba(29,201,140,0) }
        }
        @keyframes orbLive {
          0%,100% { opacity: 1 }
          50%      { opacity: 0.5 }
        }
        @keyframes countdown {
          0%,100% { opacity: 1 }
          50%      { opacity: 0.35 }
        }
        @keyframes shimmerSlide {
          0%   { transform: translateX(-100%) }
          100% { transform: translateX(100%) }
        }
        @keyframes cascadeActive {
          0%,100% { box-shadow: 0 0 0 0 rgba(240,184,60,0.5) }
          50%      { box-shadow: 0 0 0 6px rgba(240,184,60,0) }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg) }
          to   { transform: rotate(360deg) }
        }
      `}</style>
    </>
  );
}
