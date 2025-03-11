import React, { useState } from 'react';
import { Package, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, Building, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import AssetForm from '../../components/forms/AssetForm';
import useModal from '../../hooks/useModal';
import EmptyState from '../../components/EmptyState';
import StatusBoxGrid from '../../components/StatusBoxGrid';

export default function Assets() {
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
      console.error('Error adding asset:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const assets = [
    {
      id: 1,
      name: 'Stage System A',
      category: 'Staging Equipment',
      status: 'In Use',
      location: 'Tech Conference 2024',
      condition: 'Excellent',
      value: 45000,
      serialNumber: 'SSA-2024-001',
      manufacturer: 'Stage Systems Inc.',
      model: 'Pro Stage 3000',
      purchaseDate: '2024-01-15',
      warrantyExpiry: '2027-01-15',
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
        { project: 'Summer Music Festival', dates: '2024-06-15 to 2024-06-18', location: 'Main Stage' },
        { project: 'Corporate Event', dates: '2024-04-10 to 2024-04-11', location: 'Conference Hall' }
      ],
      documents: [
        { name: 'manual.pdf', size: '2.4 MB', date: '2024-01-15' },
        { name: 'safety_cert.pdf', size: '1.2 MB', date: '2024-01-15' },
        { name: 'maintenance_log.xlsx', size: '0.8 MB', date: '2024-02-15' }
      ],
      notes: 'Premium stage system with integrated safety features. Regular maintenance required.',
      lastUpdated: '2024-03-15 14:30'
    }
  ];

  // Status box data
  const statusBoxes = [
    {
      title: 'Total Assets',
      value: assets.length.toString(),
      subtitle: 'All assets',
      icon: 'package'
    },
    {
      title: 'In Use',
      value: assets.filter(a => a.status === 'In Use').length.toString(),
      subtitle: 'Currently deployed',
      icon: 'users',
      type: 'info'
    },
    {
      title: 'Available',
      value: assets.filter(a => a.status === 'Available').length.toString(),
      subtitle: 'Ready for use',
      icon: 'check',
      type: 'success'
    },
    {
      title: 'Total Value',
      value: `$${assets.reduce((sum, a) => sum + a.value, 0).toLocaleString()}`,
      subtitle: 'Asset valuation',
      icon: 'dollar',
      type: 'info'
    }
  ];

  const filteredAssets = activeFilter === 'all' 
    ? assets 
    : assets.filter(asset => {
        if (activeFilter === 'available') {
          return asset.status === 'Available';
        } else if (activeFilter === 'inUse') {
          return asset.status === 'In Use';
        } else if (activeFilter === 'maintenance') {
          return asset.status === 'Maintenance';
        }
        return true;
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Assets</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search assets..."
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
            Add Asset
          </button>
        </div>
      </div>

      <StatusBoxGrid boxes={statusBoxes} />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Add New Asset"
      >
        <AssetForm
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
            All Assets
          </button>
          <button
            onClick={() => setActiveFilter('available')}
            className={`px-4 py-2 ${activeFilter === 'available' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Available
          </button>
          <button
            onClick={() => setActiveFilter('inUse')}
            className={`px-4 py-2 ${activeFilter === 'inUse' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            In Use
          </button>
          <button
            onClick={() => setActiveFilter('maintenance')}
            className={`px-4 py-2 ${activeFilter === 'maintenance' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Maintenance
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-6 gap-4 p-4 font-medium text-mono-700 border-b">
          <div className="col-span-2">Asset</div>
          <div>Category</div>
          <div>Location</div>
          <div>Status</div>
          <div></div>
        </div>
        
        {filteredAssets.length > 0 ? (
          filteredAssets.map(asset => (
            <React.Fragment key={asset.id}>
              <div 
                className={`grid grid-cols-6 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === asset.id ? 'bg-mono-50' : ''}`}
                onClick={() => toggleExpand(asset.id)}
              >
                <div className="col-span-2 flex items-center">
                  <Package className="w-5 h-5 text-mono-400 mr-2" />
                  <div>
                    <div className="font-medium text-mono-900">{asset.name}</div>
                    <div className="text-sm text-mono-500">Condition: {asset.condition}</div>
                  </div>
                </div>
                <div className="text-mono-600">{asset.category}</div>
                <div className="text-mono-600">{asset.location}</div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    asset.status === 'Available' ? 'bg-green-100 text-green-800' :
                    asset.status === 'In Use' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {asset.status}
                  </span>
                </div>
                <div className="flex justify-end">
                  {expandedId === asset.id ? (
                    <ChevronUp className="w-5 h-5 text-mono-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-mono-400" />
                  )}
                </div>
              </div>

              {expandedId === asset.id && (
                <div className="col-span-6 bg-mono-50 p-6 border-b">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Asset Details</h3>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-xs font-medium text-mono-700 mb-2">Basic Information</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Serial Number:</span>
                                  <span className="text-sm text-mono-900">{asset.serialNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Manufacturer:</span>
                                  <span className="text-sm text-mono-900">{asset.manufacturer}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Model:</span>
                                  <span className="text-sm text-mono-900">{asset.model}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Purchase Date:</span>
                                  <span className="text-sm text-mono-900">{asset.purchaseDate}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Warranty Until:</span>
                                  <span className="text-sm text-mono-900">{asset.warrantyExpiry}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-mono-700 mb-2">Specifications</h4>
                              <div className="space-y-2">
                                {Object.entries(asset.specifications).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="text-sm text-mono-500 capitalize">{key}:</span>
                                    <span className="text-sm text-mono-900">{value}</span>
                                  </div>
                                ))}
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
                            <div>Location</div>
                          </div>
                          {asset.assignments.map((assignment, index) => (
                            <div key={index} className="grid grid-cols-3 gap-4 p-3 border-b last:border-0">
                              <div className="text-sm text-mono-600">{assignment.project}</div>
                              <div className="text-sm text-mono-600">{assignment.dates}</div>
                              <div className="text-sm text-mono-600">{assignment.location}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Notes</h3>
                        <p className="text-sm text-mono-600 bg-white p-3 rounded-lg shadow-sm">{asset.notes}</p>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Maintenance Information</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-mono-500">Last Service:</span>
                            <span className="text-sm text-mono-900">{asset.maintenance.lastService}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-mono-500">Next Service:</span>
                            <span className="text-sm text-mono-900">{asset.maintenance.nextService}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-mono-500">Interval:</span>
                            <span className="text-sm text-mono-900">{asset.maintenance.serviceInterval}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-mono-500">Provider:</span>
                            <span className="text-sm text-mono-900">{asset.maintenance.serviceProvider}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Certifications</h3>
                        <div className="space-y-2">
                          {asset.certifications.map((cert, index) => (
                            <div key={index} className="bg-mono-50 p-2 rounded">
                              <p className="text-sm font-medium text-mono-900">{cert.name}</p>
                              <p className="text-xs text-mono-500">
                                {cert.issuer} · Expires: {cert.expiry}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Documents</h3>
                        <div className="space-y-2">
                          {asset.documents.map((doc, index) => (
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
            icon={Package}
            title="No assets found"
            message={
              activeFilter === 'all' 
                ? "No assets have been added yet."
                : "No assets found matching the selected filter."
            }
            action={{
              label: "Add Asset",
              onClick: openModal
            }}
          />
        )}
      </div>
    </div>
  );
}