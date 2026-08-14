'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowXLogo } from './ArrowXLogo';
import { User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Navbar: React.FC = () => {
  const { themeConfig } = useTheme();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Home', active: pathname === '/' },
    { href: '/products', label: 'Products', active: pathname?.startsWith('/products') },
    { href: '/blog', label: 'Blog', active: pathname?.startsWith('/blog') },
    { href: '/status', label: 'Status', active: pathname?.startsWith('/status') },
  ];

  return (
    <header className="fixed top-3 sm:top-4 left-0 right-0 z-40 flex justify-center px-3 sm:px-6 pointer-events-none transition-all duration-300">
      {/* Floating Island Container */}
      <div 
        className={`pointer-events-auto w-full max-w-6xl rounded-2xl transition-all duration-300 backdrop-blur-2xl border px-3 sm:px-5 py-2.5 flex items-center justify-between shadow-2xl ${
          isScrolled 
            ? 'bg-[#070b09]/90 border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.85)] scale-[0.99]' 
            : 'bg-[#070b09]/75 border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.6)]'
        }`}
        style={{
          boxShadow: isScrolled 
            ? `0 15px 40px rgba(0,0,0,0.85), 0 0 25px ${themeConfig.badgeBg}` 
            : `0 10px 30px rgba(0,0,0,0.6)`
        }}
      >
        
        {/* Left: Brand Logo */}
        <Link 
          href="/"
          className="flex items-center cursor-pointer transition-transform duration-200 hover:scale-105"
        >
          <ArrowXLogo size={32} />
        </Link>

        {/* Center: Desktop Segmented Navigation Pills */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-black/40 border border-white/5 rounded-xl backdrop-blur-md shadow-inner">
          {navItems.map((item) => {
            const isActive = item.active;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-white border shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: themeConfig.badgeBg,
                        borderColor: themeConfig.badgeBorder,
                        color: themeConfig.accent,
                        boxShadow: `0 0 15px ${themeConfig.badgeBg}`,
                      }
                    : undefined
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          
          {/* Discord Community Link (Icon on mobile, Icon + text on desktop) */}
          <a
            href={process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/sMHzvy2QYT"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 h-8 px-2.5 sm:px-3 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-white/[0.05] hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
            title="Join Discord Community"
            aria-label="Discord Community"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            <span className="hidden sm:inline">Discord</span>
          </a>

          {/* Prominent High-Contrast Customer Sign In Button */}
          <a
            href={`${
              process.env.NEXT_PUBLIC_CRM_URL || 
              (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1'))
                ? 'http://localhost:3001'
                : 'https://vault.arrowx.shop')
            }/login`}
            className="flex items-center gap-1.5 h-8 px-3.5 rounded-xl text-xs font-mono font-bold text-black bg-emerald-400 hover:bg-emerald-300 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 cursor-pointer"
            title="Customer Dashboard & License Keys"
          >
            <User className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Sign In</span>
          </a>

        </div>
      </div>
    </header>
  );
};
