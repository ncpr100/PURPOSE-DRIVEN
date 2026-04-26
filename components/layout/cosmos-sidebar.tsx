"use client";
// components/layout/cosmos-sidebar.tsx
// Cosmos Design System v2.0 sidebar
// Replaces: components/layout/mobile-sidebar.tsx
// Fixes applied:
//   - PrayingHands (not in lucide-react) → HandHeart

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, HandHeart, Calendar, DollarSign,
  QrCode, MessageSquare, BarChart3, Zap, FormInput,
  Share2, BookOpen, Settings, Bell, FileText,
  ChevronDown, ChevronRight, UserCheck, Lightbulb,
  Brain, ShieldCheck, ClipboardList, Wifi, Star,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeType?: "alert" | "success" | "warning" | "info";
  roles?: string[];
}

interface NavSection {
  section: string;
  items: NavItem[];
  roles?: string[];
  collapsible?: boolean;
}

const BADGE_STYLES = {
  alert:   "bg-[hsl(var(--destructive)/0.15)] text-[hsl(var(--destructive))] border border-[hsl(var(--destructive)/0.3)]",
  success: "bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))] border border-[hsl(var(--success)/0.3)]",
  warning: "bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))] border border-[hsl(var(--warning)/0.3)]",
  info:    "bg-[hsl(var(--info)/0.15)] text-[hsl(var(--info))] border border-[hsl(var(--info)/0.3)]",
};

const NAV_STRUCTURE: NavSection[] = [
  {
    section: "Ministerio",
    items: [
      { href: "/home",          label: "Dashboard",          icon: <LayoutDashboard size={15} /> },
      { href: "/members",       label: "Miembros",           icon: <Users size={15} /> },
      { href: "/prayer-wall",   label: "Muro de Oración",    icon: <HandHeart size={15} />,     badge: 3,  badgeType: "alert" },
      { href: "/check-ins",     label: "Visitantes",         icon: <QrCode size={15} />,        badge: 8,  badgeType: "success" },
      { href: "/sermons",       label: "Sermones",           icon: <BookOpen size={15} /> },
    ],
  },
  {
    section: "Operaciones",
    items: [
      { href: "/volunteers",    label: "Voluntarios",        icon: <HandHeart size={15} />,     badge: 1,  badgeType: "alert" },
      { href: "/events",        label: "Eventos",            icon: <Calendar size={15} /> },
      { href: "/donations",     label: "Mayordomía",         icon: <DollarSign size={15} /> },
      { href: "/communications",label: "Comunicaciones",     icon: <MessageSquare size={15} /> },
      { href: "/form-builder",  label: "Formularios",        icon: <FormInput size={15} /> },
    ],
  },
  {
    section: "Inteligencia IA",
    items: [
      { href: "/home#agents",           label: "12 Agentes IA",          icon: <Brain size={15} /> },
      { href: "/analytics",             label: "Analítica",               icon: <BarChart3 size={15} /> },
      { href: "/intelligent-analytics", label: "IA Predictiva",          icon: <Lightbulb size={15} /> },
      { href: "/automation-rules",      label: "Automatizaciones",       icon: <Zap size={15} /> },
      { href: "/business-intelligence", label: "Inteligencia Negocio",   icon: <ClipboardList size={15} /> },
    ],
    collapsible: true,
  },
  {
    section: "Social & Web",
    items: [
      { href: "/social-media", label: "Redes Sociales",  icon: <Share2 size={15} /> },
      { href: "/reports",      label: "Informes",         icon: <FileText size={15} /> },
    ],
    collapsible: true,
  },
  {
    section: "Sistema",
    items: [
      { href: "/notifications", label: "Notificaciones",  icon: <Bell size={15} /> },
      { href: "/users",         label: "Usuarios y Roles", icon: <UserCheck size={15} />, roles: ["PASTOR", "ADMIN_IGLESIA"] },
      { href: "/settings",      label: "Configuración",   icon: <Settings size={15} /> },
    ],
  },
];

interface CosmosSidebarProps {
  className?: string;
}

export function CosmosSidebar({ className }: CosmosSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "MIEMBRO";

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    "Inteligencia IA": false,
    "Social & Web": true,
  });

  const toggleSection = (section: string) => {
    setCollapsed((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const isActive = (href: string) => {
    if (href === "/home") return pathname === "/home" || pathname === "/";
    return pathname.startsWith(href);
  };

  const canSee = (item: NavItem) => {
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full",
        "border-r border-[rgba(201,146,42,0.1)]",
        "bg-[rgba(5,8,15,0.65)] backdrop-blur-cosmos",
        "no-scrollbar overflow-y-auto overflow-x-hidden",
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-[rgba(201,146,42,0.1)]">
        <CosmosLogoMark size={26} />
        <div>
          <div className="font-display text-[13px] font-bold tracking-widest text-[hsl(var(--brand-gold-bright))] leading-none">
            KHESED·TEK
          </div>
          <div className="text-[9px] text-[hsl(var(--brand-gold-dim))] tracking-[0.12em] mt-0.5">
            SYSTEMS CMS
          </div>
        </div>
      </div>

      {/* Live status */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[rgba(255,255,255,0.04)]">
        <div className="live-dot" />
        <span className="text-[9px] tracking-[0.12em] text-[#1DC98C] uppercase">
          12 Agentes Activos
        </span>
        <div className="ml-auto flex items-center gap-1">
          <Wifi size={9} className="text-[#1DC98C]" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2">
        {NAV_STRUCTURE.map((group) => (
          <div key={group.section}>
            {/* Section header */}
            {group.collapsible ? (
              <button
                onClick={() => toggleSection(group.section)}
                className={cn(
                  "w-full flex items-center gap-2 px-4 py-2 mt-2",
                  "text-[9px] tracking-[0.16em] uppercase",
                  "nav-section-btn rounded-none",
                  "transition-all duration-150",
                  "text-left cursor-pointer"
                )}
              >
                <span className="text-[hsl(var(--brand-gold-dim))]">{group.section}</span>
                <div className="flex-1 h-px bg-[rgba(201,146,42,0.1)]" />
                {collapsed[group.section] ? (
                  <ChevronRight size={9} className="text-[hsl(var(--brand-gold-dim))]" />
                ) : (
                  <ChevronDown size={9} className="text-[hsl(var(--brand-gold-dim))]" />
                )}
              </button>
            ) : (
              <div className="section-label px-4 py-2 mt-2">{group.section}</div>
            )}

            {/* Nav items */}
            {(!group.collapsible || !collapsed[group.section]) && (
              <div className="mt-0.5">
                {group.items.filter(canSee).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn("nav-item", isActive(item.href) && "active")}
                  >
                    <span className="w-4 flex-shrink-0 flex items-center justify-center text-[hsl(var(--muted-foreground))]">
                      {item.icon}
                    </span>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && item.badgeType && (
                      <span
                        className={cn(
                          "ml-auto px-1.5 py-0.5 rounded-full text-[9px] font-medium flex-shrink-0",
                          BADGE_STYLES[item.badgeType]
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-[rgba(201,146,42,0.1)] p-3">
        <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[hsl(var(--accent)/0.3)] cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[hsl(var(--brand-gold-dim))] to-[hsl(var(--brand-gold))] flex items-center justify-center text-[11px] font-display font-bold text-[hsl(var(--brand-navy-deep))] flex-shrink-0">
            {session?.user?.name?.charAt(0) || "N"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-medium text-foreground truncate">
              {session?.user?.name || "Usuario"}
            </div>
            <div className="text-[9px] text-muted-foreground truncate">
              {userRole === "PASTOR"
                ? "Pastor"
                : userRole === "ADMIN_IGLESIA"
                ? "Admin"
                : userRole}
            </div>
          </div>
          <Settings size={12} className="text-muted-foreground flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
}

// ─── Logo Mark Component ─────────────────────────────────────
function CosmosLogoMark({ size = 26 }: { size?: number }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {/* Vertical bar */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          bottom: 0,
          width: "2.5px",
          background: "hsl(var(--brand-gold-bright))",
          borderRadius: "2px",
          transform: "translateX(-50%)",
        }}
      />
      {/* Horizontal bar */}
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: 0,
          right: 0,
          height: "2.5px",
          background: "hsl(var(--brand-gold-bright))",
          borderRadius: "2px",
          transform: "translateY(-50%)",
        }}
      />
      {/* Dove dot */}
      <div
        style={{
          position: "absolute",
          top: -1,
          right: -1,
          width: "8px",
          height: "8px",
          background: "hsl(var(--brand-gold-bright))",
          borderRadius: "50% 50% 50% 0",
          transform: "rotate(45deg)",
          boxShadow: "0 0 6px hsl(var(--brand-gold-bright))",
        }}
      />
    </div>
  );
}
