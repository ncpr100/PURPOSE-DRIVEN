'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, BookOpen, BarChart3, Users, Target, Heart, TrendingUp, Eye, CheckCircle, AlertTriangle } from "lucide-react"
import Link from 'next/link'

export default function AnalyticsPastoralInsightsPage() {
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
          <h1 className="text-3xl font-bold">Manual: Analíticas y Perspectivas Pastorales</h1>
          <p className="text-muted-foreground">Sistema mejorado de reportes y análisis ministerial</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Analíticas y Perspectivas Pastorales - Manual Completo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Esta nueva sección combina métricas operacionales diarias con análisis estratégico a largo plazo para la toma de decisiones ministeriales informadas.
            </p>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-[hsl(var(--info)/0.10)] rounded-lg">
                <h4 className="font-semibold">📋 Tabs</h4>
                <p className="text-xl font-bold text-[hsl(var(--info))]">2</p>
              </div>
              <div className="text-center p-3 bg-[hsl(var(--success)/0.10)] rounded-lg">
                <h4 className="font-semibold">⏱️ Tiempo</h4>
                <p className="text-xl font-bold text-[hsl(var(--success))]">25 min</p>
              </div>
              <div className="text-center p-3 bg-[hsl(var(--lavender)/0.10)] rounded-lg">
                <h4 className="font-semibold">🎯 Nivel</h4>
                <p className="text-lg font-bold text-[hsl(var(--lavender))]">Avanzado</p>
              </div>
              <div className="text-center p-3 bg-[hsl(var(--warning)/0.10)] rounded-lg">
                <h4 className="font-semibold">👤 Rol Mínimo</h4>
                <p className="text-lg font-bold text-[hsl(var(--warning))]">PASTOR</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab 1: Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--info)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              Tab &quot;Analíticas Ministeriales&quot; - Métricas Operacionales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">📈 Métricas Diarias</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>1.1.</strong> Acceda a <code>Analíticas → Tab &quot;Analíticas Ministeriales&quot;</code></p>
                  <p><strong>1.2.</strong> Métricas disponibles en tiempo real:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>Miembros Activos:</strong> Total y crecimiento</li>
                    <li>• <strong>Asistencia Promedio:</strong> Por evento/servicio</li>
                    <li>• <strong>Nuevos Visitantes:</strong> Primeras visitas esta semana</li>
                    <li>• <strong>Donaciones:</strong> Total y tendencia</li>
                    <li>• <strong>Eventos:</strong> Participación y feedback</li>
                    <li>• <strong>Ministerios:</strong> Actividad por grupo</li>
                  </ul>
                  <p><strong>1.3.</strong> Acciones Rápidas disponibles:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>&quot;📊 Exportar Excel&quot;:</strong> Reporte completo</li>
                    <li>• <strong>&quot;📋 Exportar CSV&quot;:</strong> Datos para análisis</li>
                    <li>• <strong>&quot;📄 Exportar JSON&quot;:</strong> Datos técnicos</li>
                  </ul>
                </div>
              </div>
              <div className="bg-[hsl(var(--info)/0.10)] p-4 rounded-lg">
                <h4 className="font-semibold mb-2">⚡ Funciones de las Acciones Rápidas</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Exportar Excel:</strong> Incluye gráficos y formateo</li>
                  <li>• <strong>Exportar CSV:</strong> Datos puros para hojas de cálculo</li>
                  <li>• <strong>Exportar JSON:</strong> Para desarrolladores/sistemas externos</li>
                  <li>• <strong>Todos funcionalmente completos:</strong> Datos reales, no demos</li>
                </ul>
                <div className="mt-3 p-2 bg-white rounded border-l-4 border-[hsl(var(--info)/0.5)]">
                  <p className="text-xs"><strong>🔄 Actualización:</strong> Los datos se actualizan cada 5 minutos automáticamente</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab 2: Pastoral Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--lavender)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
              Tab &quot;Perspectivas Pastorales&quot; - Análisis Estratégico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">🎯 Análisis a Largo Plazo</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>2.1.</strong> Cambie al tab <code>&quot;Perspectivas Pastorales&quot;</code></p>
                  <p><strong>2.2.</strong> Análisis disponibles:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>Engagement Score:</strong> Puntuación 0-100 de participación</li>
                    <li>• <strong>Retención de Visitantes:</strong> % que regresa después de primera visita</li>
                    <li>• <strong>Efectividad de Seguimiento:</strong> Éxito de automatizaciones</li>
                    <li>• <strong>KPIs Ministeriales:</strong> Métricas específicas de iglesia</li>
                    <li>• <strong>Análisis de Compromiso:</strong> Niveles de participación</li>
                    <li>• <strong>Proyecciones de Crecimiento:</strong> Tendencias futuras</li>
                  </ul>
                  <p><strong>2.3.</strong> Filtros de análisis:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Último mes, trimestre, año</li>
                    <li>• Comparación con períodos anteriores</li>
                    <li>• Segmentación por demografía</li>
                  </ul>
                </div>
              </div>
              <div className="bg-[hsl(var(--lavender)/0.10)] p-4 rounded-lg">
                <h4 className="font-semibold mb-2">🎯 KPIs Ministeriales Clave</h4>
                <div className="text-sm space-y-2">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <p className="font-semibold">📊 Engagement Score</p>
                      <p className="text-muted-foreground">Participación general (0-100)</p>
                    </div>
                    <div>
                      <p className="font-semibold">🔄 Tasa de Retención</p>
                      <p className="text-muted-foreground">% visitantes que regresan</p>
                    </div>
                    <div>
                      <p className="font-semibold">⚡ Automatización Exitosa</p>
                      <p className="text-muted-foreground">% seguimientos completados</p>
                    </div>
                    <div>
                      <p className="font-semibold">🏛️ Participación Ministerial</p>
                      <p className="text-muted-foreground">% miembros en ministerios</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interpretation Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--success)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
              Interpretación de Métricas Clave
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {/* Engagement Score */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-[hsl(var(--info))]" />
                  <h4 className="font-medium">Puntuación de Engagement</h4>
                  <Badge variant="outline">0-100</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Mide el nivel de participación general de la congregación en actividades y servicios.
                </p>
                <div className="grid md:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-[hsl(var(--destructive)/0.10)]0 rounded-full"></div>
                    <span>0-40: Necesita atención inmediata</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-[hsl(var(--warning)/0.10)]0 rounded-full"></div>
                    <span>40-70: Bueno, con oportunidades</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-[hsl(var(--success)/0.10)]0 rounded-full"></div>
                    <span>70+: Excelente participación</span>
                  </div>
                </div>
              </div>

              {/* Automation Success */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-[hsl(var(--success))]" />
                  <h4 className="font-medium">Tasa de Éxito de Automatización</h4>
                  <Badge variant="outline">%</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Porcentaje de seguimientos automáticos exitosos con visitantes y miembros nuevos.
                </p>
                <div className="grid md:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="font-medium">💡 Insight Pastoral:</div>
                    <div>Una tasa baja indica necesidad de personalizar mensajes o mejorar tiempos de contacto.</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium">🎯 Acción Recomendada:</div>
                    <div>Revisar plantillas de comunicación y ajustar frecuencia de seguimiento.</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pastoral Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Acciones Pastorales Basadas en Datos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-[hsl(var(--success))]">✅ Indicadores Positivos</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[hsl(var(--success))] mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">Engagement Score &gt; 70</div>
                        <div className="text-xs text-muted-foreground">Congregación activamente involucrada</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[hsl(var(--success))] mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">Automatización &gt; 80%</div>
                        <div className="text-xs text-muted-foreground">Sistema de seguimiento efectivo</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[hsl(var(--success))] mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">Visitantes recurrentes ↑</div>
                        <div className="text-xs text-muted-foreground">Buena retención de nuevas personas</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-[hsl(var(--warning))]">⚠️ Áreas de Atención</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-[hsl(var(--warning))] mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">Engagement Score &lt; 50</div>
                        <div className="text-xs text-muted-foreground">Revisar programas y servicios</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-[hsl(var(--warning))] mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">Automatización &lt; 60%</div>
                        <div className="text-xs text-muted-foreground">Mejorar flujos de seguimiento</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-[hsl(var(--warning))] mt-0.5" />
                      <div>
                        <div className="text-sm font-medium">Pocos visitantes nuevos</div>
                        <div className="text-xs text-muted-foreground">Intensificar esfuerzos evangelísticos</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card className="bg-gradient-to-r from-primary/20 to-primary/10 border-[hsl(var(--info)/0.3)]">
          <CardHeader>
            <CardTitle className="text-[hsl(var(--info))]">📋 Mejores Prácticas para Líderes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-[hsl(var(--info))]">📊 Monitoreo Regular</h4>
                <ul className="text-sm text-[hsl(var(--info))] space-y-1">
                  <li>• Revisar métricas semanalmente los lunes</li>
                  <li>• Identificar tendencias mensuales en reuniones de liderazgo</li>
                  <li>• Comparar con períodos anteriores para contexto</li>
                  <li>• Establecer metas basadas en datos históricos</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-[hsl(var(--info))]">🎯 Acciones Específicas</h4>
                <ul className="text-sm text-[hsl(var(--info))] space-y-1">
                  <li>• Personalizar seguimientos según engagement score</li>
                  <li>• Ajustar programas basado en participación</li>
                  <li>• Celebrar y replicar éxitos medibles</li>
                  <li>• Intervenir proactivamente cuando métricas bajan</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Reference */}
        <Card>
          <CardHeader>
            <CardTitle>⚡ Referencia Rápida de Botones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">📊 Tab &quot;Analíticas Ministeriales&quot;</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>&quot;📊 Exportar Excel&quot;:</strong> Reporte con gráficos</li>
                  <li>• <strong>&quot;📋 Exportar CSV&quot;:</strong> Datos para análisis</li>
                  <li>• <strong>&quot;📄 Exportar JSON&quot;:</strong> Integración técnica</li>
                  <li>• <strong>&quot;🔄 Actualizar&quot;:</strong> Refrescar datos</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🎯 Tab &quot;Perspectivas Pastorales&quot;</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>&quot;📈 Ver Tendencias&quot;:</strong> Análisis histórico</li>
                  <li>• <strong>&quot;🎯 Configurar KPIs&quot;:</strong> Metas ministeriales</li>
                  <li>• <strong>&quot;📊 Proyecciones&quot;:</strong> Crecimiento estimado</li>
                  <li>• <strong>&quot;💡 Recomendaciones&quot;:</strong> Acciones sugeridas</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}