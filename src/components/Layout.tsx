import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, PanelLeftClose, PanelLeft } from 'lucide-react';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-brand-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-[var(--header-height)] bg-white border-b border-mono-200">
        <div className="flex items-center justify-between h-full px-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-mono-400 hover:text-accent"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block fixed z-30 h-screen transition-all duration-300">
          <Sidebar isCollapsed={isCollapsed} />
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute top-4 -right-3 bg-mono-900 text-white p-1 rounded-full hover:text-accent z-50"
          >
            {isCollapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-mono-900 bg-opacity-50">
            <div 
              className="absolute inset-0" 
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <div className="relative flex">
              <div className="w-[var(--sidebar-width)] max-w-[90vw] h-screen bg-mono-900 transform transition-transform duration-300">
                <Sidebar isMobile onClose={() => setIsMobileMenuOpen(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${
          isCollapsed 
            ? 'lg:ml-[var(--sidebar-width-collapsed)]' 
            : 'lg:ml-[var(--sidebar-width)]'
        } ${
          isMobileMenuOpen ? 'overflow-hidden' : ''
        } lg:pt-0 pt-[var(--header-height)]`}>
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}