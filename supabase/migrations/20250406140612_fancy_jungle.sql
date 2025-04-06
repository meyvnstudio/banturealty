/*
  # Add Sample Data for Testing

  1. Sample Properties
    - Modern villa in Kigali (for sale)
    - Commercial space in city center (for rent)
    
  2. Sample Tenant Data
    - Lease information
    - Maintenance ticket
    - Rent payment
    - Property expense

  Note: Auth users must be created manually via the Supabase dashboard before running this migration
*/

-- Insert sample properties
INSERT INTO properties (
  id,
  title,
  description,
  type,
  status,
  price,
  size,
  location,
  images,
  amenities,
  approved,
  contact_details,
  views,
  created_at,
  updated_at
)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Modern Villa in Kigali',
  'Beautiful 4-bedroom villa with garden and pool',
  'residential',
  'sale',
  350000,
  2500,
  '{
    "city": "Kigali",
    "district": "Gasabo",
    "sector": "Kimironko",
    "neighborhood": "Kibagabaga",
    "exactLocation": "KG 11 Ave"
  }',
  ARRAY[
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  ],
  ARRAY['Pool', 'Garden', 'Security', 'Parking'],
  true,
  '{
    "name": "Alice Uwase",
    "phone": "+250780123456",
    "email": "owner@bantu.com"
  }',
  0,
  now(),
  now()
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Commercial Space in City Center',
  'Prime location commercial property',
  'commercial',
  'rent',
  5000,
  1500,
  '{
    "city": "Kigali",
    "district": "Nyarugenge",
    "sector": "Nyarugenge",
    "neighborhood": "City Center",
    "exactLocation": "KN 4 Ave"
  }',
  ARRAY[
    'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  ],
  ARRAY['24/7 Access', 'Elevator', 'Security', 'Parking'],
  true,
  '{
    "name": "Alice Uwase",
    "phone": "+250780123456",
    "email": "owner@bantu.com"
  }',
  0,
  now(),
  now()
);

-- Create function to update sample data after auth users are created
CREATE OR REPLACE FUNCTION update_sample_data()
RETURNS void AS $$
DECLARE
  admin_id uuid;
  owner_id uuid;
  user_id uuid;
BEGIN
  -- Get user IDs from auth.users table
  SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@bantu.com' LIMIT 1;
  SELECT id INTO owner_id FROM auth.users WHERE email = 'owner@bantu.com' LIMIT 1;
  SELECT id INTO user_id FROM auth.users WHERE email = 'user@bantu.com' LIMIT 1;

  -- Update profiles if users exist
  IF admin_id IS NOT NULL THEN
    INSERT INTO profiles (id, email, name, role, created_at, updated_at)
    VALUES (admin_id, 'admin@bantu.com', 'John Mugisha', 'admin', now(), now())
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin', name = 'John Mugisha';
  END IF;

  IF owner_id IS NOT NULL THEN
    INSERT INTO profiles (id, email, name, role, created_at, updated_at)
    VALUES (owner_id, 'owner@bantu.com', 'Alice Uwase', 'owner', now(), now())
    ON CONFLICT (id) DO UPDATE
    SET role = 'owner', name = 'Alice Uwase';

    -- Update properties owner
    UPDATE properties SET owner_id = owner_id WHERE owner_id IS NULL;
  END IF;

  IF user_id IS NOT NULL THEN
    INSERT INTO profiles (id, email, name, role, created_at, updated_at)
    VALUES (user_id, 'user@bantu.com', 'Robert Karemera', 'client', now(), now())
    ON CONFLICT (id) DO UPDATE
    SET role = 'client', name = 'Robert Karemera';

    -- Insert sample tenant data only if user exists
    INSERT INTO tenants (
      id,
      property_id,
      user_id,
      name,
      email,
      phone,
      lease_start_date,
      lease_end_date,
      rent_amount,
      security_deposit,
      status,
      created_at,
      updated_at
    )
    VALUES (
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      user_id,
      'Robert Karemera',
      'user@bantu.com',
      '+250780789012',
      '2025-01-01',
      '2025-12-31',
      5000,
      10000,
      'active',
      now(),
      now()
    )
    ON CONFLICT (id) DO NOTHING;

    -- Insert sample maintenance ticket
    INSERT INTO maintenance_tickets (
      id,
      property_id,
      tenant_id,
      title,
      description,
      priority,
      status,
      created_at,
      updated_at
    )
    VALUES (
      'dddddddd-dddd-dddd-dddd-dddddddddddd',
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      'AC Repair Needed',
      'The air conditioning unit is not cooling properly',
      'medium',
      'open',
      now(),
      now()
    )
    ON CONFLICT (id) DO NOTHING;

    -- Insert sample rent payment
    INSERT INTO rent_payments (
      id,
      tenant_id,
      amount,
      payment_date,
      payment_method,
      status,
      created_at
    )
    VALUES (
      'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
      'cccccccc-cccc-cccc-cccc-cccccccccccc',
      5000,
      '2025-01-01',
      'bank_transfer',
      'completed',
      now()
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;

  -- Insert sample expense
  INSERT INTO expenses (
    id,
    property_id,
    category,
    amount,
    description,
    date,
    created_at,
    updated_at
  )
  VALUES (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'maintenance',
    500,
    'Regular AC maintenance',
    '2025-01-15',
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Note: After creating the auth users via the Supabase dashboard, run:
-- SELECT update_sample_data();