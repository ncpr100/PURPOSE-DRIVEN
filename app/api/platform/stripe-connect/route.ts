import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import Stripe from 'stripe'

/**
 * Stripe Connect onboarding for church tenants.
 *
 * GET  /api/platform/stripe-connect?churchId=xxx  — status of church Connect account
 * POST /api/platform/stripe-connect               — create account + generate onboarding link
 * DELETE /api/platform/stripe-connect?churchId=   — disconnect church (sets status to disconnected)
 */

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY no configurada')
  return new Stripe(key, { apiVersion: '2025-10-29.clover' as const })
}

async function requireSuperAdmin(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { error: NextResponse.json({ error: 'No autenticado' }, { status: 401 }) }
  }
  if (session.user.role !== 'SUPER_ADMIN') {
    return { error: NextResponse.json({ error: 'Solo accesible para Super Admin' }, { status: 403 }) }
  }
  return { session }
}

// ─── GET: status ─────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const auth = await requireSuperAdmin(request)
  if (auth.error) return auth.error

  const churchId = new URL(request.url).searchParams.get('churchId')
  if (!churchId) {
    return NextResponse.json({ error: 'churchId requerido' }, { status: 400 })
  }

  const church = await db.churches.findUnique({
    where: { id: churchId },
    select: {
      id: true,
      name: true,
      stripeConnectAccountId: true,
      stripeConnectStatus:    true,
    },
  })

  if (!church) {
    return NextResponse.json({ error: 'Iglesia no encontrada' }, { status: 404 })
  }

  // Optionally refresh status from Stripe if we have an account
  let stripeAccount: Stripe.Account | null = null
  if (church.stripeConnectAccountId) {
    try {
      const stripe = getStripe()
      stripeAccount = await stripe.accounts.retrieve(church.stripeConnectAccountId)
    } catch (err) {
      console.error('[stripe-connect] Error retrieving account:', err)
    }
  }

  return NextResponse.json({
    church: {
      id:   church.id,
      name: church.name,
    },
    connect: {
      accountId:    church.stripeConnectAccountId,
      status:       church.stripeConnectStatus,
      detailsSubmitted:  stripeAccount?.details_submitted ?? false,
      chargesEnabled:    stripeAccount?.charges_enabled    ?? false,
      payoutsEnabled:    stripeAccount?.payouts_enabled    ?? false,
    },
  })
}

// ─── POST: create Connect account + onboarding link ──────────────────────────
export async function POST(request: NextRequest) {
  const auth = await requireSuperAdmin(request)
  if (auth.error) return auth.error

  let body: any
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  const { churchId, refreshUrl, returnUrl } = body
  if (!churchId)   return NextResponse.json({ error: 'churchId requerido' }, { status: 400 })
  if (!refreshUrl) return NextResponse.json({ error: 'refreshUrl requerido' }, { status: 400 })
  if (!returnUrl)  return NextResponse.json({ error: 'returnUrl requerido' }, { status: 400 })

  // NOTE: All Stripe operations are wrapped in try/catch so errors always
  // return a JSON body. An empty 500 would cause res.json() to throw on client.
  try {
    const church = await db.churches.findUnique({ where: { id: churchId } })
    if (!church) {
      return NextResponse.json({ error: 'Iglesia no encontrada' }, { status: 404 })
    }

    // Fail fast with a clear message if the platform key is missing
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'STRIPE_SECRET_KEY no está configurada en el servidor. Contacte al administrador de la plataforma.' },
        { status: 503 }
      )
    }

    const stripe = getStripe()
    let accountId = church.stripeConnectAccountId

  // Create Express account if not yet created
  if (!accountId) {
    const account = await stripe.accounts.create({
      type:    'express',
      country: 'US',
      email:   undefined, // let church owner fill it in during onboarding
      capabilities: {
        card_payments: { requested: true },
        transfers:     { requested: true },
      },
      business_type: 'non_profit',
      metadata: {
        churchId,
        churchName: church.name,
        platform:   'khesed-tek',
      },
    })
    accountId = account.id

    // Persist immediately
    await db.churches.update({
      where: { id: churchId },
      data:  {
        stripeConnectAccountId: accountId,
        stripeConnectStatus:    'pending',
      },
    })
  }

    // Generate onboarding link
    const accountLink = await stripe.accountLinks.create({
      account:     accountId!,
      refresh_url: refreshUrl,
      return_url:  returnUrl,
      type:        'account_onboarding',
    })

    return NextResponse.json({
      accountId,
      onboardingUrl: accountLink.url,
      expiresAt:     accountLink.expires_at,
    })
  } catch (error: any) {
    console.error('[stripe-connect] POST error:', error)
    const message = error?.raw?.message   // Stripe SDK error
      ?? error?.message
      ?? 'Error al configurar Stripe Connect'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// ─── DELETE: disconnect church ───────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  const auth = await requireSuperAdmin(request)
  if (auth.error) return auth.error

  const churchId = new URL(request.url).searchParams.get('churchId')
  if (!churchId) return NextResponse.json({ error: 'churchId requerido' }, { status: 400 })

  await db.churches.update({
    where: { id: churchId },
    data:  {
      stripeConnectAccountId: null,
      stripeConnectStatus:    'disconnected',
    },
  })

  return NextResponse.json({ success: true, message: 'Cuenta Stripe Connect desconectada' })
}
