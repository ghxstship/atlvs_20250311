import { useState, useEffect } from 'react';
import { HistoryFilters } from '../components/history/HistoryFilter';

interface FilterPreset {
  id: string;
  name: string;
  filters: HistoryFilters;
  isDefault?: boolean;
}

interface UseFilterPresetsOptions {
  storageKey: string;
  onPresetApplied?: (preset: FilterPreset) => void;
}

export function useFilterPresets({
  storageKey,
  onPresetApplied
}: UseFilterPresetsOptions) {
  const [presets, setPresets] = useState<FilterPreset[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(presets));
  }, [presets, storageKey]);

  const savePreset = (preset: Partial<FilterPreset>) => {
    const newPreset: FilterPreset = {
      id: Math.random().toString(36).substr(2, 9),
      name: preset.name || 'Untitled Preset',
      filters: preset.filters || {},
      isDefault: false
    };

    setPresets(prev => [...prev, newPreset]);
  };

  const deletePreset = (presetId: string) => {
    setPresets(prev => prev.filter(p => p.id !== presetId));
  };

  const setDefaultPreset = (presetId: string) => {
    setPresets(prev => prev.map(p => ({
      ...p,
      isDefault: p.id === presetId
    })));
  };

  const applyPreset = (preset: FilterPreset) => {
    onPresetApplied?.(preset);
  };

  const getDefaultPreset = () => {
    return presets.find(p => p.isDefault);
  };

  return {
    presets,
    savePreset,
    deletePreset,
    setDefaultPreset,
    applyPreset,
    getDefaultPreset
  };
}