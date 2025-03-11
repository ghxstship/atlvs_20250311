import React, { useState } from 'react';
import { Truck, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, Building, Star, CheckCircle, AlertTriangle, DollarSign, Phone, Mail } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import LogisticsForm from '../../components/forms/LogisticsForm';
import useModal from '../../hooks/useModal';
import StatusBoxGrid from '../../components/StatusBoxGrid';

export default function Logistics() {
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
      console.error('Error creating shipment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const shipments = [
    {
      id: 1,
      description: 'Stage Equipment',
      origin: 'Warehouse A',
      destination: 'Convention Center',
      departureDate: '2024-03-15',
      arrivalDate: '2024-03-16',
      status: 'In Transit',
      carrier: 'Express Logistics',
      trackingNumber: 'TRK123456789',
      value: 25000,
      details: {
        items: [
          { name: 'Line Array Speakers', quantity: 8, weight: '1600 lbs' },
          { name: 'Subwoofers', quantity: 4, weight: '800 lbs' },
          { name: 'Monitor Speakers', quantity: 6, weight: '300 lbs' }
        ],
        totalWeight: '2700 lbs',
        dimensions: '96" x 48" x 84"',
        packaging: 'Custom road cases',
        specialInstructions: 'Handle with care, temperature sensitive equipment'
      },
      schedule: {
        pickup: '2024-03-15 08:00 AM',
        delivery: '2024-03-16 10:00 AM',
        loadingTime: '2 hours',
        transitTime: '24 hours'
      },
      contacts: {
        sender: {
          name: 'Mike Thompson',
          phone: '(555) 123-4567',
          email: 'mike.t@warehouse.com'
        },
        receiver: {
          name: 'Sarah Chen',
          phone: '(555) 234-5678',
          email: 'sarah.c@convention.com'
        },
        carrier: {
          name: 'John Martinez',
          phone: '(555) 345-6789',
          email: 'john.m@express.com'
        }
      },
      insurance: {
        provider: 'Global Insurance Co',
        coverage: '$30,000',
        policy: 'POL-123456',
        expires: '2024-12-31'
      },
      documents: [
        { name: 'bill_of_lading.pdf', size: '1.2 MB', date: '2024-03-15' },
        { name: 'packing_list.pdf', size: '0.8 MB', date: '2024-03-15' },
        { name: 'insurance_cert.pdf', size: '1.5 MB', date: '2024-03-15' }
      ],
      tracking: [
        { time: '2024-03-15 08:00 AM', location: 'Warehouse A', status: 'Picked Up' },
        { time: '2024-03-15 10:30 AM', location: 'Distribution Center', status: 'In Transit' },
        { time: '2024-03-15 02:45 PM', location: 'Regional Hub', status: 'In Transit' }
      ],
      notes: 'High-priority shipment for upcoming event. Requires careful handling of audio equipment.',
      lastUpdated: '2024-03-15 14:30'
    }
  ];

  const statusBoxes = [
    {
      title: 'Total Shipments',
      value: `${shipments.filter(s => s.status === 'Delivered').length}`,
      subtitle: 'Delivered shipments',
      icon: 'truck'
    },
    {
      title: 'In Transit',
      value: `${shipments.filter(s => s.status === 'In Transit').length}`,
      subtitle: 'On the move',
      icon: 'truck',
      type: 'info'
    },
    {
      title: 'Processing',
      value: `${shipments.filter(s => s.status === 'Processing').length}`,
      subtitle: 'Being processed',
      icon: 'check',
      type: 'warning'
    },
    {
      title: 'New',
      value: `${shipments.filter(s => s.status === 'New').length}`,
      subtitle: 'Not started',
      icon: 'file',
      type: 'success'
    }
  ];

  const filteredShipments = activeFilter === 'all' 
    ? shipments 
    : shipments.filter(shipment => {
        if (activeFilter === 'inTransit') {
          return shipment.status === 'In Transit';
        } else if (activeFilter === 'delivered') {
          return shipment.status === 'Delivered';
        } else if (activeFilter === 'processing') {
          return shipment.status === 'Processing';
        } else if (activeFilter === 'new') {
          return shipment.status === 'New';
        }
        return true;
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Logistics</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search shipments..."
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
            New Shipment
          </button>
        </div>
      </div>

      <StatusBoxGrid boxes={statusBoxes} />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Create New Shipment"
      >
        <LogisticsForm
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
            All Shipments
          </button>
          <button
            onClick={() => setActiveFilter('delivered')}
            className={`px-4 py-2 ${activeFilter === 'delivered' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Delivered
          </button>
          <button
            onClick={() => setActiveFilter('inTransit')}
            className={`px-4 py-2 ${activeFilter === 'inTransit' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            In Transit
          </button>
          <button
            onClick={() => setActiveFilter('processing')}
            className={`px-4 py-2 ${activeFilter === 'processing' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Processing
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
        <div className="grid grid-cols-7 gap-4 p-4 font-medium text-mono-700 border-b">
          <div className="col-span-2">Description</div>
          <div>Origin</div>
          <div>Destination</div>
          <div>Departure</div>
          <div>Status</div>
          <div></div>
        </div>
        
        {filteredShipments.length > 0 ? (
          filteredShipments.map(shipment => (
            <React.Fragment key={shipment.id}>
              <div 
                className={`grid grid-cols-7 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === shipment.id ? 'bg-mono-50' : ''}`}
                onClick={() => toggleExpand(shipment.id)}
              >
                <div className="col-span-2 flex items-center">
                  <Truck className="w-5 h-5 text-mono-400 mr-2" />
                  <div>
                    <div className="font-medium text-mono-900">{shipment.description}</div>
                    <div className="text-sm text-mono-500">Tracking: {shipment.trackingNumber}</div>
                  </div>
                </div>
                <div className="text-mono-600">{shipment.origin}</div>
                <div className="text-mono-600">{shipment.destination}</div>
                <div className="text-mono-600">{shipment.departureDate}</div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    shipment.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    shipment.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {shipment.status}
                  </span>
                </div>
                <div className="flex justify-end">
                  {expandedId === shipment.id ? (
                    <ChevronUp className="w-5 h-5 text-mono-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-mono-400" />
                  )}
                </div>
              </div>

              {expandedId === shipment.id && (
                <div className="col-span-7 bg-mono-50 p-6 border-b">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Shipment Details</h3>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-xs font-medium text-mono-700 mb-2">Items</h4>
                              <div className="space-y-2">
                                {shipment.details.items.map((item, index) => (
                                  <div key={index} className="flex justify-between">
                                    <span className="text-sm text-mono-600">{item.name} (x{item.quantity})</span>
                                    <span className="text-sm text-mono-500">{item.weight}</span>
                                  </div>
                                ))}
                                <div className="pt-2 border-t border-mono-100">
                                  <div className="flex justify-between">
                                    <span className="text-sm font-medium text-mono-700">Total Weight:</span>
                                    <span className="text-sm text-mono-900">{shipment.details.totalWeight}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-mono-700 mb-2">Specifications</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Dimensions:</span>
                                  <span className="text-sm text-mono-900">{shipment.details.dimensions}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Packaging:</span>
                                  <span className="text-sm text-mono-900">{shipment.details.packaging}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-mono-100">
                            <h4 className="text-xs font-medium text-mono-700 mb-2">Special Instructions</h4>
                            <p className="text-sm text-mono-600">{shipment.details.specialInstructions}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Tracking History</h3>
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                          <div className="grid grid-cols-3 gap-4 p-3 font-medium text-mono-700 border-b">
                            <div>Time</div>
                            <div>Location</div>
                            <div>Status</div>
                          </div>
                          {shipment.tracking.map((event, index) => (
                            <div key={index} className="grid grid-cols-3 gap-4 p-3 border-b last:border-0">
                              <div className="text-sm text-mono-600">{event.time}</div>
                              <div className="text-sm text-mono-600">{event.location}</div>
                              <div className="text-sm text-mono-600">{event.status}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Schedule</h3>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm text-mono-500">Pickup:</span>
                                <span className="text-sm text-mono-900">{shipment.schedule.pickup}</span>
                              </div>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm text-mono-500">Delivery:</span>
                                <span className="text-sm text-mono-900">{shipment.schedule.delivery}</span>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm text-mono-500">Loading Time:</span>
                                <span className="text-sm text-mono-900">{shipment.schedule.loadingTime}</span>
                              </div>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm text-mono-500">Transit Time:</span>
                                <span className="text-sm text-mono-900">{shipment.schedule.transitTime}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Contact Information</h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs text-mono-500 mb-1">Sender</p>
                            <p className="text-sm font-medium text-mono-900">{shipment.contacts.sender.name}</p>
                            <div className="mt-1 space-y-1">
                              <a href={`tel:${shipment.contacts.sender.phone}`} className="text-sm text-accent hover:underline flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {shipment.contacts.sender.phone}
                              </a>
                              <a href={`mailto:${shipment.contacts.sender.email}`} className="text-sm text-accent hover:underline flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {shipment.contacts.sender.email}
                              </a>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-mono-500 mb-1">Receiver</p>
                            <p className="text-sm font-medium text-mono-900">{shipment.contacts.receiver.name}</p>
                            <div className="mt-1 space-y-1">
                              <a href={`tel:${shipment.contacts.receiver.phone}`} className="text-sm text-accent hover:underline flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {shipment.contacts.receiver.phone}
                              </a>
                              <a href={`mailto:${shipment.contacts.receiver.email}`} className="text-sm text-accent hover:underline flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {shipment.contacts.receiver.email}
                              </a>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-mono-500 mb-1">Carrier</p>
                            <p className="text-sm font-medium text-mono-900">{shipment.contacts.carrier.name}</p>
                            <div className="mt-1 space-y-1">
                              <a href={`tel:${shipment.contacts.carrier.phone}`} className="text-sm text-accent hover:underline flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {shipment.contacts.carrier.phone}
                              </a>
                              <a href={`mailto:${shipment.contacts.carrier.email}`} className="text-sm text-accent hover:underline flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {shipment.contacts.carrier.email}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Insurance Information</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-mono-500">Provider:</span>
                            <span className="text-sm text-mono-900">{shipment.insurance.provider}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-mono-500">Coverage:</span>
                            <span className="text-sm text-mono-900">{shipment.insurance.coverage}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-mono-500">Policy:</span>
                            <span className="text-sm text-mono-900">{shipment.insurance.policy}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-mono-500">Expires:</span>
                            <span className="text-sm text-mono-900">{shipment.insurance.expires}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Documents</h3>
                        <div className="space-y-2">
                          {shipment.documents.map((doc, index) => (
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

                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Notes</h3>
                        <p className="text-sm text-mono-600">{shipment.notes}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-mono-200 flex justify-end space-x-3">
                    <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                      Track Shipment
                    </button>
                    <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                      Update Status
                    </button>
                    <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                      View Documents
                    </button>
                    <ActionButtons />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))
        ) : (
          <div className="p-4 text-center text-mono-500">No shipments found</div>
        )}
      </div>
    </div>
  );
}