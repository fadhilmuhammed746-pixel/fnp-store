import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  LogOut, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { Logo } from './Logo';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useStoreSettings } from '../../context/StoreSettingsContext';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const { currentUser, profile, isAdmin, logout, isLoading } = useAuth();
  const { settings } = useStoreSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Announcement Bar */}
      {settings.showAnnouncement && (
        <div className="bg-gradient-to-r from-purple-950 via-brand-600 to-indigo-950 text-white text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 border-b border-purple-500/20">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
          <span>{settings.announcementText}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="glass-card border-b border-surface-border backdrop-blur-xl bg-[#0B0B0F]/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search watches, gadgets, shoes, audio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-card/90 text-sm text-slate-100 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/40 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </form>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            <Link to="/shop" className="hover:text-purple-400 transition-colors">Shop</Link>
            <Link to="/categories" className="hover:text-purple-400 transition-colors">Categories</Link>
            <Link to="/about" className="hover:text-purple-400 transition-colors">About</Link>
            <Link to="/faq" className="hover:text-purple-400 transition-colors">FAQ</Link>
            <Link to="/contact" className="hover:text-purple-400 transition-colors">Contact</Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Wishlist */}
            <Link
              to="/account/wishlist"
              className="relative p-2.5 rounded-xl text-slate-300 hover:text-purple-400 hover:bg-surface-hover border border-transparent hover:border-surface-border transition-all"
              title="Saved Items"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-glow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl text-slate-300 hover:text-purple-400 hover:bg-surface-hover border border-transparent hover:border-surface-border transition-all"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-glow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Account Dropdown */}
            <div className="relative">
              {isLoading ? (
                <div className="w-24 h-8 rounded-xl bg-surface-card/60 animate-pulse border border-surface-border" />
              ) : currentUser || profile ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-2.5 pr-2 rounded-xl bg-surface-card border border-surface-border hover:border-purple-500/40 text-slate-200 text-sm font-medium transition-all"
                  >
                    <span className="max-w-[100px] truncate">
                      {profile?.displayName || currentUser?.displayName || 'My Account'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-52 rounded-2xl glass-card bg-surface-card/95 border border-purple-500/20 shadow-2xl py-2 z-50 text-sm"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-surface-border text-xs text-slate-400">
                        Signed in as <span className="font-semibold text-white block truncate">{profile?.email || currentUser?.email}</span>
                      </div>
                      <Link to="/account" className="flex items-center gap-2.5 px-4 py-2.5 text-slate-200 hover:bg-purple-600/10 hover:text-purple-400">
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      <Link to="/account/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-slate-200 hover:bg-purple-600/10 hover:text-purple-400">
                        <ShoppingBag className="w-4 h-4" /> Order History
                      </Link>
                      <Link to="/account/wishlist" className="flex items-center gap-2.5 px-4 py-2.5 text-slate-200 hover:bg-purple-600/10 hover:text-purple-400">
                        <Heart className="w-4 h-4" /> Wishlist ({wishlistCount})
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-purple-400 font-semibold hover:bg-purple-600/15 border-t border-surface-border">
                          <ShieldCheck className="w-4 h-4 text-purple-400" /> Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-rose-400 hover:bg-rose-500/10 border-t border-surface-border text-left"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link
                    to="/login"
                    className="hidden sm:inline-flex px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-surface-hover border border-surface-border transition-all"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white btn-gradient transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Admin Portal Button */}
            <Link
              to="/admin"
              className="p-2.5 rounded-xl text-purple-400/80 hover:text-purple-300 hover:bg-purple-950/40 border border-purple-500/20 transition-all ml-1"
              title="Admin Portal"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-surface-hover border border-surface-border"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-card bg-surface/98 border-b border-surface-border px-5 py-6 space-y-4 animate-fade-in">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-card text-sm text-slate-100 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-brand-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </form>

          {/* Nav links */}
          <div className="flex flex-col space-y-3 pt-2 text-base font-medium">
            <Link 
              to="/shop" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-200 hover:text-purple-400 py-1"
            >
              Shop All Products
            </Link>
            <Link 
              to="/categories" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-200 hover:text-purple-400 py-1"
            >
              Categories Catalog
            </Link>
            <Link 
              to="/about" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-200 hover:text-purple-400 py-1"
            >
              About NextGen Market
            </Link>
            <Link 
              to="/faq" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-200 hover:text-purple-400 py-1"
            >
              Customer FAQ
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-200 hover:text-purple-400 py-1"
            >
              Contact Support
            </Link>
            <Link 
              to="/admin" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-purple-400 font-semibold py-1 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
