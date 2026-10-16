import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock } from 'lucide-react';
import { submitContactMessage } from '../../services/messageService';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { useToast } from '../../components/common/Toast';

export const ContactPage: React.FC = () => {
  const { settings } = useStoreSettings();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await submitContactMessage({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        orderNumber: orderNumber.trim() || undefined,
        subject: subject.trim(),
        message: message.trim()
      });
      setSubmitted(true);
      showToast('Your message has been sent to our support team!', 'success');
      setName('');
      setEmail('');
      setPhone('');
      setOrderNumber('');
      setSubject('');
      setMessage('');
    } catch (err) {
      showToast('Failed to submit message. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">NextGen Support</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Get in Touch</h1>
        <p className="text-sm text-slate-400">
          Have a question regarding your order, technical specifications, or bespoke inquiries? Our concierge team is here 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card bg-surface-card/80 border border-surface-border rounded-3xl p-6 sm:p-7 space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight">Direct Channels</h3>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#12121A] border border-surface-border">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Email Us</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{settings.contactEmail || 'support@fnpstore.market'}</p>
                  <p className="text-[11px] text-purple-400 mt-1">Average response within 2 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#12121A] border border-surface-border">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Phone Support</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{settings.contactPhone || '+91 98765 43210'}</p>
                  <p className="text-[11px] text-purple-400 mt-1">Mon - Sat: 9:00 AM - 8:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#12121A] border border-surface-border">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Experience Center & HQ</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {settings.contactAddress || 'Cyber Hub, DLF Phase 2, Gurugram, HR 122002, India'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="glass-card bg-surface-card/85 border border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Send Us a Direct Message</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your message is stored securely and assigned directly to our support engineers.
              </p>
            </div>

            {submitted && (
              <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                <span>Thank you! Your message has been logged. Our concierge will follow up shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#12121A] text-sm text-slate-100 px-4 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#12121A] text-sm text-slate-100 px-4 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Phone (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#12121A] text-sm text-slate-100 px-4 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Order Number (If applicable)</label>
                  <input
                    type="text"
                    placeholder="e.g. FNP-2026-XXXX"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full bg-[#12121A] text-sm text-slate-100 px-4 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="Delivery inquiry / Technical inquiry / Return request"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#12121A] text-sm text-slate-100 px-4 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us in detail how we can assist you..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#12121A] text-sm text-slate-100 px-4 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl text-sm font-bold text-white btn-gradient flex items-center justify-center gap-2 shadow-glow-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Transmitting...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
