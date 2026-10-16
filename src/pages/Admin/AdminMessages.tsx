import React, { useEffect, useState } from 'react';
import { Mail, Search, CheckCircle2, Clock, Eye, X, MessageSquare, Phone, User } from 'lucide-react';
import { ContactMessage } from '../../types';
import { getContactMessages, updateMessageStatus } from '../../services/messageService';
import { useToast } from '../../components/common/Toast';

export const AdminMessages: React.FC = () => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');

  // Modal
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await getContactMessages();
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const openMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (msg.status === 'unread') {
      await updateMessageStatus(msg.id, 'read');
      await fetchMessages();
    }
  };

  const handleMarkStatus = async (id: string, status: 'unread' | 'read' | 'replied') => {
    await updateMessageStatus(id, status);
    showToast(`Marked inquiry as ${status}!`, 'info');
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage({ ...selectedMessage, status });
    }
    await fetchMessages();
  };

  const filtered = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Support Communications</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">Customer Inquiries</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Review customer support forms, order questions, and customer notes.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card bg-surface-card/60 border border-surface-border p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search messages by name, email, subject..."
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
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#12121A] text-xs font-semibold text-slate-200 py-2 px-3 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500 w-full sm:w-auto"
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>

      {/* Messages Table */}
      <div className="glass-card bg-surface-card/80 border border-surface-border rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#12121A] text-slate-400 uppercase tracking-wider text-[11px] border-b border-surface-border">
              <tr>
                <th className="py-3.5 px-4 font-semibold">From</th>
                <th className="py-3.5 px-4 font-semibold">Subject</th>
                <th className="py-3.5 px-4 font-semibold">Order Ref</th>
                <th className="py-3.5 px-4 font-semibold">Date</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/50 text-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No customer messages in this filter.
                  </td>
                </tr>
              ) : (
                filtered.map((msg) => (
                  <tr key={msg.id} className="hover:bg-purple-950/10 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className={`font-bold block ${msg.status === 'unread' ? 'text-white' : 'text-slate-300'}`}>
                        {msg.name}
                      </span>
                      <span className="text-[11px] text-slate-500">{msg.email}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-semibold line-clamp-1 ${msg.status === 'unread' ? 'text-purple-300' : 'text-slate-300'}`}>
                        {msg.subject}
                      </span>
                      <span className="text-[11px] text-slate-500 line-clamp-1">{msg.message}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-purple-400 text-[11px]">
                      {msg.orderNumber || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        msg.status === 'unread'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                          : msg.status === 'replied'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-300 border border-white/5'
                      }`}>
                        {msg.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openMessage(msg)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 transition-colors inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" /> Read
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-lg w-full glass-card bg-[#12121A] border border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div>
                <span className="text-xs uppercase font-bold text-purple-400">Message Detail</span>
                <h3 className="text-lg font-bold text-white">{selectedMessage.subject}</h3>
              </div>
              <button onClick={() => setSelectedMessage(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B0B0F] border border-surface-border text-xs text-slate-300 space-y-2">
              <div className="flex justify-between">
                <span>Sender:</span>
                <strong className="text-white">{selectedMessage.name}</strong>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <a href={`mailto:${selectedMessage.email}`} className="text-purple-400 hover:underline">
                  {selectedMessage.email}
                </a>
              </div>
              {selectedMessage.phone && (
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <span className="text-slate-200">{selectedMessage.phone}</span>
                </div>
              )}
              {selectedMessage.orderNumber && (
                <div className="flex justify-between">
                  <span>Order Reference:</span>
                  <span className="text-purple-300 font-mono">{selectedMessage.orderNumber}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Received:</span>
                <span className="text-slate-400">{new Date(selectedMessage.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Inquiry Content</h4>
              <div className="p-4 rounded-2xl bg-surface-card border border-surface-border text-xs text-slate-200 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3 border-t border-surface-border">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleMarkStatus(selectedMessage.id, 'unread')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-card hover:bg-surface-hover text-slate-300 border border-surface-border"
                >
                  Mark Unread
                </button>
                <button
                  onClick={() => handleMarkStatus(selectedMessage.id, 'replied')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30"
                >
                  Mark Replied
                </button>
              </div>

              <a
                href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent('Re: ' + selectedMessage.subject)}`}
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-white btn-gradient flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" /> Direct Email Reply
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
