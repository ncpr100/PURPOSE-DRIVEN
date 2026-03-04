#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testVolunteerAPI() {
  try {
    console.log('🧪 Testing Volunteer API data...')
    
    // Test basic volunteer fetch
    const volunteers = await prisma.volunteer.findMany({
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

    console.log('\n📊 Volunteer API Data Test Results:')
    console.log(`📋 Total volunteers: ${volunteers.length}`)
    console.log(`✅ Active volunteers: ${volunteers.filter(v => v.isActive).length}`)
    
    // Test assignments count
    const totalAssignments = volunteers.reduce((acc, v) => acc + v.assignments.length, 0)
    console.log(`📅 Total assignments: ${totalAssignments}`)
    
    // Test ministry associations
    const volunteersWithMinistries = volunteers.filter(v => v.ministry !== null)
    console.log(`⛪ Volunteers with ministries: ${volunteersWithMinistries.length}`)
    
    // Test unique ministries
    const uniqueMinistries = new Set(volunteers.filter(v => v.ministry).map(v => v.ministry.name))
    console.log(`🏛️ Unique ministries: ${uniqueMinistries.size}`)
    
    console.log('\n🎯 Sample Volunteer Data:')
    volunteers.slice(0, 3).forEach((vol, index) => {
      console.log(`  ${index + 1}. ${vol.member.firstName} ${vol.member.lastName}`)
      console.log(`     Ministry: ${vol.ministry?.name || 'None'}`)
      console.log(`     Assignments: ${vol.assignments.length}`)
      console.log(`     Active: ${vol.isActive}`)
    })

    // Test recruitment pipeline metrics
    console.log('\n🎯 Testing recruitment pipeline metrics...')
    
    const churchId = volunteers[0]?.member?.churchId
    if (churchId) {
      const totalMembers = await prisma.member.count({
        where: { churchId, isActive: true }
      })

      const currentVolunteers = await prisma.volunteer.count({
        where: { churchId, isActive: true }
      })

      const membersWithSpiritualProfiles = await prisma.member.count({
        where: {
          churchId,
          isActive: true,
          spiritualProfile: { isNot: null }
        }
      })

      console.log('\n📈 Pipeline Metrics:')
      console.log(`  Total Members: ${totalMembers}`)
      console.log(`  Current Volunteers: ${currentVolunteers}`)
      console.log(`  Potential Candidates: ${totalMembers - currentVolunteers}`)
      console.log(`  Conversion Rate: ${Math.round((currentVolunteers / totalMembers) * 100)}%`)
      console.log(`  Profile Completeness: ${Math.round((membersWithSpiritualProfiles / totalMembers) * 100)}%`)
    }

    console.log('\n✅ Volunteer API test complete!')

  } catch (error) {
    console.error('❌ Error testing volunteer API:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testVolunteerAPI()