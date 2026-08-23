import React from 'react';
import { Server, Layers, Cpu, TestTube } from 'lucide-react';

interface EnvironmentBadgeProps {
  environment: string;
  size?: 'sm' | 'md';
}

export const EnvironmentBadge: React.FC<EnvironmentBadgeProps> = ({
  environment,
  size = 'md',
}) => {
  const norm = environment?.toLowerCase() || '';

  let config = {
    label: environment || 'Production',
    bg: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: Server,
  };

  if (norm.includes('staging')) {
    config = {
      label: 'Staging',
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Layers,
    };
  } else if (norm.includes('development') || norm.includes('dev')) {
    config = {
      label: 'Development',
      bg: 'bg-teal-50 text-teal-700 border-teal-200',
      icon: Cpu,
    };
  } else if (norm.includes('test')) {
    config = {
      label: 'Testing',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: TestTube,
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
