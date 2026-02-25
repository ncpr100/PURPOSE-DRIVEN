-- Simple Database Schema Fix
-- Add firstName and lastName fields to users table

-- Add columns (safe operations)
ALTER TABLE users ADD COLUMN firstName TEXT;
ALTER TABLE users ADD COLUMN lastName TEXT;

-- Update existing records
UPDATE users 
SET firstName = split_part(name, ' ', 1),
    lastName = CASE 
        WHEN position(' ' in name) > 0 
        THEN substring(name from position(' ' in name) + 1)
        ELSE NULL 
    END
WHERE name IS NOT NULL;