const { PrismaClient } = require('@prisma/client')

async function checkTotalCount() {
  const prisma = new PrismaClient()
  
  try {
    // Total members (all statuses, all churches)
    const totalAll = await prisma.members.count()
    console.log('Total members (all churches, all statuses):', totalAll)
    
    // Total active members (all churches)
    const totalActiveAll = await prisma.members.count({
      where: { isActive: true }
    })
    console.log('Total active members (all churches):', totalActiveAll)
    
    // Total members (all statuses, single church - need church ID)
    // Let's find the church ID first
    const churches = await prisma.church.findMany({
      select: { id: true, name: true }
    })
    
    console.log('\nChurches in database:')
    churches.forEach(c => console.log(`${c.id}: ${c.name}`))
    
    if (churches.length > 0) {
      const churchId = churches[0].id
      console.log(`\nUsing church ID: ${churchId}`)
      
      const totalChurch = await prisma.members.count({
        where: { churchId }
      })
      console.log(`Total members for this church (all statuses): ${totalChurch}`)
      
      const totalChurchActive = await prisma.members.count({
        where: { churchId, isActive: true }
      })
      console.log(`Total active members for this church: ${totalChurchActive}`)
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkTotalCount()
