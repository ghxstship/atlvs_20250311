-- Drop existing objects to avoid conflicts
DO $$ 
BEGIN
  -- Drop policies if they exist
  DROP POLICY IF EXISTS "Demo users can read their own data" ON demo_users;
  DROP POLICY IF EXISTS "Demo sessions are readable by their users" ON demo_sessions;
  DROP POLICY IF EXISTS "Demo users can be created" ON demo_users;
  DROP POLICY IF EXISTS "Demo sessions can be created" ON demo_sessions;
  
  -- Drop functions if they exist
  DROP FUNCTION IF EXISTS register_demo_user(uuid);
  DROP FUNCTION IF EXISTS check_demo_status(uuid);
  DROP FUNCTION IF EXISTS reset_demo_data(uuid);
  DROP FUNCTION IF EXISTS cleanup_demo_data(uuid);
  
  -- Drop tables if they exist
  DROP TABLE IF EXISTS demo_sessions CASCADE;
  DROP TABLE IF EXISTS demo_users CASCADE;
END $$;

-- Create demo users table
CREATE TABLE demo_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  last_reset_at timestamptz DEFAULT now()
);

-- Create demo sessions table
CREATE TABLE demo_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES demo_users(id) ON DELETE CASCADE,
  started_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  is_active boolean DEFAULT true
);

-- Enable RLS
ALTER TABLE demo_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Demo users can read their own data"
  ON demo_users FOR ALL
  USING (auth.uid() = id);

CREATE POLICY "Demo sessions are readable by their users"
  ON demo_sessions FOR ALL
  USING (auth.uid() = user_id);

-- Create function to register demo user
CREATE OR REPLACE FUNCTION register_demo_user(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_email text;
BEGIN
  -- Get user email from auth.users
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = user_id;

  -- Add user to demo_users table
  INSERT INTO demo_users (
    id,
    email,
    expires_at
  ) VALUES (
    user_id,
    user_email,
    now() + interval '14 days'
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    expires_at = EXCLUDED.expires_at,
    last_reset_at = now();
END;
$$;

-- Create function to check demo status
CREATE OR REPLACE FUNCTION check_demo_status(user_id uuid)
RETURNS TABLE (
  is_demo boolean,
  is_active boolean,
  expires_at timestamptz,
  last_reset_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    true as is_demo,
    d.expires_at > now() as is_active,
    d.expires_at,
    d.last_reset_at
  FROM demo_users d
  WHERE d.id = user_id;
END;
$$;

-- Create function to reset demo data
CREATE OR REPLACE FUNCTION reset_demo_data(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update last reset timestamp
  UPDATE demo_users
  SET last_reset_at = now()
  WHERE id = user_id;
  
  -- Reset demo data here
  -- Add specific table resets as needed
END;
$$;

-- Create function to cleanup demo data
CREATE OR REPLACE FUNCTION cleanup_demo_data(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Remove demo user data
  DELETE FROM demo_users WHERE id = user_id;
  -- Add other cleanup operations as needed
END;
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_demo_users_email ON demo_users(email);
CREATE INDEX IF NOT EXISTS idx_demo_sessions_user_id ON demo_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_demo_sessions_expires_at ON demo_sessions(expires_at);