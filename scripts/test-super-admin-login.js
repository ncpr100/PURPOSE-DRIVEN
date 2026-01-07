const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const db = new PrismaClient()

async function testSuperAdminLogin() {
  console.log('🧪 Testing SUPER_ADMIN Login Flow...\n')

  try {
    const email = 'soporte@khesed-tek-systems.org'
    const password = 'Bendecido100%$$$'

    console.log('Step 1: Finding user in database')
    const user = await db.users.findUnique({
      where: { email },
      include: { churches: true }
    })

    if (!user) {
      console.log('❌ User not found')
      return
    }

    console.log('✅ User found:')
    console.log('   ID:', user.id)
    console.log('   Email:', user.email)
    console.log('   Name:', user.name)
    console.log('   Role:', user.role)
    console.log('   isActive:', user.isActive)
    console.log('   churchId:', user.churchId)
    console.log('   churches:', user.churches ? user.churches.name : 'null')
    console.log()

    console.log('Step 2: Verifying password')
    const isValid = await bcrypt.compare(password, user.password)
    console.log('   Password valid:', isValid ? '✅ YES' : '❌ NO')
    console.log()

    if (!isValid) {
      console.log('❌ Login would FAIL - Invalid password')
      return
    }

    console.log('Step 3: Checking what NextAuth would return')
    const authReturn = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      churchId: user.churchId
    }
    console.log('   Auth return object:', JSON.stringify(authReturn, null, 2))
    console.log()

    console.log('Step 4: Checking middleware requirements')
    console.log('   Has role?', !!authReturn.role ? '✅ YES' : '❌ NO')
    console.log('   Role value:', authReturn.role)
    console.log('   Is SUPER_ADMIN?', authReturn.role === 'SUPER_ADMIN' ? '✅ YES' : '❌ NO')
    console.log('   Can access /platform?', authReturn.role === 'SUPER_ADMIN' ? '✅ YES' : '❌ NO')
    console.log()

    console.log('Step 5: Expected redirect after login')
    if (authReturn.role === 'SUPER_ADMIN') {
      console.log('   ✅ Should redirect to: /platform/dashboard')
    } else {
      console.log('   ✅ Should redirect to: /home')
    }
    console.log()

    console.log('✅ LOGIN TEST SUCCESSFUL')
    console.log('   User should be able to login and access /platform routes')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await db.$disconnect()
  }
}

testSuperAdminLogin()
