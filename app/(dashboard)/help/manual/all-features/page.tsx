'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { 
  Search, Users, Calendar, DollarSign, Mail, BarChart3, 
  Settings, Heart, Zap, FileText, Globe, MessageSquare,
  Award, Target, Gift, Briefcase, BookOpen, Radio,
  Clipboard, Bell, Shield, Key, CreditCard, TrendingUp,
  PieChart, Activity, Filter, Download, Upload, Edit,
  Eye, Check, X, Star, Sparkles, ArrowRight, Home,
  Phone, Video, Megaphone, Share2, Image, Map, Clock,
  UserPlus, List, Folder, Archive, PlayCircle, CheckCircle
} from 'lucide-react'
import Link from 'next/link'

export default function AllFeaturesGuide() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [
    { id: 'core', name: 'Funciones Principales', icon: <Home className="h-4 w-4" />, color: 'bg-[hsl(var(--info)/0.10)]0' },
    { id: 'analytics', name: 'AnalÒ­ticas', icon: <BarChart3 className="h-4 w-4" />, color: 'bg-[hsl(var(--lavender)/0.10)]0' },
    { id: 'automation', name: 'AutomatizaciÒ³n', icon: <Zap className="h-4 w-4" />, color: 'bg-[hsl(var(--warning)/0.10)]0' },
    { id: 'communication', name: 'ComunicaciÒ³n', icon: <Mail className="h-4 w-4" />, color: 'bg-[hsl(var(--success)/0.10)]0' },
    { id: 'volunteers', name: 'Voluntarios', icon: <Award className="h-4 w-4" />, color: 'bg-[hsl(var(--warning)/0.10)]0' },
    { id: 'forms', name: 'Formularios', icon: <FileText className="h-4 w-4" />, color: 'bg-[hsl(var(--destructive)/0.08)]0' },
    { id: 'advanced', name: 'Avanzadas', icon: <Sparkles className="h-4 w-4" />, color: 'bg-primary/[0.06]0' },
    { id: 'settings', name: 'ConfiguraciÒ³n', icon: <Settings className="h-4 w-4" />, color: 'bg-muted/300' }
  ]

  const allFeatures = [
    // CORE FEATURES (15)
    {
      id: 1,
      name: "GestiÒ³n de Miembros",
      category: "core",
      description: "Agregar, editar, importar miembros individuales o masivamente",
      accessPath: "/members",
      manual: "/help/manual/phase-3-members",
      videoAvailable: true,
      implemented: true,
      popular: true
    },
    {
      id: 2,
      name: "GestiÒ³n de Eventos",
      category: "core",
      description: "Crear eventos, check-in con QR, seguimiento de asistencia",
      accessPath: "/events",
      manual: "/help/manual/phase-4-events",
      videoAvailable: true,
      implemented: true,
      popular: true
    },
    {
      id: 3,
      name: "GestiÒ³n de Donaciones",
      category: "core",
      description: "Registro manual y en lÒ­nea de donaciones con Stripe",
      accessPath: "/donations",
      manual: "/help/manual/phase-1-getting-started",
      videoAvailable: false,
      implemented: true,
      popular: true
    },
    {
      id: 4,
      name: "Comunicaciones Masivas",
      category: "communication",
      description: "Email, SMS y notificaciones push a miembros",
      accessPath: "/communications",
      manual: "/help/manual/phase-5-communications",
      videoAvailable: true,
      implemented: true,
      popular: true
    },
    {
      id: 5,
      name: "Dashboard Principal",
      category: "core",
      description: "Vista general de mÒ©tricas clave de la iglesia",
      accessPath: "/",
      manual: "/help/manual/phase-6-analytics",
      videoAvailable: true,
      implemented: true,
      popular: true
    },
    {
      id: 6,
      name: "Muro de OraciÒ³n",
      category: "core",
      description: "Peticiones de oraciÒ³n pÒºblicas con seguimiento",
      accessPath: "/prayer-wall",
      manual: "/help/manual/troubleshooting",
      videoAvailable: false,
      implemented: true,
      popular: true
    },
    {
      id: 7,
      name: "EvaluaciÒ³n Espiritual",
      category: "core",
      description: "Cuestionarios de dones espirituales y madurez",
      accessPath: "/members/[id]/spiritual-assessment",
      manual: "/help/manual/phase-3-members",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 8,
      name: "GestiÒ³n de Familias",
      category: "core",
      description: "Agrupar miembros por familia con relaciones",
      accessPath: "/families",
      manual: "/help/manual/phase-3-members",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 9,
      name: "Seguimiento de Visitantes",
      category: "core",
      description: "Formularios web para visitantes primerizos",
      accessPath: "/visitors",
      manual: "/help/manual/phase-1-getting-started",
      videoAvailable: false,
      implemented: true,
      popular: true
    },
    {
      id: 10,
      name: "Constructor de Sitio Web",
      category: "core",
      description: "Crear sitio web pÒºblico de la iglesia",
      accessPath: "/website-builder",
      manual: "/help/manual/phase-2-configuration",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 11,
      name: "Calendario de Iglesia",
      category: "core",
      description: "Vista de calendario de todos los eventos",
      accessPath: "/calendar",
      manual: "/help/manual/phase-4-events",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 12,
      name: "Reportes Financieros",
      category: "core",
      description: "GrÒ�ficos de ingresos, donantes recurrentes",
      accessPath: "/donations/reports",
      manual: "/help/manual/phase-6-analytics",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 13,
      name: "GestiÒ³n de Grupos PequeÒ±os",
      category: "core",
      description: "Crear y administrar grupos de estudio bÒ­blico",
      accessPath: "/groups",
      manual: "/help/manual/phase-1-getting-started",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 14,
      name: "Check-in Digital (QR)",
      category: "core",
      description: "Registro de asistencia con cÒ³digos QR Òºnicos",
      accessPath: "/events/[id]/check-in",
      manual: "/help/manual/phase-4-events",
      videoAvailable: true,
      implemented: true,
      popular: true
    },
    {
      id: 15,
      name: "Perfil de Miembro",
      category: "core",
      description: "Vista detallada de historial y actividad de miembros",
      accessPath: "/members/[id]",
      manual: "/help/manual/phase-3-members",
      videoAvailable: false,
      implemented: true,
      popular: false
    },

    // ANALYTICS (8)
    {
      id: 16,
      name: "AnalÒ­ticas Generales",
      category: "analytics",
      description: "Reportes estÒ�ndar de miembros, finanzas, eventos",
      accessPath: "/analytics",
      manual: "/help/manual/phase-6-analytics",
      videoAvailable: true,
      implemented: true,
      popular: true
    },
    {
      id: 17,
      name: "AnalÒ­ticas Inteligentes (AI)",
      category: "analytics",
      description: "Predicciones de retenciÒ³n, recomendaciones, insights",
      accessPath: "/intelligent-analytics",
      manual: "/help/manual/phase-6-analytics",
      videoAvailable: true,
      implemented: true,
      popular: true
    },
    {
      id: 18,
      name: "Reporte Ejecutivo",
      category: "analytics",
      description: "Dashboard de salud de iglesia con scoring",
      accessPath: "/intelligent-analytics/executive-report",
      manual: "/help/manual/phase-6-analytics",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 19,
      name: "Member Journey Analytics",
      category: "analytics",
      description: "AnÒ�lisis de ciclo de vida de miembros",
      accessPath: "/intelligent-analytics/member-journey",
      manual: "/help/manual/phase-6-analytics",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 20,
      name: "PredicciÒ³n de RetenciÒ³n",
      category: "analytics",
      description: "AI identifica miembros en riesgo de abandono",
      accessPath: "/intelligent-analytics/retention-predictions",
      manual: "/help/manual/phase-6-analytics",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 21,
      name: "Recomendaciones de Ministerio",
      category: "analytics",
      description: "AI sugiere mejor fit de ministerio por dones",
      accessPath: "/intelligent-analytics/ministry-recommendations",
      manual: "/help/manual/phase-6-analytics",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 22,
      name: "Proyecciones Financieras",
      category: "analytics",
      description: "PredicciÒ³n de ingresos futuros con AI",
      accessPath: "/intelligent-analytics/financial-projections",
      manual: "/help/manual/phase-6-analytics",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 23,
      name: "ExportaciÒ³n Avanzada",
      category: "analytics",
      description: "Exportar a PDF Ejecutivo, Excel, CSV con branding",
      accessPath: "/analytics/export",
      manual: "/help/manual/phase-6-analytics",
      videoAvailable: false,
      implemented: true,
      popular: false
    },

    // AUTOMATION (5)
    {
      id: 24,
      name: "Reglas de AutomatizaciÒ³n",
      category: "automation",
      description: "Crear flujos automÒ�ticos basados en triggers",
      accessPath: "/automation-rules",
      manual: "/help/manual/troubleshooting",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 25,
      name: "AutomatizaciÒ³n de Redes Sociales",
      category: "automation",
      description: "Auto-publicar en Facebook, Instagram, Twitter, etc.",
      accessPath: "/social-media",
      manual: "/help/manual/troubleshooting",
      videoAvailable: false,
      implemented: true,
      popular: true
    },
    {
      id: 26,
      name: "Email de Bienvenida AutomÒ�tico",
      category: "automation",
      description: "EnvÒ­a email cuando se agrega nuevo miembro",
      accessPath: "/automation-rules",
      manual: "/help/manual/phase-5-communications",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 27,
      name: "Recordatorios de Eventos",
      category: "automation",
      description: "Notificaciones automÒ�ticas antes de eventos",
      accessPath: "/events/[id]/settings",
      manual: "/help/manual/phase-4-events",
      videoAvailable: false,
      implemented: true,
      popular: true
    },
    {
      id: 28,
      name: "Seguimiento de Visitantes",
      category: "automation",
      description: "Email automÒ�tico a visitantes primerizos",
      accessPath: "/automation-rules",
      manual: "/help/manual/phase-5-communications",
      videoAvailable: false,
      implemented: true,
      popular: false
    },

    // COMMUNICATION (6)
    {
      id: 29,
      name: "Email Masivo",
      category: "communication",
      description: "Enviar newsletters y anuncios por email",
      accessPath: "/communications/email",
      manual: "/help/manual/phase-5-communications",
      videoAvailable: true,
      implemented: true,
      popular: true
    },
    {
      id: 30,
      name: "SMS Masivo",
      category: "communication",
      description: "Mensajes de texto urgentes a miembros",
      accessPath: "/communications/sms",
      manual: "/help/manual/phase-5-communications",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 31,
      name: "Notificaciones Push",
      category: "communication",
      description: "Alertas mÒ³viles en tiempo real",
      accessPath: "/communications/push",
      manual: "/help/manual/phase-5-communications",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 32,
      name: "Plantillas de Email",
      category: "communication",
      description: "6 plantillas pre-diseÒ±adas (bienvenida, eventos, etc.)",
      accessPath: "/communications/templates",
      manual: "/help/manual/phase-5-communications",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 33,
      name: "PersonalizaciÒ³n de Mensajes",
      category: "communication",
      description: "Variables {{nombre}}, {{iglesia}} en emails",
      accessPath: "/communications/email",
      manual: "/help/manual/phase-5-communications",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 34,
      name: "EstadÒ­sticas de Email",
      category: "communication",
      description: "Seguimiento de aperturas, clicks, bounces",
      accessPath: "/communications/stats",
      manual: "/help/manual/phase-5-communications",
      videoAvailable: false,
      implemented: true,
      popular: false
    },

    // VOLUNTEERS (4)
    {
      id: 35,
      name: "GestiÒ³n de Voluntarios",
      category: "volunteers",
      description: "Administrar voluntarios por ministerio",
      accessPath: "/volunteers",
      manual: "/help/manual/troubleshooting",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 36,
      name: "Match de Habilidades",
      category: "volunteers",
      description: "Asignar voluntarios basado en dones espirituales",
      accessPath: "/volunteers/matching",
      manual: "/help/manual/troubleshooting",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 37,
      name: "Horarios de Voluntarios",
      category: "volunteers",
      description: "Calendario de turnos y disponibilidad",
      accessPath: "/volunteers/schedules",
      manual: "/help/manual/troubleshooting",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 38,
      name: "Seguimiento de Horas",
      category: "volunteers",
      description: "Registro de horas servidas por voluntario",
      accessPath: "/volunteers/hours",
      manual: "/help/manual/troubleshooting",
      videoAvailable: false,
      implemented: true,
      popular: false
    },

    // FORMS (3)
    {
      id: 39,
      name: "Formulario de Visitantes",
      category: "forms",
      description: "Form web pÒºblico para primerizos",
      accessPath: "/forms/visitor-form",
      manual: "/help/manual/phase-1-getting-started",
      videoAvailable: false,
      implemented: true,
      popular: true
    },
    {
      id: 40,
      name: "Formulario de Peticiones de OraciÒ³n",
      category: "forms",
      description: "Form web para solicitar oraciÒ³n",
      accessPath: "/forms/prayer-request",
      manual: "/help/manual/troubleshooting",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 41,
      name: "Formularios Personalizados",
      category: "forms",
      description: "Crear forms web con campos personalizados",
      accessPath: "/forms/custom",
      manual: "/help/manual/troubleshooting",
      videoAvailable: false,
      implemented: true,
      popular: false
    },

    // ADVANCED FEATURES (12)
    {
      id: 42,
      name: "IntegraciÒ³n con Stripe",
      category: "advanced",
      description: "Pagos en lÒ­nea con tarjeta de crÒ©dito",
      accessPath: "/settings/integrations/stripe",
      manual: "/help/manual/phase-2-configuration",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 43,
      name: "IntegraciÒ³n con Twilio (SMS)",
      category: "advanced",
      description: "EnvÒ­o de SMS vÒ­a API de Twilio",
      accessPath: "/settings/integrations/twilio",
      manual: "/help/manual/phase-2-configuration",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 44,
      name: "IntegraciÒ³n con Mailgun",
      category: "advanced",
      description: "Servicio de envÒ­o de emails transaccionales",
      accessPath: "/settings/integrations/mailgun",
      manual: "/help/manual/phase-2-configuration",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 45,
      name: "API PÒºblica de la Iglesia",
      category: "advanced",
      description: "Endpoints REST para integraciones externas",
      accessPath: "/settings/api",
      manual: "/help/manual/troubleshooting",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 46,
      name: "Webhooks",
      category: "advanced",
      description: "Notificaciones HTTP en tiempo real de eventos",
      accessPath: "/settings/webhooks",
      manual: "/help/manual/troubleshooting",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 47,
      name: "ImportaciÒ³n Masiva (Excel/CSV)",
      category: "advanced",
      description: "Subir cientos de miembros desde archivo",
      accessPath: "/members/import",
      manual: "/help/manual/phase-3-members",
      videoAvailable: true,
      implemented: true,
      popular: true
    },
    {
      id: 48,
      name: "ExportaciÒ³n de Datos",
      category: "advanced",
      description: "Descargar miembros, eventos, donaciones",
      accessPath: "/settings/export",
      manual: "/help/manual/phase-6-analytics",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 49,
      name: "Multi-Ubicaciones",
      category: "advanced",
      description: "Gestionar mÒºltiples campus de una iglesia",
      accessPath: "/settings/locations",
      manual: "/help/manual/troubleshooting",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 50,
      name: "Roles y Permisos Avanzados",
      category: "advanced",
      description: "Control granular de acceso por usuario",
      accessPath: "/settings/roles",
      manual: "/help/manual/phase-2-configuration",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 51,
      name: "PersonalizaciÒ³n de Marca",
      category: "advanced",
      description: "Logo, colores, dominio personalizado",
      accessPath: "/settings/branding",
      manual: "/help/manual/phase-2-configuration",
      videoAvailable: false,
      implemented: true,
      popular: true
    },
    {
      id: 52,
      name: "Cache y Rendimiento",
      category: "advanced",
      description: "Redis caching para velocidad (90% hit rate)",
      accessPath: "/settings/performance",
      manual: "/help/manual/troubleshooting",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 53,
      name: "Modo Offline (PWA)",
      category: "advanced",
      description: "Funcionalidad sin conexiÒ³n con sincronizaciÒ³n",
      accessPath: "/prayer-wall",
      manual: "/help/manual/troubleshooting",
      videoAvailable: false,
      implemented: true,
      popular: false
    },

    // SETTINGS (8)
    {
      id: 54,
      name: "ConfiguraciÒ³n General",
      category: "settings",
      description: "Nombre, email, telÒ©fono, direcciÒ³n de iglesia",
      accessPath: "/settings/general",
      manual: "/help/manual/phase-2-configuration",
      videoAvailable: true,
      implemented: true,
      popular: true
    },
    {
      id: 55,
      name: "GestiÒ³n de Usuarios",
      category: "settings",
      description: "Crear, editar, eliminar usuarios del sistema",
      accessPath: "/settings/users",
      manual: "/help/manual/phase-2-configuration",
      videoAvailable: true,
      implemented: true,
      popular: true
    },
    {
      id: 56,
      name: "ConfiguraciÒ³n de Email",
      category: "settings",
      description: "SMTP, remitente, firma de emails",
      accessPath: "/settings/email",
      manual: "/help/manual/phase-2-configuration",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 57,
      name: "ConfiguraciÒ³n de Pagos",
      category: "settings",
      description: "Conectar Stripe, mÒ©todos de pago",
      accessPath: "/settings/payments",
      manual: "/help/manual/phase-2-configuration",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 58,
      name: "ConfiguraciÒ³n de Notificaciones",
      category: "settings",
      description: "Preferencias de alertas y recordatorios",
      accessPath: "/settings/notifications",
      manual: "/help/manual/phase-2-configuration",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 59,
      name: "ConfiguraciÒ³n de Seguridad",
      category: "settings",
      description: "2FA, polÒ­ticas de contraseÒ±as, sesiones",
      accessPath: "/settings/security",
      manual: "/help/manual/troubleshooting",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 60,
      name: "Backup y RestauraciÒ³n",
      category: "settings",
      description: "Copias de seguridad automÒ�ticas y manuales",
      accessPath: "/settings/backup",
      manual: "/help/manual/troubleshooting",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 61,
      name: "Logs de AuditorÒ­a",
      category: "settings",
      description: "Historial de acciones de usuarios",
      accessPath: "/settings/audit-logs",
      manual: "/help/manual/troubleshooting",
      videoAvailable: false,
      implemented: true,
      popular: false
    }
  ]

  const filteredFeatures = allFeatures.filter(feature => {
    const matchesSearch = searchQuery === '' || 
      feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === null || feature.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.color || 'bg-muted/300'
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-8">
      {/* Hero */}
      <div className="btn-cta-gradient text-white p-8 rounded-lg">
        <div className="flex items-center gap-4">
          <List className="h-12 w-12" />
          <div>
            <h1 className="text-4xl font-bold mb-2"> Todas las Funciones de Khesed-tek</h1>
            <p className="text-xl opacity-90">
              CatÒ�logo completo de {allFeatures.length} funciones disponibles en la plataforma
            </p>
          </div>
        </div>
        <div className="mt-6 flex gap-4 text-sm">
          <Badge variant="secondary" className="bg-[hsl(var(--card))]/20 text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            {allFeatures.filter(f => f.implemented).length} Implementadas
          </Badge>
          <Badge variant="secondary" className="bg-[hsl(var(--card))]/20 text-white">
            <Star className="h-3 w-3 mr-1" />
            {allFeatures.filter(f => f.popular).length} Populares
          </Badge>
          <Badge variant="secondary" className="bg-[hsl(var(--card))]/20 text-white">
            <PlayCircle className="h-3 w-3 mr-1" />
            {allFeatures.filter(f => f.videoAvailable).length} Con Video
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-6 w-6 text-[hsl(var(--info))]" />
            Buscar Funciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              type="text"
              placeholder="Buscar por nombre o descripciÒ³n..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <p className="text-sm font-medium mb-3">Filtrar por CategorÒ­a:</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                Todas ({allFeatures.length})
              </Button>
              {categories.map(category => {
                const count = allFeatures.filter(f => f.category === category.id).length
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="gap-2"
                  >
                    {category.icon}
                    {category.name} ({count})
                  </Button>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando <strong>{filteredFeatures.length}</strong> de <strong>{allFeatures.length}</strong> funciones
        </p>
        {searchQuery && (
          <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}>
            <X className="h-4 w-4 mr-1" />
            Limpiar bÒºsqueda
          </Button>
        )}
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFeatures.map(feature => (
          <Card key={feature.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg flex-1">{feature.name}</h3>
                  <div className="flex gap-1">
                    {feature.popular && (
                      <Badge variant="secondary" className="bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))]">
                        <Star className="h-3 w-3" />
                      </Badge>
                    )}
                    {feature.videoAvailable && (
                      <Badge variant="secondary" className="bg-[hsl(var(--info)/0.15)] text-[hsl(var(--info))]">
                        <PlayCircle className="h-3 w-3" />
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Category Badge */}
                <div>
                  <Badge className={`${getCategoryColor(feature.category)} text-white text-xs`}>
                    {categories.find(c => c.id === feature.category)?.name}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground">{feature.description}</p>

                {/* Access Path */}
                <div className="bg-muted/30 p-2 rounded text-xs font-mono text-muted-foreground">
                  {feature.accessPath}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Link href={feature.manual} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Manual
                    </Button>
                  </Link>
                  {feature.videoAvailable && (
                    <Button size="sm" variant="outline">
                      <PlayCircle className="h-3 w-3 mr-1" />
                      Video
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredFeatures.length === 0 && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <Search className="h-16 w-16 text-muted-foreground/30" />
            <div>
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">No se encontraron funciones</h3>
              <p className="text-muted-foreground mb-4">
                Intenta con otros tÒ©rminos de bÒºsqueda o cambia el filtro de categorÒ­a
              </p>
              <Button onClick={() => { setSearchQuery(''); setSelectedCategory(null) }}>
                Ver todas las funciones
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Summary Statistics */}
      <Card className="btn-cta-gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-[hsl(var(--lavender))]" />
            Resumen de Funcionalidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {categories.map(category => {
              const count = allFeatures.filter(f => f.category === category.id).length
              const popularCount = allFeatures.filter(f => f.category === category.id && f.popular).length
              return (
                <div key={category.id} className="bg-[hsl(var(--card))] p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`${category.color} text-white p-2 rounded`}>
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{category.name}</p>
                      <p className="text-xs text-muted-foreground">{count} funciones</p>
                    </div>
                  </div>
                  {popularCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      {popularCount} popular{popularCount > 1 ? 'es' : ''}
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Link href="/help/manual/phase-6-analytics">
          <Button variant="outline" size="lg">
            <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
            Volver a Fase 6
          </Button>
        </Link>
        <Link href="/help/manual/troubleshooting">
          <Button size="lg" className="bg-[hsl(var(--lavender))] hover:bg-[hsl(var(--lavender))]">
            Ver Troubleshooting
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
