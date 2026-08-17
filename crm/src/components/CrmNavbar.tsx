'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowXLogo } from './ArrowXLogo';
import { User, ShieldCheck, ShoppingBag } from 'lucide-react';
import { ProfileModal } from './ProfileModal';

export const CrmNavbar: React.FC = () => {
  const pathname = usePathname();
  
  // Hide top navbar entirely on all admin pages to prevent duplicate headers
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  const storeUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arrowx.shop';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname + window.location.search);
    }
  }, [pathname]);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      }
    };
    fetchSession();
  }, [pathname]);

  useEffect(() => {
    const handleProfileUpdate = (e: any) => {
      if (e.detail) {
        setCurrentUser((prev: any) => (prev ? { ...prev, ...e.detail } : e.detail));
      }
    };

    window.addEventListener('arrowx:profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('arrowx:profile-updated', handleProfileUpdate);
  }, []);

  const loginHref = currentPath && currentPath !== '/login'
    ? `/login?returnUrl=${encodeURIComponent(currentPath)}`
    : '/login';

  return (
    <>
      <header className="sticky top-3 sm:top-4 z-40 flex justify-center px-3 sm:px-6 pointer-events-none transition-all">
        <div className="pointer-events-auto w-full max-w-6xl rounded-2xl backdrop-blur-2xl px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all duration-300 bg-[#070b09]/90 border border-emerald-500/20 shadow-[0_15px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(16,185,129,0.15)]">
          
          {/* Left: Customer Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
              <ArrowXLogo size={34} variant="green" />
            </Link>

            <span className="hidden sm:inline-block w-px h-4 bg-white/10" />

            <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px]">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Customer Vault
              </span>
            </div>
          </div>

          {/* Right: Actions & Customer Profile */}
          <div className="flex items-center gap-2.5 font-mono text-xs">
            
            {/* Dedicated Shop Catalog Link */}
            <a
              href={`${storeUrl}/products`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/15 text-zinc-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/30 transition-all font-mono text-xs font-semibold cursor-pointer group"
              title="Browse ArrowX Software Catalog"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Shop</span>
            </a>

            {/* Authenticated Customer View */}
            {currentUser && (
              <>
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 hover:bg-emerald-500/25 transition-all cursor-pointer font-bold"
                  title="Account Settings"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>{currentUser.name || currentUser.username}</span>
                </button>
              </>
            )}

            {/* Unauthenticated View */}
            {!currentUser && (
              <Link
                href={loginHref}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-display uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer"
              >
                <User className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Sign In</span>
              </Link>
            )}

          </div>

        </div>
      </header>

      {/* Global Profile Settings Overlay */}
      {currentUser && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          currentUser={currentUser}
          onUserUpdated={(updated) => setCurrentUser(updated)}
        />
      )}
    </>
  );
};
