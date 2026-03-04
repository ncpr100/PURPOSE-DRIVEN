#!/usr/bin/env node

/**
 * SUPER_ADMIN Login Test Script
 * Tests authentication credentials against production database
 * Run with: node test-super-admin-login.js
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

// EXACT credentials from documentation
const TEST_EMAIL = 'soporte@khesed-tek-systems.org'
const TEST_PASSWORD = 'Bendecido100%$$%'

async function testSuperAdminLogin() {
  console.log('\n🔐 TESTING SUPER_ADMIN CREDENTIALS')
  console.log('=====================================\n')
  
  try {
    // Step 1: Find user
    console.log('📋 Step 1: Looking up user...')
    const user = await prisma.users.findUnique({
      where: { email: TEST_EMAIL },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        churchId: true,
        isActive: true,
        password: true
      }
    })
    
    if (!user) {
      console.log('❌ FAILED: User not found in database')
      console.log(`   Email searched: ${TEST_EMAIL}`)
      return false
    }
    
    console.log('✅ User found in database')
    console.log(`   Name: ${user.name}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Active: ${user.isActive}`)
    console.log(`   Church ID: ${user.churchId || 'null (platform admin)'}`)
    
    // Step 2: Verify password
    console.log('\n📋 Step 2: Verifying password...')
    const isPasswordCorrect = await bcrypt.compare(TEST_PASSWORD, user.password)
    
    if (!isPasswordCorrect) {
      console.log('❌ FAILED: Password does not match')
      console.log(`   Password tested: ${TEST_PASSWORD}`)
      console.log(`   Hash in DB: ${user.password.substring(0, 20)}...`)
      return false
    }
    
    console.log('✅ Password verified successfully')
    
    // Step 3: Check user status
    console.log('\n📋 Step 3: Checking user status...')
    if (!user.isActive) {
      console.log('❌ FAILED: User account is inactive')
      return false
    }
    console.log('✅ User account is active')
    
    // Step 4: Verify role
    console.log('\n📋 Step 4: Verifying SUPER_ADMIN role...')
    if (user.role !== 'SUPER_ADMIN') {
      console.log(`❌ FAILED: User role is ${user.role}, not SUPER_ADMIN`)
      return false
    }
    console.log('✅ SUPER_ADMIN role confirmed')
    
    // Step 5: Verify platform admin (no church)
    console.log('\n📋 Step 5: Verifying platform admin status...')
    if (user.churchId !== null) {
      console.log(`⚠️  WARNING: User has churchId: ${user.churchId}`)
      console.log('   Platform admins should have churchId = null')
    } else {
      console.log('✅ Platform admin confirmed (churchId = null)')
    }
    
    // Success summary
    console.log('\n\n✅ ========================================')
    console.log('✅ ALL CREDENTIAL CHECKS PASSED!')
    console.log('✅ ========================================')
    console.log('\n📧 Correct Email: ' + TEST_EMAIL)
    console.log('🔑 Correct Password: ' + TEST_PASSWORD)
    console.log('\n🌐 Production Login URL:')
    console.log('   https://khesed-tek-cms-org.vercel.app/auth/signin')
    console.log('\n📋 After Login, Redirect to:')
    console.log('   https://khesed-tek-cms-org.vercel.app/platform/dashboard')
    console.log('\n💡 TROUBLESHOOTING:')
    console.log('   If login still fails:')
    console.log('   1. Clear browser cache/cookies')
    console.log('   2. Use incognito/private window')
    console.log('   3. Check browser console (F12) for errors')
    console.log('   4. Verify using EXACT URL (not preview URL)')
    console.log('\n')
    
    return true
    
  } catch (error) {
    console.error('\n❌ ERROR DURING TEST:')
    console.error(error.message)
    console.error('\nFull error:')
    console.error(error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test
testSuperAdminLogin()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
