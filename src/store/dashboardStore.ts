import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Tenant, MaintenanceTicket, RentPayment, Expense, Property } from '../types';

interface DashboardState {
  tenants: Tenant[];
  tickets: MaintenanceTicket[];
  payments: RentPayment[];
  expenses: Expense[];
  pendingProperties: Property[];
  loading: boolean;
  error: string | null;
  fetchTenants: () => Promise<void>;
  fetchTickets: () => Promise<void>;
  fetchPayments: () => Promise<void>;
  fetchExpenses: () => Promise<void>;
  fetchPendingProperties: () => Promise<void>;
  createTenant: (tenant: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  createTicket: (ticket: Omit<MaintenanceTicket, 'id' | 'created_at' | 'updated_at' | 'resolved_at'>) => Promise<void>;
  updateTicketStatus: (id: string, status: MaintenanceTicket['status']) => Promise<void>;
  recordPayment: (payment: Omit<RentPayment, 'id' | 'created_at'>) => Promise<void>;
  recordExpense: (expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  approveProperty: (id: string) => Promise<void>;
  rejectProperty: (id: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  tenants: [],
  tickets: [],
  payments: [],
  expenses: [],
  pendingProperties: [],
  loading: false,
  error: null,

  fetchTenants: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ tenants: data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch tenants' });
    } finally {
      set({ loading: false });
    }
  },

  fetchTickets: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('maintenance_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ tickets: data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch tickets' });
    } finally {
      set({ loading: false });
    }
  },

  fetchPayments: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('rent_payments')
        .select('*')
        .order('payment_date', { ascending: false });

      if (error) throw error;
      set({ payments: data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch payments' });
    } finally {
      set({ loading: false });
    }
  },

  fetchExpenses: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      set({ expenses: data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch expenses' });
    } finally {
      set({ loading: false });
    }
  },

  fetchPendingProperties: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('approved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ pendingProperties: data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch pending properties' });
    } finally {
      set({ loading: false });
    }
  },

  createTenant: async (tenant) => {
    try {
      const { error } = await supabase.from('tenants').insert([tenant]);
      if (error) throw error;
      get().fetchTenants();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create tenant' });
    }
  },

  createTicket: async (ticket) => {
    try {
      const { error } = await supabase.from('maintenance_tickets').insert([ticket]);
      if (error) throw error;
      get().fetchTickets();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create ticket' });
    }
  },

  updateTicketStatus: async (id, status) => {
    try {
      const { error } = await supabase
        .from('maintenance_tickets')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      get().fetchTickets();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update ticket' });
    }
  },

  recordPayment: async (payment) => {
    try {
      const { error } = await supabase.from('rent_payments').insert([payment]);
      if (error) throw error;
      get().fetchPayments();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to record payment' });
    }
  },

  recordExpense: async (expense) => {
    try {
      const { error } = await supabase.from('expenses').insert([expense]);
      if (error) throw error;
      get().fetchExpenses();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to record expense' });
    }
  },

  approveProperty: async (id) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ approved: true })
        .eq('id', id);

      if (error) throw error;
      get().fetchPendingProperties();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to approve property' });
    }
  },

  rejectProperty: async (id) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      get().fetchPendingProperties();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to reject property' });
    }
  },
}));