import React from 'react';
import { Info, X } from 'lucide-react';
import { useDemoMode } from './DemoProvider';

export default function DemoBanner() {
  const { daysRemaining } = useDemoMode();
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-accent text-white py-2 px-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Info className="w-4 h-4 mr-2" />
          <span className="text-sm">
            Demo Mode - {daysRemaining} days remaining. All changes will be reset every 24 hours.
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="/pricing"
            className="text-sm hover:underline"
          >
            Upgrade to Full Version
          </a>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-white/80"
            aria-label="Close banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}