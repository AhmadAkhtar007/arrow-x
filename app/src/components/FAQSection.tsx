'use client';

import React, { useState } from 'react';
import { ChevronDown, Sparkles, MessageSquare, ShieldCheck, Zap, Cpu, CreditCard } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface FAQItem {
  q: string;
  a: string;
  category: 'Safety & Trust' | 'Instant Setup' | 'Performance' | 'Billing';
}

const faqs: FAQItem[] = [
  // 1. Safety & Trust (Decisiveness #1)
  {
    category: 'Safety & Trust',
    q: 'Will my game account stay safe when using ArrowX?',
    a: 'Yes, your account remains fully protected. Every build runs with isolated, randomized memory virtualization so your gameplay looks 100% natural and never triggers anti-cheat detection flags.',
  },
  {
    category: 'Safety & Trust',
    q: 'What happens when a game releases a new patch or update?',
    a: 'Your loader updates automatically with zero downtime or manual reinstalls. Our automated telemetry pauses the software within seconds of any game patch and applies fresh offsets over the air before you relaunch.',
  },
  {
    category: 'Safety & Trust',
    q: 'Is hardware protection (HWID) included with my purchase?',
    a: 'Yes, complete hardware protection is included out of the box. The built-in spoofer cleans and virtualizes your device identifiers so your physical hardware is always shielded.',
  },

  // 2. Instant Setup & Delivery
  {
    category: 'Instant Setup',
    q: 'How quickly do I receive my key after payment?',
    a: 'Instantly. The moment your payment is verified, your unique license key and private loader download link appear directly in your customer vault and delivery email in under 60 seconds.',
  },
  {
    category: 'Instant Setup',
    q: 'How difficult is the initial setup?',
    a: 'Setup takes under two minutes with a single click. You simply launch the loader, enter your license key, and launch your game—no BIOS tweaking or complex configuration files required.',
  },
  {
    category: 'Instant Setup',
    q: 'What if I get stuck or need help during setup?',
    a: 'Our engineering support team is available 24/7 to assist you. You can open a support ticket directly from your customer dashboard or jump into our Discord community for instant help.',
  },

  // 3. Performance & Compatibility
  {
    category: 'Performance',
    q: 'Will ArrowX cause frame drops or input lag in competitive games?',
    a: 'No, there is zero frame drop or input latency. Our software is engineered for high-refresh 240Hz and 360Hz displays, running invisibly in the background without affecting system performance.',
  },
  {
    category: 'Performance',
    q: 'What operating systems and processors are supported?',
    a: 'ArrowX supports all modern Windows 10 and Windows 11 versions across Intel and AMD CPUs. Whether you are running an Intel Core or AMD Ryzen setup, you get full native compatibility.',
  },
  {
    category: 'Performance',
    q: 'Can I stream or record gameplay without overlays showing on screen?',
    a: 'Yes, stream-proof rendering is built in. Overlays and visual enhancements are hidden from OBS, Discord screenshares, and recording software so your stream looks completely clean.',
  },

  // 4. Billing & Payments
  {
    category: 'Billing',
    q: 'What payment methods do you accept?',
    a: 'We accept all major Cryptocurrencies and Instant Gift Cards. You can pay securely with BTC, SOL, USDT (TRC20), or purchase an instant G2A Rewarble gift card using credit card, debit card, Apple Pay, or PayPal.',
  },
  {
    category: 'Billing',
    q: 'Can I upgrade or extend my license later?',
    a: 'Yes, you can renew or upgrade your license anytime directly from your dashboard. Your active status continues seamlessly without needing to reinstall the loader.',
  }
];

const categories = [
  { id: 'ALL', label: 'All Questions', icon: Sparkles },
  { id: 'Safety & Trust', label: 'Safety & Trust', icon: ShieldCheck },
  { id: 'Instant Setup', label: 'Instant Setup', icon: Zap },
  { id: 'Performance', label: 'Performance', icon: Cpu },
  { id: 'Billing', label: 'Billing & Cards', icon: CreditCard },
] as const;

export const FAQSection: React.FC = () => {
  const { themeConfig } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = selectedCategory === 'ALL'
    ? faqs
    : faqs.filter(f => f.category === selectedCategory);

  // Schema.org FAQPage structured data for Google rich search results
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <section id="faq" className="py-16 sm:py-24 relative overflow-hidden">
      {/* Rich Results JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Ambient Theme Flare */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-[170px] pointer-events-none opacity-15"
        style={{ backgroundColor: themeConfig.accent }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono">
            <Sparkles className="h-3.5 w-3.5" style={{ color: themeConfig.accent }} />
            <span className="text-zinc-300">FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black font-headline uppercase tracking-tight text-white">
            Everything You Need <span style={{ color: themeConfig.accent }}>To Know.</span>
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto font-sans leading-relaxed">
            Real questions from real players. Quick, direct answers on account safety, instant delivery, 0-lag performance, and flexible payments.
          </p>
        </div>

        {/* Intent Category Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setOpenIndex(0);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'border-transparent text-black shadow-lg scale-105'
                    : 'bg-[#080d0a]/80 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                }`}
                style={{
                  backgroundColor: isSelected ? themeConfig.accent : undefined,
                  color: isSelected ? '#000' : undefined,
                }}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-lg ${
                  isOpen
                    ? 'bg-[#0a0f0d] shadow-2xl scale-[1.01]'
                    : 'bg-[#080d0a]/80 border-white/10 hover:border-white/20 hover:bg-[#0c120f]'
                }`}
                style={{
                  borderColor: isOpen ? themeConfig.accent : undefined,
                  boxShadow: isOpen ? `0 10px 30px ${themeConfig.badgeBg}` : undefined,
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3.5 pr-4">
                    <span 
                      className="font-mono text-xs font-bold px-2 py-0.5 rounded-md border"
                      style={{ 
                        backgroundColor: isOpen ? themeConfig.badgeBg : 'rgba(255,255,255,0.03)',
                        borderColor: isOpen ? themeConfig.badgeBorder : 'rgba(255,255,255,0.08)',
                        color: isOpen ? themeConfig.accent : '#71717a'
                      }}
                    >
                      {idx < 9 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <span className="text-sm sm:text-base font-bold font-display text-white">
                      {faq.q}
                    </span>
                  </div>

                  <div 
                    className={`w-7 h-7 rounded-full flex items-center justify-center border transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    style={{
                      backgroundColor: isOpen ? themeConfig.badgeBg : 'rgba(255,255,255,0.05)',
                      borderColor: isOpen ? themeConfig.badgeBorder : 'rgba(255,255,255,0.1)',
                      color: isOpen ? themeConfig.accent : '#a1a1aa'
                    }}
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/5 font-sans animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom 24/7 Discord Support CTA Strip */}
        <div 
          className="p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left bg-gradient-to-r from-[#0a0f0d] via-[#070b09] to-[#040705]"
          style={{ borderColor: themeConfig.surfaceBorder }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: themeConfig.badgeBg, borderColor: themeConfig.badgeBorder, color: themeConfig.accent }}
            >
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold font-display text-white">Have a specific question?</div>
              <div className="text-xs text-zinc-400 font-mono">Our engineering team is active 24/7 on Discord</div>
            </div>
          </div>

          <a
            href="https://discord.gg/sMHzvy2QYT"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl font-bold font-display text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg hover:scale-105"
            style={{
              backgroundColor: themeConfig.buttonBg,
              color: themeConfig.buttonText,
            }}
          >
            Join Discord Community
          </a>
        </div>

      </div>
    </section>
  );
};

