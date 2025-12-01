'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen, Heart, Zap, Users, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function PrayerAutomationManual() {
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
          <h1 className="text-3xl font-bold">Manual: Automatización de Peticiones de Oración</h1>
          <p className="text-muted-foreground">Respuesta instantánea y seguimiento automático de peticiones</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Overview */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-purple-600" />
              Sistema de Oración Automatizado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Cuando alguien envía una petición de oración, el sistema automáticamente:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-purple-600 mt-0.5" />
                <span><strong>Notifica al equipo de oración</strong> por SMS, Email o WhatsApp en segundos</span>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                <span><strong>Envía confirmación</strong> al solicitante de que su petición fue recibida</span>
              </li>
              <li className="flex items-start gap-2">
                <Users className="h-4 w-4 text-purple-600 mt-0.5" />
                <span><strong>Asigna a un intercesor</strong> para seguimiento personalizado</span>
              </li>
              <li className="flex items-start gap-2">
                <Heart className="h-4 w-4 text-purple-600 mt-0.5" />
                <span><strong>Programa llamadas de oración</strong> para casos urgentes</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* How Prayer Automation Works */}
        <Card>
          <CardHeader>
            <CardTitle>🔄 Flujo de Automatización de Oración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Petición Recibida</h4>
                  <p className="text-sm text-muted-foreground">
                    Una persona envía una petición de oración a través de:
                  </p>
                  <ul className="text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>• Formulario web de la iglesia</li>
                    <li>• Código QR en el templo</li>
                    <li>• App móvil</li>
                    <li>• SMS o WhatsApp</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Categorización Automática</h4>
                  <p className="text-sm text-muted-foreground">
                    El sistema analiza la petición y determina:
                  </p>
                  <ul className="text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>• <strong>Prioridad:</strong> URGENTE, ALTA, NORMAL, BAJA</li>
                    <li>• <strong>Categoría:</strong> Salud, Familia, Finanzas, Trabajo, etc.</li>
                    <li>• <strong>Privacidad:</strong> Pública o anónima</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Activación de Reglas</h4>
                  <p className="text-sm text-muted-foreground">
                    Busca reglas de automatización activas que coincidan:
                  </p>
                  <div className="bg-white p-3 rounded mt-2 border">
                    <p className="text-xs font-mono text-gray-600">
                      SI prioridad = URGENTE Y categoría = Salud<br/>
                      ENTONCES ejecutar: &quot;Notificación Urgente al Equipo&quot;
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Bypass Approval Check</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    La regla puede configurarse de dos formas:
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="bg-green-100 p-3 rounded border border-green-300">
                      <p className="font-semibold text-green-900 text-sm mb-1">✅ CON Bypass (Recomendado)</p>
                      <p className="text-xs text-green-800">
                        Ejecuta las acciones inmediatamente sin esperar aprobación manual. 
                        Ideal para confirmaciones y notificaciones.
                      </p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded border border-yellow-300">
                      <p className="font-semibold text-yellow-900 text-sm mb-1">⏸️ SIN Bypass</p>
                      <p className="text-xs text-yellow-800">
                        Crea una tarea de aprobación para el pastor/admin. 
                        Las acciones se ejecutan después de la aprobación manual.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border-2 border-green-400">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  5
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Ejecución de Acciones</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Las acciones se ejecutan en secuencia con reintentos automáticos:
                  </p>
                  <div className="space-y-2">
                    <div className="bg-white p-2 rounded text-xs border">
                      <strong>Acción 1:</strong> Enviar SMS al coordinador de oración<br/>
                      <span className="text-green-600">✓ Entregado (intento 1/3)</span>
                    </div>
                    <div className="bg-white p-2 rounded text-xs border">
                      <strong>Acción 2:</strong> Email de confirmación al solicitante<br/>
                      <span className="text-green-600">✓ Enviado (intento 1/3)</span>
                    </div>
                    <div className="bg-white p-2 rounded text-xs border">
                      <strong>Acción 3:</strong> WhatsApp al equipo de intercesión<br/>
                      <span className="text-green-600">✓ Entregado (intento 1/3)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates Available */}
        <Card>
          <CardHeader>
            <CardTitle>📦 Plantillas de Oración Disponibles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🚨</span>
                <h4 className="font-semibold text-red-900">Petición Urgente - Notificación Inmediata</h4>
              </div>
              <p className="text-sm text-red-800 mb-3">
                Para peticiones marcadas como urgentes. Notifica inmediatamente al equipo pastoral 24/7.
              </p>
              <div className="bg-white p-3 rounded space-y-2 text-xs">
                <div><strong>Disparador:</strong> Petición de oración con prioridad URGENTE</div>
                <div><strong>Bypass Approval:</strong> ✅ Sí (ejecución inmediata)</div>
                <div><strong>Acciones:</strong></div>
                <ul className="ml-4 space-y-1">
                  <li>• SMS al pastor y coordinador de oración (inmediato)</li>
                  <li>• Llamada automática si no hay respuesta (5 min)</li>
                  <li>• Email a todo el equipo de intercesión</li>
                  <li>• Notificación push a la app móvil</li>
                </ul>
                <div><strong>Escalamiento:</strong> Si no hay respuesta en 15 min, notificar a supervisor</div>
              </div>
            </div>

            <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📧</span>
                <h4 className="font-semibold text-blue-900">Auto-Confirmación al Solicitante</h4>
              </div>
              <p className="text-sm text-blue-800 mb-3">
                Envía un mensaje automático de confirmación a quien envió la petición.
              </p>
              <div className="bg-white p-3 rounded space-y-2 text-xs">
                <div><strong>Disparador:</strong> Cualquier petición de oración recibida</div>
                <div><strong>Bypass Approval:</strong> ✅ Sí</div>
                <div><strong>Acciones:</strong></div>
                <ul className="ml-4 space-y-1">
                  <li>• Email/SMS de confirmación (inmediato)</li>
                  <li>• Incluye: &quot;Hemos recibido tu petición. Nuestro equipo está orando por ti.&quot;</li>
                  <li>• Link para actualizar la petición</li>
                </ul>
                <div><strong>Canal preferido:</strong> Usa el canal que la persona indicó (SMS, Email, WhatsApp)</div>
              </div>
            </div>

            <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">💬</span>
                <h4 className="font-semibold text-green-900">Oración por Mensaje</h4>
              </div>
              <p className="text-sm text-green-800 mb-3">
                Envía una oración personalizada al solicitante después de 24 horas.
              </p>
              <div className="bg-white p-3 rounded space-y-2 text-xs">
                <div><strong>Disparador:</strong> Petición de oración (prioridad NORMAL o ALTA)</div>
                <div><strong>Bypass Approval:</strong> ❌ No (requiere aprobación del pastor)</div>
                <div><strong>Acciones:</strong></div>
                <ul className="ml-4 space-y-1">
                  <li>• Espera 24 horas</li>
                  <li>• Pastor revisa y personaliza la oración</li>
                  <li>• Se envía por WhatsApp/SMS al solicitante</li>
                </ul>
                <div><strong>Personalización:</strong> El pastor puede editar el mensaje antes de enviar</div>
              </div>
            </div>

            <div className="p-4 border-2 border-purple-200 rounded-lg bg-purple-50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📞</span>
                <h4 className="font-semibold text-purple-900">Llamada de Oración para Casos Críticos</h4>
              </div>
              <p className="text-sm text-purple-800 mb-3">
                Programa una llamada telefónica personal para peticiones muy sensibles.
              </p>
              <div className="bg-white p-3 rounded space-y-2 text-xs">
                <div><strong>Disparador:</strong> Petición URGENTE con categoría &quot;Salud&quot; o &quot;Duelo&quot;</div>
                <div><strong>Bypass Approval:</strong> ❌ No</div>
                <div><strong>Acciones:</strong></div>
                <ul className="ml-4 space-y-1">
                  <li>• Crea tarea de llamada para pastor/consejero</li>
                  <li>• Programa para dentro de 2 horas</li>
                  <li>• Incluye toda la información de contexto</li>
                  <li>• Envía recordatorio 15 min antes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>⚙️ Configuración Recomendada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold mb-2 text-yellow-900">⚡ Para Respuesta Instantánea</h4>
              <ul className="text-sm space-y-2">
                <li>✅ <strong>Activar bypass approval</strong> en reglas de confirmación</li>
                <li>✅ <strong>Modo urgente 24/7</strong> para peticiones urgentes</li>
                <li>✅ <strong>Canales múltiples:</strong> SMS + Email + WhatsApp</li>
                <li>✅ <strong>Reintentos:</strong> 3 intentos con respaldo automático</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-2 text-blue-900">🔒 Para Privacidad y Control</h4>
              <ul className="text-sm space-y-2">
                <li>✅ <strong>Desactivar bypass approval</strong> para revisión manual</li>
                <li>✅ <strong>Horario laboral:</strong> Solo durante horas de oficina</li>
                <li>✅ <strong>Aprobación del pastor</strong> antes de enviar mensajes personalizados</li>
                <li>✅ <strong>Peticiones anónimas:</strong> No incluir datos personales en notificaciones</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">✨ Mejores Prácticas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">1.</span>
              <p>
                <strong>Confirme siempre la recepción:</strong> Active la plantilla de auto-confirmación para que las personas sepan que su petición fue recibida.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">2.</span>
              <p>
                <strong>Priorice correctamente:</strong> Use URGENTE solo para crisis reales. Use NORMAL para peticiones generales.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">3.</span>
              <p>
                <strong>Personalice los mensajes:</strong> Los mensajes automáticos deben sentirse personales. Use el nombre de la persona y referencias específicas.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">4.</span>
              <p>
                <strong>Configure canales de respaldo:</strong> Si el SMS falla, que intente Email automáticamente.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold">5.</span>
              <p>
                <strong>Respete la privacidad:</strong> Las peticiones anónimas no deben incluir información identificable en las notificaciones.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-purple-900">🚀 Activar Ahora</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="font-bold text-purple-600">1.</span>
                <span>Vaya a <Link href="/automation-rules/templates" className="text-purple-600 underline font-semibold">Plantillas de Automatización</Link></span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-purple-600">2.</span>
                <span>Filtre por categoría <strong>&quot;Peticiones de Oración&quot;</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-purple-600">3.</span>
                <span>Active las 4 plantillas de oración</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-purple-600">4.</span>
                <span>Pruebe enviando una petición de oración de prueba</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-purple-600">5.</span>
                <span>Verifique que las notificaciones lleguen correctamente</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
