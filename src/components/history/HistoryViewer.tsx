import React, { useState } from 'react';
import { List, GitBranch, Clock } from 'lucide-react';
import HistoryTimeline from './HistoryTimeline';
import HistoryTreeView from './HistoryTreeView';
import HistoryFilter from './HistoryFilter';
import { useHistoryFilter } from '../../hooks/useHistoryFilter';

type ViewMode = 'timeline' | 'tree';

interface HistoryViewerProps {
  entries: any[];
  nodes: Record<string, any>;
  rootId: string;
  onRevert: (id: string) => void;
  onPreview: (id: string) => void;
}

export default function HistoryViewer({
  entries,
  nodes,
  rootId,
  onRevert,
  onPreview
}: HistoryViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');

  const {
    filteredData,
    handleSearch,
    handleFilter,
    handleSort
  } = useHistoryFilter({
    data: entries,
    searchFields: ['description', 'user.name', 'type']
  });

  // Extract unique users and types for filter options
  const users = Array.from(new Set(entries.map(entry => entry.user.name)));
  const types = Array.from(new Set(entries.map(entry => entry.type)));

  return (
    <div className="space-y-6">
      {/* View mode toggle */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-mono-900">History</h2>
        <div className="flex rounded-lg border border-mono-200 overflow-hidden">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1.5 flex items-center ${
              viewMode === 'timeline' 
                ? 'bg-mono-900 text-white' 
                : 'bg-white text-mono-700'
            }`}
          >
            <Clock className="w-4 h-4 mr-2" />
            Timeline
          </button>
          <button
            onClick={() => setViewMode('tree')}
            className={`px-3 py-1.5 flex items-center ${
              viewMode === 'tree' 
                ? 'bg-mono-900 text-white' 
                : 'bg-white text-mono-700'
            }`}
          >
            <GitBranch className="w-4 h-4 mr-2" />
            Tree View
          </button>
        </div>
      </div>

      {/* Filters */}
      <HistoryFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
        users={users}
        types={types}
      />

      {/* History view */}
      {viewMode === 'timeline' ? (
        <HistoryTimeline
          entries={filteredData}
          onRevert={onRevert}
          onPreview={onPreview}
        />
      ) : (
        <HistoryTreeView
          nodes={nodes}
          rootId={rootId}
          onRevert={onRevert}
          onPreview={onPreview}
        />
      )}
    </div>
  );
}