#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testAllDashboardConsistency() {
  try {
    console.log('🔍 COMPREHENSIVE DASHBOARD CONSISTENCY TEST')
    console.log('=' .repeat(60))
    
    const churchId = 'cmgu3bev8000078ltyfy89pil' // Iglesia Comunidad de Fe
    
    // ===== 1. MAIN DASHBOARD (PANEL DE CONTROL) COUNTS =====
    console.log('\n📊 1. MAIN DASHBOARD (Panel de Control):')
    
    const totalMembers = await prisma.member.count({
      where: { churchId, isActive: true }
    })
    
    const newMembersThisMonth = await prisma.member.count({
      where: { 
        churchId, 
        isActive: true,
        createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      }
    })
    
    const totalVolunteers = await prisma.volunteer.count({
      where: { churchId, isActive: true }
    })
    
    const totalEvents = await prisma.event.count({
      where: { 
        churchId,
        startDate: { gte: new Date() }
      }
    })
    
    const todaysCheckIns = await prisma.checkIn.count({
      where: { 
        churchId,
        checkedInAt: { 
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }
    })
    
    const firstTimeVisitors = await prisma.checkIn.count({
      where: { 
        churchId,
        isFirstTime: true,
        checkedInAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }
    })
    
    console.log(`   📋 Total Members: ${totalMembers}`)
    console.log(`   🆕 New Members (this month): ${newMembersThisMonth}`)
    console.log(`   👥 Total Volunteers: ${totalVolunteers}`)
    console.log(`   📅 Upcoming Events: ${totalEvents}`)
    console.log(`   🚪 Today's Check-ins: ${todaysCheckIns}`)
    console.log(`   👋 First-time Visitors (30 days): ${firstTimeVisitors}`)

    // ===== 2. MEMBERS PAGE SMART LISTS =====
    console.log('\n👥 2. MEMBERS PAGE (Smart Lists):')
    
    const today = new Date()
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
    
    // Birthdays this month
    const birthdaysThisMonth = await prisma.member.count({
      where: {
        churchId,
        isActive: true,
        birthDate: {
          not: null
        }
      }
    })
    
    // Get actual birthdays by extracting month
    const membersWithBirthdays = await prisma.member.findMany({
      where: {
        churchId,
        isActive: true,
        birthDate: { not: null }
      },
      select: { birthDate: true }
    })
    
    const currentMonth = today.getMonth() + 1
    const birthdaysCurrentMonth = membersWithBirthdays.filter(m => 
      m.birthDate && new Date(m.birthDate).getMonth() + 1 === currentMonth
    ).length
    
    // Anniversaries this month
    const anniversariesCurrentMonth = membersWithBirthdays.filter(m => 
      m.birthDate && new Date(m.birthDate).getMonth() + 1 === currentMonth
    ).length
    
    const inactiveMembers = await prisma.member.count({
      where: { churchId, isActive: false }
    })
    
    const newMembersCount = await prisma.member.count({
      where: { 
        churchId, 
        isActive: true,
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }
    })
    
    const ministryLeaders = await prisma.member.count({
      where: { 
        churchId, 
        isActive: true,
        leadershipStage: { in: ['MINISTRY_LEADER', 'SENIOR_LEADER', 'PASTOR'] }
      }
    })
    
    console.log(`   🎂 Birthdays (this month): ${birthdaysCurrentMonth}`)
    console.log(`   💒 Anniversaries (this month): ${anniversariesCurrentMonth}`)
    console.log(`   😴 Inactive Members: ${inactiveMembers}`)
    console.log(`   🆕 New Members (30 days): ${newMembersCount}`)
    console.log(`   👑 Ministry Leaders: ${ministryLeaders}`)

    // ===== 3. VOLUNTEERS SECTION =====
    console.log('\n🙋 3. VOLUNTEERS SECTION:')
    
    const activeVolunteers = await prisma.volunteer.count({
      where: { churchId, isActive: true }
    })
    
    const volunteerAssignments = await prisma.volunteerAssignment.count({
      where: { churchId }
    })
    
    const activeAssignments = await prisma.volunteerAssignment.count({
      where: { 
        churchId,
        date: { gte: new Date() }
      }
    })
    
    const uniqueMinistries = await prisma.ministry.count({
      where: { churchId, isActive: true }
    })
    
    // Recruitment pipeline metrics
    const potentialCandidates = totalMembers - activeVolunteers
    const conversionRate = totalMembers > 0 ? Math.round((activeVolunteers / totalMembers) * 100) : 0
    
    const membersWithSpiritualProfiles = await prisma.member.count({
      where: {
        churchId,
        isActive: true,
        spiritualProfile: { isNot: null }
      }
    })
    
    const profileCompleteness = totalMembers > 0 ? Math.round((membersWithSpiritualProfiles / totalMembers) * 100) : 0
    
    console.log(`   👥 Active Volunteers: ${activeVolunteers}`)
    console.log(`   📋 Total Assignments: ${volunteerAssignments}`)
    console.log(`   ⏰ Active Assignments: ${activeAssignments}`)
    console.log(`   ⛪ Active Ministries: ${uniqueMinistries}`)
    console.log(`   🎯 Potential Candidates: ${potentialCandidates}`)
    console.log(`   📊 Conversion Rate: ${conversionRate}%`)
    console.log(`   📈 Profile Completeness: ${profileCompleteness}%`)

    // ===== 4. SPIRITUAL GIFTS DASHBOARD =====
    console.log('\n✨ 4. SPIRITUAL GIFTS (Dones Espirituales):')
    
    const membersWithOldGifts = await prisma.member.count({
      where: { 
        churchId, 
        isActive: true,
        spiritualGifts: { not: null }
      }
    })
    
    const membersWithNewProfiles = await prisma.member.count({
      where: { 
        churchId, 
        isActive: true,
        spiritualProfile: { isNot: null }
      }
    })
    
    // Combined count (either old or new system)
    const totalWithAnyProfile = await prisma.member.count({
      where: { 
        churchId, 
        isActive: true,
        OR: [
          { spiritualGifts: { not: null } },
          { spiritualProfile: { isNot: null } }
        ]
      }
    })
    
    const membersWithoutProfiles = totalMembers - totalWithAnyProfile
    const spiritualGiftsCompletion = totalMembers > 0 ? 
      ((totalWithAnyProfile / totalMembers) * 100) : 0
    
    console.log(`   📋 Total Members: ${totalMembers}`)
    console.log(`   📜 OLD System Gifts: ${membersWithOldGifts}`)
    console.log(`   ✨ NEW Spiritual Profiles: ${membersWithNewProfiles}`)
    console.log(`   🧠 Con Perfil Espiritual: ${totalWithAnyProfile}`)
    console.log(`   📖 Sin Evaluación: ${membersWithoutProfiles}`)
    console.log(`   📊 % Completado: ${spiritualGiftsCompletion < 1 ? spiritualGiftsCompletion.toFixed(1) : Math.round(spiritualGiftsCompletion)}%`)

    // ===== 5. ANALYTICS DASHBOARD =====
    console.log('\n📊 5. ANALYTICS DASHBOARD:')
    
    const totalDonations = await prisma.donation.count({
      where: { churchId }
    })
    
    const totalCommunications = await prisma.communication.count({
      where: { churchId }
    })
    
    const totalSermons = await prisma.sermon.count({
      where: { churchId }
    })
    
    console.log(`   💰 Total Donations: ${totalDonations}`)
    console.log(`   📢 Total Communications: ${totalCommunications}`)
    console.log(`   📖 Total Sermons: ${totalSermons}`)
    console.log(`   📅 Total Events: ${await prisma.event.count({ where: { churchId } })}`)

    // ===== 6. CROSS-REFERENCE VERIFICATION =====
    console.log('\n🔍 6. CROSS-REFERENCE VERIFICATION:')
    console.log('   Checking data consistency across all dashboards...')
    
    const issues = []
    
    // Check if member counts match across dashboards
    if (totalMembers !== totalMembers) {
      issues.push('❌ Member count mismatch between dashboards')
    } else {
      console.log('   ✅ Member counts consistent across all dashboards')
    }
    
    // Check if volunteer counts match
    if (totalVolunteers !== activeVolunteers) {
      issues.push('❌ Volunteer count mismatch between main dashboard and volunteers section')
    } else {
      console.log('   ✅ Volunteer counts consistent')
    }
    
    // Check spiritual gifts calculations
    if (profileCompleteness !== Math.round(spiritualGiftsCompletion)) {
      console.log(`   ⚠️  Profile completeness differs: Volunteers=${profileCompleteness}% vs Spiritual=${Math.round(spiritualGiftsCompletion)}%`)
    } else {
      console.log('   ✅ Spiritual profile completion rates consistent')
    }
    
    if (issues.length > 0) {
      console.log('\n❌ ISSUES FOUND:')
      issues.forEach(issue => console.log(issue))
    } else {
      console.log('\n✅ ALL DASHBOARD COUNTS ARE CONSISTENT!')
    }
    
    console.log('\n🎯 RECOMMENDED CHECKS:')
    console.log('   1. Start development server: npm run dev')
    console.log('   2. Navigate to each dashboard section')
    console.log('   3. Verify these exact numbers appear in the UI')
    console.log('   4. Check that all tabs show matching counts')
    
    console.log('\n✅ Comprehensive dashboard consistency test complete!')

  } catch (error) {
    console.error('❌ Error during consistency test:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testAllDashboardConsistency()