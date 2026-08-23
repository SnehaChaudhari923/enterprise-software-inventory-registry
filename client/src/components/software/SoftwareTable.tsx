import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  Edit2,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Code2,
  User,
  Calendar,
} from 'lucide-react';
import { SoftwareSystem, SoftwareFilterState } from '../../types/index.js';
import { StatusBadge } from '../common/StatusBadge.js';
import { CriticalityBadge } from '../common/CriticalityBadge.js';
import { EnvironmentBadge } from '../common/EnvironmentBadge.js';
import { ConfirmationModal } from '../common/ConfirmationModal.js';
import { EmptyState } from '../common/EmptyState.js';
import { LoadingSpinner } from '../common/LoadingSpinner.js';

interface SoftwareTableProps {
  systems: SoftwareSystem[];
  filters: SoftwareFilterState;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  isLoading: boolean;
  onFilterChange: (newFilters: Partial<SoftwareFilterState>) => void;
  onDeleteSystem: (id: string) => Promise<void>;
  onClearFilters: () => void;
}

export const SoftwareTable: React.FC<SoftwareTableProps> = ({
  systems,
  filters,
  pagination,
  isLoading,
  onFilterChange,
  onDeleteSystem,
  onClearFilters,
}) => {
  const [deleteTarget, setDeleteTarget] = useState<SoftwareSystem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSort = (field: string) => {
    if (filters.sortBy === field) {
      onFilterChange({
        sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
        page: 1,
      });
    } else {
      onFilterChange({
        sortBy: field,
        sortOrder: 'asc',
        page: 1,
      });
    }
  };

  const getSortIcon = (field: string) => {
    if (filters.sortBy !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-300 opacity-60 group-hover:opacity-100" />;
    }
    return filters.sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-brand-600 font-bold" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-brand-600 font-bold" />
    );
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await onDeleteSystem(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading && systems.length === 0) {
    return (
      <div className="card-enterprise p-12 text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-3 text-sm text-slate-500 font-medium">Fetching software systems...</p>
      </div>
    );
  }

  if (!isLoading && systems.length === 0) {
    return <EmptyState onClearFilters={onClearFilters} />;
  }

  return (
    <div className="space-y-4">
      {/* Desktop / Tablet Table View */}
      <div className="card-enterprise overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th
                  onClick={() => handleSort('name')}
                  className="table-header cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>System Name</span>
                    {getSortIcon('name')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('systemId')}
                  className="table-header cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>System ID</span>
                    {getSortIcon('systemId')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('businessDomain')}
                  className="table-header cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Domain</span>
                    {getSortIcon('businessDomain')}
                  </div>
                </th>
                <th className="table-header">Domain Owner</th>
                <th className="table-header">Tech Stack</th>
                <th className="table-header">Env</th>
                <th
                  onClick={() => handleSort('status')}
                  className="table-header cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    {getSortIcon('status')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('criticality')}
                  className="table-header cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Criticality</span>
                    {getSortIcon('criticality')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('lastUpdated')}
                  className="table-header cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Last Updated</span>
                    {getSortIcon('lastUpdated')}
                  </div>
                </th>
                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {systems.map((system) => {
                const techList = (system.technologyStack || '')
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .slice(0, 2);

                return (
                  <tr
                    key={system.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Name & Short Description */}
                    <td className="px-4 py-3.5">
                      <Link
                        to={`/registry/${system.id}`}
                        className="font-semibold text-slate-900 hover:text-brand-600 transition-colors block text-sm leading-snug"
                      >
                        {system.name}
                      </Link>
                      {system.version && (
                        <span className="text-[11px] text-slate-400 font-mono">
                          v{system.version}
                        </span>
                      )}
                    </td>

                    {/* System ID */}
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {system.systemId}
                      </span>
                    </td>

                    {/* Business Domain */}
                    <td className="px-4 py-3.5 text-xs font-medium text-slate-700">
                      {system.businessDomain}
                    </td>

                    {/* Domain Owner */}
                    <td className="px-4 py-3.5 text-xs text-slate-600">
                      <div className="font-medium text-slate-800">{system.domainOwner}</div>
                      {system.ownerEmail && (
                        <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                          {system.ownerEmail}
                        </div>
                      )}
                    </td>

                    {/* Tech Stack */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-[160px]">
                        {techList.map((tech, i) => (
                          <span
                            key={i}
                            className="inline-block px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-700 rounded border border-slate-200"
                          >
                            {tech}
                          </span>
                        ))}
                        {system.technologyStack.split(',').length > 2 && (
                          <span className="text-[10px] text-slate-400 font-medium px-1">
                            +{system.technologyStack.split(',').length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Environment */}
                    <td className="px-4 py-3.5">
                      <EnvironmentBadge environment={system.environment} size="sm" />
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusBadge status={system.status} size="sm" />
                    </td>

                    {/* Criticality */}
                    <td className="px-4 py-3.5">
                      <CriticalityBadge criticality={system.criticality} size="sm" />
                    </td>

                    {/* Last Updated */}
                    <td className="px-4 py-3.5 text-xs text-slate-500 font-mono">
                      {formatDate(system.lastUpdated || system.updatedAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/registry/${system.id}`}
                          className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          title="View system profile"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/registry/${system.id}/edit`}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit system record"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(system)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete system"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={filters.limit}
              onChange={(e) => onFilterChange({ limit: Number(e.target.value), page: 1 })}
              className="py-1 px-2 text-xs bg-white border border-slate-300 rounded-md text-slate-700"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span className="text-slate-400">•</span>
            <span>
              Page <span className="font-semibold text-slate-900">{pagination.page}</span> of{' '}
              <span className="font-semibold text-slate-900">{pagination.totalPages}</span> ({pagination.total} total)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => onFilterChange({ page: pagination.page - 1 })}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onFilterChange({ page: pagination.page + 1 })}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        title="Delete Software System"
        message={`Are you sure you want to delete "${deleteTarget?.name}" (${deleteTarget?.systemId})? This action will permanently remove the record from the enterprise inventory.`}
        confirmLabel="Delete System"
        isConfirming={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
