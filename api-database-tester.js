#!/usr/bin/env node
/**
 * 🔍 API ENDPOINT VALIDATION & DATABASE TESTING
 * Tests specific API endpoints and database queries
 */

const { PrismaClient } = require('@prisma/client');

class APITester {
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

  // Test database connectivity and data integrity
  async testDatabaseConnectivity() {
    console.log('\n🗄️  TESTING DATABASE CONNECTIVITY...');
    
    try {
      // Test basic connection
      await this.prisma.$connect();
      this.log('SUCCESS', 'Database connection established');

      // Test user authentication data
      const users = await this.prisma.users.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          churchId: true,
          isActive: true
        },
        take: 10
      });

      this.log('SUCCESS', 'Users table accessible', { 
        userCount: users.length,
        sampleUsers: users.map(u => ({ email: u.email, role: u.role }))
      });

      // Test for the specific test credentials
      const tenantUser = await this.prisma.users.findUnique({
        where: { email: 'cjisok1@gmail.com' },
        select: { id: true, email: true, role: true, churchId: true, isActive: true }
      });

      if (tenantUser) {
        this.log('SUCCESS', 'Tenant test user found', tenantUser);
      } else {
        this.log('ERROR', 'Tenant test user NOT FOUND', { email: 'cjisok1@gmail.com' });
      }

      const superAdminUser = await this.prisma.users.findUnique({
        where: { email: 'soporte@khesed-tek-systems.org' },
        select: { id: true, email: true, role: true, churchId: true, isActive: true }
      });

      if (superAdminUser) {
        this.log('SUCCESS', 'Super admin user found', superAdminUser);
      } else {
        this.log('ERROR', 'Super admin user NOT FOUND', { email: 'soporte@khesed-tek-systems.org' });
      }

      return { tenantUser, superAdminUser, allUsers: users };

    } catch (error) {
      this.log('ERROR', 'Database connectivity failed', { error: error.message });
      throw error;
    }
  }

  // Test Members module data specifically
  async testMembersModuleData() {
    console.log('\n👥 TESTING MEMBERS MODULE DATA...');
    
    try {
      // Get total members count
      const totalMembers = await this.prisma.members.count();
      this.log('INFO', 'Total members in database', { count: totalMembers });

      // Test members by church (multi-tenant check)
      const membersByChurch = await this.prisma.members.groupBy({
        by: ['churchId'],
        _count: true
      });
      
      this.log('INFO', 'Members by church distribution', { 
        churches: membersByChurch.length,
        distribution: membersByChurch 
      });

      // Test volunteer counts (separate table)
      const totalVolunteers = await this.prisma.volunteers.count();
      const activeVolunteers = await this.prisma.volunteers.count({
        where: { isActive: true }
      });

      this.log('INFO', 'Volunteer distribution', { 
        total: totalVolunteers, 
        active: activeVolunteers 
      });

      // Test member active status  
      const activeMembers = await this.prisma.members.count({
        where: { isActive: true }
      });
      const inactiveMembers = await this.prisma.members.count({
        where: { isActive: false }
      });

      this.log('INFO', 'Member active status distribution', { 
        active: activeMembers,
        inactive: inactiveMembers,
        total: activeMembers + inactiveMembers
      });

      // Get sample member data to check structure
      const sampleMembers = await this.prisma.members.findMany({
        take: 5,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          isActive: true,
          leadershipStage: true,
          lifecycle: true,
          churchId: true,
          createdAt: true
        }
      });

      this.log('SUCCESS', 'Sample member data retrieved', { 
        count: sampleMembers.length,
        fields: sampleMembers.length > 0 ? Object.keys(sampleMembers[0]) : []
      });

      // Get sample volunteer data to check structure
      const sampleVolunteers = await this.prisma.volunteers.findMany({
        take: 5,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          isActive: true,
          memberId: true,
          churchId: true,
          skills: true
        }
      });

      this.log('SUCCESS', 'Sample volunteer data retrieved', { 
        count: sampleVolunteers.length,
        fields: sampleVolunteers.length > 0 ? Object.keys(sampleVolunteers[0]) : []
      });

      return {
        totalMembers,
        membersByChurch,
        totalVolunteers,
        activeVolunteers,
        activeMembers,
        inactiveMembers,
        sampleMembers,
        sampleVolunteers
      };

    } catch (error) {
      this.log('ERROR', 'Members module data test failed', { error: error.message });
      throw error;
    }
  }

  // Test specific API endpoints that are mentioned as problematic
  async testProblematicEndpoints() {
    console.log('\n🔧 TESTING POTENTIALLY PROBLEMATIC ENDPOINTS...');

    // This simulates what the frontend would call
    const endpointsToTest = [
      {
        name: 'Members List',
        method: 'GET',
        path: '/api/members',
        expectedFields: ['id', 'firstName', 'lastName', 'email', 'isActive', 'leadershipStage']
      },
      {
        name: 'Volunteers List',
        method: 'GET', 
        path: '/api/volunteers',
        expectedFields: ['id', 'firstName', 'lastName', 'isActive', 'memberId']
      },
      {
        name: 'Active Members Filter',
        method: 'GET',
        path: '/api/members?status=active',
        expectedFields: ['id', 'firstName', 'lastName', 'isActive']
      }
    ];

    for (const endpoint of endpointsToTest) {
      try {
        this.log('INFO', `Testing endpoint: ${endpoint.name}`, { 
          method: endpoint.method, 
          path: endpoint.path 
        });

        // Since we can't make HTTP calls directly from here, 
        // let's test the database queries that these endpoints would use
        await this.simulateEndpointQuery(endpoint);

      } catch (error) {
        this.log('ERROR', `Endpoint test failed: ${endpoint.name}`, { error: error.message });
      }
    }
  }

  // Simulate the database queries that API endpoints would make
  async simulateEndpointQuery(endpoint) {
    let query;
    let result;

    switch (endpoint.path) {
      case '/api/members':
        query = this.prisma.members.findMany({
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            isActive: true,
            leadershipStage: true,
            lifecycle: true,
            churchId: true
          }
        });
        break;

      case '/api/volunteers':
        query = this.prisma.volunteers.findMany({
          where: { isActive: true },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            isActive: true,
            memberId: true,
            churchId: true,
            skills: true
          }
        });
        break;

      case '/api/members?status=active':
        query = this.prisma.members.findMany({
          where: { isActive: true },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            isActive: true,
            churchId: true
          }
        });
        break;

      default:
        this.log('WARNING', 'Unknown endpoint simulation', { path: endpoint.path });
        return;
    }

    result = await query;
    
    this.log('SUCCESS', `Query simulation successful: ${endpoint.name}`, { 
      resultCount: result.length,
      sampleResult: result.length > 0 ? result[0] : null
    });

    return result;
  }

  // Test church data and verify multi-tenancy
  async testChurchData() {
    console.log('\n⛪ TESTING CHURCH DATA & MULTI-TENANCY...');

    try {
      // Get all churches
      const churches = await this.prisma.churches.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          isActive: true,
          _count: {
            select: {
              members: true,
              users: true
            }
          }
        }
      });

      this.log('SUCCESS', 'Churches data retrieved', { 
        churchCount: churches.length,
        churches: churches.map(c => ({
          name: c.name,
          memberCount: c._count.members,
          userCount: c._count.users
        }))
      });

      // Test data isolation
      for (const church of churches) {
        const churchMembers = await this.prisma.members.count({
          where: { churchId: church.id }
        });

        this.log('INFO', `Church isolation test: ${church.name}`, {
          churchId: church.id,
          memberCount: churchMembers,
          expectedCount: church._count.members
        });

        if (churchMembers !== church._count.members) {
          this.log('WARNING', 'Member count mismatch detected', {
            church: church.name,
            actualCount: churchMembers,
            expectedCount: church._count.members
          });
        }
      }

      return churches;

    } catch (error) {
      this.log('ERROR', 'Church data test failed', { error: error.message });
      throw error;
    }
  }

  // Run all database tests
  async runDatabaseTests() {
    console.log('🚀 STARTING DATABASE & API VALIDATION TESTS...\n');

    try {
      const connectivityResult = await this.testDatabaseConnectivity();
      const membersResult = await this.testMembersModuleData();
      const churchesResult = await this.testChurchData();
      await this.testProblematicEndpoints();

      // Generate summary
      const summary = {
        databaseConnected: true,
        usersFound: {
          tenant: !!connectivityResult.tenantUser,
          superAdmin: !!connectivityResult.superAdminUser
        },
        dataIntegrity: {
          totalMembers: membersResult.totalMembers,
          churchCount: churchesResult.length,
          multiTenant: churchesResult.length > 1
        },
        issues: this.results.filter(r => r.level === 'ERROR'),
        warnings: this.results.filter(r => r.level === 'WARNING')
      };

      console.log('\n' + '='.repeat(60));
      console.log('📊 DATABASE VALIDATION SUMMARY');
      console.log('='.repeat(60));
      console.log(`🔌 Database Connected: ${summary.databaseConnected ? 'YES' : 'NO'}`);
      console.log(`👤 Tenant User Found: ${summary.usersFound.tenant ? 'YES' : 'NO'}`);
      console.log(`👑 Super Admin Found: ${summary.usersFound.superAdmin ? 'YES' : 'NO'}`);
      console.log(`📊 Total Members: ${summary.dataIntegrity.totalMembers}`);
      console.log(`⛪ Churches Found: ${summary.dataIntegrity.churchCount}`);
      console.log(`❌ Errors Found: ${summary.issues.length}`);
      console.log(`⚠️  Warnings Found: ${summary.warnings.length}`);
      console.log('='.repeat(60));

      return summary;

    } catch (error) {
      console.error('💥 Database testing failed:', error);
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }
}

// Execute testing if run directly
if (require.main === module) {
  const tester = new APITester();
  tester.runDatabaseTests()
    .then(summary => {
      console.log('\n✅ Database validation completed!');
      
      // Save results
      const fs = require('fs');
      const resultsPath = '/workspaces/PURPOSE-DRIVEN/DATABASE_VALIDATION_REPORT.json';
      fs.writeFileSync(resultsPath, JSON.stringify({
        summary,
        detailedResults: tester.results
      }, null, 2));
      console.log(`📄 Results saved to: ${resultsPath}`);
      
      process.exit(summary.issues.length > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('💥 Database validation failed:', error);
      process.exit(1);
    });
}

module.exports = APITester;