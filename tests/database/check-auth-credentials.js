#!/usr/bin/env node

const { db } = require('./lib/db')
const bcrypt = require('bcryptjs')

async function checkAndFixAuthCredentials() {
  try {
    console.log('🔍 AUTHENTICATION CREDENTIAL ANALYSIS')
    console.log('=' .repeat(60))
    
    // Check tenant user
    const tenantUser = await db.users.findUnique({
      where: { email: 'admin@iglesiacentral.com' },
      include: { churches: true }
    })
    
    console.log('\n🏢 TENANT USER (admin@iglesiacentral.com):')
    if (tenantUser) {
      console.log('✅ EXISTS:', {
        id: tenantUser.id,
        email: tenantUser.email,
        role: tenantUser.role,
        churchId: tenantUser.churchId,
        hasPassword: !!tenantUser.password,
        passwordLength: tenantUser.password?.length,
        isActive: tenantUser.isActive,
        churchName: tenantUser.churches?.name
      })
      
      // Test password verification
      if (tenantUser.password) {
        const passwordTest = await bcrypt.compare('password123', tenantUser.password)
        console.log('🔐 Password "password123" validates:', passwordTest ? '✅ CORRECT' : '❌ WRONG')
      }
    } else {
      console.log('❌ NOT FOUND - Need to create tenant user')
    }
    
    // Check church for tenant
    const church = await db.churches.findFirst({
      where: { name: { contains: 'Central', mode: 'insensitive' } }
    })
    
    console.log('\n⛪ TENANT CHURCH:')
    if (church) {
      console.log('✅ CHURCH EXISTS:', {
        id: church.id,
        name: church.name,
        isActive: church.isActive
      })
    } else {
      console.log('❌ CHURCH NOT FOUND - Need to create')
    }
    
    // Check SUPER_ADMIN user
    const superUser = await db.users.findUnique({
      where: { email: 'soporte@khesed-tek-systems.org' }
    })
    
    console.log('\n🔧 SUPER_ADMIN USER (soporte@khesed-tek-systems.org):')
    if (superUser) {
      console.log('✅ EXISTS:', {
        id: superUser.id,
        email: superUser.email,
        role: superUser.role,
        churchId: superUser.churchId,
        hasPassword: !!superUser.password,
        passwordLength: superUser.password?.length,
        isActive: superUser.isActive
      })
      
      // Test SUPER_ADMIN password
      if (superUser.password) {
        const passwordTest = await bcrypt.compare('Bendecido100%$$%', superUser.password)
        console.log('🔐 Password "Bendecido100%$$%" validates:', passwordTest ? '✅ CORRECT' : '❌ WRONG')
      }
    } else {
      console.log('❌ NOT FOUND - Need to create SUPER_ADMIN user')
    }
    
    console.log('\n📋 AUTHENTICATION STATUS SUMMARY:')
    console.log('=' .repeat(50))
    
    if (tenantUser && tenantUser.password && church) {
      console.log('✅ TENANT LOGIN: Should work (admin@iglesiacentral.com / password123)')
    } else {
      console.log('❌ TENANT LOGIN: Missing user or church - needs creation')
    }
    
    if (superUser && superUser.password) {
      console.log('✅ SUPER_ADMIN LOGIN: Should work (soporte@khesed-tek-systems.org / Bendecido100%$$%)')
    } else {
      console.log('❌ SUPER_ADMIN LOGIN: Missing user - needs creation')
    }
    
    console.log('\n🚀 NEXT STEPS:')
    if (!tenantUser || !church) {
      console.log('1. Run tenant user/church creation script')
    }
    if (!superUser) {
      console.log('2. Run SUPER_ADMIN user creation script')
    }
    if (tenantUser && superUser && church) {
      console.log('1. Both credentials should work - test login directly')
      console.log('2. If still failing, check NextAuth.js configuration')
    }
    
  } catch (error) {
    console.error('❌ Authentication check failed:', error)
  } finally {
    await db.$disconnect()
  }
}

checkAndFixAuthCredentials()