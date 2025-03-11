import React, { useState } from 'react';
import { Flag, Plus, Search, Filter, Phone, Mail, Globe, MapPin, Users, Star, ArrowUpRight } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import AgencyForm from '../../components/forms/AgencyForm';
import useModal from '../../hooks/useModal';
import { useFormSubmit } from '../../lib/hooks/useFormSubmit';

export default function Management() {
  const { isOpen, openModal, closeModal } = useModal();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filterSpecialty, setFilterSpecialty] = useState('all');

  const { handleSubmit, isSubmitting } = useFormSubmit({
    onSubmit: async (data) => {
      // Here you would typically make an API call to save the agency
      console.log('Submitting agency data:', data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      closeModal();
    },
    onSuccess: () => {
      // Handle successful submission
      console.log('Agency added successfully');
    },
    onError: (error) => {
      // Handle submission error
      console.error('Error adding agency:', error);
    }
  });

  const agencies = [
    {
      id: 1,
      name: 'Elite Talent Management',
      location: 'Los Angeles, CA',
      founded: '2005',
      website: 'www.elitetalent.com',
      phone: '(323) 555-0123',
      email: 'contact@elitetalent.com',
      rosterSize: 150,
      specialties: ['Musicians', 'DJs', 'Performers'],
      rating: 4.8,
      activeProjects: 12,
      keyContacts: [
        { name: 'Sarah Martinez', role: 'Managing Director', phone: '(323) 555-0124', email: 'sarah@elitetalent.com' },
        { name: 'John Chen', role: 'Booking Manager', phone: '(323) 555-0125', email: 'john@elitetalent.com' }
      ],
      recentBookings: [
        { event: 'Summer Music Festival 2024', artist: 'The Groove Masters', date: '2024-07-15' },
        { event: 'Corporate Summit', artist: 'DJ Eclipse', date: '2024-06-20' }
      ],
      status: 'Active Partner'
    },
    {
      id: 2,
      name: 'Spotlight Artists Agency',
      location: 'Nashville, TN',
      founded: '2010',
      website: 'www.spotlightartists.com',
      phone: '(615) 555-0123',
      email: 'info@spotlightartists.com',
      rosterSize: 85,
      specialties: ['Bands', 'Solo Artists', 'Session Musicians'],
      rating: 4.6,
      activeProjects: 8,
      keyContacts: [
        { name: 'Mike Wilson', role: 'President', phone: '(615) 555-0124', email: 'mike@spotlightartists.com' },
        { name: 'Lisa Thompson', role: 'Artist Relations', phone: '(615) 555-0125', email: 'lisa@spotlightartists.com' }
      ],
      recentBookings: [
        { event: 'Country Music Awards', artist: 'Southern Stars', date: '2024-08-10' },
        { event: 'Downtown Festival', artist: 'The Harmonics', date: '2024-07-05' }
      ],
      status: 'Active Partner'
    },
    {
      id: 3,
      name: 'Creative Force Management',
      location: 'New York, NY',
      founded: '2015',
      website: 'www.creativeforce.com',
      phone: '(212) 555-0123',
      email: 'hello@creativeforce.com',
      rosterSize: 120,
      specialties: ['Performance Artists', 'Dancers', 'Specialty Acts'],
      rating: 4.7,
      activeProjects: 15,
      keyContacts: [
        { name: 'David Brown', role: 'CEO', phone: '(212) 555-0124', email: 'david@creativeforce.com' },
        { name: 'Emma Rodriguez', role: 'Talent Director', phone: '(212) 555-0125', email: 'emma@creativeforce.com' }
      ],
      recentBookings: [
        { event: 'Broadway Show Opening', artist: 'The Performers Collective', date: '2024-09-01' },
        { event: 'Arts Festival', artist: 'Urban Dance Crew', date: '2024-08-15' }
      ],
      status: 'Under Review'
    }
  ];

  const allSpecialties = Array.from(
    new Set(agencies.flatMap(agency => agency.specialties))
  ).sort();

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredAgencies = filterSpecialty === 'all'
    ? agencies
    : agencies.filter(agency => agency.specialties.includes(filterSpecialty));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Talent Management Directory</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search agencies..."
              className="pl-10 pr-4 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
            />
            <Search className="w-5 h-5 text-mono-400 absolute left-3 top-2.5" />
          </div>
          <select
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
            className="px-4 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
          >
            <option value="all">All Specialties</option>
            {allSpecialties.map(specialty => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>
          <button 
            onClick={openModal}
            className="flex items-center px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent hover:text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Agency
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAgencies.map(agency => (
          <div key={agency.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div 
              className={`p-6 cursor-pointer hover:bg-mono-50 ${expandedId === agency.id ? 'bg-mono-50' : ''}`}
              onClick={() => toggleExpand(agency.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Flag className="w-6 h-6 text-mono-400 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-mono-900">{agency.name}</h3>
                    <div className="mt-1 flex items-center text-sm text-mono-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      {agency.location}
                      <span className="mx-2">•</span>
                      <Users className="w-4 h-4 mr-1" />
                      {agency.rosterSize} artists
                      <span className="mx-2">•</span>
                      <Star className="w-4 h-4 mr-1" />
                      {agency.rating}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {agency.specialties.map(specialty => (
                        <span 
                          key={specialty}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    agency.status === 'Active Partner' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {agency.status}
                  </span>
                  <ActionButtons />
                </div>
              </div>
            </div>

            {expandedId === agency.id && (
              <div className="border-t border-mono-200 p-6 bg-mono-50">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Recent Bookings</h3>
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="grid grid-cols-3 gap-4 p-3 font-medium text-mono-700 border-b">
                          <div>Event</div>
                          <div>Artist</div>
                          <div>Date</div>
                        </div>
                        {agency.recentBookings.map((booking, index) => (
                          <div key={index} className="grid grid-cols-3 gap-4 p-3 border-b last:border-0">
                            <div className="text-sm text-mono-600">{booking.event}</div>
                            <div className="text-sm text-mono-600">{booking.artist}</div>
                            <div className="text-sm text-mono-600">{booking.date}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Key Contacts</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {agency.keyContacts.map((contact, index) => (
                          <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                            <p className="text-sm font-medium text-mono-900">{contact.name}</p>
                            <p className="text-sm text-mono-600">{contact.role}</p>
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center">
                                <Phone className="w-3 h-3 text-mono-400 mr-1" />
                                <a href={`tel:${contact.phone}`} className="text-sm text-accent hover:underline">
                                  {contact.phone}
                                </a>
                              </div>
                              <div className="flex items-center">
                                <Mail className="w-3 h-3 text-mono-400 mr-1" />
                                <a href={`mailto:${contact.email}`} className="text-sm text-accent hover:underline">
                                  {contact.email}
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Agency Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 text-mono-400 mr-2" />
                          <a href={`https://${agency.website}`} className="text-sm text-accent hover:underline">
                            {agency.website}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-mono-400 mr-2" />
                          <a href={`tel:${agency.phone}`} className="text-sm text-accent hover:underline">
                            {agency.phone}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-mono-400 mr-2" />
                          <a href={`mailto:${agency.email}`} className="text-sm text-accent hover:underline">
                            {agency.email}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Statistics</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-mono-500">Active Projects:</span>
                          <span className="text-sm font-medium text-mono-900">{agency.activeProjects}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-mono-500">Founded:</span>
                          <span className="text-sm font-medium text-mono-900">{agency.founded}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-mono-200 flex justify-end space-x-3">
                  <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                    View Full Profile
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}