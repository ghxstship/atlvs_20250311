export interface CatalogItem {
  id: string;
  name: string;
  collection_id: string;
  category_id: string;
  description?: string;
  specifications: Record<string, any>;
  status: 'available' | 'in_use' | 'maintenance' | 'retired';
  created_at: string;
  updated_at: string;
  collection?: {
    name: string;
  };
  category?: {
    name: string;
  };
}

export interface CatalogCollection {
  id: string;
  name: string;
  description?: string;
  slug: string;
}

export interface CatalogCategory {
  id: string;
  collection_id: string;
  name: string;
  description?: string;
  slug: string;
  parent_id?: string;
}

export interface ItemCustomization {
  id: string;
  item_id: string;
  field_name: string;
  field_type: 'text' | 'number' | 'boolean' | 'date' | 'select' | 'multi-select';
  field_value: any;
  required: boolean;
}

export interface ItemPricing {
  id: string;
  item_id: string;
  tier_name: string;
  rate_type: 'hourly' | 'daily' | 'weekly' | 'monthly';
  rate_amount: number;
  currency: string;
  min_duration?: string;
  max_duration?: string;
}

export interface ItemLocation {
  id: string;
  item_id: string;
  location_name: string;
  location_type: 'warehouse' | 'venue' | 'transit' | 'maintenance';
  status: string;
  quantity: number;
}

export interface ItemMaintenance {
  id: string;
  item_id: string;
  schedule_type: 'routine' | 'preventive' | 'reactive';
  interval_days?: number;
  last_maintenance?: string;
  next_maintenance?: string;
  notes?: string;
}

export interface ItemDocument {
  id: string;
  item_id: string;
  document_type: 'manual' | 'certification' | 'warranty' | 'maintenance' | 'other';
  title: string;
  file_url: string;
  file_size?: number;
  created_by?: string;
}

export interface ItemVersion {
  id: string;
  item_id: string;
  version_number: string;
  changes: Record<string, any>;
  created_by?: string;
}