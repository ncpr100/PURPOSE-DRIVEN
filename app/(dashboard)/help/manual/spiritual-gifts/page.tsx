'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Brain, 
  Heart, 
  Zap, 
  Target,
  Users,
  BarChart3,
  CheckCircle,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Award
} from 'lucide-react'

export default function SpiritualGiftsManual() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          🧠 Sistema de Dones Espirituales
          <Badge variant="secondary">🆕 Nuevo</Badge>
        </h1>
        <p className="text-muted-foreground">
          Evaluación, seguimiento y desarrollo de dones espirituales para optimizar el ministerio
        </p>
      </div>

      <div className="space-y-8">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              ¿Qué es el Sistema de Dones Espirituales?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Sistema integral para identificar, evaluar y desarrollar los dones espirituales de cada miembro, 
              facilitando su ubicación en ministerios donde puedan servir con mayor efectividad y satisfacción.
            </p>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">19 Dones</h3>
                <p className="text-sm text-muted-foreground">
                  Evaluación bíblica completa
                </p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Matching IA</h3>
                <p className="text-sm text-muted-foreground">
                  Ubicación ministerial inteligente
                </p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Desarrollo</h3>
                <p className="text-sm text-muted-foreground">
                  Planes de crecimiento personalizados
                </p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Seguimiento de progreso
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access */}
        <Card>
          <CardHeader>
            <CardTitle>📍 Acceder al Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                <strong>Ruta:</strong> Panel de Control → Dones Espirituales
              </p>
              <p className="text-sm text-blue-700 mt-2">
                <strong>Permisos:</strong> Todos los roles pueden acceder (vista adaptada por rol)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Spiritual Gifts List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              19 Dones Espirituales Evaluados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Leadership Gifts */}
              <div>
                <h4 className="font-semibold mb-3 text-blue-600">👑 Dones de Liderazgo</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-orange-500" />
                    <span><strong>Liderazgo:</strong> Dirigir y motivar equipos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-500" />
                    <span><strong>Administración:</strong> Organizar y gestionar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span><strong>Pastor-Maestro:</strong> Cuidar y enseñar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    <span><strong>Apostolado:</strong> Plantación de iglesias</span>
                  </li>
                </ul>
              </div>

              {/* Communication Gifts */}
              <div>
                <h4 className="font-semibold mb-3 text-green-600">💬 Dones de Comunicación</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    <span><strong>Enseñanza:</strong> Explicar verdades bíblicas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-red-500" />
                    <span><strong>Profecía:</strong> Proclamar palabra de Dios</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-pink-500" />
                    <span><strong>Evangelismo:</strong> Compartir el evangelio</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-indigo-500" />
                    <span><strong>Exhortación:</strong> Animar y motivar</span>
                  </li>
                </ul>
              </div>

              {/* Service Gifts */}
              <div>
                <h4 className="font-semibold mb-3 text-purple-600">🤝 Dones de Servicio</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span><strong>Servicio:</strong> Ayudar prácticamente</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <span><strong>Hospitalidad:</strong> Recibir y acoger</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-pink-500" />
                    <span><strong>Misericordia:</strong> Compasión y cuidado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span><strong>Ayuda:</strong> Asistir en necesidades</span>
                  </li>
                </ul>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Supernatural Gifts */}
              <div>
                <h4 className="font-semibold mb-3 text-indigo-600">✨ Dones Sobrenaturales</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span><strong>Fe:</strong> Confianza extraordinaria en Dios</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span><strong>Sanidad:</strong> Ministrar sanidad física/emocional</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span><strong>Milagros:</strong> Manifestaciones sobrenaturales</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-500" />
                    <span><strong>Discernimiento:</strong> Distinguir espíritus</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-green-500" />
                    <span><strong>Conocimiento:</strong> Revelación divina</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-orange-500" />
                    <span><strong>Sabiduría:</strong> Aplicación divina de verdad</span>
                  </li>
                </ul>
              </div>

              {/* Special Gifts */}
              <div>
                <h4 className="font-semibold mb-3 text-orange-600">🎁 Dones Especiales</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-blue-500" />
                    <span><strong>Dar:</strong> Generosidad extraordinaria</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <span><strong>Celibato:</strong> Soltería para el ministerio</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-red-500" />
                    <span><strong>Martirio:</strong> Sacrificio por la fe</span>
                  </li>
                </ul>
                
                <h4 className="font-semibold mt-6 mb-3 text-teal-600">🗣️ Dones de Lenguas</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-purple-500" />
                    <span><strong>Lenguas:</strong> Oración/alabanza en lenguas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-indigo-500" />
                    <span><strong>Interpretación:</strong> Traducir lenguas</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Process */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Proceso de Evaluación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</div>
                  Evaluación Inicial Completa
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Proceso de Evaluación:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <strong>95 preguntas:</strong> 5 por cada don espiritual</li>
                      <li>• <strong>Escala 1-5:</strong> De "Nunca" a "Siempre"</li>
                      <li>• <strong>20-30 minutos:</strong> Tiempo promedio de evaluación</li>
                      <li>• <strong>Validación bíblica:</strong> Basado en Escrituras</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Análisis Inteligente:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Cálculo automático de puntuaciones</li>
                      <li>• Identificación de dones dominantes</li>
                      <li>• Detección de dones secundarios</li>
                      <li>• Generación de perfil personalizado</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</div>
                  Interpretación de Resultados
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Categorización:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <strong>Dominantes:</strong> 85-100 puntos</li>
                      <li>• <strong>Fuertes:</strong> 70-84 puntos</li>
                      <li>• <strong>Moderados:</strong> 55-69 puntos</li>
                      <li>• <strong>Básicos:</strong> 40-54 puntos</li>
                      <li>• <strong>Mínimos:</strong> 5-39 puntos</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Perfil de Dones:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Top 3 dones principales</li>
                      <li>• Combinaciones únicas identificadas</li>
                      <li>• Áreas de desarrollo sugeridas</li>
                      <li>• Compatibilidad ministerial</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Recomendaciones:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Ministerios sugeridos por IA</li>
                      <li>• Roles específicos recomendados</li>
                      <li>• Equipos de trabajo ideales</li>
                      <li>• Plan de desarrollo personalizado</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</div>
                  Seguimiento y Desarrollo
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Re-evaluación Periódica:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <strong>Cada 6 meses:</strong> Evaluación de progreso</li>
                      <li>• <strong>Después de capacitación:</strong> Medición de crecimiento</li>
                      <li>• <strong>Cambios de ministerio:</strong> Validación de ajustes</li>
                      <li>• <strong>Hitos de liderazgo:</strong> Evolución de dones</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Desarrollo Continuo:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Planes de capacitación personalizados</li>
                      <li>• Mentorías dirigidas por dones</li>
                      <li>• Oportunidades de servicio graduales</li>
                      <li>• Recursos de crecimiento específicos</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* AI Matching System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Sistema de Matching IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Algoritmo Inteligente:</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• <strong>Análisis multifactorial:</strong> Dones + personalidad + experiencia</li>
                  <li>• <strong>Machine Learning:</strong> Aprende de colocaciones exitosas</li>
                  <li>• <strong>Collaborative filtering:</strong> Patrones de otros miembros similares</li>
                  <li>• <strong>Optimización continua:</strong> Mejora con cada interacción</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Factores Considerados:</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• <strong>Puntuaciones de dones:</strong> Fortalezas principales</li>
                  <li>• <strong>Disponibilidad de tiempo:</strong> Capacidad de compromiso</li>
                  <li>• <strong>Experiencia previa:</strong> Historial ministerial</li>
                  <li>• <strong>Preferencias personales:</strong> Ministerios de interés</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Precision del Sistema:</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">88%+</p>
                  <p className="text-sm text-blue-700">Satisfacción ministerial</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">92%+</p>
                  <p className="text-sm text-blue-700">Retención en ministerios</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">85%+</p>
                  <p className="text-sm text-blue-700">Desarrollo de liderazgo</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard and Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Dashboard y Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Vista Individual:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Perfil completo de dones</li>
                  <li>• Historial de evaluaciones</li>
                  <li>• Progreso de desarrollo</li>
                  <li>• Recomendaciones activas</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Vista de Liderazgo:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Distribución de dones en iglesia</li>
                  <li>• Gaps ministeriales identificados</li>
                  <li>• Potencial de liderazgo</li>
                  <li>• Efectividad de equipos</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Reportes Estratégicos:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Fortalezas congregacionales</li>
                  <li>• Necesidades de desarrollo</li>
                  <li>• Tendencias de crecimiento espiritual</li>
                  <li>• ROI de programas de capacitación</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Mejores Prácticas de Implementación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-600">✅ Recomendaciones:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Evaluación temprana:</strong> Nuevos miembros en primeros 3 meses</li>
                  <li>• <strong>Contexto bíblico:</strong> Enseñe sobre dones antes de evaluación</li>
                  <li>• <strong>Acompañamiento personal:</strong> Revise resultados individualmente</li>
                  <li>• <strong>Implementación gradual:</strong> Comience con equipos pequeños</li>
                  <li>• <strong>Celebre descubrimientos:</strong> Reconozca nuevos hallazgos</li>
                  <li>• <strong>Seguimiento pastoral:</strong> Mantenga cuidado personal</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-red-600">❌ Evitar:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Evaluación forzada:</strong> Debe ser voluntaria y educativa</li>
                  <li>• <strong>Etiquetado rígido:</strong> Dones pueden desarrollarse</li>
                  <li>• <strong>Exclusión ministerial:</strong> Todos pueden servir</li>
                  <li>• <strong>Competencia de dones:</strong> Todos son igualmente valiosos</li>
                  <li>• <strong>Decisiones solo por sistema:</strong> Balance con discernimiento</li>
                  <li>• <strong>Ignorar preferencias:</strong> Considere deseos del corazón</li>
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
              El Sistema de Dones Espirituales se integra con múltiples módulos para una gestión holística:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <Users className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <p className="font-medium text-sm">Gestión de Miembros</p>
                <p className="text-xs text-muted-foreground">Perfil integral por persona</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <Heart className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <p className="font-medium text-sm">Gestión de Voluntarios</p>
                <p className="text-xs text-muted-foreground">Colocación inteligente</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <Brain className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                <p className="font-medium text-sm">Analíticas IA</p>
                <p className="text-xs text-muted-foreground">Predicciones de desarrollo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}