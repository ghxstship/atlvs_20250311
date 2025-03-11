import React from 'react';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { initializeDemoSession } from '../../lib/demo';

export default function DemoButton() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleDemoAccess = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await initializeDemoSession();
      navigate('/?demo=true');
    } catch (error) {
      console.error('Demo access error:', error);
      setError('Unable to access demo. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleDemoAccess}
        disabled={isLoading}
        className="w-full flex items-center justify-center px-4 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
            Accessing Demo...
          </div>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Try Demo Now
          </>
        )}
      </button>

      {error && (
        <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <p className="text-sm text-mono-500 text-center">
        No sign up required. Explore all features instantly.
      </p>
    </div>
  );
}