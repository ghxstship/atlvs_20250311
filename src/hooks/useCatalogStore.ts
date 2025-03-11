import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { logError } from '../lib/monitoring';

interface CatalogItem {
  id: string;
  name: string;
  collection_id: string;
  category_id: string;
  description?: string;
  specifications: Record<string, any>;
  status: 'available' | 'in_use' | 'maintenance' | 'retired';
  created_at: string;
  updated_at: string;
}

interface CatalogCollection {
  id: string;
  name: string;
  description?: string;
  slug: string;
}

interface CatalogCategory {
  id: string;
  collection_id: string;
  name: string;
  description?: string;
  slug: string;
  parent_id?: string;
}

interface CatalogState {
  items: CatalogItem[];
  collections: CatalogCollection[];
  categories: CatalogCategory[];
  loading: boolean;
  error: string | null;
  
  // Collection Actions
  fetchCollections: () => Promise<void>;
  addCollection: (collection: Partial<CatalogCollection>) => Promise<void>;
  updateCollection: (id: string, collection: Partial<CatalogCollection>) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  
  // Category Actions
  fetchCategories: () => Promise<void>;
  addCategory: (category: Partial<CatalogCategory>) => Promise<void>;
  updateCategory: (id: string, category: Partial<CatalogCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Item Actions
  fetchItems: () => Promise<void>;
  addItem: (item: Partial<CatalogItem>) => Promise<void>;
  updateItem: (id: string, item: Partial<CatalogItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  
  // Loading States
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  items: [],
  collections: [],
  categories: [],
  loading: false,
  error: null,

  // Collection Actions
  fetchCollections: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('name');
      
      if (error) throw error;
      set({ collections: data || [] });
    } catch (error) {
      logError(error as Error, { context: 'fetch-collections' });
      set({ error: 'Failed to fetch collections' });
    } finally {
      set({ loading: false });
    }
  },

  addCollection: async (collection) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('collections')
        .insert(collection)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('No data returned');
      
      set(state => ({ 
        collections: [...state.collections, data]
      }));
    } catch (error) {
      logError(error as Error, { context: 'add-collection' });
      set({ error: 'Failed to add collection' });
    } finally {
      set({ loading: false });
    }
  },

  updateCollection: async (id, collection) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('collections')
        .update(collection)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('No data returned');
      
      set(state => ({
        collections: state.collections.map(c => 
          c.id === id ? { ...c, ...data } : c
        )
      }));
    } catch (error) {
      logError(error as Error, { context: 'update-collection' });
      set({ error: 'Failed to update collection' });
    } finally {
      set({ loading: false });
    }
  },

  deleteCollection: async (id) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        collections: state.collections.filter(c => c.id !== id)
      }));
    } catch (error) {
      logError(error as Error, { context: 'delete-collection' });
      set({ error: 'Failed to delete collection' });
    } finally {
      set({ loading: false });
    }
  },

  // Category Actions
  fetchCategories: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      set({ categories: data || [] });
    } catch (error) {
      logError(error as Error, { context: 'fetch-categories' });
      set({ error: 'Failed to fetch categories' });
    } finally {
      set({ loading: false });
    }
  },

  addCategory: async (category) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('No data returned');
      
      set(state => ({ 
        categories: [...state.categories, data]
      }));
    } catch (error) {
      logError(error as Error, { context: 'add-category' });
      set({ error: 'Failed to add category' });
    } finally {
      set({ loading: false });
    }
  },

  updateCategory: async (id, category) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('categories')
        .update(category)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('No data returned');
      
      set(state => ({
        categories: state.categories.map(c => 
          c.id === id ? { ...c, ...data } : c
        )
      }));
    } catch (error) {
      logError(error as Error, { context: 'update-category' });
      set({ error: 'Failed to update category' });
    } finally {
      set({ loading: false });
    }
  },

  deleteCategory: async (id) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        categories: state.categories.filter(c => c.id !== id)
      }));
    } catch (error) {
      logError(error as Error, { context: 'delete-category' });
      set({ error: 'Failed to delete category' });
    } finally {
      set({ loading: false });
    }
  },

  // Item Actions
  fetchItems: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          collection:collections(name),
          category:categories(name)
        `)
        .order('name');
      
      if (error) throw error;
      set({ items: data || [] });
    } catch (error) {
      logError(error as Error, { context: 'fetch-items' });
      set({ error: 'Failed to fetch items' });
    } finally {
      set({ loading: false });
    }
  },

  addItem: async (item) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('items')
        .insert(item)
        .select(`
          *,
          collection:collections(name),
          category:categories(name)
        `)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('No data returned');
      
      set(state => ({ 
        items: [...state.items, data]
      }));
    } catch (error) {
      logError(error as Error, { context: 'add-item' });
      set({ error: 'Failed to add item' });
    } finally {
      set({ loading: false });
    }
  },

  updateItem: async (id, item) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('items')
        .update(item)
        .eq('id', id)
        .select(`
          *,
          collection:collections(name),
          category:categories(name)
        `)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('No data returned');
      
      set(state => ({
        items: state.items.map(i => 
          i.id === id ? { ...i, ...data } : i
        )
      }));
    } catch (error) {
      logError(error as Error, { context: 'update-item' });
      set({ error: 'Failed to update item' });
    } finally {
      set({ loading: false });
    }
  },

  deleteItem: async (id) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        items: state.items.filter(i => i.id !== id)
      }));
    } catch (error) {
      logError(error as Error, { context: 'delete-item' });
      set({ error: 'Failed to delete item' });
    } finally {
      set({ loading: false });
    }
  },

  // Loading States
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error })
}));