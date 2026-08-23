import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  ExternalLink,
  GitBranch,
  FileText,
  Server,
  Layers,
  Shield,
  Clock,
  User,
  Mail,
  Building,
  Cpu,
  Database,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
} from 'lucide-react';
import { softwareService } from '../services/softwareService.js';
import { SoftwareSystem } from '../types/index.js';
import { StatusBadge } from '../components/common/StatusBadge.js';
import { CriticalityBadge } from '../components/common/CriticalityBadge.js';
import { EnvironmentBadge } from '../components/common/EnvironmentBadge.js';
import { ConfirmationModal } from '../components/common/ConfirmationModal.js';
import { LoadingSpinner } from '../components/common/LoadingSpinner.js';
import { useToast } from '../context/ToastContext.js';

export const SoftwareDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [system, setSystem] = useState<SoftwareSystem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await softwareService.getSoftwareById(id);
        if (res.success && res.data) {
          setSystem(res.data);
        } else {
          error('System Not Found', `No software system exists with ID "${id}"`);
          navigate('/registry');
        }
      } catch (err: any) {
        error('Error Loading Profile', err.message);
        navigate('/registry');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id, navigate, error]);

  const handleDelete = async () => {
    if (!system) return;
    setIsDeleting(true);
    try {
      const res = await softwareService.deleteSoftware(system.id);
      if (res.success) {
        success('System Deleted', `"${system.name}" has been removed from the registry.`);
        navigate('/registry');
      }
    } catch (err: any) {
      error('Delete Failed', err.message || 'Failed to delete software system.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleCopyId = () => {
    if (system?.systemId) {
      navigator.clipboard.writeText(system.systemId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'Not Specified';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="mt-3 text-sm text-slate-500 font-medium">Loading system profile...</p>
      </div>
    );
  }

  if (!system) return null;

  const techBadges = (system.technologyStack || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/registry"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Registry</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {system.name}
            </h2>
            <button
              type="button"
              onClick={handleCopyId}
              className="inline-flex items-center gap-1 font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors"
              title="Copy System ID"
            >
              <span>{system.systemId}</span>
              {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Link
            to={`/registry/${system.id}/edit`}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Edit className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit System</span>
          </Link>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: OVERVIEW CARD */}
      <div className="card-enterprise p-6 space-y-4 bg-gradient-to-br from-white to-slate-50">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={system.status} />
          <CriticalityBadge criticality={system.criticality} />
          <EnvironmentBadge environment={system.environment} />
          {system.version && (
            <span className="px-2.5 py-1 text-xs font-mono font-medium bg-slate-100 text-slate-700 rounded-md border border-slate-200">
              Version {system.version}
            </span>
          )}
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            System Description
          </h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            {system.description}
          </p>
        </div>
      </div>

      {/* GRID 2x2 FOR METADATA SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SECTION 2: OWNERSHIP & DOMAIN */}
        <div className="card-enterprise p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm uppercase tracking-wider">
            <Building className="w-4 h-4 text-brand-600" />
            <span>Ownership & Governance</span>
          </div>

          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-xs font-medium text-slate-500">Business Domain:</span>
              <span className="font-semibold text-slate-900">{system.businessDomain}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-xs font-medium text-slate-500">Domain Owner:</span>
              <span className="font-semibold text-slate-900">{system.domainOwner}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-xs font-medium text-slate-500">Owner Email:</span>
              {system.ownerEmail ? (
                <a
                  href={`mailto:${system.ownerEmail}`}
                  className="font-medium text-brand-600 hover:underline inline-flex items-center gap-1 text-xs"
                >
                  <Mail className="w-3 h-3" />
                  <span>{system.ownerEmail}</span>
                </a>
              ) : (
                <span className="text-slate-400">Not provided</span>
              )}
            </div>

            <div className="flex justify-between py-1">
              <span className="text-xs font-medium text-slate-500">Development Team:</span>
              <span className="font-medium text-slate-800">
                {system.developmentTeam || 'Internal Engineering'}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 3: DEPLOYMENT & LIFECYCLE */}
        <div className="card-enterprise p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm uppercase tracking-wider">
            <Server className="w-4 h-4 text-emerald-600" />
            <span>Deployment & Lifecycle</span>
          </div>

          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-xs font-medium text-slate-500">Deployment Environment:</span>
              <EnvironmentBadge environment={system.environment} size="sm" />
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-xs font-medium text-slate-500">Lifecycle Status:</span>
              <StatusBadge status={system.status} size="sm" />
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-xs font-medium text-slate-500">Initial Deployment:</span>
              <span className="font-medium text-slate-800">{formatDate(system.deploymentDate)}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-xs font-medium text-slate-500">Last Registry Audit:</span>
              <span className="font-medium text-slate-800 font-mono text-xs">
                {formatDate(system.lastUpdated || system.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: TECHNOLOGY STACK */}
      <div className="card-enterprise p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm uppercase tracking-wider">
          <Cpu className="w-4 h-4 text-indigo-600" />
          <span>Technology Stack & Architecture</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">
              Technology Stack Components:
            </label>
            <div className="flex flex-wrap gap-2">
              {techBadges.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-800 rounded-lg border border-slate-200 shadow-2xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-slate-100 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
              <span className="text-slate-400 block mb-1">Language</span>
              <span className="font-semibold text-slate-900 text-sm">
                {system.programmingLanguage || 'N/A'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
              <span className="text-slate-400 block mb-1">Framework</span>
              <span className="font-semibold text-slate-900 text-sm">
                {system.framework || 'N/A'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
              <span className="text-slate-400 block mb-1">Database</span>
              <span className="font-semibold text-slate-900 text-sm">
                {system.database || 'N/A'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
              <span className="text-slate-400 block mb-1">Infrastructure</span>
              <span className="font-semibold text-slate-900 text-sm">
                {system.infrastructure || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: RESOURCES & LINKS */}
      <div className="card-enterprise p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm uppercase tracking-wider">
          <Layers className="w-4 h-4 text-sky-600" />
          <span>Repository & Documentation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700">
                <GitBranch className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Source Repository</h4>
                <p className="text-xs text-slate-500 truncate max-w-xs">
                  {system.repositoryUrl || 'No repository configured'}
                </p>
              </div>
            </div>
            {system.repositoryUrl && (
              <a
                href={system.repositoryUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                title="Open repository"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-brand-50 text-brand-700">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Architecture Wiki</h4>
                <p className="text-xs text-slate-500 truncate max-w-xs">
                  {system.documentationUrl || 'No wiki link configured'}
                </p>
              </div>
            </div>
            {system.documentationUrl && (
              <a
                href={system.documentationUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                title="Open documentation"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 6: COMPLIANCE, SECURITY & DEPENDENCIES */}
      <div className="card-enterprise p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm uppercase tracking-wider">
          <Shield className="w-4 h-4 text-amber-600" />
          <span>Security, Compliance & Dependencies</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
            <span className="font-semibold text-slate-800 block text-xs uppercase tracking-wider">
              Dependencies
            </span>
            <p className="text-slate-600 leading-relaxed">
              {system.dependencies || 'None documented.'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
            <span className="font-semibold text-slate-800 block text-xs uppercase tracking-wider">
              Security Notes
            </span>
            <p className="text-slate-600 leading-relaxed">
              {system.securityNotes || 'Standard enterprise security protocols applied.'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
            <span className="font-semibold text-slate-800 block text-xs uppercase tracking-wider">
              Compliance Standards
            </span>
            <p className="text-slate-600 leading-relaxed">
              {system.complianceRequirements || 'Internal corporate compliance policy.'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
            <span className="font-semibold text-slate-800 block text-xs uppercase tracking-wider">
              Operational Notes
            </span>
            <p className="text-slate-600 leading-relaxed">
              {system.notes || 'No active operational remarks.'}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Software System"
        message={`Are you sure you want to permanently delete "${system.name}" (${system.systemId})? This action cannot be undone.`}
        confirmLabel="Confirm Delete"
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
};
