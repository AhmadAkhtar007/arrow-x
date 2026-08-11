'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import { productsData } from '../data/mockData';

export const GameArtworkTicker: React.FC = () => {
  const { themeConfig } = useTheme();
  const tickerGames = productsData;

  return (
    <div className="py-6 my-2 overflow-hidden relative">
      {/* Infinite Portrait Poster Ticker (Calm, Silky-Smooth Speed) */}
      <div className="relative mask-marquee py-3">
        <div className="animate-marquee-game-ticker flex items-center gap-4 sm:gap-5">
          {/* Loop twice for seamless infinite loop */}
          {[...tickerGames, ...tickerGames].map((product, idx) => (
            <Link
              key={`${product.id}-${idx}`}
              href={`/products/${product.id}`}
              className="product-card relative w-32 sm:w-36 md:w-40 aspect-[2/3] rounded-2xl sm:rounded-3xl overflow-hidden group cursor-pointer border border-white/10 flex-shrink-0 shadow-2xl bg-[#080d0a] block"
            >
              {/* Pristine Full-Bleed Portrait Game Box Art with Lazy Loading & Fallback */}
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

              {/* Subtle ambient hover sheen */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-300 pointer-events-none"
                style={{ backgroundColor: themeConfig.accent }}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
