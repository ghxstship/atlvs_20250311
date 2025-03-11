import React, { useState } from 'react';
import { Waves, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, Phone, Mail, Building, Star, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import BookingForm from '../../components/forms/BookingForm';
import useModal from '../../hooks/useModal';
import EmptyState from '../../components/EmptyState';
import StatusBoxGrid from '../../components/StatusBoxGrid';

export default function Bookings() {
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
      console.error('Error creating booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Mock bookings data
  const bookings = [
    {
      id: 1,
      event: 'Tech Conference 2024',
      type: 'Venue',
      location: 'Convention Center',
      startDate: '2024-09-15',
      endDate: '2024-09-17',
      status: 'Confirmed',
      contact: {
        name: 'John Martinez',
        phone: '(555) 123-4567',
        email: 'john.m@conventioncenter.com'
      },
      details: {
        capacity: 1200,
        cost: 25000,
        deposit: 5000,
        paymentStatus: 'Deposit Paid'
      },
      requirements: {
        equipment: [
          'Stage setup',
          'Audio system',
          'Projector screens',
          'Lighting equipment'
        ],
        facilities: [
          'Main hall',
          'Breakout rooms',
          'Catering kitchen',
          'Loading dock'
        ]
      },
      documents: [
        { name: 'contract.pdf', size: '2.4 MB', date: '2024-03-01' },
        { name: 'floor_plan.pdf', size: '3.6 MB', date: '2024-03-05' }
      ],
      notes: 'Special setup required for keynote presentation. Early access needed for equipment load-in.'
    }
  ];

  // Status box data
  const statusBoxes = [
    {
      title: 'Total Bookings',
      value: bookings.length.toString(),
      subtitle: 'Active bookings',
      icon: 'calendar'
    },
    {
      title: 'Confirmed',
      value: bookings.filter(b => b.status === 'Confirmed').length.toString(),
      subtitle: 'Ready to go',
      icon: 'check',
      type: 'success'
    },
    {
      title: 'Pending',
      value: bookings.filter(b => b.status === 'Pending').length.toString(),
      subtitle: 'Awaiting confirmation',
      icon: 'clock',
      type: 'warning'
    },
    {
      title: 'Total Value',
      value: `$${bookings.reduce((sum, b) => sum + b.details.cost, 0).toLocaleString()}`,
      subtitle: 'Booking value',
      icon: 'dollar',
      type: 'info'
    }
  ];

  const filteredBookings = activeFilter === 'all' 
    ? bookings 
    : bookings.filter(booking => {
        switch (activeFilter) {
          case 'confirmed':
            return booking.status === 'Confirmed';
          case 'pending':
            return booking.status === 'Pending';
          case 'draft':
            return booking.status === 'Draft';
          case 'past':
            return new Date(booking.endDate) < new Date();
          default:
            return true;
        }
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Bookings</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search bookings..."
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
            New Booking
          </button>
        </div>
      </div>

      <StatusBoxGrid boxes={statusBoxes} />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Create New Booking"
      >
        <BookingForm
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
          <button
            onClick={() => setActiveFilter('draft')}
            className={`px-4 py-2 ${activeFilter === 'draft' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Draft
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
          <div className="col-span-2">Event</div>
          <div>Type</div>
          <div>Location</div>
          <div>Start Date</div>
          <div>Status</div>
          <div></div>
        </div>
        
        {filteredBookings.length > 0 ? (
          filteredBookings.map(booking => (
            <React.Fragment key={booking.id}>
              <div 
                className={`grid grid-cols-7 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === booking.id ? 'bg-mono-50' : ''}`}
                onClick={() => toggleExpand(booking.id)}
              >
                <div className="col-span-2 flex items-center">
                  <Waves className="w-5 h-5 text-mono-400 mr-2" />
                  <div>
                    <div className="font-medium text-mono-900">{booking.event}</div>
                    <div className="text-sm text-mono-500">{booking.startDate} - {booking.endDate}</div>
                  </div>
                </div>
                <div className="text-mono-600">{booking.type}</div>
                <div className="text-mono-600">{booking.location}</div>
                <div className="text-mono-600">{booking.startDate}</div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                <div className="flex justify-end">
                  {expandedId === booking.id ? (
                    <ChevronUp className="w-5 h-5 text-mono-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-mono-400" />
                  )}
                </div>
              </div>

              {expandedId === booking.id && (
                <div className="col-span-7 bg-mono-50 p-6 border-b">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Requirements</h3>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-xs font-medium text-mono-700 mb-2">Equipment</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {booking.requirements.equipment.map((item, index) => (
                                <li key={index} className="text-sm text-mono-600">{item}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-mono-700 mb-2">Facilities</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {booking.requirements.facilities.map((item, index) => (
                                <li key={index} className="text-sm text-mono-600">{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Notes</h3>
                        <p className="text-sm text-mono-600 bg-white p-3 rounded-lg shadow-sm">{booking.notes}</p>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Contact Information</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-900">{booking.contact.name}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 text-mono-400 mr-2" />
                            <a href={`tel:${booking.contact.phone}`} className="text-sm text-accent hover:underline">
                              {booking.contact.phone}
                            </a>
                          </div>
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 text-mono-400 mr-2" />
                            <a href={`mailto:${booking.contact.email}`} className="text-sm text-accent hover:underline">
                              {booking.contact.email}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Booking Details</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-mono-500">Capacity:</span>
                            <span className="text-sm text-mono-900">{booking.details.capacity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-mono-500">Total Cost:</span>
                            <span className="text-sm text-mono-900">${booking.details.cost.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-mono-500">Deposit:</span>
                            <span className="text-sm text-mono-900">${booking.details.deposit.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-mono-500">Payment Status:</span>
                            <span className="text-sm text-mono-900">{booking.details.paymentStatus}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Documents</h3>
                        <div className="space-y-2">
                          {booking.documents.map((doc, index) => (
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
            icon={Waves}
            title="No bookings found"
            message={
              activeFilter === 'all' 
                ? "No bookings have been created yet."
                : "No bookings found matching the selected filter."
            }
            action={{
              label: "Create Booking",
              onClick: openModal
            }}
          />
        )}
      </div>
    </div>
  );
}