import React from 'react';
import { RotateCcw, RotateCw } from 'lucide-react';

interface UndoRedoToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  className?: string;
}

export default function UndoRedoToolbar({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  className = ''
}: UndoRedoToolbarProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="p-1.5 text-mono-400 hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed rounded"
        title="Undo (Ctrl+Z)"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="p-1.5 text-mono-400 hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed rounded"
        title="Redo (Ctrl+Y)"
      >
        <RotateCw className="w-4 h-4" />
      </button>
    </div>
  );
}