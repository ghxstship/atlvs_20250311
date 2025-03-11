/*
# Fix Registration Issues

1. Schema Changes
  - Simplify user registration flow
  - Add better error handling
  - Ensure proper table constraints

2. Security
  - Improve RLS policies
  - Add validation functions

3. Changes
  - Simplified company and user creation
  - Added better error messages
  - Fixed transaction handling
*/

-- Drop existing objects
DO $$ 
BEGIN
  DROP TABLE IF EXISTS users CASCADE;
  DROP TABLE IF EXISTS companies CASCADE;
  DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
END $$;

-- Create companies table
CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT companies_name_check CHECK (char_length(trim(name)) >= 2)
);

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  company_id uuid REFERENCES companies(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT users_full_name_check CHECK (char_length(trim(full_name)) >= 2)
);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Companies are viewable by their users"
  ON companies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.company_id = companies.id
      AND users.id = auth.uid()
    )
  );

CREATE POLICY "Companies can be created during registration"
  ON companies FOR INSERT
  WITH CHECK (true);

-- Create registration handler function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  company_id uuid;
BEGIN
  -- Validate required metadata
  IF NEW.raw_user_meta_data IS NULL OR 
     NEW.raw_user_meta_data->>'full_name' IS NULL OR
     NEW.raw_user_meta_data->>'company_name' IS NULL THEN
    RAISE EXCEPTION 'Missing required registration data';
  END IF;

  -- Create company
  INSERT INTO companies (name)
  VALUES (trim(NEW.raw_user_meta_data->>'company_name'))
  ON CONFLICT DO NOTHING
  RETURNING id INTO company_id;

  -- If company already existed, get its ID
  IF company_id IS NULL THEN
    SELECT id INTO company_id
    FROM companies
    WHERE name = trim(NEW.raw_user_meta_data->>'company_name');
  END IF;

  -- Create user profile
  INSERT INTO users (
    id,
    full_name,
    email,
    company_id
  ) VALUES (
    NEW.id,
    trim(NEW.raw_user_meta_data->>'full_name'),
    NEW.email,
    company_id
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Registration failed: %', SQLERRM;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);