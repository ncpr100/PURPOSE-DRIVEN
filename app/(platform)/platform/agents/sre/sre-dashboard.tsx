"use client";
// app/(platform)/agents/sre/cosmos-sre-dashboard.tsx
// Agent 14 — SRE Mission Control Dashboard
// SUPER_ADMIN only. Cosmos design system. Real-time via SSE.

import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  RefreshCw,
  Shield,
  Wifi,
  WifiOff,
  Zap,
  MessageCircle,
  TrendingUp,
  Server,
  FileText,
} from "lucide-react";

// ── TYPES ─────────────────────────────────────────────────────
interface HealthCheck {
  service: string;
  status: "HEALTHY" | "DEGRADED" | "DOWN" | "UNKNOWN";
  responseTimeMs: number | null;
  errorMessage: string | null;
  checkedAt: string;
}

interface Incident {
  id: string;
  title: string;
  severity: string;
  status: string;
  affectedServices: string[];
  affectedTenants: number;
  detectedAt: string;
  resolvedAt: string | null;
  timeToResolveMs: number | null;
}

interface SLARecord {
  month: string;
  tier: string;
  actualUptime: number;
  totalDowntimeMs: number;
  p1IncidentCount?: number;
  slaBreached: boolean;
}

// ── SERVICE CONFIG ────────────────────────────────────────────
const SERVICE_CONFIG: Record<
  string,
  { label: string; icon: string; critical: boolean }
> = {
  database: { label: "Base de Datos", icon: "🗄️", critical: true },
  redis: { label: "Redis Cache", icon: "⚡", critical: true },
  production_url: { label: "URL Producción", icon: "🌐", critical: true },
  stripe: { label: "Stripe", icon: "💳", critical: true },
  whatsapp: { label: "WhatsApp Business", icon: "💬", critical: true },
  mailgun: { label: "Mailgun Email", icon: "📧", critical: false },
  twilio: { label: "Twilio SMS", icon: "📱", critical: false },
  abacusai: { label: "AbacusAI", icon: "🧠", critical: false },
};

const STATUS_CONFIG = {
  HEALTHY: { color: "#1DC98C", label: "Operacional", dot: "live-dot" },
  DEGRADED: { color: "#F0B83C", label: "Degradado", dot: "live-dot-warning" },
  DOWN: { color: "#E84855", label: "Caído", dot: "live-dot-alert" },
  UNKNOWN: { color: "#94A3B8", label: "Desconocido", dot: "" },
};

const SEVERITY_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  P1_CRITICAL: {
    label: "P1 Crítico",
    color: "#E84855",
    bg: "rgba(232,72,85,0.12)",
  },
  P2_HIGH: { label: "P2 Alto", color: "#F0B83C", bg: "rgba(240,184,60,0.12)" },
  P3_MEDIUM: {
    label: "P3 Medio",
    color: "#26D9D9",
    bg: "rgba(38,217,217,0.12)",
  },
  P4_LOW: { label: "P4 Bajo", color: "#94A3B8", bg: "rgba(148,163,184,0.08)" },
};

// ── MAIN DASHBOARD ────────────────────────────────────────────
export function CosmosSREDashboard() {
  const [checks, setChecks] = useState<HealthCheck[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [slaRecords, setSlaRecords] = useState<SLARecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"status" | "incidents" | "sla">(
    "status",
  );

  const fetchData = useCallback(async () => {
    try {
      const [checksRes, incidentsRes, slaRes] = await Promise.all([
        fetch("/api/platform/agents/sre/health"),
        fetch("/api/platform/agents/sre/incidents?limit=20"),
        fetch("/api/platform/agents/sre/sla"),
      ]);

      if (checksRes.ok) setChecks((await checksRes.json()).checks || []);
      if (incidentsRes.ok)
        setIncidents((await incidentsRes.json()).incidents || []);
      if (slaRes.ok) setSlaRecords((await slaRes.json()).records || []);

      setLastRefresh(new Date());
    } catch (err) {
      console.error("[SRE Dashboard] Fetch failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [fetchData]);

  const triggerManualCheck = async () => {
    setIsRunning(true);
    try {
      await fetch("/api/platform/agents/sre/run-check", { method: "POST" });
      await fetchData();
    } finally {
      setIsRunning(false);
    }
  };

  // Compute overall status
  const downCount = checks.filter((c) => c.status === "DOWN").length;
  const degradedCount = checks.filter((c) => c.status === "DEGRADED").length;
  const overallStatus =
    downCount > 0 ? "DOWN" : degradedCount > 0 ? "DEGRADED" : "HEALTHY";

  const activeIncidents = incidents.filter(
    (i) => !["CLOSED", "RESOLVED"].includes(i.status),
  );

  const currentSLA = slaRecords.find((s) => s.tier === "COSECHA");
  const uptimePct = currentSLA
    ? (currentSLA.actualUptime * 100).toFixed(3)
    : "—";

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Shield size={20} className="text-gold" />
            Control SRE — Misión 24/7
          </h1>
          <p className="page-subtitle">
            Agente 14 · SLA 99.9% · Última verificación:{" "}
            {lastRefresh.toLocaleTimeString("es-CO")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw size={13} /> Actualizar
          </Button>
          <Button
            size="sm"
            className="btn-cta-gradient"
            onClick={triggerManualCheck}
            loading={isRunning}
          >
            {!isRunning && (
              <>
                <Zap size={13} /> Verificar Ahora
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Overall status banner */}
      <div
        className="rounded-xl p-4 border flex items-center justify-between"
        style={{
          background: `${STATUS_CONFIG[overallStatus].color}10`,
          borderColor: `${STATUS_CONFIG[overallStatus].color}30`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: `${STATUS_CONFIG[overallStatus].color}20` }}
          >
            {overallStatus === "HEALTHY" ? (
              <CheckCircle
                size={20}
                style={{ color: STATUS_CONFIG.HEALTHY.color }}
              />
            ) : overallStatus === "DEGRADED" ? (
              <AlertTriangle
                size={20}
                style={{ color: STATUS_CONFIG.DEGRADED.color }}
              />
            ) : (
              <WifiOff size={20} style={{ color: STATUS_CONFIG.DOWN.color }} />
            )}
          </div>
          <div>
            <div className="font-display font-semibold text-foreground">
              {overallStatus === "HEALTHY"
                ? "Todos los sistemas operacionales"
                : overallStatus === "DEGRADED"
                  ? `${degradedCount} servicio(s) degradado(s)`
                  : `${downCount} servicio(s) caído(s) — INCIDENTE ACTIVO`}
            </div>
            <div className="text-xs text-muted-foreground">
              {checks.length} servicios monitoreados · {activeIncidents.length}{" "}
              incidente(s) activo(s)
            </div>
          </div>
        </div>

        {/* SLA chip */}
        <div className="text-right">
          <div
            className="font-display text-2xl font-bold"
            style={{ color: STATUS_CONFIG.HEALTHY.color }}
          >
            {uptimePct}%
          </div>
          <div className="text-xs text-muted-foreground">Uptime este mes</div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger">
        {[
          {
            label: "Servicios Online",
            value: checks.filter((c) => c.status === "HEALTHY").length,
            total: checks.length,
            color: "#1DC98C",
          },
          {
            label: "Incidentes Activos",
            value: activeIncidents.length,
            total: null,
            color: activeIncidents.length > 0 ? "#E84855" : "#1DC98C",
          },
          {
            label: "Incidentes (mes)",
            value: incidents.length,
            total: null,
            color: "#F0B83C",
          },
          {
            label: "SLA Target",
            value: "99.9%",
            total: null,
            color: "#26D9D9",
            isString: true,
          },
        ].map((s, i) => (
          <div key={i} className="metric-card">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
              {s.label}
            </div>
            <div
              className="font-display text-2xl font-bold"
              style={{ color: s.color }}
            >
              {(s as any).isString ? s.value : s.value}
              {s.total !== null ? `/${s.total}` : ""}
            </div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-[rgba(255,255,255,0.06)]">
        {[
          {
            id: "status",
            label: "Estado de Servicios",
            icon: <Activity size={13} />,
          },
          {
            id: "incidents",
            label: "Incidentes",
            icon: <AlertTriangle size={13} />,
            badge: activeIncidents.length,
          },
          { id: "sla", label: "SLA Reports", icon: <TrendingUp size={13} /> },
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
              <span className="ml-1 px-1.5 py-0 rounded-full text-[9px] font-bold bg-destructive/15 text-destructive border border-destructive/25">
                {(tab as any).badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* SERVICE STATUS TAB */}
      {activeTab === "status" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 stagger">
          {Object.entries(SERVICE_CONFIG).map(([key, cfg]) => {
            const check = checks.find((c) => c.service === key);
            const status = check?.status || "UNKNOWN";
            const sc = STATUS_CONFIG[status];

            return (
              <Card key={key} variant={status === "DOWN" ? "alert" : "default"}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{cfg.icon}</span>
                      <div>
                        <div className="text-[12px] font-medium text-foreground">
                          {cfg.label}
                        </div>
                        {cfg.critical && (
                          <span className="text-[9px] text-destructive/70">
                            Crítico para operación
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: sc.color,
                          animation:
                            status === "HEALTHY"
                              ? "livePulse 2s ease-in-out infinite"
                              : status === "DOWN"
                                ? "rosePulse 0.8s ease-in-out infinite"
                                : "goldPulse 1.2s ease-in-out infinite",
                        }}
                      />
                      <span
                        className="text-[10px] font-medium"
                        style={{ color: sc.color }}
                      >
                        {sc.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>
                      {check?.responseTimeMs != null
                        ? `${check.responseTimeMs.toFixed(0)}ms`
                        : "—"}
                    </span>
                    <span>
                      {check?.checkedAt
                        ? new Date(check.checkedAt).toLocaleTimeString("es-CO")
                        : "Sin datos"}
                    </span>
                  </div>

                  {check?.errorMessage && (
                    <div className="mt-2 p-2 rounded-md bg-destructive/10 border border-destructive/20">
                      <p className="text-[10px] text-destructive truncate">
                        {check.errorMessage}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* INCIDENTS TAB */}
      {activeTab === "incidents" && (
        <div className="space-y-3">
          {incidents.length === 0 ? (
            <div className="text-center py-16">
              <CheckCircle
                size={40}
                className="mx-auto mb-3 text-cosmos-emerald opacity-60"
              />
              <p className="text-sm text-muted-foreground">
                Sin incidentes este mes. ✅
              </p>
            </div>
          ) : (
            incidents.map((incident) => {
              const sev =
                SEVERITY_CONFIG[incident.severity] || SEVERITY_CONFIG.P4_LOW;
              const isActive = !["CLOSED", "RESOLVED"].includes(
                incident.status,
              );

              return (
                <Card key={incident.id} variant={isActive ? "alert" : "flat"}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{
                              background: sev.bg,
                              color: sev.color,
                              border: `1px solid ${sev.color}30`,
                            }}
                          >
                            {sev.label}
                          </span>
                          <Badge
                            variant={isActive ? "destructive" : "completed"}
                            size="sm"
                          >
                            {incident.status === "DETECTED"
                              ? "Detectado"
                              : incident.status === "ACKNOWLEDGED"
                                ? "Reconocido"
                                : incident.status === "RESOLVED" ||
                                    incident.status === "CLOSED"
                                  ? "Resuelto"
                                  : incident.status}
                          </Badge>
                        </div>
                        <div className="text-[13px] font-medium text-foreground">
                          {incident.title}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-1">
                          Servicios:{" "}
                          {(incident.affectedServices as string[]).join(", ")} ·
                          {incident.affectedTenants > 0 &&
                            ` ${incident.affectedTenants} iglesias ·`}
                          Detectado:{" "}
                          {new Date(incident.detectedAt).toLocaleString(
                            "es-CO",
                          )}
                        </div>
                        {incident.resolvedAt && incident.timeToResolveMs && (
                          <div className="text-[10px] text-cosmos-emerald mt-0.5">
                            ✅ Resuelto en{" "}
                            {Math.round(incident.timeToResolveMs / 60000)}{" "}
                            minutos
                          </div>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={`/platform/agents/sre/incidents/${incident.id}`}
                        >
                          <FileText size={13} />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* SLA TAB */}
      {activeTab === "sla" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SLA Mensual por Plan — Target: 99.9%</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {slaRecords.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Los datos de SLA se calculan al final de cada día.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="cosmos-table">
                    <thead>
                      <tr>
                        <th>Mes</th>
                        <th>Plan</th>
                        <th>Uptime Real</th>
                        <th>Downtime</th>
                        <th>Incidentes P1</th>
                        <th>SLA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slaRecords.map((r) => (
                        <tr key={`${r.month}-${r.tier}`}>
                          <td className="text-xs">{r.month}</td>
                          <td>
                            <Badge variant="gold" size="sm">
                              {r.tier}
                            </Badge>
                          </td>
                          <td>
                            <span
                              className="text-xs font-bold"
                              style={{
                                color:
                                  r.actualUptime >= 0.999
                                    ? "#1DC98C"
                                    : "#E84855",
                              }}
                            >
                              {(r.actualUptime * 100).toFixed(3)}%
                            </span>
                          </td>
                          <td className="text-xs text-muted-foreground">
                            {Math.round(r.totalDowntimeMs / 60000)} min
                          </td>
                          <td className="text-xs text-muted-foreground">
                            {r.p1IncidentCount || 0}
                          </td>
                          <td>
                            <Badge
                              variant={
                                r.slaBreached ? "destructive" : "success"
                              }
                              size="sm"
                            >
                              {r.slaBreached ? "Incumplido" : "Cumplido"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* SLA explanation */}
          <Card variant="glass">
            <CardContent className="p-4">
              <div className="section-label mb-3">Compromisos de SLA</div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    plan: "Plan Semilla",
                    uptime: "99.5%",
                    downtime: "3.65h/año",
                    support: "Email 48h",
                  },
                  {
                    plan: "Plan Cosecha",
                    uptime: "99.9%",
                    downtime: "8.76h/año",
                    support: "WhatsApp 4h",
                  },
                  {
                    plan: "Plan Reino",
                    uptime: "99.9%",
                    downtime: "8.76h/año",
                    support: "WhatsApp 2h",
                  },
                  {
                    plan: "Plan Red",
                    uptime: "99.9%",
                    downtime: "8.76h/año",
                    support: "Dedicado 1h",
                  },
                ].map((s) => (
                  <div
                    key={s.plan}
                    className="p-3 rounded-lg border border-[rgba(201,146,42,0.1)] bg-[rgba(201,146,42,0.04)]"
                  >
                    <div className="text-[11px] font-medium text-foreground mb-1">
                      {s.plan}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Uptime:{" "}
                      <span className="text-cosmos-emerald">{s.uptime}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Downtime máx: {s.downtime}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Soporte: {s.support}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
