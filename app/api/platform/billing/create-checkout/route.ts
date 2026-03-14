/**
 * POST /api/platform/billing/create-checkout
 *
 * SUPER_ADMIN assigns a plan to a church and gets back a Paddle hosted checkout URL.
 * The URL can be shared with the church so they complete payment.
 *
 * Body: { churchId, planId, billingCycle: "MONTHLY" | "YEARLY" }
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  createPaddleCustomer,
  createPaddleCheckout,
  findPaddleDiscountByCode,
} from '@/lib/paddle'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Solo SUPER_ADMIN puede crear suscripciones' }, { status: 403 })
    }

    const body = await request.json()
    const { churchId, planId, billingCycle = 'MONTHLY', discountCode } = body

    if (!churchId || !planId) {
      return NextResponse.json(
        { error: 'Se requieren churchId y planId' },
        { status: 400 }
      )
    }

    // Load church + plan
    const [church, plan] = await Promise.all([
      prisma.churches.findUnique({
        where: { id: churchId },
        select: { id: true, name: true, email: true },
      }),
      prisma.subscription_plans.findUnique({
        where: { id: planId },
        select: {
          id: true,
          displayName: true,
          paddlePriceIdMonthly: true,
          paddlePriceIdYearly: true,
        },
      }),
    ])

    if (!church) {
      return NextResponse.json({ error: 'Iglesia no encontrada' }, { status: 404 })
    }

    if (!plan) {
      return NextResponse.json({ error: 'Plan no encontrado' }, { status: 404 })
    }

    const priceId =
      billingCycle === 'YEARLY'
        ? plan.paddlePriceIdYearly
        : plan.paddlePriceIdMonthly

    if (!priceId) {
      return NextResponse.json(
        {
          error: `El plan "${plan.displayName}" no tiene configurado el Paddle Price ID para el ciclo ${billingCycle}. Configure paddlePriceId${billingCycle === 'YEARLY' ? 'Yearly' : 'Monthly'} en los planes.`,
        },
        { status: 422 }
      )
    }

    // Find or create Paddle customer for the church
    let existingSub = await prisma.church_subscriptions.findUnique({
      where: { churchId },
      select: { paddleCustomerId: true },
    })

    let paddleCustomerId = existingSub?.paddleCustomerId ?? null

    if (!paddleCustomerId) {
      const customer = await createPaddleCustomer(
        church.name,
        church.email ?? `noreply+${church.id}@khesed-tek.com`
      )
      paddleCustomerId = customer.id
    }

    // Resolve discount code → Paddle discount ID (dsc_xxx)
    let discountId: string | undefined
    if (discountCode) {
      const found = await findPaddleDiscountByCode(discountCode)
      if (!found) {
        return NextResponse.json(
          { error: `Código de descuento "${discountCode}" no encontrado o inactivo en Paddle.` },
          { status: 422 }
        )
      }
      discountId = found
    }

    // Create Paddle transaction (draft) → returns hosted checkout URL
    const transaction = await createPaddleCheckout({
      priceId,
      customerId: paddleCustomerId,
      billingCycle: billingCycle as 'MONTHLY' | 'YEARLY',
      customData: {
        churchId: church.id,
        planId: plan.id,
        billingCycle,
      },
      discountId,
    })

    // Persist the customer ID and pending transaction ID immediately
    await prisma.church_subscriptions.upsert({
      where: { churchId },
      create: {
        id: crypto.randomUUID(),
        churchId,
        planId,
        billingCycle,
        status: 'PENDING',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        paddleCustomerId,
        paddleTransactionId: transaction.id,
        updatedAt: new Date(),
      },
      update: {
        planId,
        billingCycle,
        status: 'PENDING',
        paddleCustomerId,
        paddleTransactionId: transaction.id,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      checkoutUrl: transaction.checkout.url,
      transactionId: transaction.id,
      paddleCustomerId,
    })
  } catch (error: any) {
    console.error('[Billing] create-checkout error:', error)
    return NextResponse.json(
      { error: error.message ?? 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
