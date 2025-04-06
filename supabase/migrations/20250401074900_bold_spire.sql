/*
  # Initial Schema Setup for Real Estate SaaS Platform

  1. New Tables
    - `profiles`
      - Extended user profile data
      - Linked to auth.users
      - Stores role and subscription status
    
    - `properties`
      - Main property listings table
      - Stores property details and status
      - Links to owner profile
    
    - `property_unlocks`
      - Tracks which users have paid to unlock properties
      - Prevents duplicate charges
    
    - `property_favorites`
      - Stores user's favorite properties
    
    - `role_change_requests`
      - Tracks requests to change user roles
      - Pending admin approval status

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated access
    - Admin-only policies where needed
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  name text,
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'owner', 'admin')),
  is_subscribed boolean DEFAULT false,
  subscription_expires_at timestamptz,
  can_self_list boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('residential', 'commercial', 'land')),
  status text NOT NULL CHECK (status IN ('sale', 'rent')),
  price numeric NOT NULL CHECK (price > 0),
  size numeric NOT NULL CHECK (size > 0),
  location jsonb NOT NULL,
  images text[] NOT NULL DEFAULT '{}',
  amenities text[] NOT NULL DEFAULT '{}',
  owner_id uuid REFERENCES profiles(id),
  approved boolean DEFAULT false,
  contact_details jsonb,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create property_unlocks table
CREATE TABLE IF NOT EXISTS property_unlocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id),
  payment_intent_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(property_id, user_id)
);

-- Create property_favorites table
CREATE TABLE IF NOT EXISTS property_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(property_id, user_id)
);

-- Create role_change_requests table
CREATE TABLE IF NOT EXISTS role_change_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  requested_role text NOT NULL CHECK (requested_role IN ('client', 'owner')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_change_requests ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Properties policies
CREATE POLICY "Properties are viewable by everyone"
  ON properties FOR SELECT
  USING (true);

CREATE POLICY "Owners can insert properties"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND (role = 'owner' OR role = 'admin')
    )
  );

CREATE POLICY "Owners can update own properties"
  ON properties FOR UPDATE
  USING (owner_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Property unlocks policies
CREATE POLICY "Users can view own unlocks"
  ON property_unlocks FOR SELECT
  USING (user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can create unlocks"
  ON property_unlocks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Property favorites policies
CREATE POLICY "Users can manage own favorites"
  ON property_favorites
  USING (user_id = auth.uid());

-- Role change requests policies
CREATE POLICY "Users can view own requests"
  ON role_change_requests FOR SELECT
  USING (user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can create role change requests"
  ON role_change_requests FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, role)
  VALUES (new.id, new.email, 'client');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();