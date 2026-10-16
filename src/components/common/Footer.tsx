import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Mail, CheckCircle2, Shield, Truck, RefreshCw, Headphones, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#09090D] border-t border-surface-border text-slate-400 mt-20 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-purple-600/10 blur-[100px] pointer-events-none" />

      {/* Trust & Guarantee Banner */}
      <div className="border-b border-surface-border/60 py-10 bg-surface-card/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl glass-card border border-white/5">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Express Delivery</h4>
              <p className="text-xs text-slate-400">Free shipping on orders over ₹2,999</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl glass-card border border-white/5">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Authentic Guaranteed</h4>
              <p className="text-xs text-slate-400">100% verified original gear & warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl glass-card border border-white/5">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Hassle-Free Returns</h4>
              <p className="text-xs text-slate-400">7-day replacement & easy exchange</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl glass-card border border-white/5">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">24/7 Priority Support</h4>
              <p className="text-xs text-slate-400">Dedicated next-gen customer care</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <Logo size="lg" />
          <p className="text-sm text-slate-300 max-w-sm leading-relaxed mt-3">
            FNP Store is powered by the NextGen Market concept. Discover precision-engineered watches, cyber sneakers, modular backpacks, studio audio, and lifestyle innovations.
          </p>
          <p className="text-xs text-purple-400 font-medium">
            "Your Next Generation Marketplace. Discover More. Shop Smarter."
          </p>
          
          {/* Newsletter Box */}
          <div className="pt-2">
            <h4 className="text-sm font-bold text-white mb-2">Subscribe to Insider Drops</h4>
            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm py-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>You are subscribed! Welcome to NextGen VIP.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <div className="relative flex-1">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-surface-card text-xs text-slate-100 placeholder-slate-500 pl-9 pr-3 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white btn-gradient flex items-center gap-1.5 shrink-0"
                >
                  Join <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/category/watches" className="hover:text-purple-400 transition-colors">Watches</Link></li>
            <li><Link to="/category/shoes" className="hover:text-purple-400 transition-colors">Shoes & Sneakers</Link></li>
            <li><Link to="/category/bags" className="hover:text-purple-400 transition-colors">Modular Bags</Link></li>
            <li><Link to="/category/gadgets" className="hover:text-purple-400 transition-colors">Smart Gadgets</Link></li>
            <li><Link to="/category/fashion-accessories" className="hover:text-purple-400 transition-colors">Fashion Accessories</Link></li>
            <li><Link to="/category/electronics" className="hover:text-purple-400 transition-colors">Electronics & Audio</Link></li>
            <li><Link to="/category/lifestyle" className="hover:text-purple-400 transition-colors">Lifestyle Essentials</Link></li>
          </ul>
        </div>

        {/* Customer Help */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/account/orders" className="hover:text-purple-400 transition-colors">Order Tracking</Link></li>
            <li><Link to="/faq" className="hover:text-purple-400 transition-colors">Help & FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-purple-400 transition-colors">Contact Support</Link></li>
            <li><Link to="/account" className="hover:text-purple-400 transition-colors">Customer Account</Link></li>
            <li><Link to="/cart" className="hover:text-purple-400 transition-colors">View Cart</Link></li>
            <li><Link to="/admin" className="text-purple-400/90 font-medium hover:text-purple-300 transition-colors">Admin Gateway</Link></li>
          </ul>
        </div>

        {/* Legal & Policies */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Legal & Trust</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
            <li><Link to="/about" className="hover:text-purple-400 transition-colors">About NextGen Market</Link></li>
            <li><span className="text-slate-500">Security & Encryption</span></li>
            <li><span className="text-slate-500">COD Available across India</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="border-t border-surface-border py-6 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FNP Store — NextGen Market. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-surface-card border border-white/5 text-[11px] text-slate-300">UPI / QR</span>
            <span className="px-2 py-0.5 rounded bg-surface-card border border-white/5 text-[11px] text-slate-300">Cards</span>
            <span className="px-2 py-0.5 rounded bg-surface-card border border-white/5 text-[11px] text-slate-300">NetBanking</span>
            <span className="px-2 py-0.5 rounded bg-surface-card border border-white/5 text-[11px] text-purple-400 font-semibold">Cash On Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
