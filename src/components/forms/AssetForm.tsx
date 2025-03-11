import React from 'react';
import FormField from './FormField';
import FormActions from './FormActions';

interface AssetFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function AssetForm({ onSubmit, onCancel, isSubmitting }: AssetFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FormField
        label="Asset Name"
        name="name"
        placeholder="Enter asset name"
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
        </select>
      </FormField>
      
      <FormField
        label="Serial Number"
        name="serialNumber"
        placeholder="Enter serial number"
      />
      
      <FormField
        label="Purchase Date"
        name="purchaseDate"
        type="date"
      />
      
      <FormField
        label="Purchase Price"
        name="purchasePrice"
        type="number"
        placeholder="Enter purchase price"
      />
      
      <FormField label="Condition" name="condition" required>
        <select
          name="condition"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select condition</option>
          <option value="Excellent">Excellent</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
          <option value="Poor">Poor</option>
        </select>
      </FormField>
      
      <FormField label="Location" name="location" required>
        <select
          name="location"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select location</option>
          <option value="Warehouse A">Warehouse A</option>
          <option value="Warehouse B">Warehouse B</option>
          <option value="On Site">On Site</option>
        </select>
      </FormField>
      
      <FormField label="Notes" name="notes">
        <textarea
          name="notes"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter additional notes"
        />
      </FormField>

      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </form>
  );
}