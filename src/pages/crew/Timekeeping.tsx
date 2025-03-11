import React, { useState } from 'react';
import { Clock, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Tag, Link2, FileText, MapPin, Users, Building, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import TimekeepingForm from '../../components/forms/TimekeepingForm';
import useModal from '../../hooks/useModal';
import EmptyState from '../../components/EmptyState';
import StatusBoxGrid from '../../components/StatusBoxGrid';

export default function Timekeeping() {
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
      console.error('Error creating time entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Mock time entries data
  const timeEntries = [
    {
      id: 1,
      employee: 'Sarah Chen',
      project: 'Summer Music Festival',
      date: '2024-03-15',
      clockIn: '08:00',
      clockOut: '16:00',
      hours: 8,
      status: 'Approved',
      department: 'Production',
      role: 'Stage Manager',
      location: 'Main Stage',
      tasks: [
        'Stage setup coordination',
        'Safety briefing',
        'Performance supervision'
      ],
      breaks: [
        { start: '12:00', end: '13:00', duration: '1 hour', type: 'Lunch' }
      ],
      notes: 'Successful setup day with no incidents.',
      approvedBy: 'Mike Thompson',
      approvedDate: '2024-03-15 17:00'
    }
  ];

  // Status box data
  const statusBoxes = [
    {
      title: 'Total Hours',
      value: timeEntries.reduce((sum, entry) => sum + entry.hours, 0).toString(),
      subtitle: 'Hours logged today',
      icon: 'clock'
    },
    {
      title: 'Approved',
      value: timeEntries.filter(e => e.status === 'Approved').length.toString(),
      subtitle: 'Entries approved',
      icon: 'check',
      type: 'success'
    },
    {
      title: 'Pending',
      value: timeEntries.filter(e => e.status === 'Pending').length.toString(),
      subtitle: 'Awaiting approval',
      icon: 'alert',
      type: 'warning'
    },
    {
      title: 'Average Hours',
      value: (timeEntries.reduce((sum, entry) => sum + entry.hours, 0) / timeEntries.length).toFixed(1),
      subtitle: 'Per entry',
      icon: 'trending',
      type: 'info'
    }
  ];

  const filteredEntries = activeFilter === 'all' 
    ? timeEntries 
    : timeEntries.filter(entry => {
        switch (activeFilter) {
          case 'approved':
            return entry.status === 'Approved';
          case 'pending':
            return entry.status === 'Pending';
          case 'archived':
            return entry.status === 'Archived';
          default:
            return true;
        }
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Timekeeping</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search entries..."
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
            Add Time Entry
          </button>
        </div>
      </div>

      <StatusBoxGrid boxes={statusBoxes} />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Add Time Entry"
      >
        <TimekeepingForm
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
            All Entries
          </button>
          <button
            onClick={() => setActiveFilter('approved')}
            className={`px-4 py-2 ${activeFilter === 'approved' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Approved
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-4 py-2 ${activeFilter === 'pending' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveFilter('archived')}
            className={`px-4 py-2 ${activeFilter === 'archived' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Archived
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-7 gap-4 p-4 font-medium text-mono-700 border-b">
          <div className="col-span-2">Employee</div>
          <div>Project</div>
          <div>Date</div>
          <div>Hours</div>
          <div>Status</div>
          <div></div>
        </div>
        
        {filteredEntries.length > 0 ? (
          filteredEntries.map(entry => (
            <React.Fragment key={entry.id}>
              <div 
                className={`grid grid-cols-7 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === entry.id ? 'bg-mono-50' : ''}`}
                onClick={() => toggleExpand(entry.id)}
              >
                <div className="col-span-2 flex items-center">
                  <Clock className="w-5 h-5 text-mono-400 mr-2" />
                  <div>
                    <div className="font-medium text-mono-900">{entry.employee}</div>
                    <div className="text-sm text-mono-500">{entry.clockIn} - {entry.clockOut}</div>
                  </div>
                </div>
                <div className="text-mono-600">{entry.project}</div>
                <div className="text-mono-600">{entry.date}</div>
                <div className="text-mono-600">{entry.hours}</div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    entry.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {entry.status}
                  </span>
                </div>
                <div className="flex justify-end">
                  {expandedId === entry.id ? (
                    <ChevronUp className="w-5 h-5 text-mono-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-mono-400" />
                  )}
                </div>
              </div>

              {expandedId === entry.id && (
                <div className="col-span-7 bg-mono-50 p-6 border-b">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Tasks & Activities</h3>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                          <ul className="list-disc pl-4 space-y-1">
                            {entry.tasks.map((task, index) => (
                              <li key={index} className="text-sm text-mono-600">{task}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Breaks</h3>
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                          <div className="grid grid-cols-4 gap-4 p-3 font-medium text-mono-700 border-b">
                            <div>Start</div>
                            <div>End</div>
                            <div>Duration</div>
                            <div>Type</div>
                          </div>
                          {entry.breaks.map((breakTime, index) => (
                            <div key={index} className="grid grid-cols-4 gap-4 p-3 border-b last:border-0">
                              <div className="text-sm text-mono-600">{breakTime.start}</div>
                              <div className="text-sm text-mono-600">{breakTime.end}</div>
                              <div className="text-sm text-mono-600">{breakTime.duration}</div>
                              <div className="text-sm text-mono-600">{breakTime.type}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Notes</h3>
                        <p className="text-sm text-mono-600 bg-white p-3 rounded-lg shadow-sm">{entry.notes}</p>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Assignment Details</h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Building className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Department:</span>
                            <span className="text-sm text-mono-900">{entry.department}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Role:</span>
                            <span className="text-sm text-mono-900">{entry.role}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Location:</span>
                            <span className="text-sm text-mono-900">{entry.location}</span>
                          </div>
                        </div>
                      </div>

                      {entry.status === 'Approved' && (
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Approval Details</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-mono-500">Approved By:</span>
                              <span className="text-sm text-mono-900">{entry.approvedBy}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-mono-500">Approved Date:</span>
                              <span className="text-sm text-mono-900">{entry.approvedDate}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-mono-200 flex justify-end space-x-3">
                    {entry.status === 'Pending' && (
                      <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                        Approve
                      </button>
                    )}
                    <ActionButtons />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))
        ) : (
          <EmptyState
            icon={Clock}
            title="No time entries found"
            message="Record your first time entry by clicking the 'Add Time Entry' button above."
            action={{
              label: "Add Time Entry",
              onClick: openModal
            }}
          />
        )}
      </div>
    </div>
  );
}