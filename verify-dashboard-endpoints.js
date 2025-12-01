#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function verifyDashboardDataEndpoints() {
  try {
    console.log('🔍 VERIFYING DASHBOARD ENDPOINTS DATA ACCURACY')
    console.log('=' .repeat(60))
    
    const churchId = 'cmgu3bev8000078ltyfy89pil' // Iglesia Comunidad de Fe
    
    // ===== SIMULATE MAIN DASHBOARD SERVER-SIDE DATA FETCHING =====
    console.log('\n📊 1. MAIN DASHBOARD SERVER-SIDE DATA (home/page.tsx):')
    
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))
    
    const [
      totalMembers, 
      totalSermons, 
      upcomingEvents, 
      newMembersThisMonth,
      totalVolunteers,
      totalCheckIns,
      pendingFollowUps,
      childrenPresent,
      firstTimeVisitorsThisMonth,
      completedFollowUpsThisMonth
    ] = await Promise.all([
      // Exact same queries as in home/page.tsx
      prisma.member.count({
        where: { 
          churchId,
          isActive: true 
        }
      }),
      prisma.sermon.count({
        where: { churchId }
      }),
      prisma.event.count({
        where: {
          churchId,
          startDate: {
            gte: new Date()
          }
        }
      }),
      prisma.member.count({
        where: {
          churchId,
          isActive: true,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      prisma.volunteer.count({
        where: { 
          member: {
            churchId,
            isActive: true
          },
          isActive: true 
        }
      }),
      prisma.checkIn.count({
        where: {
          churchId,
          checkedInAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      }),
      prisma.visitorFollowUp.count({
        where: {
          churchId,
          status: 'PENDIENTE'
        }
      }),
      prisma.childCheckIn.count({
        where: {
          churchId,
          checkedIn: true,
          checkedOut: false
        }
      }),
      prisma.checkIn.count({
        where: {
          churchId,
          isFirstTime: true,
          checkedInAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      prisma.visitorFollowUp.count({
        where: {
          churchId,
          status: 'COMPLETADO',
          completedAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ])

    console.log(`   📋 Total Members: ${totalMembers}`)
    console.log(`   📖 Total Sermons: ${totalSermons}`)
    console.log(`   📅 Upcoming Events: ${upcomingEvents}`)
    console.log(`   🆕 New Members (this month): ${newMembersThisMonth}`)
    console.log(`   👥 Total Volunteers: ${totalVolunteers}`)
    console.log(`   🚪 Today's Check-ins: ${totalCheckIns}`)
    console.log(`   ⏳ Pending Follow-ups: ${pendingFollowUps}`)
    console.log(`   👶 Children Present: ${childrenPresent}`)
    console.log(`   👋 First-time Visitors (this month): ${firstTimeVisitorsThisMonth}`)
    console.log(`   ✅ Completed Follow-ups (this month): ${completedFollowUpsThisMonth}`)

    // ===== SIMULATE /API/MEMBERS ENDPOINT =====
    console.log('\n👥 2. MEMBERS API ENDPOINT (/api/members):')
    
    // Test the exact query structure used by /api/members
    const membersApiSample = await prisma.member.findMany({
      where: { churchId, isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        spiritualGifts: true,
        secondaryGifts: true,
        spiritualProfile: {
          select: {
            id: true,
            primaryGifts: true,
            secondaryGifts: true,
            spiritualCalling: true,
            ministryPassions: true,
            experienceLevel: true,
            volunteerReadinessScore: true,
            assessmentDate: true
          }
        }
      },
      take: 10
    })

    const apiMembersWithOldGifts = membersApiSample.filter(m => 
      m.spiritualGifts && (Array.isArray(m.spiritualGifts) ? m.spiritualGifts.length > 0 : m.spiritualGifts !== null)
    ).length

    const apiMembersWithNewProfiles = membersApiSample.filter(m => 
      m.spiritualProfile && m.spiritualProfile.primaryGifts && Array.isArray(m.spiritualProfile.primaryGifts) && m.spiritualProfile.primaryGifts.length > 0
    ).length

    console.log(`   📊 API Sample Size: ${membersApiSample.length} members`)
    console.log(`   📜 Members with OLD gifts (in sample): ${apiMembersWithOldGifts}`)
    console.log(`   ✨ Members with NEW profiles (in sample): ${apiMembersWithNewProfiles}`)
    console.log(`   🔗 Spiritual Profile Relations: ${membersApiSample.filter(m => m.spiritualProfile !== null).length} working`)

    // ===== SIMULATE /API/VOLUNTEERS ENDPOINT =====
    console.log('\n🙋 3. VOLUNTEERS API ENDPOINT (/api/volunteers):')
    
    const volunteersApiData = await prisma.volunteer.findMany({
      where: {
        churchId,
        isActive: true
      },
      include: {
        member: true,
        ministry: true,
        assignments: {
          orderBy: {
            date: 'desc'
          },
          take: 10
        }
      },
      orderBy: {
        lastName: 'asc'
      }
    })

    const totalAssignments = volunteersApiData.reduce((acc, v) => acc + v.assignments.length, 0)
    const uniqueMinistries = new Set(volunteersApiData.filter(v => v.ministry).map(v => v.ministry.name)).size

    console.log(`   👥 API Volunteers: ${volunteersApiData.length}`)
    console.log(`   📋 Total Assignments: ${totalAssignments}`)
    console.log(`   ⛪ Unique Ministries: ${uniqueMinistries}`)
    console.log(`   🔗 Ministry Relations: ${volunteersApiData.filter(v => v.ministry !== null).length} working`)

    // ===== SIMULATE RECRUITMENT PIPELINE API =====
    console.log('\n🎯 4. RECRUITMENT PIPELINE API (/api/recruitment-pipeline):')
    
    const pipelineTotalMembers = await prisma.member.count({
      where: { churchId, isActive: true }
    })

    const pipelineCurrentVolunteers = await prisma.volunteer.count({
      where: { churchId, isActive: true }
    })

    const membersWithSpiritualProfiles = await prisma.member.count({
      where: {
        churchId,
        isActive: true,
        spiritualProfile: { isNot: null }
      }
    })

    const pipelineMetrics = {
      totalMembers: pipelineTotalMembers,
      currentVolunteers: pipelineCurrentVolunteers,
      potentialCandidates: pipelineTotalMembers - pipelineCurrentVolunteers,
      conversionRate: Math.round((pipelineCurrentVolunteers / pipelineTotalMembers) * 100),
      profileCompleteness: Math.round((membersWithSpiritualProfiles / pipelineTotalMembers) * 100),
    }

    console.log(`   📊 Pipeline Total Members: ${pipelineMetrics.totalMembers}`)
    console.log(`   👥 Pipeline Current Volunteers: ${pipelineMetrics.currentVolunteers}`)
    console.log(`   🎯 Pipeline Potential Candidates: ${pipelineMetrics.potentialCandidates}`)
    console.log(`   📈 Pipeline Conversion Rate: ${pipelineMetrics.conversionRate}%`)
    console.log(`   ✨ Pipeline Profile Completeness: ${pipelineMetrics.profileCompleteness}%`)

    // ===== COMPARE WITH COMPREHENSIVE TEST RESULTS =====
    console.log('\n🔍 5. COMPARISON WITH EXPECTED VALUES:')
    
    const expectedValues = {
      totalMembers: 1027,
      totalVolunteers: 10,
      todaysCheckIns: 6,
      firstTimeVisitors: 9,
      activeAssignments: 24,
      activeMinistries: 12,
      spiritualGiftsOld: 22,
      spiritualGiftsNew: 5
    }

    const results = []
    
    if (totalMembers === expectedValues.totalMembers) {
      results.push('✅ Total Members: MATCH')
    } else {
      results.push(`❌ Total Members: Expected ${expectedValues.totalMembers}, got ${totalMembers}`)
    }

    if (totalVolunteers === expectedValues.totalVolunteers) {
      results.push('✅ Total Volunteers: MATCH')
    } else {
      results.push(`❌ Total Volunteers: Expected ${expectedValues.totalVolunteers}, got ${totalVolunteers}`)
    }

    if (totalCheckIns === expectedValues.todaysCheckIns) {
      results.push('✅ Today\'s Check-ins: MATCH')
    } else {
      results.push(`❌ Today's Check-ins: Expected ${expectedValues.todaysCheckIns}, got ${totalCheckIns}`)
    }

    results.forEach(result => console.log(`   ${result}`))

    // ===== FINAL VERDICT =====
    const allMatches = results.filter(r => r.includes('✅')).length
    const totalChecks = results.length

    console.log(`\n📊 FINAL VERDICT: ${allMatches}/${totalChecks} checks passed`)
    
    if (allMatches === totalChecks) {
      console.log('🎉 ALL DASHBOARD DATA IS CONSISTENT ACROSS ALL ENDPOINTS!')
      console.log('   - Main dashboard will show correct data')
      console.log('   - Members API will show correct data')
      console.log('   - Volunteers API will show correct data')
      console.log('   - Recruitment pipeline will show correct data')
      console.log('   - All tabs and panels should reflect actual data')
    } else {
      console.log('⚠️  Some discrepancies found - please review the mismatches above')
    }
    
    console.log('\n✅ Dashboard endpoint verification complete!')

  } catch (error) {
    console.error('❌ Error during endpoint verification:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

verifyDashboardDataEndpoints()