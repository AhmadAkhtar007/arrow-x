'use client';

import React, { useState } from 'react';
import { Terminal, ArrowRight, Clock, Search, Code, Bell } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { announcementsData } from '../../data/mockData';

export default function BlogPage() {
  const { themeConfig } = useTheme();
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subEmail, setSubEmail] = useState('');

  const tags = ['All', 'Patch Notes', 'Security Intel', 'Kernel Architecture', 'Driver Telemetry'];

  const extendedArticles = [
    ...announcementsData,
    {
      id: 'post-3',
      title: 'Deep Dive: How Kernel Ring-0 Obfuscation Bypasses Heuristic Memory Scanners',
      date: 'Aug 04, 2026',
      category: 'Kernel Architecture',
      readTime: '6 min read',
      author: 'Aris (Lead Kernel Dev)',
      summary: 'A technical analysis of modern game anti-cheat drivers (Vanguard, EAC) and how ArrowX utilizes mutated syscall offsets and hypervisor virtualization to remain completely transparent.',
      contentSnippet: `// Kernel Syscall Virtualization Hook Sample
NTSTATUS InitializeHypervisorVirtualization() {
    CR0_REGISTER cr0 = ReadCR0();
    cr0.WriteProtect = 0;
    WriteCR0(cr0);
    MutateDriverSignatures();
    return STATUS_SUCCESS;
}`
    },
    {
      id: 'post-4',
      title: 'Ricochet Warzone 4.0 Client Update: Full Telemetry Report & Loader Status',
      date: 'Jul 29, 2026',
      category: 'Security Intel',
      readTime: '4 min read',
      author: 'Wolfy (Security Analyst)',
      summary: 'Following Call of Duty Warzone Season update, our telemetry team analyzed client integrity checks and deployed zero-delay polymorphic patches for all active subscribers.',
      contentSnippet: `[RICHOCHET-SCANNER] Integrity Check: PASSED (0 Flags)
[RING0-DRIVER] Hook Status: Active / Memory Obfuscated
[LATENCY] Injection Overhead: 0.12ms`
    },
    {
      id: 'post-5',
      title: 'Hardware Serialization Spoofing: Complete Breakdown of SMBIOS & Disk UUID Emulation',
      date: 'Jul 21, 2026',
      category: 'Driver Telemetry',
      readTime: '5 min read',
      author: 'Aris (Lead Kernel Dev)',
      summary: 'How ArrowX Spoofers dynamically intercept IRP read requests for disk serial numbers, NIC MAC addresses, and motherboard UUIDs to provide permanent hardware unbans.',
      contentSnippet: `// Intercept Disk Serial Query
VOID HookDiskDriveIRP(PDEVICE_OBJECT DeviceObject, PIRP Irp) {
    PIO_STACK_LOCATION stack = IoGetCurrentIrpStackLocation(Irp);
    SpoofHardwareDescriptors(stack->Parameters.DeviceIoControl.Type3InputBuffer);
}`
    }
  ];

  const filteredArticles = extendedArticles.filter((art) => {
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
      
      {/* Blog & Patch Notes Hero */}
      <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0b120e] via-[#070c09] to-[#040705] border border-white/10 overflow-hidden shadow-2xl space-y-3">
        <div 
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-[140px] pointer-events-none opacity-20"
          style={{ backgroundColor: themeConfig.accent }}
        />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono">
          <Terminal className="h-3.5 w-3.5" style={{ color: themeConfig.accent }} />
          <span className="text-zinc-300">Engineering Changelogs & Briefs</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
          Security Intel & Patch Notes
        </h1>

        <p className="text-sm text-zinc-400 max-w-xl leading-relaxed font-sans">
          Technical engineering briefs, kernel driver telemetry, and anti-cheat update logs published directly by our reverse-engineering team.
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
            placeholder="Search patch notes, syscall updates, or bypass logs..."
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
        {filteredArticles.map((article: any) => (
          <article
            key={article.id}
            className="p-6 sm:p-8 rounded-3xl bg-[#090e0b]/90 border border-white/10 hover:border-white/20 transition-all backdrop-blur-xl shadow-xl space-y-4 group"
            style={{ borderColor: themeConfig.surfaceBorder }}
          >
            {/* Meta Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span 
                  className="px-2.5 py-0.5 rounded-full border text-[11px] font-semibold"
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
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-emerald-400 transition-colors">
                {article.title}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                {article.summary}
              </p>
            </div>

            {/* Code Snippet if present */}
            {article.contentSnippet && (
              <div className="p-4 rounded-xl bg-black/70 border border-white/10 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                <div className="flex items-center gap-2 text-zinc-500 text-[10px] pb-2 mb-2 border-b border-white/5 uppercase">
                  <Code className="h-3 w-3" />
                  <span>Verified Kernel Implementation</span>
                </div>
                <pre>
                  <code>{article.contentSnippet}</code>
                </pre>
              </div>
            )}

            {/* Author and Action */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
              <div className="text-zinc-500 font-mono">
                Author: <span className="text-zinc-300">{article.author || 'ArrowX Kernel Team'}</span>
              </div>

              <a
                href="https://discord.gg/sMHzvy2QYT"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-semibold transition-transform group-hover:translate-x-1"
                style={{ color: themeConfig.accent }}
              >
                <span>Discuss on Discord</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

          </article>
        ))}
      </div>

      {/* Telegram / Patch Alert Subscription Banner */}
      <div 
        className="p-6 sm:p-8 rounded-3xl border bg-gradient-to-r from-[#0d1612] via-[#090e0b] to-[#040705] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
        style={{ borderColor: themeConfig.surfaceBorder }}
      >
        <div className="space-y-1 max-w-md">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono" style={{ color: themeConfig.accent }}>
            <Bell className="h-3.5 w-3.5" />
            <span>INSTANT PATCH TELEMETRY</span>
          </div>
          <h3 className="text-xl font-bold font-display text-white">
            Receive Instant Anti-Cheat Update Alerts
          </h3>
          <p className="text-xs text-zinc-400">
            Get notified within seconds when Vanguard, EAC, or BattlEye deploy client memory updates.
          </p>
        </div>

        {subscribed ? (
          <div className="px-5 py-3 rounded-xl border font-mono text-xs font-bold" style={{ backgroundColor: themeConfig.badgeBg, borderColor: themeConfig.badgeBorder, color: themeConfig.accent }}>
            Successfully Subscribed to Patch Feeds
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
              className="px-4 py-2.5 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all cursor-pointer hover:scale-105"
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
