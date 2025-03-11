import React from 'react';
import { CheckSquare, Square } from 'lucide-react';

interface SelectableRowProps {
  id: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  children: React.ReactNode;
}

export default function SelectableRow({
  id,
  isSelected,
  onSelect,
  children
}: SelectableRowProps) {
  return (
    <div 
      className={`grid grid-cols-[auto,1fr] gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 ${
        isSelected ? 'bg-mono-50' : ''
      }`}
    >
      <button
        onClick={() => onSelect(id)}
        className="flex items-center justify-center w-6 h-6 text-mono-400 hover:text-accent"
      >
        {isSelected ? (
          <CheckSquare className="w-5 h-5" />
        ) : (
          <Square className="w-5 h-5" />
        )}
      </button>
      {children}
    </div>
  );
}