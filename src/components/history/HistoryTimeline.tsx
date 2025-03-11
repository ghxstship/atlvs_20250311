import React from 'react';
import { Clock, ChevronRight, RotateCcw, Eye } from 'lucide-react';
import { formatDate } from '../../lib/utils';

interface HistoryEntry {
  id: string;
  timestamp: string;
  description: string;
  user: {
    name: string;
    avatar?: string;
  };
  type: 'create' | 'update' | 'delete' | 'restore';
  metadata?: Record<string, any>;
  canRevert?: boolean;
}

interface HistoryTimelineProps {
  entries: HistoryEntry[];
  onRevert: (entryId: string) => void;
  onPreview: (entryId: string) => void;
}

export default function HistoryTimeline({ entries, onRevert, onPreview }: HistoryTimelineProps) {
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getTypeColor = (type: HistoryEntry['type']) => {
    switch (type) {
      case 'create': return 'bg-green-500';
      case 'update': return 'bg-blue-500';
      case 'delete': return 'bg-red-500';
      case 'restore': return 'bg-purple-500';
      default: return 'bg-mono-500';
    }
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-8 bottom-0 w-px bg-mono-200" />

      {/* Entries */}
      <div className="space-y-6">
        {sortedEntries.map((entry, index) => (
          <div key={entry.id} className="relative flex items-start group">
            {/* Timeline dot */}
            <div className={`w-3 h-3 rounded-full ${getTypeColor(entry.type)} ring-4 ring-white z-10`} />

            {/* Entry content */}
            <div className="ml-8 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-mono-100 flex items-center justify-center">
                    {entry.user.avatar ? (
                      <img 
                        src={entry.user.avatar} 
                        alt={entry.user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <span className="text-sm font-medium text-mono-600">
                        {entry.user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-mono-900">{entry.user.name}</p>
                    <div className="flex items-center text-xs text-mono-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDate(entry.timestamp)}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onPreview(entry.id)}
                    className="p-1 text-mono-400 hover:text-accent rounded"
                    title="Preview this version"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {entry.canRevert && (
                    <button
                      onClick={() => onRevert(entry.id)}
                      className="p-1 text-mono-400 hover:text-accent rounded"
                      title="Revert to this version"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mt-2 text-sm text-mono-600">
                {entry.description}
              </div>

              {/* Metadata */}
              {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                <div className="mt-2 bg-mono-50 rounded-lg p-3">
                  <div className="text-xs font-medium text-mono-700 mb-2">Changes</div>
                  <div className="space-y-1">
                    {Object.entries(entry.metadata).map(([key, value]) => (
                      <div key={key} className="flex items-center text-xs">
                        <span className="text-mono-500">{key}</span>
                        <ChevronRight className="w-3 h-3 mx-1 text-mono-400" />
                        <span className="text-mono-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}