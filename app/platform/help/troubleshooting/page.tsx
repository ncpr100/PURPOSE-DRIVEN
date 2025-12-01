'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  AlertTriangle, 
  CheckCircle, 
  Server, 
  Database,
  Shield,
  Zap,
  Users,
  BarChart3,
  Settings,
  AlertCircle,
  Clock,
  RefreshCw
} from 'lucide-react'

export default function PlatformTroubleshootingManual() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          🛠️ Manual de Resolución de Problemas - Super Admin
          <Badge variant="destructive">Confidencial</Badge>
        </h1>
        <p className="text-muted-foreground">
          Guía técnica completa para diagnosticar y resolver problemas de la plataforma
        </p>
      </div>

      <Alert className="mb-8">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Solo para Super Admins:</strong> Esta documentación contiene información técnica sensible 
          y procedimientos de escalamiento crítico. Mantener confidencial.
        </AlertDescription>
      </Alert>

      <div className="space-y-8">
        
        {/* Common Issues */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Problemas Más Comunes y Soluciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Authentication Issues */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                1. Problemas de Autenticación
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2 text-red-600">🚨 Síntomas:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• "Session expired" frecuente</li>
                    <li>• Login loops infinitos</li>
                    <li>• Permisos incorrectos mostrados</li>
                    <li>• Error 401 en APIs</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-green-600">✅ Soluciones:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Verificar JWT_SECRET:</strong> En variables de entorno</li>
                    <li>• <strong>Limpiar cookies:</strong> Hard refresh del navegador</li>
                    <li>• <strong>Revisar roles:</strong> En base de datos directamente</li>
                    <li>• <strong>Regenerar session:</strong> Logout/login forzado</li>
                  </ul>
                </div>
              </div>
              <div className="bg-gray-100 rounded p-3 mt-4 font-mono text-sm">
                <strong>Comando de emergencia:</strong><br />
                <code>UPDATE users SET role = 'SUPER_ADMIN' WHERE email = 'admin@domain.com';</code>
              </div>
            </div>

            {/* Database Performance */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-500" />
                2. Problemas de Base de Datos
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2 text-red-600">🚨 Síntomas:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Queries lentas (&gt;5 segundos)</li>
                    <li>• Timeouts en dashboards</li>
                    <li>• Error de conexión a BD</li>
                    <li>• Memory leaks en análisis</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-green-600">✅ Soluciones:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Reiniciar conexiones:</strong> Pool de Prisma</li>
                    <li>• <strong>Revisar índices:</strong> EXPLAIN queries lentas</li>
                    <li>• <strong>Limpiar cache Redis:</strong> Datos obsoletos</li>
                    <li>• <strong>Optimizar queries:</strong> Agregaciones complejas</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Analytics Issues */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                3. Problemas en Analíticas
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2 text-red-600">🚨 Síntomas:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Datos incorrectos en dashboards</li>
                    <li>• Predicciones IA erróneas</li>
                    <li>• Exportes fallidos</li>
                    <li>• Real-time updates detenidas</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-green-600">✅ Soluciones:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Recalcular métricas:</strong> Trigger manual</li>
                    <li>• <strong>Validar fuentes:</strong> Data integrity check</li>
                    <li>• <strong>Resetear cache IA:</strong> Modelo predictions</li>
                    <li>• <strong>Reiniciar SSE:</strong> Server-sent events</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Automation Issues */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-500" />
                4. Problemas de Automatización
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2 text-red-600">🚨 Síntomas:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Reglas no se ejecutan</li>
                    <li>• Redes sociales no publican</li>
                    <li>• Emails no se envían</li>
                    <li>• QR codes no generan</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-green-600">✅ Soluciones:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Verificar APIs externas:</strong> Facebook, etc.</li>
                    <li>• <strong>Revisar cron jobs:</strong> Scheduled tasks</li>
                    <li>• <strong>Validar webhooks:</strong> Event triggers</li>
                    <li>• <strong>Resetear feature flags:</strong> A/B testing</li>
                  </ul>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Diagnostic Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Herramientas de Diagnóstico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  Sistema
                </h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Health Check:</strong> /api/health</li>
                  <li>• <strong>Memory Usage:</strong> npm run memory:assess</li>
                  <li>• <strong>Database Status:</strong> npx prisma studio</li>
                  <li>• <strong>Build Status:</strong> npm run test:compile</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Base de Datos
                </h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Query Performance:</strong> EXPLAIN ANALYZE</li>
                  <li>• <strong>Index Usage:</strong> pg_stat_user_indexes</li>
                  <li>• <strong>Connection Pool:</strong> Prisma metrics</li>
                  <li>• <strong>Slow Queries:</strong> pg_stat_statements</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analíticas
                </h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Data Validation:</strong> Scripts de verificación</li>
                  <li>• <strong>Cache Status:</strong> Redis CLI</li>
                  <li>• <strong>AI Accuracy:</strong> Model performance</li>
                  <li>• <strong>Export Logs:</strong> Generation history</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">🔧 Comando de Diagnóstico Rápido:</h4>
              <div className="font-mono text-sm bg-blue-100 p-2 rounded">
                <code>node scripts/platform-health-check.js</code>
              </div>
              <p className="text-sm text-blue-700 mt-2">
                Ejecuta verificación completa de sistema, BD, cache y servicios externos.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Escalation Procedures */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Procedimientos de Escalamiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid gap-4">
              <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                <h3 className="font-semibold text-lg mb-3 text-yellow-800">
                  ⚠️ Nivel 1 - Problemas Menores
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Ejemplos:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Quejas de UI/UX</li>
                      <li>• Queries ocasionalmente lentas</li>
                      <li>• Problemas de conectividad menores</li>
                      <li>• Solicitudes de nuevas funcionalidades</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Acción:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• <strong>Tiempo de respuesta:</strong> 24-48 horas</li>
                      <li>• <strong>Responsable:</strong> Super Admin disponible</li>
                      <li>• <strong>Escalamiento:</strong> Si no se resuelve en 3 días</li>
                      <li>• <strong>Documentación:</strong> Ticket interno</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <h3 className="font-semibold text-lg mb-3 text-orange-800">
                  🚨 Nivel 2 - Problemas Críticos
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Ejemplos:</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Múltiples iglesias afectadas</li>
                      <li>• Fallos de autenticación masivos</li>
                      <li>• Pérdida de datos críticos</li>
                      <li>• APIs completamente down</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Acción:</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• <strong>Tiempo de respuesta:</strong> 2-4 horas</li>
                      <li>• <strong>Responsable:</strong> Super Admin senior</li>
                      <li>• <strong>Escalamiento:</strong> Contactar desarrollo</li>
                      <li>• <strong>Comunicación:</strong> Notificar iglesias afectadas</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <h3 className="font-semibold text-lg mb-3 text-red-800">
                  🔥 Nivel 3 - Emergencia de Sistema
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Ejemplos:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Plataforma completamente caída</li>
                      <li>• Breach de seguridad confirmado</li>
                      <li>• Corrupción masiva de datos</li>
                      <li>• Falla de infraestructura crítica</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Acción:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• <strong>Tiempo de respuesta:</strong> Inmediato (&lt;30 min)</li>
                      <li>• <strong>Responsable:</strong> Equipo completo activado</li>
                      <li>• <strong>Escalamiento:</strong> CTO/CEO inmediato</li>
                      <li>• <strong>Comunicación:</strong> Status page, emails masivos</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Contactos de Emergencia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">🚨 Escalamiento Técnico:</h4>
                <div className="space-y-2 text-sm">
                  <div className="border rounded p-2">
                    <strong>Desarrollo Senior:</strong><br />
                    📧 tech-emergency@khesed-tek.com<br />
                    📱 +1 (555) 123-TECH
                  </div>
                  <div className="border rounded p-2">
                    <strong>DevOps/Infraestructura:</strong><br />
                    📧 infra-alert@khesed-tek.com<br />
                    📱 +1 (555) 456-INFRA
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">🏢 Escalamiento Ejecutivo:</h4>
                <div className="space-y-2 text-sm">
                  <div className="border rounded p-2">
                    <strong>CTO:</strong><br />
                    📧 cto@khesed-tek.com<br />
                    📱 +1 (555) 789-CTO
                  </div>
                  <div className="border rounded p-2">
                    <strong>CEO (Solo Nivel 3):</strong><br />
                    📧 ceo@khesed-tek.com<br />
                    📱 +1 (555) 000-CEO
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">⚡ Protocolo de Emergencia 24/7:</h4>
              <ol className="text-sm text-red-700 space-y-1">
                <li>1. <strong>Evaluar severidad:</strong> Usar niveles 1-3 definidos arriba</li>
                <li>2. <strong>Documentar problema:</strong> Screenshot, logs, pasos para reproducir</li>
                <li>3. <strong>Contactar según nivel:</strong> Email + llamada si es nivel 2+</li>
                <li>4. <strong>Implementar workaround:</strong> Si es posible, mientras llega ayuda</li>
                <li>5. <strong>Comunicar a usuarios:</strong> Status updates transparentes</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Recovery Procedures */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Procedimientos de Recuperación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">🔄 Recuperación de Datos:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Backup automático:</strong> Daily 2 AM UTC</li>
                  <li>• <strong>Retención:</strong> 30 días rolling</li>
                  <li>• <strong>Ubicación:</strong> S3 bucket encrypted</li>
                  <li>• <strong>Tiempo recuperación:</strong> 2-6 horas</li>
                  <li>• <strong>Comando:</strong> <code>npm run restore:backup [date]</code></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">🚀 Recuperación de Servicio:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Rollback de código:</strong> Git previous stable</li>
                  <li>• <strong>Restart servicios:</strong> PM2 cluster restart</li>
                  <li>• <strong>Cache flush:</strong> Redis complete clear</li>
                  <li>• <strong>DB reconnect:</strong> Connection pool reset</li>
                  <li>• <strong>Health check:</strong> Automated validation</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">✅ Checklist Post-Recuperación:</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-green-700">
                <div>
                  <ul className="space-y-1">
                    <li>☐ Servicios críticos funcionando</li>
                    <li>☐ Autenticación operativa</li>
                    <li>☐ Base de datos respondiendo</li>
                    <li>☐ APIs externas conectadas</li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-1">
                    <li>☐ Cache repopulado</li>
                    <li>☐ Analíticas actualizadas</li>
                    <li>☐ Notificaciones funcionando</li>
                    <li>☐ Usuarios notificados de resolución</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}