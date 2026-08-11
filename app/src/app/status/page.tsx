'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Shield, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { productsData } from '../../data/mockData';

export default function StatusPage() {
  const { themeConfig } = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState('');

  const getCurrentFormattedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  useEffect(() => {
    setLastUpdatedTime(getCurrentFormattedTime());
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdatedTime(getCurrentFormattedTime());
    }, 600);
  };

  const productStatusList = productsData.map((prod, idx) => {
    const versions = ['v4.2.1', 'v3.1.4', 'v2.8.0', 'v1.9.2', 'v4.0.8', 'v2.5.1', 'v3.6.0', 'v1.8.4'];
    const times = ['2h ago', '4h ago', '6h ago', '8h ago', '12h ago', '18h ago', '1d ago', '2d ago'];
    return {
      id: prod.id,
      name: prod.name,
      version: versions[idx % versions.length],
      status: prod.status || 'Undetected',
      lastChecked: times[idx % times.length],
    };
  });

  return (
    <div className="min-h-screen pt-24 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* 1. Back Navigation Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back</span>
      </Link>

      {/* 2. Header: Live Badge + System Status Title + All Operational Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
        <div className="space-y-3">
          {/* Live Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono">
            <span 
              className="w-2 h-2 rounded-full animate-pulse shadow-md"
              style={{ backgroundColor: themeConfig.accent, boxShadow: `0 0 8px ${themeConfig.accent}` }} 
            />
            <span className="text-white font-bold tracking-wider">LIVE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-white">
            System Status
          </h1>
        </div>

        {/* Global Operational Status Pill */}
        <div className="flex items-center gap-2 font-mono text-sm font-semibold" style={{ color: themeConfig.accent }}>
          <span 
            className="w-2 h-2 rounded-full animate-pulse" 
            style={{ backgroundColor: themeConfig.accent, boxShadow: `0 0 10px ${themeConfig.accent}` }}
          />
          <span>All Operational</span>
        </div>
      </div>

      {/* 3. Metrics Row: 3 Key Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Card 1: Products Online */}
        <div 
          className="p-6 rounded-2xl bg-[#090e0b]/85 border backdrop-blur-xl shadow-xl space-y-1 hover:border-white/20 transition-all card-specular"
          style={{ borderColor: themeConfig.surfaceBorder }}
        >
          <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
            Products Online
          </div>
          <div className="text-3xl sm:text-4xl font-black font-display text-white">
            {productsData.length}/{productsData.length}
          </div>
          <div className="text-xs text-zinc-400 font-sans pt-0.5">
            All undetected
          </div>
        </div>

        {/* Card 2: Average Uptime */}
        <div 
          className="p-6 rounded-2xl bg-[#090e0b]/85 border backdrop-blur-xl shadow-xl space-y-1 hover:border-white/20 transition-all card-specular"
          style={{ borderColor: themeConfig.surfaceBorder }}
        >
          <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
            Avg Uptime
          </div>
          <div className="text-3xl sm:text-4xl font-black font-display text-white">
            99.97%
          </div>
          <div className="text-xs text-zinc-400 font-sans pt-0.5">
            Last 30 days
          </div>
        </div>

        {/* Card 3: Last Incident */}
        <div 
          className="p-6 rounded-2xl bg-[#090e0b]/85 border backdrop-blur-xl shadow-xl space-y-1 hover:border-white/20 transition-all card-specular"
          style={{ borderColor: themeConfig.surfaceBorder }}
        >
          <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
            Last Incident
          </div>
          <div className="text-3xl sm:text-4xl font-black font-display text-white">
            0 days
          </div>
          <div className="text-xs text-zinc-400 font-sans pt-0.5">
            All clear
          </div>
        </div>

      </div>

      {/* 4. Timestamp & Refresh Strip */}
      <div 
        className="p-3.5 px-5 rounded-2xl bg-[#090e0b]/60 border backdrop-blur-xl flex items-center justify-between text-xs font-mono text-zinc-400"
        style={{ borderColor: themeConfig.surfaceBorder }}
      >
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-zinc-400" />
          <span>Updated {lastUpdatedTime || 'Recently'}</span>
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer font-medium"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} style={{ color: isRefreshing ? themeConfig.accent : undefined }} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 5. Main Card: Product Status List */}
      <div 
        className="rounded-3xl bg-[#090e0b]/90 border backdrop-blur-2xl p-6 sm:p-8 space-y-5 shadow-2xl"
        style={{ borderColor: themeConfig.surfaceBorder }}
      >
        {/* Card Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-400">
              <Shield className="h-5 w-5" style={{ color: themeConfig.accent }} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                Product Status
              </h2>
              <div className="text-xs text-zinc-400">
                Detection status per product
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-semibold" style={{ color: themeConfig.accent }}>
            <span 
              className="w-2 h-2 rounded-full animate-pulse" 
              style={{ backgroundColor: themeConfig.accent, boxShadow: `0 0 8px ${themeConfig.accent}` }}
            />
            <span>All Undetected</span>
          </div>
        </div>

        {/* Product Status Rows List */}
        <div className="space-y-2.5 pt-1">
          {productStatusList.map((product) => (
            <div
              key={product.id}
              className="p-3.5 sm:p-4 rounded-xl bg-black/40 border border-white/5 hover:border-white/15 flex items-center justify-between transition-all duration-200"
            >
              {/* Left: Indicator Dot + Name + Version */}
              <div className="flex items-center gap-3 min-w-0">
                <span 
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: themeConfig.accent, boxShadow: `0 0 8px ${themeConfig.accent}` }} 
                />
                <div className="flex items-center gap-2 truncate">
                  <span className="font-bold text-white text-sm tracking-tight truncate">
                    {product.name}
                  </span>
                  <span className="text-zinc-400 font-mono text-xs font-normal">
                    {product.version}
                  </span>
                </div>
              </div>

              {/* Right: Undetected Status + Timestamp */}
              <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0 text-xs font-mono">
                <span className="font-semibold" style={{ color: themeConfig.accent }}>
                  {product.status}
                </span>
                <span className="text-zinc-400">
                  {product.lastChecked}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
