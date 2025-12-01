const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testSmartListCounts() {
  try {
    console.log('🧪 Testing Smart List Count Calculations...')
    
    const churchId = 'cmgu3bev8000078ltyfy89pil' // Test church ID
    
    // Fetch members data like the frontend would
    const members = await prisma.member.findMany({
      where: { churchId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        membershipDate: true,
        createdAt: true,
        updatedAt: true,
        isActive: true,
        birthDate: true,
        ministryId: true,
        spiritualGifts: true,
        notes: true,
        leadershipReadiness: true,
        baptismDate: true
      }
    })
    
    console.log(`📊 Total members found: ${members.length}`)
    
    // Calculate counts using the same logic as our frontend
    const counts = {
      'new-members': 0,
      'inactive-members': 0,
      'leadership-ready': 0,
      'birthdays': 0,
      'anniversaries': 0,
      'ministry-leaders': 0,
      'visitors-becoming-members': 0,
      'prayer-needed': 0
    }

    members.forEach(member => {
      // New members (30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      if (new Date(member.membershipDate || member.createdAt) >= thirtyDaysAgo) {
        counts['new-members']++
      }

      // Inactive members
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      if (!member.isActive || new Date(member.updatedAt) <= sixMonthsAgo) {
        counts['inactive-members']++
      }

      // Birthday this month
      if (member.birthDate) {
        const currentMonth = new Date().getMonth()
        if (new Date(member.birthDate).getMonth() === currentMonth) {
          counts['birthdays']++
        }
      }

      // Membership anniversary this month
      if (member.membershipDate) {
        const currentMonth = new Date().getMonth()
        if (new Date(member.membershipDate).getMonth() === currentMonth) {
          counts['anniversaries']++
        }
      }

      // Ministry leaders
      if (member.ministryId || (member.spiritualGifts && Array.isArray(member.spiritualGifts) && member.spiritualGifts.length > 0)) {
        counts['ministry-leaders']++
      }

      // Visitors becoming members (last 90 days)
      const ninetyDaysAgo = new Date()
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
      if (member.membershipDate && new Date(member.membershipDate) >= ninetyDaysAgo && !member.baptismDate) {
        counts['visitors-becoming-members']++
      }

      // Prayer needed
      if (member.notes && member.notes.toLowerCase().includes('oración')) {
        counts['prayer-needed']++
      }

      // Leadership ready
      if (member.isActive && member.leadershipReadiness && member.leadershipReadiness > 70) {
        counts['leadership-ready']++
      }
    })

    console.log('\n📈 Smart List Counts:')
    console.log('🆕 Nuevos Miembros (30d):', counts['new-members'])
    console.log('😴 Miembros Inactivos:', counts['inactive-members'])
    console.log('⭐ Líderes de Ministerio:', counts['ministry-leaders'])
    console.log('👑 Listos para Liderazgo:', counts['leadership-ready'])
    console.log('🎂 Cumpleaños este Mes:', counts['birthdays'])
    console.log('🎉 Aniversarios de Membresía:', counts['anniversaries'])
    console.log('🔄 Visitantes → Miembros:', counts['visitors-becoming-members'])
    console.log('🙏 Necesitan Oración:', counts['prayer-needed'])
    
    const totalCounted = Object.values(counts).reduce((sum, count) => sum + count, 0)
    console.log(`\n✅ Calculation successful! Found ${totalCounted} categorized members from ${members.length} total.`)
    
  } catch (error) {
    console.error('❌ Error testing counts:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testSmartListCounts()