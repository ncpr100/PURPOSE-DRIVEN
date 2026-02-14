-- Fix María González role to PASTOR (as it was in Railway)
-- Original Railway setup had PASTOR role for Iglesia Central admin
UPDATE users 
SET 
  role = 'PASTOR',
  password = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5koXaTPLMM5K.',
  "updatedAt" = NOW()
WHERE email = 'admin@iglesiacentral.com';

-- Verify the update
SELECT email, name, role, "churchId", "isActive" FROM users WHERE email = 'admin@iglesiacentral.com';
