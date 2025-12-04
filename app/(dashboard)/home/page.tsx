import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { DashboardClient } from './_components/dashboard-client'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.churchId) {
    return <div>Error: No se encontró la iglesia</div>
  }

  // Fetch dashboard statistics
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0))
  const endOfDay = new Date(today.setHours(23, 59, 59, 999))

  const [
    totalMembers, 
    totalSermons, 
    upcomingEvents, 
    newMembersThisMonth,
    totalVolunteers,
    totalCheckIns,
    pendingFollowUps,
    childrenPresent,
    websiteRequests,
    existingWebsites,
    visitorEngagementData,
    firstTimeVisitorsThisMonth,
    completedFollowUpsThisMonth
  ] = await Promise.all([
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

  // Fetch recent members
  const recentMembers = await db.members.findMany({
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
  })

  // Fetch recent sermons
  const recentSermons = await db.sermons.findMany({
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
  })

  // Fetch recent check-ins
  const recentCheckIns = await db.check_ins.findMany({
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
  })

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
