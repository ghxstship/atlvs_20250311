import React, { useState } from 'react';
import { Coins, Plus, Search, Filter, ChevronDown, ChevronUp, Calendar, Clock, Tag, Link2, FileText, MapPin, Users, Building, Star, CheckCircle, AlertTriangle, DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, AlertCircle, PieChart, BarChart2 } from 'lucide-react';
import ActionButtons from '../../components/ActionButtons';
import Modal from '../../components/Modal';
import BudgetForm from '../../components/forms/BudgetForm';
import useModal from '../../hooks/useModal';
import EmptyState from '../../components/EmptyState';
import StatusBoxGrid from '../../components/StatusBoxGrid';

export default function Budget() {
  const { isOpen, openModal, closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<'project' | 'account' | 'team' | 'company'>('project');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      closeModal();
    } catch (error) {
      console.error('Error creating budget:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const budgets = [
    {
      id: 1,
      project: 'Summer Music Festival',
      category: 'Event Production',
      allocated: 150000,
      spent: 85000,
      committed: 35000,
      remaining: 30000,
      status: 'On Track',
      variance: 5.2,
      forecast: 145000,
      kpis: {
        spendEfficiency: 92,
        budgetUtilization: 85,
        savingsRate: 8.5,
        riskScore: 'Low'
      },
      subcategories: [
        {
          name: 'Stage & Production',
          allocated: 75000,
          spent: 45000,
          committed: 20000,
          lineItems: [
            { name: 'Stage Rental', allocated: 30000, spent: 25000, committed: 5000 },
            { name: 'Sound System', allocated: 25000, spent: 15000, committed: 8000 },
            { name: 'Lighting', allocated: 20000, spent: 5000, committed: 7000 }
          ]
        },
        {
          name: 'Staff & Labor',
          allocated: 45000,
          spent: 25000,
          committed: 10000,
          lineItems: [
            { name: 'Production Team', allocated: 25000, spent: 15000, committed: 5000 },
            { name: 'Technical Staff', allocated: 20000, spent: 10000, committed: 5000 }
          ]
        }
      ],
      monthlySpend: [
        { month: 'Jan', amount: 15000 },
        { month: 'Feb', amount: 25000 },
        { month: 'Mar', amount: 45000 }
      ]
    }
  ];

  const statusBoxes = [
    {
      title: 'Total Budget',
      value: `$${(budgets.reduce((sum, b) => sum + b.allocated, 0) / 1000).toFixed(1)}K`,
      trend: { direction: 'up', value: '+12% from last month' },
      icon: 'dollar',
      type: 'success'
    },
    {
      title: 'Spent',
      value: `$${(budgets.reduce((sum, b) => sum + b.spent, 0) / 1000).toFixed(1)}K`,
      subtitle: `${Math.round((budgets.reduce((sum, b) => sum + b.spent, 0) / budgets.reduce((sum, b) => sum + b.allocated, 0)) * 100)}% of total budget`,
      icon: 'trending',
      type: 'warning'
    },
    {
      title: 'Committed',
      value: `$${(budgets.reduce((sum, b) => sum + b.committed, 0) / 1000).toFixed(1)}K`,
      subtitle: `${Math.round((budgets.reduce((sum, b) => sum + b.committed, 0) / budgets.reduce((sum, b) => sum + b.allocated, 0)) * 100)}% of total budget`,
      icon: 'trending',
      type: 'info'
    },
    {
      title: 'Remaining',
      value: `$${(budgets.reduce((sum, b) => sum + b.remaining, 0) / 1000).toFixed(1)}K`,
      subtitle: `${Math.round((budgets.reduce((sum, b) => sum + b.remaining, 0) / budgets.reduce((sum, b) => sum + b.allocated, 0)) * 100)}% of total budget`,
      icon: 'dollar',
      type: 'success'
    }
  ];

  const filteredBudgets = budgets;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Budget</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <select
              value={activeView}
              onChange={(e) => setActiveView(e.target.value as 'project' | 'account' | 'team' | 'company')}
              className="pl-4 pr-8 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500 appearance-none bg-white"
            >
              <option value="project">Project View</option>
              <option value="account">Account View</option>
              <option value="team">Team View</option>
              <option value="company">Company View</option>
            </select>
            <ChevronDown className="w-4 h-4 text-mono-400 absolute right-3 top-3 pointer-events-none" />
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
            New Budget
          </button>
        </div>
      </div>

      <StatusBoxGrid boxes={statusBoxes} />

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Create New Budget"
      >
        <BudgetForm
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <div className="min-w-[1200px]">
          <div className="grid grid-cols-12 gap-4 p-4 font-medium text-mono-700 border-b">
            <div className="col-span-2">Project</div>
            <div>Category</div>
            <div className="col-span-2 text-right">Allocated</div>
            <div className="col-span-2 text-right">Spent</div>
            <div className="col-span-1 text-right">Committed</div>
            <div className="col-span-1 text-right">Remaining</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1"></div>
          </div>
          
          {filteredBudgets.length > 0 ? (
            filteredBudgets.map(budget => (
              <React.Fragment key={budget.id}>
                <div 
                  className={`grid grid-cols-12 gap-4 p-4 items-center border-b last:border-0 hover:bg-mono-50 cursor-pointer ${expandedId === budget.id ? 'bg-mono-50' : ''}`}
                  onClick={() => toggleExpand(budget.id)}
                >
                  <div className="col-span-2 truncate">{budget.project}</div>
                  <div className="truncate">{budget.category}</div>
                  <div className="col-span-2 text-right">${budget.allocated.toLocaleString()}</div>
                  <div className="col-span-2 text-right">${budget.spent.toLocaleString()}</div>
                  <div className="col-span-1 text-right">${budget.committed.toLocaleString()}</div>
                  <div className="col-span-1 text-right">${budget.remaining.toLocaleString()}</div>
                  <div className="col-span-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      budget.status === 'On Track' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {budget.status}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    {expandedId === budget.id ? (
                      <ChevronUp className="w-5 h-5 text-mono-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-mono-400" />
                    )}
                  </div>
                </div>

                {expandedId === budget.id && (
                  <div className="col-span-12 bg-mono-50 p-6 border-b">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-2">
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Budget Breakdown</h3>
                          <div className="space-y-6">
                            {budget.subcategories?.map((subcat, index) => (
                              <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                                <div className="flex justify-between items-center mb-4">
                                  <h4 className="font-medium text-mono-900">{subcat.name}</h4>
                                  <div className="text-sm text-mono-500">
                                    ${subcat.allocated.toLocaleString()} allocated
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  {subcat.lineItems.map((item, itemIndex) => (
                                    <div key={itemIndex} className="grid grid-cols-4 gap-4 text-sm">
                                      <div className="text-mono-600">{item.name}</div>
                                      <div className="text-right text-mono-600">${item.allocated.toLocaleString()}</div>
                                      <div className="text-right text-mono-600">${item.spent.toLocaleString()}</div>
                                      <div className="text-right text-mono-600">${item.committed.toLocaleString()}</div>
                                    </div>
                                  ))}
                                  <div className="pt-3 mt-3 border-t border-mono-200 grid grid-cols-4 gap-4 text-sm font-medium">
                                    <div className="text-mono-900">Subtotal</div>
                                    <div className="text-right text-mono-900">${subcat.allocated.toLocaleString()}</div>
                                    <div className="text-right text-mono-900">${subcat.spent.toLocaleString()}</div>
                                    <div className="text-right text-mono-900">${subcat.committed.toLocaleString()}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Monthly Spend Trend</h3>
                          <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="h-40 flex items-end space-x-8">
                              {budget.monthlySpend?.map((month, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center">
                                  <div 
                                    className="w-full bg-mono-900 rounded-t"
                                    style={{ height: `${(month.amount / Math.max(...budget.monthlySpend.map(m => m.amount))) * 150}px` }}
                                  ></div>
                                  <div className="mt-2 text-sm text-mono-500">{month.month}</div>
                                  <div className="text-sm font-medium text-mono-900">${month.amount.toLocaleString()}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Budget Health</h3>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-mono-500">Spend Efficiency</span>
                                <span className="font-medium text-mono-900">{budget.kpis.spendEfficiency}%</span>
                              </div>
                              <div className="h-2 bg-mono-200 rounded-full">
                                <div 
                                  className="h-2 bg-green-500 rounded-full"
                                  style={{ width: `${budget.kpis.spendEfficiency}%` }}
                                ></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-mono-500">Budget Utilization</span>
                                <span className="font-medium text-mono-900">{budget.kpis.budgetUtilization}%</span>
                              </div>
                              <div className="h-2 bg-mono-200 rounded-full">
                                <div 
                                  className="h-2 bg-blue-500 rounded-full"
                                  style={{ width: `${budget.kpis.budgetUtilization}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Key Metrics</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                                <span className="text-sm text-mono-500">Savings Rate</span>
                              </div>
                              <span className={`text-sm font-medium ${
                                budget.kpis.savingsRate > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {budget.kpis.savingsRate > 0 ? '+' : ''}{budget.kpis.savingsRate}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <AlertCircle className="w-4 h-4 text-mono-400 mr-2" />
                                <span className="text-sm text-mono-500">Risk Score</span>
                              </div>
                              <span className={`text-sm font-medium ${
                                budget.kpis.riskScore === 'Low' ? 'text-green-600' :
                                budget.kpis.riskScore === 'Medium' ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {budget.kpis.riskScore}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <TrendingDown className="w-4 h-4 text-mono-400 mr-2" />
                                <span className="text-sm text-mono-500">Forecast</span>
                              </div>
                              <span className="text-sm font-medium text-mono-900">
                                ${budget.forecast.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <h3 className="text-sm font-medium text-mono-900 mb-3">Quick Actions</h3>
                          <div className="space-y-2">
                            <button className="w-full flex items-center justify-center px-4 py-2 bg-mono-100 text-mono-700 rounded-lg hover:bg-mono-200">
                              <PieChart className="w-4 h-4 mr-2" />
                              View Analytics
                            </button>
                            <button className="w-full flex items-center justify-center px-4 py-2 bg-mono-100 text-mono-700 rounded-lg hover:bg-mono-200">
                              <BarChart2 className="w-4 h-4 mr-2" />
                              Generate Report
                            </button>
                            <button className="w-full flex items-center justify-center px-4 py-2 bg-mono-100 text-mono-700 rounded-lg hover:bg-mono-200">
                              <DollarSign className="w-4 h-4 mr-2" />
                              Adjust Budget
                            </button>
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
              icon={Coins}
              title="No budgets found"
              message={
                activeFilter === 'all' 
                  ? "No budgets have been created yet."
                  : "No budgets found matching the selected filter."
              }
              action={{
                label: "Create Budget",
                onClick: openModal
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}