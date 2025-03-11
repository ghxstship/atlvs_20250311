/*
  # Update Navigation Structure
  
  1. Changes
    - Remove assignments table
    - Rename assets to inventory
    - Update related foreign keys and references
    
  2. Security
    - Update RLS policies for new structure
    - Maintain existing permissions model
*/

-- Remove assignments table
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'assignments') THEN
    DROP TABLE assignments;
  END IF;
END $$;

-- Rename assets table to inventory if it exists
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'assets') THEN
    ALTER TABLE assets RENAME TO inventory;
    
    -- Update related sequences
    IF EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_name = 'assets_id_seq') THEN
      ALTER SEQUENCE assets_id_seq RENAME TO inventory_id_seq;
    END IF;
    
    -- Update foreign key constraints
    ALTER TABLE inventory_maintenance 
      RENAME CONSTRAINT assets_maintenance_asset_id_fkey 
      TO inventory_maintenance_inventory_id_fkey;
      
    ALTER TABLE inventory_documents 
      RENAME CONSTRAINT assets_documents_asset_id_fkey 
      TO inventory_documents_inventory_id_fkey;
  END IF;
END $$;

-- Update RLS policies
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inventory items are viewable by authenticated users"
  ON inventory
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Inventory items are modifiable by admins and managers"
  ON inventory
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id IN (
        SELECT id FROM roles 
        WHERE name IN ('admin'::user_role, 'manager'::user_role)
      )
    )
  );