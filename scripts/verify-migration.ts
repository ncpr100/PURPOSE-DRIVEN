import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function verifyMigration() {
  try {
    console.log('🔍 VERIFYING MIGRATION DATA\n')
    console.log('═'.repeat(80))

    // Get church
    const church = await db.church.findFirst({
      where: { name: 'Iglesia Comunidad de Fe' }
    })

    if (!church) {
      console.log('❌ Church not found!')
      return
    }

    console.log('✅ Church Found:')
    console.log(`   Name: ${church.name}`)
    console.log(`   ID: ${church.id}`)
    console.log(`   Email: ${church.email}\n`)

    // Count members
    const totalMembers = await db.member.count({
      where: { churchId: church.id }
    })

    console.log('👥 Member Count:')
    console.log(`   Total: ${totalMembers}\n`)

    // Count users by role
    const adminCount = await db.user.count({
      where: { churchId: church.id, role: 'ADMIN_IGLESIA' }
    })

    const pastorCount = await db.user.count({
      where: { churchId: church.id, role: 'PASTOR' }
    })

    const liderCount = await db.user.count({
      where: { churchId: church.id, role: 'LIDER' }
    })

    console.log('👤 User Accounts by Role:')
    console.log(`   ADMIN_IGLESIA: ${adminCount}`)
    console.log(`   PASTOR: ${pastorCount}`)
    console.log(`   LIDER: ${liderCount}\n`)

    // Count ministries
    const ministryCount = await db.ministry.count({
      where: { churchId: church.id }
    })

    const ministries = await db.ministry.findMany({
      where: { churchId: church.id },
      select: { name: true }
    })

    console.log('🎯 Ministries:')
    console.log(`   Total: ${ministryCount}`)
    ministries.forEach(m => console.log(`   - ${m.name}`))
    console.log()

    // Sample members
    const sampleMembers = await db.member.findMany({
      where: { churchId: church.id },
      take: 5,
      select: {
        firstName: true,
        lastName: true,
        email: true,
        maritalStatus: true,
        city: true,
        state: true
      }
    })

    console.log('📋 Sample Members:')
    sampleMembers.forEach(m => {
      console.log(`   - ${m.firstName} ${m.lastName}`)
      console.log(`     Email: ${m.email}`)
      console.log(`     Status: ${m.maritalStatus} | Location: ${m.city}, ${m.state}`)
    })
    console.log()

    // Check admin user
    const admin = await db.user.findUnique({
      where: { email: 'admin@comunidaddefe.org' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        churchId: true
      }
    })

    console.log('🔐 Admin User:')
    if (admin) {
      console.log(`   ✅ Found: ${admin.name}`)
      console.log(`   Email: ${admin.email}`)
      console.log(`   Role: ${admin.role}`)
      console.log(`   Active: ${admin.isActive}`)
      console.log(`   Church ID: ${admin.churchId}`)
    } else {
      console.log(`   ❌ Admin user not found!`)
    }

    console.log('\n' + '═'.repeat(80))
    console.log('✅ VERIFICATION COMPLETE')

  } catch (error) {
    console.error('❌ Verification failed:', error)
  } finally {
    await db.$disconnect()
  }
}

verifyMigration()
