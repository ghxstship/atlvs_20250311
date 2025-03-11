import React from 'react';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

export type StatusType = 'success' | 'warning' | 'error' | 'info';
export type TrendDirection = 'up' | 'down' | 'neutral';

interface StatusBoxProps {
  title: string;
  value: string | number;
  subtitle?: string;
  type?: StatusType;
  trend?: {
    direction: TrendDirection;
    value: string;
  };
  loading?: boolean;
  onClick?: () => void;
}

const statusStyles = {
  success: {
    background: 'bg-green-50',
    text: 'text-green-800',
    border: 'border-green-100',
  },
  warning: {
    background: 'bg-yellow-50',
    text: 'text-yellow-800',
    border: 'border-yellow-100',
  },
  error: {
    background: 'bg-red-50',
    text: 'text-red-800',
    border: 'border-red-100',
  },
  info: {
    background: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-100',
  },
  default: {
    background: 'bg-white',
    text: 'text-mono-900',
    border: 'border-mono-100',
  }
};

const trendStyles = {
  up: {
    icon: TrendingUp,
    text: 'text-green-600',
  },
  down: {
    icon: TrendingDown,
    text: 'text-red-600',
  },
  neutral: {
    icon: Info,
    text: 'text-mono-600',
  }
};

export default function StatusBox({
  title,
  value,
  subtitle,
  type,
  trend,
  loading = false,
  onClick
}: StatusBoxProps) {
  const styles = type ? statusStyles[type] : statusStyles.default;
  const isClickable = !!onClick;

  const renderTrend = (trend: { direction: TrendDirection; value: string }) => {
    const Icon = trend.direction === 'up' ? TrendingUp :
                 trend.direction === 'down' ? TrendingDown : 
                 Info;
    
    return (
      <div className={`flex items-center ${
        trend.direction === 'up' ? 'text-green-600' :
        trend.direction === 'down' ? 'text-red-600' :
        'text-mono-600'
      } mr-2`}>
        <Icon className="w-4 h-4 mr-1" />
        <span className="text-sm">{trend.value}</span>
      </div>
    );
  };

  return (
    <div
      className={`
        relative rounded-lg shadow p-6 border
        ${styles.background} 
        ${styles.border}
        ${isClickable ? 'cursor-pointer transform transition-transform hover:-translate-y-1 hover:shadow-lg' : ''}
      `}
      onClick={onClick}
      role={isClickable ? 'button' : 'status'}
      aria-label={`${title}: ${value}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-medium ${styles.text}`}>{title}</h2>
      </div>

      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-mono-200 rounded w-24 mb-2"></div>
          {subtitle && <div className="h-4 bg-mono-200 rounded w-32"></div>}
        </div>
      ) : (
        <>
          <p className={`text-3xl font-bold ${styles.text} mb-1`}>{value}</p>
          {(subtitle || trend) && (
            <div className="flex items-center mt-2">
              {trend && (
                renderTrend(trend)
              )}
              {subtitle && <div className="text-sm text-mono-500">{subtitle}</div>}
            </div>
          )}
        </>
      )}
    </div>
  );
}