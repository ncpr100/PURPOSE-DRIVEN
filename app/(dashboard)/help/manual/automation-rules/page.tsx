'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen, Zap, CheckCircle2, Clock, RefreshCw, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function AutomationRulesManual() {
  return (
    <div className="container mx-auto p-6">
      <Link href="/help/manual/complete">
        <Button variant="outline" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Manual
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Manual: Reglas de Automatización</h1>
          <p className="text-muted-foreground">Guía completa del sistema de automatización inteligente</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Quick Overview */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              🎉 NUEVO: Sistema de Automatización Inteligente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              El sistema de automatización permite que su iglesia responda automáticamente a peticiones de oración 
              y visitantes nuevos con mensajes personalizados por SMS, Email, WhatsApp y notificaciones push.
            </p>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-semibold">⚡ Velocidad</h4>
                <p className="text-2xl font-bold text-blue-600">Instantánea</p>
                <p className="text-xs text-muted-foreground">Respuesta en segundos</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-semibold">🔄 Reintentos</h4>
                <p className="text-2xl font-bold text-green-600">3x</p>
                <p className="text-xs text-muted-foreground">Con respaldo automático</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-semibold">📱 Canales</h4>
                <p className="text-2xl font-bold text-purple-600">5</p>
                <p className="text-xs text-muted-foreground">SMS, Email, WhatsApp, Push, Phone</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-semibold">🎯 Plantillas</h4>
                <p className="text-2xl font-bold text-orange-600">8+</p>
                <p className="text-xs text-muted-foreground">Listas para usar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle>🔧 ¿Cómo Funciona?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 rounded-full p-2">
                <span className="text-2xl">1️⃣</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Evento Disparador</h4>
                <p className="text-sm text-muted-foreground">
                  Una petición de oración es enviada o un visitante hace check-in en su iglesia.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <ArrowLeft className="h-6 w-6 text-muted-foreground rotate-[-90deg]" />
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-green-100 rounded-full p-2">
                <span className="text-2xl">2️⃣</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Evaluación de Reglas</h4>
                <p className="text-sm text-muted-foreground">
                  El sistema verifica qué reglas de automatización están activas y si las condiciones coinciden 
                  (prioridad, categoría, horario laboral, etc.).
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <ArrowLeft className="h-6 w-6 text-muted-foreground rotate-[-90deg]" />
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-purple-100 rounded-full p-2">
                <span className="text-2xl">3️⃣</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Ejecución de Acciones</h4>
                <p className="text-sm text-muted-foreground">
                  Si la regla tiene <strong>bypass approval</strong> (omitir aprobación), las acciones se ejecutan 
                  inmediatamente: SMS, Email, WhatsApp, notificaciones push.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Si NO tiene bypass, se crea una tarea de aprobación manual para el pastor o administrador.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <ArrowLeft className="h-6 w-6 text-muted-foreground rotate-[-90deg]" />
            </div>

            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <div className="bg-green-100 rounded-full p-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Reintentos y Respaldo</h4>
                <p className="text-sm text-muted-foreground">
                  Si falla el primer intento (ej: SMS no entregado), el sistema reintenta 3 veces con espera exponencial. 
                  Si sigue fallando, usa canales de respaldo: SMS → Email → WhatsApp → Push → Llamada telefónica.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Template Browser */}
        <Card>
          <CardHeader>
            <CardTitle>📚 Explorador de Plantillas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              El sistema incluye 8+ plantillas prediseñadas listas para activar con un solo clic:
            </p>

            <div className="space-y-3">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🙏</span>
                  <h4 className="font-semibold">Peticiones de Oración</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-8">
                  <li>• Notificación inmediata al equipo de oración</li>
                  <li>• Confirmación automática al solicitante</li>
                  <li>• Oración por mensaje de texto/WhatsApp</li>
                  <li>• Llamada de oración para casos urgentes</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">👋</span>
                  <h4 className="font-semibold">Seguimiento de Visitantes</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-8">
                  <li>• Bienvenida para visitantes por primera vez</li>
                  <li>• Engagement para visitantes recurrentes</li>
                  <li>• Invitación a membresía (4+ visitas)</li>
                  <li>• Seguimiento urgente 24/7</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-2 text-blue-900">💡 Cómo Activar una Plantilla</h4>
              <ol className="text-sm text-blue-800 space-y-2">
                <li><strong>1.</strong> Vaya a <strong>Automatización → Plantillas</strong></li>
                <li><strong>2.</strong> Navegue por categorías: Peticiones de Oración, Visitantes, Redes Sociales, Eventos</li>
                <li><strong>3.</strong> Haga clic en <strong>&quot;Ver Detalles&quot;</strong> para ver el flujo completo</li>
                <li><strong>4.</strong> Personalice el nombre, prioridad, horarios y canales</li>
                <li><strong>5.</strong> Haga clic en <strong>&quot;Activar Plantilla&quot;</strong></li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Key Features */}
        <Card>
          <CardHeader>
            <CardTitle>⚡ Características Clave</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold">Reintentos Inteligentes</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  3 reintentos automáticos con espera exponencial (1s, 2s, 4s). Nunca pierde un mensaje.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <h4 className="font-semibold">Canales de Respaldo</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Si un canal falla, usa el siguiente: SMS → Email → WhatsApp → Push → Llamada.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold">Horario Laboral</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Configure para ejecutar solo durante horas de oficina. Los casos urgentes pueden ejecutarse 24/7.
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-purple-600" />
                  <h4 className="font-semibold">Bypass Approval</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Omita la aprobación manual para respuestas instantáneas. Perfecto para bienvenidas y confirmaciones.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priority Levels */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 Niveles de Prioridad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-2xl">🔴</span>
              <div className="flex-1">
                <h4 className="font-semibold text-red-900">URGENTE</h4>
                <p className="text-sm text-red-700">
                  Ejecuta inmediatamente, ignora horario laboral. Escalamiento a supervisor en 15 minutos si no hay respuesta.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <span className="text-2xl">🟠</span>
              <div className="flex-1">
                <h4 className="font-semibold text-orange-900">ALTA</h4>
                <p className="text-sm text-orange-700">
                  Prioridad alta, ejecuta dentro de 1 hora. Escalamiento en 2 horas sin respuesta.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-2xl">🟢</span>
              <div className="flex-1">
                <h4 className="font-semibold text-green-900">NORMAL</h4>
                <p className="text-sm text-green-700">
                  Prioridad estándar. Respeta horario laboral. Escalamiento en 24 horas.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="text-2xl">⚪</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">BAJA</h4>
                <p className="text-sm text-gray-700">
                  Ejecuta cuando hay disponibilidad. Sin escalamiento automático.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle>🔍 Solución de Problemas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-2">❓ La automatización no se ejecuta</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Verifique que la regla esté <strong>Activa</strong></li>
                  <li>• Revise las condiciones: ¿coinciden con el evento?</li>
                  <li>• Si tiene horario laboral, ¿está dentro del horario?</li>
                  <li>• ¿El disparador es correcto? (PRAYER_REQUEST_SUBMITTED, VISITOR_FIRST_TIME, etc.)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">❓ Los mensajes no llegan</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Revise la configuración de Twilio (SMS/WhatsApp) en Configuración</li>
                  <li>• Verifique la configuración de Mailgun (Email)</li>
                  <li>• El sistema intentará canales de respaldo automáticamente</li>
                  <li>• Revise el historial de ejecución en el dashboard de automatización</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">❓ Quiero desactivar una regla temporalmente</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Vaya a <strong>Automatización → Mis Reglas</strong></li>
                  <li>• Haga clic en el toggle <strong>&quot;Activo&quot;</strong> para desactivar</li>
                  <li>• La regla permanece configurada pero no se ejecutará</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">✅ Mejores Prácticas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <p className="text-sm">
                <strong>Use bypass approval para bienvenidas:</strong> Los mensajes de bienvenida pueden enviarse inmediatamente sin aprobación.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <p className="text-sm">
                <strong>Active modo urgente 24/7:</strong> Para peticiones de oración marcadas como urgentes, ignora el horario laboral.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <p className="text-sm">
                <strong>Configure canales de respaldo:</strong> Siempre tenga al menos 2 canales configurados (ej: SMS y Email).
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <p className="text-sm">
                <strong>Personalice los mensajes:</strong> Use variables como {'{nombre}'}, {'{iglesia}'}, {'{mensaje}'} para personalizar.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <p className="text-sm">
                <strong>Monitoree el dashboard:</strong> Revise regularmente el historial de ejecución para detectar problemas.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">🚀 Próximos Pasos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ol className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">1.</span>
                <span>Vaya a <Link href="/automation-rules/templates" className="text-blue-600 underline">Plantillas de Automatización</Link></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">2.</span>
                <span>Active 2-3 plantillas relevantes para su iglesia</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">3.</span>
                <span>Pruebe enviando una petición de oración o registrando un visitante</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">4.</span>
                <span>Revise el dashboard de automatización para ver el historial</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">5.</span>
                <span>Personalice las reglas según las necesidades de su iglesia</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
