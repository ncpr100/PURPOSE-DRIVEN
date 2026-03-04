-- CRITICAL FIX #2: Verify and Fix Church Assignment for Juan Pachanga

-- Step 1: Check current church assignment
SELECT 
  u.email,
  u.name,
  u."churchId",
  c.name as church_name
FROM users u
LEFT JOIN churches c ON u."churchId" = c.id
WHERE u.email = 'testadmin@prueba.com';

-- Step 2: If churchId is NULL, assign to Hillsong Barranquilla
-- First, get the church ID
SELECT id, name FROM churches WHERE name = 'Hillsong Barranquilla';

-- Then update user (replace YOUR_CHURCH_ID with actual ID from above query)
UPDATE users 
SET "churchId" = 'AaS4Pjqrw5viy04ky14Jv',  -- Use the actual church ID
    "updatedAt" = NOW()
WHERE email = 'testadmin@prueba.com';

-- Step 3: Final verification
SELECT 
  u.email,
  u.name,
  u.role,
  u."churchId",
  c.name as church_name,
  u."isActive"
FROM users u
LEFT JOIN churches c ON u."churchId" = c.id
WHERE u.email = 'testadmin@prueba.com';

-- Expected output:
-- email: testadmin@prueba.com
-- name: Juan Pachanga  
-- role: ADMIN_IGLESIA
-- churchId: AaS4Pjqrw5viy04ky14Jv
-- church_name: Hillsong Barranquilla
-- isActive: true
