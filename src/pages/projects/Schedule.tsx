import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Search, Filter, Flag, Upload, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, Building, Star, CheckCircle, AlertTriangle, Eye, Download, Share2, LayoutGrid, List } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import useModal from '../../hooks/useModal';
import EmptyState from '../../components/EmptyState';
import StatusBoxGrid from '../../components/StatusBoxGrid';

interface ScheduleFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// Helper function to get status color classes
const getStatusColor = (status: string) => {
  switch(status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in progress':
      return 'bg-blue-100 text-blue-800';
    case 'scheduled':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-mono-100 text-mono-800';
  }
};

// Helper function to get status icon
const getStatusIcon = (status: string) => {
  switch(status.toLowerCase()) {
    case 'completed':
      return <CheckCircle className="w-4 h-4 mr-1" />;
    case 'in progress':
      return <Clock className="w-4 h-4 mr-1" />;
    case 'scheduled':
      return <Calendar className="w-4 h-4 mr-1" />;
    case 'cancelled':
      return <AlertTriangle className="w-4 h-4 mr-1" />;
    default:
      return null;
  }
};

function ScheduleForm({ onSubmit, onCancel, isSubmitting }: ScheduleFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-mono-700">
            Project
            <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            name="project"
            className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
            required
          >
            <option value="">Select project</option>
            <option value="Summer Music Festival">Summer Music Festival</option>
            <option value="Corporate Event">Corporate Event</option>
            <option value="Theater Production">Theater Production</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-mono-700">
            Location
            <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            name="location"
            className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
            required
          >
            <option value="">Select location</option>
            <option value="Main Stage">Main Stage</option>
            <option value="Conference Hall B">Conference Hall B</option>
            <option value="Theater Complex">Theater Complex</option>
            <option value="Backstage Area">Backstage Area</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-mono-700">
          Files
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-mono-300 border-dashed rounded-lg">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-mono-400" />
            <div className="flex text-sm text-mono-600">
              <label className="relative cursor-pointer rounded-md font-medium text-accent hover:text-accent-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-accent">
                <span>Upload files</span>
                <input
                  type="file"
                  multiple={true}
                  className="sr-only"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-mono-500">
              Up to 10 files (PDF, PNG, JPG)
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-white bg-mono-900 rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Save Schedule Item'}
        </button>
      </div>
    </form>
  );
}

export default function Schedule() {
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
      console.error('Error creating schedule item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Mock schedule items data
  const scheduleItems = [
    {
      id: 1,
      date: '2024-03-15',
      startTime: '08:00',
      endTime: '16:00',
      project: 'Summer Music Festival',
      type: 'Setup',
      activity: 'Stage Setup',
      location: 'Main Stage',
      status: 'In Progress',
      flag: 'High Priority',
      description: 'Complete stage setup including audio, lighting, and video systems.',
      equipment: 'Line Array Speaker System, LED Video Wall, Moving Head Lights',
      labor: '4 Audio Techs, 3 Lighting Techs, 2 Video Techs, 5 Stage Hands',
      files: ['stage_plot.pdf', 'equipment_list.xlsx'],
      internalNotes: 'Ensure all equipment is tested before artist arrival at 13:00',
      lastUpdated: '2024-03-15 09:30'
    }
  ];

  // Status box data
  const statusBoxes = [
    {
      title: "Today's Events",
      value: '2',
      subtitle: '2 scheduled, 0 completed',
      icon: 'calendar'
    },
    {
      title: 'This Week',
      value: '12',
      subtitle: '8 scheduled, 4 completed',
      icon: 'calendar',
      type: 'info'
    },
    {
      title: 'High Priority',
      value: '3',
      subtitle: 'Requires immediate attention',
      icon: 'alert',
      type: 'warning'
    },
    {
      title: 'Upcoming',
      value: '15',
      subtitle: 'Next 7 days',
      icon: 'calendar',
      type: 'info'
    }
  ];

  const filteredItems = scheduleItems.length > 0 ? scheduleItems.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'today') return item.date === '2024-03-15';
    if (activeFilter === 'upcoming') return new Date(item.date) > new Date();
    if (activeFilter === 'flagged') return item.flag !== '';
    return true;
  }) : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Production Schedule</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search schedule..."
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
            Schedule New Activity
          </button>
        </div>
      </div>

      <StatusBoxGrid boxes={statusBoxes} />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Add Schedule Item"
      >
        <ScheduleForm
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
            All Items
          </button>
          <button
            onClick={() => setActiveFilter('today')}
            className={`px-4 py-2 ${activeFilter === 'today' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveFilter('upcoming')}
            className={`px-4 py-2 ${activeFilter === 'upcoming' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveFilter('flagged')}
            className={`px-4 py-2 ${activeFilter === 'flagged' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Flagged
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-8 gap-4 p-4 font-medium text-mono-700 border-b">
          <div>Date</div>
          <div>Time</div>
          <div>Project</div>
          <div>Type</div>
          <div className="col-span-2">Activity</div>
          <div>Status</div>
          <div></div>
        </div>
        
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <React.Fragment key={item.id}>
              <div 
                className={`grid grid-cols-8 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === item.id ? 'bg-mono-50' : ''}`}
                onClick={() => toggleExpand(item.id)}
              >
                <div className="text-mono-600">{item.date}</div>
                <div className="text-mono-600">{item.startTime} - {item.endTime}</div>
                <div className="text-mono-600">{item.project}</div>
                <div className="text-mono-600">{item.type}</div>
                <div className="col-span-2 flex items-center">
                  {item.flag && <Flag className={`w-4 h-4 mr-2 ${
                    item.flag === 'High Priority' ? 'text-[#F44336]' :
                    item.flag === 'At Risk' ? 'text-[#FFC107]' :
                    'text-mono-400'
                  }`} />}
                  <div>
                    <div className="font-medium text-mono-900">{item.activity}</div>
                    <div className="text-sm text-mono-500">{item.location}</div>
                  </div>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                    {item.status}
                  </span>
                </div>
                <div className="flex justify-end">
                  {expandedId === item.id ? (
                    <ChevronUp className="w-5 h-5 text-mono-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-mono-400" />
                  )}
                </div>
              </div>

              {expandedId === item.id && (
                <div className="col-span-8 bg-mono-50 p-6 border-b">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Event Details</h3>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                          <p className="text-sm text-mono-600 mb-4">{item.description}</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-xs font-medium text-mono-700 mb-2">Resources</h4>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-sm text-mono-500">Equipment:</span>
                                  <p className="text-sm text-mono-900">{item.equipment}</p>
                                </div>
                                <div>
                                  <span className="text-sm text-mono-500">Labor:</span>
                                  <p className="text-sm text-mono-900">{item.labor}</p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-mono-700 mb-2">Files</h4>
                              <div className="space-y-2">
                                {item.files.map((file, index) => (
                                  <button
                                    key={index}
                                    onClick={() => {
                                      console.log('Download file:', file);
                                    }}
                                    className="text-sm text-accent hover:underline flex items-center"
                                  >
                                    <FileText className="w-4 h-4 mr-2" />
                                    {file}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Notes</h3>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                          <p className="text-sm text-mono-600">{item.internalNotes}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Status Information</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-mono-500">Status:</span>
                            <span className="text-sm text-mono-900">{item.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-mono-500">Last Updated:</span>
                            <span className="text-sm text-mono-600">{item.lastUpdated}</span>
                          </div>
                          {item.flag && (
                            <div className="flex justify-between">
                              <span className="text-sm text-mono-500">Flag:</span>
                              <span className="text-sm text-mono-900">{item.flag}</span>
                            </div>
                          )}
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
            icon={CalendarIcon}
            title="No schedule items found"
            message="Create your first schedule item by clicking the 'Add Schedule Item' button above."
            action={{
              label: "Add Schedule Item",
              onClick: openModal
            }}
          />
        )}
      </div>
    </div>
  );
}