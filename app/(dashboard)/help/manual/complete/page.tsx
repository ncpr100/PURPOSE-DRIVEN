
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock, Download, Search } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function CompleteManual() {
  const [searchTerm, setSearchTerm] = useState('')

  const manualSections = [
    {
      id: 'getting-started',
      title: '🚀 Primeros Pasos',
      description: 'Configuración inicial y registro',
      pages: 12,
      timeToRead: '15 min',
      topics: [
        'Registro y creación de cuenta',
        'Configuración inicial de la iglesia',
        'Asistente de configuración paso a paso',
        'Primer acceso al dashboard'
      ]
    },
    {
      id: 'members',
      title: '👥 Gestión de Miembros',
      description: 'Administrar su congregación',
      pages: 18,
      timeToRead: '25 min',
      topics: [
        'Importar miembros desde Excel/CSV',
        'Agregar miembros manualmente',
        'Gestión de grupos y ministerios',
        'Perfiles de miembros y seguimiento'
      ]
    },
    {
      id: 'donations',
      title: '💰 Sistema de Donaciones',
      description: 'Configurar y gestionar donaciones',
      pages: 15,
      timeToRead: '20 min',
      topics: [
        'Configurar métodos de pago',
        'Categorías de donaciones',
        'Registro manual de donaciones',
        'Reportes financieros'
      ]
    },
    {
      id: 'events',
      title: '📅 Gestión de Eventos',
      description: 'Crear y administrar eventos',
      pages: 22,
      timeToRead: '30 min',
      topics: [
        'Crear eventos y servicios',
        'Sistema de registro de asistentes',
        'Check-in con código QR',
        'Reportes de asistencia'
      ]
    },
    {
      id: 'communications',
      title: '📢 Comunicaciones',
      description: 'Enviar mensajes y notificaciones',
      pages: 14,
      timeToRead: '18 min',
      topics: [
        'Envío de emails masivos',
        'Plantillas de mensajes',
        'Programación de comunicaciones',
        'Historial y estadísticas'
      ]
    },
    {
      id: 'analytics-pastoral-insights',
      title: '🆕 📊 Analíticas y Perspectivas Pastorales',
      description: 'Sistema mejorado de reportes y análisis ministerial',
      pages: 20,
      timeToRead: '25 min',
      topics: [
        'Tab "Analíticas Ministeriales" - métricas operacionales diarias',
        'Tab "Perspectivas Pastorales" - análisis estratégico a largo plazo',
        'Multi-Format Export: Excel (.xlsx), CSV (.csv), JSON (.json)',
        'Acciones Rápidas funcionalmente completas',
        'KPIs ministeriales y métricas de crecimiento',
        'Exportar reportes en tiempo real',
        'Análisis de participación y engagement de miembros',
        'Métricas de oración, voluntarios y eventos integradas'
      ]
    },
    {
      id: 'check-ins',
      title: '🆕 🔐 Sistema de Check-In Avanzado',
      description: 'WebRTC, Automatización de Visitantes y Seguridad Infantil',
      pages: 28,
      timeToRead: '35 min',
      topics: [
        'Sistema WebRTC de Seguridad Infantil',
        'Automatización Inteligente de Visitantes',
        'Verificación Biométrica con PIN dual',
        'Integración con Muro de Oración',
        'Secuencias de Seguimiento Automático',
        'Conexión Ministerial Automática'
      ]
    },
    {
      id: 'permissions',
      title: '👨‍💼 Usuarios y Permisos',
      description: 'Administrar accesos y roles',
      pages: 10,
      timeToRead: '12 min',
      topics: [
        'Tipos de usuarios y roles',
        'Invitar nuevos usuarios',
        'Gestión de permisos',
        'Configuración de accesos'
      ]
    },
    {
      id: 'subscription',
      title: '💳 Mi Suscripción',
      description: 'Gestionar plan y complementos',
      pages: 8,
      timeToRead: '10 min',
      topics: [
        'Ver detalles de suscripción',
        'Cambiar plan',
        'Gestionar complementos',
        'Facturación y pagos'
      ]
    },
    {
      id: 'automation-rules',
      title: '🆕 ⚡ Reglas de Automatización',
      description: 'Sistema completo de automatización inteligente',
      pages: 25,
      timeToRead: '30 min',
      topics: [
        '8+ plantillas pre-configuradas listas para usar',
        'Ejecución instantánea con 3 reintentos automáticos',
        '5 canales de comunicación (SMS, Email, WhatsApp, Push, Llamadas)',
        'Fallback automático entre canales',
        'Horario laboral configurable',
        'Escalamiento a supervisores',
        'Navegador de plantillas con activación 1-click',
        'Bypass approval para respuesta instantánea'
      ]
    },
    {
      id: 'prayer-automation',
      title: '🆕 🙏 Automatización de Peticiones de Oración',
      description: 'Respuesta automática a peticiones de oración',
      pages: 18,
      timeToRead: '22 min',
      topics: [
        'Detección automática de peticiones urgentes',
        'Respuesta instantánea (< 60 segundos)',
        '4 plantillas de oración pre-configuradas',
        'Auto-confirmación de recepción',
        'Notificación 24/7 a equipo pastoral',
        'Escalamiento a 15 min si no hay respuesta',
        'Mensajes personalizados con variables',
        'Seguimiento automático de peticiones'
      ]
    },
    {
      id: 'visitor-automation',
      title: '🆕 👥 Automatización de Seguimiento de Visitantes',
      description: 'Categorización y seguimiento automático inteligente',
      pages: 20,
      timeToRead: '25 min',
      topics: [
        'Auto-categorización: FIRST_TIME, RETURNING, REGULAR, MEMBER_CANDIDATE',
        'Análisis de historial de visitas automático',
        'Secuencia de bienvenida de 5 toques (30 días)',
        'Seguimiento personalizado según compromiso',
        'Invitación automática a membresía (4+ visitas)',
        'Creación/actualización de VisitorProfile',
        'Conexión automática con ministerios de interés',
        'Follow-up urgente 24/7 para casos especiales'
      ]
    },
    {
      id: 'super-admin-automation',
      title: '🆕 ⚙️ Configuración Avanzada (Super Admin)',
      description: 'Arquitectura técnica y personalización del sistema',
      pages: 22,
      timeToRead: '28 min',
      topics: [
        'Arquitectura de AutomationRule (modelo de datos)',
        'Configuración de Bypass Approval',
        'Retry & Fallback Logic (JSON config)',
        'Business Hours Configuration',
        'Escalation Config con múltiples niveles',
        'Operadores de condiciones (equals, contains, greater_than, etc.)',
        'Tipos de acciones disponibles (SEND_SMS, SEND_EMAIL, etc.)',
        'Crear plantillas personalizadas desde cero',
        'Variables de personalización ({{name}}, {{email}}, etc.)',
        'Referencia completa de API endpoints',
        'Troubleshooting avanzado'
      ]
    },
    {
      id: 'whats-new-august-2025',
      title: '🎉 Novedades - Agosto 2025',
      description: 'Últimas funcionalidades y mejoras disponibles',
      pages: 16,
      timeToRead: '20 min',
      topics: [
        '📊 Nueva sección "Perspectivas Pastorales" (antes Inteligencia de Negocios)',
        '⚡ Acciones Rápidas ahora completamente funcionales',
        '📋 Multi-Format Export: descarga reportes en Excel, CSV, JSON',
        '📈 Analíticas mejoradas con datos de toda la plataforma',
        '🎯 Métricas ministeriales específicas para iglesias',
        '💡 Reportes en tiempo real con datos actuales',
        '🔄 Actualización automática de KPIs',
        '📱 Interface mejorada para exportación de datos',
        '🔗 Integración directa con Google Sheets',
        '✨ Experiencia de usuario optimizada en analíticas'
      ]
    }
  ]

  const filteredSections = manualSections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const totalPages = manualSections.reduce((acc, section) => acc + section.pages, 0)
  const totalReadTime = manualSections.reduce((acc, section) => {
    const time = parseInt(section.timeToRead)
    return acc + time
  }, 0)

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">📖 Manual Completo de Usuario</h1>
        <p className="text-muted-foreground mb-4">
          Guía completa para usar todas las funciones de Khesed-tek Systems
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {totalPages} páginas
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            ~{Math.round(totalReadTime / 60)} horas de lectura
          </div>
          <Badge variant="secondary">Versión 1.2</Badge>
          <Badge variant="destructive">🆕 Actualizado Agosto 2025</Badge>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar en el manual..."
          className="w-full pl-10 pr-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Download Options */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Descargar Manual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start" onClick={() => alert('La descarga de PDF será implementada próximamente. Por ahora puede usar la función de imprimir de su navegador.')}>
                📄 Descargar PDF Completo
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => window.print()}>
                📊 Versión para Impresión
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => alert('La versión móvil está disponible navegando esta misma página desde su teléfono.')}>
                📱 Versión Móvil (Resumida)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manual Sections */}
      <div className="grid gap-6">
        {filteredSections.map((section, index) => (
          <Card key={section.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <p className="text-muted-foreground mt-1">{section.description}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{section.pages} páginas</span>
                  <span>•</span>
                  <span>{section.timeToRead}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-2">Temas incluidos:</h4>
                  <div className="grid md:grid-cols-2 gap-1">
                    {section.topics.map((topic, topicIndex) => (
                      <div key={topicIndex} className="flex items-center text-sm text-muted-foreground">
                        <span className="mr-2">•</span>
                        {topic}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Link href={`/help/manual/${section.id}`}>
                    <Button size="sm">
                      📖 Leer Sección
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => alert('La descarga de PDF por sección será implementada próximamente. Use la función de imprimir para obtener una copia física.')}>
                    📄 Descargar PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Back to Help */}
      <div className="mt-8 text-center">
        <Link href="/help">
          <Button variant="outline">
            ← Volver al Centro de Ayuda
          </Button>
        </Link>
      </div>
    </div>
  )
}
