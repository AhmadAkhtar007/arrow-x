'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Bell, ArrowRight, FileText } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function BlogPage() {
  const { themeConfig } = useTheme();
  const [subscribed, setSubscribed] = useState(false);
  const [subEmail, setSubEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail.trim()) return;
    setSubscribed(true);
  };

  return (
    <div className="pt-24 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Blog Hero Stage */}
      <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0b120e] via-[#070c09] to-[#040705] border border-white/10 overflow-hidden shadow-2xl space-y-3">
        <div 
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-[140px] pointer-events-none opacity-20"
          style={{ backgroundColor: themeConfig.accent }}
        />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono">
          <BookOpen className="h-3.5 w-3.5" style={{ color: themeConfig.accent }} />
          <span className="text-zinc-300">JOURNAL & PATCH NOTES</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase">
          ArrowX Journal
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed font-sans">
          Technical patch notes, anti-cheat engineering insights, and security logs published directly by the ArrowX operations desk.
        </p>
      </div>

      {/* Empty State / Coming Soon */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#090e0b]/90 border border-white/10 backdrop-blur-xl shadow-xl text-center space-y-6">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-400">
          <FileText className="h-6 w-6" style={{ color: themeConfig.accent }} />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            Articles in Preparation
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
            Our engineering desk and security teams are preparing manual patch notes and technical walkthroughs. Join our Discord community for real-time announcements.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/sMHzvy2QYT"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-mono text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105"
          >
            <span>Join Discord Announcements</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
          <Link
            href="/products"
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-mono text-xs font-medium text-zinc-300 hover:text-white bg-white/[0.05] hover:bg-white/10 border border-white/10 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>

      {/* Newsletter & Community Subscription Banner */}
      <div 
        className="p-6 sm:p-8 rounded-3xl border bg-gradient-to-r from-[#0d1612] via-[#090e0b] to-[#040705] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
        style={{ borderColor: themeConfig.surfaceBorder }}
      >
        <div className="space-y-1 max-w-md">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono" style={{ color: themeConfig.accent }}>
            <Bell className="h-3.5 w-3.5" />
            <span>VIP PLAYER ALERTS</span>
          </div>
          <h3 className="text-xl font-bold font-display text-white">
            Stay Ahead on Game Patches & Strategies
          </h3>
          <p className="text-xs text-zinc-400">
            Receive instant notifications when games update and discover fresh tactical gameplay guides.
          </p>
        </div>

        {subscribed ? (
          <div className="px-5 py-3 rounded-xl border font-mono text-xs font-bold" style={{ backgroundColor: themeConfig.badgeBg, borderColor: themeConfig.badgeBorder, color: themeConfig.accent }}>
            Successfully Subscribed to Player Alerts
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex w-full sm:w-auto gap-2">
            <input
              type="email"
              value={subEmail}
              onChange={(e) => setSubEmail(e.target.value)}
              placeholder="Enter your email..."
              className="bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
              required
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all cursor-pointer hover:scale-105"
              style={{ backgroundColor: themeConfig.buttonBg, color: themeConfig.buttonText }}
            >
              Subscribe
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
