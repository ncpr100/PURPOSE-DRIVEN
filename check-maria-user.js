#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres.qxdwpihcmgctznvdfmbv:Bendecido100%25%24%24%25@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true'
    }
  }
});

async function checkMariaUser() {
  console.log('🔍 TENANT USER VERIFICATION\n');
  
  try {
    // Check if María González exists
    const maria = await prisma.users.findUnique({
      where: { email: 'admin@iglesiacentral.com' },
      include: { 
        churches: { 
          select: { id: true, name: true, isActive: true } 
        } 
      }
    });
    
    if (!maria) {
      console.log('❌ CRITICAL: María González user NOT FOUND in database!');
      console.log('   Email searched: admin@iglesiacentral.com\n');
      
      // Check if church exists
      const church = await prisma.churches.findUnique({
        where: { id: 'iglesia-central' }
      });
      
      if (!church) {
        console.log('❌ Church "iglesia-central" also NOT FOUND\n');
      } else {
        console.log('✅ Church "iglesia-central" EXISTS');
        console.log(`   Name: ${church.name}`);
        console.log(`   Active: ${church.isActive}\n`);
      }
      
      console.log('🎯 ACTION REQUIRED: Need to create María González user');
      return;
    }
    
    console.log('✅ María González user FOUND\n');
    console.log('User Details:');
    console.log(`  ID: ${maria.id}`);
    console.log(`  Name: ${maria.name}`);
    console.log(`  Email: ${maria.email}`);
    console.log(`  Role: ${maria.role}`);
    console.log(`  ChurchId: ${maria.churchId}`);
    console.log(`  IsActive: ${maria.isActive}`);
    console.log(`  Created: ${maria.createdAt}`);
    console.log(`  Password Hash: ${maria.password.substring(0, 30)}...\n`);
    
    if (maria.churches) {
      console.log('Church Details:');
      console.log(`  ID: ${maria.churches.id}`);
      console.log(`  Name: ${maria.churches.name}`);
      console.log(`  Active: ${maria.churches.isActive}\n`);
    }
    
    // Test password validation
    console.log('🔐 Testing password validation...');
    const testPassword = 'password123';
    const isValid = await bcrypt.compare(testPassword, maria.password);
    
    if (isValid) {
      console.log(`✅ Password "password123" MATCHES stored hash`);
    } else {
      console.log(`❌ Password "password123" DOES NOT MATCH stored hash`);
      console.log('   This is why login is failing!\n');
      
      // Try to generate correct hash
      console.log('🔧 Generating new password hash...');
      const newHash = await bcrypt.hash('password123', 12);
      console.log(`New hash: ${newHash.substring(0, 30)}...\n`);
      console.log('Run this SQL to fix password:');
      console.log(`UPDATE users SET password = '${newHash}' WHERE email = 'admin@iglesiacentral.com';`);
    }
    
    // Check if user is active
    if (!maria.isActive) {
      console.log('\n⚠️  User is INACTIVE - this will prevent login');
      console.log('Run this SQL to activate:');
      console.log(`UPDATE users SET "isActive" = true WHERE email = 'admin@iglesiacentral.com';`);
    }
    
  } catch (error) {
    console.error('❌ Error checking user:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkMariaUser();
