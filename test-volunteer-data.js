const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testVolunteerData() {
  try {
    console.log('🧪 Testing Volunteer Data...')
    
    const churchId = 'cmgu3bev8000078ltyfy89pil'
    
    // 1. Test basic volunteer counts
    const totalVolunteers = await prisma.volunteer.count({
      where: { member: { churchId } }
    })
    console.log('📊 Total volunteers:', totalVolunteers)
    
    const activeVolunteers = await prisma.volunteer.count({
      where: { 
        member: { churchId },
        isActive: true 
      }
    })
    console.log('✅ Active volunteers:', activeVolunteers)
    
    // 2. Test assignment counts
    const totalAssignments = await prisma.volunteerAssignment.count({
      where: { volunteer: { member: { churchId } } }
    })
    console.log('📋 Total assignments:', totalAssignments)
    
    const activeAssignments = await prisma.volunteerAssignment.count({
      where: { 
        volunteer: { member: { churchId } },
        date: { gte: new Date() }
      }
    })
    console.log('🔄 Active assignments (future):', activeAssignments)
    
    // 3. Test ministry distribution
    const volunteersWithMinistries = await prisma.volunteer.groupBy({
      by: ['ministryId'],
      where: { 
        member: { churchId },
        isActive: true,
        ministryId: { not: null }
      },
      _count: true
    })
    console.log('⛪ Volunteers by ministry:', volunteersWithMinistries)
    
    // 4. Test recruitment pipeline data
    const newVolunteersThisMonth = await prisma.volunteer.count({
      where: {
        member: { churchId },
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    })
    console.log('🆕 New volunteers this month:', newVolunteersThisMonth)
    
    // 5. Sample some volunteers
    const sampleVolunteers = await prisma.volunteer.findMany({
      where: { member: { churchId } },
      take: 3,
      include: {
        member: { select: { firstName: true, lastName: true } },
        ministry: { select: { name: true } },
        assignments: { take: 1 }
      }
    })
    console.log('📋 Sample volunteers:')
    sampleVolunteers.forEach((v, i) => {
      console.log(`  ${i+1}. ${v.member?.firstName} ${v.member?.lastName}`)
      console.log(`     Ministry: ${v.ministry?.name || 'None'}`)
      console.log(`     Assignments: ${v.assignments.length}`)
      console.log(`     Active: ${v.isActive}`)
    })
    
    // 6. Test spiritual profiles for recommendations
    const volunteersWithProfiles = await prisma.volunteer.findMany({
      where: { 
        member: { 
          churchId,
          spiritualProfile: { isNot: null }
        }
      },
      take: 3,
      include: {
        member: {
          select: {
            firstName: true,
            lastName: true,
            spiritualProfile: {
              select: {
                primaryGifts: true,
                secondaryGifts: true,
                ministryPassions: true
              }
            }
          }
        }
      }
    })
    console.log('🎁 Volunteers with spiritual profiles:', volunteersWithProfiles.length)
    
    // 7. Test leadership development data
    const potentialLeaders = await prisma.volunteer.count({
      where: {
        member: { 
          churchId,
          leadershipReadiness: { gt: 70 }
        },
        isActive: true
      }
    })
    console.log('👑 Potential leaders (readiness > 70):', potentialLeaders)
    
    console.log('\n✅ Volunteer data analysis complete!')
    
  } catch (error) {
    console.error('💥 Error testing volunteer data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testVolunteerData()