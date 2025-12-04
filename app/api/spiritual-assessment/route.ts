import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for spiritual assessment data
const spiritualAssessmentSchema = z.object({
  memberId: z.string().optional(),
  giftSelections: z.array(z.object({
    subcategoryId: z.string(),
    type: z.enum(['primary', 'secondary'])
  })),
  ministryPassions: z.array(z.string()),
  experienceLevel: z.enum(['NOVATO', 'INTERMEDIO', 'AVANZADO']),
  spiritualCalling: z.string().optional(),
  motivation: z.string().optional(),
  completedAt: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = spiritualAssessmentSchema.parse(body)

    // Use provided memberId or current user's member record
    const targetMemberId = validatedData.memberId || session.user.id

    // Find the member record
    const member = await prisma.members.findUnique({
      where: { id: targetMemberId }
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Miembro no encontrado' },
        { status: 404 }
      )
    }

    // Prepare the structured data for database
    const spiritualGiftsStructured = {
      giftSelections: validatedData.giftSelections,
      ministryPassions: validatedData.ministryPassions,
      spiritualCalling: validatedData.spiritualCalling,
      motivation: validatedData.motivation,
      completedAt: validatedData.completedAt || new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }

    // Update member record with spiritual assessment data
    const updatedMember = await prisma.members.update({
      where: { id: targetMemberId },
      data: {
        spiritualGiftsStructured: spiritualGiftsStructured,
        experienceLevelEnum: validatedData.experienceLevel,
        updatedAt: new Date()
      }
    })

    console.log(`✅ Spiritual assessment saved for member: ${targetMemberId}`)

    return NextResponse.json({
      success: true,
      message: 'Evaluación espiritual guardada exitosamente',
      data: {
        memberId: updatedMember.id,
        assessmentCompleted: true,
        giftCount: validatedData.giftSelections.length,
        passionCount: validatedData.ministryPassions.length,
        experienceLevel: validatedData.experienceLevel
      }
    })

  } catch (error) {
    console.error('Error saving spiritual assessment:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Datos de evaluación inválidos',
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId') || session.user.id

    const member = await prisma.members.findUnique({
      where: { id: memberId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        spiritualGiftsStructured: true,
        experienceLevelEnum: true,
        updatedAt: true
      }
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Miembro no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        memberId: member.id,
        memberName: `${member.firstName} ${member.lastName}`,
        assessmentData: member.spiritualGiftsStructured,
        experienceLevel: member.experienceLevelEnum,
        lastUpdated: member.updatedAt
      }
    })

  } catch (error) {
    console.error('Error retrieving spiritual assessment:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}