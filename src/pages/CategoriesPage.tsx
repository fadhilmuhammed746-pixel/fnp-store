import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import { Category, Product } from '../types';
import { getCategories } from '../services/categoryService';
import { getProducts } from '../services/productService';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">NextGen Market Collections</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Explore Categories</h1>
        <p className="text-sm text-slate-400">
          Discover handpicked collections built for performance, elegance, and forward-thinking lifestyles.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => {
          const count = products.filter(p => p.categorySlug === cat.slug).length;
          return (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group relative rounded-3xl overflow-hidden glass-card border border-surface-border hover:border-purple-500/40 p-6 aspect-[4/5] flex flex-col justify-end transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow-sm"
            >
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-45 group-hover:opacity-55"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/60 to-transparent" />

              <div className="relative z-10 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                  {count} Products
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {cat.description || 'Precision engineered next-generation gear.'}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-purple-400 group-hover:text-purple-300">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
