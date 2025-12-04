import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET donation statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.churchId) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Sin permisos' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month' // month, year, week
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString())

    const churchId = session.user.churchId

    // Calcular fechas base
    const now = new Date()
    const startOfMonth = new Date(year, month - 1, 1)
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999)
    const startOfYear = new Date(year, 0, 1)
    const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999)
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    // Estadísticas generales
    const [
      totalDonationsAllTime,
      totalAmountAllTime,
      totalDonationsThisMonth,
      totalAmountThisMonth,
      totalDonationsThisYear,
      totalAmountThisYear,
      totalDonationsThisWeek,
      totalAmountThisWeek
    ] = await Promise.all([
      // All time
      db.donation.count({
        where: { churchId, status: 'COMPLETADA' }
      }),
      db.donation.aggregate({
        where: { churchId, status: 'COMPLETADA' },
        _sum: { amount: true }
      }),
      // This month
      db.donation.count({
        where: {
          churchId,
          status: 'COMPLETADA',
          donationDate: { gte: startOfMonth, lte: endOfMonth }
        }
      }),
      db.donation.aggregate({
        where: {
          churchId,
          status: 'COMPLETADA',
          donationDate: { gte: startOfMonth, lte: endOfMonth }
        },
        _sum: { amount: true }
      }),
      // This year
      db.donation.count({
        where: {
          churchId,
          status: 'COMPLETADA',
          donationDate: { gte: startOfYear, lte: endOfYear }
        }
      }),
      db.donation.aggregate({
        where: {
          churchId,
          status: 'COMPLETADA',
          donationDate: { gte: startOfYear, lte: endOfYear }
        },
        _sum: { amount: true }
      }),
      // This week
      db.donation.count({
        where: {
          churchId,
          status: 'COMPLETADA',
          donationDate: { gte: startOfWeek, lte: endOfWeek }
        }
      }),
      db.donation.aggregate({
        where: {
          churchId,
          status: 'COMPLETADA',
          donationDate: { gte: startOfWeek, lte: endOfWeek }
        },
        _sum: { amount: true }
      })
    ])

    // Donaciones por categoría (este mes)
    const donationsByCategory = await db.donation.groupBy({
      by: ['categoryId'],
      where: {
        churchId,
        status: 'COMPLETADA',
        donationDate: { gte: startOfMonth, lte: endOfMonth }
      },
      _sum: { amount: true },
      _count: { id: true }
    })

    // Donaciones por campaña (este mes)
    const donationsByCampaign = await db.donation.groupBy({
      by: ['campaignId'],
      _sum: { amount: true },
      _count: { id: true },
      where: {
        churchId: session.user.churchId,
        status: 'COMPLETADA',
        donationDate: { gte: startOfMonth, lte: endOfMonth }
      }
    })

    // Donaciones por método de pago (este mes)
    const donationsByPaymentMethod = await db.donation.groupBy({
      by: ['paymentMethodId'],
      where: {
        churchId,
        status: 'COMPLETADA',
        donationDate: { gte: startOfMonth, lte: endOfMonth }
      },
      _sum: { amount: true },
      _count: { id: true }
    })

    // Top donantes (este año)
    const topDonorsQuery = await db.donation.groupBy({
      by: ['memberId'],
      where: {
        churchId,
        status: 'COMPLETADA',
        donationDate: { gte: startOfYear, lte: endOfYear },
        memberId: { not: null },
        isAnonymous: false
      },
      _sum: { amount: true },
      _count: { id: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: 10
    })

    // Obtener nombres de categorías
    const categoriesWithData = await Promise.all(
      donationsByCategory.map(async (item: { categoryId: string | null; _sum: { amount: number | null } }) => {
        if (!item.categoryId) {
          return {
            category: 'Sin Categoría',
            amount: item._sum.amount || 0,
          };
        }
        const category = await db.donationCategory.findUnique({
          where: { id: item.categoryId },
          select: { name: true }
        })
        return {
          category: category?.name || 'Desconocido',
          amount: item._sum.amount || 0,
        }
      })
    )

    const campaignsWithData = await Promise.all(
      donationsByCampaign.map(async (item: any) => {
        if (!item.campaignId) {
          return {
            campaign: 'Sin Campaña',
            amount: item._sum.amount || 0,
            count: item._count.id
          };
        }
        const campaign = await db.donationCampaign.findUnique({
          where: { id: item.campaignId },
        });
        return {
          campaign: campaign?.name || 'Desconocido',
          total: item._sum.amount,
        }
      })
    )

    const paymentMethodsWithData = await Promise.all(
      donationsByPaymentMethod.map(async (item: any) => {
        return {
          method: item.paymentMethod,
          amount: item._sum.amount || 0,
          count: item._count.id
        }
      })
    )

    const topDonors = await Promise.all(
      topDonorsQuery.map(async (item: any) => {
        if (!item.memberId) {
          return {
            name: 'Donante Anónimo',
            amount: item._sum.amount || 0,
            count: item._count.id
          };
        }
        const member = await db.members.findUnique({
          where: { id: item.memberId },
          select: { firstName: true, lastName: true }
        })
        return {
          name: member ? `${member.firstName} ${member.lastName}` : 'Desconocido',
          amount: item._sum.amount || 0,
          count: item._count.id
        }
      })
    )

    const stats = {
      overview: {
        allTime: {
          total: totalDonationsAllTime,
          amount: totalAmountAllTime._sum.amount || 0
        },
        thisMonth: {
          total: totalDonationsThisMonth,
          amount: totalAmountThisMonth._sum.amount || 0
        },
        thisYear: {
          total: totalDonationsThisYear,
          amount: totalAmountThisYear._sum.amount || 0
        },
        thisWeek: {
          total: totalDonationsThisWeek,
          amount: totalAmountThisWeek._sum.amount || 0
        }
      },
      byCategory: categoriesWithData,
      byCampaign: campaignsWithData,
      byPaymentMethod: paymentMethodsWithData,
      topDonors
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching donation stats:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

