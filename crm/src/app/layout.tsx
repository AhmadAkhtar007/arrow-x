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

        {/* Clean Footer */}
        <footer className="border-t border-white/5 py-8 text-center text-xs font-mono text-zinc-500 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-zinc-400 font-bold">ArrowX Secure Operations</span>
            <span>·</span>
            <span className="text-zinc-500">app.arrowx.shop</span>
          </div>
          <div>All Transactions & License Keys Encrypted with AES-256</div>
        </footer>

      </body>
    </html>
  );
}
