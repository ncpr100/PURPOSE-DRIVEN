-- Create María González (ADMIN_IGLESIA for Iglesia Central)
-- Email: admin@iglesiacentral.com
-- Password: password123
-- Bcrypt hash: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5koXaTPLMM5K.

INSERT INTO users (id, name, email, password, role, "churchId", "isActive", "createdAt", "updatedAt")
VALUES (
  'admin-maria-gonzalez',
  'María González',
  'admin@iglesiacentral.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5koXaTPLMM5K.',
  'ADMIN_IGLESIA',
  'iglesia-central',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET 
  password = EXCLUDED.password,
  role = EXCLUDED.role,
  "churchId" = EXCLUDED.churchId,
  "isActive" = true;

-- Verify
SELECT email, name, role, "churchId" FROM users WHERE email = 'admin@iglesiacentral.com';
