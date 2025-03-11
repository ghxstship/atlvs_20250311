import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Download, Filter } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface Budget {
  id: string;
  projectId: string;
  category: string;
  allocated: number;
  spent: number;
  committed: number;
  remaining: number;
  status: 'On Track' | 'At Risk' | 'Over Budget';
  forecast: number;
  variance: number;
}

interface BudgetTrackingProps {
  budgets: Budget[];
  onExport: () => void;
  onFilter: (filters: any) => void;
}

export default function BudgetTracking({ budgets, onExport, onFilter }: BudgetTrackingProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.allocated, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalCommitted = budgets.reduce((sum, budget) => sum + budget.committed, 0);
  const totalRemaining = budgets.reduce((sum, budget) => sum + budget.remaining, 0);

  const spentPercentage = (totalSpent / totalBudget) * 100;
  const committedPercentage = (totalCommitted / totalBudget) * 100;
  const remainingPercentage = (totalRemaining / totalBudget) * 100;

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-mono-900">Total Budget</h2>
            <DollarSign className="w-5 h-5 text-mono-400" />
          </div>
          <div className="text-3xl font-semibold text-mono-900">
            {formatCurrency(totalBudget)}
          </div>
          <div className="mt-2 text-sm text-mono-500">Allocated funds</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-mono-900">Spent</h2>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-semibold text-mono-900">
            {formatCurrency(totalSpent)}
          </div>
          <div className="mt-2 text-sm text-mono-500">{spentPercentage.toFixed(1)}% of budget</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-mono-900">Committed</h2>
            <AlertCircle className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-3xl font-semibold text-mono-900">
            {formatCurrency(totalCommitted)}
          </div>
          <div className="mt-2 text-sm text-mono-500">{committedPercentage.toFixed(1)}% of budget</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-mono-900">Remaining</h2>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-semibold text-mono-900">
            {formatCurrency(totalRemaining)}
          </div>
          <div className="mt-2 text-sm text-mono-500">{remainingPercentage.toFixed(1)}% of budget</div>
        </div>
      </div>

      {/* Budget Progress Bar */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-mono-900 mb-4">Budget Utilization</h3>
        <div className="h-4 bg-mono-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500" style={{ width: `${spentPercentage}%` }} />
          <div className="h-full bg-yellow-500" style={{ width: `${committedPercentage}%`, marginTop: '-1rem' }} />
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className="text-green-600">Spent ({spentPercentage.toFixed(1)}%)</span>
          <span className="text-yellow-600">Committed ({committedPercentage.toFixed(1)}%)</span>
          <span className="text-mono-600">Remaining ({remainingPercentage.toFixed(1)}%)</span>
        </div>
      </div>

      {/* Budget Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
            >
              <option value="all">All Categories</option>
              <option value="labor">Labor</option>
              <option value="equipment">Equipment</option>
              <option value="materials">Materials</option>
              <option value="services">Services</option>
            </select>
            <button
              onClick={() => onFilter({ category: selectedCategory })}
              className="flex items-center px-3 py-2 text-mono-700 hover:text-accent"
            >
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </button>
          </div>
          <button
            onClick={onExport}
            className="flex items-center px-3 py-2 text-mono-700 hover:text-accent"
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </button>
        </div>

        <div className="grid grid-cols-8 gap-4 p-4 font-medium text-mono-700 border-b">
          <div className="col-span-2">Category</div>
          <div>Allocated</div>
          <div>Spent</div>
          <div>Committed</div>
          <div>Remaining</div>
          <div>Status</div>
          <div></div>
        </div>

        {budgets.map(budget => (
          <div key={budget.id} className="grid grid-cols-8 gap-4 p-4 items-center border-b last:border-0">
            <div className="col-span-2">
              <div className="font-medium text-mono-900">{budget.category}</div>
              <div className="text-sm text-mono-500">
                Variance: {budget.variance >= 0 ? '+' : ''}{budget.variance}%
              </div>
            </div>
            <div className="text-mono-600">{formatCurrency(budget.allocated)}</div>
            <div className="text-mono-600">{formatCurrency(budget.spent)}</div>
            <div className="text-mono-600">{formatCurrency(budget.committed)}</div>
            <div className="text-mono-600">{formatCurrency(budget.remaining)}</div>
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                budget.status === 'On Track' ? 'bg-green-100 text-green-800' :
                budget.status === 'At Risk' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {budget.status}
              </span>
            </div>
            <div className="flex justify-end space-x-2">
              <button className="text-mono-600 hover:text-accent">Details</button>
              <button className="text-mono-600 hover:text-accent">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}