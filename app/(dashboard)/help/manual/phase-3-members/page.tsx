'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, UserPlus, Search, Filter, Mail, Phone, MapPin, 
  Calendar, Heart, Gift, CheckCircle, ArrowRight, Play,
  AlertTriangle, Lightbulb, FileText, Edit, Trash2, Download,
  Upload, Star, Award, Target, Sparkles
} from 'lucide-react'
import Link from 'next/link'

export default function Phase3MembersGuide() {
  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-8">
      {/* Hero */}
      <div className="bg-[hsl(var(--success))] text-foreground p-8 rounded-lg">
        <div className="flex items-center gap-4">
          <Users className="h-12 w-12" />
          <div>
            <h1 className="text-4xl font-bold mb-2">👥 Fase 3: Agregar Tus Primeros Miembros</h1>
            <p className="text-xl opacity-90">
              Aprende a registrar a las personas de tu iglesia en el sistema
            </p>
          </div>
        </div>
        <div className="mt-6 flex gap-4 text-sm">
          <Badge variant="secondary" className="bg-white/20 text-white">
            <Target className="h-3 w-3 mr-1" />
            Fase 3 de 6
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white">
            <Star className="h-3 w-3 mr-1" />
            15 minutos
          </Badge>
        </div>
      </div>

      {/* Para Niños */}
      <div className="bg-[hsl(var(--warning)/0.10)] p-4 rounded-lg border-2 border-[hsl(var(--warning)/0.4)]">
        <h4 className="font-bold text-[hsl(var(--warning))] flex items-center gap-2 mb-2">
          <Heart className="h-5 w-5" />
          Para Niños: ¿Qué es un &quot;Miembro&quot;?
        </h4>
        <p className="text-sm text-[hsl(var(--warning))]">
          Un miembro es como una persona en tu lista de amigos. Así como tienes una agenda con 
          nombres y teléfonos de tus amigos, Khesed-tek es como una agenda super especial para 
          tu iglesia. Aquí guardas los nombres, cumpleaños, y datos de todas las personas que 
          van a tu iglesia. ¡Es como tener un álbum de fotos digital de tu familia de la iglesia!
        </p>
      </div>

      {/* Método 1: Agregar UN Miembro */}
      <Card className="border-[hsl(var(--success)/0.4)]">
        <CardHeader className="bg-[hsl(var(--success)/0.10)]">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="bg-[hsl(var(--success))] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              A
            </div>
            Método A: Agregar UN Miembro a la Vez
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Perfecto para empezar - agregar persona por persona
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            {[
              {
                step: "A.1",
                title: "Ir a la Página de Miembros",
                icon: <Users className="h-5 w-5 text-[hsl(var(--info))]" />,
                image: "🏠",
                description: "En el menú de la izquierda, busca y haz clic en 'Miembros'",
                tips: [
                  "Es el menú con iconos a la izquierda de tu pantalla",
                  "Busca un ícono de dos personitas 👥",
                  "La palabra 'Miembros' aparece al lado del ícono"
                ]
              },
              {
                step: "A.2",
                title: "Hacer Clic en '+ Nuevo Miembro'",
                icon: <UserPlus className="h-5 w-5 text-[hsl(var(--success))]" />,
                image: "➕",
                description: "Arriba a la derecha, verás un botón verde que dice '+ Nuevo Miembro'",
                tips: [
                  "Es un botón verde grande - no puedes perderlo",
                  "Tiene un símbolo + (más) al inicio",
                  "Se abrirá un formulario (hoja con espacios en blanco)"
                ]
              },
              {
                step: "A.3",
                title: "Llenar Información BÁSICA (Requerida)",
                icon: <FileText className="h-5 w-5 text-[hsl(var(--warning))]" />,
                image: "✏️",
                description: "Completa estos campos obligatorios - tienen una estrellita roja *",
                details: [
                  {
                    field: "Nombre Completo *",
                    example: "Ejemplo: Juan Carlos Pérez González",
                    why: "El nombre real de la persona",
                    required: true
                  },
                  {
                    field: "Email *",
                    example: "juan.perez@gmail.com",
                    why: "Para enviarle mensajes por correo",
                    required: true
                  },
                  {
                    field: "Teléfono",
                    example: "+57 300 123 4567",
                    why: "Para llamarle o enviar mensajes de texto",
                    required: false
                  },
                  {
                    field: "Género",
                    example: "Selecciona: Masculino, Femenino, u Otro",
                    why: "Para estadísticas de la iglesia",
                    required: false
                  },
                  {
                    field: "Fecha de Nacimiento",
                    example: "15/03/1985 (Día/Mes/Año)",
                    why: "Para enviar felicitaciones de cumpleaños automáticas",
                    required: false
                  }
                ]
              },
              {
                step: "A.4",
                title: "Agregar Información EXTRA (Opcional)",
                icon: <Sparkles className="h-5 w-5 text-[hsl(var(--lavender))]" />,
                image: "⭐",
                description: "Esta información NO es obligatoria, pero es muy útil:",
                details: [
                  {
                    field: "Dirección de Casa",
                    example: "Calle 123 #45-67, Apto 501, Bogotá",
                    why: "Para visitarle o enviar correspondencia"
                  },
                  {
                    field: "Estado Civil",
                    example: "Soltero, Casado, Divorciado, Viudo",
                    why: "Para actividades de parejas o solteros"
                  },
                  {
                    field: "Ocupación/Trabajo",
                    example: "Ingeniero, Profesor, Ama de casa, Estudiante",
                    why: "Para conocer las profesiones en la iglesia"
                  },
                  {
                    field: "Fecha de Bautismo",
                    example: "20/12/2023",
                    why: "Para celebrar aniversarios espirituales"
                  },
                  {
                    field: "Notas Especiales",
                    example: "Alérgico a los cacahuates, prefiere servir en alabanza",
                    why: "Información importante para recordar"
                  }
                ]
              },
              {
                step: "A.5",
                title: "Seleccionar Etapa de Vida Espiritual",
                icon: <Award className="h-5 w-5 text-[hsl(var(--warning))]" />,
                image: "🌱",
                description: "Indica en qué etapa espiritual está la persona:",
                details: [
                  {
                    stage: "🆕 VISITANTE",
                    description: "Persona nueva que está visitando la iglesia por primera vez",
                    example: "María vino por primera vez el domingo pasado"
                  },
                  {
                    stage: "🌱 NUEVO CREYENTE",
                    description: "Recién aceptó a Cristo, está aprendiendo lo básico",
                    example: "Pedro se bautizó hace 2 meses"
                  },
                  {
                    stage: "📈 CRECIMIENTO",
                    description: "Asiste regularmente, está creciendo en la fe",
                    example: "Ana viene hace 1 año y participa en estudios bíblicos"
                  },
                  {
                    stage: "🌳 MADURO",
                    description: "Cristiano consolidado, puede ayudar a otros",
                    example: "Carlos lleva 5 años, conoce bien la Biblia"
                  },
                  {
                    stage: "👑 LÍDER",
                    description: "Sirve activamente liderando ministerios",
                    example: "Laura dirige el grupo de jóvenes"
                  }
                ]
              },
              {
                step: "A.6",
                title: "Guardar el Nuevo Miembro",
                icon: <CheckCircle className="h-5 w-5 text-[hsl(var(--success))]" />,
                image: "💾",
                description: "Haz clic en el botón verde 'Guardar' abajo del formulario",
                tips: [
                  "¡No olvides hacer clic en Guardar! Si cierras sin guardar, perderás todo",
                  "Aparecerá un mensaje verde que dice 'Miembro creado exitosamente'",
                  "El nuevo miembro aparecerá en la lista de miembros",
                  "Puedes editarlo después si necesitas cambiar algo"
                ]
              }
            ].map((item, index) => (
              <Card key={index} className="border-l-4 border-l-green-500">
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
                          {item.details.map((detail: any, idx: number) => (
                            <div key={idx} className="bg-muted/30 p-3 rounded">
                              <p className="font-medium text-sm text-[hsl(var(--success))]">
                                {detail.required ? '📝 *' : '📝'} {detail.field || detail.stage}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {detail.example || detail.description}
                              </p>
                              {detail.why && (
                                <p className="text-xs text-[hsl(var(--lavender))] mt-1 italic">
                                  💡 {detail.why}
                                </p>
                              )}
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
        </CardContent>
      </Card>

      {/* Método 2: Importar MUCHOS Miembros */}
      <Card className="border-[hsl(var(--info)/0.4)]">
        <CardHeader className="bg-[hsl(var(--info)/0.10)]">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="bg-[hsl(var(--info))] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              B
            </div>
            Método B: Importar MUCHOS Miembros (Excel/CSV)
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Para cuando tienes 10, 50, 100+ personas para agregar rápidamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="bg-[hsl(var(--warning)/0.10)] p-4 rounded-lg border-2 border-[hsl(var(--warning)/0.4)]">
            <h4 className="font-bold text-[hsl(var(--warning))] flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5" />
              ¿Cuándo Usar la Importación Masiva?
            </h4>
            <ul className="text-sm text-[hsl(var(--warning))] space-y-1">
              <li>✓ Tienes una lista en Excel de 20+ personas</li>
              <li>✓ Estás migrando de otro sistema a Khesed-tek</li>
              <li>✓ Quieres ahorrar tiempo (1 vez vs 100 veces)</li>
              <li>✓ Ya tienes los datos organizados en una hoja de cálculo</li>
            </ul>
          </div>

          <div className="space-y-4">
            {[
              {
                step: "B.1",
                title: "Descargar la Plantilla Excel",
                description: "Primero necesitas el formato correcto",
                instructions: [
                  "Ve a Miembros → Haz clic en 'Importar'",
                  "Verás un botón azul 'Descargar Plantilla'",
                  "Descarga el archivo Excel a tu computadora",
                  "Ábrelo con Excel o Google Sheets"
                ]
              },
              {
                step: "B.2",
                title: "Llenar la Plantilla con Tus Miembros",
                description: "Copia la información de tus miembros a las columnas:",
                columns: [
                  { name: "nombre", description: "Nombre completo de la persona", example: "Juan Pérez" },
                  { name: "email", description: "Correo electrónico", example: "juan@gmail.com" },
                  { name: "telefono", description: "Número de teléfono", example: "+57 300 1234567" },
                  { name: "genero", description: "Masculino, Femenino, Otro", example: "Masculino" },
                  { name: "fechaNacimiento", description: "Formato: DD/MM/AAAA", example: "15/03/1985" },
                  { name: "direccion", description: "Dirección de casa", example: "Calle 123 #45-67" },
                  { name: "lifecycle", description: "VISITANTE, NUEVO_CREYENTE, CRECIMIENTO, MADURO, LIDER", example: "CRECIMIENTO" }
                ]
              },
              {
                step: "B.3",
                title: "Subir el Archivo Completado",
                instructions: [
                  "Guarda el archivo Excel en tu computadora",
                  "Vuelve a Khesed-tek → Miembros → Importar",
                  "Haz clic en 'Seleccionar Archivo' o arrastra el archivo",
                  "Selecciona tu archivo Excel guardado",
                  "Haz clic en 'Importar Miembros'"
                ]
              },
              {
                step: "B.4",
                title: "Revisar los Resultados",
                instructions: [
                  "El sistema te mostrará cuántos miembros se importaron correctamente",
                  "Si hubo errores, te dirá qué filas tienen problemas",
                  "Corrige los errores en el Excel y vuelve a importar esas filas",
                  "¡Listo! Todos tus miembros están ahora en el sistema"
                ]
              }
            ].map((item, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <h5 className="font-semibold text-lg mb-3">
                    Paso {item.step}: {item.title}
                  </h5>
                  <p className="text-muted-foreground mb-3">{item.description}</p>
                  
                  {item.instructions && (
                    <div className="bg-[hsl(var(--info)/0.10)] p-3 rounded">
                      <ol className="space-y-2 text-sm">
                        {item.instructions.map((instruction, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="font-bold text-[hsl(var(--info))]">{idx + 1}.</span>
                            <span>{instruction}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {item.columns && (
                    <div className="space-y-2 mt-3">
                      {item.columns.map((col, idx) => (
                        <div key={idx} className="bg-muted/30 p-2 rounded text-xs">
                          <span className="font-mono font-bold text-[hsl(var(--info))]">{col.name}</span>
                          <span className="text-muted-foreground"> - {col.description}</span>
                          <div className="text-[hsl(var(--lavender))] italic mt-1">Ejemplo: {col.example}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gestión de Miembros */}
      <Card className="border-[hsl(var(--lavender)/0.4)]">
        <CardHeader className="bg-[hsl(var(--lavender)/0.10)]">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Gift className="h-6 w-6" />
            Acciones con Tus Miembros
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Qué puedes hacer después de agregar miembros
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: <Search className="h-8 w-8 text-[hsl(var(--info))]" />,
                title: "Buscar Miembros",
                description: "Escribe un nombre en la barra de búsqueda arriba",
                tip: "Busca por nombre, email, o teléfono"
              },
              {
                icon: <Filter className="h-8 w-8 text-[hsl(var(--success))]" />,
                title: "Filtrar por Etapa",
                description: "Haz clic en 'Filtros' y selecciona VISITANTE, LÍDER, etc.",
                tip: "Útil para ver solo nuevos o líderes"
              },
              {
                icon: <Edit className="h-8 w-8 text-[hsl(var(--warning))]" />,
                title: "Editar Información",
                description: "Haz clic en el nombre del miembro → botón 'Editar'",
                tip: "Actualiza teléfonos, direcciones, etc."
              },
              {
                icon: <Mail className="h-8 w-8 text-[hsl(var(--lavender))]" />,
                title: "Enviar Emails",
                description: "Selecciona miembros → 'Enviar Email Masivo'",
                tip: "Comunícate con grupos específicos"
              },
              {
                icon: <Download className="h-8 w-8 text-[hsl(var(--info))]" />,
                title: "Exportar Lista",
                description: "Descarga tu lista en Excel para imprimir",
                tip: "Útil para directorios físicos"
              },
              {
                icon: <Award className="h-8 w-8 text-[hsl(var(--warning))]" />,
                title: "Ver Perfil Espiritual",
                description: "Haz clic en el miembro → pestaña 'Perfil Espiritual'",
                tip: "Dones, ministerios, crecimiento"
              }
            ].map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="mb-3 flex justify-center">{action.icon}</div>
                  <h4 className="font-semibold mb-2">{action.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{action.description}</p>
                  <div className="bg-[hsl(var(--warning)/0.10)] p-2 rounded text-xs text-[hsl(var(--warning))]">
                    💡 {action.tip}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card className="border-[hsl(var(--destructive)/0.4)] bg-[hsl(var(--destructive)/0.10)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[hsl(var(--destructive))]">
            <AlertTriangle className="h-6 w-6" />
            Problemas Comunes y Soluciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              problem: "❌ Dice que el email ya existe",
              solutions: [
                "Ese miembro ya está registrado - búscalo en la lista",
                "Si es un email duplicado real, usa +1 al final (juan+1@gmail.com)",
                "O actualiza el miembro existente en vez de crear uno nuevo"
              ]
            },
            {
              problem: "❌ La importación falla con errores",
              solutions: [
                "Verifica que las columnas tengan exactamente los nombres de la plantilla",
                "Revisa que las fechas estén en formato DD/MM/AAAA",
                "Asegúrate que lifecycle tenga valores exactos: VISITANTE, NUEVO_CREYENTE, etc.",
                "No dejes filas vacías en medio del archivo"
              ]
            },
            {
              problem: "❌ No puedo editar un miembro",
              solutions: [
                "Verifica que tienes permiso de ADMIN o PASTOR",
                "Si eres LÍDER, solo puedes ver pero no editar",
                "Contacta a tu administrador para cambiar permisos"
              ]
            },
            {
              problem: "❌ Eliminé un miembro por error",
              solutions: [
                "¡CUIDADO! Las eliminaciones son permanentes",
                "No se puede recuperar - deberás volver a crearlo",
                "Mejor desactiva miembros en vez de eliminarlos"
              ]
            }
          ].map((item, index) => (
            <div key={index} className="bg-white p-4 rounded border border-[hsl(var(--destructive)/0.3)]">
              <p className="font-medium text-[hsl(var(--destructive))] mb-2">{item.problem}</p>
              <ul className="text-sm text-[hsl(var(--destructive))] space-y-1 ml-4">
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
        <Link href="/help/manual/complete-onboarding-guide">
          <Button variant="outline" size="lg">
            <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
            Fase Anterior: Configuración
          </Button>
        </Link>
        <Link href="/help/manual/phase-4-events">
          <Button size="lg" className="bg-[hsl(var(--success))] hover:bg-[hsl(var(--success))]">
            ¡Siguiente! Crear Eventos
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
