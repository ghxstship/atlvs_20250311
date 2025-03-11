import React, { useState } from 'react';
import { HardHat, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Building, DollarSign, Users, Briefcase, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import PositionForm from '../../components/forms/PositionForm';
import useModal from '../../hooks/useModal';
import StatusBoxGrid from '../../components/StatusBoxGrid';

export default function Positions() {
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
      console.error('Error creating position:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Status box data
  const statusBoxes = [
    {
      title: 'Total Positions',
      value: '3',
      subtitle: 'Active positions',
      icon: 'briefcase'
    },
    {
      title: 'Open',
      value: '2',
      subtitle: 'Currently hiring',
      icon: 'file',
      type: 'info'
    },
    {
      title: 'Total Openings',
      value: '6',
      subtitle: 'Positions to fill',
      icon: 'users',
      type: 'warning'
    },
    {
      title: 'Applications',
      value: '38',
      subtitle: 'Total applications received',
      icon: 'star',
      type: 'success'
    }
  ];

  const positions = [
    {
      id: 1,
      title: 'Senior Stage Manager',
      department: 'Production',
      type: 'Full-time',
      openings: 2,
      location: 'Main Venue',
      status: 'Open',
      description: 'We are seeking an experienced Senior Stage Manager to join our production team. The ideal candidate will have a proven track record in managing large-scale events and leading stage crews.',
      responsibilities: [
        'Oversee all stage operations during events and productions',
        'Coordinate with technical teams, performers, and production staff',
        'Manage stage crew scheduling and assignments',
        'Ensure safety protocols are followed',
        'Maintain detailed production documentation',
        'Conduct pre-show checks and post-show reviews'
      ],
      requirements: {
        education: 'Bachelor\'s degree in Theater Production, Technical Theater, or related field',
        experience: '5+ years of stage management experience',
        skills: [
          'Stage Management',
          'Crew Coordination',
          'Technical Direction',
          'Safety Protocols',
          'Communication',
          'Problem Solving'
        ],
        certifications: [
          'ETCP Certification preferred',
          'First Aid and CPR Certification required'
        ]
      },
      benefits: [
        'Competitive salary',
        'Health, dental, and vision insurance',
        '401(k) with company match',
        'Paid time off',
        'Professional development opportunities'
      ],
      salary: {
        min: 65000,
        max: 85000,
        type: 'Annual'
      },
      schedule: {
        type: 'Variable',
        hours: '40+ hours per week',
        shifts: 'Including evenings, weekends, and holidays'
      },
      hiring: {
        manager: 'Sarah Chen',
        team: 'Production Team A',
        timeline: 'Immediate',
        process: [
          'Initial application review',
          'Phone screening',
          'Technical interview',
          'Practical assessment',
          'Final interview'
        ]
      },
      applications: {
        total: 12,
        new: 3,
        inReview: 5,
        interviewing: 4
      },
      documents: [
        { name: 'job_description.pdf', size: '1.2 MB', date: '2024-03-01' },
        { name: 'assessment_criteria.pdf', size: '0.8 MB', date: '2024-03-01' }
      ],
      notes: 'Priority hire for upcoming summer season. Looking for candidates with festival experience.',
      lastUpdated: '2024-03-10 14:30'
    },
    {
      id: 2,
      title: 'Audio Engineer',
      department: 'Technical',
      type: 'Contract',
      openings: 1,
      location: 'Various',
      status: 'Filled',
      description: 'Seeking a skilled Audio Engineer to handle sound operations for various events. The position requires expertise in digital audio systems and live sound mixing.',
      responsibilities: [
        'Set up and operate sound equipment',
        'Mix live audio for events',
        'Maintain and troubleshoot audio systems',
        'Coordinate with performers and production team',
        'Ensure optimal sound quality',
        'Document technical specifications and requirements'
      ],
      requirements: {
        education: 'Degree in Audio Engineering or equivalent experience',
        experience: '3+ years of live sound experience',
        skills: [
          'Digital Console Operation',
          'Signal Processing',
          'System Design',
          'Troubleshooting',
          'Live Mixing',
          'Audio Networks'
        ],
        certifications: [
          'Dante Certification required',
          'Manufacturer certifications preferred'
        ]
      },
      benefits: [
        'Competitive hourly rate',
        'Flexible schedule',
        'Equipment allowance',
        'Training opportunities'
      ],
      salary: {
        min: 45,
        max: 65,
        type: 'Hourly'
      },
      schedule: {
        type: 'Project-based',
        hours: 'Varies by project',
        shifts: 'Flexible'
      },
      hiring: {
        manager: 'Mike Thompson',
        team: 'Audio Department',
        timeline: 'Position Filled',
        process: [
          'Portfolio review',
          'Technical assessment',
          'Practical test',
          'Team interview'
        ]
      },
      applications: {
        total: 18,
        new: 0,
        inReview: 0,
        interviewing: 0
      },
      documents: [
        { name: 'technical_requirements.pdf', size: '1.5 MB', date: '2024-02-15' }
      ],
      notes: 'Position filled with internal candidate. Keeping applications on file for future openings.',
      lastUpdated: '2024-03-05 09:15'
    },
    {
      id: 3,
      title: 'Lighting Designer',
      department: 'Technical',
      type: 'Full-time',
      openings: 3,
      location: 'Main Venue',
      status: 'Open',
      description: 'We are looking for creative Lighting Designers to join our technical team. The role involves designing and implementing lighting solutions for various events and productions.',
      responsibilities: [
        'Design lighting plots for events and productions',
        'Program lighting consoles',
        'Collaborate with creative teams',
        'Manage lighting crew',
        'Maintain lighting equipment',
        'Create technical documentation'
      ],
      requirements: {
        education: 'Bachelor\'s degree in Lighting Design or related field',
        experience: '3+ years of professional lighting design experience',
        skills: [
          'Lighting Design',
          'Console Programming',
          'CAD',
          'Color Theory',
          'Team Leadership',
          'Project Management'
        ],
        certifications: [
          'MA Lighting certification preferred',
          'ETCP certification a plus'
        ]
      },
      benefits: [
        'Competitive salary',
        'Health insurance',
        'Paid vacation',
        'Professional development',
        'Equipment allowance'
      ],
      salary: {
        min: 55000,
        max: 75000,
        type: 'Annual'
      },
      schedule: {
        type: 'Full-time',
        hours: '40 hours per week',
        shifts: 'Including some evenings and weekends'
      },
      hiring: {
        manager: 'David Wilson',
        team: 'Lighting Department',
        timeline: '30 days',
        process: [
          'Portfolio review',
          'Design challenge',
          'Technical interview',
          'Team interview',
          'Final interview'
        ]
      },
      applications: {
        total: 8,
        new: 2,
        inReview: 4,
        interviewing: 2
      },
      documents: [
        { name: 'job_description.pdf', size: '1.1 MB', date: '2024-03-05' },
        { name: 'design_challenge.pdf', size: '2.4 MB', date: '2024-03-05' }
      ],
      notes: 'Expanding lighting team for upcoming season. Focus on candidates with modern console experience.',
      lastUpdated: '2024-03-12 16:45'
    }
  ];

  const filteredPositions = activeFilter === 'all' 
    ? positions 
    : positions.filter(position => {
        if (activeFilter === 'open') {
          return position.status === 'Open';
        } else if (activeFilter === 'filled') {
          return position.status === 'Filled';
        }
        return true;
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Positions</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search positions..."
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
            Add Position
          </button>
        </div>
      </div>

      <StatusBoxGrid boxes={statusBoxes} />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Add New Position"
      >
        <PositionForm
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
            All Positions
          </button>
          <button
            onClick={() => setActiveFilter('open')}
            className={`px-4 py-2 ${activeFilter === 'open' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Open
          </button>
          <button
            onClick={() => setActiveFilter('filled')}
            className={`px-4 py-2 ${activeFilter === 'filled' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Filled
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-6 gap-4 p-4 font-medium text-mono-700 border-b">
          <div className="col-span-2">Position</div>
          <div>Department</div>
          <div>Type</div>
          <div>Status</div>
          <div></div>
        </div>
        
        {filteredPositions.length > 0 ? (
          filteredPositions.map(position => (
            <React.Fragment key={position.id}>
              <div 
                className={`grid grid-cols-6 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === position.id ? 'bg-mono-50' : ''}`}
                onClick={() => toggleExpand(position.id)}
              >
                <div className="col-span-2 flex items-center">
                  <HardHat className="w-5 h-5 text-mono-400 mr-2" />
                  <div>
                    <div className="font-medium text-mono-900">{position.title}</div>
                    <div className="text-sm text-mono-500">{position.location} · {position.openings} openings</div>
                  </div>
                </div>
                <div className="text-mono-600">{position.department}</div>
                <div className="text-mono-600">{position.type}</div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    position.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {position.status}
                  </span>
                </div>
                <div className="flex justify-end">
                  {expandedId === position.id ? (
                    <ChevronUp className="w-5 h-5 text-mono-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-mono-400" />
                  )}
                </div>
              </div>

              {expandedId === position.id && (
                <div className="col-span-6 bg-mono-50 p-6 border-b">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Position Description</h3>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                          <p className="text-sm text-mono-600 mb-4">{position.description}</p>
                          
                          <h4 className="text-xs font-medium text-mono-700 mb-2">Key Responsibilities</h4>
                          <ul className="list-disc pl-4 mb-4">
                            {position.responsibilities.map((resp, index) => (
                              <li key={index} className="text-sm text-mono-600 mb-1">{resp}</li>
                            ))}
                          </ul>

                          <h4 className="text-xs font-medium text-mono-700 mb-2">Requirements</h4>
                          <div className="space-y-2">
                            <p className="text-sm text-mono-600">
                              <span className="font-medium">Education:</span> {position.requirements.education}
                            </p>
                            <p className="text-sm text-mono-600">
                              <span className="font-medium">Experience:</span> {position.requirements.experience}
                            </p>
                            <div>
                              <p className="text-sm font-medium text-mono-600 mb-1">Required Skills:</p>
                              <div className="flex flex-wrap gap-2">
                                {position.requirements.skills.map((skill, index) => (
                                  <span 
                                    key={index}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-mono-100 text-mono-800"
                                  >
                                    <Tag className="w-3 h-3 mr-1" />
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-mono-600 mb-1">Certifications:</p>
                              <ul className="list-disc pl-4">
                                {position.requirements.certifications.map((cert, index) => (
                                  <li key={index} className="text-sm text-mono-600">{cert}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Benefits & Compensation</h3>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-mono-500 mb-1">Salary Range</p>
                              <p className="text-sm font-medium text-mono-900">
                                ${position.salary.min.toLocaleString()} - ${position.salary.max.toLocaleString()} ({position.salary.type})
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-mono-500 mb-1">Schedule Type</p>
                              <p className="text-sm font-medium text-mono-900">{position.schedule.type}</p>
                            </div>
                            <div>
                              <p className="text-xs text-mono-500 mb-1">Hours</p>
                              <p className="text-sm font-medium text-mono-900">{position.schedule.hours}</p>
                            </div>
                            <div>
                              <p className="text-xs text-mono-500 mb-1">Shifts</p>
                              <p className="text-sm font-medium text-mono-900">{position.schedule.shifts}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-mono-700 mb-2">Benefits Package:</p>
                            <ul className="list-disc pl-4">
                              {position.benefits.map((benefit, index) => (
                                <li key={index} className="text-sm text-mono-600">{benefit}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Hiring Process</h3>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-mono-500 mb-1">Hiring Manager</p>
                                <p className="text-sm font-medium text-mono-900">{position.hiring.manager}</p>
                              </div>
                              <div>
                                <p className="text-xs text-mono-500 mb-1">Team</p>
                                <p className="text-sm font-medium text-mono-900">{position.hiring.team}</p>
                              </div>
                              <div>
                                <p className="text-xs text-mono-500 mb-1">Timeline</p>
                                <p className="text-sm font-medium text-mono-900">{position.hiring.timeline}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-mono-700 mb-2">Process Steps:</p>
                              <div className="space-y-2">
                                {position.hiring.process.map((step, index) => (
                                  <div key={index} className="flex items-center">
                                    <div className="w-6 h-6 rounded-full bg-mono-100 flex items-center justify-center mr-2">
                                      <span className="text-xs font-medium text-mono-600">{index + 1}</span>
                                    </div>
                                    <span className="text-sm text-mono-600">{step}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Application Statistics</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-mono-500">Total Applications</span>
                            <span className="text-sm font-medium text-mono-900">{position.applications.total}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-mono-500">New</span>
                            <span className="text-sm font-medium text-mono-900">{position.applications.new}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-mono-500">In Review</span>
                            <span className="text-sm font-medium text-mono-900">{position.applications.inReview}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-mono-500">Interviewing</span>
                            <span className="text-sm font-medium text-mono-900">{position.applications.interviewing}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Position Details</h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Building className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Department:</span>
                            <span className="text-sm text-mono-900">{position.department}</span>
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Type:</span>
                            <span className="text-sm text-mono-900">{position.type}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Location:</span>
                            <span className="text-sm text-mono-900">{position.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Openings:</span>
                            <span className="text-sm text-mono-900">{position.openings}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-500 mr-2">Last Updated:</span>
                            <span className="text-sm text-mono-900">{position.lastUpdated}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Notes</h3>
                        <p className="text-sm text-mono-600">{position.notes}</p>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Documents</h3>
                        <div className="space-y-2">
                          {position.documents.map((doc, index) => (
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
                      View Applicants
                    </button>
                    <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                      Share Position
                    </button>
                    <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                      Generate Report
                    </button>
                    <ActionButtons />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))
        ) : (
          <EmptyState
            icon={HardHat}
            title="No positions found"
            message={
              activeFilter === 'all' 
                ? "No positions have been created yet."
                : "No positions found matching the selected filter."
            }
            action={{
              label: "Create Position",
              onClick: openModal
            }}
          />
        )}
      </div>
    </div>
  );
}