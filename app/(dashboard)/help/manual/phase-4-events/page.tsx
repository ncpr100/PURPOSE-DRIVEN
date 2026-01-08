'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Calendar, CalendarPlus, Clock, MapPin, Users, QrCode,
  CheckCircle, ArrowRight, Heart, Lightbulb, AlertTriangle,
  Star, Target, Video, Music, Book, Coffee, Gift, Bell,
  Ticket, UserCheck, BarChart, Download, Mail, MessageSquare, Brain
} from 'lucide-react'
import Link from 'next/link'

export default function Phase4EventsGuide() {
  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-8 rounded-lg">
        <div className="flex items-center gap-4">
          <Calendar className="h-12 w-12" />
          <div>
            <h1 className="text-4xl font-bold mb-2">📅 Sistema Inteligente de Eventos</h1>
            <p className="text-xl opacity-90">
              Planificación completa con IA, gestión de voluntarios, y comunicaciones automatizadas
            </p>
          </div>
        </div>
        <div className="mt-6 flex gap-4 text-sm">
          <Badge variant="secondary" className="bg-white/20 text-white">
            <Target className="h-3 w-3 mr-1" />
            Sistema Unificado
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white">
            <Star className="h-3 w-3 mr-1" />
            8 Módulos Integrados
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white">
            <Star className="h-3 w-3 mr-1" />
            15 minutos
          </Badge>
        </div>
      </div>

      {/* Para Niños */}
      <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
        <h4 className="font-bold text-yellow-900 flex items-center gap-2 mb-2">
          <Heart className="h-5 w-5" />
          Para Niños: ¿Qué es el Sistema Inteligente de Eventos?
        </h4>
        <p className="text-sm text-yellow-800">
          Es como tener un asistente súper inteligente que te ayuda a organizar fiestas y reuniones de la iglesia. 
          No solo creas el evento, ¡también te ayuda a encontrar voluntarios, enviar invitaciones automáticas, 
          reservar salones y equipos, llevar el control del dinero, y ver quién asistió! Todo en un solo lugar, 
          sin tener que usar muchas apps diferentes. ¡Es como magia organizada! ✨
        </p>
      </div>

      {/* Sistema Overview */}
      <Card className="border-purple-300 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Star className="h-8 w-8 text-purple-600" />
            Módulos del Sistema Inteligente de Eventos
          </CardTitle>
          <CardDescription className="text-base mt-2">
            8 pestañas integradas para gestión completa de eventos
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Calendar className="h-6 w-6 text-blue-600" />, name: "Planificación", desc: "Crear y editar eventos", status: "✅ Funcional" },
            { icon: <UserCheck className="h-6 w-6 text-green-600" />, name: "Voluntarios", desc: "Auto-asignación IA", status: "✅ Funcional" },
            { icon: <Users className="h-6 w-6 text-purple-600" />, name: "Miembros", desc: "Gestión de asistentes", status: "🔄 En desarrollo" },
            { icon: <Coffee className="h-6 w-6 text-orange-600" />, name: "Recursos", desc: "Equipos y espacios", status: "✅ Funcional" },
            { icon: <MessageSquare className="h-6 w-6 text-pink-600" />, name: "Comunicaciones", desc: "Invitaciones automáticas", status: "🔄 En desarrollo" },
            { icon: <Gift className="h-6 w-6 text-yellow-600" />, name: "Presupuesto", desc: "Control de gastos", status: "🔄 En desarrollo" },
            { icon: <BarChart className="h-6 w-6 text-indigo-600" />, name: "Analíticas", desc: "Reportes y métricas", status: "🔄 En desarrollo" },
            { icon: <CalendarPlus className="h-6 w-6 text-teal-600" />, name: "Calendario", desc: "Vista mensual", status: "🔄 En desarrollo" }
          ].map((module, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow bg-white">
              <CardContent className="pt-4 text-center">
                <div className="mb-2 flex justify-center">{module.icon}</div>
                <h4 className="font-semibold mb-1 text-sm">{module.name}</h4>
                <p className="text-xs text-gray-600 mb-2">{module.desc}</p>
                <Badge variant="outline" className="text-xs">{module.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Tipos de Eventos */}
      <Card className="border-blue-300">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Gift className="h-6 w-6" />
            Tipos de Eventos que Puedes Crear
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: <Book className="h-8 w-8 text-purple-600" />, name: "CULTO", example: "Culto Principal - Domingos 10am" },
              { icon: <Music className="h-8 w-8 text-pink-600" />, name: "CONFERENCIA", example: "Conferencia de Avivamiento 2026" },
              { icon: <Users className="h-8 w-8 text-blue-600" />, name: "SOCIAL", example: "Desayuno de Parejas, Día de Campo" },
              { icon: <Video className="h-8 w-8 text-red-600" />, name: "CAPACITACION", example: "Escuela de Liderazgo" },
              { icon: <Coffee className="h-8 w-8 text-orange-600" />, name: "SERVICIO", example: "Retiro de Jóvenes - Montaña" },
              { icon: <Star className="h-8 w-8 text-yellow-600" />, name: "OTRO", example: "Noche de Navidad, Bautismos" }
            ].map((type, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="mb-3 flex justify-center">{type.icon}</div>
                  <h4 className="font-semibold mb-2">{type.name}</h4>
                  <p className="text-xs text-gray-600 italic">{type.example}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workflow Completo */}
      <Card className="border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <ArrowRight className="h-8 w-8 text-green-600" />
            Flujo de Trabajo Completo: De Creación a Reporte
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Cómo funciona el sistema de principio a fin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-bold text-lg text-green-800 flex items-center gap-2">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</div>
                PLANIFICACIÓN (Pestaña: Planificación)
              </h4>
              <Card className="bg-white">
                <CardContent className="pt-4 space-y-2 text-sm">
                  <p className="font-medium">📝 Crear Evento:</p>
                  <ul className="ml-4 space-y-1 text-gray-700">
                    <li>• Clic en "+ Nuevo Evento"</li>
                    <li>• Título, descripción, categoría (CULTO, CONFERENCIA, etc.)</li>
                    <li>• Fecha/hora inicio y fin</li>
                    <li>• Ubicación física o virtual</li>
                    <li>• Presupuesto estimado (en USD $)</li>
                    <li>• Público o privado</li>
                  </ul>
                  <p className="font-medium mt-3">✏️ Editar Evento:</p>
                  <ul className="ml-4 space-y-1 text-gray-700">
                    <li>• Clic en botón "Editar" en la tarjeta del evento</li>
                    <li>• Modificar cualquier campo</li>
                    <li>• Guardar cambios</li>
                  </ul>
                  <p className="font-medium mt-3">💡 Sugerencias IA:</p>
                  <ul className="ml-4 space-y-1 text-gray-700">
                    <li>• Botón "Generar Sugerencias IA"</li>
                    <li>• Sistema sugiere título, descripción, horarios</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-lg text-blue-800 flex items-center gap-2">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</div>
                AUTO-ASIGNACIÓN (Botón: Auto-Asignar)
              </h4>
              <Card className="bg-white">
                <CardContent className="pt-4 space-y-2 text-sm">
                  <p className="font-medium">🤖 IA Asigna Voluntarios:</p>
                  <ul className="ml-4 space-y-1 text-gray-700">
                    <li>• Clic en "Auto-Asignar" en tarjeta de evento</li>
                    <li>• Sistema analiza habilidades de voluntarios</li>
                    <li>• Verifica disponibilidad en calendario</li>
                    <li>• Balancea carga de trabajo</li>
                    <li>• Asigna automáticamente roles</li>
                  </ul>
                  <p className="font-medium mt-3">👥 Roles Típicos:</p>
                  <ul className="ml-4 space-y-1 text-gray-700">
                    <li>• Sonido y multimedia</li>
                    <li>• Recepción y acomodadores</li>
                    <li>• Alabanza y música</li>
                    <li>• Cocina y refrigerios</li>
                    <li>• Limpieza y logística</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-lg text-purple-800 flex items-center gap-2">
                <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">3</div>
                RECURSOS (Pestaña: Recursos)
              </h4>
              <Card className="bg-white">
                <CardContent className="pt-4 space-y-2 text-sm">
                  <p className="font-medium">🎛️ Gestión de Recursos:</p>
                  <ul className="ml-4 space-y-1 text-gray-700">
                    <li>• Crear recursos (EQUIPO, ESPACIO, MATERIAL)</li>
                    <li>• Ejemplo: Proyector, Auditorio, Sillas</li>
                    <li>• Reservar para evento específico</li>
                    <li>• Ver conflictos de disponibilidad</li>
                  </ul>
                  <p className="font-medium mt-3">📦 Tipos de Recursos:</p>
                  <ul className="ml-4 space-y-1 text-gray-700">
                    <li>• EQUIPO: Proyectores, micrófonos, cámaras</li>
                    <li>• ESPACIO: Auditorio, salones, estacionamiento</li>
                    <li>• MATERIAL: Biblias, folletos, decoraciones</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-lg text-pink-800 flex items-center gap-2">
                <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">4</div>
                COMUNICACIONES (Botón: Comunicar)
              </h4>
              <Card className="bg-white">
                <CardContent className="pt-4 space-y-2 text-sm">
                  <p className="font-medium">📧 Invitaciones Automáticas:</p>
                  <ul className="ml-4 space-y-1 text-gray-700">
                    <li>• Clic en "Comunicar" en tarjeta de evento</li>
                    <li>• Seleccionar audiencia (todos, miembros, líderes)</li>
                    <li>• Mensaje personalizado</li>
                    <li>• Envío por EMAIL, SMS, PUSH, SOCIAL</li>
                    <li>• Programar recordatorios 24h/1h antes</li>
                  </ul>
                  <p className="font-medium mt-3">🔔 Estados:</p>
                  <ul className="ml-4 space-y-1 text-gray-700">
                    <li>• BORRADOR: Guardado sin enviar</li>
                    <li>• PROGRAMADA: Agendada para envío</li>
                    <li>• ENVIADA: Comunicación entregada</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300">
            <CardContent className="pt-4">
              <h4 className="font-bold text-lg text-orange-800 flex items-center gap-2 mb-3">
                <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">5</div>
                CHECK-IN Y ASISTENCIA (Durante el Evento)
              </h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-semibold text-green-800 mb-2">👥 Miembros</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Escaneo de QR personal</li>
                    <li>• Registro automático en tabla check_ins</li>
                    <li>• Guarda: nombre, email, phone, fecha/hora</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-semibold text-blue-800 mb-2">👶 Niños</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Sistema separado children_check_ins</li>
                    <li>• Control de padres/tutores</li>
                    <li>• Seguridad y rastreo</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-semibold text-purple-800 mb-2">🆕 Visitantes</p>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Mismo tabla check_ins</li>
                    <li>• Registro manual al momento</li>
                    <li>• Captura datos para seguimiento</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-bold text-lg text-indigo-800 flex items-center gap-2">
                <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">6</div>
                PRESUPUESTO (Pestaña: Presupuesto)
              </h4>
              <Card className="bg-white">
                <CardContent className="pt-4 space-y-2 text-sm">
                  <p className="font-medium">💰 Control de Gastos:</p>
                  <ul className="ml-4 space-y-1 text-gray-700">
                    <li>• Presupuesto estimado vs real</li>
                    <li>• Registro de donaciones específicas</li>
                    <li>• Métodos: EFECTIVO, TRANSFERENCIA, TARJETA, ONLINE</li>
                    <li>• Tracking por categoría</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-2 italic">⚠️ Módulo en desarrollo - próximamente completo</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-lg text-teal-800 flex items-center gap-2">
                <div className="bg-teal-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">7</div>
                ANALÍTICAS (Pestaña: Analíticas)
              </h4>
              <Card className="bg-white">
                <CardContent className="pt-4 space-y-2 text-sm">
                  <p className="font-medium">📊 Reportes y Métricas:</p>
                  <ul className="ml-4 space-y-1 text-gray-700">
                    <li>• Total de asistentes vs esperados</li>
                    <li>• Tasa de asistencia (%)</li>
                    <li>• Promedio de llegada</li>
                    <li>• Nuevos visitantes identificados</li>
                    <li>• Exportar Excel/PDF</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-2 italic">⚠️ Módulo en desarrollo - próximamente completo</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="bg-gradient-to-r from-gray-50 to-slate-100 border-gray-300">
            <CardContent className="pt-4">
              <h4 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-3">
                <div className="bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">8</div>
                CALENDARIO (Pestaña: Calendario)
              </h4>
              <p className="text-sm text-gray-700">
                Vista mensual y semanal de todos los eventos, con drag-and-drop para reagendar, 
                vista de conflictos de recursos, y sincronización con calendarios externos.
              </p>
              <p className="text-xs text-gray-500 mt-2 italic">⚠️ Módulo en desarrollo - próximamente completo</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Crear Evento Paso a Paso */}
      <Card className="border-orange-300">
        <CardHeader className="bg-orange-50">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="bg-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              1
            </div>
            Crear Tu Primer Evento (Paso a Paso)
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Aprende creando un culto dominical de ejemplo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            {[
              {
                step: "1.1",
                title: "Ir a la Sección de Eventos",
                icon: <Calendar className="h-5 w-5 text-blue-600" />,
                image: "📅",
                description: "En el menú izquierdo, haz clic en 'Eventos'",
                tips: ["Busca el ícono de calendario", "Verás la lista de eventos actuales"]
              },
              {
                step: "1.2",
                title: "Hacer Clic en '+ Nuevo Evento'",
                icon: <CalendarPlus className="h-5 w-5 text-green-600" />,
                image: "➕",
                description: "Botón verde arriba a la derecha",
                tips: ["Se abrirá un formulario para llenar", "Puedes cancelar en cualquier momento"]
              },
              {
                step: "1.3",
                title: "Información Básica del Evento",
                icon: <CheckCircle className="h-5 w-5 text-orange-600" />,
                image: "✏️",
                description: "Completa estos campos esenciales:",
                details: [
                  {
                    field: "Nombre del Evento *",
                    example: "Culto Dominical - Alabanza y Adoración",
                    icon: "📝"
                  },
                  {
                    field: "Descripción",
                    example: "Culto principal con predicación del Pastor Juan, alabanza con el grupo Crystal, y oración por los enfermos",
                    icon: "📄"
                  },
                  {
                    field: "Tipo de Evento",
                    example: "Selecciona: Culto, Conferencia, Retiro, Social, Otro",
                    icon: "🏷️"
                  },
                  {
                    field: "Fecha *",
                    example: "12/01/2026 (próximo domingo)",
                    icon: "📆"
                  },
                  {
                    field: "Hora de Inicio *",
                    example: "10:00 AM",
                    icon: "🕐"
                  },
                  {
                    field: "Hora de Finalización",
                    example: "12:30 PM",
                    icon: "🕐"
                  }
                ]
              },
              {
                step: "1.4",
                title: "Ubicación del Evento",
                icon: <MapPin className="h-5 w-5 text-red-600" />,
                image: "📍",
                description: "Indica dónde será el evento:",
                details: [
                  {
                    field: "Lugar",
                    example: "Templo Principal - Iglesia El Buen Pastor",
                    icon: "🏛️"
                  },
                  {
                    field: "Dirección Completa",
                    example: "Carrera 15 #20-30, Bogotá, Colombia",
                    icon: "🗺️"
                  },
                  {
                    field: "Enlace de Mapa (Opcional)",
                    example: "https://maps.google.com/?q=tu-iglesia",
                    icon: "🔗"
                  },
                  {
                    field: "¿Es Virtual?",
                    example: "Marca esta casilla si es por Zoom/YouTube",
                    icon: "💻"
                  },
                  {
                    field: "Enlace Virtual",
                    example: "https://zoom.us/j/123456789 o enlace de YouTube",
                    icon: "🎥"
                  }
                ]
              },
              {
                step: "1.5",
                title: "Capacidad y Registro",
                icon: <Users className="h-5 w-5 text-purple-600" />,
                image: "👥",
                description: "Configura límites de asistencia:",
                details: [
                  {
                    field: "Capacidad Máxima",
                    example: "150 personas (deja vacío si no hay límite)",
                    icon: "🎫"
                  },
                  {
                    field: "¿Requiere Inscripción?",
                    example: "Marca SÍ si la gente debe registrarse antes",
                    icon: "✅"
                  },
                  {
                    field: "Fecha Límite de Inscripción",
                    example: "11/01/2026 (un día antes del evento)",
                    icon: "⏰"
                  },
                  {
                    field: "¿Requiere Pago?",
                    example: "Marca SÍ si hay costo de entrada",
                    icon: "💰"
                  },
                  {
                    field: "Precio (si aplica)",
                    example: "$50,000 COP para retiros con alimentación",
                    icon: "💵"
                  }
                ]
              },
              {
                step: "1.6",
                title: "Guardar y Publicar",
                icon: <Star className="h-5 w-5 text-yellow-600" />,
                image: "💾",
                description: "Finaliza la creación del evento",
                tips: [
                  "Haz clic en 'Guardar Borrador' para guardarlo sin publicar",
                  "O 'Publicar Evento' para que todos lo vean inmediatamente",
                  "Puedes editar el evento después si necesitas cambiar algo",
                  "¡Aparecerá un mensaje de confirmación verde!"
                ]
              }
            ].map((item, index) => (
              <Card key={index} className="border-l-4 border-l-orange-500">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{item.image}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {item.icon}
                        <h5 className="font-semibold text-lg">
                          Paso {item.step}: {item.title}
                        </h5>
                      </div>
                      <p className="text-gray-700 mb-3">{item.description}</p>
                      
                      {item.details && (
                        <div className="space-y-2 mb-3">
                          {item.details.map((detail: any, idx: number) => (
                            <div key={idx} className="bg-gray-50 p-3 rounded">
                              <p className="font-medium text-sm text-orange-800">
                                {detail.icon} {detail.field}
                              </p>
                              <p className="text-xs text-gray-600 mt-1 italic">
                                {detail.example}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {item.tips && (
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <p className="text-xs font-medium text-orange-800 mb-2">
                            💡 Consejos:
                          </p>
                          <ul className="text-xs text-orange-700 space-y-1">
                            {item.tips.map((tip, idx) => (
                              <li key={idx}>• {tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sistema de Check-In con QR */}
      <Card className="border-green-300">
        <CardHeader className="bg-green-50">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <QrCode className="h-8 w-8" />
            Sistema de Check-In con Código QR
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Toma asistencia automáticamente - ¡sin papel ni lapicero!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
            <h4 className="font-bold text-yellow-900 flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5" />
              ¿Cómo Funciona el Check-In con QR?
            </h4>
            <p className="text-sm text-yellow-800 mb-3">
              Imagina que cada persona tiene un código de barras especial (código QR). Cuando 
              llegan al evento, escanean su código con su celular o tú lo escaneas, y ¡listo! 
              El sistema registra automáticamente que asistieron. ¡No más listas de papel!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-lg">Método 1: Auto Check-In</CardTitle>
                <CardDescription>Los miembros se registran ellos mismos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-2">
                  <p className="font-medium">📱 Pasos para el Miembro:</p>
                  <ol className="space-y-2 ml-4">
                    <li>1. Reciben un email/SMS con el código QR del evento</li>
                    <li>2. Al llegar, abren el código QR en su celular</li>
                    <li>3. Escanean el código en el punto de entrada</li>
                    <li>4. ¡Confirmación instantánea de asistencia!</li>
                  </ol>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-xs font-medium text-green-800">✅ Ventajas:</p>
                  <ul className="text-xs text-green-700 space-y-1 mt-1">
                    <li>• Rápido y sin contacto</li>
                    <li>• No necesitas personal en la puerta</li>
                    <li>• Perfecto para eventos grandes (100+ personas)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-lg">Método 2: Check-In Manual</CardTitle>
                <CardDescription>Tú registras a cada persona</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-2">
                  <p className="font-medium">👆 Pasos para el Administrador:</p>
                  <ol className="space-y-2 ml-4">
                    <li>1. Ve a Eventos → [Tu Evento] → Check-Ins</li>
                    <li>2. Haz clic en &quot;Registrar Asistencia Manual&quot;</li>
                    <li>3. Busca el nombre de la persona en la lista</li>
                    <li>4. Marca la casilla de &quot;Asistió&quot;</li>
                  </ol>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-xs font-medium text-blue-800">✅ Ventajas:</p>
                  <ul className="text-xs text-blue-700 space-y-1 mt-1">
                    <li>• Útil para personas sin celular</li>
                    <li>• Mejor para eventos pequeños (10-30 personas)</li>
                    <li>• Puedes registrar visitantes nuevos al momento</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-purple-50">
            <CardContent className="pt-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <BarChart className="h-5 w-5 text-purple-600" />
                Ver Estadísticas de Asistencia
              </h4>
              <div className="space-y-2 text-sm">
                <p>Después del evento, puedes ver:</p>
                <ul className="space-y-1 ml-4">
                  <li>✓ <strong>Total de asistentes:</strong> Cuántas personas vinieron</li>
                  <li>✓ <strong>Tasa de asistencia:</strong> % de inscritos que realmente llegaron</li>
                  <li>✓ <strong>Hora de llegada:</strong> A qué hora llegó cada persona</li>
                  <li>✓ <strong>Nuevos visitantes:</strong> Personas que vienen por primera vez</li>
                  <li>✓ <strong>Exportar lista:</strong> Descarga Excel de todos los asistentes</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Gestión de Eventos */}
      <Card className="border-teal-300">
        <CardHeader className="bg-teal-50">
          <CardTitle className="flex items-center gap-3 text-xl">
            <UserCheck className="h-6 w-6" />
            Gestionar Eventos Después de Crearlos
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                action: "Editar Evento",
                icon: <CheckCircle className="h-6 w-6 text-blue-600" />,
                description: "Cambiar fecha, hora, lugar, o cualquier detalle",
                how: "Eventos → [Tu Evento] → Botón 'Editar'"
              },
              {
                action: "Enviar Recordatorios",
                icon: <Bell className="h-6 w-6 text-orange-600" />,
                description: "Email/SMS automático 24h antes del evento",
                how: "Activa en Configuración del Evento → Notificaciones"
              },
              {
                action: "Ver Inscritos",
                icon: <Users className="h-6 w-6 text-purple-600" />,
                description: "Lista de personas que se registraron",
                how: "Eventos → [Tu Evento] → Pestaña 'Inscritos'"
              },
              {
                action: "Descargar Reportes",
                icon: <Download className="h-6 w-6 text-green-600" />,
                description: "Exportar asistencia, estadísticas, etc.",
                how: "Eventos → [Tu Evento] → Botón 'Exportar'"
              },
              {
                action: "Duplicar Evento",
                icon: <CalendarPlus className="h-6 w-6 text-pink-600" />,
                description: "Copiar evento para la próxima semana/mes",
                how: "Eventos → Menú de opciones → 'Duplicar'"
              },
              {
                action: "Cancelar Evento",
                icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
                description: "Cancelar y notificar automáticamente a inscritos",
                how: "Eventos → [Tu Evento] → 'Cancelar y Notificar'"
              }
            ].map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    {item.icon}
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{item.action}</h4>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <div className="bg-gray-50 p-2 rounded text-xs text-gray-700">
                        📍 {item.how}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AUTO-ASIGNAR Deep Dive */}
      <Card className="border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl text-blue-900">
            <Brain className="h-8 w-8" />
            🤖 Cómo Funciona AUTO-ASIGNAR (Asignación Inteligente)
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Entender el algoritmo de IA para optimizar asignaciones de voluntarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
            <h4 className="font-bold text-yellow-900 flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5" />
              ¿Qué hace el botón AUTO-ASIGNAR?
            </h4>
            <p className="text-sm text-yellow-800 mb-2">
              Cuando haces clic en &quot;Auto-Asignar&quot;, la Inteligencia Artificial del sistema analiza 
              TODOS tus voluntarios activos y selecciona automáticamente los mejores 5 para el evento 
              basándose en habilidades, experiencia, disponibilidad, y carga de trabajo. ¡En segundos!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-bold text-lg text-blue-800 flex items-center gap-2">
                <CheckCircle className="h-6 w-6" />
                ¿Qué verás cuando hagas clic?
              </h4>
              <Card className="bg-white border-green-200">
                <CardContent className="pt-4 space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">1️⃣</div>
                    <div>
                      <p className="font-medium text-green-800">Botón cambia a &quot;Asignando...&quot;</p>
                      <p className="text-gray-600 text-xs">Con icono giratorio y bloqueado para evitar doble-clic</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">2️⃣</div>
                    <div>
                      <p className="font-medium text-blue-800">Notificación: &quot;🎯 Asignando voluntarios...&quot;</p>
                      <p className="text-gray-600 text-xs">Aparece en la esquina superior derecha</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">3️⃣</div>
                    <div>
                      <p className="font-medium text-green-800">Resultado: &quot;✅ 3 voluntarios asignados&quot;</p>
                      <p className="text-gray-600 text-xs">O mensaje de advertencia si no hay disponibles</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">4️⃣</div>
                    <div>
                      <p className="font-medium text-purple-800">Tarjeta se actualiza automáticamente</p>
                      <p className="text-gray-600 text-xs">Muestra el nuevo número de voluntarios asignados</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-lg text-purple-800 flex items-center gap-2">
                <Brain className="h-6 w-6" />
                Algoritmo de Selección (5 Factores)
              </h4>
              <Card className="bg-white border-purple-200">
                <CardContent className="pt-4 space-y-2 text-sm">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded">
                    <p className="font-semibold text-purple-900 mb-1">1. Coincidencia de Habilidades (+30 puntos)</p>
                    <p className="text-xs text-purple-700">
                      Evento &quot;Culto&quot; → Prioriza voluntarios con habilidades: &quot;Música&quot;, &quot;Alabanza&quot;, &quot;Ujieres&quot;
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded">
                    <p className="font-semibold text-green-900 mb-1">2. Disponibilidad (CRÍTICO)</p>
                    <p className="text-xs text-green-700">
                      ✅ Solo voluntarios ACTIVOS<br/>
                      ✅ Sin conflictos de horario (no doble-reserva)<br/>
                      ✅ No asignados ya a este evento
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded">
                    <p className="font-semibold text-blue-900 mb-1">3. Experiencia (+25 puntos máx)</p>
                    <p className="text-xs text-blue-700">
                      Más asignaciones previas = Mayor experiencia = Más puntos
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-3 rounded">
                    <p className="font-semibold text-orange-900 mb-1">4. Balance de Carga (-10 por asignación)</p>
                    <p className="text-xs text-orange-700">
                      Penaliza voluntarios con muchas tareas actuales para distribuir equitativamente
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-indigo-50 to-violet-50 p-3 rounded">
                    <p className="font-semibold text-indigo-900 mb-1">5. Asignación de Rol Automática</p>
                    <p className="text-xs text-indigo-700">
                      CULTO → Ujieres, Audio, Músico<br/>
                      SOCIAL → Cocina, Coordinador, Limpieza
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="bg-gradient-to-r from-teal-50 to-green-50 border-teal-300">
            <CardContent className="pt-4">
              <h4 className="font-bold text-lg text-teal-900 mb-3 flex items-center gap-2">
                <Target className="h-6 w-6" />
                Límites y Reglas del Sistema
              </h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-3 rounded-lg border-l-4 border-l-teal-600">
                  <p className="font-semibold text-teal-900 mb-1">📊 Máximo por Evento</p>
                  <p className="text-gray-700">Asigna <strong>hasta 5 voluntarios</strong> automáticamente</p>
                </div>
                <div className="bg-white p-3 rounded-lg border-l-4 border-l-blue-600">
                  <p className="font-semibold text-blue-900 mb-1">🎯 Selección</p>
                  <p className="text-gray-700">Escoge los <strong>TOP 5</strong> con mayor puntuación</p>
                </div>
                <div className="bg-white p-3 rounded-lg border-l-4 border-l-purple-600">
                  <p className="font-semibold text-purple-900 mb-1">🔄 Repetible</p>
                  <p className="text-gray-700">Puedes hacer clic <strong>múltiples veces</strong> si necesitas más</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-white border-2 border-orange-300 rounded-lg p-6">
            <h4 className="font-bold text-xl text-orange-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Problemas Comunes con AUTO-ASIGNAR y Soluciones
            </h4>
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-l-red-600">
                <p className="font-semibold text-red-900 mb-2">❌ &quot;No se encontraron voluntarios elegibles&quot;</p>
                <p className="text-sm text-red-800 mb-2"><strong>Posibles Causas:</strong></p>
                <ul className="text-sm text-red-700 space-y-1 ml-4">
                  <li>✓ <strong>No tienes voluntarios activos</strong> - Ve a Voluntarios y activa algunos</li>
                  <li>✓ <strong>Todos están ocupados</strong> - Hay conflictos de horario con otros eventos</li>
                  <li>✓ <strong>Ya asignaste a todos</strong> - Todos los voluntarios ya están en este evento</li>
                  <li>✓ <strong>El evento ya pasó</strong> - Solo asigna a eventos futuros</li>
                </ul>
                <div className="mt-3 bg-white p-3 rounded">
                  <p className="text-xs font-semibold text-green-800">💡 Solución Rápida:</p>
                  <p className="text-xs text-gray-700">Ir a <strong>Voluntarios</strong> → Verificar estado ACTIVO → Revisar disponibilidad en calendario</p>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-l-yellow-600">
                <p className="font-semibold text-yellow-900 mb-2">⚠️ Solo asignó 1-2 voluntarios (menos de 5)</p>
                <p className="text-sm text-yellow-800 mb-2"><strong>Causas Normales:</strong></p>
                <ul className="text-sm text-yellow-700 space-y-1 ml-4">
                  <li>✓ Tienes pocos voluntarios en total (menos de 5 activos)</li>
                  <li>✓ Muchos tienen conflictos de horario</li>
                  <li>✓ Algunos ya están asignados a este evento</li>
                </ul>
                <div className="mt-3 bg-white p-3 rounded">
                  <p className="text-xs font-semibold text-blue-800">💡 Mejora:</p>
                  <p className="text-xs text-gray-700">Agregar más voluntarios al sistema o hacer <strong>asignación manual</strong> adicional</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-l-blue-600">
                <p className="font-semibold text-blue-900 mb-2">🔄 Los voluntarios asignados no coinciden con lo esperado</p>
                <p className="text-sm text-blue-800 mb-2"><strong>Explicación:</strong></p>
                <ul className="text-sm text-blue-700 space-y-1 ml-4">
                  <li>✓ El algoritmo prioriza <strong>disponibilidad</strong> sobre habilidades</li>
                  <li>✓ Balancea la carga de trabajo (no siempre escoge a los mismos)</li>
                  <li>✓ Puede que las habilidades no estén bien configuradas en el perfil</li>
                </ul>
                <div className="mt-3 bg-white p-3 rounded">
                  <p className="text-xs font-semibold text-purple-800">💡 Optimización:</p>
                  <p className="text-xs text-gray-700">
                    Ve a <strong>Voluntarios</strong> → Editar perfil → Actualizar <strong>Habilidades</strong> y <strong>Dones Espirituales</strong>
                  </p>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-l-green-600">
                <p className="font-semibold text-green-900 mb-2">💚 Cómo Mejorar la Precisión de AUTO-ASIGNAR</p>
                <div className="grid md:grid-cols-2 gap-3 mt-3">
                  <div className="bg-white p-3 rounded">
                    <p className="text-xs font-semibold text-green-800 mb-1">1. Actualiza Habilidades</p>
                    <p className="text-xs text-gray-600">
                      Agrega habilidades específicas: &quot;Música&quot;, &quot;Sonido&quot;, &quot;Cocina&quot;, &quot;Limpieza&quot;
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="text-xs font-semibold text-blue-800 mb-1">2. Marca Estado ACTIVO</p>
                    <p className="text-xs text-gray-600">
                      Solo voluntarios con estado &quot;ACTIVO&quot; son considerados
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="text-xs font-semibold text-purple-800 mb-1">3. Evita Doble-Reserva</p>
                    <p className="text-xs text-gray-600">
                      No programes eventos simultáneos si necesitas los mismos voluntarios
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="text-xs font-semibold text-orange-800 mb-1">4. Usa Categorías Correctas</p>
                    <p className="text-xs text-gray-600">
                      CULTO, CONFERENCIA, SOCIAL asignan roles diferentes automáticamente
                    </p>
                  </div>
                </div>
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
            Otros Problemas Comunes con Eventos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              problem: "❌ El código QR no funciona al escanearlo",
              solutions: [
                "Asegúrate que el evento esté publicado (no en borrador)",
                "Verifica que la fecha del evento no haya pasado",
                "Intenta con otra app de escaneo de QR (Google Lens, cámara nativa)",
                "Regenera el código QR desde el panel de administración"
              ]
            },
            {
              problem: "❌ No puedo editar un evento ya pasado",
              solutions: [
                "Los eventos pasados se archivan automáticamente",
                "Puedes ver las estadísticas pero no editar",
                "Si necesitas cambiar algo, duplica el evento y edita la copia"
              ]
            },
            {
              problem: "❌ Los inscritos no reciben el email de confirmación",
              solutions: [
                "Verifica en Configuración → Integraciones que el email esté configurado",
                "Revisa la carpeta de Spam del usuario",
                "Reenvía la confirmación manualmente desde el panel del evento"
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

      {/* Navigation */}
      <div className="flex justify-between">
        <Link href="/help/manual/phase-3-members">
          <Button variant="outline" size="lg">
            <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
            Fase Anterior: Miembros
          </Button>
        </Link>
        <Link href="/help/manual/phase-5-communications">
          <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
            ¡Siguiente! Comunicaciones
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
