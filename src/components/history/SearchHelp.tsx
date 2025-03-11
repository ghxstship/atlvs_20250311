import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function SearchHelp() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <HelpCircle className="w-5 h-5 text-mono-400 mr-2" />
        <h3 className="text-lg font-medium text-mono-900">Search Syntax Help</h3>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-mono-700 mb-2">Basic Search</h4>
          <div className="space-y-2">
            <p className="text-sm text-mono-600">
              Simply type any text to search across all fields
            </p>
            <div className="bg-mono-50 p-2 rounded text-sm font-mono">
              important update
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-mono-700 mb-2">Field Search</h4>
          <div className="space-y-2">
            <p className="text-sm text-mono-600">
              Search specific fields using field:value syntax
            </p>
            <div className="bg-mono-50 p-2 rounded text-sm font-mono">
              user:john type:update
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-mono-700 mb-2">Operators</h4>
          <div className="space-y-2">
            <p className="text-sm text-mono-600">
              Use AND, OR, NOT to combine searches
            </p>
            <div className="bg-mono-50 p-2 rounded text-sm font-mono">
              type:update AND user:john<br />
              important OR critical<br />
              type:update NOT user:john
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-mono-700 mb-2">Comparisons</h4>
          <div className="space-y-2">
            <p className="text-sm text-mono-600">
              Use =, !=, >, <, >=, <= for numeric and date comparisons
            </p>
            <div className="bg-mono-50 p-2 rounded text-sm font-mono">
              date>=2024-01-01<br />
              changes>5
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-mono-700 mb-2">Text Matching</h4>
          <div className="space-y-2">
            <p className="text-sm text-mono-600">
              Use CONTAINS, STARTS, ENDS for text matching
            </p>
            <div className="bg-mono-50 p-2 rounded text-sm font-mono">
              description:CONTAINS:"important"<br />
              name:STARTS:"test"<br />
              file:ENDS:".pdf"
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-mono-700 mb-2">Grouping</h4>
          <div className="space-y-2">
            <p className="text-sm text-mono-600">
              Use parentheses to group conditions
            </p>
            <div className="bg-mono-50 p-2 rounded text-sm font-mono">
              (type:update OR type:create) AND user:john
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  );
}