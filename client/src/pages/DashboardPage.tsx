import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Activity,
  Wrench,
  AlertOctagon,
  Clock,
  ShieldAlert,
  ArrowRight,
  PlusCircle,
  RefreshCw,
  Server,
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService.js';
import { DashboardStats, SoftwareSystem, DistributionItem } from '../types/index.js';
import { StatCard } from '../components/dashboard/StatCard.js';
import {
  StatusDistributionChart,
  TechnologyDistributionChart,
  DomainDistributionChart,
  CriticalityDistributionChart,
} from '../components/dashboard/Charts.js';
import { StatusBadge } from '../components/common/StatusBadge.js';
import { LoadingSpinner } from '../components/common/LoadingSpinner.js';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    active: 0,
    maintenance: 0,
    deprecated: 0,
    planned: 0,
    critical: 0,
  });
  const [recentSystems, setRecentSystems] = useState<SoftwareSystem[]>([]);
  const [statusData, setStatusData] = useState<DistributionItem[]>([]);
  const [techData, setTechData] = useState<DistributionItem[]>([]);
  const [domainData, setDomainData] = useState<DistributionItem[]>([]);
  const [criticalityData, setCriticalityData] = useState<DistributionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [
        statsRes,
        recentRes,
        statusRes,
        techRes,
        domainRes,
        critRes,
      ] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecent(5),
        dashboardService.getStatusDistribution(),
        dashboardService.getTechnologyDistribution(),
        dashboardService.getDomainDistribution(),
        dashboardService.getCriticalityDistribution(),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (recentRes.success) setRecentSystems(recentRes.data);
      if (statusRes.success) setStatusData(statusRes.data);
      if (techRes.success) setTechData(techRes.data);
      if (domainRes.success) setDomainData(domainRes.data);
      if (critRes.success) setCriticalityData(critRes.data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Enterprise Software Architecture Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time status, health, and distribution of all organizational applications and platforms.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-brand-600' : 'text-slate-500'}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Metrics'}</span>
          </button>

          <Link
            to="/registry/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors shadow-md shadow-brand-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Software</span>
          </Link>
        </div>
      </div>

      {/* SUMMARY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Software Systems"
          value={stats.total}
          description="Registered corporate assets"
          icon={Layers}
          colorScheme="brand"
          isLoading={isLoading}
        />
        <StatCard
          title="Active Systems"
          value={stats.active}
          description="Fully operational in production"
          icon={Activity}
          colorScheme="emerald"
          isLoading={isLoading}
        />
        <StatCard
          title="Under Maintenance"
          value={stats.maintenance}
          description="Scheduled updates/patches"
          icon={Wrench}
          colorScheme="amber"
          isLoading={isLoading}
        />
        <StatCard
          title="Deprecated Systems"
          value={stats.deprecated}
          description="Scheduled for decommission"
          icon={AlertOctagon}
          colorScheme="rose"
          isLoading={isLoading}
        />
        <StatCard
          title="Planned Systems"
          value={stats.planned}
          description="Architecture design & dev"
          icon={Clock}
          colorScheme="sky"
          isLoading={isLoading}
        />
      </div>

      {/* CHARTS GRID (2x2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Status Distribution */}
        <div className="card-enterprise p-5">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Software Systems by Status</h3>
              <p className="text-xs text-slate-500">Breakdown of operational lifecycle stages</p>
            </div>
            <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
              Lifecycle
            </span>
          </div>
          <StatusDistributionChart data={statusData} isLoading={isLoading} />
        </div>

        {/* Chart 2: Technology Distribution */}
        <div className="card-enterprise p-5">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Software Systems by Technology</h3>
              <p className="text-xs text-slate-500">Most utilized languages, frameworks & clouds</p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              Tech Stacks
            </span>
          </div>
          <TechnologyDistributionChart data={techData} isLoading={isLoading} />
        </div>

        {/* Chart 3: Business Domain */}
        <div className="card-enterprise p-5">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Software Systems by Business Domain</h3>
              <p className="text-xs text-slate-500">Distribution across departmental owners</p>
            </div>
            <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
              Ownership
            </span>
          </div>
          <DomainDistributionChart data={domainData} isLoading={isLoading} />
        </div>

        {/* Chart 4: Criticality Distribution */}
        <div className="card-enterprise p-5">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Software Systems by Criticality</h3>
              <p className="text-xs text-slate-500">Business impact and disaster recovery tier</p>
            </div>
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
              Risk Tier
            </span>
          </div>
          <CriticalityDistributionChart data={criticalityData} isLoading={isLoading} />
        </div>
      </div>

      {/* RECENT SYSTEMS TABLE */}
      <div className="card-enterprise overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recently Updated Software Systems</h3>
            <p className="text-xs text-slate-500">Latest changes logged across the inventory</p>
          </div>
          <Link
            to="/registry"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <span>View All Registry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="px-5 py-3">System Name</th>
                <th className="px-5 py-3">Domain Owner</th>
                <th className="px-5 py-3">Technology Stack</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Last Updated</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center">
                    <LoadingSpinner size="md" />
                  </td>
                </tr>
              ) : recentSystems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-xs text-slate-500">
                    No software systems registered yet.
                  </td>
                </tr>
              ) : (
                recentSystems.map((sys) => (
                  <tr key={sys.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link
                        to={`/registry/${sys.id}`}
                        className="font-semibold text-slate-900 hover:text-brand-600 text-sm transition-colors"
                      >
                        {sys.name}
                      </Link>
                      <div className="text-[11px] font-mono text-slate-400">{sys.systemId}</div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-700">
                      <div className="font-medium text-slate-900">{sys.domainOwner}</div>
                      <div className="text-[11px] text-slate-400">{sys.businessDomain}</div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-600 max-w-xs truncate">
                      {sys.technologyStack}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={sys.status} size="sm" />
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500 font-mono">
                      {formatDate(sys.lastUpdated || sys.updatedAt)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        to={`/registry/${sys.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                      >
                        <span>Profile</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
