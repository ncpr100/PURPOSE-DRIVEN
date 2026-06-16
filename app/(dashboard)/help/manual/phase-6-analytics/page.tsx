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
            <h1 className="text-4xl font-bold mb-2"> Fase 6: Dashboard y AnalÒ­ticas</h1>
            <p className="text-xl opacity-90">
              Entiende los datos de tu iglesia con grÒ�ficas y reportes
            </p>
          </div>
        </div>
        <div className="mt-6 flex gap-4 text-sm">
          <Badge variant="secondary" className="bg-[hsl(var(--card))]/20 text-white">
            <Target className="h-3 w-3 mr-1" />
            Fase 6 de 6 - ��Òšltima Fase!
          </Badge>
          <Badge variant="secondary" className="bg-[hsl(var(--card))]/20 text-white">
            <Star className="h-3 w-3 mr-1" />
            10 minutos
          </Badge>
        </div>
      </div>

      {/* Para NiÒ±os */}
      <div className="bg-[hsl(var(--warning)/0.10)] p-4 rounded-lg border-2 border-[hsl(var(--warning)/0.4)]">
        <h4 className="font-bold text-[hsl(var(--warning))] flex items-center gap-2 mb-2">
          <Heart className="h-5 w-5" />
          Para NiÒ±os: ��QuÒ© son las &quot;AnalÒ­ticas&quot;?
        </h4>
        <p className="text-sm text-[hsl(var(--warning))]">
          Imagina que tienes una caja mÒ�gica que cuenta todo lo que pasa en tu iglesia: cuÒ�ntas 
          personas vinieron hoy, cuÒ�ntos niÒ±os hay, cuÒ�nto dinero se donÒ³, quÒ© eventos fueron los 
          mÒ�s populares. Las analÒ­ticas son como grÒ�ficas de colores que te muestran toda esa 
          informaciÒ³n de forma bonita y fÒ�cil de entender. ��Es como tener rayos X de tu iglesia!
        </p>
      </div>

      {/* Dashboard Principal */}
      <Card className="border-[hsl(var(--info)/0.4)]">
        <CardHeader className="bg-[hsl(var(--info)/0.10)]">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="bg-[hsl(var(--info))] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              1
            </div>
            Tu Dashboard Principal (PÒ�gina de Inicio)
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Lo primero que ves cuando entras - un resumen de TODO
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="bg-[hsl(var(--info)/0.10)] p-4 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Eye className="h-5 w-5 text-[hsl(var(--info))]" />
              ��DÒ³nde EstÒ� el Dashboard?
            </h4>
            <p className="text-sm mb-2">
              Cuando inicias sesiÒ³n, la primera pantalla es tu Dashboard. TambiÒ©n puedes llegar 
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
                  "DistribuciÒ³n por etapa espiritual"
                ],
                color: "blue"
              },
              {
                title: " Tarjeta de Finanzas",
                metrics: [
                  "Donaciones del mes actual",
                  "ComparaciÒ³n con mes anterior",
                  "Promedio de donaciÒ³n por persona",
                  "GrÒ�fica de tendencia mensual"
                ],
                color: "green"
              },
              {
                title: " PrÒ³ximos Eventos",
                metrics: [
                  "Eventos de esta semana",
                  "Cantidad de inscritos",
                  "Eventos mÒ�s populares",
                  "Check-ins recientes"
                ],
                color: "orange"
              },
              {
                title: " Peticiones de OraciÒ³n",
                metrics: [
                  "Peticiones activas",
                  "Peticiones respondidas este mes",
                  "CategorÒ­as mÒ�s comunes",
                  "Tasa de respuesta"
                ],
                color: "purple"
              },
              {
                title: " Crecimiento General",
                metrics: [
                  "Tasa de crecimiento mensual",
                  "ComparaciÒ³n trimestral",
                  "Tendencia de asistencia",
                  "ProyecciÒ³n para prÒ³ximo mes"
                ],
                color: "cyan"
              },
              {
                title: " Actividad Reciente",
                metrics: [
                  "Òšltimos miembros registrados",
                  "Donaciones recientes",
                  "Check-ins del dÒ­a",
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
              Tu dashboard se actualiza en TIEMPO REAL. Si alguien se registra, hace una donaciÒ³n, 
              o se inscribe a un evento, verÒ�s los nÒºmeros cambiar automÒ�ticamente. ��Es como magia! 
              No necesitas refrescar la pÒ�gina.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AnalÒ­ticas Generales */}
      <Card className="border-[hsl(var(--success)/0.4)]">
        <CardHeader className="bg-[hsl(var(--success)/0.10)]">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="bg-[hsl(var(--success))] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              2
            </div>
            AnalÒ­ticas Generales (Reportes Detallados)
          </CardTitle>
          <CardDescription className="text-base mt-2">
            InformaciÒ³n profunda sobre cada Ò�rea de tu iglesia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="bg-[hsl(var(--success)/0.10)] p-4 rounded-lg">
              <h4 className="font-semibold mb-2"> CÒ³mo Llegar:</h4>
              <p className="text-sm">
                En el menÒº izquierdo â⬠�" <strong>AnalÒ­ticas</strong> â⬠�" <strong>AnalÒ­ticas Generales</strong>
              </p>
            </div>

            {[
              {
                section: " AnalÒ­ticas de Miembros",
                icon: <Users className="h-6 w-6 text-[hsl(var(--info))]" />,
                reports: [
                  {
                    name: "Crecimiento de MembresÒ­a",
                    description: "GrÒ�fica de lÒ­neas mostrando crecimiento mes a mes",
                    useCase: "Ver si estamos creciendo o estancados"
                  },
                  {
                    name: "DistribuciÒ³n por Edad",
                    description: "GrÒ�fica de pastel: cuÒ�ntos niÒ±os, jÒ³venes, adultos, ancianos",
                    useCase: "Planear actividades apropiadas para cada edad"
                  },
                  {
                    name: "DistribuciÒ³n por GÒ©nero",
                    description: "Porcentaje de hombres vs mujeres en la congregaciÒ³n",
                    useCase: "Balancear ministerios para hombres y mujeres"
                  },
                  {
                    name: "Mapa de UbicaciÒ³n",
                    description: "Mapa con puntos donde viven los miembros",
                    useCase: "Organizar cÒ©lulas geogrÒ�ficamente"
                  },
                  {
                    name: "RetenciÒ³n de Miembros",
                    description: "CuÒ�ntos miembros siguen activos vs inactivos",
                    useCase: "Identificar quiÒ©nes necesitan seguimiento"
                  }
                ]
              },
              {
                section: " AnalÒ­ticas Financieras",
                icon: <DollarSign className="h-6 w-6 text-[hsl(var(--success))]" />,
                reports: [
                  {
                    name: "Ingresos por Mes",
                    description: "GrÒ�fica de barras de donaciones mensuales",
                    useCase: "Presupuestar y planear gastos"
                  },
                  {
                    name: "MÒ©todos de Pago",
                    description: "CuÒ�nto se recibiÒ³ en efectivo, tarjeta, transferencia",
                    useCase: "Decidir quÒ© mÒ©todos promover"
                  },
                  {
                    name: "Donadores Recurrentes",
                    description: "QuiÒ©nes donan mensualmente vs ocasionalmente",
                    useCase: "Agradecer a donadores fieles"
                  },
                  {
                    name: "CategorÒ­as de Gastos",
                    description: "En quÒ© se gastÒ³ el dinero (ministerios, edificio, misiones)",
                    useCase: "Transparencia financiera"
                  },
                  {
                    name: "ProyecciÒ³n Anual",
                    description: "Estimado de ingresos totales para el aÒ±o",
                    useCase: "Planear proyectos grandes (construcciÒ³n, retiros)"
                  }
                ]
              },
              {
                section: " AnalÒ­ticas de Eventos",
                icon: <Calendar className="h-6 w-6 text-[hsl(var(--warning))]" />,
                reports: [
                  {
                    name: "Asistencia por Evento",
                    description: "Comparar cuÒ�nta gente vino a cada evento",
                    useCase: "Saber quÒ© eventos son mÒ�s populares"
                  },
                  {
                    name: "Tasa de ConversiÒ³n",
                    description: "% de inscritos que realmente asistieron",
                    useCase: "Mejorar planificaciÒ³n de capacidad"
                  },
                  {
                    name: "Eventos MÒ�s Exitosos",
                    description: "Ranking de eventos por asistencia y satisfacciÒ³n",
                    useCase: "Repetir eventos que funcionan"
                  },
                  {
                    name: "Frecuencia de Asistencia",
                    description: "QuiÒ©nes asisten a todo vs ocasionalmente",
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
                           Para quÒ© sirve: {report.useCase}
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

      {/* AnalÒ­ticas Inteligentes (AI) */}
      <Card className="border-[hsl(var(--lavender)/0.4)]">
        <CardHeader className="bg-[hsl(var(--lavender)/0.10)]">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Sparkles className="h-8 w-8 text-[hsl(var(--lavender))]" />
            AnalÒ­ticas Inteligentes (Con Inteligencia Artificial)
          </CardTitle>
          <CardDescription className="text-base mt-2">
            El sistema te da recomendaciones automÒ�ticas basadas en datos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="bg-[hsl(var(--warning)/0.10)] p-4 rounded-lg border-2 border-[hsl(var(--warning)/0.4)]">
            <h4 className="font-bold text-[hsl(var(--warning))] flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5" />
              ��QuÒ© es la Inteligencia Artificial en AnalÒ­ticas?
            </h4>
            <p className="text-sm text-[hsl(var(--warning))]">
              Es como tener un asistente sÒºper inteligente que mira todos los datos de tu iglesia 
              y te dice cosas como: &quot;Este miembro probablemente dejarÒ� de venir si no le contactas&quot;, 
              o &quot;Basado en tendencias, este mes recibirÒ�s $500,000 en donaciones&quot;. ��El sistema 
              aprende solo y te avisa de problemas ANTES de que pasen!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                feature: " PredicciÒ³n de RetenciÒ³n",
                description: "Te dice quÒ© miembros estÒ�n en riesgo de dejar la iglesia",
                example: "Juan no ha asistido en 3 semanas â⬠�" Sistema sugiere: 'Contactar urgente'",
                icon: <TrendingUp className="h-6 w-6 text-[hsl(var(--destructive))]" />
              },
              {
                feature: " Recomendaciones de Ministerios",
                description: "Sugiere en quÒ© ministerio cada persona encajarÒ­a mejor",
                example: "MarÒ­a tiene don de enseÒ±anza â⬠�" Recomienda: 'Escuela Dominical'",
                icon: <Award className="h-6 w-6 text-[hsl(var(--warning))]" />
              },
              {
                feature: " Proyecciones Financieras",
                description: "Predice cuÒ�nto recibirÒ�s de donaciones prÒ³ximo mes",
                example: "Basado en 6 meses de datos: 'Enero estimado: $650,000 �±15%'",
                icon: <LineChart className="h-6 w-6 text-[hsl(var(--success))]" />
              },
              {
                feature: " Alertas Proactivas",
                description: "Te avisa de problemas potenciales antes de que pasen",
                example: "Asistencia bajÒ³ 20% â⬠�" Alerta: 'Revisar programaciÒ³n de cultos'",
                icon: <Bell className="h-6 w-6 text-[hsl(var(--warning))]" />
              },
              {
                feature: " AnÒ�lisis de Crecimiento Espiritual",
                description: "Mide el progreso espiritual de cada miembro",
                example: "Pedro pasÒ³ de VISITANTE a CRECIMIENTO en 3 meses â⬠�" '��Excelente!'",
                icon: <Activity className="h-6 w-6 text-[hsl(var(--info))]" />
              },
              {
                feature: " Sugerencias de Contenido",
                description: "Recomienda quÒ© temas predicar segÒºn necesidades",
                example: "Muchos miembros en crisis financiera â⬠�" 'EnseÒ±ar sobre mayordomÒ­a'",
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
              CÒ³mo Acceder a las AnalÒ­ticas Inteligentes
            </h4>
            <ol className="text-sm space-y-2 ml-4">
              <li>1. MenÒº izquierdo â⬠�" <strong>AnalÒ­ticas</strong></li>
              <li>2. Clic en <strong>AnalÒ­ticas Inteligentes</strong></li>
              <li>3. Selecciona el mÒ³dulo que quieres ver (RetenciÒ³n, Predicciones, etc.)</li>
              <li>4. Lee las recomendaciones del sistema</li>
              <li>5. Toma acciÒ³n segÒºn las sugerencias</li>
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
            Descarga grÒ�ficas y tablas para presentaciones o reuniones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                format: "PDF Ejecutivo",
                icon: "",
                description: "Reporte profesional con grÒ�ficas para imprimir",
                best: "Presentaciones a la junta directiva, reuniones anuales",
                includes: ["Logo de la iglesia", "GrÒ�ficas en color", "Resumen ejecutivo", "Firma digital"]
              },
              {
                format: "Excel Avanzado",
                icon: "",
                description: "Hojas de cÒ�lculo con todos los datos crudos",
                best: "AnÒ�lisis profundo, crear tus propias grÒ�ficas",
                includes: ["MÒºltiples pestaÒ±as", "Filtros automÒ�ticos", "FÒ³rmulas", "Tablas dinÒ�micas"]
              },
              {
                format: "CSV Estructurado",
                icon: "",
                description: "Datos en texto plano, compatible con todo",
                best: "Importar a otros sistemas, respaldos",
                includes: ["Formato universal", "Ligero", "Compatible", "FÒ�cil de leer"]
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
                        <li key={idx}>â��¢ {item}</li>
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
              <li>1. Ve a la secciÒ³n de AnalÒ­ticas que quieres exportar</li>
              <li>2. Haz clic en el botÒ³n <strong>&quot;Exportar&quot;</strong> (arriba a la derecha)</li>
              <li>3. Selecciona el formato (PDF, Excel, o CSV)</li>
              <li>4. Elige el rango de fechas (Òºltimo mes, trimestre, aÒ±o)</li>
              <li>5. Haz clic en <strong>&quot;Descargar Reporte&quot;</strong></li>
              <li>6. ��El archivo se descargarÒ� a tu computadora!</li>
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
            Puedes decidir quÒ© tarjetas ver y en quÒ© orden. ��Hazlo tu dashboard ideal!
          </p>

          <div className="space-y-3">
            <div className="bg-[hsl(var(--destructive)/0.08)] p-3 rounded">
              <h5 className="font-medium text-sm mb-2"> CÒ³mo Personalizar:</h5>
              <ul className="text-xs space-y-1 ml-4">
                <li>1. En tu Dashboard, haz clic en el botÒ³n ï¸ &quot;Personalizar&quot; (arriba a la derecha)</li>
                <li>2. Arrastra las tarjetas para cambiar el orden</li>
                <li>3. Marca/desmarca casillas para mostrar u ocultar tarjetas</li>
                <li>4. Haz clic en &quot;Guardar ConfiguraciÒ³n&quot;</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-3 text-xs">
              <div className="bg-[hsl(var(--success)/0.10)] p-3 rounded">
                <p className="font-medium text-[hsl(var(--success))] mb-1"> Ideas de PersonalizaciÒ³n:</p>
                <ul className="space-y-1 text-[hsl(var(--success))]">
                  <li>â��¢ Si eres pastor: Prioriza miembros y eventos</li>
                  <li>â��¢ Si eres tesorero: Finanzas arriba</li>
                  <li>â��¢ Si lideras jÒ³venes: Solo ver jÒ³venes</li>
                  <li>â��¢ Oculta tarjetas que no usas</li>
                </ul>
              </div>
              <div className="bg-[hsl(var(--info)/0.10)] p-3 rounded">
                <p className="font-medium text-[hsl(var(--info))] mb-1"> Consejo:</p>
                <p className="text-[hsl(var(--info))]">
                  Tu personalizaciÒ³n se guarda automÒ�ticamente. La prÒ³xima vez que entres, 
                  verÒ�s TU dashboard personalizado, no el de otros usuarios.
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
            Problemas Comunes con AnalÒ­ticas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              problem: " Los nÒºmeros no se actualizan / estÒ�n desactualizados",
              solutions: [
                "Espera 5-10 segundos - el sistema actualiza cada pocos segundos",
                "Refresca la pÒ�gina (F5 o botÒ³n de recargar del navegador)",
                "Verifica que tu conexiÒ³n a internet estÒ© funcionando",
                "Si persiste, cierra sesiÒ³n y vuelve a entrar"
              ]
            },
            {
              problem: " Las grÒ�ficas no se muestran / salen en blanco",
              solutions: [
                "Verifica que tengas datos en ese rango de fechas",
                "Cambia el filtro de fechas (por ejemplo, Òºltimos 6 meses en vez de Òºltimo mes)",
                "Intenta con otro navegador (Chrome funciona mejor)",
                "Desactiva bloqueadores de anuncios (pueden bloquear grÒ�ficas)"
              ]
            },
            {
              problem: " No puedo exportar reportes (botÒ³n no funciona)",
              solutions: [
                "Verifica que tienes permiso de ADMIN o PASTOR",
                "AsegÒºrate que seleccionaste un rango de fechas",
                "Intenta descargar en formato PDF primero (es mÒ�s ligero)",
                "Si el reporte es muy grande (1000+ registros), divide en meses"
              ]
            },
            {
              problem: " Las predicciones de IA parecen incorrectas",
              solutions: [
                "La IA necesita mÒ­nimo 3 meses de datos para ser precisa",
                "Verifica que los datos ingresados sean correctos",
                "Las predicciones mejoran con el tiempo - sÒ© paciente",
                "Si ves algo muy raro, reporta al soporte tÒ©cnico"
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
            ��Felicidades! Completaste el Onboarding
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-6">
            <div className="text-6xl mb-4"></div>
            <h3 className="text-2xl font-bold text-[hsl(var(--success))] mb-2">
              ��Ya Sabes Usar Khesed-tek!
            </h3>
            <p className="text-muted-foreground mb-6">
              Completaste las 6 fases del onboarding. Ahora estÒ�s listo para administrar 
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
              { phase: "Fase 6", name: "AnalÒ­ticas Dominadas", icon: "" }
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
              PrÒ³ximos Pasos Recomendados
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
                  <strong>Configura automatizaciones:</strong> Emails automÒ�ticos, recordatorios, seguimientos
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Invita a tu equipo:</strong> Agrega pastores, lÒ­deres, y voluntarios al sistema
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Revisa la guÒ­a completa de funciones:</strong> 70+ funciones disponibles
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
