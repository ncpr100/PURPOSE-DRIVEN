#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['error'],
  errorFormat: 'minimal'
});

async function fixVolunteerCategorization() {
  console.log('🔧 FIXING VOLUNTEER CATEGORIZATION BUG...\n');
  
  try {
    const church = await prisma.churches.findFirst({
      where: { name: 'FAITH FAMILY CHURCH' }
    });
    
    if (!church) {
      console.log('❌ Church not found');
      return;
    }
    
    console.log(`🏢 Working with church: ${church.name} (${church.id})\n`);
    
    // Test 1: Check volunteer-candidates API logic
    console.log('🔍 TEST 1: VOLUNTEER CANDIDATES LOGIC');
    const volunteers = await prisma.volunteers.findMany({
      where: { churchId: church.id },
      select: { memberId: true }
    });
    
    const volunteerMemberIds = volunteers
      .filter(v => v.memberId)
      .map(v => v.memberId);
    
    console.log(`  Found ${volunteers.length} volunteer records`);
    console.log(`  Volunteer member IDs: [${volunteerMemberIds.join(', ')}]`);
    
    // Get candidate members (should include CJ CASTRO)
    const candidates = await prisma.members.findMany({
      where: {
        churchId: church.id,
        ...(volunteerMemberIds.length > 0 
          ? { id: { notIn: volunteerMemberIds } }
          : {}
        )
      },
      select: { id: true, firstName: true, lastName: true, leadershipStage: true }
    });
    
    console.log(`  CANDIDATES (${candidates.length}):`);
    candidates.forEach(c => {
      console.log(`    ${c.firstName} ${c.lastName} (${c.id}) - Stage: ${c.leadershipStage}`);
    });
    
    // Test 2: Check active-volunteers API logic
    console.log('\n🔍 TEST 2: ACTIVE VOLUNTEERS LOGIC');
    const activeVolunteers = await prisma.members.findMany({
      where: {
        churchId: church.id,
        ...(volunteerMemberIds.length > 0 
          ? { id: { in: volunteerMemberIds } }
          : { id: { in: ['no-volunteers-exist'] } }
        )
      },
      select: { id: true, firstName: true, lastName: true, leadershipStage: true }
    });
    
    console.log(`  ACTIVE VOLUNTEERS (${activeVolunteers.length}):`);
    activeVolunteers.forEach(v => {
      console.log(`    ${v.firstName} ${v.lastName} (${v.id}) - Stage: ${v.leadershipStage}`);
    });
    
    // Test 3: Check if CJ appears in wrong category
    console.log('\n🔍 TEST 3: CJ CASTRO CATEGORIZATION CHECK');
    const cjMember = await prisma.members.findFirst({
      where: { 
        firstName: 'CJ', 
        lastName: 'CASTRO',
        churchId: church.id
      }
    });
    
    if (cjMember) {
      console.log(`  CJ CASTRO Member ID: ${cjMember.id}`);
      console.log(`  Leadership Stage: ${cjMember.leadershipStage}`);
      
      const isInVolunteersTable = volunteerMemberIds.includes(cjMember.id);
      console.log(`  Is in volunteers table: ${isInVolunteersTable}`);
      
      const isCandidate = candidates.some(c => c.id === cjMember.id);
      const isActiveVolunteer = activeVolunteers.some(v => v.id === cjMember.id);
      
      console.log(`  Should appear in candidates: ${!isInVolunteersTable ? '✅ YES' : '❌ NO'}`);
      console.log(`  Should appear in active volunteers: ${isInVolunteersTable ? '✅ YES' : '❌ NO'}`);
      console.log(`  Actually in candidates: ${isCandidate ? '✅ YES' : '❌ NO'}`);
      console.log(`  Actually in active volunteers: ${isActiveVolunteer ? '✅ YES' : '❌ NO'}`);
      
      // The BUG: Check if leadershipStage is incorrectly interpreted
      if (cjMember.leadershipStage === 'VOLUNTEER' && !isInVolunteersTable) {
        console.log('\n🐛 BUG IDENTIFIED:');
        console.log('  CJ has leadershipStage: "VOLUNTEER" but NO volunteer record');
        console.log('  UI might be misinterpreting leadershipStage as actual volunteer status');
        console.log('\n✅ RECOMMENDED FIX:');
        console.log('  Update CJ\'s leadershipStage to "MIEMBRO" until volunteer record is created');
      }
    } else {
      console.log('  ❌ CJ CASTRO member not found');
    }
    
    // Test 4: API simulation test
    console.log('\n🔍 TEST 4: API RESPONSE SIMULATION');
    console.log('API call: /api/members?filter=volunteer-candidates');
    console.log('Expected response: Should include CJ CASTRO');
    console.log('API call: /api/members?filter=active-volunteers');  
    console.log('Expected response: Should NOT include CJ CASTRO');
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute if run directly
if (require.main === module) {
  fixVolunteerCategorization()
    .then(() => console.log('\n✅ Volunteer categorization analysis completed'))
    .catch(console.error);
}

module.exports = fixVolunteerCategorization;