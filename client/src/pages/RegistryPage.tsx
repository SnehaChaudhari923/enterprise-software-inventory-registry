import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Download, RefreshCw, Layers } from 'lucide-react';
import { softwareService } from '../services/softwareService.js';
import { SoftwareSystem, SoftwareFilterState } from '../types/index.js';
import { SoftwareFilterBar } from '../components/software/SoftwareFilterBar.js';
import { SoftwareTable } from '../components/software/SoftwareTable.js';
import { useToast } from '../context/ToastContext.js';

export const RegistryPage: React.FC = () => {
  const { success, error } = useToast();

  const [systems, setSystems] = useState<SoftwareSystem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const [filters, setFilters] = useState<SoftwareFilterState>({
    search: '',
    status: 'ALL',
    environment: 'ALL',
    criticality: 'ALL',
    businessDomain: 'ALL',
    sortBy: 'lastUpdated',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  });

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const loadSystems = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await softwareService.getSoftwareList(filters);
      if (res.success) {
        setSystems(res.data);
        setPagination(res.pagination);
      }
    } catch (err: any) {
      error('Failed to load software systems', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [filters, error]);

  useEffect(() => {
    loadSystems();
  }, [loadSystems]);

  const handleFilterChange = (newFilters: Partial<SoftwareFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'ALL',
      environment: 'ALL',
      criticality: 'ALL',
      businessDomain: 'ALL',
      sortBy: 'lastUpdated',
      sortOrder: 'desc',
      page: 1,
      limit: 10,
    });
  };

  const handleDeleteSystem = async (id: string) => {
    try {
      const res = await softwareService.deleteSoftware(id);
      if (res.success) {
        success('System Deleted', 'The software system record was deleted successfully.');
        loadSystems();
      }
    } catch (err: any) {
      error('Deletion Failed', err.message || 'Could not delete software system.');
    }
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      await softwareService.exportCsv(filters);
      success('Export Completed', 'Software inventory CSV file has been downloaded.');
    } catch (err: any) {
      error('Export Failed', err.message || 'Could not generate CSV export.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-brand-600" />
            <span>Corporate Software Registry</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Centralized database of all internal enterprise software systems, ownership, and tech stacks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadSystems}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-50"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-brand-600' : 'text-slate-500'}`} />
            <span>Refresh</span>
          </button>

          <Link
            to="/registry/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors shadow-md shadow-brand-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Software System</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <SoftwareFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onExportCsv={handleExportCsv}
        totalCount={pagination.total}
        isExporting={isExporting}
      />

      {/* Data Table */}
      <SoftwareTable
        systems={systems}
        filters={filters}
        pagination={pagination}
        isLoading={isLoading}
        onFilterChange={handleFilterChange}
        onDeleteSystem={handleDeleteSystem}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
};
