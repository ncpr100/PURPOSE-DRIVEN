
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function SubscriptionManual() {
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
          <h1 className="text-3xl font-bold">Manual: Mi Suscripción</h1>
          <p className="text-muted-foreground">Gestión de planes y complementos</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle>💳 Mi Suscripción - Manual Completo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Esta guía cubre todo lo relacionado con la gestión de su suscripción, planes, complementos y facturación.
            </p>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <h4 className="font-semibold">📋 Secciones</h4>
                <p className="text-xl font-bold text-purple-600">5</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <h4 className="font-semibold">⏱️ Tiempo</h4>
                <p className="text-xl font-bold text-blue-600">15 min</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <h4 className="font-semibold">🎯 Nivel</h4>
                <p className="text-lg font-bold text-green-600">Básico</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <h4 className="font-semibold">👤 Rol Mínimo</h4>
                <p className="text-lg font-bold text-orange-600">ADMIN</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 1: Plan Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              Planes Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">📦 Planes Base</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>1.1.</strong> Navegue a <code>Mi Suscripción → Ver Planes</code></p>
                  <p><strong>1.2.</strong> Planes disponibles:</p>
                  <ul className="ml-4 space-y-2 text-muted-foreground">
                    <li>• <strong>📦 BÁSICO - Iglesia Pequeña:</strong>
                      <br />Gestión básica de miembros, donaciones manuales, eventos simples, comunicaciones por email, soporte por email</li>
                    <li>• <strong>🚀 PROFESIONAL - Iglesia Mediana - RECOMENDADO:</strong>
                      <br />Todas las funciones básicas + Analytics avanzados + Automatizaciones + Reportes personalizados + Soporte prioritario</li>
                    <li>• <strong>💼 EMPRESARIAL - Iglesia Grande:</strong>
                      <br />Todas las funciones profesionales + API personalizada + Integraciones avanzadas + Soporte telefónico + Consultoría estratégica</li>
                  </ul>
                  <p><strong>1.3.</strong> Para cambiar plan:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Haga clic en &quot;🔄 Cambiar Plan&quot;</li>
                    <li>• Seleccione nuevo plan</li>
                    <li>• Configure método de pago</li>
                    <li>• Confirme cambio</li>
                  </ul>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">✨ Características por Plan</h4>
                <div className="text-sm space-y-3">
                  <div>
                    <p className="font-semibold text-gray-600">📦 BÁSICO - Iglesia Pequeña</p>
                    <ul className="text-muted-foreground text-xs space-y-1">
                      <li>• Gestión básica de miembros</li>
                      <li>• Donaciones manuales</li>
                      <li>• Eventos simples</li>
                      <li>• Comunicaciones por email</li>
                      <li>• Soporte por email</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-600">🚀 PROFESIONAL - Iglesia Mediana - Recomendado</p>
                    <ul className="text-muted-foreground text-xs space-y-1">
                      <li>• Todas las funciones básicas</li>
                      <li>• Analytics avanzados</li>
                      <li>• Automatizaciones</li>
                      <li>• Reportes personalizados</li>
                      <li>• Soporte prioritario</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-green-600">💼 EMPRESARIAL - Iglesia Grande</p>
                    <ul className="text-muted-foreground text-xs space-y-1">
                      <li>• Todas las funciones profesionales</li>
                      <li>• API personalizada</li>
                      <li>• Integraciones avanzadas</li>
                      <li>• Soporte telefónico</li>
                      <li>• Consultoría estratégica</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Add-ons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
              Complementos Adicionales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">🔌 Complementos Disponibles</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>2.1.</strong> En Mi Suscripción, haga clic en &quot;🔌 Complementos&quot;</p>
                  <p><strong>2.2.</strong> Opciones disponibles:</p>
                  <ul className="ml-4 space-y-2 text-muted-foreground">
                    <li>• <strong>� Integración WhatsApp ($50,000 COP/mes):</strong>
                      <br />WhatsApp Business API completo integrado</li>
                    <li>• <strong>🎨 Marca Personalizada ($30,000 COP/mes):</strong>
                      <br />Personalización completa de colores, logo y marca</li>
                    <li>• <strong>📊 Analytics Avanzados ($40,000 COP/mes):</strong>
                      <br />Dashboards personalizados y métricas detalladas</li>
                    <li>• <strong>🆘 Soporte Prioritario ($60,000 COP/mes):</strong>
                      <br />Soporte 24/7 con respuesta en menos de 2 horas</li>
                    <li>• <strong>📱 SMS Notificaciones ($50 COP por SMS):</strong>
                      <br />Envío de notificaciones por SMS (pago por uso)</li>
                  </ul>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">💰 Gestión de Complementos</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Para activar/desactivar:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>&quot;✅ Activar&quot;:</strong> Se cobra en próxima factura</li>
                    <li>• <strong>&quot;❌ Desactivar&quot;:</strong> Válido hasta fin del período</li>
                    <li>• <strong>&quot;⏰ Programar&quot;:</strong> Activar en fecha específica</li>
                  </ul>
                  <p><strong>Facturación de complementos:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Se cobran mensualmente con el plan base</li>
                    <li>• Prorrateados si se activan a mitad de mes</li>
                    <li>• Cancelables en cualquier momento</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Billing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
              Facturación y Pagos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">💳 Métodos de Pago</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>3.1.</strong> Vaya a <code>Mi Suscripción → 💳 Facturación</code></p>
                  <p><strong>3.2.</strong> Configure método de pago principal:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>Tarjeta de crédito:</strong> Visa, MasterCard, American Express</li>
                    <li>• <strong>PayPal:</strong> Cuenta verificada</li>
                    <li>• <strong>Transferencia bancaria:</strong> Solo planes anuales</li>
                  </ul>
                  <p><strong>3.3.</strong> Configuración de facturación:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>Frecuencia:</strong> Mensual o anual (15% descuento)</li>
                    <li>• <strong>Datos fiscales:</strong> RIF/NIT para facturas</li>
                    <li>• <strong>Email de facturación:</strong> Dónde enviar recibos</li>
                  </ul>
                  <p><strong>3.4.</strong> Configure alertas de pago</p>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">📅 Ciclo de Facturación</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Facturación mensual:</strong> Mismo día cada mes</li>
                  <li>• <strong>Descuento anual:</strong> 15% pagando por adelantado</li>
                  <li>• <strong>Período de gracia:</strong> 7 días después de vencimiento</li>
                  <li>• <strong>Suspensión:</strong> Después de 15 días sin pago</li>
                </ul>
                <div className="mt-3 p-2 bg-white rounded border-l-4 border-green-400">
                  <p className="text-xs"><strong>💡 Tip:</strong> Active recordatorios por email 3 días antes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Usage Limits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
              Límites de Uso y Monitoreo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">📊 Monitorear Uso</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>4.1.</strong> En Mi Suscripción, vea la sección &quot;📊 Uso Actual&quot;</p>
                  <p><strong>4.2.</strong> Métricas monitoreadas:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>Miembros registrados:</strong> vs. límite del plan</li>
                    <li>• <strong>Almacenamiento usado:</strong> Archivos y fotos</li>
                    <li>• <strong>Emails enviados:</strong> Este mes</li>
                    <li>• <strong>SMS enviados:</strong> Cantidad y costo</li>
                    <li>• <strong>Usuarios activos:</strong> Con acceso al sistema</li>
                  </ul>
                  <p><strong>4.3.</strong> Alertas automáticas:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Al llegar al 80% del límite</li>
                    <li>• Al llegar al 95% del límite</li>
                    <li>• Cuando se excede el límite</li>
                  </ul>
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">⚠️ Límites Importantes</h4>
                <div className="text-sm space-y-2">
                  <div className="space-y-2">
                    <div>
                      <p className="font-semibold">👥 Miembros</p>
                      <p className="text-muted-foreground text-xs">Al exceder el límite se requiere upgrade inmediato</p>
                    </div>
                    <div>
                      <p className="font-semibold">💾 Almacenamiento</p>
                      <p className="text-muted-foreground text-xs">Al llenarse no se pueden subir más archivos</p>
                    </div>
                    <div>
                      <p className="font-semibold">📧 Comunicaciones</p>
                      <p className="text-muted-foreground text-xs">Límites blandos - se cobra el exceso</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
              Soporte Técnico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">🆘 Niveles de Soporte</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>5.1.</strong> Soporte incluido según plan:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>BÁSICO - Iglesia Pequeña:</strong> Email</li>
                    <li>• <strong>PROFESIONAL - Iglesia Mediana:</strong> Email + Chat</li>
                    <li>• <strong>EMPRESARIAL - Iglesia Grande:</strong> Soporte prioritario 24/7</li>
                  </ul>
                  <p><strong>5.2.</strong> Canales de contacto:</p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>📧 Email:</strong> soporte@khesedtek.com</li>
                    <li>• <strong>💬 WhatsApp:</strong> +57 302 123 4410</li>
                    <li>• <strong>💻 Chat en vivo:</strong> Planes Mediana y Grande</li>
                    <li>• <strong>📞 Teléfono:</strong> Solo plan Iglesia Grande</li>
                  </ul>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">📚 Recursos de Autoayuda</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Antes de contactar soporte:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• <strong>&quot;📖 Manual Completo&quot;:</strong> Guía detallada paso a paso</li>
                    <li>• <strong>&quot;❓ Preguntas Frecuentes&quot;:</strong> Soluciones comunes</li>
                    <li>• <strong>&quot;🎥 Videotutoriales&quot;:</strong> Demostraciones visuales</li>
                    <li>• <strong>&quot;💡 Guías Interactivas&quot;:</strong> Tutoriales paso a paso</li>
                  </ul>
                  <p><strong>Para emergencias:</strong></p>
                  <ul className="ml-4 space-y-1 text-muted-foreground">
                    <li>• Use WhatsApp para respuesta más rápida</li>
                    <li>• Indique claramente que es urgente</li>
                    <li>• Proporcione capturas de pantalla</li>
                  </ul>
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
                <h4 className="font-semibold mb-2">💳 Botones de Suscripción</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>&quot;📦 Ver Planes&quot;:</strong> Comparar opciones</li>
                  <li>• <strong>&quot;🔄 Cambiar Plan&quot;:</strong> Upgrade/downgrade</li>
                  <li>• <strong>&quot;💳 Actualizar Pago&quot;:</strong> Cambiar tarjeta</li>
                  <li>• <strong>&quot;📊 Ver Uso&quot;:</strong> Límites actuales</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🔌 Botones de Complementos</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>&quot;✅ Activar&quot;:</strong> Agregar complemento</li>
                  <li>• <strong>&quot;❌ Desactivar&quot;:</strong> Cancelar complemento</li>
                  <li>• <strong>&quot;⏰ Programar&quot;:</strong> Activar después</li>
                  <li>• <strong>&quot;📊 Ver Detalles&quot;:</strong> Información completa</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🧾 Botones de Facturación</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>&quot;🧾 Ver Facturas&quot;:</strong> Historial completo</li>
                  <li>• <strong>&quot;📥 Descargar PDF&quot;:</strong> Factura específica</li>
                  <li>• <strong>&quot;🔄 Reintentar Pago&quot;:</strong> Si falló</li>
                  <li>• <strong>&quot;📧 Contactar Soporte&quot;:</strong> Ayuda directa</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
