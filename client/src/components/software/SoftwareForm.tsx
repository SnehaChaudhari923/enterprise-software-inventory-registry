import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Save,
  ArrowLeft,
  Server,
  Code2,
  Layers,
  Shield,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { SoftwareFormData, SoftwareSystem } from '../../types/index.js';
import { LoadingSpinner } from '../common/LoadingSpinner.js';

interface SoftwareFormProps {
  initialData?: Partial<SoftwareSystem>;
  onSubmit: (data: SoftwareFormData) => Promise<void>;
  isSubmitting: boolean;
  isEditMode?: boolean;
}

export const SoftwareForm: React.FC<SoftwareFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  isEditMode = false,
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SoftwareFormData>({
    systemId: initialData?.systemId || '',
    name: initialData?.name || '',
    description: initialData?.description || '',
    businessDomain: initialData?.businessDomain || 'IT',
    domainOwner: initialData?.domainOwner || '',
    ownerEmail: initialData?.ownerEmail || '',
    developmentTeam: initialData?.developmentTeam || '',
    technologyStack: initialData?.technologyStack || '',
    programmingLanguage: initialData?.programmingLanguage || '',
    framework: initialData?.framework || '',
    database: initialData?.database || '',
    infrastructure: initialData?.infrastructure || '',
    repositoryUrl: initialData?.repositoryUrl || '',
    documentationUrl: initialData?.documentationUrl || '',
    environment: initialData?.environment || 'Production',
    status: initialData?.status || 'Active',
    criticality: initialData?.criticality || 'Medium',
    version: initialData?.version || '1.0.0',
    deploymentDate: initialData?.deploymentDate
      ? new Date(initialData.deploymentDate).toISOString().split('T')[0]
      : '',
    dependencies: initialData?.dependencies || '',
    securityNotes: initialData?.securityNotes || '',
    complianceRequirements: initialData?.complianceRequirements || '',
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'System name is required';
    if (!formData.systemId.trim()) newErrors.systemId = 'System ID is required';
    if (!formData.description.trim()) newErrors.description = 'System description is required';
    if (!formData.domainOwner.trim()) newErrors.domainOwner = 'Domain owner name is required';
    if (!formData.businessDomain) newErrors.businessDomain = 'Business domain is required';
    if (!formData.technologyStack.trim()) newErrors.technologyStack = 'Technology stack summary is required';

    if (formData.ownerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ownerEmail)) {
      newErrors.ownerEmail = 'Please provide a valid email format';
    }

    if (formData.repositoryUrl && !/^https?:\/\/.+/.test(formData.repositoryUrl)) {
      newErrors.repositoryUrl = 'URL must start with http:// or https://';
    }

    if (formData.documentationUrl && !/^https?:\/\/.+/.test(formData.documentationUrl)) {
      newErrors.documentationUrl = 'URL must start with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Registry</span>
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {isEditMode ? `Edit Software System: ${formData.name || 'System'}` : 'Register New Software System'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Fill in the enterprise metadata and architectural specifications below. Required fields are marked with an asterisk (*).
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:opacity-50 shadow-md shadow-brand-600/20 transition-all"
          >
            {isSubmitting ? (
              <LoadingSpinner size="sm" color="text-white" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isEditMode ? 'Save Changes' : 'Register System'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Basic Information */}
      <div className="card-enterprise p-6 space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-slate-900 font-semibold text-base">
          <Server className="w-5 h-5 text-brand-600" />
          <span>1. Basic Information</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* System Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              System Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Enterprise HR Portal & Talent Suite"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
              }`}
            />
            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
          </div>

          {/* System ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              System ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="systemId"
              placeholder="e.g. SYS-HR-001 or HR-TALENT-01"
              value={formData.systemId}
              onChange={handleChange}
              className={`w-full px-3.5 py-2 text-sm font-mono bg-white border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                errors.systemId ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
              }`}
            />
            {errors.systemId && <p className="text-xs text-rose-600 mt-1">{errors.systemId}</p>}
          </div>

          {/* Business Domain */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Business Domain <span className="text-rose-500">*</span>
            </label>
            <select
              name="businessDomain"
              value={formData.businessDomain}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-800"
            >
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

          {/* Domain Owner */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Domain Owner <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="domainOwner"
              placeholder="e.g. Sarah Jenkins"
              value={formData.domainOwner}
              onChange={handleChange}
              className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                errors.domainOwner ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
              }`}
            />
            {errors.domainOwner && <p className="text-xs text-rose-600 mt-1">{errors.domainOwner}</p>}
          </div>

          {/* Owner Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Owner Email
            </label>
            <input
              type="email"
              name="ownerEmail"
              placeholder="e.g. sarah.jenkins@enterprise.internal"
              value={formData.ownerEmail}
              onChange={handleChange}
              className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                errors.ownerEmail ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
              }`}
            />
            {errors.ownerEmail && <p className="text-xs text-rose-600 mt-1">{errors.ownerEmail}</p>}
          </div>

          {/* Development Team */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Development Team / Squad
            </label>
            <input
              type="text"
              name="developmentTeam"
              placeholder="e.g. People Tech Core Squad"
              value={formData.developmentTeam || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Description (Full Width) */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              System Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Provide a comprehensive summary of what this software system does, its purpose, and key capabilities..."
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                errors.description ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
              }`}
            />
            {errors.description && <p className="text-xs text-rose-600 mt-1">{errors.description}</p>}
          </div>
        </div>
      </div>

      {/* SECTION 2: Technical Architecture */}
      <div className="card-enterprise p-6 space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-slate-900 font-semibold text-base">
          <Code2 className="w-5 h-5 text-indigo-600" />
          <span>2. Technical Information & Stack</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Technology Stack Summary */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Technology Stack Summary <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="technologyStack"
              placeholder="e.g. React, Node.js, Express, PostgreSQL, Redis, Docker, AWS ECS"
              value={formData.technologyStack}
              onChange={handleChange}
              className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                errors.technologyStack ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
              }`}
            />
            {errors.technologyStack && (
              <p className="text-xs text-rose-600 mt-1">{errors.technologyStack}</p>
            )}
          </div>

          {/* Programming Language */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Primary Programming Language
            </label>
            <input
              type="text"
              name="programmingLanguage"
              placeholder="e.g. TypeScript, Go, Java 21, Python 3.11"
              value={formData.programmingLanguage || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Framework */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Application Framework
            </label>
            <input
              type="text"
              name="framework"
              placeholder="e.g. Next.js 14, Spring Boot 3.2, FastAPI, Django"
              value={formData.framework || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Database */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Primary Database / Storage
            </label>
            <input
              type="text"
              name="database"
              placeholder="e.g. PostgreSQL 16, Redis Cluster, MongoDB"
              value={formData.database || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Infrastructure */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Hosting / Infrastructure
            </label>
            <input
              type="text"
              name="infrastructure"
              placeholder="e.g. AWS EKS, GCP Cloud Run, Azure App Service, On-Prem"
              value={formData.infrastructure || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Repository URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Source Code Repository URL
            </label>
            <input
              type="url"
              name="repositoryUrl"
              placeholder="https://github.com/enterprise-org/repo-name"
              value={formData.repositoryUrl || ''}
              onChange={handleChange}
              className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                errors.repositoryUrl ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
              }`}
            />
            {errors.repositoryUrl && <p className="text-xs text-rose-600 mt-1">{errors.repositoryUrl}</p>}
          </div>

          {/* Documentation URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Architecture / Wiki Documentation URL
            </label>
            <input
              type="url"
              name="documentationUrl"
              placeholder="https://wiki.enterprise.internal/display/SYSTEM"
              value={formData.documentationUrl || ''}
              onChange={handleChange}
              className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
                errors.documentationUrl ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
              }`}
            />
            {errors.documentationUrl && (
              <p className="text-xs text-rose-600 mt-1">{errors.documentationUrl}</p>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: System & Deployment Information */}
      <div className="card-enterprise p-6 space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-slate-900 font-semibold text-base">
          <Layers className="w-5 h-5 text-emerald-600" />
          <span>3. Deployment & Lifecycle Status</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Lifecycle Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-slate-800"
            >
              <option value="Active">Active</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Deprecated">Deprecated</option>
              <option value="Planned">Planned</option>
            </select>
          </div>

          {/* Environment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Environment
            </label>
            <select
              name="environment"
              value={formData.environment}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-slate-800"
            >
              <option value="Production">Production</option>
              <option value="Staging">Staging</option>
              <option value="Development">Development</option>
              <option value="Testing">Testing</option>
            </select>
          </div>

          {/* Criticality */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              System Criticality
            </label>
            <select
              name="criticality"
              value={formData.criticality}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-slate-800"
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Version */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Release Version
            </label>
            <input
              type="text"
              name="version"
              placeholder="e.g. 3.4.2"
              value={formData.version || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Deployment Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Initial Deployment Date
            </label>
            <input
              type="date"
              name="deploymentDate"
              value={formData.deploymentDate || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: Governance, Security & Compliance */}
      <div className="card-enterprise p-6 space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-slate-900 font-semibold text-base">
          <Shield className="w-5 h-5 text-amber-600" />
          <span>4. Governance, Security & Compliance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Dependencies */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Key Upstream / Downstream Dependencies
            </label>
            <textarea
              name="dependencies"
              rows={2}
              placeholder="e.g. Okta SSO, Workday API, Payment Gateway, Kafka Cluster"
              value={formData.dependencies || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Security Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Security Notes & Encryption Specs
            </label>
            <textarea
              name="securityNotes"
              rows={2}
              placeholder="e.g. Data encrypted at rest via AES-256; TLS 1.3 enforced; MFA required."
              value={formData.securityNotes || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Compliance Requirements */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Compliance & Regulatory Standards
            </label>
            <textarea
              name="complianceRequirements"
              rows={2}
              placeholder="e.g. SOC 2 Type II, ISO 27001, GDPR, HIPAA, SOX 404"
              value={formData.complianceRequirements || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Operational Notes & Roadmap
            </label>
            <textarea
              name="notes"
              rows={2}
              placeholder="e.g. Planned migration to microservices in Q3; next security audit in October."
              value={formData.notes || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:opacity-50 shadow-md shadow-brand-600/20 transition-all"
        >
          {isSubmitting ? (
            <LoadingSpinner size="sm" color="text-white" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isEditMode ? 'Update Software System' : 'Save & Register System'}</span>
        </button>
      </div>
    </form>
  );
};
