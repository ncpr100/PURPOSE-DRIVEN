const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const db = new PrismaClient()

async function checkLoginCredentials() {
  console.log('🔍 Checking Login Credentials...\n')

  try {
    // Check SUPER_ADMIN
    console.log('1️⃣ SUPER_ADMIN Check:')
    console.log('Email: soporte@khesed-tek-systems.org')
    
    const superAdmin = await db.users.findUnique({
      where: { email: 'soporte@khesed-tek-systems.org' },
      include: { churches: true }
    })

    if (!superAdmin) {
      console.log('❌ SUPER_ADMIN user NOT FOUND\n')
    } else {
      console.log('✅ User found')
      console.log('   ID:', superAdmin.id)
      console.log('   Name:', superAdmin.name)
      console.log('   Role:', superAdmin.role)
      console.log('   isActive:', superAdmin.isActive)
      console.log('   isFirstLogin:', superAdmin.isFirstLogin)
      console.log('   Church ID:', superAdmin.churchId || 'null')
      
      // Test password
      const testPassword = 'Bendecido100%$$$'
      const isValid = await bcrypt.compare(testPassword, superAdmin.password)
      console.log('   Password Test:', isValid ? '✅ VALID' : '❌ INVALID')
      
      if (!isValid) {
        console.log('   Stored hash (first 30):', superAdmin.password.substring(0, 30))
      }
      console.log()
    }

    // Check TENANT
    console.log('2️⃣ TENANT Check:')
    console.log('Email: admin@iglesiacentral.com')
    
    const tenant = await db.users.findUnique({
      where: { email: 'admin@iglesiacentral.com' },
      include: { churches: true }
    })

    if (!tenant) {
      console.log('❌ TENANT user NOT FOUND\n')
    } else {
      console.log('✅ User found')
      console.log('   ID:', tenant.id)
      console.log('   Name:', tenant.name)
      console.log('   Role:', tenant.role)
      console.log('   isActive:', tenant.isActive)
      console.log('   isFirstLogin:', tenant.isFirstLogin)
      console.log('   Church ID:', tenant.churchId)
      console.log('   Church Name:', tenant.churches?.name)
      
      // Test password
      const testPassword = 'password123'
      const isValid = await bcrypt.compare(testPassword, tenant.password)
      console.log('   Password Test:', isValid ? '✅ VALID' : '❌ INVALID')
      
      if (!isValid) {
        console.log('   Stored hash (first 30):', tenant.password.substring(0, 30))
      }
      console.log()
    }

    // Check all users with potential issues
    console.log('3️⃣ All Users with isFirstLogin = null or undefined:')
    const usersWithNullFirstLogin = await db.users.findMany({
      where: { isFirstLogin: null },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isFirstLogin: true,
        isActive: true
      }
    })
    
    if (usersWithNullFirstLogin.length > 0) {
      console.log(`   Found ${usersWithNullFirstLogin.length} users with null isFirstLogin:`)
      usersWithNullFirstLogin.forEach(u => {
        console.log(`   - ${u.email} (${u.role}) - isFirstLogin: ${u.isFirstLogin}`)
      })
      console.log()
    } else {
      console.log('   ✅ No users with null isFirstLogin\n')
    }

    // Check inactive users
    console.log('4️⃣ Inactive Users:')
    const inactiveUsers = await db.users.findMany({
      where: { isActive: false },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true
      }
    })
    
    if (inactiveUsers.length > 0) {
      console.log(`   Found ${inactiveUsers.length} inactive users:`)
      inactiveUsers.forEach(u => {
        console.log(`   - ${u.email} (${u.role})`)
      })
    } else {
      console.log('   ✅ All users are active')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await db.$disconnect()
  }
}

checkLoginCredentials()
