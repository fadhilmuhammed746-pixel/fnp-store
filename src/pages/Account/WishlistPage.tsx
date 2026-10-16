import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { getProducts } from '../../services/productService';
import { Product } from '../../types';
import { ProductCard } from '../../components/common/ProductCard';
import { EmptyState } from '../../components/common/EmptyState';

export const WishlistPage: React.FC = () => {
  const { wishlistIds } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      setLoading(true);
      try {
        const all = await getProducts();
        const saved = all.filter(p => wishlistIds.includes(p.id));
        setProducts(saved);
      } catch (err) {
        console.error('Failed to load wishlist:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlistProducts();
  }, [wishlistIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-6 border-b border-surface-border">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Saved Items</span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">My Wishlist</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {wishlistIds.length} item{wishlistIds.length === 1 ? '' : 's'} saved for later
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="You haven't saved any items yet. Browse our store and tap the heart icon to save products you love."
          actionText="Explore Shop"
          actionLink="/shop"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
