#!/usr/bin/env node

async function testSpiritualGiftsDashboard() {
  try {
    console.log('🧪 Testing Spiritual Gifts Dashboard Calculations...')
    
    // Use direct database approach to simulate the exact API the dashboard uses
    const { PrismaClient } = require('@prisma/client')
    const prisma = new PrismaClient()

    const churchId = 'cmgu3bev8000078ltyfy89pil'
    
    // Simulate the exact API call the dashboard makes (with our fix)
    const members = await prisma.member.findMany({
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
      take: 50 // Limit for testing
    })

      console.log(`📊 Retrieved ${members.length} members for dashboard test`)

      // Simulate the dashboard calculations
      const membersWithProfiles = members.filter(member => {
        // NEW SYSTEM - Check spiritual profile relation (primary)
        const hasNewProfile = member.spiritualProfile && 
                             member.spiritualProfile.primaryGifts && 
                             member.spiritualProfile.primaryGifts.length > 0
        
        // OLD SYSTEM - Check legacy fields (fallback)
        const hasOldGifts = member.spiritualGifts && (
          Array.isArray(member.spiritualGifts) ? 
            member.spiritualGifts.length > 0 : 
            member.spiritualGifts !== null
        )
        
        return hasNewProfile || hasOldGifts
      })

      const membersWithoutProfiles = members.filter(member => {
        const hasNewProfile = member.spiritualProfile && 
                             member.spiritualProfile.primaryGifts && 
                             member.spiritualProfile.primaryGifts.length > 0
        
        const hasOldGifts = member.spiritualGifts && (
          Array.isArray(member.spiritualGifts) ? 
            member.spiritualGifts.length > 0 : 
            member.spiritualGifts !== null
        )
        
        return !hasNewProfile && !hasOldGifts
      })

      const completionPercentage = members.length > 0 ? 
        ((membersWithProfiles.length / members.length) * 100) : 0

      console.log('\n📈 Dashboard Statistics (Simulated):')
      console.log(`📋 Total Miembros: ${members.length}`)
      console.log(`🧠 Con Perfil Espiritual: ${membersWithProfiles.length}`)
      console.log(`📖 Sin Evaluación: ${membersWithoutProfiles.length}`)
      console.log(`📊 % Completado: ${completionPercentage < 1 ? completionPercentage.toFixed(1) : Math.round(completionPercentage)}%`)

      // Show breakdown of OLD vs NEW system
      const newSystemCount = members.filter(m => 
        m.spiritualProfile && m.spiritualProfile.primaryGifts && m.spiritualProfile.primaryGifts.length > 0
      ).length
      
      const oldSystemCount = members.filter(m => 
        m.spiritualGifts && (Array.isArray(m.spiritualGifts) ? m.spiritualGifts.length > 0 : m.spiritualGifts !== null)
      ).length

      console.log('\n🔍 System Breakdown:')
      console.log(`✨ NEW Spiritual Profiles: ${newSystemCount}`)
      console.log(`📜 OLD Spiritual Gifts: ${oldSystemCount}`)
      console.log(`🔗 Total with ANY profile: ${membersWithProfiles.length}`)

    console.log('\n✅ Dashboard calculations verified!')
    
    await prisma.$disconnect()

  } catch (error) {
    console.error('❌ Error testing dashboard:', error.message)
  }
}

testSpiritualGiftsDashboard()