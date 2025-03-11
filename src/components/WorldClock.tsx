import React, { useState, useEffect } from 'react';
import { Clock as ClockIcon, RotateCcw } from 'lucide-react';

interface WorldClockProps {
  timeZone: string;
  label: string;
  isAnalog?: boolean;
  onToggleFormat?: () => void;
  onChangeTimeZone?: (timeZone: string) => void;
}

const timeZones = [
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'UTC', label: 'UTC' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Paris', label: 'Paris' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
  { value: 'Asia/Shanghai', label: 'Shanghai' },
  { value: 'Australia/Sydney', label: 'Sydney' }
];

export default function WorldClock({ 
  timeZone, 
  label, 
  isAnalog = false,
  onToggleFormat,
  onChangeTimeZone 
}: WorldClockProps) {
  const [time, setTime] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDigitalTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  };

  const renderAnalogClock = () => {
    const now = new Date(time.toLocaleString('en-US', { timeZone }));
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const hourDegrees = (hours * 30) + (minutes / 2);
    const minuteDegrees = minutes * 6;
    const secondDegrees = seconds * 6;

    return (
      <div className="relative w-24 h-24 rounded-full border-2 border-mono-200 bg-white">
        {/* Hour marks */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-2 bg-mono-400"
            style={{
              transform: `rotate(${i * 30}deg) translateY(-42px)`,
              left: '50%',
              transformOrigin: 'bottom'
            }}
          />
        ))}
        
        {/* Hour hand */}
        <div 
          className="absolute left-1/2 top-1/2 w-1 h-[30%] bg-mono-900 rounded-full origin-bottom transform -translate-x-1/2"
          style={{ transform: `rotate(${hourDegrees}deg) translateY(-50%)` }}
        />
        
        {/* Minute hand */}
        <div 
          className="absolute left-1/2 top-1/2 w-0.5 h-[40%] bg-mono-700 rounded-full origin-bottom transform -translate-x-1/2"
          style={{ transform: `rotate(${minuteDegrees}deg) translateY(-50%)` }}
        />
        
        {/* Second hand */}
        <div 
          className="absolute left-1/2 top-1/2 w-0.5 h-[45%] bg-accent rounded-full origin-bottom transform -translate-x-1/2"
          style={{ transform: `rotate(${secondDegrees}deg) translateY(-50%)` }}
        />
        
        {/* Center dot */}
        <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-mono-900 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        {isEditing ? (
          <select
            value={timeZone}
            onChange={(e) => {
              onChangeTimeZone?.(e.target.value);
              setIsEditing(false);
            }}
            className="text-sm border border-mono-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-mono-500 focus:border-mono-500"
          >
            {timeZones.map(tz => (
              <option key={tz.value} value={tz.value}>{tz.label}</option>
            ))}
          </select>
        ) : (
          <h3 
            className="text-sm font-medium text-mono-900 cursor-pointer hover:text-accent"
            onClick={() => setIsEditing(true)}
          >
            {label}
          </h3>
        )}
        <button 
          onClick={onToggleFormat}
          className="p-1 text-mono-400 hover:text-accent rounded-full hover:bg-mono-100"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-center">
        {isAnalog ? (
          renderAnalogClock()
        ) : (
          <div className="text-2xl font-mono text-mono-900">
            {formatDigitalTime(time)}
          </div>
        )}
      </div>
    </div>
  );
}