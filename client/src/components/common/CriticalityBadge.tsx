import React from 'react';
import { ShieldAlert, ShieldCheck, Shield, AlertTriangle } from 'lucide-react';

interface CriticalityBadgeProps {
  criticality: string;
  size?: 'sm' | 'md';
}

export const CriticalityBadge: React.FC<CriticalityBadgeProps> = ({
  criticality,
  size = 'md',
}) => {
  const norm = criticality?.toLowerCase() || '';

  let config = {
    label: criticality || 'Medium',
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: Shield,
  };

  if (norm.includes('critical')) {
    config = {
      label: 'Critical',
      bg: 'bg-red-50 text-red-700 border-red-200',
      icon: ShieldAlert,
    };
  } else if (norm.includes('high')) {
    config = {
      label: 'High',
      bg: 'bg-orange-50 text-orange-700 border-orange-200',
      icon: AlertTriangle,
    };
  } else if (norm.includes('low')) {
    config = {
      label: 'Low',
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      icon: ShieldCheck,
    };
  }

  const IconComponent = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${sizeClasses} ${config.bg}`}
    >
      <IconComponent className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
};
