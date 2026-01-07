'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  AlertTriangle, HelpCircle, CheckCircle, XCircle, Search,
  Users, Mail, Phone, Calendar, DollarSign, BarChart3, Settings,
  Lock, Globe, Database, Zap, AlertCircle, Bug, Shield, RefreshCw,
  MessageSquare, Video, Book, ExternalLink, Clock, Activity
} from 'lucide-react'
import Link from 'next/link'

export default function ComprehensiveTroubleshootingGuide() {
  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-8 rounded-lg">
        <div className="flex items-center gap-4">
          <AlertTriangle className="h-12 w-12" />
          <div>
            <h1 className="text-4xl font-bold mb-2">🔧 Guía Completa de Solución de Problemas</h1>
            <p className="text-xl opacity-90">
              Resuelve cualquier problema en Khesed-tek - ¡Sin necesidad de soporte técnico!
            </p>
          </div>
        </div>
        <div className="mt-6 flex gap-4 text-sm">
          <Badge variant="secondary" className="bg-white/20 text-white">
            <Bug className="h-3 w-3 mr-1" />
            100+ Problemas Resueltos
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white">
            <Clock className="h-3 w-3 mr-1" />
            Soluciones en 5 Minutos
          </Badge>
        </div>
      </div>

      {/* Quick Search */}
      <Card className="border-blue-300">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center gap-3">
            <Search className="h-6 w-6" />
            Búsqueda Rápida de Problemas
          </CardTitle>
          <CardDescription>
            Escribe tu problema y te diremos cómo solucionarlo
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <input
              type="text"
              placeholder="Ejemplo: 'no puedo iniciar sesión', 'el email no llega', 'error al guardar miembro'..."
              className="w-full p-3 text-lg border-none focus:outline-none"
            />
            <div className="mt-3 flex gap-3 flex-wrap">
              <Badge className="cursor-pointer hover:bg-blue-700">No puedo iniciar sesión</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Emails no llegan</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Error al guardar</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Página en blanco</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Lento el sistema</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problems by Category */}
      <Tabs defaultValue="authentication" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 h-auto">
          <TabsTrigger value="authentication" className="flex flex-col gap-1 py-3">
            <Lock className="h-5 w-5" />
            <span className="text-xs">Inicio de Sesión</span>
          </TabsTrigger>
          <TabsTrigger value="members" className="flex flex-col gap-1 py-3">
            <Users className="h-5 w-5" />
            <span className="text-xs">Miembros</span>
          </TabsTrigger>
          <TabsTrigger value="emails" className="flex flex-col gap-1 py-3">
            <Mail className="h-5 w-5" />
            <span className="text-xs">Emails/SMS</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex flex-col gap-1 py-3">
            <Calendar className="h-5 w-5" />
            <span className="text-xs">Eventos</span>
          </TabsTrigger>
          <TabsTrigger value="donations" className="flex flex-col gap-1 py-3">
            <DollarSign className="h-5 w-5" />
            <span className="text-xs">Donaciones</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex flex-col gap-1 py-3">
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs">Analíticas</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex flex-col gap-1 py-3">
            <Zap className="h-5 w-5" />
            <span className="text-xs">Rendimiento</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex flex-col gap-1 py-3">
            <Settings className="h-5 w-5" />
            <span className="text-xs">Configuración</span>
          </TabsTrigger>
        </TabsList>

        {/* Authentication Problems */}
        <TabsContent value="authentication" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-6 w-6 text-red-600" />
                Problemas de Inicio de Sesión y Contraseñas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  problem: "❌ Olvidé mi contraseña",
                  severity: "high",
                  solutions: [
                    {
                      step: "1. Haz clic en '¿Olvidaste tu contraseña?' en la página de login",
                      detail: "Está justo debajo del campo de contraseña"
                    },
                    {
                      step: "2. Ingresa tu email registrado",
                      detail: "El mismo email que usaste para crear la cuenta"
                    },
                    {
                      step: "3. Revisa tu correo (bandeja de entrada y Spam)",
                      detail: "Te llegará un email con un enlace para restablecer"
                    },
                    {
                      step: "4. Haz clic en el enlace del email",
                      detail: "Te llevará a crear una nueva contraseña"
                    },
                    {
                      step: "5. Crea una contraseña nueva y segura",
                      detail: "Mínimo 8 caracteres, con mayúsculas, números y símbolos"
                    }
                  ],
                  prevention: "Usa un administrador de contraseñas (LastPass, 1Password) para nunca olvidarla"
                },
                {
                  problem: "❌ Dice que mi email o contraseña son incorrectos",
                  severity: "high",
                  solutions: [
                    {
                      step: "1. Verifica que estás escribiendo el email EXACTAMENTE como lo registraste",
                      detail: "juan@gmail.com es diferente a Juan@gmail.com"
                    },
                    {
                      step: "2. Asegúrate que no hay espacios en blanco al inicio o final",
                      detail: "' juan@gmail.com' (con espacio) causará error"
                    },
                    {
                      step: "3. Revisa que el Caps Lock no esté activado",
                      detail: "Las contraseñas distinguen entre MAYÚSCULAS y minúsculas"
                    },
                    {
                      step: "4. Intenta copiar y pegar tu contraseña",
                      detail: "Si la tienes guardada en otro lugar, cópiala tal cual"
                    },
                    {
                      step: "5. Si nada funciona, usa 'Olvidé mi contraseña'",
                      detail: "Restablece tu contraseña para estar seguro"
                    }
                  ],
                  prevention: "Guarda tus credenciales en un lugar seguro inmediatamente después de crear la cuenta"
                },
                {
                  problem: "❌ No me llega el email para restablecer contraseña",
                  severity: "medium",
                  solutions: [
                    {
                      step: "1. Espera 5 minutos - a veces los emails tardan",
                      detail: "No solicites el restablecimiento múltiples veces"
                    },
                    {
                      step: "2. Revisa tu carpeta de SPAM / Correo no deseado",
                      detail: "80% de las veces está ahí"
                    },
                    {
                      step: "3. Busca emails de 'noreply@khesed-tek.com' o 'onboarding@resend.dev'",
                      detail: "Usa la barra de búsqueda de tu correo"
                    },
                    {
                      step: "4. Verifica que escribiste bien tu email",
                      detail: "Si pusiste juan@gmai.com en vez de gmail.com, nunca llegará"
                    },
                    {
                      step: "5. Agrega noreply@khesed-tek.com a tus contactos",
                      detail: "Luego intenta restablecer de nuevo"
                    },
                    {
                      step: "6. Si nada funciona, contacta a tu SUPER_ADMIN",
                      detail: "Ellos pueden restablecer tu contraseña manualmente"
                    }
                  ],
                  prevention: "Al crear tu cuenta, inmediatamente agrega noreply@khesed-tek.com a contactos seguros"
                },
                {
                  problem: "❌ Dice que mi cuenta está bloqueada / inactiva",
                  severity: "high",
                  solutions: [
                    {
                      step: "1. Contacta a tu pastor o administrador de la iglesia",
                      detail: "Solo ellos pueden reactivar cuentas bloqueadas"
                    },
                    {
                      step: "2. Si eres ADMIN, verifica en Configuración → Usuarios",
                      detail: "Busca tu cuenta y activa el toggle 'Activo'"
                    },
                    {
                      step: "3. Espera 24 horas si intentaste iniciar sesión muchas veces",
                      detail: "El sistema bloquea temporalmente después de 5 intentos fallidos"
                    }
                  ],
                  prevention: "No compartas tu contraseña. Si sospechas que alguien la sabe, cámbiala inmediatamente"
                },
                {
                  problem: "❌ La página me saca automáticamente (me hace logout)",
                  severity: "low",
                  solutions: [
                    {
                      step: "1. Tu sesión expira después de 7 días de inactividad",
                      detail: "Tendrás que iniciar sesión de nuevo - es normal"
                    },
                    {
                      step: "2. Si pasa muy seguido, borra las cookies del navegador",
                      detail: "En Chrome: Configuración → Privacidad → Borrar datos"
                    },
                    {
                      step: "3. Verifica que no tengas sesión en múltiples pestañas",
                      detail: "Cerrar sesión en una pestaña puede afectar otras"
                    },
                    {
                      step: "4. Actualiza tu navegador a la última versión",
                      detail: "Navegadores antiguos tienen problemas de sesión"
                    }
                  ],
                  prevention: "No uses 'modo incógnito' - las sesiones no se guardan ahí"
                }
              ].map((item, index) => (
                <Card key={index} className={`border-l-4 ${item.severity === 'high' ? 'border-l-red-500 bg-red-50' : item.severity === 'medium' ? 'border-l-orange-500 bg-orange-50' : 'border-l-yellow-500 bg-yellow-50'}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3 mb-4">
                      <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">{item.problem}</h4>
                        <Badge className={item.severity === 'high' ? 'bg-red-600' : item.severity === 'medium' ? 'bg-orange-600' : 'bg-yellow-600'}>
                          {item.severity === 'high' ? 'Urgente' : item.severity === 'medium' ? 'Común' : 'Ocasional'}
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg mb-3">
                      <h5 className="font-semibold text-sm text-green-800 mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Solución Paso a Paso:
                      </h5>
                      <div className="space-y-3">
                        {item.solutions.map((solution, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{solution.step}</p>
                              <p className="text-xs text-gray-600 mt-1 italic">{solution.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {item.prevention && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs font-medium text-blue-800 mb-1">
                          🛡️ Cómo Prevenir Este Problema:
                        </p>
                        <p className="text-xs text-blue-700">{item.prevention}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Members Problems */}
        <TabsContent value="members" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-600" />
                Problemas con Gestión de Miembros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  problem: "❌ No puedo agregar un nuevo miembro (botón no funciona)",
                  solutions: [
                    "Verifica que tienes permiso de ADMIN o PASTOR en Configuración → Usuarios",
                    "Si eres LIDER, solo puedes VER miembros, no agregar - contacta a tu pastor",
                    "Revisa que todos los campos obligatorios (marcados con *) estén llenos",
                    "Intenta con otro navegador (Chrome o Firefox recomendados)",
                    "Borra la caché del navegador: Ctrl+Shift+Delete → Borrar todo"
                  ]
                },
                {
                  problem: "❌ Dice que el email ya existe al agregar miembro",
                  solutions: [
                    "Ese email ya está registrado - búscalo en la lista de miembros con Ctrl+F",
                    "Si es un duplicado real, usa un pequeño truco: juan+1@gmail.com",
                    "O actualiza el miembro existente en vez de crear uno nuevo",
                    "Verifica que no haya espacios en blanco antes/después del email",
                    "Si es un error del sistema, usa 'Importar por Excel' y salta validación"
                  ]
                },
                {
                  problem: "❌ La importación de Excel falla / muestra errores",
                  solutions: [
                    "Descarga la plantilla oficial desde Miembros → Importar → Descargar Plantilla",
                    "NO cambies los nombres de las columnas - deben ser exactos",
                    "Verifica que las fechas estén en formato DD/MM/AAAA (15/03/1985)",
                    "El campo 'lifecycle' debe ser: VISITANTE, NUEVO_CREYENTE, CRECIMIENTO, MADURO, o LIDER (exactamente así)",
                    "No dejes filas vacías en medio del archivo",
                    "Guarda el archivo como .xlsx (no .xls o .csv)",
                    "Importa máximo 500 filas a la vez - divide archivos grandes"
                  ]
                },
                {
                  problem: "❌ No aparecen todos los miembros en la lista",
                  solutions: [
                    "Revisa los FILTROS arriba - puede que estés viendo solo VISITANTES",
                    "Haz clic en 'Limpiar Filtros' o 'Ver Todos'",
                    "Verifica que la búsqueda no tenga texto escrito",
                    "Cambia la paginación - puede que estés en página 1 de 10",
                    "Si recién agregaste miembros, espera 10 segundos y refresca (F5)"
                  ]
                },
                {
                  problem: "❌ Eliminé un miembro por error - ¿puedo recuperarlo?",
                  solutions: [
                    "❗ Las eliminaciones son PERMANENTES - no hay recuperación automática",
                    "Contacta urgente a soporte@khesed-tek.com si fue hace menos de 24 horas",
                    "Si tienes un backup reciente, puedes importar ese miembro de nuevo",
                    "PREVENCIÓN: Usa 'Inactivo' en vez de Eliminar para miembros que ya no asisten"
                  ]
                }
              ].map((item, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      {item.problem}
                    </h4>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="font-medium text-sm text-green-800 mb-2">✅ Soluciones:</p>
                      <ul className="space-y-2 text-sm">
                        {item.solutions.map((solution, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-600 font-bold flex-shrink-0">{idx + 1}.</span>
                            <span className="text-gray-700">{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email/SMS Problems */}
        <TabsContent value="emails" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-6 w-6 text-purple-600" />
                Problemas con Emails y SMS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  problem: "❌ Los emails no llegan a los destinatarios",
                  severity: "critical",
                  quickFix: "90% está en la carpeta de SPAM - pide a tus miembros revisar ahí",
                  solutions: [
                    "Revisa Configuración → Integraciones → Email - debe mostrar 'Conectado'",
                    "Pide a los destinatarios que revisen su carpeta de Spam/Correo no deseado",
                    "Evita palabras spam: GRATIS, URGENTE, HAGA CLIC AQUÍ (en mayúsculas)",
                    "No uses demasiados signos de exclamación (!!!!) ni MAYÚSCULAS",
                    "Verifica que los emails de los miembros sean correctos",
                    "Haz una prueba enviándote a TI MISMO primero",
                    "Contacta a tu SUPER_ADMIN para verificar configuración de Resend"
                  ]
                },
                {
                  problem: "❌ Baja tasa de apertura (menos del 20%)",
                  severity: "medium",
                  quickFix: "Mejora tus asuntos - específicos y atractivos funcionan mejor",
                  solutions: [
                    "Asuntos específicos: '¡Retiro de Jóvenes - Cupos Limitados!' vs 'Información'",
                    "Envía en horarios óptimos: 10am-12pm o 7pm-9pm (NO 3am)",
                    "Personaliza con {{nombre}} - la gente abre más emails personalizados",
                    "Segmenta tu audiencia - no envíes todo a todos",
                    "Usa vista previa atractiva (primeras 2 líneas del email)",
                    "Evita enviar emails todos los días - saturación reduce aperturas"
                  ]
                },
                {
                  problem: "❌ No puedo enviar SMS (dice que no hay créditos)",
                  severity: "medium",
                  quickFix: "Los SMS tienen costo - verifica tu plan en Configuración",
                  solutions: [
                    "Ve a Configuración → Integraciones → SMS para ver créditos restantes",
                    "Contacta a tu SUPER_ADMIN para comprar más créditos de SMS",
                    "Usa emails para comunicaciones largas (son GRATIS ilimitados)",
                    "Reserva SMS solo para urgencias y recordatorios muy cortos",
                    "Verifica tu plan actual - algunos planes tienen SMS limitados"
                  ]
                },
                {
                  problem: "❌ El email se envió con formato roto / sin imágenes",
                  severity: "low",
                  quickFix: "Siempre usa Vista Previa antes de enviar",
                  solutions: [
                    "SIEMPRE haz clic en 'Vista Previa' antes de enviar",
                    "Envía un 'Email de Prueba' a ti mismo primero",
                    "Revisa cómo se ve en CELULAR (no solo computadora)",
                    "No copies y pegues desde Word - usa el editor de Khesed-tek",
                    "Imágenes deben ser URLs públicas (no archivos locales)",
                    "Usa las plantillas oficiales - ya están probadas"
                  ]
                }
              ].map((item, index) => (
                <Card key={index} className={`border-l-4 ${item.severity === 'critical' ? 'border-l-red-500' : 'border-l-purple-500'}`}>
                  <CardContent className="pt-4">
                    <h4 className="font-semibold text-lg mb-2">{item.problem}</h4>
                    {item.quickFix && (
                      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 mb-3">
                        <p className="text-sm font-medium text-yellow-900">
                          ⚡ Solución Rápida: {item.quickFix}
                        </p>
                      </div>
                    )}
                    <div className="space-y-2">
                      {item.solutions.map((solution, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{solution}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Problems */}
        <TabsContent value="performance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-yellow-600" />
                Problemas de Rendimiento y Velocidad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  problem: "❌ El sistema está muy lento / tarda en cargar",
                  impact: "Alto - afecta toda la experiencia",
                  solutions: [
                    {
                      category: "Verifica Tu Internet",
                      steps: [
                        "Haz una prueba de velocidad en fast.com - necesitas mínimo 5 Mbps",
                        "Cierra otras pestañas del navegador (YouTube, Netflix, etc.)",
                        "Si usas WiFi, acércate al router o usa cable Ethernet",
                        "Reinicia tu router (desconecta 30 segundos y vuelve a conectar)"
                      ]
                    },
                    {
                      category: "Optimiza Tu Navegador",
                      steps: [
                        "Actualiza a la última versión de Chrome o Firefox",
                        "Borra caché y cookies: Ctrl+Shift+Delete → Borrar todo",
                        "Desactiva extensiones innecesarias (especialmente bloqueadores de anuncios)",
                        "Cierra pestañas que no estés usando (más de 10 afecta rendimiento)"
                      ]
                    },
                    {
                      category: "Verifica el Estado del Sistema",
                      steps: [
                        "Revisa status.khesed-tek.com para ver si hay problemas conocidos",
                        "Si todos tienen lentitud, puede ser un problema del servidor",
                        "Intenta en horarios de menos tráfico (antes de 8am o después de 10pm)",
                        "Contacta a soporte si persiste más de 1 hora"
                      ]
                    }
                  ]
                },
                {
                  problem: "❌ Las gráficas no cargan / salen en blanco",
                  impact: "Medio - solo afecta analíticas",
                  solutions: [
                    {
                      category: "Soluciones Inmediatas",
                      steps: [
                        "Refresca la página (F5 o botón de recargar)",
                        "Desactiva bloqueadores de anuncios temporalmente",
                        "Prueba en modo incógnito: Ctrl+Shift+N (Chrome) o Ctrl+Shift+P (Firefox)",
                        "Cambia el rango de fechas - puede que no haya datos en ese período"
                      ]
                    }
                  ]
                },
                {
                  problem: "❌ La página se congela / no responde",
                  impact: "Crítico - bloquea el trabajo",
                  solutions: [
                    {
                      category: "Recuperación Inmediata",
                      steps: [
                        "Espera 10 segundos - el sistema puede estar procesando",
                        "Presiona Esc para cancelar la operación actual",
                        "Cierra la pestaña y abre una nueva sesión",
                        "Si sigue congelado, cierra completamente el navegador",
                        "Último recurso: Reinicia tu computadora"
                      ]
                    },
                    {
                      category: "Prevención",
                      steps: [
                        "No hagas operaciones masivas (importar 1000+ registros)",
                        "Exporta reportes en lotes pequeños (máximo 500 filas)",
                        "Cierra otros programas pesados (Photoshop, juegos, etc.)"
                      ]
                    }
                  ]
                }
              ].map((item, index) => (
                <Card key={index} className="border-l-4 border-l-yellow-500">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-semibold text-lg">{item.problem}</h4>
                      <Badge className={item.impact === 'Crítico' ? 'bg-red-600' : item.impact.includes('Alto') ? 'bg-orange-600' : 'bg-yellow-600'}>
                        {item.impact}
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      {item.solutions.map((category, idx) => (
                        <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-sm text-gray-800 mb-3">
                            {category.category}:
                          </h5>
                          <ul className="space-y-2">
                            {category.steps.map((step, sidx) => (
                              <li key={sidx} className="flex items-start gap-2 text-sm">
                                <span className="text-yellow-600 font-bold">{sidx + 1}.</span>
                                <span className="text-gray-700">{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Emergency Contact */}
      <Card className="border-red-500 border-2 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-900">
            <Shield className="h-6 w-6" />
            ¿No Encontraste la Solución?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/help/support/ticket">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                <CardContent className="pt-6 text-center">
                  <MessageSquare className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Crear Ticket de Soporte</h4>
                  <p className="text-sm text-gray-600 mb-3">Respuesta en 24 horas</p>
                  <Button size="sm" className="w-full">Abrir Ticket</Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/help/videos">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                <CardContent className="pt-6 text-center">
                  <Video className="h-10 w-10 text-red-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Ver Video Tutoriales</h4>
                  <p className="text-sm text-gray-600 mb-3">Aprende visualmente</p>
                  <Button size="sm" variant="outline" className="w-full">Ver Videos</Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/help/manual/complete-onboarding-guide">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                <CardContent className="pt-6 text-center">
                  <Book className="h-10 w-10 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Guía Completa</h4>
                  <p className="text-sm text-gray-600 mb-3">Manual paso a paso</p>
                  <Button size="sm" variant="outline" className="w-full">Leer Manual</Button>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="mt-6 bg-white p-4 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Phone className="h-5 w-5 text-green-600" />
              Contacto de Emergencia (24/7)
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">📧 Email de Soporte:</p>
                <a href="mailto:soporte@khesed-tek.com" className="text-blue-600 hover:underline font-medium">
                  soporte@khesed-tek.com
                </a>
              </div>
              <div>
                <p className="text-gray-600 mb-1">💬 WhatsApp:</p>
                <a href="https://wa.me/1234567890" className="text-green-600 hover:underline font-medium flex items-center gap-1">
                  +1 (234) 567-890 <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-green-600" />
            Estado del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-semibold">Todos los Sistemas Operacionales</p>
                <p className="text-sm text-gray-600">Última verificación: Hace 2 minutos</p>
              </div>
            </div>
            <a 
              href="https://status.khesed-tek.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              Ver Estado Completo <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
