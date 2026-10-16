import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingBag, 
  Users, 
  Mail, 
  Settings, 
  ExternalLink, 
  LogOut, 
  Database,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context/AuthContext';
import { isFirebaseConfigured } from '../../config/firebase';
import { seedDatabase } from '../../services/seedService';
import { useToast } from '../common/Toast';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: Layers },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Messages', path: '/admin/messages', icon: Mail },
    { label: 'Store Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleSeed = async () => {
    setSeeding(true);
    const res = await seedDatabase();
    setSeeding(false);
    if (res.success) {
      showToast(res.message, 'success');
      window.location.reload();
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#09090D] text-slate-100 flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 glass-card bg-[#0F0F17]/95 border-r border-surface-border flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-surface-border">
            <Logo size="sm" showTagline={false} />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                ADMIN
              </span>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Database Engine Status */}
          <div className="px-4 py-3 mx-4 my-4 rounded-xl bg-surface-card border border-white/5 flex items-center gap-2.5 text-xs">
            {isFirebaseConfigured ? (
              <>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-medium">Firestore Connected</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-purple-300 font-medium">Local Mock Engine</span>
              </>
            )}
          </div>

          {/* Nav Items */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-glow-sm font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-surface-hover'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-surface-border space-y-2">
          {/* Quick Seed Button */}
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-500/30 transition-all shadow-glow-sm"
            title="Populate demo catalog & reset initial data"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            {seeding ? 'Seeding...' : 'Seed Sample Catalog'}
          </button>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-surface-card hover:bg-surface-hover border border-surface-border transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Back to Storefront
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Header for Mobile & Breadcrumbs */}
        <header className="h-16 px-4 sm:px-6 border-b border-surface-border flex items-center justify-between glass-card bg-[#0B0B0F]/90 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-surface-card"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-bold text-white tracking-tight">
              FNP Store — Admin Control Center
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
