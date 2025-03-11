-- Create health check table
CREATE TABLE IF NOT EXISTS health_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL,
  checked_at timestamptz DEFAULT now(),
  details jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE health_checks ENABLE ROW LEVEL SECURITY;

-- Create policy for health check reads
CREATE POLICY "Health checks are readable by authenticated users"
  ON health_checks FOR SELECT
  TO authenticated
  USING (true);

-- Create policy for health check writes
CREATE POLICY "Health checks can be created by service role"
  ON health_checks FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Create index for timestamp lookups
CREATE INDEX idx_health_checks_checked_at ON health_checks(checked_at DESC);

-- Create function to record health check
CREATE OR REPLACE FUNCTION record_health_check(
  check_status text,
  check_details jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  check_id uuid;
BEGIN
  INSERT INTO health_checks (status, details)
  VALUES (check_status, check_details)
  RETURNING id INTO check_id;
  
  RETURN check_id;
END;
$$;

-- Create function to get latest health status
CREATE OR REPLACE FUNCTION get_health_status()
RETURNS TABLE (
  status text,
  checked_at timestamptz,
  details jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    h.status,
    h.checked_at,
    h.details
  FROM health_checks h
  ORDER BY h.checked_at DESC
  LIMIT 1;
END;
$$;