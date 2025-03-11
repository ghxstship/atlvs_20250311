import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { catalogItemSchema } from '../../lib/validation/catalog';
import { useCatalogStore } from '../../hooks/useCatalogStore';
import { Upload, Plus, Minus } from 'lucide-react';
import { FormWrapper } from '../../lib/form-context';
import Input from './Input';
import Select from './Select';
import Textarea from './Textarea';
import FormField from './FormField';
import FormActions from './FormActions';

type CatalogFormData = {
  name: string;
  collection_id: string;
  category_id: string;
  description?: string;
  specifications: Record<string, any>;
  status: 'available' | 'in_use' | 'maintenance' | 'retired';
  manufacturer?: string;
  model?: string;
  customFields: {
    name: string;
    value: string;
  }[];
};

interface CatalogFormProps {
  onSubmit: (data: CatalogFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialData?: Partial<CatalogFormData>;
}

export default function CatalogForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
  initialData
}: CatalogFormProps) {
  const { collections, categories, fetchCollections, fetchCategories } = useCatalogStore();
  const [customFields, setCustomFields] = useState<{name: string; value: string}[]>(
    initialData?.customFields || []
  );

  React.useEffect(() => {
    fetchCollections();
    fetchCategories();
  }, [fetchCollections, fetchCategories]);

  const form = useForm<CatalogFormData>({
    resolver: zodResolver(catalogItemSchema),
    defaultValues: {
      name: initialData?.name || '',
      collection_id: initialData?.collection_id || '',
      category_id: initialData?.category_id || '',
      description: initialData?.description || '',
      specifications: initialData?.specifications || {},
      status: initialData?.status || 'available',
      manufacturer: initialData?.manufacturer || '',
      model: initialData?.model || '',
      customFields: initialData?.customFields || []
    }
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      // Convert custom fields to specifications object
      const specifications = {
        ...data.specifications,
        ...Object.fromEntries(
          customFields.map(field => [field.name, field.value])
        )
      };

      await onSubmit({
        ...data,
        specifications
      });

      form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  });

  const addCustomField = () => {
    setCustomFields([...customFields, { name: '', value: '' }]);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const updateCustomField = (index: number, field: 'name' | 'value', value: string) => {
    const newFields = [...customFields];
    newFields[index][field] = value;
    setCustomFields(newFields);
  };

  return (
    <FormWrapper form={form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-mono-900">Basic Information</h3>
          
          <FormField
            label="Item Name"
            name="name"
            required
            description="Enter the official name of the item"
          >
            <Input 
              placeholder="Enter item name"
              maxLength={100}
              {...form.register('name')}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Collection"
              name="collection_id"
              required
            >
              <Select 
                options={collections.map(c => ({
                  value: c.id,
                  label: c.name
                }))}
                {...form.register('collection_id')}
              />
            </FormField>

            <FormField
              label="Category"
              name="category_id"
              required
            >
              <Select 
                options={categories.map(c => ({
                  value: c.id,
                  label: c.name
                }))}
                {...form.register('category_id')}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Manufacturer"
              name="manufacturer"
            >
              <Input 
                placeholder="Enter manufacturer name"
                {...form.register('manufacturer')}
              />
            </FormField>

            <FormField
              label="Model"
              name="model"
            >
              <Input 
                placeholder="Enter model number"
                {...form.register('model')}
              />
            </FormField>
          </div>

          <FormField
            label="Status"
            name="status"
            required
          >
            <Select 
              options={[
                { value: 'available', label: 'Available' },
                { value: 'in_use', label: 'In Use' },
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'retired', label: 'Retired' }
              ]}
              {...form.register('status')}
            />
          </FormField>

          <FormField
            label="Description"
            name="description"
          >
            <Textarea 
              placeholder="Enter item description"
              rows={4}
              {...form.register('description')}
            />
          </FormField>
        </div>

        {/* Specifications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-mono-900">Specifications</h3>
            <button
              type="button"
              onClick={addCustomField}
              className="flex items-center text-sm text-mono-600 hover:text-accent"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Field
            </button>
          </div>

          <div className="space-y-4">
            {customFields.map((field, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => updateCustomField(index, 'name', e.target.value)}
                    placeholder="Field name"
                    className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                    placeholder="Value"
                    className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeCustomField(index)}
                  className="p-2 text-mono-400 hover:text-red-500 rounded"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <FormActions 
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          submitLabel={initialData ? 'Update Item' : 'Add Item'}
        />
      </form>
    </FormWrapper>
  );
}