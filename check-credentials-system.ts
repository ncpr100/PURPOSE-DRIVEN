/**
 * Check current user_credentials table for separate password storage
 */

import { db } from './lib/db';

async function checkCredentialsSystem() {
  try {
    console.log('🔍 CHECKING USER_CREDENTIALS TABLE\n');
    
    // Check the separate credentials table
    try {
      const credentialsQuery = `SELECT * FROM user_credentials LIMIT 10;`;
      const credentials = await db.$queryRawUnsafe(credentialsQuery);
      console.log('🔑 user_credentials table contents:');
      console.log(credentials);
    } catch (error) {
      console.log('❌ user_credentials error:', error.message);
    }
    
    // Check users_public table
    try {
      const usersPublicQuery = `SELECT id, email, password, role FROM users_public LIMIT 10;`;
      const usersPublic = await db.$queryRawUnsafe(usersPublicQuery);
      console.log('\n👥 users_public table contents:');
      console.log(usersPublic);
    } catch (error) {
      console.log('\n❌ users_public error:', error.message);
    }
    
    // Check actual column structure of users table
    console.log('\n📋 CHECKING users TABLE STRUCTURE...\n');
    const structureQuery = `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users' AND table_schema = 'public'
      ORDER BY ordinal_position;
    `;
    
    const structure = await db.$queryRawUnsafe(structureQuery);
    console.log('users table structure:');
    console.log(structure);

  } catch (error) {
    console.error('❌ ERROR:', error);
  } finally {
    await db.$disconnect();
    process.exit(0);
  }
}

checkCredentialsSystem().catch(console.error);