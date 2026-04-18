
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function DonationsManual() {
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
          <h1 className="text-3xl font-bold">Manual: Sistema de Donaciones</h1>
          <p className="text-muted-foreground">Configuración y gestión de donaciones</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle>💰 Sistema de Donaciones - Manual Completo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Esta guía cubre todas las funcionalidades para configurar, gestionar y hacer seguimiento de las donaciones de su iglesia.
            </p>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-[hsl(var(--success)/0.10)] rounded-lg">
                <h4 className="font-semibold">📋 Secciones</h4>
                <p className="text-xl font-bold text-[hsl(var(--success))]">6</p>
              </div>
              <div className="text-center p-3 bg-[hsl(var(--info)/0.10)] rounded-lg">
                <h4 className="font-semibold">⏱️ Tiempo</h4>
                <p className="text-xl font-bold text-[hsl(var(--info))]">20 min</p>
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

        {/* Section 1: Initial Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--success)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              Configuración Inicial del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">⚙️ Configuración Básica</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>1.1.</strong> Navegue a <code>Donaciones → ⚙️ Configuración</code></p>
                  <p><strong>1.2.</strong> Configure información de la iglesia:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>Nombre oficial:</strong> Para recibos fiscales</li>
                    <li>• <strong>RIF/NIT:</strong> Identificación tributaria</li>
                    <li>• <strong>Dirección fiscal:</strong> Para documentos legales</li>
                    <li>• <strong>Teléfono oficial:</strong> Contacto para donadores</li>
                  </ul>
                  <p><strong>1.3.</strong> Configure moneda y formatos:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Moneda principal (USD, COP, VES, etc.)</li>
                    <li>• Formato de números</li>
                    <li>• Idioma de recibos</li>
                  </ul>
                  <p><strong>1.4.</strong> Haga clic en &quot;💾 Guardar Configuración&quot;</p>
                </div>
              </div>
              <div className="bg-[hsl(var(--warning)/0.10)] p-4 rounded-lg">
                <h4 className="font-semibold mb-2">⚠️ Requisitos Legales</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Registro religioso:</strong> Debe tener estatus legal como iglesia</li>
                  <li>• <strong>Documentación fiscal:</strong> RIF/NIT actualizado</li>
                  <li>• <strong>Recibos obligatorios:</strong> Para donaciones deducibles</li>
                  <li>• <strong>Reportes anuales:</strong> Declaraciones de impuestos</li>
                </ul>
                <div className="mt-3 p-2 bg-white rounded border-l-4 border-[hsl(var(--warning)/0.30)]">
                  <p className="text-xs"><strong>💡 Consulte:</strong> Su contador o asesor legal sobre requisitos específicos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Donation Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--success)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
              Categorías de Donaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">🏷️ Crear Categorías</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>2.1.</strong> En Donaciones, haga clic en &quot;🏷️ Categorías&quot;</p>
                  <p><strong>2.2.</strong> Haga clic en &quot;➕ Nueva Categoría&quot;</p>
                  <p><strong>2.3.</strong> Complete la información:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>Nombre:</strong> Ej: &quot;Diezmos&quot;, &quot;Ofrendas&quot;, &quot;Misiones&quot;</li>
                    <li>• <strong>Descripción:</strong> Propósito específico</li>
                    <li>• <strong>Color de identificación:</strong> Para reportes</li>
                    <li>• <strong>Meta mensual:</strong> Objetivo financiero (opcional)</li>
                  </ul>
                  <p><strong>2.4.</strong> Configure opciones avanzadas:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Deducible de impuestos (Sí/No)</li>
                    <li>• Visible en donaciones online</li>
                    <li>• Requiere aprobación pastoral</li>
                  </ul>
                </div>
              </div>
              <div className="bg-[hsl(var(--success)/0.10)] p-4 rounded-lg">
                <h4 className="font-semibold mb-2">📋 Categorías Recomendadas</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>💰 Diezmos:</strong> 10% de ingresos regulares</li>
                  <li>• <strong>🎁 Ofrendas:</strong> Donaciones adicionales voluntarias</li>
                  <li>• <strong>🌍 Misiones:</strong> Evangelismo y trabajo misionero</li>
                  <li>• <strong>🏗️ Construcción:</strong> Infraestructura y mantenimiento</li>
                  <li>• <strong>❤️ Ayuda Social:</strong> Asistencia a necesitados</li>
                  <li>• <strong>🎪 Eventos Especiales:</strong> Conferencias, retiros</li>
                  <li>• <strong>🎵 Ministerio de Música:</strong> Instrumentos, equipo</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--success)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
              Métodos de Pago
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">💳 Configurar Métodos</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>3.1.</strong> Vaya a <code>Donaciones → 💳 Métodos de Pago</code></p>
                  <p><strong>3.2.</strong> Haga clic en &quot;➕ Nuevo Método&quot;</p>
                  <p><strong>3.3.</strong> Opciones disponibles:</p>
                  <ul className="ml-4 space-y-2 text-muted-foreground">
                    <li>• <strong>💵 Efectivo:</strong> Donaciones en persona
                      <br />Registra: cantidad, fecha, donador</li>
                    <li>• <strong>💳 Tarjeta de Crédito:</strong> Pagos en línea
                      <br />Requiere: configuración de gateway</li>
                    <li>• <strong>🏦 Transferencia Bancaria:</strong> Depósitos directos
                      <br />Incluya: número de cuenta, banco</li>
                    <li>• <strong>📱 Pago Móvil:</strong> Apps de pago
                      <br />Configure: cuentas digitales</li>
                  </ul>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">🔧 Configuración Avanzada</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Para pagos online LATAM:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>Gateway Universal:</strong> MercadoPago (Argentina, Brasil, Chile, Colombia, México, Perú, Uruguay)</li>
                    <li>• <strong>Colombia:</strong> PSE (bancos), Nequi, Daviplata</li>
                    <li>• <strong>Perú:</strong> Yape, Plin, BCP, Interbank</li>
                    <li>• <strong>México:</strong> SPEI, OXXO (20,000+ tiendas)</li>
                    <li>• <strong>Brasil:</strong> PIX (instantáneo 24/7), Boleto</li>
                    <li>• <strong>Argentina, Chile, Uruguay:</strong> MercadoPago</li>
                    <li>• <strong>Comisiones:</strong> 0%-5.9% según método</li>
                    <li>• <strong>Monedas:</strong> COP, PEN, MXN, BRL, ARS, CLP, UYU, USD</li>
                  </ul>
                  <p><strong>Configuración en Ajustes:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Vaya a <code>Configuración → Donaciones</code></li>
                    <li>• Pestaña &quot;💳 Métodos de Pago&quot;</li>
                    <li>• Seleccione el gateway según su país</li>
                    <li>• Configure credenciales API (modo prueba/producción)</li>
                    <li>• Active webhooks para confirmaciones automáticas</li>
                  </ul>
                  <p><strong>Para efectivo:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>Responsables de conteo:</strong> Asignar tesoreros</li>
                    <li>• <strong>Proceso de verificación:</strong> Doble conteo</li>
                    <li>• <strong>Depósito bancario:</strong> Procedimiento estándar</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Recording Donations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--success)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
              Registro de Donaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">📝 Registro Manual</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>4.1.</strong> Haga clic en &quot;➕ Nueva Donación&quot;</p>
                  <p><strong>4.2.</strong> Complete el formulario:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>Donador:</strong> Seleccione de lista o agregue nuevo</li>
                    <li>• <strong>Monto:</strong> Cantidad exacta</li>
                    <li>• <strong>Categoría:</strong> Diezmo, ofrenda, etc.</li>
                    <li>• <strong>Método de pago:</strong> Efectivo, transferencia, etc.</li>
                    <li>• <strong>Fecha:</strong> Cuándo se recibió</li>
                    <li>• <strong>Notas:</strong> Información adicional</li>
                  </ul>
                  <p><strong>4.3.</strong> Adjunte comprobante si es transferencia</p>
                  <p><strong>4.4.</strong> Haga clic en &quot;💾 Registrar Donación&quot;</p>
                  <p><strong>4.5.</strong> El sistema genera recibo automáticamente</p>
                </div>
              </div>
              <div className="bg-[hsl(var(--info)/0.10)] p-4 rounded-lg">
                <h4 className="font-semibold mb-2">⚡ Registro Rápido</h4>
                <div className="text-sm space-y-2">
                  <p><strong>Para donaciones frecuentes:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>&quot;⚡ Diezmo Rápido&quot;:</strong> Registro de diezmo con información predefinida</li>
                    <li>• <strong>&quot;🎁 Ofrenda Rápida&quot;:</strong> Ofrenda dominical estándar</li>
                    <li>• <strong>&quot;📋 Importar Lote&quot;:</strong> Carga masiva desde Excel</li>
                  </ul>
                  <div className="mt-3 p-2 bg-white rounded border-l-4 border-[hsl(var(--info)/0.5)]">
                    <p className="text-xs"><strong>💡 Tip:</strong> Configure donadores frecuentes para autocompletar</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Receipt Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--success)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
              Gestión de Recibos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">🧾 Generar Recibos</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>5.1.</strong> Los recibos se generan automáticamente al registrar donación</p>
                  <p><strong>5.2.</strong> Información incluida en el recibo:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Logo y datos de la iglesia</li>
                    <li>• Información del donador</li>
                    <li>• Monto y categoría</li>
                    <li>• Fecha de recepción</li>
                    <li>• Método de pago</li>
                    <li>• Firma digital</li>
                  </ul>
                  <p><strong>5.3.</strong> Opciones de entrega:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Email automático al donador</li>
                    <li>• Descarga en PDF</li>
                    <li>• Impresión directa</li>
                  </ul>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">📄 Certificados Anuales</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Al final del año fiscal:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>&quot;📄 Generar Certificados&quot;:</strong> Resumen anual por donador</li>
                    <li>• <strong>Filtrar por período:</strong> Enero-Diciembre</li>
                    <li>• <strong>Incluir solo deducibles:</strong> Según normativa fiscal</li>
                    <li>• <strong>Envío masivo:</strong> Email a todos los donadores</li>
                  </ul>
                  <p><strong>Información del certificado:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Total donado en el año</li>
                    <li>• Desglose por categoría</li>
                    <li>• Validación legal</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 6: Financial Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-[hsl(var(--success)/0.10)]0 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">6</span>
              Reportes Financieros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">📊 Reportes Disponibles</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>6.1.</strong> Acceda a <code>Analíticas → Finanzas</code></p>
                  <p><strong>6.2.</strong> Tipos de reportes:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>Ingresos por Categoría:</strong> Desglose detallado</li>
                    <li>• <strong>Tendencias Mensuales:</strong> Comparativo período</li>
                    <li>• <strong>Top Donadores:</strong> Contribuidores principales</li>
                    <li>• <strong>Métodos de Pago:</strong> Preferencias de donación</li>
                    <li>• <strong>Cumplimiento de Metas:</strong> Vs. objetivos establecidos</li>
                  </ul>
                  <p><strong>6.3.</strong> Use filtros avanzados:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Rango de fechas específico</li>
                    <li>• Categorías seleccionadas</li>
                    <li>• Métodos de pago</li>
                    <li>• Montos mínimos/máximos</li>
                  </ul>
                </div>
              </div>
              <div className="bg-[hsl(var(--success)/0.10)] p-4 rounded-lg">
                <h4 className="font-semibold mb-2">📈 Métricas Financieras</h4>
                <div className="text-sm space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">💰 Total Recaudado</p>
                      <p className="text-muted-foreground">Este mes</p>
                    </div>
                    <div>
                      <p className="font-semibold">📈 Crecimiento</p>
                      <p className="text-muted-foreground">vs. mes anterior</p>
                    </div>
                    <div>
                      <p className="font-semibold">🎯 Meta Mensual</p>
                      <p className="text-muted-foreground">% alcanzado</p>
                    </div>
                    <div>
                      <p className="font-semibold">👥 Donadores Activos</p>
                      <p className="text-muted-foreground">Únicos este mes</p>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-white rounded border-l-4 border-[hsl(var(--success)/0.30)]">
                    <p className="text-xs"><strong>📊 Export:</strong> Todos los reportes se pueden exportar en Excel, CSV, PDF</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Reference */}
        <Card>
          <CardHeader>
            <CardTitle>⚡ Referencia Rápida de Botones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">💰 Botones Principales</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>&quot;➕ Nueva Donación&quot;:</strong> Registro individual</li>
                  <li>• <strong>&quot;⚡ Diezmo Rápido&quot;:</strong> Registro rápido diezmo</li>
                  <li>• <strong>&quot;📊 Reportes&quot;:</strong> Ver analíticas financieras</li>
                  <li>• <strong>&quot;⚙️ Configuración&quot;:</strong> Ajustes del sistema</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🛠️ Botones de Gestión</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>&quot;🏷️ Categorías&quot;:</strong> Gestionar tipos de donación</li>
                  <li>• <strong>&quot;💳 Métodos&quot;:</strong> Configurar formas de pago</li>
                  <li>• <strong>&quot;📥 Importar&quot;:</strong> Carga masiva Excel</li>
                  <li>• <strong>&quot;📊 Exportar&quot;:</strong> Descargar reportes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🧾 Botones de Recibos</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>&quot;🧾 Ver Recibo&quot;:</strong> Mostrar PDF</li>
                  <li>• <strong>&quot;📧 Enviar Email&quot;:</strong> Reenviar recibo</li>
                  <li>• <strong>&quot;🖨️ Imprimir&quot;:</strong> Copia física</li>
                  <li>• <strong>&quot;📄 Certificado Anual&quot;:</strong> Resumen fiscal</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
