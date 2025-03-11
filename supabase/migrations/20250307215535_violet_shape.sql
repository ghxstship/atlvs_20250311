/*
  # Remove Assets and Assignments Tables and References
  
  This migration removes the assets and assignments functionality that is no longer needed.
  
  1. Changes
    - Safely check for and remove assets and assignments tables if they exist
    - Remove any associated RLS policies
*/

-- Safely drop tables if they exist
DO $$ 
BEGIN
  -- Drop assignments table and policies
  IF EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_name = 'assignments'
  ) THEN
    DROP TABLE assignments CASCADE;
  END IF;

  -- Drop assets table and policies
  IF EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_name = 'assets'
  ) THEN
    DROP TABLE assets CASCADE;
  END IF;
END $$;