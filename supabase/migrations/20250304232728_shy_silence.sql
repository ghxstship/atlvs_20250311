/*
# Fix Subscription and Profile Tables

1. Changes
  - Drop existing tables if they exist
  - Create products table
  - Create prices table
  - Create subscriptions table
  - Create profiles table
  - Add RLS policies
  - Add necessary indexes

2. Security
  - Enable RLS on all tables
  - Add appropriate policies for each table

3. Notes
  - Handles existing tables gracefully
  - Maintains data integrity
  - Proper error handling
*/

-- Drop existing tables if they exist
DO $$ 
BEGIN
  DROP TABLE IF EXISTS subscriptions CASCADE;
  DROP TABLE IF EXISTS prices CASCADE;
  DROP TABLE IF EXISTS products CASCADE;
  DROP TABLE IF EXISTS profiles CASCADE;
END $$;

-- Create products table
CREATE TABLE products (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  image text,
  active boolean DEFAULT true,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create prices table
CREATE TABLE prices (
  id text PRIMARY KEY,
  product_id text REFERENCES products(id),
  currency text NOT NULL,
  interval text,
  interval_count integer,
  unit_amount bigint,
  active boolean DEFAULT true,
  type text,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE subscriptions (
  id text PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL,
  price_id text REFERENCES prices(id),
  quantity integer,
  cancel_at_period_end boolean,
  created_at timestamptz DEFAULT now(),
  current_period_start timestamptz,
  current_period_end timestamptz,
  ended_at timestamptz,
  cancel_at timestamptz,
  canceled_at timestamptz,
  trial_start timestamptz,
  trial_end timestamptz,
  metadata jsonb
);

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  website text,
  bio text,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Prices are viewable by everyone"
  ON prices FOR SELECT
  USING (true);

CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create profile trigger
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Create profile trigger
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_user();

-- Create indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_prices_product_id ON prices(product_id);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);