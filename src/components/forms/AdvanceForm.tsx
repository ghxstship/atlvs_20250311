import React, { useState } from 'react';
import FormField from './FormField';
import FormActions from './FormActions';
import { Plus, Minus, Search, Edit, Trash2 } from 'lucide-react';

interface AdvanceFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface LineItem {
  category: string;
  itemId: string;
  itemName: string;
  quantity: string;
  description: string;
}

// Mock catalog items - in real app, this would come from your Catalog database
const catalogItems = {
  'Audio': [
    { id: 'A1', name: 'Line Array Speaker System' },
    { id: 'A2', name: 'Digital Mixing Console' },
    { id: 'A3', name: 'Wireless Microphone Set' }
  ],
  'Lighting': [
    { id: 'L1', name: 'Moving Head Light' },
    { id: 'L2', name: 'LED Par Can' },
    { id: 'L3', name: 'Follow Spot' }
  ],
  'Video': [
    { id: 'V1', name: 'LED Wall Panel' },
    { id: 'V2', name: 'Video Processor' },
    { id: 'V3', name: 'HD Camera' }
  ]
};

const categories = [
  'Audio',
  'Backline',
  'Camping',
  'Catering',
  'Containers & Trailers',
  'Credentials',
  'Crowd Control',
  'Decking',
  'Event Rentals',
  'Fencing',
  'Flights',
  'Flooring',
  'Ground Protection',
  'Heavy Equipment',
  'Hotels',
  'IT',
  'Labor',
  'Lighting',
  'Office Supplies',
  'Parking',
  'Power',
  'Radios',
  'Rental Cars',
  'Rigging',
  'Sanitation',
  'Scenic',
  'Security',
  'Shuttles',
  'Scrim',
  'Signage',
  'Site Supplies',
  'Site Vehicles',
  'Special FX',
  'Staging',
  'Tenting',
  'Traffic Control',
  'Video',
  'Waste Management'
].sort();

export default function AdvanceForm({ onSubmit, onCancel, isSubmitting }: AdvanceFormProps) {
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { category: '', itemId: '', itemName: '', quantity: '', description: '' }
  ]);

  const addLineItem = () => {
    setLineItems([...lineItems, { category: '', itemId: '', itemName: '', quantity: '', description: '' }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string) => {
    const newLineItems = [...lineItems];
    newLineItems[index] = { ...newLineItems[index], [field]: value };

    // If changing category, reset item selection
    if (field === 'category') {
      newLineItems[index].itemId = '';
      newLineItems[index].itemName = '';
    }

    // If selecting an item, update the item name
    if (field === 'itemId' && value) {
      const category = newLineItems[index].category;
      const selectedItem = catalogItems[category as keyof typeof catalogItems]?.find(item => item.id === value);
      if (selectedItem) {
        newLineItems[index].itemName = selectedItem.name;
      }
    }

    setLineItems(newLineItems);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Advance ID"
          name="advanceId"
          placeholder="Enter advance ID"
          required
        />

        <FormField
          label="Job ID"
          name="jobId"
          placeholder="Enter job ID"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Project" name="project" required>
          <select
            name="project"
            className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          >
            <option value="">Select project</option>
            <option value="Summer Music Festival">Summer Music Festival</option>
            <option value="Corporate Event">Corporate Event</option>
            <option value="Theater Production">Theater Production</option>
          </select>
        </FormField>

        <FormField label="Company" name="company" required>
          <select
            name="company"
            className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          >
            <option value="">Select company</option>
            <option value="Stage Systems Inc.">Stage Systems Inc.</option>
            <option value="Sound Solutions Ltd">Sound Solutions Ltd</option>
            <option value="Event Tech Pro">Event Tech Pro</option>
          </select>
        </FormField>
      </div>

      <FormField label="Team" name="team" required>
        <select
          name="team"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select team</option>
          <option value="Production Team A">Production Team A</option>
          <option value="Audio Engineering">Audio Engineering</option>
          <option value="Lighting Crew">Lighting Crew</option>
          <option value="Stage Management">Stage Management</option>
        </select>
      </FormField>

      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Line Items</h3>
            <button
              type="button"
              onClick={addLineItem}
              className="flex items-center text-sm text-mono-600 hover:text-accent"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {lineItems.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-start">
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={item.category}
                  onChange={(e) => updateLineItem(index, 'category', e.target.value)}
                  className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={item.itemId}
                  onChange={(e) => updateLineItem(index, 'itemId', e.target.value)}
                  className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
                  required
                  disabled={!item.category || !catalogItems[item.category as keyof typeof catalogItems]}
                >
                  <option value="">Select item</option>
                  {item.category && catalogItems[item.category as keyof typeof catalogItems]?.map(catalogItem => (
                    <option key={catalogItem.id} value={catalogItem.id}>{catalogItem.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                  className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
                  placeholder="0"
                  required
                />
              </div>

              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
                  placeholder="Enter description"
                  required
                />
              </div>

              <div className="col-span-1 pt-7 flex space-x-2">
                <button
                  type="button"
                  onClick={() => {/* View item details */}}
                  className="text-gray-400 hover:text-accent"
                  title="View Details"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {/* Edit item */}}
                  className="text-gray-400 hover:text-accent"
                  title="Edit"
                >
                  <Edit className="w-5 h-5" />
                </button>
                {lineItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLineItem(index)}
                    className="text-gray-400 hover:text-red-500"
                    title="Remove"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Start Date"
          name="startDate"
          type="date"
          required
        />
        
        <FormField
          label="End Date"
          name="endDate"
          type="date"
          required
        />
      </div>

      <FormField
        label="Duration (days)"
        name="duration"
        type="number"
        placeholder="Enter duration in days"
        required
      />

      <FormField label="Site Location" name="siteLocation" required>
        <select
          name="siteLocation"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select site location</option>
          <option value="Main Stage Area">Main Stage Area</option>
          <option value="Conference Hall B">Conference Hall B</option>
          <option value="Theater Complex">Theater Complex</option>
        </select>
      </FormField>

      <FormField label="Additional Information" name="additionalInfo">
        <textarea
          name="additionalInfo"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter any additional information"
        />
      </FormField>

      <FormField label="Internal Notes" name="internalNotes">
        <textarea
          name="internalNotes"
          rows={4}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          placeholder="Enter internal notes"
        />
      </FormField>

      <FormField label="Status" name="status" required>
        <select
          name="status"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">Select status</option>
          <option value="Draft">Draft</option>
          <option value="Pending Approval">Pending Approval</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </FormField>

      <FormActions onCancel={onCancel} isSubmitting={isSubmitting} />
    </form>
  );
}