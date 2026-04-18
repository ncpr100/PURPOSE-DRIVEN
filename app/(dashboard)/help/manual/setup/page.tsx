
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function SetupManual() {
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
          <h1 className="text-3xl font-bold">Manual: Configuración</h1>
          <p className="text-muted-foreground">Configuración paso a paso de su iglesia</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle>⚙️ Configuración Inicial - Manual Completo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Esta guía paso a paso le ayudará a configurar completamente el sistema de gestión de su iglesia desde cero.
            </p>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-[hsl(var(--info)/0.10)] rounded-lg">
                <h4 className="font-semibold">📋 Pasos</h4>
                <p className="text-xl font-bold text-[hsl(var(--info))]">8</p>
              </div>
              <div className="text-center p-3 bg-[hsl(var(--success)/0.10)] rounded-lg">
                <h4 className="font-semibold">⏱️ Tiempo</h4>
                <p className="text-xl font-bold text-[hsl(var(--success))]">45 min</p>
              </div>
              <div className="text-center p-3 bg-[hsl(var(--lavender)/0.10)] rounded-lg">
                <h4 className="font-semibold">🎯 Nivel</h4>
                <p className="text-lg font-bold text-[hsl(var(--lavender))]">Básico</p>
              </div>
              <div className="text-center p-3 bg-[hsl(var(--warning)/0.10)] rounded-lg">
                <h4 className="font-semibold">👤 Rol Mínimo</h4>
                <p className="text-lg font-bold text-[hsl(var(--warning))]">ADMIN</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Basic Church Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--info)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              Información Básica de la Iglesia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">⛪ Datos Principales</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>1.1.</strong> Navegue a <code>Configuración → Información de la Iglesia</code></p>
                  <p><strong>1.2.</strong> Complete los campos obligatorios:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>Nombre de la iglesia:</strong> Nombre oficial completo</li>
                    <li>• <strong>Pastor principal:</strong> Nombre del líder</li>
                    <li>• <strong>Dirección:</strong> Ubicación física</li>
                    <li>• <strong>Teléfono y email:</strong> Contacto oficial</li>
                    <li>• <strong>Sitio web:</strong> URL si tiene</li>
                  </ul>
                  <p><strong>1.3.</strong> Configure información fiscal:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• RIF/NIT para donaciones</li>
                    <li>• Moneda principal</li>
                    <li>• Zona horaria</li>
                  </ul>
                  <p><strong>1.4.</strong> Suba el logo de la iglesia</p>
                </div>
              </div>
              <div className="bg-[hsl(var(--info)/0.10)] p-4 rounded-lg">
                <h4 className="font-semibold mb-2">📸 Logo de la Iglesia</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Formato recomendado:</strong> PNG con fondo transparente</li>
                  <li>• <strong>Tamaño mínimo:</strong> 300x300 píxeles</li>
                  <li>• <strong>Tamaño máximo:</strong> 2MB</li>
                  <li>• <strong>Uso:</strong> Recibos, emails, reportes</li>
                </ul>
                <div className="mt-3 p-2 bg-white rounded border-l-4 border-[hsl(var(--info)/0.5)]">
                  <p className="text-xs"><strong>💡 Tip:</strong> Un logo profesional mejora la imagen de su iglesia</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: User Roles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--info)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
              Configuración de Usuarios y Roles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">🛡️ Inicializar Permisos</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>2.1.</strong> <span className="text-[hsl(var(--info))] font-bold">IMPORTANTE:</span> Solo usuarios con rol de <strong>Pastor</strong> o <strong>Administrador</strong> de su iglesia pueden hacer esto</p>
                  <p className="text-xs text-muted-foreground ml-6">
                    <em>Nota: El SUPER_ADMIN gestiona la plataforma Khesed-Tek completa, NO los roles internos de cada iglesia</em>
                  </p>
                  <p><strong>2.2.</strong> Vaya a <code>Configuración → Permisos</code></p>
                  <p><strong>2.3.</strong> Haga clic en &quot;🗄️ Inicializar Sistema&quot;</p>
                  <p><strong>2.4.</strong> El sistema creará automáticamente:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• 5 roles de iglesia predefinidos (Pastores, Administradores, Líderes, Servidores, Miembros)</li>
                    <li>• Permisos básicos para todos los recursos</li>
                    <li>• Estructura jerárquica de acceso</li>
                  </ul>
                  <p><strong>2.5.</strong> Asigne roles a su equipo pastoral y administrativo:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>Administradores:</strong> 1-2 personas de confianza con acceso completo a configuración</li>
                    <li>• <strong>Pastores:</strong> Equipo pastoral con permisos ampliados</li>
                    <li>• <strong>Líderes:</strong> Líderes de ministerio con acceso a sus áreas</li>
                    <li>• <strong>Servidores:</strong> Personal de servicio ministerial</li>
                  </ul>
                </div>
              </div>
              <div className="bg-[hsl(var(--destructive)/0.10)] p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-[hsl(var(--destructive))]">⚠️ Seguridad Crítica</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Solo ejecute una vez:</strong> No se puede deshacer</li>
                  <li>• <strong>Backup recomendado:</strong> Antes de inicializar</li>
                  <li>• <strong>Acceso inmediato:</strong> Los permisos aplican al instante</li>
                  <li>• <strong>Capacitación requerida:</strong> Explique roles a cada usuario</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Ministry Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--info)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
              Configurar Ministerios Básicos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">🏛️ Ministerios Esenciales</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>3.1.</strong> Navegue a <code>Miembros → 🏛️ Ministerios</code></p>
                  <p><strong>3.2.</strong> Cree los ministerios básicos:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>🎵 Ministerio de Música:</strong> Líderes de alabanza</li>
                    <li>• <strong>👥 Ministerio de Hospitalidad:</strong> Recepción y bienvenida</li>
                    <li>• <strong>👶 Ministerio Infantil:</strong> Cuidado de niños</li>
                    <li>• <strong>👦 Ministerio Juvenil:</strong> Adolescentes</li>
                    <li>• <strong>👴 Ministerio de Adultos Mayores:</strong> Tercera edad</li>
                    <li>• <strong>🙏 Ministerio de Intercesión:</strong> Oración</li>
                    <li>• <strong>🌍 Ministerio de Misiones:</strong> Evangelismo</li>
                  </ul>
                  <p><strong>3.3.</strong> Para cada ministerio configure:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Líder responsable</li>
                    <li>• Descripción y objetivos</li>
                    <li>• Horarios de reunión</li>
                    <li>• Requisitos para participar</li>
                  </ul>
                </div>
              </div>
              <div className="bg-[hsl(var(--success)/0.10)] p-4 rounded-lg">
                <h4 className="font-semibold mb-2">📋 Lista de Verificación</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>☐ Al menos 5 ministerios creados</li>
                  <li>☐ Cada ministerio tiene un líder asignado</li>
                  <li>☐ Descripciones completas agregadas</li>
                  <li>☐ Horarios de reunión establecidos</li>
                  <li>☐ Primeros miembros asignados</li>
                </ul>
                <div className="mt-3 p-2 bg-white rounded border-l-4 border-[hsl(var(--success)/0.30)]">
                  <p className="text-xs"><strong>💡 Tip:</strong> Puede agregar más ministerios después según crezca</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 4: Communication Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--info)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
              Configurar Sistema de Comunicaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">📧 Email y Plantillas</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>4.1.</strong> Vaya a <code>Comunicaciones → ⚙️ Configuración</code></p>
                  <p><strong>4.2.</strong> Configure servidor de email:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Email &quot;desde&quot;: iglesia@sudominio.com</li>
                    <li>• Nombre de remitente: Nombre de la Iglesia</li>
                    <li>• Servidor SMTP (si tiene)</li>
                  </ul>
                  <p><strong>4.3.</strong> Cree plantillas básicas:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Bienvenida a nuevos miembros</li>
                    <li>• Recordatorio de eventos</li>
                    <li>• Agradecimiento por donaciones</li>
                    <li>• Felicitaciones de cumpleaños</li>
                  </ul>
                  <p><strong>4.4.</strong> Configure notificaciones automáticas</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">📱 SMS y WhatsApp</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Configuración opcional pero recomendada:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>WhatsApp Business:</strong> Para comunicación directa</li>
                    <li>• <strong>Servicio SMS:</strong> Para emergencias</li>
                    <li>• <strong>Límites diarios:</strong> Evitar spam</li>
                  </ul>
                  <p><strong>Beneficios:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Mayor tasa de apertura que email</li>
                    <li>• Respuesta más rápida</li>
                    <li>• Mejor para comunicaciones urgentes</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 5: Financial Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--info)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
              Configurar Sistema de Donaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">💰 Información Fiscal</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>5.1.</strong> Vaya a <code>Donaciones → ⚙️ Configuración</code></p>
                  <p><strong>5.2.</strong> Configure datos fiscales:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>RIF/NIT:</strong> Identificación tributaria</li>
                    <li>• <strong>Dirección fiscal:</strong> Para recibos</li>
                    <li>• <strong>Representante legal:</strong> Firmante autorizado</li>
                  </ul>
                  <p><strong>5.3.</strong> Cree categorías de donación:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Diezmos (principal)</li>
                    <li>• Ofrendas</li>
                    <li>• Misiones</li>
                    <li>• Construcción/Mantenimiento</li>
                  </ul>
                  <p><strong>5.4.</strong> Configure métodos de pago aceptados</p>
                </div>
              </div>
              <div className="bg-[hsl(var(--warning)/0.10)] p-4 rounded-lg">
                <h4 className="font-semibold mb-2">⚖️ Consideraciones Legales</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Estatus religioso:</strong> Verifique que esté registrado como iglesia</li>
                  <li>• <strong>Exención fiscal:</strong> Confirme beneficios tributarios</li>
                  <li>• <strong>Recibos obligatorios:</strong> Para donaciones deducibles</li>
                  <li>• <strong>Reportes anuales:</strong> Declaraciones requeridas</li>
                </ul>
                <div className="mt-3 p-2 bg-white rounded border-l-4 border-[hsl(var(--warning)/0.30)]">
                  <p className="text-xs"><strong>💼 Consulte:</strong> Su contador sobre requisitos específicos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 6: Events Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--info)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">6</span>
              Configurar Eventos y Servicios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">📅 Eventos Regulares</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>6.1.</strong> Navegue a <code>Eventos → ⚙️ Configuración</code></p>
                  <p><strong>6.2.</strong> Configure plantillas para servicios regulares:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>Servicio Dominical:</strong> Horario, duración, ubicación</li>
                    <li>• <strong>Estudio Bíblico:</strong> Día de la semana, salón</li>
                    <li>• <strong>Oración:</strong> Reuniones de intercesión</li>
                    <li>• <strong>Eventos Especiales:</strong> Conferencias, retiros</li>
                  </ul>
                  <p><strong>6.3.</strong> Active funciones avanzadas:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Check-in con código QR</li>
                    <li>• Registro de asistencia</li>
                    <li>• Sistema de seguridad infantil</li>
                  </ul>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">🎪 Configuración Avanzada</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Para eventos con niños:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Active &quot;Seguridad Infantil WebRTC&quot;</li>
                    <li>• Configure códigos PIN de 6 dígitos</li>
                    <li>• Establezca protocolos de emergencia</li>
                  </ul>
                  <p><strong>Para visitantes:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Active &quot;Sistema de Automatización&quot;</li>
                    <li>• Configure seguimiento de 5 toques</li>
                    <li>• Conecte con ministerios apropiados</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 7: Import Initial Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--info)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">7</span>
              Importar Miembros Iniciales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">📊 Proceso de Importación</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>7.1.</strong> Vaya a <code>Miembros → 📥 Importar</code></p>
                  <p><strong>7.2.</strong> Descargue la plantilla Excel</p>
                  <p><strong>7.3.</strong> Complete con información de su congregación:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>Datos básicos:</strong> Nombre, email, teléfono</li>
                    <li>• <strong>Información familiar:</strong> Estado civil, hijos</li>
                    <li>• <strong>Fechas importantes:</strong> Cumpleaños, bautismo</li>
                    <li>• <strong>Ministerios:</strong> Asignaciones actuales</li>
                  </ul>
                  <p><strong>7.4.</strong> Importe el archivo y revise la vista previa</p>
                  <p><strong>7.5.</strong> Corrija errores si aparecen</p>
                  <p><strong>7.6.</strong> Confirme la importación</p>
                </div>
              </div>
              <div className="bg-[hsl(var(--success)/0.10)] p-4 rounded-lg">
                <h4 className="font-semibold mb-2">📋 Preparación de Datos</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Limpie datos:</strong> Elimine duplicados</li>
                  <li>• <strong>Estandarice formatos:</strong> Fechas DD/MM/AAAA</li>
                  <li>• <strong>Verifique emails:</strong> Deben ser únicos y válidos</li>
                  <li>• <strong>Organice por lotes:</strong> Máximo 100 por archivo</li>
                </ul>
                <div className="mt-3 p-2 bg-white rounded border-l-4 border-[hsl(var(--success)/0.30)]">
                  <p className="text-xs"><strong>💾 Backup:</strong> Mantenga una copia de sus datos originales</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 8: Testing and Go-Live */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--success)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">8</span>
              Pruebas y Puesta en Marcha
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">🧪 Lista de Pruebas</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>8.1.</strong> Pruebe cada funcionalidad principal:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>☐ <strong>Crear miembro:</strong> Formulario manual</li>
                    <li>☐ <strong>Crear evento:</strong> Servicio dominical de prueba</li>
                    <li>☐ <strong>Registrar donación:</strong> Transacción de prueba</li>
                    <li>☐ <strong>Enviar comunicación:</strong> Email a usted mismo</li>
                    <li>☐ <strong>Check-in QR:</strong> Escanear código</li>
                    <li>☐ <strong>Roles y permisos:</strong> Acceso según rol</li>
                  </ul>
                  <p><strong>8.2.</strong> Invite a líderes clave para probar</p>
                  <p><strong>8.3.</strong> Entrene al equipo en funcionalidades básicas</p>
                  <p><strong>8.4.</strong> Configure backup automático</p>
                </div>
              </div>
              <div className="bg-[hsl(var(--success)/0.10)] p-4 rounded-lg">
                <h4 className="font-semibold mb-2">🚀 Lista de Go-Live</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>☐ Información de iglesia completa</li>
                  <li>☐ Roles asignados a equipo</li>
                  <li>☐ Ministerios creados y configurados</li>
                  <li>☐ Miembros importados exitosamente</li>
                  <li>☐ Comunicaciones funcionando</li>
                  <li>☐ Sistema de donaciones activo</li>
                  <li>☐ Eventos de prueba realizados</li>
                  <li>☐ Equipo capacitado</li>
                </ul>
                <div className="mt-3 p-2 bg-white rounded border-l-4 border-[hsl(var(--success)/0.30)]">
                  <p className="text-xs"><strong>🎉 ¡Listo!</strong> Su iglesia está lista para usar el sistema</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Reference */}
        <Card>
          <CardHeader>
            <CardTitle>⚡ Orden Recomendado de Configuración</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">🔥 Configuración Urgente (Día 1)</h4>
                <ol className="space-y-1 text-muted-foreground list-decimal list-inside">
                  <li>Información de la iglesia</li>
                  <li>Inicializar permisos y roles</li>
                  <li>Asignar roles a líderes clave</li>
                  <li>Crear ministerios básicos</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📈 Configuración Progresiva (Semana 1)</h4>
                <ol className="space-y-1 text-muted-foreground list-decimal list-inside" start={5}>
                  <li>Configurar comunicaciones</li>
                  <li>Importar miembros existentes</li>
                  <li>Configurar sistema de donaciones</li>
                  <li>Realizar pruebas completas</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
