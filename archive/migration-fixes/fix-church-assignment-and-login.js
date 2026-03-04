// Fix church assignment display and verify login for Juan Pachanga
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.qxdwpihcmgctznvdfmbv:Bendecido100%24%24%@aws-1-us-east-1.pooler.supabase.com:6543/postgres"
    }
  }
});

async function fixIssues() {
  console.log('🔧 FIXING CHURCH ASSIGNMENT & LOGIN ISSUES...\n');

  // STEP 1: Verify Juan Pachanga's data
  console.log('📋 STEP 1: Checking Juan Pachanga...');
  const juan = await prisma.users.findUnique({
    where: { email: 'testadmin@prueba.com' },
    include: { churches: true }
  });

  if (!juan) {
    console.log('❌ Juan Pachanga not found!');
    return;
  }

  console.log('✅ Found Juan Pachanga:');
  console.log('   ID:', juan.id);
  console.log('   Name:', juan.name);
  console.log('   Email:', juan.email);
  console.log('   Role:', juan.role);
  console.log('   ChurchId:', juan.churchId);
  console.log('   Church Object:', juan.churches ? juan.churches.name : 'NULL');
  console.log('   Has Password:', juan.password ? 'YES' : 'NO');
  console.log('   Password Length:', juan.password ? juan.password.length : 0);

  // STEP 2: Test password
  console.log('\n🔐 STEP 2: Testing password...');
  const testPassword = 'TestPassword123!';
  
  if (juan.password) {
    const isValid = await bcrypt.compare(testPassword, juan.password);
    console.log('   Password Test Result:', isValid ? '✅ VALID' : '❌ INVALID');
    
    if (!isValid) {
      console.log('\n⚠️  PASSWORD MISMATCH! Regenerating...');
      const newHash = await bcrypt.hash(testPassword, 12);
      
      await prisma.users.update({
        where: { id: juan.id },
        data: { password: newHash }
      });
      
      console.log('✅ Password reset to: TestPassword123!');
    }
  } else {
    console.log('❌ No password set! Creating one...');
    const newHash = await bcrypt.hash(testPassword, 12);
    
    await prisma.users.update({
      where: { id: juan.id },
      data: { password: newHash }
    });
    
    console.log('✅ Password set to: TestPassword123!');
  }

  // STEP 3: Verify church assignment
  console.log('\n🏛️  STEP 3: Verifying church assignment...');
  
  if (!juan.churchId) {
    console.log('❌ No churchId! Looking for Hillsong Barranquilla...');
    
    const church = await prisma.churches.findFirst({
      where: { name: 'Hillsong Barranquilla' }
    });
    
    if (church) {
      console.log('✅ Found church:', church.name, '(', church.id, ')');
      
      await prisma.users.update({
        where: { id: juan.id },
        data: { churchId: church.id }
      });
      
      console.log('✅ ChurchId assigned!');
    } else {
      console.log('❌ Church not found!');
    }
  } else {
    console.log('✅ ChurchId already assigned:', juan.churchId);
  }

  // STEP 4: Final verification
  console.log('\n✅ STEP 4: Final verification...');
  
  const juanUpdated = await prisma.users.findUnique({
    where: { email: 'testadmin@prueba.com' },
    include: { churches: true }
  });

  console.log('📊 FINAL STATE:');
  console.log('   Email:', juanUpdated.email);
  console.log('   Name:', juanUpdated.name);
  console.log('   Role:', juanUpdated.role);
  console.log('   ChurchId:', juanUpdated.churchId);
  console.log('   Church Name:', juanUpdated.churches ? juanUpdated.churches.name : 'NULL');
  console.log('   Password Set:', juanUpdated.password ? 'YES' : 'NO');
  console.log('   Is Active:', juanUpdated.isActive);

  // Test login one more time
  const passwordWorks = await bcrypt.compare('TestPassword123!', juanUpdated.password);
  console.log('   Password Works:', passwordWorks ? '✅ YES' : '❌ NO');

  console.log('\n🎉 FIX COMPLETE!');
  console.log('\n📝 LOGIN CREDENTIALS:');
  console.log('   Email: testadmin@prueba.com');
  console.log('   Password: TestPassword123!');
  console.log('   Church: ' + (juanUpdated.churches ? juanUpdated.churches.name : 'None'));

  await prisma.$disconnect();
}

fixIssues().catch(console.error);
