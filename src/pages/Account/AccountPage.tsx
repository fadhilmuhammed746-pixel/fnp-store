import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  ShieldCheck, 
  Check, 
  LogOut,
  Save
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';

export const AccountPage: React.FC = () => {
  const { profile, currentUser, updateCustomerProfile, logout, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [displayName, setDisplayName] = useState(profile?.displayName || currentUser?.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateCustomerProfile({
        displayName: displayName.trim(),
        phoneNumber: phoneNumber.trim()
      });
      showToast('Profile updated successfully!', 'success');
    } catch (err: any) {
      showToast('Failed to update profile.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Customer Portal</span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">My Account</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Signed in as <strong className="text-slate-200">{profile?.email || currentUser?.email}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-950/60 text-purple-300 border border-purple-500/40 hover:bg-purple-900/60 transition-colors flex items-center gap-1.5 shadow-glow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Admin Dashboard</span>
            </Link>
          )}

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-surface-card border border-surface-border hover:border-rose-500/30 flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Grid: Navigation Cards + Profile Edit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Quick Links */}
        <div className="lg:col-span-4 space-y-4">
          <Link
            to="/account/orders"
            className="p-5 rounded-2xl glass-card bg-surface-card border border-surface-border hover:border-purple-500/40 flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-purple-300">My Orders</h4>
                <p className="text-xs text-slate-400">Track shipments & view invoices</p>
              </div>
            </div>
            <span className="text-xs text-purple-400 font-bold group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <Link
            to="/account/wishlist"
            className="p-5 rounded-2xl glass-card bg-surface-card border border-surface-border hover:border-purple-500/40 flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-purple-300">Saved Wishlist</h4>
                <p className="text-xs text-slate-400">Your favorite drops & gear</p>
              </div>
            </div>
            <span className="text-xs text-purple-400 font-bold group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <div className="p-5 rounded-2xl glass-card bg-surface-card border border-surface-border space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Security Clearance</h4>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Account Role</span>
              <span className="font-semibold text-purple-400 uppercase">{profile?.role || 'Customer'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Joined On</span>
              <span className="text-slate-400">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Active Member'}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Settings Form */}
        <div className="lg:col-span-8">
          <div className="glass-card bg-surface-card/70 border border-surface-border rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Personal Information</h3>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-[#12121A] text-sm text-slate-100 px-4 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Email Address (Immutable)</label>
                  <input
                    type="email"
                    disabled
                    value={profile?.email || currentUser?.email || ''}
                    className="w-full bg-[#161622] text-sm text-slate-400 px-4 py-2.5 rounded-xl border border-surface-border cursor-not-allowed opacity-75"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300">Mobile Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-[#12121A] text-sm text-slate-100 px-4 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white btn-gradient flex items-center gap-2 shadow-glow-sm disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isUpdating ? 'Saving...' : 'Update Details'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
