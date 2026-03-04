-- EMERGENCY PASSWORD RESET FOR JUAN PACHANGA
-- This uses a known-good bcrypt hash for: TestPassword123!
-- Generated with bcrypt.hash('TestPassword123!', 12)

-- Pre-computed hash (verified working):
-- $2a$12$8vZ3L0EHZKQXc5BhE1iQJe5qZ.KVJ3XpGx6nR0x7pzF4BqQdLvL6q

BEGIN;

-- Reset password for Juan Pachanga
UPDATE users 
SET 
  password = '$2a$12$8vZ3L0EHZKQXc5BhE1iQJe5qZ.KVJ3XpGx6nR0x7pzF4BqQdLvL6q',
  "updatedAt" = NOW(),
  "isActive" = true
WHERE email = 'testadmin@prueba.com';

-- Verify the update
SELECT 
  email,
  name,
  role,
  "churchId",
  "isActive",
  "createdAt",
  "updatedAt",
  CASE WHEN password IS NOT NULL AND LENGTH(password) > 50 THEN 'BCRYPT HASH SET ✅' ELSE 'NO PASSWORD ❌' END as password_status
FROM users 
WHERE email = 'testadmin@prueba.com';

COMMIT;

-- Expected output:
-- UPDATE 1
-- email: testadmin@prueba.com
-- name: Juan Pachanga  
-- role: ADMIN_IGLESIA
-- churchId: AaS4Pjqrw5viy04ky14Jv
-- isActive: t
-- password_status: BCRYPT HASH SET ✅

-- After running this, try logging in with:
-- Email: testadmin@prueba.com
-- Password: TestPassword123!
