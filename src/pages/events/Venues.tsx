import React, { useState } from 'react';
import { Theater, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, Phone, Mail, Building, Star } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import VenueForm from '../../components/forms/VenueForm';
import useModal from '../../hooks/useModal';
import Avatar from '../../components/Avatar';

export default function Venues() {
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
      console.error('Error adding venue:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const venues = [
    {
      id: 1,
      name: 'Grand Theater',
      type: 'Theater',
      location: 'Downtown Arts District',
      capacity: 1200,
      status: 'Available',
      photo: 'https://images.unsplash.com/photo-1503095396549-807759245b35',
      contact: {
        name: 'Sarah Wilson',
        title: 'Venue Manager',
        email: 'sarah.wilson@grandtheater.com',
        phone: '(555) 123-4567'
      },
      facilities: [
        'Main Stage',
        'Orchestra Pit',
        'Dressing Rooms',
        'Green Room',
        'Box Office'
      ],
      documents: [
        { name: 'floor_plan.pdf', size: '2.4 MB', date: '2024-03-01' },
        { name: 'tech_specs.pdf', size: '1.8 MB', date: '2024-03-05' }
      ],
      notes: 'Historic theater venue with state-of-the-art technical capabilities.'
    }
  ];

  const filteredVenues = venues.filter(venue => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'available') return venue.status === 'Available';
    if (activeFilter === 'booked') return venue.status === 'Booked';
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Venues</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search venues..."
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
            Add Venue
          </button>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Add New Venue"
      >
        <VenueForm
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <div className="space-y-4">
        {filteredVenues.map(venue => (
          <div key={venue.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div 
              className={`p-6 cursor-pointer hover:bg-mono-50 ${expandedId === venue.id ? 'bg-mono-50' : ''}`}
              onClick={() => toggleExpand(venue.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar 
                    src={venue.photo}
                    alt={`${venue.name}`}
                    size="lg"
                    className="avatar-hover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-mono-900">{venue.name}</h3>
                    <div className="mt-1 flex items-center text-sm text-mono-500">
                      <Building className="w-4 h-4 mr-1" />
                      {venue.type}
                      <span className="mx-2">•</span>
                      <MapPin className="w-4 h-4 mr-1" />
                      {venue.location}
                    </div>
                    <div className="mt-2">
                      <span className="text-sm text-mono-600">Capacity: {venue.capacity}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    venue.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {venue.status}
                  </span>
                  {expandedId === venue.id ? (
                    <ChevronUp className="w-5 h-5 text-mono-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-mono-400" />
                  )}
                </div>
              </div>
            </div>

            {expandedId === venue.id && (
              <div className="border-t border-mono-200 p-6 bg-mono-50">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Facilities</h3>
                      <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="grid grid-cols-2 gap-2">
                          {venue.facilities.map((facility, index) => (
                            <div key={index} className="flex items-center">
                              <Star className="w-4 h-4 text-mono-400 mr-2" />
                              <span className="text-sm text-mono-600">{facility}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Notes</h3>
                      <p className="text-sm text-mono-600 bg-white p-3 rounded-lg shadow-sm">{venue.notes}</p>
                    </div>
                  </div>

                  <div>
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-mono-400 mr-2" />
                          <span className="text-sm text-mono-900">{venue.contact.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Building className="w-4 h-4 text-mono-400 mr-2" />
                          <span className="text-sm text-mono-900">{venue.contact.title}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-mono-400 mr-2" />
                          <a href={`mailto:${venue.contact.email}`} className="text-sm text-accent hover:underline">
                            {venue.contact.email}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-mono-400 mr-2" />
                          <a href={`tel:${venue.contact.phone}`} className="text-sm text-accent hover:underline">
                            {venue.contact.phone}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Documents</h3>
                      <div className="space-y-2">
                        {venue.documents.map((doc, index) => (
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
          </div>
        ))}
      </div>
    </div>
  );
}