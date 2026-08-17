import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { CrmNavbar } from '../components/CrmNavbar';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ArrowX Command Center & Order Dispatch Portal',
  description: 'Track real-time order processing, key dispatch telemetry, and admin management for ArrowX.',
  icons: {
    icon: '/assets/logo-green.png',
    shortcut: '/assets/logo-green.png',
    apple: '/assets/logo-green.png',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} dark`}>
      <body className="min-h-screen bg-[#030605] text-slate-100 font-sans relative overflow-x-hidden selection:bg-blue-500/30 selection:text-white">
        
        {/* Dynamic Route-Aware Header */}
        <CrmNavbar />

        {/* Content Body */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Clean Footer with Official Trust Links */}
        <footer className="border-t border-white/5 py-8 text-center text-xs font-mono text-zinc-500 space-y-2">
          <div className="flex items-center justify-center gap-3">
            <a href="https://arrowx.shop" className="text-zinc-400 font-bold hover:text-white transition-colors">
              ArrowX Official Store
            </a>
            <span>·</span>
            <a href="https://arrowx.shop/privacy" className="text-zinc-500 hover:text-zinc-300 transition-colors">
              Privacy Policy
            </a>
            <span>·</span>
            <a href="https://arrowx.shop/terms" className="text-zinc-500 hover:text-zinc-300 transition-colors">
              Terms of Service
            </a>
          </div>
          <div>All Customer Sessions & License Deliveries Encrypted via TLS 1.3</div>
        </footer>

      </body>
    </html>
  );
}
