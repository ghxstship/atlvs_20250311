import React, { useState } from 'react';
import { Users, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Phone, Mail, Building, Star } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import CrewForm from '../../components/forms/CrewForm';
import useModal from '../../hooks/useModal';
import Avatar from '../../components/Avatar';
import StatusBoxGrid from '../../components/StatusBoxGrid';

export default function CrewDirectory() {
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
      console.error('Error adding crew member:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const crew = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Stage Manager',
      department: 'Production',
      email: 'sarah.chen@example.com',
      phone: '(555) 123-4567',
      status: 'Active',
      availability: 'Available',
      location: 'Main Stage',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      certifications: [
        { name: 'Stage Safety', expiry: '2024-12-31' },
        { name: 'First Aid', expiry: '2025-03-15' }
      ],
      skills: ['Stage Management', 'Crew Coordination', 'Safety Protocols'],
      experience: '5 years',
      projects: [
        { name: 'Summer Music Festival', role: 'Stage Manager', dates: '2024-06-15 to 2024-06-18' },
        { name: 'Corporate Event', role: 'Production Lead', dates: '2024-04-10 to 2024-04-11' }
      ],
      documents: [
        { name: 'certifications.pdf', size: '2.4 MB', date: '2024-03-10' },
        { name: 'resume.pdf', size: '1.2 MB', date: '2024-03-10' }
      ],
      notes: 'Experienced stage manager with excellent track record in festival productions.'
    }
  ];

  const filteredCrew = crew.filter(member => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return member.status === 'Active';
    if (activeFilter === 'standby') return member.status === 'Standby';
    if (activeFilter === 'applicants') return member.status === 'Applicant';
    if (activeFilter === 'inactive') return member.status === 'Inactive';
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Crew Directory</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search crew..."
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
            Add Crew Member
          </button>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Add New Crew Member"
        size="xl"
      >
        <CrewForm
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
            All Crew
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`px-4 py-2 ${activeFilter === 'active' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveFilter('standby')}
            className={`px-4 py-2 ${activeFilter === 'standby' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Standby
          </button>
          <button
            onClick={() => setActiveFilter('applicants')}
            className={`px-4 py-2 ${activeFilter === 'applicants' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Applicants
          </button>
          <button
            onClick={() => setActiveFilter('inactive')}
            className={`px-4 py-2 ${activeFilter === 'inactive' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Inactive
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredCrew.map(member => (
          <div key={member.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div 
              className={`p-6 cursor-pointer hover:bg-mono-50 ${expandedId === member.id ? 'bg-mono-50' : ''}`}
              onClick={() => toggleExpand(member.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar 
                    src={member.photo}
                    alt={`${member.name}'s photo`}
                    size="lg"
                    className="avatar-hover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-mono-900">{member.name}</h3>
                    <div className="mt-1 flex items-center text-sm text-mono-500">
                      <Building className="w-4 h-4 mr-1" />
                      {member.department}
                      <span className="mx-2">•</span>
                      <Users className="w-4 h-4 mr-1" />
                      {member.role}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {member.skills.map((skill, index) => (
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
                    member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {member.status}
                  </span>
                  {expandedId === member.id ? (
                    <ChevronUp className="w-5 h-5 text-mono-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-mono-400" />
                  )}
                </div>
              </div>
            </div>

            {expandedId === member.id && (
              <div className="border-t border-mono-200 p-6 bg-mono-50">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Projects</h3>
                      {member.projects.length > 0 ? (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                          <div className="grid grid-cols-3 gap-4 p-3 font-medium text-mono-700 border-b">
                            <div>Project</div>
                            <div>Role</div>
                            <div>Date</div>
                          </div>
                          {member.projects.map((project, index) => (
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
                      <p className="text-sm text-mono-600 bg-white p-3 rounded-lg shadow-sm">{member.notes}</p>
                    </div>
                  </div>

                  <div>
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-mono-400 mr-2" />
                          <a href={`mailto:${member.email}`} className="text-sm text-accent hover:underline">
                            {member.email}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-mono-400 mr-2" />
                          <a href={`tel:${member.phone}`} className="text-sm text-accent hover:underline">
                            {member.phone}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-mono-400 mr-2" />
                          <span className="text-sm text-mono-600">{member.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Certifications</h3>
                      <div className="space-y-2">
                        {member.certifications.map((cert, index) => (
                          <div key={index} className="bg-white p-2 rounded border border-mono-200">
                            <p className="text-sm font-medium text-mono-900">{cert.name}</p>
                            <p className="text-xs text-mono-500">Expires: {cert.expiry}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Documents</h3>
                      <div className="space-y-2">
                        {member.documents.map((doc, index) => (
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