#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testSpiritualGiftsData() {
  try {
    console.log('🧪 Testing Spiritual Gifts Dashboard Data...')
    
    // Get the church with actual data
    const churchId = 'cmgu3bev8000078ltyfy89pil' // Iglesia Comunidad de Fe
    const church = await prisma.church.findFirst({
      where: { id: churchId }
    })
    if (!church) {
      console.log('❌ Church not found')
      return
    }
    console.log(`🏛️ Testing for church: ${church.name}`)
    
    // Test basic member counts
    const totalMembers = await prisma.member.count({
      where: { churchId, isActive: true }
    })

    // Test members with OLD spiritual gifts system
    const membersWithOldGifts = await prisma.member.count({
      where: { 
        churchId, 
        isActive: true,
        spiritualGifts: { not: null }
      }
    })

    // Test members with NEW spiritual profile system
    const membersWithNewProfiles = await prisma.member.count({
      where: { 
        churchId, 
        isActive: true,
        spiritualProfile: { isNot: null }
      }
    })

    console.log('\n📊 Spiritual Gifts Dashboard Data:')
    console.log(`📋 Total Members: ${totalMembers}`)
    console.log(`🧠 Members with OLD Spiritual Gifts: ${membersWithOldGifts}`)
    console.log(`✨ Members with NEW Spiritual Profiles: ${membersWithNewProfiles}`)
    
    // Calculate completion percentage
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
    
    const completionRate = totalMembers > 0 ? ((totalWithAnyProfile / totalMembers) * 100).toFixed(1) : 0
    console.log(`📈 Completion Rate: ${completionRate}%`)
    console.log(`❌ Members without any profile: ${totalMembers - totalWithAnyProfile}`)

    // Sample members with spiritual data
    console.log('\n🎯 Sample Members with Spiritual Data:')
    
    // Check old system
    const oldSystemSamples = await prisma.member.findMany({
      where: { 
        churchId, 
        isActive: true,
        spiritualGifts: { not: null }
      },
      select: {
        firstName: true,
        lastName: true,
        spiritualGifts: true,
        secondaryGifts: true,
        spiritualCalling: true
      },
      take: 3
    })

    console.log('📜 OLD System Samples:')
    oldSystemSamples.forEach((member, index) => {
      console.log(`  ${index + 1}. ${member.firstName} ${member.lastName}`)
      console.log(`     Primary: ${Array.isArray(member.spiritualGifts) ? member.spiritualGifts.join(', ') : member.spiritualGifts || 'None'}`)
      console.log(`     Secondary: ${Array.isArray(member.secondaryGifts) ? member.secondaryGifts.join(', ') : member.secondaryGifts || 'None'}`)
      console.log(`     Calling: ${member.spiritualCalling || 'None'}`)
    })

    // Check new system
    const newSystemSamples = await prisma.member.findMany({
      where: { 
        churchId, 
        isActive: true,
        spiritualProfile: { isNot: null }
      },
      include: {
        spiritualProfile: true
      },
      take: 3
    })

    console.log('\n✨ NEW System Samples:')
    newSystemSamples.forEach((member, index) => {
      console.log(`  ${index + 1}. ${member.firstName} ${member.lastName}`)
      console.log(`     Primary Gifts: ${JSON.stringify(member.spiritualProfile?.primaryGifts) || 'None'}`)
      console.log(`     Ministry Passions: ${JSON.stringify(member.spiritualProfile?.ministryPassions) || 'None'}`)
      console.log(`     Leadership Score: ${member.spiritualProfile?.leadershipScore || 0}`)
    })

    // Test the API endpoint data structure
    console.log('\n🔗 Testing API Endpoint Structure...')
    
    // Test the API endpoint data structure - Focus on members WITH spiritual data
    console.log('\n🔗 Testing API Endpoint Structure...')
    
    // Get members who should have spiritual profiles
    const membersWithProfiles = await prisma.member.findMany({
      where: { 
        churchId, 
        isActive: true,
        spiritualProfile: { isNot: null }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        spiritualGifts: true, // OLD system
        secondaryGifts: true, // OLD system  
        spiritualProfile: {   // NEW system - CHECK IF THIS IS INCLUDED
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
      take: 3
    })

    console.log('🔍 API Data Structure Test (Members WITH profiles):')
    membersWithProfiles.forEach((member, index) => {
      const hasOldGifts = member.spiritualGifts && (Array.isArray(member.spiritualGifts) ? member.spiritualGifts.length > 0 : member.spiritualGifts !== null)
      const hasNewProfile = member.spiritualProfile && member.spiritualProfile.primaryGifts && Array.isArray(member.spiritualProfile.primaryGifts) && member.spiritualProfile.primaryGifts.length > 0
      
      console.log(`  ${index + 1}. ${member.firstName} ${member.lastName}`)
      console.log(`     OLD System: ${hasOldGifts ? '✅' : '❌'} (${Array.isArray(member.spiritualGifts) ? member.spiritualGifts.length : (member.spiritualGifts ? 1 : 0)} gifts)`)
      console.log(`     NEW System: ${hasNewProfile ? '✅' : '❌'} (${member.spiritualProfile?.primaryGifts?.length || 0} gifts)`)
      console.log(`     Profile Object: ${member.spiritualProfile ? 'EXISTS' : 'NULL'}`)
      console.log(`     Profile ID: ${member.spiritualProfile?.id || 'None'}`)
    })

    console.log('\n✅ Spiritual Gifts Dashboard data analysis complete!')

  } catch (error) {
    console.error('❌ Error testing spiritual gifts data:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testSpiritualGiftsData()