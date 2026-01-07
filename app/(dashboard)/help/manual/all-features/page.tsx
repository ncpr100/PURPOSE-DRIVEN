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
    { id: 'core', name: 'Funciones Principales', icon: <Home className="h-4 w-4" />, color: 'bg-blue-500' },
    { id: 'analytics', name: 'Analíticas', icon: <BarChart3 className="h-4 w-4" />, color: 'bg-purple-500' },
    { id: 'automation', name: 'Automatización', icon: <Zap className="h-4 w-4" />, color: 'bg-yellow-500' },
    { id: 'communication', name: 'Comunicación', icon: <Mail className="h-4 w-4" />, color: 'bg-green-500' },
    { id: 'volunteers', name: 'Voluntarios', icon: <Award className="h-4 w-4" />, color: 'bg-orange-500' },
    { id: 'forms', name: 'Formularios', icon: <FileText className="h-4 w-4" />, color: 'bg-pink-500' },
    { id: 'advanced', name: 'Avanzadas', icon: <Sparkles className="h-4 w-4" />, color: 'bg-indigo-500' },
    { id: 'settings', name: 'Configuración', icon: <Settings className="h-4 w-4" />, color: 'bg-gray-500' }
  ]

  const allFeatures = [
    // CORE FEATURES (15)
    {
      id: 1,
      name: "Gestión de Miembros",
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
      name: "Gestión de Eventos",
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
      name: "Gestión de Donaciones",
      category: "core",
      description: "Registro manual y en línea de donaciones con Stripe",
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
      description: "Vista general de métricas clave de la iglesia",
      accessPath: "/",
      manual: "/help/manual/phase-6-analytics",
      videoAvailable: true,
      implemented: true,
      popular: true
    },
    {
      id: 6,
      name: "Muro de Oración",
      category: "core",
      description: "Peticiones de oración públicas con seguimiento",
      accessPath: "/prayer-wall",
      manual: "/help/manual/troubleshooting",
      videoAvailable: false,
      implemented: true,
      popular: true
    },
    {
      id: 7,
      name: "Evaluación Espiritual",
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
      name: "Gestión de Familias",
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
      description: "Crear sitio web público de la iglesia",
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
      description: "Gráficos de ingresos, donantes recurrentes",
      accessPath: "/donations/reports",
      manual: "/help/manual/phase-6-analytics",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 13,
      name: "Gestión de Grupos Pequeños",
      category: "core",
      description: "Crear y administrar grupos de estudio bíblico",
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
      description: "Registro de asistencia con códigos QR únicos",
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
      name: "Analíticas Generales",
      category: "analytics",
      description: "Reportes estándar de miembros, finanzas, eventos",
      accessPath: "/analytics",
      manual: "/help/manual/phase-6-analytics",
      videoAvailable: true,
      implemented: true,
      popular: true
    },
    {
      id: 17,
      name: "Analíticas Inteligentes (AI)",
      category: "analytics",
      description: "Predicciones de retención, recomendaciones, insights",
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
      description: "Análisis de ciclo de vida de miembros",
      accessPath: "/intelligent-analytics/member-journey",
      manual: "/help/manual/phase-6-analytics",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 20,
      name: "Predicción de Retención",
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
      description: "Predicción de ingresos futuros con AI",
      accessPath: "/intelligent-analytics/financial-projections",
      manual: "/help/manual/phase-6-analytics",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 23,
      name: "Exportación Avanzada",
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
      name: "Reglas de Automatización",
      category: "automation",
      description: "Crear flujos automáticos basados en triggers",
      accessPath: "/automation-rules",
      manual: "/help/manual/troubleshooting",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 25,
      name: "Automatización de Redes Sociales",
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
      name: "Email de Bienvenida Automático",
      category: "automation",
      description: "Envía email cuando se agrega nuevo miembro",
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
      description: "Notificaciones automáticas antes de eventos",
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
      description: "Email automático a visitantes primerizos",
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
      description: "Alertas móviles en tiempo real",
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
      description: "6 plantillas pre-diseñadas (bienvenida, eventos, etc.)",
      accessPath: "/communications/templates",
      manual: "/help/manual/phase-5-communications",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 33,
      name: "Personalización de Mensajes",
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
      name: "Estadísticas de Email",
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
      name: "Gestión de Voluntarios",
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
      description: "Form web público para primerizos",
      accessPath: "/forms/visitor-form",
      manual: "/help/manual/phase-1-getting-started",
      videoAvailable: false,
      implemented: true,
      popular: true
    },
    {
      id: 40,
      name: "Formulario de Peticiones de Oración",
      category: "forms",
      description: "Form web para solicitar oración",
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
      name: "Integración con Stripe",
      category: "advanced",
      description: "Pagos en línea con tarjeta de crédito",
      accessPath: "/settings/integrations/stripe",
      manual: "/help/manual/phase-2-configuration",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 43,
      name: "Integración con Twilio (SMS)",
      category: "advanced",
      description: "Envío de SMS vía API de Twilio",
      accessPath: "/settings/integrations/twilio",
      manual: "/help/manual/phase-2-configuration",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 44,
      name: "Integración con Mailgun",
      category: "advanced",
      description: "Servicio de envío de emails transaccionales",
      accessPath: "/settings/integrations/mailgun",
      manual: "/help/manual/phase-2-configuration",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 45,
      name: "API Pública de la Iglesia",
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
      name: "Importación Masiva (Excel/CSV)",
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
      name: "Exportación de Datos",
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
      description: "Gestionar múltiples campus de una iglesia",
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
      name: "Personalización de Marca",
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
      description: "Funcionalidad sin conexión con sincronización",
      accessPath: "/prayer-wall",
      manual: "/help/manual/troubleshooting",
      videoAvailable: false,
      implemented: true,
      popular: false
    },

    // SETTINGS (8)
    {
      id: 54,
      name: "Configuración General",
      category: "settings",
      description: "Nombre, email, teléfono, dirección de iglesia",
      accessPath: "/settings/general",
      manual: "/help/manual/phase-2-configuration",
      videoAvailable: true,
      implemented: true,
      popular: true
    },
    {
      id: 55,
      name: "Gestión de Usuarios",
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
      name: "Configuración de Email",
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
      name: "Configuración de Pagos",
      category: "settings",
      description: "Conectar Stripe, métodos de pago",
      accessPath: "/settings/payments",
      manual: "/help/manual/phase-2-configuration",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 58,
      name: "Configuración de Notificaciones",
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
      name: "Configuración de Seguridad",
      category: "settings",
      description: "2FA, políticas de contraseñas, sesiones",
      accessPath: "/settings/security",
      manual: "/help/manual/troubleshooting",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 60,
      name: "Backup y Restauración",
      category: "settings",
      description: "Copias de seguridad automáticas y manuales",
      accessPath: "/settings/backup",
      manual: "/help/manual/troubleshooting",
      videoAvailable: false,
      implemented: true,
      popular: false
    },
    {
      id: 61,
      name: "Logs de Auditoría",
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
    return categories.find(c => c.id === categoryId)?.color || 'bg-gray-500'
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
        <div className="flex items-center gap-4">
          <List className="h-12 w-12" />
          <div>
            <h1 className="text-4xl font-bold mb-2">📚 Todas las Funciones de Khesed-tek</h1>
            <p className="text-xl opacity-90">
              Catálogo completo de {allFeatures.length} funciones disponibles en la plataforma
            </p>
          </div>
        </div>
        <div className="mt-6 flex gap-4 text-sm">
          <Badge variant="secondary" className="bg-white/20 text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            {allFeatures.filter(f => f.implemented).length} Implementadas
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white">
            <Star className="h-3 w-3 mr-1" />
            {allFeatures.filter(f => f.popular).length} Populares
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white">
            <PlayCircle className="h-3 w-3 mr-1" />
            {allFeatures.filter(f => f.videoAvailable).length} Con Video
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-6 w-6 text-blue-600" />
            Buscar Funciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <p className="text-sm font-medium mb-3">Filtrar por Categoría:</p>
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
        <p className="text-sm text-gray-600">
          Mostrando <strong>{filteredFeatures.length}</strong> de <strong>{allFeatures.length}</strong> funciones
        </p>
        {searchQuery && (
          <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}>
            <X className="h-4 w-4 mr-1" />
            Limpiar búsqueda
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
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3" />
                      </Badge>
                    )}
                    {feature.videoAvailable && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
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
                <p className="text-sm text-gray-600">{feature.description}</p>

                {/* Access Path */}
                <div className="bg-gray-50 p-2 rounded text-xs font-mono text-gray-700">
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
            <Search className="h-16 w-16 text-gray-300" />
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron funciones</h3>
              <p className="text-gray-500 mb-4">
                Intenta con otros términos de búsqueda o cambia el filtro de categoría
              </p>
              <Button onClick={() => { setSearchQuery(''); setSelectedCategory(null) }}>
                Ver todas las funciones
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Summary Statistics */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-purple-600" />
            Resumen de Funcionalidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {categories.map(category => {
              const count = allFeatures.filter(f => f.category === category.id).length
              const popularCount = allFeatures.filter(f => f.category === category.id && f.popular).length
              return (
                <div key={category.id} className="bg-white p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`${category.color} text-white p-2 rounded`}>
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{category.name}</p>
                      <p className="text-xs text-gray-500">{count} funciones</p>
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
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
            Ver Troubleshooting
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
