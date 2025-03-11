import React from 'react';
import { cn } from '../lib/utils';
import Avatar from './Avatar';

interface AvatarGroupProps {
  users: Array<{
    id: string | number;
    name: string;
    photo?: string;
  }>;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function AvatarGroup({ 
  users, 
  max = 3,
  size = 'md',
  className 
}: AvatarGroupProps) {
  const visibleUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  return (
    <div 
      className={cn(
        'flex items-center -space-x-2',
        className
      )}
    >
      {visibleUsers.map((user) => (
        <Avatar
          key={user.id}
          src={user.photo}
          alt={user.name}
          size={size}
          className="ring-2 ring-white"
        />
      ))}
      {remainingCount > 0 && (
        <div 
          className={cn(
            'flex items-center justify-center bg-mono-100 text-mono-600 font-medium rounded-full ring-2 ring-white',
            size === 'sm' && 'w-8 h-8 text-xs',
            size === 'md' && 'w-12 h-12 text-sm',
            size === 'lg' && 'w-16 h-16 text-base'
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}