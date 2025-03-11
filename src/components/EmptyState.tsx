import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: typeof LucideIcon;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon: Icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="col-span-full py-16 text-center">
      <div className="mb-4">
        <Icon className="w-12 h-12 text-mono-300 mx-auto" />
      </div>
      <h3 className="text-lg font-medium text-mono-900 mb-1">{title}</h3>
      <p className="text-mono-500 mb-4">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}