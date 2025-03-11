import React from 'react';
import { Search } from 'lucide-react';

interface TopBarProps {
  children?: React.ReactNode;
}

export default function TopBar({ children }: TopBarProps) {
  return (
    <header className="h-14 flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        {children}
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative hidden sm:block">
          <input
            type="search"
            placeholder="Search"
            className="w-48 pl-8 pr-3 py-1.5 text-sm border border-mono-200 rounded-md font-mono placeholder-mono-400 focus:outline-none focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          />
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-mono-400" />
        </div>
      </div>

      {/* Mobile Search */}
      <div className="sm:hidden px-4 py-2 border-t border-mono-200">
        <div className="relative">
          <input
            type="search"
            placeholder="Search"
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-mono-200 rounded-md font-mono placeholder-mono-400 focus:outline-none focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          />
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-mono-400" />
        </div>
      </div>
    </header>
  );
}