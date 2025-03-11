import React, { useState } from 'react';
import { AlertTriangle, Shield, TrendingUp, TrendingDown, Plus, Search } from 'lucide-react';

interface Risk {
  id: string;
  title: string;
  description: string;
  category: string;
  probability: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Mitigated' | 'Closed';
  owner: string;
  dueDate: string;
  mitigation: string;
  contingency: string;
  createdAt: string;
  updatedAt: string;
}

interface RiskManagementProps {
  risks: Risk[];
  onAddRisk: (risk: Partial<Risk>) => void;
  onUpdateRisk: (id: string, risk: Partial<Risk>) => void;
}

export default function RiskManagement({ risks, onAddRisk, onUpdateRisk }: RiskManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getRiskScore = (probability: Risk['probability'], impact: Risk['impact']) => {
    const scores = {
      Low: 1,
      Medium: 2,
      High: 3
    };
    return scores[probability] * scores[impact];
  };

  const filteredRisks = risks.filter(risk => {
    const matchesSearch = risk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         risk.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || risk.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(risks.map(risk => risk.category)));

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-mono-900">Total Risks</h2>
            <AlertTriangle className="w-5 h-5 text-mono-400" />
          </div>
          <div className="text-3xl font-semibold text-mono-900">{risks.length}</div>
          <div className="mt-2 text-sm text-mono-500">Identified risks</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-mono-900">High Priority</h2>
            <TrendingUp className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-semibold text-mono-900">
            {risks.filter(r => getRiskScore(r.probability, r.impact) >= 6).length}
          </div>
          <div className="mt-2 text-sm text-mono-500">Require immediate attention </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-mono-900">Mitigated</h2>
            <Shield className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-semibold text-mono-900">
            {risks.filter(r => r.status === 'Mitigated').length}
          </div>
          <div className="mt-2 text-sm text-mono-500">Successfully addressed</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-mono-900">Open</h2>
            <TrendingDown className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-3xl font-semibold text-mono-900">
            {risks.filter(r => r.status === 'Open').length}
          </div>
          <div className="mt-2 text-sm text-mono-500">Pending mitigation</div>
        </div>
      </div>

      {/* Risk Matrix */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-mono-900 mb-4">Risk Matrix</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-start-2 col-span-3 grid grid-cols-3 gap-4 mb-4">
            <div className="text-center text-sm font-medium text-mono-700">Low Impact</div>
            <div className="text-center text-sm font-medium text-mono-700">Medium Impact</div>
            <div className="text-center text-sm font-medium text-mono-700">High Impact</div>
          </div>
          
          {['High', 'Medium', 'Low'].map((probability) => (
            <React.Fragment key={probability}>
              <div className="flex items-center text-sm font-medium text-mono-700">
                {probability} Probability
              </div>
              {['Low', 'Medium', 'High'].map((impact) => {
                const cellRisks = risks.filter(r => r.probability === probability && r.impact === impact);
                const score = getRiskScore(probability as Risk['probability'], impact as Risk['impact']);
                const bgColor = score >= 6 ? 'bg-red-50' : 
                               score >= 3 ? 'bg-yellow-50' : 
                               'bg-green-50';
                const textColor = score >= 6 ? 'text-red-700' : 
                                 score >= 3 ? 'text-yellow-700' : 
                                 'text-green-700';
                
                return (
                  <div 
                    key={`${probability}-${impact}`}
                    className={`p-4 rounded-lg ${bgColor} ${textColor} text-center`}
                  >
                    {cellRisks.length}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Risk List */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search risks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
              />
              <Search className="w-5 h-5 text-mono-400 absolute left-3 top-2.5" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {/* Handle new risk */}}
            className="flex items-center px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Risk
          </button>
        </div>

        <div className="grid grid-cols-8 gap-4 p-4 font-medium text-mono-700 border-b">
          <div className="col-span-2">Risk</div>
          <div>Category</div>
          <div>Probability</div>
          <div>Impact</div>
          <div>Owner</div>
          <div>Status</div>
          <div></div>
        </div>

        {filteredRisks.map(risk => (
          <div key={risk.id} className="grid grid-cols-8 gap-4 p-4 items-center border-b last:border-0">
            <div className="col-span-2">
              <div className="font-medium text-mono-900">{risk.title}</div>
              <div className="text-sm text-mono-500">Due: {risk.dueDate}</div>
            </div>
            <div className="text-mono-600">{risk.category}</div>
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                risk.probability === 'High' ? 'bg-red-100 text-red-800' :
                risk.probability === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {risk.probability}
              </span>
            </div>
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                risk.impact === 'High' ? 'bg-red-100 text-red-800' :
                risk.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {risk.impact}
              </span>
            </div>
            <div className="text-mono-600">{risk.owner}</div>
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                risk.status === 'Open' ? 'bg-yellow-100 text-yellow-800' :
                risk.status === 'Mitigated' ? 'bg-green-100 text-green-800' :
                'bg-mono-100 text-mono-800'
              }`}>
                {risk.status}
              </span>
            </div>
            <div className="flex justify-end space-x-2">
              <button className="text-mono-600 hover:text-accent">View</button>
              <button className="text-mono-600 hover:text-accent">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}