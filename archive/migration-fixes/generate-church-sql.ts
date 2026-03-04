/**
 * GENERATE CANONICAL SOURCE SQL FOR SUPABASE
 * Extract current church data and create INSERT statements
 */

import { db } from './lib/db';

async function generateChurchSQLForSupabase() {
  try {
    console.log('🏛️ GENERATING CANONICAL CHURCH MAPPING SQL FOR SUPABASE\n');
    
    // Get current church data
    const churches = await db.churches.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        email: true,
        website: true,
        founded: true,
        logo: true,
        description: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    console.log('📋 COPY AND PASTE THIS SQL INTO SUPABASE SQL EDITOR:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('-- CANONICAL SOURCE OF TRUTH: CHURCH MAPPING RECORDS');
    console.log('-- This ensures all church data is properly configured');
    console.log('-- Execute in Supabase > SQL Editor > New Query');
    console.log('');
    
    // Generate table creation SQL (in case it doesn't exist)
    console.log('-- 1. Ensure churches table exists with correct schema');
    console.log(`CREATE TABLE IF NOT EXISTS churches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  founded TIMESTAMPTZ,
  logo TEXT,
  description TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);`);
    console.log('');
    
    // Generate UPSERT statements for each church
    console.log('-- 2. Insert/Update canonical church records');
    churches.forEach((church, index) => {
      const foundedValue = church.founded ? `'${church.founded.toISOString()}'` : 'NULL';
      const createdAtValue = `'${church.createdAt.toISOString()}'`;
      const updatedAtValue = `'${church.updatedAt.toISOString()}'`;
      
      console.log(`-- Church ${index + 1}: ${church.name}`);
      console.log(`INSERT INTO churches (
  id, name, address, phone, email, website, founded, logo, description, "isActive", "createdAt", "updatedAt"
) VALUES (
  '${church.id}',
  '${church.name}',
  ${church.address ? `'${church.address}'` : 'NULL'},
  ${church.phone ? `'${church.phone}'` : 'NULL'},
  ${church.email ? `'${church.email}'` : 'NULL'},
  ${church.website ? `'${church.website}'` : 'NULL'},
  ${foundedValue},
  ${church.logo ? `'${church.logo}'` : 'NULL'},
  ${church.description ? `'${church.description.replace(/'/g, "''")}'` : 'NULL'},
  ${church.isActive},
  ${createdAtValue},
  ${updatedAtValue}
)
ON CONFLICT (id) 
DO UPDATE SET 
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  website = EXCLUDED.website,
  founded = EXCLUDED.founded,
  logo = EXCLUDED.logo,
  description = EXCLUDED.description,
  "isActive" = EXCLUDED."isActive",
  "updatedAt" = now();`);
      console.log('');
    });
    
    // Generate user mapping verification
    console.log('-- 3. Verify user-church mappings are correct');
    console.log(`SELECT 
  u.email,
  u.role,
  u."churchId",
  c.name as church_name,
  c."isActive" as church_active
FROM users u
LEFT JOIN churches c ON u."churchId" = c.id
ORDER BY u.role DESC, u.email;`);
    console.log('');
    
    // Generate data count verification
    console.log('-- 4. Verify data counts by church');
    console.log(`SELECT 
  c.name as church_name,
  c.id as church_id,
  c."isActive" as is_active,
  COUNT(m.id) as member_count
FROM churches c
LEFT JOIN members m ON c.id = m."churchId"
GROUP BY c.id, c.name, c."isActive"
ORDER BY member_count DESC;`);
    console.log('');
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ COPY THE ABOVE SQL AND EXECUTE IN SUPABASE SQL EDITOR');
    console.log('📝 This will ensure canonical church mapping consistency');
    console.log('🎯 All user authentication and data access depends on this canonical source');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    process.exit(1);
  }
}

generateChurchSQLForSupabase();