
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Book, 
  Video, 
  MessageCircle, 
  Search,
  Users,
  DollarSign,
  Calendar,
  Settings,
  Mail,
  CreditCard,
  HelpCircle,
  Phone,
  Shield,
  Database,
  BarChart3,
  Server,
  Key,
  FileText,
  Building,
  Package
} from 'lucide-react'
import Link from 'next/link'

export default function HelpCenterSuperAdmin() {
  const platformGuides = [
    {
      title: "🆕 Sistema de Importación Miembros",
      icon: Users,
      href: "/platform/help/manual/user-members",
      description: "Migración masiva desde cualquier sistema",
      time: "25 min",
      category: "Nuevos Sistemas"
    },
    {
      title: "Gestión de Iglesias",
      icon: Building,
      href: "/platform/help/churches",
      description: "Administrar iglesias registradas",
      time: "20 min",
      category: "Plataforma"
    },
    {
      title: "Suscripciones y Planes", 
      icon: CreditCard,
      href: "/platform/help/subscriptions",
      description: "Gestionar planes y facturación",
      time: "25 min",
      category: "Negocio"
    },
    {
      title: "Gestión de Complementos",
      icon: Package, 
      href: "/platform/help/addons",
      description: "Crear y configurar add-ons",
      time: "30 min",
      category: "Negocio"
    },
    {
      title: "Analytics y Reportes",
      icon: BarChart3,
      href: "/platform/help/analytics", 
      description: "Métricas globales y KPIs",
      time: "15 min",
      category: "Analytics"
    },
    {
      title: "Configuración de Sistema",
      icon: Settings,
      href: "/platform/help/system", 
      description: "Configuraciones avanzadas",
      time: "35 min",
      category: "Técnico"
    },
    {
      title: "Gestión de Usuarios Global",
      icon: Shield,
      href: "/platform/help/users", 
      description: "Administrar todos los usuarios",
      time: "20 min",
      category: "Usuarios"
    },
    {
      title: "🆕 Sistema Check-In Avanzado",
      icon: Shield,
      href: "/platform/help/manual/check-ins", 
      description: "Administrar WebRTC y Automatización",
      time: "45 min",
      category: "Sistema"
    },
    {
      title: "🆕 Sistema de Formularios de Visitantes",
      icon: Users,
      href: "/platform/help/manual/visitor-forms",
      description: "Administrar formularios y QR codes globalmente",
      time: "30 min",
      category: "Nuevos Sistemas"
    },
    {
      title: "🆕 Sistema de Analíticas Inteligentes",
      icon: BarChart3,
      href: "/analytics#intelligent-analytics",
      description: "IA predictiva y análisis avanzado global",
      time: "40 min",
      category: "IA y Analytics"
    },
    {
      title: "🆕 Sistema de Automatización Social",
      icon: Settings,
      href: "/platform/help/manual/social-automation",
      description: "Gestión global de automatización redes sociales",
      time: "35 min",
      category: "Automatización"
    },
    {
      title: "🆕 Sistema de Dones Espirituales Global",
      icon: Package,
      href: "/platform/help/manual/spiritual-gifts-global",
      description: "Administrar evaluaciones de dones globalmente",
      time: "25 min",
      category: "Sistema"
    },
    {
      title: "🆕 Criterios de Calificación Personalizables",
      icon: Settings,
      href: "/platform/help/manual/qualification-settings", 
      description: "Configurar criterios de voluntarios y liderazgo",
      time: "20 min",
      category: "Configuración"
    },
    {
      title: "🆕 Manual de Troubleshooting",
      icon: Settings,
      href: "/platform/help/troubleshooting", 
      description: "Resolución de problemas y escalamiento crítico",
      time: "60 min",
      category: "Soporte Técnico"
    }
  ]

  const adminSections = [
    { title: "🏢 Gestión de Plataforma", items: [
      { name: "Administrar Iglesias", href: "/platform/help/manual/churches", icon: "🏛️" },
      { name: "Analytics Globales", href: "/platform/help/manual/analytics", icon: "📊" },
      { name: "🆕 Analíticas Inteligentes Globales", href: "/platform/help/manual/global-intelligent-analytics", icon: "🤖" },
      { name: "Gestión de Usuarios", href: "/platform/help/manual/users", icon: "👥" },
      { name: "🆕 Sistema de Formularios Globales", href: "/platform/help/manual/global-visitor-forms", icon: "📝" },
      { name: "🆕 Sistema Inteligente de Eventos", href: "/platform/help/manual/events", icon: "📅" },
      { name: "Monitoreo del Sistema", href: "/platform/help/manual/monitoring", icon: "🔍" }
    ]},
    { title: "💰 Configuración de Negocio", items: [
      { name: "Crear/Editar Planes", href: "/platform/help/manual/plans", icon: "📋" },
      { name: "Gestionar Add-ons", href: "/platform/help/manual/addons", icon: "🛒" },
      { name: "Configurar Precios", href: "/platform/help/manual/pricing", icon: "💵" },
      { name: "Métodos de Pago", href: "/platform/help/manual/payments", icon: "🏦" },
      { name: "✅ Donaciones Online", href: "/platform/help/manual/online-donations", icon: "💳" },
      { name: "Reportes Financieros", href: "/platform/help/manual/financial", icon: "📈" }
    ]},
    { title: "🔧 Herramientas Técnicas", items: [
      { name: "🆕 Sistema Check-In Avanzado", href: "/platform/help/manual/check-ins", icon: "🔐" },
      { name: "🆕 Criterios de Calificación", href: "/platform/help/manual/qualification-settings", icon: "🎯" },
      { name: "🆕 Manual de Troubleshooting", href: "/platform/help/troubleshooting", icon: "🛠️" },
      { name: "Respaldos de BD", href: "/platform/help/manual/backups", icon: "🗄️" },
      { name: "Regenerar Claves", href: "/platform/help/manual/keys", icon: "🔑" },
      { name: "Logs del Sistema", href: "/platform/help/manual/logs", icon: "📊" },
      { name: "Configuración Avanzada", href: "/platform/help/manual/advanced", icon: "⚙️" }
    ]},
    { title: "👥 Manual de Usuarios", items: [
      { name: "🆕 Gestión de Miembros + Import", href: "/platform/help/manual/user-members", icon: "👥" },
      { name: "Sistema de Donaciones", href: "/platform/help/manual/user-donations", icon: "💰" },
      { name: "Gestión de Eventos", href: "/platform/help/manual/user-events", icon: "📅" },
      { name: "Comunicaciones", href: "/platform/help/manual/user-communications", icon: "📢" }
    ]}
  ]

  const adminTools = [
    {
      title: "Sistema de Respaldos",
      description: "Genere y gestione respaldos automáticos",
      href: "/platform/help/tools/backups",
      icon: Database,
      status: "Activo"
    },
    {
      title: "Regenerar Claves API",
      description: "Renovar claves de seguridad del sistema",
      href: "/platform/help/tools/keys",
      icon: Key,
      status: "Disponible"
    },
    {
      title: "Logs del Sistema",
      description: "Monitorear actividad y errores",
      href: "/platform/help/tools/logs",
      icon: FileText,
      status: "Activo"
    },
    {
      title: "Configuración Avanzada",
      description: "Ajustes técnicos del sistema",
      href: "/platform/help/tools/config",
      icon: Server,
      status: "Disponible"
    }
  ]

  const businessMetrics = [
    { label: "Total Iglesias", value: "247", change: "+12" },
    { label: "Ingresos Mensuales", value: "$89.4M", change: "+8.2%" },
    { label: "Usuarios Activos", value: "1,234", change: "+15%" },
    { label: "Tickets Soporte", value: "23", change: "-5" }
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🔧 Centro de Documentación - SUPER ADMIN</h1>
        <p className="text-muted-foreground">
          Herramientas, documentación y recursos para administrar la plataforma Kḥesed-tek
        </p>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {businessMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <p className="text-lg font-bold">{metric.value}</p>
                </div>
                <Badge variant={metric.change.startsWith('+') ? 'default' : 'secondary'} className="text-xs">
                  {metric.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar documentación administrativa, herramientas, configuraciones..." 
          className="pl-10 text-base"
        />
      </div>

      {/* Platform Management Guides */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">🏢 Guías de Gestión de Plataforma</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platformGuides.map((guide) => {
            const IconComponent = guide.icon
            return (
              <Link key={guide.href} href={guide.href}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="text-center pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {guide.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">⏱️ {guide.time}</span>
                    </div>
                    <IconComponent className="h-10 w-10 mx-auto mb-2 text-primary" />
                    <CardTitle className="text-sm">{guide.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <p className="text-xs text-muted-foreground">
                      {guide.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Admin Documentation */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Documentación Administrativa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {adminSections.map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold text-sm mb-3">{section.title}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {section.items.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <Button variant="ghost" className="w-full justify-start text-xs p-2 h-auto">
                        <span className="mr-2">{item.icon}</span>
                        {item.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-4 border-t">
              <Link href="/platform/help/manual/complete">
                <Button className="w-full">
                  📖 Manual Administrativo Completo
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Support & Resources */}
        <div className="space-y-6">
          {/* Priority Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Soporte Prioritario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Acceso directo al equipo de desarrollo y soporte especializado
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-xs">
                  <Phone className="h-4 w-4 mr-2" />
                  📞 Línea Directa Admin
                </Button>
                <Button variant="outline" className="w-full justify-start text-xs">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  💬 Chat Prioritario
                </Button>
                <Button variant="outline" className="w-full justify-start text-xs">
                  <Mail className="h-4 w-4 mr-2" />
                  📧 admin@khesedtek.com
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                <p>⚡ Respuesta prioritaria: &lt; 2 horas</p>
                <p>📞 Soporte 24/7 disponible</p>
              </div>
            </CardContent>
          </Card>

          {/* Videos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Videos Administrativos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>🎥 Configuración de Plataforma (25 min)</p>
                <p>🎥 Gestión de Iglesias (18 min)</p>
                <p>🎥 Creación de Add-ons (22 min)</p>
                <p>🎥 Analytics y Reportes (15 min)</p>
                <p>🎥 Troubleshooting Avanzado (30 min)</p>
              </div>
              <Link href="/platform/help/videos">
                <Button variant="outline" className="w-full">
                  🎥 Ver Videos Admin
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Admin Tools */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">🔧 Herramientas Administrativas</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminTools.map((tool) => {
            const IconComponent = tool.icon
            return (
              <Link key={tool.href} href={tool.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="text-center pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge 
                        variant={tool.status === 'Activo' ? 'default' : 'secondary'} 
                        className="text-xs"
                      >
                        {tool.status}
                      </Badge>
                    </div>
                    <IconComponent className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <CardTitle className="text-sm">{tool.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <p className="text-xs text-muted-foreground">
                      {tool.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* System Status */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Estado del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="h-3 w-3 bg-[hsl(var(--success)/0.10)]0 rounded-full mx-auto mb-2"></div>
                <p className="font-semibold">Servidores</p>
                <p className="text-muted-foreground">✅ Operacional</p>
              </div>
              <div className="text-center">
                <div className="h-3 w-3 bg-[hsl(var(--success)/0.10)]0 rounded-full mx-auto mb-2"></div>
                <p className="font-semibold">Base de Datos</p>
                <p className="text-muted-foreground">✅ Operacional</p>
              </div>
              <div className="text-center">
                <div className="h-3 w-3 bg-[hsl(var(--warning)/0.10)]0 rounded-full mx-auto mb-2"></div>
                <p className="font-semibold">APIs Externas</p>
                <p className="text-muted-foreground">⚠️ Parcial</p>
              </div>
              <div className="text-center">
                <div className="h-3 w-3 bg-[hsl(var(--success)/0.10)]0 rounded-full mx-auto mb-2"></div>
                <p className="font-semibold">Pagos</p>
                <p className="text-muted-foreground">✅ Operacional</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <Link href="/platform/help/status">
                <Button variant="outline" size="sm">
                  📊 Ver Estado Detallado
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground self-center">
                Última actualización: hace 2 minutos
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
