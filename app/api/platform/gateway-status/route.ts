import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    // Report only whether the key is configured — never expose actual values
    const gateways = {
      stripe: {
        name: 'Stripe',
        configured: !!process.env.STRIPE_SECRET_KEY,
        envVar: 'STRIPE_SECRET_KEY',
        webhookConfigured: !!process.env.STRIPE_WEBHOOK_SECRET,
        description: 'Procesamiento de tarjetas de crédito y débito',
        website: 'https://stripe.com',
      },
      paddle: {
        name: 'Paddle',
        configured: !!process.env.PADDLE_API_KEY,
        envVar: 'PADDLE_API_KEY',
        webhookConfigured: !!process.env.PADDLE_WEBHOOK_SECRET,
        description: 'Facturación SaaS con impuestos globales automáticos',
        website: 'https://paddle.com',
      },
      whop: {
        name: 'Whop',
        configured: !!process.env.WHOP_API_KEY,
        envVar: 'WHOP_API_KEY',
        webhookConfigured: !!process.env.WHOP_WEBHOOK_SECRET,
        description: 'Comunidades y suscripciones digitales',
        website: 'https://whop.com',
      },
    }

    return NextResponse.json({ gateways })
  } catch (error) {
    console.error('Error fetching gateway status:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
