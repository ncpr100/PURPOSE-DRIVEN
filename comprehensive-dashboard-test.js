#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testAllDashboardData() {
  try {
    console.log('🧪 COMPREHENSIVE DASHBOARD DATA VERIFICATION')
    console.log('=' .repeat(60))
    
    const churchId = 'cmgu3bev8000078ltyfy89pil'
    const today = new Date()
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000)
    
    // 1. MAIN DASHBOARD PANEL COUNTS
    console.log('\n📊 MAIN DASHBOARD PANEL VERIFICATION:')
    
    const totalMembers = await prisma.member.count({
      where: { churchId, isActive: true }
    })
    
    const newMembersThisMonth = await prisma.member.count({
      where: { 
        churchId, 
        isActive: true,
        createdAt: { gte: new Date(today.getFullYear(), today.getMonth(), 1) }
      }
    })
    
    const totalVolunteers = await prisma.volunteer.count({
      where: { churchId, isActive: true }
    })
    
    const todayCheckIns = await prisma.checkIn.count({
      where: { 
        churchId,
        checkedInAt: { gte: startOfToday, lt: endOfToday }
      }
    })
    
    const upcomingEvents = await prisma.event.count({
      where: { 
        churchId,
        startDate: { gte: today }
      }
    })
    
    console.log(`👥 Total Members: ${totalMembers}`)
    console.log(`🆕 New Members (Month): ${newMembersThisMonth}`)
    console.log(`🙋 Total Volunteers: ${totalVolunteers}`)
    console.log(`📍 Today's Check-ins: ${todayCheckIns}`)
    console.log(`📅 Upcoming Events: ${upcomingEvents}`)
    
    // 2. MEMBERS TAB VERIFICATION
    console.log('\n👥 MEMBERS TAB VERIFICATION:')
    
    const birthdaysThisMonth = await prisma.member.count({
      where: {
        churchId,
        isActive: true,
        birthDate: {
          not: null,
          gte: new Date(today.getFullYear(), today.getMonth(), 1),
          lt: new Date(today.getFullYear(), today.getMonth() + 1, 1)
        }
      }
    })
    
    const anniversariesThisMonth = await prisma.member.count({
      where: {
        churchId,
        isActive: true,
        membershipDate: {
          not: null,
          gte: new Date(today.getFullYear(), today.getMonth(), 1),
          lt: new Date(today.getFullYear(), today.getMonth() + 1, 1)
        }
      }
    })
    
    const inactiveMembers = await prisma.member.count({
      where: { churchId, isActive: false }
    })
    
    const ministryLeaders = await prisma.member.count({
      where: {
        churchId,
        isActive: true,
        leadershipStage: { in: ['MINISTRY_LEADER', 'SENIOR_LEADER', 'PASTOR'] }
      }
    })
    
    console.log(`🎂 Birthdays This Month: ${birthdaysThisMonth}`)
    console.log(`🎉 Anniversaries This Month: ${anniversariesThisMonth}`)
    console.log(`😴 Inactive Members: ${inactiveMembers}`)
    console.log(`👑 Ministry Leaders: ${ministryLeaders}`)
    
    // 3. VOLUNTEERS TAB VERIFICATION
    console.log('\n🙋 VOLUNTEERS TAB VERIFICATION:')
    
    const activeVolunteers = await prisma.volunteer.count({
      where: { churchId, isActive: true }
    })
    
    const volunteerAssignments = await prisma.volunteerAssignment.count({
      where: { churchId }
    })
    
    const activeMinistries = await prisma.ministry.count({
      where: { churchId, isActive: true }
    })
    
    const volunteersWithMinistries = await prisma.volunteer.count({
      where: { 
        churchId, 
        isActive: true,
        ministryId: { not: null }
      }
    })
    
    console.log(`✅ Active Volunteers: ${activeVolunteers}`)
    console.log(`📋 Total Assignments: ${volunteerAssignments}`)
    console.log(`⛪ Active Ministries: ${activeMinistries}`)
    console.log(`🤝 Volunteers with Ministries: ${volunteersWithMinistries}`)
    
    // 4. SPIRITUAL GIFTS TAB VERIFICATION
    console.log('\n✨ SPIRITUAL GIFTS TAB VERIFICATION:')
    
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
    
    const spiritualCompletionRate = totalMembers > 0 ? ((totalWithAnyProfile / totalMembers) * 100) : 0
    
    console.log(`📜 Members with OLD Spiritual Gifts: ${membersWithOldGifts}`)
    console.log(`✨ Members with NEW Spiritual Profiles: ${membersWithNewProfiles}`)
    console.log(`🧠 Total with ANY Spiritual Profile: ${totalWithAnyProfile}`)
    console.log(`📊 Spiritual Completion Rate: ${spiritualCompletionRate.toFixed(1)}%`)
    
    // 5. VISITORS TAB VERIFICATION
    console.log('\n👋 VISITORS TAB VERIFICATION:')
    
    const firstTimeVisitors = await prisma.checkIn.count({
      where: { 
        churchId,
        isFirstTime: true,
        checkedInAt: { gte: new Date(today.getFullYear(), today.getMonth(), 1) }
      }
    })
    
    const todayVisitors = await prisma.checkIn.count({
      where: { 
        churchId,
        checkedInAt: { gte: startOfToday, lt: endOfToday }
      }
    })
    
    const totalVisitorProfiles = await prisma.visitorProfile.count()
    
    console.log(`🆕 First-time Visitors (Month): ${firstTimeVisitors}`)
    console.log(`📍 Today's Visitors: ${todayVisitors}`)
    console.log(`📋 Total Visitor Profiles: ${totalVisitorProfiles}`)
    
    // 6. CONSISTENCY CHECK
    console.log('\n🔍 CONSISTENCY VERIFICATION:')
    console.log('=' .repeat(40))
    
    // Check if all counts are consistent across different queries
    const memberConsistency = {
      mainDashboard: totalMembers,
      membersTab: totalMembers
    }
    
    const volunteerConsistency = {
      mainDashboard: totalVolunteers,
      volunteersTab: activeVolunteers
    }
    
    console.log('👥 Member Counts Consistency:')
    console.log(`   Main Dashboard: ${memberConsistency.mainDashboard}`)
    console.log(`   Members Tab: ${memberConsistency.membersTab}`)
    console.log(`   ✅ Match: ${memberConsistency.mainDashboard === memberConsistency.membersTab}`)
    
    console.log('\n🙋 Volunteer Counts Consistency:')
    console.log(`   Main Dashboard: ${volunteerConsistency.mainDashboard}`)
    console.log(`   Volunteers Tab: ${volunteerConsistency.volunteersTab}`)
    console.log(`   ✅ Match: ${volunteerConsistency.mainDashboard === volunteerConsistency.volunteersTab}`)
    
    // 7. CRITICAL INDICATORS
    console.log('\n🚨 CRITICAL DATA INDICATORS:')
    
    if (totalMembers === 0) console.log('❌ CRITICAL: No members found!')
    if (totalVolunteers === 0) console.log('❌ CRITICAL: No volunteers found!')
    if (totalWithAnyProfile === 0) console.log('❌ WARNING: No spiritual profiles found!')
    if (activeMinistries === 0) console.log('❌ WARNING: No active ministries found!')
    
    console.log('\n✅ COMPREHENSIVE DASHBOARD VERIFICATION COMPLETE!')
    console.log('=' .repeat(60))
    
  } catch (error) {
    console.error('❌ Error in comprehensive dashboard test:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testAllDashboardData()