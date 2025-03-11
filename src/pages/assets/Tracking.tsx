import React, { useState } from 'react';
import { Navigation2, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, Building, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import useModal from '../../hooks/useModal';
import StatusBoxGrid from '../../components/StatusBoxGrid';

interface ActivityRecord {
  id: number;
  asset: string;
  activity: string;
  type: string;
  location: string;
  performedBy: string;
  timestamp: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  description: string;
  details: {
    duration: string;
    resources: string[];
    equipment: string[];
    procedures: string[];
  };
  results: {
    outcome: string;
    findings: string[];
    recommendations: string[];
  };
  attachments: {
    name: string;
    size: string;
    date: string;
  }[];
  notes: string;
  nextAction?: {
    type: string;
    dueDate: string;
    assignedTo: string;
  };
  lastUpdated: string;
}

export default function Tracking() {
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
      console.error('Error recording activity:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const activities: ActivityRecord[] = [
    {
      id: 1,
      asset: 'Stage System A',
      activity: 'Maintenance Check',
      type: 'Preventive',
      location: 'Service Center',
      performedBy: 'John Smith',
      timestamp: '2024-03-15 09:30',
      status: 'Completed',
      description: 'Regular maintenance inspection and component testing',
      details: {
        duration: '2 hours',
        resources: ['Maintenance Tech', 'Safety Inspector'],
        equipment: ['Testing Equipment', 'Calibration Tools'],
        procedures: [
          'Visual inspection',
          'Load testing',
          'Safety system check',
          'Component verification'
        ]
      },
      results: {
        outcome: 'Passed',
        findings: [
          'All systems functioning within specifications',
          'Minor wear on safety latches - within acceptable limits',
          'Updated firmware to latest version'
        ],
        recommendations: [
          'Schedule next inspection in 90 days',
          'Monitor safety latch wear during next inspection'
        ]
      },
      attachments: [
        { name: 'inspection_report.pdf', size: '2.4 MB', date: '2024-03-15' },
        { name: 'test_results.xlsx', size: '1.2 MB', date: '2024-03-15' },
        { name: 'maintenance_photos.zip', size: '3.6 MB', date: '2024-03-15' }
      ],
      notes: 'All maintenance tasks completed according to schedule. System ready for next deployment.',
      nextAction: {
        type: 'Follow-up Inspection',
        dueDate: '2024-06-15',
        assignedTo: 'Technical Team'
      },
      lastUpdated: '2024-03-15 11:30'
    }
  ];

  // Status box data
  const statusBoxes = [
    {
      title: 'Total Activities',
      value: activities.length.toString(),
      subtitle: 'All activities',
      icon: 'file'
    },
    {
      title: 'Completed',
      value: activities.filter(a => a.status === 'Completed').length.toString(),
      subtitle: 'Successfully completed',
      icon: 'check',
      type: 'success'
    },
    {
      title: 'In Progress',
      value: activities.filter(a => a.status === 'In Progress').length.toString(),
      subtitle: 'Currently active',
      icon: 'clock',
      type: 'info'
    },
    {
      title: 'Pending',
      value: activities.filter(a => a.status === 'Pending').length.toString(),
      subtitle: 'Not started',
      icon: 'alert',
      type: 'warning'
    }
  ];

  const filteredActivities = activeFilter === 'all' 
    ? activities 
    : activities.filter(activity => {
        if (activeFilter === 'completed') {
          return activity.status === 'Completed';
        } else if (activeFilter === 'inProgress') {
          return activity.status === 'In Progress';
        } else if (activeFilter === 'pending') {
          return activity.status === 'Pending';
        }
        return true;
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Asset Activity Tracking</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search activities..."
              className="pl-10 pr-4 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
            />
            <Search className="w-5 h-5 text-mono-400 absolute left-3 top-2.5" />
          </div>
          <button className="flex items-center px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent hover:text-white">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button 
            onClick={openModal}
            className="flex items-center px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent hover:text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Record Activity
          </button>
        </div>
      </div>

      <StatusBoxGrid boxes={statusBoxes} />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Record Activity"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-mono-700 mb-1">
                Asset
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                required
              >
                <option value="">Select asset</option>
                <option value="stage_system_a">Stage System A</option>
                <option value="sound_system_pro">Sound System Pro</option>
                <option value="led_wall_4k">LED Wall 4K</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-mono-700 mb-1">
                Activity Type
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                required
              >
                <option value="">Select type</option>
                <option value="maintenance">Maintenance</option>
                <option value="repair">Repair</option>
                <option value="inspection">Inspection</option>
                <option value="calibration">Calibration</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-mono-700 mb-1">
              Description
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
              placeholder="Enter activity description"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-mono-700 mb-1">
                Location
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                placeholder="Enter location"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-mono-700 mb-1">
                Duration
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                placeholder="e.g., 2 hours"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-mono-700 mb-1">
              Results & Findings
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
              placeholder="Enter results and findings"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mono-700 mb-1">
              Attachments
            </label>
            <input
              type="file"
              multiple
              className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mono-700 mb-1">
              Notes
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
              placeholder="Enter any additional notes"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-white bg-mono-900 rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Recording...' : 'Record Activity'}
            </button>
          </div>
        </form>
      </Modal>

      <div className="mb-6">
        <div className="flex space-x-2 border-b border-mono-200">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 ${activeFilter === 'all' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            All Activities
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
            onClick={() => setActiveFilter('pending')}
            className={`px-4 py-2 ${activeFilter === 'pending' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Pending
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-6 gap-4 p-4 font-medium text-mono-700 border-b">
          <div className="col-span-2">Asset</div>
          <div>Activity</div>
          <div>Location</div>
          <div>Status</div>
          <div></div>
        </div>
        
        {filteredActivities.length > 0 ? (
          filteredActivities.map(activity => (
            <React.Fragment key={activity.id}>
              <div 
                className={`grid grid-cols-6 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === activity.id ? 'bg-mono-50' : ''}`}
                onClick={() => toggleExpand(activity.id)}
              >
                <div className="col-span-2 flex items-center">
                  <Navigation2 className="w-5 h-5 text-mono-400 mr-2" />
                  <div>
                    <div className="font-medium text-mono-900">{activity.asset}</div>
                    <div className="text-sm text-mono-500">{activity.timestamp}</div>
                  </div>
                </div>
                <div className="text-mono-600">{activity.activity}</div>
                <div className="text-mono-600">{activity.location}</div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    activity.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    activity.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
                <div className="flex justify-end">
                  {expandedId === activity.id ? (
                    <ChevronUp className="w-5 h-5 text-mono-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-mono-400" />
                  )}
                </div>
              </div>

              {expandedId === activity.id && (
                <div className="col-span-6 bg-mono-50 p-6 border-b">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Activity Details</h3>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                          <p className="text-sm text-mono-600 mb-4">{activity.description}</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-xs font-medium text-mono-700 mb-2">Resources Used</h4>
                              <ul className="list-disc pl-4 space-y-1">
                                {activity.details.resources.map((resource, index) => (
                                  <li key={index} className="text-sm text-mono-600">{resource}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-mono-700 mb-2">Equipment Used</h4>
                              <ul className="list-disc pl-4 space-y-1">
                                {activity.details.equipment.map((item, index) => (
                                  <li key={index} className="text-sm text-mono-600">{item}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Results & Findings</h3>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                          <div className="mb-4">
                            <h4 className="text-xs font-medium text-mono-700 mb-2">Outcome</h4>
                            <p className="text-sm text-mono-600">{activity.results.outcome}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-xs font-medium text-mono-700 mb-2">Findings</h4>
                              <ul className="list-disc pl-4 space-y-1">
                                {activity.results.findings.map((finding, index) => (
                                  <li key={index} className="text-sm text-mono-600">{finding}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-mono-700 mb-2">Recommendations</h4>
                              <ul className="list-disc pl-4 space-y-1">
                                {activity.results.recommendations.map((rec, index) => (
                                  <li key={index} className="text-sm text-mono-600">{rec}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Procedures Followed</h3>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                          <ul className="list-decimal pl-4 space-y-2">
                            {activity.details.procedures.map((procedure, index) => (
                              <li key={index} className="text-sm text-mono-600">{procedure}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Activity Information</h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Performed By:</span>
                            <span className="text-sm text-mono-900">{activity.performedBy}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Duration:</span>
                            <span className="text-sm text-mono-900">{activity.details.duration}</span>
                          </div>
                          <div className="flex items-center">
                            <Tag className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Type:</span>
                            <span className="text-sm text-mono-900">{activity.type}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Location:</span>
                            <span className="text-sm text-mono-900">{activity.location}</span>
                          </div>
                        </div>
                      </div>

                      {activity.nextAction && (
                        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Next Action</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-mono-500">Type:</span>
                              <span className="text-sm text-mono-900">{activity.nextAction.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-mono-500">Due Date:</span>
                              <span className="text-sm text-mono-900">{activity.nextAction.dueDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-mono-500">Assigned To:</span>
                              <span className="text-sm text-mono-900">{activity.nextAction.assignedTo}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Attachments</h3>
                        <div className="space-y-2">
                          {activity.attachments.map((file, index) => (
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

                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Notes</h3>
                        <p className="text-sm text-mono-600">{activity.notes}</p>
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
          <div className="p-4 text-center text-mono-500">No activities found</div>
        )}
      </div>
    </div>
  );
}