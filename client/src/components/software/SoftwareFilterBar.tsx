import React from 'react';
import { Search, X, RotateCcw, Filter, Download } from 'lucide-react';
import { SoftwareFilterState } from '../../types/index.js';

interface SoftwareFilterBarProps {
  filters: SoftwareFilterState;
  onFilterChange: (newFilters: Partial<SoftwareFilterState>) => void;
  onClearFilters: () => void;
  onExportCsv?: () => void;
  totalCount?: number;
  isExporting?: boolean;
}

export const SoftwareFilterBar: React.FC<SoftwareFilterBarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  onExportCsv,
  totalCount,
  isExporting = false,
}) => {
  const hasActiveFilters =
    Boolean(filters.search) ||
    (filters.status && filters.status !== 'ALL') ||
    (filters.environment && filters.environment !== 'ALL') ||
    (filters.criticality && filters.criticality !== 'ALL') ||
    (filters.businessDomain && filters.businessDomain !== 'ALL');

  return (
    <div className="card-enterprise p-4 sm:p-5 space-y-4">
      {/* Top row: Search input & Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search box */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by system name, ID, owner, tech stack, or description..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange({ search: '', page: 1 })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Export and Clear buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Reset all search filters"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Clear Filters</span>
            </button>
          )}

          {onExportCsv && (
            <button
              type="button"
              disabled={isExporting}
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
        {/* Status Filter */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Status
          </label>
          <select
            value={filters.status || 'ALL'}
            onChange={(e) => onFilterChange({ status: e.target.value, page: 1 })}
            className="w-full py-2 px-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-brand-500 text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Deprecated">Deprecated</option>
            <option value="Planned">Planned</option>
          </select>
        </div>

        {/* Environment Filter */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Environment
          </label>
          <select
            value={filters.environment || 'ALL'}
            onChange={(e) => onFilterChange({ environment: e.target.value, page: 1 })}
            className="w-full py-2 px-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-brand-500 text-slate-700"
          >
            <option value="ALL">All Environments</option>
            <option value="Production">Production</option>
            <option value="Staging">Staging</option>
            <option value="Development">Development</option>
            <option value="Testing">Testing</option>
          </select>
        </div>

        {/* Criticality Filter */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Criticality
          </label>
          <select
            value={filters.criticality || 'ALL'}
            onChange={(e) => onFilterChange({ criticality: e.target.value, page: 1 })}
            className="w-full py-2 px-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-brand-500 text-slate-700"
          >
            <option value="ALL">All Criticalities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Business Domain Filter */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Business Domain
          </label>
          <select
            value={filters.businessDomain || 'ALL'}
            onChange={(e) => onFilterChange({ businessDomain: e.target.value, page: 1 })}
            className="w-full py-2 px-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-brand-500 text-slate-700"
          >
            <option value="ALL">All Domains</option>
            <option value="Finance">Finance</option>
            <option value="HR">HR</option>
            <option value="Sales">Sales</option>
            <option value="Operations">Operations</option>
            <option value="IT">IT</option>
            <option value="Customer Service">Customer Service</option>
            <option value="Marketing">Marketing</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Summary count info */}
      {typeof totalCount === 'number' && (
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Showing <span className="font-semibold text-slate-900">{totalCount}</span> software system{totalCount !== 1 ? 's' : ''}
              {hasActiveFilters ? ' matching filters' : ' registered'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
