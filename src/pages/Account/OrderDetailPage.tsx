import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  Printer, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  CreditCard, 
  ShoppingBag,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { getOrderById } from '../../services/orderService';
import { Order } from '../../types';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const isSuccess = searchParams.get('success') === 'true';

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        if (!id) return;
        const data = await getOrderById(id);
        setOrder(data);

        if (isSuccess) {
          // Trigger celebration confetti
          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, isSuccess]);

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Order Not Found</h2>
        <p className="text-slate-400">The requested order cannot be located or has expired.</p>
        <Link to="/account/orders" className="inline-block px-6 py-2.5 rounded-xl btn-gradient text-white text-sm font-semibold">
          Return to Orders
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const statusSteps: Array<{ key: Order['orderStatus']; label: string }> = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'processing', label: 'Processing & QC' },
    { key: 'shipped', label: 'Dispatched' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const currentStepIndex = () => {
    if (order.orderStatus === 'cancelled') return -1;
    if (order.orderStatus === 'delivered') return 3;
    if (order.orderStatus === 'shipped') return 2;
    if (order.orderStatus === 'processing') return 1;
    return 0;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back Link & Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/account/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </Link>

        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 bg-surface-card hover:bg-surface-hover border border-surface-border flex items-center gap-2 transition-colors print:hidden"
        >
          <Printer className="w-4 h-4 text-purple-400" /> Print Invoice
        </button>
      </div>

      {/* Success Notification Banner */}
      {isSuccess && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-surface-card to-purple-950/60 border border-emerald-500/40 text-emerald-200 space-y-2 text-center animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Thank You for Your Order!</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Your NextGen order has been registered and verified. An automated confirmation receipt has been prepared below.
          </p>
        </div>
      )}

      {/* Main Order Card */}
      <div className="glass-card bg-surface-card/80 border border-surface-border rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
        
        {/* Header Information */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-400">Order Invoice</span>
              <span className="text-xs px-2 py-0.5 rounded bg-surface-card border border-white/5 uppercase text-slate-300">
                {order.paymentMethod.toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">{order.orderNumber}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Placed on {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 block">Total Amount</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
              ₹{order.total.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Status Tracker Bar */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Delivery Status</h3>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {statusSteps.map((step, idx) => {
              const active = idx <= currentStepIndex();
              return (
                <div key={step.key} className="space-y-2">
                  <div className={`h-2 rounded-full transition-all ${active ? 'bg-gradient-to-r from-purple-500 to-cyan-400' : 'bg-[#1A1A26]'}`} />
                  <span className={`block text-[11px] font-semibold ${active ? 'text-white' : 'text-slate-500'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {order.trackingNumber && (
            <div className="mt-4 p-3.5 rounded-xl bg-[#12121A] border border-purple-500/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-purple-400" />
                <span className="text-slate-300">
                  Carrier: <strong className="text-white">{order.trackingCarrier || 'BlueDart Express'}</strong>
                </span>
                <span className="text-slate-400 ml-2">AWB: <strong className="text-purple-300 font-mono">{order.trackingNumber}</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Line Items Table */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Items</h3>
          <div className="divide-y divide-surface-border/60">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-2xl object-cover bg-[#12121A] shrink-0 border border-surface-border" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    <p className="text-xs text-slate-400">
                      ₹{item.price.toLocaleString('en-IN')} × {item.quantity} unit{item.quantity === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-white">
                    ₹{item.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing & Customer Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-surface-border">
          
          {/* Shipping Address & Customer */}
          <div className="space-y-3 text-xs text-slate-300">
            <h3 className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-purple-400" />
              <span>Shipping Information</span>
            </h3>
            <div className="p-4 rounded-2xl bg-[#12121A] border border-surface-border space-y-1 leading-relaxed">
              <p className="font-bold text-white text-sm">{order.customerName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
              <p className="pt-2 text-slate-400">Phone: <strong className="text-slate-200">{order.customerPhone}</strong></p>
              <p className="text-slate-400">Email: <strong className="text-slate-200">{order.customerEmail}</strong></p>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-3 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-purple-400" />
              <span>Payment & Summary</span>
            </h3>
            <div className="p-4 rounded-2xl bg-[#12121A] border border-surface-border space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal</span>
                <span className="font-semibold text-white">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Shipping Charge</span>
                <span>
                  {order.shippingFee === 0 ? (
                    <span className="text-emerald-400 font-bold">FREE</span>
                  ) : (
                    <span className="font-semibold text-white">₹{order.shippingFee.toLocaleString('en-IN')}</span>
                  )}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({order.couponCode || 'PROMO'})</span>
                  <span className="font-semibold">-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="pt-2 border-t border-surface-border flex justify-between items-baseline text-sm font-extrabold text-white">
                <span>Grand Total</span>
                <span className="text-lg text-purple-400 font-bold">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 flex justify-between text-[11px] text-slate-400 border-t border-surface-border/50">
                <span>Payment Status:</span>
                <span className="font-bold uppercase text-purple-300">{order.paymentStatus}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
