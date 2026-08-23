import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: LucideIcon;
  colorScheme: 'brand' | 'emerald' | 'amber' | 'rose' | 'sky' | 'indigo';
  trend?: string;
  isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  colorScheme,
  trend,
  isLoading = false,
}) => {
  const schemes = {
    brand: {
      bg: 'bg-brand-50',
      iconBg: 'bg-brand-600 text-white',
      border: 'border-brand-100',
      text: 'text-brand-600',
      badge: 'bg-brand-100 text-brand-700',
    },
    emerald: {
      bg: 'bg-emerald-50/50',
      iconBg: 'bg-emerald-600 text-white',
      border: 'border-emerald-100',
      text: 'text-emerald-600',
      badge: 'bg-emerald-100 text-emerald-700',
    },
    amber: {
      bg: 'bg-amber-50/50',
      iconBg: 'bg-amber-500 text-white',
      border: 'border-amber-100',
      text: 'text-amber-600',
      badge: 'bg-amber-100 text-amber-700',
    },
    rose: {
      bg: 'bg-rose-50/50',
      iconBg: 'bg-rose-600 text-white',
      border: 'border-rose-100',
      text: 'text-rose-600',
      badge: 'bg-rose-100 text-rose-700',
    },
    sky: {
      bg: 'bg-sky-50/50',
      iconBg: 'bg-sky-600 text-white',
      border: 'border-sky-100',
      text: 'text-sky-600',
      badge: 'bg-sky-100 text-sky-700',
    },
    indigo: {
      bg: 'bg-indigo-50/50',
      iconBg: 'bg-indigo-600 text-white',
      border: 'border-indigo-100',
      text: 'text-indigo-600',
      badge: 'bg-indigo-100 text-indigo-700',
    },
  };

  const scheme = schemes[colorScheme] || schemes.brand;

  return (
    <div className={`card-enterprise p-5 relative overflow-hidden ${scheme.border}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          {isLoading ? (
            <div className="h-8 w-16 bg-slate-200 animate-pulse rounded-md mt-1" />
          ) : (
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {value}
            </h3>
          )}
        </div>

        <div className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-xs ${scheme.iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        <span className="text-slate-600 font-normal truncate max-w-[200px]">
          {description}
        </span>
        {trend && (
          <span className={`px-2 py-0.5 rounded-md font-medium text-[11px] ${scheme.badge}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
