import React, { useState } from 'react';
import { Share2, Download, Upload, Copy, Check, X } from 'lucide-react';
import { exportToCSV, importFromCSV } from '../../lib/csv';
import { HistoryFilters } from './HistoryFilter';

interface FilterPreset {
  id: string;
  name: string;
  filters: HistoryFilters;
  isDefault?: boolean;
}

interface FilterPresetShareProps {
  presets: FilterPreset[];
  onImport: (presets: FilterPreset[]) => void;
  onShare: (presetId: string) => void;
}

export default function FilterPresetShare({
  presets,
  onImport,
  onShare
}: FilterPresetShareProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportToCSV(presets, 'filter_presets.csv');
    } catch (error) {
      console.error('Failed to export presets:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const imported = await importFromCSV<FilterPreset>(file);
      onImport(imported);
    } catch (error) {
      console.error('Failed to import presets:', error);
    } finally {
      setIsImporting(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleShare = async (presetId: string) => {
    try {
      await onShare(presetId);
      const shareableUrl = `${window.location.origin}/filters/share/${presetId}`;
      setShareUrl(shareableUrl);
    } catch (error) {
      console.error('Failed to share preset:', error);
    }
  };

  const handleCopyUrl = async () => {
    if (!shareUrl) return;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-mono-900">Share & Export</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExport}
            disabled={isExporting || presets.length === 0}
            className="flex items-center px-3 py-1.5 text-sm text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200 disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <label className="flex items-center px-3 py-1.5 text-sm text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200 cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Import
            <input
              type="file"
              accept=".csv"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Preset List */}
      <div className="space-y-2">
        {presets.map(preset => (
          <div
            key={preset.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-mono-50"
          >
            <span className="text-sm text-mono-700">{preset.name}</span>
            <button
              onClick={() => handleShare(preset.id)}
              className="p-1 text-mono-400 hover:text-accent rounded"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Share URL Dialog */}
      {shareUrl && (
        <div className="mt-4 p-4 bg-mono-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-mono-900">Share Link</span>
            <button
              onClick={() => setShareUrl(null)}
              className="text-mono-400 hover:text-mono-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-1.5 text-sm border border-mono-300 rounded-lg bg-white"
            />
            <button
              onClick={handleCopyUrl}
              className="flex items-center px-3 py-1.5 text-sm text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}