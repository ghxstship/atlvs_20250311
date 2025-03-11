import React, { useState } from 'react';
import { Book, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, Building, Star, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import CatalogForm from '../../components/forms/CatalogForm';
import useModal from '../../hooks/useModal';
import EmptyState from '../../components/EmptyState';
import StatusBoxGrid from '../../components/StatusBoxGrid';

export default function Catalog() {
  const { isOpen, openModal, closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      closeModal();
    } catch (error) {
      console.error('Error adding catalog item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Catalog items data
  const catalogItems = [
    {
      id: 1,
      name: 'Line Array Speaker System',
      manufacturer: 'Pro Audio Systems',
      model: 'LA2000',
      category: 'Technical',
      dailyRate: 1200,
      status: 'Available',
      description: 'Professional line array speaker system for large venues',
      specifications: {
        power: '2000W RMS',
        frequency: '20Hz - 20kHz',
        coverage: '120° horizontal',
        components: '2x 12" LF, 1x 3" HF'
      }
    },
    {
      id: 2,
      name: 'Stage Platform System',
      manufacturer: 'StageRight',
      model: 'SP4000',
      category: 'Site',
      dailyRate: 800,
      status: 'In Use',
      description: 'Modular stage platform system with adjustable height',
      specifications: {
        dimensions: '4ft x 4ft',
        height: '1-4ft adjustable',
        capacity: '150 lbs/sqft',
        material: 'Aluminum frame'
      }
    },
    {
      id: 3,
      name: 'Interactive LED Wall',
      manufacturer: 'PixelPro',
      model: 'IPW2000',
      category: 'Experiential',
      dailyRate: 1500,
      status: 'Available',
      description: 'Interactive LED wall with touch capabilities',
      specifications: {
        resolution: '4K',
        size: '12ft x 8ft',
        brightness: '1500 nits',
        interactivity: 'Multi-touch'
      }
    },
    {
      id: 4,
      name: 'Event Safety Kit',
      manufacturer: 'SafetyFirst',
      model: 'ESK100',
      category: 'Supplies',
      dailyRate: 150,
      status: 'Available',
      description: 'Comprehensive event safety and first aid kit',
      specifications: {
        contents: '100+ items',
        coverage: 'Up to 1000 people',
        certification: 'OSHA compliant',
        type: 'Type A kit'
      }
    }
  ];

  // Status box data
  const statusBoxes = [
    {
      title: 'Total Items',
      value: catalogItems.length.toString(),
      subtitle: 'In catalog',
      icon: 'package'
    },
    {
      title: 'Available',
      value: catalogItems.filter(i => i.status === 'Available').length.toString(),
      subtitle: 'Ready to use',
      icon: 'check',
      type: 'success'
    },
    {
      title: 'In Use',
      value: catalogItems.filter(i => i.status === 'In Use').length.toString(),
      subtitle: 'Currently deployed',
      icon: 'clock',
      type: 'info'
    },
    {
      title: 'Maintenance',
      value: catalogItems.filter(i => i.status === 'Maintenance').length.toString(),
      subtitle: 'Under service',
      icon: 'alert',
      type: 'warning'
    }
  ];

  const filteredItems = activeFilter === 'all' 
    ? catalogItems 
    : catalogItems.filter(item => {
        switch (activeFilter) {
          case 'site':
            return item.category === 'Site';
          case 'technical':
            return item.category === 'Technical';
          case 'experiential':
            return item.category === 'Experiential';
          case 'supplies':
            return item.category === 'Supplies';
          default:
            return true;
        }
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Equipment Catalog</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search catalog..."
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
        title="Add Catalog Item"
      >
        <CatalogForm
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
            onClick={() => setActiveFilter('site')}
            className={`px-4 py-2 ${activeFilter === 'site' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Site
          </button>
          <button
            onClick={() => setActiveFilter('technical')}
            className={`px-4 py-2 ${activeFilter === 'technical' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Technical
          </button>
          <button
            onClick={() => setActiveFilter('experiential')}
            className={`px-4 py-2 ${activeFilter === 'experiential' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Experiential
          </button>
          <button
            onClick={() => setActiveFilter('supplies')}
            className={`px-4 py-2 ${activeFilter === 'supplies' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Supplies
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-6 gap-4 p-4 font-medium text-mono-700 border-b">
          <div className="col-span-2">Equipment</div>
          <div>Category</div>
          <div className="text-right">Daily Rate</div>
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
                  <Book className="w-5 h-5 text-mono-400 mr-2" />
                  <div>
                    <div className="font-medium text-mono-900">{item.name}</div>
                    <div className="text-sm text-mono-500">{item.manufacturer} - {item.model}</div>
                  </div>
                </div>
                <div className="text-mono-600">{item.category}</div>
                <div className="text-right text-mono-600">${item.dailyRate.toLocaleString()}</div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
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
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Description</h3>
                      <p className="text-sm text-mono-600 mb-6">{item.description}</p>

                      <h3 className="text-sm font-medium text-mono-900 mb-3">Specifications</h3>
                      <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="space-y-2">
                          {Object.entries(item.specifications).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-sm text-mono-500 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <span className="text-sm text-mono-900">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Rental Information</h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Daily Rate:</span>
                            <span className="text-sm text-mono-900">${item.dailyRate.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Tag className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Category:</span>
                            <span className="text-sm text-mono-900">{item.category}</span>
                          </div>
                          <div className="flex items-center">
                            <Building className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Manufacturer:</span>
                            <span className="text-sm text-mono-900">{item.manufacturer}</span>
                          </div>
                          <div className="flex items-center">
                            <Tag className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Model:</span>
                            <span className="text-sm text-mono-900">{item.model}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-mono-200 flex justify-end space-x-3">
                    <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                      Check Availability
                    </button>
                    <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                      Request Quote
                    </button>
                    <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                      Download Specs
                    </button>
                    <ActionButtons />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))
        ) : (
          <EmptyState
            icon={Book}
            title="No catalog items found"
            message={
              activeFilter === 'all' 
                ? "No items have been added to the catalog yet."
                : "No items found matching the selected filter."
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