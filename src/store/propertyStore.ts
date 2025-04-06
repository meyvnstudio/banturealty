import { create } from 'zustand';
import { Property, PropertyFilters } from '../types';
import { supabase } from '../lib/supabase';

interface PropertyState {
  properties: Property[];
  loading: boolean;
  error: string | null;
  filters: PropertyFilters;
  currentProperty: Property | null;
  setFilters: (filters: PropertyFilters) => void;
  fetchProperties: () => Promise<void>;
  fetchPropertyById: (id: string) => Promise<void>;
  incrementViews: (id: string) => Promise<void>;
  checkUnlockStatus: (propertyId: string) => Promise<boolean>;
}

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: [],
  loading: false,
  error: null,
  filters: {},
  currentProperty: null,
  
  setFilters: (filters) => {
    set({ filters });
    get().fetchProperties();
  },

  fetchProperties: async () => {
    set({ loading: true, error: null });
    
    try {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('approved', true);

      const filters = get().filters;

      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.city) {
        query = query.contains('location', { city: filters.city });
      }

      if (filters.district) {
        query = query.contains('location', { district: filters.district });
      }

      if (filters.sector) {
        query = query.contains('location', { sector: filters.sector });
      }

      if (filters.neighborhood) {
        query = query.contains('location', { neighborhood: filters.neighborhood });
      }

      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters.sortBy) {
        query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      set({ properties: data as Property[] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch properties' });
    } finally {
      set({ loading: false });
    }
  },

  fetchPropertyById: async (id: string) => {
    set({ loading: true, error: null, currentProperty: null });
    
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      set({ currentProperty: data as Property });
      get().incrementViews(id);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch property' });
    } finally {
      set({ loading: false });
    }
  },

  incrementViews: async (id: string) => {
    try {
      await supabase.rpc('increment_property_views', { property_id: id });
    } catch (error) {
      console.error('Failed to increment views:', error);
    }
  },

  checkUnlockStatus: async (propertyId: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return false;

      const { data, error } = await supabase
        .from('property_unlocks')
        .select('id')
        .eq('property_id', propertyId)
        .eq('user_id', session.session.user.id)
        .single();

      if (error) return false;
      return !!data;
    } catch (error) {
      console.error('Failed to check unlock status:', error);
      return false;
    }
  },
}));