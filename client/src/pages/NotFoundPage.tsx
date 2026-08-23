import React from 'react';
import { Link } from 'react-router-dom';
import { ServerCrash, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-200/80 text-slate-600 mb-6 shadow-xs">
        <ServerCrash className="h-10 w-10 text-slate-500" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">
        Error 404
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
        Page Not Found
      </h1>
      <p className="mt-3 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
        The resource or route you are attempting to access does not exist in the Enterprise Software Registry or has been relocated.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-md shadow-brand-600/20 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};
