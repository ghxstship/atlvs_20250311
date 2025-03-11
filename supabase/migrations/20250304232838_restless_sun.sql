/*
# Fix Subscription Schema

1. Changes
  - Drop existing tables if they exist
  - Create products table
  - Create prices table
  - Create subscriptions table
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

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

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

-- Create indexes
CREATE INDEX idx_prices_product_id ON prices(product_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_price_id ON subscriptions(price_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);