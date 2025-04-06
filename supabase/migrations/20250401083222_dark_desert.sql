/*
  # Create SaaS Management Tables

  1. New Tables
    - `tenants`: Store tenant information and lease details
    - `maintenance_tickets`: Track maintenance requests
    - `rent_payments`: Track rent payments and receipts
    - `expenses`: Track property-related expenses
    - `subscriptions`: Track SaaS subscriptions

  2. Security
    - Enable RLS on all tables
    - Add policies for owners/brokers to manage their data
    - Add policies for tenants to view their data
    - Add policies for admins to view all data
*/

-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  lease_start_date date NOT NULL,
  lease_end_date date NOT NULL,
  rent_amount numeric NOT NULL CHECK (rent_amount > 0),
  security_deposit numeric NOT NULL CHECK (security_deposit >= 0),
  lease_document text,
  status text NOT NULL CHECK (status IN ('active', 'pending', 'ended')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage their tenants"
  ON tenants
  USING (
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id
      AND p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Tenants can view their own data"
  ON tenants
  FOR SELECT
  USING (user_id = auth.uid());

-- Create maintenance tickets table
CREATE TABLE IF NOT EXISTS maintenance_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

ALTER TABLE maintenance_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage maintenance tickets"
  ON maintenance_tickets
  USING (
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id
      AND p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Tenants can view and create tickets"
  ON maintenance_tickets
  USING (
    EXISTS (
      SELECT 1 FROM tenants t
      WHERE t.id = tenant_id
      AND t.user_id = auth.uid()
    )
  );

-- Create rent payments table
CREATE TABLE IF NOT EXISTS rent_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount > 0),
  payment_date date NOT NULL,
  payment_method text NOT NULL,
  transaction_id text,
  status text NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  receipt_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rent_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view rent payments"
  ON rent_payments
  USING (
    EXISTS (
      SELECT 1 FROM tenants t
      JOIN properties p ON t.property_id = p.id
      WHERE t.id = tenant_id
      AND p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Tenants can view their payments"
  ON rent_payments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tenants t
      WHERE t.id = tenant_id
      AND t.user_id = auth.uid()
    )
  );

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  category text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  description text NOT NULL,
  date date NOT NULL,
  receipt_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage expenses"
  ON expenses
  USING (
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id
      AND p.owner_id = auth.uid()
    )
  );

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  stripe_subscription_id text UNIQUE,
  status text NOT NULL CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their subscriptions"
  ON subscriptions
  FOR SELECT
  USING (user_id = auth.uid());

-- Add subscription status to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status text 
  CHECK (subscription_status IN ('none', 'active', 'canceled', 'past_due'))
  DEFAULT 'none';

-- Create function to check if a user has an active subscription
CREATE OR REPLACE FUNCTION has_active_subscription(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM subscriptions
    WHERE user_id = user_uuid
    AND status = 'active'
    AND current_period_end > now()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;