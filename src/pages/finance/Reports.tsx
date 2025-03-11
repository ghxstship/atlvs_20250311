import React, { useState } from 'react';
import { BarChart, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, Download, Share2, Eye } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import ReportForm from '../../components/forms/ReportForm';
import useModal from '../../hooks/useModal';
import EmptyState from '../../components/EmptyState';

// Report template definitions
const reportTemplates = {
  financial_summary: {
    id: 'financial_summary',
    title: 'Financial Summary',
    description: 'Comprehensive overview of financial performance including revenue, expenses, and key metrics',
    components: [
      'Revenue Analysis',
      'Expense Breakdown',
      'Profit & Loss Statement',
      'Cash Flow Summary',
      'Budget vs Actual'
    ],
    filters: [
      'Date Range',
      'Department',
      'Cost Center',
      'Project',
      'Account'
    ],
    calculations: [
      'Total Revenue',
      'Total Expenses',
      'Gross Profit',
      'Net Profit',
      'Profit Margins'
    ],
    permissions: ['finance_team', 'management'],
    formats: ['PDF', 'Excel', 'CSV']
  },
  revenue_analysis: {
    id: 'revenue_analysis',
    title: 'Revenue Analysis',
    description: 'Detailed analysis of revenue streams, trends, and performance metrics',
    components: [
      'Revenue by Category',
      'Revenue Trends',
      'Client Analysis',
      'Project Revenue',
      'Forecasting'
    ],
    filters: [
      'Date Range',
      'Revenue Type',
      'Client',
      'Project',
      'Location'
    ],
    calculations: [
      'Revenue Growth',
      'Average Revenue per Client',
      'Revenue Distribution',
      'YoY Comparison'
    ],
    permissions: ['finance_team', 'sales_team'],
    formats: ['PDF', 'Excel']
  },
  expense_breakdown: {
    id: 'expense_breakdown',
    title: 'Expense Breakdown',
    description: 'Detailed categorization and analysis of all expenses',
    components: [
      'Expense Categories',
      'Vendor Analysis',
      'Cost Center Breakdown',
      'Payment Analysis'
    ],
    filters: [
      'Date Range',
      'Expense Category',
      'Vendor',
      'Payment Method',
      'Department'
    ],
    calculations: [
      'Total Expenses',
      'Expense by Category',
      'Month-over-Month Change',
      'Budget Variance'
    ],
    permissions: ['finance_team'],
    formats: ['PDF', 'Excel', 'CSV']
  },
  budget_report: {
    id: 'budget_report',
    title: 'Budget Report',
    description: 'Budget allocation, utilization, and variance analysis',
    components: [
      'Budget Overview',
      'Allocation Details',
      'Variance Analysis',
      'Forecast vs Actual'
    ],
    filters: [
      'Date Range',
      'Department',
      'Project',
      'Cost Center',
      'Category'
    ],
    calculations: [
      'Budget Utilization',
      'Variance Analysis',
      'Forecast Accuracy',
      'Savings Rate'
    ],
    permissions: ['finance_team', 'management'],
    formats: ['PDF', 'Excel']
  },
  project_financial: {
    id: 'project_financial',
    title: 'Project Financial Report',
    description: 'Financial performance analysis by project',
    components: [
      'Project Overview',
      'Cost Analysis',
      'Revenue Analysis',
      'Profitability Metrics'
    ],
    filters: [
      'Project',
      'Date Range',
      'Cost Type',
      'Revenue Type'
    ],
    calculations: [
      'Project Profitability',
      'Cost Analysis',
      'Revenue Analysis',
      'ROI Calculation'
    ],
    permissions: ['finance_team', 'project_managers'],
    formats: ['PDF', 'Excel']
  }
};

export default function Reports() {
  const { isOpen, openModal, closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Handle report generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      closeModal();
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleGenerateReport = (templateId: string) => {
    setSelectedTemplate(templateId);
    openModal();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Financial Reports</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search reports..."
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
            Generate Report
          </button>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={selectedTemplate ? `Generate ${reportTemplates[selectedTemplate as keyof typeof reportTemplates].title}` : 'Generate New Report'}
      >
        <ReportForm
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
          template={selectedTemplate ? reportTemplates[selectedTemplate as keyof typeof reportTemplates] : undefined}
        />
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-mono-900">Generated Reports</h2>
            <span className="text-2xl font-semibold text-mono-900">24</span>
          </div>
          <div className="text-sm text-mono-500">This month</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-mono-900">Scheduled Reports</h2>
            <span className="text-2xl font-semibold text-mono-900">8</span>
          </div>
          <div className="text-sm text-mono-500">Active schedules</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-mono-900">Report Templates</h2>
            <span className="text-2xl font-semibold text-mono-900">
              {Object.keys(reportTemplates).length}
            </span>
          </div>
          <div className="text-sm text-mono-500">Available templates</div>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(reportTemplates).map(([id, template]) => (
          <div key={id} className="bg-white rounded-lg shadow overflow-hidden">
            <div 
              className={`p-6 cursor-pointer hover:bg-mono-50 ${expandedId === id ? 'bg-mono-50' : ''}`}
              onClick={() => toggleExpand(id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <BarChart className="w-6 h-6 text-mono-400 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-mono-900">{template.title}</h3>
                    <p className="mt-1 text-sm text-mono-500">{template.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateReport(id);
                    }}
                    className="px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent"
                  >
                    Generate Report
                  </button>
                  {expandedId === id ? (
                    <ChevronUp className="w-5 h-5 text-mono-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-mono-400" />
                  )}
                </div>
              </div>
            </div>

            {expandedId === id && (
              <div className="border-t border-mono-200 p-6 bg-mono-50">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2 space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-mono-900 mb-3">Report Components</h4>
                      <ul className="grid grid-cols-2 gap-2">
                        {template.components.map((component, index) => (
                          <li key={index} className="flex items-center text-sm text-mono-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            {component}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-mono-900 mb-3">Calculations & Metrics</h4>
                      <ul className="grid grid-cols-2 gap-2">
                        {template.calculations.map((calc, index) => (
                          <li key={index} className="flex items-center text-sm text-mono-600">
                            <Calculator className="w-4 h-4 text-blue-500 mr-2" />
                            {calc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                      <h4 className="text-sm font-medium text-mono-900 mb-3">Available Filters</h4>
                      <div className="space-y-2">
                        {template.filters.map((filter, index) => (
                          <div key={index} className="flex items-center text-sm text-mono-600">
                            <Filter className="w-4 h-4 text-mono-400 mr-2" />
                            {filter}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                      <h4 className="text-sm font-medium text-mono-900 mb-3">Export Formats</h4>
                      <div className="space-y-2">
                        {template.formats.map((format, index) => (
                          <div key={index} className="flex items-center text-sm text-mono-600">
                            <FileText className="w-4 h-4 text-mono-400 mr-2" />
                            {format}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="text-sm font-medium text-mono-900 mb-3">Access Control</h4>
                      <div className="space-y-2">
                        {template.permissions.map((role, index) => (
                          <div key={index} className="flex items-center text-sm text-mono-600">
                            <Shield className="w-4 h-4 text-mono-400 mr-2" />
                            {role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-mono-200 flex justify-end space-x-3">
                  <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <ActionButtons />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}