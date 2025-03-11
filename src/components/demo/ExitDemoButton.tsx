import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function ExitDemoButton() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleExitDemo = async () => {
    try {
      setIsLoading(true);
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error exiting demo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleExitDemo}
      disabled={isLoading}
      className="flex items-center px-4 py-2 text-mono-700 hover:text-accent"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Exit Demo
    </button>
  );
}