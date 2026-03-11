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
