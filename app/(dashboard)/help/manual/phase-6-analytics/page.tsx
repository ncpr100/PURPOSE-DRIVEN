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
            <h1 className="text-4xl font-bold mb-2"> Fase 6: Dashboard y AnalÃƒÂ­ticas</h1>
            <p className="text-xl opacity-90">
              Entiende los datos de tu iglesia con grÃƒÂ¡ficas y reportes
            </p>
          </div>
        </div>
        <div className="mt-6 flex gap-4 text-sm">
          <Badge variant="secondary" className="bg-[hsl(var(--card))]/20 text-white">
            <Target className="h-3 w-3 mr-1" />
            Fase 6 de 6 - Ã‚Â¡ÃƒÅ¡ltima Fase!
          </Badge>
          <Badge variant="secondary" className="bg-[hsl(var(--card))]/20 text-white">
            <Star className="h-3 w-3 mr-1" />
            10 minutos
          </Badge>
        </div>
      </div>

      {/* Para NiÃƒÂ±os */}
      <div className="bg-[hsl(var(--warning)/0.10)] p-4 rounded-lg border-2 border-[hsl(var(--warning)/0.4)]">
        <h4 className="font-bold text-[hsl(var(--warning))] flex items-center gap-2 mb-2">
          <Heart className="h-5 w-5" />
          Para NiÃƒÂ±os: Ã‚Â¿QuÃƒÂ© son las &quot;AnalÃƒÂ­ticas&quot;?
        </h4>
        <p className="text-sm text-[hsl(var(--warning))]">
          Imagina que tienes una caja mÃƒÂ¡gica que cuenta todo lo que pasa en tu iglesia: cuÃƒÂ¡ntas 
          personas vinieron hoy, cuÃƒÂ¡ntos niÃƒÂ±os hay, cuÃƒÂ¡nto dinero se donÃƒÂ³, quÃƒÂ© eventos fueron los 
          mÃƒÂ¡s populares. Las analÃƒÂ­ticas son como grÃƒÂ¡ficas de colores que te muestran toda esa 
          informaciÃƒÂ³n de forma bonita y fÃƒÂ¡cil de entender. Ã‚Â¡Es como tener rayos X de tu iglesia!
        </p>
      </div>

      {/* Dashboard Principal */}
      <Card className="border-[hsl(var(--info)/0.4)]">
        <CardHeader className="bg-[hsl(var(--info)/0.10)]">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="bg-[hsl(var(--info))] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              1
            </div>
            Tu Dashboard Principal (PÃƒÂ¡gina de Inicio)
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Lo primero que ves cuando entras - un resumen de TODO
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="bg-[hsl(var(--info)/0.10)] p-4 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Eye className="h-5 w-5 text-[hsl(var(--info))]" />
              Ã‚Â¿DÃƒÂ³nde EstÃƒÂ¡ el Dashboard?
            </h4>
            <p className="text-sm mb-2">
              Cuando inicias sesiÃƒÂ³n, la primera pantalla es tu Dashboard. TambiÃƒÂ©n puedes llegar 
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
                  "DistribuciÃƒÂ³n por etapa espiritual"
                ],
                color: "blue"
              },
              {
                title: " Tarjeta de Finanzas",
                metrics: [
                  "Donaciones del mes actual",
                  "ComparaciÃƒÂ³n con mes anterior",
                  "Promedio de donaciÃƒÂ³n por persona",
                  "GrÃƒÂ¡fica de tendencia mensual"
                ],
                color: "green"
              },
              {
                title: " PrÃƒÂ³ximos Eventos",
                metrics: [
                  "Eventos de esta semana",
                  "Cantidad de inscritos",
                  "Eventos mÃƒÂ¡s populares",
                  "Check-ins recientes"
                ],
                color: "orange"
              },
              {
                title: " Peticiones de OraciÃƒÂ³n",
                metrics: [
                  "Peticiones activas",
                  "Peticiones respondidas este mes",
                  "CategorÃƒÂ­as mÃƒÂ¡s comunes",
                  "Tasa de respuesta"
                ],
                color: "purple"
              },
              {
                title: " Crecimiento General",
                metrics: [
                  "Tasa de crecimiento mensual",
                  "ComparaciÃƒÂ³n trimestral",
                  "Tendencia de asistencia",
                  "ProyecciÃƒÂ³n para prÃƒÂ³ximo mes"
                ],
                color: "cyan"
              },
              {
                title: " Actividad Reciente",
                metrics: [
                  "ÃƒÅ¡ltimos miembros registrados",
                  "Donaciones recientes",
                  "Check-ins del dÃƒÂ­a",
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
              Tu dashboard se actualiza en TIEMPO REAL. Si alguien se registra, hace una donaciÃƒÂ³n, 
              o se inscribe a un evento, verÃƒÂ¡s los nÃƒÂºmeros cambiar automÃƒÂ¡ticamente. Ã‚Â¡Es como magia! 
              No necesitas refrescar la pÃƒÂ¡gina.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AnalÃƒÂ­ticas Generales */}
      <Card className="border-[hsl(var(--success)/0.4)]">
        <CardHeader className="bg-[hsl(var(--success)/0.10)]">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="bg-[hsl(var(--success))] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              2
            </div>
            AnalÃƒÂ­ticas Generales (Reportes Detallados)
          </CardTitle>
          <CardDescription className="text-base mt-2">
            InformaciÃƒÂ³n profunda sobre cada ÃƒÂ¡rea de tu iglesia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="bg-[hsl(var(--success)/0.10)] p-4 rounded-lg">
              <h4 className="font-semibold mb-2"> CÃƒÂ³mo Llegar:</h4>
              <p className="text-sm">
                En el menÃƒÂº izquierdo Ã¢â€ â€™ <strong>AnalÃƒÂ­ticas</strong> Ã¢â€ â€™ <strong>AnalÃƒÂ­ticas Generales</strong>
              </p>
            </div>

            {[
              {
                section: " AnalÃƒÂ­ticas de Miembros",
                icon: <Users className="h-6 w-6 text-[hsl(var(--info))]" />,
                reports: [
                  {
                    name: "Crecimiento de MembresÃƒÂ­a",
                    description: "GrÃƒÂ¡fica de lÃƒÂ­neas mostrando crecimiento mes a mes",
                    useCase: "Ver si estamos creciendo o estancados"
                  },
                  {
                    name: "DistribuciÃƒÂ³n por Edad",
                    description: "GrÃƒÂ¡fica de pastel: cuÃƒÂ¡ntos niÃƒÂ±os, jÃƒÂ³venes, adultos, ancianos",
                    useCase: "Planear actividades apropiadas para cada edad"
                  },
                  {
                    name: "DistribuciÃƒÂ³n por GÃƒÂ©nero",
                    description: "Porcentaje de hombres vs mujeres en la congregaciÃƒÂ³n",
                    useCase: "Balancear ministerios para hombres y mujeres"
                  },
                  {
                    name: "Mapa de UbicaciÃƒÂ³n",
                    description: "Mapa con puntos donde viven los miembros",
                    useCase: "Organizar cÃƒÂ©lulas geogrÃƒÂ¡ficamente"
                  },
                  {
                    name: "RetenciÃƒÂ³n de Miembros",
                    description: "CuÃƒÂ¡ntos miembros siguen activos vs inactivos",
                    useCase: "Identificar quiÃƒÂ©nes necesitan seguimiento"
                  }
                ]
              },
              {
                section: " AnalÃƒÂ­ticas Financieras",
                icon: <DollarSign className="h-6 w-6 text-[hsl(var(--success))]" />,
                reports: [
                  {
                    name: "Ingresos por Mes",
                    description: "GrÃƒÂ¡fica de barras de donaciones mensuales",
                    useCase: "Presupuestar y planear gastos"
                  },
                  {
                    name: "MÃƒÂ©todos de Pago",
                    description: "CuÃƒÂ¡nto se recibiÃƒÂ³ en efectivo, tarjeta, transferencia",
                    useCase: "Decidir quÃƒÂ© mÃƒÂ©todos promover"
                  },
                  {
                    name: "Donadores Recurrentes",
                    description: "QuiÃƒÂ©nes donan mensualmente vs ocasionalmente",
                    useCase: "Agradecer a donadores fieles"
                  },
                  {
                    name: "CategorÃƒÂ­as de Gastos",
                    description: "En quÃƒÂ© se gastÃƒÂ³ el dinero (ministerios, edificio, misiones)",
                    useCase: "Transparencia financiera"
                  },
                  {
                    name: "ProyecciÃƒÂ³n Anual",
                    description: "Estimado de ingresos totales para el aÃƒÂ±o",
                    useCase: "Planear proyectos grandes (construcciÃƒÂ³n, retiros)"
                  }
                ]
              },
              {
                section: " AnalÃƒÂ­ticas de Eventos",
                icon: <Calendar className="h-6 w-6 text-[hsl(var(--warning))]" />,
                reports: [
                  {
                    name: "Asistencia por Evento",
                    description: "Comparar cuÃƒÂ¡nta gente vino a cada evento",
                    useCase: "Saber quÃƒÂ© eventos son mÃƒÂ¡s populares"
                  },
                  {
                    name: "Tasa de ConversiÃƒÂ³n",
                    description: "% de inscritos que realmente asistieron",
                    useCase: "Mejorar planificaciÃƒÂ³n de capacidad"
                  },
                  {
                    name: "Eventos MÃƒÂ¡s Exitosos",
                    description: "Ranking de eventos por asistencia y satisfacciÃƒÂ³n",
                    useCase: "Repetir eventos que funcionan"
                  },
                  {
                    name: "Frecuencia de Asistencia",
                    description: "QuiÃƒÂ©nes asisten a todo vs ocasionalmente",
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
                           Para quÃƒÂ© sirve: {report.useCase}
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

      {/* AnalÃƒÂ­ticas Inteligentes (AI) */}
      <Card className="border-[hsl(var(--lavender)/0.4)]">
        <CardHeader className="bg-[hsl(var(--lavender)/0.10)]">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Sparkles className="h-8 w-8 text-[hsl(var(--lavender))]" />
            AnalÃƒÂ­ticas Inteligentes (Con Inteligencia Artificial)
          </CardTitle>
          <CardDescription className="text-base mt-2">
            El sistema te da recomendaciones automÃƒÂ¡ticas basadas en datos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="bg-[hsl(var(--warning)/0.10)] p-4 rounded-lg border-2 border-[hsl(var(--warning)/0.4)]">
            <h4 className="font-bold text-[hsl(var(--warning))] flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5" />
              Ã‚Â¿QuÃƒÂ© es la Inteligencia Artificial en AnalÃƒÂ­ticas?
            </h4>
            <p className="text-sm text-[hsl(var(--warning))]">
              Es como tener un asistente sÃƒÂºper inteligente que mira todos los datos de tu iglesia 
              y te dice cosas como: &quot;Este miembro probablemente dejarÃƒÂ¡ de venir si no le contactas&quot;, 
              o &quot;Basado en tendencias, este mes recibirÃƒÂ¡s $500,000 en donaciones&quot;. Ã‚Â¡El sistema 
              aprende solo y te avisa de problemas ANTES de que pasen!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                feature: " PredicciÃƒÂ³n de RetenciÃƒÂ³n",
                description: "Te dice quÃƒÂ© miembros estÃƒÂ¡n en riesgo de dejar la iglesia",
                example: "Juan no ha asistido en 3 semanas Ã¢â€ â€™ Sistema sugiere: 'Contactar urgente'",
                icon: <TrendingUp className="h-6 w-6 text-[hsl(var(--destructive))]" />
              },
              {
                feature: " Recomendaciones de Ministerios",
                description: "Sugiere en quÃƒÂ© ministerio cada persona encajarÃƒÂ­a mejor",
                example: "MarÃƒÂ­a tiene don de enseÃƒÂ±anza Ã¢â€ â€™ Recomienda: 'Escuela Dominical'",
                icon: <Award className="h-6 w-6 text-[hsl(var(--warning))]" />
              },
              {
                feature: " Proyecciones Financieras",
                description: "Predice cuÃƒÂ¡nto recibirÃƒÂ¡s de donaciones prÃƒÂ³ximo mes",
                example: "Basado en 6 meses de datos: 'Enero estimado: $650,000 Ã‚Â±15%'",
                icon: <LineChart className="h-6 w-6 text-[hsl(var(--success))]" />
              },
              {
                feature: " Alertas Proactivas",
                description: "Te avisa de problemas potenciales antes de que pasen",
                example: "Asistencia bajÃƒÂ³ 20% Ã¢â€ â€™ Alerta: 'Revisar programaciÃƒÂ³n de cultos'",
                icon: <Bell className="h-6 w-6 text-[hsl(var(--warning))]" />
              },
              {
                feature: " AnÃƒÂ¡lisis de Crecimiento Espiritual",
                description: "Mide el progreso espiritual de cada miembro",
                example: "Pedro pasÃƒÂ³ de VISITANTE a CRECIMIENTO en 3 meses Ã¢â€ â€™ 'Ã‚Â¡Excelente!'",
                icon: <Activity className="h-6 w-6 text-[hsl(var(--info))]" />
              },
              {
                feature: " Sugerencias de Contenido",
                description: "Recomienda quÃƒÂ© temas predicar segÃƒÂºn necesidades",
                example: "Muchos miembros en crisis financiera Ã¢â€ â€™ 'EnseÃƒÂ±ar sobre mayordomÃƒÂ­a'",
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
              CÃƒÂ³mo Acceder a las AnalÃƒÂ­ticas Inteligentes
            </h4>
            <ol className="text-sm space-y-2 ml-4">
              <li>1. MenÃƒÂº izquierdo Ã¢â€ â€™ <strong>AnalÃƒÂ­ticas</strong></li>
              <li>2. Clic en <strong>AnalÃƒÂ­ticas Inteligentes</strong></li>
              <li>3. Selecciona el mÃƒÂ³dulo que quieres ver (RetenciÃƒÂ³n, Predicciones, etc.)</li>
              <li>4. Lee las recomendaciones del sistema</li>
              <li>5. Toma acciÃƒÂ³n segÃƒÂºn las sugerencias</li>
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
            Descarga grÃƒÂ¡ficas y tablas para presentaciones o reuniones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                format: "PDF Ejecutivo",
                icon: "",
                description: "Reporte profesional con grÃƒÂ¡ficas para imprimir",
                best: "Presentaciones a la junta directiva, reuniones anuales",
                includes: ["Logo de la iglesia", "GrÃƒÂ¡ficas en color", "Resumen ejecutivo", "Firma digital"]
              },
              {
                format: "Excel Avanzado",
                icon: "",
                description: "Hojas de cÃƒÂ¡lculo con todos los datos crudos",
                best: "AnÃƒÂ¡lisis profundo, crear tus propias grÃƒÂ¡ficas",
                includes: ["MÃƒÂºltiples pestaÃƒÂ±as", "Filtros automÃƒÂ¡ticos", "FÃƒÂ³rmulas", "Tablas dinÃƒÂ¡micas"]
              },
              {
                format: "CSV Estructurado",
                icon: "",
                description: "Datos en texto plano, compatible con todo",
                best: "Importar a otros sistemas, respaldos",
                includes: ["Formato universal", "Ligero", "Compatible", "FÃƒÂ¡cil de leer"]
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
                        <li key={idx}>Ã¢â‚¬Â¢ {item}</li>
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
              <li>1. Ve a la secciÃƒÂ³n de AnalÃƒÂ­ticas que quieres exportar</li>
              <li>2. Haz clic en el botÃƒÂ³n <strong>&quot;Exportar&quot;</strong> (arriba a la derecha)</li>
              <li>3. Selecciona el formato (PDF, Excel, o CSV)</li>
              <li>4. Elige el rango de fechas (ÃƒÂºltimo mes, trimestre, aÃƒÂ±o)</li>
              <li>5. Haz clic en <strong>&quot;Descargar Reporte&quot;</strong></li>
              <li>6. Ã‚Â¡El archivo se descargarÃƒÂ¡ a tu computadora!</li>
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
            Puedes decidir quÃƒÂ© tarjetas ver y en quÃƒÂ© orden. Ã‚Â¡Hazlo tu dashboard ideal!
          </p>

          <div className="space-y-3">
            <div className="bg-[hsl(var(--destructive)/0.08)] p-3 rounded">
              <h5 className="font-medium text-sm mb-2"> CÃƒÂ³mo Personalizar:</h5>
              <ul className="text-xs space-y-1 ml-4">
                <li>1. En tu Dashboard, haz clic en el botÃƒÂ³n Ã¯Â¸Â &quot;Personalizar&quot; (arriba a la derecha)</li>
                <li>2. Arrastra las tarjetas para cambiar el orden</li>
                <li>3. Marca/desmarca casillas para mostrar u ocultar tarjetas</li>
                <li>4. Haz clic en &quot;Guardar ConfiguraciÃƒÂ³n&quot;</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-3 text-xs">
              <div className="bg-[hsl(var(--success)/0.10)] p-3 rounded">
                <p className="font-medium text-[hsl(var(--success))] mb-1"> Ideas de PersonalizaciÃƒÂ³n:</p>
                <ul className="space-y-1 text-[hsl(var(--success))]">
                  <li>Ã¢â‚¬Â¢ Si eres pastor: Prioriza miembros y eventos</li>
                  <li>Ã¢â‚¬Â¢ Si eres tesorero: Finanzas arriba</li>
                  <li>Ã¢â‚¬Â¢ Si lideras jÃƒÂ³venes: Solo ver jÃƒÂ³venes</li>
                  <li>Ã¢â‚¬Â¢ Oculta tarjetas que no usas</li>
                </ul>
              </div>
              <div className="bg-[hsl(var(--info)/0.10)] p-3 rounded">
                <p className="font-medium text-[hsl(var(--info))] mb-1"> Consejo:</p>
                <p className="text-[hsl(var(--info))]">
                  Tu personalizaciÃƒÂ³n se guarda automÃƒÂ¡ticamente. La prÃƒÂ³xima vez que entres, 
                  verÃƒÂ¡s TU dashboard personalizado, no el de otros usuarios.
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
            Problemas Comunes con AnalÃƒÂ­ticas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              problem: " Los nÃƒÂºmeros no se actualizan / estÃƒÂ¡n desactualizados",
              solutions: [
                "Espera 5-10 segundos - el sistema actualiza cada pocos segundos",
                "Refresca la pÃƒÂ¡gina (F5 o botÃƒÂ³n de recargar del navegador)",
                "Verifica que tu conexiÃƒÂ³n a internet estÃƒÂ© funcionando",
                "Si persiste, cierra sesiÃƒÂ³n y vuelve a entrar"
              ]
            },
            {
              problem: " Las grÃƒÂ¡ficas no se muestran / salen en blanco",
              solutions: [
                "Verifica que tengas datos en ese rango de fechas",
                "Cambia el filtro de fechas (por ejemplo, ÃƒÂºltimos 6 meses en vez de ÃƒÂºltimo mes)",
                "Intenta con otro navegador (Chrome funciona mejor)",
                "Desactiva bloqueadores de anuncios (pueden bloquear grÃƒÂ¡ficas)"
              ]
            },
            {
              problem: " No puedo exportar reportes (botÃƒÂ³n no funciona)",
              solutions: [
                "Verifica que tienes permiso de ADMIN o PASTOR",
                "AsegÃƒÂºrate que seleccionaste un rango de fechas",
                "Intenta descargar en formato PDF primero (es mÃƒÂ¡s ligero)",
                "Si el reporte es muy grande (1000+ registros), divide en meses"
              ]
            },
            {
              problem: " Las predicciones de IA parecen incorrectas",
              solutions: [
                "La IA necesita mÃƒÂ­nimo 3 meses de datos para ser precisa",
                "Verifica que los datos ingresados sean correctos",
                "Las predicciones mejoran con el tiempo - sÃƒÂ© paciente",
                "Si ves algo muy raro, reporta al soporte tÃƒÂ©cnico"
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
            Ã‚Â¡Felicidades! Completaste el Onboarding
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-6">
            <div className="text-6xl mb-4"></div>
            <h3 className="text-2xl font-bold text-[hsl(var(--success))] mb-2">
              Ã‚Â¡Ya Sabes Usar Khesed-tek!
            </h3>
            <p className="text-muted-foreground mb-6">
              Completaste las 6 fases del onboarding. Ahora estÃƒÂ¡s listo para administrar 
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
              { phase: "Fase 6", name: "AnalÃƒÂ­ticas Dominadas", icon: "" }
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
              PrÃƒÂ³ximos Pasos Recomendados
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
                  <strong>Configura automatizaciones:</strong> Emails automÃƒÂ¡ticos, recordatorios, seguimientos
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Invita a tu equipo:</strong> Agrega pastores, lÃƒÂ­deres, y voluntarios al sistema
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Revisa la guÃƒÂ­a completa de funciones:</strong> 70+ funciones disponibles
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
