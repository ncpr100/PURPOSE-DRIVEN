#!/usr/bin/env node
/**
 * Diagnostic script to check authentication issue
 * Tests: 1) Users exist, 2) Password hashes, 3) Auth logic
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const db = new PrismaClient();

async function diagnose() {
  try {
    console.log('🔍 AUTHENTICATION DIAGNOSTIC\n');
    
    // Check 1: User table exists and has data
    console.log('✓ Querying users table...');
    const users = await db.user.findMany({
      select: { id: true, email: true, role: true, password: true },
      take: 20
    });
    
    console.log(`  Found ${users.length} users in database:\n`);
    users.forEach(u => {
      const passwordPreview = u.password ? u.password.substring(0, 30) + '...' : 'NULL';
      console.log(`  - Email: ${u.email}`);
      console.log(`    Role: ${u.role}`);
      console.log(`    Password Hash: ${passwordPreview}`);
      console.log('');
    });
    
    // Check 2: Test SUPER_ADMIN credentials
    console.log('\n🔐 TESTING SUPER_ADMIN CREDENTIALS\n');
    const superAdmin = await db.user.findUnique({
      where: { email: 'soporte@khesed-tek-systems.org' },
      select: { id: true, email: true, role: true, password: true }
    });
    
    if (superAdmin) {
      console.log('✅ SUPER_ADMIN user FOUND');
      console.log(`   Email: ${superAdmin.email}`);
      console.log(`   Role: ${superAdmin.role}`);
      console.log(`   Password Hash: ${superAdmin.password.substring(0, 50)}...`);
      
      // Test password
      const testPassword = 'Bendecido100%$$%';
      const passwordMatch = await bcrypt.compare(testPassword, superAdmin.password);
      console.log(`   Password Match: ${passwordMatch ? '✅ YES' : '❌ NO'}`);
      
      if (!passwordMatch) {
        console.log('\n   ⚠️ Password does not match! Testing hash generation...');
        const newHash = await bcrypt.hash(testPassword, 12);
        console.log(`   Generated hash would be: ${newHash.substring(0, 50)}...`);
      }
    } else {
      console.log('❌ SUPER_ADMIN user NOT FOUND - needs to be created');
    }
    
    // Check 3: Test testadmin@prueba.com credentials
    console.log('\n🔐 TESTING testadmin@prueba.com CREDENTIALS\n');
    const testAdmin = await db.user.findUnique({
      where: { email: 'testadmin@prueba.com' },
      select: { id: true, email: true, role: true, password: true }
    });
    
    if (testAdmin) {
      console.log('✅ testadmin user FOUND');
      console.log(`   Email: ${testAdmin.email}`);
      console.log(`   Role: ${testAdmin.role}`);
      console.log(`   Password Hash: ${testAdmin.password.substring(0, 50)}...`);
      
      const testPassword = 'TestPassword123!';
      const passwordMatch = await bcrypt.compare(testPassword, testAdmin.password);
      console.log(`   Password Match: ${passwordMatch ? '✅ YES' : '❌ NO'}`);
    } else {
      console.log('❌ testadmin user NOT FOUND');
    }
    
    // Check 4: Verify bcrypt works
    console.log('\n🧪 BCRYPT FUNCTIONALITY TEST\n');
    const testHash = await bcrypt.hash('TestPassword123!', 12);
    const testMatch = await bcrypt.compare('TestPassword123!', testHash);
    console.log(`   bcrypt.hash() works: ${testHash.length > 50 ? '✅' : '❌'}`);
    console.log(`   bcrypt.compare() works: ${testMatch ? '✅' : '❌'}`);
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  } finally {
    await db.$disconnect();
  }
}

diagnose();
