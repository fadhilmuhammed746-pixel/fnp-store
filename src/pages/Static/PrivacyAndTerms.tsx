import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8 text-slate-300 leading-relaxed text-sm">
      <div className="space-y-2 border-b border-surface-border pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Security & Privacy</span>
        <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
        <p className="text-xs text-slate-400">Last updated: October 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">1. Data We Collect</h2>
        <p>
          At FNP Store, we gather only necessary customer telemetry to process your orders securely. This includes your name, shipping address, email address, phone number, and purchase transaction records.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">2. Authorization & Security Boundaries</h2>
        <p>
          User passwords and sensitive credentials are handled via cryptographic zero-knowledge protocols through Firebase Authentication. We never store raw payment card data or bank PINs on our servers.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">3. Information Usage</h2>
        <p>
          Your details are utilized strictly for order fulfillment, logistics delivery routing, customer support communications, and optional insider drop notifications if explicitly subscribed.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">4. Your Rights</h2>
        <p>
          You retain full rights to inspect, update, or request erasure of your customer profile at any time by contacting our support team at support@fnpstore.market.
        </p>
      </section>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8 text-slate-300 leading-relaxed text-sm">
      <div className="space-y-2 border-b border-surface-border pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Legal Agreement</span>
        <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
        <p className="text-xs text-slate-400">Last updated: October 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">1. Agreement to Terms</h2>
        <p>
          By accessing or making purchases through FNP Store (NextGen Market), you agree to be bound by these Terms of Service and all applicable laws and regulations in India.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">2. Inventory and Pricing</h2>
        <p>
          Prices and stock quantities are subject to verified server-side validation upon order placement. In the event of pricing discrepancies or concurrent out-of-stock events, our automated system reserves the right to notify and adjust or refund affected orders.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">3. Shipping and Delivery</h2>
        <p>
          Estimated delivery dates are based on standard logistics partner turnaround times. Cash on Delivery orders require confirmation via phone or SMS if flagged by fraud prevention filters.
        </p>
      </section>
    </div>
  );
};
