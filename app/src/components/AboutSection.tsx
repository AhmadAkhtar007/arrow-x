'use client';

import React from 'react';
import { Globe, Shield, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const AboutSection: React.FC = () => {
  const { themeConfig } = useTheme();

  return (
    <section className="py-16 relative border-t border-white/10 bg-[#070b09]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Mission Manifesto */}
          <div className="lg:col-span-6 space-y-4">
            <div className="text-xs font-mono font-semibold tracking-wider uppercase" style={{ color: themeConfig.accent }}>
              ABOUT US
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-white leading-tight">
              Worldwide support, <br />
              consistent delivery
            </h2>

            <p className="text-sm text-zinc-400 leading-relaxed">
              Founded in 2022, we have built a strong and lasting presence in an industry where longevity is rare. We are an international team working across regions, united by clear standards and a shared commitment to quality.
            </p>

            <p className="text-sm text-zinc-400 leading-relaxed">
              From the beginning, our focus has been on long-term thinking rather than short-lived trends. We prioritize trust, transparency, and reliability in everything we do.
            </p>

            <div className="pt-2 flex items-center gap-6">
              <div>
                <div className="text-2xl font-bold font-display text-white">2022</div>
                <div className="text-xs text-zinc-500 font-mono">Founded</div>
              </div>
              <div className="w-[1px] h-8 bg-white/10" />
              <div>
                <div className="text-2xl font-bold font-display" style={{ color: themeConfig.accent }}>99.9%</div>
                <div className="text-xs text-zinc-500 font-mono">Uptime</div>
              </div>
              <div className="w-[1px] h-8 bg-white/10" />
              <div>
                <div className="text-2xl font-bold font-display text-white">24/7</div>
                <div className="text-xs text-zinc-500 font-mono">Live Support</div>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Feature Cards Stack */}
          <div className="lg:col-span-6 space-y-3.5">
            
            {/* Card 1 */}
            <div 
              className="p-4 rounded-2xl bg-[#090f0c] border transition-all flex items-start sm:items-center gap-3.5 shadow-sm group hover:bg-[#0e1612]"
              style={{ borderColor: themeConfig.surfaceBorder }}
            >
              <div 
                className="w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: themeConfig.badgeBg, borderColor: themeConfig.badgeBorder, color: themeConfig.accent }}
              >
                <Globe className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm sm:text-base font-bold font-display text-white leading-tight text-wrap">
                  Worldwide Instant Key Delivery
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed whitespace-normal break-words">
                  Region-aware 0.0s license dispatch across 40+ countries.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div 
              className="p-4 rounded-2xl bg-[#090f0c] border transition-all flex items-start sm:items-center gap-3.5 shadow-sm group hover:bg-[#0e1612]"
              style={{ borderColor: themeConfig.surfaceBorder }}
            >
              <div 
                className="w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: themeConfig.badgeBg, borderColor: themeConfig.badgeBorder, color: themeConfig.accent }}
              >
                <Shield className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm sm:text-base font-bold font-display text-white leading-tight text-wrap">
                  Consistency Over Hype
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed whitespace-normal break-words">
                  Rigorous anti-cheat regression testing before every game patch.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div 
              className="p-4 rounded-2xl bg-[#090f0c] border transition-all flex items-start sm:items-center gap-3.5 shadow-sm group hover:bg-[#0e1612]"
              style={{ borderColor: themeConfig.surfaceBorder }}
            >
              <div 
                className="w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: themeConfig.badgeBg, borderColor: themeConfig.badgeBorder, color: themeConfig.accent }}
              >
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm sm:text-base font-bold font-display text-white leading-tight text-wrap">
                  24/7 Human Discord Support
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed whitespace-normal break-words">
                  Direct engineer ticketing with under 3-minute average response.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
