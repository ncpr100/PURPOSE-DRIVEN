'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Mail, MessageSquare, Send, Users, Filter, Calendar,
  CheckCircle, ArrowRight, Heart, Lightbulb, AlertTriangle,
  Star, Target, Bell, Phone, Megaphone, Book, FileText,
  Image, Video, Smile, Clock, BarChart, Download, Edit
} from 'lucide-react'
import Link from 'next/link'

export default function Phase5CommunicationsGuide() {
  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-lg">
        <div className="flex items-center gap-4">
          <MessageSquare className="h-12 w-12" />
          <div>
            <h1 className="text-4xl font-bold mb-2">💬 Fase 5: Comunicaciones y Mensajería</h1>
            <p className="text-xl opacity-90">
              Envía emails, SMS, y notificaciones a tu congregación
            </p>
          </div>
        </div>
        <div className="mt-6 flex gap-4 text-sm">
          <Badge variant="secondary" className="bg-white/20 text-white">
            <Target className="h-3 w-3 mr-1" />
            Fase 5 de 6
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
          Para Niños: ¿Por Qué Usar Comunicaciones?
        </h4>
        <p className="text-sm text-yellow-800">
          Imagina que necesitas avisar a 100 personas sobre un evento especial. ¿Llamarías a 
          cada uno por teléfono? ¡Tardarías horas! Con Khesed-tek, escribes un solo mensaje y 
          se envía automáticamente a todos por email, mensaje de texto (SMS), o notificación. 
          ¡Es como tener un megáfono mágico que llega a todos al mismo tiempo!
        </p>
      </div>

      {/* Canales de Comunicación */}
      <Card className="border-blue-300">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Megaphone className="h-6 w-6" />
            3 Formas de Comunicarte con Tu Iglesia
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <Mail className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold text-lg mb-2">📧 Email</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Correos electrónicos profesionales con diseño bonito
                </p>
                <div className="bg-blue-50 p-3 rounded text-xs text-left">
                  <p className="font-medium mb-2">✅ Mejor Para:</p>
                  <ul className="space-y-1">
                    <li>• Newsletters semanales</li>
                    <li>• Invitaciones a eventos</li>
                    <li>• Estudios bíblicos</li>
                    <li>• Reportes mensuales</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <Phone className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-lg mb-2">📱 SMS</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Mensajes de texto cortos y urgentes
                </p>
                <div className="bg-green-50 p-3 rounded text-xs text-left">
                  <p className="font-medium mb-2">✅ Mejor Para:</p>
                  <ul className="space-y-1">
                    <li>• Recordatorios urgentes</li>
                    <li>• Cambios de último minuto</li>
                    <li>• Verificaciones rápidas</li>
                    <li>• Alertas de emergencia</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <Bell className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold text-lg mb-2">🔔 Notificaciones</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Push notifications en celulares
                </p>
                <div className="bg-purple-50 p-3 rounded text-xs text-left">
                  <p className="font-medium mb-2">✅ Mejor Para:</p>
                  <ul className="space-y-1">
                    <li>• Recordatorios de eventos</li>
                    <li>• Nuevas peticiones de oración</li>
                    <li>• Anuncios importantes</li>
                    <li>• Actualizaciones en vivo</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Enviar Email Masivo */}
      <Card className="border-purple-300">
        <CardHeader className="bg-purple-50">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              1
            </div>
            Enviar Tu Primer Email Masivo
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Aprende a enviar un email a toda tu congregación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            {[
              {
                step: "1.1",
                title: "Ir a Comunicaciones",
                icon: <MessageSquare className="h-5 w-5 text-blue-600" />,
                image: "💬",
                description: "En el menú izquierdo, haz clic en 'Comunicaciones'",
                tips: ["Busca el ícono de mensajes", "Verás tus comunicaciones anteriores"]
              },
              {
                step: "1.2",
                title: "Hacer Clic en '+ Nueva Comunicación'",
                icon: <Send className="h-5 w-5 text-green-600" />,
                image: "➕",
                description: "Botón verde arriba a la derecha para empezar",
                tips: ["Se abrirá el editor de mensajes", "Puedes elegir email, SMS, o notificación"]
              },
              {
                step: "1.3",
                title: "Seleccionar los Destinatarios",
                icon: <Users className="h-5 w-5 text-orange-600" />,
                image: "👥",
                description: "Elige a quién le quieres enviar el mensaje:",
                details: [
                  {
                    option: "📋 Todos los Miembros",
                    description: "Enviar a toda la congregación (cuidado, puede ser mucho!)",
                    when: "Anuncios generales importantes"
                  },
                  {
                    option: "🎯 Filtrar por Etapa",
                    description: "Solo VISITANTES, solo LÍDERES, solo NUEVOS CREYENTES",
                    when: "Mensajes específicos para cada grupo"
                  },
                  {
                    option: "📅 Filtrar por Evento",
                    description: "Solo quienes asistieron/se inscribieron a un evento",
                    when: "Seguimiento después de un retiro"
                  },
                  {
                    option: "✋ Selección Manual",
                    description: "Elegir personas específicas una por una",
                    when: "Mensaje a un grupo pequeño (10-20 personas)"
                  },
                  {
                    option: "🏷️ Por Etiquetas",
                    description: "Grupos personalizados (Jóvenes, Parejas, Niños)",
                    when: "Comunicaciones regulares a ministerios"
                  }
                ]
              },
              {
                step: "1.4",
                title: "Escribir el Asunto (Email) o Título",
                icon: <FileText className="h-5 w-5 text-purple-600" />,
                image: "✏️",
                description: "Crea un título atractivo que la gente quiera abrir:",
                examples: [
                  { bad: "❌ Información", good: "✅ ¡Retiro de Jóvenes - Cupos Limitados!" },
                  { bad: "❌ Mensaje importante", good: "✅ Cambio de Horario para Culto del Domingo" },
                  { bad: "❌ Newsletter", good: "✅ Lo Mejor de Esta Semana en la Iglesia 🌟" }
                ]
              },
              {
                step: "1.5",
                title: "Diseñar el Contenido del Mensaje",
                icon: <Edit className="h-5 w-5 text-pink-600" />,
                image: "🎨",
                description: "Usa el editor visual para crear un mensaje profesional:",
                features: [
                  { icon: "📝", name: "Texto Enriquecido", description: "Negrita, cursiva, colores" },
                  { icon: "🖼️", name: "Agregar Imágenes", description: "Logos, fotos de eventos" },
                  { icon: "🔗", name: "Enlaces", description: "Links a formularios o videos" },
                  { icon: "📊", name: "Listas y Tablas", description: "Organizar información" },
                  { icon: "😊", name: "Emojis", description: "Hacer mensajes más amigables" }
                ]
              },
              {
                step: "1.6",
                title: "Personalización Automática",
                icon: <Star className="h-5 w-5 text-yellow-600" />,
                image: "✨",
                description: "Usa variables para personalizar cada mensaje:",
                variables: [
                  { code: "{{nombre}}", result: "Hola Juan," },
                  { code: "{{primer_nombre}}", result: "¡Hola María!" },
                  { code: "{{iglesia}}", result: "Iglesia El Buen Pastor" },
                  { code: "{{fecha_evento}}", result: "Domingo 12 de Enero" }
                ],
                tip: "El sistema reemplaza automáticamente estas variables con datos reales de cada persona"
              },
              {
                step: "1.7",
                title: "Vista Previa y Prueba",
                icon: <CheckCircle className="h-5 w-5 text-green-600" />,
                image: "👀",
                description: "Antes de enviar a todos, prueba el mensaje:",
                steps: [
                  "Haz clic en 'Vista Previa' para ver cómo se verá",
                  "Usa 'Enviar Prueba' para recibirlo en TU email primero",
                  "Revisa ortografía, links, y diseño",
                  "Si todo está bien, continúa al siguiente paso"
                ]
              },
              {
                step: "1.8",
                title: "Programar o Enviar Ahora",
                icon: <Clock className="h-5 w-5 text-blue-600" />,
                image: "⏰",
                description: "Decide cuándo enviar el mensaje:",
                options: [
                  {
                    type: "Enviar Ahora",
                    description: "Se envía inmediatamente a todos los destinatarios",
                    best: "Para anuncios urgentes o cambios de último minuto"
                  },
                  {
                    type: "Programar Envío",
                    description: "Elige fecha y hora específica para enviar después",
                    best: "Para newsletters del domingo (programa el sábado en la noche)"
                  },
                  {
                    type: "Guardar Borrador",
                    description: "Guarda el mensaje sin enviar, edita después",
                    best: "Si aún no terminas o necesitas aprobación de otro pastor"
                  }
                ]
              }
            ].map((item, index) => (
              <Card key={index} className="border-l-4 border-l-purple-500">
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
                            <div key={idx} className="bg-purple-50 p-3 rounded">
                              <p className="font-medium text-sm text-purple-800">
                                {detail.option}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">{detail.description}</p>
                              <p className="text-xs text-blue-600 mt-1 italic">
                                💡 Cuándo usar: {detail.when}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {item.examples && (
                        <div className="bg-gray-50 p-3 rounded mb-3">
                          <p className="font-medium text-sm mb-2">📋 Ejemplos:</p>
                          {item.examples.map((ex: any, idx: number) => (
                            <div key={idx} className="text-xs mb-2">
                              <p className="text-red-600">{ex.bad}</p>
                              <p className="text-green-600 font-medium">{ex.good}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {item.features && (
                        <div className="grid md:grid-cols-2 gap-2 mb-3">
                          {item.features.map((feature: any, idx: number) => (
                            <div key={idx} className="bg-pink-50 p-2 rounded text-xs">
                              <span className="text-lg mr-2">{feature.icon}</span>
                              <strong>{feature.name}:</strong> {feature.description}
                            </div>
                          ))}
                        </div>
                      )}

                      {item.variables && (
                        <div className="bg-yellow-50 p-3 rounded mb-3">
                          <p className="font-medium text-sm mb-2">Variables Disponibles:</p>
                          <div className="space-y-1">
                            {item.variables.map((v: any, idx: number) => (
                              <div key={idx} className="text-xs font-mono">
                                <code className="bg-yellow-200 px-2 py-1 rounded">{v.code}</code>
                                <span className="mx-2">→</span>
                                <span className="italic">&quot;{v.result}&quot;</span>
                              </div>
                            ))}
                          </div>
                          {item.tip && (
                            <p className="text-xs text-yellow-700 mt-2 italic">💡 {item.tip}</p>
                          )}
                        </div>
                      )}

                      {item.steps && (
                        <div className="bg-green-50 p-3 rounded mb-3">
                          <ol className="space-y-1 text-sm">
                            {item.steps.map((step: string, idx: number) => (
                              <li key={idx}>✓ {step}</li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {item.options && (
                        <div className="space-y-2 mb-3">
                          {item.options.map((opt: any, idx: number) => (
                            <div key={idx} className="bg-blue-50 p-3 rounded">
                              <p className="font-medium text-sm text-blue-800">{opt.type}</p>
                              <p className="text-xs text-gray-600 mt-1">{opt.description}</p>
                              <p className="text-xs text-purple-600 mt-1 italic">
                                ✅ Mejor para: {opt.best}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {item.tips && (
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <p className="text-xs font-medium text-purple-800 mb-2">
                            💡 Consejos:
                          </p>
                          <ul className="text-xs text-purple-700 space-y-1">
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

      {/* Plantillas de Comunicación */}
      <Card className="border-green-300">
        <CardHeader className="bg-green-50">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Book className="h-6 w-6" />
            Plantillas Pre-hechas (Ahorra Tiempo!)
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Usa mensajes listos que solo necesitas personalizar
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                name: "Bienvenida a Nuevos Miembros",
                emoji: "👋",
                description: "Email automático cuando alguien se registra",
                includes: ["Saludo personalizado", "Próximos pasos", "Contactos importantes"]
              },
              {
                name: "Recordatorio de Evento",
                emoji: "⏰",
                description: "24 horas antes del evento",
                includes: ["Detalles del evento", "Ubicación con mapa", "Botón para confirmar"]
              },
              {
                name: "Newsletter Semanal",
                emoji: "📰",
                description: "Resumen de la semana en la iglesia",
                includes: ["Próximos eventos", "Anuncios", "Versículo de la semana"]
              },
              {
                name: "Felicitación de Cumpleaños",
                emoji: "🎂",
                description: "Mensaje automático el día del cumpleaños",
                includes: ["Felicitaciones personales", "Bendición bíblica", "Invitación a celebrar"]
              },
              {
                name: "Seguimiento a Visitantes",
                emoji: "🆕",
                description: "Después de la primera visita",
                includes: ["Agradecimiento", "Invitación a regresar", "Recursos para nuevos"]
              },
              {
                name: "Petición de Oración Respondida",
                emoji: "🙏",
                description: "Cuando una petición se marca como respondida",
                includes: ["Celebración", "Testimonio", "Invitación a compartir"]
              }
            ].map((template, index) => (
              <Card key={index} className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="text-4xl">{template.emoji}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{template.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="bg-green-50 p-2 rounded text-xs">
                        <p className="font-medium text-green-800 mb-1">✅ Incluye:</p>
                        <ul className="space-y-1 text-green-700">
                          {template.includes.map((item, idx) => (
                            <li key={idx}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              Cómo Usar Plantillas
            </h4>
            <ol className="text-sm space-y-2 ml-4">
              <li>1. Ve a Comunicaciones → Plantillas</li>
              <li>2. Elige la plantilla que necesitas</li>
              <li>3. Haz clic en &quot;Usar Esta Plantilla&quot;</li>
              <li>4. Personaliza el texto con tu información</li>
              <li>5. ¡Envía! El formato ya está listo</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas y Reportes */}
      <Card className="border-teal-300">
        <CardHeader className="bg-teal-50">
          <CardTitle className="flex items-center gap-3 text-xl">
            <BarChart className="h-6 w-6" />
            Ver Resultados de Tus Comunicaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-sm text-gray-600 mb-4">
            Después de enviar un mensaje, puedes ver estas estadísticas:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { metric: "📬 Enviados", description: "Cuántos mensajes se enviaron en total", example: "150 emails enviados" },
              { metric: "✅ Entregados", description: "Cuántos llegaron exitosamente", example: "147 entregados (98%)" },
              { metric: "👁️ Abiertos", description: "Cuántas personas abrieron el email", example: "89 abiertos (60%)" },
              { metric: "🖱️ Clics", description: "Clics en enlaces dentro del mensaje", example: "34 clics en formulario" },
              { metric: "❌ Rebotados", description: "Emails que no se pudieron entregar", example: "3 emails inválidos" },
              { metric: "📊 Tasa de Apertura", description: "% de personas que leyeron el mensaje", example: "60% - ¡Excelente!" }
            ].map((stat, index) => (
              <div key={index} className="bg-teal-50 p-3 rounded">
                <p className="font-semibold text-teal-800 mb-1">{stat.metric}</p>
                <p className="text-xs text-gray-600 mb-1">{stat.description}</p>
                <p className="text-xs text-teal-600 italic">Ejemplo: {stat.example}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card className="border-red-300 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-900">
            <AlertTriangle className="h-6 w-6" />
            Problemas Comunes con Comunicaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              problem: "❌ Los emails llegan a la carpeta de Spam",
              solutions: [
                "Pide a tus miembros agregar tu email a 'Contactos'",
                "Evita palabras como 'GRATIS', 'URGENTE', 'HACER CLIC AQUÍ' en mayúsculas",
                "No uses demasiados signos de exclamación (!!!)",
                "Verifica en Configuración → Integraciones que tu dominio esté autenticado"
              ]
            },
            {
              problem: "❌ Baja tasa de apertura (menos del 20%)",
              solutions: [
                "Mejora tus asuntos - que sean específicos y atractivos",
                "Envía en el momento adecuado (no 3am ni 11pm)",
                "Segmenta tu audiencia - mensajes personalizados funcionan mejor",
                "Pregunta: ¿El contenido es realmente valioso para ellos?"
              ]
            },
            {
              problem: "❌ No puedo enviar SMS (dice que no hay créditos)",
              solutions: [
                "Los SMS tienen costo - verifica tu plan en Configuración",
                "Compra créditos de SMS adicionales si se agotaron",
                "Usa emails para comunicaciones largas (son gratuitos)",
                "Reserva SMS solo para urgencias y recordatorios cortos"
              ]
            },
            {
              problem: "❌ El mensaje se envió con errores de formato",
              solutions: [
                "Siempre usa 'Vista Previa' antes de enviar",
                "Envía un 'Email de Prueba' a ti mismo primero",
                "Revisa cómo se ve en celular (no solo computadora)",
                "Usa plantillas verificadas para evitar problemas de diseño"
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

      {/* Best Practices */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Star className="h-6 w-6" />
            Mejores Prácticas para Comunicaciones Efectivas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-4 rounded">
              <h4 className="font-semibold text-green-800 mb-2">✅ SÍ Hacer:</h4>
              <ul className="space-y-1 text-gray-700">
                <li>✓ Personaliza los mensajes con nombres</li>
                <li>✓ Sé breve y claro - no escribas párrafos largos</li>
                <li>✓ Incluye un llamado a la acción claro (&quot;Regístrate aquí&quot;)</li>
                <li>✓ Usa imágenes atractivas pero no muchas</li>
                <li>✓ Envía en horarios razonables (10am - 7pm)</li>
                <li>✓ Revisa ortografía y gramática</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded">
              <h4 className="font-semibold text-red-800 mb-2">❌ NO Hacer:</h4>
              <ul className="space-y-1 text-gray-700">
                <li>✗ Enviar mensajes todos los días (saturación)</li>
                <li>✗ Usar TODO MAYÚSCULAS o muchos emojis !!!</li>
                <li>✗ Compartir información privada de miembros</li>
                <li>✗ Enviar sin probar primero</li>
                <li>✗ Ignorar a quienes piden no recibir mensajes</li>
                <li>✗ Mezclar temas en un solo mensaje (confunde)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Link href="/help/manual/phase-4-events">
          <Button variant="outline" size="lg">
            <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
            Fase Anterior: Eventos
          </Button>
        </Link>
        <Link href="/help/manual/phase-6-analytics">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
            ¡Siguiente! Dashboard y Analíticas
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
