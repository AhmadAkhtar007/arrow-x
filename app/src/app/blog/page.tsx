'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Clock, Search, ShieldCheck, Zap, HeartHandshake, Bell, BookOpen } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { announcementsData } from '../../data/mockData';

export default function BlogPage() {
  const { themeConfig } = useTheme();
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subEmail, setSubEmail] = useState('');

  const tags = ['All', 'Competitive Edge', 'Player Safety', 'Gameplay Guides', 'Product Experience', 'Community & Support'];

  const articles = [
    {
      id: 'post-1',
      title: 'The Competitive Advantage: Why Top Players Value Peace of Mind Over Raw Speed',
      date: 'August 12, 2026',
      category: 'Competitive Edge',
      readTime: '3 min read',
      author: 'ArrowX Gaming Team',
      summary: 'Climbing ranked ladders should feel exciting, not stressful. Learn how smooth, natural gameplay tracking and reliable protection give competitive players the mental clarity needed to clutch high-stakes matches.',
      highlight: {
        icon: Sparkles,
        title: 'Zero Latency & 0 FPS Drop',
        text: 'Engineered specifically for high-refresh 240Hz/360Hz monitors, running invisibly in the background without frame dips or mouse jitter.'
      }
    },
    {
      id: 'post-2',
      title: 'Zero Downtime Philosophy: What Happens Behind the Scenes When Games Push Big Updates',
      date: 'August 8, 2026',
      category: 'Player Safety',
      readTime: '4 min read',
      author: 'Security Telemetry Desk',
      summary: 'Surprise game patches can ruin game nights for unprepared players. Explore how our automated over-the-air update network protects your active sessions with seamless, instant calibrations.',
      highlight: {
        icon: ShieldCheck,
        title: 'Automated Over-The-Air Upgrades',
        text: 'Offsets update silently in the cloud so you can relaunch your game immediately with zero manual downloads or reinstalls.'
      }
    },
    {
      id: 'post-3',
      title: 'From Solo Queue to Champion: Building Unshakable In-Game Awareness',
      date: 'August 3, 2026',
      category: 'Gameplay Guides',
      readTime: '3 min read',
      author: 'Tactical Coaching Staff',
      summary: 'Chaotic teamfights and unexpected flanks make solo queues frustrating. Discover how clean, stream-proof visual enhancements help you anticipate enemy rotations with complete confidence.',
      highlight: {
        icon: Zap,
        title: '100% Streamproof Clarity',
        text: 'Enjoy crystal-clear awareness that remains completely hidden from OBS, Discord screenshares, and video recordings.'
      }
    },
    {
      id: 'post-4',
      title: 'The 90-Second Setup: How We Built the World’s Cleanest Game Enhancement Dashboard',
      date: 'July 28, 2026',
      category: 'Product Experience',
      readTime: '2 min read',
      author: 'Product Experience Team',
      summary: 'We eliminated confusing password forms, BIOS headaches, and complex config files. Here is how our modern OTP customer vault delivers instant activation in under two minutes.',
      highlight: {
        icon: Sparkles,
        title: 'Frictionless Activation',
        text: 'Sign in with your email OTP, access your private license key instantly, and launch straight into your favorite game.'
      }
    },
    {
      id: 'post-5',
      title: '24/7 Human Engineering Desk: Why Instant Support is the Secret Behind 26,000+ Happy Players',
      date: 'July 20, 2026',
      category: 'Community & Support',
      readTime: '3 min read',
      author: 'Customer Operations',
      summary: 'Great software is only half the story. Learn how our dedicated support team resolves tickets in under four minutes to guarantee you are never left waiting when you want to play.',
      highlight: {
        icon: HeartHandshake,
        title: 'Average Response Time: <4 Minutes',
        text: 'Direct communication with dedicated engineers through your personal dashboard tickets and private Discord community.'
      }
    }
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesTag = selectedTag === 'All' || art.category === selectedTag;
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

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
          <span className="text-zinc-300">INSIGHTS, GUIDES & UPDATES</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase">
          ArrowX Journal & Guides
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed font-sans">
          Insights on competitive gaming awareness, automated account protection, and maximizing your performance across all major titles.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#090e0b]/80 border border-white/10 backdrop-blur-xl shadow-lg">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, setup tips, and updates..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white/30"
          />
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedTag === tag
                  ? 'text-white font-bold'
                  : 'text-zinc-400 hover:text-white bg-white/[0.03] border border-white/5'
              }`}
              style={
                selectedTag === tag
                  ? { backgroundColor: themeConfig.badgeBg, borderColor: themeConfig.badgeBorder, color: themeConfig.accent }
                  : undefined
              }
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Feed */}
      <div className="space-y-6">
        {filteredArticles.map((article) => {
          const HighlightIcon = article.highlight.icon;
          return (
            <article
              key={article.id}
              className="p-6 sm:p-8 rounded-3xl bg-[#090e0b]/90 border border-white/10 hover:border-white/20 transition-all backdrop-blur-xl shadow-xl space-y-5 group"
              style={{ borderColor: themeConfig.surfaceBorder }}
            >
              {/* Meta Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span 
                    className="px-3 py-0.5 rounded-full border text-[11px] font-semibold"
                    style={{ backgroundColor: themeConfig.badgeBg, borderColor: themeConfig.badgeBorder, color: themeConfig.accent }}
                  >
                    {article.category}
                  </span>
                  <span className="text-zinc-500">{article.date}</span>
                </div>

                <div className="flex items-center gap-1.5 text-zinc-500">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{article.readTime}</span>
                </div>
              </div>

              {/* Title & Summary */}
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-emerald-400 transition-colors leading-snug">
                  {article.title}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                  {article.summary}
                </p>
              </div>

              {/* Soft Marketing Highlight Card */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-start gap-3.5">
                <div 
                  className="w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: themeConfig.badgeBg, borderColor: themeConfig.badgeBorder, color: themeConfig.accent }}
                >
                  <HighlightIcon className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white font-display">
                    {article.highlight.title}
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                    {article.highlight.text}
                  </p>
                </div>
              </div>

              {/* Author and Action */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <div className="text-zinc-500 font-mono">
                  Published by <span className="text-zinc-300">{article.author}</span>
                </div>

                <a
                  href="https://discord.gg/sMHzvy2QYT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 font-semibold transition-transform group-hover:translate-x-1"
                  style={{ color: themeConfig.accent }}
                >
                  <span>Join Community Discussion</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>

            </article>
          );
        })}
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
