-- PostgreSQL Schema Update
-- Adds firstName and lastName to users table

-- Add new columns
ALTER TABLE users ADD COLUMN firstName TEXT;
ALTER TABLE users ADD COLUMN lastName TEXT;