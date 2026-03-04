#!/usr/bin/env node
/**
 * 🔍 DATABASE DATA INVESTIGATION
 * Investigate the incorrect member count data
 */

const { PrismaClient } = require('@prisma/client');

class DatabaseInvestigator {
  constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: 'postgresql://postgres.qxdwpihcmgctznvdfmbv:Bendecido100%25%24%24%25@aws-1-us-east-1.pooler.supabase.com:6543/postgres'
        }
      }
    });
    this.results = [];
  }

  log(level, message, data = {}) {
    const entry = { level, message, data, timestamp: new Date().toISOString() };
    this.results.push(entry);
    
    const icons = { 'INFO': 'ℹ️', 'SUCCESS': '✅', 'ERROR': '❌', 'WARNING': '⚠️' };
    console.log(`${icons[level] || '📍'} ${message}`);
    if (Object.keys(data).length > 0) {
      console.log(`   ${JSON.stringify(data, null, 2)}`);
    }
  }

  // Investigate member data in detail
  async investigateMemberData() {
    console.log('\n🔍 INVESTIGATING MEMBER DATA...');
    
    try {
      // Get actual member count
      const totalMembers = await this.prisma.members.count();
      this.log('WARNING', 'TOTAL MEMBERS COUNT', { count: totalMembers });

      // Get members by church with details
      const membersByChurch = await this.prisma.members.groupBy({
        by: ['churchId'],
        _count: {
          _all: true
        }
      });

      this.log('WARNING', 'Members by Church ID', { distribution: membersByChurch });

      // Get church details
      const churches = await this.prisma.churches.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          isActive: true,
          createdAt: true
        }
      });

      this.log('INFO', 'Church details', { churches: churches });

      // Get sample members to understand the data
      const sampleMembers = await this.prisma.members.findMany({
        take: 10,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          churchId: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      this.log('INFO', 'Sample recent members', { samples: sampleMembers });

      // Check for patterns in the data
      const memberCreationDates = await this.prisma.members.groupBy({
        by: ['createdAt'],
        _count: {
          _all: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 20
      });

      this.log('WARNING', 'Member creation patterns', { 
        recentCreations: memberCreationDates.slice(0, 10)
      });

      // Check for duplicate or test data
      const emailPatterns = await this.prisma.members.findMany({
        where: {
          OR: [
            { email: { contains: 'test' } },
            { email: { contains: 'example' } },
            { email: { contains: 'demo' } },
            { firstName: { contains: 'Test' } },
            { firstName: { contains: 'Demo' } },
            { firstName: { contains: 'Sample' } }
          ]
        },
        take: 20,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          churchId: true
        }
      });

      this.log('ERROR', 'Test/Demo data found', { 
        testDataCount: emailPatterns.length,
        examples: emailPatterns.slice(0, 5)
      });

      return {
        totalMembers,
        membersByChurch,
        churches,
        sampleMembers,
        memberCreationDates,
        testDataFound: emailPatterns
      };

    } catch (error) {
      this.log('ERROR', 'Database investigation failed', { error: error.message });
      throw error;
    }
  }

  // Check for seed data or migration artifacts
  async checkForSeedData() {
    console.log('\n🌱 CHECKING FOR SEED DATA...');

    try {
      // Look for patterns that suggest seeded data
      
      // Check for sequential IDs or patterns
      const memberIdPatterns = await this.prisma.members.findMany({
        take: 20,
        select: {
          id: true,
          firstName: true,
          email: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      this.log('INFO', 'Earliest member records', { earliest: memberIdPatterns });

      // Check for bulk insertions (many members created at same time)
      const bulkInsertions = await this.prisma.$queryRaw`
        SELECT DATE(created_at) as creation_date, COUNT(*) as member_count
        FROM members
        GROUP BY DATE(created_at)
        HAVING COUNT(*) > 100
        ORDER BY member_count DESC
        LIMIT 10
      `;

      this.log('ERROR', 'Bulk insertion dates (suspicious)', { bulkDates: bulkInsertions });

      // Check for pattern in names/emails
      const namePatterns = await this.prisma.members.findMany({
        where: {
          OR: [
            { firstName: { startsWith: 'User' } },
            { firstName: { startsWith: 'Member' } },
            { firstName: { startsWith: 'Test' } },
            { email: { contains: '@test.com' } },
            { email: { contains: '@example.com' } },
            { email: { contains: 'test+' } }
          ]
        },
        take: 10,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      });

      this.log('ERROR', 'Generated/Pattern names found', { 
        patternCount: namePatterns.length,
        examples: namePatterns
      });

      return {
        memberIdPatterns,
        bulkInsertions,
        namePatterns
      };

    } catch (error) {
      this.log('ERROR', 'Seed data check failed', { error: error.message });
      throw error;
    }
  }

  // Identify what should be cleaned up
  async identifyCleanupNeeds() {
    console.log('\n🧹 IDENTIFYING CLEANUP NEEDS...');

    try {
      // Count legitimate vs test data
      const testDataCount = await this.prisma.members.count({
        where: {
          OR: [
            { email: { contains: 'test' } },
            { email: { contains: 'example' } },
            { email: { contains: 'demo' } },
            { firstName: { contains: 'Test' } },
            { firstName: { contains: 'Demo' } },
            { firstName: { contains: 'Sample' } },
            { firstName: { startsWith: 'User' } },
            { firstName: { startsWith: 'Member' } }
          ]
        }
      });

      const legitimateDataCount = await this.prisma.members.count({
        where: {
          AND: [
            { email: { not: { contains: 'test' } } },
            { email: { not: { contains: 'example' } } },
            { email: { not: { contains: 'demo' } } },
            { firstName: { not: { contains: 'Test' } } },
            { firstName: { not: { contains: 'Demo' } } },
            { firstName: { not: { contains: 'Sample' } } },
            { firstName: { not: { startsWith: 'User' } } },
            { firstName: { not: { startsWith: 'Member' } } }
          ]
        }
      });

      this.log('ERROR', 'Data breakdown analysis', {
        testData: testDataCount,
        legitimateData: legitimateDataCount,
        total: testDataCount + legitimateDataCount
      });

      // Check church-specific data
      for (const church of await this.prisma.churches.findMany()) {
        const churchMemberCount = await this.prisma.members.count({
          where: { churchId: church.id }
        });

        const churchTestCount = await this.prisma.members.count({
          where: {
            churchId: church.id,
            OR: [
              { email: { contains: 'test' } },
              { firstName: { contains: 'Test' } },
              { firstName: { startsWith: 'User' } }
            ]
          }
        });

        this.log('WARNING', `Church ${church.name} data breakdown`, {
          churchId: church.id,
          totalMembers: churchMemberCount,
          testMembers: churchTestCount,
          legitimateMembers: churchMemberCount - churchTestCount
        });
      }

      return {
        testDataCount,
        legitimateDataCount,
        cleanupRecommendation: testDataCount > legitimateDataCount ? 'MAJOR_CLEANUP_NEEDED' : 'MINOR_CLEANUP_NEEDED'
      };

    } catch (error) {
      this.log('ERROR', 'Cleanup analysis failed', { error: error.message });
      throw error;
    }
  }

  // Generate cleanup recommendations
  generateCleanupRecommendations(investigationResults) {
    const recommendations = [];

    if (investigationResults.totalMembers > 10000) {
      recommendations.push('❌ CRITICAL: Database contains excessive test/seed data (>10K members)');
      recommendations.push('🧹 IMMEDIATE: Run database cleanup to remove test data');
    }

    if (investigationResults.testDataFound.length > 0) {
      recommendations.push('⚠️ WARNING: Test data patterns found in production database');
      recommendations.push('🔍 INVESTIGATE: Verify which data is legitimate vs test data');
    }

    recommendations.push('📊 VERIFY: Confirm actual membership numbers with church administrators');
    recommendations.push('🔐 BACKUP: Create backup before any cleanup operations');
    recommendations.push('🧪 TEST: Use separate test database for development/testing');

    return recommendations;
  }

  // Run comprehensive database investigation
  async runInvestigation() {
    console.log('🚨 STARTING DATABASE DATA INVESTIGATION...\n');
    console.log('🕒 Started at:', new Date().toISOString());

    try {
      const memberData = await this.investigateMemberData();
      const seedData = await this.checkForSeedData();
      const cleanupAnalysis = await this.identifyCleanupNeeds();

      const recommendations = this.generateCleanupRecommendations(memberData);

      // Generate summary
      const summary = {
        investigation: {
          totalMembers: memberData.totalMembers,
          churchCount: memberData.churches.length,
          testDataFound: memberData.testDataFound.length,
          legitimateData: cleanupAnalysis.legitimateDataCount,
          cleanupRecommendation: cleanupAnalysis.cleanupRecommendation
        },
        churches: memberData.churches,
        memberDistribution: memberData.membersByChurch,
        recommendations: recommendations,
        detailedFindings: {
          memberData,
          seedData,
          cleanupAnalysis
        }
      };

      console.log('\n' + '='.repeat(80));
      console.log('💥 DATABASE INVESTIGATION SUMMARY');
      console.log('='.repeat(80));
      console.log(`📊 Total Members: ${summary.investigation.totalMembers}`);
      console.log(`⛪ Churches: ${summary.investigation.churchCount}`);
      console.log(`🧪 Test Data Found: ${summary.investigation.testDataFound}`);
      console.log(`✅ Legitimate Data: ${summary.investigation.legitimateData}`);
      console.log(`🚨 Cleanup Status: ${summary.investigation.cleanupRecommendation}`);
      console.log('='.repeat(80));

      // Show critical recommendations
      console.log('\n🚨 CRITICAL RECOMMENDATIONS:');
      recommendations.forEach((rec, idx) => {
        console.log(`${idx + 1}. ${rec}`);
      });

      return summary;

    } catch (error) {
      console.error('💥 Database investigation failed:', error);
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }
}

// Execute investigation if run directly
if (require.main === module) {
  const investigator = new DatabaseInvestigator();
  investigator.runInvestigation()
    .then(summary => {
      // Save results
      const fs = require('fs');
      const resultsPath = '/workspaces/PURPOSE-DRIVEN/DATABASE_INVESTIGATION_REPORT.json';
      fs.writeFileSync(resultsPath, JSON.stringify(summary, null, 2));
      console.log(`📄 Investigation results saved to: ${resultsPath}`);
      
      process.exit(summary.investigation.cleanupRecommendation === 'MAJOR_CLEANUP_NEEDED' ? 1 : 0);
    })
    .catch(error => {
      console.error('💥 Database investigation failed:', error);
      process.exit(1);
    });
}

module.exports = DatabaseInvestigator;