import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Layers } from 'lucide-react';
import { Product, Category } from '../types';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { ProductCard } from '../components/common/ProductCard';
import { ProductGridSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';

export const CategoryProductsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
        const foundCat = cats.find(c => c.slug.toLowerCase() === slug?.toLowerCase()) || null;
        setCategory(foundCat);

        const filtered = prods.filter(
          p => p.categorySlug.toLowerCase() === slug?.toLowerCase() && p.published
        );
        setProducts(filtered);
      } catch (err) {
        console.error('Error loading category products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const catName = category?.name || (slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ') : 'Category');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Categories
        </Link>
      </div>

      {/* Category Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-card border border-purple-500/30 p-8 sm:p-12 min-h-[220px] flex flex-col justify-end">
        {category?.image && (
          <img
            src={category.image}
            alt={catName}
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/70 to-transparent" />
        
        <div className="relative z-10 space-y-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Category Catalog</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{catName}</h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            {category?.description || `Explore our high-performance line of ${catName.toLowerCase()}.`}
          </p>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <ProductGridSkeleton count={4} />
      ) : products.length === 0 ? (
        <EmptyState
          icon={Layers}
          title={`No products yet in ${catName}`}
          description="Check back soon for new drops or explore other categories in our store."
          actionText="Browse All Products"
          actionLink="/shop"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
