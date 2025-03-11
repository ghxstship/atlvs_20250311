import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeDemoSession, cleanupDemoSession, resetDemoData, trackDemoUsage } from '../../lib/demo';

interface DemoContextType {
  isDemoMode: boolean;
  daysRemaining: number;
  resetData: () => Promise<void>;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function useDemoMode() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemoMode must be used within a DemoProvider');
  }
  return context;
}

interface DemoProviderProps {
  children: React.ReactNode;
}

export function DemoProvider({ children }: DemoProviderProps) {
  const [isDemoMode] = useState(() => window.location.search.includes('demo=true'));
  const [daysRemaining, setDaysRemaining] = useState(14);

  useEffect(() => {
    if (isDemoMode) {
      const startDemo = async () => {
        await initializeDemoSession();
        trackDemoUsage('session_start');
      };
      startDemo();

      // Set up daily data reset
      const resetInterval = setInterval(async () => {
        await resetDemoData();
        trackDemoUsage('data_reset');
      }, 24 * 60 * 60 * 1000);

      // Update days remaining
      const expiryInterval = setInterval(() => {
        setDaysRemaining(prev => {
          const remaining = prev - 1;
          if (remaining <= 0) {
            window.location.href = '/demo/expired';
          }
          return remaining;
        });
      }, 24 * 60 * 60 * 1000);

      return () => {
        cleanupDemoSession();
        clearInterval(resetInterval);
        clearInterval(expiryInterval);
        trackDemoUsage('session_end');
      };
    }
  }, [isDemoMode]);

  const resetData = async () => {
    await resetDemoData();
    trackDemoUsage('manual_reset');
  };

  return (
    <DemoContext.Provider value={{ isDemoMode, daysRemaining, resetData }}>
      {children}
    </DemoContext.Provider>
  );
}