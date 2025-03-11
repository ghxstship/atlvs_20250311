import React from 'react';
import { Play } from 'lucide-react';

export default function DemoLink() {
  return (
    <div className="bg-white px-8 py-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-mono-900">Try Before You Sign Up</h3>
          <p className="text-sm text-mono-500 mt-1">
            Explore our platform with sample data and workflows
          </p>
        </div>
        <a
          href="/?demo=true"
          className="flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
        >
          <Play className="w-4 h-4 mr-2" />
          Launch Demo
        </a>
      </div>
    </div>
  );
}