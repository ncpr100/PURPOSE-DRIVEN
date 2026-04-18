

'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Settings, 
  UserPlus, 
  Crown, 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Target,
  Brain,
  Sliders,
  ToggleLeft,
  Save,
  RotateCcw,
  Lightbulb,
  Users
} from 'lucide-react'
import Link from 'next/link'

export default function QualificationSettingsManual() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/platform/help">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Centro de Documentación
          </Button>
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">🎯 Criterios de Calificación Personalizables</h1>
        <p className="text-xl text-muted-foreground">
          Manual completo para configurar criterios de voluntarios y liderazgo por iglesia
        </p>
        <div className="flex gap-2 mt-4">
          <Badge variant="default">SUPER_ADMIN</Badge>
          <Badge variant="default">ADMIN_IGLESIA</Badge>
          <Badge variant="default">PASTOR</Badge>
          <Badge variant="outline">20 min lectura</Badge>
        </div>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-[hsl(var(--info))]" />
            Resumen del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            El sistema de <strong>Criterios de Calificación Personalizables</strong> permite a cada iglesia 
            definir sus propios estándares para identificar candidatos a voluntarios y líderes, 
            reemplazando los criterios fijos del sistema anterior.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 text-center">
              <UserPlus className="h-8 w-8 mx-auto mb-2 text-[hsl(var(--success))]" />
              <h4 className="font-semibold">Candidatos Voluntarios</h4>
              <p className="text-sm text-muted-foreground">Criterios personalizables para identificar miembros listos para ser voluntarios</p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <Crown className="h-8 w-8 mx-auto mb-2 text-[hsl(var(--lavender))]" />
              <h4 className="font-semibold">Listos para Liderazgo</h4>
              <p className="text-sm text-muted-foreground">Estándares ajustables para candidatos a posiciones de liderazgo</p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <Brain className="h-8 w-8 mx-auto mb-2 text-[hsl(var(--info))]" />
              <h4 className="font-semibold">IA Personalizada</h4>
              <p className="text-sm text-muted-foreground">Pesos ajustables para algoritmos de recomendación inteligente</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Before and After */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[hsl(var(--warning))]" />
            Cambios Importantes del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-[hsl(var(--destructive))] mb-3">❌ Sistema Anterior (Fijo)</h4>
              <ul className="space-y-2 text-sm">
                <li>• Candidatos voluntarios: Solo verificación de estado no-voluntario</li>
                <li>• Liderazgo: Requisito fijo de 1 año de membresía</li>
                <li>• Sin consideración de evaluaciones espirituales</li>
                <li>• Pesos de IA no configurables</li>
                <li>• Criterios iguales para todas las iglesias</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[hsl(var(--success))] mb-3">✅ Sistema Nuevo (Personalizable)</h4>
              <ul className="space-y-2 text-sm">
                <li>• Tiempo mínimo de membresía configurable</li>
                <li>• Requisitos de evaluación espiritual opcionales</li>
                <li>• Puntajes mínimos de madurez y liderazgo ajustables</li>
                <li>• Experiencia como voluntario configurable para liderazgo</li>
                <li>• Pesos de algoritmos de IA personalizables</li>
                <li>• Criterios únicos por iglesia</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Access Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
            Acceso y Configuración Inicial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">1</Badge>
              <div>
                <h4 className="font-semibold">Acceder a la Configuración</h4>
                <p className="text-sm text-muted-foreground">
                  Desde cualquier iglesia: <strong>Dashboard → Configuración → Criterios de Calificación</strong>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  URL: <code>/settings/qualification</code>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">2</Badge>
              <div>
                <h4 className="font-semibold">Permisos Requeridos</h4>
                <p className="text-sm text-muted-foreground">
                  Solo usuarios con roles <Badge variant="outline" className="mx-1">SUPER_ADMIN</Badge>, 
                  <Badge variant="outline" className="mx-1">ADMIN_IGLESIA</Badge>, o 
                  <Badge variant="outline" className="mx-1">PASTOR</Badge> pueden acceder
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">3</Badge>
              <div>
                <h4 className="font-semibold">Configuración Inicial Automática</h4>
                <p className="text-sm text-muted-foreground">
                  Si es la primera vez, el sistema creará configuración predeterminada compatible con el sistema anterior
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interface Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-[hsl(var(--lavender))]" />
            Guía de la Interfaz de Configuración
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-[hsl(var(--success))] mb-2">📑 Tab 1: Candidatos Voluntarios</h4>
              <div className="ml-4 space-y-2 text-sm">
                <p><strong>Mínimo de días como miembro:</strong> Input numérico (0 = sin restricción)</p>
                <p><strong>Puntaje mínimo de madurez espiritual:</strong> Slider 0-100%</p>
                <p><strong>Debe estar activo como miembro:</strong> Switch ON/OFF</p>
                <p><strong>Debe completar evaluación espiritual:</strong> Switch ON/OFF</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-[hsl(var(--lavender))] mb-2">👑 Tab 2: Listos para Liderazgo</h4>
              <div className="ml-4 space-y-2 text-sm">
                <p><strong>Mínimo de días como miembro:</strong> Input numérico (predeterminado: 365)</p>
                <p><strong>Mínimo de días como voluntario:</strong> Input numérico (0 = sin restricción)</p>
                <p><strong>Puntajes mínimos:</strong> Sliders para madurez espiritual y aptitud de liderazgo</p>
                <p><strong>Debe tener experiencia como voluntario:</strong> Switch ON/OFF</p>
                <p><strong>Debe completar entrenamiento de liderazgo:</strong> Switch ON/OFF</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-[hsl(var(--info))] mb-2">🧠 Tab 3: Sistema de Puntuación</h4>
              <div className="ml-4 space-y-2 text-sm">
                <p><strong>Sistemas habilitados:</strong> Switches para evaluación de madurez, aptitud y pasión ministerial</p>
                <p><strong>Pesos de puntuación:</strong> Sliders para ajustar importancia de cada factor (deben sumar 100%)</p>
                <p><strong>Validación automática:</strong> El sistema muestra advertencias si los pesos no suman 100%</p>
              </div>
            </div>
          </div>

          <Alert>
            <Save className="h-4 w-4" />
            <AlertDescription>
              <strong>Importante:</strong> Los cambios no se aplican hasta hacer clic en &quot;Guardar Cambios&quot;. 
              El botón &quot;Restaurar&quot; restablece valores predeterminados.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Database Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-[hsl(var(--warning))]" />
            Integración con Evaluaciones Espirituales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            El sistema se integra con las evaluaciones espirituales mejoradas para proporcionar 
            calificaciones más precisas y detalladas.
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">📊 Puntuaciones Automáticas Generadas</h4>
              <ul className="text-sm space-y-1 ml-4 mt-2">
                <li>• <strong>Puntuación de Preparación de Voluntario</strong> (0-100): Madurez espiritual + Pasión ministerial + Disponibilidad + Experiencia</li>
                <li>• <strong>Puntuación de Preparación de Liderazgo</strong> (0-100): Aptitudes de liderazgo + Capacitación + Experiencia + Mentoría</li>
                <li>• <strong>Recomendaciones IA Mejoradas</strong>: Usa hasta 15 factores de evaluación para mejores coincidencias</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">🔄 Actualización en Tiempo Real</h4>
              <p className="text-sm text-muted-foreground">
                Los cambios en criterios se reflejan inmediatamente en:
              </p>
              <ul className="text-sm space-y-1 ml-4 mt-2">
                <li>• Listas inteligentes de miembros (&quot;Candidatos Voluntarios&quot;, &quot;Listos para Liderazgo&quot;)</li>
                <li>• Contadores de smart lists</li>
                <li>• Recomendaciones de IA para voluntarios</li>
                <li>• Algoritmos de matching ministerio-voluntario</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[hsl(var(--info))]" />
            Ejemplos de Configuración por Tipo de Iglesia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-[hsl(var(--info))] mb-3">🏛️ Iglesia Tradicional Grande</h4>
              <div className="text-sm space-y-2">
                <p><strong>Voluntarios:</strong> 6 meses membresía, evaluación espiritual obligatoria</p>
                <p><strong>Liderazgo:</strong> 2 años membresía, 1 año como voluntario, capacitación requerida</p>
                <p><strong>IA:</strong> Énfasis en dones espirituales (50%) y experiencia (25%)</p>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-[hsl(var(--success))] mb-3">⛪ Iglesia Contemporánea Mediana</h4>
              <div className="text-sm space-y-2">
                <p><strong>Voluntarios:</strong> 3 meses membresía, evaluación opcional</p>
                <p><strong>Liderazgo:</strong> 1 año membresía, experiencia voluntaria opcional</p>
                <p><strong>IA:</strong> Balance entre pasión (30%) y disponibilidad (30%)</p>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-[hsl(var(--lavender))] mb-3">🌱 Iglesia Plantación Nueva</h4>
              <div className="text-sm space-y-2">
                <p><strong>Voluntarios:</strong> Sin restricción de tiempo, solo estado activo</p>
                <p><strong>Liderazgo:</strong> 6 meses membresía, sin experiencia voluntaria requerida</p>
                <p><strong>IA:</strong> Prioridad en disponibilidad (40%) y pasión (35%)</p>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-[hsl(var(--warning))] mb-3">🎯 Iglesia Enfocada en Misiones</h4>
              <div className="text-sm space-y-2">
                <p><strong>Voluntarios:</strong> 1 mes membresía, evaluación espiritual requerida</p>
                <p><strong>Liderazgo:</strong> 1 año membresía, capacitación misionera obligatoria</p>
                <p><strong>IA:</strong> Alto peso en dones espirituales (45%) y experiencia (30%)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
            Especificaciones Técnicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">🗄️ Base de Datos</h4>
              <ul className="text-sm space-y-1">
                <li>• Tabla: <code>church_qualification_settings</code></li>
                <li>• Campos: 20+ configuraciones por iglesia</li>
                <li>• Relación: 1:1 con tabla <code>churches</code></li>
                <li>• Valores predeterminados compatibles con sistema anterior</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">🔌 APIs</h4>
              <ul className="text-sm space-y-1">
                <li>• <code>GET /api/qualification-settings</code></li>
                <li>• <code>PUT /api/qualification-settings</code></li>
                <li>• Autenticación: Sesión de usuario</li>
                <li>• Autorización: Roles específicos solamente</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">⚡ Performance</h4>
              <ul className="text-sm space-y-1">
                <li>• Configuración cacheada por iglesia</li>
                <li>• Actualización en tiempo real de smart lists</li>
                <li>• Validación client-side y server-side</li>
                <li>• Rollback automático en caso de error</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">🔒 Seguridad</h4>
              <ul className="text-sm space-y-1">
                <li>• Control de acceso basado en roles</li>
                <li>• Validación de rangos numéricos</li>
                <li>• Audit log de cambios de configuración</li>
                <li>• Rollback a configuración anterior disponible</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[hsl(var(--warning))]" />
            Resolución de Problemas Comunes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-[hsl(var(--destructive))]">❌ No aparece la opción &quot;Criterios de Calificación&quot;</h4>
              <p className="text-sm text-muted-foreground ml-4">
                <strong>Solución:</strong> Verificar que el usuario tenga rol SUPER_ADMIN, ADMIN_IGLESIA o PASTOR
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[hsl(var(--destructive))]">❌ Los pesos de IA no suman 100%</h4>
              <p className="text-sm text-muted-foreground ml-4">
                <strong>Solución:</strong> Ajustar sliders hasta que la suma sea exactamente 1.00 (100%). El sistema muestra alerta en tiempo real.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[hsl(var(--destructive))]">❌ Los smart lists no se actualizan</h4>
              <p className="text-sm text-muted-foreground ml-4">
                <strong>Solución:</strong> Refrescar la página de Miembros. Los contadores se actualizan automáticamente al guardar cambios.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[hsl(var(--destructive))]">❌ Error al guardar configuración</h4>
              <p className="text-sm text-muted-foreground ml-4">
                <strong>Solución:</strong> Verificar conexión de red y que todos los campos estén dentro de rangos válidos (0-100 para porcentajes, positivos para días).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-[hsl(var(--warning))]" />
            Mejores Prácticas para Administradores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-[hsl(var(--success))]">✅ Recomendaciones</h4>
              <ul className="space-y-1 text-sm">
                <li>• Iniciar con configuración conservadora y ajustar gradualmente</li>
                <li>• Documentar cambios con fecha y razón</li>
                <li>• Probar con un grupo pequeño antes de aplicar masivamente</li>
                <li>• Revisar analytics de voluntarios mensualmente</li>
                <li>• Capacitar a líderes sobre nuevos criterios</li>
                <li>• Hacer respaldo de configuración antes de cambios grandes</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-[hsl(var(--destructive))]">❌ Evitar</h4>
              <ul className="space-y-1 text-sm">
                <li>• Cambios frecuentes sin análisis de impacto</li>
                <li>• Criterios extremadamente restrictivos desde el inicio</li>
                <li>• Ignorar feedback de líderes de ministerio</li>
                <li>• No comunicar cambios a la congregación</li>
                <li>• Configurar sin entender el contexto de la iglesia</li>
                <li>• Modificar pesos de IA sin datos de respaldo</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact for Help */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>¿Necesitas ayuda adicional?</strong> Contacta el soporte técnico en{' '}
          <a href="mailto:soporte@khesed-tek-systems.org" className="underline font-semibold">
            soporte@khesed-tek-systems.org
          </a>{' '}
          o WhatsApp: <strong>+57 302 123 4410</strong>
        </AlertDescription>
      </Alert>
    </div>
  )
}
