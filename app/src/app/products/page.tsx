'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  SlidersHorizontal, 
  HelpCircle, 
  ChevronDown, 
  Layers
} from 'lucide-react';
import type { Product } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { productsData } from '../../data/mockData';
import { ProductDetailModal } from '../../components/ProductDetailModal';

export default function ProductsPage() {
  const { themeConfig } = useTheme();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price-asc' | 'price-desc'>('popular');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const categories = ['All', 'Shooter', 'Battle Royale', 'Survival'];

  const filteredProducts = useMemo(() => {
    return productsData
      .filter((product) => {
        const matchesSearch = 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tagline.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.salesCount - a.salesCount;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price-asc') return (a.pricing.day || 0) - (b.pricing.day || 0);
        if (sortBy === 'price-desc') return (b.pricing.day || 0) - (a.pricing.day || 0);
        return 0;
      });
  }, [searchQuery, selectedCategory, sortBy]);

  const faqs = [
    {
      q: 'How does ArrowX guarantee zero detections with kernel ring0 drivers?',
      a: 'Our hypervisor injects at the UEFI boot level before any game anti-cheat initializes, using polymorphic mutated binaries per key.'
    },
    {
      q: 'How fast is license key generation and loader delivery?',
      a: 'Key delivery is 100% automated via our high-speed API cluster in 0.0 seconds upon checkout.'
    },
    {
      q: 'Does ArrowX include hardware ID (HWID) spoofing?',
      a: 'Yes. All packages feature dynamic ring0 hardware serialization spoofing (Disk UUID, MAC, SMBIOS, and GPU).'
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
            <span className="text-zinc-300">{productsData.length} Verified Enhancements</span>
          </div>

          <h1 className="text-fluid-h1 font-black font-headline tracking-tighter uppercase text-white">
            COMBAT <span className={`text-transparent bg-clip-text bg-gradient-to-r ${themeConfig.gradientText}`}>ARSENAL.</span>
          </h1>

          <p className="text-zinc-400 text-fluid-body max-w-xl font-sans">
            Battle-tested Ring-0 enhancements. Click any cover to configure your instant license key.
          </p>
        </div>
      </div>

      {/* Advanced Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#080d0a]/90 border border-white/10 backdrop-blur-xl shadow-xl space-y-3">
        
        {/* Search & Sort Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Live Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all titles (e.g. Valorant, Fortnite, CS2, Apex, EFT)..."
              className="w-full pl-10 pr-10 py-2 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <SlidersHorizontal className="h-4 w-4 text-zinc-400" />
            <span className="text-xs font-mono text-zinc-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* Single Row Category Filters */}
        <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          <span className="text-[11px] font-mono text-zinc-500 mr-1 uppercase">Genre:</span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'text-white font-bold shadow-sm'
                    : 'bg-black/40 text-zinc-400 border border-white/5 hover:text-white'
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: themeConfig.badgeBg,
                        borderColor: themeConfig.badgeBorder,
                        color: themeConfig.accent,
                      }
                    : undefined
                }
              >
                {cat}
              </button>
            );
          })}
        </div>

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
              No software matched your current filter selection. Try resetting your search filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              style={{ backgroundColor: themeConfig.buttonBg, color: themeConfig.buttonText }}
            >
              Reset Filters
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
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80';
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

      {/* Interactive Product Checkout Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

    </div>
  );
}
