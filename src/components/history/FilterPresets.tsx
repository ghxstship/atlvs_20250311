import React, { useState } from 'react';
import { Save, Star, Trash2, Plus } from 'lucide-react';
import { HistoryFilters } from './HistoryFilter';

interface FilterPreset {
  id: string;
  name: string;
  filters: HistoryFilters;
  isDefault?: boolean;
}

interface FilterPresetsProps {
  presets: FilterPreset[];
  onApplyPreset: (preset: FilterPreset) => void;
  onSavePreset: (preset: Partial<FilterPreset>) => void;
  onDeletePreset: (presetId: string) => void;
  onSetDefaultPreset: (presetId: string) => void;
  currentFilters: HistoryFilters;
}

export default function FilterPresets({
  presets,
  onApplyPreset,
  onSavePreset,
  onDeletePreset,
  onSetDefaultPreset,
  currentFilters
}: FilterPresetsProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');

  const handleSaveNewPreset = () => {
    if (!newPresetName.trim()) return;
    
    onSavePreset({
      name: newPresetName,
      filters: currentFilters
    });
    
    setNewPresetName('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-mono-900">Saved Filters</h3>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center text-sm text-mono-600 hover:text-accent"
        >
          <Plus className="w-4 h-4 mr-1" />
          Save Current
        </button>
      </div>

      {isCreating && (
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            placeholder="Preset name"
            className="flex-1 px-3 py-1.5 text-sm border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
          />
          <button
            onClick={handleSaveNewPreset}
            className="px-3 py-1.5 text-sm text-white bg-mono-900 rounded-lg hover:bg-accent"
          >
            <Save className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="space-y-2">
        {presets.map(preset => (
          <div
            key={preset.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-mono-50"
          >
            <button
              onClick={() => onApplyPreset(preset)}
              className="flex items-center text-sm text-mono-700 hover:text-mono-900"
            >
              {preset.isDefault && <Star className="w-4 h-4 text-yellow-500 mr-2" />}
              {preset.name}
            </button>
            
            <div className="flex items-center space-x-2">
              {!preset.isDefault && (
                <button
                  onClick={() => onSetDefaultPreset(preset.id)}
                  className="p-1 text-mono-400 hover:text-yellow-500 rounded"
                  title="Set as default"
                >
                  <Star className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => onDeletePreset(preset.id)}
                className="p-1 text-mono-400 hover:text-red-500 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}