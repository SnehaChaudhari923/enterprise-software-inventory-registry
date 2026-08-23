import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  PlusCircle,
  BarChart3,
  Settings,
  ShieldCheck,
  Building2,
  X,
  Server,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: 'Live',
    },
    {
      to: '/registry',
      label: 'Software Registry',
      icon: Layers,
    },
    {
      to: '/registry/new',
      label: 'Add Software',
      icon: PlusCircle,
    },
    {
      to: '/reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800 bg-slate-900 text-slate-100 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800/80 bg-slate-950/40">
          <Link
            to="/dashboard"
            onClick={() => window.innerWidth < 1024 && onClose()}
            className="flex items-center gap-3 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Server className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                Software Registry
              </span>
              <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase">
                Enterprise Edition
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            System Management
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/dashboard' || item.to === '/'}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`h-4 w-4 transition-colors ${
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Quick Domain Directory Link */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Corporate Governance
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3 px-3.5 py-2 text-xs text-slate-400">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Zero Trust Compliant</span>
              </div>
              <div className="flex items-center gap-3 px-3.5 py-2 text-xs text-slate-400">
                <Building2 className="h-4 w-4 text-sky-400" />
                <span>Centralized Architecture</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer / System Status */}
        <div className="border-t border-slate-800 p-4 bg-slate-950/50">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono">v1.4.2-GA</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Connected
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
