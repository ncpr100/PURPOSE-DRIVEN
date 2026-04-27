"use client";
// app/(dashboard)/check-ins/cosmos-checkins-page.tsx
// Full Cosmos redesign ΓÇö FIXES P1-B: CTA button was bg-gradient-to-r from-blue-500 to-purple-600
// Now uses btn-cta-gradient utility from globals.css

import { useState } from "react";
import { QrCode, Shield, Camera, Zap, Baby, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ΓöÇΓöÇΓöÇ VISITOR FORM ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
function VisitorCheckInForm() {
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // In production: POST /api/check-ins
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 block">
            Nombre *
          </label>
          <input className="cosmos-input" placeholder="Juan" required />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 block">
            Apellido *
          </label>
          <input className="cosmos-input" placeholder="Garc├¡a" required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 block">
            Email
          </label>
          <input className="cosmos-input" type="email" placeholder="juan@email.com" />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 block">
            Tel├⌐fono
          </label>
          <input className="cosmos-input" type="tel" placeholder="+57 300..." />
        </div>
      </div>

      {/* First time toggle */}
      <div
        onClick={() => setIsFirstTime(!isFirstTime)}
        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
          isFirstTime
            ? "border-[rgba(201,146,42,0.4)] bg-[rgba(201,146,42,0.08)]"
            : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(201,146,42,0.2)]"
        }`}
      >
        <div className={`w-10 h-5 rounded-full relative transition-colors ${isFirstTime ? "bg-gold" : "bg-muted"}`}>
          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isFirstTime ? "translate-x-5" : "translate-x-0.5"}`} />
        </div>
        <div>
          <div className="text-[13px] font-medium text-foreground">Primera visita</div>
          <div className="text-[10px] text-muted-foreground">Se crear├í un seguimiento autom├ítico</div>
        </div>
        {isFirstTime && <Badge variant="gold" size="sm" className="ml-auto">Prioridad alta</Badge>}
      </div>

      <div>
        <label className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 block">
          Motivo de visita
        </label>
        <input className="cosmos-input" placeholder="┬┐C├│mo nos conoci├│?" />
      </div>

      <div>
        <label className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 block">
          Petici├│n de oraci├│n (opcional)
        </label>
        <textarea
          className="cosmos-input resize-none"
          rows={2}
          placeholder="┬┐Hay algo espec├¡fico por lo que podamos orar?"
        />
      </div>

      {/* CTA Button ΓÇö FIXED P1-B: was from-blue-500 to-purple-600 */}
      <Button
        type="submit"
        className="w-full btn-cta-gradient h-11 text-sm font-semibold"
        loading={submitting}
      >
        {!submitting && <><Zap size={15} /> Registrar Visitante</>}
      </Button>
    </form>
  );
}

// ΓöÇΓöÇΓöÇ CHILDREN FORM ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
function ChildrenCheckInForm() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Security indicator */}
      <div className="flex items-center gap-2 p-3 rounded-lg border border-[rgba(38,217,217,0.2)] bg-[rgba(38,217,217,0.06)]">
        <Shield size={16} className="text-[#26D9D9] flex-shrink-0" />
        <div>
          <div className="text-[12px] font-medium text-[#26D9D9]">Sistema de Seguridad Activo</div>
          <div className="text-[10px] text-muted-foreground">PIN de seguridad generado autom├íticamente</div>
        </div>
      </div>

      {/* Child info */}
      <div>
        <div className="section-label mb-3">Datos del Ni├▒o</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 block">Nombre *</label>
            <input className="cosmos-input" placeholder="Mar├¡a" required />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 block">Edad *</label>
            <input className="cosmos-input" type="number" placeholder="5" min="0" max="17" required />
          </div>
        </div>
      </div>

      {/* Guardian info */}
      <div>
        <div className="section-label mb-3">Datos del Acudiente</div>
        <div className="space-y-3">
          <input className="cosmos-input" placeholder="Nombre del padre/madre *" required />
          <div className="grid grid-cols-2 gap-3">
            <input className="cosmos-input" type="tel" placeholder="Tel├⌐fono *" required />
            <input className="cosmos-input" type="email" placeholder="Email" />
          </div>
        </div>
      </div>

      {/* Emergency contact */}
      <div>
        <div className="section-label mb-3">Contacto de Emergencia</div>
        <div className="grid grid-cols-2 gap-3">
          <input className="cosmos-input" placeholder="Nombre" />
          <input className="cosmos-input" type="tel" placeholder="Tel├⌐fono" />
        </div>
      </div>

      {/* Medical info */}
      <div>
        <label className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 block">Alergias / Necesidades especiales</label>
        <textarea className="cosmos-input resize-none" rows={2} placeholder="Ninguna" />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full btn-cta-gradient h-11 text-sm font-semibold"
        loading={submitting}
      >
        {!submitting && <><Shield size={15} /> Registrar con Seguridad</>}
      </Button>
    </form>
  );
}

// ΓöÇΓöÇΓöÇ RECENT CHECK-INS ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const RECENT = [
  { name: "Juan Garc├¡a",    time: "hace 2 min",  type: "first_time", color: "#F0B83C" },
  { name: "Ana Mart├¡nez",   time: "hace 5 min",  type: "returning",  color: "#1DC98C" },
  { name: "Carlos B.",      time: "hace 8 min",  type: "returning",  color: "#1DC98C" },
  { name: "Ni├▒a: Sof├¡a L.", time: "hace 12 min", type: "child",      color: "#26D9D9" },
];

// ΓöÇΓöÇΓöÇ MAIN PAGE ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
export function CosmosCheckInsPage() {
  const [activeTab, setActiveTab] = useState<"visitor" | "child">("visitor");

  return (
    <div className="space-y-5 animate-fade-up">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Registro de Visitantes</h1>
          <p className="page-subtitle">Domingo ┬╖ 9:00 AM ┬╖ 23 registros hoy</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <QrCode size={13} /> Esc├íner QR
          </Button>
          <Button variant="glass" size="sm">
            <Camera size={13} /> QR de Bienvenida
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Form card */}
        <div className="lg:col-span-2">
          <Card>
            {/* Tab header */}
            <div className="flex border-b border-[rgba(255,255,255,0.06)]">
              {[
                { id: "visitor", label: "Visitante", icon: <User size={13} /> },
                { id: "child",   label: "Ni├▒os y J├│venes", icon: <Baby size={13} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "visitor" | "child")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-all border-b-2 -mb-px ${
                    activeTab === tab.id
                      ? "border-gold-bright text-gold-bright"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            <CardContent className="pt-5">
              {activeTab === "visitor" ? <VisitorCheckInForm /> : <ChildrenCheckInForm />}
            </CardContent>
          </Card>
        </div>

        {/* Recent activity */}
        <div className="space-y-3">
          <Card>
            <CardHeader><CardTitle>Registros Recientes</CardTitle></CardHeader>
            <CardContent className="pt-0 space-y-2">
              {RECENT.map((r, i) => (
                <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[hsl(var(--accent)/0.2)] transition-colors">
                  <div
                    className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-display font-bold"
                    style={{ background: `${r.color}20`, border: `1px solid ${r.color}40`, color: r.color }}
                  >
                    {r.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-foreground truncate">{r.name}</div>
                    <div className="text-[10px] text-muted-foreground">{r.time}</div>
                  </div>
                  <Badge
                    variant={r.type === "first_time" ? "gold" : r.type === "child" ? "info" : "success"}
                    size="sm"
                  >
                    {r.type === "first_time" ? "1ra" : r.type === "child" ? "Ni├▒o" : "Reg"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Today's stats */}
          <Card variant="glass">
            <CardContent className="p-4 space-y-3">
              <div className="section-label">Hoy</div>
              {[
                { label: "Total registros",    value: 23,  color: "#F0B83C" },
                { label: "Primera visita",     value: 5,   color: "#E84855" },
                { label: "Ni├▒os registrados",  value: 8,   color: "#26D9D9" },
                { label: "Seguimientos creados", value: 5, color: "#1DC98C" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">{s.label}</span>
                  <span className="text-[13px] font-display font-bold" style={{ color: s.color }}>
                    {s.value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
