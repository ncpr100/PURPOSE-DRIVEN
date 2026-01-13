import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// ADMIN-ONLY ENDPOINT - Fix orphaned spiritual profile
export async function POST(request: NextRequest) {
  try {
    // Dynamic import to avoid build-time Prisma initialization
    const { prisma } = await import('@/lib/prisma')
    
    const session = await getServerSession(authOptions)
    
    // Only allow SUPER_ADMIN or ADMIN_IGLESIA to run this fix
    if (!session?.user || !['SUPER_ADMIN', 'ADMIN_IGLESIA'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
    }

    console.log('🔧 Starting spiritual profile fix...')

    // Find JUAN PACHANGA spiritual profile
    const orphanedProfile = await prisma.member_spiritual_profiles.findFirst({
      where: {
        members: {
          OR: [
            { firstName: { contains: 'JUAN', mode: 'insensitive' }, lastName: { contains: 'PACHANGA', mode: 'insensitive' } },
          ]
        }
      },
      include: {
        members: true
      }
    })

    if (!orphanedProfile) {
      return NextResponse.json({ 
        success: false, 
        message: 'No orphaned spiritual profile found for JUAN PACHANGA' 
      })
    }

    console.log('✅ Found orphaned profile:', orphanedProfile.id)
    console.log('   Current member:', orphanedProfile.members.firstName, orphanedProfile.members.lastName)

    // Find Juan Herrera (the target member)
    const juanHerrera = await prisma.members.findFirst({
      where: {
        firstName: { contains: 'Juan', mode: 'insensitive' },
        lastName: { contains: 'Herrera', mode: 'insensitive' },
        email: { contains: 'juan.herrera.2029', mode: 'insensitive' }
      }
    })

    if (!juanHerrera) {
      return NextResponse.json({ 
        success: false, 
        message: 'Juan Herrera not found in database' 
      })
    }

    console.log('✅ Found Juan Herrera:', juanHerrera.id)

    // Check if Juan Herrera already has a profile
    const existingProfile = await prisma.member_spiritual_profiles.findUnique({
      where: { memberId: juanHerrera.id }
    })

    if (existingProfile && existingProfile.id !== orphanedProfile.id) {
      console.log('⚠️ Juan Herrera already has a different spiritual profile, deleting it...')
      await prisma.member_spiritual_profiles.delete({
        where: { memberId: juanHerrera.id }
      })
    }

    // Update the orphaned profile to point to Juan Herrera
    const updatedProfile = await prisma.member_spiritual_profiles.update({
      where: { id: orphanedProfile.id },
      data: { memberId: juanHerrera.id }
    })

    console.log('✅ Spiritual profile linked to Juan Herrera!')

    // Verify the fix
    const verification = await prisma.members.findUnique({
      where: { id: juanHerrera.id },
      include: { member_spiritual_profiles: true }
    })

    return NextResponse.json({
      success: true,
      message: 'Spiritual profile successfully linked to Juan Herrera',
      data: {
        members: {
          id: verification?.id,
          name: `${verification?.firstName} ${verification?.lastName}`,
          email: verification?.email
        },
        member_spiritual_profiles: {
          id: verification?.member_spiritual_profiles?.id,
          primaryGiftsCount: Array.isArray(verification?.member_spiritual_profiles?.primaryGifts) 
            ? verification?.member_spiritual_profiles?.primaryGifts.length : 0,
          secondaryGiftsCount: Array.isArray(verification?.member_spiritual_profiles?.secondaryGifts) 
            ? verification?.member_spiritual_profiles?.secondaryGifts.length : 0,
          ministryPassionsCount: Array.isArray(verification?.member_spiritual_profiles?.ministryPassions) 
            ? verification?.member_spiritual_profiles?.ministryPassions.length : 0,
          readinessScore: verification?.member_spiritual_profiles?.volunteerReadinessScore
        }
      }
    })

  } catch (error) {
    console.error('❌ Error fixing spiritual profile:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error fixing spiritual profile', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    )
  }
}
