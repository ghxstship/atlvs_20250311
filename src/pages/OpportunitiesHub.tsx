import React, { useState } from 'react';
import { Search, Filter, Plus, Star, DollarSign, MapPin, Calendar, Users, Briefcase, Ticket, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'talent' | 'bids' | 'jobs' | 'events';

interface OpportunityCard {
  id: string;
  type: 'talent' | 'bid' | 'job' | 'event';
  title: string;
  subtitle?: string;
  date: string;
  location: string;
  compensation?: string;
  deadline?: string;
  status: string;
  tags: string[];
  image?: string;
}

export default function OpportunitiesHub() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const opportunities: OpportunityCard[] = [
    {
      id: '1',
      type: 'talent',
      title: 'Lead Sound Engineer',
      subtitle: 'Summer Music Festival 2024',
      date: '2024-06-15',
      location: 'Los Angeles, CA',
      compensation: '$800-1000/day',
      deadline: '2024-05-01',
      status: 'Open',
      tags: ['Audio', 'Live Events', 'Music Festival'],
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3'
    },
    {
      id: '2',
      type: 'bid',
      title: 'Stage Equipment Supply',
      subtitle: 'Tech Conference 2024',
      date: '2024-09-15',
      location: 'San Francisco, CA',
      compensation: '$75,000',
      deadline: '2024-04-15',
      status: 'Open for Bids',
      tags: ['Equipment', 'Corporate', 'Technical']
    },
    {
      id: '3',
      type: 'job',
      title: 'Production Manager',
      subtitle: 'Full Time Position',
      location: 'New York, NY',
      compensation: '$85,000-95,000/year',
      deadline: '2024-04-30',
      status: 'Active',
      tags: ['Production', 'Management', 'Full Time'],
      date: '2024-03-15'
    },
    {
      id: '4',
      type: 'event',
      title: 'Broadway Show Opening',
      subtitle: 'Theater Production',
      date: '2024-05-20',
      location: 'New York, NY',
      compensation: '$150-500',
      status: 'Tickets Available',
      tags: ['Theater', 'Live Performance', 'Opening Night'],
      image: 'https://images.unsplash.com/photo-1503095396549-807759245b35'
    }
  ];

  const filteredOpportunities = opportunities.filter(opp => {
    if (activeFilter !== 'all' && opp.type !== activeFilter) return false;
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        opp.title.toLowerCase().includes(searchLower) ||
        opp.subtitle?.toLowerCase().includes(searchLower) ||
        opp.location.toLowerCase().includes(searchLower) ||
        opp.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'talent': return <Star className="w-5 h-5 text-yellow-500" />;
      case 'bid': return <DollarSign className="w-5 h-5 text-green-500" />;
      case 'job': return <Briefcase className="w-5 h-5 text-blue-500" />;
      case 'event': return <Ticket className="w-5 h-5 text-purple-500" />;
      default: return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-mono-900">Opportunities Hub</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
            />
            <Search className="w-5 h-5 text-mono-400 absolute left-3 top-2.5" />
          </div>
          <button className="flex items-center px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent">
            <Plus className="w-4 h-4 mr-2" />
            Post Opportunity
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2 border-b border-mono-200">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 ${activeFilter === 'all' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            All Opportunities
          </button>
          <button
            onClick={() => setActiveFilter('talent')}
            className={`px-4 py-2 ${activeFilter === 'talent' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Talent Booking
          </button>
          <button
            onClick={() => setActiveFilter('bids')}
            className={`px-4 py-2 ${activeFilter === 'bids' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Open Bids
          </button>
          <button
            onClick={() => setActiveFilter('jobs')}
            className={`px-4 py-2 ${activeFilter === 'jobs' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Staff Positions
          </button>
          <button
            onClick={() => setActiveFilter('events')}
            className={`px-4 py-2 ${activeFilter === 'events' ? 'border-b-2 border-mono-900 text-mono-900' : 'text-mono-500'}`}
          >
            Upcoming Events
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpportunities.map((opportunity) => (
          <div key={opportunity.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {opportunity.image && (
              <div className="h-48 overflow-hidden">
                <img 
                  src={opportunity.image} 
                  alt={opportunity.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    {getTypeIcon(opportunity.type)}
                    <span className="ml-2 text-sm font-medium text-mono-500 uppercase">
                      {opportunity.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-mono-900 mb-1">{opportunity.title}</h3>
                  {opportunity.subtitle && (
                    <p className="text-mono-600 mb-4">{opportunity.subtitle}</p>
                  )}
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  opportunity.status.toLowerCase().includes('open') ? 'bg-green-100 text-green-800' :
                  opportunity.status.toLowerCase().includes('closed') ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {opportunity.status}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-mono-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">{opportunity.date}</span>
                </div>
                <div className="flex items-center text-mono-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{opportunity.location}</span>
                </div>
                {opportunity.compensation && (
                  <div className="flex items-center text-mono-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span className="text-sm">{opportunity.compensation}</span>
                  </div>
                )}
                {opportunity.deadline && (
                  <div className="flex items-center text-mono-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">Deadline: {opportunity.deadline}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {opportunity.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-mono-100 text-mono-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6">
                <Link
                  to={`/opportunities/${opportunity.type}/${opportunity.id}`}
                  className="block w-full text-center px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent transition-colors"
                >
                  {opportunity.type === 'talent' ? 'Apply Now' :
                   opportunity.type === 'bid' ? 'Submit Bid' :
                   opportunity.type === 'job' ? 'View & Apply' :
                   'Purchase Tickets'}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}