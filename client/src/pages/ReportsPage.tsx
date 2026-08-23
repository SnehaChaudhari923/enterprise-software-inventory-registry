import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  Layers,
  Activity,
  AlertOctagon,
  Wrench,
  Clock,
  ShieldAlert,
  Server,
  RefreshCw,
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService.js';
import { softwareService } from '../services/softwareService.js';
import { DashboardStats, DistributionItem } from '../types/index.js';
import {
  StatusDistributionChart,
  TechnologyDistributionChart,
  DomainDistributionChart,
  CriticalityDistributionChart,
} from '../components/dashboard/Charts.js';
import { LoadingSpinner } from '../components/common/LoadingSpinner.js';
import { useToast } from '../context/ToastContext.js';

export const ReportsPage: React.FC = () => {
  const { success, error } = useToast();

  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    active: 0,
    maintenance: 0,
    deprecated: 0,
    planned: 0,
    critical: 0,
  });
  const [statusData, setStatusData] = useState<DistributionItem[]>([]);
  const [techData, setTechData] = useState<DistributionItem[]>([]);
  const [domainData, setDomainData] = useState<DistributionItem[]>([]);
  const [criticalityData, setCriticalityData] = useState<DistributionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, statusRes, techRes, domainRes, critRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getStatusDistribution(),
        dashboardService.getTechnologyDistribution(),
        dashboardService.getDomainDistribution(),
        dashboardService.getCriticalityDistribution(),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (statusRes.success) setStatusData(statusRes.data);
      if (techRes.success) setTechData(techRes.data);
      if (domainRes.success) setDomainData(domainRes.data);
      if (critRes.success) setCriticalityData(critRes.data);
    } catch (err: any) {
      error('Failed to load reports', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      await softwareService.exportCsv({});
      success('Export Completed', 'Full enterprise inventory CSV report generated.');
    } catch (err: any) {
      error('Export Failed', err.message || 'Failed to export CSV report.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-brand-600" />
            <span>Architecture Governance & Inventory Reports</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Audit summaries, technological footprint analytics, and CSV data exports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchReportData}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-brand-600' : 'text-slate-500'}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            disabled={isExporting}
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            {isExporting ? (
              <LoadingSpinner size="sm" color="text-white" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Export Full Registry CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="card-enterprise p-4 text-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Total Systems
          </span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
            {stats.total}
          </span>
        </div>

        <div className="card-enterprise p-4 text-center border-emerald-100 bg-emerald-50/30">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block">
            Active
          </span>
          <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">
            {stats.active}
          </span>
        </div>

        <div className="card-enterprise p-4 text-center border-amber-100 bg-amber-50/30">
          <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider block">
            Maintenance
          </span>
          <span className="text-2xl font-extrabold text-amber-700 mt-1 block">
            {stats.maintenance}
          </span>
        </div>

        <div className="card-enterprise p-4 text-center border-rose-100 bg-rose-50/30">
          <span className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider block">
            Deprecated
          </span>
          <span className="text-2xl font-extrabold text-rose-700 mt-1 block">
            {stats.deprecated}
          </span>
        </div>

        <div className="card-enterprise p-4 text-center border-sky-100 bg-sky-50/30">
          <span className="text-[11px] font-semibold text-sky-600 uppercase tracking-wider block">
            Planned
          </span>
          <span className="text-2xl font-extrabold text-sky-700 mt-1 block">
            {stats.planned}
          </span>
        </div>

        <div className="card-enterprise p-4 text-center border-red-100 bg-red-50/30">
          <span className="text-[11px] font-semibold text-red-600 uppercase tracking-wider block">
            Tier-1 Critical
          </span>
          <span className="text-2xl font-extrabold text-red-700 mt-1 block">
            {stats.critical}
          </span>
        </div>
      </div>

      {/* CSV Export Card */}
      <div className="card-enterprise p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Full Registry Data Export</h3>
            </div>
            <p className="text-xs text-slate-300 max-w-xl">
              Export all system records including System IDs, owners, programming languages, databases, hosting infrastructure, URLs, dependencies, and compliance metadata into formatted CSV format.
            </p>
          </div>

          <button
            type="button"
            disabled={isExporting}
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all disabled:opacity-50 whitespace-nowrap"
          >
            {isExporting ? <LoadingSpinner size="sm" color="text-slate-950" /> : <Download className="w-4 h-4" />}
            <span>Download CSV Spreadsheet</span>
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-enterprise p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Systems by Business Domain</h3>
          <p className="text-xs text-slate-500 mb-4">Organizational departments and functional owners</p>
          <DomainDistributionChart data={domainData} isLoading={isLoading} />
        </div>

        <div className="card-enterprise p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Systems by Technology Stack</h3>
          <p className="text-xs text-slate-500 mb-4">Primary programming languages, frameworks and platforms</p>
          <TechnologyDistributionChart data={techData} isLoading={isLoading} />
        </div>

        <div className="card-enterprise p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Systems by Lifecycle Status</h3>
          <p className="text-xs text-slate-500 mb-4">Proportion of active vs planned vs deprecated applications</p>
          <StatusDistributionChart data={statusData} isLoading={isLoading} />
        </div>

        <div className="card-enterprise p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Systems by Risk & Criticality</h3>
          <p className="text-xs text-slate-500 mb-4">Tier classification for business continuity and SLA support</p>
          <CriticalityDistributionChart data={criticalityData} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};
