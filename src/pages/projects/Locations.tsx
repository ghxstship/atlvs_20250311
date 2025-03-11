import React, { useState } from 'react';
import { Map, Plus, ChevronDown, ChevronUp, MapPin, Users, Calendar, Clock, FileText, Phone, Mail, Link2, Building, Info } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import LocationForm from '../../components/forms/LocationForm';
import useModal from '../../hooks/useModal';

export default function Locations() {
  const { isOpen, openModal, closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Handle form submission
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      closeModal();
    } catch (error) {
      console.error('Error creating location:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const locations = [
    {
      id: 1,
      name: 'Main Stage Area',
      project: 'Summer Music Festival',
      address: '123 Festival Grounds, Los Angeles, CA',
      capacity: '5000',
      status: 'Confirmed',
      description: 'Primary performance area for headlining acts with full production capabilities.',
      facilities: ['Stage', 'Sound System', 'Lighting Rig', 'Video Screens', 'Backstage Area', 'Power Distribution'],
      dimensions: '60ft x 40ft',
      contactName: 'John Martinez',
      contactPhone: '(323) 555-0123',
      contactEmail: 'john.martinez@festivalgrounds.com',
      accessNotes: 'Loading dock available on west side. Security clearance required for all personnel.',
      safetyNotes: 'Maximum stage capacity: 50 people. Emergency exits located stage left and right.',
      availableDates: [
        { start: '2024-06-15', end: '2024-06-18' }
      ],
      documents: [
        { name: 'stage_plot.pdf', size: '2.4 MB', date: '2024-03-08' },
        { name: 'site_map.pdf', size: '3.6 MB', date: '2024-03-10' }
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3', caption: 'Main stage front view' },
        { url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a', caption: 'Audience area' }
      ],
      lastUpdated: '2024-03-10 14:30',
      createdBy: 'Alex Thompson'
    },
    {
      id: 2,
      name: 'Conference Hall B',
      project: 'Corporate Event',
      address: '456 Convention Center, San Francisco, CA',
      capacity: '300',
      status: 'Pending',
      description: 'Medium-sized conference hall suitable for presentations and panel discussions.',
      facilities: ['Stage', 'Projector', 'Sound System', 'Seating', 'Wi-Fi', 'Climate Control'],
      dimensions: '40ft x 30ft',
      contactName: 'Sarah Williams',
      contactPhone: '(415) 555-0456',
      contactEmail: 'sarah.williams@conventioncenter.com',
      accessNotes: 'Elevator access from parking level P2. Loading through service corridor.',
      safetyNotes: 'Maximum occupancy: 300 people. Fire exits at rear and side of hall.',
      availableDates: [
        { start: '2024-04-10', end: '2024-04-11' }
      ],
      documents: [
        { name: 'floor_plan.pdf', size: '1.8 MB', date: '2024-03-05' },
        { name: 'av_specs.pdf', size: '1.2 MB', date: '2024-03-06' }
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678', caption: 'Conference hall setup' },
        { url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205', caption: 'Presentation area' }
      ],
      lastUpdated: '2024-03-12 09:15',
      createdBy: 'Maria Garcia'
    },
    {
      id: 3,
      name: 'Theater Complex',
      project: 'Theater Production',
      address: '789 Arts District, New York, NY',
      capacity: '800',
      status: 'Confirmed',
      description: 'Professional theater venue with full production capabilities for dramatic performances.',
      facilities: ['Stage', 'Orchestra Pit', 'Lighting Grid', 'Sound System', 'Dressing Rooms', 'Green Room', 'Box Office'],
      dimensions: '50ft x 35ft (stage)',
      contactName: 'Michael Chen',
      contactPhone: '(212) 555-0789',
      contactEmail: 'michael.chen@theatercomplex.com',
      accessNotes: 'Loading dock on 8th Avenue. Stage door access requires security pass.',
      safetyNotes: 'Maximum stage capacity: 30 people. Fire curtain and sprinkler system installed.',
      availableDates: [
        { start: '2024-05-20', end: '2024-06-05' }
      ],
      documents: [
        { name: 'theater_specs.pdf', size: '3.2 MB', date: '2024-03-14' },
        { name: 'seating_chart.pdf', size: '1.5 MB', date: '2024-03-14' }
      ],
      images: [
        { url: 'https://images.unsplash.com/photo-1503095396549-807759245b35', caption: 'Theater auditorium' },
        { url: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212', caption: 'Stage view' }
      ],
      lastUpdated: '2024-03-14 16:45',
      createdBy: 'James Wilson'
    }
  ];

  const filteredLocations = activeFilter === 'all' 
    ? locations 
    : locations.filter(location => {
        if (activeFilter === 'confirmed') {
          return location.status === 'Confirmed';
        } else if (activeFilter === 'pending') {
          return location.status === 'Pending';
        }
        return true;
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Project Locations</h1>
        <button 
          onClick={openModal}
          className="flex items-center px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent hover:text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Location
        </button>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Add New Location"
      >
        <LocationForm
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-6 gap-4 p-4 font-medium text-mono-700 border-b">
          <div className="col-span-2">Location</div>
          <div>Project</div>
          <div>Capacity</div>
          <div>Status</div>
          <div></div>
        </div>
        
        {filteredLocations.length > 0 ? (
          filteredLocations.map(location => (
            <React.Fragment key={location.id}>
              <div 
                className={`grid grid-cols-6 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === location.id ? 'bg-mono-50' : ''}`}
                onClick={() => toggleExpand(location.id)}
              >
                <div className="col-span-2 flex items-center">
                  <Map className="w-5 h-5 text-mono-400 mr-2" />
                  <div>
                    <div className="font-medium text-mono-900">{location.name}</div>
                    <div className="text-sm text-mono-500">{location.address}</div>
                  </div>
                </div>
                <div className="text-mono-600">{location.project}</div>
                <div className="text-mono-600">{location.capacity}</div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    location.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {location.status}
                  </span>
                </div>
                <div className="flex justify-end">
                  {expandedId === location.id ? (
                    <ChevronUp className="w-5 h-5 text-mono-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-mono-400" />
                  )}
                </div>
              </div>

              {expandedId === location.id && (
                <div className="col-span-6 bg-mono-50 p-6 border-b">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Location Description</h3>
                        <p className="text-sm text-mono-600">{location.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Facilities</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {location.facilities.map((facility, index) => (
                              <li key={index} className="text-sm text-mono-600">{facility}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Important Notes</h3>
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-xs font-medium text-mono-700">Access</h4>
                              <p className="text-sm text-mono-600">{location.accessNotes}</p>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-mono-700">Safety</h4>
                              <p className="text-sm text-mono-600">{location.safetyNotes}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Images</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {location.images.map((image, index) => (
                            <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                              <img 
                                src={image.url} 
                                alt={image.caption} 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                                {image.caption}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Availability</h3>
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                          <div className="grid grid-cols-2 gap-4 p-3 font-medium text-mono-700 border-b">
                            <div>Start Date</div>
                            <div>End Date</div>
                          </div>
                          {location.availableDates.map((date, index) => (
                            <div key={index} className="grid grid-cols-2 gap-4 p-3 border-b last:border-0">
                              <div className="text-sm text-mono-600">{date.start}</div>
                              <div className="text-sm text-mono-600">{date.end}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Location Details</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Address:</span>
                            <span className="text-sm text-mono-900">{location.address}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Capacity:</span>
                            <span className="text-sm text-mono-900">{location.capacity} people</span>
                          </div>
                          <div className="flex items-center">
                            <Info className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Dimensions:</span>
                            <span className="text-sm text-mono-900">{location.dimensions}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Created by:</span>
                            <span className="text-sm text-mono-900">{location.createdBy}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Last updated:</span>
                            <span className="text-sm text-mono-900">{location.lastUpdated}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Contact Information</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Name:</span>
                            <span className="text-sm text-mono-900">{location.contactName}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Phone:</span>
                            <a href={`tel:${location.contactPhone}`} className="text-sm text-accent hover:underline">
                              {location.contactPhone}
                            </a>
                          </div>
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Email:</span>
                            <a href={`mailto:${location.contactEmail}`} className="text-sm text-accent hover:underline">
                              {location.contactEmail}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Documents</h3>
                        <div className="space-y-2">
                          {location.documents.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 text-mono-400 mr-2" />
                                <span className="text-sm text-accent hover:underline cursor-pointer">{doc.name}</span>
                              </div>
                              <span className="text-xs text-mono-500">{doc.size}</span>
                            </div>
                          ))}
                          <div className="mt-3">
                            <button className="flex items-center text-sm text-mono-600 hover:text-accent">
                              <Plus className="w-4 h-4 mr-1" />
                              Add document
                            </button>
                          </div>
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
            icon={Map}
            title="No locations found"
            message={
              activeFilter === 'all' 
                ? "No locations have been added yet."
                : "No locations found matching the selected filter."
            }
            action={{
              label: "Add Location",
              onClick: openModal
            }}
          />
        )}
      </div>
    </div>
  );
}