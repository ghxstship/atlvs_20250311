import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanTask from './KanbanTask';
import { Task } from '../../types/project';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
}

export default function KanbanColumn({ id, title, tasks }: KanbanColumnProps) {
  return (
    <div className="bg-mono-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-mono-900">{title}</h3>
        <span className="text-sm text-mono-500">{tasks.length}</span>
      </div>
      
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {tasks.map(task => (
            <KanbanTask key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>

      <button className="mt-4 w-full flex items-center justify-center px-3 py-2 text-sm text-mono-600 bg-white rounded-lg border border-mono-200 hover:bg-mono-100">
        <Plus className="w-4 h-4 mr-2" />
        Add Task
      </button>
    </div>
  );
}