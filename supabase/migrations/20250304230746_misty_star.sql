-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can read their own data" ON users;
  DROP POLICY IF EXISTS "Users can update their own data" ON users;
  DROP POLICY IF EXISTS "Companies are viewable by their members" ON companies;
  DROP POLICY IF EXISTS "Allow users to read own profile" ON users;
  DROP POLICY IF EXISTS "Allow users to update own profile" ON users;
  DROP POLICY IF EXISTS "Allow company members to view company" ON companies;
  DROP POLICY IF EXISTS "Allow insert during registration" ON users;
  DROP POLICY IF EXISTS "Allow company creation during registration" ON companies;
END $$;

-- Create companies table first (to avoid foreign key issues)
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create users table with proper foreign key
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  email text UNIQUE NOT NULL,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow users to read own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Allow users to update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Allow company members to view company"
  ON companies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.company_id = companies.id
      AND users.id = auth.uid()
    )
  );

CREATE POLICY "Allow insert during registration"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow company creation during registration"
  ON companies FOR INSERT
  WITH CHECK (true);

-- Create function to handle new user registration with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  company_id uuid;
  name_parts text[];
  company_name text;
BEGIN
  -- Get company name from metadata with validation
  company_name := NEW.raw_user_meta_data->>'company_name';
  IF company_name IS NULL OR length(trim(company_name)) < 2 THEN
    RAISE EXCEPTION 'Invalid company name';
  END IF;

  -- Create or get existing company
  BEGIN
    INSERT INTO companies (company_name)
    VALUES (trim(company_name))
    ON CONFLICT (company_name) 
    DO UPDATE SET updated_at = now()
    RETURNING id INTO company_id;
  EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to process company: %', SQLERRM;
  END;

  -- Split full name into parts with validation
  name_parts := regexp_split_to_array(trim(NEW.raw_user_meta_data->>'full_name'), '\s+');
  IF array_length(name_parts, 1) < 1 THEN
    RAISE EXCEPTION 'Invalid name format';
  END IF;

  -- Create user profile
  BEGIN
    INSERT INTO users (
      id,
      first_name,
      last_name,
      email,
      company_id
    ) VALUES (
      NEW.id,
      COALESCE(name_parts[1], ''),
      COALESCE(array_to_string(name_parts[2:], ' '), ''),
      NEW.email,
      company_id
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to create user profile: %', SQLERRM;
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(company_name);