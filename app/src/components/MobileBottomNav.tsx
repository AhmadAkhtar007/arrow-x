'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, BookOpen, Activity } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const MobileBottomNav: React.FC = () => {
  const { themeConfig } = useTheme();
  const pathname = usePathname();

  const items = [
    { href: '/', label: 'Home', icon: Home, active: pathname === '/' },
    { href: '/products', label: 'Products', icon: Grid, active: pathname?.startsWith('/products') },
    { href: '/blog', label: 'Blog', icon: BookOpen, active: pathname?.startsWith('/blog') },
    { href: '/status', label: 'Status', icon: Activity, active: pathname?.startsWith('/status') },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#060907]/90 backdrop-blur-2xl border-t border-white/10 px-4 py-2">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.active;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon 
                className="h-5 w-5 mb-0.5" 
                style={isActive ? { color: themeConfig.accent } : undefined} 
              />
              <span 
                className="text-[10px] font-medium tracking-tight"
                style={isActive ? { color: themeConfig.accent } : undefined}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
