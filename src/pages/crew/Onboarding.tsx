import React, { useState } from 'react';
import { Compass, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, Phone, Mail, Building, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import OnboardingForm from '../../components/forms/OnboardingForm';
import useModal from '../../hooks/useModal';
import EmptyState from '../../components/EmptyState';
import StatusBoxGrid from '../../components/StatusBoxGrid';

export default function Onboarding() {
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
      console.error('Error creating onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Mock onboarding data
  const onboardingData = [
    {
      id: 1,
      name: 'John Smith',
      position: 'Audio Technician',
      startDate: '2024-04-01',
      status: 'Started',
      progress: 15,
      department: 'Technical',
      mentor: 'Sarah Chen',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      emergencyContact: 'Jane Smith - (555) 987-6543',
      tasks: [
        { task: 'Complete paperwork', dueDate: '2024-03-25', completed: true },
        { task: 'Equipment training', dueDate: '2024-04-02', completed: false },
        { task: 'Safety orientation', dueDate: '2024-04-03', completed: false }
      ],
      documents: [
        { name: 'offer_letter.pdf', size: '1.2 MB', date: '2024-03-15' },
        { name: 'contract.pdf', size: '2.4 MB', date: '2024-03-15' }
      ],
      notes: 'Experienced audio technician with festival background. Focus training on our specific equipment.',
      createdBy: 'Mike Thompson',
      lastUpdated: '2024-03-15 14:30'
    }
  ];

  // Status box data
  const statusBoxes = [
    {
      title: 'Total Onboarding',
      value: onboardingData.length.toString(),
      subtitle: 'Active onboarding processes',
      icon: 'users'
    },
    {
      title: 'Complete',
      value: onboardingData.filter(o => o.status === 'Complete').length.toString(),
      subtitle: 'Successfully onboarded',
      icon: 'check',
      type: 'success'
    },
    {
      title: 'In Progress',
      value: onboardingData.filter(o => o.status === 'In Progress').length.toString(),
      subtitle: 'Currently onboarding',
      icon: 'clock',
      type: 'info'
    },
    {
      title: 'New',
      value: onboardingData.filter(o => o.status === 'New').length.toString(),
      subtitle: 'Not started',
      icon: 'alert',
      type: 'warning'
    }
  ];

  const filteredOnboarding = activeFilter === 'all' 
    ? onboardingData 
    : onboardingData.filter(person => {
        switch (activeFilter) {
          case 'complete':
            return person.status === 'Complete';
          case 'inProgress':
            return person.status === 'In Progress';
          case 'new':
            return person.status === 'New';
          default:
            return true;
        }
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Onboarding</h1>
        <button 
          onClick={openModal}
          className="flex items-center px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent hover:text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Onboard New Hire
        </button>
      </div>

      <StatusBoxGrid boxes={statusBoxes} />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Onboard New Hire"
      >
        <OnboardingForm
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
            All Onboarding
          </button>
          <button
            onClick={() => setActiveFilter('complete')}
            className={`px-4 py-2 ${activeFilter === 'complete' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Complete
          </button>
          <button
            onClick={() => setActiveFilter('inProgress')}
            className={`px-4 py-2 ${activeFilter === 'inProgress' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            In Progress
          </button>
          <button
            onClick={() => setActiveFilter('new')}
            className={`px-4 py-2 ${activeFilter === 'new' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            New
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-6 gap-4 p-4 font-medium text-mono-700 border-b">
          <div className="col-span-2">Name</div>
          <div>Position</div>
          <div>Start Date</div>
          <div>Status</div>
          <div></div>
        </div>
        
        {filteredOnboarding.length > 0 ? (
          filteredOnboarding.map(person => (
            <React.Fragment key={person.id}>
              <div 
                className={`grid grid-cols-6 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === person.id ? 'bg-mono-50' : ''}`}
                onClick={() => toggleExpand(person.id)}
              >
                <div className="col-span-2 flex items-center">
                  <Compass className="w-5 h-5 text-mono-400 mr-2" />
                  <div>
                    <div className="font-medium text-mono-900">{person.name}</div>
                    <div className="text-sm text-mono-500">Starting: {person.startDate}</div>
                  </div>
                </div>
                <div className="text-mono-600">{person.position}</div>
                <div className="text-mono-600">{person.startDate}</div>
                <div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      person.status === 'Complete' ? 'bg-green-100 text-green-800' :
                      person.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {person.status}
                    </span>
                    <span className="ml-2 text-sm text-mono-600">{person.progress}%</span>
                  </div>
                  <div className="mt-1 h-1 w-24 bg-mono-200 rounded-full">
                    <div 
                      className={`h-1 rounded-full ${
                        person.status === 'Complete' ? 'bg-green-500' :
                        person.status === 'In Progress' ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`}
                      style={{ width: `${person.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  {expandedId === person.id ? (
                    <ChevronUp className="w-5 h-5 text-mono-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-mono-400" />
                  )}
                </div>
              </div>

              {expandedId === person.id && (
                <div className="col-span-6 bg-mono-50 p-6 border-b">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Onboarding Tasks</h3>
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                          <div className="grid grid-cols-4 gap-4 p-3 font-medium text-mono-700 border-b">
                            <div className="col-span-2">Task</div>
                            <div>Due Date</div>
                            <div>Status</div>
                          </div>
                          {person.tasks.map((task, index) => (
                            <div key={index} className="grid grid-cols-4 gap-4 p-3 border-b last:border-0">
                              <div className="col-span-2 text-sm text-mono-600">{task.task}</div>
                              <div className="text-sm text-mono-600">{task.dueDate}</div>
                              <div className="flex items-center">
                                {task.completed ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                                    <span className="text-sm text-green-600">Completed</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-4 h-4 text-yellow-500 mr-1" />
                                    <span className="text-sm text-yellow-600">Pending</span>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Notes</h3>
                        <p className="text-sm text-mono-600 bg-white p-3 rounded-lg shadow-sm">{person.notes}</p>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Employee Details</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Department:</span>
                            <span className="text-sm text-mono-900">{person.department}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Start Date:</span>
                            <span className="text-sm text-mono-900">{person.startDate}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Mentor:</span>
                            <span className="text-sm text-mono-900">{person.mentor}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Created by:</span>
                            <span className="text-sm text-mono-900">{person.createdBy}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Last updated:</span>
                            <span className="text-sm text-mono-900">{person.lastUpdated}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Contact Information</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <span className="text-sm text-mono-500 mr-2">Email:</span>
                            <a href={`mailto:${person.email}`} className="text-sm text-accent hover:underline">
                              {person.email}
                            </a>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-mono-500 mr-2">Phone:</span>
                            <a href={`tel:${person.phone}`} className="text-sm text-accent hover:underline">
                              {person.phone}
                            </a>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-mono-500 mr-2">Emergency Contact:</span>
                            <span className="text-sm text-mono-900">{person.emergencyContact}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Documents</h3>
                        <div className="space-y-2">
                          {person.documents.map((doc, index) => (
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
            icon={Compass}
            title="No onboarding processes found"
            message={
              activeFilter === 'all' 
                ? "No team members are currently being onboarded."
                : "No onboarding processes found matching the selected filter."
            }
            action={{
              label: "Start Onboarding",
              onClick: openModal
            }}
          />
        )}
      </div>
    </div>
  );
}