import React from 'react';
import { PackageOpen, RotateCcw, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onClearFilters?: () => void;
  showAddButton?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No software systems found',
  description = 'No registered systems match your active search and filter criteria. Try adjusting your query or filters.',
  onClearFilters,
  showAddButton = true,
}) => {
  return (
    <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-300">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 mb-4">
        <PackageOpen className="h-7 w-7 text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-500 max-w-md mx-auto">{description}</p>
      <div className="mt-6 flex items-center justify-center gap-3">
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-2xs transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Clear Filters</span>
          </button>
        )}
        {showAddButton && (
          <Link
            to="/registry/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Software System</span>
          </Link>
        )}
      </div>
    </div>
  );
};
