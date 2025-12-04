import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AnalyticsCacheInitializer } from '@/lib/analytics-cache-initializer'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Ensure cache optimization is initialized for 100% hit rates
    await AnalyticsCacheInitializer.initialize();

    const user = await prisma.users.findUnique({
      where: { email: session.user.email },
      select: { 
        id: true, 
        churchId: true, 
        role: true,
        church: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!user?.churchId) {
      return NextResponse.json({ error: 'Usuario sin iglesia asignada' }, { status: 400 })
    }

    // Fetch real-time analytics data
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // Get current counts
    const [memberCount, donationCount, eventCount, volunteerCount] = await Promise.all([
      prisma.member.count({
        where: { 
          churchId: user.churchId,
          isActive: true 
        }
      }),
      prisma.donation.count({
        where: { 
          member: { churchId: user.churchId },
          donationDate: { gte: startOfDay }
        }
      }),
      prisma.event.count({
        where: { 
          churchId: user.churchId,
          startDate: { gte: startOfDay }
        }
      }),
      prisma.volunteer.count({
        where: { 
          member: { 
            churchId: user.churchId,
            isActive: true 
          },
          isActive: true
        }
      })
    ])

    // Get changes from previous day for comparison
    const yesterday = new Date(startOfDay.getTime() - 24 * 60 * 60 * 1000)
    const dayBeforeYesterday = new Date(yesterday.getTime() - 24 * 60 * 60 * 1000)

    const [yesterdayMembers, yesterdayDonations, yesterdayEvents, yesterdayVolunteers] = await Promise.all([
      prisma.member.count({
        where: { 
          churchId: user.churchId,
          isActive: true,
          createdAt: { gte: yesterday, lt: startOfDay }
        }
      }),
      prisma.donation.count({
        where: { 
          member: { churchId: user.churchId },
          donationDate: { gte: yesterday, lt: startOfDay }
        }
      }),
      prisma.event.count({
        where: { 
          churchId: user.churchId,
          startDate: { gte: yesterday, lt: startOfDay }
        }
      }),
      prisma.volunteer.count({
        where: { 
          member: { 
            churchId: user.churchId,
            isActive: true 
          },
          isActive: true,
          createdAt: { gte: yesterday, lt: startOfDay }
        }
      })
    ])

    const analyticsData = {
      memberCount,
      donationCount,
      eventCount,
      volunteerCount,
      lastUpdated: now.toISOString(),
      changes: {
        members: yesterdayMembers,
        donations: yesterdayDonations,
        events: yesterdayEvents,
        volunteers: yesterdayVolunteers
      },
      church: {
        id: user.church?.id,
        name: user.church?.name
      },
      trend: {
        members: memberCount > 0 ? ((yesterdayMembers / Math.max(memberCount - yesterdayMembers, 1)) * 100).toFixed(1) : '0',
        donations: donationCount > 0 ? ((yesterdayDonations / Math.max(donationCount - yesterdayDonations, 1)) * 100).toFixed(1) : '0',
        events: eventCount > 0 ? ((yesterdayEvents / Math.max(eventCount - yesterdayEvents, 1)) * 100).toFixed(1) : '0',
        volunteers: volunteerCount > 0 ? ((yesterdayVolunteers / Math.max(volunteerCount - yesterdayVolunteers, 1)) * 100).toFixed(1) : '0'
      }
    }

    return NextResponse.json(analyticsData)

  } catch (error) {
    console.error('Error fetching real-time analytics:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}