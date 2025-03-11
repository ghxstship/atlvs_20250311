import React, { useState } from 'react';
import { Ship, Plus, ChevronDown, ChevronUp, Calendar, Users, DollarSign, Clock, FileText, MapPin, Briefcase, CheckCircle, AlertTriangle } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import ProjectForm from '../../components/forms/ProjectForm';
import useModal from '../../hooks/useModal';
import EmptyState from '../../components/EmptyState';
import StatusBoxGrid from '../../components/StatusBoxGrid';

// Helper function to get status icon
const getStatusIcon = (status: string) => {
  switch(status.toLowerCase()) {
    case 'completed':
      return <CheckCircle className="w-4 h-4 mr-1" />;
    case 'in progress':
      return <Clock className="w-4 h-4 mr-1" />;
    case 'pending':
      return <AlertTriangle className="w-4 h-4 mr-1" />;
    default:
      return null;
  }
};

export default function Projects() {
  const { isOpen, openModal, closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      closeModal();
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const projects = [
    {
      id: 1,
      name: 'Summer Music Festival',
      client: 'Festival Productions Inc.',
      startDate: '2024-06-15',
      endDate: '2024-06-18',
      budget: 250000,
      status: 'Planning',
      description: 'Four-day music festival featuring multiple stages and artists across various genres.',
      location: 'Central Park, New York',
      projectManager: 'Sarah Chen',
      team: ['Alex Thompson', 'Maria Garcia', 'David Wilson', 'Emily Brown'],
      milestones: [
        { name: 'Artist Lineup Finalized', date: '2024-03-30', status: 'In Progress' },
        { name: 'Vendor Contracts Signed', date: '2024-04-15', status: 'Pending' },
        { name: 'Site Setup Begins', date: '2024-06-10', status: 'Pending' },
        { name: 'Festival Opening', date: '2024-06-15', status: 'Pending' }
      ],
      tasks: {
        total: 45,
        completed: 12,
        inProgress: 18,
        pending: 15
      },
      documents: [
        { name: 'project_proposal.pdf', size: '2.4 MB', date: '2024-02-15' },
        { name: 'budget_breakdown.xlsx', size: '1.8 MB', date: '2024-02-20' },
        { name: 'site_map.pdf', size: '3.6 MB', date: '2024-03-01' }
      ],
      notes: 'This is our largest festival to date. Special attention needed for crowd management and security.',
      lastUpdated: '2024-03-10 14:30',
      createdBy: 'Alex Thompson',
      createdDate: '2024-02-01'
    }
  ];

  // Status box data
  const statusBoxes = [
    {
      title: 'Total Projects',
      value: projects.length.toString(),
      subtitle: 'Active projects'
    },
    {
      title: 'In Progress',
      value: projects.filter(p => p.status === 'In Progress').length.toString(),
      subtitle: 'Currently active',
      type: 'info'
    },
    {
      title: 'Planning',
      value: projects.filter(p => p.status === 'Planning').length.toString(),
      subtitle: 'In planning phase',
      type: 'warning'
    },
    {
      title: 'Total Budget',
      value: `$${projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}`,
      subtitle: 'Combined budget',
      type: 'success'
    }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => {
        switch (activeFilter) {
          case 'inProgress':
            return project.status === 'In Progress';
          case 'confirmed':
            return project.status === 'Confirmed';
          case 'past':
            return new Date(project.endDate) < new Date();
          default:
            return true;
        }
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Projects</h1>
        <button 
          onClick={openModal}
          className="flex items-center px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent hover:text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </button>
      </div>

      <StatusBoxGrid boxes={statusBoxes} />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Create New Project"
      >
        <ProjectForm
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <div className="mb-6">
        <div className="flex space-x-2 border-b border-mono-200">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 ${activeFilter === 'all' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            All Projects
          </button>
          <button
            onClick={() => setActiveFilter('inProgress')}
            className={`px-4 py-2 ${activeFilter === 'inProgress' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            In Progress
          </button>
          <button
            onClick={() => setActiveFilter('confirmed')}
            className={`px-4 py-2 ${activeFilter === 'confirmed' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setActiveFilter('past')}
            className={`px-4 py-2 ${activeFilter === 'past' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Past
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-7 gap-4 p-4 font-medium text-mono-700 border-b">
          <div className="col-span-2">Project Name</div>
          <div>Client</div>
          <div>Start Date</div>
          <div>End Date</div>
          <div>Status</div>
          <div></div>
        </div>
        
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <React.Fragment key={project.id}>
              <div 
                className={`grid grid-cols-7 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === project.id ? 'bg-mono-50' : ''}`}
                onClick={() => toggleExpand(project.id)}
              >
                <div className="col-span-2 flex items-center">
                  <Ship className="w-5 h-5 text-mono-400 mr-2" />
                  <div>
                    <div className="font-medium text-mono-900">{project.name}</div>
                    <div className="text-sm text-mono-500">Budget: ${project.budget.toLocaleString()}</div>
                  </div>
                </div>
                <div className="text-mono-600">{project.client}</div>
                <div className="text-mono-600">{project.startDate}</div>
                <div className="text-mono-600">{project.endDate}</div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                    project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="flex justify-end">
                  {expandedId === project.id ? (
                    <ChevronUp className="w-5 h-5 text-mono-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-mono-400" />
                  )}
                </div>
              </div>

              {expandedId === project.id && (
                <div className="col-span-7 bg-mono-50 p-6 border-b">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Project Description</h3>
                        <p className="text-sm text-mono-600">{project.description}</p>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Milestones</h3>
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                          <div className="grid grid-cols-3 gap-4 p-3 font-medium text-mono-700 border-b">
                            <div>Milestone</div>
                            <div>Date</div>
                            <div>Status</div>
                          </div>
                          {project.milestones.map((milestone, index) => (
                            <div key={index} className="grid grid-cols-3 gap-4 p-3 border-b last:border-0">
                              <div className="text-sm text-mono-600">{milestone.name}</div>
                              <div className="text-sm text-mono-600">{milestone.date}</div>
                              <div className="flex items-center">
                                {milestone.status && getStatusIcon(milestone.status)}
                                <span className={`text-sm ${
                                  milestone.status === 'Completed' ? 'text-green-600' :
                                  milestone.status === 'In Progress' ? 'text-blue-600' :
                                  'text-yellow-600'
                                }`}>{milestone.status}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Team</h3>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="flex items-center mb-4">
                            <Users className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm font-medium text-mono-700">Project Manager:</span>
                            <span className="text-sm text-mono-900 ml-2">{project.projectManager}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {project.team.map((member, index) => (
                              <div key={index} className="flex items-center">
                                <div className="w-6 h-6 rounded-full bg-mono-200 flex items-center justify-center mr-2">
                                  <span className="text-xs text-mono-600">{member.split(' ').map(n => n[0]).join('')}</span>
                                </div>
                                <span className="text-sm text-mono-600">{member}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Notes</h3>
                        <p className="text-sm text-mono-600 bg-white p-3 rounded-lg shadow-sm">{project.notes}</p>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Project Details</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Location:</span>
                            <span className="text-sm text-mono-900">{project.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Duration:</span>
                            <span className="text-sm text-mono-900">
                              {Math.round((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1)} days
                            </span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Budget:</span>
                            <span className="text-sm text-mono-900">${project.budget.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Client:</span>
                            <span className="text-sm text-mono-900">{project.client}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Created:</span>
                            <span className="text-sm text-mono-900">{project.createdDate}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Last updated:</span>
                            <span className="text-sm text-mono-900">{project.lastUpdated}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Task Progress</h3>
                        <div className="mb-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-mono-500">Completion</span>
                            <span className="text-xs font-medium text-mono-700">
                              {Math.round((project.tasks.completed / project.tasks.total) * 100)}%
                            </span>
                          </div>
                          <div className="h-2 bg-mono-200 rounded-full">
                            <div 
                              className="h-2 bg-mono-800 rounded-full" 
                              style={{ width: `${(project.tasks.completed / project.tasks.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <div className="text-xs text-mono-500">Completed</div>
                            <div className="text-lg font-semibold text-green-600">{project.tasks.completed}</div>
                          </div>
                          <div>
                            <div className="text-xs text-mono-500">In Progress</div>
                            <div className="text-lg font-semibold text-blue-600">{project.tasks.inProgress}</div>
                          </div>
                          <div>
                            <div className="text-xs text-mono-500">Pending</div>
                            <div className="text-lg font-semibold text-yellow-600">{project.tasks.pending}</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Documents</h3>
                        <div className="space-y-2">
                          {project.documents.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 text-mono-400 mr-2" />
                                <span className="text-sm text-accent hover:underline cursor-pointer">{doc.name}</span>
                              </div>
                              <span className="text-xs text-mono-500">{doc.size}</span>
                            </div>
                          ))}
                          <div className="mt-3">
                            <button className="flex items-center text-sm text-mono-600 hover:text-accent">
                              <Plus className="w-4 h-4 mr-1" />
                              Add document
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-mono-200 flex justify-end space-x-3">
                    <ActionButtons />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))
        ) : (
          <EmptyState
            icon={Ship}
            title="No projects found"
            message={
              activeFilter === 'all' 
                ? "No projects have been created yet."
                : "No projects found matching the selected filter."
            }
            action={{
              label: "Create Project",
              onClick: openModal
            }}
          />
        )}
      </div>
    </div>
  );
}