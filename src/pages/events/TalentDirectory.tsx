import React, { useState } from 'react';
import { Drama, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, Phone, Mail, Building, Star } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import TalentForm from '../../components/forms/TalentForm';
import useModal from '../../hooks/useModal';
import Avatar from '../../components/Avatar';

export default function TalentDirectory() {
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
      console.error('Error adding talent:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const talent = [
    {
      id: 1,
      name: 'John Smith',
      role: 'Keynote Speaker',
      company: 'Premier Talent Agency',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      status: 'Available',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      expertise: ['Technology Innovation', 'Digital Transformation', 'Leadership'],
      experience: '15 years',
      projects: [
        { name: 'Tech Conference 2024', role: 'Keynote Speaker', dates: '2024-09-15' }
      ],
      documents: [
        { name: 'bio.pdf', size: '1.2 MB', date: '2024-03-01' },
        { name: 'rider.pdf', size: '0.8 MB', date: '2024-03-01' }
      ],
      notes: 'Industry expert with extensive speaking experience.'
    }
  ];

  const filteredTalent = talent.filter(person => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'available') return person.status === 'Available';
    if (activeFilter === 'booked') return person.status === 'Booked';
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Talent Directory</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search talent..."
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
            Add Talent
          </button>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Add New Talent"
      >
        <TalentForm
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <div className="space-y-4">
        {filteredTalent.map(person => (
          <div key={person.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div 
              className={`p-6 cursor-pointer hover:bg-mono-50 ${expandedId === person.id ? 'bg-mono-50' : ''}`}
              onClick={() => toggleExpand(person.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar 
                    src={person.photo}
                    alt={`${person.name}'s photo`}
                    size="lg"
                    className="avatar-hover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-mono-900">{person.name}</h3>
                    <div className="mt-1 flex items-center text-sm text-mono-500">
                      <Building className="w-4 h-4 mr-1" />
                      {person.company}
                      <span className="mx-2">•</span>
                      <Users className="w-4 h-4 mr-1" />
                      {person.role}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {person.expertise.map((skill, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    person.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {person.status}
                  </span>
                  {expandedId === person.id ? (
                    <ChevronUp className="w-5 h-5 text-mono-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-mono-400" />
                  )}
                </div>
              </div>
            </div>

            {expandedId === person.id && (
              <div className="border-t border-mono-200 p-6 bg-mono-50">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Projects</h3>
                      {person.projects.length > 0 ? (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                          <div className="grid grid-cols-3 gap-4 p-3 font-medium text-mono-700 border-b">
                            <div>Project</div>
                            <div>Role</div>
                            <div>Date</div>
                          </div>
                          {person.projects.map((project, index) => (
                            <div key={index} className="grid grid-cols-3 gap-4 p-3 border-b last:border-0">
                              <div className="text-sm text-mono-600">{project.name}</div>
                              <div className="text-sm text-mono-600">{project.role}</div>
                              <div className="text-sm text-mono-600">{project.dates}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-mono-500 bg-white p-4 rounded-lg shadow-sm">
                          No active projects
                        </p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Notes</h3>
                      <p className="text-sm text-mono-600 bg-white p-3 rounded-lg shadow-sm">{person.notes}</p>
                    </div>
                  </div>

                  <div>
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-mono-400 mr-2" />
                          <a href={`mailto:${person.email}`} className="text-sm text-accent hover:underline">
                            {person.email}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-mono-400 mr-2" />
                          <a href={`tel:${person.phone}`} className="text-sm text-accent hover:underline">
                            {person.phone}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Documents</h3>
                      <div className="space-y-2">
                        {person.documents.map((doc, index) => (
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