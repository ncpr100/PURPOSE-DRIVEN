#!/usr/bin/env node

/**
 * 🔐 AUTHENTICATION FIX SCRIPT - Create Missing Credentials
 * 
 * Creates both TENANT and SUPER_ADMIN users with correct passwords
 * Ensures both login systems work properly
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'

const db = new PrismaClient()

async function main() {
  try {
    console.log('🚀 CREATING AUTHENTICATION CREDENTIALS')
    console.log('=' .repeat(60))

    // STEP 1: Create or find church for tenant user
    console.log('\n⛪ STEP 1: Ensuring church exists...')
    let church = await db.churches.findFirst({
      where: { 
        OR: [
          { name: { contains: 'Central', mode: 'insensitive' } },
          { name: { contains: 'Iglesia', mode: 'insensitive' } }
        ]
      }
    })

    if (!church) {
      console.log('📝 Creating church for tenant...')
      church = await db.churches.create({
        data: {
          id: nanoid(),
          name: 'Iglesia Central',
          address: 'Dirección de Ejemplo 123',
          city: 'Ciudad Ejemplo',
          phone: '+1-555-0123',
          email: 'admin@iglesiacentral.com',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      console.log('✅ Church created:', church.name, 'ID:', church.id)
    } else {
      console.log('✅ Church exists:', church.name, 'ID:', church.id)
    }

    // STEP 2: Create or update tenant user
    console.log('\n👤 STEP 2: Creating tenant user...')
    
    const tenantPassword = await bcrypt.hash('password123', 12)
    
    const tenantUser = await db.users.upsert({
      where: { email: 'admin@iglesiacentral.com' },
      update: {
        password: tenantPassword,
        isActive: true,
        role: 'ADMIN_IGLESIA',
        churchId: church.id
      },
      create: {
        id: nanoid(),
        email: 'admin@iglesiacentral.com',
        password: tenantPassword,
        name: 'Administrador Iglesia Central', 
        role: 'ADMIN_IGLESIA',
        churchId: church.id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    
    console.log('✅ Tenant user ready:', {
      email: tenantUser.email,
      role: tenantUser.role,
      churchId: tenantUser.churchId,
      isActive: tenantUser.isActive
    })

    // STEP 3: Create or update SUPER_ADMIN user
    console.log('\n🔧 STEP 3: Creating SUPER_ADMIN user...')
    
    const superPassword = await bcrypt.hash('Bendecido100%$$%', 12)
    
    const superUser = await db.users.upsert({
      where: { email: 'soporte@khesed-tek-systems.org' },
      update: {
        password: superPassword,
        isActive: true,
        role: 'SUPER_ADMIN',
        churchId: null
      },
      create: {
        id: nanoid(),
        email: 'soporte@khesed-tek-systems.org',
        password: superPassword,
        name: 'Khesed-Tek Support',
        role: 'SUPER_ADMIN', 
        churchId: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    
    console.log('✅ SUPER_ADMIN user ready:', {
      email: superUser.email,
      role: superUser.role,
      churchId: superUser.churchId,
      isActive: superUser.isActive
    })

    // STEP 4: Verify password hashes work
    console.log('\n🔐 STEP 4: Verifying password hashes...')
    
    const tenantPasswordTest = await bcrypt.compare('password123', tenantUser.password)
    const superPasswordTest = await bcrypt.compare('Bendecido100%$$%', superUser.password)
    
    console.log('🏢 Tenant password verification:', tenantPasswordTest ? '✅ CORRECT' : '❌ FAILED')
    console.log('🔧 SUPER_ADMIN password verification:', superPasswordTest ? '✅ CORRECT' : '❌ FAILED')

    console.log('\n🎯 AUTHENTICATION SUMMARY:')
    console.log('=' .repeat(50))
    console.log('✅ TENANT LOGIN CREDENTIALS:')
    console.log('   Email: admin@iglesiacentral.com')
    console.log('   Password: password123')
    console.log('   Role: ADMIN_IGLESIA')
    console.log('   Church:', church.name)
    
    console.log('\n✅ SUPER_ADMIN LOGIN CREDENTIALS:')
    console.log('   Email: soporte@khesed-tek-systems.org')
    console.log('   Password: Bendecido100%$$%')
    console.log('   Role: SUPER_ADMIN')
    console.log('   Church: None (platform level)')
    
    console.log('\n🚀 READY TO TEST:')
    console.log('1. Both login credentials should now work')
    console.log('2. Test tenant uploads after login with admin@iglesiacentral.com')
    console.log('3. Test SUPER_ADMIN uploads after login with soporte@khesed-tek-systems.org')
    
  } catch (error) {
    console.error('❌ Error creating credentials:', error)
  } finally {
    await db.$disconnect()
  }
}

main()