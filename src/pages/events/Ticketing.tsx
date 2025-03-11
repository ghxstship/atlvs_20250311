import React, { useState } from 'react';
import { Ticket, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, DollarSign, Building, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import TicketForm from '../../components/forms/TicketForm';
import useModal from '../../hooks/useModal';
import StatusBoxGrid from '../../components/StatusBoxGrid';
import EmptyState from '../../components/EmptyState';

export default function Ticketing() {
  const { isOpen, openModal, closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock ticket types data
  const tickets = [
    {
      id: 1,
      type: 'VIP Pass',
      event: 'Summer Music Festival',
      price: 299.99,
      available: 250,
      sold: 150,
      status: 'On Sale',
      description: 'Full festival access with VIP amenities including exclusive viewing areas and lounge access.',
      benefits: [
        'Priority entrance',
        'VIP viewing areas',
        'Exclusive lounge access',
        'Complimentary refreshments',
        'Meet & greet opportunities'
      ],
      restrictions: [
        'Age 21+',
        'Non-transferable',
        'Valid ID required'
      ],
      saleStart: '2024-03-01',
      saleEnd: '2024-06-01',
      lastUpdated: '2024-03-15 14:30'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      closeModal();
    } catch (error) {
      console.error('Error creating ticket type:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Status box data
  const statusBoxes = [
    {
      title: 'Total Tickets',
      value: `${tickets.filter(t => t.status === 'On Sale').length}`,
      subtitle: 'Currently on sale',
      icon: 'ticket'
    },
    {
      title: 'Upcoming',
      value: `${tickets.filter(t => t.status === 'Upcoming').length}`,
      subtitle: 'Not yet on sale',
      icon: 'calendar',
      type: 'info'
    },
    {
      title: 'Sold Out',
      value: `${tickets.filter(t => t.status === 'Sold Out').length}`,
      subtitle: 'No availability',
      icon: 'alert',
      type: 'warning'
    },
    {
      title: 'Inactive',
      value: `${tickets.filter(t => t.status === 'Inactive').length}`,
      subtitle: 'Not available',
      icon: 'archive',
      type: 'error'
    }
  ];

  const filteredTickets = activeFilter === 'all' 
    ? tickets 
    : tickets.filter(ticket => {
        switch (activeFilter) {
          case 'onSale':
            return ticket.status === 'On Sale';
          case 'soldOut':
            return ticket.status === 'Sold Out';
          case 'inactive':
            return ticket.status === 'Inactive';
          case 'upcoming':
            return new Date(ticket.saleStart) > new Date();
          default:
            return true;
        }
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Ticketing</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tickets..."
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
            Create Ticket Type
          </button>
        </div>
      </div>

      <StatusBoxGrid boxes={statusBoxes} />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Create New Ticket Type"
      >
        <TicketForm
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
            All Tickets
          </button>
          <button
            onClick={() => setActiveFilter('upcoming')}
            className={`px-4 py-2 ${activeFilter === 'upcoming' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveFilter('onSale')}
            className={`px-4 py-2 ${activeFilter === 'onSale' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            On Sale
          </button>
          <button
            onClick={() => setActiveFilter('soldOut')}
            className={`px-4 py-2 ${activeFilter === 'soldOut' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Sold Out
          </button>
          <button
            onClick={() => setActiveFilter('inactive')}
            className={`px-4 py-2 ${activeFilter === 'inactive' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Inactive
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-7 gap-4 p-4 font-medium text-mono-700 border-b">
          <div className="col-span-2">Event</div>
          <div>Ticket Type</div>
          <div>Price</div>
          <div>Available</div>
          <div>Status</div>
          <div></div>
        </div>
        
        {filteredTickets.length > 0 ? (
          filteredTickets.map(ticket => (
            <React.Fragment key={ticket.id}>
              <div 
                className={`grid grid-cols-7 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === ticket.id ? 'bg-mono-50' : ''}`}
                onClick={() => toggleExpand(ticket.id)}
              >
                <div className="col-span-2 flex items-center">
                  <Ticket className="w-5 h-5 text-mono-400 mr-2" />
                  <div>
                    <div className="font-medium text-mono-900">{ticket.event}</div>
                    <div className="text-sm text-mono-500">{ticket.sold} sold</div>
                  </div>
                </div>
                <div className="text-mono-600">{ticket.type}</div>
                <div className="text-mono-600">${ticket.price.toFixed(2)}</div>
                <div className="text-mono-600">{ticket.available}</div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    ticket.status === 'On Sale' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
                <div className="flex justify-end">
                  {expandedId === ticket.id ? (
                    <ChevronUp className="w-5 h-5 text-mono-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-mono-400" />
                  )}
                </div>
              </div>

              {expandedId === ticket.id && (
                <div className="col-span-7 bg-mono-50 p-6 border-b">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Ticket Description</h3>
                        <p className="text-sm text-mono-600">{ticket.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Benefits</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {ticket.benefits.map((benefit, index) => (
                              <li key={index} className="text-sm text-mono-600">{benefit}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Restrictions</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {ticket.restrictions.map((restriction, index) => (
                              <li key={index} className="text-sm text-mono-600">{restriction}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Sales Information</h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Sale Start:</span>
                            <span className="text-sm text-mono-900">{ticket.saleStart}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Sale End:</span>
                            <span className="text-sm text-mono-900">{ticket.saleEnd}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Last Updated:</span>
                            <span className="text-sm text-mono-900">{ticket.lastUpdated}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Sales Statistics</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-mono-500">Total Available:</span>
                            <span className="text-sm font-medium text-mono-900">{ticket.available}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-mono-500">Sold:</span>
                            <span className="text-sm font-medium text-mono-900">{ticket.sold}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-mono-500">Remaining:</span>
                            <span className="text-sm font-medium text-mono-900">
                              {ticket.available - ticket.sold}
                            </span>
                          </div>
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-mono-500 mb-1">
                              <span>Sales Progress</span>
                              <span>{Math.round((ticket.sold / ticket.available) * 100)}%</span>
                            </div>
                            <div className="h-2 bg-mono-200 rounded-full">
                              <div 
                                className="h-2 bg-mono-900 rounded-full"
                                style={{ width: `${(ticket.sold / ticket.available) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-mono-200 flex justify-end space-x-3">
                    <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                      Edit Ticket
                    </button>
                    <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                      View Sales
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
            icon={Ticket}
            title="No tickets found"
            message={
              activeFilter === 'all' 
                ? "No tickets have been created yet."
                : "No tickets found matching the selected filter."
            }
            action={{
              label: "Create Ticket Type",
              onClick: openModal
            }}
          />
        )}
      </div>
    </div>
  );
}