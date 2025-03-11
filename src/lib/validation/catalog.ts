import { z } from 'zod';

export const catalogItemSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  collection_id: z.string().uuid('Invalid collection ID'),
  category_id: z.string().uuid('Invalid category ID'),
  description: z.string().optional(),
  specifications: z.record(z.any()),
  status: z.enum(['available', 'in_use', 'maintenance', 'retired']),
  manufacturer: z.string().optional(),
  model: z.string().optional()
});

export const itemCustomizationSchema = z.object({
  field_name: z.string().min(1, 'Field name is required'),
  field_type: z.enum(['text', 'number', 'boolean', 'date', 'select', 'multi-select']),
  field_value: z.any(),
  required: z.boolean().default(false)
});

export const itemPricingSchema = z.object({
  tier_name: z.string().min(1, 'Tier name is required'),
  rate_type: z.enum(['hourly', 'daily', 'weekly', 'monthly']),
  rate_amount: z.number().positive('Rate must be positive'),
  currency: z.string().default('USD'),
  min_duration: z.string().optional(),
  max_duration: z.string().optional()
});

export const itemLocationSchema = z.object({
  location_name: z.string().min(1, 'Location name is required'),
  location_type: z.enum(['warehouse', 'venue', 'transit', 'maintenance']),
  status: z.string().min(1, 'Status is required'),
  quantity: z.number().int().positive('Quantity must be positive')
});

export const itemMaintenanceSchema = z.object({
  schedule_type: z.enum(['routine', 'preventive', 'reactive']),
  interval_days: z.number().int().positive().optional(),
  last_maintenance: z.string().datetime().optional(),
  next_maintenance: z.string().datetime().optional(),
  notes: z.string().optional()
});

export const itemDocumentSchema = z.object({
  document_type: z.enum(['manual', 'certification', 'warranty', 'maintenance', 'other']),
  title: z.string().min(1, 'Title is required'),
  file_url: z.string().url('Invalid file URL'),
  file_size: z.number().int().positive().optional()
});

export const itemVersionSchema = z.object({
  version_number: z.string().min(1, 'Version number is required'),
  changes: z.record(z.any())
});

export const collectionSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  description: z.string().optional(),
  slug: z.string()
    .min(2, 'Slug must be at least 2 characters')
    .max(100, 'Slug cannot exceed 100 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format')
});

export const categorySchema = z.object({
  collection_id: z.string().uuid('Invalid collection ID'),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  description: z.string().optional(),
  slug: z.string()
    .min(2, 'Slug must be at least 2 characters')
    .max(100, 'Slug cannot exceed 100 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  parent_id: z.string().uuid('Invalid parent category ID').optional()
});