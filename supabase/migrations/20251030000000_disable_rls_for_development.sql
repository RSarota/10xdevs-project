-- Migration: Disable RLS for development
-- Purpose: Temporarily disable Row Level Security to allow development without authentication
-- WARNING: This is for DEVELOPMENT ONLY - must be reverted before production!
-- Created: 2025-10-30

-- ============================================================================
-- DISABLE RLS ON FLASHCARDS TABLE (DEVELOPMENT ONLY)
-- ============================================================================

-- Disable RLS on flashcards table temporarily
ALTER TABLE flashcards DISABLE ROW LEVEL SECURITY;

-- Note: All existing RLS policies remain defined but are not enforced
-- To re-enable RLS later, run: ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE flashcards IS 'User flashcards for spaced repetition learning - RLS TEMPORARILY DISABLED FOR DEVELOPMENT';

