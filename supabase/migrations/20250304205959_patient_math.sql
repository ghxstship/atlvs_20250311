/*
  # User Authentication Schema

  1. Tables
    - companies: Stores company information
    - users: Stores user profiles linked to auth.users
    - team_members: Manages company team memberships

  2. Security
    - Enable RLS on all tables
    - Policies for secure data access
    - Automatic user profile creation
    - Company team management

  3. Changes
    - Create initial schema
    - Set up security policies
    - Add helper functions
*/

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name varchar NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name varchar NOT NULL,
  last_name varchar NOT NULL,
  email varchar NOT NULL UNIQUE,
  company_id uuid REFERENCES companies(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  role varchar NOT NULL,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(user_id, company_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_company_id ON team_members(company_id);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(company_name);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Companies are viewable by authenticated users" ON companies;
  DROP POLICY IF EXISTS "Companies can be created by authenticated users" ON companies;
  DROP POLICY IF EXISTS "Companies can be updated by team admins" ON companies;
  DROP POLICY IF EXISTS "Users can view their own profile" ON users;
  DROP POLICY IF EXISTS "Users can view company members" ON users;
  DROP POLICY IF EXISTS "Users can update their own profile" ON users;
  DROP POLICY IF EXISTS "Team members are viewable by company members" ON team_members;
  DROP POLICY IF EXISTS "Team members can be created by admins" ON team_members;
  DROP POLICY IF EXISTS "Team members can be updated by admins" ON team_members;
END $$;

-- Companies policies
CREATE POLICY "Companies are viewable by authenticated users"
  ON companies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Companies can be created by authenticated users"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Companies can be updated by team admins"
  ON companies FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = companies.id
      AND team_members.user_id = auth.uid()
      AND team_members.role = 'admin'
    )
  );

-- Users policies
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can view company members"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.company_id = users.company_id
      AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Team members policies
CREATE POLICY "Team members are viewable by company members"
  ON team_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members viewer
      WHERE viewer.company_id = team_members.company_id
      AND viewer.user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can be created by admins"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members admin
      WHERE admin.company_id = team_members.company_id
      AND admin.user_id = auth.uid()
      AND admin.role = 'admin'
    )
  );

CREATE POLICY "Team members can be updated by admins"
  ON team_members FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members admin
      WHERE admin.company_id = team_members.company_id
      AND admin.user_id = auth.uid()
      AND admin.role = 'admin'
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION get_or_create_company(company_name text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  company_id uuid;
BEGIN
  -- Try to find existing company
  SELECT id INTO company_id
  FROM companies
  WHERE companies.company_name = get_or_create_company.company_name;
  
  -- Create new company if it doesn't exist
  IF company_id IS NULL THEN
    INSERT INTO companies (company_name)
    VALUES (get_or_create_company.company_name)
    RETURNING id INTO company_id;
  END IF;
  
  RETURN company_id;
END;
$$;

-- Trigger function for user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  company_id uuid;
BEGIN
  -- Get or create company
  SELECT get_or_create_company(NEW.raw_user_meta_data->>'company_name') INTO company_id;
  
  -- Create user profile
  INSERT INTO users (
    id,
    first_name,
    last_name,
    email,
    company_id
  ) VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email,
    company_id
  );
  
  -- Add user to company team
  INSERT INTO team_members (
    user_id,
    company_id,
    role
  ) VALUES (
    NEW.id,
    company_id,
    CASE 
      WHEN NOT EXISTS (
        SELECT 1 FROM team_members WHERE company_id = company_id
      ) THEN 'admin'
      ELSE 'member'
    END
  );
  
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();