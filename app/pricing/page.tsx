import { CheckCircle, Users, Building2, Globe, ArrowRight, Mail } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Precios — Khesed-Tek Church Management',
  description: 'Planes flexibles para iglesias de todos los tamaños. Desde iglesias pequeñas hasta redes multi-campus.',
}

const plans = [
  {
    id: 'basico',
    name: 'Básico',
    subtitle: 'Iglesia Pequeña',
    priceMonthly: 149.99,
    priceYearly: 1499.99,
    savingsYearly: 300,
    maxMembers: 500,
    maxUsers: 5,
    icon: Users,
    color: 'blue',
    popular: false,
    features: [
      'Gestión básica de miembros (hasta 500)',
      'Hasta 5 licencias de usuario',
      'Módulo de comunicación (WhatsApp, email)',
      'Registro de visitas y seguimiento',
      'Eventos y asistencia',
      'Donaciones y finanzas básicas',
      'Informes estándar',
      'Procesamiento de pagos (PSE, Nequi)',
      'Soporte en español (horario laboral)',
      'Actualizaciones de plataforma incluidas',
    ],
  },
  {
    id: 'profesional',
    name: 'Profesional',
    subtitle: 'Iglesia Mediana',
    priceMonthly: 299.99,
    priceYearly: 2999.99,
    savingsYearly: 600,
    maxMembers: 2000,
    maxUsers: 10,
    icon: Building2,
    color: 'purple',
    popular: true,
    features: [
      'Todo lo del plan Básico',
      'Gestión de miembros (hasta 2,000)',
      'Hasta 10 licencias de usuario',
      'Analíticas avanzadas con IA',
      'Automatización de comunicaciones',
      'Constructor de formularios con QR',
      'Social media programado (Facebook, Instagram, YouTube)',
      'Evaluaciones espirituales y voluntarios',
      'Exportación de reportes (PDF, Excel)',
      'Pared de oración (Prayer Wall)',
      'Integraciones bíblicas',
      'Soporte prioritario',
    ],
  },
  {
    id: 'empresarial',
    name: 'Empresarial',
    subtitle: 'Red Multi-Campus',
    priceMonthly: null,
    priceYearly: null,
    savingsYearly: null,
    maxMembers: null,
    maxUsers: null,
    icon: Globe,
    color: 'green',
    popular: false,
    features: [
      'Todo lo del plan Profesional',
      'Miembros y usuarios ilimitados',
      'Múltiples campus en una sola plataforma',
      'API personalizada y webhooks',
      'Integraciones personalizadas (ERP, CRM)',
      'Panel de administración multi-iglesia',
      'Reportes consolidados entre campus',
      'Dominio y marca propios',
      'Gerente de cuenta dedicado',
      'SLA de tiempo de actividad (99.9%)',
      'Capacitación y onboarding personalizado',
      'Soporte 24/7 con respuesta garantizada',
    ],
  },
]

const addons = [
  {
    name: 'SMS Premium',
    description: 'Mensajes de texto masivos adicionales para comunicación de emergencia',
    price: '29.99/mes',
  },
  {
    name: 'Almacenamiento Extra',
    description: '100 GB adicionales para archivos multimedia, sermones y transmisiones',
    price: '19.99/mes',
  },
  {
    name: 'Integración Contable',
    description: 'Sincronización con sistemas contables (QuickBooks, Siigo, Alegra)',
    price: '49.99/mes',
  },
  {
    name: 'App Móvil Propia',
    description: 'Aplicación móvil con tu marca publicada en App Store y Google Play',
    price: 'Consultar',
  },
]

function PricingCard({ plan }: { plan: typeof plans[0] }) {
  const Icon = plan.icon

  const borderColor =
    plan.color === 'purple'
      ? 'border-[hsl(var(--lavender)/0.4)]'
      : plan.color === 'green'
      ? 'border-[hsl(var(--success)/0.4)]'
      : 'border-[hsl(var(--info)/0.4)]'

  const iconColor =
    plan.color === 'purple'
      ? 'text-[hsl(var(--lavender))]'
      : plan.color === 'green'
      ? 'text-[hsl(var(--success))]'
      : 'text-[hsl(var(--info))]'

  const badgeBg =
    plan.color === 'purple'
      ? 'bg-[hsl(var(--lavender)/0.15)] text-[hsl(var(--lavender))]'
      : plan.color === 'green'
      ? 'bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]'
      : 'bg-[hsl(var(--info)/0.15)] text-[hsl(var(--info))]'

  const buttonStyle =
    plan.color === 'purple'
      ? 'bg-[hsl(var(--lavender))] hover:bg-[hsl(var(--lavender))] text-white'
      : plan.color === 'green'
      ? 'bg-[hsl(var(--success))] hover:bg-[hsl(var(--success))] text-white'
      : 'bg-[hsl(var(--info))] hover:bg-[hsl(var(--info))] text-white'

  return (
    <div
      className={`relative flex flex-col rounded-2xl border-2 ${borderColor} bg-white p-8 shadow-sm ${
        plan.popular ? 'ring-2 ring-[hsl(var(--lavender)/0.30)] ring-offset-2' : ''
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-[hsl(var(--lavender))] px-4 py-1 text-sm font-semibold text-white">
            Más popular
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <Icon className={`h-8 w-8 ${iconColor}`} />
        <div>
          <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
          <p className="text-sm text-muted-foreground">{plan.subtitle}</p>
        </div>
      </div>

      <div className="mb-6">
        {plan.priceMonthly ? (
          <>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-foreground">${plan.priceMonthly}</span>
              <span className="text-muted-foreground">/mes</span>
            </div>
            {plan.priceYearly && (
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  ${plan.priceYearly}/año
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeBg}`}>
                  Ahorra ${plan.savingsYearly}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground">Personalizado</span>
          </div>
        )}
      </div>

      {(plan.maxMembers || plan.maxUsers) && (
        <div className="mb-6 flex gap-4">
          {plan.maxMembers && (
            <span className={`text-xs font-medium px-2 py-1 rounded-lg ${badgeBg}`}>
              Hasta {plan.maxMembers.toLocaleString()} miembros
            </span>
          )}
          {plan.maxUsers && (
            <span className={`text-xs font-medium px-2 py-1 rounded-lg ${badgeBg}`}>
              {plan.maxUsers} usuarios
            </span>
          )}
        </div>
      )}

      <ul className="mb-8 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
            <CheckCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${iconColor}`} />
            {feature}
          </li>
        ))}
      </ul>

      <div>
        {plan.priceMonthly ? (
          <Link
            href="/auth/register"
            className={`flex items-center justify-center gap-2 w-full rounded-xl px-6 py-3 font-semibold transition-colors ${buttonStyle}`}
          >
            Comenzar ahora
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <a
            href="mailto:ventas@khesed-tek-systems.org"
            className={`flex items-center justify-center gap-2 w-full rounded-xl px-6 py-3 font-semibold transition-colors ${buttonStyle}`}
          >
            Contactar ventas
            <Mail className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  )
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-white border-b border-border py-4 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Khesed-Tek" className="h-9 w-auto" />
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block rounded-full bg-[hsl(var(--lavender)/0.15)] px-4 py-1.5 text-sm font-medium text-[hsl(var(--lavender))] mb-4">
            Planes y Precios
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Un plan para cada iglesia
          </h1>
          <p className="text-lg text-muted-foreground">
            Desde pequeñas congregaciones hasta grandes redes multi-campus. Sin costos ocultos,
            sin contratos de permanencia obligatorios.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Precios en USD. IVA e impuestos locales pueden aplicar según el país.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </section>

      {/* Annual savings callout */}
      <section className="py-8 px-6">
        <div className="max-w-3xl mx-auto rounded-2xl bg-[hsl(var(--lavender)/0.10)] border border-[hsl(var(--lavender)/0.3)] p-8 text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">
            Ahorra hasta 2 meses con facturación anual
          </h3>
          <p className="text-muted-foreground">
            Los planes anuales se cobran en un solo pago. Incluyen todas las actualizaciones
            del año y soporte completo sin costo adicional.
          </p>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-3">Módulos adicionales</h2>
            <p className="text-muted-foreground">Amplía tu plan con funcionalidades especializadas</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {addons.map((addon) => (
              <div
                key={addon.name}
                className="rounded-xl border border-border bg-muted/30 p-6"
              >
                <h4 className="font-semibold text-foreground mb-2">{addon.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">{addon.description}</p>
                <span className="text-sm font-bold text-[hsl(var(--lavender))]">{addon.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-10">
            Preguntas frecuentes
          </h2>
          <div className="space-y-6">
            {[
              {
                q: '¿Hay un período de prueba gratuito?',
                a: 'Sí. Ofrecemos garantía de satisfacción de 7 días en cuentas nuevas. Si no estás satisfecho dentro de los primeros 7 días, te devolvemos el pago sin preguntas.',
              },
              {
                q: '¿Puedo cambiar de plan en cualquier momento?',
                a: 'Sí. Puedes actualizar o bajar tu plan en cualquier momento. Los cambios se aplican de inmediato y el monto se prorratea en tu próxima factura.',
              },
              {
                q: '¿Qué métodos de pago aceptan?',
                a: 'Aceptamos tarjetas de crédito/débito (Visa, Mastercard, Amex), PSE (Colombia), Nequi, Daviplata, y próximamente OXXO (México) y PagoFácil (Argentina).',
              },
              {
                q: '¿Qué sucede con mis datos si cancelo?',
                a: 'Conservamos tu información durante 90 días después de la cancelación. Puedes solicitar una exportación completa de tus datos en formato CSV o JSON en cualquier momento.',
              },
              {
                q: '¿El precio incluye soporte técnico?',
                a: 'Todos los planes incluyen soporte en español vía email y chat. El plan Empresarial incluye soporte 24/7 con gerente de cuenta dedicado.',
              },
              {
                q: '¿Tienen descuentos para iglesias sin fines de lucro?',
                a: 'Sí. Ofrecemos descuentos especiales para organizaciones sin fines de lucro registradas. Contáctanos a ventas@khesed-tek-systems.org con tu certificado de exención.',
              },
            ].map((item) => (
              <div key={item.q} className="rounded-xl bg-white border border-border p-6">
                <h3 className="font-semibold text-foreground mb-2">{item.q}</h3>
                <p className="text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[hsl(var(--lavender))] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para transformar tu iglesia?
          </h2>
          <p className="text-[hsl(var(--lavender)/0.6)] mb-8">
            Únete a cientos de iglesias en Latinoamérica que ya usan Khesed-Tek para crecer y
            conectar con su comunidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="rounded-xl bg-white px-8 py-3 font-semibold text-[hsl(var(--lavender))] hover:bg-[hsl(var(--lavender)/0.10)] transition-colors"
            >
              Comenzar gratis por 7 días
            </Link>
            <a
              href="mailto:ventas@khesed-tek-systems.org"
              className="rounded-xl border-2 border-white px-8 py-3 font-semibold text-white hover:bg-[hsl(var(--lavender))] transition-colors"
            >
              Hablar con ventas
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-8 px-6 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-4">
            <Link href="/terms" className="hover:text-muted-foreground">Términos de Servicio</Link>
            <Link href="/privacy" className="hover:text-muted-foreground">Política de Privacidad</Link>
            <Link href="/refund" className="hover:text-muted-foreground">Política de Reembolso</Link>
            <a href="mailto:ventas@khesed-tek-systems.org" className="hover:text-muted-foreground">
              ventas@khesed-tek-systems.org
            </a>
          </div>
          <p className="text-sm text-muted-foreground/70">
            © {new Date().getFullYear()} Khesed-Tek Systems LLC. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
