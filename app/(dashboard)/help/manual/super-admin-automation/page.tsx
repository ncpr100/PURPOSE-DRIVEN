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
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <Shield className="h-5 w-5" />
              ⚠️ Solo Super Administradores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-800">
              Esta guía contiene configuraciones avanzadas que pueden afectar el funcionamiento de todo el sistema.
              Solo usuarios con rol <code className="bg-red-200 px-2 py-1 rounded">SUPER_ADMIN</code> deben modificar estas configuraciones.
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
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-semibold mb-4">📋 Flujo de Arquitectura:</h4>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex items-center gap-2">
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">1</span>
                  <span>FORM BUILDER → Crea formularios dinámicos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">2</span>
                  <span>QR GENERATOR → Genera códigos QR únicos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs">3</span>
                  <span>FORM SUBMISSION → Captura y almacena datos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">4</span>
                  <span>AUTOMATION ENGINE → Ejecuta reglas automáticas</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">5</span>
                  <span>MULTI-CHANNEL OUTPUT → SMS/Email/WhatsApp/Push</span>
                </div>
              </div>
            </div>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground mb-4">
              El sistema de automatización consta de 4 componentes principales:
            </p>

            <div className="space-y-3">
              <div className="p-4 border rounded-lg bg-gray-50">
                <h4 className="font-semibold mb-2">1. AutomationRule (Modelo de Base de Datos)</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Define las reglas de automatización con configuración JSON flexible.
                </p>
                <div className="bg-white p-3 rounded text-xs font-mono overflow-x-auto">
{`model AutomationRule {
  id                   String              @id @default(cuid())
  name                 String              // "Bienvenida Primera Vez"
  description          String?
  triggerType          AutomationTrigger   // PRAYER_REQUEST_URGENT
  conditions           Json                // {operator: 'AND', rules: [...]}
  actions              Json                // [{type: 'SEND_SMS', config: {...}}]
  isActive             Boolean             @default(false)
  priority             AutomationPriority  // URGENT, HIGH, NORMAL, LOW
  bypassApproval       Boolean             @default(false)
  retryConfig          Json?               // {maxRetries: 3, delays: [60,300,900]}
  fallbackChannels     Json?               // ['EMAIL', 'PUSH_NOTIFICATION']
  businessHoursConfig  Json?               // {timezone, days, hours, deferOutside}
  escalationConfig     Json?               // {enabled, delay, notifyUserIds}
}`}
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-gray-50">
                <h4 className="font-semibold mb-2">2. Automation Services (Procesadores)</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Servicios especializados para cada tipo de trigger:
                </p>
                <ul className="text-sm space-y-1">
                  <li>• <code className="bg-gray-200 px-1 rounded">PrayerAutomationService</code> - Procesa peticiones de oración</li>
                  <li>• <code className="bg-gray-200 px-1 rounded">VisitorAutomationService</code> - Procesa check-ins de visitantes</li>
                  <li>• Futuros: DonationAutomationService, EventAutomationService, etc.</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg bg-gray-50">
                <h4 className="font-semibold mb-2">3. Automation Execution Engine</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Motor central que ejecuta acciones con retry/fallback logic:
                </p>
                <div className="bg-white p-3 rounded text-xs">
                  <strong>Ubicación:</strong> <code>lib/automation-engine.ts</code> (720 líneas)<br/>
                  <strong>Función principal:</strong> <code>executeAutomationActions(ruleId, entityId, entityType)</code>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-gray-50">
                <h4 className="font-semibold mb-2">4. Communication Channels</h4>
                <p className="text-sm text-muted-foreground">
                  Integraciones de terceros para envío de mensajes:
                </p>
                <ul className="text-sm space-y-1 mt-2">
                  <li>• <strong>SMS/WhatsApp:</strong> Twilio API</li>
                  <li>• <strong>Email:</strong> Mailgun API</li>
                  <li>• <strong>Push Notifications:</strong> Firebase Cloud Messaging</li>
                  <li>• <strong>Phone Calls:</strong> Twilio Voice API</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Implementation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              🚀 Implementación Técnica Completa del Ecosistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              <strong>Ecosistema Técnico Completo:</strong> Documentación técnica detallada de todos los componentes 
              del sistema de automatización integrado con formularios y códigos QR.
            </p>
            
            <div className="grid gap-6">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">📝 1. FORM BUILDER SYSTEM</h4>
                <div className="text-sm space-y-2">
                  <p><strong>Ubicación:</strong> <code>/app/(dashboard)/form-builder/</code></p>
                  <p><strong>Modelos de Base de Datos:</strong></p>
                  <div className="bg-gray-100 p-3 rounded font-mono text-xs overflow-x-auto">
{`// Formularios de visitantes
model VisitorForm {
  id          String  @id @default(cuid())
  name        String
  slug        String  @unique
  fields      Json    // Configuración dinámica
  style       Json?   // Estilos personalizados  
  settings    Json?   // Configuraciones avanzadas
  isActive    Boolean @default(true)
  isPublic    Boolean @default(true)
  churchId    String
}

// Formularios personalizados
model CustomForm {
  id          String  @id @default(cuid())
  title       String
  slug        String  @unique
  fields      Json    // Array de campos dinámicos
  settings    Json?   
  churchId    String
}`}</div>
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
                  <div className="bg-gray-100 p-3 rounded font-mono text-xs overflow-x-auto">
{`// Generación automática de QR
const generateQR = async (form) => {
  const qrCode = generateUniqueCode()
  const qrUrl = \`\${baseUrl}/visitor-form/\${form.slug}?qr=\${qrCode}\`
  
  await db.visitorQRCode.create({
    data: { code: qrCode, formId: form.id, churchId: form.churchId }
  })
  
  return { qrCode, qrUrl }
}

// Modelo de seguimiento
model VisitorQRCode {
  id         String   @id @default(cuid())
  code       String   @unique  
  formId     String
  scanCount  Int      @default(0)
  lastScan   DateTime?
  churchId   String
}`}</div>
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
                  <div className="bg-gray-100 p-3 rounded font-mono text-xs overflow-x-auto">
{`// Motor principal de automatización
export class FormAutomationEngine {
  // Automatizaciones por tipo de formulario
  static async handleVisitorFormAutomation(formId, data, churchId)
  static async handlePrayerFormAutomation(formId, data, churchId) 
  static async handleVolunteerFormAutomation(formId, data, churchId)
  static async handleEventFormAutomation(formId, data, churchId)
  
  // Utilidades de procesamiento
  static extractVisitorInfo(submissionData)
  static calculateEngagementScore(visitorData)
  static autoMatchVolunteerOpportunities(volunteer)
  static sendMultiChannelWelcome(visitor, church)
}

// Integración automática en form submission
POST /api/visitor-form/[slug] → FormAutomationEngine.handleVisitorFormAutomation()`}</div>
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
                  <div className="bg-gray-100 p-3 rounded font-mono text-xs overflow-x-auto">
{`// Plantillas del sistema
const SYSTEM_TEMPLATES = [
  'template_prayer_church_notification',     // Notificación inmediata
  'template_prayer_auto_acknowledgment',     // Auto-confirmación
  'template_prayer_message_response',        // Respuesta por mensaje
  'template_prayer_call_assignment',         // Asignación de llamadas
  'template_visitor_first_time_welcome',     // Bienvenida primera vez
  'template_visitor_returning_engagement',   // Re-engagement
  'template_visitor_regular_invitation',     // Invitación membership
  'template_visitor_urgent_prayer_24x7'      // Sistema 24/7
]

// Activación API
POST /api/automation-templates/[templateId]/activate
{
  customizations: { name, triggerConfig, actionsConfig, ... },
  churchId: "church_id"
}`}</div>
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
                  <div className="bg-gray-100 p-3 rounded font-mono text-xs overflow-x-auto">
{`// APIs de datos
GET /api/visitor-submissions        // Todas las submisiones de visitantes
GET /api/custom-form-submissions    // Todas las submisiones personalizadas

// Modelos de submisiones
model VisitorSubmission {
  id            String   @id @default(cuid())
  formId        String
  data          Json     // Datos completos del formulario
  ipAddress     String   // Tracking de origen
  userAgent     String   // Info del dispositivo
  submittedAt   DateTime @default(now())
  churchId      String   // Multi-tenant scoping
}

model CustomFormSubmission {
  id            String   @id @default(cuid()) 
  formId        String
  data          Json     // Estructura dinámica
  submittedAt   DateTime @default(now())
  churchId      String
}`}</div>
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
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
              <h4 className="font-semibold text-blue-900 mb-2">🎯 Flujo Técnico Completo</h4>
              <div className="text-xs text-blue-800 space-y-1">
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

        {/* Bypass Approval */}
        <Card>
          <CardHeader>
            <CardTitle>⚡ Configuración de Bypass Approval</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Controla si las acciones se ejecutan automáticamente o requieren aprobación manual.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
                <h4 className="font-semibold text-green-900 mb-2">✅ bypassApproval: true</h4>
                <p className="text-xs text-green-800 mb-2">Ejecución inmediata sin aprobación</p>
                <div className="bg-white p-3 rounded text-xs space-y-1">
                  <div><strong>Cuándo usar:</strong></div>
                  <ul className="ml-4">
                    <li>• Mensajes de bienvenida automáticos</li>
                    <li>• Confirmaciones de recepción</li>
                    <li>• Respuestas a peticiones urgentes</li>
                    <li>• Follow-ups de rutina</li>
                  </ul>
                  <div className="mt-2"><strong>Resultado:</strong></div>
                  <ul className="ml-4">
                    <li>→ Ejecuta acciones inmediatamente</li>
                    <li>→ No crea VisitorFollowUp pendiente</li>
                    <li>→ Registra ejecución en logs</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 border-2 border-orange-200 rounded-lg bg-orange-50">
                <h4 className="font-semibold text-orange-900 mb-2">❌ bypassApproval: false</h4>
                <p className="text-xs text-orange-800 mb-2">Requiere revisión manual</p>
                <div className="bg-white p-3 rounded text-xs space-y-1">
                  <div><strong>Cuándo usar:</strong></div>
                  <ul className="ml-4">
                    <li>• Llamadas telefónicas personales</li>
                    <li>• Invitaciones a membresía</li>
                    <li>• Asignación de mentores</li>
                    <li>• Peticiones sensibles</li>
                  </ul>
                  <div className="mt-2"><strong>Resultado:</strong></div>
                  <ul className="ml-4">
                    <li>→ Crea VisitorFollowUp con status PENDING</li>
                    <li>→ Asigna a pastor o staff designado</li>
                    <li>→ Staff ejecuta manualmente cuando esté listo</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-sm mb-2">💡 Recomendación de Seguridad</h4>
              <p className="text-xs text-muted-foreground">
                Use <code className="bg-blue-200 px-1 rounded">bypassApproval: false</code> para cualquier acción que:
              </p>
              <ul className="text-xs text-muted-foreground ml-4 mt-1">
                <li>• Involucre conversación personal (llamadas)</li>
                <li>• Comprometa recursos de la iglesia (asignación de mentor)</li>
                <li>• Sea sensible (oración por enfermedad terminal)</li>
                <li>• Requiera contexto humano (discernimiento pastoral)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Retry & Fallback */}
        <Card>
          <CardHeader>
            <CardTitle>🔄 Configuración de Retry & Fallback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Sistema de reintentos y canales de respaldo para garantizar entrega de mensajes.
            </p>

            <div className="p-4 border rounded-lg bg-gray-50">
              <h4 className="font-semibold mb-3">Configuración JSON de retryConfig</h4>
              <div className="bg-white p-4 rounded-lg text-xs font-mono overflow-x-auto">
{`{
  "maxRetries": 3,                // Máximo 3 intentos adicionales
  "delays": [60, 300, 900],       // Espera 1 min, 5 min, 15 min entre intentos
  "backoffStrategy": "exponential" // Estrategia de espera
}`}
              </div>
              <div className="mt-3 text-xs space-y-1">
                <p><strong>Flujo de Ejecución:</strong></p>
                <ul className="ml-4">
                  <li>• <strong>Intento 1:</strong> Envío inmediato por canal principal (ej: SMS)</li>
                  <li>• <strong>Falla → Espera 1 min → Intento 2</strong></li>
                  <li>• <strong>Falla → Espera 5 min → Intento 3</strong></li>
                  <li>• <strong>Falla → Espera 15 min → Intento 4 (último)</strong></li>
                  <li>• <strong>Todos fallan → Activa fallback channels</strong></li>
                </ul>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-gray-50">
              <h4 className="font-semibold mb-3">Configuración JSON de fallbackChannels</h4>
              <div className="bg-white p-4 rounded-lg text-xs font-mono overflow-x-auto">
{`{
  "fallbackChannels": ["EMAIL", "PUSH_NOTIFICATION", "PHONE_CALL"]
}`}
              </div>
              <div className="mt-3 text-xs space-y-1">
                <p><strong>Orden de Prioridad:</strong></p>
                <ol className="ml-4">
                  <li>1. <strong>Canal Principal:</strong> El definido en la acción (ej: SMS)</li>
                  <li>2. <strong>Fallback 1:</strong> EMAIL (si SMS falla 4 veces)</li>
                  <li>3. <strong>Fallback 2:</strong> PUSH_NOTIFICATION (si Email falla)</li>
                  <li>4. <strong>Fallback 3:</strong> PHONE_CALL (último recurso)</li>
                </ol>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-sm mb-2">⚠️ Casos de Falla Común</h4>
              <div className="text-xs space-y-2">
                <div>
                  <strong>SMS falla:</strong> Número inválido, sin saldo Twilio, bloqueado por operador
                  <div className="ml-4 text-muted-foreground">→ Fallback a Email automáticamente</div>
                </div>
                <div>
                  <strong>Email falla:</strong> Email inválido, buzón lleno, dominio no existe
                  <div className="ml-4 text-muted-foreground">→ Fallback a Push Notification</div>
                </div>
                <div>
                  <strong>Push falla:</strong> Usuario no tiene app instalada o permisos denegados
                  <div className="ml-4 text-muted-foreground">→ Fallback a Phone Call (requiere acción manual)</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Hours */}
        <Card>
          <CardHeader>
            <CardTitle>🕐 Configuración de Horario Laboral</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Controla cuándo se envían mensajes automáticos para respetar horarios apropiados.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Configuración JSON de businessHoursConfig</h4>
              <div className="bg-white p-4 rounded-lg text-xs font-mono overflow-x-auto">
{`{
  "timezone": "America/Mexico_City",
  "daysOfWeek": [1, 2, 3, 4, 5, 6, 0],  // Lun-Dom (0=Domingo)
  "startHour": 8,                       // 8:00 AM
  "endHour": 21,                        // 9:00 PM
  "deferOutsideHours": true             // Posponer si está fuera de horario
}`}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg bg-blue-50">
                <h4 className="font-semibold text-sm mb-2">✅ deferOutsideHours: true</h4>
                <p className="text-xs text-muted-foreground">
                  Si una acción se dispara fuera de horario (ej: 2 AM), el sistema la POSPONE hasta el siguiente horario válido (8 AM).
                </p>
                <div className="mt-2 text-xs">
                  <strong>Ejemplo:</strong><br/>
                  Petición urgente a las 11 PM → Se procesa a las 8 AM del día siguiente
                </div>
              </div>

              <div className="p-3 border rounded-lg bg-orange-50">
                <h4 className="font-semibold text-sm mb-2">⚡ deferOutsideHours: false</h4>
                <p className="text-xs text-muted-foreground">
                  Ejecuta inmediatamente sin importar la hora. Use solo para emergencias reales.
                </p>
                <div className="mt-2 text-xs">
                  <strong>Casos válidos:</strong><br/>
                  • Peticiones de oración urgentes<br/>
                  • Emergencias familiares<br/>
                  • Situaciones de crisis
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-sm mb-2">💡 Mejores Prácticas</h4>
              <ul className="text-xs space-y-1">
                <li>• <strong>Mensajes de bienvenida:</strong> deferOutsideHours: true (8 AM - 9 PM)</li>
                <li>• <strong>Follow-ups generales:</strong> deferOutsideHours: true</li>
                <li>• <strong>Peticiones urgentes:</strong> deferOutsideHours: false (24/7)</li>
                <li>• <strong>Llamadas telefónicas:</strong> SIEMPRE deferOutsideHours: true (nunca llamar de noche)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Escalation Config */}
        <Card>
          <CardHeader>
            <CardTitle>📈 Configuración de Escalamiento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Notifica automáticamente a supervisores si no hay respuesta en tiempo esperado.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Configuración JSON de escalationConfig</h4>
              <div className="bg-white p-4 rounded-lg text-xs font-mono overflow-x-auto">
{`{
  "enabled": true,
  "delayMinutes": 15,              // Escalar después de 15 min sin respuesta
  "notifyUserIds": [               // IDs de supervisores a notificar
    "clxxxxx_pastor_principal",
    "clxxxxx_pastor_asistente"
  ],
  "escalationPriority": "HIGH",    // Prioridad de notificación escalada
  "maxEscalations": 2              // Máximo 2 niveles de escalación
}`}
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 border-l-4 border-red-500 bg-red-50">
                <h4 className="font-semibold text-sm text-red-900 mb-2">🚨 URGENT Priority → Escala a 15 min</h4>
                <p className="text-xs text-muted-foreground">
                  <strong>Ejemplo:</strong> Petición urgente de oración por hospitalización
                </p>
                <ul className="text-xs text-muted-foreground ml-4 mt-2">
                  <li>• 0 min: SMS al pastor asignado</li>
                  <li>• 15 min: No respondió → Notifica a pastor principal</li>
                  <li>• 30 min: Aún sin respuesta → Notifica a pastor asistente</li>
                </ul>
              </div>

              <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                <h4 className="font-semibold text-sm text-orange-900 mb-2">⚡ HIGH Priority → Escala a 2 horas</h4>
                <p className="text-xs text-muted-foreground">
                  <strong>Ejemplo:</strong> Visitante primera vez necesita llamada de bienvenida
                </p>
              </div>

              <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                <h4 className="font-semibold text-sm text-blue-900 mb-2">📊 NORMAL Priority → Escala a 24 horas</h4>
                <p className="text-xs text-muted-foreground">
                  <strong>Ejemplo:</strong> Follow-up de visitante recurrente
                </p>
              </div>

              <div className="p-4 border-l-4 border-gray-400 bg-gray-50">
                <h4 className="font-semibold text-sm text-gray-900 mb-2">⏸️ LOW Priority → Sin escalación</h4>
                <p className="text-xs text-muted-foreground">
                  <strong>Ejemplo:</strong> Encuesta de satisfacción
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Condition Operators */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              🔧 Operadores de Condiciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Define cuándo se ejecuta una regla usando operadores lógicos.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Ejemplo de Configuración de Condiciones</h4>
              <div className="bg-white p-4 rounded-lg text-xs font-mono overflow-x-auto">
{`{
  "operator": "AND",  // Todas las condiciones deben cumplirse
  "rules": [
    {
      "field": "category",
      "operator": "equals",
      "value": "URGENT"
    },
    {
      "field": "requestType",
      "operator": "in",
      "value": ["HEALTH", "FAMILY_CRISIS"]
    },
    {
      "field": "visitCount",
      "operator": "greater_than",
      "value": 0
    }
  ]
}`}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 border rounded-lg">
                <h4 className="font-semibold mb-2">Operadores de Comparación</h4>
                <ul className="space-y-1 font-mono">
                  <li>• <code>equals</code> - Igual a</li>
                  <li>• <code>not_equals</code> - Diferente de</li>
                  <li>• <code>greater_than</code> - Mayor que</li>
                  <li>• <code>less_than</code> - Menor que</li>
                  <li>• <code>greater_or_equal</code> - Mayor o igual</li>
                  <li>• <code>less_or_equal</code> - Menor o igual</li>
                </ul>
              </div>

              <div className="p-3 border rounded-lg">
                <h4 className="font-semibold mb-2">Operadores de Texto</h4>
                <ul className="space-y-1 font-mono">
                  <li>• <code>contains</code> - Contiene texto</li>
                  <li>• <code>not_contains</code> - No contiene</li>
                  <li>• <code>starts_with</code> - Empieza con</li>
                  <li>• <code>ends_with</code> - Termina con</li>
                  <li>• <code>in</code> - Está en lista</li>
                  <li>• <code>not_in</code> - No está en lista</li>
                </ul>
              </div>

              <div className="p-3 border rounded-lg">
                <h4 className="font-semibold mb-2">Operadores Lógicos</h4>
                <ul className="space-y-1 font-mono">
                  <li>• <code>AND</code> - Todas deben cumplirse</li>
                  <li>• <code>OR</code> - Al menos una debe cumplirse</li>
                  <li>• <code>NOT</code> - Niega la condición</li>
                </ul>
              </div>

              <div className="p-3 border rounded-lg">
                <h4 className="font-semibold mb-2">Operadores Especiales</h4>
                <ul className="space-y-1 font-mono">
                  <li>• <code>exists</code> - Campo existe</li>
                  <li>• <code>not_exists</code> - Campo no existe</li>
                  <li>• <code>is_null</code> - Es nulo</li>
                  <li>• <code>not_null</code> - No es nulo</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Types */}
        <Card>
          <CardHeader>
            <CardTitle>🎬 Tipos de Acciones Disponibles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 border rounded-lg bg-blue-50">
                <h4 className="font-semibold mb-2">📱 SEND_SMS</h4>
                <div className="bg-white p-2 rounded font-mono">
{`{
  "type": "SEND_SMS",
  "config": {
    "to": "{{phone}}",
    "message": "Hola {{name}}, ..."
  }
}`}
                </div>
              </div>

              <div className="p-3 border rounded-lg bg-green-50">
                <h4 className="font-semibold mb-2">✉️ SEND_EMAIL</h4>
                <div className="bg-white p-2 rounded font-mono">
{`{
  "type": "SEND_EMAIL",
  "config": {
    "to": "{{email}}",
    "subject": "Bienvenido",
    "body": "..."
  }
}`}
                </div>
              </div>

              <div className="p-3 border rounded-lg bg-purple-50">
                <h4 className="font-semibold mb-2">💬 SEND_WHATSAPP</h4>
                <div className="bg-white p-2 rounded font-mono">
{`{
  "type": "SEND_WHATSAPP",
  "config": {
    "to": "{{phone}}",
    "message": "..."
  }
}`}
                </div>
              </div>

              <div className="p-3 border rounded-lg bg-yellow-50">
                <h4 className="font-semibold mb-2">📣 SEND_PUSH_NOTIFICATION</h4>
                <div className="bg-white p-2 rounded font-mono">
{`{
  "type": "SEND_PUSH_NOTIFICATION",
  "config": {
    "title": "Nueva Petición",
    "body": "...",
    "userId": "{{userId}}"
  }
}`}
                </div>
              </div>

              <div className="p-3 border rounded-lg bg-orange-50">
                <h4 className="font-semibold mb-2">📞 SCHEDULE_PHONE_CALL</h4>
                <div className="bg-white p-2 rounded font-mono">
{`{
  "type": "SCHEDULE_PHONE_CALL",
  "config": {
    "to": "{{phone}}",
    "scheduledFor": "2h",
    "assignedTo": "{{pastorId}}"
  }
}`}
                </div>
              </div>

              <div className="p-3 border rounded-lg bg-red-50">
                <h4 className="font-semibold mb-2">🔔 NOTIFY_STAFF</h4>
                <div className="bg-white p-2 rounded font-mono">
{`{
  "type": "NOTIFY_STAFF",
  "config": {
    "userIds": ["clxxx..."],
    "message": "Urgente: ..."
  }
}`}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
              <h4 className="font-semibold text-sm mb-2">📝 Variables Disponibles</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Use estas variables en los mensajes para personalización automática:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div><code>{'{{name}}'}</code> - Nombre completo</div>
                <div><code>{'{{firstName}}'}</code> - Primer nombre</div>
                <div><code>{'{{email}}'}</code> - Email</div>
                <div><code>{'{{phone}}'}</code> - Teléfono</div>
                <div><code>{'{{category}}'}</code> - Categoría</div>
                <div><code>{'{{visitCount}}'}</code> - Número de visitas</div>
                <div><code>{'{{churchName}}'}</code> - Nombre iglesia</div>
                <div><code>{'{{pastorName}}'}</code> - Nombre pastor</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Creating Custom Templates */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-purple-900">🎨 Crear Plantillas Personalizadas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Pasos para crear una plantilla completamente personalizada desde cero:
            </p>

            <ol className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="font-bold text-purple-600">1.</span>
                <div>
                  <strong>Acceder a Base de Datos</strong>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use Prisma Studio (<code>npx prisma studio</code>) o SQL directo para crear registro en tabla AutomationRule
                  </p>
                </div>
              </li>

              <li className="flex gap-2">
                <span className="font-bold text-purple-600">2.</span>
                <div>
                  <strong>Definir Trigger Type</strong>
                  <p className="text-xs text-muted-foreground mt-1">
                    Valores disponibles: PRAYER_REQUEST_URGENT, PRAYER_REQUEST_GENERAL, VISITOR_FIRST_TIME, VISITOR_RETURNING, etc.
                  </p>
                </div>
              </li>

              <li className="flex gap-2">
                <span className="font-bold text-purple-600">3.</span>
                <div>
                  <strong>Configurar Condiciones JSON</strong>
                  <div className="bg-white p-3 rounded text-xs font-mono mt-1">
{`{"operator": "AND", "rules": [...]}`}
                  </div>
                </div>
              </li>

              <li className="flex gap-2">
                <span className="font-bold text-purple-600">4.</span>
                <div>
                  <strong>Definir Acciones JSON</strong>
                  <div className="bg-white p-3 rounded text-xs font-mono mt-1">
{`[{"type": "SEND_SMS", "config": {...}}, ...]`}
                  </div>
                </div>
              </li>

              <li className="flex gap-2">
                <span className="font-bold text-purple-600">5.</span>
                <div>
                  <strong>Configurar Retry/Fallback/BusinessHours</strong>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use los JSONs documentados anteriormente
                  </p>
                </div>
              </li>

              <li className="flex gap-2">
                <span className="font-bold text-purple-600">6.</span>
                <div>
                  <strong>Probar con Datos Reales</strong>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cree un check-in o petición de prueba para verificar ejecución
                  </p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* API Reference */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              🔌 Referencia de API
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 border rounded-lg bg-gray-50">
              <h4 className="font-semibold mb-2">POST /api/automation-rules</h4>
              <p className="text-muted-foreground mb-2">Crear nueva regla de automatización</p>
              <div className="bg-white p-2 rounded font-mono">
                Body: AutomationRule object (JSON)
              </div>
            </div>

            <div className="p-3 border rounded-lg bg-gray-50">
              <h4 className="font-semibold mb-2">GET /api/automation-rules</h4>
              <p className="text-muted-foreground mb-2">Listar todas las reglas (con filtros)</p>
              <div className="bg-white p-2 rounded font-mono">
                Query: ?triggerType=PRAYER_REQUEST_URGENT&isActive=true
              </div>
            </div>

            <div className="p-3 border rounded-lg bg-gray-50">
              <h4 className="font-semibold mb-2">PATCH /api/automation-rules/:id</h4>
              <p className="text-muted-foreground mb-2">Actualizar regla existente</p>
            </div>

            <div className="p-3 border rounded-lg bg-gray-50">
              <h4 className="font-semibold mb-2">POST /api/visitor-automation</h4>
              <p className="text-muted-foreground mb-2">Disparar manualmente automatización de visitante</p>
              <div className="bg-white p-2 rounded font-mono">
{`Body: { "checkInId": "clxxx..." }`}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-900">🔧 Solución de Problemas Avanzados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-white p-3 rounded-lg border">
              <h4 className="font-semibold mb-2">❌ Regla no se ejecuta</h4>
              <ul className="text-xs space-y-1 ml-4">
                <li>• Verifique que <code>isActive === true</code></li>
                <li>• Revise que las condiciones coincidan con los datos</li>
                <li>• Confirme que el triggerType es correcto</li>
                <li>• Verifique logs en consola del servidor</li>
              </ul>
            </div>

            <div className="bg-white p-3 rounded-lg border">
              <h4 className="font-semibold mb-2">📱 SMS no se envía</h4>
              <ul className="text-xs space-y-1 ml-4">
                <li>• Verifique credenciales de Twilio en .env</li>
                <li>• Confirme que el número tiene formato E.164 (+52...)</li>
                <li>• Revise saldo de Twilio</li>
                <li>• Verifique que fallback a Email está configurado</li>
              </ul>
            </div>

            <div className="bg-white p-3 rounded-lg border">
              <h4 className="font-semibold mb-2">⏸️ Acciones se posponen indefinidamente</h4>
              <ul className="text-xs space-y-1 ml-4">
                <li>• Revise businessHoursConfig (puede estar fuera de horario)</li>
                <li>• Verifique que daysOfWeek incluye el día actual</li>
                <li>• Confirme timezone correcto</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
