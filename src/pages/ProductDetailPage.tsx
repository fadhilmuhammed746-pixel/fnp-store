import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ShoppingBag, 
  Zap, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Plus, 
  Minus, 
  ArrowLeft,
  Share2,
  Check
} from 'lucide-react';
import { Product } from '../types';
import { getProductBySlug, getProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../components/common/Toast';
import { ProductCard } from '../components/common/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (!slug) return;
        const prod = await getProductBySlug(slug);
        setProduct(prod);
        setSelectedImageIndex(0);
        setQuantity(1);

        if (prod) {
          const allProds = await getProducts();
          const related = allProds
            .filter(p => p.categorySlug === prod.categorySlug && p.id !== prod.id && p.published)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
        <p className="text-slate-400">The requested NextGen gear is not available or has been moved.</p>
        <Link to="/shop" className="inline-block px-6 py-2.5 rounded-xl btn-gradient text-white text-sm font-semibold">
          Return to Shop
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const hasSale = product.salePrice && product.salePrice > 0 && product.salePrice < product.price;
  const currentPrice = hasSale ? product.salePrice! : product.price;

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= product.stock) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const success = addToCart(product, quantity);
    if (success) {
      showToast(`Added ${quantity} × "${product.name}" to cart!`, 'success');
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    showToast('Link copied to clipboard!', 'info');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-purple-400 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-purple-400 transition-colors">Shop</Link>
        <span>/</span>
        <Link to={`/category/${product.categorySlug}`} className="hover:text-purple-400 transition-colors">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-slate-200 truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden glass-card bg-surface-card border border-surface-border">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {hasSale && (
                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-rose-500 text-white shadow-lg">
                  SALE
                </span>
              )}
              {product.trending && (
                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-purple-600 text-white shadow-lg">
                  TRENDING
                </span>
              )}
            </div>

            {/* Wishlist & Share controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-3 rounded-2xl glass-card bg-black/60 text-slate-300 hover:text-white border border-white/10 hover:border-purple-500/40 transition-all"
                title="Share link"
              >
                {copiedLink ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
              </button>
              <button
                onClick={() => {
                  toggleWishlist(product);
                  showToast(isFavorited ? 'Removed from wishlist' : 'Added to wishlist!', 'info');
                }}
                className={`p-3 rounded-2xl glass-card transition-all ${
                  isFavorited
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : 'bg-black/60 text-slate-300 hover:text-rose-400 border border-white/10'
                }`}
                title="Save to wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden glass-card shrink-0 border transition-all ${
                    selectedImageIndex === idx
                      ? 'border-purple-500 ring-2 ring-purple-500/50 scale-105'
                      : 'border-surface-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Buy Box & Details */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Header Info */}
          <div>
            <div className="flex items-center justify-between text-xs text-purple-400 font-semibold uppercase tracking-wider mb-2">
              <span>{product.category}</span>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-white">{product.rating || '4.9'}</span>
                <span className="text-slate-500">({product.reviewCount || 120} verified reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Inventory Status Pill */}
            <div className="mt-3">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-950/80 text-rose-300 border border-rose-500/30">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/30">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  Only {product.stock} units left in stock!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  In Stock ({product.stock} units available)
                </span>
              )}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="p-4 rounded-2xl glass-card bg-surface-card/60 border border-surface-border space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              {hasSale && (
                <span className="text-sm text-slate-500 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
              {hasSale && (
                <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  Save ₹{(product.price - currentPrice).toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Inclusive of all taxes. Eligible for free shipping on orders over ₹2,999.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Overview</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity Selector & Purchase Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Quantity</label>
              <div className="flex items-center rounded-xl bg-surface-card border border-surface-border overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-sm font-bold text-white min-w-[2.5rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="p-2.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs text-slate-500">Max: {product.stock}</span>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full py-3.5 rounded-2xl text-sm font-bold text-white btn-gradient flex items-center justify-center gap-2 shadow-glow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full py-3.5 rounded-2xl text-sm font-bold text-slate-100 bg-surface-card hover:bg-surface-hover border border-purple-500/40 hover:border-purple-400 flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-surface-border text-center">
            <div className="p-3 rounded-xl glass-card border border-white/5 space-y-1">
              <Truck className="w-4 h-4 text-purple-400 mx-auto" />
              <p className="text-[11px] font-semibold text-white">Fast Delivery</p>
              <p className="text-[10px] text-slate-500">2-4 Business Days</p>
            </div>
            <div className="p-3 rounded-xl glass-card border border-white/5 space-y-1">
              <ShieldCheck className="w-4 h-4 text-purple-400 mx-auto" />
              <p className="text-[11px] font-semibold text-white">Official Warranty</p>
              <p className="text-[10px] text-slate-500">1 Year Coverage</p>
            </div>
            <div className="p-3 rounded-xl glass-card border border-white/5 space-y-1">
              <RotateCcw className="w-4 h-4 text-purple-400 mx-auto" />
              <p className="text-[11px] font-semibold text-white">Easy Returns</p>
              <p className="text-[10px] text-slate-500">7-Day Replacement</p>
            </div>
          </div>

        </div>
      </div>

      {/* Technical Specifications */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <div className="glass-card bg-surface-card/60 border border-surface-border rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold text-white tracking-tight">Technical Specifications</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(product.specs).map(([specKey, specVal]) => (
              <div key={specKey} className="flex justify-between py-2 border-b border-surface-border/60 text-xs sm:text-sm">
                <span className="text-slate-400 font-medium">{specKey}</span>
                <span className="text-slate-200 font-semibold text-right">{specVal}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Related NextGen Gear</h3>
            <Link to={`/category/${product.categorySlug}`} className="text-xs text-purple-400 hover:text-purple-300 font-semibold">
              View More in {product.category} →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
