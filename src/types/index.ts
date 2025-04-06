export type UserRole = 'client' | 'owner' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  isSubscribed?: boolean;
  subscription_status?: 'none' | 'active' | 'canceled' | 'past_due';
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: 'residential' | 'commercial' | 'land';
  status: 'sale' | 'rent';
  price: number;
  size: number;
  location: {
    city: string;
    district: string;
    sector: string;
    neighborhood: string;
    exactLocation?: string;
  };
  images: string[];
  amenities: string[];
  owner_id: string;
  approved: boolean;
  contact_details?: {
    name: string;
    phone: string;
    email: string;
  };
  views: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyFilters {
  type?: 'residential' | 'commercial' | 'land';
  status?: 'sale' | 'rent';
  city?: string;
  district?: string;
  sector?: string;
  neighborhood?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'created_at' | 'views' | 'price';
  sortOrder?: 'asc' | 'desc';
}

export interface Tenant {
  id: string;
  property_id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  lease_start_date: string;
  lease_end_date: string;
  rent_amount: number;
  security_deposit: number;
  lease_document?: string;
  status: 'active' | 'pending' | 'ended';
  created_at: string;
  updated_at: string;
}

export interface MaintenanceTicket {
  id: string;
  property_id: string;
  tenant_id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface RentPayment {
  id: string;
  tenant_id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  transaction_id?: string;
  status: 'pending' | 'completed' | 'failed';
  receipt_url?: string;
  created_at: string;
}

export interface Expense {
  id: string;
  property_id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  receipt_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  status: 'active' | 'canceled' | 'past_due';
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}