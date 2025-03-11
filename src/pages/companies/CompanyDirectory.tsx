import React, { useState } from 'react';
import { Flag, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, Phone, Mail, Building, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import CompanyForm from '../../components/forms/CompanyForm';
import useModal from '../../hooks/useModal';
import EmptyState from '../../components/EmptyState';
import Avatar from '../../components/Avatar';
import StatusBoxGrid from '../../components/StatusBoxGrid';

export default function CompanyDirectory() {
  const { isOpen, openModal, closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      closeModal();
    } catch (error) {
      console.error('Error adding company:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const companies = [
    {
      id: 1,
      name: 'Stage Systems Inc.',
      type: 'Equipment Supplier',
      location: 'Los Angeles, CA',
      status: 'Active Partner',
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623',
      description: 'Leading provider of professional stage and audio equipment.',
      contact: {
        name: 'John Smith',
        title: 'Account Manager',
        phone: '(555) 123-4567',
        email: 'john.smith@stagesystems.com'
      },
      projects: [
        { name: 'Summer Music Festival', role: 'Equipment Provider', dates: '2024-06-15 to 2024-06-18' },
        { name: 'Corporate Event', role: 'Technical Support', dates: '2024-04-10 to 2024-04-11' }
      ],
      documents: [
        { name: 'contract.pdf', size: '2.4 MB', date: '2024-03-01' },
        { name: 'equipment_list.pdf', size: '1.8 MB', date: '2024-03-05' }
      ],
      notes: 'Reliable partner with excellent track record in equipment supply and support.'
    }
  ];

  const filteredCompanies = companies.filter(company => {
    if (selectedType !== 'all' && company.type !== selectedType) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Company Directory</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search companies..."
              className="pl-10 pr-4 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
            />
            <Search className="w-5 h-5 text-mono-400 absolute left-3 top-2.5" />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
          >
            <option value="all">All Types</option>
            <option value="Equipment Supplier">Equipment Supplier</option>
            <option value="Service Provider">Service Provider</option>
            <option value="Venue">Venue</option>
          </select>

          <button 
            onClick={openModal}
            className="flex items-center px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent hover:text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Company
          </button>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Add New Company"
        size="xl"
      >
        <CompanyForm
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <div className="space-y-4">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map(company => (
            <div key={company.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div 
                className={`p-6 cursor-pointer hover:bg-mono-50 ${expandedId === company.id ? 'bg-mono-50' : ''}`}
                onClick={() => toggleExpand(company.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar 
                      src={company.logo}
                      alt={`${company.name} logo`}
                      size="lg"
                      className="avatar-hover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-mono-900">{company.name}</h3>
                      <div className="mt-1 flex items-center text-sm text-mono-500">
                        <Flag className="w-4 h-4 mr-1" />
                        {company.type}
                        <span className="mx-2">•</span>
                        <MapPin className="w-4 h-4 mr-1" />
                        {company.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      company.status === 'Active Partner' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {company.status}
                    </span>
                    {expandedId === company.id ? (
                      <ChevronUp className="w-5 h-5 text-mono-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-mono-400" />
                    )}
                  </div>
                </div>
              </div>

              {expandedId === company.id && (
                <div className="border-t border-mono-200 p-6 bg-mono-50">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Projects</h3>
                        {company.projects.length > 0 ? (
                          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="grid grid-cols-3 gap-4 p-3 font-medium text-mono-700 border-b">
                              <div>Project</div>
                              <div>Role</div>
                              <div>Date</div>
                            </div>
                            {company.projects.map((project, index) => (
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
                        <p className="text-sm text-mono-600 bg-white p-3 rounded-lg shadow-sm">{company.notes}</p>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Contact Information</h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-900">{company.contact.name}</span>
                          </div>
                          <div className="flex items-center">
                            <Building className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-900">{company.contact.title}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 text-mono-400 mr-2" />
                            <a href={`mailto:${company.contact.email}`} className="text-sm text-accent hover:underline">
                              {company.contact.email}
                            </a>
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 text-mono-400 mr-2" />
                            <a href={`tel:${company.contact.phone}`} className="text-sm text-accent hover:underline">
                              {company.contact.phone}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Documents</h3>
                        <div className="space-y-2">
                          {company.documents.map((doc, index) => (
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
          ))
        ) : (
          <EmptyState
            icon={Flag}
            title="No companies found"
            message={
              activeFilter === 'all' 
                ? "No companies have been added yet."
                : "No companies found matching the selected filter."
            }
            action={{
              label: "Add Company",
              onClick: openModal
            }}
          />
        )}
      </div>
    </div>
  );
}