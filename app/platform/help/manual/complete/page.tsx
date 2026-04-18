
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock, Download, Search, Shield } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function CompleteAdminManual() {
  const [searchTerm, setSearchTerm] = useState('')

  const adminSections = [
    {
      id: 'platform-management',
      title: '🏢 Gestión de Plataforma',
      description: 'Administración global del sistema',
      pages: 25,
      timeToRead: '35 min',
      category: 'Plataforma',
      topics: [
        'Dashboard administrativo global',
        'Gestión de iglesias registradas',
        'Métricas y KPIs de la plataforma',
        'Configuración del sistema',
        'Monitoreo de servidores y base de datos'
      ]
    },
    {
      id: 'church-management',
      title: '🏛️ Administración de Iglesias',
      description: 'Gestionar iglesias individuales',
      pages: 20,
      timeToRead: '28 min',
      category: 'Clientes',
      topics: [
        'Registrar nuevas iglesias',
        'Editar información de iglesias',
        'Suspender/reactivar iglesias',
        'Migración de datos entre iglesias',
        'Soporte técnico directo'
      ]
    },
    {
      id: 'subscription-management',
      title: '💳 Gestión de Suscripciones',
      description: 'Planes, precios y facturación',
      pages: 30,
      timeToRead: '42 min',
      category: 'Negocio',
      topics: [
        'Crear y editar planes de suscripción',
        'Configurar precios y descuentos',
        'Gestión de facturación automática',
        'Reportes financieros globales',
        'Manejo de cancelaciones y reembolsos'
      ]
    },
    {
      id: 'addon-management',
      title: '🛒 Gestión de Complementos',
      description: 'Crear y administrar add-ons',
      pages: 22,
      timeToRead: '30 min',
      category: 'Negocio',
      topics: [
        'Crear nuevos complementos',
        'Configurar precios y modelos de negocio',
        'Activar/desactivar complementos',
        'Analytics de uso de complementos',
        'Gestión de dependencias técnicas'
      ]
    },
    {
      id: 'user-management',
      title: '👥 Gestión Global de Usuarios',
      description: 'Administrar todos los usuarios',
      pages: 18,
      timeToRead: '25 min',
      category: 'Usuarios',
      topics: [
        'Ver todos los usuarios del sistema',
        'Gestión de roles y permisos globales',
        'Suspender/reactivar cuentas',
        'Logs de actividad de usuarios',
        'Soporte técnico personalizado'
      ]
    },
    {
      id: 'analytics-reporting',
      title: '🆕 📊 Analytics y Perspectivas Pastorales',
      description: 'Sistema de analíticas mejorado con multi-formato export',
      pages: 32,
      timeToRead: '45 min',
      category: 'Analytics',
      topics: [
        'Nuevas "Perspectivas Pastorales" (antes Inteligencia de Negocios)',
        'Analíticas Ministeriales operacionales mejoradas',
        'Multi-Format Export Features (Excel, CSV, JSON)',
        'KPIs de iglesias con plantillas church-focused',
        'Comprehensive Analytics API con métricas avanzadas',
        'Botones de Acciones Rápidas completamente funcionales',
        'Dashboard ejecutivo con KPIs en tiempo real',
        'Reportes de crecimiento y retención multicanal',
        'Analytics de uso por funcionalidad integrado',
        'Métricas financieras avanzadas con exportación flexible'
      ]
    },
    {
      id: 'system-administration',
      title: '🔧 Administración del Sistema',
      description: 'Configuración técnica avanzada',
      pages: 35,
      timeToRead: '50 min',
      category: 'Técnico',
      topics: [
        'Configuración de servidores y bases de datos',
        'Gestión de respaldos automáticos',
        'Regeneración de claves API y seguridad',
        'Monitoreo de logs y errores',
        'Configuración de integraciones externas'
      ]
    },
    {
      id: 'user-manual-reference',
      title: '📖 Manual de Usuarios (Referencia)',
      description: 'Guía completa para iglesias',
      pages: 85,
      timeToRead: '120 min',
      category: 'Referencia',
      topics: [
        'Todo el manual de usuario para iglesias',
        'Configuración inicial y onboarding',
        'Gestión de miembros, donaciones y eventos',
        'Comunicaciones y automatizaciones',
        'Troubleshooting común'
      ]
    },
    {
      id: 'check-ins',
      title: '🔐 Sistema Check-In Avanzado (SUPER_ADMIN)',
      description: 'Administración WebRTC, Automatización y Configuración Avanzada',
      pages: 35,
      timeToRead: '45 min',
      category: 'Sistema',
      topics: [
        'Configuración de Base de Datos (15 nuevos campos)',
        'Administración de APIs de Seguridad',
        'Gestión de Variables de Entorno',
        'Supervisión de Seguridad y Auditoría',
        'Configuración de Automatizaciones',
        'Políticas de Cifrado y Retención de Fotos',
        'Comandos de Mantenimiento Avanzado',
        'Monitoreo de Intentos Fallidos',
        'Integración con Servicios ML/AI',
        'Cron Jobs y Limpieza Automática'
      ]
    },
    {
      id: 'latest-enhancements-august-2025',
      title: '🚀 Últimas Mejoras - Agosto 2025',
      description: 'Nuevas funcionalidades y mejoras implementadas',
      pages: 24,
      timeToRead: '30 min',
      category: 'Nuevas Funciones',
      topics: [
        '🆕 Renombrado: "Inteligencia de Negocios" → "Perspectivas Pastorales"',
        '🔧 Botones de Acciones Rápidas completamente funcionales',
        '📊 Sistema Multi-Format Export (Excel, CSV, JSON)',
        '📈 Enhanced Analytics con métricas de toda la plataforma',
        '🎯 Church-Focused KPI Templates y plantillas ministeriales',
        '💡 Comprehensive Analytics API endpoint (/api/analytics/comprehensive-overview)',
        '⚡ Real-time report generation con timestamps actuales',
        '🏗️ Arquitectura mejorada para analytics empresariales',
        '📋 Exportación con múltiples worksheets para Excel',
        '🔗 Integración perfecta con Google Sheets vía CSV'
      ]
    }
  ]

  const filteredSections = adminSections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const totalPages = adminSections.reduce((acc, section) => acc + section.pages, 0)
  const totalReadTime = adminSections.reduce((acc, section) => {
    const time = parseInt(section.timeToRead)
    return acc + time
  }, 0)

  const categories = [...new Set(adminSections.map(section => section.category))]

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="h-8 w-8 text-[hsl(var(--info))]" />
          <div>
            <h1 className="text-3xl font-bold">📖 Manual Administrativo Completo</h1>
            <p className="text-muted-foreground">
              Documentación completa para administrar la plataforma Kḥesed-tek
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {totalPages} páginas
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            ~{Math.round(totalReadTime / 60)} horas de lectura
          </div>
          <Badge variant="default">SUPER_ADMIN</Badge>
          <Badge variant="secondary">Versión 1.2</Badge>
          <Badge variant="destructive">🆕 Actualizado Agosto 2025</Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar en documentación administrativa..."
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground self-center">Filtrar por:</span>
          {categories.map((category) => (
            <Badge key={category} variant="outline" className="cursor-pointer hover:bg-accent">
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Download Options */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Descargar Documentación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Button variant="outline" className="justify-start">
                📄 Manual Administrativo (PDF)
              </Button>
              <Button variant="outline" className="justify-start">
                📖 Manual de Usuarios (PDF)
              </Button>
              <Button variant="outline" className="justify-start">
                🔧 Guía Técnica (PDF)
              </Button>
              <Button variant="outline" className="justify-start">
                📦 Documentación Completa (ZIP)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Manual Sections */}
      <div className="grid gap-6">
        {filteredSections.map((section, index) => (
          <Card key={section.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {section.category}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{section.description}</p>
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
                  <h4 className="font-medium text-sm mb-2">Contenido incluido:</h4>
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
                  <Link href={`/platform/help/manual/${section.id}`}>
                    <Button size="sm">
                      📖 Leer Sección
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    📄 Descargar PDF
                  </Button>
                  {section.category === 'Técnico' && (
                    <Button variant="outline" size="sm">
                      🔧 Ver Configuración
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Status Quick View */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Estado Actual del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="h-3 w-3 bg-[hsl(var(--success)/0.10)]0 rounded-full mx-auto mb-2"></div>
                <p className="font-semibold">Plataforma</p>
                <p className="text-muted-foreground">✅ Operacional</p>
              </div>
              <div className="text-center">
                <div className="h-3 w-3 bg-[hsl(var(--success)/0.10)]0 rounded-full mx-auto mb-2"></div>
                <p className="font-semibold">Base de Datos</p>
                <p className="text-muted-foreground">✅ Operacional</p>
              </div>
              <div className="text-center">
                <div className="h-3 w-3 bg-[hsl(var(--info)/0.10)]0 rounded-full mx-auto mb-2"></div>
                <p className="font-semibold">Usuarios Activos</p>
                <p className="text-muted-foreground">1,234 online</p>
              </div>
              <div className="text-center">
                <div className="h-3 w-3 bg-[hsl(var(--warning)/0.10)]0 rounded-full mx-auto mb-2"></div>
                <p className="font-semibold">Soporte</p>
                <p className="text-muted-foreground">23 tickets</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Back to Help */}
      <div className="mt-8 text-center">
        <Link href="/platform/help">
          <Button variant="outline">
            ← Volver al Centro de Documentación
          </Button>
        </Link>
      </div>
    </div>
  )
}
