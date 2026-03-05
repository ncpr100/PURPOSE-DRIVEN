#!/usr/bin/env node

/**
 * TARGETED DATABASE CLEANUP
 * Preserves only:
 * 1. Faith Family Church (legitimate tenant)
 * 2. Super Admin account (platform owner)
 * 
 * Removes all test data contamination
 */

const { PrismaClient } = require('@prisma/client');
const readline = require('readline');

const prisma = new PrismaClient({
  log: ['error']
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

class TargetedDatabaseCleaner {
  constructor() {
    this.preservedData = {
      churches: [],
      users: [],
      members: []
    };
  }

  async identifyLegitimateData() {
    console.log('\n🔍 IDENTIFYING LEGITIMATE DATA TO PRESERVE...\n');

    try {
      // Find Faith Family Church
      const faithFamilyChurch = await prisma.churches.findFirst({
        where: {
          OR: [
            { name: { contains: 'Faith Family', mode: 'insensitive' } },
            { name: { contains: 'faith', mode: 'insensitive' } }
          ]
        }
      });

      if (faithFamilyChurch) {
        this.preservedData.churches.push(faithFamilyChurch);
        console.log(`✅ Found Faith Family Church: ${faithFamilyChurch.name} (ID: ${faithFamilyChurch.id})`);
      } else {
        console.log('❌ Faith Family Church not found by name - checking all churches...');
        
        // List all churches to help identify correct one
        const allChurches = await prisma.churches.findMany({
          select: { id: true, name: true, slug: true, createdAt: true }
        });
        
        console.log('\n📋 ALL CHURCHES IN DATABASE:');
        allChurches.forEach((church, index) => {
          console.log(`   ${index + 1}. ${church.name} (${church.id}) - Created: ${church.createdAt}`);
        });
        
        if (allChurches.length > 0) {
          // Assume the oldest church is the legitimate one if Faith Family not found by name
          const oldestChurch = allChurches.reduce((oldest, church) => 
            church.createdAt < oldest.createdAt ? church : oldest
          );
          this.preservedData.churches.push(oldestChurch);
          console.log(`✅ Preserving oldest church as legitimate: ${oldestChurch.name}`);
        }
      }

      // Find Super Admin user
      const superAdmin = await prisma.users.findFirst({
        where: {
          email: 'soporte@khesed-tek-systems.org'
        }
      });

      if (superAdmin) {
        this.preservedData.users.push(superAdmin);
        console.log(`✅ Found Super Admin: ${superAdmin.email} (Role: ${superAdmin.role})`);
      } else {
        console.log('❌ Super Admin not found by email - checking for SUPER_ADMIN role...');
        
        const superAdminByRole = await prisma.users.findFirst({
          where: { role: 'SUPER_ADMIN' }
        });
        
        if (superAdminByRole) {
          this.preservedData.users.push(superAdminByRole);
          console.log(`✅ Found Super Admin by role: ${superAdminByRole.email}`);
        }
      }

      // Find legitimate church members (non-test data)
      if (this.preservedData.churches.length > 0) {
        const churchId = this.preservedData.churches[0].id;
        
        const legitimateMembers = await prisma.members.findMany({
          where: {
            churchId: churchId,
            AND: [
              { 
                OR: [
                  { email: { not: { contains: '@example.com' } } },
                  { email: null }
                ]
              },
              { 
                OR: [
                  { email: { not: { contains: '@test.com' } } },
                  { email: null }
                ]
              },
              {
                OR: [
                  { firstName: { not: { startsWith: 'Batch User' } } },
                  { firstName: { not: { contains: 'Test User' } } }
                ]
              }
            ]
          },
          take: 50 // Limit to reasonable amount
        });

        this.preservedData.members = legitimateMembers;
        console.log(`✅ Found ${legitimateMembers.length} legitimate members in preserved church`);
      }

      // Find legitimate church users (pastors, admins, etc.)
      if (this.preservedData.churches.length > 0) {
        const churchId = this.preservedData.churches[0].id;
        
        const churchUsers = await prisma.users.findMany({
          where: {
            churchId: churchId,
            AND: [
              { email: { not: { contains: '@example.com' } } },
              { email: { not: { contains: '@test.com' } } }
            ]
          }
        });

        // Add church users to preserved users (avoiding duplicates)
        churchUsers.forEach(user => {
          if (!this.preservedData.users.some(u => u.id === user.id)) {
            this.preservedData.users.push(user);
          }
        });

        console.log(`✅ Found ${churchUsers.length} legitimate church users`);
      }

    } catch (error) {
      console.error('❌ Error identifying legitimate data:', error.message);
      throw error;
    }
  }

  async showCleanupPlan() {
    console.log('\n📋 CLEANUP PLAN:\n');
    
    console.log('🟢 DATA TO PRESERVE:');
    console.log(`   • Churches: ${this.preservedData.churches.length}`);
    this.preservedData.churches.forEach(church => {
      console.log(`     - ${church.name} (${church.id})`);
    });
    
    console.log(`   • Users: ${this.preservedData.users.length}`);
    this.preservedData.users.forEach(user => {
      console.log(`     - ${user.email} (${user.role})`);
    });
    
    console.log(`   • Members: ${this.preservedData.members.length}`);

    // Show what will be deleted
    const totalMembers = await prisma.members.count();
    const totalUsers = await prisma.users.count();
    const totalChurches = await prisma.churches.count();

    console.log('\n🔴 DATA TO DELETE:');
    console.log(`   • Churches: ${totalChurches - this.preservedData.churches.length} (keeping ${this.preservedData.churches.length})`);
    console.log(`   • Users: ${totalUsers - this.preservedData.users.length} (keeping ${this.preservedData.users.length})`);
    console.log(`   • Members: ${totalMembers - this.preservedData.members.length} (keeping ${this.preservedData.members.length})`);
    
    console.log(`\n📊 IMPACT SUMMARY:`);
    console.log(`   • Removing ~${totalMembers - this.preservedData.members.length} test member records`);
    console.log(`   • Removing ~${totalUsers - this.preservedData.users.length} test user accounts`);
    console.log(`   • Removing ~${totalChurches - this.preservedData.churches.length} test churches`);
  }

  async executeCleanup() {
    console.log('\n🗃️ EXECUTING TARGETED CLEANUP...\n');

    try {
      await prisma.$transaction(async (tx) => {
        const preservedChurchIds = this.preservedData.churches.map(c => c.id);
        const preservedUserIds = this.preservedData.users.map(u => u.id);
        const preservedMemberIds = this.preservedData.members.map(m => m.id);

        console.log('🧹 Deleting test members...');
        const deletedMembers = await tx.members.deleteMany({
          where: {
            NOT: {
              id: { in: preservedMemberIds }
            }
          }
        });
        console.log(`   ✅ Deleted ${deletedMembers.count} test member records`);

        console.log('🧹 Deleting test users...');
        const deletedUsers = await tx.users.deleteMany({
          where: {
            NOT: {
              id: { in: preservedUserIds }
            }
          }
        });
        console.log(`   ✅ Deleted ${deletedUsers.count} test user accounts`);

        console.log('🧹 Deleting test churches...');
        const deletedChurches = await tx.churches.deleteMany({
          where: {
            NOT: {
              id: { in: preservedChurchIds }
            }
          }
        });
        console.log(`   ✅ Deleted ${deletedChurches.count} test churches`);

        // Clean up related tables that might have orphaned data
        console.log('🧹 Cleaning up related tables...');
        
        // Delete orphaned member spiritual profiles
        const deletedProfiles = await tx.member_spiritual_profiles.deleteMany({
          where: {
            NOT: {
              memberId: { in: preservedMemberIds }
            }
          }
        });
        console.log(`   ✅ Deleted ${deletedProfiles.count} orphaned spiritual profiles`);

        // Delete orphaned check-ins
        const deletedCheckIns = await tx.check_ins.deleteMany({
          where: {
            NOT: {
              churchId: { in: preservedChurchIds }
            }
          }
        });
        console.log(`   ✅ Deleted ${deletedCheckIns.count} orphaned check-ins`);

        // Delete orphaned events
        const deletedEvents = await tx.events.deleteMany({
          where: {
            NOT: {
              churchId: { in: preservedChurchIds }
            }
          }
        });
        console.log(`   ✅ Deleted ${deletedEvents.count} orphaned events`);

        console.log('\n🎉 CLEANUP COMPLETED SUCCESSFULLY!');
      });

    } catch (error) {
      console.error('❌ Cleanup failed:', error.message);
      throw error;
    }
  }

  async verifyCleanup() {
    console.log('\n🔍 VERIFYING CLEANUP RESULTS...\n');

    const finalCounts = {
      churches: await prisma.churches.count(),
      users: await prisma.users.count(),
      members: await prisma.members.count(),
      checkIns: await prisma.check_ins.count(),
      events: await prisma.events.count()
    };

    console.log('📊 FINAL DATABASE STATE:');
    console.log(`   • Churches: ${finalCounts.churches}`);
    console.log(`   • Users: ${finalCounts.users}`);
    console.log(`   • Members: ${finalCounts.members}`);
    console.log(`   • Check-ins: ${finalCounts.checkIns}`);
    console.log(`   • Events: ${finalCounts.events}`);

    // Verify preserved data still exists
    const preservedChurch = await prisma.churches.findFirst();
    const superAdmin = await prisma.users.findFirst({
      where: { 
        OR: [
          { email: 'soporte@khesed-tek-systems.org' },
          { role: 'SUPER_ADMIN' }
        ]
      }
    });

    console.log('\n✅ VERIFICATION:');
    if (preservedChurch) {
      console.log(`   • Legitimate church preserved: ${preservedChurch.name}`);
    }
    if (superAdmin) {
      console.log(`   • Super admin preserved: ${superAdmin.email} (${superAdmin.role})`);
    }

    return {
      success: true,
      finalCounts,
      preservedChurch: preservedChurch?.name,
      preservedSuperAdmin: superAdmin?.email
    };
  }

  async runCleanup() {
    console.log('🎯 TARGETED DATABASE CLEANUP - Faith Family Church + Super Admin Only');
    console.log('=' .repeat(80));

    try {
      await this.identifyLegitimateData();
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
      await prisma.$disconnect();
      rl.close();
    }
  }
}

// Execute cleanup if run directly
if (require.main === module) {
  const cleaner = new TargetedDatabaseCleaner();
  cleaner.runCleanup()
    .then(() => {
      console.log('\n✅ Cleanup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Cleanup failed:', error);
      process.exit(1);
    });
}

module.exports = TargetedDatabaseCleaner;