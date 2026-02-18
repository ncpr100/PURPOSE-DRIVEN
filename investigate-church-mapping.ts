/**
 * CANONICAL CHURCH DATA INVESTIGATION
 * Identify source of truth for church mapping/logic records
 */

import { db } from './lib/db';

async function investigateCanonicalChurchData() {
  try {
    console.log('🚨 CANONICAL CHURCH DATA INVESTIGATION\n');
    
    // Check 1: All churches in canonical source
    console.log('🏛️ CHURCHES TABLE (CANONICAL SOURCE):\n');
    const churches = await db.churches.findMany({
      select: { 
        id: true, 
        name: true, 
        isActive: true, 
        createdAt: true,
        email: true,
        website: true
      }
    });
    
    console.log(`Found ${churches.length} churches in canonical source:\n`);
    churches.forEach((c, index) => {
      console.log(`${index + 1}. 🏛️ ${c.name}`);
      console.log(`   ID: ${c.id}`);
      console.log(`   Active: ${c.isActive}`);
      console.log(`   Email: ${c.email || 'NOT SET'}`);
      console.log(`   Website: ${c.website || 'NOT SET'}`);
      console.log(`   Created: ${c.createdAt.toISOString().split('T')[0]}`);
      console.log('');
    });
    
    // Check 2: User-church mappings
    console.log('\n👥 USER-CHURCH MAPPINGS:\n');
    const users = await db.users.findMany({
      select: { 
        email: true, 
        role: true, 
        churchId: true, 
        isActive: true,
        name: true
      }
    });
    
    users.forEach((u, index) => {
      console.log(`${index + 1}. 👤 ${u.email}`);
      console.log(`   Name: ${u.name || 'NOT SET'}`);
      console.log(`   Role: ${u.role}`);
      console.log(`   Church ID: ${u.churchId || '🔴 NULL (Platform Level)'}`);
      console.log(`   Active: ${u.isActive}`);
      console.log('');
    });
    
    // Check 3: Validate user-church relationships
    console.log('\n🔗 USER-CHURCH RELATIONSHIP VALIDATION:\n');
    
    for (const user of users) {
      if (user.churchId) {
        const church = churches.find(c => c.id === user.churchId);
        if (church) {
          console.log(`✅ ${user.email} → ${church.name} (VALID)`);
        } else {
          console.log(`❌ ${user.email} → Church ID "${user.churchId}" NOT FOUND (ORPHANED USER)`);
        }
      } else {
        console.log(`🔵 ${user.email} → Platform Level (SUPER_ADMIN)`);
      }
    }
    
    // Check 4: Count data by church
    console.log('\n📊 DATA COUNT BY CHURCH:\n');
    for (const church of churches) {
      const memberCount = await db.members.count({ where: { churchId: church.id } });
      const eventsCount = await db.events.count({ where: { churchId: church.id } });
      const donationsCount = await db.donations.count({ where: { churchId: church.id } });
      
      console.log(`🏛️ ${church.name}:`);
      console.log(`   Members: ${memberCount}`);
      console.log(`   Events: ${eventsCount}`);
      console.log(`   Donations: ${donationsCount}`);
      console.log('');
    }
    
    console.log('🎯 CANONICAL SOURCE SUMMARY:');
    console.log('   📋 churches table = CANONICAL SOURCE for church records');
    console.log('   🔑 users.churchId = Foreign key mapping to churches.id');
    console.log('   🚨 Any mismatch = DATA ACCESS FAILURE');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ CRITICAL ERROR:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

investigateCanonicalChurchData();