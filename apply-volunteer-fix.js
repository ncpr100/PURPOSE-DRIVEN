#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['error'],
  errorFormat: 'minimal'
});

async function applyVolunteerFix() {
  console.log('🔧 APPLYING VOLUNTEER CATEGORIZATION FIX...\n');
  
  try {
    // Step 1: Update CJ's leadershipStage to prevent UI confusion
    console.log('🔄 STEP 1: Fixing CJ CASTRO leadershipStage');
    const cjMember = await prisma.members.findFirst({
      where: { 
        firstName: 'CJ', 
        lastName: 'CASTRO'
      }
    });
    
    if (cjMember) {
      console.log('Before:', `${cjMember.firstName} ${cjMember.lastName} - Stage: ${cjMember.leadershipStage}`);
      
      const updatedMember = await prisma.members.update({
        where: { id: cjMember.id },
        data: { 
          leadershipStage: 'MIEMBRO' // Change from 'VOLUNTEER' to 'MIEMBRO'
        }
      });
      
      console.log('After:', `${updatedMember.firstName} ${updatedMember.lastName} - Stage: ${updatedMember.leadershipStage}`);
      console.log('✅ CJ now properly categorized as MIEMBRO (not falsely showing as volunteer)');
    } else {
      console.log('❌ CJ CASTRO not found');
    }
    
    // Step 2: Verify the fix worked
    console.log('\n🧪 STEP 2: Verifying Fix');
    const church = await prisma.churches.findFirst({
      where: { name: 'FAITH FAMILY CHURCH' }
    });
    
    if (church) {
      // Check volunteer candidates (should include CJ with corrected stage)
      const volunteers = await prisma.volunteers.findMany({
        where: { churchId: church.id },
        select: { memberId: true }
      });
      
      const volunteerMemberIds = volunteers
        .filter(v => v.memberId)
        .map(v => v.memberId);
      
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
      
      console.log('VOLUNTEER CANDIDATES after fix:');
      candidates.forEach(c => {
        const isCJ = c.firstName === 'CJ' && c.lastName === 'CASTRO';
        console.log(`  ${c.firstName} ${c.lastName} - Stage: ${c.leadershipStage} ${isCJ ? '✅ (Fixed)' : ''}`);
      });
      
      // Check active volunteers (should be empty)
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
      
      console.log('ACTIVE VOLUNTEERS after fix:');
      if (activeVolunteers.length === 0) {
        console.log('  (None) ✅ Correct');
      } else {
        activeVolunteers.forEach(v => {
          console.log(`  ${v.firstName} ${v.lastName} - Stage: ${v.leadershipStage}`);
        });
      }
    }
    
    // Step 3: Create proper volunteer onboarding workflow
    console.log('\n💡 STEP 3: Volunteer Workflow Recommendations');
    console.log('To properly add CJ as a volunteer:');
    console.log('1. Use "Nuevo Voluntario" button in volunteers UI');
    console.log('2. Fill volunteer form linking to CJ\'s member record');
    console.log('3. This creates proper volunteer record in volunteers table');
    console.log('4. CJ will then appear in "SON VOLUNTARIOS" category');
    console.log('5. CJ will disappear from "CANDIDATOS VOLUNTARIOS"');
    
    console.log('\n🎯 EXPECTED RESULT:');
    console.log('- CJ should now appear ONLY in "CANDIDATOS VOLUNTARIOS"');
    console.log('- CJ should NOT appear in "SON VOLUNTARIOS"');
    console.log('- No more duplicate appearance confusion');
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute if run directly
if (require.main === module) {
  applyVolunteerFix()
    .then(() => console.log('\n✅ Volunteer categorization fix completed'))
    .catch(console.error);
}

module.exports = applyVolunteerFix;