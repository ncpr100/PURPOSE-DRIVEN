"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Building2,
  Users,
  User,
  BarChart3,
  Settings,
  ArrowLeft,
  Book,
  MessageCircle,
  Globe,
  FileText,
  Key,
  ClipboardList,
  QrCode,
  Menu,
  Share2,
  CreditCard,
  Shield,
  Zap,
  Cpu,
} from "lucide-react";

const navigation = [
  {
    name: "Panel de Control",
    href: "/platform/dashboard",
    icon: LayoutDashboard,
  },
  { name: "Iglesias", href: "/platform/churches", icon: Building2 },
  { name: "Usuarios", href: "/platform/users", icon: Users },
  { name: "Suscripciones", href: "/platform/billing", icon: CreditCard },
  { name: "Facturas", href: "/platform/invoices", icon: FileText },
  { name: "Credenciales", href: "/platform/tenant-credentials", icon: Key },
  { name: "Servicios Web", href: "/platform/website-services", icon: Globe },
  {
    name: "Herramientas de Marketing",
    href: "/platform/forms",
    icon: ClipboardList,
  },
  { name: "Redes Sociales", href: "/platform/social-media", icon: Share2 },
  { name: "Analítica", href: "/platform/analytics", icon: BarChart3 },
  { name: "Mi Perfil", href: "/platform/profile", icon: User },
{ name: "Configuración de Agentes", href: "/platform/agents/settings", icon: Cpu },
{ name: "SRE — Uptime 24/7", href: "/platform/agents/sre", icon: Shield },
  { name: "Rendimiento Web", href: "/platform/agents/performance", icon: Zap },
  { name: "Configuración", href: "/platform/settings", icon: Settings },
  {
    name: "Config. Soporte",
    href: "/platform/support-settings",
    icon: MessageCircle,
  },
  { name: "Documentación", href: "/platform/help", icon: Book },
];

// Desktop Sidebar Component
function DesktopSidebar({ pathname }: { pathname: string }) {
  return (
    <div className="hidden md:flex w-64 bg-background text-white flex-col">
      {/* Logo */}
      <div className="p-4 pb-2">
        <div className="flex items-center gap-3">
          <Logo size="md" showText={false} />
          <div>
            <h1 className="text-sm font-bold leading-tight">K%esed-tek</h1>
            <p className="text-xs text-muted-foreground/70">Super Admin</p>
          </div>
        </div>
      </div>

      <SidebarNavigation pathname={pathname} />
    </div>
  );
}

// Mobile Sidebar Component
function MobileSidebar({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden fixed top-4 left-4 z-50 bg-[hsl(var(--card))] shadow-md hover:bg-muted/50"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <div className="bg-background text-white h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 pb-2">
            <div className="flex items-center gap-3">
              <Logo size="md" showText={false} />
              <div>
                <h1 className="text-sm font-bold leading-tight">K%esed-tek</h1>
                <p className="text-xs text-muted-foreground/70">Super Admin</p>
              </div>
            </div>
          </div>

          <SidebarNavigation
            pathname={pathname}
            onNavigate={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Shared Navigation Component
function SidebarNavigation({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-[hsl(var(--info))] text-white"
                  : "text-muted-foreground/70 hover:bg-muted/50 hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Back to Platform Dashboard */}
      <div className="p-4 border-t border-border">
        <Link
          href="/platform/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground/70 hover:bg-muted/50 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Panel Principal
        </Link>
      </div>
    </>
  );
}

export function PlatformSidebar() {
  const pathname = usePathname();

  return (
    <>
      <MobileSidebar pathname={pathname} />
      <DesktopSidebar pathname={pathname} />
    </>
  );
}

