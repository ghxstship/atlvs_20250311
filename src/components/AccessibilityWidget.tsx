import React, { useState } from 'react';
import { Settings } from 'lucide-react';

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [contrast, setContrast] = useState('normal');

  const toggleWidget = () => setIsOpen(!isOpen);

  const adjustFontSize = (size: number) => {
    setFontSize(size);
    document.documentElement.style.fontSize = `${size}%`;
  };

  const adjustContrast = (mode: string) => {
    setContrast(mode);
    document.body.setAttribute('data-contrast', mode);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleWidget}
        className="bg-mono-900 text-white p-3 rounded-full shadow-lg hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mono-500"
        aria-label="Accessibility settings"
      >
        <Settings className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-4 w-64 bg-white rounded-lg shadow-xl border border-mono-200 p-4">
          <h2 className="text-lg font-semibold text-mono-900 mb-4">Accessibility Options</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-mono-700 mb-2">
                Text Size
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => adjustFontSize(90)}
                  className={`px-3 py-1 rounded ${fontSize === 90 ? 'bg-mono-900 text-white' : 'bg-mono-100 text-mono-700'}`}
                >
                  A-
                </button>
                <button
                  onClick={() => adjustFontSize(100)}
                  className={`px-3 py-1 rounded ${fontSize === 100 ? 'bg-mono-900 text-white' : 'bg-mono-100 text-mono-700'}`}
                >
                  A
                </button>
                <button
                  onClick={() => adjustFontSize(110)}
                  className={`px-3 py-1 rounded ${fontSize === 110 ? 'bg-mono-900 text-white' : 'bg-mono-100 text-mono-700'}`}
                >
                  A+
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-mono-700 mb-2">
                Contrast
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => adjustContrast('normal')}
                  className={`px-3 py-1 rounded ${contrast === 'normal' ? 'bg-mono-900 text-white' : 'bg-mono-100 text-mono-700'}`}
                >
                  Normal
                </button>
                <button
                  onClick={() => adjustContrast('high')}
                  className={`px-3 py-1 rounded ${contrast === 'high' ? 'bg-mono-900 text-white' : 'bg-mono-100 text-mono-700'}`}
                >
                  High
                </button>
              </div>
            </div>

            <div>
              <button
                onClick={() => {
                  adjustFontSize(100);
                  adjustContrast('normal');
                }}
                className="w-full px-4 py-2 text-mono-700 bg-mono-100 rounded hover:bg-mono-200"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}