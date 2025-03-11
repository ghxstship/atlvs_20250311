import React, { useState } from 'react';
import { Package, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, Building, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import InventoryForm from '../../components/forms/InventoryForm';
import useModal from '../../hooks/useModal';
import EmptyState from '../../components/EmptyState';
import StatusBoxGrid from '../../components/StatusBoxGrid';

export default function Inventory() {
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
      console.error('Error adding inventory item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const inventoryItems = [
    {
      id: 1,
      name: 'Stage System A',
      category: 'Staging Equipment',
      status: 'In Stock',
      location: 'Warehouse A',
      condition: 'Excellent',
      value: 45000,
      quantity: {
        total: 5,
        available: 3,
        inUse: 2,
        minimum: 1
      },
      specifications: {
        dimensions: '40ft x 30ft',
        weight: '2000 lbs',
        capacity: '750 kg/sqm',
        power: '200A 3-phase'
      },
      maintenance: {
        lastService: '2024-02-15',
        nextService: '2024-05-15',
        serviceInterval: '90 days',
        serviceProvider: 'Stage Systems Inc.'
      },
      certifications: [
        { name: 'Safety Certification', issuer: 'Event Safety Alliance', expiry: '2024-12-31' },
        { name: 'Load Rating', issuer: 'Technical Standards Board', expiry: '2025-06-30' }
      ],
      assignments: [
        { project: 'Summer Music Festival', dates: '2024-06-15 to 2024-06-18', quantity: 1 },
        { project: 'Corporate Event', dates: '2024-04-10 to 2024-04-11', quantity: 1 }
      ],
      documents: [
        { name: 'manual.pdf', size: '2.4 MB', date: '2024-01-15' },
        { name: 'safety_cert.pdf', size: '1.2 MB', date: '2024-01-15' },
        { name: 'maintenance_log.xlsx', size: '0.8 MB', date: '2024-02-15' }
      ],
      notes: 'Premium stage system with integrated safety features. Regular maintenance required.',
      history: [
        { date: '2024-02-15', type: 'Maintenance', details: 'Regular service completed' },
        { date: '2024-01-15', type: 'Inspection', details: 'Annual safety inspection passed' }
      ],
      lastUpdated: '2024-03-15 14:30'
    }
  ];

  const statusBoxes = [
    {
      title: 'Total Items',
      value: inventoryItems.length.toString(),
      subtitle: 'All inventory items',
      icon: 'package'
    },
    {
      title: 'In Stock',
      value: inventoryItems.filter(i => i.status === 'In Stock').length.toString(),
      subtitle: 'Available items',
      icon: 'check',
      type: 'success'
    },
    {
      title: 'Low Stock',
      value: inventoryItems.filter(i => i.quantity.available <= i.quantity.minimum).length.toString(),
      subtitle: 'Need reordering',
      icon: 'alert',
      type: 'warning'
    },
    {
      title: 'Total Value',
      value: `$${inventoryItems.reduce((sum, i) => sum + i.value, 0).toLocaleString()}`,
      subtitle: 'Inventory valuation',
      icon: 'dollar',
      type: 'info'
    }
  ];

  const filteredItems = activeFilter === 'all' 
    ? inventoryItems 
    : inventoryItems.filter(item => {
        if (activeFilter === 'inStock') {
          return item.status === 'In Stock';
        } else if (activeFilter === 'inUse') {
          return item.status === 'In Use';
        } else if (activeFilter === 'outOfService') {
          return asset.status === 'Out of Service';
        }
        return true;
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Inventory</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search inventory..."
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
            Add Item
          </button>
        </div>
      </div>

      <StatusBoxGrid boxes={statusBoxes} />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Add Inventory Item"
      >
        <InventoryForm
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
            onClick={() => setActiveFilter('inStock')}
            className={`px-4 py-2 ${activeFilter === 'inStock' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            In Stock
          </button>
          <button
            onClick={() => setActiveFilter('inUse')}
            className={`px-4 py-2 ${activeFilter === 'inUse' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            In Use
          </button>
          <button 
            onClick={() => setActiveFilter('outOfService')}
            className={`px-4 py-2 ${activeFilter === 'outOfService' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Out of Service
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-6 gap-4 p-4 font-medium text-mono-700 border-b">
          <div className="col-span-2">Item</div>
          <div>Category</div>
          <div>Location</div>
          <div>Status</div>
          <div></div>
        </div>
        
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <React.Fragment key={item.id}>
              <div 
                className={`grid grid-cols-6 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === item.id ? 'bg-mono-50' : ''}`}
                onClick={() => toggleExpand(item.id)}
              >
                <div className="col-span-2 flex items-center">
                  <Package className="w-5 h-5 text-mono-400 mr-2" />
                  <div>
                    <div className="font-medium text-mono-900">{item.name}</div>
                    <div className="text-sm text-mono-500">Quantity: {item.quantity.available}/{item.quantity.total}</div>
                  </div>
                </div>
                <div className="text-mono-600">{item.category}</div>
                <div className="text-mono-600">{item.location}</div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === 'In Stock' ? 'bg-green-100 text-green-800' :
                    item.status === 'In Use' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
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
                <div className="col-span-6 bg-mono-50 p-6 border-b">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Item Details</h3>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-xs font-medium text-mono-700 mb-2">Specifications</h4>
                              <div className="space-y-2">
                                {Object.entries(item.specifications).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="text-sm text-mono-500 capitalize">{key}:</span>
                                    <span className="text-sm text-mono-900">{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-mono-700 mb-2">Quantity Details</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Total:</span>
                                  <span className="text-sm text-mono-900">{item.quantity.total}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Available:</span>
                                  <span className="text-sm text-mono-900">{item.quantity.available}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">In Use:</span>
                                  <span className="text-sm text-mono-900">{item.quantity.inUse}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Minimum Stock:</span>
                                  <span className="text-sm text-mono-900">{item.quantity.minimum}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Current Assignments</h3>
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                          <div className="grid grid-cols-3 gap-4 p-3 font-medium text-mono-700 border-b">
                            <div>Project</div>
                            <div>Dates</div>
                            <div>Quantity</div>
                          </div>
                          {item.assignments.map((assignment, index) => (
                            <div key={index} className="grid grid-cols-3 gap-4 p-3 border-b last:border-0">
                              <div className="text-sm text-mono-600">{assignment.project}</div>
                              <div className="text-sm text-mono-600">{assignment.dates}</div>
                              <div className="text-sm text-mono-600">{assignment.quantity}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-mono-900 mb-3">History</h3>
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                          <div className="grid grid-cols-3 gap-4 p-3 font-medium text-mono-700 border-b">
                            <div>Date</div>
                            <div>Type</div>
                            <div>Details</div>
                          </div>
                          {item.history.map((record, index) => (
                            <div key={index} className="grid grid-cols-3 gap-4 p-3 border-b last:border-0">
                              <div className="text-sm text-mono-600">{record.date}</div>
                              <div className="text-sm text-mono-600">{record.type}</div>
                              <div className="text-sm text-mono-600">{record.details}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Maintenance Information</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-mono-500">Last Service:</span>
                            <span className="text-sm text-mono-900">{item.maintenance.lastService}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-mono-500">Next Service:</span>
                            <span className="text-sm text-mono-900">{item.maintenance.nextService}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-mono-500">Interval:</span>
                            <span className="text-sm text-mono-900">{item.maintenance.serviceInterval}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-mono-500">Provider:</span>
                            <span className="text-sm text-mono-900">{item.maintenance.serviceProvider}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Certifications</h3>
                        <div className="space-y-2">
                          {item.certifications.map((cert, index) => (
                            <div key={index} className="bg-mono-50 p-2 rounded">
                              <p className="text-sm font-medium text-mono-900">{cert.name}</p>
                              <p className="text-xs text-mono-500">
                                {cert.issuer} · Expires: {cert.expiry}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
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

                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Notes</h3>
                        <p className="text-sm text-mono-600">{item.notes}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-mono-200 flex justify-end space-x-3">
                    <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                      Update Stock
                    </button>
                    <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                      Schedule Service
                    </button>
                    <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                      View History
                    </button>
                    <ActionButtons />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))
        ) : (
          <EmptyState
            icon={Package}
            title="No inventory items found"
            message={
              activeFilter === 'all' 
                ? "No inventory items have been added yet."
                : "No inventory items found matching the selected filter."
            }
            action={{
              label: "Add Item",
              onClick: openModal
            }}
          />
        )}
      </div>
    </div>
  );
}