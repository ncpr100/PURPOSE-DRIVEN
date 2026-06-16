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
            <h1 className="text-4xl font-bold mb-2"> Fase 3: Agregar Tus Primeros Miembros</h1>
            <p className="text-xl opacity-90">
              Aprende a registrar a las personas de tu iglesia en el sistema
            </p>
          </div>
        </div>
        <div className="mt-6 flex gap-4 text-sm">
          <Badge variant="secondary" className="bg-[hsl(var(--card))]/20 text-white">
            <Target className="h-3 w-3 mr-1" />
            Fase 3 de 6
          </Badge>
          <Badge variant="secondary" className="bg-[hsl(var(--card))]/20 text-white">
            <Star className="h-3 w-3 mr-1" />
            15 minutos
          </Badge>
        </div>
      </div>

      {/* Para NiÒ±os */}
      <div className="bg-[hsl(var(--warning)/0.10)] p-4 rounded-lg border-2 border-[hsl(var(--warning)/0.4)]">
        <h4 className="font-bold text-[hsl(var(--warning))] flex items-center gap-2 mb-2">
          <Heart className="h-5 w-5" />
          Para NiÒ±os: ��QuÒ© es un &quot;Miembro&quot;?
        </h4>
        <p className="text-sm text-[hsl(var(--warning))]">
          Un miembro es como una persona en tu lista de amigos. AsÒ­ como tienes una agenda con 
          nombres y telÒ©fonos de tus amigos, Khesed-tek es como una agenda super especial para 
          tu iglesia. AquÒ­ guardas los nombres, cumpleaÒ±os, y datos de todas las personas que 
          van a tu iglesia. ��Es como tener un Ò�lbum de fotos digital de tu familia de la iglesia!
        </p>
      </div>

      {/* MÒ©todo 1: Agregar UN Miembro */}
      <Card className="border-[hsl(var(--success)/0.4)]">
        <CardHeader className="bg-[hsl(var(--success)/0.10)]">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="bg-[hsl(var(--success))] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              A
            </div>
            MÒ©todo A: Agregar UN Miembro a la Vez
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
                title: "Ir a la PÒ�gina de Miembros",
                icon: <Users className="h-5 w-5 text-[hsl(var(--info))]" />,
                image: "",
                description: "En el menÒº de la izquierda, busca y haz clic en 'Miembros'",
                tips: [
                  "Es el menÒº con iconos a la izquierda de tu pantalla",
                  "Busca un Ò­cono de dos personitas ",
                  "La palabra 'Miembros' aparece al lado del Ò­cono"
                ]
              },
              {
                step: "A.2",
                title: "Hacer Clic en '+ Nuevo Miembro'",
                icon: <UserPlus className="h-5 w-5 text-[hsl(var(--success))]" />,
                image: "",
                description: "Arriba a la derecha, verÒ�s un botÒ³n verde que dice '+ Nuevo Miembro'",
                tips: [
                  "Es un botÒ³n verde grande - no puedes perderlo",
                  "Tiene un sÒ­mbolo + (mÒ�s) al inicio",
                  "Se abrirÒ� un formulario (hoja con espacios en blanco)"
                ]
              },
              {
                step: "A.3",
                title: "Llenar InformaciÒ³n BÒSICA (Requerida)",
                icon: <FileText className="h-5 w-5 text-[hsl(var(--warning))]" />,
                image: "ï¸",
                description: "Completa estos campos obligatorios - tienen una estrellita roja *",
                details: [
                  {
                    field: "Nombre Completo *",
                    example: "Ejemplo: Juan Carlos PÒ©rez GonzÒ�lez",
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
                    field: "TelÒ©fono",
                    example: "+57 300 123 4567",
                    why: "Para llamarle o enviar mensajes de texto",
                    required: false
                  },
                  {
                    field: "GÒ©nero",
                    example: "Selecciona: Masculino, Femenino, u Otro",
                    why: "Para estadÒ­sticas de la iglesia",
                    required: false
                  },
                  {
                    field: "Fecha de Nacimiento",
                    example: "15/03/1985 (DÒ­a/Mes/AÒ±o)",
                    why: "Para enviar felicitaciones de cumpleaÒ±os automÒ�ticas",
                    required: false
                  }
                ]
              },
              {
                step: "A.4",
                title: "Agregar InformaciÒ³n EXTRA (Opcional)",
                icon: <Sparkles className="h-5 w-5 text-[hsl(var(--lavender))]" />,
                image: "â­",
                description: "Esta informaciÒ³n NO es obligatoria, pero es muy Òºtil:",
                details: [
                  {
                    field: "DirecciÒ³n de Casa",
                    example: "Calle 123 #45-67, Apto 501, BogotÒ�",
                    why: "Para visitarle o enviar correspondencia"
                  },
                  {
                    field: "Estado Civil",
                    example: "Soltero, Casado, Divorciado, Viudo",
                    why: "Para actividades de parejas o solteros"
                  },
                  {
                    field: "OcupaciÒ³n/Trabajo",
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
                    example: "AlÒ©rgico a los cacahuates, prefiere servir en alabanza",
                    why: "InformaciÒ³n importante para recordar"
                  }
                ]
              },
              {
                step: "A.5",
                title: "Seleccionar Etapa de Vida Espiritual",
                icon: <Award className="h-5 w-5 text-[hsl(var(--warning))]" />,
                image: "",
                description: "Indica en quÒ© etapa espiritual estÒ� la persona:",
                details: [
                  {
                    stage: "ðŸ⬠⬢ VISITANTE",
                    description: "Persona nueva que estÒ� visitando la iglesia por primera vez",
                    example: "MarÒ­a vino por primera vez el domingo pasado"
                  },
                  {
                    stage: " NUEVO CREYENTE",
                    description: "ReciÒ©n aceptÒ³ a Cristo, estÒ� aprendiendo lo bÒ�sico",
                    example: "Pedro se bautizÒ³ hace 2 meses"
                  },
                  {
                    stage: " CRECIMIENTO",
                    description: "Asiste regularmente, estÒ� creciendo en la fe",
                    example: "Ana viene hace 1 aÒ±o y participa en estudios bÒ­blicos"
                  },
                  {
                    stage: " MADURO",
                    description: "Cristiano consolidado, puede ayudar a otros",
                    example: "Carlos lleva 5 aÒ±os, conoce bien la Biblia"
                  },
                  {
                    stage: " LÒDER",
                    description: "Sirve activamente liderando ministerios",
                    example: "Laura dirige el grupo de jÒ³venes"
                  }
                ]
              },
              {
                step: "A.6",
                title: "Guardar el Nuevo Miembro",
                icon: <CheckCircle className="h-5 w-5 text-[hsl(var(--success))]" />,
                image: "",
                description: "Haz clic en el botÒ³n verde 'Guardar' abajo del formulario",
                tips: [
                  "��No olvides hacer clic en Guardar! Si cierras sin guardar, perderÒ�s todo",
                  "AparecerÒ� un mensaje verde que dice 'Miembro creado exitosamente'",
                  "El nuevo miembro aparecerÒ� en la lista de miembros",
                  "Puedes editarlo despuÒ©s si necesitas cambiar algo"
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
                                {detail.required ? ' *' : ''} {detail.field || detail.stage}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {detail.example || detail.description}
                              </p>
                              {detail.why && (
                                <p className="text-xs text-[hsl(var(--lavender))] mt-1 italic">
                                   {detail.why}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {item.tips && (
                        <div className="bg-[hsl(var(--success)/0.10)] p-3 rounded-lg">
                          <p className="text-xs font-medium text-[hsl(var(--success))] mb-2">
                             Consejos Òštiles:
                          </p>
                          <ul className="text-xs text-[hsl(var(--success))] space-y-1">
                            {item.tips.map((tip, idx) => (
                              <li key={idx}>â��¢ {tip}</li>
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

      {/* MÒ©todo 2: Importar MUCHOS Miembros */}
      <Card className="border-[hsl(var(--info)/0.4)]">
        <CardHeader className="bg-[hsl(var(--info)/0.10)]">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="bg-[hsl(var(--info))] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              B
            </div>
            MÒ©todo B: Importar MUCHOS Miembros (Excel/CSV)
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Para cuando tienes 10, 50, 100+ personas para agregar rÒ�pidamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="bg-[hsl(var(--warning)/0.10)] p-4 rounded-lg border-2 border-[hsl(var(--warning)/0.4)]">
            <h4 className="font-bold text-[hsl(var(--warning))] flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5" />
              ��CuÒ�ndo Usar la ImportaciÒ³n Masiva?
            </h4>
            <ul className="text-sm text-[hsl(var(--warning))] space-y-1">
              <li> Tienes una lista en Excel de 20+ personas</li>
              <li> EstÒ�s migrando de otro sistema a Khesed-tek</li>
              <li> Quieres ahorrar tiempo (1 vez vs 100 veces)</li>
              <li> Ya tienes los datos organizados en una hoja de cÒ�lculo</li>
            </ul>
          </div>

          <div className="space-y-4">
            {[
              {
                step: "B.1",
                title: "Descargar la Plantilla Excel",
                description: "Primero necesitas el formato correcto",
                instructions: [
                  "Ve a Miembros â⬠�" Haz clic en 'Importar'",
                  "VerÒ�s un botÒ³n azul 'Descargar Plantilla'",
                  "Descarga el archivo Excel a tu computadora",
                  "Òbrelo con Excel o Google Sheets"
                ]
              },
              {
                step: "B.2",
                title: "Llenar la Plantilla con Tus Miembros",
                description: "Copia la informaciÒ³n de tus miembros a las columnas:",
                columns: [
                  { name: "nombre", description: "Nombre completo de la persona", example: "Juan PÒ©rez" },
                  { name: "email", description: "Correo electrÒ³nico", example: "juan@gmail.com" },
                  { name: "telefono", description: "NÒºmero de telÒ©fono", example: "+57 300 1234567" },
                  { name: "genero", description: "Masculino, Femenino, Otro", example: "Masculino" },
                  { name: "fechaNacimiento", description: "Formato: DD/MM/AAAA", example: "15/03/1985" },
                  { name: "direccion", description: "DirecciÒ³n de casa", example: "Calle 123 #45-67" },
                  { name: "lifecycle", description: "VISITANTE, NUEVO_CREYENTE, CRECIMIENTO, MADURO, LIDER", example: "CRECIMIENTO" }
                ]
              },
              {
                step: "B.3",
                title: "Subir el Archivo Completado",
                instructions: [
                  "Guarda el archivo Excel en tu computadora",
                  "Vuelve a Khesed-tek â⬠�" Miembros â⬠�" Importar",
                  "Haz clic en 'Seleccionar Archivo' o arrastra el archivo",
                  "Selecciona tu archivo Excel guardado",
                  "Haz clic en 'Importar Miembros'"
                ]
              },
              {
                step: "B.4",
                title: "Revisar los Resultados",
                instructions: [
                  "El sistema te mostrarÒ� cuÒ�ntos miembros se importaron correctamente",
                  "Si hubo errores, te dirÒ� quÒ© filas tienen problemas",
                  "Corrige los errores en el Excel y vuelve a importar esas filas",
                  "��Listo! Todos tus miembros estÒ�n ahora en el sistema"
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

      {/* GestiÒ³n de Miembros */}
      <Card className="border-[hsl(var(--lavender)/0.4)]">
        <CardHeader className="bg-[hsl(var(--lavender)/0.10)]">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Gift className="h-6 w-6" />
            Acciones con Tus Miembros
          </CardTitle>
          <CardDescription className="text-base mt-2">
            QuÒ© puedes hacer despuÒ©s de agregar miembros
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: <Search className="h-8 w-8 text-[hsl(var(--info))]" />,
                title: "Buscar Miembros",
                description: "Escribe un nombre en la barra de bÒºsqueda arriba",
                tip: "Busca por nombre, email, o telÒ©fono"
              },
              {
                icon: <Filter className="h-8 w-8 text-[hsl(var(--success))]" />,
                title: "Filtrar por Etapa",
                description: "Haz clic en 'Filtros' y selecciona VISITANTE, LÒDER, etc.",
                tip: "Òštil para ver solo nuevos o lÒ­deres"
              },
              {
                icon: <Edit className="h-8 w-8 text-[hsl(var(--warning))]" />,
                title: "Editar InformaciÒ³n",
                description: "Haz clic en el nombre del miembro â⬠�" botÒ³n 'Editar'",
                tip: "Actualiza telÒ©fonos, direcciones, etc."
              },
              {
                icon: <Mail className="h-8 w-8 text-[hsl(var(--lavender))]" />,
                title: "Enviar Emails",
                description: "Selecciona miembros â⬠�" 'Enviar Email Masivo'",
                tip: "ComunÒ­cate con grupos especÒ­ficos"
              },
              {
                icon: <Download className="h-8 w-8 text-[hsl(var(--info))]" />,
                title: "Exportar Lista",
                description: "Descarga tu lista en Excel para imprimir",
                tip: "Òštil para directorios fÒ­sicos"
              },
              {
                icon: <Award className="h-8 w-8 text-[hsl(var(--warning))]" />,
                title: "Ver Perfil Espiritual",
                description: "Haz clic en el miembro â⬠�" pestaÒ±a 'Perfil Espiritual'",
                tip: "Dones, ministerios, crecimiento"
              }
            ].map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="mb-3 flex justify-center">{action.icon}</div>
                  <h4 className="font-semibold mb-2">{action.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{action.description}</p>
                  <div className="bg-[hsl(var(--warning)/0.10)] p-2 rounded text-xs text-[hsl(var(--warning))]">
                     {action.tip}
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
              problem: " Dice que el email ya existe",
              solutions: [
                "Ese miembro ya estÒ� registrado - bÒºscalo en la lista",
                "Si es un email duplicado real, usa +1 al final (juan+1@gmail.com)",
                "O actualiza el miembro existente en vez de crear uno nuevo"
              ]
            },
            {
              problem: " La importaciÒ³n falla con errores",
              solutions: [
                "Verifica que las columnas tengan exactamente los nombres de la plantilla",
                "Revisa que las fechas estÒ©n en formato DD/MM/AAAA",
                "AsegÒºrate que lifecycle tenga valores exactos: VISITANTE, NUEVO_CREYENTE, etc.",
                "No dejes filas vacÒ­as en medio del archivo"
              ]
            },
            {
              problem: " No puedo editar un miembro",
              solutions: [
                "Verifica que tienes permiso de ADMIN o PASTOR",
                "Si eres LÒDER, solo puedes ver pero no editar",
                "Contacta a tu administrador para cambiar permisos"
              ]
            },
            {
              problem: " EliminÒ© un miembro por error",
              solutions: [
                "��CUIDADO! Las eliminaciones son permanentes",
                "No se puede recuperar - deberÒ�s volver a crearlo",
                "Mejor desactiva miembros en vez de eliminarlos"
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

      {/* Navigation */}
      <div className="flex justify-between">
        <Link href="/help/manual/complete-onboarding-guide">
          <Button variant="outline" size="lg">
            <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
            Fase Anterior: ConfiguraciÒ³n
          </Button>
        </Link>
        <Link href="/help/manual/phase-4-events">
          <Button size="lg" className="bg-[hsl(var(--success))] hover:bg-[hsl(var(--success))]">
            ��Siguiente! Crear Eventos
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
