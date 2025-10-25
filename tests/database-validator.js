/**
 * DATABASE VALIDATION UTILITIES
 * 
 * Comprehensive database integrity checks for volunteer system
 * Addresses data consistency and relationship validation
 */

const { PrismaClient } = require('@prisma/client');

class DatabaseValidator {
  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * VAL-01 Support: Validate volunteer creation capability
   */
  async validateVolunteerCreationCapacity() {
    console.log('📊 DATABASE VALIDATION: Volunteer Creation Capacity');
    console.log('================================================');
    
    try {
      // Check member availability
      const totalMembers = await this.prisma.member.count({
        where: { isActive: true }
      });
      
      // Check existing volunteers
      const totalVolunteers = await this.prisma.volunteer.count();
      
      // Check member-volunteer relationships
      const linkedVolunteers = await this.prisma.volunteer.count({
        where: { memberId: { not: null } }
      });
      
      console.log('📈 Current Statistics:');
      console.log(`   Active Members: ${totalMembers}`);
      console.log(`   Total Volunteers: ${totalVolunteers}`);
      console.log(`   Member-Volunteer Links: ${linkedVolunteers}`);
      console.log(`   Available for Recruitment: ${totalMembers - linkedVolunteers}`);
      
      const hasCapacity = (totalMembers - linkedVolunteers) > 0;
      console.log(`   Recruitment Capacity: ${hasCapacity ? '✅ AVAILABLE' : '❌ FULL'}`);
      
      return {
        hasCapacity,
        availableMembers: totalMembers - linkedVolunteers,
        stats: { totalMembers, totalVolunteers, linkedVolunteers }
      };
      
    } catch (error) {
      console.error('❌ Database validation error:', error.message);
      return { hasCapacity: false, error: error.message };
    }
  }

  /**
   * VAL-02 Support: Validate CUID consistency
   */
  async validateCUIDConsistency() {
    console.log('🔍 DATABASE VALIDATION: CUID Consistency Check');
    console.log('==============================================');
    
    try {
      // Check member ID formats
      const members = await this.prisma.member.findMany({
        select: { id: true },
        take: 10
      });
      
      // Check volunteer ID formats  
      const volunteers = await this.prisma.volunteer.findMany({
        select: { id: true, memberId: true },
        take: 10
      });
      
      console.log('📋 CUID Format Analysis:');
      
      // Analyze member IDs
      const memberLengths = members.map(m => m.id.length);
      const uniqueMemberLengths = [...new Set(memberLengths)];
      console.log(`   Member ID lengths: ${uniqueMemberLengths.join(', ')}`);
      
      // Analyze volunteer IDs
      const volunteerLengths = volunteers.map(v => v.id.length);
      const uniqueVolunteerLengths = [...new Set(volunteerLengths)];
      console.log(`   Volunteer ID lengths: ${uniqueVolunteerLengths.join(', ')}`);
      
      // Check member-volunteer ID consistency
      const linkedVolunteers = volunteers.filter(v => v.memberId);
      const memberIdLengths = linkedVolunteers.map(v => v.memberId?.length || 0);
      const uniqueMemberIdLengths = [...new Set(memberIdLengths)];
      console.log(`   Member ID (in volunteers) lengths: ${uniqueMemberIdLengths.join(', ')}`);
      
      const isConsistent = uniqueMemberLengths.length <= 2 && uniqueVolunteerLengths.length <= 2;
      console.log(`   CUID Consistency: ${isConsistent ? '✅ VALID' : '❌ INCONSISTENT'}`);
      
      return {
        isConsistent,
        memberLengths: uniqueMemberLengths,
        volunteerLengths: uniqueVolunteerLengths,
        linkedMemberLengths: uniqueMemberIdLengths
      };
      
    } catch (error) {
      console.error('❌ CUID validation error:', error.message);
      return { isConsistent: false, error: error.message };
    }
  }

  /**
   * Crown Badge Support: Validate recommendation system
   */
  async validateRecommendationSystem() {
    console.log('👑 DATABASE VALIDATION: Crown Badge Recommendation System');
    console.log('========================================================');
    
    try {
      const recommendations = await this.prisma.volunteerRecommendation.findMany({
        include: {
          member: { select: { firstName: true, lastName: true } },
          ministry: { select: { name: true } }
        },
        take: 5
      });
      
      console.log(`📊 Total Recommendations: ${recommendations.length}`);
      
      if (recommendations.length > 0) {
        console.log('📋 Sample Recommendations:');
        recommendations.forEach((rec, i) => {
          console.log(`   ${i + 1}. ${rec.member?.firstName} ${rec.member?.lastName} → ${rec.ministry?.name} (Score: ${rec.matchScore}%)`);
        });
        console.log('   Crown Badge Status: ✅ FUNCTIONAL (recommendations available)');
      } else {
        console.log('   Crown Badge Status: ❌ NOT FUNCTIONAL (no recommendations)');
      }
      
      return {
        hasRecommendations: recommendations.length > 0,
        count: recommendations.length,
        samples: recommendations.slice(0, 3)
      };
      
    } catch (error) {
      console.error('❌ Recommendation validation error:', error.message);
      return { hasRecommendations: false, error: error.message };
    }
  }

  /**
   * Run comprehensive database validation
   */
  async runFullValidation() {
    console.log('🔍 COMPREHENSIVE DATABASE VALIDATION');
    console.log('===================================\n');
    
    const results = {
      volunteerCapacity: await this.validateVolunteerCreationCapacity(),
      cuidConsistency: await this.validateCUIDConsistency(),
      recommendationSystem: await this.validateRecommendationSystem()
    };
    
    console.log('\n📊 VALIDATION SUMMARY:');
    console.log('=====================');
    console.log(`✓ Volunteer Recruitment: ${results.volunteerCapacity.hasCapacity ? 'READY' : 'BLOCKED'}`);
    console.log(`✓ CUID System: ${results.cuidConsistency.isConsistent ? 'CONSISTENT' : 'INCONSISTENT'}`);
    console.log(`✓ Crown Badge: ${results.recommendationSystem.hasRecommendations ? 'FUNCTIONAL' : 'MISSING DATA'}`);
    
    await this.prisma.$disconnect();
    return results;
  }
}

// Export for testing
module.exports = { DatabaseValidator };

// Auto-run if executed directly
if (require.main === module) {
  const validator = new DatabaseValidator();
  validator.runFullValidation().then(results => {
    const hasIssues = !results.volunteerCapacity.hasCapacity || 
                     !results.cuidConsistency.isConsistent || 
                     !results.recommendationSystem.hasRecommendations;
    
    console.log(`\n${hasIssues ? '⚠️  ISSUES DETECTED' : '✅ ALL SYSTEMS OPERATIONAL'}`);
    process.exit(hasIssues ? 1 : 0);
  });
}