import { Metadata } from 'next'
import Link from 'next/link'
import {
  User, Palette, ShieldCheck, Bell, Plug, BookOpen, DollarSign, GraduationCap
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Configuración | Kḥesed-tek',
  description: 'Configuración del sistema de gestión eclesiástica',
}

const SETTINGS_SECTIONS = [
  {
    href: '/settings/profile',
    icon: User,
    title: 'Perfil de Iglesia',
    description: 'Nombre, dirección, logo y datos de contacto de la iglesia',
    color: 'text-blue-400',
  },
  {
    href: '/settings/theme',
    icon: Palette,
    title: 'Tema y Marca',
    description: 'Colores, presets, tipografía, diseño visual y datos de la iglesia en un solo lugar',
    color: 'text-purple-400',
  },
  {
    href: '/settings/permissions',
    icon: ShieldCheck,
    title: 'Usuarios y Roles',
    description: 'Gestión de permisos, roles y accesos del sistema',
    color: 'text-amber-400',
  },
  {
    href: '/settings/notifications',
    icon: Bell,
    title: 'Notificaciones',
    description: 'Preferencias de alertas y comunicaciones automáticas',
    color: 'text-green-400',
  },
  {
    href: '/settings/integrations',
    icon: Plug,
    title: 'Integraciones',
    description: 'Conecta servicios externos como email, SMS y redes sociales',
    color: 'text-cyan-400',
  },
  {
    href: '/settings/ministries',
    icon: BookOpen,
    title: 'Ministerios',
    description: 'Configuración de áreas y ministerios de la iglesia',
    color: 'text-rose-400',
  },
  {
    href: '/settings/donations',
    icon: DollarSign,
    title: 'Mayordomía',
    description: 'Métodos de pago, categorías de donaciones y reportes',
    color: 'text-emerald-400',
  },
  {
    href: '/settings/qualification',
    icon: GraduationCap,
    title: 'Calificaciones',
    description: 'Criterios de evaluación y crecimiento espiritual',
    color: 'text-orange-400',
  },
]

export default function SettingsIndexPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Configuración</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Administra todos los aspectos de tu plataforma Khesed·Tek
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {SETTINGS_SECTIONS.map((section) => {
          const Icon = section.icon
          return (
            <Link key={section.href} href={section.href}>
              <Card className="h-full transition-all duration-200 hover:border-[hsl(var(--brand-gold)/0.4)] hover:shadow-[0_0_12px_hsl(var(--brand-gold)/0.08)] cursor-pointer group">
                <CardHeader className="pb-2">
                  <div className={`mb-2 ${section.color}`}>
                    <Icon size={20} />
                  </div>
                  <CardTitle className="text-sm font-semibold group-hover:text-[hsl(var(--brand-gold-bright))] transition-colors">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs leading-relaxed">
                    {section.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
