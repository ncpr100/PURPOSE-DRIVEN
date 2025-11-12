const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testMembersData() {
  try {
    console.log('🔍 Testing members data...')
    
    // Check total members count
    const totalMembers = await prisma.member.count()
    console.log('📊 Total members in database:', totalMembers)
    
    // Check active members count
    const activeMembers = await prisma.member.count({
      where: { isActive: true }
    })
    console.log('📊 Active members:', activeMembers)
    
    // Check members for specific church (Iglesia Comunidad de Fe)
    const churchMembers = await prisma.member.count({
      where: { 
        churchId: 'cmgu3bev8000078ltyfy89pil',
        isActive: true 
      }
    })
    console.log('📊 Iglesia Comunidad de Fe active members:', churchMembers)
    
    // Get sample member data
    const sampleMember = await prisma.member.findFirst({
      where: { 
        churchId: 'cmgu3bev8000078ltyfy89pil',
        isActive: true 
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
        churchId: true
      }
    })
    console.log('📋 Sample member:', sampleMember)
    
    // Check users table for authentication
    const users = await prisma.user.findMany({
      where: { churchId: 'cmgu3bev8000078ltyfy89pil' },
      select: {
        id: true,
        email: true,
        role: true,
        churchId: true
      }
    })
    console.log('👥 Users for this church:', users)
    
  } catch (error) {
    console.error('💥 Error testing members data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testMembersData()