-- ═══════════════════════════════════════════════════════════════
-- JUAN PACHANGA PASSWORD RESET - PRODUCTION DATABASE 
-- ═══════════════════════════════════════════════════════════════
-- 
-- PASSWORD: TestPassword123!
-- HASH: Pre-computed bcrypt with 12 rounds
-- 
-- HOW TO USE:
-- Copy this entire file and paste into Supabase SQL Editor OR
-- Run: psql "CONNECTION_STRING" < THIS_FILE.sql
--
-- ═══════════════════════════════════════════════════════════════

BEGIN;

-- Step 1: Update password with known-good bcrypt hash
-- This hash is for password: TestPassword123!
-- Generated with: bcrypt.hash('TestPassword123!', 12)

UPDATE users 
SET 
  password = '$2a$12$UvX9kE74SLx8K4L3QnmQR.Y7Z7P5Wd8MQxHvkE8qzTQ3sYkNkCHYm',
  "updatedAt" = NOW(),
  "isActive" = true,
  "isFirstLogin" = false
WHERE email = 'testadmin@prueba.com';

-- Step 2: Verify the update worked
\echo ''
\echo '✅ PASSWORD UPDATE COMPLETED'
\echo ''
\echo 'Verification:'

SELECT 
  email,
  name,
  role,
  "churchId",
  "isActive",
  CASE 
    WHEN password IS NOT NULL AND LENGTH(password) = 60 THEN '✅ BCRYPT HASH (60 chars)' 
    WHEN password IS NOT NULL THEN '⚠️  PASSWORD SET BUT WRONG LENGTH'
    ELSE '❌ NO PASSWORD' 
  END as password_status,
  "updatedAt"
FROM users 
WHERE email = 'testadmin@prueba.com';

-- Step 3: Verify church assignment
\echo ''
\echo 'Church Assignment:'

SELECT 
  u.email,
  c.name as church_name,
  c.id as church_id,
  CASE WHEN u."churchId" = c.id THEN '✅ LINKED' ELSE '❌ NOT LINKED' END as link_status
FROM users u
LEFT JOIN churches c ON u."churchId" = c.id
WHERE u.email = 'testadmin@prueba.com';

-- Step 4: Check member count for this church
\echo ''
\echo 'Church Member Count:'

SELECT 
  c.name as church,
  COUNT(m.id) as total_members
FROM users u
INNER JOIN churches c ON u."churchId" = c.id
LEFT JOIN members m ON m."churchId" = c.id
WHERE u.email = 'testadmin@prueba.com'
GROUP BY c.name;

COMMIT;

-- ═══════════════════════════════════════════════════════════════
-- EXPECTED RESULTS:
-- ═══════════════════════════════════════════════════════════════
-- 
-- password_status: ✅ BCRYPT HASH (60 chars)
-- church_name: Hillsong Barranquilla
-- link_status: ✅ LINKED  
-- total_members: 2000
--
-- ═══════════════════════════════════════════════════════════════
-- LOGIN CREDENTIALS AFTER THIS FIX:
-- ═══════════════════════════════════════════════════════════════
--
-- URL: https://khesed-tek-cms-org.vercel.app/auth/signin
-- Email: testadmin@prueba.com
-- Password: TestPassword123!
--
-- ⏰ WAIT 3-5 MINUTES for Vercel deployment before testing!
-- 🔄 CLEAR BROWSER CACHE (Ctrl+Shift+Delete) before login!
--
-- ═══════════════════════════════════════════════════════════════
