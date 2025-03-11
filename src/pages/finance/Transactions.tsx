import React, { useState } from 'react';
import { FileSpreadsheet, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, Building, Star, CheckCircle, AlertTriangle, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import TransactionForm from '../../components/forms/TransactionForm';
import useModal from '../../hooks/useModal';
import EmptyState from '../../components/EmptyState';
import StatusBoxGrid from '../../components/StatusBoxGrid';

export default function Transactions() {
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
      console.error('Error creating transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Sample transactions data
  const transactions = [
    {
      id: 1,
      transactionId: 'TRX-2024-001',
      type: 'credit',
      category: 'Event Revenue',
      description: 'Ticket Sales Revenue',
      project: 'Summer Music Festival',
      account: '4001 - Event Revenue',
      amount: 45000,
      date: '2024-03-15',
      status: 'Completed',
      paymentMethod: 'Bank Transfer',
      reference: 'INV-2024-125',
      breakdown: {
        vipTickets: { description: 'VIP Ticket Sales', amount: 25000 },
        generalAdmission: { description: 'General Admission', amount: 15000 },
        merchandise: { description: 'Pre-sale Merchandise', amount: 5000 }
      },
      reconciliation: {
        status: 'Reconciled',
        date: '2024-03-16',
        by: 'Sarah Chen',
        notes: 'All amounts verified against bank statement'
      },
      documents: [
        { name: 'bank_statement.pdf', size: '1.2 MB', date: '2024-03-16' },
        { name: 'sales_report.pdf', size: '2.4 MB', date: '2024-03-15' }
      ],
      notes: 'Consolidated ticket sales revenue for opening weekend.',
      metadata: {
        department: 'Sales',
        costCenter: 'CC001',
        taxCategory: 'Revenue',
        accountingPeriod: 'Q1 2024'
      }
    },
    {
      id: 2,
      transactionId: 'TRX-2024-002',
      type: 'debit',
      category: 'Equipment',
      description: 'Stage Equipment Purchase',
      project: 'Summer Music Festival',
      account: '5001 - Equipment Expenses',
      amount: 21000,
      date: '2024-03-14',
      status: 'Pending',
      paymentMethod: 'Corporate Card',
      reference: 'PO-2024-089',
      breakdown: {
        lighting: { description: 'LED Lighting System', amount: 12000 },
        sound: { description: 'Sound Equipment', amount: 7000 },
        accessories: { description: 'Cables and Accessories', amount: 2000 }
      },
      reconciliation: {
        status: 'Pending',
        date: null,
        by: null,
        notes: 'Awaiting credit card statement'
      },
      documents: [
        { name: 'purchase_order.pdf', size: '1.8 MB', date: '2024-03-14' },
        { name: 'invoice.pdf', size: '1.2 MB', date: '2024-03-14' }
      ],
      notes: 'Equipment purchase for main stage setup.',
      metadata: {
        department: 'Production',
        costCenter: 'CC002',
        taxCategory: 'Capital Expense',
        accountingPeriod: 'Q1 2024'
      }
    },
    {
      id: 3,
      transactionId: 'TRX-2024-003',
      type: 'debit',
      category: 'Labor',
      description: 'Crew Payment',
      project: 'Corporate Event',
      account: '5002 - Labor Expenses',
      amount: 15000,
      date: '2024-03-13',
      status: 'Processing',
      paymentMethod: 'Direct Deposit',
      reference: 'PAY-2024-156',
      breakdown: {
        technicians: { description: 'Technical Staff', amount: 8000 },
        stageHands: { description: 'Stage Crew', amount: 5000 },
        overtime: { description: 'Overtime Hours', amount: 2000 }
      },
      reconciliation: {
        status: 'In Progress',
        date: null,
        by: 'Mike Thompson',
        notes: 'Verifying overtime calculations'
      },
      documents: [
        { name: 'timesheet.pdf', size: '2.1 MB', date: '2024-03-13' },
        { name: 'payroll_summary.pdf', size: '1.5 MB', date: '2024-03-13' }
      ],
      notes: 'Weekly crew payment including overtime for extended setup.',
      metadata: {
        department: 'Operations',
        costCenter: 'CC003',
        taxCategory: 'Payroll',
        accountingPeriod: 'Q1 2024'
      }
    }
  ];

  // Status box data
  const statusBoxes = [
    {
      title: 'Credits',
      value: `$${transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}`,
      trend: { direction: 'up' as const, value: '+15% from last month' },
      icon: 'dollar',
      type: 'success'
    },
    {
      title: 'Debits',
      value: `$${transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}`,
      trend: { direction: 'down' as const, value: '-8% from last month' },
      icon: 'dollar',
      type: 'error'
    }
  ];

  const filteredTransactions = activeFilter === 'all' 
    ? transactions 
    : transactions.filter(transaction => {
        if (activeFilter === 'credits') {
          return transaction.type === 'credit';
        } else if (activeFilter === 'debits') {
          return transaction.type === 'debit';
        }
        return true;
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Transactions</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search transactions..."
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
            Add Transaction
          </button>
        </div>
      </div>

      <StatusBoxGrid boxes={statusBoxes} columns={2} />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Add New Transaction"
      >
        <TransactionForm
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
            All Transactions
          </button>
          <button
            onClick={() => setActiveFilter('credits')}
            className={`px-4 py-2 ${activeFilter === 'credits' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Credits
          </button>
          <button
            onClick={() => setActiveFilter('debits')}
            className={`px-4 py-2 ${activeFilter === 'debits' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Debits
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <div className="min-w-[1200px]">
          <div className="grid grid-cols-12 gap-4 p-4 font-medium text-mono-700 border-b">
            <div className="col-span-1">Transaction ID</div>
            <div className="col-span-1">Project</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Description</div>
            <div className="col-span-2">Account</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1"></div>
          </div>
          
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map(transaction => (
              <React.Fragment key={transaction.id}>
                <div 
                  className={`grid grid-cols-12 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === transaction.id ? 'bg-mono-50' : ''}`}
                  onClick={() => toggleExpand(transaction.id)}
                >
                  <div className="col-span-1 font-mono text-sm text-mono-600">{transaction.transactionId}</div>
                  <div className="col-span-1 text-mono-600">{transaction.project}</div>
                  <div className="col-span-2 text-mono-600">{transaction.category}</div>
                  <div className="col-span-2 text-mono-600">{transaction.description}</div>
                  <div className="col-span-2 text-mono-600">{transaction.account}</div>
                  <div className="col-span-2 text-right flex items-center justify-end">
                    {transaction.type === 'credit' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`font-medium ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${transaction.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    {expandedId === transaction.id ? (
                      <ChevronUp className="w-5 h-5 text-mono-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-mono-400" />
                    )}
                  </div>
                </div>

                {expandedId === transaction.id && (
                  <div className="col-span-12 bg-mono-50 p-6 border-b">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-2">
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Transaction Details</h3>
                          <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="space-y-4">
                              {Object.entries(transaction.breakdown).map(([category, data]) => (
                                <div key={category} className="flex justify-between items-center">
                                  <div>
                                    <span className="text-sm font-medium text-mono-900">{data.description}</span>
                                  </div>
                                  <span className="text-sm font-medium text-mono-900">
                                    ${data.amount.toLocaleString()}
                                  </span>
                                </div>
                              ))}
                              <div className="pt-3 mt-3 border-t border-mono-200">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-mono-900">Total</span>
                                  <span className="text-sm font-medium text-mono-900">
                                    ${transaction.amount.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Reconciliation Status</h3>
                          <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm text-mono-500">Status:</span>
                                <span className={`text-sm font-medium ${
                                  transaction.reconciliation.status === 'Reconciled' ? 'text-green-600' :
                                  transaction.reconciliation.status === 'In Progress' ? 'text-blue-600' :
                                  'text-yellow-600'
                                }`}>
                                  {transaction.reconciliation.status}
                                </span>
                              </div>
                              {transaction.reconciliation.date && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Reconciled Date:</span>
                                  <span className="text-sm text-mono-900">{transaction.reconciliation.date}</span>
                                </div>
                              )}
                              {transaction.reconciliation.by && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-mono-500">Reconciled By:</span>
                                  <span className="text-sm text-mono-900">{transaction.reconciliation.by}</span>
                                </div>
                              )}
                              {transaction.reconciliation.notes && (
                                <div className="mt-2 text-sm text-mono-600">
                                  {transaction.reconciliation.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Notes</h3>
                          <p className="text-sm text-mono-600 bg-white p-3 rounded-lg shadow-sm">{transaction.notes}</p>
                        </div>
                      </div>

                      <div>
                        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Transaction Information</h3>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 text-mono-400 mr-2" />
                              <span className="text-sm text-mono-500 mr-2">Date:</span>
                              <span className="text-sm text-mono-900">{transaction.date}</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 text-mono-400 mr-2" />
                              <span className="text-sm text-mono-500 mr-2">Payment Method:</span>
                              <span className="text-sm text-mono-900">{transaction.paymentMethod}</span>
                            </div>
                            <div className="flex items-center">
                              <Tag className="w-4 h-4 text-mono-400 mr-2" />
                              <span className="text-sm text-mono-500 mr-2">Reference:</span>
                              <span className="text-sm text-mono-900">{transaction.reference}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Metadata</h3>
                          <div className="space-y-2">
                            {Object.entries(transaction.metadata).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-sm text-mono-500 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                                </span>
                                <span className="text-sm text-mono-900">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Documents</h3>
                          <div className="space-y-2">
                            {transaction.documents.map((doc, index) => (
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
              icon={FileSpreadsheet}
              title="No transactions found"
              message={
                activeFilter === 'all' 
                  ? "No transactions have been recorded yet."
                  : "No transactions found matching the selected filter."
              }
              action={{
                label: "Add Transaction",
                onClick: openModal
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}