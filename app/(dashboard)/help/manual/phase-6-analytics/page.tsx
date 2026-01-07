'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, TrendingUp, Users, DollarSign, Calendar, Heart,
  Target, Star, CheckCircle, ArrowRight, Lightbulb, Download,
  Filter, Eye, RefreshCw, Bell, Sparkles, Award, Gift, LineChart,
  PieChart, Activity, Zap, Clock, MessageSquare, AlertTriangle
} from 'lucide-react'
import Link from 'next/link'

export default function Phase6AnalyticsGuide() {
  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-8 rounded-lg">
        <div className="flex items-center gap-4">
          <BarChart3 className="h-12 w-12" />
          <div>
            <h1 className="text-4xl font-bold mb-2">📊 Fase 6: Dashboard y Analíticas</h1>
            <p className="text-xl opacity-90">
              Entiende los datos de tu iglesia con gráficas y reportes
            </p>
          </div>
        </div>
        <div className="mt-6 flex gap-4 text-sm">
          <Badge variant="secondary" className="bg-white/20 text-white">
            <Target className="h-3 w-3 mr-1" />
            Fase 6 de 6 - ¡Última Fase!
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white">
            <Star className="h-3 w-3 mr-1" />
            10 minutos
          </Badge>
        </div>
      </div>

      {/* Para Niños */}
      <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
        <h4 className="font-bold text-yellow-900 flex items-center gap-2 mb-2">
          <Heart className="h-5 w-5" />
          Para Niños: ¿Qué son las &quot;Analíticas&quot;?
        </h4>
        <p className="text-sm text-yellow-800">
          Imagina que tienes una caja mágica que cuenta todo lo que pasa en tu iglesia: cuántas 
          personas vinieron hoy, cuántos niños hay, cuánto dinero se donó, qué eventos fueron los 
          más populares. Las analíticas son como gráficas de colores que te muestran toda esa 
          información de forma bonita y fácil de entender. ¡Es como tener rayos X de tu iglesia!
        </p>
      </div>

      {/* Dashboard Principal */}
      <Card className="border-blue-300">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              1
            </div>
            Tu Dashboard Principal (Página de Inicio)
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Lo primero que ves cuando entras - un resumen de TODO
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              ¿Dónde Está el Dashboard?
            </h4>
            <p className="text-sm mb-2">
              Cuando inicias sesión, la primera pantalla es tu Dashboard. También puedes llegar 
              haciendo clic en &quot;Inicio&quot; o el logo de Khesed-tek arriba a la izquierda.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: "👥 Tarjeta de Miembros",
                metrics: [
                  "Total de miembros registrados",
                  "Nuevos miembros este mes",
                  "Visitantes recientes",
                  "Distribución por etapa espiritual"
                ],
                color: "blue"
              },
              {
                title: "💰 Tarjeta de Finanzas",
                metrics: [
                  "Donaciones del mes actual",
                  "Comparación con mes anterior",
                  "Promedio de donación por persona",
                  "Gráfica de tendencia mensual"
                ],
                color: "green"
              },
              {
                title: "📅 Próximos Eventos",
                metrics: [
                  "Eventos de esta semana",
                  "Cantidad de inscritos",
                  "Eventos más populares",
                  "Check-ins recientes"
                ],
                color: "orange"
              },
              {
                title: "🙏 Peticiones de Oración",
                metrics: [
                  "Peticiones activas",
                  "Peticiones respondidas este mes",
                  "Categorías más comunes",
                  "Tasa de respuesta"
                ],
                color: "purple"
              },
              {
                title: "📊 Crecimiento General",
                metrics: [
                  "Tasa de crecimiento mensual",
                  "Comparación trimestral",
                  "Tendencia de asistencia",
                  "Proyección para próximo mes"
                ],
                color: "cyan"
              },
              {
                title: "⚡ Actividad Reciente",
                metrics: [
                  "Últimos miembros registrados",
                  "Donaciones recientes",
                  "Check-ins del día",
                  "Comunicaciones enviadas"
                ],
                color: "pink"
              }
            ].map((card, index) => (
              <Card key={index} className={`border-l-4 border-l-${card.color}-500 hover:shadow-lg transition-shadow`}>
                <CardContent className="pt-4">
                  <h4 className="font-semibold text-lg mb-3">{card.title}</h4>
                  <ul className="space-y-2 text-sm">
                    {card.metrics.map((metric, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{metric}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
            <h4 className="font-bold text-yellow-900 flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5" />
              Consejo de Experto
            </h4>
            <p className="text-sm text-yellow-800">
              Tu dashboard se actualiza en TIEMPO REAL. Si alguien se registra, hace una donación, 
              o se inscribe a un evento, verás los números cambiar automáticamente. ¡Es como magia! 
              No necesitas refrescar la página.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Analíticas Generales */}
      <Card className="border-green-300">
        <CardHeader className="bg-green-50">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              2
            </div>
            Analíticas Generales (Reportes Detallados)
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Información profunda sobre cada área de tu iglesia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">📍 Cómo Llegar:</h4>
              <p className="text-sm">
                En el menú izquierdo → <strong>Analíticas</strong> → <strong>Analíticas Generales</strong>
              </p>
            </div>

            {[
              {
                section: "👥 Analíticas de Miembros",
                icon: <Users className="h-6 w-6 text-blue-600" />,
                reports: [
                  {
                    name: "Crecimiento de Membresía",
                    description: "Gráfica de líneas mostrando crecimiento mes a mes",
                    useCase: "Ver si estamos creciendo o estancados"
                  },
                  {
                    name: "Distribución por Edad",
                    description: "Gráfica de pastel: cuántos niños, jóvenes, adultos, ancianos",
                    useCase: "Planear actividades apropiadas para cada edad"
                  },
                  {
                    name: "Distribución por Género",
                    description: "Porcentaje de hombres vs mujeres en la congregación",
                    useCase: "Balancear ministerios para hombres y mujeres"
                  },
                  {
                    name: "Mapa de Ubicación",
                    description: "Mapa con puntos donde viven los miembros",
                    useCase: "Organizar células geográficamente"
                  },
                  {
                    name: "Retención de Miembros",
                    description: "Cuántos miembros siguen activos vs inactivos",
                    useCase: "Identificar quiénes necesitan seguimiento"
                  }
                ]
              },
              {
                section: "💰 Analíticas Financieras",
                icon: <DollarSign className="h-6 w-6 text-green-600" />,
                reports: [
                  {
                    name: "Ingresos por Mes",
                    description: "Gráfica de barras de donaciones mensuales",
                    useCase: "Presupuestar y planear gastos"
                  },
                  {
                    name: "Métodos de Pago",
                    description: "Cuánto se recibió en efectivo, tarjeta, transferencia",
                    useCase: "Decidir qué métodos promover"
                  },
                  {
                    name: "Donadores Recurrentes",
                    description: "Quiénes donan mensualmente vs ocasionalmente",
                    useCase: "Agradecer a donadores fieles"
                  },
                  {
                    name: "Categorías de Gastos",
                    description: "En qué se gastó el dinero (ministerios, edificio, misiones)",
                    useCase: "Transparencia financiera"
                  },
                  {
                    name: "Proyección Anual",
                    description: "Estimado de ingresos totales para el año",
                    useCase: "Planear proyectos grandes (construcción, retiros)"
                  }
                ]
              },
              {
                section: "📅 Analíticas de Eventos",
                icon: <Calendar className="h-6 w-6 text-orange-600" />,
                reports: [
                  {
                    name: "Asistencia por Evento",
                    description: "Comparar cuánta gente vino a cada evento",
                    useCase: "Saber qué eventos son más populares"
                  },
                  {
                    name: "Tasa de Conversión",
                    description: "% de inscritos que realmente asistieron",
                    useCase: "Mejorar planificación de capacidad"
                  },
                  {
                    name: "Eventos Más Exitosos",
                    description: "Ranking de eventos por asistencia y satisfacción",
                    useCase: "Repetir eventos que funcionan"
                  },
                  {
                    name: "Frecuencia de Asistencia",
                    description: "Quiénes asisten a todo vs ocasionalmente",
                    useCase: "Identificar miembros comprometidos"
                  }
                ]
              }
            ].map((area, index) => (
              <Card key={index} className="border-l-4 border-l-green-500">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3 mb-4">
                    {area.icon}
                    <h4 className="font-semibold text-xl">{area.section}</h4>
                  </div>
                  <div className="space-y-3">
                    {area.reports.map((report, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded">
                        <p className="font-medium text-sm text-green-800 mb-1">
                          📊 {report.name}
                        </p>
                        <p className="text-xs text-gray-600 mb-1">{report.description}</p>
                        <p className="text-xs text-purple-600 italic">
                          💡 Para qué sirve: {report.useCase}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analíticas Inteligentes (AI) */}
      <Card className="border-purple-300">
        <CardHeader className="bg-purple-50">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Sparkles className="h-8 w-8 text-purple-600" />
            Analíticas Inteligentes (Con Inteligencia Artificial)
          </CardTitle>
          <CardDescription className="text-base mt-2">
            El sistema te da recomendaciones automáticas basadas en datos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
            <h4 className="font-bold text-yellow-900 flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5" />
              ¿Qué es la Inteligencia Artificial en Analíticas?
            </h4>
            <p className="text-sm text-yellow-800">
              Es como tener un asistente súper inteligente que mira todos los datos de tu iglesia 
              y te dice cosas como: &quot;Este miembro probablemente dejará de venir si no le contactas&quot;, 
              o &quot;Basado en tendencias, este mes recibirás $500,000 en donaciones&quot;. ¡El sistema 
              aprende solo y te avisa de problemas ANTES de que pasen!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                feature: "🎯 Predicción de Retención",
                description: "Te dice qué miembros están en riesgo de dejar la iglesia",
                example: "Juan no ha asistido en 3 semanas → Sistema sugiere: 'Contactar urgente'",
                icon: <TrendingUp className="h-6 w-6 text-red-600" />
              },
              {
                feature: "💎 Recomendaciones de Ministerios",
                description: "Sugiere en qué ministerio cada persona encajaría mejor",
                example: "María tiene don de enseñanza → Recomienda: 'Escuela Dominical'",
                icon: <Award className="h-6 w-6 text-yellow-600" />
              },
              {
                feature: "📈 Proyecciones Financieras",
                description: "Predice cuánto recibirás de donaciones próximo mes",
                example: "Basado en 6 meses de datos: 'Enero estimado: $650,000 ±15%'",
                icon: <LineChart className="h-6 w-6 text-green-600" />
              },
              {
                feature: "🚨 Alertas Proactivas",
                description: "Te avisa de problemas potenciales antes de que pasen",
                example: "Asistencia bajó 20% → Alerta: 'Revisar programación de cultos'",
                icon: <Bell className="h-6 w-6 text-orange-600" />
              },
              {
                feature: "🌱 Análisis de Crecimiento Espiritual",
                description: "Mide el progreso espiritual de cada miembro",
                example: "Pedro pasó de VISITANTE a CRECIMIENTO en 3 meses → '¡Excelente!'",
                icon: <Activity className="h-6 w-6 text-blue-600" />
              },
              {
                feature: "🎓 Sugerencias de Contenido",
                description: "Recomienda qué temas predicar según necesidades",
                example: "Muchos miembros en crisis financiera → 'Enseñar sobre mayordomía'",
                icon: <MessageSquare className="h-6 w-6 text-purple-600" />
              }
            ].map((feature, index) => (
              <Card key={index} className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3 mb-3">
                    {feature.icon}
                    <h4 className="font-semibold text-lg">{feature.feature}</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{feature.description}</p>
                  <div className="bg-purple-50 p-3 rounded">
                    <p className="text-xs font-medium text-purple-800 mb-1">💡 Ejemplo Real:</p>
                    <p className="text-xs text-purple-700 italic">{feature.example}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Cómo Acceder a las Analíticas Inteligentes
            </h4>
            <ol className="text-sm space-y-2 ml-4">
              <li>1. Menú izquierdo → <strong>Analíticas</strong></li>
              <li>2. Clic en <strong>Analíticas Inteligentes</strong></li>
              <li>3. Selecciona el módulo que quieres ver (Retención, Predicciones, etc.)</li>
              <li>4. Lee las recomendaciones del sistema</li>
              <li>5. Toma acción según las sugerencias</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Exportar Reportes */}
      <Card className="border-teal-300">
        <CardHeader className="bg-teal-50">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Download className="h-6 w-6" />
            Exportar y Compartir Reportes
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Descarga gráficas y tablas para presentaciones o reuniones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                format: "PDF Ejecutivo",
                icon: "📄",
                description: "Reporte profesional con gráficas para imprimir",
                best: "Presentaciones a la junta directiva, reuniones anuales",
                includes: ["Logo de la iglesia", "Gráficas en color", "Resumen ejecutivo", "Firma digital"]
              },
              {
                format: "Excel Avanzado",
                icon: "📊",
                description: "Hojas de cálculo con todos los datos crudos",
                best: "Análisis profundo, crear tus propias gráficas",
                includes: ["Múltiples pestañas", "Filtros automáticos", "Fórmulas", "Tablas dinámicas"]
              },
              {
                format: "CSV Estructurado",
                icon: "📋",
                description: "Datos en texto plano, compatible con todo",
                best: "Importar a otros sistemas, respaldos",
                includes: ["Formato universal", "Ligero", "Compatible", "Fácil de leer"]
              }
            ].map((format, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="text-5xl mb-3">{format.icon}</div>
                  <h4 className="font-semibold text-lg mb-2">{format.format}</h4>
                  <p className="text-sm text-gray-600 mb-3">{format.description}</p>
                  <div className="bg-teal-50 p-3 rounded text-xs text-left">
                    <p className="font-medium text-teal-800 mb-2">✅ Mejor Para:</p>
                    <p className="text-teal-700 mb-2">{format.best}</p>
                    <p className="font-medium text-teal-800 mb-1">Incluye:</p>
                    <ul className="space-y-1 text-teal-700">
                      {format.includes.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Download className="h-5 w-5 text-green-600" />
              Pasos para Exportar Reportes
            </h4>
            <ol className="text-sm space-y-2 ml-4">
              <li>1. Ve a la sección de Analíticas que quieres exportar</li>
              <li>2. Haz clic en el botón <strong>&quot;Exportar&quot;</strong> (arriba a la derecha)</li>
              <li>3. Selecciona el formato (PDF, Excel, o CSV)</li>
              <li>4. Elige el rango de fechas (último mes, trimestre, año)</li>
              <li>5. Haz clic en <strong>&quot;Descargar Reporte&quot;</strong></li>
              <li>6. ¡El archivo se descargará a tu computadora!</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Personalizar Dashboard */}
      <Card className="border-pink-300">
        <CardHeader className="bg-pink-50">
          <CardTitle className="flex items-center gap-3 text-xl">
            <RefreshCw className="h-6 w-6" />
            Personalizar Tu Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <p className="text-sm text-gray-700">
            Puedes decidir qué tarjetas ver y en qué orden. ¡Hazlo tu dashboard ideal!
          </p>

          <div className="space-y-3">
            <div className="bg-pink-50 p-3 rounded">
              <h5 className="font-medium text-sm mb-2">🎨 Cómo Personalizar:</h5>
              <ul className="text-xs space-y-1 ml-4">
                <li>1. En tu Dashboard, haz clic en el botón ⚙️ &quot;Personalizar&quot; (arriba a la derecha)</li>
                <li>2. Arrastra las tarjetas para cambiar el orden</li>
                <li>3. Marca/desmarca casillas para mostrar u ocultar tarjetas</li>
                <li>4. Haz clic en &quot;Guardar Configuración&quot;</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-3 text-xs">
              <div className="bg-green-50 p-3 rounded">
                <p className="font-medium text-green-800 mb-1">✅ Ideas de Personalización:</p>
                <ul className="space-y-1 text-green-700">
                  <li>• Si eres pastor: Prioriza miembros y eventos</li>
                  <li>• Si eres tesorero: Finanzas arriba</li>
                  <li>• Si lideras jóvenes: Solo ver jóvenes</li>
                  <li>• Oculta tarjetas que no usas</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <p className="font-medium text-blue-800 mb-1">💡 Consejo:</p>
                <p className="text-blue-700">
                  Tu personalización se guarda automáticamente. La próxima vez que entres, 
                  verás TU dashboard personalizado, no el de otros usuarios.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card className="border-red-300 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-900">
            <AlertTriangle className="h-6 w-6" />
            Problemas Comunes con Analíticas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              problem: "❌ Los números no se actualizan / están desactualizados",
              solutions: [
                "Espera 5-10 segundos - el sistema actualiza cada pocos segundos",
                "Refresca la página (F5 o botón de recargar del navegador)",
                "Verifica que tu conexión a internet esté funcionando",
                "Si persiste, cierra sesión y vuelve a entrar"
              ]
            },
            {
              problem: "❌ Las gráficas no se muestran / salen en blanco",
              solutions: [
                "Verifica que tengas datos en ese rango de fechas",
                "Cambia el filtro de fechas (por ejemplo, últimos 6 meses en vez de último mes)",
                "Intenta con otro navegador (Chrome funciona mejor)",
                "Desactiva bloqueadores de anuncios (pueden bloquear gráficas)"
              ]
            },
            {
              problem: "❌ No puedo exportar reportes (botón no funciona)",
              solutions: [
                "Verifica que tienes permiso de ADMIN o PASTOR",
                "Asegúrate que seleccionaste un rango de fechas",
                "Intenta descargar en formato PDF primero (es más ligero)",
                "Si el reporte es muy grande (1000+ registros), divide en meses"
              ]
            },
            {
              problem: "❌ Las predicciones de IA parecen incorrectas",
              solutions: [
                "La IA necesita mínimo 3 meses de datos para ser precisa",
                "Verifica que los datos ingresados sean correctos",
                "Las predicciones mejoran con el tiempo - sé paciente",
                "Si ves algo muy raro, reporta al soporte técnico"
              ]
            }
          ].map((item, index) => (
            <div key={index} className="bg-white p-4 rounded border border-red-200">
              <p className="font-medium text-red-800 mb-2">{item.problem}</p>
              <ul className="text-sm text-red-700 space-y-1 ml-4">
                {item.solutions.map((solution, idx) => (
                  <li key={idx}>✓ {solution}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Completion Badge */}
      <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-4 border-green-400">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl text-green-900">
            <Gift className="h-10 w-10" />
            ¡Felicidades! Completaste el Onboarding
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-6">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">
              ¡Ya Sabes Usar Khesed-tek!
            </h3>
            <p className="text-gray-700 mb-6">
              Completaste las 6 fases del onboarding. Ahora estás listo para administrar 
              tu iglesia como un profesional.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { phase: "Fase 1", name: "Cuenta Creada", icon: "✅" },
              { phase: "Fase 2", name: "Iglesia Configurada", icon: "✅" },
              { phase: "Fase 3", name: "Miembros Agregados", icon: "✅" },
              { phase: "Fase 4", name: "Eventos Creados", icon: "✅" },
              { phase: "Fase 5", name: "Comunicaciones Enviadas", icon: "✅" },
              { phase: "Fase 6", name: "Analíticas Dominadas", icon: "✅" }
            ].map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="font-semibold text-sm">{item.phase}</p>
                <p className="text-xs text-gray-600">{item.name}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mt-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-600" />
              Próximos Pasos Recomendados
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Explora las funciones avanzadas:</strong> Voluntarios, Sermons, Website Builder, Marketing
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Configura automatizaciones:</strong> Emails automáticos, recordatorios, seguimientos
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Invita a tu equipo:</strong> Agrega pastores, líderes, y voluntarios al sistema
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Revisa la guía completa de funciones:</strong> 70+ funciones disponibles
                </div>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Link href="/help/manual/phase-5-communications">
          <Button variant="outline" size="lg">
            <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
            Fase Anterior: Comunicaciones
          </Button>
        </Link>
        <Link href="/help/manual/all-features">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            Ver Todas las Funciones (70+)
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
