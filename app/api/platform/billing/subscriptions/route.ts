/**
 * GET /api/platform/billing/subscriptions
 *
 * SUPER_ADMIN view: returns all churches with their subscription status,
 * plan details, and Paddle IDs.
 *
 * GET /api/platform/billing/subscriptions?churchId=xxx
 * Returns subscription for a single church.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const churchId = searchParams.get('churchId')

    if (churchId) {
      // Single church
      const sub = await prisma.church_subscriptions.findUnique({
        where: { churchId },
        include: {
          subscription_plans: {
            select: {
              id: true,
              displayName: true,
              priceMonthly: true,
              priceYearly: true,
              paddlePriceIdMonthly: true,
              paddlePriceIdYearly: true,
            },
          },
          churches: {
            select: { id: true, name: true, email: true, isActive: true },
          },
        },
      })

      return NextResponse.json({ subscription: sub })
    }

    // All churches — left join via querying churches then including optional subscription
    const churches = await prisma.churches.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        church_subscriptions: {
          select: {
            id: true,
            status: true,
            billingCycle: true,
            currentPeriodStart: true,
            currentPeriodEnd: true,
            trialEnd: true,
            cancelAtPeriodEnd: true,
            cancelledAt: true,
            paddleCustomerId: true,
            paddleSubscriptionId: true,
            paddleTransactionId: true,
            planId: true,
            subscription_plans: {
              select: {
                id: true,
                displayName: true,
                priceMonthly: true,
                priceYearly: true,
                paddlePriceIdMonthly: true,
                paddlePriceIdYearly: true,
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    // Also fetch all plans for the assignment dialog
    const plans = await prisma.subscription_plans.findMany({
      where: { isActive: true },
      select: {
        id: true,
        displayName: true,
        description: true,
        priceMonthly: true,
        priceYearly: true,
        paddlePriceIdMonthly: true,
        paddlePriceIdYearly: true,
        maxMembers: true,
        maxUsers: true,
        features: true,
        sortOrder: true,
      },
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json({ churches, plans })
  } catch (error: any) {
    console.error('[Billing] subscriptions GET error:', error)
    return NextResponse.json(
      { error: error.message ?? 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/platform/billing/subscriptions
 *
 * SUPER_ADMIN manually assigns or updates a plan for a church without
 * requiring Paddle (manual billing model). Sets status to ACTIVE immediately.
 *
 * Body: { churchId, planId, billingCycle: "MONTHLY" | "YEARLY", trialDays? }
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Solo SUPER_ADMIN puede asignar planes' }, { status: 403 })
    }

    const body = await request.json()
    const { churchId, planId, billingCycle = 'MONTHLY', trialDays } = body

    if (!churchId || !planId) {
      return NextResponse.json(
        { error: 'Se requieren churchId y planId' },
        { status: 400 }
      )
    }

    // Verify church and plan exist
    const [church, plan] = await Promise.all([
      prisma.churches.findUnique({
        where: { id: churchId },
        select: { id: true, name: true },
      }),
      prisma.subscription_plans.findUnique({
        where: { id: planId },
        select: { id: true, displayName: true },
      }),
    ])

    if (!church) {
      return NextResponse.json({ error: 'Iglesia no encontrada' }, { status: 404 })
    }
    if (!plan) {
      return NextResponse.json({ error: 'Plan no encontrado' }, { status: 404 })
    }

    const now = new Date()
    const periodEnd = new Date(now)
    if (billingCycle === 'YEARLY') {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1)
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1)
    }

    const trialEnd = trialDays && trialDays > 0
      ? new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000)
      : null

    const subscription = await prisma.church_subscriptions.upsert({
      where: { churchId },
      create: {
        id: crypto.randomUUID(),
        churchId,
        planId,
        billingCycle,
        status: 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        ...(trialEnd && { trialEnd }),
        updatedAt: now,
      },
      update: {
        planId,
        billingCycle,
        status: 'ACTIVE',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
        cancelledAt: null,
        ...(trialEnd && { trialEnd }),
        updatedAt: now,
      },
      include: {
        subscription_plans: {
          select: { id: true, displayName: true },
        },
      },
    })

    return NextResponse.json({
      success: true,
      subscription,
      message: `Plan "${plan.displayName}" asignado correctamente a ${church.name}`,
    })
  } catch (error: any) {
    console.error('[Billing] subscriptions PUT error:', error)
    return NextResponse.json(
      { error: error.message ?? 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
