/*
  # Remove Assignments Tables and References
  
  This migration removes the assignments functionality that is no longer needed.
  
  1. Changes
    - Safely check for and remove assignments table if it exists
    - Remove any associated RLS policies
*/

-- Safely drop assignments table if it exists
DROP TABLE IF EXISTS assignments CASCADE;

-- Remove any RLS policies for assignments
DO $$ 
BEGIN
  -- Drop policies if they exist
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'assignments'
  ) THEN
    DROP POLICY IF EXISTS "Assignments are viewable by authenticated users" ON assignments;
  END IF;
END $$;