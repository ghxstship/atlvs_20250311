-- Create test tables for RLS validation
CREATE TABLE IF NOT EXISTS public_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS protected_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE protected_resources ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public resources are viewable by everyone"
  ON public_resources FOR SELECT
  USING (true);

CREATE POLICY "Protected resources are viewable by their owners"
  ON protected_resources FOR SELECT
  USING (auth.uid() = user_id);

-- Insert test data
INSERT INTO public_resources (name)
VALUES ('Test Public Resource')
ON CONFLICT DO NOTHING;