'use client';

import { ReactNode } from 'react';

interface IndicatorCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  icon?: ReactNode;
  color?: string;
  description?: string;
}

export default function IndicatorCard({
  title,
  value,
  unit,
  trend,
  trendValue,
  icon,
  color = 'blue',
  description,
}: IndicatorCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    red: 'bg-red-50 border-red-200',
    purple: 'bg-purple-50 border-purple-200',
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    stable: '→',
  };

  const trendColors = {
    up: 'text-red-600',
    down: 'text-green-600',
    stable: 'text-gray-600',
  };

  return (
    <div
      className={`rounded-lg border-2 p-6 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue} transition-all hover:shadow-lg`}
      role="article"
      aria-label={`${title}: ${value} ${unit || ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{value}</span>
            {unit && <span className="text-lg text-gray-600">{unit}</span>}
          </div>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${trendColors[trend]}`}>
              <span className="text-lg">{trendIcons[trend]}</span>
              <span>{trendValue}</span>
            </div>
          )}
          {description && (
            <p className="text-xs text-gray-500 mt-2">{description}</p>
          )}
        </div>
        {icon && (
          <div className="text-4xl opacity-80 ml-4">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
