"use client";
// app/(platform)/agents/performance/cosmos-performance-dashboard.tsx
// Agent 13 — Web Performance Engineer Dashboard
// SUPER_ADMIN only. Real-time API metrics, recommendations, cold start tracking.

import { useState, useEffect, useCallback } from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { CHART_COLORS, DARK_CHART_GRID, DARK_CHART_AXIS } from "@/lib/chart-colors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, TrendingUp, TrendingDown, RefreshCw, CheckCircle, AlertTriangle, Brain } from "lucide-react";

// ── TYPES ─────────────────────────────────────────────────────
interface MetricSummary {
  periodStart: string;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  errorRate: number;
  throughput: number;
}

interface RoutePerformance {
  route: string;
  method: string;
  requestCount: number;
  p95Ms: number;
  errorRate: number;
  avgMs: number;
}

interface Recommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  impact: "HIGH" | "MEDIUM" | "LOW";
  effort: "HIGH" | "MEDIUM" | "LOW";
  affectedRoute: string | null;
  codeSnippet: string | null;
  isActioned: boolean;
  generatedAt: string;
}

const IMPACT_COLORS = {
  HIGH:   { color: "#E84855", variant: "priority-high" as const },
  MEDIUM: { color: "#F0B83C", variant: "priority-medium" as const },
  LOW:    { color: "#94A3B8", variant: "priority-low" as const },
};

const CATEGORY_ICONS: Record<string, string> = {
  api:          "⚡",
  cache:        "🗃️",
  database:     "🗄️",
  bundle:       "📦",
  "cold-start": "🥶",
};

function CosmosTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0d1628", border: "1px solid rgba(201,146,42,0.2)",
      borderRadius: "8px", padding: "10px 12px", fontFamily: "var(--font-body)",
    }}>
      <p style={{ fontSize: "11px", color: "#94A3B8", marginBottom: "6px" }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ display: "flex", gap: "6px", fontSize: "12px", alignItems: "center" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: p.color }} />
          <span style={{ color: "#F0EDE8" }}>{typeof p.value === "number" ? p.value.toFixed(0) : p.value}</span>
          <span style={{ color: "#8A93A8" }}>{p.name}</span>
        </div>
      ))}
    </div>
  );
}

export function CosmosPerformanceDashboard() {
  const [metrics, setMetrics] = useState<MetricSummary[]>([]);
  const [slowRoutes, setSlowRoutes] = useState<RoutePerformance[]>([]);
  const [errorRoutes, setErrorRoutes] = useState<RoutePerformance[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [currentSnapshot, setCurrentSnapshot] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "routes" | "recommendations">("overview");

  const fetchData = useCallback(async () => {
    try {
      const [metricsRes, routesRes, recsRes, snapshotRes] = await Promise.all([
        fetch("/api/platform/agents/performance/metrics?period=hourly&limit=24"),
        fetch("/api/platform/agents/performance/routes?limit=10"),
        fetch("/api/platform/agents/performance/recommendations"),
        fetch("/api/platform/agents/performance/snapshot"),
      ]);

      if (metricsRes.ok) setMetrics((await metricsRes.json()).metrics || []);
      if (routesRes.ok) {
        const data = await routesRes.json();
        setSlowRoutes(data.slowest || []);
        setErrorRoutes(data.mostErrored || []);
      }
      if (recsRes.ok) setRecommendations((await recsRes.json()).recommendations || []);
      if (snapshotRes.ok) setCurrentSnapshot((await snapshotRes.json()).snapshot);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("[Perf Dashboard] Fetch failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // 1 min refresh
    return () => clearInterval(interval);
  }, [fetchData]);

  const triggerAnalysis = async () => {
    setIsRunning(true);
    try {
      await fetch("/api/platform/agents/performance/analyze", { method: "POST" });
      await fetchData();
    } finally {
      setIsRunning(false);
    }
  };

  const markActioned = async (id: string) => {
    await fetch(`/api/platform/agents/performance/recommendations/${id}`, { method: "PATCH" });
    setRecommendations((prev) => prev.map((r) => r.id === id ? { ...r, isActioned: true } : r));
  };

  // Current snapshot values
  const p95 = currentSnapshot?.p95Ms || 0;
  const errorRate = currentSnapshot?.errorRate || 0;
  const cacheHitRate = currentSnapshot?.cacheHitRate || 0;
  const coldStarts = currentSnapshot?.coldStartCount || 0;

  const pendingRecs = recommendations.filter((r) => !r.isActioned);

  return (
    <div className="space-y-5 animate-fade-up">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Zap size={20} className="text-gold" />
            Ingeniero de Rendimiento Web
          </h1>
          <p className="page-subtitle">
            Agente 13 · Core Web Vitals · APIs · Caché · Cold Starts · Última actualización: {lastRefresh.toLocaleTimeString("es-CO")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw size={13} /> Actualizar
          </Button>
          <Button
            size="sm"
            className="btn-cta-gradient"
            onClick={triggerAnalysis}
            loading={isRunning}
          >
            {!isRunning && <><Brain size={13} /> Analizar Ahora</>}
          </Button>
        </div>
      </div>

      {/* Live metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger">
        {[
          {
            label: "P95 Latencia",
            value: `${p95.toFixed(0)}ms`,
            status: p95 <= 1000 ? "good" : p95 <= 2000 ? "warn" : "bad",
            icon: p95 <= 1000 ? <TrendingDown size={14} /> : <TrendingUp size={14} />,
            target: "< 2,000ms",
          },
          {
            label: "Tasa de Error",
            value: `${errorRate.toFixed(2)}%`,
            status: errorRate <= 0.5 ? "good" : errorRate <= 1 ? "warn" : "bad",
            icon: errorRate <= 1 ? <CheckCircle size={14} /> : <AlertTriangle size={14} />,
            target: "< 1%",
          },
          {
            label: "Cache Hit Rate",
            value: `${cacheHitRate.toFixed(1)}%`,
            status: cacheHitRate >= 90 ? "good" : cacheHitRate >= 80 ? "warn" : "bad",
            icon: <Zap size={14} />,
            target: "> 90%",
          },
          {
            label: "Cold Starts (hora)",
            value: coldStarts.toString(),
            status: coldStarts <= 5 ? "good" : coldStarts <= 10 ? "warn" : "bad",
            icon: <TrendingUp size={14} />,
            target: "< 10/hora",
          },
        ].map((card, i) => {
          const color = card.status === "good" ? "#1DC98C" : card.status === "warn" ? "#F0B83C" : "#E84855";
          return (
            <div key={i} className="metric-card">
              <div
                aria-hidden
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
                style={{ background: `linear-gradient(90deg, ${color}60, transparent)` }}
              />
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{card.label}</div>
                <div style={{ color }}>{card.icon}</div>
              </div>
              <div className="font-display text-2xl font-bold" style={{ color }}>{card.value}</div>
              <div className="text-[9px] text-muted-foreground mt-1">Target: {card.target}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[rgba(255,255,255,0.06)]">
        {[
          { id: "overview",        label: "Tendencias", icon: <TrendingUp size={13} /> },
          { id: "routes",          label: "Rutas Lentas", icon: <Zap size={13} /> },
          { id: "recommendations", label: "Recomendaciones IA", icon: <Brain size={13} />, badge: pendingRecs.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-all border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-gold-bright text-gold-bright"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon} {tab.label}
            {(tab as any).badge > 0 && (
              <span className="ml-1 px-1.5 py-0 rounded-full text-[9px] font-bold bg-warning/15 text-warning border border-warning/25">
                {(tab as any).badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-4 stagger">
          {/* Latency trend */}
          <Card>
            <CardHeader>
              <CardTitle>Latencia de API — Últimas 24 Horas</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics} margin={{ left: -20, right: 10, top: 5 }}>
                    <CartesianGrid stroke={DARK_CHART_GRID} strokeDasharray="4 8" />
                    <XAxis dataKey="periodStart" tick={{ fill: DARK_CHART_AXIS, fontSize: 10 }} tickFormatter={(v) => new Date(v).getHours() + "h"} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: DARK_CHART_AXIS, fontSize: 10 }} axisLine={false} tickLine={false} unit="ms" />
                    <Tooltip content={<CosmosTooltip />} />
                    <ReferenceLine y={2000} stroke="rgba(232,72,85,0.4)" strokeDasharray="6 3" label={{ value: "Límite P95", fill: "#E84855", fontSize: 9 }} />
                    <Line type="monotone" dataKey="p50Ms"  stroke={CHART_COLORS.emerald}  strokeWidth={1.5} dot={false} name="P50" />
                    <Line type="monotone" dataKey="p95Ms"  stroke={CHART_COLORS.gold}     strokeWidth={2}   dot={false} name="P95" />
                    <Line type="monotone" dataKey="p99Ms"  stroke={CHART_COLORS.rose}     strokeWidth={1.5} dot={false} name="P99" strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Error rate + throughput */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle>Tasa de Error (%)</CardTitle></CardHeader>
              <CardContent>
                <div style={{ height: 150 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metrics} margin={{ left: -20, right: 10 }}>
                      <defs>
                        <linearGradient id="errGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={CHART_COLORS.rose} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={CHART_COLORS.rose} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={DARK_CHART_GRID} strokeDasharray="4 8" />
                      <XAxis dataKey="periodStart" tick={{ fill: DARK_CHART_AXIS, fontSize: 10 }} tickFormatter={(v) => new Date(v).getHours() + "h"} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: DARK_CHART_AXIS, fontSize: 10 }} axisLine={false} tickLine={false} unit="%" />
                      <Tooltip content={<CosmosTooltip />} />
                      <ReferenceLine y={1} stroke="rgba(232,72,85,0.5)" strokeDasharray="4 4" />
                      <Area type="monotone" dataKey="errorRate" stroke={CHART_COLORS.rose} strokeWidth={2} fill="url(#errGrad)" name="Error%" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Throughput (req/seg)</CardTitle></CardHeader>
              <CardContent>
                <div style={{ height: 150 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics} margin={{ left: -20, right: 10 }}>
                      <CartesianGrid stroke={DARK_CHART_GRID} strokeDasharray="4 8" vertical={false} />
                      <XAxis dataKey="periodStart" tick={{ fill: DARK_CHART_AXIS, fontSize: 10 }} tickFormatter={(v) => new Date(v).getHours() + "h"} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: DARK_CHART_AXIS, fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CosmosTooltip />} />
                      <Bar dataKey="throughput" fill={CHART_COLORS.cyan} radius={[2, 2, 0, 0]} name="req/s" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ROUTES TAB */}
      {activeTab === "routes" && (
        <div className="space-y-4 stagger">
          <Card>
            <CardHeader><CardTitle>Rutas Más Lentas — P95 (último período)</CardTitle></CardHeader>
            <CardContent className="pt-0">
              {slowRoutes.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">Sin datos de rutas todavía.</p>
              ) : (
                <table className="cosmos-table">
                  <thead>
                    <tr>
                      <th>Ruta</th>
                      <th>Solicitudes</th>
                      <th>P95</th>
                      <th>Promedio</th>
                      <th>Errores</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slowRoutes.map((route, i) => (
                      <tr key={i}>
                        <td>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" size="sm">{route.method}</Badge>
                            <code className="text-[11px] text-foreground">{route.route}</code>
                          </div>
                        </td>
                        <td className="text-xs text-muted-foreground">{route.requestCount.toLocaleString()}</td>
                        <td>
                          <span
                            className="text-xs font-bold"
                            style={{ color: route.p95Ms > 2000 ? "#E84855" : route.p95Ms > 1000 ? "#F0B83C" : "#1DC98C" }}
                          >
                            {route.p95Ms.toFixed(0)}ms
                          </span>
                        </td>
                        <td className="text-xs text-muted-foreground">{route.avgMs.toFixed(0)}ms</td>
                        <td>
                          {route.errorRate > 0 ? (
                            <span className="text-xs text-destructive">{route.errorRate.toFixed(1)}%</span>
                          ) : (
                            <span className="text-xs text-cosmos-emerald">0%</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* RECOMMENDATIONS TAB */}
      {activeTab === "recommendations" && (
        <div className="space-y-3 stagger">
          {pendingRecs.length === 0 ? (
            <div className="text-center py-16">
              <CheckCircle size={40} className="mx-auto mb-3 text-cosmos-emerald opacity-60" />
              <p className="text-sm text-muted-foreground">Sin recomendaciones pendientes. ✅</p>
            </div>
          ) : (
            pendingRecs.map((rec) => {
              const impact = IMPACT_COLORS[rec.impact];
              return (
                <Card key={rec.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xl">{CATEGORY_ICONS[rec.category] || "⚡"}</span>
                          <Badge variant={impact.variant} size="sm">Impacto {rec.impact}</Badge>
                          <Badge variant="outline" size="sm">Esfuerzo {rec.effort}</Badge>
                          {rec.affectedRoute && (
                            <code className="text-[10px] bg-[rgba(255,255,255,0.06)] px-1.5 py-0.5 rounded">{rec.affectedRoute}</code>
                          )}
                        </div>
                        <div className="text-[13px] font-medium text-foreground mb-1">{rec.title}</div>
                        <div className="text-[11px] text-muted-foreground leading-relaxed">{rec.description}</div>
                        {rec.codeSnippet && (
                          <pre className="mt-3 p-3 rounded-lg bg-[rgba(13,22,40,0.8)] border border-[rgba(255,255,255,0.06)] text-[10px] text-cosmos-emerald overflow-x-auto">
                            {rec.codeSnippet}
                          </pre>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[10px] text-muted-foreground">
                        Generado: {new Date(rec.generatedAt).toLocaleDateString("es-CO")}
                      </span>
                      <Button
                        variant="emerald"
                        size="sm"
                        onClick={() => markActioned(rec.id)}
                      >
                        <CheckCircle size={12} /> Marcar como implementado
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
