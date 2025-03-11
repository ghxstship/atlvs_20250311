import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  options?: { label: string; value: any; }[];
}

interface BatchEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Record<string, any>) => void;
  fields: Field[];
  selectedCount: number;
}

export default function BatchEditModal({
  isOpen,
  onClose,
  onSave,
  fields,
  selectedCount
}: BatchEditModalProps) {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [values, setValues] = useState<Record<string, any>>({});

  const handleFieldToggle = (fieldName: string) => {
    setSelectedFields(prev => {
      if (prev.includes(fieldName)) {
        const newSelected = prev.filter(f => f !== fieldName);
        const newValues = { ...values };
        delete newValues[fieldName];
        setValues(newValues);
        return newSelected;
      }
      return [...prev, fieldName];
    });
  };

  const handleValueChange = (fieldName: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSave = () => {
    const updates = Object.fromEntries(
      Object.entries(values).filter(([key]) => selectedFields.includes(key))
    );
    onSave(updates);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-mono-900/75" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div className="flex items-center justify-between p-6 border-b border-mono-200">
            <h3 className="text-lg font-medium text-mono-900">
              Batch Edit ({selectedCount} items)
            </h3>
            <button
              onClick={onClose}
              className="text-mono-400 hover:text-mono-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-4">
              {fields.map(field => (
                <div key={field.name} className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    id={field.name}
                    checked={selectedFields.includes(field.name)}
                    onChange={() => handleFieldToggle(field.name)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label 
                      htmlFor={field.name}
                      className="block text-sm font-medium text-mono-700 mb-1"
                    >
                      {field.label}
                    </label>
                    {selectedFields.includes(field.name) && (
                      <>
                        {field.type === 'select' ? (
                          <select
                            value={values[field.name] || ''}
                            onChange={(e) => handleValueChange(field.name, e.target.value)}
                            className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                          >
                            <option value="">Select...</option>
                            {field.options?.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : field.type === 'boolean' ? (
                          <select
                            value={values[field.name] || ''}
                            onChange={(e) => handleValueChange(field.name, e.target.value === 'true')}
                            className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                          >
                            <option value="">Select...</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            value={values[field.name] || ''}
                            onChange={(e) => handleValueChange(field.name, e.target.value)}
                            className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end p-6 border-t border-mono-200 space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={selectedFields.length === 0}
              className="px-4 py-2 text-sm text-white bg-mono-900 rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update {selectedCount} items
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}