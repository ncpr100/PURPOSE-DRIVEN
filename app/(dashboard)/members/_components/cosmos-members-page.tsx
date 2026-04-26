"use client";
// app/(dashboard)/members/cosmos-members-page.tsx
// Full Cosmos redesign of the members list page

import { useState } from "react";
import { Search, Plus, Filter, Download, Upload, Users, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ─── LIFECYCLE STAGE CONFIG ──────────────────────────────────
const LIFECYCLE_STAGES = {
  VISITANTE:       { label: "Visitante",       variant: "visitante"      as const, color: "#94A3B8" },
  NUEVO_CREYENTE:  { label: "Nuevo Creyente",  variant: "nuevo-creyente" as const, color: "#26D9D9" },
  CRECIMIENTO:     { label: "Crecimiento",     variant: "crecimiento"    as const, color: "#1DC98C" },
  MADURO:          { label: "Maduro",          variant: "maduro"         as const, color: "#F0B83C" },
  LIDER:           { label: "Líder",           variant: "lider"          as const, color: "#9B8FFF" },
};

const RETENTION_COLORS = {
  LOW:      { label: "Bajo",     color: "#1DC98C" },
  MEDIUM:   { label: "Medio",    color: "#F0B83C" },
  HIGH:     { label: "Alto",     color: "#E84855" },
  CRITICAL: { label: "Crítico",  color: "#E84855" },
};

// ─── MOCK STAT CARDS ─────────────────────────────────────────
const MEMBER_STATS = [
  { label: "Total Miembros",    value: 347, delta: "+12",    deltaDir: "up"   as const, color: "#1DC98C" },
  { label: "Activos este mes",  value: 298, delta: "86%",    deltaDir: "up"   as const, color: "#F0B83C" },
  { label: "En riesgo",         value: 23,  delta: "-3",     deltaDir: "up"   as const, color: "#E84855" },
  { label: "Nuevos (30 días)",  value: 18,  delta: "+8%",    deltaDir: "up"   as const, color: "#26D9D9" },
];

export function CosmossMembersPage() {
  const [search, setSearch] = useState("");
  const [activeStage, setActiveStage] = useState<string | null>(null);

  return (
    <div className="space-y-5 animate-fade-up">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Directorio de Miembros</h1>
          <p className="page-subtitle">347 miembros · 5 etapas de ciclo de vida</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Upload size={14} /> Importar CSV
          </Button>
          <Button variant="outline" size="sm">
            <Download size={14} /> Exportar
          </Button>
          <Button size="sm" className="btn-cta-gradient">
            <Plus size={14} /> Agregar Miembro
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger">
        {MEMBER_STATS.map((stat) => (
          <div key={stat.label} className="metric-card">
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 0% 0%, ${stat.color}08 0%, transparent 70%)`,
              }}
            />
            <div
              aria-hidden
              className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
              style={{ background: `linear-gradient(90deg, ${stat.color}60, transparent)` }}
            />
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
              {stat.label}
            </div>
            <div className="font-display text-2xl font-bold text-foreground mb-1">
              {stat.value.toLocaleString("es-CO")}
            </div>
            <div
              className="text-[10px] flex items-center gap-1"
              style={{ color: stat.deltaDir === "up" ? "#1DC98C" : "#E84855" }}
            >
              {stat.deltaDir === "up" ? "↑" : "↓"} {stat.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Filters bar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email..."
            className="cosmos-input pl-8 text-xs h-8"
          />
        </div>

        {/* Lifecycle stage filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-muted-foreground">Etapa:</span>
          {Object.entries(LIFECYCLE_STAGES).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setActiveStage(activeStage === key ? null : key)}
              className="transition-all duration-150"
            >
              <Badge
                variant={cfg.variant}
                className={activeStage === key ? "ring-1 ring-offset-1 ring-offset-[rgba(13,22,40,0.8)]" : "opacity-70 hover:opacity-100"}
                style={activeStage === key ? { ringColor: cfg.color } : {}}
              >
                {cfg.label}
              </Badge>
            </button>
          ))}
          {activeStage && (
            <button
              onClick={() => setActiveStage(null)}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              x Limpiar
            </button>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Filter size={13} /> Filtros
          </Button>
        </div>
      </div>

      {/* Members table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="cosmos-table">
            <thead>
              <tr>
                <th>Miembro</th>
                <th>Etapa</th>
                <th className="hidden md:table-cell">Ministerio</th>
                <th className="hidden lg:table-cell">Eng. Score</th>
                <th className="hidden lg:table-cell">Riesgo</th>
                <th className="hidden sm:table-cell">Última asistencia</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {MOCK_MEMBERS.map((m) => {
                const stage = LIFECYCLE_STAGES[m.lifecycle as keyof typeof LIFECYCLE_STAGES];
                const risk = RETENTION_COLORS[m.retentionRisk as keyof typeof RETENTION_COLORS];
                return (
                  <tr key={m.id} className="group cursor-pointer">
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-display font-bold text-navy-deep"
                          style={{
                            background: `linear-gradient(135deg, ${stage.color}60, ${stage.color}30)`,
                            border: `1px solid ${stage.color}40`,
                            color: stage.color,
                          }}
                        >
                          {m.firstName.charAt(0)}{m.lastName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-[13px] font-medium text-foreground">
                            {m.firstName} {m.lastName}
                          </div>
                          <div className="text-[10px] text-muted-foreground">{m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge variant={stage.variant} size="sm">{stage.label}</Badge>
                    </td>
                    <td className="hidden md:table-cell text-xs text-muted-foreground">
                      {m.ministry || "—"}
                    </td>
                    <td className="hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${m.engagementScore}%`,
                              background: m.engagementScore >= 70 ? "#1DC98C"
                                        : m.engagementScore >= 40 ? "#F0B83C"
                                        : "#E84855",
                            }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{m.engagementScore}</span>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell">
                      <span className="text-[10px] font-medium" style={{ color: risk.color }}>
                        {risk.label}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell text-xs text-muted-foreground">
                      {m.lastAttendance}
                    </td>
                    <td>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon-sm">
                          <span className="text-[11px]">WA</span>
                        </Button>
                        <Button variant="ghost" size="icon-sm">
                          <Eye size={12} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[rgba(255,255,255,0.04)]">
          <span className="text-[11px] text-muted-foreground">Mostrando 1–10 de 347 miembros</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, "...", 35].map((page, i) => (
              <button
                key={i}
                className={`w-7 h-7 rounded-md text-[11px] flex items-center justify-center transition-colors ${
                  page === 1
                    ? "bg-[hsl(var(--accent))] text-accent-foreground"
                    : "text-muted-foreground hover:bg-[hsl(var(--accent)/0.3)]"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── MOCK DATA ───────────────────────────────────────────────
const MOCK_MEMBERS = [
  { id: "1", firstName: "Marco",    lastName: "Alvarado",  email: "marco@email.com",    lifecycle: "MADURO",          ministry: "Alabanza",    engagementScore: 88, retentionRisk: "LOW",    lastAttendance: "Hoy" },
  { id: "2", firstName: "Ana",      lastName: "Restrepo",  email: "ana@email.com",      lifecycle: "LIDER",           ministry: "Tech/Audio",  engagementScore: 94, retentionRisk: "LOW",    lastAttendance: "Hoy" },
  { id: "3", firstName: "Luis",     lastName: "Vargas",    email: "luis@email.com",     lifecycle: "CRECIMIENTO",     ministry: "Ujieres",     engagementScore: 62, retentionRisk: "MEDIUM", lastAttendance: "Hoy" },
  { id: "4", firstName: "Sofía",    lastName: "Martínez",  email: "sofia@email.com",    lifecycle: "MADURO",          ministry: "Niños",       engagementScore: 79, retentionRisk: "LOW",    lastAttendance: "Hoy" },
  { id: "5", firstName: "José",     lastName: "Martínez",  email: "jose@email.com",     lifecycle: "CRECIMIENTO",     ministry: null,          engagementScore: 28, retentionRisk: "CRITICAL","lastAttendance": "Hace 23 días" },
  { id: "6", firstName: "Patricia", lastName: "González",  email: "patricia@email.com", lifecycle: "NUEVO_CREYENTE",  ministry: null,          engagementScore: 45, retentionRisk: "MEDIUM", lastAttendance: "Semana pasada" },
  { id: "7", firstName: "Rafael",   lastName: "Torres",    email: "rafael@email.com",   lifecycle: "MADURO",          ministry: "Alabanza",    engagementScore: 84, retentionRisk: "LOW",    lastAttendance: "Hoy" },
  { id: "8", firstName: "Carmen",   lastName: "Vásquez",   email: "carmen@email.com",   lifecycle: "LIDER",           ministry: "Jóvenes",     engagementScore: 91, retentionRisk: "LOW",    lastAttendance: "Hoy" },
  { id: "9", firstName: "Diego",    lastName: "Herrera",   email: "diego@email.com",    lifecycle: "VISITANTE",       ministry: null,          engagementScore: 32, retentionRisk: "HIGH",   lastAttendance: "Hace 12 días" },
  { id: "10",firstName: "María",    lastName: "López",     email: "maria@email.com",    lifecycle: "CRECIMIENTO",     ministry: "Damas",       engagementScore: 67, retentionRisk: "LOW",    lastAttendance: "Domingo" },
];
