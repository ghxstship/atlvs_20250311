import React, { useState } from 'react';
import { FileSearch, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, Phone, Mail, Building, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import ApplicantForm from '../../components/forms/ApplicantForm';
import useModal from '../../hooks/useModal';
import EmptyState from '../../components/EmptyState';
import StatusBoxGrid from '../../components/StatusBoxGrid';

export default function Applicants() {
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
      console.error('Error adding applicant:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Mock applicants data
  const applicants = [
    {
      id: 1,
      name: 'John Smith',
      position: 'Audio Technician',
      experience: '5 years',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      status: 'Under Review',
      appliedDate: '2024-03-10',
      location: 'Los Angeles, CA',
      experienceDetails: [
        {
          title: 'Senior Audio Engineer',
          company: 'Sound Productions Inc.',
          dates: '2019-2024',
          location: 'Los Angeles, CA',
          description: 'Led audio team for major music festivals and corporate events.'
        },
        {
          title: 'Audio Technician',
          company: 'Event Tech Solutions',
          dates: '2017-2019',
          location: 'San Francisco, CA',
          description: 'Handled audio setup and operation for various events.'
        }
      ],
      skills: ['Live Sound Mixing', 'Digital Consoles', 'System Setup', 'Troubleshooting'],
      certifications: [
        { name: 'Digital Console Operation', issuer: 'Yamaha', expiry: '2025-03-15' },
        { name: 'Audio Engineering', issuer: 'Audio Engineering Society', expiry: '2024-12-31' }
      ],
      education: {
        degree: 'Bachelor of Science in Audio Engineering',
        school: 'Full Sail University',
        graduationYear: '2017'
      },
      references: [
        {
          name: 'Sarah Wilson',
          title: 'Production Manager',
          company: 'Sound Productions Inc.',
          phone: '(555) 234-5678',
          email: 'sarah.w@soundprod.com'
        },
        {
          name: 'Mike Thompson',
          title: 'Technical Director',
          company: 'Event Tech Solutions',
          phone: '(555) 345-6789',
          email: 'mike.t@eventtech.com'
        }
      ],
      interviews: [
        {
          type: 'Technical Interview',
          date: '2024-03-15',
          time: '10:00 AM',
          interviewer: 'David Chen',
          status: 'Scheduled'
        }
      ],
      salary: {
        current: 65000,
        expected: 75000,
        type: 'Annual'
      },
      documents: [
        { name: 'resume.pdf', size: '2.4 MB', date: '2024-03-10' },
        { name: 'cover_letter.pdf', size: '1.2 MB', date: '2024-03-10' },
        { name: 'certifications.pdf', size: '3.6 MB', date: '2024-03-10' }
      ],
      notes: [
        { author: 'Sarah Chen', date: '2024-03-12', text: 'Strong technical background and excellent communication skills.' },
        { author: 'Mike Wilson', date: '2024-03-11', text: 'Previous experience with similar equipment and setup.' }
      ]
    }
  ];

  // Status box data
  const statusBoxes = [
    {
      title: 'Total Applicants',
      value: applicants.length.toString(),
      subtitle: 'All applications',
      icon: 'users'
    },
    {
      title: 'New',
      value: applicants.filter(a => a.status === 'New').length.toString(),
      subtitle: 'Awaiting review',
      icon: 'file',
      type: 'info'
    },
    {
      title: 'Under Review',
      value: applicants.filter(a => a.status === 'Under Review').length.toString(),
      subtitle: 'In review process',
      icon: 'clock',
      type: 'warning'
    },
    {
      title: 'Interviewing',
      value: applicants.filter(a => a.status === 'Interviewing').length.toString(),
      subtitle: 'In interview process',
      icon: 'calendar',
      type: 'success'
    }
  ];

  const filteredApplicants = activeFilter === 'all' 
    ? applicants 
    : applicants.filter(applicant => {
        switch (activeFilter) {
          case 'hired':
            return applicant.status === 'Hired';
          case 'pendingReview':
            return applicant.status === 'Under Review';
          case 'interviewing':
            return applicant.status === 'Interviewing';
          case 'new':
            return applicant.status === 'New';
          case 'archived':
            return applicant.status === 'Archived';
          default:
            return true;
        }
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Applicants</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search applicants..."
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
            Add Applicant
          </button>
        </div>
      </div>

      <StatusBoxGrid boxes={statusBoxes} />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Add New Applicant"
      >
        <ApplicantForm
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
            All Applicants
          </button>
          <button
            onClick={() => setActiveFilter('hired')}
            className={`px-4 py-2 ${activeFilter === 'hired' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Hired
          </button>
          <button
            onClick={() => setActiveFilter('pendingReview')}
            className={`px-4 py-2 ${activeFilter === 'pendingReview' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Pending Review
          </button>
          <button
            onClick={() => setActiveFilter('interviewing')}
            className={`px-4 py-2 ${activeFilter === 'interviewing' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Interviewing
          </button>
          <button
            onClick={() => setActiveFilter('new')}
            className={`px-4 py-2 ${activeFilter === 'new' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            New
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
        <div className="grid grid-cols-6 gap-4 p-4 font-medium text-mono-700 border-b">
          <div className="col-span-2">Name</div>
          <div>Position</div>
          <div>Experience</div>
          <div>Status</div>
          <div></div>
        </div>
        
        {filteredApplicants.length > 0 ? (
          filteredApplicants.map(applicant => (
            <React.Fragment key={applicant.id}>
              <div 
                className={`grid grid-cols-6 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === applicant.id ? 'bg-mono-50' : ''}`}
                onClick={() => toggleExpand(applicant.id)}
              >
                <div className="col-span-2 flex items-center">
                  <FileSearch className="w-5 h-5 text-mono-400 mr-2" />
                  <div>
                    <div className="font-medium text-mono-900">{applicant.name}</div>
                    <div className="text-sm text-mono-500">Applied: {applicant.appliedDate}</div>
                  </div>
                </div>
                <div className="text-mono-600">{applicant.position}</div>
                <div className="text-mono-600">{applicant.experience}</div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    applicant.status === 'New' ? 'bg-green-100 text-green-800' :
                    applicant.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {applicant.status}
                  </span>
                </div>
                <div className="flex justify-end">
                  {expandedId === applicant.id ? (
                    <ChevronUp className="w-5 h-5 text-mono-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-mono-400" />
                  )}
                </div>
              </div>

              {expandedId === applicant.id && (
                <div className="col-span-6 bg-mono-50 p-6 border-b">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Professional Experience</h3>
                        <div className="space-y-4">
                          {applicant.experienceDetails.map((exp, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                              <div className="flex justify-between mb-2">
                                <div>
                                  <h4 className="text-sm font-medium text-mono-900">{exp.title}</h4>
                                  <p className="text-sm text-mono-600">{exp.company}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-mono-600">{exp.dates}</p>
                                  <p className="text-sm text-mono-500">{exp.location}</p>
                                </div>
                              </div>
                              <p className="text-sm text-mono-600">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Skills & Certifications</h3>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-xs font-medium text-mono-700 mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {applicant.skills.map((skill, index) => (
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
                            <h4 className="text-xs font-medium text-mono-700 mb-2">Certifications</h4>
                            <div className="space-y-2">
                              {applicant.certifications.map((cert, index) => (
                                <div key={index} className="bg-white p-2 rounded border border-mono-200">
                                  <p className="text-sm font-medium text-mono-900">{cert.name}</p>
                                  <p className="text-xs text-mono-500">
                                    {cert.issuer} · Expires: {cert.expiry}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">References</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {applicant.references.map((ref, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                              <p className="text-sm font-medium text-mono-900">{ref.name}</p>
                              <p className="text-sm text-mono-600">{ref.title}</p>
                              <p className="text-sm text-mono-600">{ref.company}</p>
                              <div className="mt-2 space-y-1">
                                <div className="flex items-center">
                                  <Phone className="w-3 h-3 text-mono-400 mr-1" />
                                  <a href={`tel:${ref.phone}`} className="text-sm text-accent hover:underline">
                                    {ref.phone}
                                  </a>
                                </div>
                                <div className="flex items-center">
                                  <Mail className="w-3 h-3 text-mono-400 mr-1" />
                                  <a href={`mailto:${ref.email}`} className="text-sm text-accent hover:underline">
                                    {ref.email}
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Interview Notes</h3>
                        <div className="space-y-4">
                          {applicant.notes.map((note, index) => (
                            <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-mono-900">{note.author}</span>
                                <span className="text-xs text-mono-500">{note.date}</span>
                              </div>
                              <p className="text-sm text-mono-600">{note.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Applicant Details</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 text-mono-400 mr-2" />
                            <a href={`mailto:${applicant.email}`} className="text-sm text-accent hover:underline">
                              {applicant.email}
                            </a>
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 text-mono-400 mr-2" />
                            <a href={`tel:${applicant.phone}`} className="text-sm text-accent hover:underline">
                              {applicant.phone}
                            </a>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-mono-400 mr-2" />
                            <span className="text-sm text-mono-600">{applicant.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Education</h3>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-mono-900">{applicant.education.degree}</p>
                          <p className="text-sm text-mono-600">{applicant.education.school}</p>
                          <p className="text-sm text-mono-500">Class of {applicant.education.graduationYear}</p>
                        </div>
                      </div>

                      {applicant.interviews.length > 0 && (
                        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Scheduled Interviews</h3>
                          <div className="space-y-3">
                            {applicant.interviews.map((interview, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-mono-900">{interview.type}</p>
                                  <p className="text-sm text-mono-600">
                                    {interview.date} at {interview.time}
                                  </p>
                                  <p className="text-sm text-mono-500">with {interview.interviewer}</p>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  interview.status === 'Scheduled' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {interview.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Salary Information</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-mono-500">Current:</span>
                            <span className="text-sm text-mono-900">${applicant.salary.current.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-mono-500">Expected:</span>
                            <span className="text-sm text-mono-900">${applicant.salary.expected.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-mono-500">Type:</span>
                            <span className="text-sm text-mono-900">{applicant.salary.type}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Documents</h3>
                        <div className="space-y-2">
                          {applicant.documents.map((doc, index) => (
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
            </React.Fragment>
          ))
        ) : (
          <EmptyState
            icon={FileSearch}
            title="No applicants found"
            message={
              activeFilter === 'all' 
                ? "No job applications have been received yet."
                : "No applicants found matching the selected filter."
            }
            action={{
              label: "Add Applicant",
              onClick: openModal
            }}
          />
        )}
      </div>
    </div>
  );
}