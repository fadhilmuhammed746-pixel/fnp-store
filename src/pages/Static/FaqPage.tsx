import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Shield, Truck, CreditCard, RotateCcw } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      category: 'Shipping',
      q: 'How fast is delivery and do you offer free shipping?',
      a: 'We offer Express Dispatch across India. Orders placed are processed within 24 hours and delivered in 2 to 4 business days. Orders with a cart value exceeding ₹2,999 qualify for Free Express Shipping.'
    },
    {
      category: 'Payment',
      q: 'Is Cash on Delivery (COD) supported?',
      a: 'Yes, Cash on Delivery is available across 25,000+ PIN codes in India. You can inspect the tamper-proof sealed box and pay the exact invoice amount upon delivery.'
    },
    {
      category: 'Payment',
      q: 'Which online payment methods do you accept?',
      a: 'We support all major payment modes including UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay, Amex), and Net Banking via our verified secure payment gateway.'
    },
    {
      category: 'Authenticity',
      q: 'Are all products 100% genuine and covered by warranty?',
      a: 'Every piece on FNP Store is 100% brand authentic, sourced directly through authorized global distributors or precision manufacturers. All tech and timepieces include minimum 1-year official warranty.'
    },
    {
      category: 'Returns',
      q: 'What is your return and replacement policy?',
      a: 'We provide a 7-day hassle-free replacement guarantee. If your product arrives damaged, defective, or different from described, initiate a return from your account portal or contact concierge support.'
    },
    {
      category: 'Orders',
      q: 'How do I track my shipment in real-time?',
      a: 'Once your order is dispatched from our fulfillment hub, tracking information along with the carrier AWB code is updated in your Account Orders dashboard and sent via confirmation email.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Frequently Asked Questions</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Help & Answers</h1>
        <p className="text-sm text-slate-400">
          Everything you need to know about shopping on FNP Store — NextGen Market.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl glass-card bg-surface-card/70 border border-surface-border overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-purple-300 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-purple-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-surface-border/50">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
