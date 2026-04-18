"use client";
// components/cosmos/constellation-map.tsx
// The 12 AI agents rendered as a living star constellation.
// Each node floats, pulses, and connects via animated energy threads.

import { useEffect, useRef } from "react";
import { AGENT_LAYER_COLORS } from "@/lib/chart-colors";

interface AgentNode {
  name: string;
  shortName: string;
  x: number; // 0-1 relative
  y: number; // 0-1 relative
  color: string;
  active: boolean;
  core?: boolean;
  star?: boolean; // Agent 12 special shape
  layer: 0 | 1 | 2 | 3;
}

const AGENTS: AgentNode[] = [
  { name: "Ag.1 Motor Antifonal",      shortName: "Ag.1",  x: 0.15, y: 0.45, color: AGENT_LAYER_COLORS.content,      active: true,  layer: 1 },
  { name: "Ag.2 Triaje Espiritual",    shortName: "Ag.2",  x: 0.28, y: 0.22, color: AGENT_LAYER_COLORS.pastoral,     active: true,  layer: 0 },
  { name: "Ag.3 Filtro Contenido",     shortName: "Ag.3",  x: 0.18, y: 0.75, color: AGENT_LAYER_COLORS.content,      active: true,  layer: 1 },
  { name: "Ag.4 Vigilante Oración",    shortName: "Ag.4",  x: 0.40, y: 0.16, color: AGENT_LAYER_COLORS.pastoral,     active: true,  layer: 0 },
  { name: "Ag.5 Registro Pastor",      shortName: "Ag.5",  x: 0.50, y: 0.50, color: "#F0B83C",                       active: true,  layer: 0, core: true },
  { name: "Ag.6 Pipeline Liderazgo",   shortName: "Ag.6",  x: 0.62, y: 0.20, color: AGENT_LAYER_COLORS.intelligence, active: true,  layer: 2 },
  { name: "Ag.7 Centinela Burnout",    shortName: "Ag.7",  x: 0.74, y: 0.35, color: "#F0B83C",                       active: true,  layer: 2 },
  { name: "Ag.8 Conversión Visitantes",shortName: "Ag.8",  x: 0.80, y: 0.58, color: AGENT_LAYER_COLORS.pastoral,     active: true,  layer: 2 },
  { name: "Ag.9 Coach Mayordomía",     shortName: "Ag.9",  x: 0.66, y: 0.78, color: AGENT_LAYER_COLORS.intelligence, active: false, layer: 2 },
  { name: "Ag.10 Monitor Grupos",      shortName: "Ag.10", x: 0.44, y: 0.84, color: AGENT_LAYER_COLORS.content,      active: true,  layer: 2 },
  { name: "Ag.11 Sintetizador Junta",  shortName: "Ag.11", x: 0.30, y: 0.65, color: AGENT_LAYER_COLORS.intelligence, active: true,  layer: 2 },
  { name: "★ Ag.12 Cobertura",        shortName: "★12",   x: 0.87, y: 0.50, color: "#F0B83C",                       active: true,  layer: 3, star: true },
];

// Connection pairs [a_index, b_index]
const CONNECTIONS: [number, number][] = [
  [4, 1], [4, 2], [4, 0], [4, 3],
  [4, 5], [4, 6], [4, 7], [4, 8],
  [4, 9], [4, 10], [4, 11],
  [6, 7], [7, 11], [1, 3], [10, 11],
];

function drawStarShape(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  for (let p = 0; p < 10; p++) {
    const angle = (p * Math.PI) / 5 - Math.PI / 2;
    const pr = p % 2 === 0 ? r : r * 0.42;
    const px = x + pr * Math.cos(angle);
    const py = y + pr * Math.sin(angle);
    p === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
}

interface Props {
  className?: string;
}

export function ConstellationMap({ className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tickRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cw = 0, ch = 0;

    function resize() {
      if (!canvas) return;
      const rect = canvas.parentElement!.getBoundingClientRect();
      cw = canvas.width = rect.width;
      ch = canvas.height = rect.height;
    }
    resize();

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, cw, ch);
      tickRef.current += 0.012;
      const t = tickRef.current;

      // Animated connection threads
      CONNECTIONS.forEach(([ai, bi]) => {
        const a = AGENTS[ai], b = AGENTS[bi];
        if (!a || !b) return;
        const ax = a.x * cw, ay = a.y * ch;
        const bx = b.x * cw, by = b.y * ch;
        const grad = ctx.createLinearGradient(ax, ay, bx, by);
        grad.addColorStop(0, a.color + "44");
        grad.addColorStop(1, b.color + "44");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.7;
        ctx.setLineDash([3, 9]);
        ctx.lineDashOffset = -t * 14;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Agent nodes
      AGENTS.forEach((ag, i) => {
        const floatY = Math.sin(t + i * 0.71) * 4;
        const floatX = Math.cos(t * 0.5 + i * 0.4) * 1.5;
        const x = ag.x * cw + floatX;
        const y = ag.y * ch + floatY;
        const r = ag.core ? 11 : ag.star ? 10 : 6.5;

        // Outer glow halo
        const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
        glow.addColorStop(0, ag.color + (ag.active ? "40" : "14"));
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, r * 4, 0, Math.PI * 2);
        ctx.fill();

        // Node body
        ctx.save();
        ctx.globalAlpha = ag.active ? 0.92 : 0.3;
        ctx.fillStyle = ag.color;
        ctx.shadowColor = ag.color;
        ctx.shadowBlur = ag.star ? 20 : ag.core ? 16 : 9;

        if (ag.star) {
          drawStarShape(ctx, x, y, r);
        } else {
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.restore();

        // Core expanding pulse ring
        if (ag.core) {
          const ringPhase = t % 1;
          const ringR = r + ringPhase * 28;
          const alpha = Math.max(0, (1 - ringPhase) * 0.35);
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = ag.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(x, y, ringR, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          // Second ring offset
          const ring2Phase = (t + 0.5) % 1;
          const ring2R = r + ring2Phase * 28;
          const alpha2 = Math.max(0, (1 - ring2Phase) * 0.2);
          ctx.save();
          ctx.globalAlpha = alpha2;
          ctx.strokeStyle = ag.color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(x, y, ring2R, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Star agent pulse ring
        if (ag.star && ag.active) {
          const ringPhase = (t * 0.7) % 1;
          const ringR = r + ringPhase * 22;
          const alpha = Math.max(0, (1 - ringPhase) * 0.45);
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = ag.color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(x, y, ringR, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Label
        ctx.save();
        ctx.globalAlpha = 0.72;
        ctx.fillStyle = ag.color;
        ctx.font = ag.star ? `bold 9px 'DM Sans', sans-serif` : `9px 'DM Sans', sans-serif`;
        ctx.textAlign = ag.x > 0.62 ? "right" : "left";
        const labelX = ag.x > 0.62 ? x - r - 5 : x + r + 5;
        ctx.fillText(ag.shortName, labelX, y + 3);
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid rgba(201,146,42,0.12)",
        background: "rgba(8,14,28,0.85)",
        height: "220px",
      }}
    >
      {/* Header overlay */}
      <div style={{
        position: "absolute", top: "12px", left: "14px", zIndex: 2,
        fontFamily: "var(--font-display)",
        fontSize: "12px", color: "hsl(var(--brand-gold-bright))",
        letterSpacing: "0.08em",
      }}>
        Constelación de Agentes IA
      </div>
      <div style={{
        position: "absolute", top: "28px", left: "14px", zIndex: 2,
        fontSize: "10px", color: "hsl(var(--muted-foreground))",
      }}>
        12 agentes · tiempo real · cada nodo pulsa con su actividad
      </div>

      {/* Layer legend */}
      <div style={{
        position: "absolute", bottom: "10px", right: "12px", zIndex: 2,
        display: "flex", gap: "10px",
      }}>
        {[
          { label: "Pastoral", color: AGENT_LAYER_COLORS.pastoral },
          { label: "Contenido", color: AGENT_LAYER_COLORS.content },
          { label: "Inteligencia", color: AGENT_LAYER_COLORS.intelligence },
          { label: "★ Cobertura", color: "#F0B83C" },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: color }} />
            <span style={{ fontSize: "9px", color: "rgba(138,147,168,0.7)" }}>{label}</span>
          </div>
        ))}
      </div>

      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
    </div>
  );
}
