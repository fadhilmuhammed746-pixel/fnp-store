import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  X, 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown,
  RotateCcw,
  Check
} from 'lucide-react';
import { Product, Category } from '../types';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { ProductCard } from '../components/common/ProductCard';
import { ProductGridSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [maxPrice, setMaxPrice] = useState<number>(Number(searchParams.get('maxPrice')) || 50000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(searchParams.get('inStock') === 'true');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
        setProducts(prods);
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load shop data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sync from URL changes
  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('category');
    if (q !== null) setSearchQuery(q);
    if (cat !== null) setSelectedCategory(cat);
  }, [searchParams]);

  // Sync state to URL params
  const updateUrlParams = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'all' || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.published);

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory !== 'all') {
      result = result.filter(
        p => p.categorySlug.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // In Stock Only
    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // Max Price
    result = result.filter(p => {
      const price = p.salePrice || p.price;
      return price <= maxPrice;
    });

    // Sorting
    result.sort((a, b) => {
      const priceA = a.salePrice || a.price;
      const priceB = b.salePrice || b.price;

      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      // default newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [products, searchQuery, selectedCategory, inStockOnly, maxPrice, sortBy]);

  // Paginated items
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('newest');
    setMaxPrice(50000);
    setInStockOnly(false);
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Shop Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">NextGen Catalog</span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">Shop All Products</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Showing {filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'} engineered for tomorrow
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass-card bg-surface-card border border-surface-border text-sm font-semibold text-slate-200"
          >
            <SlidersHorizontal className="w-4 h-4 text-purple-400" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Content: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 glass-card bg-surface-card/60 border border-surface-border p-6 rounded-3xl h-fit sticky top-28">
          <div className="flex items-center justify-between pb-4 border-b border-surface-border">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Filter className="w-4 h-4 text-purple-400" />
              <span>Filters</span>
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs text-slate-400 hover:text-purple-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search within shop */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Product keyword..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  updateUrlParams('q', e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#12121A] text-xs text-slate-100 placeholder-slate-500 pl-8 pr-3 py-2 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Category</label>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  updateUrlParams('category', 'all');
                  setCurrentPage(1);
                }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-purple-600/20 text-purple-300 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-surface-hover'
                }`}
              >
                <span>All Categories</span>
                <span>{products.length}</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    updateUrlParams('category', cat.slug);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === cat.slug
                      ? 'bg-purple-600/20 text-purple-300 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-surface-hover'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[11px] text-slate-500">
                    {products.filter(p => p.categorySlug === cat.slug).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3 pt-3 border-t border-surface-border">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Max Price</label>
              <span className="text-xs font-bold text-purple-400">₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="50000"
              step="1000"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                updateUrlParams('maxPrice', e.target.value);
                setCurrentPage(1);
              }}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>₹1,000</span>
              <span>₹50,000+</span>
            </div>
          </div>

          {/* In Stock Toggle */}
          <div className="pt-3 border-t border-surface-border">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => {
                  setInStockOnly(e.target.checked);
                  updateUrlParams('inStock', String(e.target.checked));
                  setCurrentPage(1);
                }}
                className="w-4 h-4 rounded bg-surface-card border-surface-border accent-purple-600 cursor-pointer"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Products Column */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Sort & Active Filter Chips */}
          <div className="glass-card bg-surface-card/60 border border-surface-border p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            
            {/* Active filters */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <span>Category: {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}</span>
                  <button onClick={() => { setSelectedCategory('all'); updateUrlParams('category', 'all'); }}>
                    <X className="w-3 h-3 hover:text-white" />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <span>Keyword: "{searchQuery}"</span>
                  <button onClick={() => { setSearchQuery(''); updateUrlParams('q', ''); }}>
                    <X className="w-3 h-3 hover:text-white" />
                  </button>
                </span>
              )}

              {inStockOnly && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <span>In Stock</span>
                  <button onClick={() => { setInStockOnly(false); updateUrlParams('inStock', 'false'); }}>
                    <X className="w-3 h-3 hover:text-white" />
                  </button>
                </span>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 ml-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  updateUrlParams('sort', e.target.value);
                }}
                className="bg-[#12121A] text-xs font-semibold text-slate-200 py-1.5 px-3 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <ProductGridSkeleton count={itemsPerPage} />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No products matched your criteria"
              description="Try adjusting your filters, searching for a different keyword, or resetting your filter criteria."
              actionText="Reset All Filters"
              onActionClick={resetFilters}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const page = idx + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 100, behavior: 'smooth' });
                        }}
                        className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                          currentPage === page
                            ? 'btn-gradient text-white shadow-glow-sm'
                            : 'glass-card bg-surface-card hover:bg-surface-hover text-slate-300 border border-surface-border'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs h-full bg-[#12121A] border-l border-surface-border p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-surface-border">
              <h3 className="font-bold text-white text-base">Filter Catalog</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Category</label>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    updateUrlParams('category', 'all');
                    setMobileFilterOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                    selectedCategory === 'all' ? 'bg-purple-600/20 text-purple-300 font-semibold' : 'text-slate-400'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCategory(c.slug);
                      updateUrlParams('category', c.slug);
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                      selectedCategory === c.slug ? 'bg-purple-600/20 text-purple-300 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                resetFilters();
                setMobileFilterOpen(false);
              }}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/30"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
