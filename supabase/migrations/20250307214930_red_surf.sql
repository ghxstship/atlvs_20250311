/*
  # Clean up legacy tables and policies
  
  1. Changes
    - Safely check for and remove assignments table
    - Safely check for and remove assets table
    - Remove associated policies
    
  2. Security
    - Removes any associated RLS policies
*/

-- Check if assignments table exists and drop it
DO $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'assignments'
  ) INTO table_exists;
  
  IF table_exists THEN
    DROP TABLE public.assignments CASCADE;
  END IF;
END $$;

-- Check if assets table exists and drop it
DO $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'assets'
  ) INTO table_exists;
  
  IF table_exists THEN
    DROP TABLE public.assets CASCADE;
  END IF;
END $$;