/*
  # Update Catalog Schema Functions and Triggers

  1. Changes
    - Add trigger_generate_item_number function
    - Add set_item_number trigger
    - Add update_updated_at_column function
    - Add timestamp update triggers
    - Add missing indexes
    - Update RLS policies
    
  2. Security
    - Update RLS policies for authenticated access
*/

-- Create function to generate item numbers
CREATE OR REPLACE FUNCTION trigger_generate_item_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Get the current year
  NEW.item_number := to_char(current_date, 'YYYY') || '-' || 
    LPAD(
      COALESCE(
        (SELECT CAST(SUBSTRING(MAX(item_number) FROM '\d+$') AS INTEGER) + 1
         FROM items
         WHERE item_number LIKE to_char(current_date, 'YYYY') || '-%'),
        1
      )::text,
      6,
      '0'
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically generate item numbers
DO $$ BEGIN
  CREATE TRIGGER set_item_number
    BEFORE INSERT ON items
    FOR EACH ROW
    WHEN (NEW.item_number IS NULL)
    EXECUTE FUNCTION trigger_generate_item_number();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create missing triggers for automatic timestamp updates
DO $$ BEGIN
  CREATE TRIGGER update_collections_updated_at
    BEFORE UPDATE ON collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_items_updated_at
    BEFORE UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create missing indexes
CREATE INDEX IF NOT EXISTS idx_items_collection_id ON items(collection_id);
CREATE INDEX IF NOT EXISTS idx_items_category_id ON items(category_id);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_categories_collection_id ON categories(collection_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- Update RLS policies
DO $$ BEGIN
  -- Collections policies
  DROP POLICY IF EXISTS "Collections are viewable by authenticated users" ON collections;
  CREATE POLICY "Collections are viewable by authenticated users" 
    ON collections FOR SELECT 
    TO authenticated 
    USING (true);

  DROP POLICY IF EXISTS "Collections are modifiable by admins" ON collections;
  CREATE POLICY "Collections are modifiable by admins" 
    ON collections FOR ALL 
    TO authenticated 
    USING (EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = (SELECT id FROM roles WHERE name = 'admin')
    ));

  -- Categories policies
  DROP POLICY IF EXISTS "Categories are viewable by authenticated users" ON categories;
  CREATE POLICY "Categories are viewable by authenticated users" 
    ON categories FOR SELECT 
    TO authenticated 
    USING (true);

  DROP POLICY IF EXISTS "Categories are modifiable by admins" ON categories;
  CREATE POLICY "Categories are modifiable by admins" 
    ON categories FOR ALL 
    TO authenticated 
    USING (EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = (SELECT id FROM roles WHERE name = 'admin')
    ));

  -- Items policies
  DROP POLICY IF EXISTS "Items are viewable by authenticated users" ON items;
  CREATE POLICY "Items are viewable by authenticated users" 
    ON items FOR SELECT 
    TO authenticated 
    USING (true);

  DROP POLICY IF EXISTS "Items are modifiable by admins and managers" ON items;
  CREATE POLICY "Items are modifiable by admins and managers" 
    ON items FOR ALL 
    TO authenticated 
    USING (EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id IN (SELECT id FROM roles WHERE name IN ('admin', 'manager'))
    ));
END $$;