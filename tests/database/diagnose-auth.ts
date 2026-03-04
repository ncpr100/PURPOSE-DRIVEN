/**
 * Direct database query to diagnose authentication issue
 */

import { db } from './lib/db';
import bcrypt from 'bcrypt';

async function diagnose() {
  try {
    console.log('🔍 AUTHENTICATION DIAGNOSTIC\n');
    
    // Debug: Check what db exports
    console.log('🔧 db object type:', typeof db);
    console.log('🔧 db.users exists:', !!db?.users);
    console.log('🔧 Available models:', Object.keys(db).filter(k => !k.startsWith('$')).slice(0, 10).join(', '));
    
    if (!db || !db.users) {
      throw new Error('Prisma client not properly initialized or users table not found');
    }
    
    // Check 1: All users in database - First check schema
    console.log('✓ Checking users table schema...\n');
    const usersSchema = await db.users.findMany({
      select: { id: true, email: true, role: true },
      take: 5
    });
    
    console.log(`Found ${usersSchema.length} users (without password field):\n`);
    usersSchema.forEach(u => {
      console.log(`📧 ${u.email}`);
      console.log(`   Role: ${u.role}`);
      console.log(`   ID: ${u.id}`);
      console.log('');
    });
    
    // Check 2: Look for SUPER_ADMIN
    console.log('\n\n🔐 CHECKING SUPER_ADMIN ACCOUNT\n');
    const superAdmin = await db.users.findUnique({
      where: { email: 'soporte@khesed-tek-systems.org' },
    });
    
    if (superAdmin) {
      console.log('✅ Account EXISTS');
      console.log(`🔑 Cannot check password - password column missing from database schema`);
    } else {
      console.log('❌ Account DOES NOT EXIST - NEEDS TO BE CREATED');
    }
    
    // Check 3: Look for testadmin
    console.log('\n🔐 CHECKING testadmin@prueba.com ACCOUNT\n');
    const testAdmin = await db.users.findUnique({
      where: { email: 'testadmin@prueba.com'},
    });
    
    if (testAdmin) {
      console.log('✅ Account EXISTS');
      console.log(`🔑 Cannot check password - password column missing from database schema`);
    } else {
      console.log('❌ Account DOES NOT EXIST');
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error);
  } finally {
    await db.$disconnect();
  }
}

diagnose();
