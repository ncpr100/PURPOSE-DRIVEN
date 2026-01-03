const { PrismaClient } = require('@prisma/client')

async function checkTotalCount() {
  const prisma = new PrismaClient()

  try {
    // Total members (all statuses, all churches)
    const totalAll = await prisma.member.count()
    console.log('Total members (all churches, all statuses):', totalAll)

    // Total active members (all churches)
    const totalActiveAll = await prisma.member.count({
      where: { isActive: true }
    })
    console.log('Total active members (all churches):', totalActiveAll)

    // Get church info
    const churches = await prisma.church.findMany({
      select: { id: true, name: true }
    })

    console.log('\nChurches in database:')
    churches.forEach(c => console.log(`${c.id}: ${c.name}`))

    if (churches.length > 0) {
      const churchId = churches[0].id
      console.log(`\nUsing church ID: ${churchId}`)

      const totalChurch = await prisma.member.count({
        where: { churchId }
      })
      console.log(`Total members for this church (all statuses): ${totalChurch}`)

      const totalChurchActive = await prisma.member.count({
        where: { churchId, isActive: true }
      })
      console.log(`Total active members for this church: ${totalChurchActive}`)

      // Check gender distribution for this church
      const genderCounts = await prisma.member.groupBy({
        by: ['gender'],
        where: { churchId, isActive: true },
        _count: { gender: true }
      })
      
      console.log('\nGender distribution (active members):')
      genderCounts.forEach(g => console.log(`${g.gender || 'null'}: ${g._count.gender}`))
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkTotalCount()
