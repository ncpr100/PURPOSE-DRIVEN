const { db } = require('./lib/db')

async function checkTenantUser() {
  try {
    console.log('🔍 Checking tenant user: admin@iglesiacentral.com')
    
    const user = await db.users.findUnique({
      where: { email: 'admin@iglesiacentral.com' },
      include: { churches: true }
    })
    
    if (user) {
      console.log('✅ USER FOUND:')
      console.log('  📧 Email:', user.email)
      console.log('  🏛️ Role:', user.role)
      console.log('  ⛪ Church:', user.churches?.name || 'No church')
      console.log('  🆔 Church ID:', user.churchId)
      console.log('  🔓 Has password:', !!user.password)
      console.log('  ✅ Active:', user.isActive)
      console.log('  📅 Created:', user.createdAt)
    } else {
      console.log('❌ USER NOT FOUND - Need to create tenant user')
      
      // Let's also check if church exists
      const church = await db.churches.findFirst({
        where: { 
          OR: [
            { name: { contains: 'Central', mode: 'insensitive' } },
            { name: { contains: 'Iglesia', mode: 'insensitive' } }
          ]
        }
      })
      
      console.log('🏛️ Church exists:', !!church)
      if (church) {
        console.log('  ⛪ Church name:', church.name)
        console.log('  🆔 Church ID:', church.id)
      }
    }
    
  } catch (error) {
    console.error('❌ Database error:', error.message)
  } finally {
    await db.$disconnect()
    process.exit(0)
  }
}

checkTenantUser()