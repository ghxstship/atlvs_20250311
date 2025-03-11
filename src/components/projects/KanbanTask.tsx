import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../types/project';
import { Calendar, Users, Tag } from 'lucide-react';

interface KanbanTaskProps {
  task: Task;
}

export default function KanbanTask({ task }: KanbanTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg shadow-sm p-3 cursor-move hover:shadow"
    >
      <h4 className="text-sm font-medium text-mono-900 mb-2">{task.title}</h4>
      
      <div className="flex items-center justify-between text-xs text-mono-500">
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          {task.dueDate}
        </div>
        
        <div className="flex items-center">
          <Users className="w-3 h-3 mr-1" />
          {task.assignee}
        </div>
      </div>

      {task.tags && task.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-mono-100 text-mono-700"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}