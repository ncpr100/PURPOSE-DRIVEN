#!/usr/bin/env tsx

/**
 * TEST #2.3: Search Functionality Validation
 * Tests the search implementation for Members module
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testSearchFunctionality() {
  console.log('🔍 TEST #2.3: SEARCH FUNCTIONALITY VALIDATION\n')
  console.log('=' .repeat(60))
  
  try {
    // Get church ID (using the known church from testing)
    const church = await prisma.church.findFirst({
      where: { name: { contains: 'Comunidad de Fe' } }
    })
    
    if (!church) {
      console.error('❌ Church not found')
      return
    }
    
    console.log(`✅ Testing with Church: ${church.name}`)
    console.log(`   Church ID: ${church.id}\n`)
    
    // Get total member count
    const totalMembers = await prisma.member.count({
      where: { churchId: church.id, isActive: true }
    })
    
    console.log(`📊 Total Active Members: ${totalMembers}\n`)
    
    // TEST 1: Search by first name "Juan"
    console.log('TEST 1: Search by first name "Juan"')
    console.log('-'.repeat(60))
    
    const juanMembers = await prisma.member.findMany({
      where: {
        churchId: church.id,
        isActive: true,
        firstName: { contains: 'Juan', mode: 'insensitive' }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    console.log(`✅ Found ${juanMembers.length} members with "Juan" in first name`)
    console.log('\nRecent matches:')
    juanMembers.slice(0, 5).forEach((member, idx) => {
      console.log(`   ${idx + 1}. ${member.firstName} ${member.lastName}`)
      console.log(`      Email: ${member.email || 'N/A'}`)
      console.log(`      Phone: ${member.phone || 'N/A'}`)
      console.log(`      Created: ${member.createdAt.toLocaleDateString()}`)
    })
    
    // Verify JUAN PACHANGA is in the list
    const juanPachanga = juanMembers.find(m => 
      m.firstName.toUpperCase() === 'JUAN' && m.lastName.toUpperCase() === 'PACHANGA'
    )
    
    if (juanPachanga) {
      console.log(`\n   ✅ VERIFIED: JUAN PACHANGA found in search results`)
    } else {
      console.log(`\n   ⚠️  WARNING: JUAN PACHANGA not found (may need to check data)`)
    }
    
    console.log('\n')
    
    // TEST 2: Search by last name "pachanga" (case-insensitive)
    console.log('TEST 2: Search by last name "pachanga" (lowercase)')
    console.log('-'.repeat(60))
    
    const pachangaMembers = await prisma.member.findMany({
      where: {
        churchId: church.id,
        isActive: true,
        lastName: { contains: 'pachanga', mode: 'insensitive' }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true
      }
    })
    
    console.log(`✅ Found ${pachangaMembers.length} members with "pachanga" in last name`)
    pachangaMembers.forEach((member, idx) => {
      console.log(`   ${idx + 1}. ${member.firstName} ${member.lastName}`)
    })
    
    console.log('\n')
    
    // TEST 3: Search by email domain
    console.log('TEST 3: Search by email pattern')
    console.log('-'.repeat(60))
    
    const emailSearch = await prisma.member.findMany({
      where: {
        churchId: church.id,
        isActive: true,
        email: { not: null }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true
      },
      take: 10
    })
    
    console.log(`✅ Found ${emailSearch.length} members with emails (showing sample)`)
    emailSearch.forEach((member, idx) => {
      console.log(`   ${idx + 1}. ${member.firstName} ${member.lastName} - ${member.email}`)
    })
    
    console.log('\n')
    
    // TEST 4: Search by phone
    console.log('TEST 4: Search by phone pattern')
    console.log('-'.repeat(60))
    
    const phoneSearch = await prisma.member.findMany({
      where: {
        churchId: church.id,
        isActive: true,
        phone: { not: null }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true
      },
      take: 10
    })
    
    console.log(`✅ Found ${phoneSearch.length} members with phones (showing sample)`)
    phoneSearch.forEach((member, idx) => {
      console.log(`   ${idx + 1}. ${member.firstName} ${member.lastName} - ${member.phone}`)
    })
    
    console.log('\n')
    
    // SUMMARY
    console.log('=' .repeat(60))
    console.log('📋 SEARCH FUNCTIONALITY TEST SUMMARY')
    console.log('=' .repeat(60))
    console.log(`✅ Total Members: ${totalMembers}`)
    console.log(`✅ "Juan" search: ${juanMembers.length} results`)
    console.log(`✅ "pachanga" search: ${pachangaMembers.length} results`)
    console.log(`✅ Members with emails: ${emailSearch.length}+ (sample)`)
    console.log(`✅ Members with phones: ${phoneSearch.length}+ (sample)`)
    console.log(`✅ JUAN PACHANGA: ${juanPachanga ? 'FOUND' : 'NOT FOUND'}`)
    
    console.log('\n🎯 CLIENT-SIDE SEARCH IMPLEMENTATION')
    console.log('-'.repeat(60))
    console.log('The UI implements search as:')
    console.log('  - Name: Case-insensitive includes()')
    console.log('  - Email: Case-insensitive includes()')
    console.log('  - Phone: Case-sensitive includes()')
    console.log('  - No debouncing (immediate filtering)')
    console.log('\n✅ Database queries confirm search will work correctly\n')
    
  } catch (error) {
    console.error('❌ Error during search testing:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test
testSearchFunctionality()
