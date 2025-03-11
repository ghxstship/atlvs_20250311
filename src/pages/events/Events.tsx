import React, { useState } from 'react';
import { Palmtree as PalmTree, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, Building, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import EventForm from '../../components/forms/EventForm';
import useModal from '../../hooks/useModal';
import StatusBoxGrid from '../../components/StatusBoxGrid';

export default function Events() {
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
      console.error('Error creating event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const events = [
    {
      id: 1,
      name: 'Summer Music Festival',
      type: 'Festival',
      startDate: '2024-06-15',
      endDate: '2024-06-18',
      location: 'Central Park',
      status: 'Planning',
      capacity: 5000,
      budget: 250000,
      description: 'Four-day music festival featuring multiple stages and artists across various genres.',
      team: ['Alex Thompson', 'Maria Garcia', 'David Wilson', 'Emily Brown'],
      milestones: [
        { name: 'Artist Lineup Finalized', date: '2024-03-30', status: 'In Progress' },
        { name: 'Vendor Contracts Signed', date: '2024-04-15', status: 'Pending' },
        { name: 'Site Setup Begins', date: '2024-06-10', status: 'Pending' },
        { name: 'Festival Opening', date: '2024-06-15', status: 'Pending' }
      ],
      documents: [
        { name: 'project_proposal.pdf', size: '2.4 MB', date: '2024-02-15' },
        { name: 'budget_breakdown.xlsx', size: '1.8 MB', date: '2024-02-20' },
        { name: 'site_map.pdf', size: '3.6 MB', date: '2024-03-01' }
      ],
      notes: 'This is our largest festival to date. Special attention needed for crowd management and security.',
      lastUpdated: '2024-03-10 14:30'
    }
  ];

  // Status box data
  const statusBoxes = [
    {
      title: 'Total Events',
      value: events.length.toString(),
      subtitle: 'Active events',
      icon: 'calendar'
    },
    {
      title: 'Planning',
      value: events.filter(e => e.status === 'Planning').length.toString(),
      subtitle: 'In planning phase',
      icon: 'file',
      type: 'warning'
    },
    {
      title: 'Confirmed',
      value: events.filter(e => e.status === 'Confirmed').length.toString(),
      subtitle: 'Ready to go',
      icon: 'check',
      type: 'success'
    },
    {
      title: 'Total Value',
      value: `$${events.reduce((sum, e) => sum + e.budget, 0).toLocaleString()}`,
      subtitle: 'Combined budget',
      icon: 'dollar',
      type: 'info'
    }
  ];

  const filteredEvents = activeFilter === 'all' 
    ? events 
    : events.filter(event => {
        switch (activeFilter) {
          case 'planning':
            return event.status === 'Planning';
          case 'confirmed':
            return event.status === 'Confirmed';
          case 'inProgress':
            return event.status === 'In Progress';
          case 'past':
            return new Date(event.endDate) < new Date();
          default:
            return true;
        }
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Events</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
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
            Create Event
          </button>
        </div>
      </div>

      <StatusBoxGrid boxes={statusBoxes} />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Create New Event"
      >
        <EventForm
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
            All Events
          </button>
          <button
            onClick={() => setActiveFilter('planning')}
            className={`px-4 py-2 ${activeFilter === 'planning' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Planning
          </button>
          <button
            onClick={() => setActiveFilter('confirmed')}
            className={`px-4 py-2 ${activeFilter === 'confirmed' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setActiveFilter('inProgress')}
            className={`px-4 py-2 ${activeFilter === 'inProgress' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            In Progress
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
        <div className="grid grid-cols-6 gap-4 p-4 font-medium text-mono-700 border-b">
          <div className="col-span-2">Event Name</div>
          <div>Type</div>
          <div>Start Date</div>
          <div>Location</div>
          <div>Status</div>
        </div>
        
        {filteredEvents.map(event => (
          <React.Fragment key={event.id}>
            <div 
              className={`grid grid-cols-6 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === event.id ? 'bg-mono-50' : ''}`}
              onClick={() => toggleExpand(event.id)}
            >
              <div className="col-span-2 flex items-center">
                <PalmTree className="w-5 h-5 text-mono-400 mr-2" />
                <div>
                  <div className="font-medium text-mono-900">{event.name}</div>
                  <div className="text-sm text-mono-500">Capacity: {event.capacity}</div>
                </div>
              </div>
              <div className="text-mono-600">{event.type}</div>
              <div className="text-mono-600">{event.startDate}</div>
              <div className="text-mono-600">{event.location}</div>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  event.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                  event.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {event.status}
                </span>
              </div>
            </div>

            {expandedId === event.id && (
              <div className="col-span-6 bg-mono-50 p-6 border-b">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Event Description</h3>
                      <p className="text-sm text-mono-600">{event.description}</p>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Team</h3>
                      <div className="flex flex-wrap gap-2">
                        {event.team.map((member, index) => (
                          <div key={index} className="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm">
                            <div className="w-8 h-8 rounded-full bg-mono-100 flex items-center justify-center mr-2">
                              <span className="text-sm font-medium text-mono-600">
                                {member.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <span className="text-sm text-mono-600">{member}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Milestones</h3>
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="grid grid-cols-3 gap-4 p-3 font-medium text-mono-700 border-b">
                          <div>Milestone</div>
                          <div>Date</div>
                          <div>Status</div>
                        </div>
                        {event.milestones.map((milestone, index) => (
                          <div key={index} className="grid grid-cols-3 gap-4 p-3 border-b last:border-0">
                            <div className="text-sm text-mono-600">{milestone.name}</div>
                            <div className="text-sm text-mono-600">{milestone.date}</div>
                            <div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                milestone.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                milestone.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {milestone.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Event Details</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-mono-400 mr-2" />
                          <span className="text-sm text-mono-500 mr-2">Location:</span>
                          <span className="text-sm text-mono-900">{event.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-mono-400 mr-2" />
                          <span className="text-sm text-mono-500 mr-2">Duration:</span>
                          <span className="text-sm text-mono-900">
                            {Math.round((new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1)} days
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-mono-400 mr-2" />
                          <span className="text-sm text-mono-500 mr-2">Capacity:</span>
                          <span className="text-sm text-mono-900">{event.capacity}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-mono-400 mr-2" />
                          <span className="text-sm text-mono-500 mr-2">Budget:</span>
                          <span className="text-sm text-mono-900">${event.budget.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-mono-400 mr-2" />
                          <span className="text-sm text-mono-500 mr-2">Last updated:</span>
                          <span className="text-sm text-mono-900">{event.lastUpdated}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Documents</h3>
                      <div className="space-y-2">
                        {event.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="w-4 h-4 text-mono-400 mr-2" />
                              <span className="text-sm text-accent hover:underline cursor-pointer">{doc.name}</span>
                            </div>
                            <span className="text-xs text-mono-500">{doc.size}</span>
                          </div>
                        ))}
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
        ))}
      </div>
    </div>
  );
}