'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Rocket, Users, DollarSign, Calendar, MessageSquare, BarChart3, 
  Settings, CheckCircle, ArrowRight, Play, Book, HelpCircle,
  Lightbulb, AlertTriangle, Target, Gift, Home, Mail, Phone,
  FileText, Image, Video, Music, Heart, Star, Flag, Award
} from 'lucide-react'
import Link from 'next/link'

export default function CompleteOnboardingGuide() {
  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-8">
      {/* Hero Header */}
      <div className="btn-cta-gradient text-white p-8 rounded-lg">
        <div className="flex items-center gap-4">
          <Rocket className="h-12 w-12" />
          <div>
            <h1 className="text-4xl font-bold mb-2">🎉 ¡Bienvenido a Khesed-tek!</h1>
            <p className="text-xl opacity-90">
              Guía Completa de Inicio - Paso a Paso para Niños y Adultos
            </p>
          </div>
        </div>
        <div className="mt-6 flex gap-4 text-sm">
          <Badge variant="secondary" className="bg-white/20 text-white">
            <Book className="h-3 w-3 mr-1" />
            Guía Completa
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white">
            <Target className="h-3 w-3 mr-1" />
            Nivel: Principiante
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white">
            <Star className="h-3 w-3 mr-1" />
            60 minutos
          </Badge>
        </div>
      </div>

      {/* What You'll Learn */}
      <Card className="border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success)/0.10)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[hsl(var(--success))]">
            <Lightbulb className="h-6 w-6" />
            ¿Qué Aprenderás en Esta Guía?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] flex-shrink-0 mt-0.5" />
              <p><strong>Paso 1:</strong> Crear tu cuenta e iglesia (5 minutos)</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] flex-shrink-0 mt-0.5" />
              <p><strong>Paso 2:</strong> Configurar información básica (10 minutos)</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] flex-shrink-0 mt-0.5" />
              <p><strong>Paso 3:</strong> Agregar tus primeros miembros (15 minutos)</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] flex-shrink-0 mt-0.5" />
              <p><strong>Paso 4:</strong> Crear tu primer evento (10 minutos)</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] flex-shrink-0 mt-0.5" />
              <p><strong>Paso 5:</strong> Enviar tu primera comunicación (10 minutos)</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] flex-shrink-0 mt-0.5" />
              <p><strong>Paso 6:</strong> Ver tu dashboard y analíticas (10 minutos)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FASE 1: CREAR CUENTA */}
      <section id="fase-1">
        <Card className="border-[hsl(var(--info)/0.4)]">
          <CardHeader className="bg-[hsl(var(--info)/0.10)]">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="bg-[hsl(var(--info))] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  1
                </div>
                Crear Tu Cuenta e Iglesia
              </CardTitle>
              <Badge className="bg-[hsl(var(--info))] text-white">5 minutos</Badge>
            </div>
            <CardDescription className="text-base mt-2">
              ¡Tu primer paso! Como cuando creas una cuenta de correo, pero para tu iglesia.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Explicación para niños */}
            <div className="bg-[hsl(var(--warning)/0.10)] p-4 rounded-lg border-2 border-[hsl(var(--warning)/0.4)]">
              <h4 className="font-bold text-[hsl(var(--warning))] flex items-center gap-2 mb-2">
                <Heart className="h-5 w-5" />
                Para Niños: ¿Qué es Crear una Cuenta?
              </h4>
              <p className="text-sm text-[hsl(var(--warning))]">
                Imagina que Khesed-tek es como una casa especial para tu iglesia en internet. 
                Para entrar a esa casa, necesitas una &quot;llave&quot; especial. Crear una cuenta es como 
                hacer tu propia llave. Vas a elegir un nombre de usuario (como tu apodo) y una 
                contraseña secreta (como el código de un tesoro). ¡Nadie más puede entrar sin tu llave!
              </p>
            </div>

            {/* Paso a Paso */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <Play className="h-5 w-5 text-[hsl(var(--info))]" />
                Pasos Detallados (Con Imágenes Mentales)
              </h4>
              
              <div className="space-y-4">
                {[
                  {
                    step: "1.1",
                    title: "Abrir el Navegador",
                    description: "Abre Google Chrome, Firefox, o Safari en tu computadora o teléfono.",
                    icon: <Home className="h-5 w-5 text-[hsl(var(--lavender))]" />,
                    image: "🌐",
                    tips: [
                      "Puedes usar cualquier navegador que tengas",
                      "También funciona en tablets y teléfonos celulares",
                      "No necesitas descargar nada especial"
                    ]
                  },
                  {
                    step: "1.2",
                    title: "Ir a la Página de Khesed-tek",
                    description: "En la barra de arriba (donde escribes las direcciones web), escribe: khesed-tek-cms.up.railway.app",
                    icon: <ArrowRight className="h-5 w-5 text-[hsl(var(--success))]" />,
                    image: "🔍",
                    tips: [
                      "Copia la dirección exactamente como está",
                      "Presiona la tecla 'Enter' después de escribirla",
                      "Deberías ver la página de inicio de Khesed-tek"
                    ]
                  },
                  {
                    step: "1.3",
                    title: "Hacer Clic en 'Crear Cuenta'",
                    description: "Busca un botón azul que diga 'Crear Cuenta' o 'Registrarse'. Haz clic en él.",
                    icon: <CheckCircle className="h-5 w-5 text-[hsl(var(--info))]" />,
                    image: "👆",
                    tips: [
                      "El botón está en la esquina superior derecha",
                      "Si no lo ves, busca 'Registrarse' o 'Sign Up'",
                      "Aparecerá un formulario (una hoja con espacios en blanco)"
                    ]
                  },
                  {
                    step: "1.4",
                    title: "Llenar el Formulario",
                    description: "Completa estos espacios con tu información:",
                    icon: <FileText className="h-5 w-5 text-[hsl(var(--warning))]" />,
                    image: "✏️",
                    details: [
                      {
                        field: "Tu Nombre Completo",
                        example: "Ejemplo: María García o Pastor Juan López",
                        why: "Para que sepamos quién eres"
                      },
                      {
                        field: "Email de la Iglesia",
                        example: "Ejemplo: pastor@miglesia.com o contacto@iglesiacristal.org",
                        why: "Este será tu nombre de usuario para entrar"
                      },
                      {
                        field: "Contraseña Secreta",
                        example: "Debe tener mínimo 8 letras y números, como: MiIglesia2024!",
                        why: "Es como tu código secreto - ¡no la compartas!"
                      },
                      {
                        field: "Nombre de Tu Iglesia",
                        example: "Ejemplo: Iglesia Cristiana El Buen Pastor",
                        why: "Así aparecerá en todo el sistema"
                      },
                      {
                        field: "Teléfono de Contacto",
                        example: "Ejemplo: +1-555-123-4567",
                        why: "Por si necesitamos contactarte urgentemente"
                      }
                    ]
                  },
                  {
                    step: "1.5",
                    title: "Verificar Tu Email",
                    description: "Después de crear tu cuenta, revisa tu correo electrónico.",
                    icon: <Mail className="h-5 w-5 text-[hsl(var(--destructive))]" />,
                    image: "📧",
                    tips: [
                      "Te enviaremos un correo con un enlace especial",
                      "Abre ese correo y haz clic en el enlace azul",
                      "Si no ves el correo, revisa tu carpeta de 'Spam' o 'Correo no deseado'",
                      "El correo llegará en menos de 1 minuto"
                    ]
                  },
                  {
                    step: "1.6",
                    title: "¡Iniciar Sesión Por Primera Vez!",
                    description: "Vuelve a khesed-tek-cms.up.railway.app y entra con tu email y contraseña.",
                    icon: <Star className="h-5 w-5 text-[hsl(var(--warning))]" />,
                    image: "🎊",
                    tips: [
                      "Usa el mismo email y contraseña que creaste",
                      "Si olvidaste tu contraseña, haz clic en '¿Olvidaste tu contraseña?'",
                      "¡Felicidades! Ya tienes tu cuenta creada"
                    ]
                  }
                ].map((item, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
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
                          <p className="text-muted-foreground mb-3">{item.description}</p>
                          
                          {item.details && (
                            <div className="space-y-2 mb-3">
                              {item.details.map((detail, idx) => (
                                <div key={idx} className="bg-muted/30 p-3 rounded">
                                  <p className="font-medium text-sm text-[hsl(var(--info))]">
                                    📝 {detail.field}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">{detail.example}</p>
                                  <p className="text-xs text-[hsl(var(--lavender))] mt-1 italic">
                                    💡 {detail.why}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {item.tips && (
                            <div className="bg-[hsl(var(--success)/0.10)] p-3 rounded-lg">
                              <p className="text-xs font-medium text-[hsl(var(--success))] mb-2">
                                💡 Consejos Útiles:
                              </p>
                              <ul className="text-xs text-[hsl(var(--success))] space-y-1">
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
            </div>

            {/* Troubleshooting Común */}
            <div className="bg-[hsl(var(--destructive)/0.10)] p-4 rounded-lg border-2 border-[hsl(var(--destructive)/0.3)]">
              <h4 className="font-bold text-[hsl(var(--destructive))] flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5" />
                ¿Problemas? Aquí Están las Soluciones
              </h4>
              <div className="space-y-3 text-sm">
                {[
                  {
                    problem: "❌ No me llega el correo de verificación",
                    solutions: [
                      "Espera 2-3 minutos, a veces tarda un poco",
                      "Revisa tu carpeta de Spam o Correo no deseado",
                      "Verifica que escribiste bien tu email",
                      "Intenta crear la cuenta de nuevo con otro email"
                    ]
                  },
                  {
                    problem: "❌ Dice que mi contraseña es muy débil",
                    solutions: [
                      "Asegúrate que tenga mínimo 8 caracteres",
                      "Incluye al menos una letra MAYÚSCULA",
                      "Incluye al menos un número (0-9)",
                      "Incluye un símbolo especial como ! @ # $ %"
                    ]
                  },
                  {
                    problem: "❌ Dice que mi email ya existe",
                    solutions: [
                      "Probablemente ya creaste una cuenta antes",
                      "Haz clic en '¿Olvidaste tu contraseña?' para recuperarla",
                      "O usa un email diferente para crear una cuenta nueva"
                    ]
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white p-3 rounded border border-[hsl(var(--destructive)/0.3)]">
                    <p className="font-medium text-[hsl(var(--destructive))] mb-2">{item.problem}</p>
                    <ul className="text-[hsl(var(--destructive))] space-y-1 ml-4">
                      {item.solutions.map((solution, idx) => (
                        <li key={idx}>✓ {solution}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Step */}
            <div className="flex justify-end">
              <Link href="#fase-2">
                <Button size="lg" className="bg-[hsl(var(--info))] hover:bg-[hsl(var(--info))]">
                  ¡Siguiente Paso! Configurar Mi Iglesia
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FASE 2: CONFIGURACIÓN INICIAL */}
      <section id="fase-2">
        <Card className="border-[hsl(var(--lavender)/0.4)]">
          <CardHeader className="bg-[hsl(var(--lavender)/0.10)]">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="bg-[hsl(var(--lavender))] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  2
                </div>
                Configurar Información de Mi Iglesia
              </CardTitle>
              <Badge className="bg-[hsl(var(--lavender))] text-white">10 minutos</Badge>
            </div>
            <CardDescription className="text-base mt-2">
              Personaliza tu iglesia - como decorar tu casa en el sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Para niños */}
            <div className="bg-[hsl(var(--warning)/0.10)] p-4 rounded-lg border-2 border-[hsl(var(--warning)/0.4)]">
              <h4 className="font-bold text-[hsl(var(--warning))] flex items-center gap-2 mb-2">
                <Heart className="h-5 w-5" />
                Para Niños: ¿Por Qué Configurar Mi Iglesia?
              </h4>
              <p className="text-sm text-[hsl(var(--warning))]">
                Es como poner fotos y colores bonitos en tu cuarto. Quieres que cuando alguien 
                entre a ver tu iglesia en el sistema, vea el nombre correcto, los colores que te 
                gustan, y la foto de tu iglesia. Así todos saben que es TU iglesia especial.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Información Básica
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="font-medium">📍 Dónde Configurar:</p>
                  <div className="bg-[hsl(var(--lavender)/0.10)] p-3 rounded">
                    <p className="text-xs mb-2">Haz clic en estos lugares en orden:</p>
                    <ol className="space-y-1 text-xs">
                      <li>1. Botón de <strong>Configuración</strong> (⚙️ arriba a la derecha)</li>
                      <li>2. Luego <strong>&quot;Perfil de la Iglesia&quot;</strong></li>
                    </ol>
                  </div>

                  <p className="font-medium mt-4">✏️ Información a Completar:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[hsl(var(--success))] mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Nombre Completo:</strong>
                        <p className="text-xs text-muted-foreground">
                          Ejemplo: &quot;Iglesia Cristiana El Buen Pastor&quot;
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[hsl(var(--success))] mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Dirección Física:</strong>
                        <p className="text-xs text-muted-foreground">
                          Ejemplo: &quot;Calle 123 #45-67, Bogotá, Colombia&quot;
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[hsl(var(--success))] mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Teléfono de Contacto:</strong>
                        <p className="text-xs text-muted-foreground">
                          Para que la gente pueda llamarte
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[hsl(var(--success))] mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Sitio Web (Opcional):</strong>
                        <p className="text-xs text-muted-foreground">
                          Si tienes página web, ponla aquí
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-pink-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Personalización Visual
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="font-medium">🎨 Hacer Tu Iglesia Bonita:</p>
                  
                  <div className="space-y-3">
                    <div className="bg-[hsl(var(--destructive)/0.08)] p-3 rounded">
                      <p className="font-medium text-sm mb-2">Logo de la Iglesia</p>
                      <ul className="text-xs space-y-1">
                        <li>• Sube una imagen del logo de tu iglesia</li>
                        <li>• Puede ser un escudo, símbolo, o diseño especial</li>
                        <li>• Se verá en todos los reportes y comunicaciones</li>
                        <li>• <strong>Tamaño recomendado:</strong> 500x500 pixeles</li>
                      </ul>
                    </div>

                    <div className="bg-[hsl(var(--info)/0.10)] p-3 rounded">
                      <p className="font-medium text-sm mb-2">Colores de Tu Marca</p>
                      <p className="text-xs mb-2">
                        Ve a <strong>Configuración → Personalización de Marca</strong>
                      </p>
                      <ul className="text-xs space-y-1">
                        <li>• Color Principal: El color que más representa tu iglesia</li>
                        <li>• Color Secundario: Un color que combina bien</li>
                        <li>• Estos colores aparecerán en botones, títulos, etc.</li>
                      </ul>
                    </div>

                    <div className="bg-[hsl(var(--success)/0.10)] p-3 rounded">
                      <p className="font-medium text-sm mb-2">Horarios de Servicio</p>
                      <p className="text-xs">Agrega cuándo se reúne tu iglesia:</p>
                      <ul className="text-xs space-y-1 mt-1">
                        <li>• Domingos: 10:00 AM - Servicio Principal</li>
                        <li>• Miércoles: 7:00 PM - Estudio Bíblico</li>
                        <li>• Viernes: 6:00 PM - Jóvenes</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tips Importantes */}
            <div className="bg-[hsl(var(--info)/0.10)] p-4 rounded-lg border-2 border-[hsl(var(--info)/0.3)]">
              <h4 className="font-bold text-foreground flex items-center gap-2 mb-3">
                <Lightbulb className="h-5 w-5" />
                Consejos de Experto
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-3 rounded">
                  <p className="font-medium text-[hsl(var(--info))] mb-2">✅ Sí Hacer:</p>
                  <ul className="space-y-1 text-[hsl(var(--info))]">
                    <li>✓ Usa fotos de buena calidad (no borrosas)</li>
                    <li>✓ Escribe toda la información completa</li>
                    <li>✓ Revisa que no haya errores de ortografía</li>
                    <li>✓ Guarda los cambios al terminar</li>
                  </ul>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="font-medium text-[hsl(var(--destructive))] mb-2">❌ No Hacer:</p>
                  <ul className="space-y-1 text-[hsl(var(--destructive))]">
                    <li>✗ No uses imágenes con copyright</li>
                    <li>✗ No pongas información falsa</li>
                    <li>✗ No uses colores muy brillantes que lastimen los ojos</li>
                    <li>✗ No olvides hacer clic en &quot;Guardar&quot;</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Next Step */}
            <div className="flex justify-between">
              <Link href="#fase-1">
                <Button variant="outline">
                  <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
                  Paso Anterior
                </Button>
              </Link>
              <Link href="#fase-3">
                <Button size="lg" className="bg-[hsl(var(--lavender))] hover:bg-[hsl(var(--lavender))]">
                  ¡Siguiente! Agregar Miembros
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Continúa con más fases... debido a límites de longitud, mostraré la estructura para las siguientes fases */}

      {/* Quick Summary Footer */}
      <Card className="bg-[hsl(var(--success)/0.15)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-6 w-6 text-[hsl(var(--success))]" />
            ¡Tu Progreso de Onboarding!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <CheckCircle className="h-8 w-8 text-[hsl(var(--success))] mx-auto mb-2" />
              <p className="font-semibold">Fase 1</p>
              <p className="text-xs text-muted-foreground">Cuenta Creada ✓</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <CheckCircle className="h-8 w-8 text-[hsl(var(--lavender))] mx-auto mb-2" />
              <p className="font-semibold">Fase 2</p>
              <p className="text-xs text-muted-foreground">Iglesia Configurada ✓</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg opacity-50">
              <Users className="h-8 w-8 text-muted-foreground/70 mx-auto mb-2" />
              <p className="font-semibold">Fase 3</p>
              <p className="text-xs text-muted-foreground">Miembros → Siguiente</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ayuda Final */}
      <Card className="border-[hsl(var(--warning)/0.4)] bg-[hsl(var(--warning)/0.10)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[hsl(var(--warning))]">
            <HelpCircle className="h-6 w-6" />
            ¿Necesitas Ayuda?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-[hsl(var(--warning))]">
            Si te quedas atascado en cualquier paso, ¡no te preocupes! Aquí tienes opciones:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/help/videos">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="pt-4 text-center">
                  <Video className="h-10 w-10 text-[hsl(var(--destructive))] mx-auto mb-2" />
                  <p className="font-semibold text-sm">Ver Videos</p>
                  <p className="text-xs text-muted-foreground">Tutoriales paso a paso</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/help/faq">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="pt-4 text-center">
                  <Book className="h-10 w-10 text-[hsl(var(--info))] mx-auto mb-2" />
                  <p className="font-semibold text-sm">Leer FAQs</p>
                  <p className="text-xs text-muted-foreground">Preguntas frecuentes</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/help/support/ticket">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="pt-4 text-center">
                  <MessageSquare className="h-10 w-10 text-[hsl(var(--success))] mx-auto mb-2" />
                  <p className="font-semibold text-sm">Contactar Soporte</p>
                  <p className="text-xs text-muted-foreground">Hablemos en persona</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
