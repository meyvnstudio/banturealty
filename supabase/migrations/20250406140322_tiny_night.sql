/*
  # Add Sample Users and Data

  1. Sample Users
    - Admin user with full platform access
    - Owner/broker with property management capabilities
    - Regular client/buyer user
    
  2. Security
    - Passwords are handled by Supabase Auth
    - Profile data stored in profiles table
    
  Note: This migration adds initial data only
*/

-- Insert sample users into profiles table
INSERT INTO profiles (id, email, name, role, created_at, updated_at)
VALUES 
  -- Admin user
  (
    '11111111-1111-1111-1111-111111111111',
    'admin@bantu.com',
    'John Mugisha',
    'admin',
    now(),
    now()
  ),
  -- Owner/broker user
  (
    '22222222-2222-2222-2222-222222222222',
    'owner@bantu.com',
    'Alice Uwase',
    'owner',
    now(),
    now()
  ),
  -- Regular client/buyer user
  (
    '33333333-3333-3333-3333-333333333333',
    'user@bantu.com',
    'Robert Karemera',
    'client',
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample properties for the owner
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
  owner_id,
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
  '22222222-2222-2222-2222-222222222222',
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
  '22222222-2222-2222-2222-222222222222',
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

-- Insert sample tenant for the owner's property
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
  '33333333-3333-3333-3333-333333333333',
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
);

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
);

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
);

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
);