import React from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import { Task } from '../../types/project';

interface KanbanBoardProps {
  columns: {
    id: string;
    title: string;
    tasks: Task[];
  }[];
  onDragEnd: (event: DragEndEvent) => void;
}

export default function KanbanBoard({ columns, onDragEnd }: KanbanBoardProps) {
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map(column => (
          <div key={column.id} className="flex-shrink-0 w-80">
            <KanbanColumn
              id={column.id}
              title={column.title}
              tasks={column.tasks}
            />
          </div>
        ))}
      </div>
    </DndContext>
  );
}