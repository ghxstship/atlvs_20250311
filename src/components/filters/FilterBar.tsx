import React from 'react';
import { Filter, Search } from 'lucide-react';
import QuickFilter from './QuickFilter';

interface FilterBarProps {
  onSearch: (term: string) => void;
  onShowAdvanced: () => void;
  quickFilters?: {
    id: string;
    label: string;
    value: string;
  }[];
  onRemoveQuickFilter?: (id: string) => void;
  searchPlaceholder?: string;
}

export default function FilterBar({
  onSearch,
  onShowAdvanced,
  quickFilters = [],
  onRemoveQuickFilter,
  searchPlaceholder = 'Search...'
}: FilterBarProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex-1 flex items-center space-x-4">
        <div className="relative flex-1 max-w-lg">
          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
          />
          <Search className="w-5 h-5 text-mono-400 absolute left-3 top-2.5" />
        </div>
        
        <button
          onClick={onShowAdvanced}
          className="flex items-center px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200"
        >
          <Filter className="w-4 h-4 mr-2" />
          Advanced
        </button>
      </div>

      {quickFilters.length > 0 && (
        <div className="flex items-center space-x-2 ml-4">
          {quickFilters.map(filter => (
            <QuickFilter
              key={filter.id}
              label={filter.label}
              value={filter.value}
              onRemove={() => onRemoveQuickFilter?.(filter.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}