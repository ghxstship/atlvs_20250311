-- Drop existing tables and functions to start fresh
DO $$ 
BEGIN
  -- Drop existing tables if they exist
  DROP TABLE IF EXISTS users CASCADE;
  DROP TABLE IF EXISTS companies CASCADE;
  
  -- Drop existing functions
  DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
END $$;

-- Create companies table first
CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT companies_name_key UNIQUE (company_name),
  CONSTRAINT company_name_length CHECK (length(trim(company_name)) >= 2)
);

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL CHECK (length(trim(first_name)) >= 1),
  last_name text,
  email text NOT NULL,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT users_email_key UNIQUE (email),
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert during registration"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Companies are viewable by members"
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

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  company_id uuid;
  name_parts text[];
  company_name text;
  first_name text;
  last_name text;
BEGIN
  -- Input validation
  IF NEW.raw_user_meta_data IS NULL THEN
    RAISE EXCEPTION 'User metadata is required';
  END IF;

  -- Get and validate company name
  company_name := trim(NEW.raw_user_meta_data->>'company_name');
  IF company_name IS NULL OR length(company_name) < 2 THEN
    RAISE EXCEPTION 'Company name is required and must be at least 2 characters';
  END IF;

  -- Get and validate full name
  name_parts := regexp_split_to_array(trim(NEW.raw_user_meta_data->>'full_name'), '\s+');
  IF array_length(name_parts, 1) < 1 THEN
    RAISE EXCEPTION 'Full name is required';
  END IF;

  first_name := name_parts[1];
  last_name := array_to_string(name_parts[2:], ' ');

  -- Create or get existing company with transaction
  BEGIN
    WITH new_company AS (
      INSERT INTO companies (company_name)
      VALUES (company_name)
      ON CONFLICT (company_name) 
      DO UPDATE SET updated_at = now()
      RETURNING id
    )
    SELECT id INTO company_id FROM new_company;

    -- Create user profile
    INSERT INTO users (
      id,
      first_name,
      last_name,
      email,
      company_id
    ) VALUES (
      NEW.id,
      first_name,
      last_name,
      NEW.email,
      company_id
    );

    EXCEPTION WHEN OTHERS THEN
      -- Roll back the entire transaction
      RAISE EXCEPTION 'Registration failed: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_companies_name ON companies(company_name);

-- Create function to validate registration data
CREATE OR REPLACE FUNCTION validate_registration_data(
  email text,
  full_name text,
  company_name text
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate email
  IF email IS NULL OR email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RETURN false;
  END IF;

  -- Validate full name
  IF full_name IS NULL OR length(trim(full_name)) < 2 THEN
    RETURN false;
  END IF;

  -- Validate company name
  IF company_name IS NULL OR length(trim(company_name)) < 2 THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$$;