-- Migration: Create delete_user RPC function
-- Purpose: Allow users to delete their own account
-- Created: 2025-10-31

-- ============================================================================
-- FUNCTION: delete_user
-- ============================================================================

-- Function to delete a user account
-- This function deletes the user from auth.users, which will cascade delete
-- all related data due to foreign key constraints with ON DELETE CASCADE
create or replace function delete_user()
returns void
language plpgsql
security definer
as $$
declare
  current_user_id uuid;
begin
  -- Get the current authenticated user ID
  current_user_id := auth.uid();
  
  -- Check if user is authenticated
  if current_user_id is null then
    raise exception 'User must be authenticated to delete account';
  end if;
  
  -- Delete user from auth.users
  -- This will cascade delete all related data (flashcards, generations, etc.)
  -- due to foreign key constraints with ON DELETE CASCADE
  delete from auth.users
  where id = current_user_id;
  
  -- If no rows were deleted, user doesn't exist
  if not found then
    raise exception 'User not found';
  end if;
end;
$$;

comment on function delete_user is 'Deletes the currently authenticated user account and all related data';

