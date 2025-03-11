import React from 'react';
import { PenSquare as PencilSquare, Trash2 } from 'lucide-react';

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  showEdit?: boolean;
  showDelete?: boolean;
}

export default function ActionButtons({ 
  onEdit, 
  onDelete, 
  showEdit = true, 
  showDelete = true 
}: ActionButtonsProps) {
  return (
    <div className="flex justify-end space-x-2">
      {showEdit && (
        <button onClick={onEdit} className="btn-edit">
          <PencilSquare className="w-5 h-5" />
        </button>
      )}
      {showDelete && (
        <button onClick={onDelete} className="btn-delete">
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}