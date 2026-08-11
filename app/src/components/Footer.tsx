'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowXLogo } from './ArrowXLogo';
import { useTheme } from '../context/ThemeContext';

export const Footer: React.FC = () => {
  const { themeConfig } = useTheme();

  return (
    <footer className="border-t border-white/10 bg-[#040705] text-zinc-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand Info */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link href="/">
              <ArrowXLogo size={32} />
            </Link>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">
              Professional digital products and exceptional quality. Built for reliability and performance since 2022.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] font-mono" style={{ color: themeConfig.accent }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeConfig.accent }} />
              <span>All Systems 100% Operational</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase font-mono tracking-widest mb-3" style={{ color: themeConfig.accent }}>
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">Products</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">Patch Notes & Blog</Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-white transition-colors">Anti-Cheat Status</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase font-mono tracking-widest mb-3" style={{ color: themeConfig.accent }}>
              Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://discord.gg/sMHzvy2QYT" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">24/7 Discord Tickets</a>
              </li>
              <li>
                <Link href="/status" className="hover:text-white transition-colors">Live Status NOC</Link>
              </li>
              <li>
                <a href="https://discord.gg/sMHzvy2QYT" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Discord Community</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Security */}
          <div>
            <h4 className="text-xs font-semibold uppercase font-mono tracking-widest mb-3" style={{ color: themeConfig.accent }}>
              Security
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/blog" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/status" className="hover:text-white transition-colors">Refund Assurance</Link></li>
              <li><Link href="/status" className="hover:text-white transition-colors">Encrypted Gateways</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500 font-mono">
          <div>
            © 2026 ArrowX. All rights reserved.
          </div>
          <div>
            Built for reliability. Trusted by 26,000+ gamers.
          </div>
        </div>

      </div>
    </footer>
  );
};
