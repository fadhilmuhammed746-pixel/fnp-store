import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const AccessDeniedPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="p-4 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-6 shadow-glow-sm">
        <ShieldAlert className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-black text-white tracking-tight">Access Restricted</h1>
      <h2 className="text-lg font-bold text-slate-200 mt-2">Security Clearance Required</h2>
      <p className="text-sm text-slate-400 max-w-sm mt-2 leading-relaxed">
        You do not possess the necessary administrative permissions to view this terminal.
      </p>
      <div className="pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white btn-gradient shadow-glow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Safely</span>
        </Link>
      </div>
    </div>
  );
};
