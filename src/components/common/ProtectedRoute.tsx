import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, KeyRound, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';

export const ProtectedCustomerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, profile, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B0F]">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!currentUser && !profile) {
    const returnUrl = location.pathname + location.search;
    return <Navigate to={`/login?redirect=${encodeURIComponent(returnUrl)}`} replace />;
  }

  return <>{children}</>;
};

export const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, verifyAdminKey, isLoading } = useAuth();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B0F]">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isAdmin) {
    return <>{children}</>;
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');

    setTimeout(() => {
      const success = verifyAdminKey(passcode);
      if (!success) {
        setError('Invalid security authorization key. Access denied.');
      }
      setIsVerifying(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Background radial glow */}
      <div className="absolute top-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full glass-card bg-surface-card/95 border border-purple-500/30 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-6">
          <Logo size="lg" className="mb-4" />
          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-3 shadow-glow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Admin Gateway Authorization</h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            This protected zone requires administrative security clearance. Please enter the master authorization passcode to continue.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Master Admin Security PIN / Passcode
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter admin passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
                className="w-full bg-[#12121A] text-slate-100 text-center text-lg tracking-widest px-4 py-3 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
              <KeyRound className="w-5 h-5 text-slate-500 absolute left-3 top-3.5" />
            </div>
            <p className="text-[11px] text-slate-400 mt-2 text-center">
              Enter the authorized system security password to unlock the FNP Store control portal.
            </p>
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white btn-gradient flex items-center justify-center gap-2 shadow-glow-sm"
          >
            {isVerifying ? 'Authorizing...' : 'Authorize Access'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
