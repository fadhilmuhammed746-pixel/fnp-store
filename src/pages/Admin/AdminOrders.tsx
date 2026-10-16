import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  X,
  CreditCard,
  MapPin,
  Save
} from 'lucide-react';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import { getOrders, updateOrderStatus } from '../../services/orderService';
import { useToast } from '../../components/common/Toast';

export const AdminOrders: React.FC = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');
  const [newPaymentStatus, setNewPaymentStatus] = useState<PaymentStatus>('pending');
  const [carrier, setCarrier] = useState('');
  const [trackingNo, setTrackingNo] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrderList = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderList();
  }, []);

  const openInspector = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setNewPaymentStatus(order.paymentStatus);
    setCarrier(order.trackingCarrier || 'BlueDart Express');
    setTrackingNo(order.trackingNumber || '');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdating(true);

    try {
      await updateOrderStatus(
        selectedOrder.id,
        newStatus,
        newPaymentStatus,
        trackingNo.trim() || undefined,
        carrier.trim() || undefined
      );
      showToast(`Updated order ${selectedOrder.orderNumber} to "${newStatus}"!`, 'success');
      setSelectedOrder(null);
      await fetchOrderList();
    } catch (err: any) {
      showToast(err?.message || 'Failed to update order.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Fulfillment Portal</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">Orders Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Track customer deliveries, update fulfillment stages, and attach courier tracking numbers.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card bg-surface-card/60 border border-surface-border p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search order #, customer, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#12121A] text-xs text-slate-100 placeholder-slate-500 pl-9 pr-3 py-2 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#12121A] text-xs font-semibold text-slate-200 py-2 px-3 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500 w-full sm:w-auto"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-card bg-surface-card/80 border border-surface-border rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#12121A] text-slate-400 uppercase tracking-wider text-[11px] border-b border-surface-border">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Order</th>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Items</th>
                <th className="py-3.5 px-4 font-semibold">Total</th>
                <th className="py-3.5 px-4 font-semibold">Payment</th>
                <th className="py-3.5 px-4 font-semibold">Fulfillment</th>
                <th className="py-3.5 px-4 font-semibold text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/50 text-slate-200">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-purple-950/10 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-white block">{ord.orderNumber}</span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-white block">{ord.customerName}</span>
                    <span className="text-[11px] text-slate-400">{ord.shippingAddress.city}, {ord.shippingAddress.state}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-300">
                      {ord.items.length} item{ord.items.length === 1 ? '' : 's'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white text-sm">
                      ₹{ord.total.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold uppercase text-[10px] text-slate-300">
                        {ord.paymentMethod}
                      </span>
                      <span className={`text-[10px] font-semibold ${ord.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {ord.paymentStatus.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      ord.orderStatus === 'delivered'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                        : ord.orderStatus === 'shipped'
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30'
                        : ord.orderStatus === 'cancelled'
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                        : 'bg-purple-950/80 text-purple-300 border border-purple-500/30'
                    }`}>
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => openInspector(ord)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" /> Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Inspector Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="max-w-2xl w-full glass-card bg-[#12121A] border border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-6 my-8 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div>
                <span className="text-xs uppercase font-bold text-purple-400">Order Inspector</span>
                <h3 className="text-xl font-bold text-white">{selectedOrder.orderNumber}</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Line Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Purchased Items</h4>
              <div className="max-h-48 overflow-y-auto divide-y divide-surface-border/50 pr-1">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={it.image} alt={it.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-semibold text-white">{it.name}</p>
                        <p className="text-slate-400">Qty: {it.quantity} × ₹{it.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <span className="font-bold text-white">₹{it.total.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address Display */}
            <div className="p-4 rounded-2xl bg-[#0B0B0F] border border-surface-border text-xs text-slate-300 space-y-1">
              <p className="font-bold text-white">{selectedOrder.customerName} ({selectedOrder.customerPhone})</p>
              <p>{selectedOrder.shippingAddress.street}</p>
              <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.postalCode}</p>
              <p className="text-slate-400">Email: {selectedOrder.customerEmail}</p>
              {selectedOrder.notes && (
                <p className="text-purple-300 pt-1">Note: {selectedOrder.notes}</p>
              )}
            </div>

            {/* Update Status Controls */}
            <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2 border-t border-surface-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Fulfillment Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    className="w-full bg-[#0B0B0F] text-xs font-semibold text-white px-3.5 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing & QC</option>
                    <option value="shipped">Dispatched / Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Payment Status</label>
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full bg-[#0B0B0F] text-xs font-semibold text-white px-3.5 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Logistics Carrier</label>
                  <input
                    type="text"
                    placeholder="e.g. BlueDart Express"
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full bg-[#0B0B0F] text-xs text-white px-3.5 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Tracking / AWB Number</label>
                  <input
                    type="text"
                    placeholder="e.g. BD987654321IN"
                    value={trackingNo}
                    onChange={(e) => setTrackingNo(e.target.value)}
                    className="w-full bg-[#0B0B0F] text-xs text-white font-mono px-3.5 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white btn-gradient shadow-glow-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{updating ? 'Updating...' : 'Save Order Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
