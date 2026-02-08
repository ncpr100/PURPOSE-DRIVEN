'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { ChurchLogo } from '@/components/ui/church-logo'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  Settings,
  UserPlus,
  UserCheck,
  Phone,
  QrCode,
  Heart,
  DollarSign,
  MessageSquare,
  CalendarClock,
  Share2,
  Megaphone,
  BarChart3,
  TrendingUp,
  Globe,
  Shield,
  Palette,
  Bell,
  Zap,
  HelpCircle,
  Brain,
  Building2,
  FileText,
  ChevronDown,
  ChevronRight,
  Briefcase,
  Cog,
  PieChart,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react'

// Mobile sidebar context
interface SidebarContextType {
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | null>(null)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <SidebarContext.Provider value={{ isMobileOpen, setIsMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

// Core navigation items - always visible
const coreNavigation = [
  {
    title: 'Panel de Control',
    href: '/home',
    icon: LayoutDashboard,
    roles: ['ADMIN_IGLESIA', 'PASTOR', 'LIDER', 'MIEMBRO'],
  },
  {
    title: 'Miembros',
    href: '/members',
    icon: Users,
    roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'],
  },
  {
    title: 'Voluntarios',
    href: '/volunteers',
    icon: UserCheck,
    roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'],
  },
  {
    title: 'Visitantes',
    href: '/visitors',
    icon: UserPlus,
    roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'],
  },
  {
    title: 'Eventos',
    href: '/events',
    icon: Calendar,
    roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'],
  },
  {
    title: 'Donaciones',
    href: '/donations',
    icon: DollarSign,
    roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'],
  },
]

// Grouped navigation sections
const navigationSections = [
  {
    title: 'Comunicación y Formularios',
    icon: MessageSquare,
    items: [
      {
        title: 'Comunicaciones',
        href: '/communications',
        icon: MessageSquare,
        roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'],
      },
      {
        title: 'Seguimiento de Visitantes',
        href: '/visitor-follow-ups',
        icon: CalendarClock,
        roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'],
      },
      {
        title: 'Analíticas Inteligentes',
        href: '/intelligent-analytics',
        icon: Brain,
        roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'],
      },
      {
        title: 'Constructor de Formularios',
        href: '/form-builder',
        icon: QrCode,
        roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'],
      },
      {
        title: 'Envíos de Formularios',
        href: '/form-submissions',
        icon: FileText,
        roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'],
      },
      {
        title: 'Seguimiento',
        href: '/follow-ups',
        icon: Phone,
        roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'],
      },
      {
        title: 'Muro de Oración',
        href: '/prayer-wall',
        icon: Heart,
        roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'],
      },
      {
        title: 'Peticiones de Oración',
        href: '/prayer-requests',
        icon: MessageSquare,
        roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'],
      },
    ],
  },
  {
    title: 'Marketing y Automatización',
    icon: Zap,
    items: [
      {
        title: 'Redes Sociales',
        href: '/social-media',
        icon: Share2,
        roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'],
      },
      {
        title: 'Campañas Marketing',
        href: '/marketing-campaigns',
        icon: Megaphone,
        roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'],
      },
      {
        title: 'Reglas de Automatización',
        href: '/automation-rules',
        icon: Zap,
        roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'],
      },
      {
        title: 'Notificaciones',
        href: '/notifications',
        icon: Bell,
        roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER', 'MIEMBRO'],
      },
    ],
  },
  {
    title: 'Analíticas e Inteligencia',
    icon: PieChart,
    items: [
      {
        title: 'Analíticas',
        href: '/analytics',
        icon: BarChart3,
        roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'],
      },
      {
        title: 'Perspectivas Pastorales',
        href: '/business-intelligence',
        icon: TrendingUp,
        roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'],
      },
      {
        title: 'Asistente de Sermones',
        href: '/sermons',
        icon: BookOpen,
        roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'],
      },
    ],
  },
  {
    title: 'Configuración',
    icon: Cog,
    items: [
      {
        title: 'Perfil Personal',
        href: '/profile',
        icon: Settings,
        roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER', 'MIEMBRO'],
      },
      {
        title: 'Perfil de la Iglesia',
        href: '/settings/profile',
        icon: Building2,
        roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'],
      },
      {
        title: 'Gestión de Permisos',
        href: '/settings/permissions',
        icon: Shield,
        roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA'],
      },
      {
        title: 'Colores de Marca',
        href: '/settings/branding',
        icon: Palette,
        roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA'],
      },
      {
        title: 'Gestión de Ministerios',
        href: '/settings/ministries',
        icon: Heart,
        roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'],
      },
      {
        title: 'Configuración de Donaciones',
        href: '/settings/donations',
        icon: DollarSign,
        roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR'],
      },
      {
        title: 'Configuración de Notificaciones',
        href: '/settings/notifications',
        icon: Bell,
        roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER', 'MIEMBRO'],
      },
      {
        title: 'Solicitar Sitio Web',
        href: '/website-requests',
        icon: Globe,
        roles: ['ADMIN_IGLESIA', 'PASTOR', 'LIDER'],
      },
    ],
  },
]

// Admin navigation - separate section for SUPER_ADMIN
const adminNavigation = [
  {
    title: 'Plataforma Admin',
    href: '/platform/dashboard',
    icon: ShieldCheck,
    roles: ['SUPER_ADMIN'],
  },
  {
    title: 'Configuración de Plataforma',
    href: '/settings',
    icon: Settings,
    roles: ['SUPER_ADMIN'],
  },
  {
    title: 'Configuración de Plataforma (Tema)',
    href: '/settings/theme',
    icon: Palette,
    roles: ['SUPER_ADMIN'],
  },
]

// Help navigation - always at bottom
const helpNavigation = [
  {
    title: 'Ayuda',
    href: '/help',
    icon: HelpCircle,
    roles: ['ADMIN_IGLESIA', 'PASTOR', 'LIDER', 'MIEMBRO'],
  },
]

function SidebarContent() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const sidebarContext = useContext(SidebarContext)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    'Comunicación y Formularios': false,
    'Marketing y Automatización': true,
    'Analíticas e Inteligencia': true,
    'Configuración': true,
  })

  // Helper function to filter items by role
  const filterItemsByRole = (items: any[]) => {
    return items.filter(item => {
      const hasRole = session?.user?.role && item?.roles?.includes(session.user.role as string)
      return hasRole
    })
  }

  // Filter all navigation sections
  const filteredCoreNavigation = filterItemsByRole(coreNavigation)
  const filteredNavigationSections = navigationSections.map(section => ({
    ...section,
    items: filterItemsByRole(section.items)
  })).filter(section => section.items.length > 0)
  const filteredAdminNavigation = filterItemsByRole(adminNavigation)
  const filteredHelpNavigation = filterItemsByRole(helpNavigation)

  const toggleSection = (sectionTitle: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }))
  }

  // Handle mobile link clicks
  const handleLinkClick = () => {
    if (sidebarContext) {
      sidebarContext.setIsMobileOpen(false)
    }
  }

  // Show loading state while session is loading
  if (status === 'loading') {
    return (
      <div className="p-6">
        <div className="mb-8 pb-4 border-b border-border">
          <ChurchLogo size="lg" />
        </div>
        <div className="space-y-2">
          <div className="h-8 bg-muted animate-pulse rounded"></div>
          <div className="h-8 bg-muted animate-pulse rounded"></div>
          <div className="h-8 bg-muted animate-pulse rounded"></div>
        </div>
      </div>
    )
  }

  // If no session, show minimal navigation
  if (!session?.user) {
    return (
      <div className="p-6">
        <div className="mb-8 pb-4 border-b border-border">
          <ChurchLogo size="lg" />
        </div>
        <div className="text-center text-sm text-muted-foreground">
          No hay sesión activa
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 overflow-y-auto">
      {/* Church Branding Section */}
      <div className="mb-6 pb-4 border-b border-border">
        <ChurchLogo size="lg" />
      </div>
      
      <nav className="space-y-1">
        {/* Core Navigation - Always Visible */}
        <div className="space-y-1 mb-6">
          {filteredCoreNavigation.map((item) => {
            if (!item) return null
            
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-all hover:bg-accent hover:text-accent-foreground touch-manipulation',
                  'lg:py-2', // Smaller padding on desktop
                  isActive && 'bg-accent text-accent-foreground font-medium'
                )}
              >
                <Icon className="h-5 w-5 lg:h-4 lg:w-4 flex-shrink-0" />
                <span className="truncate">{item.title}</span>
              </Link>
            )
          })}
        </div>

        {/* Collapsible Navigation Sections */}
        {filteredNavigationSections.map((section) => {
          const SectionIcon = section.icon
          const isCollapsed = collapsedSections[section.title]
          const hasActiveItem = section.items.some(item => pathname === item.href)

          return (
            <div key={section.title} className="mb-4">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.title)}
                className={cn(
                  'flex items-center justify-between w-full px-3 py-3 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all touch-manipulation',
                  'lg:py-2', // Smaller padding on desktop
                  hasActiveItem && 'bg-accent/50 text-accent-foreground'
                )}
              >
                <div className="flex items-center gap-3">
                  <SectionIcon className="h-5 w-5 lg:h-4 lg:w-4 flex-shrink-0" />
                  <span className="truncate text-left">{section.title}</span>
                </div>
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4 lg:h-3 lg:w-3 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 lg:h-3 lg:w-3 flex-shrink-0" />
                )}
              </button>

              {/* Section Items */}
              {!isCollapsed && (
                <div className="ml-6 mt-2 space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={handleLinkClick}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-all hover:bg-accent hover:text-accent-foreground touch-manipulation',
                          'lg:py-2', // Smaller padding on desktop
                          isActive && 'bg-accent text-accent-foreground font-medium'
                        )}
                      >
                        <Icon className="h-4 w-4 lg:h-3 lg:w-3 flex-shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {/* Admin Navigation - SUPER_ADMIN only */}
        {filteredAdminNavigation.length > 0 && (
          <div className="pt-4 border-t border-border">
            <div className="mb-3">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <ShieldCheck className="h-3 w-3 flex-shrink-0" />
                <span>Plataforma</span>
              </div>
            </div>
            <div className="space-y-1">
              {filteredAdminNavigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-all hover:bg-accent hover:text-accent-foreground touch-manipulation',
                      'lg:py-2', // Smaller padding on desktop
                      isActive && 'bg-accent text-accent-foreground font-medium'
                    )}
                  >
                    <Icon className="h-5 w-5 lg:h-4 lg:w-4 flex-shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Help Navigation - Always at bottom */}
        {filteredHelpNavigation.length > 0 && (
          <div className="pt-4 border-t border-border">
            <div className="space-y-1">
              {filteredHelpNavigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-all hover:bg-accent hover:text-accent-foreground touch-manipulation',
                      'lg:py-2', // Smaller padding on desktop
                      isActive && 'bg-accent text-accent-foreground font-medium'
                    )}
                  >
                    <Icon className="h-5 w-5 lg:h-4 lg:w-4 flex-shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}

export function Sidebar() {
  const sidebarContext = useContext(SidebarContext)

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-muted/40">
        <div className="flex-1 overflow-hidden">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Sidebar - Sheet overlay */}
      {sidebarContext && (
        <>
          {/* Mobile overlay backdrop */}
          {sidebarContext.isMobileOpen && (
            <div 
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => sidebarContext.setIsMobileOpen(false)}
            />
          )}
          
          {/* Mobile sidebar */}
          <div
            className={cn(
              'fixed inset-y-0 left-0 z-50 w-80 bg-background border-r transform transition-transform duration-200 ease-in-out lg:hidden',
              sidebarContext.isMobileOpen ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            {/* Mobile sidebar header with close button */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menú Principal</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => sidebarContext.setIsMobileOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Cerrar menú</span>
              </Button>
            </div>
            
            {/* Mobile sidebar content */}
            <div className="flex-1 overflow-hidden">
              <SidebarContent />
            </div>
          </div>
        </>
      )}
    </>
  )
}

// Mobile menu button component for header
export function MobileSidebarTrigger() {
  const sidebarContext = useContext(SidebarContext)
  
  if (!sidebarContext) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => sidebarContext.setIsMobileOpen(true)}
      className="lg:hidden"
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Abrir menú</span>
    </Button>
  )
}