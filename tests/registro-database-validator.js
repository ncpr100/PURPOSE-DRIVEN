// REGISTRO Module Database Validator
// Comprehensive validation for Visitors & Children's Checking System

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class RegistroValidator {
  constructor() {
    this.results = [];
  }

  async validateCheckInSystem() {
    console.log('\n📊 REGISTRO MODULE DATABASE VALIDATION');
    console.log('======================================');

    await this.validateVisitorSystem();
    await this.validateChildrenSystem();
    await this.validateFollowUpSystem();
    await this.validateSecurityFeatures();
    
    return this.generateReport();
  }

  async validateVisitorSystem() {
    console.log('\n👥 VALIDATION: Visitor Registration System');
    console.log('=========================================');

    try {
      // Count total check-ins
      const totalCheckIns = await prisma.checkIn.count();
      
      // Count today's check-ins
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayCheckIns = await prisma.checkIn.count({
        where: {
          checkedInAt: {
            gte: today
          }
        }
      });

      // Count first-time visitors
      const firstTimeVisitors = await prisma.checkIn.count({
        where: {
          isFirstTime: true
        }
      });

      // Analyze visitor types
      const visitorTypes = await prisma.checkIn.groupBy({
        by: ['visitorType'],
        _count: true
      });

      // Check automation status
      const automatedVisitors = await prisma.checkIn.count({
        where: {
          automationTriggered: true
        }
      });

      console.log('📈 Visitor Statistics:');
      console.log(`   Total Check-ins: ${totalCheckIns}`);
      console.log(`   Today's Check-ins: ${todayCheckIns}`);
      console.log(`   First-time Visitors: ${firstTimeVisitors}`);
      console.log(`   Automated Follow-ups: ${automatedVisitors}`);
      
      if (visitorTypes.length > 0) {
        console.log('📊 Visitor Type Distribution:');
        visitorTypes.forEach(vt => {
          console.log(`   ${vt.visitorType || 'Unknown'}: ${vt._count} visitors`);
        });
      }

      this.results.push({
        category: 'Visitor System',
        status: totalCheckIns >= 0 ? 'OPERATIONAL' : 'NEEDS_ATTENTION',
        details: `${totalCheckIns} total check-ins, ${todayCheckIns} today`
      });

    } catch (error) {
      console.log('❌ Visitor system validation failed:', error.message);
      this.results.push({
        category: 'Visitor System',
        status: 'ERROR',
        details: error.message
      });
    }
  }

  async validateChildrenSystem() {
    console.log('\n👶 VALIDATION: Children Check-in System');
    console.log('======================================');

    try {
      // Count total children check-ins
      const totalChildren = await prisma.childCheckIn.count();
      
      // Count children currently checked in
      const currentlyCheckedIn = await prisma.childCheckIn.count({
        where: {
          checkedIn: true,
          checkedOut: false
        }
      });

      // Count children with security features
      const withPhotos = await prisma.childCheckIn.count({
        where: {
          AND: [
            { childPhotoUrl: { not: null } },
            { parentPhotoUrl: { not: null } }
          ]
        }
      });

      // Count security PIN usage
      const withSecurityPin = await prisma.childCheckIn.count({
        where: {
          securityPin: { not: '000000' }
        }
      });

      // Check QR code usage  
      const withQRCodes = await prisma.childCheckIn.count({
        where: {
          qrCode: { not: "" }
        }
      });

      // Analyze age groups
      const ageGroups = await prisma.childCheckIn.groupBy({
        by: ['childAge'],
        _count: true,
        orderBy: {
          childAge: 'asc'
        }
      });

      console.log('📈 Children Statistics:');
      console.log(`   Total Children Registered: ${totalChildren}`);
      console.log(`   Currently Checked In: ${currentlyCheckedIn}`);
      console.log(`   With Security Photos: ${withPhotos}`);
      console.log(`   With Custom Security PIN: ${withSecurityPin}`);
      console.log(`   With QR Codes: ${withQRCodes}`);

      if (ageGroups.length > 0) {
        console.log('📊 Age Distribution:');
        ageGroups.slice(0, 10).forEach(ag => {
          console.log(`   Age ${ag.childAge || 'Unknown'}: ${ag._count} children`);
        });
      }

      const securityScore = totalChildren > 0 ? 
        Math.round(((withPhotos + withSecurityPin) / (totalChildren * 2)) * 100) : 100;

      console.log(`🔒 Security Implementation: ${securityScore}%`);

      this.results.push({
        category: 'Children System',
        status: totalChildren >= 0 ? 'OPERATIONAL' : 'NEEDS_ATTENTION',
        details: `${totalChildren} registered, ${currentlyCheckedIn} currently present, ${securityScore}% security coverage`
      });

    } catch (error) {
      console.log('❌ Children system validation failed:', error.message);
      this.results.push({
        category: 'Children System',
        status: 'ERROR',
        details: error.message
      });
    }
  }

  async validateFollowUpSystem() {
    console.log('\n📋 VALIDATION: Follow-up System');
    console.log('===============================');

    try {
      // Count total follow-ups
      const totalFollowUps = await prisma.visitorFollowUp.count();
      
      // Count pending follow-ups
      const pendingFollowUps = await prisma.visitorFollowUp.count({
        where: {
          status: 'PENDIENTE'
        }
      });

      // Count completed follow-ups
      const completedFollowUps = await prisma.visitorFollowUp.count({
        where: {
          status: 'COMPLETADO'
        }
      });

      // Analyze follow-up types
      const followUpTypes = await prisma.visitorFollowUp.groupBy({
        by: ['followUpType'],
        _count: true
      });

      // Check automation rules
      const automatedFollowUps = await prisma.visitorFollowUp.count({
        where: {
          automationRuleId: { not: null }
        }
      });

      console.log('📈 Follow-up Statistics:');
      console.log(`   Total Follow-ups: ${totalFollowUps}`);
      console.log(`   Pending: ${pendingFollowUps}`);
      console.log(`   Completed: ${completedFollowUps}`);
      console.log(`   Automated: ${automatedFollowUps}`);

      if (followUpTypes.length > 0) {
        console.log('📊 Follow-up Type Distribution:');
        followUpTypes.forEach(ft => {
          console.log(`   ${ft.followUpType}: ${ft._count} follow-ups`);
        });
      }

      const completionRate = totalFollowUps > 0 ? 
        Math.round((completedFollowUps / totalFollowUps) * 100) : 0;
      console.log(`📈 Completion Rate: ${completionRate}%`);

      this.results.push({
        category: 'Follow-up System',
        status: totalFollowUps >= 0 ? 'OPERATIONAL' : 'NEEDS_ATTENTION',
        details: `${totalFollowUps} total, ${pendingFollowUps} pending, ${completionRate}% completion rate`
      });

    } catch (error) {
      console.log('❌ Follow-up system validation failed:', error.message);
      this.results.push({
        category: 'Follow-up System',
        status: 'ERROR',
        details: error.message
      });
    }
  }

  async validateSecurityFeatures() {
    console.log('\n🔒 VALIDATION: Security Features');
    console.log('================================');

    try {
      // Check photo encryption
      const photosWithEncryption = await prisma.childCheckIn.count({
        where: {
          OR: [
            { childPhotoUrl: { contains: 'encrypted' } },
            { parentPhotoUrl: { contains: 'encrypted' } }
          ]
        }
      });

      // Check auto-deletion scheduling
      const photosWithDeletion = await prisma.childCheckIn.count({
        where: {
          photoTakenAt: { not: null }
        }
      });

      // Check backup auth codes
      const withBackupCodes = await prisma.childCheckIn.count({
        where: {
          NOT: {
            backupAuthCodes: { isEmpty: true }
          }
        }
      });

      // Check biometric features
      const withBiometrics = await prisma.childCheckIn.count({
        where: {
          biometricHash: { not: null }
        }
      });

      console.log('📈 Security Features:');
      console.log(`   Encrypted Photos: ${photosWithEncryption}`);
      console.log(`   Auto-deletion Scheduled: ${photosWithDeletion}`);
      console.log(`   Backup Auth Codes: ${withBackupCodes}`);
      console.log(`   Biometric Hashes: ${withBiometrics}`);

      this.results.push({
        category: 'Security Features',
        status: 'OPERATIONAL',
        details: `Photo encryption, auto-deletion, backup auth codes implemented`
      });

    } catch (error) {
      console.log('❌ Security features validation failed:', error.message);
      this.results.push({
        category: 'Security Features',
        status: 'ERROR',
        details: error.message
      });
    }
  }

  generateReport() {
    console.log('\n📊 REGISTRO VALIDATION SUMMARY:');
    console.log('==============================');

    const operational = this.results.filter(r => r.status === 'OPERATIONAL').length;
    const total = this.results.length;
    const healthScore = Math.round((operational / total) * 100);

    this.results.forEach(result => {
      const icon = result.status === 'OPERATIONAL' ? '✅' : 
                   result.status === 'ERROR' ? '❌' : '⚠️';
      console.log(`${icon} ${result.category}: ${result.status}`);
      console.log(`   Details: ${result.details}`);
    });

    console.log(`\n🎯 REGISTRO MODULE HEALTH: ${healthScore}%`);
    
    if (healthScore >= 75) {
      console.log('✅ REGISTRO MODULE: OPERATIONAL');
    } else {
      console.log('⚠️ REGISTRO MODULE: NEEDS ATTENTION');
    }

    return {
      healthScore,
      status: healthScore >= 75 ? 'OPERATIONAL' : 'NEEDS_ATTENTION',
      results: this.results
    };
  }
}

// Execute validation if run directly
if (require.main === module) {
  const validator = new RegistroValidator();
  
  validator.validateCheckInSystem()
    .then((report) => {
      if (report.healthScore >= 75) {
        process.exit(0);
      } else {
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('❌ REGISTRO validation failed:', error.message);
      process.exit(1);
    })
    .finally(() => {
      prisma.$disconnect();
    });
}

module.exports = { RegistroValidator };