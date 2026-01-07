'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Calendar, CalendarPlus, Clock, MapPin, Users, QrCode,
  CheckCircle, ArrowRight, Heart, Lightbulb, AlertTriangle,
  Star, Target, Video, Music, Book, Coffee, Gift, Bell,
  Ticket, UserCheck, BarChart, Download, Mail, MessageSquare
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
            <h1 className="text-4xl font-bold mb-2">📅 Fase 4: Crear y Gestionar Eventos</h1>
            <p className="text-xl opacity-90">
              Organiza cultos, retiros, conferencias y actividades especiales
            </p>
          </div>
        </div>
        <div className="mt-6 flex gap-4 text-sm">
          <Badge variant="secondary" className="bg-white/20 text-white">
            <Target className="h-3 w-3 mr-1" />
            Fase 4 de 6
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
          Para Niños: ¿Qué es un &quot;Evento&quot;?
        </h4>
        <p className="text-sm text-yellow-800">
          Un evento es como una fiesta o reunión especial de la iglesia. Puede ser el culto del 
          domingo, un retiro de jóvenes, una conferencia, un concierto de alabanza, o un día de 
          campo. En Khesed-tek puedes crear el evento, invitar personas, y ver quién asistió. 
          ¡Es como mandar invitaciones digitales y llevar la lista de asistencia automáticamente!
        </p>
      </div>

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
              { icon: <Book className="h-8 w-8 text-purple-600" />, name: "Cultos Dominicales", example: "Culto Principal - Domingos 10am" },
              { icon: <Music className="h-8 w-8 text-pink-600" />, name: "Conferencias", example: "Conferencia de Avivamiento 2026" },
              { icon: <Users className="h-8 w-8 text-blue-600" />, name: "Grupos Pequeños", example: "Célula Casa de Pedro - Miércoles" },
              { icon: <Video className="h-8 w-8 text-red-600" />, name: "Retiros", example: "Retiro de Jóvenes - Montaña" },
              { icon: <Coffee className="h-8 w-8 text-orange-600" />, name: "Actividades Sociales", example: "Desayuno de Parejas" },
              { icon: <Star className="h-8 w-8 text-yellow-600" />, name: "Eventos Especiales", example: "Noche de Navidad, Bautismos" }
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

      {/* Troubleshooting */}
      <Card className="border-red-300 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-900">
            <AlertTriangle className="h-6 w-6" />
            Problemas Comunes con Eventos
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
