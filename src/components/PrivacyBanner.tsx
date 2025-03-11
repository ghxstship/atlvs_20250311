import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, X } from 'lucide-react';

export default function PrivacyBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('privacy-consent');
    const lastPolicyUpdate = localStorage.getItem('policy-last-updated');
    const currentPolicyVersion = '2024-03-15'; // Update this when policies change

    if (!consent || (lastPolicyUpdate !== currentPolicyVersion)) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    const currentPolicyVersion = '2024-03-15';
    localStorage.setItem('privacy-consent', 'accepted');
    localStorage.setItem('policy-last-updated', currentPolicyVersion);
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      role="dialog"
      aria-labelledby="privacy-consent-title"
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-mono-200 shadow-lg p-4 md:p-6 z-50 animate-slide-up"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center">
            <Shield className="w-4 h-4 text-mono-400 mr-2" />
            <h2 id="privacy-consent-title" className="text-lg font-semibold text-mono-900">
              We Value Your Privacy
            </h2>
          </div>
          <p className="mt-2 text-mono-600">
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
            Read our <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link> and{' '}
            <Link to="/terms" className="text-accent hover:underline">Terms of Service</Link> to learn more.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-white bg-mono-900 rounded-lg hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mono-500"
          >
            Accept
          </button>
          <button
            onClick={handleClose}
            className="p-2 text-mono-400 hover:text-mono-500 rounded-full hover:bg-mono-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mono-500"
            aria-label="Close privacy banner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}