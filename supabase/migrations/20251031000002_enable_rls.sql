-- Migration: Enable Row Level Security (RLS) for all tables
-- Purpose: Re-enable RLS for flashcards (was disabled in 20251030000000) and add RLS for other tables
-- Created: 2025-10-31

-- ============================================================================
-- ENABLE RLS ON FLASHCARDS TABLE
-- ============================================================================

-- Re-enable RLS on flashcards table (was disabled in 20251030000000)
-- This ensures users can only access their own flashcards
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

-- Restore original table comment
COMMENT ON TABLE flashcards IS 'User flashcards for spaced repetition learning';

-- Note: All RLS policies for flashcards defined in 20251029120000_create_flashcards_schema.sql
-- already exist and will be automatically enforced once RLS is enabled.

-- ============================================================================
-- ENABLE RLS ON GENERATIONS TABLE
-- ============================================================================

-- Enable RLS on generations table
-- This ensures users can only access their own generation statistics
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES FOR GENERATIONS TABLE
-- ============================================================================

-- Policy: Allow authenticated users to select their own generations
CREATE POLICY "generations_select_authenticated"
  ON generations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Allow authenticated users to insert their own generations
CREATE POLICY "generations_insert_authenticated"
  ON generations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Allow authenticated users to update their own generations
CREATE POLICY "generations_update_authenticated"
  ON generations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Deny all access to anonymous users for generations
CREATE POLICY "generations_select_anon_deny"
  ON generations
  FOR SELECT
  TO anon
  USING (false);

CREATE POLICY "generations_insert_anon_deny"
  ON generations
  FOR INSERT
  TO anon
  WITH CHECK (false);

CREATE POLICY "generations_update_anon_deny"
  ON generations
  FOR UPDATE
  TO anon
  USING (false);

-- ============================================================================
-- ENABLE RLS ON GENERATION_ERROR_LOGS TABLE
-- ============================================================================

-- Enable RLS on generation_error_logs table
-- This ensures users can only access their own error logs
ALTER TABLE generation_error_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES FOR GENERATION_ERROR_LOGS TABLE
-- ============================================================================

-- Policy: Allow authenticated users to select their own error logs
CREATE POLICY "generation_error_logs_select_authenticated"
  ON generation_error_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Allow authenticated users to insert their own error logs
CREATE POLICY "generation_error_logs_insert_authenticated"
  ON generation_error_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Deny all access to anonymous users for error logs
CREATE POLICY "generation_error_logs_select_anon_deny"
  ON generation_error_logs
  FOR SELECT
  TO anon
  USING (false);

CREATE POLICY "generation_error_logs_insert_anon_deny"
  ON generation_error_logs
  FOR INSERT
  TO anon
  WITH CHECK (false);

-- ============================================================================
-- SUMMARY
-- ============================================================================

-- This migration enables RLS for all tables:
-- - flashcards table (re-enabled, policies already exist from initial migration)
-- - generations table (new, with select, insert, update policies)
-- - generation_error_logs table (new, with select, insert policies)

