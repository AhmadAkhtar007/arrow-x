'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  HelpCircle, 
  ChevronDown, 
  Layers
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { catalog, searchCatalog } from '@arrowx/shared/catalog';

export default function ProductsPage() {
  const { themeConfig } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const filteredProducts = useMemo(() => {
    return searchCatalog(searchQuery);
  }, [searchQuery]);

  const faqs = [
    {
      q: 'Will my game account stay safe when using ArrowX?',
      a: 'Yes, your account remains fully protected. Every build runs with isolated memory virtualization so your gameplay looks 100% natural and never triggers anti-cheat detection flags.'
    },
    {
      q: 'How quickly do I receive my key after payment?',
      a: 'Instantly. The moment your payment is verified, your unique license key and private loader download link appear in your dashboard in under 60 seconds.'
    },
    {
      q: 'Is hardware protection (HWID) included with my purchase?',
      a: 'Yes, complete hardware protection is included out of the box to keep your physical hardware identifiers fully shielded.'
    },
    {
      q: 'Will ArrowX cause frame drops or input lag in competitive matches?',
      a: 'No, there is zero frame drop or input latency. Our software is engineered for 240Hz+ displays and runs invisibly in the background.'
    }
  ];

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 bg-cyber-grid">
      
      {/* Minimal Header Stage */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0b120e] via-[#070c09] to-[#040705] border border-white/10 overflow-hidden shadow-2xl">
        <div 
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-[140px] pointer-events-none opacity-20"
          style={{ backgroundColor: themeConfig.accent }}
        />

        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-fluid-xs font-mono">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: themeConfig.accent }} />
            <span className="text-zinc-300">{catalog.length} Verified Enhancements</span>
          </div>

          <h1 className="text-fluid-h1 font-black font-headline tracking-tighter uppercase text-white">
            COMBAT <span className={`text-transparent bg-clip-text bg-gradient-to-r ${themeConfig.gradientText}`}>ARSENAL.</span>
          </h1>

          <p className="text-zinc-400 text-fluid-body max-w-xl font-sans">
            Battle-tested Ring-0 enhancements. Click any cover to configure your instant license key.
          </p>
        </div>
      </div>

      {/* Plain Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by game title, anti-cheat, or feature (e.g. Valorant, Aimbot, Spoofer)..."
          className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-[#090f0c] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400 hover:text-white cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* High-Density Fluid Responsive Minimalist Portrait Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            Showing <span className="text-white font-bold">{filteredProducts.length}</span> enhancements
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-[#080d0a] border border-white/10 p-8 space-y-3">
            <Layers className="h-10 w-10 mx-auto text-zinc-600" />
            <h3 className="text-lg font-bold font-display text-white">No enhancements found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              No software matched "{searchQuery}". Try a different keyword.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              style={{ backgroundColor: themeConfig.buttonBg, color: themeConfig.buttonText }}
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                prefetch={true}
                className="product-card relative aspect-[2/3] rounded-2xl sm:rounded-3xl overflow-hidden group cursor-pointer border border-white/10 shadow-lg bg-[#080d0a] block"
              >
                {/* Pure Full-Bleed Portrait Box Art */}
                <img
                  src={product.heroImage}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/logo-green.png';
                  }}
                  className="w-full h-full object-cover object-center filter brightness-90 transition-all duration-300"
                />

                {/* Subtle Hover Ambient Sheen */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-300 pointer-events-none"
                  style={{ backgroundColor: themeConfig.accent }}
                />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[#080d0a]/90 border border-white/10 shadow-2xl space-y-5">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" style={{ color: themeConfig.accent }} />
          <h2 className="text-xl sm:text-2xl font-black font-headline uppercase text-white">
            Arsenal & Security FAQ
          </h2>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx}
                className="rounded-2xl bg-black/40 border border-white/5 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.02]"
                >
                  <span className="text-xs sm:text-sm font-bold text-white font-display">
                    {faq.q}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs text-zinc-400 leading-relaxed font-sans border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
