import React from 'react';
import { Book, ArrowRight, Info } from 'lucide-react';

export default function DemoGuide() {
  const features = [
    {
      title: 'Project Management',
      description: 'Explore sample projects with tasks, timelines, and resource allocation.',
      path: '/projects'
    },
    {
      title: 'Event Planning',
      description: 'View upcoming events, schedules, and venue management.',
      path: '/events'
    },
    {
      title: 'Asset Management',
      description: 'Track equipment, maintenance schedules, and availability.',
      path: '/assets'
    },
    {
      title: 'Personnel',
      description: 'Manage crew assignments, schedules, and certifications.',
      path: '/people'
    },
    {
      title: 'Financial Tools',
      description: 'Monitor budgets, expenses, and generate reports.',
      path: '/finance'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-mono-900 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Book className="w-8 h-8 mr-3" />
              <h1 className="text-2xl font-semibold">Getting Started with Demo</h1>
            </div>
            <div className="text-mono-300">
              Demo expires in: <span className="font-mono">14 days</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-lg font-medium text-mono-900 mb-2">Welcome to the Demo Environment</h2>
            <p className="text-mono-600">
              This demo contains sample data and workflows to help you explore the platform's capabilities.
              All features are fully functional but in read-only mode.
            </p>
          </div>

          <div className="grid gap-6 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start p-4 border border-mono-200 rounded-lg hover:bg-mono-50">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-mono-900 mb-1">{feature.title}</h3>
                  <p className="text-mono-600">{feature.description}</p>
                </div>
                <a 
                  href={feature.path}
                  className="flex items-center px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent"
                >
                  Explore
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">Important Notes</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• This is a demo environment with sample data</li>
                  <li>• All changes will be reset every 24 hours</li>
                  <li>• Some features are limited to read-only access</li>
                  <li>• Contact sales for full access and custom deployment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-mono-50 border-t border-mono-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-mono-600">
              Need help? Contact our support team
            </div>
            <div className="space-x-4">
              <button className="px-4 py-2 text-mono-700 bg-white border border-mono-300 rounded-lg hover:bg-mono-50">
                View Documentation
              </button>
              <button className="px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}