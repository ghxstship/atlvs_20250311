import React, { useState } from 'react';
import { Radar, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, Building, Star, CheckCircle, AlertTriangle, Eye, Download, Share2, LayoutGrid, List } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import TaskForm from '../../components/forms/TaskForm';
import useModal from '../../hooks/useModal';
import KanbanBoard from '../../components/projects/KanbanBoard';
import { useProjectStore } from '../../hooks/useProjectStore';
import { Task } from '../../types/project';
import { DragEndEvent } from '@dnd-kit/core';
import StatusBoxGrid from '../../components/StatusBoxGrid';
import EmptyState from '../../components/EmptyState';

type ViewMode = 'list' | 'kanban';

export default function Tasks() {
  const { isOpen, openModal, closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const { tasks, moveTask } = useProjectStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      closeModal();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      moveTask(active.id as string, over.id as Task['status']);
    }
  };

  // Status box data
  const statusBoxes = [
    {
      title: 'Total Tasks',
      value: tasks.length.toString(),
      subtitle: 'Across all projects',
      icon: 'file'
    },
    {
      title: 'Completed',
      value: tasks.filter(t => t.status === 'done').length.toString(),
      subtitle: `${Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100)}% completion rate`,
      icon: 'check',
      type: 'success'
    },
    {
      title: 'In Progress',
      value: tasks.filter(t => t.status === 'inProgress').length.toString(),
      subtitle: 'Active tasks',
      icon: 'clock',
      type: 'info'
    },
    {
      title: 'Due Soon',
      value: '2',
      subtitle: 'Tasks due this week',
      icon: 'alert',
      type: 'warning'
    }
  ];

  const kanbanColumns = [
    {
      id: 'todo',
      title: 'To Do',
      tasks: tasks.filter(task => task.status === 'todo')
    },
    {
      id: 'inProgress',
      title: 'In Progress',
      tasks: tasks.filter(task => task.status === 'inProgress')
    },
    {
      id: 'review',
      title: 'Review',
      tasks: tasks.filter(task => task.status === 'review')
    },
    {
      id: 'done',
      title: 'Done',
      tasks: tasks.filter(task => task.status === 'done')
    }
  ];

  const filteredTasks = activeFilter === 'all' 
    ? tasks 
    : tasks.filter(task => {
        if (activeFilter === 'completed') {
          return task.status === 'done';
        } else if (activeFilter === 'inProgress') {
          return task.status === 'inProgress';
        } else if (activeFilter === 'scheduled') {
          return task.dueDate !== null;
        } else if (activeFilter === 'unassigned') {
          return !task.assignee;
        }
        return true;
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Project Tasks</h1>
        <div className="flex items-center space-x-4">
          <div className="flex rounded-lg border border-mono-200 overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 flex items-center ${
                viewMode === 'list' 
                  ? 'bg-mono-900 text-white' 
                  : 'bg-white text-mono-700'
              }`}
            >
              <List className="w-4 h-4 mr-2" />
              List
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 flex items-center ${
                viewMode === 'kanban' 
                  ? 'bg-mono-900 text-white' 
                  : 'bg-white text-mono-700'
              }`}
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Kanban
            </button>
          </div>
          <button 
            onClick={openModal}
            className="flex items-center px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent hover:text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </button>
        </div>
      </div>

      <StatusBoxGrid boxes={statusBoxes} />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Create New Task"
      >
        <TaskForm
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {viewMode === 'kanban' ? (
        kanbanColumns.every(col => col.tasks.length === 0) ? (
          <EmptyState
            icon={Radar}
            title="No tasks found"
            message={
              activeFilter === 'all' 
                ? "No tasks have been created yet."
                : "No tasks found matching the selected filter."
            }
            action={{
              label: "Create Task",
              onClick: openModal
            }}
          />
        ) : (
          <KanbanBoard columns={kanbanColumns} onDragEnd={handleDragEnd} />
        )
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="grid grid-cols-7 gap-4 p-4 font-medium text-mono-700 border-b">
            <div className="col-span-2">Task</div>
            <div>Assignee</div>
            <div>Due Date</div>
            <div>Priority</div>
            <div>Status</div>
            <div></div>
          </div>

          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <div key={task.id} className="grid grid-cols-7 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50">
                <div className="col-span-2">
                  <div className="font-medium text-mono-900">{task.title}</div>
                  <div className="text-sm text-mono-500">{task.description}</div>
                </div>
                <div className="text-mono-600">{task.assignee || '—'}</div>
                <div className="text-mono-600">{task.dueDate}</div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    task.status === 'done' ? 'bg-green-100 text-green-800' :
                    task.status === 'inProgress' ? 'bg-blue-100 text-blue-800' :
                    task.status === 'review' ? 'bg-purple-100 text-purple-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
                <div className="flex justify-end">
                  <ActionButtons />
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              icon={Radar}
              title="No tasks found"
              message={
                activeFilter === 'all' 
                  ? "No tasks have been created yet."
                  : "No tasks found matching the selected filter."
              }
              action={{
                label: "Create Task",
                onClick: openModal
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}