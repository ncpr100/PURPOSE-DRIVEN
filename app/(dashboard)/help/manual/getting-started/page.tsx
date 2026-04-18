
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function GettingStartedManual() {
  return (
    <div className="container mx-auto p-6">
      <Link href="/help/manual/complete">
        <Button variant="outline" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Manual
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Manual: Primeros Pasos</h1>
          <p className="text-muted-foreground">Guía completa para comenzar con Khesed-tek Systems</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Quick Start Overview */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Bienvenido a Khesed-tek Systems Church Management Platform</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Esta guía le ayudará a configurar su iglesia en 15 minutos y comenzar a usar todas las funcionalidades del sistema.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-4 bg-[hsl(var(--info)/0.10)] rounded-lg">
                <h4 className="font-semibold">⏱️ Tiempo Total</h4>
                <p className="text-2xl font-bold text-[hsl(var(--info))]">15 min</p>
              </div>
              <div className="text-center p-4 bg-[hsl(var(--success)/0.10)] rounded-lg">
                <h4 className="font-semibold">📋 Pasos</h4>
                <p className="text-2xl font-bold text-[hsl(var(--success))]">5</p>
              </div>
              <div className="text-center p-4 bg-[hsl(var(--lavender)/0.10)] rounded-lg">
                <h4 className="font-semibold">👥 Usuario</h4>
                <p className="text-lg font-bold text-[hsl(var(--lavender))]">Cualquiera</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Account Creation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--info)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              Crear su Cuenta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">📝 Registro Inicial</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>1.1.</strong> Haga clic en &quot;Crear Cuenta&quot; en la página principal</p>
                  <p><strong>1.2.</strong> Complete el formulario con:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Email válido (será su usuario de acceso)</li>
                    <li>• Contraseña segura (mínimo 8 caracteres)</li>
                    <li>• Nombre completo</li>
                    <li>• Nombre de su iglesia</li>
                    <li>• Número de teléfono</li>
                  </ul>
                  <p><strong>1.3.</strong> Verifique su email haciendo clic en el enlace recibido</p>
                  <p><strong>1.4.</strong> Inicie sesión con sus credenciales</p>
                </div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">💡 Consejos</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use un email que revise frecuentemente</li>
                  <li>• Anote su contraseña en lugar seguro</li>
                  <li>• El nombre de la iglesia aparecerá en todos los reportes</li>
                  <li>• Su número será usado para soporte directo</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Initial Church Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--info)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
              Configuración de su Iglesia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">⛪ Información Básica</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>2.1.</strong> Vaya a <code>Configuración → Perfil de Iglesia</code></p>
                  <p><strong>2.2.</strong> Complete la información:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Nombre oficial de la iglesia</li>
                    <li>• Dirección completa</li>
                    <li>• Teléfonos de contacto</li>
                    <li>• Sitio web (opcional)</li>
                    <li>• Redes sociales</li>
                    <li>• Horarios de servicios</li>
                  </ul>
                  <p><strong>2.3.</strong> Suba el logo de su iglesia (formato PNG/JPG recomendado)</p>
                  <p><strong>2.4.</strong> Haga clic en &quot;Guardar Cambios&quot;</p>
                </div>
              </div>
              <div className="bg-[hsl(var(--warning)/0.10)] p-4 rounded-lg">
                <h4 className="font-semibold mb-2">⚠️ Importante</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Esta información aparecerá en todos los recibos de donaciones</li>
                  <li>• Los horarios de servicios se usan para eventos automáticos</li>
                  <li>• El logo debe ser de alta calidad (mínimo 512x512px)</li>
                  <li>• Puede cambiar esta información cuando guste</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: User Roles Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--info)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
              Configurar Usuarios y Roles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">👥 Jerarquía de Roles</h4>
                <div className="space-y-3 text-sm">
                  <div className="border-l-4 border-[hsl(var(--destructive))] pl-3">
                    <p><strong>SUPER_ADMIN</strong> - Acceso total al sistema</p>
                    <p className="text-muted-foreground">Configuración global, gestión de usuarios</p>
                  </div>
                  <div className="border-l-4 border-[hsl(var(--warning)/0.30)] pl-3">
                    <p><strong>ADMIN_IGLESIA</strong> - Administrador de iglesia</p>
                    <p className="text-muted-foreground">Gestión completa de la congregación</p>
                  </div>
                  <div className="border-l-4 border-[hsl(var(--info))] pl-3">
                    <p><strong>PASTOR</strong> - Supervisión ministerial</p>
                    <p className="text-muted-foreground">Gestión pastoral y ministerios</p>
                  </div>
                  <div className="border-l-4 border-[hsl(var(--success))] pl-3">
                    <p><strong>LIDER</strong> - Líder de ministerio</p>
                    <p className="text-muted-foreground">Gestión de equipos específicos</p>
                  </div>
                  <div className="border-l-4 border-gray-500 pl-3">
                    <p><strong>MIEMBRO</strong> - Miembro regular</p>
                    <p className="text-muted-foreground">Acceso básico de consulta</p>
                  </div>
                </div>
              </div>
              <div className="bg-[hsl(var(--info)/0.10)] p-4 rounded-lg">
                <h4 className="font-semibold mb-2">🔧 Cómo Configurar</h4>
                <div className="text-sm space-y-2">
                  <p><strong>3.1.</strong> Vaya a <code>Configuración → Permisos</code></p>
                  <p><strong>3.2.</strong> Haga clic en "Inicializar Sistema" (Solo PASTOR o ADMINISTRADOR de su iglesia)</p>
                  <p className="text-xs text-muted-foreground ml-6">
                    <em>Nota: El SUPER_ADMIN gestiona la plataforma Khesed-Tek completa, NO los roles de su iglesia</em>
                  </p>
                  <p><strong>3.3.</strong> En la pestaña &quot;Asignaciones&quot;:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Haga clic en &quot;Asignar Rol&quot;</li>
                    <li>• Seleccione el usuario</li>
                    <li>• Escoja el rol apropiado</li>
                    <li>• Confirme la asignación</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 4: Initial Data Import */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--info)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
              Importar Datos Iniciales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">📊 Importación de Miembros</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>4.1.</strong> Vaya a <code>Miembros → Importar</code></p>
                  <p><strong>4.2.</strong> Descargue la plantilla Excel</p>
                  <p><strong>4.3.</strong> Complete la plantilla con datos de sus miembros:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Nombre completo (obligatorio)</li>
                    <li>• Email (recomendado)</li>
                    <li>• Teléfono</li>
                    <li>• Fecha de nacimiento</li>
                    <li>• Dirección</li>
                    <li>• Estado civil</li>
                    <li>• Fecha de bautismo</li>
                  </ul>
                  <p><strong>4.4.</strong> Suba el archivo Excel</p>
                  <p><strong>4.5.</strong> Revise la vista previa y confirme</p>
                </div>
              </div>
              <div className="bg-[hsl(var(--success)/0.10)] p-4 rounded-lg">
                <h4 className="font-semibold mb-2">📋 Lista de Verificación</h4>
                <div className="text-sm space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Perfil de iglesia completado
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Al menos un ADMIN_IGLESIA asignado
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Lista de miembros importada
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Métodos de donación configurados
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Primer evento creado
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 5: First Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--info)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
              Primeros Pasos Después de la Configuración
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">🎯 Acciones Recomendadas</h4>
                <div className="space-y-3 text-sm">
                  <div className="border-l-4 border-[hsl(var(--info))] pl-3">
                    <p><strong>Crear su primer evento</strong></p>
                    <p className="text-muted-foreground">Vaya a Eventos → Nuevo Evento</p>
                  </div>
                  <div className="border-l-4 border-[hsl(var(--success))] pl-3">
                    <p><strong>Configurar donaciones</strong></p>
                    <p className="text-muted-foreground">Vaya a Donaciones → Configuración</p>
                  </div>
                  <div className="border-l-4 border-[hsl(var(--lavender))] pl-3">
                    <p><strong>Enviar primera comunicación</strong></p>
                    <p className="text-muted-foreground">Vaya a Comunicaciones → Nuevo Mensaje</p>
                  </div>
                  <div className="border-l-4 border-[hsl(var(--warning)/0.30)] pl-3">
                    <p><strong>Explorar analíticas</strong></p>
                    <p className="text-muted-foreground">Vaya a Analíticas → Resumen</p>
                  </div>
                </div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">🔗 Enlaces Útiles</h4>
                <div className="space-y-2 text-sm">
                  <Link href="/members" className="block text-[hsl(var(--info))] hover:underline">
                    → Gestión de Miembros
                  </Link>
                  <Link href="/events" className="block text-[hsl(var(--info))] hover:underline">
                    → Gestión de Eventos
                  </Link>
                  <Link href="/donations" className="block text-[hsl(var(--info))] hover:underline">
                    → Sistema de Donaciones
                  </Link>
                  <Link href="/communications" className="block text-[hsl(var(--info))] hover:underline">
                    → Comunicaciones
                  </Link>
                  <Link href="/analytics" className="block text-[hsl(var(--info))] hover:underline">
                    → Analíticas y Reportes
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Issues */}
        <Card>
          <CardHeader>
            <CardTitle>❓ Problemas Comunes y Soluciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="border rounded-lg p-3">
                <h4 className="font-semibold text-[hsl(var(--destructive))] mb-2">❌ No puedo acceder a ciertas funciones</h4>
                <p className="text-muted-foreground mb-2">
                  <strong>Solución:</strong> Verifique que tenga el rol correcto asignado. Contacte a su ADMIN_IGLESIA para ajustar permisos.
                </p>
                <p className="text-xs text-[hsl(var(--info))]">→ Ver: Manual de Permisos</p>
              </div>
              
              <div className="border rounded-lg p-3">
                <h4 className="font-semibold text-[hsl(var(--destructive))] mb-2">❌ Los miembros no aparecen después de importar</h4>
                <p className="text-muted-foreground mb-2">
                  <strong>Solución:</strong> Revise que el archivo Excel tenga las columnas correctas y que los emails sean únicos.
                </p>
                <p className="text-xs text-[hsl(var(--info))]">→ Ver: Manual de Miembros</p>
              </div>

              <div className="border rounded-lg p-3">
                <h4 className="font-semibold text-[hsl(var(--destructive))] mb-2">❌ No recibo emails de confirmación</h4>
                <p className="text-muted-foreground mb-2">
                  <strong>Solución:</strong> Revise su carpeta de spam/correo no deseado. Agregue nuestro dominio a su lista de contactos seguros.
                </p>
                <p className="text-xs text-[hsl(var(--info))]">→ Contacte soporte si persiste</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>➡️ Próximos Pasos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/help/manual/members">
                <Button variant="outline" className="w-full h-auto p-4 flex flex-col gap-2">
                  <span className="text-lg">👥</span>
                  <span className="font-semibold">Gestión de Miembros</span>
                  <span className="text-xs text-muted-foreground">Administrar su congregación</span>
                </Button>
              </Link>
              <Link href="/help/manual/donations">
                <Button variant="outline" className="w-full h-auto p-4 flex flex-col gap-2">
                  <span className="text-lg">💰</span>
                  <span className="font-semibold">Sistema de Donaciones</span>
                  <span className="text-xs text-muted-foreground">Configurar pagos</span>
                </Button>
              </Link>
              <Link href="/help/manual/events">
                <Button variant="outline" className="w-full h-auto p-4 flex flex-col gap-2">
                  <span className="text-lg">📅</span>
                  <span className="font-semibold">Gestión de Eventos</span>
                  <span className="text-xs text-muted-foreground">Crear eventos</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
