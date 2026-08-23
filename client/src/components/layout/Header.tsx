import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  LogOut,
  User as UserIcon,
  Shield,
  Settings,
  PlusCircle,
  ExternalLink,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return { title: 'Enterprise Dashboard', category: 'Overview & Metrics' };
    if (path === '/registry') return { title: 'Software Registry', category: 'Inventory Management' };
    if (path === '/registry/new') return { title: 'Add Software System', category: 'System Registration' };
    if (path.includes('/edit')) return { title: 'Edit Software System', category: 'System Modification' };
    if (path.startsWith('/registry/')) return { title: 'Software System Profile', category: 'System Details' };
    if (path === '/reports') return { title: 'Analytics & Reports', category: 'Data Governance' };
    if (path === '/settings') return { title: 'System Settings', category: 'Configuration' };
    return { title: 'Enterprise Registry', category: 'Management' };
  };

  const pageInfo = getPageTitle();

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Left side: Hamburger & Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider hidden sm:inline">
              {pageInfo.category}
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline">•</span>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              {pageInfo.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Right side: Actions & User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Add Button */}
        <Link
          to="/registry/new"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-brand-700 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New System</span>
        </Link>

        {/* Global Registry status badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Registry Live</span>
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 rounded-xl p-1.5 text-slate-700 hover:bg-slate-100 transition-colors"
            aria-expanded={dropdownOpen}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-semibold text-xs shadow-2xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-[10px] font-medium text-slate-500">
                {user?.role || 'Admin'} • {user?.department || 'Governance'}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400 hidden sm:inline" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 focus:outline-hidden z-50">
              <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                <p className="text-xs font-semibold text-slate-900">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                <div className="mt-1.5 inline-flex items-center gap-1 rounded bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
                  <Shield className="w-3 h-3" />
                  <span>{user?.role} ACCESS</span>
                </div>
              </div>

              <Link
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <UserIcon className="h-4 w-4 text-slate-400" />
                <span>Account Profile</span>
              </Link>

              <Link
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <Settings className="h-4 w-4 text-slate-400" />
                <span>Preferences & Theme</span>
              </Link>

              <div className="my-1 border-t border-slate-100" />

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="h-4 w-4 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
