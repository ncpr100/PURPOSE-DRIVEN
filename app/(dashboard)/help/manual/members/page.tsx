
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function MembersManual() {
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
          <h1 className="text-3xl font-bold">Manual: Gestión de Miembros</h1>
          <p className="text-muted-foreground">Administración completa de su congregación</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle>👥 Gestión de Miembros - Manual Completo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Esta guía cubre todas las funcionalidades para administrar su congregación, desde la migración e importación inicial hasta el seguimiento avanzado con analytics pastoral.
            </p>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-[hsl(var(--info)/0.10)] rounded-lg">
                <h4 className="font-semibold">📋 Secciones</h4>
                <p className="text-xl font-bold text-[hsl(var(--info))]">8</p>
              </div>
              <div className="text-center p-3 bg-[hsl(var(--success)/0.10)] rounded-lg">
                <h4 className="font-semibold">⏱️ Tiempo</h4>
                <p className="text-xl font-bold text-[hsl(var(--success))]">35 min</p>
              </div>
              <div className="text-center p-3 bg-[hsl(var(--lavender)/0.10)] rounded-lg">
                <h4 className="font-semibold">🎯 Nivel</h4>
                <p className="text-lg font-bold text-[hsl(var(--lavender))]">Básico-Int.</p>
              </div>
              <div className="text-center p-3 bg-[hsl(var(--warning)/0.10)] rounded-lg">
                <h4 className="font-semibold">👤 Rol Mínimo</h4>
                <p className="text-lg font-bold text-[hsl(var(--warning))]">LIDER</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 1: Member Import - UPDATED */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--info)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              🆕 Importar Miembros desde Excel/CSV/Sistemas Externos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Migration from Church Systems */}
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-6 rounded-lg border border-[hsl(var(--info)/0.3)]">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                🔄 Migrar desde Otros Sistemas de Iglesia
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm mb-3"><strong>Sistemas Soportados:</strong></p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>✅ ChurchTrac → Export to Excel</li>
                    <li>✅ Planning Center → CSV Export</li>
                    <li>✅ Church Community Builder → Member Export</li>
                    <li>✅ FellowshipOne → Excel/CSV</li>
                    <li>✅ Breeze ChMS → Data Export</li>
                    <li>✅ Rock RMS → Export Tools</li>
                    <li>✅ Cualquier sistema con exportación Excel/CSV</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm mb-3"><strong>Proceso de Migración:</strong></p>
                  <ol className="text-xs space-y-1 text-muted-foreground">
                    <li><strong>1.</strong> Exporte datos de su sistema actual</li>
                    <li><strong>2.</strong> Descargue plantilla KHESED-TEK</li>
                    <li><strong>3.</strong> Map campos usando la plantilla</li>
                    <li><strong>4.</strong> Pruebe con 10-20 registros primero</li>
                    <li><strong>5.</strong> Importe en lotes de 200-500</li>
                    <li><strong>6.</strong> Verifique integridad de datos</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Step by Step Process */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">📊 Proceso Paso a Paso</h4>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p><strong>Paso 1:</strong> Acceder a Importación</p>
                    <p className="text-muted-foreground">Navegue a <code>Miembros → Importar Miembros</code></p>
                  </div>
                  
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p><strong>Paso 2:</strong> Descargar Plantilla</p>
                    <p className="text-muted-foreground">Haga clic en &quot;📅 Descargar Plantilla CSV&quot; para obtener formato correcto</p>
                  </div>
                  
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p><strong>Paso 3:</strong> Preparar Datos</p>
                    <p className="text-muted-foreground">Complete campos requeridos: firstName, lastName, email</p>
                  </div>
                  
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p><strong>Paso 4:</strong> Configurar Opciones</p>
                    <p className="text-muted-foreground">✅ Marque &quot;Actualizar miembros existentes&quot; si desea sobreescribir</p>
                  </div>
                  
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p><strong>Paso 5:</strong> Subir y Procesar</p>
                    <p className="text-muted-foreground">Seleccione archivo y haga clic en &quot;Iniciar Importación&quot;</p>
                  </div>
                  
                  <div className="p-3 bg-[hsl(var(--success)/0.10)] rounded-lg border border-[hsl(var(--success)/0.3)]">
                    <p><strong>Paso 6:</strong> Verificar Resultados</p>
                    <p className="text-muted-foreground">Revise resumen: ✅ Nuevos, 🔄 Actualizados, ❌ Errores</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-[hsl(var(--warning)/0.10)] p-4 rounded-lg border border-[hsl(var(--warning)/0.3)]">
                  <h4 className="font-semibold mb-2">⚠️ Errores Comunes y Soluciones</h4>
                  <ul className="text-sm space-y-2">
                    <li>
                      <p><strong>Email duplicado:</strong></p>
                      <p className="text-muted-foreground">✅ Active &quot;Actualizar existentes&quot; o use emails únicos</p>
                    </li>
                    <li>
                      <p><strong>Formato de fecha inválido:</strong></p>
                      <p className="text-muted-foreground">✅ Use YYYY-MM-DD o DD/MM/YYYY</p>
                    </li>
                    <li>
                      <p><strong>Nombres faltantes:</strong></p>
                      <p className="text-muted-foreground">✅ firstName y lastName son obligatorios</p>
                    </li>
                    <li>
                      <p><strong>Archivo muy grande:</strong></p>
                      <p className="text-muted-foreground">✅ Máximo 10MB, 1000 registros por importación</p>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-[hsl(var(--success)/0.10)] p-4 rounded-lg border border-[hsl(var(--success)/0.3)]">
                  <h4 className="font-semibold mb-2">💡 Mejores Prácticas</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Haga respaldo antes de importación masiva</li>
                    <li>• Pruebe con muestra pequeña primero</li>
                    <li>• Revise mapeo de campos automático</li>
                    <li>• Importe en horarios de poco tráfico</li>
                    <li>• Documente cambios para auditoría</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Supported Fields Table */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3">📋 Campos Soportados y Mapeo Automático</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-border rounded-lg">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="p-2 text-left font-semibold">Campo Original</th>
                        <th className="p-2 text-left font-semibold">Campo KHESED-TEK</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-t"><td className="p-2">first name, firstname, first_name</td><td className="p-2">firstName ⭐</td></tr>
                      <tr className="border-t"><td className="p-2">last name, lastname, last_name</td><td className="p-2">lastName ⭐</td></tr>
                      <tr className="border-t"><td className="p-2">email, email address, e-mail</td><td className="p-2">email ⭐</td></tr>
                      <tr className="border-t"><td className="p-2">phone, phone number, mobile, cell</td><td className="p-2">phone</td></tr>
                      <tr className="border-t"><td className="p-2">address, street address, street</td><td className="p-2">address</td></tr>
                      <tr className="border-t"><td className="p-2">city</td><td className="p-2">city</td></tr>
                      <tr className="border-t"><td className="p-2">state</td><td className="p-2">state</td></tr>
                      <tr className="border-t"><td className="p-2">zip, zip code, postal code</td><td className="p-2">zipCode</td></tr>
                    </tbody>
                  </table>
                  <p className="text-xs text-muted-foreground mt-2">⭐ = Campo requerido</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-border rounded-lg">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="p-2 text-left font-semibold">Campo Original</th>
                        <th className="p-2 text-left font-semibold">Campo KHESED-TEK</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-t"><td className="p-2">birth date, birthdate, dob</td><td className="p-2">birthDate</td></tr>
                      <tr className="border-t"><td className="p-2">gender, sex</td><td className="p-2">gender</td></tr>
                      <tr className="border-t"><td className="p-2">marital status</td><td className="p-2">maritalStatus</td></tr>
                      <tr className="border-t"><td className="p-2">occupation, job</td><td className="p-2">occupation</td></tr>
                      <tr className="border-t"><td className="p-2">membership date, join date</td><td className="p-2">membershipDate</td></tr>
                      <tr className="border-t"><td className="p-2">baptism date, baptized</td><td className="p-2">baptismDate</td></tr>
                      <tr className="border-t"><td className="p-2">notes, comments</td><td className="p-2">notes</td></tr>
                      <tr className="border-t"><td className="p-2">name, full name</td><td className="p-2">Dividido automáticamente</td></tr>
                    </tbody>
                  </table>
                  <p className="text-xs text-muted-foreground mt-2">🤖 = Procesamiento automático</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Manual Member Addition */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--info)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
              Agregar Miembros Manualmente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">➕ Nuevo Miembro</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>2.1.</strong> En la página de Miembros, haga clic en &quot;➕ Nuevo Miembro&quot;</p>
                  <p><strong>2.2.</strong> Complete el formulario:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>Información Personal:</strong> Nombre, apellidos, email, teléfono</li>
                    <li>• <strong>Información Familiar:</strong> Estado civil, hijos, cónyuge</li>
                    <li>• <strong>Información Eclesiástica:</strong> Fecha de bautismo, ministerios</li>
                    <li>• <strong>Contacto:</strong> Dirección, ciudad, código postal</li>
                  </ul>
                  <p><strong>2.3.</strong> Suba foto del miembro (opcional pero recomendado)</p>
                  <p><strong>2.4.</strong> Asigne a ministerios existentes</p>
                  <p><strong>2.5.</strong> Haga clic en &quot;💾 Guardar Miembro&quot;</p>
                </div>
              </div>
              <div className="bg-[hsl(var(--success)/0.10)] p-4 rounded-lg">
                <h4 className="font-semibold mb-2">✅ Mejores Prácticas</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Siempre incluya email para comunicaciones</li>
                  <li>• Registre fechas importantes (cumpleaños, aniversario)</li>
                  <li>• Asigne a ministerios desde el principio</li>
                  <li>• Use fotos de calidad para mejor identificación</li>
                  <li>• Mantenga la información actualizada</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Member Management Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--info)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
              Funcionalidades de Gestión
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">🔍 Búsqueda y Filtros</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Barra de Búsqueda:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Busque por nombre, email o teléfono</li>
                    <li>• Use palabras parciales (ej: &quot;juan&quot; encuentra &quot;Juan Carlos&quot;)</li>
                  </ul>
                  <p><strong>Filtros Disponibles:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>&quot;Todos los Miembros&quot;:</strong> Vista completa</li>
                    <li>• <strong>&quot;Nuevos Miembros (30d)&quot;:</strong> Incorporaciones recientes</li>
                    <li>• <strong>&quot;Cumpleaños este Mes&quot;:</strong> Celebraciones próximas</li>
                    <li>• <strong>&quot;Líderes de Ministerio&quot;:</strong> Personal ministerial</li>
                  </ul>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">🛠️ Acciones por Miembro</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Desde la lista de miembros:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>👁️ Ver:</strong> Perfil completo del miembro</li>
                    <li>• <strong>✏️ Editar:</strong> Modificar información</li>
                    <li>• <strong>📧 Contactar:</strong> Enviar email directo</li>
                    <li>• <strong>📱 Llamar:</strong> Llamada telefónica directa</li>
                    <li>• <strong>🗂️ Asignar Ministerio:</strong> Agregar a grupos</li>
                    <li>• <strong>🗑️ Archivar:</strong> Miembro inactivo (no elimina)</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Member Profile Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--info)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
              Gestión de Perfiles de Miembros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">📋 Perfil Completo</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Al hacer clic en un miembro, verá:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>Información Personal:</strong> Foto, datos básicos, contacto</li>
                    <li>• <strong>Historial de Asistencia:</strong> Eventos y servicios</li>
                    <li>• <strong>Donaciones:</strong> Historial de contribuciones</li>
                    <li>• <strong>Ministerios:</strong> Participación actual</li>
                    <li>• <strong>Familia:</strong> Relaciones familiares</li>
                    <li>• <strong>Notas Pastorales:</strong> Seguimiento personalizado</li>
                  </ul>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">🔧 Acciones del Perfil</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Botones disponibles:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>&quot;✏️ Editar Información&quot;:</strong> Modificar datos</li>
                    <li>• <strong>&quot;📧 Enviar Email&quot;:</strong> Comunicación directa</li>
                    <li>• <strong>&quot;📞 Registrar Llamada&quot;:</strong> Log de contactos</li>
                    <li>• <strong>&quot;🏷️ Asignar Etiquetas&quot;:</strong> Clasificación custom</li>
                    <li>• <strong>&quot;📝 Agregar Nota&quot;:</strong> Seguimiento pastoral</li>
                    <li>• <strong>&quot;🔄 Ver Historial&quot;:</strong> Actividad completa</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Ministry Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--info)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
              Gestión de Ministerios y Grupos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">🏛️ Crear Ministerios</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>5.1.</strong> En Miembros, haga clic en &quot;🏛️ Ministerios&quot;</p>
                  <p><strong>5.2.</strong> Haga clic en &quot;➕ Nuevo Ministerio&quot;</p>
                  <p><strong>5.3.</strong> Complete la información:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Nombre del ministerio</li>
                    <li>• Descripción y objetivos</li>
                    <li>• Líder responsable</li>
                    <li>• Horarios de reunión</li>
                    <li>• Ubicación</li>
                  </ul>
                  <p><strong>5.4.</strong> Asigne miembros al ministerio</p>
                  <p><strong>5.5.</strong> Configure permisos específicos</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">👥 Gestionar Participación</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Desde el perfil del ministerio:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>&quot;➕ Agregar Miembro&quot;:</strong> Invitar nuevos</li>
                    <li>• <strong>&quot;🔄 Cambiar Rol&quot;:</strong> Líder, participante</li>
                    <li>• <strong>&quot;📊 Ver Estadísticas&quot;:</strong> Participación</li>
                    <li>• <strong>&quot;📅 Programar Reunión&quot;:</strong> Crear eventos</li>
                    <li>• <strong>&quot;📧 Comunicar&quot;:</strong> Mensaje al grupo</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 6: Spiritual Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--info)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">6</span>
              Seguimiento Espiritual y Dones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">🎁 Gestión de Dones Espirituales</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>6.1.</strong> Navegue a <code>Dones Espirituales</code></p>
                  <p><strong>6.2.</strong> Filtros disponibles:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>&quot;Todos (X)&quot;:</strong> Lista completa</li>
                    <li>• <strong>&quot;Con Perfil (0)&quot;:</strong> Evaluaciones completadas</li>
                    <li>• <strong>&quot;Sin Evaluar&quot;:</strong> Pendientes de test</li>
                  </ul>
                  <p><strong>6.3.</strong> Para crear evaluación:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Seleccione miembro</li>
                    <li>• Haga clic en &quot;📝 Evaluar Dones&quot;</li>
                    <li>• Complete el cuestionario</li>
                    <li>• Revise resultados y recomendaciones</li>
                  </ul>
                </div>
              </div>
              <div className="bg-[hsl(var(--lavender)/0.10)] p-4 rounded-lg">
                <h4 className="font-semibold mb-2">🎯 Categorías de Dones</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Liderazgo:</strong> Administración, enseñanza</li>
                  <li>• <strong>Ministerial:</strong> Pastoral, evangelismo</li>
                  <li>• <strong>Servicio:</strong> Hospitalidad, ayuda</li>
                  <li>• <strong>Creativo:</strong> Música, arte, tecnología</li>
                  <li>• <strong>Intercesión:</strong> Oración, discernimiento</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 7: Communication Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--info)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">7</span>
              Funciones de Comunicación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">📧 Contacto Directo</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Desde la lista de miembros:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>Email Individual:</strong> Haga clic en ícono de email</li>
                    <li>• <strong>Llamada:</strong> Haga clic en ícono de teléfono</li>
                    <li>• <strong>WhatsApp:</strong> Envío automático si tiene número</li>
                  </ul>
                  <p><strong>Comunicación Masiva:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Seleccione múltiples miembros</li>
                    <li>• Haga clic en &quot;📧 Enviar Mensaje&quot;</li>
                    <li>• Escoja plantilla o escriba mensaje custom</li>
                    <li>• Programe envío o envíe inmediatamente</li>
                  </ul>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">📊 Seguimiento de Comunicaciones</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Métricas disponibles:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>Emails enviados:</strong> Total y por período</li>
                    <li>• <strong>Tasa de apertura:</strong> % que abrió el email</li>
                    <li>• <strong>Tasa de clic:</strong> % que hizo clic en enlaces</li>
                    <li>• <strong>Respuestas:</strong> Interacciones directas</li>
                  </ul>
                  <p><strong>Para ver estadísticas:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Vaya a Comunicaciones → Historial</li>
                    <li>• Seleccione el mensaje enviado</li>
                    <li>• Revise el reporte detallado</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 8: Reports and Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--info)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">8</span>
              Reportes y Análisis de Miembros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">📈 Reportes Disponibles</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>8.1.</strong> Vaya a <code>Analíticas → Miembros</code></p>
                  <p><strong>8.2.</strong> Reportes disponibles:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>Crecimiento de Membresía:</strong> Tendencias mensuales</li>
                    <li>• <strong>Distribución por Edad:</strong> Pirámide demográfica</li>
                    <li>• <strong>Participación en Ministerios:</strong> % por grupo</li>
                    <li>• <strong>Geografía:</strong> Distribución por zona</li>
                    <li>• <strong>Asistencia Promedio:</strong> % de participación</li>
                  </ul>
                  <p><strong>8.3.</strong> Use filtros de fecha para períodos específicos</p>
                  <p><strong>8.4.</strong> Exporte en Excel, CSV o PDF</p>
                </div>
              </div>
              <div className="bg-[hsl(var(--info)/0.10)] p-4 rounded-lg">
                <h4 className="font-semibold mb-2">📊 Métricas Clave</h4>
                <div className="text-sm space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">👥 Membresía Total</p>
                      <p className="text-muted-foreground">Miembros activos</p>
                    </div>
                    <div>
                      <p className="font-semibold">📈 Crecimiento</p>
                      <p className="text-muted-foreground">% mensual</p>
                    </div>
                    <div>
                      <p className="font-semibold">🎂 Cumpleaños</p>
                      <p className="text-muted-foreground">Este mes</p>
                    </div>
                    <div>
                      <p className="font-semibold">🏛️ Ministerios</p>
                      <p className="text-muted-foreground">Participación</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Reference */}
        <Card>
          <CardHeader>
            <CardTitle>⚡ Referencia Rápida de Botones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">📋 Botones de Lista</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>&quot;Todos los Miembros&quot;:</strong> Reset filtros</li>
                  <li>• <strong>&quot;Nuevos Miembros&quot;:</strong> Últimos 30 días</li>
                  <li>• <strong>&quot;Cumpleaños&quot;:</strong> Este mes</li>
                  <li>• <strong>&quot;Líderes&quot;:</strong> Personal ministerial</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🛠️ Botones de Acción</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>&quot;➕ Agregar Miembro&quot;:</strong> Formulario individual</li>
                  <li>• <strong>&quot;📥 Importar Miembros&quot;:</strong> 🆕 Carga masiva Excel/CSV/Sistemas</li>
                  <li>• <strong>&quot;📊 Exportar&quot;:</strong> Descarga lista actual</li>
                  <li>• <strong>&quot;🏦 Ministerios&quot;:</strong> Gestión de grupos</li>
                </ul>
                <div className="mt-2 p-2 bg-[hsl(var(--info)/0.10)] rounded border border-[hsl(var(--info)/0.3)]">
                  <p className="text-xs text-[hsl(var(--info))]"><strong>🆕 NUEVO:</strong> El botón &quot;Importar Miembros&quot; permite migrar desde ChurchTrac, Planning Center, Rock RMS y más!</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">👤 Botones de Perfil</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>&quot;👁️ Ver&quot;:</strong> Perfil completo</li>
                  <li>• <strong>&quot;✏️ Editar&quot;:</strong> Modificar datos</li>
                  <li>• <strong>&quot;📧 Email&quot;:</strong> Contacto directo</li>
                  <li>• <strong>&quot;🗑️ Archivar&quot;:</strong> Inactivar miembro</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
