const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const db = new PrismaClient()

async function resetSuperAdminPassword() {
  console.log('🔧 Resetting SUPER_ADMIN password...\n')

  try {
    const email = 'soporte@khesed-tek-systems.org'
    const newPassword = 'Bendecido100%$$$'

    // Hash the password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update the user
    const updatedUser = await db.users.update({
      where: { email },
      data: {
        password: hashedPassword,
        isFirstLogin: false,
        lastPasswordChange: new Date(),
        updatedAt: new Date()
      }
    })

    console.log('✅ SUPER_ADMIN password reset successfully!')
    console.log('   Email:', email)
    console.log('   Password:', newPassword)
    console.log('   isFirstLogin:', updatedUser.isFirstLogin)
    console.log('   lastPasswordChange:', updatedUser.lastPasswordChange)

    // Test the password
    const isValid = await bcrypt.compare(newPassword, updatedUser.password)
    console.log('   Password verification:', isValid ? '✅ VALID' : '❌ INVALID')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await db.$disconnect()
  }
}

resetSuperAdminPassword()
