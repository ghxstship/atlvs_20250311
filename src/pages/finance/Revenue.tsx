import React, { useState } from 'react';
import { Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, Building, Star, CheckCircle, AlertTriangle, DollarSign, ArrowUpRight } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import RevenueForm from '../../components/forms/RevenueForm';
import useModal from '../../hooks/useModal';
import EmptyState from '../../components/EmptyState';
import StatusBoxGrid from '../../components/StatusBoxGrid';

export default function Revenue() {
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
      console.error('Error recording revenue:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Sample revenue data
  const revenueItems = [
    {
      id: 1,
      revenueId: 'REV-2024-001',
      description: 'Festival Ticket Sales',
      project: 'Summer Music Festival',
      category: 'Ticketing',
      account: '4001 - Event Revenue',
      amount: 450000,
      date: '2024-03-15',
      status: 'Completed',
      paymentMethod: 'Various',
      breakdown: {
        vipTickets: { quantity: 500, amount: 150000 },
        generalAdmission: { quantity: 2000, amount: 200000 },
        earlyBird: { quantity: 1000, amount: 100000 }
      },
      metrics: {
        averageTicketPrice: 128.57,
        conversionRate: '24.8%',
        refundRate: '1.2%'
      },
      trends: {
        weekOverWeek: '+15%',
        monthOverMonth: '+22%',
        yearOverYear: '+45%'
      },
      documents: [
        { name: 'sales_report.pdf', size: '2.4 MB', date: '2024-03-15' },
        { name: 'transaction_log.xlsx', size: '1.8 MB', date: '2024-03-15' }
      ],
      notes: 'Record-breaking ticket sales for the summer festival. VIP packages sold out within 2 hours.'
    }
  ];

  // Status box data
  const statusBoxes = [
    {
      title: 'Total Revenue',
      value: `$${revenueItems.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}`, 
      trend: { direction: 'up' as const, value: '+8.2% from last month' },
      icon: 'dollar',
      type: 'success'
    },
    {
      title: 'Completed',
      value: `$${revenueItems.filter(item => item.status === 'Completed').reduce((sum, item) => sum + item.amount, 0).toLocaleString()}`,
      subtitle: 'Successfully processed',
      icon: 'check',
      type: 'info'
    },
    {
      title: 'Processing',
      value: `$${revenueItems.filter(item => item.status === 'Processing').reduce((sum, item) => sum + item.amount, 0).toLocaleString()}`,
      subtitle: 'Being processed',
      icon: 'clock',
      type: 'info'
    },
    {
      title: 'Forecasted',
      value: `$${revenueItems.filter(item => item.status === 'Forecasted').reduce((sum, item) => sum + item.amount, 0).toLocaleString()}`,
      subtitle: 'Future revenue',
      icon: 'trending',
      type: 'warning'
    }
  ];

  const filteredItems = activeFilter === 'all' 
    ? revenueItems 
    : revenueItems.filter(item => {
        switch (activeFilter) {
          case 'completed':
            return item.status === 'Completed';
          case 'pending':
            return item.status === 'Pending';
          case 'processing':
            return item.status === 'Processing';
          default:
            return true;
        }
      });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Revenue</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search revenue..."
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
            Record Revenue
          </button>
        </div>
      </div>

      <StatusBoxGrid boxes={statusBoxes} />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Record Revenue"
      >
        <RevenueForm
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
            All Revenue
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
            onClick={() => setActiveFilter('pending')}
            className={`px-4 py-2 ${activeFilter === 'pending' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Pending
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <div className="min-w-[1200px]">
          <div className="grid grid-cols-12 gap-4 p-4 font-medium text-mono-700 border-b">
            <div className="col-span-1">Revenue ID</div>
            <div className="col-span-1">Project</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Description</div>
            <div className="col-span-2">Account</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1"></div>
          </div>
          
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <React.Fragment key={item.id}>
                <div 
                  className={`grid grid-cols-12 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === item.id ? 'bg-mono-50' : ''}`}
                  onClick={() => toggleExpand(item.id)}
                >
                  <div className="col-span-1 font-mono text-sm text-mono-600">{item.revenueId}</div>
                  <div className="col-span-1 text-mono-600">{item.project}</div>
                  <div className="col-span-2 text-mono-600">{item.category}</div>
                  <div className="col-span-2 text-mono-600">{item.description}</div>
                  <div className="col-span-2 text-mono-600">{item.account}</div>
                  <div className="col-span-2 text-right">
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1 inline-block" />
                    <span className="font-medium text-green-600">
                      ${item.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      item.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    {expandedId === item.id ? (
                      <ChevronUp className="w-5 h-5 text-mono-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-mono-400" />
                    )}
                  </div>
                </div>

                {expandedId === item.id && (
                  <div className="col-span-12 bg-mono-50 p-6 border-b">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-2">
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Revenue Breakdown</h3>
                          <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="space-y-4">
                              {Object.entries(item.breakdown).map(([category, data]) => (
                                <div key={category} className="flex justify-between items-center">
                                  <div>
                                    <span className="text-sm font-medium text-mono-900 capitalize">
                                      {category.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                    <span className="text-sm text-mono-500 ml-2">
                                      ({data.quantity} units)
                                    </span>
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
                                    ${item.amount.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Performance Metrics</h3>
                          <div className="grid grid-cols-3 gap-4">
                            {Object.entries(item.metrics).map(([metric, value]) => (
                              <div key={metric} className="bg-white rounded-lg shadow-sm p-4">
                                <h4 className="text-xs font-medium text-mono-500 mb-1 capitalize">
                                  {metric.replace(/([A-Z])/g, ' $1').trim()}
                                </h4>
                                <p className="text-lg font-semibold text-mono-900">{value}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Growth Trends</h3>
                          <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="space-y-3">
                              {Object.entries(item.trends).map(([period, trend]) => (
                                <div key={period} className="flex items-center justify-between">
                                  <span className="text-sm text-mono-500 capitalize">
                                    {period.replace(/([A-Z])/g, ' $1').trim()}
                                  </span>
                                  <div className="flex items-center">
                                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                                    <span className="text-sm font-medium text-green-600">{trend}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Transaction Details</h3>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 text-mono-400 mr-2" />
                              <span className="text-sm text-mono-500 mr-2">Date:</span>
                              <span className="text-sm text-mono-900">{item.date}</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 text-mono-400 mr-2" />
                              <span className="text-sm text-mono-500 mr-2">Payment Method:</span>
                              <span className="text-sm text-mono-900">{item.paymentMethod}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Documents</h3>
                          <div className="space-y-2">
                            {item.documents.map((doc, index) => (
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
                          <p className="text-sm text-mono-600">{item.notes}</p>
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
              icon={DollarSign}
              title="No revenue entries found"
              message={
                activeFilter === 'all' 
                  ? "No revenue has been recorded yet."
                  : "No revenue entries found matching the selected filter."
              }
              action={{
                label: "Record Revenue",
                onClick: openModal
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}