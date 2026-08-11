'use client';

import React, { useRef } from 'react';
import { ArrowRight, ShieldCheck, Zap, Lock, Activity, ChevronRight, Play } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface VisitorHeroProps {
  onShopClick: () => void;
  onReviewsClick: () => void;
  onStatusClick: () => void;
}

export const VisitorHero: React.FC<VisitorHeroProps> = ({
  onShopClick,
  onReviewsClick,
  onStatusClick,
}) => {
  const { themeConfig } = useTheme();
  const stageRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (stageRef.current) {
        stageRef.current.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg)`;
      }
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (stageRef.current) {
      stageRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative pt-20 pb-4 md:pt-24 md:pb-6 overflow-hidden bg-cyber-grid"
    >
      {/* Background Volumetric Nebulae & Light Beams */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full blur-[160px] pointer-events-none opacity-25 transition-colors duration-700 -z-10"
        style={{ backgroundColor: themeConfig.accent }}
      />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[180px] pointer-events-none opacity-10 bg-white -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Hero Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center mb-8">
          
          {/* Left Column: Razor-Sharp Typography & High-Converting Value Stack */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
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
                SYSTEM TELEMETRY: 100% OPERATIONAL
              </span>
              <span className="text-zinc-600">·</span>
              <span 
                className="text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold uppercase"
                style={{ backgroundColor: themeConfig.badgeBg, borderColor: themeConfig.badgeBorder, color: themeConfig.accent }}
              >
                RING-0
              </span>
            </div>

            {/* Fluid Dynamic Display Headline */}
            <div>
              <h1 className="text-fluid-hero font-black font-headline tracking-tighter uppercase text-white">
                UNLEASH PURE <br />
                <span 
                  className={`text-transparent bg-clip-text bg-gradient-to-r ${themeConfig.gradientText}`}
                  style={{ filter: `drop-shadow(0 0 35px ${themeConfig.badgeBg})` }}
                >
                  DOMINANCE.
                </span>
              </h1>
            </div>

            {/* Fluid Adaptive Subtitle */}
            <p className="text-zinc-300 text-fluid-body leading-relaxed max-w-[55ch] font-sans">
              Precision-engineered software for players who never come second. Undetected Ring-0 kernel software with instant 0.0s automated key delivery.
            </p>

            {/* Action Button Suite */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onShopClick}
                className="relative group overflow-hidden flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold font-display text-fluid-sm uppercase tracking-wider transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-2xl"
                style={{
                  backgroundColor: themeConfig.buttonBg,
                  color: themeConfig.buttonText,
                  boxShadow: `0 0 35px ${themeConfig.glow}`,
                }}
              >
                {/* Internal Scanline Glow */}
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <Zap className="h-4 w-4 fill-current relative z-10" />
                <span className="relative z-10">INITIALIZE ACCESS</span>
                <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onStatusClick}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#090e0b]/80 hover:bg-[#121a15] text-white border border-white/15 hover:border-white/30 text-fluid-sm font-semibold tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm backdrop-blur-xl"
              >
                <Activity className="h-4 w-4" style={{ color: themeConfig.accent }} />
                <span>ANTI-CHEAT STATUS</span>
                <ChevronRight className="h-4 w-4 text-zinc-500" />
              </button>
            </div>

            {/* Micro Live Metrics Strip */}
            <div className="pt-2 flex items-center gap-5 text-fluid-xs text-zinc-400 font-mono">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" style={{ color: themeConfig.accent }} />
                <span className="text-white font-bold">26,691+</span>
                <span>Active Licenses</span>
              </div>
              <div className="w-[1px] h-3 bg-white/15" />
              <div className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" style={{ color: themeConfig.accent }} />
                <span className="text-white font-bold">0.0s</span>
                <span>Avg Key Dispatch</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Holographic Mascot & Orbiting Game Badges */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* 3D Perspective Stage Wrapper */}
            <div 
              ref={stageRef}
              className="relative w-full max-w-[420px] aspect-square flex items-center justify-center transition-transform duration-200 ease-out will-change-transform"
            >
              {/* Outer Glowing Cyber Ring */}
              <div 
                className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-spin"
                style={{ animationDuration: '40s' }}
              />

              <div 
                className="absolute inset-8 rounded-full border border-white/10 opacity-60"
              />

              {/* Central 3D Cyber Emblem Container */}
              <div 
                className="relative w-64 h-64 rounded-3xl bg-gradient-to-b from-[#0e1612] to-[#060a08] border p-1 shadow-2xl flex flex-col items-center justify-center overflow-hidden card-specular"
                style={{
                  borderColor: themeConfig.surfaceBorder,
                  boxShadow: `0 20px 60px rgba(0,0,0,0.9), 0 0 50px ${themeConfig.badgeBg}`,
                }}
              >
                {/* Ambient Top Light Beam */}
                <div 
                  className="absolute -top-16 w-36 h-36 rounded-full blur-2xl opacity-40 pointer-events-none"
                  style={{ backgroundColor: themeConfig.accent }}
                />

                {/* Animated Mascot / Brand Core */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                  <div 
                    className="w-24 h-24 rounded-2xl border flex items-center justify-center shadow-xl p-3 bg-black/60 backdrop-blur-xl group hover:scale-105 transition-transform"
                    style={{ backgroundColor: themeConfig.badgeBg, borderColor: themeConfig.badgeBorder }}
                  >
                    <img 
                      src={themeConfig.logo} 
                      alt="ArrowX Mascot Core"
                      className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] animate-pulse"
                    />
                  </div>

                  <div>
                    <div className="text-base font-bold font-display uppercase tracking-wider text-white">
                      ARROW<span style={{ color: themeConfig.accent }}>X</span> HYPERCORE
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400 mt-0.5 flex items-center justify-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: themeConfig.accent }} />
                      <span>Ring-0 Driver Active</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Specular Bar */}
                <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </div>

              {/* Floating Hologram Card 1: Valorant / Vanguard Safe (Top Left) */}
              <div 
                className="absolute -top-4 -left-6 p-3 rounded-2xl bg-[#090e0b]/90 border border-white/15 backdrop-blur-xl shadow-2xl flex items-center gap-3 animate-float-slow"
                style={{ borderColor: themeConfig.surfaceBorder }}
              >
                <div 
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: themeConfig.badgeBg, color: themeConfig.accent }}
                >
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white font-display">VANGUARD 14.12</div>
                  <div className="text-[10px] font-mono font-medium" style={{ color: themeConfig.accent }}>
                    Tested Undetected
                  </div>
                </div>
              </div>

              {/* Floating Hologram Card 2: Arc Raiders Pass (Bottom Right) */}
              <div 
                className="absolute -bottom-4 -right-6 p-3 rounded-2xl bg-[#090e0b]/90 border border-white/15 backdrop-blur-xl shadow-2xl flex items-center gap-3 animate-float-reverse"
                style={{ borderColor: themeConfig.surfaceBorder }}
              >
                <div 
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: themeConfig.badgeBg, color: themeConfig.accent }}
                >
                  <Play className="h-4 w-4 fill-current" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white font-display">ARC RAIDERS</div>
                  <div className="text-[10px] font-mono text-zinc-400">Instant Key Dispatch</div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Social Proof & Anti-Cheat Engine Strip (Matches Zadeyo Longevity Bar) */}
        <div className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div 
            onClick={onReviewsClick}
            className="p-4 rounded-2xl bg-[#080d0a]/60 border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
          >
            <div className="text-[10px] font-mono uppercase text-zinc-500 mb-1">Trust Score</div>
            <div className="text-xl sm:text-2xl font-black font-headline text-white group-hover:text-zinc-200">
              4.9 / 5.0
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">1,605 verified reviews</div>
          </div>

          <div 
            onClick={onStatusClick}
            className="p-4 rounded-2xl bg-[#080d0a]/60 border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
          >
            <div className="text-[10px] font-mono uppercase text-zinc-500 mb-1">Detection Record</div>
            <div className="text-xl sm:text-2xl font-black font-headline" style={{ color: themeConfig.accent }}>
              0 DETECTIONS
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Ring0 verified telemetry</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#080d0a]/60 border border-white/5">
            <div className="text-[10px] font-mono uppercase text-zinc-500 mb-1">Fulfillment Speed</div>
            <div className="text-xl sm:text-2xl font-black font-headline text-white">
              0.0 SECONDS
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Automated key generator</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#080d0a]/60 border border-white/5">
            <div className="text-[10px] font-mono uppercase text-zinc-500 mb-1">Platform Longevity</div>
            <div className="text-xl sm:text-2xl font-black font-headline text-white">
              SINCE 2022
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Continuous development</div>
          </div>

        </div>

      </div>
    </section>
  );
};
