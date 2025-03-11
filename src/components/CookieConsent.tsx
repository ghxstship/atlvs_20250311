import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    const lastPolicyUpdate = localStorage.getItem('policy-last-updated');
    const currentPolicyVersion = '2024-03-15'; // Update this when policies change

    if (!consent || (lastPolicyUpdate !== currentPolicyVersion)) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    const currentPolicyVersion = '2024-03-15';
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('policy-last-updated', currentPolicyVersion);
    
    if (dontShowAgain) {
      localStorage.setItem('cookie-consent-permanent', 'true');
    }
    
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    
    if (dontShowAgain) {
      localStorage.setItem('cookie-consent-permanent', 'true');
    }
    
    setIsVisible(false);
  };

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('cookie-consent-permanent', 'true');
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      role="dialog"
      aria-labelledby="cookie-consent-title"
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-mono-200 shadow-lg p-4 md:p-6 z-50"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <h2 id="cookie-consent-title" className="text-lg font-semibold text-mono-900 mb-2">
            We Value Your Privacy
          </h2>
          <p className="text-mono-600">
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
            Read our <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a> and{' '}
            <a href="/cookie-policy" className="text-accent hover:underline">Cookie Policy</a> to learn more.
          </p>
          <div className="mt-2 flex items-center">
            <input
              type="checkbox"
              id="dontShowAgain"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded border-mono-300 text-mono-900 focus:ring-mono-500"
            />
            <label htmlFor="dontShowAgain" className="ml-2 text-sm text-mono-600">
              Do not show this message again
            </label>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mono-500"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-white bg-mono-900 rounded-lg hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mono-500"
          >
            Accept
          </button>
        </div>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-mono-400 hover:text-mono-500"
          aria-label="Close cookie consent"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}