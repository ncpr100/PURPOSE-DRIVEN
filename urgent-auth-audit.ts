/**
 * URGENT AUTHENTICATION CRISIS AUDIT
 * Check and fix user accounts after 401 errors
 */

import { db } from './lib/db';
import bcrypt from 'bcrypt';

async function urgentAuthAudit() {
  try {
    console.log('🚨 URGENT AUTHENTICATION CRISIS AUDIT\n');
    
    const testCredentials = [
      { email: 'soporte@khesed-tek-systems.org', testPassword: 'Bendecido100%$$%' },
      { email: 'testadmin@prueba.com', testPassword: 'TestPassword123!' }
    ];
    
    for (const cred of testCredentials) {
      console.log(`🔐 CHECKING: ${cred.email}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      const user = await db.users.findUnique({
        where: { email: cred.email },
        select: { id: true, email: true, password: true, isActive: true, role: true, churchId: true }
      });
      
      if (!user) {
        console.log('❌ USER NOT FOUND - RECREATING...');
        
        const hashedPassword = await bcrypt.hash(cred.testPassword, 12);
        
        const newUser = await db.users.create({
          data: {
            id: cred.email === 'soporte@khesed-tek-systems.org' ? 'super-admin-khesedtek' : 'testadmin-id',
            email: cred.email,
            name: cred.email === 'soporte@khesed-tek-systems.org' ? 'Khesed-Tek Support (SUPER_ADMIN)' : 'Juan Pachanga',
            password: hashedPassword,
            role: cred.email === 'soporte@khesed-tek-systems.org' ? 'SUPER_ADMIN' : 'ADMIN_IGLESIA',
            churchId: cred.email === 'soporte@khesed-tek-systems.org' ? null : 'AaS4Pjqrw5viy04ky14Jv',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        
        console.log(`✅ User recreated: ${newUser.email}`);
      } else {
        console.log(`✅ User exists:`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Active: ${user.isActive}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Church: ${user.churchId || 'NULL (Platform Level)'}`);
        console.log(`   Has password: ${!!user.password}`);
        
        if (user.password) {
          const match = await bcrypt.compare(cred.testPassword, user.password);
          console.log(`   Password test: ${match ? '✅ MATCH' : '❌ NO MATCH'}`);
          
          if (!match) {
            console.log('   🔧 FIXING PASSWORD HASH...');
            const newHash = await bcrypt.hash(cred.testPassword, 12);
            await db.users.update({
              where: { email: cred.email },
              data: { 
                password: newHash, 
                isActive: true,
                updatedAt: new Date()
              }
            });
            
            // Verify the fix
            const verifyUser = await db.users.findUnique({
              where: { email: cred.email },
              select: { password: true }
            });
            
            const verifyMatch = await bcrypt.compare(cred.testPassword, verifyUser.password);
            console.log(`   ✅ Password updated and verified: ${verifyMatch ? 'SUCCESS' : 'FAILED'}`);
          }
        } else {
          console.log('   🔧 CREATING MISSING PASSWORD...');
          const newHash = await bcrypt.hash(cred.testPassword, 12);
          await db.users.update({
            where: { email: cred.email },
            data: { 
              password: newHash, 
              isActive: true,
              updatedAt: new Date()
            }
          });
          console.log('   ✅ Password created');
        }
      }
      console.log('');
    }
    
    // Final verification
    console.log('🧪 FINAL AUTHENTICATION TEST:\n');
    
    for (const cred of testCredentials) {
      const user = await db.users.findUnique({
        where: { email: cred.email },
        select: { email: true, password: true, isActive: true, role: true }
      });
      
      if (user && user.password && user.isActive) {
        const match = await bcrypt.compare(cred.testPassword, user.password);
        console.log(`${match ? '✅' : '❌'} ${cred.email}: ${match ? 'READY FOR LOGIN' : 'AUTHENTICATION FAILED'}`);
      } else {
        console.log(`❌ ${cred.email}: MISSING OR INACTIVE`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ CRITICAL ERROR:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

urgentAuthAudit();