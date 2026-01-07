'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Shield, Users, Building2, CreditCard, BarChart3, Settings,
  Key, Mail, Database, Server, Globe, Lock, UserPlus, FileText,
  CheckCircle, ArrowRight, Heart, Lightbulb, AlertTriangle,
  Star, Target, Award, Zap, Crown, Briefcase, TrendingUp,
  DollarSign, Activity, Eye, Edit, Trash2, Download, Upload
} from 'lucide-react'
import Link from 'next/link'

export default function SuperAdminCompleteGuide() {
  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 to-purple-900 text-white p-8 rounded-lg">
        <div className="flex items-center gap-4">
          <Crown className="h-12 w-12" />
          <div>
            <h1 className="text-4xl font-bold mb-2">👑 SUPER_ADMIN - Guía Completa de Plataforma</h1>
            <p className="text-xl opacity-90">
              Gestión Multi-Tenant: Iglesias, Usuarios, Facturación y Análisis Global
            </p>
          </div>
        </div>
        <div className="mt-6 flex gap-4 text-sm">
          <Badge variant="secondary" className="bg-white/20 text-white">
            <Shield className="h-3 w-3 mr-1" />
            Acceso Total del Sistema
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white">
            <Database className="h-3 w-3 mr-1" />
            Gestión Multi-Tenant
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white">
            <Star className="h-3 w-3 mr-1" />
            16 Módulos de Plataforma
          </Badge>
        </div>
      </div>

      {/* Understanding SUPER_ADMIN Role */}
      <Card className="border-purple-300">
        <CardHeader className="bg-purple-50">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Shield className="h-8 w-8 text-purple-600" />
            ¿Qué es un SUPER_ADMIN?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
            <h4 className="font-bold text-yellow-900 flex items-center gap-2 mb-2">
              <Heart className="h-5 w-5" />
              Explicación Simple
            </h4>
            <p className="text-sm text-yellow-800">
              Como SUPER_ADMIN, eres como el &quot;gerente general&quot; de TODA la plataforma Khesed-tek. 
              Mientras que los pastores administran SU iglesia, tú administras TODAS las iglesias. 
              Puedes crear nuevas iglesias, gestionar usuarios de cualquier iglesia, ver facturas, 
              y monitorear el sistema completo. ¡Es la cuenta con MÁS poder en toda la plataforma!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-4">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Puedes Hacer (Permisos):
                </h4>
                <ul className="space-y-2 text-sm">
                  {[
                    "Crear, editar y eliminar iglesias (tenants)",
                    "Gestionar usuarios de CUALQUIER iglesia",
                    "Ver facturación y pagos de todas las iglesias",
                    "Acceder a analíticas globales de la plataforma",
                    "Configurar credenciales de integraciones",
                    "Ver y descargar reportes de TODAS las iglesias",
                    "Cambiar planes y precios de suscripción",
                    "Acceder a configuraciones de sistema",
                    "Monitorear uso de recursos y rendimiento",
                    "Crear y gestionar otros SUPER_ADMIN"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="pt-4">
                <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Responsabilidades Críticas:
                </h4>
                <ul className="space-y-2 text-sm">
                  {[
                    "Seguridad: Proteger datos de todas las iglesias",
                    "Privacidad: No acceder a datos sin autorización",
                    "Facturación: Asegurar cobros correctos",
                    "Soporte: Responder a problemas técnicos urgentes",
                    "Backups: Mantener respaldos del sistema",
                    "Actualizaciones: Implementar mejoras sin interrupciones",
                    "Cumplimiento: Seguir regulaciones de protección de datos",
                    "Comunicación: Avisar cambios importantes a iglesias",
                    "Documentación: Mantener registros de cambios",
                    "Ética: Usar poder solo cuando sea necesario"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border-2 border-red-300">
            <h4 className="font-bold text-red-900 flex items-center gap-2 mb-2">
              <Lock className="h-5 w-5" />
              ⚠️ ADVERTENCIA DE SEGURIDAD
            </h4>
            <p className="text-sm text-red-800 mb-2">
              Con gran poder viene gran responsabilidad. Como SUPER_ADMIN:
            </p>
            <ul className="text-sm text-red-800 space-y-1 ml-4">
              <li>• NUNCA compartas tu contraseña - ni siquiera con otros SUPER_ADMIN</li>
              <li>• NO elimines iglesias sin confirmación explícita por escrito</li>
              <li>• NO accedas a datos de iglesias sin una razón de soporte válida</li>
              <li>• Usa autenticación de dos factores (2FA) SIEMPRE</li>
              <li>• Cambia tu contraseña cada 90 días</li>
              <li>• Registra TODAS las acciones importantes en el log del sistema</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Module 1: Church Management */}
      <Card className="border-blue-300">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              1
            </div>
            Gestión de Iglesias (Tenants)
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Crear, editar, activar/desactivar y eliminar iglesias
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              A. Crear una Nueva Iglesia (Onboarding)
            </h4>

            {[
              {
                step: "1.1",
                title: "Ir a Dashboard de Plataforma",
                description: "En el menú superior, haz clic en 'Platform' (solo visible para SUPER_ADMIN)",
                image: "🏠",
                tips: ["Si no ves 'Platform', no tienes permisos de SUPER_ADMIN", "El menú cambia de color (oscuro) cuando estás en modo Platform"]
              },
              {
                step: "1.2",
                title: "Navegar a 'Iglesias' → 'Onboard New Church'",
                description: "Haz clic en el botón verde '+ Onboard New Church'",
                image: "➕",
                tips: ["Onboard = proceso completo de registro de iglesia", "Incluye validación de información y configuración inicial"]
              },
              {
                step: "1.3",
                title: "Información Básica de la Iglesia",
                description: "Completa el formulario de onboarding:",
                image: "📝",
                fields: [
                  { name: "Nombre de la Iglesia *", example: "Iglesia Cristiana El Buen Pastor", required: true },
                  { name: "Email de Contacto *", example: "pastor@iglesiabuenpastor.com", required: true },
                  { name: "Teléfono Principal", example: "+57 300 123 4567", required: false },
                  { name: "Dirección Física", example: "Carrera 15 #20-30, Bogotá, Colombia", required: false },
                  { name: "Sitio Web", example: "https://iglesiabuenpastor.com", required: false },
                  { name: "País *", example: "Colombia, México, Estados Unidos, etc.", required: true },
                  { name: "Zona Horaria *", example: "America/Bogota, America/Mexico_City", required: true }
                ]
              },
              {
                step: "1.4",
                title: "Información del Administrador Principal",
                description: "Crear la cuenta del pastor/admin que gestionará la iglesia:",
                image: "👤",
                fields: [
                  { name: "Nombre del Pastor *", example: "Juan Carlos Pérez", required: true },
                  { name: "Email del Pastor *", example: "juan.perez@gmail.com", required: true },
                  { name: "Contraseña Temporal", example: "Sistema genera: Temp-XXXXXXXXXXXX (se auto-genera)", required: true },
                  { name: "Rol *", example: "ADMIN_IGLESIA (predefinido)", required: true }
                ]
              },
              {
                step: "1.5",
                title: "Configuración del Plan de Suscripción",
                description: "Selecciona el plan comercial para la iglesia:",
                image: "💳",
                options: [
                  { plan: "Free Trial (Prueba Gratuita)", description: "30 días gratis, hasta 50 miembros", price: "$0" },
                  { plan: "Basic", description: "Hasta 200 miembros, funciones básicas", price: "$29/mes" },
                  { plan: "Pro", description: "Hasta 500 miembros, AI analytics", price: "$79/mes" },
                  { plan: "Enterprise", description: "Ilimitado, soporte prioritario", price: "$199/mes" },
                  { plan: "Custom", description: "Plan personalizado, contactar ventas", price: "Personalizado" }
                ]
              },
              {
                step: "1.6",
                title: "Guardar y Enviar Credenciales",
                description: "Finalizar el proceso de onboarding:",
                image: "✅",
                tips: [
                  "El sistema enviará un email automático al pastor con sus credenciales",
                  "La contraseña temporal DEBE cambiarse en el primer inicio de sesión",
                  "La iglesia aparecerá inmediatamente en la lista de iglesias",
                  "El período de prueba/facturación empieza AHORA"
                ]
              }
            ].map((item, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{item.image}</div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-lg mb-2">
                        Paso {item.step}: {item.title}
                      </h5>
                      <p className="text-sm text-gray-700 mb-3">{item.description}</p>

                      {item.fields && (
                        <div className="space-y-2 mb-3">
                          {item.fields.map((field: any, idx: number) => (
                            <div key={idx} className="bg-blue-50 p-3 rounded">
                              <p className="font-medium text-sm text-blue-800">
                                {field.required ? '* ' : ''}{field.name}
                              </p>
                              <p className="text-xs text-gray-600 mt-1 italic">{field.example}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {item.options && (
                        <div className="space-y-2 mb-3">
                          {item.options.map((option: any, idx: number) => (
                            <div key={idx} className="bg-gray-50 p-3 rounded flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-sm text-blue-800">{option.plan}</p>
                                <p className="text-xs text-gray-600 mt-1">{option.description}</p>
                              </div>
                              <Badge className="ml-3">{option.price}</Badge>
                            </div>
                          ))}
                        </div>
                      )}

                      {item.tips && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-xs font-medium text-green-800 mb-2">💡 Notas Importantes:</p>
                          <ul className="text-xs text-green-700 space-y-1">
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

          <div className="space-y-4 mt-6">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <Edit className="h-6 w-6 text-orange-600" />
              B. Editar Iglesias Existentes
            </h4>

            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="pt-4">
                <p className="text-sm mb-3">
                  <strong>Ubicación:</strong> Platform → Churches → [Seleccionar Iglesia] → Details
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      category: "Información General",
                      editable: ["Nombre de la iglesia", "Email de contacto", "Teléfono", "Dirección", "Sitio web"]
                    },
                    {
                      category: "Configuración del Plan",
                      editable: ["Plan de suscripción", "Fecha de inicio", "Fecha de renovación", "Estado de pago"]
                    },
                    {
                      category: "Estados y Permisos",
                      editable: ["Activa/Inactiva", "Acceso a módulos premium", "Límites de usuarios", "Límites de almacenamiento"]
                    },
                    {
                      category: "Personalización",
                      editable: ["Logo de la iglesia", "Colores de marca", "Dominio personalizado", "Configuración de idioma"]
                    }
                  ].map((group, index) => (
                    <div key={index} className="bg-orange-50 p-3 rounded">
                      <p className="font-medium text-sm text-orange-800 mb-2">{group.category}:</p>
                      <ul className="text-xs text-gray-700 space-y-1">
                        {group.editable.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 mt-6">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <Trash2 className="h-6 w-6 text-red-600" />
              C. Desactivar o Eliminar Iglesias
            </h4>

            <Card className="border-l-4 border-l-red-500 bg-red-50">
              <CardContent className="pt-4">
                <div className="bg-white p-4 rounded-lg mb-4">
                  <h5 className="font-semibold text-red-800 mb-2">⚠️ ADVERTENCIA CRÍTICA</h5>
                  <p className="text-sm text-red-700 mb-3">
                    Eliminar una iglesia es PERMANENTE y NO se puede deshacer. Se perderán:
                  </p>
                  <ul className="text-sm text-red-700 space-y-1 ml-4">
                    <li>• TODOS los miembros y sus datos</li>
                    <li>• TODOS los eventos y check-ins</li>
                    <li>• TODAS las donaciones y registros financieros</li>
                    <li>• TODAS las comunicaciones enviadas</li>
                    <li>• TODOS los reportes y analíticas</li>
                    <li>• Configuraciones, integraciones, y personalizaciones</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="bg-yellow-50 p-3 rounded">
                    <p className="font-medium text-sm text-yellow-900 mb-2">
                      ✅ Alternativa Recomendada: DESACTIVAR (No Eliminar)
                    </p>
                    <ol className="text-xs text-yellow-800 space-y-1 ml-4">
                      <li>1. Ve a Platform → Churches → [Iglesia] → Settings</li>
                      <li>2. Cambia el estado a &quot;Inactiva&quot;</li>
                      <li>3. La iglesia NO se elimina, solo se OCULTA</li>
                      <li>4. Los usuarios no pueden acceder, pero los datos se conservan</li>
                      <li>5. Puedes REACTIVAR después si cambian de opinión</li>
                    </ol>
                  </div>

                  <div className="bg-red-100 p-3 rounded border-2 border-red-300">
                    <p className="font-medium text-sm text-red-900 mb-2">
                      ❌ Proceso de Eliminación PERMANENTE (Solo en Casos Extremos):
                    </p>
                    <ol className="text-xs text-red-800 space-y-1 ml-4">
                      <li>1. <strong>Requisito:</strong> Confirmación por escrito (email) del pastor</li>
                      <li>2. <strong>Backup:</strong> Exporta TODOS los datos antes de eliminar</li>
                      <li>3. Platform → Churches → [Iglesia] → Botón &quot;Delete Church&quot;</li>
                      <li>4. Escribe el nombre exacto de la iglesia para confirmar</li>
                      <li>5. Marca la casilla: &quot;Entiendo que esto es irreversible&quot;</li>
                      <li>6. Haz clic en &quot;Permanently Delete&quot;</li>
                      <li>7. <strong>Documentación:</strong> Guarda el backup por mínimo 1 año</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Module 2: User Management */}
      <Card className="border-green-300">
        <CardHeader className="bg-green-50">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              2
            </div>
            Gestión de Usuarios (Cross-Church)
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Administrar usuarios de cualquier iglesia desde la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">📍 Ubicación:</h4>
            <p className="text-sm mb-1">
              <strong>Opción 1:</strong> Platform → Churches → [Seleccionar Iglesia] → Users
            </p>
            <p className="text-sm">
              <strong>Opción 2:</strong> Platform → Users (ver todos los usuarios de todas las iglesias)
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-4">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Crear Usuario para una Iglesia
                </h4>
                <ol className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-green-600">1.</span>
                    <span>Selecciona la iglesia en Churches → [Iglesia] → Users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-green-600">2.</span>
                    <span>Haz clic en &quot;+ Nuevo Usuario&quot;</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-green-600">3.</span>
                    <span>Completa: Nombre, Email, Rol (ADMIN_IGLESIA, PASTOR, LIDER, MIEMBRO)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-green-600">4.</span>
                    <span>Sistema genera contraseña temporal automáticamente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-green-600">5.</span>
                    <span>Email automático se envía con credenciales</span>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="pt-4">
                <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Editar / Restablecer Contraseña
                </h4>
                <ol className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-orange-600">1.</span>
                    <span>Churches → [Iglesia] → Users → [Usuario]</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-orange-600">2.</span>
                    <span>Haz clic en &quot;Editar&quot; al lado del usuario</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-orange-600">3.</span>
                    <span>Edita: Nombre, Email, Teléfono, Rol, Estado (Activo/Inactivo)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-orange-600">4.</span>
                    <span><strong>Restablecer Contraseña:</strong> Haz clic en &quot;Restablecer&quot;</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-orange-600">5.</span>
                    <span>Sistema genera nueva contraseña temporal (Temp-XXXXXXXXXXXX)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-orange-600">6.</span>
                    <span>Email automático enviado al usuario con nueva contraseña</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-purple-50">
            <CardContent className="pt-4">
              <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Jerarquía de Roles (De Mayor a Menor Poder)
              </h4>
              <div className="space-y-2">
                {[
                  {
                    role: "SUPER_ADMIN",
                    icon: "👑",
                    description: "Acceso total a plataforma + todas las iglesias",
                    permissions: "Crear iglesias, gestionar facturación, ver analíticas globales"
                  },
                  {
                    role: "ADMIN_IGLESIA",
                    icon: "🔑",
                    description: "Administrador de UNA iglesia específica",
                    permissions: "Gestionar miembros, eventos, finanzas, configuraciones de SU iglesia"
                  },
                  {
                    role: "PASTOR",
                    icon: "📖",
                    description: "Pastor con permisos de gestión",
                    permissions: "Ver y editar miembros, eventos, enviar comunicaciones"
                  },
                  {
                    role: "LIDER",
                    icon: "🌟",
                    description: "Líder de ministerio o área",
                    permissions: "Ver miembros de su área, registrar asistencias"
                  },
                  {
                    role: "MIEMBRO",
                    icon: "👤",
                    description: "Miembro regular de la iglesia",
                    permissions: "Ver su perfil, inscribirse a eventos, hacer peticiones de oración"
                  }
                ].map((roleInfo, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg border border-purple-200">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{roleInfo.icon}</div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-purple-900">{roleInfo.role}</p>
                        <p className="text-xs text-gray-600 mb-1">{roleInfo.description}</p>
                        <p className="text-xs text-purple-700 italic">
                          ✓ {roleInfo.permissions}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Module 3: Invoicing (Priority 3 - Placeholder) */}
      <Card className="border-yellow-300">
        <CardHeader className="bg-yellow-50">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="bg-yellow-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              3
            </div>
            Facturación e Invoices (Priority 3 - En Desarrollo)
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Gestionar facturas, pagos y suscripciones de iglesias
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
            <div className="flex items-start gap-3">
              <Activity className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">🚧 Módulo en Construcción (Priority 3)</h4>
                <p className="text-sm text-blue-800 mb-3">
                  Este módulo está planificado para el próximo sprint. Incluirá:
                </p>
                <ul className="text-sm text-blue-700 space-y-1 ml-4">
                  <li>• Generación automática de facturas mensuales</li>
                  <li>• Integración con Stripe para procesamiento de pagos</li>
                  <li>• Estados de factura: DRAFT, SENT, PAID, OVERDUE</li>
                  <li>• Envío automático de facturas por email</li>
                  <li>• Recordatorios de pago automatizados</li>
                  <li>• Reportes de ingresos y análisis de suscripciones</li>
                  <li>• Gestión de métodos de pago guardados</li>
                </ul>
                <p className="text-xs text-blue-600 mt-3 italic">
                  📅 Fecha estimada de implementación: Q1 2026
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Continue button for more modules */}
      <Card className="bg-gradient-to-r from-purple-100 to-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-purple-600" />
            Módulos Adicionales de SUPER_ADMIN
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { module: "Analíticas Globales", icon: <BarChart3 className="h-8 w-8 text-blue-600" />, description: "Métricas de todas las iglesias", status: "Completo" },
              { module: "Credenciales de Tenant", icon: <Key className="h-8 w-8 text-green-600" />, description: "Gestionar API keys de iglesias", status: "Completo" },
              { module: "Configuración de Sistema", icon: <Settings className="h-8 w-8 text-gray-600" />, description: "Parámetros globales de plataforma", status: "Completo" },
              { module: "Base de Datos", icon: <Database className="h-8 w-8 text-purple-600" />, description: "Backups y mantenimiento", status: "Parcial" },
              { module: "Monitoreo de Rendimiento", icon: <Activity className="h-8 w-8 text-orange-600" />, description: "Uso de recursos y uptime", status: "En desarrollo" },
              { module: "Logs del Sistema", icon: <FileText className="h-8 w-8 text-red-600" />, description: "Auditoría y troubleshooting", status: "Planificado" }
            ].map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    {item.icon}
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{item.module}</h4>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <Badge variant={item.status === 'Completo' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Best Practices for SUPER_ADMIN */}
      <Card className="border-green-500 border-2">
        <CardHeader className="bg-green-50">
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Lightbulb className="h-6 w-6" />
            Mejores Prácticas para SUPER_ADMIN
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3">✅ SÍ Hacer:</h4>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Documenta TODAS las acciones importantes</li>
                <li>✓ Responde a tickets de soporte en &lt;24 horas</li>
                <li>✓ Haz backups diarios automáticos</li>
                <li>✓ Revisa logs de errores semanalmente</li>
                <li>✓ Comunica cambios importantes con 7 días de anticipación</li>
                <li>✓ Usa autenticación de dos factores (2FA)</li>
                <li>✓ Mantén credenciales en gestores de contraseñas</li>
                <li>✓ Prueba en staging antes de producción</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-3">❌ NO Hacer:</h4>
              <ul className="space-y-2 text-gray-700">
                <li>✗ Nunca elimines iglesias sin backup</li>
                <li>✗ No compartas credenciales de SUPER_ADMIN</li>
                <li>✗ No accedas a datos sin razón de soporte</li>
                <li>✗ No hagas cambios en producción sin pruebas</li>
                <li>✗ No ignores alertas de seguridad</li>
                <li>✗ No uses contraseñas débiles o repetidas</li>
                <li>✗ No cambies precios sin aprobación de finanzas</li>
                <li>✗ No olvides actualizar documentación</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Link href="/platform">
          <Button variant="outline" size="lg">
            <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
            Volver al Dashboard
          </Button>
        </Link>
        <Link href="/platform/help/troubleshooting">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
            Ver Troubleshooting SUPER_ADMIN
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
