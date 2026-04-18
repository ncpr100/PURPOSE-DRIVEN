

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  UserPlus, 
  Users, 
  Target, 
  Crown, 
  Brain,
  BarChart3,
  Lightbulb,
  PlayCircle,
  Settings,
  Info,
  ChevronRight,
  CheckCircle
} from 'lucide-react'

export default function VolunteersManualPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Voluntarios</h1>
        <p className="text-lg text-muted-foreground">
          Guía completa del sistema integrado de gestión de voluntarios
        </p>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Cómo Funciona el Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            El sistema de gestión de voluntarios de Khesed-tek Systems funciona como un <strong>pipeline integrado</strong>:
          </p>
          <div className="flex items-center gap-2 text-center">
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Miembros
            </Badge>
            <ChevronRight className="h-4 w-4" />
            <Badge variant="outline" className="flex items-center gap-1">
              <UserPlus className="h-3 w-3" />
              Voluntarios
            </Badge>
            <ChevronRight className="h-4 w-4" />
            <Badge variant="outline" className="flex items-center gap-1">
              <Crown className="h-3 w-3" />
              Líderes
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Con inteligencia artificial, recomendaciones personalizadas y seguimiento avanzado.
          </p>
        </CardContent>
      </Card>

      {/* Phase 1: Recruitment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-[hsl(var(--success))]" />
            Fase 1: Identificación y Reclutamiento de Miembros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">1</Badge>
              <div>
                <h4 className="font-semibold">Configurar Criterios de Calificación (OPCIONAL)</h4>
                <p className="text-sm text-muted-foreground">Configuración → Criterios de Calificación</p>
                <ul className="text-xs text-muted-foreground space-y-1 ml-4 mt-2">
                  <li>• Personaliza tiempo mínimo de membresía</li>
                  <li>• Configura requisitos de evaluación espiritual</li>
                  <li>• Ajusta criterios de liderazgo</li>
                  <li>• Modifica pesos de puntuación IA</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">2</Badge>
              <div>
                <h4 className="font-semibold">Ir a la página de Miembros</h4>
                <p className="text-sm text-muted-foreground">Dashboard → Miembros</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">3</Badge>
              <div>
                <h4 className="font-semibold">Usar Listas Inteligentes (Con Criterios Personalizados)</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• <strong>&quot;Candidatos Voluntarios&quot;</strong> - Basado en tus criterios configurados</li>
                  <li>• <strong>&quot;Son Voluntarios&quot;</strong> - Voluntarios actuales</li>
                  <li>• <strong>&quot;Listos para Liderazgo&quot;</strong> - Basado en criterios de liderazgo personalizados</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">4</Badge>
              <div>
                <h4 className="font-semibold">Completar Evaluación Espiritual (RECOMENDADO)</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Ir a Dashboard → Dones Espirituales</li>
                  <li>• Completar evaluación integral de 4 pasos</li>
                  <li>• Incluye madurez espiritual y aptitudes de liderazgo</li>
                  <li>• Mejora significativamente las recomendaciones de IA</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">5</Badge>
              <div>
                <h4 className="font-semibold">Reclutar Miembros como Voluntarios</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Busca un miembro que no sea voluntario</li>
                  <li>• Haz clic en el <strong>ícono verde &quot;+&quot;</strong> junto a su nombre</li>
                  <li>• Se abre el diálogo de recomendaciones de IA mejorado</li>
                  <li>• Elige ministerio basado en puntuaciones de compatibilidad</li>
                </ul>
              </div>
            </div>
          </div>
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Nuevo:</strong> El sistema ahora usa criterios personalizables y evaluaciones espirituales integrales para mejorar las recomendaciones de voluntarios y líderes.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Phase 2: Management Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-[hsl(var(--info))]" />
            Fase 2: Sistema de Gestión de Voluntarios
          </CardTitle>
          <CardDescription>
            9 pestañas principales en Dashboard → Voluntarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <strong>Dashboard</strong>
              </div>
              <p className="text-sm text-muted-foreground">Vista general y programación inteligente</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <strong>Reclutamiento</strong>
              </div>
              <p className="text-sm text-muted-foreground">Pipeline avanzado de reclutamiento</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                <strong>Recomendaciones</strong>
              </div>
              <p className="text-sm text-muted-foreground">Sistema inteligente de coincidencias de IA</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                <strong>Liderazgo</strong>
              </div>
              <p className="text-sm text-muted-foreground">Desarrollo y pipeline de liderazgo</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-4 w-4" />
                <strong>Onboarding</strong>
              </div>
              <p className="text-sm text-muted-foreground">Flujos de trabajo de integración</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <strong>Motor IA</strong>
              </div>
              <p className="text-sm text-muted-foreground">Motor de programación inteligente</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <strong>Analytics</strong>
              </div>
              <p className="text-sm text-muted-foreground">Análisis de carga de trabajo y rendimiento</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <strong>Gestión</strong>
              </div>
              <p className="text-sm text-muted-foreground">Gestión tradicional de voluntarios</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-[hsl(var(--success))]" />
            Flujo de Trabajo Recomendado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="default" className="mt-0.5">1</Badge>
              <div>
                <h4 className="font-semibold">Comienza en Miembros</h4>
                <p className="text-sm text-muted-foreground">Identifica candidatos usando las Listas Inteligentes</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="default" className="mt-0.5">2</Badge>
              <div>
                <h4 className="font-semibold">Usa Reclutamiento de IA</h4>
                <p className="text-sm text-muted-foreground">Deja que el sistema sugiera las mejores coincidencias</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="default" className="mt-0.5">3</Badge>
              <div>
                <h4 className="font-semibold">Integración Sistemática</h4>
                <p className="text-sm text-muted-foreground">Usa la pestaña de Onboarding para nuevos voluntarios</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="default" className="mt-0.5">4</Badge>
              <div>
                <h4 className="font-semibold">Monitorea con Analytics</h4>
                <p className="text-sm text-muted-foreground">Rastrea el compromiso y previene el agotamiento</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="default" className="mt-0.5">5</Badge>
              <div>
                <h4 className="font-semibold">Desarrolla Líderes</h4>
                <p className="text-sm text-muted-foreground">Usa la pestaña de Liderazgo para planificación de sucesión</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New: Customization and Assessment Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-[hsl(var(--lavender))]" />
            Personalización de Criterios y Evaluaciones Integrales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-[hsl(var(--lavender))]">🔧 Criterios Personalizables</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Configura criterios específicos para tu iglesia en: <strong>Configuración → Criterios de Calificación</strong>
              </p>
              <ul className="space-y-1 text-sm ml-4">
                <li>• <strong>Candidatos Voluntarios:</strong> Tiempo mínimo de membresía, requisitos de evaluación espiritual</li>
                <li>• <strong>Listos para Liderazgo:</strong> Experiencia como voluntario requerida, capacitación necesaria</li>
                <li>• <strong>Pesos de IA:</strong> Ajusta la importancia de dones espirituales, disponibilidad, experiencia</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-[hsl(var(--info))]">🧠 Evaluación Espiritual Integral</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Nueva evaluación de 4 pasos que incluye:
              </p>
              <ul className="space-y-1 text-sm ml-4">
                <li>• <strong>Paso 1:</strong> Dones espirituales y llamado ministerial</li>
                <li>• <strong>Paso 2:</strong> Madurez espiritual y pasión por el ministerio</li>
                <li>• <strong>Paso 3:</strong> Aptitudes de liderazgo (enseñanza, pastoral, organización, comunicación)</li>
                <li>• <strong>Paso 4:</strong> Capacitación y experiencia completada</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[hsl(var(--success))]">📊 Puntuaciones Automáticas</h4>
              <p className="text-sm text-muted-foreground mb-2">
                El sistema ahora calcula automáticamente:
              </p>
              <ul className="space-y-1 text-sm ml-4">
                <li>• <strong>Puntaje de Preparación de Voluntario:</strong> Basado en madurez espiritual, pasión ministerial y disponibilidad</li>
                <li>• <strong>Puntaje de Preparación de Liderazgo:</strong> Basado en aptitudes de liderazgo, capacitación y experiencia</li>
                <li>• <strong>Recomendaciones Mejoradas:</strong> Usa todos los factores para mejores coincidencias</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-[hsl(var(--warning))]" />
            Mejores Prácticas (Actualizado)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-[hsl(var(--success))]">✅ Haz Esto</h4>
              <ul className="space-y-1 text-sm">
                <li>• Configura criterios personalizados para tu contexto</li>
                <li>• Completa evaluaciones espirituales integrales</li>
                <li>• Usa las puntuaciones automáticas para decisiones</li>
                <li>• Monitorea y ajusta criterios según resultados</li>
                <li>• Aprovecha las capacitaciones rastreadas</li>
                <li>• Confía en las recomendaciones mejoradas de IA</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-[hsl(var(--destructive))]">❌ Evita Esto</h4>
              <ul className="space-y-1 text-sm">
                <li>• Usar criterios predeterminados sin personalizar</li>
                <li>• Saltarse las evaluaciones espirituales</li>
                <li>• Ignorar las puntuaciones automáticas</li>
                <li>• No actualizar criterios con experiencia</li>
                <li>• Descuidar el seguimiento de capacitaciones</li>
                <li>• Hacer decisiones sin datos de evaluación</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact for Help */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>¿Necesitas más ayuda?</strong> Si tienes preguntas específicas sobre la gestión de voluntarios, 
          contacta al equipo de soporte o consulta los videos tutoriales en la sección de Ayuda.
        </AlertDescription>
      </Alert>
    </div>
  )
}
