'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Target,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  PieChart,
  Activity,
  Zap
} from 'lucide-react'

export default function IntelligentAnalyticsManual() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          🤖 Analíticas Inteligentes
          <Badge variant="secondary">🆕 IA Powered</Badge>
        </h1>
        <p className="text-muted-foreground">
          Análisis predictivo impulsado por IA para tomar decisiones pastorales informadas
        </p>
      </div>

      <div className="space-y-8">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              ¿Qué son las Analíticas Inteligentes?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Las Analíticas Inteligentes utilizan algoritmos de inteligencia artificial para analizar 
              patrones en su congregación, predecir tendencias futuras y proporcionar recomendaciones 
              pastorales personalizadas para el crecimiento de la iglesia.
            </p>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <Brain className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">IA Predictiva</h3>
                <p className="text-sm text-muted-foreground">
                  90%+ precisión en predicciones
                </p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Recomendaciones</h3>
                <p className="text-sm text-muted-foreground">
                  Estrategias personalizadas
                </p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Alertas de Riesgo</h3>
                <p className="text-sm text-muted-foreground">
                  Prevención proactiva
                </p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Insights Ejecutivos</h3>
                <p className="text-sm text-muted-foreground">
                  Reportes de liderazgo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Path */}
        <Card>
          <CardHeader>
            <CardTitle>📍 Acceder a Analíticas Inteligentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                <strong>Ruta:</strong> Panel de Control → Analíticas Inteligentes
              </p>
              <p className="text-sm text-blue-700 mt-2">
                <strong>Permisos:</strong> Disponible para PASTOR, ADMIN_IGLESIA y SUPER_ADMIN
              </p>
            </div>
          </CardContent>
        </Card>

        {/* AI Modules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Módulos de IA Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Executive Report */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                1. Reporte Ejecutivo IA
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Métricas Analizadas:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Salud de la Iglesia:</strong> Score de 0-100</li>
                    <li>• <strong>Momentum Espiritual:</strong> Tendencia de crecimiento</li>
                    <li>• <strong>Eficiencia de Programas:</strong> ROI ministerial</li>
                    <li>• <strong>Satisfacción de Miembros:</strong> Engagement score</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Insights Generados:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Identificación de fortalezas clave</li>
                    <li>• Áreas de mejora prioritarias</li>
                    <li>• Comparación con iglesias similares</li>
                    <li>• Proyecciones a 3-6 meses</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Predictive Analytics */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                2. Analíticas Predictivas
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Predicción de Retención:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Riesgo de abandono por miembro</li>
                    <li>• Factores de retención clave</li>
                    <li>• Estrategias de intervención</li>
                    <li>• Timeline de seguimiento</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Progresión Espiritual:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Predicción de madurez espiritual</li>
                    <li>• Identificación de líderes potenciales</li>
                    <li>• Candidatos para ministerios</li>
                    <li>• Caminos de crecimiento personalizados</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Tendencias de Crecimiento:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Proyección de membresía</li>
                    <li>• Patrones estacionales</li>
                    <li>• Impacto de eventos/campañas</li>
                    <li>• Optimización de recursos</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Member Journey */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                3. Análisis de Jornada del Miembro
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Etapas del Ciclo de Vida:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Visitante:</strong> Primera impresión y seguimiento</li>
                    <li>• <strong>Asistente Regular:</strong> Integración y comunidad</li>
                    <li>• <strong>Miembro:</strong> Compromiso y participación</li>
                    <li>• <strong>Líder:</strong> Servicio y multiplicación</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Análisis IA:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Tiempo promedio en cada etapa</li>
                    <li>• Factores de progresión exitosa</li>
                    <li>• Puntos de fricción identificados</li>
                    <li>• Recomendaciones de intervención</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                4. Recomendaciones Estratégicas
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Recomendaciones Ministeriales:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Emparejamiento mentor-mentee</li>
                    <li>• Asignación de ministerios por dones</li>
                    <li>• Grupos pequeños óptimos</li>
                    <li>• Oportunidades de liderazgo</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Estrategias de Crecimiento:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Campañas de evangelismo dirigidas</li>
                    <li>• Programas de retención personalizados</li>
                    <li>• Iniciativas de compromiso comunitario</li>
                    <li>• Optimización de horarios de servicios</li>
                  </ul>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* AI Technology */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Tecnología de IA Implementada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Algoritmos de Machine Learning:</h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Decision Trees:</strong> Predicciones de retención</li>
                  <li>• <strong>Neural Networks:</strong> Análisis de patrones complejos</li>
                  <li>• <strong>Collaborative Filtering:</strong> Recomendaciones ministeriales</li>
                  <li>• <strong>Time Series Analysis:</strong> Proyecciones temporales</li>
                  <li>• <strong>Ensemble Methods:</strong> Combinación de múltiples modelos</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Precisión del Sistema:</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Predicción de retención:</span>
                    <Badge variant="secondary">90%+</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Progresión espiritual:</span>
                    <Badge variant="secondary">85%+</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Recomendaciones ministeriales:</span>
                    <Badge variant="secondary">88%+</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Análisis de tendencias:</span>
                    <Badge variant="secondary">92%+</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Tips */}
        <Card>
          <CardHeader>
            <CardTitle>💡 Mejores Prácticas de Uso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-600">✅ Recomendaciones:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Revisión semanal:</strong> Revise insights cada semana</li>
                  <li>• <strong>Actuar en alertas:</strong> Responda rápido a riesgos de retención</li>
                  <li>• <strong>Datos completos:</strong> Mantenga perfiles de miembros actualizados</li>
                  <li>• <strong>Seguimiento:</strong> Implemente recomendaciones gradualmmente</li>
                  <li>• <strong>Oración:</strong> Use insights como guía para intercesión</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-red-600">❌ Evitar:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Dependencia exclusiva:</strong> IA complementa, no reemplaza discernimiento</li>
                  <li>• <strong>Decisiones precipitadas:</strong> Confirme insights con oración</li>
                  <li>• <strong>Ignorar contexto:</strong> Considere circunstancias locales</li>
                  <li>• <strong>Datos obsoletos:</strong> Mantenga información actualizada</li>
                  <li>• <strong>Sobre-análisis:</strong> Balance entre datos y relaciones personales</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration */}
        <Card>
          <CardHeader>
            <CardTitle>🔗 Integración con Otros Sistemas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Las Analíticas Inteligentes se integran seamlessly con todos los módulos del sistema:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <Users className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <p className="font-medium text-sm">Gestión de Miembros</p>
                <p className="text-xs text-muted-foreground">Perfil IA por miembro</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <BarChart3 className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <p className="font-medium text-sm">Analíticas Generales</p>
                <p className="text-xs text-muted-foreground">Datos base para IA</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <Target className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                <p className="font-medium text-sm">Automatización</p>
                <p className="text-xs text-muted-foreground">Reglas inteligentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}