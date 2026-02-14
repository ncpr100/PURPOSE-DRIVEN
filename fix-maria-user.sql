-- FIX TENANT USER - María González
-- This script will either create or update the user with correct credentials

-- Step 1: Check if user exists
DO $$
DECLARE
  user_count INT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM users WHERE email = 'admin@iglesiacentral.com';
  
  IF user_count = 0 THEN
    RAISE NOTICE '❌ User does NOT exist - will create';
  ELSE
    RAISE NOTICE '✅ User exists - will update password';
  END IF;
END $$;

-- Step 2: Ensure church exists first
INSERT INTO churches (
  id,
  name,
  email,
  phone,
  address,
  "subscriptionPlan",
  "subscriptionStatus",
  "subscriptionStartDate",
  "isActive",
  "createdAt",
  "updatedAt"
) VALUES (
  'iglesia-central',
  'Iglesia Central',
  'contacto@iglesiacentral.com',
  '+1234567890',
  'Dirección Principal',
  'premium',
  'active',
  NOW(),
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  "updatedAt" = NOW();

-- Step 3: Create or update María González user
-- Password: password123
-- Hash generated with bcrypt rounds=12
INSERT INTO users (
  id,
  email,
  password,
  name,
  role,
  "churchId",
  "isActive",
  "createdAt",
  "updatedAt"
) VALUES (
  'maria-gonzalez-admin',
  'admin@iglesiacentral.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5kosgVH3y2KQG',
  'María González',
  'ADMIN_IGLESIA',
  'iglesia-central',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  password = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5kosgVH3y2KQG',
  "isActive" = true,
  "updatedAt" = NOW();

-- Step 4: Verify the fix
SELECT 
  email,
  name,
  role,
  "churchId",
  "isActive",
  SUBSTRING(password, 1, 30) || '...' as password_preview
FROM users 
WHERE email = 'admin@iglesiacentral.com';
