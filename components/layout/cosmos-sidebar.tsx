"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  HandHeart,
  Calendar,
  DollarSign,
  QrCode,
  MessageSquare,
  BarChart3,
  Zap,
  FormInput,
  Share2,
  BookOpen,
  Settings,
  Bell,
  FileText,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  UserCheck,
  Lightbulb,
  Brain,
  ShieldCheck,
  ClipboardList,
  Wifi,
  Star,
  X,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
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
  alert:
    "bg-[hsl(var(--destructive)/0.15)] text-[hsl(var(--destructive))] border border-[hsl(var(--destructive)/0.3)]",
  success:
    "bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))] border border-[hsl(var(--success)/0.3)]",
  warning:
    "bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))] border border-[hsl(var(--warning)/0.3)]",
  info: "bg-[hsl(var(--info)/0.15)] text-[hsl(var(--info))] border border-[hsl(var(--info)/0.3)]",
};

const NAV_STRUCTURE: NavSection[] = [
  {
    section: "Ministerio",
    items: [
      {
        href: "/home",
        label: "Dashboard",
        icon: <LayoutDashboard size={15} />,
      },
      { href: "/members", label: "Miembros", icon: <Users size={15} /> },
      {
        href: "/prayer-wall",
        label: "Muro de Oración",
        icon: <HandHeart size={15} />,
        badge: 3,
        badgeType: "alert",
      },
      {
        href: "/check-ins",
        label: "Visitantes",
        icon: <QrCode size={15} />,
        badge: 8,
        badgeType: "success",
      },
      { href: "/sermons", label: "Sermones", icon: <BookOpen size={15} /> },
    ],
  },
  {
    section: "Operaciones",
    items: [
      {
        href: "/volunteers",
        label: "Voluntarios",
        icon: <HandHeart size={15} />,
        badge: 1,
        badgeType: "alert",
      },
      { href: "/events", label: "Eventos", icon: <Calendar size={15} /> },
      {
        href: "/donations",
        label: "Mayordomía",
        icon: <DollarSign size={15} />,
      },
      {
        href: "/communications",
        label: "Comunicaciones",
        icon: <MessageSquare size={15} />,
      },
      {
        href: "/form-builder",
        label: "Formularios",
        icon: <FormInput size={15} />,
      },
    ],
  },
  {
    section: "Inteligencia IA",
    items: [
      {
        href: "/home#agents",
        label: "12 Agentes IA",
        icon: <Brain size={15} />,
      },
      { href: "/analytics", label: "Analítica", icon: <BarChart3 size={15} /> },
      {
        href: "/intelligent-analytics",
        label: "IA Predictiva",
        icon: <Lightbulb size={15} />,
      },
      {
        href: "/automation-rules",
        label: "Automatizaciones",
        icon: <Zap size={15} />,
      },
      {
        href: "/business-intelligence",
        label: "Inteligencia Negocio",
        icon: <ClipboardList size={15} />,
      },
    ],
    collapsible: true,
  },
  {
    section: "Social & Web",
    items: [
      {
        href: "/social-media",
        label: "Redes Sociales",
        icon: <Share2 size={15} />,
      },
      { href: "/reports", label: "Informes", icon: <FileText size={15} /> },
    ],
    collapsible: true,
  },
  {
    section: "Sistema",
    items: [
      {
        href: "/notifications",
        label: "Notificaciones",
        icon: <Bell size={15} />,
      },
      {
        href: "/settings/permissions",
        label: "Usuarios y Roles",
        icon: <UserCheck size={15} />,
        roles: ["PASTOR", "ADMIN_IGLESIA"],
      },
      {
        href: "/settings",
        label: "Configuración",
        icon: <Settings size={15} />,
      },
      { href: "/help", label: "Ayuda", icon: <HelpCircle size={15} /> },
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

  // Desktop pin/collapse state (persisted in localStorage)
  const [desktopPinned, setDesktopPinned] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("cosmos:sidebar:pinned");
    if (stored !== null) setDesktopPinned(stored === "true");
  }, []);

  const toggleDesktopPin = () => {
    setDesktopPinned((p) => {
      const next = !p;
      localStorage.setItem("cosmos:sidebar:pinned", String(next));
      return next;
    });
  };

  // Mobile overlay state — toggled by header hamburger via custom event
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onToggle = () => setMobileOpen((o) => !o);
    const onClose = () => setMobileOpen(false);
    window.addEventListener("cosmos:sidebar:toggle", onToggle);
    window.addEventListener("cosmos:sidebar:close", onClose);
    return () => {
      window.removeEventListener("cosmos:sidebar:toggle", onToggle);
      window.removeEventListener("cosmos:sidebar:close", onClose);
    };
  }, []);

  // Close sidebar on route change (mobile UX)
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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
    <>
      {/* ── Mobile backdrop overlay ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 top-14 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "flex flex-col",
          "border-r border-[var(--glass-divider)]",
          "bg-[var(--glass-sidebar-bg)] backdrop-blur-cosmos",
          "no-scrollbar overflow-y-auto overflow-x-hidden",
          "transition-all duration-300 ease-out",
          // Desktop: width responds to pin state
          desktopPinned ? "md:w-[216px]" : "md:w-14",
          // Desktop: static, fills body-row height
          "md:flex-shrink-0 md:h-full md:relative md:translate-x-0",
          // Mobile: always full width overlay (pin does not apply)
          "max-md:w-[216px]",
          "max-md:fixed max-md:top-14 max-md:left-0 max-md:bottom-0 max-md:z-50",
          "max-md:transition-transform max-md:duration-300 max-md:ease-out",
          mobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full",
          className,
        )}
      >
        {/* Logo + mobile close + desktop pin toggle */}
        <div className={cn(
          "flex items-center gap-2.5 px-4 py-3.5 border-b border-[var(--glass-divider)]",
          !desktopPinned && "md:justify-center md:px-0 md:gap-1"
        )}>
          <CosmosLogoMark size={26} />
          <div className={cn("flex-1", !desktopPinned && "md:hidden")}>
            <div className="font-display text-[13px] font-bold tracking-widest text-[hsl(var(--brand-gold-bright))] leading-none">
              KHESED·TEK
            </div>
            <div className="text-[9px] text-[hsl(var(--brand-gold-dim))] tracking-[0.12em] mt-0.5">
              SYSTEMS CMS
            </div>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
            className="md:hidden flex items-center justify-center w-6 h-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--accent)/0.3)] transition-colors flex-shrink-0"
          >
            <X size={14} />
          </button>
          {/* Pin/unpin button — desktop only */}
          <button
            onClick={toggleDesktopPin}
            aria-label={desktopPinned ? "Colapsar menú" : "Expandir menú"}
            className="max-md:hidden flex items-center justify-center w-6 h-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--accent)/0.3)] transition-colors flex-shrink-0"
          >
            {desktopPinned ? (
              <PanelLeftClose size={14} />
            ) : (
              <PanelLeftOpen size={14} />
            )}
          </button>
        </div>

        {/* Live status — hidden when desktop-collapsed */}
        <div
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 border-b border-[var(--glass-border-soft)]",
            !desktopPinned && "md:hidden",
          )}
        >
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
              {/* Section header — hidden when desktop-collapsed */}
              {!desktopPinned ? (
                <div className="max-md:block hidden" />
              ) : group.collapsible ? (
                <button
                  onClick={() => toggleSection(group.section)}
                  className={cn(
                    "w-full flex items-center gap-2 px-4 py-2 mt-2",
                    "text-[9px] tracking-[0.16em] uppercase",
                    "nav-section-btn rounded-none",
                    "transition-all duration-150",
                    "text-left cursor-pointer",
                  )}
                >
                  <span className="text-[hsl(var(--brand-gold-dim))]">
                    {group.section}
                  </span>
                  <div className="flex-1 h-px bg-[var(--glass-divider)]" />
                  {collapsed[group.section] ? (
                    <ChevronRight
                      size={9}
                      className="text-[hsl(var(--brand-gold-dim))]"
                    />
                  ) : (
                    <ChevronDown
                      size={9}
                      className="text-[hsl(var(--brand-gold-dim))]"
                    />
                  )}
                </button>
              ) : (
                <div className="section-label px-4 py-2 mt-2">
                  {group.section}
                </div>
              )}

              {/* Nav items — always show when desktop-collapsed (icons only) */}
              {(desktopPinned
                ? !group.collapsible || !collapsed[group.section]
                : true) && (
                <div className="mt-0.5">
                  {group.items.filter(canSee).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={!desktopPinned ? item.label : undefined}
                      className={cn(
                        "nav-item",
                        isActive(item.href) && "active",
                        !desktopPinned && "md:justify-center md:px-0",
                      )}
                    >
                      <span
                        className={cn(
                          "flex-shrink-0 flex items-center justify-center text-[hsl(var(--muted-foreground))]",
                          desktopPinned ? "w-4" : "md:w-full md:max-w-[40px]",
                        )}
                      >
                        {item.icon}
                      </span>
                      <span
                        className={cn(
                          "flex-1 truncate",
                          !desktopPinned && "md:hidden",
                        )}
                      >
                        {item.label}
                      </span>
                      {desktopPinned && item.badge && item.badgeType && (
                        <span
                          className={cn(
                            "ml-auto px-1.5 py-0.5 rounded-full text-[9px] font-medium flex-shrink-0",
                            BADGE_STYLES[item.badgeType],
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
        <div className="border-t border-[var(--glass-divider)] p-3">
          <div
            className={cn(
              "flex items-center gap-2.5 p-2 rounded-lg hover:bg-[hsl(var(--accent)/0.3)] cursor-pointer transition-colors",
              !desktopPinned && "md:justify-center",
            )}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[hsl(var(--brand-gold-dim))] to-[hsl(var(--brand-gold))] flex items-center justify-center text-[11px] font-display font-bold text-[hsl(var(--brand-navy-deep))] flex-shrink-0">
              {session?.user?.name?.charAt(0) || "N"}
            </div>
            <div
              className={cn("flex-1 min-w-0", !desktopPinned && "md:hidden")}
            >
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
            <Settings
              size={12}
              className={cn(
                "text-muted-foreground flex-shrink-0",
                !desktopPinned && "md:hidden",
              )}
            />
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Logo Mark Component ──────────────────────────────────────────────────────
function CosmosLogoMark({ size = 26 }: { size?: number }) {
  return (
    <div
      style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
    >
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
