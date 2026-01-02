
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'
import { volunteerMatchingSchema } from '@/lib/validations/volunteer'
import { ZodError } from 'zod'

// ✅ PERFORMANCE FIX: Pure function - no database queries
// Receives all data pre-fetched to eliminate N+1 query problem
// BEFORE: 3 queries per member × 500 members = 1,500 queries
// AFTER: 0 queries (pure function with pre-fetched data)
function calculateVolunteerScore(
  member: any,
  ministry: { id: string; name: string } | null,
  ministryId: string
) {
  let score = 0
  let reasoning: string[] = []

  // Spiritual Gift Match (40% weight)
  if (ministry) {
    const primaryGifts = member.spiritualGifts || []
    const ministryPassions = member.ministryPassion || []
    
    if (ministryPassions.includes(ministryId)) {
      score += 40
      reasoning.push(`Tiene pasión expresada por el ministerio ${ministry.name}`)
    } else if (primaryGifts.length > 0) {
      // Check if gifts match ministry type (simplified logic)
      score += 25
      reasoning.push('Tiene dones espirituales identificados')
    }
  }

  // Availability Score (25% weight)
  // Data already loaded via member.availability_matrices relation
  if (member.availability_matrices) {
    score += 25
    reasoning.push('Tiene matriz de disponibilidad configurada')
  } else {
    score += 15
    reasoning.push('Disponibilidad general estimada')
  }

  // Experience Level (15% weight)
  const experienceScore = (member.experienceLevel || 1) * 1.5
  score += Math.min(experienceScore, 15)
  reasoning.push(`Nivel de experiencia: ${member.experienceLevel || 1}/10`)

  // Ministry Passion (10% weight)
  if (member.ministryPassion && member.ministryPassion.includes(ministryId)) {
    score += 10
    reasoning.push('Ministerio coincide con sus intereses expresados')
  }

  // Recent Activity (10% weight)
  // Calculate from pre-loaded volunteers.assignments data
  const recentAssignments = member.volunteers.reduce((total: number, volunteer: any) => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentCount = volunteer.volunteer_assignments.filter((a: any) => new Date(a.date) >= thirtyDaysAgo).length
    return total + recentCount
  }, 0)

  if (recentAssignments === 0) {
    score += 10
    reasoning.push('Disponible - sin asignaciones recientes')
  } else if (recentAssignments <= 2) {
    score += 7
    reasoning.push('Actividad moderada - disponible')
  } else {
    score += 3
    reasoning.push('Muy activo - posible sobrecarga')
  }

  return {
    score: Math.min(score, 100),
    reasoning
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Parse and validate request body
    const body = await request.json()
    
    // ✅ SECURITY FIX: Validate matching parameters with Zod
    // Prevents: Invalid ministry IDs, malicious maxRecommendations values
    const validated = volunteerMatchingSchema.parse(body)

    // ✅ PERFORMANCE FIX: Fetch ministry ONCE before loop (eliminates N+1)
    // BEFORE: 1 query × 500 members = 500 queries
    // AFTER: 1 query total
    const ministry = await prisma.ministries.findUnique({ 
      where: { id: validated.ministryId },
      select: { id: true, name: true }
    })

    if (!ministry) {
      return NextResponse.json(
        { error: 'Ministerio no encontrado' },
        { status: 404 }
      )
    }

    // ✅ PERFORMANCE FIX: Eager load ALL relations in single query
    // BEFORE: Member query + (availabilityMatrix × 500) + (assignments × 500) = 1,001+ queries
    // AFTER: 1 query with all includes
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const members = await prisma.members.findMany({
      where: {
        churchId: session.user.churchId,
        isActive: true,
      },
      include: {
        member_spiritual_profiles: true,
        volunteers: {
          include: {
            volunteer_assignments: {
              where: {
                date: { gte: thirtyDaysAgo } // Last 30 days (optimized with index)
              }
            }
          }
        },
        availability_matrices: true
      }
    })

    // ✅ PERFORMANCE FIX: Pure function - no more database queries in loop
    // Calculate scores for each member
    const recommendations = []
    for (const member of members) {
      const { score, reasoning } = calculateVolunteerScore(member, ministry, validated.ministryId)
      
      if (score > 20) { // Minimum threshold
        recommendations.push({
          memberId: member.id,
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          phone: member.phone,
          score,
          reasoning,
          spiritualGifts: member.spiritualGifts || [],
          experienceLevel: member.experienceLevel || 1,
          isCurrentVolunteer: member.volunteers.length > 0,
          currentAssignments: member.volunteers.reduce((total, v) => total + v.volunteer_assignments.length, 0)
        })
      }
    }

    // Sort by score (descending) and take top recommendations
    const topRecommendations = recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, validated.maxRecommendations)

    // Create recommendation records
    const createdRecommendations = await Promise.all(
      topRecommendations.map(async (rec) => {
        return prisma.volunteer_recommendations.create({
          data: {
            memberId: rec.memberId,
            ministryId: validated.ministryId,
            eventId: validated.eventId || null,
            recommendationType: 'AUTO_MATCH',
            matchScore: rec.score,
            reasoning: { reasons: rec.reasoning },
            priority: rec.score > 80 ? 'HIGH' : rec.score > 60 ? 'MEDIUM' : 'LOW',
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Valid for 7 days
          },
          include: {
            members: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            },
            ministry: {
              select: {
                name: true
              }
            }
          }
        })
      })
    )

    return NextResponse.json({
      success: true,
      recommendations: createdRecommendations,
      summary: {
        totalCandidates: members.length,
        qualifiedCandidates: recommendations.length,
        topRecommendations: topRecommendations.length
      }
    })
  } catch (error) {
    // ✅ SECURITY FIX: Handle validation errors with user-friendly messages
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: 'Datos inválidos',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      )
    }
    
    console.error('Error generating volunteer recommendations:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.churchId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const ministryId = searchParams.get('ministryId')
    const memberId = searchParams.get('memberId') // 🔍 Support for fetching recommendations for specific member
    const status = searchParams.get('status') || 'PENDING'

    console.log('🔍 [DEBUG] Volunteer-matching GET request params:', {
      ministryId,
      memberId,
      status,
      churchId: session.user.churchId
    })

    const where: any = {
      members: { churchId: session.user.churchId },
      status,
      validUntil: { gte: new Date() }
    }

    if (ministryId) {
      where.ministryId = ministryId
    }

    // 🎯 Add support for fetching recommendations for a specific member (for crown badge display)
    if (memberId) {
      where.memberId = memberId
      console.log('🔍 [DEBUG] Filtering by memberId:', memberId)
    }

    console.log('🔍 [DEBUG] Final where clause:', where)

    const recommendations = await prisma.volunteer_recommendations.findMany({
      where,
      include: {
        members: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        ministry: {
          select: {
            name: true
          }
        },
        events: {
          select: {
            title: true,
            startDate: true
          }
        }
      },
      orderBy: [
        { priority: 'asc' },
        { matchScore: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    console.log('🔍 [DEBUG] Found recommendations:', recommendations.length)
    console.log('🔍 [DEBUG] Recommendations data:', recommendations)

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    )
  }
}
