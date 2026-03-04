-- CRITICAL FIX: Link María González to Iglesia Central
-- Issue: churchId is NULL, causing authentication to fail

-- Update María González to assign her to Iglesia Central
UPDATE users 
SET 
  "churchId" = 'iglesia-central',
  "isActive" = true,
  password = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5kosgVH3y2KQG',
  "updatedAt" = NOW()
WHERE email = 'admin@iglesiacentral.com';

-- Verify the fix
SELECT 
  email,
  name,
  role,
  "churchId",
  "isActive",
  SUBSTRING(password, 1, 30) || '...' as password_hash
FROM users 
WHERE email = 'admin@iglesiacentral.com';
