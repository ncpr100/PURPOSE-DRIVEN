-- CRITICAL FIX #1: Reset Juan Pachanga Password
-- Run this in your PostgreSQL client connected to Supabase

-- This is a pre-computed bcrypt hash for password: TestPassword123!
-- Generated with: bcrypt.hash('TestPassword123!', 12)

UPDATE users 
SET password = '$2a$12$LTW3XfhZ6KBqHvF0iIqEHOMZ3kF9mXl6sI0wX5YkQvNkC5HkOEzKS',
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
  CASE WHEN password IS NOT NULL THEN 'PASSWORD SET' ELSE 'NO PASSWORD' END as password_status,
  CASE WHEN "churchId" IS NOT NULL THEN 'CHURCH ASSIGNED' ELSE 'NO CHURCH' END as church_status
FROM users 
WHERE email = 'testadmin@prueba.com';

-- Expected output:
-- email: testadmin@prueba.com
-- name: Juan Pachanga
-- role: ADMIN_IGLESIA
-- churchId: AaS4Pjqrw5viy04ky14Jv (or should be assigned)
-- isActive: true
-- password_status: PASSWORD SET
-- church_status: CHURCH ASSIGNED
