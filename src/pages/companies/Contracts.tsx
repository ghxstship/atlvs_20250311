import React, { useState } from 'react';
import { FileText, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, MapPin, Users, Building, Star, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import ContractForm from '../../components/forms/ContractForm';
import useModal from '../../hooks/useModal';
import EmptyState from '../../components/EmptyState';
import StatusBoxGrid from '../../components/StatusBoxGrid';

export default function Contracts() {
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
      console.error('Error creating contract:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const contracts = [
    {
      id: 1,
      title: 'Equipment Supply Agreement',
      company: 'Stage Systems Inc.',
      type: 'Supply',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      value: 250000,
      status: 'Active',
      description: 'Annual agreement for stage equipment supply and maintenance services.',
      terms: {
        payment: 'Net 30',
        renewal: 'Automatic annual renewal with 60-day notice',
        termination: '90-day notice required',
        insurance: 'Minimum $2M liability coverage required'
      },
      deliverables: [
        'Stage system components',
        'Rigging equipment',
        'Technical support',
        'Regular maintenance',
        'Emergency repairs'
      ],
      pricing: {
        base: 200000,
        maintenance: 30000,
        support: 20000
      },
      stakeholders: {
        owner: 'Sarah Chen',
        approver: 'Mike Thompson',
        legal: 'David Wilson',
        vendor: 'John Smith'
      },
      milestones: [
        { date: '2024-01-01', event: 'Contract Start', status: 'Completed' },
        { date: '2024-03-31', event: 'Q1 Review', status: 'Completed' },
        { date: '2024-06-30', event: 'Q2 Review', status: 'Pending' },
        { date: '2024-12-31', event: 'Contract End', status: 'Pending' }
      ],
      documents: [
        { name: 'contract.pdf', size: '2.4 MB', date: '2024-01-01' },
        { name: 'terms.pdf', size: '1.2 MB', date: '2024-01-01' },
        { name: 'pricing.xlsx', size: '0.8 MB', date: '2024-01-01' }
      ],
      notes: 'Key supplier relationship. Performance consistently meets expectations.',
      lastUpdated: '2024-03-15 14:30'
    }
  ];

  // Status box data
  const statusBoxes = [
    {
      title: 'Total Contracts',
      value: `${contracts.filter(c => c.status === 'Executed').length}`,
      subtitle: 'Executed contracts',
      icon: 'file'
    },
    {
      title: 'Pending',
      value: `${contracts.filter(c => c.status === 'Pending').length}`,
      subtitle: 'Under review',
      icon: 'check',
      type: 'warning'
    },
    {
      title: 'Draft',
      value: `${contracts.filter(c => c.status === 'Draft').length}`,
      subtitle: 'Not finalized',
      icon: 'alert',
      type: 'info'
    },
    {
      title: 'Archived',
      value: `${contracts.filter(c => c.status === 'Archived').length}`,
      subtitle: 'Past contracts',
      icon: 'archive',
      type: 'error'
    }
  ];

  const filteredContracts = activeFilter === 'all' 
    ? contracts 
    : contracts.filter(contract => {
        if (activeFilter === 'active') {
          return contract.status === 'Active';
        } else if (activeFilter === 'pending') {
          return contract.status === 'Pending';
        } else if (activeFilter === 'expired') {
          return contract.status === 'Expired';
        }
        return true;
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Contracts</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search contracts..."
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
            New Contract
          </button>
        </div>
      </div>

      <StatusBoxGrid boxes={statusBoxes} />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Create New Contract"
      >
        <ContractForm
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
            All Contracts
          </button>
          <button
            onClick={() => setActiveFilter('executed')}
            className={`px-4 py-2 ${activeFilter === 'executed' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Executed
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-4 py-2 ${activeFilter === 'pending' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveFilter('new')}
            className={`px-4 py-2 ${activeFilter === 'new' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            New
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
          <div className="col-span-2">Contract</div>
          <div>Company</div>
          <div>Type</div>
          <div>Value</div>
          <div>Status</div>
          <div></div>
        </div>
        
        {filteredContracts.length > 0 ? (
          filteredContracts.map(contract => (
            <React.Fragment key={contract.id}>
              <div 
                className={`grid grid-cols-7 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === contract.id ? 'bg-mono-50' : ''}`}
                onClick={() => toggleExpand(contract.id)}
              >
                <div className="col-span-2 flex items-center">
                  <FileText className="w-5 h-5 text-mono-400 mr-2" />
                  <div>
                    <div className="font-medium text-mono-900">{contract.title}</div>
                    <div className="text-sm text-mono-500">{contract.startDate} - {contract.endDate}</div>
                  </div>
                </div>
                <div className="text-mono-600">{contract.company}</div>
                <div className="text-mono-600">{contract.type}</div>
                <div className="text-mono-600">${contract.value.toLocaleString()}</div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    contract.status === 'Active' ? 'bg-green-100 text-green-800' :
                    contract.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {contract.status}
                  </span>
                </div>
                <div className="flex justify-end">
                  {expandedId === contract.id ? (
                    <ChevronUp className="w-5 h-5 text-mono-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-mono-400" />
                  )}
                </div>
              </div>

              {expandedId === contract.id && (
                <div className="col-span-7 bg-mono-50 p-6 border-b">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Contract Details</h3>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                          <p className="text-sm text-mono-600 mb-4">{contract.description}</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-xs font-medium text-mono-700 mb-2">Terms</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Payment Terms:</span>
                                  <span className="text-sm text-mono-900">{contract.terms.payment}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Renewal:</span>
                                  <span className="text-sm text-mono-900">{contract.terms.renewal}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Termination:</span>
                                  <span className="text-sm text-mono-900">{contract.terms.termination}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Insurance:</span>
                                  <span className="text-sm text-mono-900">{contract.terms.insurance}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-mono-700 mb-2">Deliverables</h4>
                              <ul className="list-disc pl-4 space-y-1">
                                {contract.deliverables.map((item, index) => (
                                  <li key={index} className="text-sm text-mono-600">{item}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Milestones</h3>
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                          <div className="grid grid-cols-3 gap-4 p-3 font-medium text-mono-700 border-b">
                            <div>Date</div>
                            <div>Event</div>
                            <div>Status</div>
                          </div>
                          {contract.milestones.map((milestone, index) => (
                            <div key={index} className="grid grid-cols-3 gap-4 p-3 border-b last:border-0">
                              <div className="text-sm text-mono-600">{milestone.date}</div>
                              <div className="text-sm text-mono-600">{milestone.event}</div>
                              <div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  milestone.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {milestone.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Notes</h3>
                        <p className="text-sm text-mono-600 bg-white p-3 rounded-lg shadow-sm">{contract.notes}</p>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Financial Details</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-mono-500">Base Value:</span>
                            <span className="text-sm text-mono-900">${contract.pricing.base.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-mono-500">Maintenance:</span>
                            <span className="text-sm text-mono-900">${contract.pricing.maintenance.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-mono-500">Support:</span>
                            <span className="text-sm text-mono-900">${contract.pricing.support.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-mono-100">
                            <span className="text-sm font-medium text-mono-900">Total Value:</span>
                            <span className="text-sm font-medium text-mono-900">${contract.value.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Stakeholders</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-mono-500">Contract Owner:</span>
                            <span className="text-sm text-mono-900">{contract.stakeholders.owner}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-mono-500">Approver:</span>
                            <span className="text-sm text-mono-900">{contract.stakeholders.approver}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-mono-500">Legal Review:</span>
                            <span className="text-sm text-mono-900">{contract.stakeholders.legal}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-mono-500">Vendor Contact:</span>
                            <span className="text-sm text-mono-900">{contract.stakeholders.vendor}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-mono-900 mb-3">Documents</h3>
                        <div className="space-y-2">
                          {contract.documents.map((doc, index) => (
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
                      View History
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
          ))
        ) : (
          <EmptyState
            icon={FileText}
            title="No contracts found"
            message={
              activeFilter === 'all' 
                ? "No contracts have been created yet."
                : "No contracts found matching the selected filter."
            }
            action={{
              label: "Create Contract",
              onClick: openModal
            }}
          />
        )}
      </div>
    </div>
  );
}