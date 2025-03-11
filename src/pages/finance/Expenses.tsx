import React, { useState } from 'react';
import { FileText, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText as FileIcon, MapPin, Users, Phone, Mail, Building, Star, CheckCircle, AlertTriangle, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import ExpenseForm from '../../components/forms/ExpenseForm';
import useModal from '../../hooks/useModal';
import EmptyState from '../../components/EmptyState';
import StatusBoxGrid from '../../components/StatusBoxGrid';

export default function Expenses() {
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
      console.error('Error creating expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Sample expenses data
  const expenses = [
    {
      id: 1,
      expenseId: 'EXP-2024-001',
      description: 'Stage Equipment Rental',
      category: 'Equipment',
      project: 'Summer Music Festival',
      account: '5001 - Equipment Expenses',
      amount: 25000,
      date: '2024-03-15',
      status: 'Approved',
      paymentMethod: 'Bank Transfer',
      vendor: 'Pro Stage Systems',
      breakdown: {
        mainStage: { description: 'Main Stage System', amount: 15000 },
        lighting: { description: 'Lighting Package', amount: 7000 },
        sound: { description: 'Sound System', amount: 3000 }
      },
      approvals: [
        { name: 'Sarah Chen', role: 'Production Manager', date: '2024-03-14', status: 'Approved' },
        { name: 'Mike Thompson', role: 'Finance Director', date: '2024-03-15', status: 'Approved' }
      ],
      documents: [
        { name: 'invoice.pdf', size: '1.2 MB', date: '2024-03-15' },
        { name: 'rental_agreement.pdf', size: '2.4 MB', date: '2024-03-15' },
        { name: 'equipment_list.xlsx', size: '0.8 MB', date: '2024-03-15' }
      ],
      notes: 'Equipment rental for main stage setup including delivery and installation.',
      contact: {
        name: 'John Martinez',
        email: 'john.m@prostagesystems.com',
        phone: '(555) 123-4567'
      },
      metadata: {
        department: 'Production',
        costCenter: 'CC001',
        taxCategory: 'Rental Equipment',
        accountingPeriod: 'Q1 2024'
      }
    },
    {
      id: 2,
      expenseId: 'EXP-2024-002',
      description: 'Staff Transportation',
      category: 'Travel',
      project: 'Corporate Event',
      account: '5002 - Travel Expenses',
      amount: 3500,
      date: '2024-03-14',
      status: 'Pending',
      paymentMethod: 'Corporate Card',
      vendor: 'Premier Transport Services',
      breakdown: {
        vehicles: { description: 'Shuttle Service', amount: 2500 },
        fuel: { description: 'Fuel Charges', amount: 500 },
        parking: { description: 'Parking Fees', amount: 500 }
      },
      approvals: [
        { name: 'David Wilson', role: 'Operations Manager', date: '2024-03-14', status: 'Approved' },
        { name: 'Sarah Chen', role: 'Production Manager', date: null, status: 'Pending' }
      ],
      documents: [
        { name: 'transport_invoice.pdf', size: '1.1 MB', date: '2024-03-14' },
        { name: 'route_schedule.pdf', size: '0.9 MB', date: '2024-03-14' }
      ],
      notes: 'Staff transportation for corporate event setup and breakdown.',
      contact: {
        name: 'Lisa Thompson',
        email: 'lisa.t@premiertransport.com',
        phone: '(555) 234-5678'
      },
      metadata: {
        department: 'Operations',
        costCenter: 'CC002',
        taxCategory: 'Travel',
        accountingPeriod: 'Q1 2024'
      }
    },
    {
      id: 3,
      expenseId: 'EXP-2024-003',
      description: 'Catering Services',
      category: 'Food & Beverage',
      project: 'Theater Production',
      account: '5003 - Catering Expenses',
      amount: 5500,
      date: '2024-03-13',
      status: 'Processing',
      paymentMethod: 'Invoice',
      vendor: 'Gourmet Events Catering',
      breakdown: {
        meals: { description: 'Crew Meals', amount: 3500 },
        beverages: { description: 'Beverages', amount: 1200 },
        service: { description: 'Service Staff', amount: 800 }
      },
      approvals: [
        { name: 'Emily Brown', role: 'Event Manager', date: '2024-03-13', status: 'Approved' }
      ],
      documents: [
        { name: 'catering_invoice.pdf', size: '1.5 MB', date: '2024-03-13' },
        { name: 'menu_details.pdf', size: '0.7 MB', date: '2024-03-13' }
      ],
      notes: 'Catering services for production team during technical rehearsals.',
      contact: {
        name: 'Maria Garcia',
        email: 'maria.g@gourmetevents.com',
        phone: '(555) 345-6789'
      },
      metadata: {
        department: 'Production',
        costCenter: 'CC003',
        taxCategory: 'Catering',
        accountingPeriod: 'Q1 2024'
      }
    }
  ];

  // Status box data
  const statusBoxes = [
    {
      title: 'Total Expenses',
      value: `$${expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}`,
      trend: { direction: 'down' as const, value: '-5.2% from last month' },
      icon: 'dollar',
      type: 'error'
    },
    {
      title: 'Completed',
      value: `$${expenses.filter(e => e.status === 'Completed').reduce((sum, e) => sum + e.amount, 0).toLocaleString()}`,
      subtitle: 'Successfully processed',
      icon: 'check',
      type: 'success'
    },
    {
      title: 'Processing',
      value: `$${expenses.filter(e => e.status === 'Processing').reduce((sum, e) => sum + e.amount, 0).toLocaleString()}`,
      subtitle: 'In review',
      icon: 'clock',
      type: 'info'
    },
    {
      title: 'Forecasted',
      value: `$${expenses.filter(e => e.status === 'Forecasted').reduce((sum, e) => sum + e.amount, 0).toLocaleString()}`,
      subtitle: 'Future expenses',
      icon: 'trending',
      type: 'warning'
    }
  ];

  const filteredExpenses = activeFilter === 'all' 
    ? expenses 
    : expenses.filter(expense => {
        if (activeFilter === 'approved') {
          return expense.status === 'Approved';
        } else if (activeFilter === 'pending') {
          return expense.status === 'Pending';
        } else if (activeFilter === 'processing') {
          return expense.status === 'Processing';
        }
        return true;
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Expenses</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search expenses..."
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
            Add Expense
          </button>
        </div>
      </div>

      <StatusBoxGrid boxes={statusBoxes} />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Add New Expense"
      >
        <ExpenseForm
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
            All Expenses
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-4 py-2 ${activeFilter === 'completed' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveFilter('processing')}
            className={`px-4 py-2 ${activeFilter === 'processing' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Processing
          </button>
          <button
            onClick={() => setActiveFilter('forecasted')}
            className={`px-4 py-2 ${activeFilter === 'forecasted' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Forecasted
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <div className="min-w-[1200px]">
          <div className="grid grid-cols-12 gap-4 p-4 font-medium text-mono-700 border-b">
            <div className="col-span-1">Expense ID</div>
            <div className="col-span-1">Project</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Description</div>
            <div className="col-span-2">Account</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1"></div>
          </div>
          
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map(expense => (
              <React.Fragment key={expense.id}>
                <div 
                  className={`grid grid-cols-12 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === expense.id ? 'bg-mono-50' : ''}`}
                  onClick={() => toggleExpand(expense.id)}
                >
                  <div className="col-span-1 font-mono text-sm text-mono-600">{expense.expenseId}</div>
                  <div className="col-span-1 text-mono-600">{expense.project}</div>
                  <div className="col-span-2 text-mono-600">{expense.category}</div>
                  <div className="col-span-2 text-mono-600">{expense.description}</div>
                  <div className="col-span-2 text-mono-600">{expense.account}</div>
                  <div className="col-span-2 text-right text-mono-600">
                    <ArrowDownRight className="w-4 h-4 text-red-500 mr-1 inline-block" />
                    <span className="font-medium text-red-600">
                      ${expense.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      expense.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      expense.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {expense.status}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    {expandedId === expense.id ? (
                      <ChevronUp className="w-5 h-5 text-mono-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-mono-400" />
                    )}
                  </div>
                </div>

                {expandedId === expense.id && (
                  <div className="col-span-12 bg-mono-50 p-6 border-b">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-2">
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Expense Breakdown</h3>
                          <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="space-y-4">
                              {Object.entries(expense.breakdown).map(([category, data]) => (
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
                                    ${expense.amount.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Approval Chain</h3>
                          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="grid grid-cols-4 gap-4 p-3 font-medium text-mono-700 border-b">
                              <div>Name</div>
                              <div>Role</div>
                              <div>Date</div>
                              <div>Status</div>
                            </div>
                            {expense.approvals.map((approval, index) => (
                              <div key={index} className="grid grid-cols-4 gap-4 p-3 border-b last:border-0">
                                <div className="text-sm text-mono-600">{approval.name}</div>
                                <div className="text-sm text-mono-600">{approval.role}</div>
                                <div className="text-sm text-mono-600">{approval.date || '—'}</div>
                                <div>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    approval.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {approval.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Notes</h3>
                          <p className="text-sm text-mono-600 bg-white p-3 rounded-lg shadow-sm">{expense.notes}</p>
                        </div>
                      </div>

                      <div>
                        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Expense Details</h3>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 text-mono-400 mr-2" />
                              <span className="text-sm text-mono-500 mr-2">Date:</span>
                              <span className="text-sm text-mono-900">{expense.date}</span>
                            </div>
                            <div className="flex items-center">
                              <Building className="w-4 h-4 text-mono-400 mr-2" />
                              <span className="text-sm text-mono-500 mr-2">Vendor:</span>
                              <span className="text-sm text-mono-900">{expense.vendor}</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 text-mono-400 mr-2" />
                              <span className="text-sm text-mono-500 mr-2">Payment Method:</span>
                              <span className="text-sm text-mono-900">{expense.paymentMethod}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Contact Information</h3>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 text-mono-400 mr-2" />
                              <span className="text-sm text-mono-900">{expense.contact.name}</span>
                            </div>
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 text-mono-400 mr-2" />
                              <a href={`mailto:${expense.contact.email}`} className="text-sm text-accent hover:underline">
                                {expense.contact.email}
                              </a>
                            </div>
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 text-mono-400 mr-2" />
                              <a href={`tel:${expense.contact.phone}`} className="text-sm text-accent hover:underline">
                                {expense.contact.phone}
                              </a>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Metadata</h3>
                          <div className="space-y-2">
                            {Object.entries(expense.metadata).map(([key, value]) => (
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
                            {expense.documents.map((doc, index) => (
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
              icon={FileText}
              title="No expenses found"
              message={
                activeFilter === 'all' 
                  ? "No expenses have been recorded yet."
                  : "No expenses found matching the selected filter."
              }
              action={{
                label: "Record Expense",
                onClick: openModal
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}