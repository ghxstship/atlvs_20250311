/*
  # Remove Assignments Table
  
  1. Changes
    - Drop assignments table and related data
    - Remove associated RLS policies
    - Clean up any foreign key references
    
  2. Security
    - Remove associated RLS policies
*/

-- Drop assignments table if it exists
DROP TABLE IF EXISTS assignments CASCADE;

-- Clean up any orphaned foreign keys
SELECT 
  format('ALTER TABLE %I DROP CONSTRAINT %I', table_name, constraint_name)
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY'
AND constraint_name LIKE '%assignment%';