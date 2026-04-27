"use client"
// Cosmos Design System v2.0 header
// Fixes applied:
//   - Emoji protocol: replaced calendar emoji -> Calendar icon, check emoji -> CheckCircle icon
//   - LIVE_AGENTS and coverageRate are static placeholders (TODO: wire to API)

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Search, Bell, ChevronDown, Shield, Brain, Calendar, CheckCircle,
  Settings, LogOut, User, Activity, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ΓöÇΓöÇΓöÇ STATIC AGENT CHIPS (TODO: replace with real agent status API) ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const LIVE_AGENTS = [
  { id: "retention",  label: "Retenci├│n",    color: "#1DC98C", active: true },
  { id: "triage",     label: "Triage",       color: "#E84855", active: true },
  { id: "followup",   label: "Seguimiento",  color: "#F0B83C", active: true },
];

export function CosmosHeader() {
  const { data: session } = useSession();

  const [searchOpen, setSearchOpen]     = useState(false);
  const [searchQuery, setSearchQuery]   = useState("");
  const [notifOpen, setNotifOpen]       = useState(false);
  const [userOpen, setUserOpen]         = useState(false);
  const [currentTime, setCurrentTime]   = useState("");
  // TODO: replace with real coverage API call
  const [coverageRate]                  = useState(94);

  // Live clock
  useEffect(() => {
    const tick = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })
      );
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      className={cn(
        "h-14 flex items-center gap-3 px-4",
        "border-b border-[rgba(201,146,42,0.12)]",
        "bg-[rgba(5,8,15,0.75)] backdrop-blur-cosmos",
        "sticky top-0 z-nav",
        "w-full"
      )}
    >
      {/* ΓöÇΓöÇ Live system status ΓöÇΓöÇ */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="live-dot" />
        <span className="text-[9px] tracking-[0.14em] text-cosmos-emerald uppercase hidden sm:block">
          Sistema en vivo
        </span>
      </div>

      {/* ΓöÇΓöÇ Divider ΓöÇΓöÇ */}
      <div className="h-4 w-px bg-[rgba(255,255,255,0.06)] flex-shrink-0" />

      {/* ΓöÇΓöÇ Live agent chips ΓöÇΓöÇ */}
      <div className="hidden md:flex items-center gap-1.5">
        {LIVE_AGENTS.map((agent) => (
          <div
            key={agent.id}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-medium"
            style={{
              background: `${agent.color}14`,
              border: `1px solid ${agent.color}35`,
              color: agent.color,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                background: agent.color,
                animation: agent.active ? "livePulse 1.4s ease-in-out infinite" : undefined,
              }}
            />
            {agent.label}
          </div>
        ))}
      </div>

      {/* ΓöÇΓöÇ Spacer ΓöÇΓöÇ */}
      <div className="flex-1" />

      {/* ΓöÇΓöÇ Search ΓöÇΓöÇ */}
      {searchOpen ? (
        <div className="flex items-center gap-2 flex-1 max-w-xs">
          <input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar miembros, eventos..."
            className="cosmos-input h-7 text-xs flex-1"
          />
          <button
            onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--accent)/0.2)] transition-all duration-150"
        >
          <Search size={13} />
          <span className="hidden lg:block">Buscar...</span>
        </button>
      )}

      {/* ΓöÇΓöÇ Clock chip ΓöÇΓöÇ */}
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] text-muted-foreground flex-shrink-0">
        <Calendar size={10} className="text-gold-dim" />
        {currentTime}
      </div>

      {/* ΓöÇΓöÇ Coverage chip ΓöÇΓöÇ */}
      <Link
        href="/volunteers"
        className={cn(
          "hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] flex-shrink-0 transition-all duration-150 hover:opacity-80",
          coverageRate >= 90
            ? "bg-[rgba(29,201,140,0.1)] border border-[rgba(29,201,140,0.25)] text-cosmos-emerald"
            : "bg-[rgba(232,72,85,0.1)] border border-[rgba(232,72,85,0.25)] text-cosmos-rose"
        )}
      >
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{
            background: coverageRate >= 90 ? "#1DC98C" : "#E84855",
            animation: "livePulse 1.4s ease-in-out infinite",
          }}
        />
        {coverageRate}% cobertura
      </Link>

      {/* ΓöÇΓöÇ AI agents quick link ΓöÇΓöÇ */}
      <Link
        href="/home#agents"
        className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] bg-[rgba(155,143,255,0.1)] border border-[rgba(155,143,255,0.25)] text-[#9B8FFF] hover:opacity-80 transition-opacity flex-shrink-0"
      >
        <Brain size={10} />
        <span>12 IA</span>
      </Link>

      {/* ΓöÇΓöÇ Divider ΓöÇΓöÇ */}
      <div className="h-4 w-px bg-[rgba(255,255,255,0.06)] flex-shrink-0" />

      {/* ΓöÇΓöÇ Notifications ΓöÇΓöÇ */}
      <div className="relative">
        <button
          onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}
          className="relative flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[hsl(var(--accent)/0.2)] transition-colors text-muted-foreground hover:text-foreground"
        >
          <Bell size={15} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[hsl(var(--destructive))] border border-background" />
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-10 w-72 cosmos-card p-0 z-overlay shadow-cosmos-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
              <span className="text-[12px] font-medium text-foreground">Notificaciones</span>
              <button onClick={() => setNotifOpen(false)}>
                <X size={13} className="text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <div className="p-3 space-y-2">
              {[
                { icon: <Shield size={13} className="text-cosmos-rose" />, text: "3 peticiones de oraci├│n urgentes",    time: "hace 5 min" },
                { icon: <Activity size={13} className="text-cosmos-emerald" />, text: "Nuevo visitante registrado",     time: "hace 12 min" },
                { icon: <CheckCircle size={13} className="text-cosmos-emerald" />, text: "Seguimiento completado",    time: "hace 1h" },
              ].map((n, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[hsl(var(--accent)/0.2)] transition-colors cursor-pointer">
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {n.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-foreground leading-snug">{n.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ΓöÇΓöÇ User dropdown ΓöÇΓöÇ */}
      <div className="relative">
        <button
          onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-[hsl(var(--accent)/0.2)] transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-dim to-gold flex items-center justify-center text-[10px] font-display font-bold text-navy-deep flex-shrink-0">
            {session?.user?.name?.charAt(0) || "N"}
          </div>
          <span className="hidden lg:block text-[12px] text-foreground max-w-[90px] truncate">
            {session?.user?.name || "Usuario"}
          </span>
          <ChevronDown size={11} className={cn("text-muted-foreground transition-transform duration-150", userOpen && "rotate-180")} />
        </button>

        {userOpen && (
          <div className="absolute right-0 top-10 w-52 cosmos-card p-1 z-overlay shadow-cosmos-lg">
            <div className="px-3 py-2 border-b border-[rgba(255,255,255,0.06)] mb-1">
              <p className="text-[12px] font-medium text-foreground truncate">{session?.user?.name || "Usuario"}</p>
              <p className="text-[10px] text-muted-foreground truncate">{session?.user?.email || ""}</p>
            </div>
            <Link
              href="/settings"
              onClick={() => setUserOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-[12px] text-foreground hover:bg-[hsl(var(--accent)/0.3)] transition-colors"
            >
              <Settings size={13} className="text-muted-foreground" />
              Configuraci├│n
            </Link>
            <Link
              href="/users"
              onClick={() => setUserOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-[12px] text-foreground hover:bg-[hsl(var(--accent)/0.3)] transition-colors"
            >
              <User size={13} className="text-muted-foreground" />
              Mi Perfil
            </Link>
            <div className="border-t border-[rgba(255,255,255,0.06)] mt-1 pt-1">
              <button
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[12px] text-destructive hover:bg-[hsl(var(--destructive)/0.1)] transition-colors text-left"
              >
                <LogOut size={13} />
                Cerrar Sesi├│n
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

