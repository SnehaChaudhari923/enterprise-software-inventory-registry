import React from 'react';
import { Activity, Wrench, AlertOctagon, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showIcon = true,
  size = 'md',
}) => {
  const norm = status?.toLowerCase() || '';

  let config = {
    label: status || 'Active',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20',
    dotBg: 'bg-emerald-500',
    icon: Activity,
  };

  if (norm.includes('maintenance')) {
    config = {
      label: 'Under Maintenance',
      bg: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20',
      dotBg: 'bg-amber-500',
      icon: Wrench,
    };
  } else if (norm.includes('deprecated')) {
    config = {
      label: 'Deprecated',
      bg: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20',
      dotBg: 'bg-rose-500',
      icon: AlertOctagon,
    };
  } else if (norm.includes('planned')) {
    config = {
      label: 'Planned',
      bg: 'bg-sky-50 text-sky-700 border-sky-200 ring-sky-600/20',
      dotBg: 'bg-sky-500',
      icon: Clock,
    };
  }

  const IconComponent = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-2xs ${sizeClasses} ${config.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotBg}`} />
      {showIcon && <IconComponent className="w-3.5 h-3.5 opacity-80" />}
      <span>{config.label}</span>
    </span>
  );
};
