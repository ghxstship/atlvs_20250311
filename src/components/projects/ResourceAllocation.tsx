import React, { useState } from 'react';
import { Users, Calendar, Clock, AlertTriangle } from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  role: string;
  availability: number;
  allocations: {
    projectId: string;
    hours: number;
  }[];
  skills: string[];
  certifications: string[];
}

interface Project {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  requiredRoles: {
    role: string;
    count: number;
    hours: number;
  }[];
}

interface ResourceAllocationProps {
  resources: Resource[];
  projects: Project[];
  onAllocationChange: (resourceId: string, projectId: string, hours: number) => void;
}

export default function ResourceAllocation({ resources, projects, onAllocationChange }: ResourceAllocationProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const calculateUtilization = (resource: Resource) => {
    const totalAllocated = resource.allocations.reduce((sum, allocation) => sum + allocation.hours, 0);
    return (totalAllocated / resource.availability) * 100;
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 100) return 'text-red-600';
    if (utilization > 80) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            value={selectedProject || ''}
            onChange={(e) => setSelectedProject(e.target.value || null)}
            className="px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
          >
            <option value="">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          <div className="flex rounded-lg border border-mono-200 overflow-hidden">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 flex items-center ${
                view === 'list' 
                  ? 'bg-mono-900 text-white' 
                  : 'bg-white text-mono-700'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-3 py-1.5 flex items-center ${
                view === 'calendar' 
                  ? 'bg-mono-900 text-white' 
                  : 'bg-white text-mono-700'
              }`}
            >
              Calendar View
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-mono-900">Total Resources</h2>
            <span className="text-2xl font-semibold text-mono-900">{resources.length}</span>
          </div>
          <div className="text-sm text-mono-500">Available team members</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-mono-900">Overallocated</h2>
            <span className="text-2xl font-semibold text-red-600">
              {resources.filter(r => calculateUtilization(r) > 100).length}
            </span>
          </div>
          <div className="text-sm text-mono-500">Resources exceeding capacity</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-mono-900">Available</h2>
            <span className="text-2xl font-semibold text-green-600">
              {resources.filter(r => calculateUtilization(r) < 80).length}
            </span>
          </div>
          <div className="text-sm text-mono-500">Resources under 80% utilization</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-7 gap-4 p-4 font-medium text-mono-700 border-b">
          <div className="col-span-2">Resource</div>
          <div>Role</div>
          <div>Availability</div>
          <div>Allocated</div>
          <div>Utilization</div>
          <div></div>
        </div>

        {resources.map(resource => {
          const utilization = calculateUtilization(resource);
          const utilizationColor = getUtilizationColor(utilization);

          return (
            <div key={resource.id} className="grid grid-cols-7 gap-4 p-4 items-center border-b last:border-0">
              <div className="col-span-2 flex items-center">
                <Users className="w-5 h-5 text-mono-400 mr-2" />
                <div>
                  <div className="font-medium text-mono-900">{resource.name}</div>
                  <div className="text-sm text-mono-500">
                    {resource.skills.slice(0, 2).join(', ')}
                    {resource.skills.length > 2 && ' ...'}
                  </div>
                </div>
              </div>
              <div className="text-mono-600">{resource.role}</div>
              <div className="text-mono-600">{resource.availability}h</div>
              <div className="text-mono-600">
                {resource.allocations.reduce((sum, a) => sum + a.hours, 0)}h
              </div>
              <div className={`font-medium ${utilizationColor}`}>
                {utilization > 100 && <AlertTriangle className="w-4 h-4 inline mr-1" />}
                {Math.round(utilization)}%
              </div>
              <div className="flex justify-end space-x-2">
                <button className="text-mono-600 hover:text-accent">View</button>
                <button className="text-mono-600 hover:text-accent">Edit</button>
              </div>
            </div>
          );
        })}
      </div>

      {view === 'calendar' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-mono-900 mb-4">Resource Calendar</h3>
          <div className="h-96 border border-mono-200 rounded-lg">
            {/* Calendar view implementation */}
          </div>
        </div>
      )}
    </div>
  );
}