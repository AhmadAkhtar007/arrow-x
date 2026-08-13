'use client';

import React from 'react';
import { catalog } from '@arrowx/shared/catalog';

export const GameArtworkTicker: React.FC = () => {
  const tickerGames = catalog;

  return (
    <div className="py-2 md:py-3 overflow-hidden relative pointer-events-none select-none">
      {/* Cinematic Infinite Portrait Poster Ticker with Deep Bilateral Edge Alpha Fade */}
      <div className="relative mask-marquee-cinematic py-2">
        <div className="animate-marquee-game-ticker flex items-center gap-4 sm:gap-6">
          {/* Loop twice for seamless infinite loop */}
          {[...tickerGames, ...tickerGames].map((product, idx) => (
            <div
              key={`${product.id}-${idx}`}
              className="relative w-20 sm:w-24 md:w-28 lg:w-32 aspect-[2/3] rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 shadow-[0_12px_36px_rgba(0,0,0,0.85)] bg-[#040806]"
            >
              {/* 1. Base Game Artwork (Natural Colors & High Clarity) */}
              <img
                src={product.heroImage}
                alt={product.name}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/logo-green.png';
                }}
                className="w-full h-full object-cover object-center filter brightness-95"
              />

              {/* 2. Soft Dark Base Grounding (Bottom 25% only) */}
              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

              {/* 3. Subtle Green Ambient Baseline Accent (Bottom 18% only) */}
              <div className="absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-emerald-500/30 via-emerald-500/5 to-transparent pointer-events-none" />

              {/* 4. Crisp Specular Inner Border Ring */}
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
