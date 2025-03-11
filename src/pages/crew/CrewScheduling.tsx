import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Search, Filter, ChevronDown, ChevronUp, Clock, Tag, Link2, FileText, MapPin, Users, Building, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import useModal from '../../hooks/useModal';
import StatusBoxGrid from '../../components/StatusBoxGrid';

export default function CrewScheduling() {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [view, setView] = useState<'calendar' | 'matrix'>('calendar');

  // Mock schedule data
  const scheduleEvents = [
    {
      id: '1',
      title: 'Stage Setup',
      start: '2024-03-20T08:00:00',
      end: '2024-03-20T16:00:00',
      crew: ['Sarah Chen', 'Mike Thompson'],
      location: 'Main Stage',
      type: 'setup'
    },
    {
      id: '2',
      title: 'Sound Check',
      start: '2024-03-20T13:00:00',
      end: '2024-03-20T15:00:00',
      crew: ['David Wilson'],
      location: 'Sound Booth',
      type: 'tech'
    }
  ];

  // Status box data
  const statusBoxes = [
    {
      title: "Today's Shifts",
      value: '8',
      subtitle: 'Active shifts today',
      icon: 'calendar'
    },
    {
      title: 'Crew Working',
      value: '12',
      subtitle: 'Currently on shift',
      icon: 'users',
      type: 'info'
    },
    {
      title: 'Upcoming',
      value: '24',
      subtitle: 'Next 7 days',
      icon: 'calendar',
      type: 'info'
    },
    {
      title: 'Conflicts',
      value: '2',
      subtitle: 'Scheduling conflicts',
      icon: 'alert',
      type: 'warning'
    }
  ];

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.date);
    openModal();
  };

  const handleEventClick = (arg: any) => {
    setSelectedEvent(arg.event);
    openModal();
  };

  const handleEventDrop = (arg: any) => {
    // Handle event drag and drop
    console.log('Event dropped:', arg.event);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Crew Scheduling</h1>
        <div className="flex space-x-4">
          <div className="flex rounded-lg border border-mono-200 overflow-hidden">
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 ${view === 'calendar' ? 'bg-mono-900 text-white' : 'bg-white text-mono-700'}`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setView('matrix')}
              className={`px-4 py-2 ${view === 'matrix' ? 'bg-mono-900 text-white' : 'bg-white text-mono-700'}`}
            >
              Matrix View
            </button>
          </div>
          
          <button 
            onClick={openModal}
            className="flex items-center px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent hover:text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Shift
          </button>
        </div>
      </div>

      <StatusBoxGrid boxes={statusBoxes} />

      {view === 'calendar' ? (
        <div className="bg-white rounded-lg shadow p-6">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={scheduleEvents}
            editable={true}
            droppable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            height="auto"
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-mono-200">
            <thead className="bg-mono-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-mono-500 uppercase tracking-wider">
                  Crew Member
                </th>
                {Array.from({ length: 7 }).map((_, index) => {
                  const date = new Date();
                  date.setDate(date.getDate() + index);
                  return (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-mono-500 uppercase tracking-wider">
                      {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-mono-200">
              {['Sarah Chen', 'Mike Thompson', 'David Wilson'].map((crew, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-mono-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-mono-600">
                          {crew.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-mono-900">{crew}</div>
                        <div className="text-sm text-mono-500">Stage Manager</div>
                      </div>
                    </div>
                  </td>
                  {Array.from({ length: 7 }).map((_, dayIndex) => (
                    <td key={dayIndex} className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-mono-500">
                        {Math.random() > 0.5 ? (
                          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs">
                            8:00 AM - 4:00 PM
                          </div>
                        ) : null}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={selectedEvent ? 'Edit Shift' : 'Add New Shift'}
        size="lg"
      >
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-mono-700">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                className="mt-1 block w-full rounded-md border-mono-300 shadow-sm focus:border-mono-500 focus:ring-mono-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-mono-700">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                className="mt-1 block w-full rounded-md border-mono-300 shadow-sm focus:border-mono-500 focus:ring-mono-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-mono-700">
              Crew Members
            </label>
            <select
              multiple
              className="mt-1 block w-full rounded-md border-mono-300 shadow-sm focus:border-mono-500 focus:ring-mono-500 sm:text-sm"
            >
              <option>Sarah Chen</option>
              <option>Mike Thompson</option>
              <option>David Wilson</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-mono-700">
              Location
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-mono-300 shadow-sm focus:border-mono-500 focus:ring-mono-500 sm:text-sm"
              placeholder="Enter location"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mono-700">
              Notes
            </label>
            <textarea
              rows={3}
              className="mt-1 block w-full rounded-md border-mono-300 shadow-sm focus:border-mono-500 focus:ring-mono-500 sm:text-sm"
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
              className="px-4 py-2 text-white bg-mono-900 rounded-lg hover:bg-accent"
            >
              {selectedEvent ? 'Update Shift' : 'Create Shift'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}