import React, { useState } from 'react';
import { Skull, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, Phone, Mail, Building, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import ContactForm from '../../components/forms/ContactForm';
import useModal from '../../hooks/useModal';
import EmptyState from '../../components/EmptyState';
import Avatar from '../../components/Avatar';
import StatusBoxGrid from '../../components/StatusBoxGrid';

export default function Contacts() {
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
      console.error('Error adding contact:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const contacts = [
    {
      id: 1,
      name: 'John Smith',
      company: 'Stage Systems Inc.',
      role: 'Sales Director',
      email: 'john.smith@stagesystems.com',
      phone: '(555) 123-4567',
      mobile: '(555) 987-6543',
      status: 'Active',
      department: 'Sales',
      location: 'Los Angeles, CA',
      lastContact: '2024-03-10',
      notes: 'Key decision maker for equipment purchases. Prefers email communication.',
      projects: [
        { name: 'Summer Music Festival', role: 'Vendor Contact', status: 'Active' },
        { name: 'Corporate Event', role: 'Equipment Supplier', status: 'Completed' }
      ],
      documents: [
        { name: 'meeting_notes.pdf', size: '1.2 MB', date: '2024-03-10' },
        { name: 'proposal_response.pdf', size: '2.4 MB', date: '2024-03-08' }
      ],
      communication: [
        { type: 'Email', date: '2024-03-10', subject: 'Equipment Quote Follow-up' },
        { type: 'Call', date: '2024-03-05', subject: 'Project Requirements Discussion' }
      ]
    },
    {
      id: 2,
      name: 'Sarah Chen',
      company: 'Sound Solutions Ltd',
      role: 'Account Manager',
      email: 'sarah.chen@soundsolutions.com',
      phone: '(555) 234-5678',
      mobile: '(555) 876-5432',
      status: 'Active',
      department: 'Account Management',
      location: 'New York, NY',
      lastContact: '2024-03-12',
      notes: 'Excellent relationship manager. Quick response time.',
      projects: [
        { name: 'Theater Production', role: 'Account Lead', status: 'Active' }
      ],
      documents: [
        { name: 'contract_draft.pdf', size: '1.8 MB', date: '2024-03-12' }
      ],
      communication: [
        { type: 'Meeting', date: '2024-03-12', subject: 'Quarterly Review' }
      ]
    },
    {
      id: 3,
      name: 'Mike Wilson',
      company: 'Event Tech Pro',
      role: 'Technical Director',
      email: 'mike.wilson@eventtechpro.com',
      phone: '(555) 345-6789',
      mobile: '(555) 765-4321',
      status: 'Inactive',
      department: 'Technical',
      location: 'Chicago, IL',
      lastContact: '2024-02-15',
      notes: 'Currently on leave until April 2024.',
      projects: [],
      documents: [
        { name: 'technical_specs.pdf', size: '2.1 MB', date: '2024-02-15' }
      ],
      communication: [
        { type: 'Email', date: '2024-02-15', subject: 'Leave Notice' }
      ]
    }
  ];

  const filteredContacts = activeFilter === 'all' 
    ? contacts 
    : contacts.filter(contact => {
        if (activeFilter === 'active') {
          return contact.status === 'Active';
        } else if (activeFilter === 'inactive') {
          return contact.status === 'Inactive';
        }
        return true;
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Contact Directory</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search contacts..."
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
            Add Contact
          </button>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Add New Contact"
      >
        <ContactForm
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
            All Contacts
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`px-4 py-2 ${activeFilter === 'active' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Active
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
        {filteredContacts.length > 0 ? (
          filteredContacts.map(contact => (
           <div key={contact.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div 
              className={`p-6 cursor-pointer hover:bg-mono-50 ${expandedId === contact.id ? 'bg-mono-50' : ''}`}
              onClick={() => toggleExpand(contact.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-full bg-mono-100 flex items-center justify-center">
                    <span className="text-xl font-medium text-mono-600">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-mono-900">{contact.name}</h3>
                    <div className="mt-1 flex items-center text-sm text-mono-500">
                      <Building className="w-4 h-4 mr-1" />
                      {contact.company}
                      <span className="mx-2">•</span>
                      <Users className="w-4 h-4 mr-1" />
                      {contact.role}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {contact.department}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    contact.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {contact.status}
                  </span>
                  {expandedId === contact.id ? (
                    <ChevronUp className="w-5 h-5 text-mono-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-mono-400" />
                  )}
                </div>
              </div>
            </div>

            {expandedId === contact.id && (
              <div className="border-t border-mono-200 p-6 bg-mono-50">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Projects</h3>
                      {contact.projects.length > 0 ? (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                          <div className="grid grid-cols-3 gap-4 p-3 font-medium text-mono-700 border-b">
                            <div>Project</div>
                            <div>Role</div>
                            <div>Status</div>
                          </div>
                          {contact.projects.map((project, index) => (
                            <div key={index} className="grid grid-cols-3 gap-4 p-3 border-b last:border-0">
                              <div className="text-sm text-mono-600">{project.name}</div>
                              <div className="text-sm text-mono-600">{project.role}</div>
                              <div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  project.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {project.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-mono-500 bg-white p-4 rounded-lg shadow-sm">
                          No active projects
                        </p>
                      )}
                    </div>

                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Communication History</h3>
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="grid grid-cols-3 gap-4 p-3 font-medium text-mono-700 border-b">
                          <div>Type</div>
                          <div>Date</div>
                          <div>Subject</div>
                        </div>
                        {contact.communication.map((item, index) => (
                          <div key={index} className="grid grid-cols-3 gap-4 p-3 border-b last:border-0">
                            <div className="text-sm text-mono-600">{item.type}</div>
                            <div className="text-sm text-mono-600">{item.date}</div>
                            <div className="text-sm text-mono-600">{item.subject}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Notes</h3>
                      <p className="text-sm text-mono-600 bg-white p-3 rounded-lg shadow-sm">{contact.notes}</p>
                    </div>
                  </div>

                  <div>
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-mono-400 mr-2" />
                          <a href={`mailto:${contact.email}`} className="text-sm text-accent hover:underline">
                            {contact.email}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-mono-400 mr-2" />
                          <a href={`tel:${contact.phone}`} className="text-sm text-accent hover:underline">
                            {contact.phone}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-mono-400 mr-2" />
                          <a href={`tel:${contact.mobile}`} className="text-sm text-accent hover:underline">
                            {contact.mobile}
                          </a>
                          <span className="text-xs text-mono-500 ml-2">(Mobile)</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-mono-400 mr-2" />
                          <span className="text-sm text-mono-600">{contact.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Documents</h3>
                      <div className="space-y-2">
                        {contact.documents.map((doc, index) => (
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
                  <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                    Send Message
                  </button>
                  <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                    Schedule Meeting
                  </button>
                  <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                    View History
                  </button>
                  <ActionButtons />
                </div>
              </div>
            )}
          </div>
        ))
        ) : (
          <EmptyState
            icon={Users}
            title="No contacts found"
            message={
              activeFilter === 'all' 
                ? "No contacts have been added yet."
                : "No contacts found matching the selected filter."
            }
            action={{
              label: "Add Contact",
              onClick: openModal
            }}
          />
        )}
      </div>
    </div>
  );
}