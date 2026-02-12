import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '30'; // days
    const churchId = session.user.churchId;

    if (!churchId) {
      return NextResponse.json({ error: 'Church not found' }, { status: 404 });
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(period));

    // Default fallback data
    let memberStats = { _count: { id: 0 } }
    let donationStats = { _sum: { amount: 0 }, _count: { id: 0 }, _avg: { amount: 0 } }
    let eventStats = { _count: { id: 0 } }
    let communicationStats = { _count: { id: 0 } }
    let socialMediaStats = { _count: { id: 0 } }
    let volunteerStats = { _count: { id: 0 } }

    try {
      // Parallel data fetching for better performance
      const results = await Promise.all([
      // Member Analytics
      db.members.aggregate({
        where: { churchId, isActive: true },
        _count: { id: true }
      }),
      
      // Donation Analytics
      db.donations.aggregate({
        where: { 
          churchId,
          donationDate: { gte: startDate, lte: endDate },
          status: 'COMPLETADA'
        },
        _sum: { amount: true },
        _count: { id: true },
        _avg: { amount: true }
      }),

      // Event Analytics
      db.events.aggregate({
        where: { 
          churchId,
          startDate: { gte: startDate, lte: endDate }
        },
        _count: { id: true }
      }),

      // Communication Analytics
      db.communications.aggregate({
        where: { 
          churchId,
          sentAt: { gte: startDate, lte: endDate }
        },
        _count: { id: true }
      }),

      // Social Media Analytics
      db.social_media_posts.aggregate({
        where: { 
          churchId,
          createdAt: { gte: startDate, lte: endDate }
        },
        _count: { id: true }
      }),

      // Volunteer Analytics
      db.volunteers.aggregate({
        where: { 
          members: { churchId, isActive: true },
          isActive: true 
        },
        _count: { id: true }
      })
      ])

      // Assign results
      memberStats = results[0]
      donationStats = results[1]
      eventStats = results[2]
      communicationStats = results[3]
      socialMediaStats = results[4]
      volunteerStats = results[5]
    } catch (dbError) {
      console.log('⚠️ Database unavailable for analytics overview, using fallback data')
      // Fallback data already initialized above
    }

    // Calculate growth rates (compare with previous period)
    const previousStartDate = new Date();
    previousStartDate.setDate(startDate.getDate() - parseInt(period));

    let previousDonations = { _sum: { amount: 0 }, _count: { id: 0 } }
    let previousEvents = { _count: { id: 0 } }
    let previousCommunications = { _count: { id: 0 } }
    let previousSocialPosts = { _count: { id: 0 } }

    try {
      const growthResults = await Promise.all([
      db.donations.aggregate({
        where: { 
          churchId,
          donationDate: { gte: previousStartDate, lt: startDate },
          status: 'COMPLETADA'
        },
        _sum: { amount: true },
        _count: { id: true }
      }),
      
      db.events.aggregate({
        where: { 
          churchId,
          startDate: { gte: previousStartDate, lt: startDate }
        },
        _count: { id: true }
      }),

      db.communications.aggregate({
        where: { 
          churchId,
          sentAt: { gte: previousStartDate, lt: startDate }
        },
        _count: { id: true }
      }),

      db.social_media_posts.aggregate({
        where: { 
          churchId,
          createdAt: { gte: previousStartDate, lt: startDate }
        },
        _count: { id: true }
      })
      ])

      previousDonations = growthResults[0]
      previousEvents = growthResults[1]
      previousCommunications = growthResults[2]
      previousSocialPosts = growthResults[3]
    } catch (dbError) {
      console.log('⚠️ Database unavailable for growth analytics, using zero growth')
      // Fallback data already initialized above
    }

    // Calculate growth percentages
    const calculateGrowth = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const overview = {
      period: parseInt(period),
      members: {
        total: memberStats._count.id,
        // Members don't have growth in this simple calculation - could add member registration dates
        growth: 0
      },
      donations: {
        total: donationStats._sum.amount || 0,
        count: donationStats._count.id,
        average: donationStats._avg.amount || 0,
        growth: calculateGrowth(
          donationStats._sum.amount || 0,
          previousDonations._sum.amount || 0
        )
      },
      events: {
        total: eventStats._count.id,
        growth: calculateGrowth(
          eventStats._count.id,
          previousEvents._count.id
        )
      },
      communications: {
        total: communicationStats._count.id,
        growth: calculateGrowth(
          communicationStats._count.id,
          previousCommunications._count.id
        )
      },
      socialMedia: {
        posts: socialMediaStats._count.id,
        growth: calculateGrowth(
          socialMediaStats._count.id,
          previousSocialPosts._count.id
        )
      },
      volunteers: {
        total: volunteerStats._count.id,
        // Similar to members, could add volunteer registration tracking
        growth: 0
      }
    };

    return NextResponse.json(overview);
  } catch (error) {
    console.error('Analytics overview error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics overview' },
      { status: 500 }
    );
  }
}
