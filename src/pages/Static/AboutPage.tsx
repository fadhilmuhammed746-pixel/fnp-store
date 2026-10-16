import React from 'react';
import { Logo } from '../../components/common/Logo';
import { Sparkles, ShieldCheck, Zap, Compass, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      
      {/* Brand Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Logo size="lg" className="mx-auto mb-4" />
        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Our Story & DNA</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Pioneering the Next Generation of Retail.
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          FNP Store was conceived around a single core ethos: <em>NextGen Market</em>. We bridge futuristic industrial design, cutting-edge hardware, and luxury materials into a seamless e-commerce platform.
        </p>
      </div>

      {/* Values Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-7 rounded-3xl glass-card bg-surface-card border border-surface-border space-y-3">
          <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-400 w-fit">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Curated Precision</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Every watch, sneaker, cyber backpack, and gadget is vetted for durability, materials, and technological distinction.
          </p>
        </div>

        <div className="p-7 rounded-3xl glass-card bg-surface-card border border-surface-border space-y-3">
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 w-fit">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Technological Rigor</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            From our server-verified checkout to real-time inventory reservation, we prioritize bulletproof speed and security.
          </p>
        </div>

        <div className="p-7 rounded-3xl glass-card bg-surface-card border border-surface-border space-y-3">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 w-fit">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Uncompromising Trust</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Pan-India Cash on Delivery, official brand warranty, and effortless returns ensure complete peace of mind.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 sm:p-12 rounded-3xl glass-card bg-gradient-to-r from-purple-950/60 via-surface-card to-indigo-950/60 border border-purple-500/30 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Ready to Step Into Tomorrow?</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          "Discover More. Shop Smarter." Explore hundreds of precision-engineered next-generation essentials.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white btn-gradient shadow-glow-sm"
        >
          <span>Browse NextGen Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};
