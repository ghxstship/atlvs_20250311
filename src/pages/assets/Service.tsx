import React, { useState } from 'react';
import { Wrench, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, Building, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import ServiceForm from '../../components/forms/ServiceForm';
import useModal from '../../hooks/useModal';
import StatusBoxGrid from '../../components/StatusBoxGrid';
import EmptyState from '../../components/EmptyState';

export default function Service() {
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
      console.error('Error creating service request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const serviceItems = [
    {
      id: 1,
      asset: 'Stage System A',
      type: 'Maintenance',
      dueDate: '2024-03-20',
      assignee: 'John Smith',
      priority: 'High',
      status: 'Scheduled',
      description: 'Regular maintenance inspection and service of the modular stage system.',
      location: 'Service Bay 1',
      estimatedDuration: '4 hours',
      serviceInterval: '6 months',
      lastService: '2023-09-20',
      cost: 850,
      parts: [
        { name: 'Locking Pin Set', quantity: 12, cost: 120 },
        { name: 'Support Bracket', quantity: 4, cost: 280 },
        { name: 'Hydraulic Fluid', quantity: 2, cost: 90 }
      ],
      checklist: [
        { task: 'Inspect all locking mechanisms', completed: false },
        { task: 'Test height adjustment system', completed: false },
        { task: 'Check deck surface condition', completed: false },
        { task: 'Verify load capacity indicators', completed: false },
        { task: 'Lubricate moving parts', completed: false }
      ],
      history: [
        { date: '2023-09-20', type: 'Maintenance', technician: 'Mike Wilson', notes: 'Completed regular maintenance, all systems functioning properly.' },
        { date: '2023-03-15', type: 'Repair', technician: 'David Chen', notes: 'Replaced worn locking pins and adjusted height mechanism.' }
      ],
      attachments: [
        { name: 'maintenance_manual.pdf', size: '2.4 MB', date: '2023-09-20' },
        { name: 'inspection_checklist.pdf', size: '1.2 MB', date: '2024-03-15' }
      ],
      notes: 'Special attention needed for the height adjustment system due to heavy usage in recent events.',
      relatedServices: [
        { id: 4, title: 'Safety Certification' },
        { id: 5, title: 'Load Testing' }
      ]
    }
  ];

  // Status box data
  const statusBoxes = [
    {
      title: 'Total Services',
      value: serviceItems.length.toString(),
      subtitle: 'All service requests',
      icon: 'wrench'
    },
    {
      title: 'Completed',
      value: serviceItems.filter(s => s.status === 'Completed').length.toString(),
      subtitle: 'Successfully completed',
      icon: 'check',
      type: 'success'
    },
    {
      title: 'In Progress',
      value: serviceItems.filter(s => s.status === 'In Progress').length.toString(),
      subtitle: 'Currently active',
      icon: 'clock',
      type: 'info'
    },
    {
      title: 'On Hold',
      value: serviceItems.filter(s => s.status === 'On Hold').length.toString(),
      subtitle: 'Temporarily paused',
      icon: 'alert',
      type: 'warning'
    }
  ];

  const filteredServices = activeFilter === 'all' 
    ? serviceItems 
    : serviceItems.filter(service => {
        if (activeFilter === 'completed') {
          return service.status === 'Completed';
        } else if (activeFilter === 'inProgress') {
          return service.status === 'In Progress';
        } else if (activeFilter === 'onHold') {
          return service.status === 'On Hold';
        } else if (activeFilter === 'new') {
          return service.status === 'New';
        }
        return true;
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Service & Maintenance</h1>
        <button 
          onClick={openModal}
          className="flex items-center px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent hover:text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Service Request
        </button>
      </div>

      <StatusBoxGrid boxes={statusBoxes} />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Create Service Request"
      >
        <ServiceForm
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
            All Service Requests
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-4 py-2 ${activeFilter === 'completed' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveFilter('inProgress')}
            className={`px-4 py-2 ${activeFilter === 'inProgress' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            In Progress
          </button>
          <button
            onClick={() => setActiveFilter('onHold')}
            className={`px-4 py-2 ${activeFilter === 'onHold' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            On Hold
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
          <div className="col-span-2">Asset</div>
          <div>Type</div>
          <div>Due Date</div>
          <div>Status</div>
          <div></div>
        </div>
        
        {filteredServices.length > 0 ? (
          filteredServices.map(service => (
            <React.Fragment key={service.id}>
              <div 
                className={`grid grid-cols-6 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === service.id ? 'bg-mono-50' : ''}`}
                onClick={() => toggleExpand(service.id)}
              >
                <div className="col-span-2 flex items-center">
                  {service.priority === 'High' ? (
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  ) : (
                    <Wrench className="w-5 h-5 text-mono-400 mr-2" />
                  )}
                  <div>
                    <div className="font-medium text-mono-900">{service.asset}</div>
                    <div className="text-sm text-mono-500">Assigned to: {service.assignee}</div>
                  </div>
                </div>
                <div className="text-mono-600">{service.type}</div>
                <div className="text-mono-600">{service.dueDate}</div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    service.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    service.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {service.status}
                  </span>
                </div>
                <div className="flex justify-end">
                  {expandedId === service.id ? (
                    <ChevronUp className="w-5 h-5 text-mono-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-mono-400" />
                  )}
                </div>
              </div>

              {expandedId === service.id && (
                <div className="col-span-6 bg-mono-50 p-6 border-b">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Service Details</h3>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                          <p className="text-sm text-mono-600 mb-4">{service.description}</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-mono-500 mb-1">Estimated Duration</p>
                              <p className="text-sm font-medium text-mono-900">{service.estimatedDuration}</p>
                            </div>
                            <div>
                              <p className="text-xs text-mono-500 mb-1">Service Interval</p>
                              <p className="text-sm font-medium text-mono-900">{service.serviceInterval}</p>
                            </div>
                            <div>
                              <p className="text-xs text-mono-500 mb-1">Last Service</p>
                              <p className="text-sm font-medium text-mono-900">{service.lastService}</p>
                            </div>
                            <div>
                              <p className="text-xs text-mono-500 mb-1">Estimated Cost</p>
                              <p className="text-sm font-medium text-mono-900">${service.cost}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Service Checklist</h3>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                          <div className="space-y-3">
                            {service.checklist.map((task, index) => (
                              <div key={index} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={() => {}}
                                  className="h-4 w-4 text-mono-900 focus:ring-mono-500 border-mono-300 rounded"
                                />
                                <span className="ml-3 text-sm text-mono-600">{task.task}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {service.parts.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Parts Required</h3>
                          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="grid grid-cols-4 gap-4 p-3 font-medium text-mono-700 border-b">
                              <div className="col-span-2">Part</div>
                              <div>Quantity</div>
                              <div>Cost</div>
                            </div>
                            {service.parts.map((part, index) => (
                              <div key={index} className="grid grid-cols-4 gap-4 p-3 border-b last:border-0">
                                <div className="col-span-2 text-sm text-mono-600">{part.name}</div>
                                <div className="text-sm text-mono-600">{part.quantity}</div>
                                <div className="text-sm text-mono-600">${part.cost}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Service History</h3>
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                          <div className="grid grid-cols-4 gap-4 p-3 font-medium text-mono-700 border-b">
                            <div>Date</div>
                            <div>Type</div>
                            <div>Technician</div>
                            <div>Notes</div>
                          </div>
                          {service.history.map((record, index) => (
                            <div key={index} className="grid grid-cols-4 gap-4 p-3 border-b last:border-0">
                              <div className="text-sm text-mono-600">{record.date}</div>
                              <div className="text-sm text-mono-600">{record.type}</div>
                              <div className="text-sm text-mono-600">{record.technician}</div>
                              <div className="text-sm text-mono-600">{record.notes}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Status Information</h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            {service.status === 'Completed' ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            ) : service.status === 'In Progress' ? (
                              <Wrench className="w-4 h-4 text-blue-500 mr-2" />
                            ) : (
                              <Clock className="w-4 h-4 text-yellow-500 mr-2" />
                            )}
                            <span className="text-sm text-mono-500 mr-2">Status:</span>
                            <span className={`text-sm font-medium ${
                              service.status === 'Completed' ? 'text-green-600' :
                              service.status === 'In Progress' ? 'text-blue-600' :
                              'text-yellow-600'
                            }`}>{service.status}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Due Date:</span>
                            <span className="text-sm text-mono-900">{service.dueDate}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Location:</span>
                            <span className="text-sm text-mono-900">{service.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Assignee:</span>
                            <span className="text-sm text-mono-900">{service.assignee}</span>
                          </div>
                          <div className="flex items-center">
                            <AlertTriangle className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Priority:</span>
                            <span className={`text-sm font-medium ${
                              service.priority === 'High' ? 'text-red-600' :
                              service.priority === 'Medium' ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>{service.priority}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Related Services</h3>
                        <div className="space-y-2">
                          {service.relatedServices.map((relatedService) => (
                            <div key={relatedService.id} className="flex items-center">
                              <Link2 className="w-4 h-4 text-mono-400 mr-2" />
                              <span className="text-sm text-accent hover:underline cursor-pointer">{relatedService.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Notes</h3>
                        <p className="text-sm text-mono-600">{service.notes}</p>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Attachments</h3>
                        <div className="space-y-2">
                          {service.attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 text-mono-400 mr-2" />
                                <span className="text-sm text-accent hover:underline cursor-pointer">{file.name}</span>
                              </div>
                              <span className="text-xs text-mono-500">{file.size}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-mono-200 flex justify-end space-x-3">
                    <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                      Update Status
                    </button>
                    <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                      Add Notes
                    </button>
                    <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                      Generate Report
                    </button>
                    <ActionButtons />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))
        ) : (
          <EmptyState
            icon={Wrench}
            title="No service requests found"
            message={
              activeFilter === 'all' 
                ? "No service requests have been created yet."
                : "No service requests found matching the selected filter."
            }
            action={{
              label: "Create Service Request",
              onClick: openModal
            }}
          />
        )}
      </div>
    </div>
  );
}