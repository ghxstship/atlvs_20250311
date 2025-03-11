import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface InventoryFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function InventoryForm({ onSubmit, onCancel, isSubmitting }: InventoryFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FormField
        label="Item Name"
        name="name"
        placeholder="Enter item name"
        required
      />
      
      <FormField label="Category" name="category" required>
        <select
          name="category"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select category</option>
          <option value="Staging Equipment">Staging Equipment</option>
          <option value="Audio Equipment">Audio Equipment</option>
          <option value="Visual Equipment">Visual Equipment</option>
          <option value="Lighting">Lighting</option>
          <option value="Props">Props</option>
          <option value="Consumables">Consumables</option>
        </select>
      </FormField>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Quantity"
          name="quantity"
          type="number"
          placeholder="Enter total quantity"
          required
        />
        
        <FormField
          label="Minimum Stock"
          name="minStock"
          type="number"
          placeholder="Enter minimum stock level"
          required
        />
      </div>
      
      <FormField label="Location" name="location" required>
        <select
          name="location"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select location</option>
          <option value="Warehouse A">Warehouse A</option>
          <option value="Warehouse B">Warehouse B</option>
          <option value="Various Locations">Various Locations</option>
        </select>
      </FormField>
      
      <FormField
        label="Unit Cost"
        name="unitCost"
        type="number"
        placeholder="Enter unit cost"
        required
      />
      
      <FormField label="Notes" name="notes">
        <textarea
          name="notes"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter any additional notes"
        />
      </FormField>

      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </form>
  );
}