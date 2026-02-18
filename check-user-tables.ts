/**
 * Check all user-related tables in the database
 */

import { db } from './lib/db';

async function checkUserTables() {
  try {
    console.log('🔍 CHECKING ALL USER TABLES IN DATABASE\n');
    
    // Method 1: Check table names via information_schema
    console.log('📋 Querying table names...\n');
    const tableQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name ILIKE '%user%'
      ORDER BY table_name;
    `;
    
    const userTables = await db.$queryRawUnsafe(tableQuery);
    console.log('User-related tables found:');
    console.log(userTables);
    
    // Method 2: Check specific known tables
    console.log('\n🔍 CHECKING SPECIFIC USER TABLES...\n');
    
    // Check 'users' table
    try {
      const usersCount = await db.users.count();
      console.log(`✅ users table: ${usersCount} records`);
      
      const usersSample = await db.users.findMany({
        select: { id: true, email: true, role: true, password: true },
        take: 5
      });
      console.log('Sample users data:');
      usersSample.forEach(u => console.log(`  - ${u.email} (${u.role}) - Password: ${u.password ? 'EXISTS' : 'NULL'}`));
    } catch (error) {
      console.log('❌ users table error:', error.message);
    }
    
    // Check 'accounts' table (NextAuth.js)
    try {
      const accountsCount = await db.accounts.count();
      console.log(`\n✅ accounts table (NextAuth): ${accountsCount} records`);
      
      const accountsSample = await db.accounts.findMany({
        select: { id: true, userId: true, provider: true, type: true },
        take: 5
      });
      console.log('Sample accounts data:');
      accountsSample.forEach(a => console.log(`  - User: ${a.userId}, Provider: ${a.provider}, Type: ${a.type}`));
    } catch (error) {
      console.log('\n❌ accounts table error:', error.message);
    }
    
    // Check for auth schema in Supabase
    console.log('\n🔍 CHECKING SUPABASE AUTH SCHEMA...\n');
    
    const authTableQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'auth'
      ORDER BY table_name;
    `;
    
    try {
      const authTables = await db.$queryRawUnsafe(authTableQuery);
      console.log('✅ Supabase auth schema tables:');
      console.log(authTables);
      
      // Check auth.users table
      const authUsersQuery = `
        SELECT id, email, created_at, email_confirmed_at
        FROM auth.users 
        ORDER BY created_at DESC 
        LIMIT 5;
      `;
      
      const authUsers = await db.$queryRawUnsafe(authUsersQuery);
      console.log('\n👥 Supabase auth.users:');
      console.log(authUsers);
      
    } catch (error) {
      console.log('❌ Supabase auth schema error:', error.message);
    }

  } catch (error) {
    console.error('❌ OVERALL ERROR:', error);
  } finally {
    await db.$disconnect();
    process.exit(0);
  }
}

checkUserTables().catch(console.error);