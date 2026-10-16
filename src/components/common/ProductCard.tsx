import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from './Toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const hasSale = product.salePrice && product.salePrice > 0 && product.salePrice < product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) {
      showToast('This item is currently out of stock.', 'error');
      return;
    }
    const success = addToCart(product, 1);
    if (success) {
      showToast(`Added "${product.name}" to your cart!`, 'success');
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    showToast(
      isFavorited ? `Removed "${product.name}" from wishlist.` : `Saved "${product.name}" to wishlist!`,
      'info'
    );
  };

  const currentPrice = hasSale ? product.salePrice! : product.price;

  return (
    <div className="group relative flex flex-col rounded-2xl glass-card bg-surface-card/80 border border-surface-border hover:border-purple-500/40 hover:shadow-glow-sm transition-all duration-300 overflow-hidden">
      
      {/* Product Image and Badges */}
      <Link to={`/product/${product.slug}`} className="relative aspect-square w-full overflow-hidden bg-surface-hover block">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasSale && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-rose-500 text-white shadow-md">
              SALE
            </span>
          )}
          {product.trending && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-purple-600 text-white shadow-md">
              TRENDING
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-cyan-600 text-white shadow-md">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all duration-200 z-10 ${
            isFavorited
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : 'bg-black/50 text-slate-300 hover:text-rose-400 hover:bg-black/70 border border-white/10'
          }`}
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Stock warning pill */}
        {isOutOfStock ? (
          <div className="absolute inset-x-0 bottom-0 py-1.5 bg-rose-950/90 text-rose-200 text-center text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            Out of Stock
          </div>
        ) : isLowStock ? (
          <div className="absolute inset-x-0 bottom-0 py-1 bg-amber-950/80 text-amber-300 text-center text-[11px] font-semibold tracking-wide backdrop-blur-sm">
            Only {product.stock} units left!
          </div>
        ) : null}
      </Link>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="text-purple-400/90 font-medium tracking-wide uppercase text-[11px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-slate-200 font-semibold">{product.rating || '4.8'}</span>
              <span className="text-slate-500">({product.reviewCount || 42})</span>
            </div>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.slug}`} className="block group-hover:text-purple-300 transition-colors">
            <h3 className="text-sm sm:text-base font-semibold text-slate-100 line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>
          
          {/* Short description */}
          {product.shortDescription && (
            <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Pricing & Add To Cart Button */}
        <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              {hasSale && (
                <span className="text-xs text-slate-500 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {hasSale && (
              <span className="text-[10px] text-emerald-400 font-medium">
                Save ₹{(product.price - currentPrice).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
              isOutOfStock
                ? 'bg-surface text-slate-600 cursor-not-allowed border border-white/5'
                : 'btn-gradient text-white shadow-glow-sm hover:scale-105 active:scale-95'
            }`}
            title={isOutOfStock ? 'Out of stock' : 'Add to cart'}
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
