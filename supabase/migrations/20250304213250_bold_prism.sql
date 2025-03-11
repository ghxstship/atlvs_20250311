-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Demo users can read their own data" ON demo_users;
  DROP POLICY IF EXISTS "Demo sessions are readable by their users" ON demo_sessions;
END $$;

-- Create demo users table
CREATE TABLE IF NOT EXISTS demo_users (
  id uuid PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  last_reset_at timestamptz DEFAULT now()
);

-- Create demo sessions table
CREATE TABLE IF NOT EXISTS demo_sessions (
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
  ON demo_users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Demo sessions are readable by their users"
  ON demo_sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Create demo reset function
CREATE OR REPLACE FUNCTION reset_demo_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update last reset timestamp
  UPDATE demo_users
  SET last_reset_at = now()
  WHERE id = auth.uid();
  
  -- Reset demo data here
  -- This will be expanded based on the specific tables and data that need resetting
END;
$$;

-- Create demo session cleanup function
CREATE OR REPLACE FUNCTION cleanup_expired_demo_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Deactivate expired sessions
  UPDATE demo_sessions
  SET is_active = false
  WHERE expires_at < now();
  
  -- Delete old sessions
  DELETE FROM demo_sessions
  WHERE started_at < now() - interval '30 days';
END;
$$;

-- Create function to register demo user
CREATE OR REPLACE FUNCTION register_demo_user(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Add user to demo_users table
  INSERT INTO demo_users (
    id,
    expires_at
  ) VALUES (
    user_id,
    now() + interval '14 days'
  )
  ON CONFLICT (id) DO NOTHING;
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