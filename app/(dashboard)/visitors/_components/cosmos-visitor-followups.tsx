"use client";
// app/(dashboard)/visitor-follow-ups/cosmos-visitor-followups.tsx
// Full Cosmos redesign ΓÇö FIXES P1-C: replaces local STATUS_COLORS + PRIORITY_COLORS maps
// with the centralized Badge variant system

import { useState } from "react";
import { Phone, MessageCircle, Mail, Check, Clock, Filter, User, Heart, Star, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// TYPE LABELS (Spanish ΓÇö compliant with original)
const TYPE_LABELS: Record<string, string> = {
  call:                    "Llamada",
  email:                   "Email",
  visit:                   "Visita",
  automatic:               "Autom├ítico",
  custom_form_submission:  "Formulario",
  visitor_form_submission: "Visitante",
  prayer_request:          "Oraci├│n",
  first_time:              "Primera vez",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  call:    <Phone size={11} />,
  email:   <Mail size={11} />,
  visit:          <User size={11} />,
  prayer_request: <Heart size={11} />,
  first_time:     <Star size={11} />,
};

// ΓöÇΓöÇΓöÇ STATUS ΓåÆ Badge variant (replaces STATUS_COLORS map P1-C FIX) ΓöÇ
const STATUS_VARIANT: Record<string, any> = {
  pending:   "pending",
  completed: "completed",
  scheduled: "scheduled",
  skipped:   "skipped",
};

// ΓöÇΓöÇΓöÇ PRIORITY ΓåÆ Badge variant (replaces PRIORITY_COLORS map P1-C FIX) ΓöÇ
const PRIORITY_VARIANT: Record<string, any> = {
  high:   "priority-high",
  medium: "priority-medium",
  low:    "priority-low",
};

const PRIORITY_LABELS: Record<string, string> = {
  high:   "Alta",
  medium: "Media",
  low:    "Baja",
};

// ΓöÇΓöÇΓöÇ MOCK DATA ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const MOCK_FOLLOWUPS = [
  { id: "1", name: "Juan Garc├¡a",      email: "juan@email.com",   phone: "+573001234567", type: "first_time",  status: "pending",   priority: "high",   scheduledAt: "Hoy 10:00 AM", notes: "Primera visita ΓÇö lleg├│ con un amigo", isFirstTime: true },
  { id: "2", name: "Mar├¡a Rodr├¡guez",  email: "maria@email.com",  phone: "+573009876543", type: "call",        status: "pending",   priority: "high",   scheduledAt: "Hoy 2:00 PM",  notes: "Pidi├│ oraci├│n por su familia", isFirstTime: false },
  { id: "3", name: "Carlos Mej├¡a",     email: "carlos@email.com", phone: "+573005556666", type: "email",       status: "scheduled", priority: "medium", scheduledAt: "Ma├▒ana 9:00 AM", notes: "", isFirstTime: false },
  { id: "4", name: "Luisa P├⌐rez",      email: "luisa@email.com",  phone: "+573002223333", type: "visit",       status: "completed", priority: "medium", scheduledAt: "Ayer",          notes: "Visitada ΓÇö interesada en grupos peque├▒os", isFirstTime: false },
  { id: "5", name: "An├│nimo",          email: "",                 phone: "",              type: "prayer_request", status: "pending", priority: "high", scheduledAt: "Hoy",           notes: "Petici├│n de oraci├│n urgente recibida", isFirstTime: true },
];

export function CosmosVisitorFollowups() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [completing, setCompleting] = useState<string | null>(null);

  const filtered = MOCK_FOLLOWUPS.filter(f =>
    statusFilter === "all" || f.status === statusFilter
  );

  const markComplete = async (id: string) => {
    setCompleting(id);
    // In production: PATCH /api/visitor-follow-ups/[id] { status: 'completed' }
    await new Promise(r => setTimeout(r, 800));
    setCompleting(null);
  };

  return (
    <div className="space-y-5 animate-fade-up">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Seguimiento de Visitantes</h1>
          <p className="page-subtitle">
            {MOCK_FOLLOWUPS.filter(f => f.status === "pending").length} pendientes ┬╖
            Primeras visitas primero
          </p>
        </div>
      </div>

      {/* Summary chips */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          {[
            { key: "all",       label: "Todos",      count: MOCK_FOLLOWUPS.length },
            { key: "pending",   label: "Pendientes", count: MOCK_FOLLOWUPS.filter(f => f.status === "pending").length },
            { key: "scheduled", label: "Programados", count: MOCK_FOLLOWUPS.filter(f => f.status === "scheduled").length },
            { key: "completed", label: "Completados", count: MOCK_FOLLOWUPS.filter(f => f.status === "completed").length },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] transition-all border ${
                statusFilter === key
                  ? "bg-[hsl(var(--accent))] border-[hsl(var(--accent-foreground)/0.3)] text-accent-foreground"
                  : "border-[rgba(255,255,255,0.08)] text-muted-foreground hover:border-[rgba(201,146,42,0.3)]"
              }`}
            >
              {label}
              <span className={`text-[9px] px-1 rounded-full ${
                statusFilter === key
                  ? "bg-[rgba(255,255,255,0.15)]"
                  : "bg-[rgba(255,255,255,0.06)]"
              }`}>{count}</span>
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <Button variant="ghost" size="sm"><Filter size={12} /></Button>
        </div>
      </div>

      {/* Follow-up cards */}
      <div className="space-y-3 stagger">
        {filtered.map((fu) => (
          <Card
            key={fu.id}
            className={fu.status === "completed" ? "opacity-60" : ""}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-[13px] font-display font-bold"
                  style={{
                    background: fu.priority === "high" ? "rgba(232,72,85,0.15)" : "rgba(201,146,42,0.12)",
                    border: fu.priority === "high" ? "1px solid rgba(232,72,85,0.3)" : "1px solid rgba(201,146,42,0.2)",
                    color: fu.priority === "high" ? "#E84855" : "#F0B83C",
                  }}
                >
                  {fu.name === "An├│nimo" ? "?" : fu.name.charAt(0)}
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[13px] font-medium text-foreground">{fu.name}</span>

                    {/* First time badge */}
                    {fu.isFirstTime && (
                      <Badge variant="gold" size="sm" dot>Primera vez</Badge>
                    )}

                    {/* Type label (replaces TYPE_LABELS inline map) */}
                    <Badge variant="outline" size="sm">
                      {TYPE_ICONS[fu.type]}
                      {TYPE_LABELS[fu.type] || fu.type}
                    </Badge>

                    {/* Status badge (P1-C FIX ΓÇö uses variant system) */}
                    <Badge variant={STATUS_VARIANT[fu.status]} size="sm">
                      {fu.status === "pending" ? "Pendiente"
                       : fu.status === "completed" ? "Completado"
                       : fu.status === "scheduled" ? "Programado"
                       : "Omitido"}
                    </Badge>

                    {/* Priority badge (P1-C FIX ΓÇö uses variant system) */}
                    <Badge variant={PRIORITY_VARIANT[fu.priority]} size="sm">
                      {PRIORITY_LABELS[fu.priority]}
                    </Badge>
                  </div>

                  {/* Contact info */}
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-2 flex-wrap">
                    {fu.email && <span>{fu.email}</span>}
                    {fu.phone && <span>{fu.phone}</span>}
                    <span className="flex items-center gap-1">
                      <Clock size={9} /> {fu.scheduledAt}
                    </span>
                  </div>

                  {/* Notes */}
                  {fu.notes && (
                    <p className="text-[11px] text-muted-foreground italic mb-3 border-l-2 border-[rgba(201,146,42,0.2)] pl-2">
                      {fu.notes}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {fu.phone && (
                      <Button variant="emerald" size="sm" asChild>
                        <a href={`https://wa.me/${fu.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                          <MessageCircle size={12} /> WhatsApp
                        </a>
                      </Button>
                    )}
                    {fu.phone && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`tel:${fu.phone}`}>
                          <Phone size={12} /> Llamar
                        </a>
                      </Button>
                    )}
                    {fu.email && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`mailto:${fu.email}`}>
                          <Mail size={12} /> Email
                        </a>
                      </Button>
                    )}

                    {fu.status !== "completed" && (
                      <Button
                        variant="gold"
                        size="sm"
                        className="ml-auto"
                        loading={completing === fu.id}
                        onClick={() => markComplete(fu.id)}
                      >
                        <Check size={12} /> Completar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <div className="flex justify-center mb-3">
            <CheckCircle size={36} className="text-[hsl(var(--success))]" />
          </div>
          <p className="text-sm">No hay seguimientos en esta categor├¡a.</p>
        </div>
      )}
    </div>
  );
}
