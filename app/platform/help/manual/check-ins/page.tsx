
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Shield, Settings, Database, Users, Zap, AlertTriangle, Crown } from 'lucide-react'
import Link from 'next/link'

export default function SuperAdminCheckInsManual() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Link href="/platform/help">
        <Button variant="outline" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Centro de Ayuda
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <Crown className="h-8 w-8 text-[hsl(var(--warning))]" />
        <div>
          <h1 className="text-3xl font-bold">Manual SUPER_ADMIN: Check-In Avanzado</h1>
          <p className="text-muted-foreground">Configuración y administración del sistema WebRTC y Automatización</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Administrative Overview */}
        <Card className="border-[hsl(var(--warning)/0.3)] bg-[hsl(var(--warning)/0.10)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-[hsl(var(--warning))]" />
              Panel de Control SUPER_ADMIN
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Como SUPER_ADMIN, tiene control total sobre la configuración y administración del sistema de Check-In avanzado:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-white">
                <Badge variant="secondary" className="mb-2">Administración</Badge>
                <h4 className="font-semibold">Gestión de Sistema</h4>
                <p className="text-sm text-muted-foreground">Configurar automatizaciones, revisar logs, gestionar permisos</p>
              </div>
              <div className="p-4 border rounded-lg bg-white">
                <Badge variant="secondary" className="mb-2">Seguridad</Badge>
                <h4 className="font-semibold">Control de Acceso</h4>
                <p className="text-sm text-muted-foreground">Supervisar intentos fallidos, códigos de emergencia, auditorías</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Database Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Configuración de Base de Datos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-[hsl(var(--info)/0.10)] p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Nuevos Campos de Base de Datos</h4>
              <p className="text-sm mb-3">El sistema ha añadido los siguientes campos para las nuevas funcionalidades:</p>
              
              <div className="grid gap-4">
                <div>
                  <h5 className="font-medium text-sm">Tabla: check_ins (Visitantes)</h5>
                  <div className="ml-4 text-sm text-muted-foreground space-y-1">
                    <p>• <code>visitorType</code>: Clasificación automática</p>
                    <p>• <code>ministryInterest[]</code>: Array de ministerios de interés</p>
                    <p>• <code>engagementScore</code>: Puntuación 0-100</p>
                    <p>• <code>automationTriggered</code>: Estado de automatización</p>
                    <p>• <code>ageGroup, familyStatus, referredBy</code>: Datos demográficos</p>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-sm">Tabla: children_check_ins (Niños)</h5>
                  <div className="ml-4 text-sm text-muted-foreground space-y-1">
                    <p>• <code>childPhotoUrl, parentPhotoUrl</code>: URLs cifradas de fotos</p>
                    <p>• <code>securityPin</code>: PIN de 6 dígitos</p>
                    <p>• <code>biometricHash</code>: Hash de reconocimiento facial</p>
                    <p>• <code>backupAuthCodes[]</code>: Códigos de emergencia</p>
                    <p>• <code>pickupAttempts[]</code>: Log de intentos de recogida</p>
                    <p>• <code>photoTakenAt</code>: Timestamp para eliminación automática</p>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-sm">Tabla: visitor_follow_ups (Seguimiento)</h5>
                  <div className="ml-4 text-sm text-muted-foreground space-y-1">
                    <p>• <code>automationRuleId</code>: Enlace a regla de automatización</p>
                    <p>• <code>touchSequence</code>: Secuencia de contacto (1-5)</p>
                    <p>• <code>priority</code>: Prioridad (HIGH/MEDIUM/LOW)</p>
                    <p>• <code>ministryMatch</code>: Ministerio asignado</p>
                    <p>• <code>responseData</code>: Datos de respuesta JSON</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[hsl(var(--destructive)/0.10)] p-4 rounded-lg border-[hsl(var(--destructive)/0.3)]">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[hsl(var(--destructive))]" />
                Comandos de Mantenimiento
              </h4>
              <div className="text-sm space-y-2">
                <p><strong>Para sincronizar la base de datos:</strong></p>
                <code className="bg-muted/50 px-2 py-1 rounded">yarn prisma db push</code>
                <p><strong>Para regenerar el cliente Prisma:</strong></p>
                <code className="bg-muted/50 px-2 py-1 rounded">yarn prisma generate</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración de APIs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Nuevos Endpoints de API</h4>
              
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium text-sm mb-2">API de Automatización de Visitantes</h5>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• <code>POST /api/visitor-automation</code> - Activar automatización</p>
                    <p>• <code>GET /api/visitor-automation?checkInId=[id]</code> - Estado de automatización</p>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium text-sm mb-2">API de Seguridad Infantil</h5>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• <code>POST /api/child-security</code> - Check-in seguro con fotos</p>
                    <p>• <code>GET /api/child-security?checkInId=[id]</code> - Información de seguridad</p>
                    <p>• <code>POST /api/child-security/cleanup</code> - Limpieza automática de fotos</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[hsl(var(--warning)/0.10)] p-4 rounded-lg border-[hsl(var(--warning)/0.3)]">
              <h4 className="font-semibold mb-2">Variables de Entorno Requeridas</h4>
              <div className="text-sm space-y-1">
                <p>• <code>CRON_SECRET</code> - Para trabajos de limpieza automática</p>
                <p>• <code>PHOTO_ENCRYPTION_KEY</code> - Para cifrar fotos (recomendado)</p>
                <p>• <code>ML_API_KEY</code> - Para reconocimiento facial (opcional)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Administration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Administración de Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Funciones de Supervisión</h4>
              
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium">Anulación de Emergencia</h5>
                  <p className="text-sm text-muted-foreground mb-2">Como SUPER_ADMIN puede autorizar recogidas de emergencia:</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    <li>Ignorar verificación fotográfica fallida</li>
                    <li>Ignorar PIN incorrecto</li>
                    <li>Registrar motivo de anulación</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium">Auditoría de Seguridad</h5>
                  <p className="text-sm text-muted-foreground mb-2">Revisar intentos fallidos y actividad sospechosa:</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    <li>Log de intentos de recogida con timestamps</li>
                    <li>Puntuaciones de coincidencia fotográfica</li>
                    <li>Patrones de intentos fallidos</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-[hsl(var(--destructive)/0.10)] p-4 rounded-lg border-[hsl(var(--destructive)/0.3)]">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[hsl(var(--destructive))]" />
                Políticas de Seguridad
              </h4>
              <ul className="text-sm space-y-1">
                <li>• <strong>Retención de Fotos:</strong> 7 días máximo (configurable)</li>
                <li>• <strong>Cifrado:</strong> AES-256 para todas las fotos</li>
                <li>• <strong>Intentos Fallidos:</strong> Máximo 3 por check-in</li>
                <li>• <strong>Códigos de Respaldo:</strong> 3 por cada check-in</li>
                <li>• <strong>Limpieza Automática:</strong> Cron job diario recomendado</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Automation Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Configuración de Automatización
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Configuración de Secuencias de Seguimiento</h4>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium">Secuencia de Primeras Visitas (5 toques)</h5>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p><strong>Día 0:</strong> Bienvenida inmediata por email</p>
                    <p><strong>Día 2:</strong> Video de bienvenida del pastor</p>
                    <p><strong>Día 7:</strong> Presentación de ministerios</p>
                    <p><strong>Día 14:</strong> Invitación a grupo pequeño</p>
                    <p><strong>Día 30:</strong> Solicitud de retroalimentación</p>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium">Configuración de Ministerios</h5>
                  <p className="text-sm text-muted-foreground mb-2">Conectar visitantes con líderes ministeriales:</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    <li>Adoración y Música</li>
                    <li>Ministerio Infantil</li>
                    <li>Ministerio Juvenil</li>
                    <li>Adultos Mayores</li>
                    <li>Cocina y Alimentación</li>
                    <li>Seguridad</li>
                    <li>Tecnología y Multimedia</li>
                    <li>Intercesión y Oración</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-[hsl(var(--info)/0.10)] p-4 rounded-lg border-[hsl(var(--info)/0.3)]">
              <h4 className="font-semibold mb-2">Integración con Muro de Oración</h4>
              <p className="text-sm">Las peticiones de oración de visitantes se integran automáticamente con el sistema de Muro de Oración para seguimiento pastoral.</p>
            </div>
          </CardContent>
        </Card>

        {/* Monitoring & Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle>🔧 Monitoreo y Mantenimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Tareas de Monitoreo</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Revisar logs de intentos fallidos diariamente</li>
                    <li>• Verificar limpieza automática de fotos</li>
                    <li>• Monitorear puntuaciones de engagement</li>
                    <li>• Auditar conexiones ministeriales</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Mantenimiento Preventivo</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Configurar cron job para limpieza de fotos</li>
                    <li>• Actualizar códigos de emergencia periódicamente</li>
                    <li>• Revisar configuración de ministerios</li>
                    <li>• Probar cámaras web regularmente</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Comando de Limpieza Manual</h4>
                <p className="text-sm mb-2">Para ejecutar limpieza de fotos manualmente:</p>
                <code className="bg-muted/50 px-2 py-1 rounded text-sm">
                  curl -X POST /api/child-security/cleanup -H &quot;Authorization: Bearer [CRON_SECRET]&quot;
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle>🆘 Soporte Técnico Avanzado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Para asistencia técnica especializada en configuración de sistema:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => window.open('https://wa.me/573003435733', '_blank')}>
                  💬 Soporte WhatsApp
                </Button>
                <Button variant="outline" onClick={() => window.open('mailto:soporte@khesed-tek-systems.org', '_blank')}>
                  ✉️ Email Técnico
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
