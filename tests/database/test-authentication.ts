/**
 * COMPREHENSIVE AUTHENTICATION TEST
 * Test all three user accounts with corrected church mappings
 */

import { db } from './lib/db';
import bcrypt from 'bcrypt';

async function testAuthentication() {
  try {
    console.log(' COMPREHENSIVE AUTHENTICATION TEST\n');
    
    const testCredentials = [
      { 
        email: 'soporte@khesed-tek-systems.org', 
        password: 'Bendecido100%$$%', 
        expectedRole: 'SUPER_ADMIN',
        expectedChurchId: null
      },
      { 
        email: 'testadmin@prueba.com', 
        password: 'TestPassword123!', 
        expectedRole: 'ADMIN_IGLESIA',
        expectedChurchId: 'AaS4Pjqrw5viy04ky14Jv'
      },
      { 
        email: 'admin@iglesiacentral.com', 
        password: 'AdminIglesia2026!', 
        expectedRole: 'ADMIN_IGLESIA',
        expectedChurchId: 'iglesia-central'
      }
    ];
    
    for (let i = 0; i < testCredentials.length; i++) {
      const cred = testCredentials[i];
      console.log(`\n${i + 1}.  TESTING: ${cred.email}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Step 1: Find user
      const user = await db.users.findUnique({
        where: { email: cred.email }
      });
      
      if (!user) {
        console.log(' USER NOT FOUND');
        continue;
      }
      
      console.log(` User found: ${user.name || 'No name'}`);
      console.log(`   Role: ${user.role} (expected: ${cred.expectedRole})`);
      console.log(`   Church ID: ${user.churchId || 'NULL'} (expected: ${cred.expectedChurchId || 'NULL'})`);
      console.log(`   Active: ${user.isActive}`);
      
      // Step 2: Test password
      if (user.password) {
        const passwordMatch = await bcrypt.compare(cred.password, user.password);
        console.log(` Password: ${passwordMatch ? ' MATCH' : ' NO MATCH'}`);
        
        if (!passwordMatch) {
          console.log('      Password issue detected'); 
        }
      } else {
        console.log(' Password:  NO PASSWORD HASH');
      }
      
      // Step 3: Test church mapping (if applicable)
      if (user.churchId) {
        const church = await db.churches.findUnique({
          where: { id: user.churchId }
        });
        
        if (church) {
          console.log(`️ Church:  ${church.name} (Active: ${church.isActive})`);
          
          // Test data access
          const memberCount = await db.members.count({ where: { churchId: user.churchId } });
          const eventCount = await db.events.count({ where: { churchId: user.churchId } });
          
          console.log(` Data Access: ${memberCount} members, ${eventCount} events`);
        } else {
          console.log('️ Church:  INVALID CHURCH ID');
        }
      } else {
        console.log('️ Church:  Platform Level (SUPER_ADMIN)');
      }
      
      // Step 4: Overall status
      const isValid = user && 
                     user.role === cred.expectedRole && 
                     user.churchId === cred.expectedChurchId &&
                     user.isActive &&
                     user.password;
      
      console.log(` Overall Status: ${isValid ? ' AUTHENTICATION READY' : ' ISSUES FOUND'}`);
    }
    
    // Summary
    console.log('\n\n AUTHENTICATION TEST SUMMARY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const allUsers = await db.users.findMany({ 
      select: { email: true, role: true, churchId: true, isActive: true }
    });
    
    const workingCredentials = [];
    
    for (const cred of testCredentials) {
      const user = allUsers.find(u => u.email === cred.email);
      if (user && user.isActive && user.role === cred.expectedRole) {
        workingCredentials.push(cred.email);
      }
    }
    
    console.log(` ${workingCredentials.length}/${testCredentials.length} accounts ready for login`);
    console.log(` Working accounts: ${workingCredentials.join(', ')}`);
    
    if (workingCredentials.length === testCredentials.length) {
      console.log('\n ALL AUTHENTICATION TESTS PASSED!');
      console.log('   Ready for production login testing');
    } else {
      console.log('\n️ SOME AUTHENTICATION ISSUES REMAIN');
    }
    
    process.exit(0);
  } catch (error) {
    console.error(' AUTHENTICATION TEST FAILED:', error.message);
    process.exit(1);
  }
}

testAuthentication();