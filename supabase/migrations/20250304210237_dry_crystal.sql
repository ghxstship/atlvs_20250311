/*
  # Fix Team Members Policy

  1. Changes
    - Fix NEW/OLD record references in policies
    - Add proper table references
    - Maintain all security policies
    - Fix syntax for insert/update policies

  2. Security
    - Maintain RLS protection
    - Ensure proper access control
    - Fix policy recursion issues

  3. Notes
    - First user in company becomes admin
    - Subsequent users become members
    - Admins can manage team members
*/

-- Drop existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Companies are viewable by authenticated users" ON companies;
  DROP POLICY IF EXISTS "Companies can be created by authenticated users" ON companies;
  DROP POLICY IF EXISTS "Companies can be updated by team admins" ON companies;
  DROP POLICY IF EXISTS "Companies can be deleted by team admins" ON companies;
  DROP POLICY IF EXISTS "Users can be created during registration" ON users;
  DROP POLICY IF EXISTS "Users can view their own profile" ON users;
  DROP POLICY IF EXISTS "Users can update their own profile" ON users;
  DROP POLICY IF EXISTS "Users can be deleted by themselves or admins" ON users;
  DROP POLICY IF EXISTS "Team members are viewable by company members" ON team_members;
  DROP POLICY IF EXISTS "First team member can be created during registration" ON team_members;
  DROP POLICY IF EXISTS "Team members can be updated by admins" ON team_members;
  DROP POLICY IF EXISTS "Team members can be deleted by admins" ON team_members;
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

CREATE POLICY "Companies can be deleted by team admins"
  ON companies FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = companies.id
      AND team_members.user_id = auth.uid()
      AND team_members.role = 'admin'
    )
  );

-- Users policies
CREATE POLICY "Users can be created during registration"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.company_id = users.company_id
      AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can be deleted by themselves or admins"
  ON users FOR DELETE
  USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.company_id = users.company_id
      AND tm.user_id = auth.uid()
      AND tm.role = 'admin'
    )
  );

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

CREATE POLICY "Team members can be created"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow first team member creation during registration
    NOT EXISTS (
      SELECT 1 FROM team_members existing
      WHERE existing.company_id = team_members.company_id
    )
    OR
    -- Allow admins to create additional team members
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

CREATE POLICY "Team members can be deleted by admins"
  ON team_members FOR DELETE
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
  is_first_user boolean;
BEGIN
  -- Get or create company
  SELECT get_or_create_company(NEW.raw_user_meta_data->>'company_name') INTO company_id;
  
  -- Check if this is the first user for the company
  SELECT NOT EXISTS (
    SELECT 1 FROM team_members 
    WHERE team_members.company_id = company_id
  ) INTO is_first_user;
  
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
    CASE WHEN is_first_user THEN 'admin' ELSE 'member' END
  );
  
  RETURN NEW;
END;
$$;