'use client';

import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { GameArtworkTicker } from './GameArtworkTicker';

interface VisitorHeroProps {
  onShopClick: () => void;
}

export const VisitorHero: React.FC<VisitorHeroProps> = ({
  onShopClick,
}) => {
  const { themeConfig } = useTheme();

  return (
    <section className="relative min-h-[100svh] pt-20 pb-4 md:pt-24 md:pb-6 overflow-hidden bg-cyber-grid flex flex-col justify-center">
      {/* Background Volumetric Nebulae & Light Beams */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full blur-[160px] pointer-events-none opacity-25 transition-colors duration-700 -z-10"
        style={{ backgroundColor: themeConfig.accent }}
      />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[180px] pointer-events-none opacity-10 bg-white -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Hero Stage */}
        <div className="flex flex-col items-center justify-center mb-4 md:mb-6">
          
          <div className="space-y-5 md:space-y-6 text-center flex flex-col items-center max-w-5xl mx-auto">
            
            {/* Cyber Eyebrow Chip */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-inner">
              <span className="flex h-2 w-2 relative">
                <span 
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: themeConfig.accent }}
                />
                <span 
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: themeConfig.accent }}
                />
              </span>
              <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-300 font-semibold">
                The Best Cheats in The World
              </span>
            </div>

            {/* Fluid Dynamic Display Headline */}
            <div>
              <h1 className="text-fluid-hero font-black font-headline tracking-tighter uppercase text-white">
                Never Come{' '}
                <span 
                  className={`text-transparent bg-clip-text bg-gradient-to-r ${themeConfig.gradientText}`}
                  style={{ filter: `drop-shadow(0 0 35px ${themeConfig.badgeBg})` }}
                >
                  Second
                </span>
              </h1>
            </div>

            {/* Fluid Adaptive Subtitle */}
            <p className="text-zinc-300 text-fluid-body leading-relaxed max-w-[55ch] font-sans">
              Show your friends who is #1 by using our undetectable cheats. Podium-finish everytime.
            </p>

            {/* Action Button Suite */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
              <button
                onClick={onShopClick}
                className="relative group overflow-hidden flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold font-display text-fluid-sm uppercase tracking-wider transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-2xl w-full sm:w-auto"
                style={{
                  backgroundColor: themeConfig.buttonBg,
                  color: themeConfig.buttonText,
                  boxShadow: `0 0 35px ${themeConfig.glow}`,
                }}
              >
                {/* Internal Scanline Glow */}
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <Zap className="h-4 w-4 fill-current relative z-10" />
                <span className="relative z-10">Choose Your Game</span>
                <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </div>
      </div>

      <GameArtworkTicker />
    </section>
  );
};
