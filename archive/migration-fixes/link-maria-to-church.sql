-- CRITICAL FIX: Link María González to Iglesia Central
-- Issue: User exists but churchId is NULL (shows "Sin iglesia" in platform)
-- Solution: Update user record to set churchId to 'iglesia-central'

-- Step 1: Verify current state
SELECT 
    id,
    name, 
    email, 
    role, 
    "churchId",
    "isActive"
FROM users 
WHERE email = 'admin@iglesiacentral.com';

-- Step 2: Update María González to link to Iglesia Central
UPDATE users 
SET "churchId" = 'iglesia-central'
WHERE email = 'admin@iglesiacentral.com';

-- Step 3: Verify the fix worked
SELECT 
    u.id,
    u.name, 
    u.email, 
    u.role, 
    u."churchId",
    u."isActive",
    c.name as church_name,
    c."isActive" as church_active
FROM users u
LEFT JOIN church c ON u."churchId" = c.id
WHERE u.email = 'admin@iglesiacentral.com';

-- Expected result:
-- - churchId should be: iglesia-central
-- - church_name should be: Iglesia Central
-- - Both isActive should be: t (true)
