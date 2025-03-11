import React, { useState } from 'react';
import { RadioTower, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, Phone, Mail, Building, Star, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import BidForm from '../../components/forms/BidForm';
import useModal from '../../hooks/useModal';
import StatusBoxGrid from '../../components/StatusBoxGrid';

export default function Bids() {
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
      console.error('Error creating bid:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const bids = [
    {
      id: 'BID-2024-001',
      title: 'Stage Equipment Supply',
      company: 'Stage Systems Inc.',
      project: 'Summer Music Festival 2024',
      jobId: 'JOB-2024-001',
      amount: 75000,
      submittedDate: '2024-03-10',
      dueDate: '2024-03-25',
      status: 'Under Review',
      description: 'Comprehensive bid for stage equipment supply including modular staging, rigging, and safety equipment.',
      type: 'Equipment Supply',
      contact: {
        name: 'John Smith',
        title: 'Sales Director',
        phone: '(555) 123-4567',
        email: 'john.smith@stagesystems.com'
      },
      requirements: {
        technical: [
          'Modular stage system - 40ft x 30ft',
          'Complete rigging package',
          'Safety barriers and equipment',
          'Load-bearing capacity: 750kg/sqm'
        ],
        delivery: [
          'Delivery by June 1, 2024',
          'Installation included',
          'On-site technical support',
          'Training for local crew'
        ],
        compliance: [
          'ISO 9001:2015 certification',
          'Safety certifications',
          'Insurance requirements',
          'Warranty documentation'
        ]
      },
      evaluation: {
        technical: 85,
        commercial: 78,
        timeline: 90,
        overall: 84
      },
      competitors: [
        { name: 'Pro Stage Co', amount: 82000, status: 'Rejected' },
        { name: 'Event Tech Ltd', amount: 79000, status: 'Rejected' }
      ],
      documents: [
        { name: 'technical_proposal.pdf', size: '3.2 MB', date: '2024-03-10' },
        { name: 'pricing_breakdown.xlsx', size: '1.8 MB', date: '2024-03-10' },
        { name: 'compliance_docs.pdf', size: '2.4 MB', date: '2024-03-10' }
      ],
      timeline: [
        { date: '2024-03-10', event: 'Bid Submitted', status: 'Completed' },
        { date: '2024-03-15', event: 'Technical Review', status: 'Completed' },
        { date: '2024-03-20', event: 'Commercial Review', status: 'Completed' },
        { date: '2024-03-25', event: 'Contract Award', status: 'Pending' }
      ],
      notes: [
        { date: '2024-03-25', author: 'David Chen', text: 'Technical evaluation completed successfully.' },
        { date: '2024-03-20', author: 'Lisa Thompson', text: 'Pricing within acceptable range.' }
      ]
    }
  ];

  // Status box data
  const statusBoxes = [
    {
      title: 'Total Bids',
      value: `${bids.filter(b => b.status === 'Awarded').length}`,
      subtitle: 'Awarded bids',
      icon: 'file'
    },
    {
      title: 'Pending Review',
      value: `${bids.filter(b => b.status === 'Pending Review').length}`,
      subtitle: 'Under evaluation',
      icon: 'clock',
      type: 'info'
    },
    {
      title: 'New',
      value: `${bids.filter(b => b.status === 'New').length}`,
      subtitle: 'Recently submitted',
      icon: 'alert',
      type: 'warning'
    },
    {
      title: 'Archived',
      value: `${bids.filter(b => b.status === 'Archived').length}`,
      subtitle: 'Past bids',
      icon: 'archive',
      type: 'error'
    }
  ];

  const filteredBids = activeFilter === 'all' 
    ? bids 
    : bids.filter(bid => {
        if (activeFilter === 'awarded') {
          return bid.status === 'Awarded';
        } else if (activeFilter === 'underReview') {
          return bid.status === 'Under Review';
        } else if (activeFilter === 'rejected') {
          return bid.status === 'Rejected';
        }
        return true;
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Bids</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search bids..."
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
            New Bid
          </button>
        </div>
      </div>

      <StatusBoxGrid boxes={statusBoxes} />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Create New Bid"
      >
        <BidForm
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
            All Bids
          </button>
          <button
            onClick={() => setActiveFilter('awarded')}
            className={`px-4 py-2 ${activeFilter === 'awarded' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Awarded
          </button>
          <button
            onClick={() => setActiveFilter('pendingReview')}
            className={`px-4 py-2 ${activeFilter === 'pendingReview' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Pending Review
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
        <div className="grid grid-cols-7 gap-4 p-4 font-medium text-mono-700 border-b">
          <div>Bid ID</div>
          <div className="col-span-2">Title</div>
          <div>Company</div>
          <div>Due Date</div>
          <div className="text-right">Amount</div>
          <div>Status</div>
        </div>
        
        {filteredBids.map(bid => (
          <React.Fragment key={bid.id}>
            <div 
              className={`grid grid-cols-7 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === bid.id ? 'bg-mono-50' : ''}`}
              onClick={() => toggleExpand(bid.id)}
            >
              <div className="font-mono text-sm text-mono-600">{bid.id}</div>
              <div className="col-span-2 flex items-center">
                <RadioTower className="w-5 h-5 text-mono-400 mr-2" />
                <div>
                  <div className="font-medium text-mono-900">{bid.title}</div>
                  <div className="text-sm text-mono-500">Project: {bid.project}</div>
                </div>
              </div>
              <div className="text-mono-600">{bid.company}</div>
              <div className="text-mono-600">{bid.dueDate}</div>
              <div className="text-right text-mono-600">${bid.amount.toLocaleString()}</div>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  bid.status === 'Awarded' ? 'bg-green-100 text-green-800' :
                  bid.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {bid.status}
                </span>
              </div>
            </div>

            {expandedId === bid.id && (
              <div className="col-span-7 bg-mono-50 p-6 border-b">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Bid Details</h3>
                      <div className="bg-white rounded-lg shadow-sm p-4">
                        <p className="text-sm text-mono-600 mb-4">{bid.description}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-xs font-medium text-mono-700 mb-2">Technical Requirements</h4>
                            <ul className="list-disc pl-4">
                              {bid.requirements.technical.map((req, index) => (
                                <li key={index} className="text-sm text-mono-600">{req}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-mono-700 mb-2">Delivery Requirements</h4>
                            <ul className="list-disc pl-4">
                              {bid.requirements.delivery.map((req, index) => (
                                <li key={index} className="text-sm text-mono-600">{req}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Evaluation Scores</h3>
                      <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <div className="text-center mb-2">
                              <span className="text-2xl font-semibold text-mono-900">{bid.evaluation.overall}</span>
                              <span className="text-sm text-mono-500">/100</span>
                            </div>
                            <p className="text-xs text-mono-500 text-center">Overall Score</p>
                          </div>
                          <div>
                            <div className="text-center mb-2">
                              <span className="text-2xl font-semibold text-mono-900">{bid.evaluation.technical}</span>
                              <span className="text-sm text-mono-500">/100</span>
                            </div>
                            <p className="text-xs text-mono-500 text-center">Technical</p>
                          </div>
                          <div>
                            <div className="text-center mb-2">
                              <span className="text-2xl font-semibold text-mono-900">{bid.evaluation.commercial}</span>
                              <span className="text-sm text-mono-500">/100</span>
                            </div>
                            <p className="text-xs text-mono-500 text-center">Commercial</p>
                          </div>
                          <div>
                            <div className="text-center mb-2">
                              <span className="text-2xl font-semibold text-mono-900">{bid.evaluation.timeline}</span>
                              <span className="text-sm text-mono-500">/100</span>
                            </div>
                            <p className="text-xs text-mono-500 text-center">Timeline</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Competitive Analysis</h3>
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="grid grid-cols-3 gap-4 p-3 font-medium text-mono-700 border-b">
                          <div>Company</div>
                          <div>Bid Amount</div>
                          <div>Status</div>
                        </div>
                        {bid.competitors.map((competitor, index) => (
                          <div key={index} className="grid grid-cols-3 gap-4 p-3 border-b last:border-0">
                            <div className="text-sm text-mono-600">{competitor.name}</div>
                            <div className="text-sm text-mono-600">${competitor.amount.toLocaleString()}</div>
                            <div className="text-sm text-mono-600">{competitor.status}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Timeline</h3>
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="grid grid-cols-3 gap-4 p-3 font-medium text-mono-700 border-b">
                          <div>Date</div>
                          <div>Event</div>
                          <div>Status</div>
                        </div>
                        {bid.timeline.map((event, index) => (
                          <div key={index} className="grid grid-cols-3 gap-4 p-3 border-b last:border-0">
                            <div className="text-sm text-mono-600">{event.date}</div>
                            <div className="text-sm text-mono-600">{event.event}</div>
                            <div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                event.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                event.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {event.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Contact Information</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-mono-900">{bid.contact.name}</p>
                          <p className="text-sm text-mono-600">{bid.contact.title}</p>
                          <div className="mt-2 space-y-1">
                            <a href={`tel:${bid.contact.phone}`} className="text-sm text-accent hover:underline flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {bid.contact.phone}
                            </a>
                            <a href={`mailto:${bid.contact.email}`} className="text-sm text-accent hover:underline flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {bid.contact.email}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Compliance Requirements</h3>
                      <ul className="list-disc pl-4 space-y-1">
                        {bid.requirements.compliance.map((req, index) => (
                          <li key={index} className="text-sm text-mono-600">{req}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Documents</h3>
                      <div className="space-y-2">
                        {bid.documents.map((doc, index) => (
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

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Notes</h3>
                      <div className="space-y-3">
                        {bid.notes.map((note, index) => (
                          <div key={index} className="bg-mono-50 p-3 rounded-lg">
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
                </div>

                <div className="mt-6 pt-6 border-t border-mono-200 flex justify-end space-x-3">
                  <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                    Review Bid
                  </button>
                  <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                    Compare
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