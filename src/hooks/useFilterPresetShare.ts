import { useState } from 'react';
import { HistoryFilters } from '../components/history/HistoryFilter';

interface FilterPreset {
  id: string;
  name: string;
  filters: HistoryFilters;
  isDefault?: boolean;
}

interface UseFilterPresetShareOptions {
  onShareSuccess?: (url: string) => void;
  onShareError?: (error: Error) => void;
  onImportSuccess?: (presets: FilterPreset[]) => void;
  onImportError?: (error: Error) => void;
}

export function useFilterPresetShare({
  onShareSuccess,
  onShareError,
  onImportSuccess,
  onImportError
}: UseFilterPresetShareOptions = {}) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sharePreset = async (preset: FilterPreset) => {
    setIsSharing(true);
    setError(null);

    try {
      // Generate a unique share ID
      const shareId = Math.random().toString(36).substring(2, 15);
      
      // Store the preset in localStorage (in a real app, this would be a server API call)
      const sharedPresets = JSON.parse(localStorage.getItem('sharedPresets') || '{}');
      sharedPresets[shareId] = preset;
      localStorage.setItem('sharedPresets', JSON.stringify(sharedPresets));

      // Generate shareable URL
      const url = `${window.location.origin}/filters/share/${shareId}`;
      setShareUrl(url);
      onShareSuccess?.(url);

      return url;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to share preset');
      setError(error.message);
      onShareError?.(error);
      throw error;
    } finally {
      setIsSharing(false);
    }
  };

  const importPreset = async (shareId: string): Promise<FilterPreset> => {
    setError(null);

    try {
      // Retrieve the preset from localStorage (in a real app, this would be a server API call)
      const sharedPresets = JSON.parse(localStorage.getItem('sharedPresets') || '{}');
      const preset = sharedPresets[shareId];

      if (!preset) {
        throw new Error('Shared preset not found');
      }

      onImportSuccess?.([preset]);
      return preset;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to import preset');
      setError(error.message);
      onImportError?.(error);
      throw error;
    }
  };

  const importPresets = async (presets: FilterPreset[]) => {
    setError(null);

    try {
      onImportSuccess?.(presets);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to import presets');
      setError(error.message);
      onImportError?.(error);
      throw error;
    }
  };

  return {
    sharePreset,
    importPreset,
    importPresets,
    isSharing,
    shareUrl,
    error,
    setError
  };
}