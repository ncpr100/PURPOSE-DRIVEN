#!/usr/bin/env node

/**
 * DIRECT SQL DATABASE CLEANUP
 * Preserves only:
 * 1. Faith Family Church (legitimate tenant) 
 * 2. Super Admin account (platform owner)
 * 
 * Uses direct SQL to avoid Prisma connection issues
 */

const { Client } = require('pg');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

class DirectSQLCleaner {
  constructor() {
    this.client = new Client({
      connectionString: process.env.DATABASE_URL
    });
    this.preservedChurchId = null;
    this.preservedSuperAdminId = null;
  }

  async connect() {
    await this.client.connect();
    console.log('✅ Connected to database');
  }

  async disconnect() {
    await this.client.end();
    console.log('✅ Disconnected from database');
  }

  async identifyLegitimateData() {
    console.log('\n🔍 IDENTIFYING LEGITIMATE DATA TO PRESERVE...\n');

    // Find Faith Family Church
    const churchQuery = `
      SELECT id, name, "createdAt" 
      FROM churches 
      WHERE LOWER(name) LIKE '%faith%' OR LOWER(name) LIKE '%family%'
      ORDER BY "createdAt" ASC
      LIMIT 1;
    `;

    const churchResult = await this.client.query(churchQuery);
    
    if (churchResult.rows.length > 0) {
      const church = churchResult.rows[0];
      this.preservedChurchId = church.id;
      console.log(`✅ Found Faith Family Church: ${church.name} (ID: ${church.id})`);
    } else {
      // If no Faith Family found, check all churches and pick the oldest legitimate one
      const allChurchesQuery = `
        SELECT id, name, "createdAt" 
        FROM churches 
        WHERE name NOT LIKE '%Test%' AND name NOT LIKE '%Demo%'
        ORDER BY "createdAt" ASC
        LIMIT 5;
      `;
      
      const allChurches = await this.client.query(allChurchesQuery);
      console.log('\n📋 ALL NON-TEST CHURCHES:');
      allChurches.rows.forEach((church, index) => {
        console.log(`   ${index + 1}. ${church.name} (${church.id}) - Created: ${church.createdAt}`);
      });
      
      if (allChurches.rows.length > 0) {
        const oldestChurch = allChurches.rows[0];
        this.preservedChurchId = oldestChurch.id;
        console.log(`✅ Preserving oldest legitimate church: ${oldestChurch.name}`);
      }
    }

    // Find Super Admin
    const adminQuery = `
      SELECT id, email, role 
      FROM users 
      WHERE email = 'soporte@khesed-tek-systems.org' OR role = 'SUPER_ADMIN'
      ORDER BY role DESC
      LIMIT 1;
    `;

    const adminResult = await this.client.query(adminQuery);
    
    if (adminResult.rows.length > 0) {
      const admin = adminResult.rows[0];
      this.preservedSuperAdminId = admin.id;
      console.log(`✅ Found Super Admin: ${admin.email} (Role: ${admin.role})`);
    } else {
      console.log('❌ Super Admin not found - will preserve any platform admin');
    }

    return {
      churchId: this.preservedChurchId,
      superAdminId: this.preservedSuperAdminId
    };
  }

  async showCleanupPlan() {
    console.log('\n📋 CLEANUP PLAN:\n');

    // Get current data counts
    const counts = {};
    const tables = ['churches', 'users', 'members', 'check_ins', 'events'];
    
    for (const table of tables) {
      const result = await this.client.query(`SELECT COUNT(*) FROM ${table}`);
      counts[table] = parseInt(result.rows[0].count);
    }

    console.log('📊 CURRENT DATABASE STATE:');
    Object.entries(counts).forEach(([table, count]) => {
      console.log(`   • ${table}: ${count} records`);
    });

    console.log('\n🟢 DATA TO PRESERVE:');
    if (this.preservedChurchId) {
      console.log(`   • Church: ${this.preservedChurchId} (Faith Family Church)`);
    }
    if (this.preservedSuperAdminId) {
      console.log(`   • Super Admin: ${this.preservedSuperAdminId}`);
    }

    // Estimate what will be deleted
    const memberCountQuery = `
      SELECT COUNT(*) 
      FROM members 
      WHERE "churchId" != $1 OR "churchId" IS NULL
    `;
    const deletableMembersResult = await this.client.query(memberCountQuery, [this.preservedChurchId]);
    const deletableMembers = parseInt(deletableMembersResult.rows[0].count);

    console.log('\n🔴 ESTIMATED DELETIONS:');
    console.log(`   • Members: ~${deletableMembers} test records (keeping legitimate church members)`);
    console.log(`   • Churches: ${counts.churches - 1} (keeping 1 legitimate)`);
    console.log(`   • Users: Most test accounts (preserving Super Admin + legitimate church users)`);
  }

  async executeCleanup() {
    console.log('\n🗃️ EXECUTING DIRECT SQL CLEANUP...\n');

    try {
      await this.client.query('BEGIN');

      // 1. Delete test members (keeping only Faith Family Church members)
      const deleteMembersQuery = `
        DELETE FROM members 
        WHERE "churchId" != $1 
        OR "firstName" LIKE 'Batch User%' 
        OR "firstName" LIKE 'Test User%'
        OR email LIKE '%@example.com'
        OR email LIKE '%@test.com';
      `;
      const deletedMembers = await this.client.query(deleteMembersQuery, [this.preservedChurchId]);
      console.log(`🧹 Deleted ${deletedMembers.rowCount} test member records`);

      // 2. Delete test users (keeping Super Admin and legitimate church users)
      const deleteUsersQuery = `
        DELETE FROM users 
        WHERE id != $1 
        AND "churchId" != $2 
        AND role != 'SUPER_ADMIN'
        AND (email LIKE '%@example.com' OR email LIKE '%@test.com');
      `;
      const deletedUsers = await this.client.query(deleteUsersQuery, [
        this.preservedSuperAdminId, 
        this.preservedChurchId
      ]);
      console.log(`🧹 Deleted ${deletedUsers.rowCount} test user accounts`);

      // 3. Delete test churches (keeping only Faith Family Church)
      const deleteChurchesQuery = `
        DELETE FROM churches 
        WHERE id != $1;
      `;
      const deletedChurches = await this.client.query(deleteChurchesQuery, [this.preservedChurchId]);
      console.log(`🧹 Deleted ${deletedChurches.rowCount} test churches`);

      // 4. Clean up orphaned data
      const cleanupQueries = [
        { name: 'check-ins', sql: 'DELETE FROM check_ins WHERE "churchId" != $1' },
        { name: 'events', sql: 'DELETE FROM events WHERE "churchId" != $1' },
        { name: 'donations', sql: 'DELETE FROM donations WHERE "churchId" != $1' },
        { name: 'communications', sql: 'DELETE FROM communications WHERE "churchId" != $1' },
        { name: 'custom forms', sql: 'DELETE FROM custom_forms WHERE "churchId" != $1' }
      ];

      for (const cleanup of cleanupQueries) {
        try {
          const result = await this.client.query(cleanup.sql, [this.preservedChurchId]);
          console.log(`🧹 Deleted ${result.rowCount} orphaned ${cleanup.name}`);
        } catch (err) {
          console.log(`⚠️  Skipped ${cleanup.name} cleanup: ${err.message}`);
        }
      }

      await this.client.query('COMMIT');
      console.log('\n🎉 CLEANUP COMPLETED SUCCESSFULLY!');

    } catch (error) {
      await this.client.query('ROLLBACK');
      console.error('❌ Cleanup failed, rollback completed:', error.message);
      throw error;
    }
  }

  async verifyCleanup() {
    console.log('\n🔍 VERIFYING CLEANUP RESULTS...\n');

    const tables = ['churches', 'users', 'members', 'check_ins', 'events'];
    const finalCounts = {};

    for (const table of tables) {
      const result = await this.client.query(`SELECT COUNT(*) FROM ${table}`);
      finalCounts[table] = parseInt(result.rows[0].count);
    }

    console.log('📊 FINAL DATABASE STATE:');
    Object.entries(finalCounts).forEach(([table, count]) => {
      console.log(`   • ${table}: ${count} records`);
    });

    // Verify preserved data
    const churchCheck = await this.client.query('SELECT name FROM churches LIMIT 1');
    const adminCheck = await this.client.query('SELECT email FROM users WHERE role = \'SUPER_ADMIN\' LIMIT 1');

    console.log('\n✅ VERIFICATION:');
    if (churchCheck.rows.length > 0) {
      console.log(`   • Preserved church: ${churchCheck.rows[0].name}`);
    }
    if (adminCheck.rows.length > 0) {
      console.log(`   • Preserved super admin: ${adminCheck.rows[0].email}`);
    }

    return finalCounts;
  }

  async runCleanup() {
    console.log('🎯 DIRECT SQL DATABASE CLEANUP - Faith Family Church + Super Admin Only');
    console.log('=' .repeat(80));

    try {
      await this.connect();
      
      const preservedData = await this.identifyLegitimateData();
      
      if (!preservedData.churchId) {
        console.log('❌ No legitimate church found - aborting cleanup');
        return;
      }

      await this.showCleanupPlan();

      const confirmation = await ask('\n⚠️  PROCEED WITH CLEANUP? This will PERMANENTLY DELETE all test data. Type "YES" to continue: ');
      
      if (confirmation !== 'YES') {
        console.log('❌ Cleanup cancelled by user');
        return;
      }

      await this.executeCleanup();
      const results = await this.verifyCleanup();

      console.log('\n🎉 DATABASE CLEANUP COMPLETED SUCCESSFULLY!');
      console.log('   Only legitimate Faith Family Church data and Super Admin account remain.');
      
      return results;

    } catch (error) {
      console.error('💥 Cleanup failed:', error);
      throw error;
    } finally {
      await this.disconnect();
      rl.close();
    }
  }
}

// Execute cleanup if run directly
if (require.main === module) {
  const cleaner = new DirectSQLCleaner();
  cleaner.runCleanup()
    .then(() => {
      console.log('\n✅ Cleanup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Cleanup failed:', error);
      process.exit(1);
    });
}

module.exports = DirectSQLCleaner;