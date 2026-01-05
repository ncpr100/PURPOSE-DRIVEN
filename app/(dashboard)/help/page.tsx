
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Book, 
  Video, 
  MessageCircle, 
  Search,
  Users,
  DollarSign,
  Calendar,
  Settings,
  UserPlus, Target, Brain, Lock, Clipboard, Smartphone, 
  Megaphone, Share2, Zap, BarChart3, Bot, Church, 
  Upload, MessageSquare, BookOpen, Globe, Shield, CreditCard,
  Mail, HelpCircle, Phone
} from 'lucide-react'
import Link from 'next/link'
import ContactInfoCard from '@/components/help/ContactInfoCard'

export default function HelpCenterUsers() {
  const quickGuides = [
    {
      title: "Configuración Inicial",
      icon: Settings,
      href: "/help/setup",
      description: "Configure su iglesia en 15 minutos",
      time: "15 min"
    },
    {
      title: "Gestión de Miembros", 
      icon: Users,
      href: "/help/members",
      description: "Importe y gestione su congregación",
      time: "20 min"
    },
    {
      title: "Gestión de Voluntarios",
      icon: UserPlus,
      href: "/help/manual/volunteers", 
      description: "Pipeline inteligente de reclutamiento",
      time: "25 min"
    },
    {
      title: "🆕 Criterios de Calificación",
      icon: Settings,
      href: "/settings/qualification", 
      description: "Personalizar criterios de voluntarios y liderazgo",
      time: "10 min"
    },
    {
      title: "Sistema de Donaciones",
      icon: DollarSign, 
      href: "/help/donations",
      description: "Configure pagos y categorías",
      time: "25 min"
    },
    {
      title: "Crear Eventos",
      icon: Calendar,
      href: "/help/events", 
      description: "Eventos y check-in con QR",
      time: "15 min"
    },
    {
      title: "🆕 Sistema Check-In Avanzado",
      icon: Shield,
      href: "/help/manual/check-ins", 
      description: "WebRTC, Automatización de Visitantes",
      time: "35 min"
    },
    {
      title: "Comunicaciones",
      icon: Mail,
      href: "/help/communications", 
      description: "Enviar emails y notificaciones",
      time: "10 min"
    },
    {
      title: "Mi Suscripción",
      icon: CreditCard,
      href: "/help/subscription", 
      description: "Gestionar plan y complementos",
      time: "5 min"
    },
    {
      title: "🆕 Formularios de Visitantes",
      icon: UserPlus,
      href: "/help/manual/visitor-forms",
      description: "Crear formularios y códigos QR para visitantes",
      time: "20 min"
    },
    {
      title: "🆕 Analíticas Inteligentes",
      icon: HelpCircle,
      href: "/help/manual/intelligent-analytics",
      description: "IA para análisis predictivo y recomendaciones",
      time: "15 min"
    },
    {
      title: "🆕 Automatización Redes Sociales",
      icon: Mail,
      href: "/help/manual/social-media-automation",
      description: "Publicación automática en redes sociales",
      time: "25 min"
    },
    {
      title: "🆕 Sistema de Dones Espirituales",
      icon: Settings,
      href: "/help/manual/spiritual-gifts",
      description: "Evaluación y gestión de dones espirituales",
      time: "30 min"
    }
  ]

  const manualSections = [
    { title: "Configuración de Iglesia", href: "/help/manual/setup", icon: <Settings className="h-5 w-5 text-purple-600" /> },
    { title: "Gestión de Miembros", href: "/help/manual/members", icon: <Users className="h-5 w-5 text-blue-600" /> },
    { title: "Gestión de Voluntarios", href: "/help/manual/volunteers", icon: <UserPlus className="h-5 w-5 text-green-600" /> },
    { title: "Criterios de Calificación", href: "/settings/qualification", icon: <Target className="h-5 w-5 text-orange-600" /> },
    { title: "Sistema de Dones Espirituales", href: "/help/manual/spiritual-gifts", icon: <Brain className="h-5 w-5 text-purple-600" /> },
    { title: "Sistema de Donaciones", href: "/help/manual/donations", icon: <DollarSign className="h-5 w-5 text-green-600" /> },
    { title: "Gestión de Eventos", href: "/help/manual/events", icon: <Calendar className="h-5 w-5 text-blue-600" /> },
    { title: "Sistema Check-In Avanzado", href: "/help/manual/check-ins", icon: <Lock className="h-5 w-5 text-red-600" /> },
    { title: "Formularios de Visitantes", href: "/help/manual/visitor-forms", icon: <Clipboard className="h-5 w-5 text-blue-600" /> },
    { title: "Códigos QR para Visitantes", href: "/help/manual/visitor-qr-codes", icon: <Smartphone className="h-5 w-5 text-purple-600" /> },
    { title: "Comunicaciones", href: "/help/manual/communications", icon: <Megaphone className="h-5 w-5 text-orange-600" /> },
    { title: "Automatización de Redes Sociales", href: "/help/manual/social-media-automation", icon: <Share2 className="h-5 w-5 text-green-600" /> },
    { title: "Reglas de Automatización", href: "/help/manual/automation-rules", icon: <Zap className="h-5 w-5 text-yellow-600" /> },
    { title: "Analíticas Generales", href: "/help/manual/general-analytics", icon: <BarChart3 className="h-5 w-5 text-blue-600" /> },
    { title: "Analíticas Inteligentes", href: "/help/manual/intelligent-analytics", icon: <Bot className="h-5 w-5 text-purple-600" /> },
    { title: "Perspectivas Pastorales", href: "/help/manual/analytics-pastoral-insights", icon: <Church className="h-5 w-5 text-purple-600" /> },
    { title: "Sistema de Exportación Avanzado", href: "/help/manual/advanced-export-system", icon: <Upload className="h-5 w-5 text-green-600" /> },
    { title: "Muro de Oración", href: "/help/manual/prayer-wall", icon: <MessageSquare className="h-5 w-5 text-purple-600" /> },
    { title: "Asistente de Sermones", href: "/help/manual/sermon-assistant", icon: <BookOpen className="h-5 w-5 text-blue-600" /> },
    { title: "Construcción de Sitios Web", href: "/help/manual/website-builder", icon: <Globe className="h-5 w-5 text-green-600" /> },
    { title: "Usuarios y Permisos", href: "/help/manual/permissions", icon: <Shield className="h-5 w-5 text-red-600" /> },
    { title: "Mi Suscripción", href: "/help/manual/subscription", icon: <CreditCard className="h-5 w-5 text-blue-600" /> }
  ]

  const addons = [
    {
      title: "SMS Masivos",
      description: "Envíe mensajes de texto a toda su congregación",
      features: ["SMS incluidos", "Plantillas prediseñadas", "Programación automática"]
    },
    {
      title: "Transmisión en Vivo", 
      description: "Transmita servicios en YouTube y Facebook",
      features: ["Múltiples espectadores", "Grabación automática", "Múltiples plataformas"]
    },
    {
      title: "Donaciones Online",
      description: "Reciba donaciones por tarjeta de crédito",
      features: ["Tarjetas de crédito", "PayPal", "Recibos automáticos"]
    }
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">📖 Centro de Ayuda</h1>
        <p className="text-muted-foreground">
          Todo lo que necesita para administrar su iglesia exitosamente
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar tutoriales, preguntas frecuentes..." 
          className="pl-10 text-base"
        />
      </div>

      {/* Quick Start Guides */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">🚀 Guías de Inicio Rápido</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickGuides.map((guide) => {
            const IconComponent = guide.icon
            return (
              <Link key={guide.href} href={guide.href}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="text-center pb-3">
                    <IconComponent className="h-10 w-10 mx-auto mb-2 text-primary" />
                    <CardTitle className="text-sm">{guide.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <p className="text-xs text-muted-foreground mb-2">
                      {guide.description}
                    </p>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {guide.time}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Manual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Manual de Usuario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Guía completa paso a paso para usar todas las funciones de su iglesia
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {manualSections.map((section) => (
                <Link key={section.href} href={section.href}>
                  <Button variant="ghost" className="w-full justify-start text-xs p-2 h-auto">
                    <span className="mr-2">{section.icon}</span>
                    {section.title}
                  </Button>
                </Link>
              ))}
            </div>
            <Link href="/help/manual/complete">
              <Button className="w-full flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Ver Manual Completo
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Videos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Videotutoriales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Aprenda visualmente con nuestros tutoriales en video
            </p>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                <p>🎥 Configuración inicial (8:30 min)</p>
                <p>🎥 Importar miembros (12:15 min)</p>
                <p>🎥 Configurar donaciones (9:45 min)</p>
                <p>🎥 Crear eventos (11:20 min)</p>
                <p>🎥 Enviar comunicaciones (7:10 min)</p>
              </div>
            </div>
            <Link href="/help/videos">
              <Button variant="outline" className="w-full">
                🎥 Ver Todos los Videos
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Soporte Técnico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              ¿Necesita ayuda personalizada? Estamos aquí para ayudar
            </p>
            <Link href="/help/support/ticket">
              <Button variant="outline" className="w-full justify-start text-xs">
                <HelpCircle className="h-4 w-4 mr-2" />
                🎫 Crear Ticket de Soporte
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information - Editable by SUPER_ADMIN */}
      <section className="mb-8">
        <ContactInfoCard />
      </section>

      {/* Add-ons Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">🛒 Complementos Disponibles</h2>
        <p className="text-muted-foreground mb-6 text-sm">
          Expanda las capacidades de su sistema con estas funciones premium
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {addons.map((addon) => (
            <Card key={addon.title} className="relative">
              <CardHeader>
                <CardTitle className="text-base">{addon.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {addon.description}
                </p>
                <div className="space-y-1 mb-4">
                  {addon.features.map((feature, index) => (
                    <p key={index} className="text-xs text-muted-foreground">
                      ✅ {feature}
                    </p>
                  ))}
                </div>
                <div className="space-y-2">
                  <Button className="w-full text-xs" onClick={() => alert('Funcionalidad de suscripción será implementada próximamente. Contacte soporte para más información.')}>
                    💰 Suscribirse
                  </Button>
                  <Link href={`/help/addons/${addon.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Button variant="outline" className="w-full text-xs">
                      📖 Más Información
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Preguntas Frecuentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">🚀 Primeros Pasos:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• ¿Cómo importo mis miembros?</li>
                  <li>• ¿Cómo configuro las donaciones?</li>
                  <li>• ¿Cómo invito a otros líderes?</li>
                  <li>• ¿Cómo creo mi primer evento?</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">💰 Facturación:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• ¿Cómo cambio mi plan?</li>
                  <li>• ¿Qué métodos de pago aceptan?</li>
                  <li>• ¿Hay descuentos disponibles?</li>
                  <li>• ¿Cómo cancelo mi suscripción?</li>
                </ul>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/help/faq">
                <Button variant="outline" className="w-full">
                  📋 Ver Todas las Preguntas Frecuentes
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
