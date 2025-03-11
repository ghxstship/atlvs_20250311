import React, { useState } from 'react';
import { Search, Filter, Calendar, User, Tag, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface HistoryFilterProps {
  onSearch: (term: string) => void;
  onFilter: (filters: HistoryFilters) => void;
  onSort: (field: string, direction: 'asc' | 'desc') => void;
  users: string[];
  types: string[];
}

export interface HistoryFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  users?: string[];
  types?: string[];
  hasMetadata?: boolean;
  canRevert?: boolean;
}

export default function HistoryFilter({
  onSearch,
  onFilter,
  onSort,
  users,
  types
}: HistoryFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<HistoryFilters>({});
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleFilterChange = (updates: Partial<HistoryFilters>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleSortChange = (field: string) => {
    const newDirection = field === sortField && sortDirection === 'desc' ? 'asc' : 'desc';
    setSortField(field);
    setSortDirection(newDirection);
    onSort(field, newDirection);
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      {/* Search and Basic Filters */}
      <div className="p-4 flex items-center space-x-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search history..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
          />
          <Search className="w-5 h-5 text-mono-400 absolute left-3 top-2.5" />
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200"
        >
          <Filter className="w-4 h-4 mr-2" />
          Advanced Filters
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 ml-2" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-2" />
          )}
        </button>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="p-4 border-t border-mono-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-mono-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={filters.dateRange?.start || ''}
                  onChange={(e) => handleFilterChange({
                    dateRange: {
                      start: e.target.value,
                      end: filters.dateRange?.end || ''
                    }
                  })}
                  className="px-3 py-1.5 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500 text-sm"
                />
                <input
                  type="date"
                  value={filters.dateRange?.end || ''}
                  onChange={(e) => handleFilterChange({
                    dateRange: {
                      start: filters.dateRange?.start || '',
                      end: e.target.value
                    }
                  })}
                  className="px-3 py-1.5 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500 text-sm"
                />
              </div>
            </div>

            {/* Users */}
            <div>
              <label className="block text-sm font-medium text-mono-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Users
              </label>
              <select
                multiple
                value={filters.users || []}
                onChange={(e) => handleFilterChange({
                  users: Array.from(e.target.selectedOptions, option => option.value)
                })}
                className="w-full px-3 py-1.5 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500 text-sm"
              >
                {users.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>

            {/* Types */}
            <div>
              <label className="block text-sm font-medium text-mono-700 mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                Types
              </label>
              <select
                multiple
                value={filters.types || []}
                onChange={(e) => handleFilterChange({
                  types: Array.from(e.target.selectedOptions, option => option.value)
                })}
                className="w-full px-3 py-1.5 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500 text-sm"
              >
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Additional Filters */}
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.hasMetadata}
                  onChange={(e) => handleFilterChange({ hasMetadata: e.target.checked })}
                  className="rounded border-mono-300 text-mono-900 focus:ring-mono-500"
                />
                <span className="ml-2 text-sm text-mono-700">Has Changes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.canRevert}
                  onChange={(e) => handleFilterChange({ canRevert: e.target.checked })}
                  className="rounded border-mono-300 text-mono-900 focus:ring-mono-500"
                />
                <span className="ml-2 text-sm text-mono-700">Can Revert</span>
              </label>
            </div>

            {/* Sort Options */}
            <div className="col-span-2 flex items-center justify-end space-x-4">
              <span className="text-sm text-mono-500">Sort by:</span>
              <button
                onClick={() => handleSortChange('timestamp')}
                className={`flex items-center px-3 py-1.5 rounded-lg text-sm ${
                  sortField === 'timestamp' 
                    ? 'bg-mono-900 text-white' 
                    : 'text-mono-700 hover:bg-mono-100'
                }`}
              >
                <Clock className="w-4 h-4 mr-2" />
                Date
                {sortField === 'timestamp' && (
                  sortDirection === 'desc' 
                    ? <ChevronDown className="w-4 h-4 ml-1" />
                    : <ChevronUp className="w-4 h-4 ml-1" />
                )}
              </button>
              <button
                onClick={() => handleSortChange('type')}
                className={`flex items-center px-3 py-1.5 rounded-lg text-sm ${
                  sortField === 'type' 
                    ? 'bg-mono-900 text-white' 
                    : 'text-mono-700 hover:bg-mono-100'
                }`}
              >
                <Tag className="w-4 h-4 mr-2" />
                Type
                {sortField === 'type' && (
                  sortDirection === 'desc' 
                    ? <ChevronDown className="w-4 h-4 ml-1" />
                    : <ChevronUp className="w-4 h-4 ml-1" />
                )}
              </button>
              <button
                onClick={() => handleSortChange('user')}
                className={`flex items-center px-3 py-1.5 rounded-lg text-sm ${
                  sortField === 'user' 
                    ? 'bg-mono-900 text-white' 
                    : 'text-mono-700 hover:bg-mono-100'
                }`}
              >
                <User className="w-4 h-4 mr-2" />
                User
                {sortField === 'user' && (
                  sortDirection === 'desc' 
                    ? <ChevronDown className="w-4 h-4 ml-1" />
                    : <ChevronUp className="w-4 h-4 ml-1" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}