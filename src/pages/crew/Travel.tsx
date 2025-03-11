import React, { useState } from 'react';
import { Plane, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, Phone, Mail, Building, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import BookTravelForm from '../../components/forms/BookTravelForm';
import useModal from '../../hooks/useModal';
import CostEstimation from '../../components/travel/CostEstimation';
import TravelPolicyValidation from '../../components/travel/TravelPolicyValidation';
import ApprovalWorkflow from '../../components/travel/ApprovalWorkflow';
import LocationAutocomplete from '../../components/travel/LocationAutocomplete';
import StatusBoxGrid from '../../components/StatusBoxGrid';
import EmptyState from '../../components/EmptyState';

export default function Travel() {
  const { isOpen, openModal, closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      closeModal();
    } catch (error) {
      console.error('Error booking travel:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Mock travel items data
  const travelItems = [
    {
      id: 1,
      type: 'flight',
      project: 'Summer Music Festival',
      traveler: 'Sarah Chen',
      startDate: '2024-06-15',
      endDate: '2024-06-18',
      status: 'Confirmed',
      cost: 850,
      details: {
        flight: {
          outbound: {
            airline: 'Delta Airlines',
            flightNumber: 'DL1234',
            departure: 'LAX',
            arrival: 'JFK',
            departureTime: '08:00 AM',
            arrivalTime: '4:30 PM',
            confirmation: 'ABC123'
          },
          return: {
            airline: 'Delta Airlines',
            flightNumber: 'DL1235',
            departure: 'JFK',
            arrival: 'LAX',
            departureTime: '10:00 AM',
            arrivalTime: '1:30 PM',
            confirmation: 'ABC124'
          }
        }
      },
      documents: [
        { name: 'itinerary.pdf', size: '1.2 MB', date: '2024-03-15' },
        { name: 'boarding_pass.pdf', size: '0.8 MB', date: '2024-03-15' }
      ],
      notes: 'Early arrival requested for equipment setup'
    }
  ];

  // Status box data
  const statusBoxes = [
    {
      title: 'Total Bookings',
      value: travelItems.length.toString(),
      subtitle: 'Active travel bookings',
      icon: 'plane'
    },
    {
      title: 'Confirmed',
      value: travelItems.filter(t => t.status === 'Confirmed').length.toString(),
      subtitle: 'Ready to go',
      icon: 'check',
      type: 'success'
    },
    {
      title: 'Pending',
      value: travelItems.filter(t => t.status === 'Pending').length.toString(),
      subtitle: 'Awaiting confirmation',
      icon: 'clock',
      type: 'warning'
    },
    {
      title: 'Total Cost',
      value: `$${travelItems.reduce((sum, t) => sum + t.cost, 0).toLocaleString()}`,
      subtitle: 'Travel expenses',
      icon: 'dollar',
      type: 'info'
    }
  ];

  const filteredItems = activeFilter === 'all' 
    ? travelItems 
    : travelItems.filter(item => {
        if (activeFilter === 'confirmed') {
          return item.status === 'Confirmed';
        } else if (activeFilter === 'pending') {
          return item.status === 'Pending';
        }
        return true;
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Crew Travel</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search travel..."
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
            Book Travel
          </button>
        </div>
      </div>

      <StatusBoxGrid boxes={statusBoxes} />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Book Travel"
        size="xl"
      >
        <BookTravelForm
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
            All Bookings
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
          <div className="col-span-2">Traveler</div>
          <div>Project</div>
          <div>Start Date</div>
          <div>End Date</div>
          <div>Status</div>
          <div></div>
        </div>
        
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <React.Fragment key={item.id}>
              <div 
                className={`grid grid-cols-7 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === item.id ? 'bg-mono-50' : ''}`}
                onClick={() => toggleExpand(item.id)}
              >
                <div className="col-span-2 flex items-center">
                  <Plane className="w-5 h-5 text-mono-400 mr-2" />
                  <div>
                    <div className="font-medium text-mono-900">{item.traveler}</div>
                    <div className="text-sm text-mono-500">{item.type === 'flight' ? item.details.flight.outbound.airline : ''}</div>
                  </div>
                </div>
                <div className="text-mono-600">{item.project}</div>
                <div className="text-mono-600">{item.startDate}</div>
                <div className="text-mono-600">{item.endDate}</div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
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
                <div className="col-span-7 bg-mono-50 p-6 border-b">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                      {item.type === 'flight' && (
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Flight Details</h3>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg shadow-sm p-4">
                              <h4 className="text-xs font-medium text-mono-700 mb-3">Outbound Flight</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Flight:</span>
                                  <span className="text-sm text-mono-900">
                                    {item.details.flight.outbound.airline} {item.details.flight.outbound.flightNumber}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">From:</span>
                                  <span className="text-sm text-mono-900">{item.details.flight.outbound.departure}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">To:</span>
                                  <span className="text-sm text-mono-900">{item.details.flight.outbound.arrival}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Departure:</span>
                                  <span className="text-sm text-mono-900">{item.details.flight.outbound.departureTime}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Arrival:</span>
                                  <span className="text-sm text-mono-900">{item.details.flight.outbound.arrivalTime}</span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm p-4">
                              <h4 className="text-xs font-medium text-mono-700 mb-3">Return Flight</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Flight:</span>
                                  <span className="text-sm text-mono-900">
                                    {item.details.flight.return.airline} {item.details.flight.return.flightNumber}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">From:</span>
                                  <span className="text-sm text-mono-900">{item.details.flight.return.departure}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">To:</span>
                                  <span className="text-sm text-mono-900">{item.details.flight.return.arrival}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Departure:</span>
                                  <span className="text-sm text-mono-900">{item.details.flight.return.departureTime}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Arrival:</span>
                                  <span className="text-sm text-mono-900">{item.details.flight.return.arrivalTime}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Notes</h3>
                        <p className="text-sm text-mono-600 bg-white p-3 rounded-lg shadow-sm">{item.notes}</p>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Documents</h3>
                        <div className="space-y-2">
                          {item.documents.map((doc, index) => (
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
          ))
        ) : (
          <EmptyState
            icon={Plane}
            title="No travel bookings found"
            message={
              activeFilter === 'all' 
                ? "No travel has been booked yet."
                : "No travel bookings found matching the selected filter."
            }
            action={{
              label: "Book Travel",
              onClick: openModal
            }}
          />
        )}
      </div>
    </div>
  );
}