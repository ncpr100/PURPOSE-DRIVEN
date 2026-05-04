"use client";
// app/(dashboard)/prayer-wall/cosmos-prayer-wall.tsx
// Full Cosmos redesign of prayer-wall page
// Fixes: P4-B (Recharts dark mode), userEngagementScore label (localization)

import { useState } from "react";
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { CHART_COLORS, DARK_CHART_GRID, DARK_CHART_AXIS, DARK_CHART_TOOLTIP_BG } from "@/lib/chart-colors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Filter, Bell, Lock, Heart, MessageCircle } from "lucide-react";

// ΓöÇΓöÇΓöÇ CHART DATA ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const REQUEST_TRENDS = [
  { semana: "Mar 24", peticiones: 12, respondidas: 10, testimonios: 3 },
  { semana: "Mar 31", peticiones: 18, respondidas: 15, testimonios: 5 },
  { semana: "Abr 7",  peticiones: 14, respondidas: 12, testimonios: 4 },
  { semana: "Abr 14", peticiones: 22, respondidas: 19, testimonios: 7 },
];

const CATEGORIES = [
  { name: "Salud",         value: 35, color: CHART_COLORS.rose },
  { name: "Familia",       value: 28, color: CHART_COLORS.gold },
  { name: "Trabajo",       value: 18, color: CHART_COLORS.cyan },
  { name: "Espiritual",    value: 12, color: CHART_COLORS.lavender },
  { name: "Otro",          value: 7,  color: CHART_COLORS.emerald },
];

const ENGAGEMENT_DATA = [
  { mes: "Ene", puntaje: 62 }, { mes: "Feb", puntaje: 71 },
  { mes: "Mar", puntaje: 68 }, { mes: "Abr", puntaje: 79 },
];

// ΓöÇΓöÇΓöÇ PRAYER REQUESTS ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const MOCK_REQUESTS = [
  { id: "1", title: "Cirugía de María López",     category: "Salud",    status: "pending",   urgency: "high",   time: "hace 2h",  isAnonymous: false, prayedBy: 8 },
  { id: "2", title: "Restauración familiar",       category: "Familia",  status: "pending",   urgency: "high",   time: "hace 4h",  isAnonymous: true,  prayedBy: 12 },
  { id: "3", title: "Trabajo para Carlos B.",      category: "Trabajo",  status: "completed", urgency: "medium", time: "ayer",     isAnonymous: false, prayedBy: 24 },
  { id: "4", title: "Viaje misionero Torres",      category: "Espiritual", status: "pending", urgency: "medium", time: "hace 1d",  isAnonymous: false, prayedBy: 15 },
  { id: "5", title: "Sanidad del hijo de Ana",    category: "Salud",    status: "pending",   urgency: "high",   time: "hace 3h",  isAnonymous: false, prayedBy: 6 },
];

const URGENCY_CONFIG = {
  high:   { color: "#E84855", label: "Urgente" },
  medium: { color: "#F0B83C", label: "Normal" },
  low:    { color: "#94A3B8", label: "General" },
};

// Custom Recharts tooltip
function CosmosTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: DARK_CHART_TOOLTIP_BG,
      border: "1px solid rgba(201,146,42,0.2)",
      borderRadius: "8px",
      padding: "10px 12px",
      fontFamily: "var(--font-body)",
    }}>
      <p style={{ fontSize: "11px", color: "#94A3B8", marginBottom: "6px" }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: p.color }} />
          <span style={{ color: "#F0EDE8" }}>{p.value}</span>
          <span style={{ color: "#8A93A8" }}>{p.name}</span>
        </div>
      ))}
    </div>
  );
}

export function CosmosPrayerWall() {
  const [activeTab, setActiveTab] = useState<"requests" | "analytics">("requests");

  return (
    <div className="space-y-5 animate-fade-up">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Muro de Oración</h1>
          <p className="page-subtitle">47 peticiones · 3 urgentes · Agente 4 activo</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Bell size={13} /> Configurar alertas
          </Button>
          <Button size="sm" className="btn-cta-gradient">
            <Plus size={13} /> Nueva Petición
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger">
        {[
          { label: "Total Peticiones",      value: 47,  color: CHART_COLORS.gold,     suffix: "" },
          { label: "Respondidas",           value: 38,  color: CHART_COLORS.emerald,  suffix: "" },
          { label: "Tiempo Resp. Promedio", value: 2.4, color: CHART_COLORS.cyan,     suffix: "h" },
          { label: "Puntuación Intercesión", value: 79,  color: CHART_COLORS.lavender, suffix: "" }, // was userEngagementScore in English
        ].map((s) => (
          <div key={s.label} className="metric-card">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
              {s.label}
            </div>
            <div className="font-display text-2xl font-bold" style={{ color: s.color }}>
              {s.value}{s.suffix}
            </div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-[rgba(255,255,255,0.06)] pb-0">
        {(["requests", "analytics"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-medium transition-all border-b-2 -mb-px ${
              activeTab === tab
                ? "border-gold-bright text-gold-bright"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "requests" ? "Peticiones" : "Analítica"}
          </button>
        ))}
      </div>

      {/* REQUESTS TAB */}
      {activeTab === "requests" && (
        <div className="space-y-3">
          {/* Filter bar */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              {["Todos", "Urgentes", "Salud", "Familia"].map((f) => (
                <button key={f} className="px-2.5 py-1 rounded-full text-[10px] border border-[rgba(255,255,255,0.08)] text-muted-foreground hover:border-[rgba(201,146,42,0.3)] hover:text-foreground transition-all">
                  {f}
                </button>
              ))}
            </div>
            <div className="ml-auto">
              <Button variant="ghost" size="sm"><Filter size={12} /></Button>
            </div>
          </div>

          {/* Prayer request cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 stagger">
            {MOCK_REQUESTS.map((req) => {
              const urg = URGENCY_CONFIG[req.urgency as keyof typeof URGENCY_CONFIG];
              return (
                <Card key={req.id} className="cursor-pointer group">
                  {/* Urgency indicator */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
                    style={{ background: `linear-gradient(90deg, ${urg.color}80, transparent)` }}
                  />
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm leading-snug group-hover:text-gold transition-colors">
                        {req.isAnonymous ? (
                          <span className="flex items-center gap-1">
                            <Lock size={11} className="text-muted-foreground" />
                            Anónimo
                          </span>
                        ) : req.title}
                      </CardTitle>
                      <Badge
                        variant={req.status === "completed" ? "completed" : "pending"}
                        size="sm"
                      >
                        {req.status === "completed" ? "Respondida" : "Pendiente"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: urg.color }}
                        />
                        <span className="text-[10px] text-muted-foreground">{req.category}</span>
                        <span className="text-[10px] text-muted-foreground">·</span>
                        <span className="text-[10px] text-muted-foreground">{req.time}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-[hsl(var(--brand-gold-dim))]">
                        <Heart size={9} className="text-[hsl(var(--brand-gold-dim))]" /> {req.prayedBy}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-3">
                      <Button variant="emerald" size="sm" className="flex-1 text-xs h-7">
                        Orar ahora
                      </Button>
                      <Button variant="ghost" size="icon-sm">
                        <MessageCircle size={12} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 stagger">

          {/* Trends line chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Tendencia de Peticiones ΓÇö Últimas 4 semanas</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={REQUEST_TRENDS} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke={DARK_CHART_GRID} strokeDasharray="4 8" />
                    <XAxis dataKey="semana" tick={{ fill: DARK_CHART_AXIS, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: DARK_CHART_AXIS, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CosmosTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: "11px", color: DARK_CHART_AXIS }}
                      formatter={(v) => v === "peticiones" ? "Peticiones" : v === "respondidas" ? "Respondidas" : "Testimonios"}
                    />
                    <Line type="monotone" dataKey="peticiones"  stroke={CHART_COLORS.gold}    strokeWidth={2} dot={{ fill: CHART_COLORS.gold,    r: 3 }} name="peticiones" />
                    <Line type="monotone" dataKey="respondidas" stroke={CHART_COLORS.emerald} strokeWidth={2} dot={{ fill: CHART_COLORS.emerald, r: 3 }} name="respondidas" />
                    <Line type="monotone" dataKey="testimonios" stroke={CHART_COLORS.cyan}    strokeWidth={2} dot={{ fill: CHART_COLORS.cyan,    r: 3 }} strokeDasharray="4 4" name="testimonios" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Categories pie */}
          <Card>
            <CardHeader><CardTitle>Distribución por Categoría</CardTitle></CardHeader>
            <CardContent>
              <div style={{ height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CATEGORIES}
                      cx="50%" cy="50%"
                      innerRadius={50} outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {CATEGORIES.map((entry, i) => (
                        <Cell key={i} fill={entry.color} opacity={0.85} />
                      ))}
                    </Pie>
                    <Tooltip content={<CosmosTooltip />} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: "10px", color: DARK_CHART_AXIS }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Puntuación de Intercesión (was userEngagementScore ΓÇö localization fix) */}
          <Card>
            <CardHeader><CardTitle>Puntuación de Intercesión Mensual</CardTitle></CardHeader>
            <CardContent>
              <div style={{ height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ENGAGEMENT_DATA} margin={{ left: -20, right: 10 }}>
                    <defs>
                      <linearGradient id="interGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={CHART_COLORS.lavender} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={CHART_COLORS.lavender} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={DARK_CHART_GRID} strokeDasharray="4 8" />
                    <XAxis dataKey="mes" tick={{ fill: DARK_CHART_AXIS, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: DARK_CHART_AXIS, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CosmosTooltip />} />
                    <Area
                      type="monotone" dataKey="puntaje" name="Puntuación"
                      stroke={CHART_COLORS.lavender} strokeWidth={2}
                      fill="url(#interGrad)"
                      dot={{ fill: CHART_COLORS.lavender, r: 3 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
