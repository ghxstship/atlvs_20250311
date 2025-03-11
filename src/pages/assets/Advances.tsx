import React, { useState } from 'react';
import { ClipboardList, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, Building, Star, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import AdvanceForm from '../../components/forms/AdvanceForm';
import useModal from '../../hooks/useModal';
import StatusBoxGrid from '../../components/StatusBoxGrid';

export default function Advances() {
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
      console.error('Error creating advance request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const advances = [
    {
      id: 1,
      advanceId: 'ADV-2024-001',
      jobId: 'JOB-2024-001',
      project: 'Summer Music Festival',
      company: 'Stage Systems Inc.',
      team: 'Production Team A',
      submittedBy: 'John Smith',
      submittedDate: '2024-03-10',
      startDate: '2024-06-15',
      endDate: '2024-06-18',
      duration: 4,
      siteLocation: 'Main Stage Area',
      status: 'Pending Approval',
      value: 25000,
      lineItems: [
        { category: 'Audio', item: 'Line Array System', quantity: 1, cost: 12000 },
        { category: 'Lighting', item: 'Moving Head Package', quantity: 1, cost: 8000 },
        { category: 'Labor', item: 'Setup Crew', quantity: 8, cost: 5000 }
      ],
      approvals: [
        { role: 'Department Head', name: 'Sarah Chen', status: 'Approved', date: '2024-03-11' },
        { role: 'Finance Manager', name: 'Mike Thompson', status: 'Pending', date: null },
        { role: 'Operations Director', name: 'David Wilson', status: 'Pending', date: null }
      ],
      documents: [
        { name: 'advance_request.pdf', size: '1.2 MB', date: '2024-03-10' },
        { name: 'budget_breakdown.xlsx', size: '0.8 MB', date: '2024-03-10' },
        { name: 'equipment_list.pdf', size: '2.4 MB', date: '2024-03-10' }
      ],
      notes: 'Equipment and labor advance for festival main stage setup.',
      history: [
        { date: '2024-03-11', action: 'Department Approval', user: 'Sarah Chen', notes: 'Approved equipment list and labor requirements' },
        { date: '2024-03-10', action: 'Submission', user: 'John Smith', notes: 'Initial advance request submitted' }
      ],
      lastUpdated: '2024-03-11 09:30'
    }
  ];

  // Status box data
  const statusBoxes = [
    {
      title: 'Total Advances',
      value: advances.length.toString(),
      subtitle: 'Active requests',
      icon: 'file'
    },
    {
      title: 'Pending',
      value: advances.filter(a => a.status === 'Pending Approval').length.toString(),
      subtitle: 'Awaiting approval',
      icon: 'clock',
      type: 'warning'
    },
    {
      title: 'Approved',
      value: advances.filter(a => a.status === 'Approved').length.toString(),
      subtitle: 'Ready to proceed',
      icon: 'check',
      type: 'success'
    },
    {
      title: 'Total Value',
      value: `$${advances.reduce((sum, a) => sum + a.value, 0).toLocaleString()}`,
      subtitle: 'Combined value',
      icon: 'dollar',
      type: 'info'
    }
  ];

  const filteredAdvances = activeFilter === 'all' 
    ? advances 
    : advances.filter(advance => {
        if (activeFilter === 'pending') {
          return advance.status === 'Pending Approval';
        } else if (activeFilter === 'approved') {
          return advance.status === 'Approved';
        }
        return true;
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Advances</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search advances..."
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
            New Advance
          </button>
        </div>
      </div>

      <StatusBoxGrid boxes={statusBoxes} />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Create New Advance"
      >
        <AdvanceForm
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
            All Advances
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-4 py-2 ${activeFilter === 'pending' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveFilter('approved')}
            className={`px-4 py-2 ${activeFilter === 'approved' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Approved
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-7 gap-4 p-4 font-medium text-mono-700 border-b">
          <div>Advance ID</div>
          <div>Job ID</div>
          <div>Project</div>
          <div>Company</div>
          <div>Team</div>
          <div>Status</div>
          <div></div>
        </div>
        
        {filteredAdvances.map(advance => (
          <React.Fragment key={advance.id}>
            <div 
              className={`grid grid-cols-7 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === advance.id ? 'bg-mono-50' : ''}`}
              onClick={() => toggleExpand(advance.id)}
            >
              <div className="font-mono text-sm text-mono-600">{advance.advanceId}</div>
              <div className="font-mono text-sm text-mono-600">{advance.jobId}</div>
              <div className="text-mono-600">{advance.project}</div>
              <div className="text-mono-600">{advance.company}</div>
              <div className="text-mono-600">{advance.team}</div>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  advance.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  advance.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {advance.status}
                </span>
              </div>
              <div className="flex justify-end">
                {expandedId === advance.id ? (
                  <ChevronUp className="w-5 h-5 text-mono-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-mono-400" />
                )}
              </div>
            </div>

            {expandedId === advance.id && (
              <div className="col-span-7 bg-mono-50 p-6 border-b">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Line Items</h3>
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="grid grid-cols-4 gap-4 p-3 font-medium text-mono-700 border-b">
                          <div>Category</div>
                          <div>Item</div>
                          <div className="text-right">Quantity</div>
                          <div className="text-right">Cost</div>
                        </div>
                        {advance.lineItems.map((item, index) => (
                          <div key={index} className="grid grid-cols-4 gap-4 p-3 border-b last:border-0">
                            <div className="text-sm text-mono-600">{item.category}</div>
                            <div className="text-sm text-mono-600">{item.item}</div>
                            <div className="text-sm text-mono-600 text-right">{item.quantity}</div>
                            <div className="text-sm text-mono-600 text-right">${item.cost.toLocaleString()}</div>
                          </div>
                        ))}
                        <div className="grid grid-cols-4 gap-4 p-3 bg-mono-50">
                          <div className="col-span-3 text-right font-medium text-mono-900">Total:</div>
                          <div className="text-right font-medium text-mono-900">
                            ${advance.lineItems.reduce((sum, item) => sum + item.cost, 0).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Approval Chain</h3>
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="grid grid-cols-4 gap-4 p-3 font-medium text-mono-700 border-b">
                          <div>Role</div>
                          <div>Name</div>
                          <div>Status</div>
                          <div>Date</div>
                        </div>
                        {advance.approvals.map((approval, index) => (
                          <div key={index} className="grid grid-cols-4 gap-4 p-3 border-b last:border-0">
                            <div className="text-sm text-mono-600">{approval.role}</div>
                            <div className="text-sm text-mono-600">{approval.name}</div>
                            <div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                approval.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {approval.status}
                              </span>
                            </div>
                            <div className="text-sm text-mono-600">{approval.date || '-'}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-mono-900 mb-3">History</h3>
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="grid grid-cols-4 gap-4 p-3 font-medium text-mono-700 border-b">
                          <div>Date</div>
                          <div>Action</div>
                          <div>User</div>
                          <div>Notes</div>
                        </div>
                        {advance.history.map((record, index) => (
                          <div key={index} className="grid grid-cols-4 gap-4 p-3 border-b last:border-0">
                            <div className="text-sm text-mono-600">{record.date}</div>
                            <div className="text-sm text-mono-600">{record.action}</div>
                            <div className="text-sm text-mono-600">{record.user}</div>
                            <div className="text-sm text-mono-600">{record.notes}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Request Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-mono-400 mr-2" />
                          <span className="text-sm text-mono-500 mr-2">Start Date:</span>
                          <span className="text-sm text-mono-900">{advance.startDate}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-mono-400 mr-2" />
                          <span className="text-sm text-mono-500 mr-2">End Date:</span>
                          <span className="text-sm text-mono-900">{advance.endDate}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-mono-400 mr-2" />
                          <span className="text-sm text-mono-500 mr-2">Duration:</span>
                          <span className="text-sm text-mono-900">{advance.duration} days</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-mono-400 mr-2" />
                          <span className="text-sm text-mono-500 mr-2">Location:</span>
                          <span className="text-sm text-mono-900">{advance.siteLocation}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-mono-400 mr-2" />
                          <span className="text-sm text-mono-500 mr-2">Submitted By:</span>
                          <span className="text-sm text-mono-900">{advance.submittedBy}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-mono-400 mr-2" />
                          <span className="text-sm text-mono-500 mr-2">Submitted Date:</span>
                          <span className="text-sm text-mono-900">{advance.submittedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                      <h3 className="text-sm font-medium text-mono-900 mb-3">Documents</h3>
                      <div className="space-y-2">
                        {advance.documents.map((doc, index) => (
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
                      <p className="text-sm text-mono-600">{advance.notes}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-mono-200 flex justify-end space-x-3">
                  <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                    Approve Request
                  </button>
                  <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                    Generate Report
                  </button>
                  <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                    Download PDF
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