
'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChurchLogo } from '@/components/ui/church-logo'
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
} from 'lucide-react'

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
    icon: Heart,
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
  {
    title: 'Comunicaciones',
    href: '/communications',
    icon: MessageSquare,
    roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'],
  },
  {
    title: 'Registro',
    href: '/check-ins',
    icon: UserCheck,
    roles: ['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'],
  },
]

// Grouped navigation sections
const navigationSections = [
  {
    title: 'Gestión y Seguimiento',
    icon: Briefcase,
    items: [
      {
        title: 'Dones Espirituales',
        href: '/spiritual-gifts',
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

export function Sidebar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    'Gestión y Seguimiento': false,
    'Marketing y Automatización': true,
    'Analíticas e Inteligencia': true,
    'Configuración': true,
  })

  console.log('🔍 SIDEBAR DEBUG:', {
    status,
    hasSession: !!session,
    userRole: session?.user?.role,
    userEmail: session?.user?.email
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

  console.log('🔍 SIDEBAR: Filtered sections:', {
    core: filteredCoreNavigation.length,
    sections: filteredNavigationSections.length,
    admin: filteredAdminNavigation.length,
    help: filteredHelpNavigation.length
  })

  // Show loading state while session is loading
  if (status === 'loading') {
    return (
      <aside className="w-64 border-r bg-muted/40 p-6">
        <div className="mb-8 pb-4 border-b border-border">
          <ChurchLogo size="lg" />
        </div>
        <div className="space-y-2">
          <div className="h-8 bg-muted animate-pulse rounded"></div>
          <div className="h-8 bg-muted animate-pulse rounded"></div>
          <div className="h-8 bg-muted animate-pulse rounded"></div>
        </div>
      </aside>
    )
  }

  // If no session, show minimal navigation
  if (!session?.user) {
    return (
      <aside className="w-64 border-r bg-muted/40 p-6">
        <div className="mb-8 pb-4 border-b border-border">
          <ChurchLogo size="lg" />
        </div>
        <div className="text-center text-sm text-muted-foreground">
          No hay sesión activa
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-64 border-r bg-muted/40 p-6 overflow-y-auto max-h-screen">
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
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground',
                  isActive && 'bg-accent text-accent-foreground font-medium'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
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
                  'flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all',
                  hasActiveItem && 'bg-accent/50 text-accent-foreground'
                )}
              >
                <div className="flex items-center gap-2">
                  <SectionIcon className="h-4 w-4" />
                  <span>{section.title}</span>
                </div>
                {isCollapsed ? (
                  <ChevronRight className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
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
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground',
                          isActive && 'bg-accent text-accent-foreground font-medium'
                        )}
                      >
                        <Icon className="h-3 w-3" />
                        {item.title}
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
                <ShieldCheck className="h-3 w-3" />
                Plataforma
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
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground',
                      isActive && 'bg-accent text-accent-foreground font-medium'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
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
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground',
                      isActive && 'bg-accent text-accent-foreground font-medium'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>
    </aside>
  )
}
