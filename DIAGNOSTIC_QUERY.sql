--COMPLETE DIAGNOSTIC QUERY
-- Run this to see the full state of all users and their church assignments

SELECT 
  u.id,
  u.email,
  u.name,
  u.role,
  u."churchId",
  c.name as church_name,
  u."isActive",
  CASE WHEN u.password IS NOT NULL THEN 'YES' ELSE 'NO' END as has_password,
  LENGTH(u.password) as password_length,
  u."createdAt",
  u."updatedAt"
FROM users u
LEFT JOIN churches c ON u."churchId" = c.id
WHERE u.email IN (
  'testadmin@prueba.com',           -- Juan Pachanga
  'admin@iglesiacentral.com',       -- María González (OLD data)
  'soporte@khesed-tek-systems.org'  -- SUPER_ADMIN
)
ORDER BY u."createdAt" DESC;

-- Also check member count per church
SELECT 
  c.id,
  c.name,
  COUNT(m.id) as total_members
FROM churches c
LEFT JOIN members m ON m."churchId" = c.id
GROUP BY c.id, c.name
ORDER BY total_members DESC;
