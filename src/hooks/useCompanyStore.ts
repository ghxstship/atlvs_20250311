import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { logError } from '../lib/monitoring';

interface Company {
  id: string;
  name: string;
  type: string;
  employees: number;
  location: string;
  status: 'Active Partner' | 'Under Review' | 'Inactive';
  description: string;
  website?: string;
  phone?: string;
  email?: string;
  contacts: {
    name: string;
    role: string;
    phone: string;
    email: string;
  }[];
  projects: {
    name: string;
    role: string;
    dates: string;
    value: number;
  }[];
  contracts: {
    type: string;
    start: string;
    end: string;
    value: number;
  }[];
  documents: {
    name: string;
    size: string;
    date: string;
  }[];
  created_at: string;
  updated_at: string;
}

interface CompanyState {
  companies: Company[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchCompanies: () => Promise<void>;
  addCompany: (company: Partial<Company>) => Promise<void>;
  updateCompany: (id: string, company: Partial<Company>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  
  // Loading States
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCompanyStore = create<CompanyState>((set, get) => ({
  companies: [],
  loading: false,
  error: null,

  fetchCompanies: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');
      
      if (error) throw error;
      set({ companies: data || [] });
    } catch (error) {
      logError(error as Error, { context: 'fetch-companies' });
      set({ error: 'Failed to fetch companies' });
    } finally {
      set({ loading: false });
    }
  },

  addCompany: async (company) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('companies')
        .insert(company)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('No data returned');
      
      set(state => ({ 
        companies: [...state.companies, data]
      }));
    } catch (error) {
      logError(error as Error, { context: 'add-company' });
      set({ error: 'Failed to add company' });
    } finally {
      set({ loading: false });
    }
  },

  updateCompany: async (id, company) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('companies')
        .update(company)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('No data returned');
      
      set(state => ({
        companies: state.companies.map(c => 
          c.id === id ? { ...c, ...data } : c
        )
      }));
    } catch (error) {
      logError(error as Error, { context: 'update-company' });
      set({ error: 'Failed to update company' });
    } finally {
      set({ loading: false });
    }
  },

  deleteCompany: async (id) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        companies: state.companies.filter(c => c.id !== id)
      }));
    } catch (error) {
      logError(error as Error, { context: 'delete-company' });
      set({ error: 'Failed to delete company' });
    } finally {
      set({ loading: false });
    }
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error })
}));