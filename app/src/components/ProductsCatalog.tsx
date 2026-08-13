'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Layers3, ArrowRight } from 'lucide-react';
import { getStartingPrice, searchCatalog } from '@arrowx/shared/catalog';
import type { Product } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ProductsCatalogProps {
  products: readonly Product[];
  onSelectProduct: (product: Product) => void;
}

export const ProductsCatalog: React.FC<ProductsCatalogProps> = ({
  products,
  onSelectProduct,
}) => {
  const { themeConfig } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const searchMatches = new Set(searchCatalog(searchQuery).map((product) => product.id));
  const filteredProducts = products.filter((product) => searchMatches.has(product.id));

  return (
    <section id="products-catalog" className="py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Description */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
              Full Product Catalog
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Browse our tested and undetected digital enhancement software
            </p>
          </div>

          <div 
            className="text-xs font-mono border px-3 py-1.5 rounded-xl self-start md:self-auto"
            style={{ color: themeConfig.accent, backgroundColor: themeConfig.badgeBg, borderColor: themeConfig.badgeBorder }}
          >
            {filteredProducts.length} Products Available · Instant Delivery
          </div>
        </div>

        {/* Plain Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 opacity-70" style={{ color: themeConfig.accent }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by game title, anti-cheat, or feature (e.g. Valorant, Aimbot, Spoofer)..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-[#090f0c] border text-white placeholder-zinc-500 text-sm transition-all shadow-inner outline-none focus:ring-2"
              style={{ borderColor: themeConfig.surfaceBorder }}
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
        </div>

        {/* Products Poster Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-[#080d0a] border border-white/10 p-8">
            <p className="text-zinc-400 text-sm">No products found matching "{searchQuery}".</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-3 px-4 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
              style={{ backgroundColor: themeConfig.badgeBg, color: themeConfig.accent }}
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {filteredProducts.map((product) => {
              const startingPrice = getStartingPrice(product.id);
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  prefetch={true}
                  className="product-card group rounded-2xl bg-[#0a0f0c] border border-white/10 overflow-hidden flex flex-col justify-between cursor-pointer shadow-lg block"
                >
                  {/* Poster Artwork Header */}
                  <div className="relative h-48 w-full overflow-hidden bg-black">
                    <img
                      src={product.heroImage}
                      alt={product.name}
                      onError={(event) => {
                        event.currentTarget.src = '/assets/logo-green.png';
                        event.currentTarget.classList.add('object-contain', 'p-12');
                      }}
                      className="w-full h-full object-cover filter brightness-75 card-poster-img"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0c] via-transparent to-black/40" />

                    {/* Status Indicator Top Left */}
                    <div 
                      className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-black/70 backdrop-blur-md border"
                      style={{ borderColor: themeConfig.badgeBorder, color: themeConfig.accent }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeConfig.accent }} />
                      {product.status}
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-black/70 backdrop-blur-md text-zinc-200">
                      <Layers3 className="h-3 w-3" />
                      <span>{product.variants.length} options</span>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span 
                          className="text-[10px] font-mono uppercase tracking-widest font-semibold"
                          style={{ color: themeConfig.accent }}
                        >
                          {product.category}
                        </span>
                        <span className="text-[11px] text-zinc-500 font-mono">{product.variants.length} variants</span>
                      </div>

                      <h3 className="text-xl font-bold font-display text-white transition-colors">
                        {product.name}
                      </h3>

                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Top 2 Features Checklist */}
                      <div className="mt-3 space-y-1.5">
                        {product.variants.slice(0, 2).map((variant) => (
                          <div key={variant.id} className="flex items-center gap-1.5 text-xs text-zinc-300">
                            <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: themeConfig.accent }} />
                            <span className="truncate">{variant.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Pricing & CTA */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-zinc-500 font-mono">Starts from</div>
                        <div className="text-base font-bold font-display text-white">
                          {startingPrice === undefined ? 'Unavailable' : `$${startingPrice.toFixed(2)}`}
                        </div>
                      </div>

                      <div 
                        className="px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-1 transition-all group-hover:scale-105"
                        style={{ backgroundColor: themeConfig.badgeBg, color: themeConfig.accent, border: `1px solid ${themeConfig.badgeBorder}` }}
                      >
                        <span>Select</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
