import React from 'react';
import { Info } from 'lucide-react';

interface DemoLabelProps {
  text?: string;
}

export default function DemoLabel({ text = 'Demo Data' }: DemoLabelProps) {
  return (
    <div className="inline-flex items-center px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-medium">
      <Info className="w-3 h-3 mr-1" />
      {text}
    </div>
  );
}