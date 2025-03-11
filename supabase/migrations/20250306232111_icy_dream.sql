/*
  # Companies Schema Setup

  1. New Tables
    - `companies` table for storing organization information
      - Core company details (name, company_type, location, etc.)
      - Contact information
      - Status tracking
      - Timestamps
    
  2. Security
    - Row Level Security (RLS) enabled
    - Policies for viewing and modifying companies
    - Audit logging for changes
    
  3. Changes
    - Create companies table with all necessary columns and constraints
    - Create indexes for performance
    - Set up RLS policies
    - Add audit logging
*/

-- Drop existing objects if they exist
DROP TABLE IF EXISTS companies CASCADE;

-- Create companies table with all columns and constraints
CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(TRIM(name)) >= 2),
  company_type text NOT NULL,
  employees integer,
  location text,
  company_status text NOT NULL DEFAULT 'Under Review' CHECK (company_status IN ('Active Partner', 'Under Review', 'Inactive')),
  description text,
  website text,
  phone text,
  email text CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_companies_company_type ON companies(company_type);
CREATE INDEX idx_companies_company_status ON companies(company_status);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Companies are viewable by authenticated users"
  ON companies
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Companies are modifiable by admins and managers"
  ON companies
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id IN (
        SELECT id FROM roles 
        WHERE name IN ('admin', 'manager')
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_id IN (
        SELECT id FROM roles 
        WHERE name IN ('admin', 'manager')
      )
    )
  );

-- Create trigger for updating updated_at
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create audit log trigger
CREATE TRIGGER log_companies_changes
  AFTER INSERT OR UPDATE OR DELETE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION log_audit_event();

-- Add comments
COMMENT ON TABLE companies IS 'Companies and organizations that work with the platform';
COMMENT ON COLUMN companies.company_status IS 'Current status of the company relationship';
COMMENT ON COLUMN companies.company_type IS 'Type or category of the company';