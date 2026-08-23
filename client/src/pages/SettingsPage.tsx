import React, { useState } from 'react';
import {
  User,
  Shield,
  Palette,
  Sliders,
  CheckCircle2,
  Server,
  Save,
  Building,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { success } = useToast();

  const [name, setName] = useState(user?.name || 'Enterprise System Administrator');
  const [department, setDepartment] = useState(user?.department || 'Enterprise Architecture & Governance');
  const [appName, setAppName] = useState('Enterprise Software Inventory Registry');
  const [theme, setTheme] = useState('light');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, department });
    setIsSaved(true);
    success('Settings Updated', 'Your profile and application preferences were saved.');
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          System & Account Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your enterprise profile, workspace settings, and application preferences.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile Card */}
        <div className="card-enterprise p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm uppercase tracking-wider">
            <User className="w-4 h-4 text-brand-600" />
            <span>Administrator Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address (Corporate SSO)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || 'admin@enterprise.internal'}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400 mt-1">Managed via corporate identity provider.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Role & Access Level
              </label>
              <div className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand-50 border border-brand-200 rounded-lg text-xs font-semibold text-brand-700">
                <Shield className="w-4 h-4 text-brand-600" />
                <span>{user?.role || 'ADMIN'} (Full Governance Privileges)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Application Preferences */}
        <div className="card-enterprise p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>Application Preferences</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Registry Application Title
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Theme & Interface Style
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-slate-700"
              >
                <option value="light">Enterprise Light (Clean & Accessible)</option>
                <option value="navy">Enterprise Slate / Navy Accents</option>
              </select>
            </div>
          </div>
        </div>

        {/* System & Architecture Specs */}
        <div className="card-enterprise p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm uppercase tracking-wider">
            <Server className="w-4 h-4 text-emerald-600" />
            <span>Backend & Infrastructure Status</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-1">Architecture</span>
              <span className="font-semibold text-slate-900">React + Express + PostgreSQL</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-1">ORM Engine</span>
              <span className="font-semibold text-slate-900">Prisma Client v6.x</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-1">Security Standard</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>JWT Bearer Encrypted</span>
              </span>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-md shadow-brand-600/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSaved ? 'Preferences Saved!' : 'Save Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
