import React, { useState } from 'react';
import { Calendar, Clock, Filter, Download } from 'lucide-react';

interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  components: string[];
  filters: string[];
  calculations: string[];
  permissions: string[];
  formats: string[];
}

interface ReportFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  template?: ReportTemplate;
}

export default function ReportForm({ onSubmit, onCancel, isSubmitting, template }: ReportFormProps) {
  const [selectedFormat, setSelectedFormat] = useState('PDF');
  const [dateRange, setDateRange] = useState('custom');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Report Type Selection */}
      {!template && (
        <div>
          <label className="block text-sm font-medium text-mono-700 mb-1">
            Report Type
            <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            name="reportType"
            className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
            required
          >
            <option value="">Select report type</option>
            <option value="financial_summary">Financial Summary</option>
            <option value="revenue_analysis">Revenue Analysis</option>
            <option value="expense_breakdown">Expense Breakdown</option>
            <option value="budget_report">Budget Report</option>
            <option value="project_financial">Project Financial Report</option>
          </select>
        </div>
      )}

      {/* Date Range Selection */}
      <div>
        <label className="block text-sm font-medium text-mono-700 mb-1">
          Date Range
          <span className="text-red-500 ml-1">*</span>
        </label>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500 mb-3"
          required
        >
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="this_week">This Week</option>
          <option value="last_week">Last Week</option>
          <option value="this_month">This Month</option>
          <option value="last_month">Last Month</option>
          <option value="this_quarter">This Quarter</option>
          <option value="last_quarter">Last Quarter</option>
          <option value="this_year">This Year</option>
          <option value="last_year">Last Year</option>
          <option value="custom">Custom Range</option>
        </select>

        {dateRange === 'custom' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-mono-700 mb-1">
                Start Date
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-mono-700 mb-1">
                End Date
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
                required
              />
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div>
        <label className="block text-sm font-medium text-mono-700 mb-1">
          Department
        </label>
        <select
          name="department"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">All Departments</option>
          <option value="production">Production</option>
          <option value="technical">Technical</option>
          <option value="operations">Operations</option>
          <option value="marketing">Marketing</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-mono-700 mb-1">
          Cost Center
        </label>
        <select
          name="costCenter"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">All Cost Centers</option>
          <option value="cc001">Main Stage</option>
          <option value="cc002">Audio Department</option>
          <option value="cc003">Lighting Department</option>
          <option value="cc004">Video Department</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-mono-700 mb-1">
          Project
        </label>
        <select
          name="project"
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
        >
          <option value="">All Projects</option>
          <option value="1">Summer Music Festival</option>
          <option value="2">Corporate Event</option>
          <option value="3">Theater Production</option>
        </select>
      </div>

      {/* Export Format */}
      <div>
        <label className="block text-sm font-medium text-mono-700 mb-1">
          Export Format
          <span className="text-red-500 ml-1">*</span>
        </label>
        <select
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
          className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          required
        >
          <option value="PDF">PDF</option>
          <option value="Excel">Excel</option>
          <option value="CSV">CSV</option>
        </select>
      </div>

      {/* Schedule Options */}
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="rounded border-mono-300 text-mono-900 focus:ring-mono-500"
          />
          <span className="text-sm text-mono-700">Schedule this report</span>
        </label>

        <div className="mt-3 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-mono-700 mb-1">
              Frequency
            </label>
            <select
              name="frequency"
              className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-mono-700 mb-1">
              Recipients
            </label>
            <input
              type="text"
              placeholder="Enter email addresses"
              className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-white bg-mono-900 rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Generating...' : 'Generate Report'}
        </button>
      </div>
    </form>
  );
}