import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const memberId = params.id

    // Get spiritual profile
    const spiritualProfile = await prisma.memberSpiritualProfile.findUnique({
      where: { memberId }
    })

    if (!spiritualProfile) {
      return NextResponse.json({ profile: null })
    }

    return NextResponse.json({ profile: spiritualProfile })
  } catch (error) {
    console.error('Error fetching spiritual profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const memberId = params.id
    const body = await request.json()

    const {
      giftSelections,
      ministryPassions,
      experienceLevel,
      spiritualCalling,
      motivation
    } = body

    // Validate required fields
    if (!giftSelections || giftSelections.length === 0) {
      return NextResponse.json(
        { error: 'Debes seleccionar al menos un don espiritual' },
        { status: 400 }
      )
    }

    if (!ministryPassions || ministryPassions.length === 0) {
      return NextResponse.json(
        { error: 'Debes seleccionar al menos una pasión ministerial' },
        { status: 400 }
      )
    }

    if (!experienceLevel) {
      return NextResponse.json(
        { error: 'Debes seleccionar tu nivel de experiencia' },
        { status: 400 }
      )
    }

    if (!spiritualCalling || !spiritualCalling.trim()) {
      return NextResponse.json(
        { error: 'Debes describir tu llamado espiritual' },
        { status: 400 }
      )
    }

    if (!motivation || !motivation.trim()) {
      return NextResponse.json(
        { error: 'Debes describir tu motivación para servir' },
        { status: 400 }
      )
    }

    // Verify member exists
    const member = await prisma.member.findUnique({
      where: { id: memberId }
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Miembro no encontrado' },
        { status: 404 }
      )
    }

    // Extract primary and secondary gifts
    const primaryGifts = giftSelections
      .filter((g: any) => g.type === 'primary')
      .map((g: any) => g.subcategoryId)
    
    const secondaryGifts = giftSelections
      .filter((g: any) => g.type === 'secondary')
      .map((g: any) => g.subcategoryId)

    // Map experience level to numeric scale (1-10)
    const experienceLevelMap: Record<string, number> = {
      'NOVATO': 3,
      'INTERMEDIO': 6,
      'AVANZADO': 9
    }
    const experienceLevelNumeric = experienceLevelMap[experienceLevel] || 5

    // Calculate readiness scores based on assessment
    const volunteerReadinessScore = Math.min(100, Math.round(
      (primaryGifts.length * 15) + 
      (secondaryGifts.length * 5) +
      (ministryPassions.length * 10) +
      (experienceLevelNumeric * 5)
    ))

    // Upsert spiritual profile
    const spiritualProfile = await prisma.memberSpiritualProfile.upsert({
      where: { memberId },
      create: {
        memberId,
        primaryGifts,
        secondaryGifts,
        spiritualCalling,
        ministryPassions,
        experienceLevel: experienceLevelNumeric,
        leadershipScore: 5,
        servingMotivation: motivation,
        volunteerReadinessScore,
        leadershipReadinessScore: Math.round(volunteerReadinessScore * 0.7),
        assessmentDate: new Date()
      },
      update: {
        primaryGifts,
        secondaryGifts,
        spiritualCalling,
        ministryPassions,
        experienceLevel: experienceLevelNumeric,
        servingMotivation: motivation,
        volunteerReadinessScore,
        leadershipReadinessScore: Math.round(volunteerReadinessScore * 0.7),
        assessmentDate: new Date(),
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      profile: spiritualProfile,
      message: 'Evaluación espiritual guardada exitosamente'
    })
  } catch (error) {
    console.error('Error saving spiritual profile:', error)
    return NextResponse.json(
      { error: 'Error al guardar la evaluación espiritual' },
      { status: 500 }
    )
  }
}
