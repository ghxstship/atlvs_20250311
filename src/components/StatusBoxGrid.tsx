import React from 'react';
import StatusBox, { StatusType } from './StatusBox';

interface StatusBoxGridProps {
  boxes: Array<{
    title: string;
    value: string | number;
    subtitle?: string;
    type?: StatusType;
    trend?: {
      direction: 'up' | 'down' | 'neutral';
      value: string;
    };
    icon?: string;
    onClick?: () => void;
  }>;
  columns?: 2 | 3 | 4;
  loading?: boolean;
}

export default function StatusBoxGrid({ 
  boxes, 
  columns = 4,
  loading = false 
}: StatusBoxGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6 mb-8`}>
      {boxes.map((box, index) => (
        <StatusBox
          key={index}
          {...box}
          loading={loading}
        />
      ))}
    </div>
  );
}