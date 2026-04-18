'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen, Settings, Database, Code, Shield } from 'lucide-react'
import Link from 'next/link'

export default function SuperAdminAutomationManual() {
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
          <h1 className="text-3xl font-bold">Manual: Configuración Avanzada de Automatización (Super Admin)</h1>
          <p className="text-muted-foreground">Arquitectura técnica, configuración y personalización del sistema</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Warning */}
        <Card className="border-[hsl(var(--destructive)/0.3)] bg-[hsl(var(--destructive)/0.10)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[hsl(var(--destructive))]">
              <Shield className="h-5 w-5" />
              ⚠️ Solo Super Administradores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[hsl(var(--destructive))]">
              Esta guía contiene configuraciones avanzadas que pueden afectar el funcionamiento de todo el sistema.
              Solo usuarios con rol <code className="bg-[hsl(var(--destructive)/0.20)] px-2 py-1 rounded">SUPER_ADMIN</code> deben modificar estas configuraciones.
            </p>
          </CardContent>
        </Card>

        {/* System Architecture */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              🏠 Arquitectura del Ecosistema Completo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              <strong>Ecosistema Integrado:</strong> El sistema combina 5 componentes principales que trabajan 
              en sinergia para automatizar completamente el flujo de trabajo de la iglesia.
            </p>

            {/* Architecture Diagram */}
            <div className="p-4 bg-muted/30 rounded-lg border">
              <h4 className="font-semibold mb-4">📋 Flujo de Arquitectura:</h4>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex items-center gap-2">
                  <span className="bg-[hsl(var(--success)/0.10)]0 text-white px-2 py-1 rounded text-xs">1</span>
                  <span>FORM BUILDER → Crea formularios dinámicos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[hsl(var(--info)/0.10)]0 text-white px-2 py-1 rounded text-xs">2</span>
                  <span>QR GENERATOR → Genera códigos QR únicos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[hsl(var(--lavender)/0.10)]0 text-white px-2 py-1 rounded text-xs">3</span>
                  <span>FORM SUBMISSION → Captura y almacena datos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[hsl(var(--destructive)/0.10)]0 text-white px-2 py-1 rounded text-xs">4</span>
                  <span>AUTOMATION ENGINE → Ejecuta reglas automáticas</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[hsl(var(--warning)/0.10)]0 text-white px-2 py-1 rounded text-xs">5</span>
                  <span>MULTI-CHANNEL OUTPUT → SMS/Email/WhatsApp/Push</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Implementation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              🚀 Implementación Técnica del Ecosistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              <strong>Documentación Técnica:</strong> Detalles de implementación de todos los componentes 
              del sistema de automatización integrado con formularios y códigos QR.
            </p>
            
            <div className="grid gap-6">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">📝 1. FORM BUILDER SYSTEM</h4>
                <div className="text-sm space-y-2">
                  <p><strong>Ubicación:</strong> <code>/app/(dashboard)/form-builder/</code></p>
                  <p><strong>Características Técnicas:</strong></p>
                  <ul className="ml-4 space-y-1 text-xs">
                    <li>• Constructor visual drag-and-drop con React DnD</li>
                    <li>• Validación dinámica con Zod schemas</li>
                    <li>• Campos condicionales basados en lógica JavaScript</li>
                    <li>• Integración automática con CRM y automatización</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">📱 2. QR CODE SYSTEM</h4>
                <div className="text-sm space-y-2">
                  <p><strong>Tecnologías:</strong> <code>qrcode.js + sharp</code> para generación dinámica</p>
                  <p><strong>Funcionalidades:</strong></p>
                  <ul className="ml-4 space-y-1 text-xs">
                    <li>• Generación instantánea al crear formulario</li>
                    <li>• Seguimiento de escaneos en tiempo real</li>
                    <li>• URLs con parámetros de tracking automático</li>
                    <li>• Analytics de uso por ubicación geográfica</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">⚡ 3. FORM AUTOMATION ENGINE</h4>
                <div className="text-sm space-y-2">
                  <p><strong>Archivo:</strong> <code>/lib/automation-engine.ts</code> (1,215+ líneas)</p>
                  <p><strong>Integraciones Automáticas:</strong></p>
                  <ul className="ml-4 space-y-1 text-xs">
                    <li>• <strong>CRM:</strong> Crea Member, CheckIn, PrayerContact automáticamente</li>
                    <li>• <strong>Comunicaciones:</strong> SMS, Email, WhatsApp, Push notifications</li>
                    <li>• <strong>Seguimiento:</strong> Programa tareas y recordatorios automáticos</li>
                    <li>• <strong>Analytics:</strong> Calcula engagement scores y métricas</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">🤖 4. AUTOMATION TEMPLATES</h4>
                <div className="text-sm space-y-2">
                  <p><strong>Templates Disponibles:</strong> 8+ plantillas pre-configuradas</p>
                  <p><strong>Configuraciones Avanzadas:</strong></p>
                  <ul className="ml-4 space-y-1 text-xs">
                    <li>• <strong>Triggers:</strong> FORM_SUBMISSION, PRAYER_REQUEST, MEMBER_SIGNUP</li>
                    <li>• <strong>Condiciones:</strong> Lógica AND/OR con múltiples criterios</li>
                    <li>• <strong>Acciones:</strong> Multi-canal con fallback automático</li>
                    <li>• <strong>Horarios:</strong> Business hours, 24/7, programación custom</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">📊 5. SUBMISSIONS DASHBOARD</h4>
                <div className="text-sm space-y-2">
                  <p><strong>Dashboard Unificado:</strong> <code>/app/(dashboard)/form-submissions/</code></p>
                  <p><strong>Funcionalidades del Dashboard:</strong></p>
                  <ul className="ml-4 space-y-1 text-xs">
                    <li>• <strong>Vista Unificada:</strong> Visitor + Custom forms en una sola interfaz</li>
                    <li>• <strong>Filtrado Avanzado:</strong> Por fecha, formulario, email, estado</li>
                    <li>• <strong>Exportación CSV:</strong> Con branding personalizado de iglesia</li>
                    <li>• <strong>Vista de Detalles:</strong> Modal completo con toda la información</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-[hsl(var(--info)/0.10)] p-4 rounded-lg border border-[hsl(var(--info)/0.3)] mt-6">
              <h4 className="font-semibold text-foreground mb-2">🎯 Flujo Técnico Completo</h4>
              <div className="text-xs text-[hsl(var(--info))] space-y-1">
                <p><strong>1.</strong> Usuario escanea QR → Abre formulario público</p>
                <p><strong>2.</strong> Submite formulario → POST /api/visitor-form/[slug]</p>
                <p><strong>3.</strong> Sistema guarda submisión → Dispara FormAutomationEngine</p>
                <p><strong>4.</strong> Engine busca templates activos → Ejecuta automatizaciones</p>
                <p><strong>5.</strong> Envía mensajes multi-canal → Crea registros CRM</p>
                <p><strong>6.</strong> Todo visible en dashboard → Analytics y seguimiento</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              🔧 Configuración Avanzada del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-[hsl(var(--warning)/0.10)]">
                <h4 className="font-semibold mb-2">⚙️ Variables de Entorno Críticas</h4>
                <div className="text-sm space-y-1">
                  <div className="bg-white p-3 rounded font-mono text-xs">
                    <div>TWILIO_ACCOUNT_SID=your_twilio_account_sid</div>
                    <div>TWILIO_AUTH_TOKEN=your_twilio_auth_token</div>
                    <div>MAILGUN_API_KEY=your_mailgun_api_key</div>
                    <div>MAILGUN_DOMAIN=your_mailgun_domain</div>
                    <div>FIREBASE_SERVER_KEY=your_firebase_server_key</div>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-[hsl(var(--info)/0.10)]">
                <h4 className="font-semibold mb-2">🔄 Pipeline de Automatización</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Orden de Procesamiento:</strong></p>
                  <ol className="ml-4 space-y-1">
                    <li>1. Form submission webhook → Database save</li>
                    <li>2. Automation trigger → Template matching</li>
                    <li>3. Condition evaluation → Action execution</li>
                    <li>4. Multi-channel dispatch → Delivery tracking</li>
                    <li>5. Analytics collection → Performance monitoring</li>
                  </ol>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-[hsl(var(--success)/0.10)]">
                <h4 className="font-semibold mb-2">📈 Métricas de Sistema</h4>
                <div className="text-sm space-y-1">
                  <ul className="ml-4 space-y-1">
                    <li>• <strong>Throughput:</strong> 1000+ form submissions/hour</li>
                    <li>• <strong>Latencia:</strong> &lt;2s automation response time</li>
                    <li>• <strong>Confiabilidad:</strong> 99.9% delivery rate</li>
                    <li>• <strong>Escalabilidad:</strong> Soporte para 1000+ iglesias</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Gateway Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              💳 Configuración de Pasarelas de Pago LATAM
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              <strong>Sistema Multi-Gateway:</strong> Configuración de 6 pasarelas de pago para cobertura 
              completa en América Latina (7 países, 425M católicos).
            </p>

            <div className="grid gap-6">
              <div className="p-4 border rounded-lg bg-[hsl(var(--info)/0.10)]">
                <h4 className="font-semibold mb-3">🌎 Pasarelas Disponibles (Enero 2026)</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold mb-2">Universal LATAM:</p>
                    <ul className="ml-4 space-y-1">
                      <li>• <strong>MercadoPago:</strong> 7 países (AR, BR, MX, CO, CL, PE, UY)</li>
                      <li>• Comisión: 3.5%-5.9%</li>
                      <li>• Métodos: Tarjetas, transferencias, efectivo</li>
                      <li>• Setup: GRATUITO</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Brasil:</p>
                    <ul className="ml-4 space-y-1">
                      <li>• <strong>PIX:</strong> Pagos instantáneos 24/7</li>
                      <li>• Comisión: 0%-1% (más bajo del mercado)</li>
                      <li>• Adopción: 70% del mercado digital</li>
                      <li>• Procesamiento: Tiempo real</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">México:</p>
                    <ul className="ml-4 space-y-1">
                      <li>• <strong>SPEI:</strong> Transferencias bancarias</li>
                      <li>• <strong>OXXO:</strong> 20,000+ tiendas de efectivo</li>
                      <li>• Comisión: 1.5%-3%</li>
                      <li>• Cobertura: 60% población sin banco</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Colombia:</p>
                    <ul className="ml-4 space-y-1">
                      <li>• <strong>PSE:</strong> Todos los bancos colombianos</li>
                      <li>• <strong>Nequi:</strong> Billetera digital Bancolombia</li>
                      <li>• Comisión: 1%-3.5%</li>
                      <li>• Adopción: 80% mercado bancario</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-[hsl(var(--lavender)/0.10)]">
                <h4 className="font-semibold mb-3">🔐 Variables de Entorno Requeridas</h4>
                <div className="text-sm space-y-3 font-mono">
                  <div className="space-y-1">
                    <p className="font-semibold text-xs">MercadoPago (Universal):</p>
                    <div>MERCADOPAGO_ACCESS_TOKEN=your_access_token</div>
                    <div>MERCADOPAGO_PUBLIC_KEY=your_public_key</div>
                    <div>MERCADOPAGO_TEST_MODE=false</div>
                    <div>MERCADOPAGO_WEBHOOK_URL=https://app.railway.app/api/webhooks/mercadopago</div>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-xs">PIX (Brasil):</p>
                    <div>PIX_KEY=your_pix_key</div>
                    <div>PIX_API_KEY=your_api_key</div>
                    <div>PIX_TEST_MODE=false</div>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-xs">Conekta (SPEI + OXXO México):</p>
                    <div>CONEKTA_MERCHANT_ID=your_merchant_id</div>
                    <div>CONEKTA_API_KEY=your_private_key</div>
                    <div>CONEKTA_TEST_MODE=false</div>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-xs">Colombia (Ya Configurado):</p>
                    <div>PSE_MERCHANT_ID=existing_value</div>
                    <div>PSE_API_KEY=existing_value</div>
                    <div>NEQUI_CLIENT_ID=existing_value</div>
                    <div>NEQUI_CLIENT_SECRET=existing_value</div>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-[hsl(var(--warning)/0.10)]">
                <h4 className="font-semibold mb-3">🔄 Webhooks de Pasarelas</h4>
                <div className="text-sm space-y-2">
                  <p><strong>URLs a Registrar en Dashboards:</strong></p>
                  <ul className="ml-4 space-y-1 font-mono text-xs">
                    <li>• /api/webhooks/mercadopago (MercadoPago)</li>
                    <li>• /api/webhooks/pix (PIX Brasil)</li>
                    <li>• /api/webhooks/conekta (SPEI + OXXO)</li>
                    <li>• /api/webhooks/stripe (Stripe internacional)</li>
                  </ul>
                  <p className="mt-2"><strong>Seguridad de Webhooks:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• MercadoPago: x-signature + x-request-id headers</li>
                    <li>• PIX: Bearer token authentication</li>
                    <li>• Conekta: x-conekta-signature header</li>
                    <li>• Todos validan firma criptográfica</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-[hsl(var(--success)/0.10)]">
                <h4 className="font-semibold mb-3">📊 Base de Datos: online_payments</h4>
                <div className="text-sm space-y-2">
                  <p><strong>Tabla Principal de Pagos Online:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• <strong>paymentId:</strong> ID único del gateway (campo UNIQUE)</li>
                    <li>• <strong>gatewayType:</strong> mercadopago, pix, spei, oxxo, pse, nequi</li>
                    <li>• <strong>status:</strong> pending, completed, failed, cancelled</li>
                    <li>• <strong>webhookReceived:</strong> Confirma procesamiento de webhook</li>
                    <li>• <strong>donationId:</strong> Link a registro de donación (después de aprobación)</li>
                  </ul>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Nota: Webhooks crean registros en online_payments primero, luego se convierten 
                    a donations cuando el pago es confirmado.
                  </p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-[hsl(var(--destructive)/0.10)]">
                <h4 className="font-semibold mb-3">⚙️ Configuración por Tenant (Multi-Iglesia)</h4>
                <div className="text-sm space-y-2">
                  <p><strong>Tabla: payment_gateway_configs</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• Cada iglesia configura sus propias credenciales de gateway</li>
                    <li>• <strong>churchId + gatewayType:</strong> Clave única</li>
                    <li>• <strong>isEnabled:</strong> Activar/desactivar gateway por iglesia</li>
                    <li>• <strong>isTestMode:</strong> Modo sandbox para pruebas</li>
                    <li>• <strong>configuration:</strong> JSON con parámetros específicos del país</li>
                  </ul>
                  <p className="mt-2"><strong>Acceso Tenant:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• <code>Configuración → Donaciones → Métodos de Pago</code></li>
                    <li>• Cada iglesia gestiona sus propias pasarelas</li>
                    <li>• Super Admin no necesita configurar por iglesia</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-[hsl(var(--warning)/0.10)]">
                <h4 className="font-semibold mb-3">🚀 Roadmap Phase 4 (Semanas 8-12)</h4>
                <div className="text-sm space-y-2">
                  <p><strong>Pasarelas Pendientes:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• <strong>Chile:</strong> Webpay Plus (Transbank), Khipu</li>
                    <li>• <strong>Perú:</strong> Yape (50M usuarios), Plin, PagoEfectivo</li>
                    <li>• <strong>Argentina:</strong> Rapipago (efectivo), Pago Fácil</li>
                    <li>• <strong>Uruguay:</strong> Abitab, RedPagos (efectivo)</li>
                    <li>• <strong>Centroamérica:</strong> SINPE Móvil (Costa Rica), Yappy (Panamá)</li>
                  </ul>
                  <p className="mt-2"><strong>Meta Final:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• 14 países LATAM cubiertos</li>
                    <li>• 25+ opciones de pago</li>
                    <li>• $5M+ capacidad mensual de transacciones</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-3">📚 Documentación Técnica</h4>
                <div className="text-sm space-y-1">
                  <ul className="ml-4 space-y-1">
                    <li>• <strong>Setup Guide:</strong> LATAM_PAYMENT_GATEWAYS_GUIDE.md</li>
                    <li>• <strong>Deployment Log:</strong> LATAM_PAYMENT_GATEWAY_EXPANSION_DEPLOYMENT.md</li>
                    <li>• <strong>Code Location:</strong> /lib/payments/ (gateway implementations)</li>
                    <li>• <strong>Webhooks:</strong> /app/api/webhooks/ (payment confirmations)</li>
                    <li>• <strong>Database:</strong> prisma/schema.prisma (online_payments + payment_gateway_configs)</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}