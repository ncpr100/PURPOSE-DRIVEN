
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CreditCard, Package, TrendingUp, Shield } from 'lucide-react'
import Link from 'next/link'

export default function SubscriptionHelp() {
  const plans = [
    {
      name: "BÁSICO - Iglesia Pequeña",
      features: ["Gestión básica de miembros", "Donaciones manuales", "Eventos simples", "Comunicaciones por email", "Soporte por email"],
      recommended: false
    },
    {
      name: "PROFESIONAL - Iglesia Mediana",
      features: ["Todas las funciones básicas", "Analytics avanzados", "Automatizaciones", "Reportes personalizados", "Soporte prioritario"],
      recommended: true
    },
    {
      name: "EMPRESARIAL - Iglesia Grande",
      features: ["Todas las funciones profesionales", "API personalizada", "Integraciones avanzadas", "Soporte telefónico", "Consultoría estratégica"],
      recommended: false
    }
  ]

  const addons = [
    {
      name: "SMS Masivos",
      description: "Envío de mensajes de texto a la congregación",
      features: ["SMS incluidos mensualmente", "Plantillas prediseñadas", "Programación automática", "Reportes de entrega"],
      popular: true
    },
    {
      name: "Transmisión en Vivo", 
      description: "Streaming de servicios en múltiples plataformas",
      features: ["Múltiples espectadores", "YouTube + Facebook", "Grabación automática", "Calidad HD"],
      popular: false
    },
    {
      name: "Donaciones Online",
      description: "Aceptar donaciones con tarjeta de crédito",
      features: ["Tarjetas Visa/MasterCard", "PayPal integrado", "Recibos automáticos", "Dashboard financiero"],
      popular: true
    }
  ]

  const paymentMethods = [
    { method: "Tarjeta de Crédito/Débito", description: "Visa, MasterCard, American Express", auto: true },
    { method: "Transferencia Bancaria", description: "Pago manual mensual", auto: false },
    { method: "Billeteras Digitales LATAM", description: "Nequi (Colombia), Yape/Plin (Perú), Mercado Pago (Regional)", auto: true }
  ]

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <Link href="/help">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Ayuda
          </Button>
        </Link>
        <div className="flex items-center gap-3 mb-3">
          <CreditCard className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Mi Suscripción</h1>
            <p className="text-muted-foreground">
              Gestione su plan y complementos de Khesed-tek Systems
            </p>
          </div>
        </div>
      </div>

      {/* Current Subscription Status */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Estado de su Suscripción
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold">Plan Actual</h4>
                <p className="text-2xl font-bold text-primary">PROFESIONAL</p>
                <p className="text-sm text-muted-foreground">Iglesia Mediana</p>
              </div>
              <div>
                <h4 className="font-semibold">Próximo Pago</h4>
                <p className="text-lg">1 de Septiembre</p>
                <p className="text-sm text-muted-foreground">Renovación automática</p>
              </div>
              <div>
                <h4 className="font-semibold">Estado</h4>
                <Badge className="bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]">✅ Activo</Badge>
                <p className="text-sm text-muted-foreground mt-1">Todos los servicios operando</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Available Plans */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Planes Disponibles</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative ${plan.recommended ? 'border-primary shadow-lg' : ''}`}>
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">⭐ Recomendado</Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="mr-2 text-[hsl(var(--success))]">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full mt-4" 
                  variant={plan.recommended ? "default" : "outline"}
                  onClick={() => alert('Funcionalidad de cambio de plan será implementada próximamente. Contacte soporte.')}
                >
                  {plan.name === "PROFESIONAL" ? "Plan Actual" : "Cambiar Plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Add-ons */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Complementos Disponibles</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {addons.map((addon) => (
            <Card key={addon.name} className="relative">
              {addon.popular && (
                <div className="absolute -top-2 right-2">
                  <Badge variant="secondary" className="text-xs">🔥 Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-base">{addon.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{addon.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 mb-4">
                  {addon.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <span className="mr-2 text-[hsl(var(--success))]">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    size="sm"
                    onClick={() => alert('Funcionalidad de suscripción a complementos será implementada próximamente. Contacte soporte.')}
                  >
                    💰 Suscribirse
                  </Button>
                  <Button variant="outline" className="w-full" size="sm" onClick={() => alert('Información detallada del complemento disponible en la documentación o contacte soporte.')}>
                    📖 Más Info
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Payment Methods */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Métodos de Pago</h2>
        <Card>
          <CardHeader>
            <CardTitle>Opciones de Facturación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethods.map((payment) => (
                <div key={payment.method} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{payment.method}</h4>
                    <p className="text-sm text-muted-foreground">{payment.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {payment.auto && (
                      <Badge variant="outline" className="text-xs">Auto</Badge>
                    )}
                    <Button variant="outline" size="sm" onClick={() => alert('Funcionalidad de configuración de métodos de pago será implementada próximamente. Contacte soporte.')}>
                      Configurar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Billing History */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Historial de Facturación</h2>
        <Card>
          <CardHeader>
            <CardTitle>Últimas Facturas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <span className="font-medium">Agosto 2025</span>
                  <p className="text-sm text-muted-foreground">Plan Profesional + SMS Masivos</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[hsl(var(--success))]">✅ Pagado</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <span className="font-medium">Julio 2025</span>
                  <p className="text-sm text-muted-foreground">Plan Profesional</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[hsl(var(--success))]">✅ Pagado</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="font-medium">Junio 2025</span>
                  <p className="text-sm text-muted-foreground">Plan Profesional</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[hsl(var(--success))]">✅ Pagado</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" onClick={() => alert('Historial completo de facturación será implementado próximamente. Esta información estará disponible en el panel principal.')}>
                📄 Ver Historial Completo
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Support */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>¿Necesita Ayuda con su Suscripción?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Nuestro equipo de soporte está disponible para ayudarle con cambios de plan, facturación, o cualquier pregunta sobre su suscripción.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => window.open('https://wa.me/573003435733', '_blank')}>
                📱 WhatsApp
              </Button>
              <Button variant="outline" onClick={() => window.location.href = 'mailto:soporte@khesed-tek-systems.org'}>
                📧 Email Soporte
              </Button>
              <Link href="/help/support/ticket">
                <Button variant="outline">
                  🎫 Crear Ticket
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Back to Help */}
      <div className="text-center">
        <Link href="/help">
          <Button variant="outline">
            ← Volver al Centro de Ayuda
          </Button>
        </Link>
      </div>
    </div>
  )
}
