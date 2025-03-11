/*
  # Remove Assets and Inventory Tables and References
  
  This migration removes all assets and inventory related functionality.
  
  1. Changes
    - Remove all assets and inventory related tables
    - Remove associated RLS policies
    - Clean up any foreign key references
*/

-- Safely drop tables if they exist
DO $$ 
BEGIN
  -- Drop inventory related tables
  IF EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_name = 'inventory_items'
  ) THEN
    DROP TABLE inventory_items CASCADE;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_name = 'inventory_transactions'
  ) THEN
    DROP TABLE inventory_transactions CASCADE;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_name = 'inventory_locations'
  ) THEN
    DROP TABLE inventory_locations CASCADE;
  END IF;

  -- Drop asset related tables
  IF EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_name = 'assets'
  ) THEN
    DROP TABLE assets CASCADE;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_name = 'asset_maintenance'
  ) THEN
    DROP TABLE asset_maintenance CASCADE;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_name = 'asset_tracking'
  ) THEN
    DROP TABLE asset_tracking CASCADE;
  END IF;
END $$;