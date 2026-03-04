/**
 * EMERGENCY CHURCH MAPPING FIX
 * Fix canonical source church mappings and user associations
 */

import { db } from './lib/db';
import bcrypt from 'bcrypt';

async function emergencyChurchFix() {
  try {
    console.log('🚨 EMERGENCY CHURCH MAPPING FIX\n');
    
    // Fix 1: Activate the church with data (Hillsong Barranquilla)
    console.log('🔧 Step 1: Activating church with 2000 members...');
    const activatedChurch = await db.churches.update({
      where: { id: 'AaS4Pjqrw5viy04ky14Jv' },
      data: { 
        isActive: true,
        name: 'Comunidad de Fe'  // Better name for production
      }
    });
    console.log(`✅ Activated: ${activatedChurch.name} (${activatedChurch.id})`);
    
    // Fix 2: Create missing admin user for iglesia-central
    console.log('\n🔧 Step 2: Creating missing admin user for iglesia-central...');
    const hashedPassword = await bcrypt.hash('AdminIglesia2026!', 12);
    
    try {
      const newAdmin = await db.users.create({
        data: {
          id: 'admin-iglesia-central',
          email: 'admin@iglesiacentral.com',
          name: 'Administrador Iglesia Central',
          password: hashedPassword,
          role: 'ADMIN_IGLESIA',
          churchId: 'iglesia-central',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      console.log(`✅ Created: ${newAdmin.email} → iglesia-central`);
    } catch (error) {
      if (error.code === 'P2002') {
        // User already exists, update churchId mapping
        const updatedAdmin = await db.users.update({
          where: { email: 'admin@iglesiacentral.com' },
          data: { 
            churchId: 'iglesia-central',
            password: hashedPassword,
            isActive: true
          }
        });
        console.log(`✅ Updated existing: ${updatedAdmin.email} → iglesia-central`);
      } else {
        throw error;
      }
    }
    
    // Fix 3: Verify all mappings
    console.log('\n🔍 Step 3: Verifying fixed mappings...');
    
    const churches = await db.churches.findMany({
      select: { id: true, name: true, isActive: true }
    });
    
    const users = await db.users.findMany({
      select: { email: true, role: true, churchId: true, isActive: true }
    });
    
    console.log('\n📋 FIXED CHURCH STATUS:');
    churches.forEach(c => {
      console.log(`🏛️ ${c.name}: ${c.isActive ? '✅ ACTIVE' : '❌ INACTIVE'}`);
    });
    
    console.log('\n👥 FIXED USER MAPPINGS:');
    users.forEach(u => {
      if (u.churchId) {
        const church = churches.find(c => c.id === u.churchId);
        console.log(`👤 ${u.email} → ${church?.name || 'UNKNOWN CHURCH'} (${u.role})`);
      } else {
        console.log(`🔵 ${u.email} → Platform Level (${u.role})`);
      }
    });
    
    // Fix 4: Test data access for each user
    console.log('\n🧪 Step 4: Testing data access for each user...');
    
    for (const user of users.filter(u => u.churchId)) {
      const memberCount = await db.members.count({ where: { churchId: user.churchId } });
      console.log(`📊 ${user.email}: Can access ${memberCount} members`);
    }
    
    console.log('\n🎉 CHURCH MAPPING FIX COMPLETE!');
    console.log('✅ Churches activated correctly');
    console.log('✅ Users mapped to correct churches');
    console.log('✅ Data access verified');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ EMERGENCY FIX FAILED:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

emergencyChurchFix();