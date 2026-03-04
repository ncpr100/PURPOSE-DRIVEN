const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testVisitorData() {
  try {
    console.log('🔍 Testing visitor data...')
    
    const churchId = 'cmgu3bev8000078ltyfy89pil'
    
    // Check total check-ins
    const totalCheckIns = await prisma.checkIn.count({
      where: { churchId }
    })
    console.log('📊 Total check-ins:', totalCheckIns)
    
    // Check first-time visitors
    const firstTimeVisitors = await prisma.checkIn.count({
      where: { 
        churchId,
        isFirstTime: true 
      }
    })
    console.log('👋 First-time visitors:', firstTimeVisitors)
    
    // Check first-time visitors this month
    const thisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const firstTimeThisMonth = await prisma.checkIn.count({
      where: {
        churchId,
        isFirstTime: true,
        checkedInAt: { gte: thisMonth }
      }
    })
    console.log('📅 First-time visitors this month:', firstTimeThisMonth)
    
    // Check today's check-ins
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))
    
    const todayCheckIns = await prisma.checkIn.count({
      where: {
        churchId,
        checkedInAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    })
    console.log('📅 Today\'s check-ins:', todayCheckIns)
    
    // Sample some check-ins
    const sampleCheckIns = await prisma.checkIn.findMany({
      where: { churchId },
      take: 5,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        isFirstTime: true,
        checkedInAt: true,
        engagementScore: true
      }
    })
    console.log('📋 Sample check-ins:', sampleCheckIns)
    
    // Check visitor follow-ups
    const pendingFollowUps = await prisma.visitorFollowUp.count({
      where: {
        churchId,
        status: 'PENDIENTE'
      }
    })
    console.log('📞 Pending follow-ups:', pendingFollowUps)
    
    const completedFollowUps = await prisma.visitorFollowUp.count({
      where: {
        churchId,
        status: 'COMPLETADO',
        completedAt: { gte: thisMonth }
      }
    })
    console.log('✅ Completed follow-ups this month:', completedFollowUps)
    
  } catch (error) {
    console.error('💥 Error testing visitor data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testVisitorData()