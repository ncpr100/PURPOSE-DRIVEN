
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Acceso denegado' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // días

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    // Estadísticas generales de la plataforma
    const [
      totalChurches,
      activeChurches,
      totalUsers,
      activeUsers,
      totalMembers,
      // Platform USD revenue: paid subscription invoices only (NOT tenant donations)
      paidSubscriptionInvoices,
      recentActivity
    ] = await Promise.all([
      db.churches.count(),
      db.churches.count({ where: { isActive: true } }),
      db.users.count(),
      db.users.count({ where: { isActive: true } }),
      db.members.count(),

      // Platform revenue = USD invoices marked as PAID for subscriptions
      // This is completely independent of tenant donation data (which is in local currency)
      db.invoices.aggregate({
        where: {
          type: 'SUBSCRIPTION',
          status: 'PAID',
          currency: 'USD',
        },
        _sum: { totalAmount: true },
        _count: true,
      }),

      db.notifications.findMany({
        where: { createdAt: { gte: startDate } },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { churches: { select: { name: true } } },
      }),
    ])

    // MRR (Monthly Recurring Revenue) derived from active subscriptions + plan prices (USD)
    const activeSubscriptions = await db.church_subscriptions.findMany({
      where: { status: { in: ['ACTIVE', 'TRIALING'] } },
      select: {
        billingCycle: true,
        subscription_plans: { select: { priceMonthly: true, priceYearly: true } },
      },
    })

    const mrr = activeSubscriptions.reduce((sum, sub) => {
      const plan = sub.subscription_plans
      if (!plan) return sum
      if (sub.billingCycle === 'YEARLY' && plan.priceYearly) {
        return sum + parseFloat(plan.priceYearly) / 12
      }
      return sum + parseFloat(plan.priceMonthly || '0')
    }, 0)

    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    // Church growth by month
    const recentChurches = await db.churches.findMany({
      where: { createdAt: { gte: twelveMonthsAgo } },
      select: { createdAt: true },
    })

    const monthlyGrowth = recentChurches.reduce((acc: Record<string, number>, church) => {
      const monthKey = church.createdAt.toISOString().slice(0, 7)
      acc[monthKey] = (acc[monthKey] || 0) + 1
      return acc
    }, {})

    const monthlyGrowthArray = Object.entries(monthlyGrowth)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))

    // Top 5 churches by members — subscription plan info replaces tenant donation counts
    const topChurchesByMembers = await db.churches.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { members: true, users: true } },
        church_subscriptions: {
          select: {
            status: true,
            billingCycle: true,
            subscription_plans: { select: { name: true } },
          },
        },
      },
      orderBy: { members: { _count: 'desc' } },
      take: 5,
    })

    // Platform subscription revenue by month (USD paid invoices grouped by paidAt)
    const recentPaidInvoices = await db.invoices.findMany({
      where: {
        type: 'SUBSCRIPTION',
        status: 'PAID',
        currency: 'USD',
        paidAt: { gte: twelveMonthsAgo, not: null },
      },
      select: { paidAt: true, totalAmount: true },
    })

    const subscriptionRevenueByMonth = recentPaidInvoices.reduce(
      (acc: Record<string, { total: number; count: number }>, inv) => {
        const monthKey = inv.paidAt!.toISOString().slice(0, 7)
        if (!acc[monthKey]) acc[monthKey] = { total: 0, count: 0 }
        acc[monthKey].total += Number(inv.totalAmount)
        acc[monthKey].count += 1
        return acc
      },
      {}
    )

    const monthlySubscriptionRevenueArray = Object.entries(subscriptionRevenueByMonth)
      .map(([month, data]) => ({ month, total: data.total, count: data.count }))
      .sort((a, b) => a.month.localeCompare(b.month))

    // User role distribution
    const usersByRole = await db.users.groupBy({
      by: ['role'],
      where: { isActive: true },
      _count: true,
    })

    return NextResponse.json({
      overview: {
        churches: {
          total: totalChurches,
          active: activeChurches,
          inactive: totalChurches - activeChurches,
        },
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers,
        },
        members: totalMembers,
        // Platform USD revenue — fully independent from tenant donation data
        platformRevenue: {
          mrr: Math.round(mrr * 100) / 100,
          totalInvoicesPaid: Math.round((paidSubscriptionInvoices._sum.totalAmount ?? 0) * 100) / 100,
          activeSubscriptions: activeSubscriptions.length,
          currency: 'USD',
        },
      },
      growth: {
        monthly: monthlyGrowthArray,
        // Subscription revenue time series (USD) — replaces the old tenant donation time series
        subscriptionRevenue: monthlySubscriptionRevenueArray,
      },
      rankings: {
        topChurches: topChurchesByMembers.map(church => ({
          id: church.id,
          name: church.name,
          members: church._count.members,
          users: church._count.users,
          subscriptionPlan: church.church_subscriptions?.subscription_plans?.name ?? null,
          subscriptionStatus: church.church_subscriptions?.status ?? null,
        })),
      },
      distribution: {
        usersByRole: usersByRole.reduce((acc, curr) => {
          acc[curr.role] = curr._count
          return acc
        }, {} as Record<string, number>),
      },
      recentActivity: recentActivity.map(activity => ({
        id: activity.id,
        title: activity.title,
        message: activity.message,
        type: activity.type,
        church: activity.churches?.name,
        createdAt: activity.createdAt,
      })),
    })
  } catch (error) {
    console.error('Error fetching platform analytics:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
