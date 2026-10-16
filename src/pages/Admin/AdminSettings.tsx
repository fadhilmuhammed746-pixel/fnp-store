import React, { useState } from 'react';
import { Settings, Save, Sparkles, Truck, Banknote, Mail, Phone, MapPin, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { BannerOffer } from '../../types';
import { useToast } from '../../components/common/Toast';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useStoreSettings();
  const { showToast } = useToast();

  const [storeName, setStoreName] = useState(settings.storeName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [secondaryTagline, setSecondaryTagline] = useState(settings.secondaryTagline);
  const [currency, setCurrency] = useState(settings.currency);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [contactPhone, setContactPhone] = useState(settings.contactPhone);
  const [contactAddress, setContactAddress] = useState(settings.contactAddress);
  const [shippingFee, setShippingFee] = useState(settings.shippingFee);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(settings.freeShippingThreshold);
  const [enableCod, setEnableCod] = useState(settings.enableCod);
  const [enableOnlinePayment, setEnableOnlinePayment] = useState(settings.enableOnlinePayment);
  const [announcementText, setAnnouncementText] = useState(settings.announcementText);
  const [showAnnouncement, setShowAnnouncement] = useState(settings.showAnnouncement);
  const [banners, setBanners] = useState<BannerOffer[]>(settings.banners || []);

  const [saving, setSaving] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({
        storeName: storeName.trim(),
        tagline: tagline.trim(),
        secondaryTagline: secondaryTagline.trim(),
        currency: currency.trim(),
        currencySymbol: currencySymbol.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        contactAddress: contactAddress.trim(),
        shippingFee: Number(shippingFee),
        freeShippingThreshold: Number(freeShippingThreshold),
        enableCod,
        enableOnlinePayment,
        announcementText: announcementText.trim(),
        showAnnouncement,
        banners
      });
      showToast('Store settings saved successfully!', 'success');
    } catch (err: any) {
      showToast('Failed to save settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addBanner = () => {
    const newBanner: BannerOffer = {
      id: 'banner-' + Date.now(),
      title: 'New Promotional Drop',
      subtitle: 'Exclusive NextGen hardware release.',
      buttonText: 'Shop Collection',
      link: '/shop',
      badge: 'PROMO',
      bgGradient: 'from-purple-950 via-slate-900 to-indigo-950',
      active: true
    };
    setBanners([...banners, newBanner]);
  };

  const removeBanner = (id: string) => {
    setBanners(banners.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">System Preferences</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">Store Settings</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure global store identity, shipping thresholds, COD toggles, and banners.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        
        {/* Brand & Market Identity */}
        <div className="glass-card bg-surface-card/80 border border-surface-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>Brand Identity & Concept</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Store Name</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-[#12121A] text-xs text-white px-3.5 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Primary Tagline</label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-[#12121A] text-xs text-white px-3.5 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300">Secondary Tagline</label>
              <input
                type="text"
                required
                value={secondaryTagline}
                onChange={(e) => setSecondaryTagline(e.target.value)}
                className="w-full bg-[#12121A] text-xs text-white px-3.5 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Payment Policies */}
        <div className="glass-card bg-surface-card/80 border border-surface-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-purple-400" />
            <span>Shipping Rules & Payment Methods</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Standard Shipping Fee (₹)</label>
              <input
                type="number"
                required
                min="0"
                value={shippingFee}
                onChange={(e) => setShippingFee(Number(e.target.value))}
                className="w-full bg-[#12121A] text-xs text-white px-3.5 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                required
                min="0"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-full bg-[#12121A] text-xs text-white px-3.5 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Default Currency Display</label>
              <input
                type="text"
                required
                value={`${currency} (${currencySymbol})`}
                disabled
                className="w-full bg-[#161622] text-xs text-slate-400 px-3.5 py-2.5 rounded-xl border border-surface-border cursor-not-allowed opacity-80"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#12121A] border border-surface-border cursor-pointer">
              <input
                type="checkbox"
                checked={enableCod}
                onChange={(e) => setEnableCod(e.target.checked)}
                className="w-4 h-4 rounded bg-surface-card accent-purple-600"
              />
              <div>
                <span className="text-xs font-bold text-white block">Enable Cash on Delivery (COD)</span>
                <span className="text-[11px] text-slate-400">Allow customers to pay upon delivery at doorstep</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#12121A] border border-surface-border cursor-pointer">
              <input
                type="checkbox"
                checked={enableOnlinePayment}
                onChange={(e) => setEnableOnlinePayment(e.target.checked)}
                className="w-4 h-4 rounded bg-surface-card accent-purple-600"
              />
              <div>
                <span className="text-xs font-bold text-white block">Enable Online Payment Gateway</span>
                <span className="text-[11px] text-slate-400">Support UPI, NetBanking, and credit/debit cards</span>
              </div>
            </label>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="glass-card bg-surface-card/80 border border-surface-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center justify-between">
            <span>Announcement Bar Banner</span>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showAnnouncement}
                onChange={(e) => setShowAnnouncement(e.target.checked)}
                className="rounded accent-purple-600"
              />
              <span>Display on Storefront</span>
            </label>
          </h3>

          <div className="space-y-1">
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full bg-[#12121A] text-xs text-white px-3.5 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Contact Details */}
        <div className="glass-card bg-surface-card/80 border border-surface-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-purple-400" />
            <span>Store Contact & Concierge Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Support Email</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-[#12121A] text-xs text-white px-3.5 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Support Phone</label>
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-[#12121A] text-xs text-white px-3.5 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300">Physical HQ / Center Address</label>
              <input
                type="text"
                required
                value={contactAddress}
                onChange={(e) => setContactAddress(e.target.value)}
                className="w-full bg-[#12121A] text-xs text-white px-3.5 py-2.5 rounded-xl border border-surface-border focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Promotional Banners Management */}
        <div className="glass-card bg-surface-card/80 border border-surface-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border">
            <div>
              <h3 className="text-base font-bold text-white">Homepage Promotional Banners</h3>
              <p className="text-xs text-slate-400">Manage campaign callouts displayed on the storefront.</p>
            </div>
            <button
              type="button"
              onClick={addBanner}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-purple-300 bg-purple-950/60 border border-purple-500/30 hover:bg-purple-900/60 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Banner
            </button>
          </div>

          <div className="space-y-4">
            {banners.map((b, idx) => (
              <div key={b.id} className="p-4 rounded-2xl bg-[#12121A] border border-surface-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400">Banner #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeBanner(b.id)}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Banner Title"
                    value={b.title}
                    onChange={(e) => {
                      const copy = [...banners];
                      copy[idx].title = e.target.value;
                      setBanners(copy);
                    }}
                    className="bg-[#0B0B0F] text-xs text-white px-3 py-2 rounded-xl border border-surface-border"
                  />
                  <input
                    type="text"
                    placeholder="Subtitle"
                    value={b.subtitle}
                    onChange={(e) => {
                      const copy = [...banners];
                      copy[idx].subtitle = e.target.value;
                      setBanners(copy);
                    }}
                    className="bg-[#0B0B0F] text-xs text-white px-3 py-2 rounded-xl border border-surface-border"
                  />
                  <input
                    type="text"
                    placeholder="Button Text (e.g. Shop Now)"
                    value={b.buttonText}
                    onChange={(e) => {
                      const copy = [...banners];
                      copy[idx].buttonText = e.target.value;
                      setBanners(copy);
                    }}
                    className="bg-[#0B0B0F] text-xs text-white px-3 py-2 rounded-xl border border-surface-border"
                  />
                  <input
                    type="text"
                    placeholder="Link URL (e.g. /category/watches)"
                    value={b.link}
                    onChange={(e) => {
                      const copy = [...banners];
                      copy[idx].link = e.target.value;
                      setBanners(copy);
                    }}
                    className="bg-[#0B0B0F] text-xs text-white px-3 py-2 rounded-xl border border-surface-border"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-2xl text-sm font-bold text-white btn-gradient flex items-center gap-2 shadow-glow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Persisting Settings...' : 'Save All Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
