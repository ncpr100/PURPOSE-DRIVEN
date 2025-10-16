
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { spiritualProfileSchema } from '@/lib/validations/volunteer'
import { ZodError } from 'zod'

export async function POST(request: NextRequest) {
  try {
    console.log('=== Spiritual Profile API Called ===')
    const session = await getServerSession(authOptions)
    console.log('Session:', session?.user ? `${session.user.email} (${session.user.role})` : 'NO SESSION')
    
    if (!session?.user) {
      console.log('❌ REJECTED: No session/user found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!['SUPER_ADMIN', 'ADMIN_IGLESIA', 'PASTOR', 'LIDER'].includes(session.user.role)) {
      console.log('❌ REJECTED: Insufficient role. User role:', session.user.role)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    console.log('✅ AUTHORIZED: Proceeding with request')

    const requestBody = await request.json()
    console.log('📝 Request payload:', requestBody)
    
    // ✅ SECURITY FIX: Validate all spiritual profile data with Zod
    // Prevents: Malformed JSON, oversized payloads, invalid gift IDs, data corruption
    const validated = spiritualProfileSchema.parse(requestBody)
    console.log('✅ VALIDATION PASSED: Input validated successfully')

    // ✅ DATA INTEGRITY FIX: Wrap both operations in a transaction
    // BEFORE: Dual-write pattern - MemberSpiritualProfile succeeds but Member update fails = data inconsistency
    // AFTER: Both operations succeed together or both fail together (atomic operation)
    // This fixes CRITICAL-003: Race condition in dual-write pattern
    console.log('🔄 TRANSACTION START: About to execute atomic operation for member:', validated.memberId)
    
    const result = await prisma.$transaction(async (tx) => {
      console.log('🔄 TRANSACTION: Step 1 - Upsert spiritual profile...')
      
      // Step 1: Create or update spiritual profile
      const profile = await tx.memberSpiritualProfile.upsert({
        where: { memberId: validated.memberId },
        update: {
          primaryGifts: validated.primaryGifts,
          secondaryGifts: validated.secondaryGifts,
          spiritualCalling: validated.spiritualCalling,
          ministryPassions: validated.ministryPassions,
          experienceLevel: validated.experienceLevel,
          leadershipScore: validated.leadershipScore || 1,
          servingMotivation: validated.servingMotivation,
          previousExperience: validated.previousExperience,
          trainingCompleted: validated.trainingCompleted,
          assessmentDate: new Date(),
        },
        create: {
          memberId: validated.memberId,
          primaryGifts: validated.primaryGifts,
          secondaryGifts: validated.secondaryGifts,
          spiritualCalling: validated.spiritualCalling,
          ministryPassions: validated.ministryPassions,
          experienceLevel: validated.experienceLevel,
          leadershipScore: validated.leadershipScore || 1,
          servingMotivation: validated.servingMotivation,
          previousExperience: validated.previousExperience,
          trainingCompleted: validated.trainingCompleted,
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
      
      console.log('✅ TRANSACTION: Step 1 complete - Profile ID:', profile.id)
      console.log('� TRANSACTION: Step 2 - Update member table...')
      
      // Step 2: Update corresponding fields in Member table
      const updatedMember = await tx.member.update({
        where: { id: validated.memberId },
        data: {
          spiritualGifts: validated.primaryGifts,
          secondaryGifts: validated.secondaryGifts,
          spiritualCalling: validated.spiritualCalling,
          ministryPassion: validated.ministryPassions,
          experienceLevel: validated.experienceLevel,
          leadershipReadiness: validated.leadershipScore || 1,
        }
      })
      
      console.log('✅ TRANSACTION: Step 2 complete - Member updated:', {
        id: updatedMember.id,
        name: `${updatedMember.firstName} ${updatedMember.lastName}`,
        giftsCount: updatedMember.spiritualGifts ? (updatedMember.spiritualGifts as any[]).length : 0
      })
      
      return { profile, member: updatedMember }
    })
    
    console.log('✅ TRANSACTION COMPLETE: Both operations succeeded atomically')
    console.log('💾 Profile ID:', result.profile.id, '| Member ID:', result.member.id)

    const response = {
      success: true,
      profile: result.profile,
      member: {
        id: result.member.id,
        firstName: result.member.firstName,
        lastName: result.member.lastName,
        spiritualGiftsCount: result.member.spiritualGifts ? (result.member.spiritualGifts as any[]).length : 0
      },
      message: 'Perfil espiritual actualizado exitosamente',
      refreshMetrics: true
    }

    console.log('📤 Final API response:', response)
    console.log('✅ SUCCESS: Spiritual profile and member data saved atomically')
    return NextResponse.json(response)
  } catch (error: any) {
    // ✅ SECURITY FIX: Handle validation errors with user-friendly messages
    if (error instanceof ZodError) {
      console.error('❌ VALIDATION ERROR:', error.errors)
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
    
    console.error('❌ MAJOR ERROR in spiritual profile API:', error)
    console.error('❌ Error stack:', error?.stack)
    console.error('❌ Error details:', {
      message: error?.message,
      name: error?.name,
      code: error?.code
    })
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
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

    const profile = await prisma.memberSpiritualProfile.findUnique({
      where: { memberId },
      include: {
        member: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            ministryId: true,
            ministry: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error fetching spiritual profile:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    )
  }
}
