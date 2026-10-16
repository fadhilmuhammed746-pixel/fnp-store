import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Flame, 
  Award, 
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';
import { Product, Category } from '../types';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { ProductCard } from '../components/common/ProductCard';
import { ProductGridSkeleton } from '../components/common/LoadingSkeleton';

export const HomePage: React.FC = () => {
  const { settings } = useStoreSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
        setProducts(prods);
        setCategories(cats);
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const trendingProducts = products.filter(p => p.trending && p.published).slice(0, 4);
  const newArrivals = products.filter(p => p.isNewArrival && p.published).slice(0, 4);
  const bestSellers = products.filter(p => p.isBestSeller && p.published).slice(0, 4);

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:py-28 overflow-hidden">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-purple-500/30 text-purple-300 text-xs font-semibold tracking-wide shadow-glow-sm">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>NextGen Market • Edition 2026</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
                Welcome to the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-300">
                  Next Generation
                </span> of Shopping.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Explore the products you love, all in one place. Discover high-precision timepieces, cyber shoes, studio audio, and modular everyday carry.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-white btn-gradient flex items-center justify-center gap-2 shadow-glow-md hover:shadow-glow-lg transition-all"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/categories"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-semibold text-slate-200 hover:text-white glass-card bg-surface-card/60 hover:bg-surface-card border border-surface-border hover:border-purple-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Explore Categories</span>
                  <ChevronRight className="w-4 h-4 text-purple-400" />
                </Link>
              </div>

              {/* Quick stats / Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-surface-border/50 max-w-md mx-auto lg:mx-0">
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-white">100%</p>
                  <p className="text-xs text-slate-400">Authentic Tech</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-white">₹0</p>
                  <p className="text-xs text-slate-400">Shipping over ₹2,999</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-white">COD</p>
                  <p className="text-xs text-slate-400">Pan-India Support</p>
                </div>
              </div>
            </div>

            {/* Right Showcase Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl glass-card bg-gradient-to-b from-purple-900/20 via-surface-card to-surface-card border border-purple-500/30 p-6 shadow-2xl overflow-hidden group">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-5">
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
                    alt="Featured Titanium Watch"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-600/90 text-white backdrop-blur-md shadow-lg">
                    HOT DROP
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Watches</span>
                    <h3 className="text-lg font-bold text-white">AeroChron Titanium Smartwatch</h3>
                    <p className="text-xs text-slate-400">Grade 5 Aerospace Titanium • Sapphire AMOLED</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-white">₹15,499</span>
                    <span className="text-xs text-slate-500 line-through block">₹18,999</span>
                  </div>
                </div>

                <Link
                  to="/product/aerochron-titanium-smartwatch"
                  className="mt-4 w-full py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  View NextGen Specs <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Curated Collections</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">Featured Categories</h2>
          </div>
          <Link to="/categories" className="text-xs sm:text-sm font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden glass-card border border-surface-border hover:border-purple-500/40 p-4 aspect-[4/3] flex flex-col justify-end transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-40 group-hover:opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/60 to-transparent" />
              <div className="relative z-10">
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-1">
                  {cat.description || `${cat.productCount || 4} Products`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Popular Now</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Trending Gear</h2>
            </div>
          </div>
          <Link to="/shop" className="text-xs sm:text-sm font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1">
            <span>Explore All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Promotional Banners Managed From Admin */}
      {settings.banners && settings.banners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {settings.banners.map((banner) => (
              <div
                key={banner.id}
                className={`relative rounded-3xl overflow-hidden p-8 sm:p-10 border border-purple-500/30 bg-gradient-to-br ${banner.bgGradient} flex flex-col justify-between min-h-[260px] group`}
              >
                {banner.image && (
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="absolute right-0 bottom-0 top-0 w-1/2 object-cover opacity-25 group-hover:opacity-35 transition-opacity duration-500 mask-radial"
                  />
                )}
                <div className="relative z-10 space-y-2 max-w-sm">
                  {banner.badge && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/30 text-purple-200 border border-purple-400/30">
                      {banner.badge}
                    </span>
                  )}
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    {banner.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {banner.subtitle}
                  </p>
                </div>
                <div className="relative z-10 pt-6">
                  <Link
                    to={banner.link}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white btn-gradient"
                  >
                    {banner.buttonText} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Just Dropped</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">New Arrivals</h2>
            </div>
          </div>
          <Link to="/shop" className="text-xs sm:text-sm font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1">
            <span>See New Drops</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Customer Favorites</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Best Sellers</h2>
            </div>
          </div>
          <Link to="/shop" className="text-xs sm:text-sm font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
