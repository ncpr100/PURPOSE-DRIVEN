
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('🔵 POST /api/availability-matrix called')
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      console.log('❌ Unauthorized - No session')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ Session valid:', session.user.email)

    const body = await request.json()
    console.log('📥 Request body:', body)
    
    const {
      memberId,
      recurringAvailability,
      blackoutDates,
      preferredMinistries,
      maxCommitmentsPerMonth,
      preferredTimeSlots,
      travelWillingness
    } = body

    console.log('🔄 Upserting availability matrix for member:', memberId)

    const matrix = await prisma.availabilityMatrix.upsert({
      where: { memberId },
      update: {
        recurringAvailability: recurringAvailability || {},
        blackoutDates: blackoutDates || [],
        preferredMinistries: preferredMinistries || [],
        maxCommitmentsPerMonth: maxCommitmentsPerMonth || 4,
        preferredTimeSlots: preferredTimeSlots || [],
        travelWillingness: travelWillingness || 1,
        lastUpdated: new Date(),
      },
      create: {
        memberId,
        recurringAvailability: recurringAvailability || {},
        blackoutDates: blackoutDates || [],
        preferredMinistries: preferredMinistries || [],
        maxCommitmentsPerMonth: maxCommitmentsPerMonth || 4,
        preferredTimeSlots: preferredTimeSlots || [],
        travelWillingness: travelWillingness || 1,
      },
      include: {
        member: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    console.log('✅ Matrix saved:', matrix.id)

    // Update member's availability score
    const availabilityScore = calculateAvailabilityScore(matrix)
    console.log('📊 Calculated availability score:', availabilityScore)
    
    await prisma.members.update({
      where: { id: memberId },
      data: { availabilityScore }
    })

    console.log('✅ Member availability score updated')

    return NextResponse.json({
      success: true,
      matrix,
      availabilityScore,
      message: 'Matriz de disponibilidad actualizada exitosamente'
    })
  } catch (error) {
    console.error('❌ Error updating availability matrix:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')

    if (!memberId) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 })
    }

    const matrix = await prisma.availabilityMatrix.findUnique({
      where: { memberId },
      include: {
        member: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ matrix })
  } catch (error) {
    console.error('Error fetching availability matrix:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    )
  }
}

// Helper function to calculate availability score
function calculateAvailabilityScore(matrix: any): number {
  let score = 0

  // Base score for having availability data
  score += 20

  // Score based on recurring availability
  const availability = matrix.recurringAvailability || {}
  const availableDays = Object.keys(availability).length
  score += Math.min(availableDays * 10, 50)

  // Score based on time flexibility
  const timeSlots = matrix.preferredTimeSlots || []
  if (timeSlots.length >= 3) {
    score += 20
  } else if (timeSlots.length >= 2) {
    score += 15
  } else if (timeSlots.length >= 1) {
    score += 10
  }

  // Score based on travel willingness
  score += Math.min((matrix.travelWillingness || 1) * 2, 10)

  return Math.min(score, 100)
}
