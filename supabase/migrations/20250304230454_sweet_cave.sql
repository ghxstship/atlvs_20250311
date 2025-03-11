-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can read their own data" ON users;
  DROP POLICY IF EXISTS "Users can update their own data" ON users;
  DROP POLICY IF EXISTS "Companies are viewable by their members" ON companies;
END $$;

-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  email text UNIQUE NOT NULL,
  company_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create companies table if not exists
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL UNIQUE,
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

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  company_id uuid;
  name_parts text[];
BEGIN
  -- Get or create company
  WITH new_company AS (
    INSERT INTO companies (company_name)
    VALUES (NEW.raw_user_meta_data->>'company_name')
    ON CONFLICT (company_name) DO UPDATE
    SET updated_at = now()
    RETURNING id
  )
  SELECT id INTO company_id FROM new_company;

  -- Split full name into parts safely
  name_parts := regexp_split_to_array(NEW.raw_user_meta_data->>'full_name', '\s+');

  -- Create user profile with proper error handling
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

-- Add insert policies for initial user creation
CREATE POLICY "Allow insert during registration"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow company creation during registration"
  ON companies FOR INSERT
  WITH CHECK (true);