'use client';

import React from 'react';
import { Star, ShieldCheck, MessageSquareQuote } from 'lucide-react';
import { reviewsData } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

export const ReviewsSection: React.FC = () => {
  const { themeConfig } = useTheme();

  // Split all 20 unique reviews into two alternating rows of 10 for dynamic marquee tickers
  const row1 = reviewsData.slice(0, 10);
  const row2 = reviewsData.slice(10, 20);

  return (
    <section id="customer-feedback" className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase mb-1" style={{ color: themeConfig.accent }}>
              <MessageSquareQuote className="h-4 w-4" />
              <span>CUSTOMER REVIEWS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-headline uppercase text-white">
              Trusted by Players Worldwide
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="h-4 w-4 fill-amber-400" />
              <span className="font-bold text-white text-sm">4.9 / 5.0</span>
            </div>
          </div>
        </div>

      </div>

      {/* Dual Row Infinite Marquee Tickers with comfortable human-readable reading pace */}
      <div className="space-y-5 mask-marquee">
        
        {/* Row 1: Left Scrolling Ticker (Smooth, human-readable speed) */}
        <div className="animate-marquee-left flex items-center gap-5 [animation-duration:200s]">
          {[...row1, ...row1].map((review, idx) => (
            <div
              key={idx}
              className="w-[360px] sm:w-[420px] p-5 rounded-3xl bg-[#090e0b]/90 border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between space-y-4 shadow-xl card-specular flex-shrink-0 cursor-default"
              style={{ borderColor: themeConfig.surfaceBorder }}
            >
              <div>
                {/* 5-Star Row & Verified Tag */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    {[...Array(5 - review.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 text-zinc-700" />
                    ))}
                  </div>

                  <span 
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border"
                    style={{ backgroundColor: themeConfig.badgeBg, borderColor: themeConfig.badgeBorder, color: themeConfig.accent }}
                  >
                    <ShieldCheck className="h-3 w-3" />
                    <span>Verified Customer</span>
                  </span>
                </div>

                {/* Review Text Quote */}
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic font-sans line-clamp-3">
                  "{review.content}"
                </p>
              </div>

              {/* Reviewer Meta */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-7 h-7 rounded-full border flex items-center justify-center font-bold text-xs font-mono"
                    style={{ backgroundColor: themeConfig.badgeBg, borderColor: themeConfig.badgeBorder, color: themeConfig.accent }}
                  >
                    {review.avatarLetter}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1 font-mono">
                      <span>@{review.author}</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">{review.productName}</div>
                  </div>
                </div>

                <span className="text-[10px] text-zinc-500 font-mono">
                  {review.timeAgo}
                </span>
              </div>

            </div>
          ))}
        </div>

        {/* Row 2: Right Scrolling Ticker (Smooth, human-readable speed) */}
        <div className="animate-marquee-right flex items-center gap-5 [animation-duration:200s]">
          {[...row2, ...row2].map((review, idx) => (
            <div
              key={idx}
              className="w-[360px] sm:w-[420px] p-5 rounded-3xl bg-[#090e0b]/90 border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between space-y-4 shadow-xl card-specular flex-shrink-0 cursor-default"
              style={{ borderColor: themeConfig.surfaceBorder }}
            >
              <div>
                {/* 5-Star Row & Verified Tag */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    {[...Array(5 - review.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 text-zinc-700" />
                    ))}
                  </div>

                  <span 
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border"
                    style={{ backgroundColor: themeConfig.badgeBg, borderColor: themeConfig.badgeBorder, color: themeConfig.accent }}
                  >
                    <ShieldCheck className="h-3 w-3" />
                    <span>Verified Customer</span>
                  </span>
                </div>

                {/* Review Text Quote */}
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic font-sans line-clamp-3">
                  "{review.content}"
                </p>
              </div>

              {/* Reviewer Meta */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-7 h-7 rounded-full border flex items-center justify-center font-bold text-xs font-mono"
                    style={{ backgroundColor: themeConfig.badgeBg, borderColor: themeConfig.badgeBorder, color: themeConfig.accent }}
                  >
                    {review.avatarLetter}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1 font-mono">
                      <span>@{review.author}</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">{review.productName}</div>
                  </div>
                </div>

                <span className="text-[10px] text-zinc-500 font-mono">
                  {review.timeAgo}
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
