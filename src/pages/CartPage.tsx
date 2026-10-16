import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  Tag, 
  ShieldCheck, 
  Truck,
  CheckCircle2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../components/common/Toast';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    subtotal, 
    shippingFee, 
    discount, 
    total,
    couponCode,
    couponMessage,
    applyCoupon,
    removeCoupon
  } = useCart();
  const { settings } = useStoreSettings();
  const { showToast } = useToast();

  const [inputCoupon, setInputCoupon] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const ok = applyCoupon(inputCoupon.trim());
    if (ok) {
      showToast('Coupon code applied successfully!', 'success');
      setInputCoupon('');
    } else {
      showToast('Invalid or inapplicable coupon code.', 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Cart is Empty"
          description="Looks like you haven't added any next-generation gear to your cart yet. Explore our curated collections to find what you love."
          actionText="Start Shopping"
          actionLink="/shop"
        />
      </div>
    );
  }

  const freeShippingThreshold = settings.freeShippingThreshold || 2999;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-surface-border">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Order Bag</span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">Shopping Cart</h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors"
        >
          Clear Cart
        </button>
      </div>

      {/* Free Shipping Progress Meter */}
      <div className="p-4 rounded-2xl glass-card bg-surface-card/60 border border-surface-border space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-medium flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-purple-400" />
            {amountNeededForFreeShipping === 0 ? (
              <span className="text-emerald-400 font-bold">You have unlocked Free Express Shipping!</span>
            ) : (
              <span>Add <strong className="text-white">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more to unlock Free Express Shipping!</span>
            )}
          </span>
          <span className="text-purple-400 font-bold">{freeShippingProgress}%</span>
        </div>
        <div className="w-full bg-[#1A1A26] h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-card bg-surface-card/70 border border-surface-border rounded-3xl p-6 space-y-6">
            {cart.map((item) => {
              const unitPrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
              const itemTotal = unitPrice * item.quantity;

              return (
                <div 
                  key={item.productId}
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-surface-border/60 last:pb-0 last:border-b-0"
                >
                  {/* Thumbnail & Name */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <Link to={`/product/${item.slug}`} className="w-20 h-20 rounded-2xl overflow-hidden glass-card bg-[#12121A] shrink-0 border border-surface-border block">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </Link>
                    <div className="space-y-1">
                      <Link to={`/product/${item.slug}`} className="text-sm sm:text-base font-bold text-white hover:text-purple-300 transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <div className="text-xs text-slate-400">
                        Unit Price: <span className="text-white font-medium">₹{unitPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="text-[11px] text-emerald-400">
                        {item.stock} in stock
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Item Total */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    {/* Quantity Selector */}
                    <div className="flex items-center rounded-xl bg-[#12121A] border border-surface-border overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-white min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total */}
                    <div className="text-right min-w-[5rem]">
                      <span className="text-base font-bold text-white block">
                        ₹{itemTotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right: Order Summary Box */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card bg-surface-card/80 border border-purple-500/20 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl">
            <h3 className="text-lg font-bold text-white tracking-tight">Order Summary</h3>

            {/* Price Breakdown */}
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-400 font-semibold">FREE</span>
                  ) : (
                    <span className="font-semibold text-white">₹{shippingFee.toLocaleString('en-IN')}</span>
                  )}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount ({couponCode})</span>
                  <span className="font-semibold">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="pt-3 border-t border-surface-border flex justify-between items-baseline text-base font-extrabold text-white">
                <span>Total Amount</span>
                <span className="text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Coupon Input */}
            <div className="pt-2">
              {couponCode ? (
                <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-purple-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Applied: <strong className="text-white">{couponCode}</strong></span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Have a Promo Code?</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="e.g. NEXTGEN15"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                        className="w-full bg-[#12121A] text-xs text-slate-100 placeholder-slate-500 uppercase font-mono pl-8 pr-3 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                      />
                      <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3" />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMessage && (
                    <p className="text-[11px] text-amber-400 mt-1">{couponMessage}</p>
                  )}
                </form>
              )}
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-2xl text-sm font-bold text-white btn-gradient flex items-center justify-center gap-2 shadow-glow-sm hover:shadow-glow-md transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Encrypted 256-bit Secure Checkout</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
