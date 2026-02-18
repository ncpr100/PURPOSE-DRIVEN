/**
 * EMERGENCY FIX: Add missing password column and populate with correct credentials
 */

import { db } from './lib/db';
import bcrypt from 'bcrypt';

async function fixAuthenticationSystem() {
  try {
    console.log('🚨 EMERGENCY AUTHENTICATION FIX\n');
    
    // Step 1: Add missing password column
    console.log('Step 1: Adding password column to users table...');
    const addColumnQuery = `
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS password TEXT;
    `;
    
    await db.$executeRawUnsafe(addColumnQuery);
    console.log('✅ Password column added successfully\n');
    
    // Step 2: Hash the known passwords
    console.log('Step 2: Hashing known passwords...');
    const superAdminHash = await bcrypt.hash('Bendecido100%$$%', 12);
    const testAdminHash = await bcrypt.hash('TestPassword123!', 12);
    
    console.log('✅ Passwords hashed successfully\n');
    
    // Step 3: Update existing users with passwords
    console.log('Step 3: Updating users with password hashes...');
    
    // Update SUPER_ADMIN
    await db.$executeRaw`UPDATE users SET password = ${superAdminHash} WHERE email = 'soporte@khesed-tek-systems.org'`;
    console.log('✅ SUPER_ADMIN password updated');
    
    // Update testadmin
    await db.$executeRaw`UPDATE users SET password = ${testAdminHash} WHERE email = 'testadmin@prueba.com'`;
    console.log('✅ testadmin password updated');
    
    // Update admin@iglesiacentral.com (generate secure password)
    const centralAdminHash = await bcrypt.hash('AdminIglesia2026!', 12);
    await db.$executeRaw`UPDATE users SET password = ${centralAdminHash} WHERE email = 'admin@iglesiacentral.com'`;
    console.log('✅ admin@iglesiacentral.com password updated\n');
    
    // Step 4: Verify the fix
    console.log('Step 4: Verifying authentication fix...');
    const users = await db.users.findMany({
      select: { email: true, role: true, password: true },
    });
    
    console.log('Updated users:');
    users.forEach(u => {
      console.log(`📧 ${u.email} (${u.role})`);
      console.log(`   Password: ${u.password ? 'SET ✅' : 'MISSING ❌'}`);
      console.log('');
    });
    
    console.log('🎉 AUTHENTICATION SYSTEM RESTORED!\n');
    console.log('🔑 UPDATED CREDENTIALS:');
    console.log('   soporte@khesed-tek-systems.org / Bendecido100%$$%');
    console.log('   testadmin@prueba.com / TestPassword123!');
    console.log('   admin@iglesiacentral.com / AdminIglesia2026!');

  } catch (error) {
    console.error('❌ FIX FAILED:', error);
  } finally {
    await db.$disconnect();
    process.exit(0);
  }
}

fixAuthenticationSystem().catch(console.error);