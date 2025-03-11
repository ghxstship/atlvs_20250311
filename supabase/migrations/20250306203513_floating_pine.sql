/*
  # Catalog Database Schema

  1. New Tables
    - collections: Primary categories for organizing items
    - categories: Secondary classification under collections
    - items: Base inventory items with customizations, pricing, locations, maintenance
    - Related tables for item metadata and tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for admin and user access
    - Implement role-based access control

  3. Changes
    - Create initial collections and categories
    - Set up automatic timestamp updates
    - Add indexes for performance
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create trigger function for item number generation
CREATE OR REPLACE FUNCTION trigger_generate_item_number()
RETURNS TRIGGER AS $$
DECLARE
  prefix text;
  counter integer;
  new_number text;
BEGIN
  -- Get the current year
  prefix := to_char(CURRENT_DATE, 'YYYY');
  
  -- Get the current counter for this year
  SELECT COALESCE(MAX(SUBSTRING(item_number FROM '\d+$')::integer), 0) + 1
  INTO counter
  FROM items
  WHERE item_number LIKE prefix || '-%';
  
  -- Generate the new number
  new_number := prefix || '-' || LPAD(counter::text, 6, '0');
  
  -- Set the new item number
  NEW.item_number := new_number;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Collections (Primary Categories)
CREATE TABLE collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories (Secondary Classification)
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid REFERENCES collections(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  slug text UNIQUE NOT NULL,
  parent_id uuid REFERENCES categories(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Base Items
CREATE TABLE items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_number text UNIQUE,
  name text NOT NULL,
  collection_id uuid REFERENCES collections(id),
  category_id uuid REFERENCES categories(id),
  description text,
  manufacturer text,
  model text,
  specifications jsonb DEFAULT '{}',
  status text DEFAULT 'available',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id),
  CONSTRAINT valid_status CHECK (status IN ('available', 'in_use', 'maintenance', 'retired'))
);

-- Create trigger for item number generation
CREATE TRIGGER set_item_number
  BEFORE INSERT ON items
  FOR EACH ROW
  WHEN (NEW.item_number IS NULL)
  EXECUTE FUNCTION trigger_generate_item_number();

-- Item Customizations
CREATE TABLE item_customizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES items(id) ON DELETE CASCADE,
  field_name text NOT NULL,
  field_type text NOT NULL,
  field_value jsonb NOT NULL,
  required boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_field_type CHECK (field_type IN ('text', 'number', 'boolean', 'date', 'select', 'multi-select'))
);

-- Item Pricing
CREATE TABLE item_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES items(id) ON DELETE CASCADE,
  tier_name text NOT NULL,
  rate_type text NOT NULL,
  rate_amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  min_duration interval,
  max_duration interval,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_rate_type CHECK (rate_type IN ('hourly', 'daily', 'weekly', 'monthly'))
);

-- Item Locations
CREATE TABLE item_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES items(id) ON DELETE CASCADE,
  location_name text NOT NULL,
  location_type text NOT NULL,
  status text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_location_type CHECK (location_type IN ('warehouse', 'venue', 'transit', 'maintenance'))
);

-- Item Maintenance
CREATE TABLE item_maintenance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES items(id) ON DELETE CASCADE,
  schedule_type text NOT NULL,
  interval_days integer,
  last_maintenance timestamptz,
  next_maintenance timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_schedule_type CHECK (schedule_type IN ('routine', 'preventive', 'reactive'))
);

-- Item Documents
CREATE TABLE item_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES items(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  title text NOT NULL,
  file_url text NOT NULL,
  file_size integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  CONSTRAINT valid_document_type CHECK (document_type IN ('manual', 'certification', 'warranty', 'maintenance', 'other'))
);

-- Item Versions
CREATE TABLE item_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES items(id) ON DELETE CASCADE,
  version_number text NOT NULL,
  changes jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_versions ENABLE ROW LEVEL SECURITY;

-- Create policies for collections
CREATE POLICY "Collections are viewable by authenticated users" 
  ON collections FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Collections are modifiable by admins" 
  ON collections FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = (SELECT id FROM roles WHERE name = 'admin')
    )
  );

-- Create policies for categories
CREATE POLICY "Categories are viewable by authenticated users" 
  ON categories FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Categories are modifiable by admins" 
  ON categories FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = (SELECT id FROM roles WHERE name = 'admin')
    )
  );

-- Create policies for items
CREATE POLICY "Items are viewable by authenticated users" 
  ON items FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Items are modifiable by admins and managers" 
  ON items FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id IN (
        SELECT id FROM roles WHERE name IN ('admin', 'manager')
      )
    )
  );

-- Create policies for item customizations
CREATE POLICY "Item customizations are viewable by authenticated users" 
  ON item_customizations FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Item customizations are modifiable by admins" 
  ON item_customizations FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = (SELECT id FROM roles WHERE name = 'admin')
    )
  );

-- Create policies for item pricing
CREATE POLICY "Item pricing is viewable by authenticated users" 
  ON item_pricing FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Item pricing is modifiable by admins" 
  ON item_pricing FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id = (SELECT id FROM roles WHERE name = 'admin')
    )
  );

-- Create policies for item locations
CREATE POLICY "Item locations are viewable by authenticated users" 
  ON item_locations FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Item locations are modifiable by admins and managers" 
  ON item_locations FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id IN (
        SELECT id FROM roles WHERE name IN ('admin', 'manager')
      )
    )
  );

-- Create policies for item maintenance
CREATE POLICY "Item maintenance is viewable by authenticated users" 
  ON item_maintenance FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Item maintenance is modifiable by admins and managers" 
  ON item_maintenance FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id IN (
        SELECT id FROM roles WHERE name IN ('admin', 'manager')
      )
    )
  );

-- Create policies for item documents
CREATE POLICY "Item documents are viewable by authenticated users" 
  ON item_documents FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Item documents are modifiable by admins and managers" 
  ON item_documents FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id IN (
        SELECT id FROM roles WHERE name IN ('admin', 'manager')
      )
    )
  );

-- Create policies for item versions
CREATE POLICY "Item versions are viewable by authenticated users" 
  ON item_versions FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Item versions are insertable by admins and managers" 
  ON item_versions FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id IN (
        SELECT id FROM roles WHERE name IN ('admin', 'manager')
      )
    )
  );

-- Create indexes for better query performance
CREATE INDEX idx_items_collection_id ON items(collection_id);
CREATE INDEX idx_items_category_id ON items(category_id);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_categories_collection_id ON categories(collection_id);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_item_customizations_item_id ON item_customizations(item_id);
CREATE INDEX idx_item_pricing_item_id ON item_pricing(item_id);
CREATE INDEX idx_item_locations_item_id ON item_locations(item_id);
CREATE INDEX idx_item_maintenance_item_id ON item_maintenance(item_id);
CREATE INDEX idx_item_documents_item_id ON item_documents(item_id);
CREATE INDEX idx_item_versions_item_id ON item_versions(item_id);

-- Create function for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_item_customizations_updated_at
  BEFORE UPDATE ON item_customizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_item_pricing_updated_at
  BEFORE UPDATE ON item_pricing
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_item_locations_updated_at
  BEFORE UPDATE ON item_locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_item_maintenance_updated_at
  BEFORE UPDATE ON item_maintenance
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_item_documents_updated_at
  BEFORE UPDATE ON item_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial collections
INSERT INTO collections (name, description, slug) VALUES
('Site Production', 'Equipment and resources for site setup and management', 'site-production'),
('Technical Production', 'Technical equipment and systems', 'technical-production'),
('Experiential Production', 'Equipment for creating immersive experiences', 'experiential-production'),
('Food & Beverage', 'Food service and beverage equipment', 'food-beverage'),
('Equipment & Supplies', 'General equipment and supplies', 'equipment-supplies');

-- Insert initial categories
INSERT INTO categories (collection_id, name, description, slug) VALUES
((SELECT id FROM collections WHERE slug = 'site-production'), 'Staging', 'Stage systems and components', 'staging'),
((SELECT id FROM collections WHERE slug = 'site-production'), 'Power', 'Power distribution and generators', 'power'),
((SELECT id FROM collections WHERE slug = 'site-production'), 'Structures', 'Temporary structures and tents', 'structures'),
((SELECT id FROM collections WHERE slug = 'technical-production'), 'Audio', 'Sound systems and equipment', 'audio'),
((SELECT id FROM collections WHERE slug = 'technical-production'), 'Lighting', 'Lighting systems and fixtures', 'lighting'),
((SELECT id FROM collections WHERE slug = 'technical-production'), 'Video', 'Video systems and displays', 'video'),
((SELECT id FROM collections WHERE slug = 'equipment-supplies'), 'Tools', 'Hand and power tools', 'tools'),
((SELECT id FROM collections WHERE slug = 'equipment-supplies'), 'Safety', 'Safety equipment and supplies', 'safety'),
((SELECT id FROM collections WHERE slug = 'equipment-supplies'), 'Transportation', 'Vehicles and transport equipment', 'transportation');