#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['error']
});

async function investigateVolunteerLogic() {
  console.log('🔍 INVESTIGATING CJ CASTRO VOLUNTEER STATUS...\n');
  
  try {
    // Check CJ CASTRO member record
    const member = await prisma.members.findFirst({
      where: { 
        firstName: 'CJ', 
        lastName: 'CASTRO' 
      },
      include: {
        churches: { select: { name: true } }
      }
    });
    
    if (!member) {
      console.log('❌ CJ CASTRO member record not found');
      return;
    }
    
    console.log('👤 MEMBER RECORD:');
    console.log(`  Name: ${member.firstName} ${member.lastName}`);
    console.log(`  Email: ${member.email}`);
    console.log(`  Church: ${member.churches.name}`);
    console.log(`  Ministry ID: ${member.ministryId}`);
    console.log(`  Active: ${member.isActive}`);
    console.log(`  Experience Level: ${member.experienceLevel}`);
    console.log(`  Leadership Stage: ${member.leadershipStage}`);
    console.log(`  Spiritual Gifts: ${JSON.stringify(member.spiritualGifts)}`);
    console.log(`  Ministry Passion: ${JSON.stringify(member.ministryPassion)}`);
    
    // Check volunteers table  
    const volunteer = await prisma.volunteers.findFirst({
      where: { memberId: member.id }
    });
    
    console.log('\n🙋 VOLUNTEER RECORD:');
    if (volunteer) {
      console.log(`  Volunteer ID: ${volunteer.id}`);
      console.log(`  Status: ${volunteer.status}`);
      console.log(`  Is Active: ${volunteer.isActive}`);
      console.log(`  Application Date: ${volunteer.applicationDate}`);
      console.log(`  Ministry Interest: ${JSON.stringify(volunteer.ministryInterest)}`);
      console.log(`  Skills: ${JSON.stringify(volunteer.skills)}`);
      console.log(`  Availability: ${JSON.stringify(volunteer.availability)}`);
    } else {
      console.log('  ❌ No volunteer record found');
    }
    
    // Check what logic determines volunteer vs candidate
    console.log('\n🔍 VOLUNTEER LOGIC ANALYSIS:');
    
    // Logic 1: Has volunteer record AND status = 'active'
    const hasActiveVolunteer = volunteer && volunteer.status === 'active';
    console.log(`  Has Active Volunteer Record: ${hasActiveVolunteer}`);
    
    // Logic 2: Has ministryId assigned (member of ministry)
    const hasMinistryAssignment = member.ministryId !== null;
    console.log(`  Has Ministry Assignment: ${hasMinistryAssignment}`);
    
    // Logic 3: Has experience level > 1
    const hasExperience = member.experienceLevel && member.experienceLevel > 1;
    console.log(`  Has Experience (>1): ${hasExperience}`);
    
    // Logic 4: Has spiritual gifts defined
    const hasGifts = member.spiritualGifts && Object.keys(member.spiritualGifts).length > 0;
    console.log(`  Has Spiritual Gifts: ${hasGifts}`);
    
    // Check ministries table
    const ministries = await prisma.ministries.findMany({
      where: { churchId: member.churchId }
    });
    
    console.log(`\n⛪ AVAILABLE MINISTRIES (${ministries.length}):`);
    ministries.forEach(ministry => {
      console.log(`  - ${ministry.name} (ID: ${ministry.id})`);
      if (ministry.id === member.ministryId) {
        console.log(`    ↳ 🎯 CJ IS ASSIGNED TO THIS MINISTRY`);
      }
    });
    
    // Determine correct classification
    console.log('\n📋 RECOMMENDED CLASSIFICATION:');
    if (hasActiveVolunteer || hasMinistryAssignment) {
      console.log('  ✅ Should appear in: SON VOLUNTARIOS (Active Volunteer)');
      console.log('  ❌ Should NOT appear in: CANDIDATOS VOLUNTARIOS');
    } else {
      console.log('  ❌ Should NOT appear in: SON VOLUNTARIOS');
      console.log('  ✅ Should appear in: CANDIDATOS VOLUNTARIOS (Candidate)');
    }
    
  } catch (error) {
    console.error('❌ Investigation failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute if run directly
if (require.main === module) {
  investigateVolunteerLogic()
    .then(() => console.log('\n✅ Investigation completed'))
    .catch(console.error);
}

module.exports = investigateVolunteerLogic;