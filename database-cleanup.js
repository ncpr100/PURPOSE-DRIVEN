#!/usr/bin/env node
/**
 * 🧹 DATABASE CLEANUP SCRIPT
 * Remove test/seed data from production database
 */

const { PrismaClient } = require('@prisma/client');
const readline = require('readline');

class DatabaseCleaner {
  constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: 'postgresql://postgres.qxdwpihcmgctznvdfmbv:Bendecido100%25%24%24%25@aws-1-us-east-1.pooler.supabase.com:6543/postgres'
        }
      }
    });
    this.backupRecommended = true;
  }

  log(level, message, data = {}) {
    const icons = { 'INFO': 'ℹ️', 'SUCCESS': '✅', 'ERROR': '❌', 'WARNING': '⚠️' };
    console.log(`${icons[level] || '📍'} ${message}`);
    if (Object.keys(data).length > 0) {
      console.log(`   ${JSON.stringify(data, null, 2)}`);
    }
  }

  // Create user confirmation interface
  async askConfirmation(question) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
      });
    });
  }

  // Identify test data patterns
  async identifyTestData() {
    console.log('\n🔍 IDENTIFYING TEST DATA PATTERNS...');

    try {
      // Count test data by patterns
      const testPatterns = [
        { name: 'Batch Users', where: { firstName: 'Batch', lastName: 'User' } },
        { name: 'Example.com emails', where: { email: { contains: '@example.com' } } },
        { name: 'Hillsong test emails', where: { email: { contains: '@hillsong.com' } } },
        { name: 'Test prefix emails', where: { email: { startsWith: 'test' } } },
        { name: 'Member- ID prefix', where: { id: { startsWith: 'member-' } } },
        { name: 'Batch prefix emails', where: { email: { startsWith: 'batch' } } }
      ];

      const testCounts = {};
      for (const pattern of testPatterns) {
        const count = await this.prisma.members.count({ where: pattern.where });
        testCounts[pattern.name] = count;
        this.log('WARNING', `${pattern.name}: ${count} records`);
      }

      // Get legitimate data count estimate
      const totalMembers = await this.prisma.members.count();
      const estimatedTestData = Object.values(testCounts).reduce((sum, count) => sum + count, 0);
      const estimatedLegitimate = totalMembers - estimatedTestData;

      this.log('ERROR', 'DATA BREAKDOWN ESTIMATE', {
        total: totalMembers,
        estimatedTest: estimatedTestData,
        estimatedLegitimate: estimatedLegitimate,
        percentageTest: Math.round((estimatedTestData / totalMembers) * 100)
      });

      return testCounts;

    } catch (error) {
      this.log('ERROR', 'Failed to identify test data', { error: error.message });
      throw error;
    }
  }

  // Preview what will be deleted
  async previewDeletion() {
    console.log('\n👀 PREVIEW: DATA TO BE DELETED...');

    try {
      // Preview batch users
      const batchUsers = await this.prisma.members.findMany({
        where: { firstName: 'Batch', lastName: 'User' },
        take: 5,
        select: { id: true, firstName: true, lastName: true, email: true }
      });

      this.log('WARNING', 'Sample Batch Users (to be deleted)', { examples: batchUsers });

      // Preview example.com emails
      const exampleEmails = await this.prisma.members.findMany({
        where: { email: { contains: '@example.com' } },
        take: 5,
        select: { id: true, firstName: true, lastName: true, email: true }
      });

      this.log('WARNING', 'Sample @example.com users (to be deleted)', { examples: exampleEmails });

      // Preview member- IDs
      const memberIds = await this.prisma.members.findMany({
        where: { id: { startsWith: 'member-' } },
        take: 5,
        select: { id: true, firstName: true, lastName: true, email: true }
      });

      this.log('WARNING', 'Sample member-ID records (to be deleted)', { examples: memberIds });

      return true;
    } catch (error) {
      this.log('ERROR', 'Failed to preview deletion', { error: error.message });
      return false;
    }
  }

  // Show what will be preserved
  async previewPreservation() {
    console.log('\n✅ PREVIEW: DATA TO BE PRESERVED...');

    try {
      // Find likely legitimate users
      const legitimateUsers = await this.prisma.members.findMany({
        where: {
          AND: [
            { firstName: { not: 'Batch' } },
            { email: { not: { contains: '@example.com' } } },
            { email: { not: { contains: '@hillsong.com' } } },
            { email: { not: { startsWith: 'batch' } } },
            { id: { not: { startsWith: 'member-' } } }
          ]
        },
        take: 10,
        select: { 
          id: true, 
          firstName: true, 
          lastName: true, 
          email: true,
          churchId: true,
          createdAt: true
        },
        orderBy: { createdAt: 'asc' }
      });

      this.log('SUCCESS', 'Legitimate users that will be PRESERVED', { 
        count: legitimateUsers.length,
        examples: legitimateUsers 
      });

      return legitimateUsers;
    } catch (error) {
      this.log('ERROR', 'Failed to preview preservation', { error: error.message });
      return [];
    }
  }

  // Execute the cleanup with transaction safety
  async executeCleanup() {
    console.log('\n🧹 EXECUTING DATABASE CLEANUP...');

    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        // Delete in order of dependency

        // 1. Delete Batch Users
        const batchUsers = await prisma.members.deleteMany({
          where: { firstName: 'Batch', lastName: 'User' }
        });

        // 2. Delete @example.com emails
        const exampleEmails = await prisma.members.deleteMany({
          where: { email: { contains: '@example.com' } }
        });

        // 3. Delete @hillsong.com test emails
        const hillsongEmails = await prisma.members.deleteMany({
          where: { email: { contains: '@hillsong.com' } }
        });

        // 4. Delete member- ID prefix records
        const memberIdPrefix = await prisma.members.deleteMany({
          where: { id: { startsWith: 'member-' } }
        });

        // 5. Delete batch email prefix records
        const batchEmailPrefix = await prisma.members.deleteMany({
          where: { email: { startsWith: 'batch' } }
        });

        return {
          batchUsers: batchUsers.count,
          exampleEmails: exampleEmails.count,
          hillsongEmails: hillsongEmails.count,
          memberIdPrefix: memberIdPrefix.count,
          batchEmailPrefix: batchEmailPrefix.count
        };
      });

      this.log('SUCCESS', 'DATABASE CLEANUP COMPLETED!', { deletedRecords: result });

      // Get final count
      const finalCount = await this.prisma.members.count();
      this.log('SUCCESS', `Final member count: ${finalCount}`, { 
        previousCount: '153,005',
        currentCount: finalCount,
        cleaned: true
      });

      return result;

    } catch (error) {
      this.log('ERROR', 'Cleanup failed - transaction rolled back', { error: error.message });
      throw error;
    }
  }

  // Main cleanup workflow
  async runCleanup() {
    console.log('🧹 DATABASE CLEANUP WIZARD\n');
    console.log('⚠️  WARNING: This will permanently delete test data from the database!');
    console.log('📋 Recommended: Create a backup before proceeding\n');

    try {
      // Step 1: Identify test data
      await this.identifyTestData();

      // Step 2: Preview deletion
      await this.previewDeletion();

      // Step 3: Preview preservation
      await this.previewPreservation();

      // Step 4: Get user confirmation
      console.log('\n' + '='.repeat(60));
      console.log('⚠️  FINAL CONFIRMATION REQUIRED');
      console.log('='.repeat(60));
      console.log('This will delete approximately 151,000+ test records');
      console.log('Only legitimate church members will be preserved');
      console.log('This action CANNOT be undone without a backup!');
      console.log('='.repeat(60));

      const confirmed = await this.askConfirmation('Do you want to proceed with cleanup? (yes/no): ');

      if (!confirmed) {
        console.log('🚫 Cleanup cancelled by user');
        return { cancelled: true };
      }

      // Step 5: Execute cleanup
      const result = await this.executeCleanup();

      console.log('\n' + '='.repeat(60));
      console.log('✅ DATABASE CLEANUP SUCCESSFUL!');
      console.log('='.repeat(60));
      console.log('💾 Test data removed from production database');
      console.log('👥 Legitimate members preserved');
      console.log('🎯 System ready for production use');
      console.log('='.repeat(60));

      return result;

    } catch (error) {
      console.error('\n💥 Database cleanup failed:', error);
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }
}

// Execute cleanup if run directly
if (require.main === module) {
  const cleaner = new DatabaseCleaner();
  cleaner.runCleanup()
    .then(result => {
      if (!result.cancelled) {
        console.log('\n🎉 Database is now clean and production-ready!');
      }
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Cleanup failed:', error);
      process.exit(1);
    });
}

module.exports = DatabaseCleaner;