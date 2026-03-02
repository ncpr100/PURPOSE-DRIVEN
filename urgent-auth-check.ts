import { db } from './lib/db'
import bcrypt from 'bcrypt'

async function urgentAuthCheck() {
  console.log('🚨 URGENT AUTHENTICATION CHECK...\n')
  
  try {
    // Get all users and check for duplicates
    const users = await db.users.findMany({
      select: { email: true, role: true, isActive: true, churchId: true },
      orderBy: { email: 'asc' }
    })
    
    console.log('📋 ALL USERS IN DATABASE:')
    users.forEach(u => {
      console.log(`   ${u.email} | ${u.role} | Active: ${u.isActive} | ChurchId: ${u.churchId || 'null'}`)
    })
    
    // Check for critical accounts
    console.log('\n🎯 CRITICAL ACCOUNTS STATUS:')
    
    const soporte = await db.users.findUnique({
      where: { email: 'soporte@khesed-tek-systems.org' }
    })
    
    const testadmin = await db.users.findUnique({
      where: { email: 'testadmin@prueba.com' }
    })
    
    if (soporte) {
      console.log('✅ SOPORTE ACCOUNT:')
      console.log(`   Email: ${soporte.email}`)
      console.log(`   Role: ${soporte.role}`)
      console.log(`   Active: ${soporte.isActive}`)
      console.log(`   ChurchId: ${soporte.churchId || 'null'}`)
      console.log(`   Password Hash: ${soporte.password?.substring(0, 20)}...`)
      
      // Test password
      const passwordValid = await bcrypt.compare('Bendecido100%$$%', soporte.password || '')
      console.log(`   Password Test: ${passwordValid ? '✅ VALID' : '❌ INVALID'}`)
    } else {
      console.log('❌ SOPORTE ACCOUNT: NOT FOUND')
    }
    
    if (testadmin) {
      console.log('\n✅ TESTADMIN ACCOUNT:')
      console.log(`   Email: ${testadmin.email}`)
      console.log(`   Role: ${testadmin.role}`)
      console.log(`   Active: ${testadmin.isActive}`)
      console.log(`   ChurchId: ${testadmin.churchId || 'null'}`)
      console.log(`   Password Hash: ${testadmin.password?.substring(0, 20)}...`)
      
      // Test password
      const passwordValid = await bcrypt.compare('TestPassword123!', testadmin.password || '')
      console.log(`   Password Test: ${passwordValid ? '✅ VALID' : '❌ INVALID'}`)
    } else {
      console.log('❌ TESTADMIN ACCOUNT: NOT FOUND')
    }
    
    // Check for any corrupted emails
    console.log('\n🔍 CHECKING FOR CORRUPTION:')
    const corruptedUsers = await db.users.findMany({
      where: {
        email: {
          contains: '+updated'
        }
      }
    })
    
    if (corruptedUsers.length > 0) {
      console.log('⚠️ CORRUPTED EMAILS FOUND:')
      corruptedUsers.forEach(u => console.log(`   ${u.email}`))
    } else {
      console.log('✅ No corrupted emails found')
    }
    
    await db.$disconnect()
    console.log('\n🎯 AUTHENTICATION CHECK COMPLETE')
    
  } catch (error) {
    console.error('💥 DATABASE ERROR:', error)
    process.exit(1)
  }
}

urgentAuthCheck()