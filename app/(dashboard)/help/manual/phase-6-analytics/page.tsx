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
      <div className="bg-[hsl(var(--info))] text-foreground p-8 rounded-lg">
        <div className="flex items-center gap-4">
          <BarChart3 className="h-12 w-12" />
          <div>
            <h1 className="text-4xl font-bold mb-2"> Fase 6: Dashboard y Analiticas</h1>
            <p className="text-xl opacity-90">
              Entiende los datos de tu iglesia con grÒficas y reportes
            </p>
          </div>
        </div>
        <div className="mt-6 flex gap-4 text-sm">
          <Badge variant="secondary" className="bg-[hsl(var(--card))]/20 text-white">
            <Target className="h-3 w-3 mr-1" />
            Fase 6 de 6 - Òšltima Fase!
          </Badge>
          <Badge variant="secondary" className="bg-[hsl(var(--card))]/20 text-white">
            <Star className="h-3 w-3 mr-1" />
            10 minutos
          </Badge>
        </div>
      </div>

      {/* Para Ninos */}
      <div className="bg-[hsl(var(--warning)/0.10)] p-4 rounded-lg border-2 border-[hsl(var(--warning)/0.4)]">
        <h4 className="font-bold text-[hsl(var(--warning))] flex items-center gap-2 mb-2">
          <Heart className="h-5 w-5" />
          Para Ninos: Que son las &quot;Analiticas&quot;?
        </h4>
        <p className="text-sm text-[hsl(var(--warning))]">
          Imagina que tienes una caja mÒgica que cuenta todo lo que pasa en tu iglesia: cuÒntas 
          personas vinieron hoy, cuÒntos ninos hay, cuÒnto dinero se dono, que eventos fueron los 
          mÒs populares. Las analiticas son como grÒficas de colores que te muestran toda esa 
          informacion de forma bonita y fÒcil de entender. Es como tener rayos X de tu iglesia!
        </p>
      </div>

      {/* Dashboard Principal */}
      <Card className="border-[hsl(var(--info)/0.4)]">
        <CardHeader className="bg-[hsl(var(--info)/0.10)]">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="bg-[hsl(var(--info))] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              1
            </div>
            Tu Dashboard Principal (PÒgina de Inicio)
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Lo primero que ves cuando entras - un resumen de TODO
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="bg-[hsl(var(--info)/0.10)] p-4 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Eye className="h-5 w-5 text-[hsl(var(--info))]" />
              Donde EstÒ el Dashboard?
            </h4>
            <p className="text-sm mb-2">
              Cuando inicias sesion, la primera pantalla es tu Dashboard. Tambien puedes llegar 
              haciendo clic en &quot;Inicio&quot; o el logo de Khesed-tek arriba a la izquierda.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: " Tarjeta de Miembros",
                metrics: [
                  "Total de miembros registrados",
                  "Nuevos miembros este mes",
                  "Visitantes recientes",
                  "Distribucion por etapa espiritual"
                ],
                color: "blue"
              },
              {
                title: " Tarjeta de Finanzas",
                metrics: [
                  "Donaciones del mes actual",
                  "Comparacion con mes anterior",
                  "Promedio de donacion por persona",
                  "GrÒfica de tendencia mensual"
                ],
                color: "green"
              },
              {
                title: " Proximos Eventos",
                metrics: [
                  "Eventos de esta semana",
                  "Cantidad de inscritos",
                  "Eventos mÒs populares",
                  "Check-ins recientes"
                ],
                color: "orange"
              },
              {
                title: " Peticiones de Oracion",
                metrics: [
                  "Peticiones activas",
                  "Peticiones respondidas este mes",
                  "Categorias mÒs comunes",
                  "Tasa de respuesta"
                ],
                color: "purple"
              },
              {
                title: " Crecimiento General",
                metrics: [
                  "Tasa de crecimiento mensual",
                  "Comparacion trimestral",
                  "Tendencia de asistencia",
                  "Proyeccion para proximo mes"
                ],
                color: "cyan"
              },
              {
                title: " Actividad Reciente",
                metrics: [
                  "Òšltimos miembros registrados",
                  "Donaciones recientes",
                  "Check-ins del dia",
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
                        <CheckCircle className="h-4 w-4 text-[hsl(var(--success))] mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{metric}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-[hsl(var(--warning)/0.10)] p-4 rounded-lg border-2 border-[hsl(var(--warning)/0.4)]">
            <h4 className="font-bold text-[hsl(var(--warning))] flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5" />
              Consejo de Experto
            </h4>
            <p className="text-sm text-[hsl(var(--warning))]">
              Tu dashboard se actualiza en TIEMPO REAL. Si alguien se registra, hace una donacion, 
              o se inscribe a un evento, verÒs los numeros cambiar automÒticamente. Es como magia! 
              No necesitas refrescar la pÒgina.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Analiticas Generales */}
      <Card className="border-[hsl(var(--success)/0.4)]">
        <CardHeader className="bg-[hsl(var(--success)/0.10)]">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="bg-[hsl(var(--success))] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              2
            </div>
            Analiticas Generales (Reportes Detallados)
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Informacion profunda sobre cada Òrea de tu iglesia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="bg-[hsl(var(--success)/0.10)] p-4 rounded-lg">
              <h4 className="font-semibold mb-2"> Como Llegar:</h4>
              <p className="text-sm">
                En el menu izquierdo  -  <strong>Analiticas</strong>  -  <strong>Analiticas Generales</strong>
              </p>
            </div>

            {[
              {
                section: " Analiticas de Miembros",
                icon: <Users className="h-6 w-6 text-[hsl(var(--info))]" />,
                reports: [
                  {
                    name: "Crecimiento de Membresia",
                    description: "GrÒfica de lineas mostrando crecimiento mes a mes",
                    useCase: "Ver si estamos creciendo o estancados"
                  },
                  {
                    name: "Distribucion por Edad",
                    description: "GrÒfica de pastel: cuÒntos ninos, jovenes, adultos, ancianos",
                    useCase: "Planear actividades apropiadas para cada edad"
                  },
                  {
                    name: "Distribucion por Genero",
                    description: "Porcentaje de hombres vs mujeres en la congregacion",
                    useCase: "Balancear ministerios para hombres y mujeres"
                  },
                  {
                    name: "Mapa de Ubicacion",
                    description: "Mapa con puntos donde viven los miembros",
                    useCase: "Organizar celulas geogrÒficamente"
                  },
                  {
                    name: "Retencion de Miembros",
                    description: "CuÒntos miembros siguen activos vs inactivos",
                    useCase: "Identificar quienes necesitan seguimiento"
                  }
                ]
              },
              {
                section: " Analiticas Financieras",
                icon: <DollarSign className="h-6 w-6 text-[hsl(var(--success))]" />,
                reports: [
                  {
                    name: "Ingresos por Mes",
                    description: "GrÒfica de barras de donaciones mensuales",
                    useCase: "Presupuestar y planear gastos"
                  },
                  {
                    name: "Metodos de Pago",
                    description: "CuÒnto se recibio en efectivo, tarjeta, transferencia",
                    useCase: "Decidir que metodos promover"
                  },
                  {
                    name: "Donadores Recurrentes",
                    description: "Quienes donan mensualmente vs ocasionalmente",
                    useCase: "Agradecer a donadores fieles"
                  },
                  {
                    name: "Categorias de Gastos",
                    description: "En que se gasto el dinero (ministerios, edificio, misiones)",
                    useCase: "Transparencia financiera"
                  },
                  {
                    name: "Proyeccion Anual",
                    description: "Estimado de ingresos totales para el ano",
                    useCase: "Planear proyectos grandes (construccion, retiros)"
                  }
                ]
              },
              {
                section: " Analiticas de Eventos",
                icon: <Calendar className="h-6 w-6 text-[hsl(var(--warning))]" />,
                reports: [
                  {
                    name: "Asistencia por Evento",
                    description: "Comparar cuÒnta gente vino a cada evento",
                    useCase: "Saber que eventos son mÒs populares"
                  },
                  {
                    name: "Tasa de Conversion",
                    description: "% de inscritos que realmente asistieron",
                    useCase: "Mejorar planificacion de capacidad"
                  },
                  {
                    name: "Eventos MÒs Exitosos",
                    description: "Ranking de eventos por asistencia y satisfaccion",
                    useCase: "Repetir eventos que funcionan"
                  },
                  {
                    name: "Frecuencia de Asistencia",
                    description: "Quienes asisten a todo vs ocasionalmente",
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
                      <div key={idx} className="bg-muted/30 p-3 rounded">
                        <p className="font-medium text-sm text-[hsl(var(--success))] mb-1">
                           {report.name}
                        </p>
                        <p className="text-xs text-muted-foreground mb-1">{report.description}</p>
                        <p className="text-xs text-[hsl(var(--lavender))] italic">
                           Para que sirve: {report.useCase}
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

      {/* Analiticas Inteligentes (AI) */}
      <Card className="border-[hsl(var(--lavender)/0.4)]">
        <CardHeader className="bg-[hsl(var(--lavender)/0.10)]">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Sparkles className="h-8 w-8 text-[hsl(var(--lavender))]" />
            Analiticas Inteligentes (Con Inteligencia Artificial)
          </CardTitle>
          <CardDescription className="text-base mt-2">
            El sistema te da recomendaciones automÒticas basadas en datos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="bg-[hsl(var(--warning)/0.10)] p-4 rounded-lg border-2 border-[hsl(var(--warning)/0.4)]">
            <h4 className="font-bold text-[hsl(var(--warning))] flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5" />
              Que es la Inteligencia Artificial en Analiticas?
            </h4>
            <p className="text-sm text-[hsl(var(--warning))]">
              Es como tener un asistente super inteligente que mira todos los datos de tu iglesia 
              y te dice cosas como: &quot;Este miembro probablemente dejarÒ de venir si no le contactas&quot;, 
              o &quot;Basado en tendencias, este mes recibirÒs $500,000 en donaciones&quot;. El sistema 
              aprende solo y te avisa de problemas ANTES de que pasen!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                feature: " Prediccion de Retencion",
                description: "Te dice que miembros estÒn en riesgo de dejar la iglesia",
                example: "Juan no ha asistido en 3 semanas > Alerta: Contactar urgente",
                icon: <TrendingUp className="h-6 w-6 text-[hsl(var(--destructive))]" />
              },
              {
                feature: " Recomendaciones de Ministerios",
                description: "Sugiere en que ministerio cada persona encajaria mejor",
                example: "Maria tiene don de ensenanza > Recomienda: Escuela Dominical",
                icon: <Award className="h-6 w-6 text-[hsl(var(--warning))]" />
              },
              {
                feature: " Proyecciones Financieras",
                description: "Predice cuÒnto recibirÒs de donaciones proximo mes",
                example: "Basado en 6 meses de datos: 'Enero estimado: $650,000 ±15%'",
                icon: <LineChart className="h-6 w-6 text-[hsl(var(--success))]" />
              },
              {
                feature: " Alertas Proactivas",
                description: "Te avisa de problemas potenciales antes de que pasen",
                example: "Asistencia bajo 20% > Alerta: Revisar programacion de cultos",
                icon: <Bell className="h-6 w-6 text-[hsl(var(--warning))]" />
              },
              {
                feature: " AnÒlisis de Crecimiento Espiritual",
                description: "Mide el progreso espiritual de cada miembro",
                example: "Pedro paso de VISITANTE a CRECIMIENTO en 3 meses > Excelente",
                icon: <Activity className="h-6 w-6 text-[hsl(var(--info))]" />
              },
              {
                feature: " Sugerencias de Contenido",
                description: "Recomienda que temas predicar segun necesidades",
                example: "Muchos miembros en crisis financiera  -  'Ensenar sobre mayordomia'",
                icon: <MessageSquare className="h-6 w-6 text-[hsl(var(--lavender))]" />
              }
            ].map((feature, index) => (
              <Card key={index} className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3 mb-3">
                    {feature.icon}
                    <h4 className="font-semibold text-lg">{feature.feature}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                  <div className="bg-[hsl(var(--lavender)/0.10)] p-3 rounded">
                    <p className="text-xs font-medium text-[hsl(var(--lavender))] mb-1"> Ejemplo Real:</p>
                    <p className="text-xs text-[hsl(var(--lavender))] italic">{feature.example}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-[hsl(var(--info)/0.10)] p-4 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="h-5 w-5 text-[hsl(var(--info))]" />
              Como Acceder a las Analiticas Inteligentes
            </h4>
            <ol className="text-sm space-y-2 ml-4">
              <li>1. Menu izquierdo  -  <strong>Analiticas</strong></li>
              <li>2. Clic en <strong>Analiticas Inteligentes</strong></li>
              <li>3. Selecciona el modulo que quieres ver (Retencion, Predicciones, etc.)</li>
              <li>4. Lee las recomendaciones del sistema</li>
              <li>5. Toma accion segun las sugerencias</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Exportar Reportes */}
      <Card className="border-[hsl(var(--info)/0.30)]">
        <CardHeader className="bg-[hsl(var(--info)/0.10)]">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Download className="h-6 w-6" />
            Exportar y Compartir Reportes
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Descarga grÒficas y tablas para presentaciones o reuniones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                format: "PDF Ejecutivo",
                icon: "",
                description: "Reporte profesional con grÒficas para imprimir",
                best: "Presentaciones a la junta directiva, reuniones anuales",
                includes: ["Logo de la iglesia", "GrÒficas en color", "Resumen ejecutivo", "Firma digital"]
              },
              {
                format: "Excel Avanzado",
                icon: "",
                description: "Hojas de cÒlculo con todos los datos crudos",
                best: "AnÒlisis profundo, crear tus propias grÒficas",
                includes: ["Multiples pestanas", "Filtros automÒticos", "Formulas", "Tablas dinÒmicas"]
              },
              {
                format: "CSV Estructurado",
                icon: "",
                description: "Datos en texto plano, compatible con todo",
                best: "Importar a otros sistemas, respaldos",
                includes: ["Formato universal", "Ligero", "Compatible", "FÒcil de leer"]
              }
            ].map((format, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="text-5xl mb-3">{format.icon}</div>
                  <h4 className="font-semibold text-lg mb-2">{format.format}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{format.description}</p>
                  <div className="bg-[hsl(var(--info)/0.10)] p-3 rounded text-xs text-left">
                    <p className="font-medium text-[hsl(var(--info))] mb-2"> Mejor Para:</p>
                    <p className="text-[hsl(var(--info))] mb-2">{format.best}</p>
                    <p className="font-medium text-[hsl(var(--info))] mb-1">Incluye:</p>
                    <ul className="space-y-1 text-[hsl(var(--info))]">
                      {format.includes.map((item, idx) => (
                        <li key={idx}>â¢ {item}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-[hsl(var(--success)/0.10)] p-4 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Download className="h-5 w-5 text-[hsl(var(--success))]" />
              Pasos para Exportar Reportes
            </h4>
            <ol className="text-sm space-y-2 ml-4">
              <li>1. Ve a la seccion de Analiticas que quieres exportar</li>
              <li>2. Haz clic en el boton <strong>&quot;Exportar&quot;</strong> (arriba a la derecha)</li>
              <li>3. Selecciona el formato (PDF, Excel, o CSV)</li>
              <li>4. Elige el rango de fechas (ultimo mes, trimestre, ano)</li>
              <li>5. Haz clic en <strong>&quot;Descargar Reporte&quot;</strong></li>
              <li>6. El archivo se descargarÒ a tu computadora!</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Personalizar Dashboard */}
      <Card className="border-[hsl(var(--lavender)/0.30)]">
        <CardHeader className="bg-[hsl(var(--destructive)/0.08)]">
          <CardTitle className="flex items-center gap-3 text-xl">
            <RefreshCw className="h-6 w-6" />
            Personalizar Tu Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <p className="text-sm text-muted-foreground">
            Puedes decidir que tarjetas ver y en que orden. Hazlo tu dashboard ideal!
          </p>

          <div className="space-y-3">
            <div className="bg-[hsl(var(--destructive)/0.08)] p-3 rounded">
              <h5 className="font-medium text-sm mb-2"> Como Personalizar:</h5>
              <ul className="text-xs space-y-1 ml-4">
                <li>1. En tu Dashboard, haz clic en el boton ï¸ &quot;Personalizar&quot; (arriba a la derecha)</li>
                <li>2. Arrastra las tarjetas para cambiar el orden</li>
                <li>3. Marca/desmarca casillas para mostrar u ocultar tarjetas</li>
                <li>4. Haz clic en &quot;Guardar Configuracion&quot;</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-3 text-xs">
              <div className="bg-[hsl(var(--success)/0.10)] p-3 rounded">
                <p className="font-medium text-[hsl(var(--success))] mb-1"> Ideas de Personalizacion:</p>
                <ul className="space-y-1 text-[hsl(var(--success))]">
                  <li>â¢ Si eres pastor: Prioriza miembros y eventos</li>
                  <li>â¢ Si eres tesorero: Finanzas arriba</li>
                  <li>â¢ Si lideras jovenes: Solo ver jovenes</li>
                  <li>â¢ Oculta tarjetas que no usas</li>
                </ul>
              </div>
              <div className="bg-[hsl(var(--info)/0.10)] p-3 rounded">
                <p className="font-medium text-[hsl(var(--info))] mb-1"> Consejo:</p>
                <p className="text-[hsl(var(--info))]">
                  Tu personalizacion se guarda automÒticamente. La proxima vez que entres, 
                  verÒs TU dashboard personalizado, no el de otros usuarios.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card className="border-[hsl(var(--destructive)/0.4)] bg-[hsl(var(--destructive)/0.10)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[hsl(var(--destructive))]">
            <AlertTriangle className="h-6 w-6" />
            Problemas Comunes con Analiticas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              problem: " Los numeros no se actualizan / estÒn desactualizados",
              solutions: [
                "Espera 5-10 segundos - el sistema actualiza cada pocos segundos",
                "Refresca la pÒgina (F5 o boton de recargar del navegador)",
                "Verifica que tu conexion a internet este funcionando",
                "Si persiste, cierra sesion y vuelve a entrar"
              ]
            },
            {
              problem: " Las grÒficas no se muestran / salen en blanco",
              solutions: [
                "Verifica que tengas datos en ese rango de fechas",
                "Cambia el filtro de fechas (por ejemplo, ultimos 6 meses en vez de ultimo mes)",
                "Intenta con otro navegador (Chrome funciona mejor)",
                "Desactiva bloqueadores de anuncios (pueden bloquear grÒficas)"
              ]
            },
            {
              problem: " No puedo exportar reportes (boton no funciona)",
              solutions: [
                "Verifica que tienes permiso de ADMIN o PASTOR",
                "Asegurate que seleccionaste un rango de fechas",
                "Intenta descargar en formato PDF primero (es mÒs ligero)",
                "Si el reporte es muy grande (1000+ registros), divide en meses"
              ]
            },
            {
              problem: " Las predicciones de IA parecen incorrectas",
              solutions: [
                "La IA necesita minimo 3 meses de datos para ser precisa",
                "Verifica que los datos ingresados sean correctos",
                "Las predicciones mejoran con el tiempo - se paciente",
                "Si ves algo muy raro, reporta al soporte tecnico"
              ]
            }
          ].map((item, index) => (
            <div key={index} className="bg-[hsl(var(--card))] p-4 rounded border border-[hsl(var(--destructive)/0.3)]">
              <p className="font-medium text-[hsl(var(--destructive))] mb-2">{item.problem}</p>
              <ul className="text-sm text-[hsl(var(--destructive))] space-y-1 ml-4">
                {item.solutions.map((solution, idx) => (
                  <li key={idx}> {solution}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Completion Badge */}
      <Card className="bg-[hsl(var(--success)/0.15)] border-4 border-[hsl(var(--success)/0.30)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl text-foreground">
            <Gift className="h-10 w-10" />
            Felicidades! Completaste el Onboarding
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-6">
            <div className="text-6xl mb-4"></div>
            <h3 className="text-2xl font-bold text-[hsl(var(--success))] mb-2">
              Ya Sabes Usar Khesed-tek!
            </h3>
            <p className="text-muted-foreground mb-6">
              Completaste las 6 fases del onboarding. Ahora estÒs listo para administrar 
              tu iglesia como un profesional.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { phase: "Fase 1", name: "Cuenta Creada", icon: "" },
              { phase: "Fase 2", name: "Iglesia Configurada", icon: "" },
              { phase: "Fase 3", name: "Miembros Agregados", icon: "" },
              { phase: "Fase 4", name: "Eventos Creados", icon: "" },
              { phase: "Fase 5", name: "Comunicaciones Enviadas", icon: "" },
              { phase: "Fase 6", name: "Analiticas Dominadas", icon: "" }
            ].map((item, index) => (
              <div key={index} className="bg-[hsl(var(--card))] p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="font-semibold text-sm">{item.phase}</p>
                <p className="text-xs text-muted-foreground">{item.name}</p>
              </div>
            ))}
          </div>

          <div className="bg-[hsl(var(--info)/0.10)] p-4 rounded-lg mt-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Star className="h-5 w-5 text-[hsl(var(--info))]" />
              Proximos Pasos Recomendados
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Explora las funciones avanzadas:</strong> Voluntarios, Sermons, Website Builder, Marketing
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Configura automatizaciones:</strong> Emails automÒticos, recordatorios, seguimientos
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Invita a tu equipo:</strong> Agrega pastores, lideres, y voluntarios al sistema
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Revisa la guia completa de funciones:</strong> 70+ funciones disponibles
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
          <Button size="lg" className="btn-cta-gradient text-white">
            Ver Todas las Funciones (70+)
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
