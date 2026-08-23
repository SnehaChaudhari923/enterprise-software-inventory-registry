import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Server,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { LoadingSpinner } from '../components/common/LoadingSpinner.js';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password) {
      setErrorMessage('Please provide both username/email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(username, password);
      if (success) {
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setUsername('admin@enterprise.internal');
    setPassword('Admin@123456');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-slate-100">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Icon & Heading */}
        <div className="text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-xl shadow-brand-500/20 mb-4 ring-4 ring-white/10">
            <Server className="h-7 w-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Enterprise Software Inventory Registry
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Centralized corporate governance for internal software assets
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-2xl">
          {/* Error notice */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
              <span className="font-semibold">Error:</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username / Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Work Email / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="admin@enterprise.internal"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-lg shadow-brand-600/30 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" color="text-white" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In to Registry</span>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Autofill Helper */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={handleDemoFill}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 text-xs font-semibold border border-brand-500/30 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Demo Admin Credentials</span>
            </button>
            <p className="text-[11px] text-slate-500 mt-2">
              Default: <code className="text-slate-400">admin@enterprise.internal</code> / <code className="text-slate-400">Admin@123456</code>
            </p>
          </div>
        </div>

        {/* Security and Governance footer badges */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>256-Bit Encrypted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-sky-400" />
            <span>Enterprise IAM Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};
