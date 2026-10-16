import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';
import { Logo } from '../components/common/Logo';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="p-4 rounded-3xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-6 shadow-glow-sm">
        <Compass className="w-12 h-12" />
      </div>
      <h1 className="text-6xl font-black text-white tracking-tight">404</h1>
      <h2 className="text-xl font-bold text-slate-200 mt-2">Coordinates Uncharted</h2>
      <p className="text-sm text-slate-400 max-w-sm mt-2 leading-relaxed">
        The NextGen item or sector you are looking for has been relocated or no longer exists.
      </p>
      <div className="pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white btn-gradient shadow-glow-sm"
        >
          <span>Return to Homepage</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
