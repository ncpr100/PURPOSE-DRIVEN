'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Calendar, CalendarPlus, Clock, MapPin, Users, QrCode,
  CheckCircle, ArrowRight, Heart, Lightbulb, AlertTriangle,
  Star, Target, Video, Music, Book, Coffee, Gift, Bell,
  Ticket, UserCheck, BarChart, Download, Mail, MessageSquare, Brain,
  Shield, Building2, Settings
} from 'lucide-react'
import Link from 'next/link'

export default function PlatformEventsGuide() {
  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-lg">
        <div className="flex items-center gap-4">
          <Shield className="h-12 w-12" />
          <div>
            <h1 className="text-4xl font-bold mb-2">🏛️ Sistema de Eventos - SUPER_ADMIN</h1>
            <p className="text-xl opacity-90">
              Guía completa del Sistema Inteligente de Eventos para administradores de plataforma
            </p>
          </div>
        </div>
        <div className="mt-6 flex gap-4 text-sm">
          <Badge variant="secondary" className="bg-white/20 text-white">
            <Shield className="h-3 w-3 mr-1" />
            Solo SUPER_ADMIN
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white">
            <Building2 className="h-3 w-3 mr-1" />
            Multi-Tenant
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white">
            <Star className="h-3 w-3 mr-1" />
            Sistema Unificado
          </Badge>
        </div>
      </div>

      {/* SUPER_ADMIN Context */}
      <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-300">
        <h4 className="font-bold text-purple-900 flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5" />
          Nota Importante para SUPER_ADMIN
        </h4>
        <p className="text-sm text-purple-800 mb-3">
          Como SUPER_ADMIN, tienes acceso completo al Sistema Inteligente de Eventos de TODAS las iglesias. 
          Puedes crear, editar, eliminar eventos, y usar todas las funcionalidades de IA (AUTO-ASIGNAR, 
          comunicaciones automáticas, analíticas) en cualquier iglesia de la plataforma.
        </p>
        <p className="text-sm text-purple-800 font-semibold">
          ⚠️ Los eventos SIEMPRE están vinculados a una iglesia específica (churchId). Asegúrate de estar 
          en el contexto de la iglesia correcta antes de crear o modificar eventos.
        </p>
      </div>

      {/* Reference to Church Manual */}
      <Card className="border-blue-300 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Book className="h-6 w-6" />
            Documentación Principal: Manual de Iglesias
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            La documentación completa del Sistema Inteligente de Eventos está disponible en el manual 
            de iglesias. Este manual incluye:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-white">
              <CardContent className="pt-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Flujo de Trabajo Completo
                </h4>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• 8 módulos integrados (Planificación, Voluntarios, Miembros, etc.)</li>
                  <li>• Creación y edición de eventos paso a paso</li>
                  <li>• Categorías de eventos (CULTO, CONFERENCIA, SOCIAL, etc.)</li>
                  <li>• Sistema de check-in con QR</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="pt-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AUTO-ASIGNAR (IA)
                </h4>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• Algoritmo de 5 factores explicado</li>
                  <li>• Coincidencia de habilidades (+30 puntos)</li>
                  <li>• Balance de carga de trabajo</li>
                  <li>• Troubleshooting completo</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="mt-4">
            <Link href="/help/manual/phase-4-events" target="_blank">
              <Button className="w-full md:w-auto">
                <Book className="h-4 w-4 mr-2" />
                Ver Manual Completo de Eventos (Iglesias)
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Platform-Specific Features */}
      <Card className="border-purple-300">
        <CardHeader className="bg-purple-50">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Shield className="h-8 w-8" />
            Funcionalidades Específicas de SUPER_ADMIN
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Capacidades adicionales solo disponibles para administradores de plataforma
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-blue-600">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Acceso Multi-Tenant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium text-gray-700">Qué puedes hacer:</p>
                <ul className="ml-4 space-y-1 text-gray-600">
                  <li>✓ Ver eventos de TODAS las iglesias</li>
                  <li>✓ Crear eventos en cualquier iglesia</li>
                  <li>✓ Editar/eliminar eventos de cualquier iglesia</li>
                  <li>✓ Monitorear estadísticas globales</li>
                </ul>
                <div className="bg-yellow-50 p-3 rounded mt-3 border border-yellow-200">
                  <p className="text-xs font-semibold text-yellow-900">⚠️ Importante:</p>
                  <p className="text-xs text-yellow-800">
                    Siempre verifica el churchId antes de realizar cambios. Los eventos están 
                    estrictamente vinculados a iglesias específicas.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-600">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Analytics Globales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium text-gray-700">Métricas disponibles:</p>
                <ul className="ml-4 space-y-1 text-gray-600">
                  <li>✓ Total de eventos en toda la plataforma</li>
                  <li>✓ Promedio de asistencia por iglesia</li>
                  <li>✓ Uso de AUTO-ASIGNAR por iglesia</li>
                  <li>✓ Eventos activos vs completados</li>
                </ul>
                <div className="bg-blue-50 p-3 rounded mt-3 border border-blue-200">
                  <p className="text-xs font-semibold text-blue-900">💡 Tip:</p>
                  <p className="text-xs text-blue-800">
                    Usa /platform/analytics para ver métricas agregadas de todos los eventos
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-600">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuración Global
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium text-gray-700">Configuraciones disponibles:</p>
                <ul className="ml-4 space-y-1 text-gray-600">
                  <li>✓ Límites de eventos por plan (Free/Pro/Enterprise)</li>
                  <li>✓ Funcionalidades habilitadas/deshabilitadas</li>
                  <li>✓ Configuración de AUTO-ASIGNAR global</li>
                  <li>✓ Límites de voluntarios por evento</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-600">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Soporte y Troubleshooting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium text-gray-700">Herramientas de soporte:</p>
                <ul className="ml-4 space-y-1 text-gray-600">
                  <li>✓ Logs de AUTO-ASIGNAR por evento</li>
                  <li>✓ Historial de asignaciones de voluntarios</li>
                  <li>✓ Errores de integración de QR/check-in</li>
                  <li>✓ Monitoreo de performance de eventos</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Database Schema Reference */}
      <Card className="border-indigo-300 bg-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Settings className="h-6 w-6" />
            Referencia Técnica: Schema de Base de Datos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-indigo-200">
            <h4 className="font-semibold mb-3 text-indigo-900">Tablas Principales del Sistema de Eventos:</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-800 mb-1">📅 events</p>
                <ul className="text-xs text-gray-600 ml-4 space-y-1">
                  <li>• id, title, description, category</li>
                  <li>• startDate, endDate, location</li>
                  <li>• budget, isPublic, status</li>
                  <li>• <strong>churchId</strong> (CRITICAL - multi-tenant key)</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">👥 volunteer_assignments</p>
                <ul className="text-xs text-gray-600 ml-4 space-y-1">
                  <li>• eventId, volunteerId</li>
                  <li>• role, assignedTasks (JSON)</li>
                  <li>• status (ASIGNADO, CONFIRMADO, COMPLETADO)</li>
                  <li>• date, startTime, endTime</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">✅ check_ins</p>
                <ul className="text-xs text-gray-600 ml-4 space-y-1">
                  <li>• eventId, firstName, lastName</li>
                  <li>• email, phone, checkInTime</li>
                  <li>• Used for MEMBERS and VISITORS</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">👶 children_check_ins</p>
                <ul className="text-xs text-gray-600 ml-4 space-y-1">
                  <li>• eventId, childName, parentName</li>
                  <li>• checkInTime, checkOutTime</li>
                  <li>• Separate tracking for children</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">🎛️ event_resources</p>
                <ul className="text-xs text-gray-600 ml-4 space-y-1">
                  <li>• name, description, type</li>
                  <li>• type: EQUIPO, ESPACIO, MATERIAL</li>
                  <li>• capacity, isActive</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">📧 event_communications</p>
                <ul className="text-xs text-gray-600 ml-4 space-y-1">
                  <li>• eventId, type (EMAIL, SMS, PUSH)</li>
                  <li>• subject, content, recipientCount</li>
                  <li>• status (BORRADOR, PROGRAMADA, ENVIADA)</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Reference */}
      <Card className="border-teal-300 bg-teal-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Target className="h-6 w-6" />
            Referencia Rápida: Rutas de API
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white p-4 rounded-lg space-y-3 text-sm font-mono">
            <div>
              <p className="font-semibold text-gray-800">GET /api/events</p>
              <p className="text-xs text-gray-600 ml-4">Listar todos los eventos (filtrado por churchId en session)</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">POST /api/events</p>
              <p className="text-xs text-gray-600 ml-4">Crear nuevo evento</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">GET /api/events/[id]</p>
              <p className="text-xs text-gray-600 ml-4">Obtener detalles de evento específico</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">PUT /api/events/[id]</p>
              <p className="text-xs text-gray-600 ml-4">Actualizar evento existente</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-purple-700">POST /api/events/[id]/auto-assign-volunteers</p>
              <p className="text-xs text-purple-600 ml-4">🤖 AUTO-ASIGNAR - Asignación inteligente de voluntarios (IA)</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">GET /api/events/analytics</p>
              <p className="text-xs text-gray-600 ml-4">Analíticas de eventos (dashboard stats)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Link href="/platform/help">
          <Button variant="outline" size="lg">
            <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
            Volver a Ayuda
          </Button>
        </Link>
        <Link href="/help/manual/phase-4-events" target="_blank">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
            Ver Manual Completo de Iglesias
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
