-- 🚨 ENTERPRISE SUPER_ADMIN SEED - OFFICIAL CREDENTIALS
-- Email: soporte@khesed-tek-systems.org
-- Password: Bendecido100%$$%
-- Created: February 13, 2026

-- Create Iglesia Central church
INSERT INTO churches (id, name, address, phone, email, website, founded, description, "isActive", "createdAt", "updatedAt")
VALUES (
  'iglesia-central',
  'Iglesia Central',
  'Calle Principal 123, Ciudad',
  '+1234567890',
  'contacto@iglesiacentral.com',
  'https://iglesiacentral.com',
  '2000-01-01'::timestamp,
  'Iglesia comprometida con la comunidad',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Create SUPER_ADMIN user
-- Password hash for: Bendecido100%$$%
-- Generated with: bcrypt.hash('Bendecido100%$$%', 12)
INSERT INTO users (id, name, email, password, role, "churchId", "isActive", "createdAt", "updatedAt")
VALUES (
  'super-admin-khesedtek',
  'Khesed-Tek Support',
  'soporte@khesed-tek-systems.org',
  '$2a$12$YhR0Y5e7xqWIQ3Bvhjp.G.ZppMYkWsVhckQj/7c7JKZTcTW3EN08G',
  'SUPER_ADMIN',
  NULL,
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  role = EXCLUDED.role,
  "isActive" = true,
  "updatedAt" = NOW();

-- Verify creation
SELECT 
  email, 
  role, 
  name, 
  "isActive",
  CASE WHEN "churchId" IS NULL THEN 'Platform Admin' ELSE "churchId" END as scope
FROM users 
WHERE email = 'soporte@khesed-tek-systems.org';

SELECT id, name, email, "isActive" FROM churches WHERE id = 'iglesia-central';
