import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// DIAGNOSTIC ENDPOINT - Check Juan's data in production
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !['SUPER_ADMIN', 'ADMIN_IGLESIA'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Find all members with Juan in name
    const juanMembers = await prisma.member.findMany({
      where: {
        OR: [
          { firstName: { contains: 'Juan', mode: 'insensitive' } },
          { firstName: { contains: 'JUAN', mode: 'insensitive' } }
        ]
      },
      include: {
        spiritualProfile: true
      }
    })

    // Find all spiritual profiles
    const allProfiles = await prisma.memberSpiritualProfile.findMany({
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    // Find volunteers with Juan in name
    const juanVolunteers = await prisma.volunteer.findMany({
      where: {
        OR: [
          { id: { in: juanMembers.map(m => m.id) } }
        ]
      },
      select: {
        id: true
      }
    })

    return NextResponse.json({
      juanMembers: juanMembers.map(m => ({
        id: m.id,
        firstName: m.firstName,
        lastName: m.lastName,
        email: m.email,
        hasOldSystem: !!m.spiritualGiftsStructured,
        hasNewSystem: !!m.spiritualProfile,
        spiritualProfileId: m.spiritualProfile?.id,
        primaryGiftsCount: Array.isArray(m.spiritualProfile?.primaryGifts) ? m.spiritualProfile.primaryGifts.length : 0
      })),
      allSpiritualProfiles: allProfiles.map(p => ({
        id: p.id,
        memberId: p.memberId,
        memberName: `${p.member.firstName} ${p.member.lastName}`,
        memberEmail: p.member.email,
        primaryGiftsCount: Array.isArray(p.primaryGifts) ? p.primaryGifts.length : 0,
        secondaryGiftsCount: Array.isArray(p.secondaryGifts) ? p.secondaryGifts.length : 0,
        ministryPassionsCount: Array.isArray(p.ministryPassions) ? p.ministryPassions.length : 0,
        readinessScore: p.volunteerReadinessScore
      })),
      juanVolunteers
    })

  } catch (error) {
    console.error('Error checking Juan data:', error)
    return NextResponse.json({ 
      error: 'Failed to check data', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}
