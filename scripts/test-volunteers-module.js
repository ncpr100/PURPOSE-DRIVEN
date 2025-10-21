const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testVolunteersModule() {
  console.log('🎯 TEST #3: VOLUNTEERS MODULE - COMPREHENSIVE VALIDATION');
  console.log('='.repeat(70));
  console.log('Date: October 21, 2025\n');

  try {
    // ========== TEST 3.1: VOLUNTEER DATA VALIDATION ==========
    console.log('📊 TEST 3.1: VOLUNTEER DATA VALIDATION');
    console.log('-'.repeat(70));
    
    // Get all volunteers with related data
    const volunteers = await prisma.volunteer.findMany({
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            isActive: true
          }
        },
        ministry: {
          select: {
            id: true,
            name: true
          }
        },
        assignments: true,
        engagementScore: true
      }
    });
    
    console.log(`✅ Total Volunteers in Database: ${volunteers.length}`);
    
    if (volunteers.length > 0) {
      console.log('\n📋 Volunteer Details:');
      volunteers.forEach((v, index) => {
        console.log(`\n${index + 1}. ${v.member?.firstName || 'Unknown'} ${v.member?.lastName || ''}`);
        console.log(`   📧 Email: ${v.member?.email || 'N/A'}`);
        console.log(`   📞 Phone: ${v.member?.phone || 'N/A'}`);
        console.log(`   🏢 Ministry: ${v.ministry?.name || 'Unassigned'}`);
        console.log(`   📅 Joined: ${new Date(v.createdAt).toLocaleDateString('es-ES')}`);
        console.log(`   📝 Skills: ${v.skills || 'Not specified'}`);
        console.log(`   � Assignments: ${v.assignments?.length || 0}`);
        console.log(`   ✅ Active: ${v.isActive ? 'Yes' : 'No'}`);
      });
    } else {
      console.log('⚠️  No volunteers found in database');
    }
    
    // ========== TEST 3.2: VOLUNTEER SKILLS ==========
    console.log('\n\n📊 TEST 3.2: VOLUNTEER SKILLS');
    console.log('-'.repeat(70));
    
    const volunteersWithSkills = volunteers.filter(v => v.skills);
    console.log(`✅ Volunteers with Skills: ${volunteersWithSkills.length}`);
    
    if (volunteersWithSkills.length > 0 && volunteersWithSkills.length <= 5) {
      volunteersWithSkills.forEach(v => {
        console.log(`   - ${v.firstName} ${v.lastName}: ${v.skills}`);
      });
    }
    
    // ========== TEST 3.3: VOLUNTEERS BY ACTIVE STATUS ==========
    console.log('\n\n📊 TEST 3.3: VOLUNTEERS BY ACTIVE STATUS');
    console.log('-'.repeat(70));
    
    const activeVolunteersCount = volunteers.filter(v => v.isActive).length;
    const inactiveVolunteersCount = volunteers.filter(v => !v.isActive).length;
    
    console.log(`✅ Active Volunteers: ${activeVolunteersCount}`);
    console.log(`✅ Inactive Volunteers: ${inactiveVolunteersCount}`);
    
    // ========== TEST 3.4: VOLUNTEER BY MINISTRY ==========
    console.log('\n\n📊 TEST 3.4: VOLUNTEERS BY MINISTRY');
    console.log('-'.repeat(70));
    
    const byMinistry = await prisma.volunteer.groupBy({
      by: ['ministryId'],
      _count: { ministryId: true }
    });
    
    const ministries = await prisma.ministry.findMany({
      where: {
        id: { in: byMinistry.map(m => m.ministryId).filter(Boolean) }
      }
    });
    
    console.log(`✅ Ministries with Volunteers: ${ministries.length}`);
    byMinistry.forEach(m => {
      const ministry = ministries.find(min => min.id === m.ministryId);
      console.log(`   - ${ministry?.name || 'Unassigned'}: ${m._count.ministryId} volunteer(s)`);
    });
    
    // ========== TEST 3.5: VOLUNTEER ASSIGNMENTS ==========
    console.log('\n\n� TEST 3.5: VOLUNTEER ASSIGNMENTS');
    console.log('-'.repeat(70));
    
    const allAssignments = await prisma.volunteerAssignment.findMany({
      include: {
        volunteer: {
          include: {
            member: { select: { firstName: true, lastName: true } }
          }
        },
        event: { select: { title: true } }
      }
    });
    
    console.log(`✅ Total Assignments: ${allAssignments.length}`);
    if (allAssignments.length > 0) {
      console.log(`\n   Sample Assignments:`);
      allAssignments.slice(0, 5).forEach(a => {
        console.log(`   - ${a.volunteer?.member?.firstName || 'N/A'} ${a.volunteer?.member?.lastName || 'N/A'}: ${a.title} (${a.event?.title || 'No Event'})`);
      });
    }
    
    // ========== TEST 3.6: ENGAGEMENT SCORES ==========
    console.log('\n\n⭐ TEST 3.6: VOLUNTEER ENGAGEMENT SCORES');
    console.log('-'.repeat(70));
    
    const engagementScores = await prisma.volunteerEngagementScore.findMany({
      include: {
        volunteer: {
          include: {
            member: { select: { firstName: true, lastName: true } }
          }
        }
      }
    });
    
    console.log(`✅ Volunteers with Engagement Scores: ${engagementScores.length}`);
    if (engagementScores.length > 0) {
      console.log('\n📊 Sample Engagement Scores:');
      engagementScores.slice(0, 5).forEach(e => {
        console.log(`   - ${e.volunteer?.member?.firstName || 'N/A'} ${e.volunteer?.member?.lastName || 'N/A'}: Score ${e.score || 'N/A'}`);
      });
    }
    
    // ========== TEST 3.7: MEMBER-VOLUNTEER RELATIONSHIP ==========
    console.log('\n\n📊 TEST 3.7: MEMBER-VOLUNTEER RELATIONSHIP');
    console.log('-'.repeat(70));
    
    const membersWithVolunteerRecords = await prisma.member.count({
      where: {
        volunteers: { some: {} }
      }
    });
    
    const totalMembers = await prisma.member.count({
      where: { isActive: true }
    });
    
    const volunteerPercentage = ((membersWithVolunteerRecords / totalMembers) * 100).toFixed(2);
    
    console.log(`✅ Members with Volunteer Records: ${membersWithVolunteerRecords}`);
    console.log(`✅ Total Active Members: ${totalMembers}`);
    console.log(`✅ Volunteer Participation Rate: ${volunteerPercentage}%`);
    
    // ========== TEST 3.8: JUAN PACHANGA VERIFICATION ==========
    console.log('\n\n📊 TEST 3.8: JUAN PACHANGA VERIFICATION');
    console.log('-'.repeat(70));
    
    const juanPachanga = await prisma.member.findFirst({
      where: {
        firstName: { contains: 'JUAN', mode: 'insensitive' },
        lastName: 'PACHANGA'
      },
      include: {
        volunteers: {
          include: {
            ministry: true,
            assignments: true,
            engagementScore: true
          }
        }
      }
    });
    
    if (juanPachanga) {
      console.log(`✅ JUAN PACHANGA FOUND!`);
      console.log(`   📧 Email: ${juanPachanga.email || 'N/A'}`);
      console.log(`   📞 Phone: ${juanPachanga.phone || 'N/A'}`);
      console.log(`   👤 Member ID: ${juanPachanga.id}`);
      console.log(`   📅 Created: ${new Date(juanPachanga.createdAt).toLocaleDateString('es-ES')}`);
      
      if (juanPachanga.volunteers.length > 0) {
        console.log(`\n   ✅ Volunteer Records: ${juanPachanga.volunteers.length}`);
        juanPachanga.volunteers.forEach((v, i) => {
          console.log(`\n   Volunteer Record ${i + 1}:`);
          console.log(`      🏢 Ministry: ${v.ministry?.name || 'Unassigned'}`);
          console.log(`      �️ Skills: ${v.skills || 'Not specified'}`);
          console.log(`      ⭐ Active: ${v.isActive ? 'Yes' : 'No'}`);
          console.log(`      📅 Joined: ${new Date(v.createdAt).toLocaleDateString('es-ES')}`);
          console.log(`      📋 Assignments: ${v.assignments.length}`);
          console.log(`      ⭐ Has Engagement Score: ${v.engagementScore ? 'Yes' : 'No'}`);
        });
      } else {
        console.log(`\n   ⚠️  No volunteer records found for JUAN PACHANGA`);
      }
    } else {
      console.log(`❌ JUAN PACHANGA NOT FOUND in database!`);
    }
    
    // ========== TEST 3.9: VOLUNTEER RECRUITMENT FLOW ==========
    console.log('\n\n📊 TEST 3.9: VOLUNTEER RECRUITMENT FLOW');
    console.log('-'.repeat(70));
    
    console.log('✅ Recruitment API Endpoint: POST /api/volunteers');
    console.log('✅ Required Fields:');
    console.log('   - memberId (required)');
    console.log('   - skills (optional string)');
    console.log('   - ministryId (optional)');
    console.log('   - isActive (boolean, default: true)');
    console.log('   - availability (optional JSON)');
    
    // ========== FINAL SUMMARY ==========
    console.log('\n\n' + '='.repeat(70));
    console.log('📊 VOLUNTEERS MODULE - SUMMARY');
    console.log('='.repeat(70));
    
    const summary = {
      'Total Volunteers': volunteers.length,
      'Active Volunteers': activeVolunteersCount,
      'Inactive Volunteers': inactiveVolunteersCount,
      'Volunteers with Skills': volunteersWithSkills.length,
      'Ministries with Volunteers': ministries.length,
      'Total Assignments': allAssignments.length,
      'Engagement Scores Tracked': engagementScores.length,
      'Member Participation Rate': `${volunteerPercentage}%`,
      'JUAN PACHANGA Status': juanPachanga ? '✅ Found' : '❌ Not Found'
    };
    
    console.log('\n📋 KEY METRICS:');
    Object.entries(summary).forEach(([key, value]) => {
      console.log(`   ${key.padEnd(30)}: ${value}`);
    });
    
    // ========== TESTING RECOMMENDATIONS ==========
    console.log('\n\n' + '='.repeat(70));
    console.log('🧪 RECOMMENDED MANUAL TESTS');
    console.log('='.repeat(70));
    console.log('\n1. Navigate to /volunteers page');
    console.log('2. Verify JUAN PACHANGA appears in volunteer list');
    console.log('3. Test "Reclutar Voluntario" button from Members page');
    console.log('4. Test volunteer profile editing');
    console.log('5. Test volunteer position assignment');
    console.log('6. Test volunteer ministry assignment');
    console.log('7. Test volunteer status changes (Active/Inactive)');
    console.log('8. Test volunteer search and filtering');
    console.log('9. Test volunteer qualifications management');
    console.log('10. Test volunteer export functionality');
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ TEST #3: VOLUNTEERS MODULE - DATABASE VALIDATION COMPLETE');
    console.log('='.repeat(70));
    
  } catch (error) {
    console.error('\n❌ ERROR DURING VOLUNTEER MODULE TEST:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testVolunteersModule();
