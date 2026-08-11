'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowXLogo } from './ArrowXLogo';
import { ChevronRight, Shield } from 'lucide-react';
import type { Product } from '../types';
import { useTheme } from '../context/ThemeContext';

interface TopPicksSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onSeeAll: () => void;
}

export const TopPicksSection: React.FC<TopPicksSectionProps> = ({
  products,
  onSelectProduct,
  onSeeAll,
}) => {
  const { themeConfig } = useTheme();
  const topPicks = products.filter(p => p.isTopPick).slice(0, 4);

  return (
    <section className="py-6 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* Circular Icon */}
            <div 
              className="w-7 h-7 rounded-full flex items-center justify-center border"
              style={{ backgroundColor: themeConfig.badgeBg, borderColor: themeConfig.badgeBorder, color: themeConfig.accent }}
            >
              <ArrowXLogo size={16} showText={false} />
            </div>

            <h2 className="text-fluid-h2 font-bold font-display tracking-tight text-white">
              Most Sold Enhancements
            </h2>
          </div>

          <button
            onClick={onSeeAll}
            className="flex items-center gap-1 text-fluid-xs font-medium text-zinc-400 hover:text-white transition-colors group cursor-pointer"
          >
            <span>See all 160+ titles</span>
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 4-Grid Top Picks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topPicks.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              prefetch={true}
              className="product-card group relative rounded-2xl bg-[#090e0b] border border-white/10 overflow-hidden cursor-pointer flex flex-col justify-end min-h-[250px] shadow-lg block"
            >
              {/* Background Game Poster Image */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://cdn.cloudflare.steamstatic.com/steam/apps/1808500/library_600x900.jpg';
                  }}
                  className="w-full h-full object-cover object-center filter grayscale-[20%] brightness-[70%] card-poster-img"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060907] via-[#060907]/60 to-transparent" />
              </div>

              {/* Top Status & Price Badge */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                <span 
                  className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-black/60 backdrop-blur-md border"
                  style={{ borderColor: themeConfig.badgeBorder, color: themeConfig.accent }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeConfig.accent }} />
                  {product.status}
                </span>

                <span className="text-[11px] font-mono font-bold text-white/90 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-md border border-white/10">
                  ${product.pricing.day || 4.99} / day
                </span>
              </div>

              {/* Bottom Content Area (Signal Only) */}
              <div className="relative z-10 p-4 space-y-1.5">
                <h4 className="text-xl font-black font-display uppercase tracking-tight text-white truncate">
                  {product.name}
                </h4>

                <div className="pt-1.5 flex items-center justify-between border-t border-white/10">
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                    <Shield className="h-3 w-3" style={{ color: themeConfig.accent }} />
                    <span>Ring-0 Undetected</span>
                  </div>

                  <div 
                    className="flex items-center gap-1 text-xs font-semibold group-hover:translate-x-1 transition-transform"
                    style={{ color: themeConfig.accent }}
                  >
                    <span>Explore</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>

            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
