-- Check María González user status
SELECT 
  id,
  name,
  email,
  role,
  "churchId",
  "isActive",
  SUBSTRING(password, 1, 30) || '...' as password_preview,
  "createdAt"
FROM users 
WHERE email = 'admin@iglesiacentral.com';

-- Check if church exists
SELECT id, name, "isActive", "createdAt" 
FROM churches 
WHERE id = 'iglesia-central';

-- Count total users
SELECT COUNT(*) as total_users FROM users;

-- List all users
SELECT email, role, "churchId", "isActive" FROM users ORDER BY email;
