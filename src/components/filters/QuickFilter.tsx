import React from 'react';
import { X } from 'lucide-react';

interface QuickFilterProps {
  label: string;
  value: string;
  onRemove: () => void;
}

export default function QuickFilter({ label, value, onRemove }: QuickFilterProps) {
  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full bg-mono-100 text-mono-700 text-sm">
      <span className="font-medium mr-1">{label}:</span>
      <span>{value}</span>
      <button
        onClick={onRemove}
        className="ml-2 text-mono-400 hover:text-mono-600"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}