import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET /api/volunteer-statistics - Get real volunteer statistics for dashboards
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const churchId = session.user.churchId

    // Get comprehensive volunteer statistics
    const [
      totalVolunteers,
      volunteersWithMinistries,
      volunteersWithAvailability,
      volunteersWithSpiritualProfiles,
      totalMembers,
      membersWithSpiritualProfiles,
      activeMinistries,
      totalAssignments
    ] = await Promise.all([
      // Total active volunteers
      db.volunteer.count({
        where: { 
          member: { churchId },
          isActive: true 
        }
      }),
      
      // Volunteers assigned to ministries
      db.volunteer.count({
        where: { 
          member: { churchId },
          isActive: true,
          ministryId: { not: null }
        }
      }),
      
      // Volunteers with availability matrix filled
      db.volunteer.count({
        where: {
          member: { 
            churchId,
            availabilityMatrix: { isNot: null }
          },
          isActive: true
        }
      }),

      // Volunteers with spiritual profiles
      db.volunteer.count({
        where: {
          member: { 
            churchId,
            spiritualProfile: { isNot: null }
          },
          isActive: true
        }
      }),

      // Total active members for comparison
      db.member.count({
        where: { churchId, isActive: true }
      }),

      // Members with spiritual profiles (new system)
      db.member.count({
        where: { 
          churchId, 
          isActive: true,
          spiritualProfile: { isNot: null }
        }
      }),

      // Active ministries
      db.ministry.count({
        where: { churchId, isActive: true }
      }),

      // Total volunteer assignments
      db.volunteerAssignment.count({
        where: { churchId }
      })
    ])

    // Calculate rates
    const ministryAssignmentRate = totalVolunteers > 0 ? 
      Math.round((volunteersWithMinistries / totalVolunteers) * 100) : 0

    const availabilityCompletionRate = totalVolunteers > 0 ? 
      Math.round((volunteersWithAvailability / totalVolunteers) * 100) : 0

    const volunteerParticipationRate = totalMembers > 0 ? 
      Math.round((totalVolunteers / totalMembers) * 100) : 0

    const spiritualProfileCompletionRate = totalMembers > 0 ? 
      Math.round((membersWithSpiritualProfiles / totalMembers) * 100) : 0

    const volunteerProfileCompletionRate = totalVolunteers > 0 ? 
      Math.round((volunteersWithSpiritualProfiles / totalVolunteers) * 100) : 0

    // Calculate efficiency metrics
    const efficiencyScore = totalVolunteers > 0 ? 
      Math.round(((volunteersWithMinistries / totalVolunteers) * 0.6 + 
                  (volunteersWithAvailability / totalVolunteers) * 0.4) * 100) : 0

    return NextResponse.json({
      success: true,
      statistics: {
        volunteers: {
          total: totalVolunteers,
          withMinistries: volunteersWithMinistries,
          withAvailability: volunteersWithAvailability,
          withProfiles: volunteersWithSpiritualProfiles,
          ministryAssignmentRate,
          availabilityCompletionRate,
          participationRate: volunteerParticipationRate
        },
        members: {
          total: totalMembers,
          withSpiritualProfiles: membersWithSpiritualProfiles,
          spiritualProfileCompletionRate
        },
        ministries: {
          active: activeMinistries,
          totalAssignments
        },
        efficiency: {
          overallScore: efficiencyScore,
          ministryFillRate: ministryAssignmentRate,
          availabilityDataRate: availabilityCompletionRate
        },
        profileCompletion: volunteerProfileCompletionRate,
        availabilityCompletion: availabilityCompletionRate
      }
    })

  } catch (error) {
    console.error('Error fetching volunteer statistics:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}