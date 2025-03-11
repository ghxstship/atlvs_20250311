import React from 'react';
import { CheckSquare, Square, Trash2, Edit, Copy, Archive, Download, Share2 } from 'lucide-react';

interface BatchEditToolbarProps {
  selectedCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onArchive?: () => void;
  onExport?: () => void;
  onShare?: () => void;
  customActions?: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }[];
}

export default function BatchEditToolbar({
  selectedCount,
  onSelectAll,
  onDeselectAll,
  onDelete,
  onEdit,
  onDuplicate,
  onArchive,
  onExport,
  onShare,
  customActions = []
}: BatchEditToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-mono-900 text-white rounded-lg shadow-lg px-6 py-3 flex items-center space-x-6">
        <div className="flex items-center space-x-4 pr-6 border-r border-mono-700">
          <button
            onClick={onDeselectAll}
            className="flex items-center text-sm hover:text-accent"
          >
            <CheckSquare className="w-4 h-4 mr-2" />
            {selectedCount} selected
          </button>
          <button
            onClick={onSelectAll}
            className="flex items-center text-sm hover:text-accent"
          >
            <Square className="w-4 h-4 mr-2" />
            Select all
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center text-sm hover:text-accent"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </button>
          )}

          {onDuplicate && (
            <button
              onClick={onDuplicate}
              className="flex items-center text-sm hover:text-accent"
            >
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </button>
          )}

          {onArchive && (
            <button
              onClick={onArchive}
              className="flex items-center text-sm hover:text-accent"
            >
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </button>
          )}

          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center text-sm hover:text-accent"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          )}

          {onShare && (
            <button
              onClick={onShare}
              className="flex items-center text-sm hover:text-accent"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
          )}

          {customActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="flex items-center text-sm hover:text-accent"
            >
              {action.icon}
              <span className="ml-2">{action.label}</span>
            </button>
          ))}

          {onDelete && (
            <button
              onClick={onDelete}
              className="flex items-center text-sm text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}