import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  Lock, 
  ArrowLeft, 
  AlertCircle,
  CheckCircle2,
  PackageCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { verifyAndCreateOrder, OrderPlacementPayload } from '../services/orderService';
import { PaymentMethod } from '../types';
import { useToast } from '../components/common/Toast';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, subtotal, shippingFee, discount, total, couponCode, clearCart } = useCart();
  const { currentUser, profile } = useAuth();
  const { settings } = useStoreSettings();
  const { showToast } = useToast();

  // Form Fields
  const [customerName, setCustomerName] = useState(profile?.displayName || currentUser?.displayName || '');
  const [customerEmail, setCustomerEmail] = useState(profile?.email || currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(profile?.phoneNumber || '');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [notes, setNotes] = useState('');

  // Keep form synchronized when profile finishes resolving
  React.useEffect(() => {
    if (profile || currentUser) {
      if (!customerName) setCustomerName(profile?.displayName || currentUser?.displayName || '');
      if (!customerEmail) setCustomerEmail(profile?.email || currentUser?.email || '');
      if (!customerPhone && profile?.phoneNumber) setCustomerPhone(profile.phoneNumber);
    }
  }, [profile, currentUser]);

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    settings.enableCod ? 'cod' : 'online'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-slate-400">Add products to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="inline-block px-6 py-2.5 rounded-xl btn-gradient text-white text-sm font-semibold">
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Field validation
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setErrorMessage('Please provide your name, email, and mobile phone number.');
      return;
    }

    if (!street.trim() || !city.trim() || !state.trim() || !postalCode.trim()) {
      setErrorMessage('Please complete all delivery address fields (Street, City, State, Postal Code).');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: OrderPlacementPayload = {
        userId: currentUser?.uid || profile?.uid || 'guest-' + Date.now(),
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        shippingAddress: {
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
          country: country.trim()
        },
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        paymentMethod,
        couponCode: couponCode || undefined,
        notes: notes.trim() || undefined
      };

      // Server-grade price & stock re-verification process
      const createdOrder = await verifyAndCreateOrder(payload);

      // Order created successfully
      clearCart();
      showToast(`Order #${createdOrder.orderNumber} placed successfully!`, 'success');
      navigate(`/account/orders/${createdOrder.id}?success=true`);
    } catch (err: any) {
      console.error('Order creation error:', err);
      setErrorMessage(err?.message || 'Failed to process order. Please try again.');
      showToast(err?.message || 'Order creation failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Breadcrumb / Back */}
      <div>
        <Link to="/cart" className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
      </div>

      <div className="pb-4 border-b border-surface-border">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Secure Checkout</span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">Complete Your NextGen Order</h1>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Customer & Delivery Information */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Customer Details Box */}
          <div className="glass-card bg-surface-card/70 border border-surface-border rounded-3xl p-6 sm:p-7 space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center text-xs">1</span>
              <span>Customer Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#12121A] text-sm text-slate-100 px-4 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="rahul@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-[#12121A] text-sm text-slate-100 px-4 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#12121A] text-sm text-slate-100 px-4 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address Box */}
          <div className="glass-card bg-surface-card/70 border border-surface-border rounded-3xl p-6 sm:p-7 space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center text-xs">2</span>
              <span>Shipping & Delivery Address</span>
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Street Address & Apartment / Suite *</label>
                <input
                  type="text"
                  required
                  placeholder="Flat 402, Skyline Towers, Sector 45"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-[#12121A] text-sm text-slate-100 px-4 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="Gurugram"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#12121A] text-sm text-slate-100 px-4 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">State *</label>
                  <input
                    type="text"
                    required
                    placeholder="Haryana"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-[#12121A] text-sm text-slate-100 px-4 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">PIN / Postal Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="122003"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-[#12121A] text-sm text-slate-100 px-4 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Delivery Notes / Landmarks (Optional)</label>
                <input
                  type="text"
                  placeholder="Near cyber city metro station gate 2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#12121A] text-sm text-slate-100 px-4 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Box */}
          <div className="glass-card bg-surface-card/70 border border-surface-border rounded-3xl p-6 sm:p-7 space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center text-xs">3</span>
              <span>Payment Method</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Cash on Delivery Option */}
              {settings.enableCod && (
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl glass-card border cursor-pointer flex flex-col justify-between transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-purple-500 bg-purple-950/20 ring-1 ring-purple-500 shadow-glow-sm'
                      : 'border-surface-border bg-surface-card hover:border-purple-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-purple-500 bg-purple-500' : 'border-slate-500'}`}>
                      {paymentMethod === 'cod' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Cash on Delivery (COD)</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Pay upon safe delivery at your doorstep.</p>
                  </div>
                </label>
              )}

              {/* Online Payment Option */}
              <label
                onClick={() => setPaymentMethod('online')}
                className={`p-4 rounded-2xl glass-card border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'online'
                    ? 'border-purple-500 bg-purple-950/20 ring-1 ring-purple-500 shadow-glow-sm'
                    : 'border-surface-border bg-surface-card hover:border-purple-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'online' ? 'border-purple-500 bg-purple-500' : 'border-slate-500'}`}>
                    {paymentMethod === 'online' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Online Payment (UPI / Cards / NetBanking)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Supported via Razorpay verified gateway.</p>
                </div>
              </label>

            </div>
          </div>

        </div>

        {/* Right Column: Authoritative Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card bg-surface-card/85 border border-purple-500/30 rounded-3xl p-6 sm:p-7 space-y-6 sticky top-28 shadow-2xl">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-purple-400" />
              <span>Review Items ({cart.length})</span>
            </h3>

            {/* Items list preview */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => {
                const unitPrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
                return (
                  <div key={item.productId} className="flex items-center justify-between text-xs py-1.5 border-b border-surface-border/50">
                    <div className="flex items-center gap-2.5">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-semibold text-white line-clamp-1">{item.name}</p>
                        <p className="text-slate-400">Qty: {item.quantity} × ₹{unitPrice.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <span className="font-bold text-white">
                      ₹{(unitPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs text-slate-300 pt-3 border-t border-surface-border">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-400 font-bold">FREE</span>
                  ) : (
                    <span className="font-semibold text-white">₹{shippingFee.toLocaleString('en-IN')}</span>
                  )}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({couponCode})</span>
                  <span className="font-semibold">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="pt-3 border-t border-surface-border flex justify-between items-baseline text-base font-extrabold text-white">
                <span>Order Total</span>
                <span className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl text-sm font-bold text-white btn-gradient flex items-center justify-center gap-2 shadow-glow-sm disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? 'Verifying & Placing Order...' : 'Place NextGen Order'}</span>
            </button>

            <p className="text-[11px] text-center text-slate-400">
              By confirming your order, you agree to FNP Store's terms and authorized delivery guidelines.
            </p>
          </div>
        </div>

      </form>
    </div>
  );
};
