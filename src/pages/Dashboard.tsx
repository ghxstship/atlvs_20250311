import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatusBoxGrid from '../components/StatusBoxGrid';
import WorldClock from '../components/WorldClock';
import { 
  Ship, Users, Calendar, DollarSign, Clock, AlertCircle, CheckCircle2, Package,
  FileText, BarChart2, Ticket, ShoppingBag, Handshake, Building2, Briefcase,
  TrendingUp, TrendingDown, Bell, MessageSquare, Truck, UserCheck, Star
} from 'lucide-react';

interface ClockSettings {
  timeZone: string;
  label: string;
  isAnalog: boolean;
}

export default function Dashboard() {
  // Load saved clock preferences or use defaults
  const [clockSettings, setClockSettings] = useState<ClockSettings[]>(() => {
    const saved = localStorage.getItem('clockSettings');
    return saved ? JSON.parse(saved) : [
      { timeZone: 'America/Los_Angeles', label: 'Pacific Time (PT)', isAnalog: false },
      { timeZone: 'America/Denver', label: 'Mountain Time (MT)', isAnalog: false },
      { timeZone: 'America/Chicago', label: 'Central Time (CT)', isAnalog: false },
      { timeZone: 'America/New_York', label: 'Eastern Time (ET)', isAnalog: false }
    ];
  });

  // Save clock settings whenever they change
  useEffect(() => {
    localStorage.setItem('clockSettings', JSON.stringify(clockSettings));
  }, [clockSettings]);

  const updateClockFormat = (index: number) => {
    const newSettings = [...clockSettings];
    newSettings[index] = {
      ...newSettings[index],
      isAnalog: !newSettings[index].isAnalog
    };
    setClockSettings(newSettings);
  };

  const updateClockTimeZone = (index: number, timeZone: string) => {
    const newSettings = [...clockSettings];
    const label = timeZone.split('/').pop()?.replace('_', ' ') || timeZone;
    newSettings[index] = {
      ...newSettings[index],
      timeZone,
      label
    };
    setClockSettings(newSettings);
  };

  // Sales & Revenue Metrics
  const salesMetrics = [
    { 
      title: 'Total Revenue',
      value: '$842K',
      trend: { direction: 'up' as const, value: '+7.2%' },
      icon: 'dollar',
      type: 'success'
    },
    { 
      title: 'Ticket Sales',
      value: '$156K',
      trend: { direction: 'up' as const, value: '+18%' },
      icon: 'trending',
      type: 'info'
    },
    { 
      title: 'Conversion Rate',
      value: '24.8%',
      trend: { direction: 'up' as const, value: '+2.4%' },
      icon: 'trending',
      type: 'info'
    },
    { 
      title: 'Avg Order Value',
      value: '$285',
      trend: { direction: 'up' as const, value: '+5.1%' },
      icon: 'dollar',
      type: 'success'
    }
  ];

  // Operations Metrics
  const operationsMetrics = [
    { 
      title: 'Active Projects',
      value: '12',
      subtitle: '3 starting this week',
      icon: 'info',
      type: 'info'
    },
    { 
      title: 'Equipment Usage',
      value: '76%',
      trend: { direction: 'up' as const, value: '+5%' },
      icon: 'trending',
      type: 'success'
    },
    { 
      title: 'Staff Coverage',
      value: '92%',
      subtitle: '48/52 positions filled',
      icon: 'users',
      type: 'success'
    }
  ];

  // Financial Health
  const financialMetrics = [
    { 
      title: 'Cash Flow',
      value: '$1.2M',
      trend: { direction: 'up' as const, value: '+15%' },
      icon: 'dollar',
      type: 'success'
    },
    { 
      title: 'Outstanding',
      value: '$245K',
      subtitle: '12 invoices pending',
      icon: 'warning',
      type: 'warning'
    },
    { 
      title: 'Profit Margin',
      value: '28.5%',
      trend: { direction: 'up' as const, value: '+2.1%' },
      icon: 'trending',
      type: 'success'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-mono-900">Home Port</h1>
      </div>

      {/* World Clocks */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {clockSettings.map((clock, index) => (
          <WorldClock
            key={index}
            timeZone={clock.timeZone}
            label={clock.label}
            isAnalog={clock.isAnalog}
            onToggleFormat={() => updateClockFormat(index)}
            onChangeTimeZone={(timeZone) => updateClockTimeZone(index, timeZone)}
          />
        ))}
      </div>

      {/* Sales & Revenue Metrics */}
      <div>
        <h2 className="text-lg font-medium text-mono-900 mb-4">Sales & Revenue</h2>
        <StatusBoxGrid boxes={salesMetrics} />
      </div>

      {/* Operations Overview */}
      <div>
        <h2 className="text-lg font-medium text-mono-900 mb-4">Operations</h2>
        <StatusBoxGrid boxes={operationsMetrics} columns={3} />
      </div>

      {/* Financial Health */}
      <div>
        <h2 className="text-lg font-medium text-mono-900 mb-4">Financial Health</h2>
        <StatusBoxGrid boxes={financialMetrics} columns={3} />
      </div>

      {/* Quick Access Links */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-mono-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Crew Directory', icon: Users, route: '/people/directory', color: 'bg-blue-500' },
            { name: 'Files', icon: FileText, route: '/projects/files', color: 'bg-purple-500' },
            { name: 'Inventory', icon: Package, route: '/assets/inventory', color: 'bg-indigo-500' },
            { name: 'Opportunities', icon: Star, route: '/opportunities', color: 'bg-amber-500' },
            { name: 'Reports', icon: BarChart2, route: '/finance/reports', color: 'bg-green-500' },
            { name: 'Schedule', icon: Calendar, route: '/projects/schedule', color: 'bg-pink-500' },
            { name: 'Tasks', icon: CheckCircle2, route: '/projects/tasks', color: 'bg-orange-500' },
            { name: 'Timekeeping', icon: Clock, route: '/people/timekeeping', color: 'bg-teal-500' }
          ].map((link) => (
            <Link
              key={link.name}
              to={link.route}
              className="flex flex-col items-center p-4 rounded-lg border-2 border-mono-100 hover:border-mono-800 transition-colors"
            >
              <div className={`p-3 rounded-lg ${link.color} text-white mb-3`}>
                <link.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-mono-900">{link.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}