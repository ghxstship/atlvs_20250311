import React, { useState } from 'react';
import { Telescope, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, Building, Star, CheckCircle, AlertTriangle, DollarSign, Truck, Zap } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import JobForm from '../../components/forms/JobForm';
import useModal from '../../hooks/useModal';
import StatusBoxGrid from '../../components/StatusBoxGrid';

export default function Jobs() {
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
      console.error('Error creating job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const jobs = [
    {
      id: 1,
      title: 'Stage Installation Project',
      company: 'Stage Systems Inc.',
      location: 'Los Angeles Convention Center',
      startDate: '2024-04-01',
      duration: '5 days',
      value: 25000,
      status: 'Scheduled',
      description: 'Complete stage system installation including modular staging, rigging, and safety equipment setup.',
      requirements: {
        equipment: [
          'Modular stage components',
          'Rigging hardware',
          'Safety barriers',
          'Tools and accessories'
        ],
        personnel: [
          'Lead Installer (1)',
          'Technical Staff (3)',
          'Safety Officer (1)',
          'General Labor (4)'
        ],
        certifications: [
          'Safety Certification',
          'Equipment Operation License',
          'Height Work Permit'
        ]
      },
      schedule: [
        { date: '2024-04-01', time: '08:00-17:00', activity: 'Equipment Delivery & Site Prep' },
        { date: '2024-04-02', time: '08:00-17:00', activity: 'Stage Base Installation' },
        { date: '2024-04-03', time: '08:00-17:00', activity: 'Rigging & Safety Systems' },
        { date: '2024-04-04', time: '08:00-17:00', activity: 'Final Assembly' },
        { date: '2024-04-05', time: '08:00-17:00', activity: 'Testing & Certification' }
      ],
      team: {
        manager: 'Sarah Chen',
        supervisor: 'Mike Thompson',
        contact: {
          name: 'John Martinez',
          phone: '(555) 123-4567',
          email: 'john.m@stagesystems.com'
        }
      },
      logistics: {
        loadIn: 'Loading Dock B',
        parking: 'Service Lot C',
        storage: 'Backstage Storage Area',
        power: '200A 3-phase power required'
      },
      safety: {
        requirements: [
          'PPE required at all times',
          'Daily safety briefings',
          'Emergency response plan in place',
          'First aid station on site'
        ],
        contacts: {
          safety: 'David Wilson - (555) 234-5678',
          medical: 'On-site Medical - (555) 345-6789',
          emergency: '911'
        }
      },
      documents: [
        { name: 'installation_plan.pdf', size: '2.4 MB', date: '2024-03-10' },
        { name: 'safety_protocol.pdf', size: '1.2 MB', date: '2024-03-10' },
        { name: 'equipment_list.xlsx', size: '0.8 MB', date: '2024-03-10' }
      ],
      notes: 'Critical timeline for festival setup. All safety protocols must be strictly followed.',
      lastUpdated: '2024-03-15 09:30'
    }
  ];

  // Status box data
  const statusBoxes = [
    {
      title: 'Total Jobs',
      value: `${jobs.filter(j => j.status === 'Active').length}`,
      subtitle: 'Currently active',
      icon: 'briefcase'
    },
    {
      title: 'Awarded',
      value: `${jobs.filter(j => j.status === 'Awarded').length}`,
      subtitle: 'Contracts awarded',
      icon: 'check',
      type: 'success'
    },
    {
      title: 'Bidding',
      value: `${jobs.filter(j => j.status === 'Bidding').length}`,
      subtitle: 'Open for bids',
      icon: 'clock',
      type: 'info'
    },
    {
      title: 'Draft',
      value: `${jobs.filter(j => j.status === 'Draft').length}`,
      subtitle: 'Not published',
      icon: 'file',
      type: 'warning'
    }
  ];

  const filteredJobs = activeFilter === 'all' 
    ? jobs 
    : jobs.filter(job => {
        if (activeFilter === 'scheduled') {
          return job.status === 'Scheduled';
        } else if (activeFilter === 'inProgress') {
          return job.status === 'In Progress';
        } else if (activeFilter === 'completed') {
          return job.status === 'Completed';
        }
        return true;
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Jobs</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search jobs..."
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
            New Job
          </button>
        </div>
      </div>

      <StatusBoxGrid boxes={statusBoxes} />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Create New Job"
      >
        <JobForm
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
            All Jobs
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`px-4 py-2 ${activeFilter === 'active' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveFilter('awarded')}
            className={`px-4 py-2 ${activeFilter === 'awarded' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Awarded
          </button>
          <button
            onClick={() => setActiveFilter('bidding')}
            className={`px-4 py-2 ${activeFilter === 'bidding' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Bidding
          </button>
          <button
            onClick={() => setActiveFilter('draft')}
            className={`px-4 py-2 ${activeFilter === 'draft' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Draft
          </button>
          <button
            onClick={() => setActiveFilter('archived')}
            className={`px-4 py-2 ${activeFilter === 'archived' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Archived
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-7 gap-4 p-4 font-medium text-mono-700 border-b">
          <div>Job ID</div>
          <div className="col-span-2">Job</div>
          <div>Company</div>
          <div>Duration</div>
          <div>Value</div>
          <div>Status</div>
        </div>
        
        {filteredJobs.map(job => (
          <React.Fragment key={job.id}>
            <div 
              className={`grid grid-cols-7 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === job.id ? 'bg-mono-50' : ''}`}
              onClick={() => toggleExpand(job.id)}
            >
              <div className="font-mono text-sm text-mono-600">JOB-{job.id.toString().padStart(4, '0')}</div>
              <div className="col-span-2 flex items-center">
                <Telescope className="w-5 h-5 text-mono-400 mr-2" />
                <div>
                  <div className="font-medium text-mono-900">{job.title}</div>
                  <div className="text-sm text-mono-500">{job.location}</div>
                </div>
              </div>
              <div className="text-mono-600">{job.company}</div>
              <div className="text-mono-600">{job.duration}</div>
              <div className="text-mono-600">${job.value.toLocaleString()}</div>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  job.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {job.status}
                </span>
              </div>
            </div>

            {expandedId === job.id && (
              <div className="col-span-7 bg-mono-50 p-6 border-b">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Job Details</h3>
                      <div className="bg-white rounded-lg shadow-sm p-4">
                        <p className="text-sm text-mono-600 mb-4">{job.description}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-xs font-medium text-mono-700 mb-2">Equipment Requirements</h4>
                            <ul className="list-disc pl-4 space-y-1">
                              {job.requirements.equipment.map((item, index) => (
                                <li key={index} className="text-sm text-mono-600">{item}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-mono-700 mb-2">Personnel Requirements</h4>
                            <ul className="list-disc pl-4 space-y-1">
                              {job.requirements.personnel.map((item, index) => (
                                <li key={index} className="text-sm text-mono-600">{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Schedule</h3>
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="grid grid-cols-3 gap-4 p-3 font-medium text-mono-700 border-b">
                          <div>Date</div>
                          <div>Time</div>
                          <div>Activity</div>
                        </div>
                        {job.schedule.map((item, index) => (
                          <div key={index} className="grid grid-cols-3 gap-4 p-3 border-b last:border-0">
                            <div className="text-sm text-mono-600">{item.date}</div>
                            <div className="text-sm text-mono-600">{item.time}</div>
                            <div className="text-sm text-mono-600">{item.activity}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Safety Requirements</h3>
                      <div className="bg-white rounded-lg shadow-sm p-4">
                        <ul className="list-disc pl-4 mb-4 space-y-1">
                          {job.safety.requirements.map((req, index) => (
                            <li key={index} className="text-sm text-mono-600">{req}</li>
                          ))}
                        </ul>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <span className="text-sm text-mono-500 mr-2">Safety Contact:</span>
                            <span className="text-sm text-mono-900">{job.safety.contacts.safety}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-mono-500 mr-2">Medical Contact:</span>
                            <span className="text-sm text-mono-900">{job.safety.contacts.medical}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-mono-500 mr-2">Emergency:</span>
                            <span className="text-sm text-mono-900">{job.safety.contacts.emergency}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Team Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-mono-500">Project Manager:</span>
                          <span className="text-sm text-mono-900">{job.team.manager}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-mono-500">Site Supervisor:</span>
                          <span className="text-sm text-mono-900">{job.team.supervisor}</span>
                        </div>
                        <div className="pt-2 border-t border-mono-100">
                          <p className="text-xs text-mono-500 mb-2">Client Contact</p>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-mono-900">{job.team.contact.name}</p>
                            <a href={`tel:${job.team.contact.phone}`} className="text-sm text-accent hover:underline block">
                              {job.team.contact.phone}
                            </a>
                            <a href={`mailto:${job.team.contact.email}`} className="text-sm text-accent hover:underline block">
                              {job.team.contact.email}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Logistics</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Truck className="w-4 h-4 text-mono-400 mr-2" />
                          <span className="text-sm text-mono-500 mr-2">Load In:</span>
                          <span className="text-sm text-mono-900">{job.logistics.loadIn}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-mono-400 mr-2" />
                          <span className="text-sm text-mono-500 mr-2">Parking:</span>
                          <span className="text-sm text-mono-900">{job.logistics.parking}</span>
                        </div>
                        <div className="flex items-center">
                          <Building className="w-4 h-4 text-mono-400 mr-2" />
                          <span className="text-sm text-mono-500 mr-2">Storage:</span>
                          <span className="text-sm text-mono-900">{job.logistics.storage}</span>
                        </div>
                        <div className="flex items-center">
                          <Zap className="w-4 h-4 text-mono-400 mr-2" />
                          <span className="text-sm text-mono-500 mr-2">Power:</span>
                          <span className="text-sm text-mono-900">{job.logistics.power}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Required Certifications</h3>
                      <div className="space-y-2">
                        {job.requirements.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm text-mono-600">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Documents</h3>
                      <div className="space-y-2">
                        {job.documents.map((doc, index) => (
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
                    View Schedule
                  </button>
                  <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                    Update Status
                  </button>
                  <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                    Generate Report
                  </button>
                  <ActionButtons />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}