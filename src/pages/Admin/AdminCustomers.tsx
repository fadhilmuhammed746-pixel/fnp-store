import React, { useEffect, useState } from 'react';
import { Users, Search, ShoppingBag, IndianRupee, Mail, Phone, MapPin } from 'lucide-react';
import { getOrders } from '../../services/orderService';
import { Order } from '../../types';

interface CustomerSummary {
  email: string;
  name: string;
  phone: string;
  city: string;
  state: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
}

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const orders = await getOrders();
        const customerMap: Record<string, CustomerSummary> = {};

        for (const ord of orders) {
          const key = ord.customerEmail.toLowerCase().trim() || ord.customerName.toLowerCase();
          if (!customerMap[key]) {
            customerMap[key] = {
              email: ord.customerEmail,
              name: ord.customerName,
              phone: ord.customerPhone,
              city: ord.shippingAddress.city,
              state: ord.shippingAddress.state,
              orderCount: 1,
              totalSpent: ord.orderStatus !== 'cancelled' ? ord.total : 0,
              lastOrderDate: ord.createdAt
            };
          } else {
            customerMap[key].orderCount += 1;
            if (ord.orderStatus !== 'cancelled') {
              customerMap[key].totalSpent += ord.total;
            }
          }
        }

        setCustomers(Object.values(customerMap));
      } catch (err) {
        console.error('Failed to load customers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="pb-6 border-b border-surface-border">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Audience</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">Customer Accounts</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Registered customer directory, order volume, and lifetime spend history.
        </p>
      </div>

      {/* Search */}
      <div className="glass-card bg-surface-card/60 border border-surface-border p-4 rounded-2xl flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search customers by name, email, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#12121A] text-xs text-slate-100 placeholder-slate-500 pl-9 pr-3 py-2 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>
        <span className="text-xs text-slate-400 font-medium">
          {filtered.length} Customer{filtered.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Table */}
      <div className="glass-card bg-surface-card/80 border border-surface-border rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#12121A] text-slate-400 uppercase tracking-wider text-[11px] border-b border-surface-border">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Contact</th>
                <th className="py-3.5 px-4 font-semibold">Location</th>
                <th className="py-3.5 px-4 font-semibold">Total Orders</th>
                <th className="py-3.5 px-4 font-semibold text-right">Lifetime Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/50 text-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No customers found. Place an order to see customer analytics.
                  </td>
                </tr>
              ) : (
                filtered.map((cust, idx) => (
                  <tr key={idx} className="hover:bg-purple-950/10 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-sm">
                          {cust.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-white block">{cust.name}</span>
                          <span className="text-[11px] text-slate-400">{cust.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">{cust.phone || 'N/A'}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-300">{cust.city}, {cust.state}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                        {cust.orderCount} order{cust.orderCount === 1 ? '' : 's'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-extrabold text-white text-sm">
                        ₹{cust.totalSpent.toLocaleString('en-IN')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
