
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, MessageSquare, Check, Smartphone } from 'lucide-react'
import Link from 'next/link'

export default function SMSMasivosAddon() {
  const features = [
    {
      title: "SMS Incluidos",
      description: "Cada mes incluye una cantidad de mensajes de texto",
      icon: "📱"
    },
    {
      title: "Plantillas Prediseñadas",
      description: "Plantillas listas para usar en diferentes ocasiones",
      icon: "📝"
    },
    {
      title: "Programación Automática",
      description: "Programe mensajes para envío futuro",
      icon: "⏰"
    },
    {
      title: "Reportes de Entrega",
      description: "Estadísticas detalladas de entrega y lectura",
      icon: "📊"
    },
    {
      title: "Segmentación Inteligente",
      description: "Envíe a grupos específicos de su congregación",
      icon: "🎯"
    },
    {
      title: "Confirmación de Lectura",
      description: "Vea quién ha leído sus mensajes",
      icon: "✅"
    }
  ]

  const useCases = [
    {
      scenario: "Recordatorio de Evento",
      example: "🎪 Recordatorio: Conferencia Familiar mañana 7PM en el santuario. ¡No faltes!"
    },
    {
      scenario: "Cambio de Horario",
      example: "⚠️ IMPORTANTE: El servicio de mañana domingo cambia a las 9AM por evento especial."
    },
    {
      scenario: "Oración Urgente",
      example: "🙏 Hermanos, oremos por la Hna. María que está en el hospital. Unidos en oración."
    },
    {
      scenario: "Confirmación de Asistencia",
      example: "✅ Confirma tu asistencia al retiro juvenil respondiendo SÍ o NO."
    }
  ]

  // Pricing information available on request

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
          <MessageSquare className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">SMS Masivos</h1>
            <p className="text-muted-foreground">
              Llegue a su congregación al instante con mensajes de texto
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))]">🔥 Más Popular</Badge>
          <Badge variant="outline">Complemento Premium</Badge>
        </div>
      </div>

      {/* Info Card */}
      <section className="mb-8">
        <Card className="border-primary shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">SMS Masivos</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">Complemento premium para comunicación inmediata</p>
            <div className="bg-primary/10 p-4 rounded-lg mb-4">
              <p className="font-semibold">SMS incluidos cada mes</p>
              <p className="text-sm text-muted-foreground">
                Contacte soporte para información de precios
              </p>
            </div>
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => alert('Funcionalidad de suscripción será implementada próximamente. Contacte soporte para activar.')}
            >
              💰 Suscribirse Ahora
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Features */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Funcionalidades Incluidas</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Ejemplos de Uso</h2>
        <div className="space-y-4">
          {useCases.map((useCase, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Smartphone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{useCase.scenario}</h4>
                    <div className="bg-muted/50 p-3 rounded-lg text-sm">
                      &quot;{useCase.example}&quot;
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">¿Cómo Funciona?</h2>
        <Card>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">1</div>
                <h4 className="font-semibold text-sm mb-1">Active el Complemento</h4>
                <p className="text-xs text-muted-foreground">Suscríbase desde su panel</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">2</div>
                <h4 className="font-semibold text-sm mb-1">Escriba su Mensaje</h4>
                <p className="text-xs text-muted-foreground">Use plantillas o cree uno nuevo</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">3</div>
                <h4 className="font-semibold text-sm mb-1">Seleccione Destinatarios</h4>
                <p className="text-xs text-muted-foreground">Toda la iglesia o grupos específicos</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">4</div>
                <h4 className="font-semibold text-sm mb-1">Envíe o Programe</h4>
                <p className="text-xs text-muted-foreground">Inmediato o programado</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Benefits */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">¿Por Qué SMS Masivos?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📱 Alto Alcance</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[hsl(var(--success))]" />
                  98% de tasa de apertura (vs. 20% email)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[hsl(var(--success))]" />
                  Lectura en promedio en 3 minutos
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[hsl(var(--success))]" />
                  Funciona sin internet
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">⚡ Comunicación Inmediata</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[hsl(var(--success))]" />
                  Ideal para emergencias
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[hsl(var(--success))]" />
                  Recordatorios de última hora
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[hsl(var(--success))]" />
                  Confirmaciones rápidas
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>❓ Preguntas Frecuentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm">¿Qué pasa si uso más SMS de los incluidos?</h4>
                <p className="text-sm text-muted-foreground">Los SMS adicionales se cobran automáticamente al final del mes según las tarifas vigentes.</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">¿Funciona con todos los operadores?</h4>
                <p className="text-sm text-muted-foreground">Sí, funciona con Claro, Movistar, Tigo, WOM y todos los operadores de Colombia.</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">¿Puedo cancelar cuando quiera?</h4>
                <p className="text-sm text-muted-foreground">Sí, puede cancelar sin penalizaciones. Los SMS del mes actual se mantienen hasta el final del período.</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">¿Los miembros pueden responder?</h4>
                <p className="text-sm text-muted-foreground">Sí, las respuestas llegan a una bandeja especial en su dashboard para que pueda gestionarlas.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="text-center">
        <Card>
          <CardContent className="p-8">
            <h3 className="text-xl font-bold mb-2">¿Listo para Comunicarse Mejor?</h3>
            <p className="text-muted-foreground mb-6">
              Únase a las iglesias que ya usan SMS Masivos para mantenerse conectadas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => alert('Funcionalidad de suscripción será implementada próximamente. Contacte soporte para activar.')}
              >
                💰 Suscribirse Ahora
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.open('https://wa.me/573003435733', '_blank')}>
                💬 Consultar por WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
