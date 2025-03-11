import React, { useState } from 'react';
import { Navigation, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, Building, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import AssignmentForm from '../../components/forms/AssignmentForm';
import useModal from '../../hooks/useModal';
import StatusBoxGrid from '../../components/StatusBoxGrid';

export default function Assignments() {
  const { isOpen, openModal, closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      closeModal();
    } catch (error) {
      console.error('Error creating assignment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const assignments = [
    {
      id: 1,
      role: 'Stage Manager',
      project: 'Summer Music Festival',
      assignee: 'Sarah Chen',
      startDate: '2024-06-15',
      endDate: '2024-06-20',
      status: 'Confirmed',
      location: 'Main Stage',
      description: 'Oversee all stage operations including setup, performance coordination, and teardown.',
      responsibilities: [
        'Coordinate with production team for stage setup',
        'Manage artist schedules and stage transitions',
        'Ensure safety protocols are followed',
        'Supervise stage crew',
        'Maintain communication with sound and lighting teams'
      ],
      requirements: [
        '5+ years experience as stage manager',
        'Knowledge of live event production',
        'Strong leadership and communication skills',
        'Ability to work under pressure'
      ],
      notes: 'Sarah has worked with us on previous festivals and is highly recommended.',
      createdBy: 'Alex Thompson',
      createdDate: '2024-03-01',
      lastUpdated: '2024-03-10 14:30',
      documents: [
        { name: 'stage_manager_contract.pdf', size: '1.2 MB', date: '2024-03-10' },
        { name: 'stage_layout.pdf', size: '2.4 MB', date: '2024-03-08' }
      ],
      schedule: [
        { date: '2024-06-15', time: '08:00 - 18:00', activity: 'Stage Setup' },
        { date: '2024-06-16', time: '10:00 - 22:00', activity: 'Performances Day 1' },
        { date: '2024-06-17', time: '10:00 - 22:00', activity: 'Performances Day 2' },
        { date: '2024-06-18', time: '10:00 - 22:00', activity: 'Performances Day 3' },
        { date: '2024-06-19', time: '10:00 - 22:00', activity: 'Performances Day 4' },
        { date: '2024-06-20', time: '08:00 - 16:00', activity: 'Teardown' }
      ]
    }
  ];

  // Status box data
  const statusBoxes = [
    {
      title: 'Total Assignments',
      value: assignments.length.toString(),
      subtitle: 'Across all projects',
      icon: 'briefcase'
    },
    {
      title: 'Confirmed',
      value: assignments.filter(a => a.status === 'Confirmed').length.toString(),
      subtitle: 'Ready to go',
      icon: 'check',
      type: 'success'
    },
    {
      title: 'Pending',
      value: assignments.filter(a => a.status === 'Pending').length.toString(),
      subtitle: 'Awaiting confirmation',
      icon: 'alert',
      type: 'warning'
    },
    {
      title: 'Upcoming',
      value: '5',
      subtitle: 'Starting in next 30 days',
      icon: 'calendar',
      type: 'info'
    }
  ];

  const filteredAssignments = activeFilter === 'all' 
    ? assignments 
    : assignments.filter(assignment => {
        if (activeFilter === 'confirmed') {
          return assignment.status === 'Confirmed';
        } else if (activeFilter === 'pending') {
          return assignment.status === 'Pending';
        }
        return true;
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Project Assignments</h1>
        <button 
          onClick={openModal}
          className="flex items-center px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent hover:text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Assignment
        </button>
      </div>

      <StatusBoxGrid boxes={statusBoxes} />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Create New Assignment"
      >
        <AssignmentForm
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
            All Assignments
          </button>
          <button
            onClick={() => setActiveFilter('confirmed')}
            className={`px-4 py-2 ${activeFilter === 'confirmed' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-4 py-2 ${activeFilter === 'pending' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Pending
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-7 gap-4 p-4 font-medium text-mono-700 border-b">
          <div>Role</div>
          <div>Project</div>
          <div>Assignee</div>
          <div>Start Date</div>
          <div>End Date</div>
          <div>Status</div>
          <div></div>
        </div>
        
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map(assignment => (
            <React.Fragment key={assignment.id}>
              <div 
                className={`grid grid-cols-7 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === assignment.id ? 'bg-mono-50' : ''}`}
                onClick={() => toggleExpand(assignment.id)}
              >
                <div className="flex items-center">
                  <Navigation className="w-5 h-5 text-mono-400 mr-2" />
                  <span className="font-medium text-mono-900">{assignment.role}</span>
                </div>
                <div className="text-mono-600">{assignment.project}</div>
                <div className="text-mono-600">{assignment.assignee}</div>
                <div className="text-mono-600">{assignment.startDate}</div>
                <div className="text-mono-600">{assignment.endDate}</div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    assignment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {assignment.status}
                  </span>
                </div>
                <div className="flex justify-end">
                  {expandedId === assignment.id ? (
                    <ChevronUp className="w-5 h-5 text-mono-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-mono-400" />
                  )}
                </div>
              </div>

              {expandedId === assignment.id && (
                <div className="col-span-7 bg-mono-50 p-6 border-b">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Assignment Description</h3>
                        <p className="text-sm text-mono-600">{assignment.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Responsibilities</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {assignment.responsibilities.map((item, index) => (
                              <li key={index} className="text-sm text-mono-600">{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Requirements</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {assignment.requirements.map((item, index) => (
                              <li key={index} className="text-sm text-mono-600">{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Schedule</h3>
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                          <div className="grid grid-cols-3 gap-4 p-3 font-medium text-mono-700 border-b">
                            <div>Date</div>
                            <div>Time</div>
                            <div>Activity</div>
                          </div>
                          {assignment.schedule.map((item, index) => (
                            <div key={index} className="grid grid-cols-3 gap-4 p-3 border-b last:border-0">
                              <div className="text-sm text-mono-600">{item.date}</div>
                              <div className="text-sm text-mono-600">{item.time}</div>
                              <div className="text-sm text-mono-600">{item.activity}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Notes</h3>
                        <p className="text-sm text-mono-600 bg-white p-3 rounded-lg shadow-sm">{assignment.notes}</p>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Assignment Details</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Location:</span>
                            <span className="text-sm text-mono-900">{assignment.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Duration:</span>
                            <span className="text-sm text-mono-900">
                              {Math.round((new Date(assignment.endDate).getTime() - new Date(assignment.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1)} days
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Created by:</span>
                            <span className="text-sm text-mono-900">{assignment.createdBy}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Last updated:</span>
                            <span className="text-sm text-mono-900">{assignment.lastUpdated}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Documents</h3>
                        <div className="space-y-2">
                          {assignment.documents.map((doc, index) => (
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
            icon={Navigation}
            title="No assignments found"
            message={
              activeFilter === 'all' 
                ? "No assignments have been created yet."
                : "No assignments found matching the selected filter."
            }
            action={{
              label: "Create Assignment",
              onClick: openModal
            }}
          />
        )}
      </div>
    </div>
  );
}