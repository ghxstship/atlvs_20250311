import React, { useState } from 'react';
import { Clock, Play, Pause, StopCircle, RotateCcw, Plus } from 'lucide-react';

interface TimeEntry {
  id: string;
  taskId: string;
  taskName: string;
  projectId: string;
  projectName: string;
  userId: string;
  userName: string;
  startTime: string;
  endTime?: string;
  duration: number;
  notes?: string;
  billable: boolean;
}

interface TimeTrackingProps {
  entries: TimeEntry[];
  onStartTimer: (taskId: string) => void;
  onStopTimer: (taskId: string) => void;
  onPauseTimer: (taskId: string) => void;
  onResumeTimer: (taskId: string) => void;
  onAddEntry: (entry: Partial<TimeEntry>) => void;
}

export default function TimeTracking({
  entries,
  onStartTimer,
  onStopTimer,
  onPauseTimer,
  onResumeTimer,
  onAddEntry
}: TimeTrackingProps) {
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateDailyTotal = () => {
    const today = new Date().toISOString().split('T')[0];
    return entries
      .filter(entry => entry.startTime.startsWith(today))
      .reduce((total, entry) => total + entry.duration, 0);
  };

  const calculateWeeklyTotal = () => {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay())).toISOString();
    return entries
      .filter(entry => entry.startTime >= weekStart)
      .reduce((total, entry) => total + entry.duration, 0);
  };

  return (
    <div className="space-y-6">
      {/* Time Tracking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-mono-900">Active Timer</h2>
            <Clock className="w-5 h-5 text-mono-400" />
          </div>
          {activeTask ? (
            <div>
              <div className="text-3xl font-mono font-bold text-mono-900 mb-2">
                {formatDuration(elapsedTime)}
              </div>
              <div className="flex space-x-2">
                {isRunning ? (
                  <button
                    onClick={() => onPauseTimer(activeTask)}
                    className="flex items-center px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-lg"
                  >
                    <Pause className="w-4 h-4 mr-1" />
                    Pause
                  </button>
                ) : (
                  <button
                    onClick={() => onResumeTimer(activeTask)}
                    className="flex items-center px-3 py-1 text-sm bg-green-100 text-green-800 rounded-lg"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Resume
                  </button>
                )}
                <button
                  onClick={() => onStopTimer(activeTask)}
                  className="flex items-center px-3 py-1 text-sm bg-red-100 text-red-800 rounded-lg"
                >
                  <StopCircle className="w-4 h-4 mr-1" />
                  Stop
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-mono-500">No active timer</div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-mono-900">Today's Total</h2>
            <span className="text-2xl font-semibold text-mono-900">
              {formatDuration(calculateDailyTotal())}
            </span>
          </div>
          <div className="text-sm text-mono-500">Hours tracked today</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-mono-900">Weekly Total</h2>
            <span className="text-2xl font-semibold text-mono-900">
              {formatDuration(calculateWeeklyTotal())}
            </span>
          </div>
          <div className="text-sm text-mono-500">Hours tracked this week</div>
        </div>
      </div>

      {/* Time Entries Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium text-mono-900">Recent Time Entries</h3>
          <button
            onClick={() => {/* Handle manual entry */}}
            className="flex items-center px-3 py-1.5 text-sm bg-mono-900 text-white rounded-lg hover:bg-accent"
          >
            <Plus className="w-4 h-4 mr-1" />
            Manual Entry
          </button>
        </div>

        <div className="grid grid-cols-7 gap-4 p-4 font-medium text-mono-700 border-b">
          <div className="col-span-2">Task</div>
          <div>Project</div>
          <div>Start Time</div>
          <div>Duration</div>
          <div>Billable</div>
          <div></div>
        </div>

        {entries.map(entry => (
          <div key={entry.id} className="grid grid-cols-7 gap-4 p-4 items-center border-b last:border-0">
            <div className="col-span-2">
              <div className="font-medium text-mono-900">{entry.taskName}</div>
              <div className="text-sm text-mono-500">{entry.userName}</div>
            </div>
            <div className="text-mono-600">{entry.projectName}</div>
            <div className="text-mono-600">
              {new Date(entry.startTime).toLocaleTimeString()}
            </div>
            <div className="text-mono-600">{formatDuration(entry.duration)}</div>
            <div>
              {entry.billable ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Billable
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-mono-100 text-mono-800">
                  Non-billable
                </span>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <button className="text-mono-600 hover:text-accent">Edit</button>
              <button className="text-mono-600 hover:text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}