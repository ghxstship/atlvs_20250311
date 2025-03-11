import React from 'react';
import { Task } from '../../types/project';
import ReactGantt from 'frappe-gantt-react';

interface GanttChartProps {
  tasks: Task[];
}

export default function GanttChart({ tasks }: GanttChartProps) {
  const ganttTasks = tasks.map(task => ({
    id: task.id,
    name: task.title,
    start: task.startDate,
    end: task.dueDate,
    progress: task.completionPercentage,
    dependencies: task.dependencies?.map(d => d.id)
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <ReactGantt
        tasks={ganttTasks}
        viewMode="Week"
        onClick={task => console.log(task)}
        onDateChange={(task, start, end) => console.log(task, start, end)}
        onProgressChange={(task, progress) => console.log(task, progress)}
        onViewChange={mode => console.log(mode)}
      />
    </div>
  );
}