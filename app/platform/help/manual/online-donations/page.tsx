
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, CheckCircle, Settings, CreditCard, Globe, BarChart3, Users, Shield, DollarSign } from 'lucide-react'
import Link from 'next/link'

export default function OnlineDonationsHelp() {
  const implementations = [
    {
      feature: "Procesadores de Pago Colombianos",
      status: "implemented",
      details: "PSE (Pagos Seguros en Línea) y Nequi totalmente integrados",
      icon: "🏦"
    },
    {
      feature: "Formularios Públicos",
      status: "implemented", 
      details: "Páginas de donación accesibles sin registro previo",
      icon: "🌐"
    },
    {
      feature: "Webhooks y Confirmaciones",
      status: "implemented",
      details: "Procesamiento automático y confirmación de pagos",
      icon: "⚡"
    },
    {
      feature: "Campañas de Donación",
      status: "implemented",
      details: "Crear campañas públicas con metas y seguimiento",
      icon: "🎯"
    },
    {
      feature: "Dashboard Integrado",
      status: "implemented",
      details: "Reportes completos integrados con el sistema existente",
      icon: "📊"
    },
    {
      feature: "Donaciones Recurrentes",
      status: "planned",
      details: "Próximamente - suscripciones mensuales automáticas",
      icon: "🔄"
    }
  ]

  const technicalSpecs = [
    {
      component: "API Routes",
      status: "✅ Completo",
      details: [
        "/api/online-payments - Crear y consultar pagos",
        "/api/online-payments/webhook - Procesamiento de confirmaciones",
        "/api/payment-gateways - Configuración de métodos"
      ]
    },
    {
      component: "Base de Datos",
      status: "✅ Completo", 
      details: [
        "Tabla OnlinePayment - Transacciones online",
        "Tabla PaymentGatewayConfig - Configuraciones",
        "Tabla DonationCampaign - Campañas públicas"
      ]
    },
    {
      component: "Páginas Públicas",
      status: "✅ Completo",
      details: [
        "/donate/[churchId] - Formulario de donación",
        "/donate/thank-you - Página de confirmación",
        "Responsive design para móviles"
      ]
    }
  ]

  const adminTasks = [
    {
      title: "1. Configurar Métodos de Pago",
      description: "Configure PSE y Nequi para cada iglesia",
      steps: [
        "Ir a Configuración de Iglesia",
        "Sección Donaciones Online",
        "Agregar credenciales PSE y Nequi",
        "Habilitar métodos de pago"
      ]
    },
    {
      title: "2. Monitorear Transacciones",
      description: "Supervisar el flujo de pagos online",
      steps: [
        "Dashboard Analytics → Donaciones",
        "Revisar transacciones pendientes",
        "Verificar webhooks recibidos",
        "Resolver pagos fallidos"
      ]
    },
    {
      title: "3. Crear Campañas",
      description: "Ayudar a iglesias con campañas especiales",
      steps: [
        "Crear nueva campaña",
        "Establecer meta y descripción", 
        "Generar enlace público",
        "Compartir con la iglesia"
      ]
    }
  ]

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/platform/help">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Centro de Ayuda
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Sistema de Donaciones Online</h1>
        <p className="text-muted-foreground">
          Guía completa para super administradores sobre el sistema de pagos online implementado
        </p>
      </div>

      {/* Implementation Status */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-[hsl(var(--success))]" />
              Estado de Implementación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 bg-[hsl(var(--success)/0.10)] border-[hsl(var(--success)/0.3)]">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-[hsl(var(--success))] font-medium">
                ✅ El sistema de donaciones online está COMPLETAMENTE IMPLEMENTADO y funcionando
              </AlertDescription>
            </Alert>
            
            <div className="grid md:grid-cols-2 gap-4">
              {implementations.map((item, index) => (
                <Card key={index} className={item.status === 'implemented' ? 'bg-[hsl(var(--success)/0.10)] border-[hsl(var(--success)/0.3)]' : 'bg-[hsl(var(--warning)/0.10)] border-[hsl(var(--warning)/0.3)]'}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold flex items-center gap-2">
                          {item.feature}
                          <Badge variant={item.status === 'implemented' ? 'default' : 'secondary'} className="text-xs">
                            {item.status === 'implemented' ? '✅ Listo' : '🔄 Planeado'}
                          </Badge>
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">{item.details}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Technical Specifications */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Especificaciones Técnicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {technicalSpecs.map((spec, index) => (
                <div key={index} className="border-l-4 border-[hsl(var(--info))] pl-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    {spec.component}
                    <Badge variant="default" className="text-xs">{spec.status}</Badge>
                  </h4>
                  <ul className="mt-2 space-y-1">
                    {spec.details.map((detail, i) => (
                      <li key={i} className="text-sm text-muted-foreground">• {detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Admin Tasks */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Tareas de Administración
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-3 gap-6">
              {adminTasks.map((task, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ol className="space-y-2">
                      {task.steps.map((step, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-[hsl(var(--info))] font-bold">{i + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Gateway Configuration */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Configuración de Gateways
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">PSE (Pagos Seguros en Línea)</h4>
                <div className="bg-muted/30 p-4 rounded-lg text-sm space-y-2">
                  <p><strong>Merchant ID:</strong> Proporcionado por el banco</p>
                  <p><strong>API Key:</strong> Clave secreta de PSE</p>
                  <p><strong>Webhook URL:</strong> /api/online-payments/webhook</p>
                  <p><strong>Return URL:</strong> /donate/thank-you</p>
                  <p className="text-[hsl(var(--info))]">💡 Solicitar credenciales PSE al banco de la iglesia</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Nequi</h4>
                <div className="bg-muted/30 p-4 rounded-lg text-sm space-y-2">
                  <p><strong>Client ID:</strong> ID de aplicación Nequi</p>
                  <p><strong>Client Secret:</strong> Secreto OAuth de Nequi</p>
                  <p><strong>API URL:</strong> https://api.nequi.com</p>
                  <p><strong>Test Mode:</strong> Habilitar para pruebas</p>
                  <p className="text-[hsl(var(--info))]">💡 Registrar aplicación en portal de desarrolladores Nequi</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Monitoring and Troubleshooting */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monitoreo y Resolución de Problemas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-[hsl(var(--success))]">✅ Indicadores de Salud</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Webhooks recibidos correctamente</li>
                  <li>• Pagos completados vs pendientes</li>
                  <li>• Tiempo promedio de procesamiento</li>
                  <li>• Tasa de éxito por gateway</li>
                  <li>• Donaciones creadas automáticamente</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-[hsl(var(--destructive))]">⚠️ Problemas Comunes</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Webhooks no recibidos → Verificar URLs</li>
                  <li>• Pagos pendientes → Consultar con gateway</li>
                  <li>• Credenciales expiradas → Renovar keys</li>
                  <li>• Formulario no carga → Verificar church ID</li>
                  <li>• Emails no enviados → Revisar configuración SMTP</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Actions */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col" variant="outline">
                <Settings className="h-5 w-5 mb-2" />
                <span className="text-xs">Configurar Gateway</span>
              </Button>
              <Button className="h-20 flex flex-col" variant="outline">
                <BarChart3 className="h-5 w-5 mb-2" />
                <span className="text-xs">Ver Analytics</span>
              </Button>
              <Button className="h-20 flex flex-col" variant="outline">
                <Globe className="h-5 w-5 mb-2" />
                <span className="text-xs">Crear Campaña</span>
              </Button>
              <Button className="h-20 flex flex-col" variant="outline">
                <Users className="h-5 w-5 mb-2" />
                <span className="text-xs">Gestionar Iglesias</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Summary */}
      <Alert className="bg-[hsl(var(--info)/0.10)] border-[hsl(var(--info)/0.3)]">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription className="text-[hsl(var(--info))]">
          <strong>Resumen:</strong> El sistema de donaciones online está completamente funcional con PSE y Nequi. 
          Las iglesias pueden comenzar a recibir donaciones inmediatamente después de configurar sus credenciales de pago.
        </AlertDescription>
      </Alert>
    </div>
  )
}
