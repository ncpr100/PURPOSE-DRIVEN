import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { DashboardClient } from './_components/dashboard-client'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.churchId) {
    return <div>Error: No se encontró la iglesia</div>
  }

  // Fetch dashboard statistics with database fallback
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0))
  const endOfDay = new Date(today.setHours(23, 59, 59, 999))

  let totalMembers = 0
  let totalSermons = 0
  let upcomingEvents = 0
  let newMembersThisMonth = 0
  let totalVolunteers = 0
  let totalCheckIns = 0
  let pendingFollowUps = 0
  let childrenPresent = 0
  let websiteRequests: any[] = []
  let existingWebsites = 0
  let visitorEngagementData: any[] = []
  let firstTimeVisitorsThisMonth = 0
  let completedFollowUpsThisMonth = 0
  let recentMembers: any[] = []
  let recentSermons: any[] = []
  let recentCheckIns: any[] = []

  try {
    const results = await Promise.all([
    db.members.count({
      where: { 
        churchId: session.user.churchId,
        isActive: true 
      }
    }),
    db.sermons.count({
      where: { churchId: session.user.churchId }
    }),
    db.events.count({
      where: {
        churchId: session.user.churchId,
        startDate: {
          gte: new Date()
        }
      }
    }),
    db.members.count({
      where: {
        churchId: session.user.churchId,
        isActive: true,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }),
    db.volunteers.count({
      where: { 
        members: {
          churchId: session.user.churchId,
          isActive: true
        },
        isActive: true 
      }
    }),
    db.check_ins.count({
      where: {
        churchId: session.user.churchId,
        checkedInAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    }),
    db.visitor_follow_ups.count({
      where: {
        churchId: session.user.churchId,
        status: 'PENDIENTE'
      }
    }),
    db.children_check_ins.count({
      where: {
        churchId: session.user.churchId,
        checkedIn: true,
        checkedOut: false
      }
    }),
    // Website requests
    db.website_requests.findMany({
      where: {
        churchId: session.user.churchId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3,
      select: {
        id: true,
        requestType: true,
        projectName: true,
        status: true,
        priority: true,
        estimatedPrice: true,
        createdAt: true
      }
    }).catch(() => []), // Gracefully handle if table doesn't exist yet
    // Existing websites
    db.websites.count({
      where: {
        churchId: session.user.churchId,
        isActive: true
      }
    }).catch(() => 0), // Gracefully handle if issues
    // Visitor engagement analytics
    db.check_ins.findMany({
      where: {
        churchId: session.user.churchId,
        engagementScore: { gt: 0 }
      },
      select: {
        engagementScore: true,
        automationTriggered: true,
        visitorType: true,
        isFirstTime: true
      }
    }).catch(() => []),
    // First-time visitors this month
    db.check_ins.count({
      where: {
        churchId: session.user.churchId,
        isFirstTime: true,
        checkedInAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }).catch(() => 0),
    // Completed follow-ups this month
    db.visitor_follow_ups.count({
      where: {
        churchId: session.user.churchId,
        status: 'COMPLETADO',
        completedAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }).catch(() => 0)
    ])

    // Assign results
    totalMembers = results[0]
    totalSermons = results[1]
    upcomingEvents = results[2]
    newMembersThisMonth = results[3]
    totalVolunteers = results[4]
    totalCheckIns = results[5]
    pendingFollowUps = results[6]
    childrenPresent = results[7]
    websiteRequests = results[8]
    existingWebsites = results[9]
    visitorEngagementData = results[10]
    firstTimeVisitorsThisMonth = results[11]
    completedFollowUpsThisMonth = results[12]

    // Fetch recent members
    recentMembers = await db.members.findMany({
      where: {
        churchId: session.user.churchId,
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true
      }
    }).catch(() => [])

    // Fetch recent sermons
    recentSermons = await db.sermons.findMany({
      where: {
        churchId: session.user.churchId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5,
      select: {
        id: true,
        title: true,
        scripture: true,
        createdAt: true
      }
    }).catch(() => [])

    // Fetch recent check-ins
    recentCheckIns = await db.check_ins.findMany({
      where: {
        churchId: session.user.churchId
      },
      orderBy: {
        checkedInAt: 'desc'
      },
      take: 5,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        isFirstTime: true,
        checkedInAt: true
      }
    }).catch(() => [])

  } catch (error) {
    console.log('⚠️ Database unavailable, using fallback dashboard data:', error)
    // Fallback data is already initialized above
  }

  // Calculate visitor analytics
  const visitorArray = Array.isArray(visitorEngagementData) ? visitorEngagementData : [];
  const averageEngagementScore = visitorArray.length > 0 
    ? Math.round(visitorArray.reduce((sum: number, visitor: any) => sum + (visitor.engagementScore || 0), 0) / visitorArray.length)
    : 0
  
  const automationSuccessRate = visitorArray.length > 0
    ? Math.round((visitorArray.filter((v: any) => v.automationTriggered).length / visitorArray.length) * 100)
    : 0
  
  const returningVisitorsCount = visitorArray.filter((v: any) => v.visitorType === 'returning' || !v.isFirstTime).length
  const firstTimeVisitorsCount = visitorArray.filter((v: any) => v.isFirstTime).length

  const kpiData = {
    totalMembers,
    totalSermons,
    upcomingEvents,
    newMembersThisMonth,
    totalVolunteers,
    totalCheckIns,
    pendingFollowUps,
    childrenPresent,
    websiteRequests: websiteRequests.length,
    pendingWebsiteRequests: websiteRequests.filter((r: any) => r.status === 'pending').length,
    existingWebsites,
    // Visitor analytics
    averageEngagementScore,
    automationSuccessRate,
    firstTimeVisitorsThisMonth,
    returningVisitorsCount,
    firstTimeVisitorsCount,
    completedFollowUpsThisMonth,
    followUpCompletionRate: pendingFollowUps > 0 
      ? Math.round((completedFollowUpsThisMonth / (pendingFollowUps + completedFollowUpsThisMonth)) * 100) 
      : 0
  }

  return (
    <DashboardClient 
      stats={kpiData}
      recentMembers={recentMembers}
      recentSermons={recentSermons}
      recentCheckIns={recentCheckIns}
      recentWebsiteRequests={websiteRequests}
      userRole={session.user.role}
    />
  )
}
